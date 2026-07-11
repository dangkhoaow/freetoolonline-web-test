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
        if (!res.headersSent) res.writeHead(200, { 'Content-Type': 'text/html' });
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
const srv = await serve(DIST, 9879);
const page = await browser.newPage();
page.on('pageerror', (e) => errors.push(String(e)));

async function prove(pg, w, h) {
  await pg.setViewportSize({ width: w, height: h });
  await pg.goto('http://127.0.0.1:9879/games/inferno-soul-walker.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pg.waitForTimeout(1500);
  await pg.evaluate(() => { if (typeof doAfterPageRendered === 'function') doAfterPageRendered(); });
  await pg.locator('#iswPlayBtn').click({ force: true, timeout: 15000 });
  await pg.waitForFunction(() => {
    return [...document.querySelectorAll('iframe')].some((f) => (f.src || '').includes('inferno-soul-walker/index.html'));
  }, { timeout: 20000 });
  await pg.waitForTimeout(4000);
  const gameFrame = pg.frames().find((f) => f.url().includes('inferno-soul-walker/index.html'));
  if (!gameFrame) throw new Error('game iframe missing at ' + w);
  await gameFrame.click('body', { position: { x: 200, y: 280 }, force: true }).catch(() => {});
  await gameFrame.evaluate(() => {
    document.body.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', bubbles: true }));
    document.body.dispatchEvent(new KeyboardEvent('keyup', { code: 'Enter', bubbles: true }));
  });
  await pg.waitForTimeout(3000);
  await gameFrame.waitForFunction(() => {
    const list = [...document.querySelectorAll('canvas')];
    return list.some((c) => c.width > 128 && c.height > 128);
  }, { timeout: 90000 });
  const dims = await gameFrame.evaluate(() => {
    const c = [...document.querySelectorAll('canvas')].sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
    return c ? { w: c.width, h: c.height, boxW: c.clientWidth, boxH: c.clientHeight } : null;
  });
  if (!dims || dims.boxW < 50) throw new Error('canvas too small at ' + w + ' ' + JSON.stringify(dims));
  console.log('PASS', w + 'x' + h, 'canvas', dims.boxW + 'x' + dims.boxH, 'buffer', dims.w + 'x' + dims.h);
}

try {
  await prove(page, 390, 844);
  const page2 = await browser.newPage();
  page2.on('pageerror', (e) => errors.push(String(e)));
  await prove(page2, 1440, 900);
  await page2.close();
  const bad = errors.filter((e) => !/favicon|get-rating|health-check|403|CORS|ERR_FAILED|recaptcha|doubleclick/i.test(e));
  if (bad.length) { console.error('ERRORS', bad); process.exit(1); }
  console.log('PROVE PASS inferno-soul-walker iswPlayBtn+canvas');
} finally {
  await browser.close();
  srv.close();
}
