#!/usr/bin/env node
/** PROVE andromeda-star-shooter (fire46). */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const DIST = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/dist';
const URL = 'http://127.0.0.1:9880/games/andromeda-star-shooter.html';
const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];

function serve(root, port) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const rel = decodeURIComponent(req.url.split('?')[0]);
      let p = path.join(root, rel);
      if (!fs.existsSync(p) || !fs.statSync(p).isFile()) p = path.join(root, 'index.html');
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
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#amsPlayBtn');
  await page.click('#amsPlayBtn');
  const frame = page.frameLocator('#amsFrame');
  await frame.locator('#pause').click({ force: true });
  await frame.locator('canvas#canvas').waitFor({ timeout: 15000 });
  await page.waitForTimeout(1200);
  const canvasOk = await frame.locator('canvas#canvas').evaluate((c) => {
    const ctx = c.getContext('2d');
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] > 30) n++;
    return n > 200;
  });
  const gameErrors = errors.filter((e) => !/get-rating|health-check|403|CORS|ERR_FAILED/i.test(e));
  return { width, height, canvasOk, gameErrors };
}

const server = await serve(DIST, 9880);
const browser = await chromium.launch({ headless: true, args: ARGS });
try {
  const results = [];
  for (const vp of [[390, 844], [1440, 900]]) {
    const page = await browser.newPage();
    results.push(await proveViewport(page, vp[0], vp[1]));
    await page.close();
  }
  const pass = results.every((r) => r.canvasOk && r.gameErrors.length === 0);
  console.log(JSON.stringify({ pass, results }, null, 2));
  if (!pass) process.exit(1);
} finally {
  await browser.close();
  server.close();
}
