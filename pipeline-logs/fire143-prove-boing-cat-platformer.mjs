#!/usr/bin/env node
/** fire143: headless PROVE boing-cat-platformer @390 + 1440 (full site dist) */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PAGE = '/games/boing-cat-platformer.html';
const results = [];

async function prove(vp) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const page = await browser.newPage({ viewport: vp });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.goto(`http://127.0.0.1:${PORT}${PAGE}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForSelector('#bcpPlayBtn', { timeout: 30000 });
  await page.click('#bcpPlayBtn');
  await page.waitForSelector('#bcpFrame', { timeout: 30000 });
  const frame = page.frameLocator('#bcpFrame');
  await frame.locator('#gameCanvas').waitFor({ state: 'visible', timeout: 30000 });
  await page.waitForTimeout(500);
  // press Space inside the frame to start + jump once
  await frame.locator('#gameCanvas').click({ trial: false, timeout: 5000 }).catch(() => {});
  await page.keyboard.press('Space');
  await page.waitForTimeout(600);
  await page.keyboard.press('Space');
  await page.waitForTimeout(900);
  const paint = await frame.locator('#gameCanvas').evaluate((c) => {
    const ctx = c.getContext('2d');
    if (!ctx) return { ok: false, reason: 'no2d' };
    const w = c.width || 0;
    const h = c.height || 0;
    if (w < 50 || h < 50) return { ok: false, reason: 'small', w, h };
    const data = ctx.getImageData(0, 0, Math.min(w, 64), Math.min(h, 64)).data;
    let nonBlack = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] + data[i + 1] + data[i + 2] > 30) nonBlack++;
    }
    return { ok: nonBlack > 10, nonBlack, w, h };
  });
  const gameErrors = errors.filter((e) => !/get-rating|403|adsbygoogle|favicon|heath-check|downloader\.freetool|CORS policy|net::ERR_FAILED/i.test(e));
  const ok = paint.ok && gameErrors.length === 0;
  results.push({ vp, ok, paint, gameErrors: gameErrors.slice(0, 8) });
  await browser.close();
  return ok;
}

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
};

const PORT = 8765 + Math.floor(Math.random() * 200);
if (!existsSync(join(DIST, 'games/boing-cat-platformer.html'))) {
  console.log('dist page missing - running export-site (long)...');
  const r = spawnSync('node', ['scripts/export-site.mjs'], { cwd: ROOT, encoding: 'utf8', timeout: 7200000 });
  console.log('export exit', r.status);
  if (r.status !== 0) {
    console.error((r.stderr || r.stdout || '').slice(-800));
    process.exit(2);
  }
}

const server = createServer((req, res) => {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url.endsWith('/')) url += 'index.html';
  const file = join(DIST, url);
  if (!file.startsWith(DIST) || !existsSync(file)) {
    res.writeHead(404);
    res.end('missing');
    return;
  }
  res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});

await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
console.log('prove server', PORT);

let allOk = true;
for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  const ok = await prove(vp);
  console.log('vp', vp.width, ok ? 'PASS' : 'FAIL', JSON.stringify(results[results.length - 1]));
  if (!ok) allOk = false;
}
server.close();
writeFileSync(join(__dirname, 'fire143-prove-result.json'), JSON.stringify({ ok: allOk, results }, null, 2));
console.log(allOk ? 'PROVE_PASS' : 'PROVE_FAIL');
process.exit(allOk ? 0 : 1);
