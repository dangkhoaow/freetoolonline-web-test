// One-off PROVE script for /space-3d/binary-star-system.html (space-3d-discovery-loop fire33).
// Mirrors qa-e2e-test/scripts/run-games-smoke.mjs's nonBlackRatio pattern.
// Exit 0 = canvas renders + facts panel fills + zero scene-origin console errors, at 390 + 1440.

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const require = createRequire(path.join(__dirname, 'package.json'));
const { chromium } = require('playwright');

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.txt': 'text/plain' };
const server = http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const body = await readFile(path.join(DIST, p));
    res.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('nf'); }
});
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

async function nonBlackRatio(page, selector) {
  const el = page.locator(selector).first();
  let buf;
  try { buf = await el.screenshot({ timeout: 10000 }); }
  catch { return -1; }
  const dataUrl = 'data:image/png;base64,' + buf.toString('base64');
  return page.evaluate((src) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const s = document.createElement('canvas');
      s.width = 64; s.height = 64;
      const g = s.getContext('2d');
      g.drawImage(img, 0, 0, 64, 64);
      const d = g.getImageData(0, 0, 64, 64).data;
      let lit = 0;
      for (let i = 0; i < d.length; i += 4) { if (d[i] + d[i + 1] + d[i + 2] > 30) lit++; }
      resolve(lit / (d.length / 4));
    };
    img.onerror = () => resolve(-1);
    img.src = src;
  }), dataUrl);
}

let allOk = true;
const results = [];
for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errors = [];
  // Scene-origin errors only: ignore analytics/rating/health-check calls to
  // freetool.online services that fail in this sandboxed localhost context
  // but have no bearing on the WebGL scene (same failure mode a real adblock
  // extension would produce; not a scene defect).
  const IGNORE = /analytics\.google\.com|service\.freetool\.online|downloader\.freetool\.online/;
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error' && !IGNORE.test(m.text())) errors.push(m.text());
  });
  await page.goto(`${origin}/space-3d/binary-star-system.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#t3dCanvasHost canvas', { timeout: 45000 });
  await page.waitForTimeout(1800);
  const ratio = await nonBlackRatio(page, '#t3dCanvasHost canvas');
  const info = await page.textContent('#t3dInfoPanel');
  const infoLen = (info || '').length;
  const renderOk = ratio > 0.01;
  const infoOk = infoLen > 120;
  const noErrors = errors.length === 0;
  results.push({ vp: viewport.width, ratio, infoLen, errors });
  console.log(`vp=${viewport.width} nonBlack=${ratio.toFixed(3)} infoLen=${infoLen} errors=${errors.length}`);
  if (errors.length) console.log('  console/page errors:', JSON.stringify(errors).slice(0, 500));
  if (!renderOk || !infoOk || !noErrors) allOk = false;
  await page.close();
}
await browser.close();
server.close();
console.log(allOk ? 'PROVE PASS' : 'PROVE FAIL');
process.exit(allOk ? 0 : 1);
