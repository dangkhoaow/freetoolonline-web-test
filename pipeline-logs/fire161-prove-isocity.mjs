/**
 * fire161 PROVE - iso-city-sandbox Play -> iframe -> canvases
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WT = path.resolve(__dirname, '..');
const require = createRequire(path.join(WT, 'package.json'));
const { chromium } = require('playwright');

const DIST = path.join(WT, 'dist');
const PORT = 8761;

function contentType(p) {
  if (p.endsWith('.html')) return 'text/html; charset=utf-8';
  if (p.endsWith('.js')) return 'application/javascript';
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.png')) return 'image/png';
  if (p.endsWith('.svg')) return 'image/svg+xml';
  if (p.endsWith('.json')) return 'application/json';
  return 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url.endsWith('/')) url += 'index.html';
  const file = path.join(DIST, url);
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end('missing'); return;
  }
  res.writeHead(200, { 'Content-Type': contentType(file) });
  fs.createReadStream(file).pipe(res);
});

await new Promise((r) => server.listen(PORT, r));
console.log('serving', DIST, 'on', PORT);

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

async function prove(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const gameErrors = [];
  page.on('pageerror', (e) => gameErrors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const t = msg.text();
      if (!/get-rating|403|favicon|adsbygoogle|googlesyndication/i.test(t)) gameErrors.push(t);
    }
  });
  await page.goto(`http://127.0.0.1:${PORT}/games/iso-city-sandbox.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#icsPlayBtn', { timeout: 30000 });
  const headerOk = await page.evaluate(() => {
    const img = document.querySelector('header img, .navbar img, a.brand img, #topHeader img');
    const og = document.querySelector('meta[property="og:image"]');
    return Boolean(img && og && (og.getAttribute('content') || '').includes('isocitysandbox'));
  });
  await page.click('#icsPlayBtn');
  await page.waitForSelector('#icsFrame', { timeout: 15000 });
  await page.waitForTimeout(2500);
  const frame = page.frameLocator('#icsFrame');
  await frame.locator('#bg').waitFor({ timeout: 15000 });
  const stats = await page.evaluate(() => {
    const f = document.getElementById('icsFrame');
    const doc = f.contentDocument;
    const bg = doc.getElementById('bg');
    const fg = doc.getElementById('fg');
    const tools = doc.getElementById('tools');
    return {
      bgW: bg?.width || 0,
      bgH: bg?.height || 0,
      fgW: fg?.width || 0,
      toolKids: tools?.children?.length || 0,
    };
  });
  // click a tool then paint
  await frame.locator('#tools > div').nth(3).click();
  await frame.locator('#fg').click({ position: { x: 455, y: 280 } });
  await page.waitForTimeout(400);
  const afterHash = await page.evaluate(() => {
    const f = document.getElementById('icsFrame');
    return f.contentWindow.location.hash || '';
  });
  await page.close();
  return { width, headerOk, stats, afterHash, gameErrors };
}

const results = [];
for (const w of [390, 1440]) results.push(await prove(w));
await browser.close();
server.close();

const pass = results.every((r) => r.stats.bgW > 0 && r.stats.toolKids > 10 && r.headerOk && r.gameErrors.length === 0);
console.log(JSON.stringify({ pass, results }, null, 2));
process.exit(pass ? 0 : 1);
