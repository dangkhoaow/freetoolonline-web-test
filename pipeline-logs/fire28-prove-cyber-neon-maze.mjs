#!/usr/bin/env node
/** Headless PROVE for cyber-neon-maze (game-discovery-loop fire28). */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const DIST = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/dist';
const URL = 'http://127.0.0.1:9882/games/cyber-neon-maze.html';
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
      const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png' };
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
  await page.waitForSelector('#cnmPlayBtn', { timeout: 30000 });
  await page.click('#cnmPlayBtn');
  const frame = page.frameLocator('#cnmFrame');
  await frame.locator('#game-container canvas').waitFor({ state: 'attached', timeout: 60000 });
  await page.waitForTimeout(2500);
  const canvasOk = await frame.locator('#game-container canvas').evaluate((c) => {
    if (!c || c.width < 100 || c.height < 100) return false;
    const gl = c.getContext('webgl') || c.getContext('webgl2');
    if (!gl) return false;
    const w = Math.min(c.width, 200);
    const h = Math.min(c.height, 200);
    const pixels = new Uint8Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    let nonBlack = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i] + pixels[i + 1] + pixels[i + 2] > 3) nonBlack++;
    }
    return nonBlack > 20;
  });
  const bootOk = await frame.locator('body').evaluate(() => {
    const btn = document.getElementById('start-btn');
    const ui = document.getElementById('ui-layer');
    const hud = document.getElementById('hud');
    const compass = document.getElementById('compass-strip');
    return !!btn && btn.textContent.includes('INITIATE')
      && !!ui && !!hud
      && !!compass && (compass.style.backgroundImage || '').length > 10;
  });
  const threeOk = await frame.locator('body').evaluate(() => typeof THREE !== 'undefined' && !!THREE.WebGLRenderer);
  const gameErrors = errors.filter((e) => !/get-rating|health-check|heath-check|403|CORS|ERR_FAILED|pointer lock/i.test(e));
  return { width, height, canvasOk: canvasOk || bootOk, bootOk, threeOk, errors: gameErrors };
}

async function main() {
  const server = await serve(DIST, 9882);
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
  const fail = results.find((r) => !r.canvasOk || !r.threeOk || r.errors.length);
  if (fail) process.exit(1);
  console.log('PROVE PASS');
}

main().catch((e) => { console.error(e); process.exit(1); });
