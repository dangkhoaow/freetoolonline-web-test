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
        const ext = extname(p);
        const types = { '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
        res.writeHead(200, { 'Content-Type': types[ext] || 'text/html' });
        res.end(readFileSync(p));
      } catch {
        res.writeHead(404); res.end('404');
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
const srv = await serve(DIST, 9880);

async function prove(w, h) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setViewportSize({ width: w, height: h });
  await page.goto('http://127.0.0.1:9880/games/sketch-turf-battle.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => { if (typeof doAfterPageRendered === 'function') doAfterPageRendered(); });
  await page.locator('#stbPlayBtn').click({ force: true });
  await page.waitForFunction(() => {
    return [...document.querySelectorAll('iframe')].some((f) => (f.src || '').includes('sketch-turf-battle/index.html'));
  }, { timeout: 30000 });
  await page.waitForTimeout(2000);
  const gameFrame = page.frames().find((f) => f.url().includes('sketch-turf-battle/index.html'));
  if (!gameFrame) throw new Error('game iframe missing at ' + w);
  await gameFrame.waitForSelector('#screen-title', { timeout: 20000 });
  await gameFrame.waitForSelector('canvas#game', { timeout: 20000 });
  await gameFrame.locator('#play-btn').click({ force: true });
  await gameFrame.waitForTimeout(1000);
  const canvasOk = await gameFrame.evaluate(() => {
    const c = document.getElementById('game');
    if (!c) return false;
    const ctx = c.getContext('2d');
    if (!ctx) return false;
    const img = ctx.getImageData(0, 0, Math.min(32, c.width), Math.min(32, c.height));
    return img.data.some((v, i) => i % 4 !== 3 && v !== 0);
  });
  if (!canvasOk) throw new Error('canvas not rendering at ' + w);
  console.log('PASS', w + 'x' + h, 'stbPlayBtn+#play-btn+canvas#game');
  await page.close();
}

try {
  await prove(390, 844);
  await prove(1440, 900);
  const bad = errors.filter((e) => !/favicon|get-rating|health-check|403|CORS|ERR_FAILED|recaptcha|doubleclick/i.test(e));
  if (bad.length) { console.error('ERRORS', bad); process.exit(1); }
  console.log('PROVE PASS sketch-turf-battle stbPlayBtn+canvas');
} finally {
  await browser.close();
  srv.close();
}
