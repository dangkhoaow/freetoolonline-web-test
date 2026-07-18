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
const PORT = 8779;
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

async function canvasNonBlack(frame, selector, opts = {}) {
  return frame.locator(selector).first().evaluate((c, opts) => {
    if (!c || c.width < 50 || c.height < 50) return { ok: false, reason: 'canvas too small', w: c?.width, h: c?.height };
    const ctx = c.getContext('2d');
    if (!ctx) return { ok: false, reason: 'no ctx' };
    const sw = Math.min(48, c.width);
    const sh = Math.min(48, c.height);
    const regions = opts.buttonBand
      ? [[Math.floor(c.width * 0.2), Math.max(0, c.height - sh - 8)]]
      : [
          [0, 0],
          [Math.max(0, c.width - sw), 0],
          [0, Math.max(0, c.height - sh)],
          [Math.max(0, Math.floor((c.width - sw) / 2)), Math.max(0, Math.floor((c.height - sh) / 2))],
        ];
    let visible = 0;
    for (const [sx, sy] of regions) {
      const d = ctx.getImageData(sx, sy, sw, sh).data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 0 && (d[i] > 10 || d[i + 1] > 10 || d[i + 2] > 10)) visible++;
      }
    }
    return { ok: visible > 50, visible, w: c.width, h: c.height, mode: opts.buttonBand ? 'buttonBand' : 'multi' };
  }, opts);
}

async function prove(viewport) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://127.0.0.1:${PORT}/games/mystic-card-paw.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#mcpPlayBtn', { timeout: 30000 });
  await page.evaluate(() => { if (typeof doAfterPageRendered === 'function') doAfterPageRendered(); });
  await page.click('#mcpPlayBtn');
  await page.waitForSelector('#mcpFrame', { timeout: 30000 });
  const frame = page.frameLocator('#mcpFrame');
  await frame.locator('#canvas-main, canvas').first().waitFor({ timeout: 30000 });
  await page.waitForTimeout(1500);
  await frame.locator('#canvas-main').click({ force: true, position: { x: 128, y: 120 } });
  await page.waitForTimeout(2500);
  await frame.locator('#canvas-main').click({ force: true, position: { x: 128, y: 200 } });
  await page.waitForTimeout(1000);
  const mainCheck = await canvasNonBlack(frame, '#canvas-main');
  const auxCheck = await canvasNonBlack(frame, '#canvas-aux', { buttonBand: true });
  const dims = await frame.locator('#canvas-main').evaluate((c) => ({ main: { w: c.width, h: c.height }, aux: { w: document.getElementById('canvas-aux')?.width, h: document.getElementById('canvas-aux')?.height } }));
  await browser.close();
  return {
    viewport,
    mainCheck,
    auxCheck,
    dims,
    errors: errors.filter((e) => !NOISE.test(e)),
  };
}

const server = serve();
const results = [];
for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  results.push(await prove(vp));
}
server.close();
const fail = results.some((r) => !r.mainCheck.ok || !r.auxCheck.ok || r.errors.length || r.dims.main.w !== 256 || r.dims.main.h !== 240);
console.log(JSON.stringify({ ok: !fail, results }, null, 2));
process.exit(fail ? 1 : 0);
