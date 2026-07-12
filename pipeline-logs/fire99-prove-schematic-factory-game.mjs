#!/usr/bin/env node
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
        if (!existsSync(p)) {
          res.writeHead(404); res.end('404');
          return;
        }
        const ext = extname(p);
        const types = { '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
        res.writeHead(200, { 'Content-Type': types[ext] || 'text/html' });
        res.end(readFileSync(p));
      } catch {
        if (!res.headersSent) { res.writeHead(404); res.end('404'); }
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
const srv = await serve(DIST, 9886);

async function bootGameFrame(page) {
  await page.evaluate(() => { if (typeof doAfterPageRendered === 'function') doAfterPageRendered(); });
  await page.locator('#sfgPlayBtn').click({ force: true });
  await page.waitForFunction(() => {
    return [...document.querySelectorAll('iframe')].some((f) => (f.src || '').includes('schematic-factory-game/index.html'));
  }, { timeout: 90000 });
  await page.waitForTimeout(3000);
  const gameFrame = page.frames().find((f) => f.url().includes('schematic-factory-game/index.html'));
  if (!gameFrame) throw new Error('game iframe missing');
  const skip = gameFrame.locator('.ob-skip');
  if (await skip.count()) await skip.first().click({ force: true }).catch(() => {});
  await gameFrame.waitForSelector('#factory', { timeout: 30000 });
  await gameFrame.waitForTimeout(2000);
  return gameFrame;
}

async function prove(w, h) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setViewportSize({ width: w, height: h });
  await page.goto('http://127.0.0.1:9886/games/schematic-factory-game.html', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(1500);
  const gameFrame = await bootGameFrame(page);
  const factoryOk = await gameFrame.evaluate(() => {
    const f = document.getElementById('factory');
    if (!f) return false;
    return f.querySelectorAll('.slot, .tier, [data-machine]').length > 0 || f.children.length > 0;
  });
  if (!factoryOk) throw new Error('#factory not populated at ' + w);
  const resOk = await gameFrame.evaluate(() => {
    const bar = document.getElementById('res-bar');
    return bar && bar.textContent.trim().length > 0;
  });
  if (!resOk) throw new Error('#res-bar empty at ' + w);
  console.log('PROVE PASS', w + 'x' + h, 'sfgPlayBtn+#factory+#res-bar');
  await page.close();
}

try {
  await prove(390, 844);
  await prove(1440, 900);
  const bad = errors.filter((e) => !/favicon|get-rating|health-check|403|CORS|ERR_FAILED|recaptcha|doubleclick/i.test(e));
  if (bad.length) { console.error('ERRORS', bad); process.exit(1); }
  console.log('fire99 PROVE ALL PASS');
} finally {
  await browser.close();
  srv.close();
}
