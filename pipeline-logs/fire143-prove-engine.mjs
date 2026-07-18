#!/usr/bin/env node
/** fire143: quick standalone engine smoke test for boing-cat-platformer
 * (serves ONLY the vendored engine dir, no full site export - fast
 * pre-check before investing in the CMS/route/guide bundle). */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ENGINE_DIR = join(ROOT, 'source/web/src/main/webapp/static/games/boing-cat-platformer');

const mime = { '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript', '.json': 'application/json', '.png': 'image/png' };
const PORT = 9200 + Math.floor(Math.random() * 300);

const server = createServer((req, res) => {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === '/') url = '/index.html';
  const file = join(ENGINE_DIR, url);
  if (!file.startsWith(ENGINE_DIR) || !existsSync(file)) {
    res.writeHead(404);
    res.end('missing: ' + url);
    return;
  }
  res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
console.log('engine smoke server', PORT, ENGINE_DIR);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
const errors = [];
const requestFails = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('requestfailed', (r) => requestFails.push(r.url() + ' :: ' + (r.failure()?.errorText || '')));

await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'load', timeout: 30000 });
await page.waitForTimeout(800); // let onload img handlers + first frame run
const canvasInfo = await page.locator('#gameCanvas').evaluate((c) => ({ w: c.width, h: c.height }));

// Press Space to start, let a few frames run (auto-run + first jump input).
await page.keyboard.press('Space');
await page.waitForTimeout(600);
await page.keyboard.press('Space'); // jump once
await page.waitForTimeout(900);

const paint = await page.locator('#gameCanvas').evaluate((c) => {
  const ctx = c.getContext('2d');
  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  let nonBlack = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] + data[i + 1] + data[i + 2] > 30) nonBlack++;
  }
  return { nonBlack, total: data.length / 4 };
});

await browser.close();
server.close();

console.log('canvas', JSON.stringify(canvasInfo));
console.log('paint', JSON.stringify(paint));
console.log('requestFails', JSON.stringify(requestFails));
console.log('errors', JSON.stringify(errors));

const ok = canvasInfo.w === 640 && canvasInfo.h === 480 && paint.nonBlack > 1000 && requestFails.length === 0 && errors.length === 0;
console.log(ok ? 'ENGINE_PROVE_PASS' : 'ENGINE_PROVE_FAIL');
process.exit(ok ? 0 : 1);
