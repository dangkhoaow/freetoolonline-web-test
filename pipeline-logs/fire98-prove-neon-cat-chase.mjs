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
        const types = { '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png' };
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
const srv = await serve(DIST, 9885);

async function bootGameFrame(page) {
  await page.evaluate(() => { if (typeof doAfterPageRendered === 'function') doAfterPageRendered(); });
  await page.locator('#nccPlayBtn').click({ force: true });
  await page.waitForFunction(() => {
    return [...document.querySelectorAll('iframe')].some((f) => (f.src || '').includes('neon-cat-chase/index.html'));
  }, { timeout: 60000 });
  await page.waitForTimeout(2000);
  const gameFrame = page.frames().find((f) => f.url().includes('neon-cat-chase/index.html'));
  if (!gameFrame) throw new Error('game iframe missing');
  await gameFrame.waitForSelector('canvas#c', { timeout: 20000 });
  await gameFrame.locator('canvas#c').click({ force: true });
  await page.keyboard.press('Space');
  await gameFrame.waitForTimeout(2000);
  return gameFrame;
}

async function prove(w, h) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setViewportSize({ width: w, height: h });
  await page.goto('http://127.0.0.1:9885/games/neon-cat-chase.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1500);
  const gameFrame = await bootGameFrame(page);
  const canvasOk = await gameFrame.evaluate(() => {
    const c = document.getElementById('c');
    if (!c) return false;
    const ctx = c.getContext('2d');
    if (!ctx) return false;
    const img = ctx.getImageData(0, 0, c.width, c.height);
    let nonBlack = 0;
    for (let i = 0; i < img.data.length; i += 4) {
      if (img.data[i] > 5 || img.data[i + 1] > 5 || img.data[i + 2] > 5) nonBlack++;
    }
    return nonBlack > 50;
  });
  if (!canvasOk) throw new Error('canvas#c not rendering at ' + w);
  console.log('PROVE PASS', w + 'x' + h, 'nccPlayBtn+canvas#c');
  await page.close();
}

try {
  await prove(390, 844);
  await prove(1440, 900);
  const bad = errors.filter((e) => !/favicon|get-rating|health-check|403|CORS|ERR_FAILED|recaptcha|doubleclick/i.test(e));
  if (bad.length) { console.error('ERRORS', bad); process.exit(1); }
  console.log('fire98 PROVE ALL PASS');
} finally {
  await browser.close();
  srv.close();
}
