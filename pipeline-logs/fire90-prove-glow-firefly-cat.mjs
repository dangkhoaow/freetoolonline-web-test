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
      if (!existsSync(p) && !extname(p)) { const alt = p + '.html'; if (existsSync(alt)) p = alt; }
      try {
        const ext = extname(p);
        res.writeHead(200, { 'Content-Type': ({ '.js': 'application/javascript' })[ext] || 'text/html' });
        res.end(readFileSync(p));
      } catch { res.writeHead(404); res.end('404'); }
    });
    srv.listen(port, () => resolve(srv));
  });
}

const errors = [];
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const srv = await serve(DIST, 9881);

async function prove(w, h) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setViewportSize({ width: w, height: h });
  await page.goto('http://127.0.0.1:9881/games/glow-firefly-cat.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => { if (typeof doAfterPageRendered === 'function') doAfterPageRendered(); });
  await page.locator('#gfcPlayBtn').click({ force: true });
  await page.waitForFunction(() => [...document.querySelectorAll('iframe')].some((f) => (f.src || '').includes('glow-firefly-cat/index.html')), { timeout: 30000 });
  await page.waitForTimeout(2000);
  const gameFrame = page.frames().find((f) => f.url().includes('glow-firefly-cat/index.html'));
  if (!gameFrame) throw new Error('iframe missing at ' + w);
  await gameFrame.waitForSelector('canvas#c', { timeout: 20000 });
  await gameFrame.locator('canvas#c').click({ force: true });
  await gameFrame.waitForTimeout(1500);
  const canvasOk = await gameFrame.evaluate(() => {
    const c = document.getElementById('c');
    if (!c) return false;
    const ctx = c.getContext('2d');
    const img = ctx.getImageData(0, 0, Math.min(64, c.width), Math.min(64, c.height));
    return img.data.some((v, i) => i % 4 !== 3 && v > 10);
  });
  if (!canvasOk) throw new Error('canvas not rendering at ' + w);
  console.log('PASS', w + 'x' + h, 'gfcPlayBtn+canvas#c');
  await page.close();
}

try {
  await prove(390, 844);
  await prove(1440, 900);
  const bad = errors.filter((e) => !/favicon|get-rating|health-check|403|CORS|ERR_FAILED|recaptcha|doubleclick/i.test(e));
  if (bad.length) { console.error('ERRORS', bad); process.exit(1); }
  console.log('PROVE PASS glow-firefly-cat gfcPlayBtn+canvas');
} finally {
  await browser.close();
  srv.close();
}
