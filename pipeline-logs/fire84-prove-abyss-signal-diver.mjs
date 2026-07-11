#!/usr/bin/env node
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
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
      if (!existsSync(p) || statSync(p).isDirectory()) {
        if (!res.headersSent) { res.writeHead(404); res.end('404'); }
        return;
      }
      try {
        const ext = extname(p);
        const types = { '.js': 'application/javascript', '.css': 'text/css', '.xbin': 'application/octet-stream' };
        if (!res.headersSent) res.writeHead(200, { 'Content-Type': types[ext] || 'text/html' });
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
const srv = await serve(DIST, 9878);
const page = await browser.newPage();
page.on('pageerror', (e) => errors.push(String(e)));

async function prove(w, h) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto('http://127.0.0.1:9878/games/abyss-signal-diver.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => { if (typeof doAfterPageRendered === 'function') doAfterPageRendered(); });
  await page.locator('#asdPlayBtn').click({ force: true, timeout: 15000 });
  await page.waitForFunction(() => {
    return [...document.querySelectorAll('iframe')].some((f) => (f.src || '').includes('abyss-signal-diver/index.html'));
  }, { timeout: 20000 });
  await page.waitForTimeout(3000);
  const gameFrame = page.frames().find((f) => f.url().includes('abyss-signal-diver/index.html'));
  if (!gameFrame) throw new Error('game iframe missing at ' + w);
  await gameFrame.waitForFunction(() => {
    const c = document.querySelector('canvas#C');
    return c && c.width > 50 && c.height > 50;
  }, { timeout: 60000 });
  await gameFrame.waitForFunction(() => {
    const div = document.getElementById('DIV');
    return div && !/Generating WORLD/i.test(div.innerText || '');
  }, { timeout: 90000 });
  const box = await gameFrame.locator('canvas#C').boundingBox();
  if (!box || box.width < 50) throw new Error('canvas too small at ' + w);
  console.log('PASS', w + 'x' + h, 'canvas#C', Math.round(box.width) + 'x' + Math.round(box.height));
}

try {
  await prove(390, 844);
  await prove(1440, 900);
  const bad = errors.filter((e) => !/favicon|get-rating|health-check|403|CORS|ERR_FAILED|recaptcha|doubleclick/i.test(e));
  if (bad.length) { console.error('ERRORS', bad); process.exit(1); }
  console.log('PROVE PASS abyss-signal-diver asdPlayBtn+canvas#C');
} finally {
  await browser.close();
  srv.close();
}
