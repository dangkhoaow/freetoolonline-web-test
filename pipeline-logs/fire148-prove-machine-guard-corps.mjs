#!/usr/bin/env node
/** fire148: headless PROVE machine-guard-corps @390 + 1440 (full site dist) */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PAGE = '/games/machine-guard-corps.html';
const results = [];

function pngStats(buf) {
  const windows = new Set();
  const step = 4096;
  let total = 0;
  for (let i = 0; i + 64 <= buf.length; i += step) {
    windows.add(createHash('sha1').update(buf.subarray(i, i + 64)).digest('hex'));
    total++;
  }
  return { size: buf.length, distinctWindows: windows.size, totalWindows: total, ratio: total ? windows.size / total : 0 };
}

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
  await page.waitForSelector('#mgcPlayBtn', { timeout: 30000 });
  await page.click('#mgcPlayBtn');
  await page.waitForSelector('#mgcFrame', { timeout: 30000 });
  const frameHandle = await page.waitForSelector('#mgcFrame', { timeout: 30000 });
  const frame = await frameHandle.contentFrame();
  if (!frame) throw new Error('mgcFrame has no contentFrame');
  await frame.waitForSelector('#gameCanvas', { timeout: 15000 });
  await page.waitForTimeout(400);

  // Overlay buttons can sit outside a tiny iframe viewport on mobile; use
  // DOM click + keyboard summon (same path as fire148-prove-engine.mjs).
  await frame.evaluate(() => {
    const btn = document.getElementById('startButton');
    if (!btn) throw new Error('startButton missing');
    btn.click();
  });
  await page.waitForTimeout(800);
  await frame.evaluate(() => {
    const b = document.querySelector('#summonButtons button');
    if (b) b.click();
  });
  await page.waitForTimeout(2500);

  const hud = await frame.evaluate(() => ({
    energy: document.getElementById('energyText')?.textContent,
    scrap: document.getElementById('scrapText')?.textContent,
    base: document.getElementById('baseText')?.textContent,
    hive: document.getElementById('hiveText')?.textContent,
    status: document.getElementById('statusText')?.textContent,
  }));
  const shot = await frame.locator('#gameCanvas').screenshot();
  const stats = pngStats(shot);

  const gameErrors = errors.filter((e) => !/get-rating|403|adsbygoogle|favicon|heath-check|downloader\.freetool|CORS policy|net::ERR_FAILED|WebGL-.*GPU stall/i.test(e));
  const hudLooksLive = !!(hud.base && hud.base !== '0' && hud.hive && hud.hive !== '0');
  const canvasOk = stats.distinctWindows >= 3 && stats.ratio >= 0.35;
  const ok = hudLooksLive && canvasOk && gameErrors.length === 0;
  results.push({ vp, ok, stats, hud, hudLooksLive, gameErrors: gameErrors.slice(0, 8) });
  await browser.close();
  return ok;
}

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.json': 'application/json',
};

const PORT = 8765 + Math.floor(Math.random() * 200);
if (!existsSync(join(DIST, 'games/machine-guard-corps.html'))) {
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

const html = readFileSync(join(DIST, 'games/machine-guard-corps.html'), 'utf8');
const hasHeaderIcon = /<img class="headerLogoImg" src="[^"]*machineguardcorps__[a-f0-9]{8}\.svg"/.test(html);
const hasWidthHeight = /<img class="headerLogoImg"[^>]*width="43"[^>]*height="43"/.test(html);
const hasWordmark = /siteWordmark/.test(html);
const hasHomeLink = /<a class="[^"]*headerLogo[^"]*" href="[^"]*"/.test(html);
const hasOgImage = /property='og:image' content='[^']*machineguardcorps\.png'/.test(html);
const hasFavicon = /rel='icon' type='image\/svg\+xml' href='[^']*machineguardcorps__[a-f0-9]{8}\.svg'/.test(html);
const hasTouchIcon = /rel='apple-touch-icon'[^>]*href='[^']*machineguardcorps-180\.png'/.test(html);
console.log('header-enrollment:', JSON.stringify({ hasHeaderIcon, hasWidthHeight, hasWordmark, hasHomeLink, hasOgImage, hasFavicon, hasTouchIcon }));
if (!hasHeaderIcon || !hasWidthHeight || !hasWordmark || !hasOgImage || !hasFavicon || !hasTouchIcon) {
  allOk = false;
  console.log('HEADER ENROLLMENT GATE FAILED');
}

const aboutHtml = existsSync(join(DIST, 'about-us.html')) ? readFileSync(join(DIST, 'about-us.html'), 'utf8') : null;
if (aboutHtml) {
  const controlStillGear = !/headerLogoImg/.test(aboutHtml);
  console.log('regression-guard (about-us keeps gear):', controlStillGear);
  if (!controlStillGear) {
    allOk = false;
    console.log('REGRESSION GUARD FAILED - non-enrolled page unexpectedly shows an icon');
  }
}

server.close();
writeFileSync(join(__dirname, 'fire148-prove-result.json'), JSON.stringify({ ok: allOk, results }, null, 2));
console.log(allOk ? 'PROVE_PASS' : 'PROVE_FAIL');
process.exit(allOk ? 0 : 1);
