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
        const types = {
          '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png',
          '.svg': 'image/svg+xml', '.json': 'application/json',
        };
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
const srv = await serve(DIST, 9881);

async function bootGameFrame(page) {
  await page.evaluate(() => { if (typeof doAfterPageRendered === 'function') doAfterPageRendered(); });
  await page.locator('#nsbPlayBtn').click({ force: true });
  await page.waitForFunction(() => {
    return [...document.querySelectorAll('iframe')].some((f) => (f.src || '').includes('nova-star-barrage/index.html'));
  }, { timeout: 60000 });
  await page.waitForTimeout(3000);
  const gameFrame = page.frames().find((f) => f.url().includes('nova-star-barrage/index.html'));
  if (!gameFrame) throw new Error('game iframe missing');
  await gameFrame.waitForSelector('#btn-start', { timeout: 60000 });
  await gameFrame.locator('#btn-start').click({ force: true });
  await gameFrame.waitForSelector('#character-select .character-card', { timeout: 30000 });
  await gameFrame.evaluate(() => document.querySelector('#character-select .character-card')?.click());
  await gameFrame.waitForSelector('#char-select .char-card', { timeout: 30000 });
  await gameFrame.evaluate(() => document.querySelector('#char-select .char-card')?.click());
  await gameFrame.waitForSelector('#btn-talent-confirm', { timeout: 30000 });
  await gameFrame.evaluate(() => document.getElementById('btn-talent-confirm')?.click());
  await gameFrame.waitForSelector('#loadout-screen button.menu-btn', { timeout: 30000 });
  await gameFrame.evaluate(() => document.querySelector('#loadout-screen button.menu-btn')?.click());
  await gameFrame.waitForTimeout(4000);
  return gameFrame;
}

async function prove(w, h) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setViewportSize({ width: w, height: h });
  await page.goto('http://127.0.0.1:9881/games/nova-star-barrage.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1500);
  const gameFrame = await bootGameFrame(page);
  const canvasOk = await gameFrame.evaluate(() => {
    const c = document.getElementById('game-canvas');
    if (!c) return false;
    const ctx = c.getContext('2d');
    if (!ctx) return false;
    const img = ctx.getImageData(0, 0, Math.min(64, c.width), Math.min(64, c.height));
    return img.data.some((v, i) => i % 4 !== 3 && v > 10);
  });
  if (!canvasOk) throw new Error('canvas#game-canvas not rendering at ' + w);
  console.log('PROVE PASS', w + 'x' + h, 'nsbPlayBtn+canvas#game-canvas');
  await page.close();
}

try {
  await prove(390, 844);
  await prove(1440, 900);
  const bad = errors.filter((e) => !/favicon|get-rating|health-check|403|CORS|ERR_FAILED|recaptcha|doubleclick/i.test(e));
  if (bad.length) { console.error('ERRORS', bad); process.exit(1); }
  console.log('fire92 PROVE ALL PASS');
} finally {
  await browser.close();
  srv.close();
}
