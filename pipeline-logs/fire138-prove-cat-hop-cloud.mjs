#!/usr/bin/env node
/** fire138: Playwright PROVE cat-hop-cloud @390+1440 */
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
const PORT = 8780;
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

async function canvasNonBlack(frame, selector) {
  return frame.locator(selector).first().evaluate((c) => {
    if (!c || c.width < 50 || c.height < 50) return { ok: false, reason: 'canvas too small', w: c?.width, h: c?.height };
    const ctx = c.getContext('2d');
    if (!ctx) return { ok: false, reason: 'no ctx' };
    const sw = Math.min(48, c.width);
    const sh = Math.min(48, c.height);
    const regions = [
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
    return { ok: visible > 50, visible, w: c.width, h: c.height };
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
  await page.goto(`http://127.0.0.1:${PORT}/games/cat-hop-cloud.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#chcPlayBtn', { timeout: 30000 });
  await page.evaluate(() => { if (typeof doAfterPageRendered === 'function') doAfterPageRendered(); });
  await page.click('#chcPlayBtn');
  await page.waitForSelector('#chcFrame', { timeout: 30000 });
  const frame = page.frameLocator('#chcFrame');
  await frame.locator('#levelGrid button').first().click({ timeout: 30000 });
  await page.waitForTimeout(800);
  await frame.locator('body').press('1');
  await page.waitForTimeout(600);
  const canvasCheck = await canvasNonBlack(frame, '#c');
  const dims = await frame.locator('#c').evaluate((c) => ({ w: c.width, h: c.height }));
  await browser.close();
  return {
    viewport,
    canvasCheck,
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
const fail = results.some((r) => !r.canvasCheck.ok || r.errors.length || r.dims.w !== 800 || r.dims.h !== 600);
console.log(JSON.stringify({ ok: !fail, results }, null, 2));
process.exit(fail ? 1 : 0);
