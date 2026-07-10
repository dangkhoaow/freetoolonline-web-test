#!/usr/bin/env node
/** Headless PROVE for neural-particle-life (game-discovery-loop fire32). */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const DIST = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/dist';
const URL = 'http://127.0.0.1:9883/games/neural-particle-life.html';
const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];

function serve(root, port) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const rel = decodeURIComponent(req.url.split('?')[0]);
      let p = path.join(root, rel);
      if (!fs.existsSync(p) || !fs.statSync(p).isFile()) {
        p = path.join(root, 'index.html');
      }
      const ext = path.extname(p);
      const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };
      res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(res);
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function proveViewport(page, width, height) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.setViewportSize({ width, height });
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForSelector('#nplPlayBtn', { timeout: 30000 });
  await page.click('#nplPlayBtn');
  const frame = page.frameLocator('#nplFrame');
  await frame.locator('input[value="Start"]').waitFor({ state: 'visible', timeout: 30000 });
  await frame.locator('input[value="Start"]').click();
  await frame.locator('canvas#c0').waitFor({ state: 'attached', timeout: 30000 });
  await page.waitForTimeout(2000);
  const canvasOk = await frame.locator('canvas#c0').evaluate((c) => {
    if (!c || c.width < 50 || c.height < 50) return false;
    const ctx = c.getContext('2d');
    if (!ctx) return false;
    const d = ctx.getImageData(0, 0, Math.min(c.width, 200), Math.min(c.height, 200)).data;
    let nonBlack = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] + d[i + 1] + d[i + 2] > 8) nonBlack++;
    }
    return nonBlack > 50;
  });
  const gameErrors = errors.filter((e) => !/get-rating|health-check|heath-check|403|CORS|ERR_FAILED/i.test(e));
  return { width, height, canvasOk, errors: gameErrors };
}

async function main() {
  const server = await serve(DIST, 9883);
  const browser = await chromium.launch({ headless: true, args: ARGS });
  const results = [];
  try {
    for (const [w, h] of [[844, 390], [1440, 900]]) {
      const page = await browser.newPage();
      results.push(await proveViewport(page, w, h));
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(JSON.stringify(results, null, 2));
  const fail = results.find((r) => !r.canvasOk || r.errors.length);
  if (fail) process.exit(1);
  console.log('PROVE PASS');
}

main().catch((e) => { console.error(e); process.exit(1); });
