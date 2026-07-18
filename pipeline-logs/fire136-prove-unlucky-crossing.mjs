#!/usr/bin/env node
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(join(fileURLToPath(import.meta.url), '..', '..', 'package.json'));
require.resolve('playwright');

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const DIST = join(ROOT, 'dist');
const PORT = 8778;
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };

const NOISE = /ResizeObserver|favicon|get-rating|health-check|403|CORS|pointerlock|pointer lock|requestPointerLock|ERR_FAILED|net::ERR/i;

function serve() {
  return createServer((req, res) => {
    let p = (req.url || '/').split('?')[0];
    if (p.endsWith('/')) p += 'index.html';
    const file = join(DIST, p.replace(/^\//, ''));
    if (!existsSync(file)) { res.writeHead(404); res.end('missing ' + p); return; }
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
  }).listen(PORT);
}

async function canvasNonBlack(frame) {
  return frame.locator('canvas#game, canvas').first().evaluate((c) => {
    if (!c || c.width < 50 || c.height < 50) return { ok: false, reason: 'canvas too small' };
    const ctx = c.getContext('2d');
    if (!ctx) return { ok: false, reason: 'no ctx' };
    const sw = Math.min(48, c.width);
    const sh = Math.min(48, c.height);
    const regions = [
      [0, 0],
      [Math.max(0, c.width - sw), 0],
      [0, Math.max(0, c.height - sh)],
      [Math.max(0, Math.floor((c.width - sw) / 2)), Math.max(0, Math.floor((c.height - sh) / 2))],
      [Math.max(0, c.width - sw), Math.max(0, c.height - sh)],
    ];
    let nonBlack = 0;
    for (const [sx, sy] of regions) {
      const d = ctx.getImageData(sx, sy, sw, sh).data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > 10 || d[i + 1] > 10 || d[i + 2] > 10) nonBlack++;
      }
    }
    return { ok: nonBlack > 50, nonBlack, w: c.width, h: c.height, mode: '2d', sample: 'multi' };
  });
}

async function prove(viewport) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://127.0.0.1:${PORT}/games/unlucky-crossing.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#ucxPlayBtn', { timeout: 30000 });
  await page.evaluate(() => { if (typeof doAfterPageRendered === 'function') doAfterPageRendered(); });
  await page.click('#ucxPlayBtn');
  await page.waitForSelector('#ucxFrame', { timeout: 30000 });
  const frame = page.frameLocator('#ucxFrame');
  await frame.locator('#s, canvas#game').first().waitFor({ timeout: 30000 });
  await frame.locator('#s').click();
  await frame.locator('#start-menu').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(500);
  await frame.locator('canvas#game').click({ force: true });
  for (let i = 0; i < 5; i++) {
    await frame.locator('canvas#game').press('ArrowUp').catch(() => page.keyboard.press('ArrowUp'));
    await page.waitForTimeout(350);
  }
  await page.waitForTimeout(1000);
  const pixelCheck = await canvasNonBlack(frame);
  await browser.close();
  return {
    viewport,
    pixelCheck,
    errors: errors.filter((e) => !NOISE.test(e)),
  };
}

const server = serve();
const results = [];
for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  results.push(await prove(vp));
}
server.close();
const fail = results.some((r) => !r.pixelCheck.ok || r.errors.length);
console.log(JSON.stringify({ ok: !fail, results }, null, 2));
process.exit(fail ? 1 : 0);
