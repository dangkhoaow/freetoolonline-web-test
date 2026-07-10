#!/usr/bin/env node
/** Headless PROVE for neon-surge-loop (game-discovery-loop fire35). */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const DIST = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/dist';
const URL = 'http://127.0.0.1:9878/games/neon-surge-loop.html';
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
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.setViewportSize({ width, height });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#nslPlayBtn');
  await page.click('#nslPlayBtn');
  await page.waitForSelector('#nslFrame');
  const frame = page.frameLocator('#nslFrame');
  await frame.locator('#start-btn').click({ force: true });
  await frame.locator('canvas#gameCanvas').waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(800);
  await frame.locator('canvas#gameCanvas').evaluate((c) => {
    const rect = c.getBoundingClientRect();
    const ev = new MouseEvent('mousemove', { clientX: rect.left + rect.width / 2 + 40, clientY: rect.top + rect.height / 2, bubbles: true });
    c.dispatchEvent(ev);
  });
  await page.waitForTimeout(1200);
  const canvasOk = await frame.locator('canvas#gameCanvas').evaluate((c) => {
    const ctx = c.getContext('2d');
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let nonBlack = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] > 30) nonBlack++;
    return nonBlack > 500;
  });
  const gameErrors = errors.filter((e) => !/get-rating|health-check|heath-check|403|CORS|ERR_FAILED/i.test(e));
  return { width, height, canvasOk, gameErrors };
}

const server = await serve(DIST, 9878);
const browser = await chromium.launch({ headless: true, args: ARGS });
try {
  const results = [];
  for (const vp of [[390, 844], [1440, 900]]) {
    const page = await browser.newPage();
    results.push(await proveViewport(page, vp[0], vp[1]));
    await page.close();
  }
  console.log(JSON.stringify({ pass: results.every((r) => r.canvasOk && r.gameErrors.length === 0), results }, null, 2));
  if (!results.every((r) => r.canvasOk && r.gameErrors.length === 0)) process.exit(1);
} finally {
  await browser.close();
  server.close();
}
