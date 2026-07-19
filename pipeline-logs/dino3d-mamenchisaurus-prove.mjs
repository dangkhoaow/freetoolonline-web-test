import { chromium } from 'playwright';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const DIST = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/dist';
const OUT = '/tmp/dino3d-mamenchisaurus/prove';
fs.mkdirSync(OUT, { recursive: true });
const ARGS = ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'];

function contentType(p) {
  if (p.endsWith('.html')) return 'text/html; charset=utf-8';
  if (p.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (p.endsWith('.css')) return 'text/css; charset=utf-8';
  if (p.endsWith('.svg')) return 'image/svg+xml';
  if (p.endsWith('.json')) return 'application/json';
  if (p.endsWith('.glb')) return 'model/gltf-binary';
  return 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url.endsWith('/')) url += 'index.html';
  const fp = path.join(DIST, url);
  if (!fp.startsWith(DIST) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    res.writeHead(404); res.end('missing'); return;
  }
  res.writeHead(200, { 'Content-Type': contentType(fp), 'Access-Control-Allow-Origin': '*' });
  fs.createReadStream(fp).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const URL = `http://127.0.0.1:${port}/dinosaur-3d/mamenchisaurus.html`;
console.log('PROVE_URL', URL);

function isBenign(msg) {
  const t = String(msg || '');
  return /favicon|CORS|Access-Control|Blocked a frame|fonts\.gstatic|google|net::ERR_/i.test(t);
}
async function proveAt(width, height) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ARGS });
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror:' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !isBenign(m.text())) errors.push('console:' + m.text()); });
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('#d3dCanvasHost canvas', { timeout: 60000 });
  await page.waitForFunction(() => {
    const info = document.getElementById('d3dInfoPanel');
    return info && /Length/i.test(info.textContent || '');
  }, { timeout: 60000 });
  let statusText = '';
  try {
    await page.waitForFunction(() => {
      const el = document.getElementById('d3dStatus');
      return el && /Showing a real 3D model/i.test(el.textContent || '');
    }, { timeout: 120000 });
    statusText = await page.locator('#d3dStatus').innerText();
  } catch {
    statusText = await page.locator('#d3dStatus').innerText().catch(() => '');
  }
  const canvasOk = await page.evaluate(() => {
    const c = document.querySelector('#d3dCanvasHost canvas');
    return !!(c && c.width > 0 && c.height > 0);
  });
  await page.screenshot({ path: `${OUT}/mamenchisaurus-${width}x${height}.png`, fullPage: false });
  const facts = await page.locator('#d3dInfoPanel').innerText();
  await browser.close();
  return { width, height, canvasOk, statusText, factsHead: facts.slice(0, 300), errors, modelSwapped: /Showing a real 3D model/i.test(statusText) };
}
const results = [];
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const r = await proveAt(w, h);
  results.push(r);
  console.log(JSON.stringify(r, null, 2));
}
server.close();
// Model swap depends on the live ftol-vm-assets CDN being reachable from this
// sandbox; canvasOk + zero scene errors is the hard gate (fail-soft procedural
// path is explicitly tolerated per the runbook's PROVE step).
const pass = results.every((r) => r.canvasOk && r.errors.length === 0);
fs.writeFileSync(`${OUT}/result.json`, JSON.stringify({ pass, results }, null, 2));
console.log(pass ? 'PROVE_PASS' : 'PROVE_FAIL');
process.exit(pass ? 0 : 1);
