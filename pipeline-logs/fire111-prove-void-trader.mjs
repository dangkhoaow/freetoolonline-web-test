#!/usr/bin/env node
/**
 * Headless PROVE for /games/void-trader.html
 * Play -> iframe injects -> in-frame LAUNCH -> canvas#game renders non-black pixels
 * at 390 + 1440. Zero game-origin console/page errors.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '../..');
const DIST = join(ROOT, 'dist');

function serve(root, port) {
  return new Promise((resolve) => {
    const srv = createServer((req, res) => {
      let url = (req.url || '/').split('?')[0];
      let p = join(root, url.replace(/^\//, ''));
      if (!existsSync(p) && !extname(p)) {
        const alt = p + '.html';
        if (existsSync(alt)) p = alt;
      }
      try {
        const ext = extname(p);
        res.writeHead(200, {
          'Content-Type': ({ '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' })[ext] || 'text/html',
        });
        res.end(readFileSync(p));
      } catch {
        res.writeHead(404);
        res.end('404');
      }
    });
    srv.listen(port, () => resolve(srv));
  });
}

const errors = [];
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const srv = await serve(DIST, 9891);

async function prove(w, h) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(`[page ${w}] ${e}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[console ${w}] ${msg.text()}`);
  });
  await page.setViewportSize({ width: w, height: h });
  await page.goto('http://127.0.0.1:9891/games/void-trader.html', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    if (typeof doAfterPageRendered === 'function') doAfterPageRendered();
  });
  await page.locator('#vtPlayBtn').click({ force: true });
  await page.waitForFunction(
    () => [...document.querySelectorAll('iframe')].some((f) => (f.src || '').includes('void-trader/index.html')),
    { timeout: 30000 },
  );
  await page.waitForTimeout(1500);
  const gameFrame = page.frames().find((f) => f.url().includes('void-trader/index.html'));
  if (!gameFrame) throw new Error('iframe missing at ' + w);

  // In-game menu: click LAUNCH (or call startGame()).
  await gameFrame.waitForSelector('#menu-overlay .menu-btn, canvas#game', { timeout: 20000 });
  const launched = await gameFrame.evaluate(() => {
    if (typeof startGame === 'function') {
      startGame();
      return 'startGame()';
    }
    const btn = document.querySelector('#menu-overlay .menu-btn');
    if (btn) {
      btn.click();
      return 'btn.click';
    }
    return null;
  });
  if (!launched) throw new Error('could not launch in-game at ' + w);
  await gameFrame.waitForTimeout(2000);

  const canvasOk = await gameFrame.evaluate(() => {
    const c = document.getElementById('game');
    if (!c) return { ok: false, reason: 'no canvas#game' };
    // Game uses 2d context; sample a center band for non-black pixels.
    const ctx = c.getContext('2d');
    if (!ctx) return { ok: false, reason: 'no 2d context' };
    const w = Math.min(128, c.width || 0);
    const h = Math.min(128, c.height || 0);
    if (w < 8 || h < 8) return { ok: false, reason: 'canvas too small ' + c.width + 'x' + c.height };
    const img = ctx.getImageData(0, 0, w, h);
    let lit = 0;
    for (let i = 0; i < img.data.length; i += 4) {
      if (img.data[i] > 8 || img.data[i + 1] > 8 || img.data[i + 2] > 8) lit++;
    }
    return { ok: lit > 20, lit, w: c.width, h: c.height };
  });
  if (!canvasOk.ok) throw new Error('canvas not rendering at ' + w + ': ' + JSON.stringify(canvasOk));
  console.log('PASS', w + 'x' + h, 'vtPlayBtn+canvas#game lit=' + canvasOk.lit, 'size=' + canvasOk.w + 'x' + canvasOk.h);
  await page.close();
}

try {
  await prove(390, 844);
  await prove(1440, 900);
  const bad = errors.filter(
    (e) => !/favicon|get-rating|health-check|403|CORS|ERR_FAILED|recaptcha|doubleclick|Failed to load resource/i.test(e),
  );
  if (bad.length) {
    console.error('ERRORS', bad);
    process.exit(1);
  }
  console.log('PROVE PASS void-trader vtPlayBtn+canvas#game @390+1440');
} finally {
  await browser.close();
  srv.close();
}
