#!/usr/bin/env node
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PAGE = '/games/solo-battlefield.html';
const results = [];
function pngStats(buf) {
  const windows = new Set(); let total = 0;
  for (let i = 0; i + 64 <= buf.length; i += 4096) {
    windows.add(createHash('sha1').update(buf.subarray(i, i + 64)).digest('hex')); total++;
  }
  return { size: buf.length, distinctWindows: windows.size, totalWindows: total, ratio: total ? windows.size / total : 0 };
}
async function prove(vp) {
  const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: vp });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(`http://127.0.0.1:${PORT}${PAGE}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.click('#sbfPlayBtn');
  await page.waitForSelector('#sbfFrame', { timeout: 30000 });
  const frameHandle = await page.waitForSelector('#sbfFrame');
  const frame = await frameHandle.contentFrame();
  await frame.waitForSelector('canvas', { timeout: 15000 });
  await page.waitForTimeout(400);
  await frame.evaluate(() => { /* focus canvas parent */ });
  await page.mouse.click(vp.width/2, vp.height/2);
  await page.keyboard.down('KeyD'); await page.waitForTimeout(400); await page.keyboard.up('KeyD');
  await page.waitForTimeout(800);
  const shot = await frame.locator('canvas').screenshot();
  const stats = pngStats(shot);
  const gameErrors = errors.filter((e) => !/get-rating|403|adsbygoogle|favicon|heath-check|downloader\.freetool|CORS|net::ERR_FAILED|WebGL-.*GPU stall/i.test(e));
  const ok = stats.distinctWindows >= 2 && stats.ratio >= 0.35 && gameErrors.length === 0;
  results.push({ vp, ok, stats, gameErrors: gameErrors.slice(0, 6) });
  await browser.close();
  return ok;
}
const mime = { '.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json' };
const PORT = 8800 + Math.floor(Math.random()*200);
const server = createServer((req, res) => {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url.endsWith('/')) url += 'index.html';
  const file = join(DIST, url);
  if (!file.startsWith(DIST) || !existsSync(file)) { res.writeHead(404); res.end('missing'); return; }
  res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
let allOk = true;
for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  const ok = await prove(vp);
  console.log('vp', vp.width, ok ? 'PASS' : 'FAIL', JSON.stringify(results.at(-1)));
  if (!ok) allOk = false;
}
const html = readFileSync(join(DIST, 'games/solo-battlefield.html'), 'utf8');
const gates = {
  hasHeaderIcon: /<img class="headerLogoImg" src="[^"]*solobattlefield__[a-f0-9]{8}\.svg"/.test(html),
  hasWordmark: /siteWordmark/.test(html),
  hasOgImage: /property='og:image' content='[^']*solobattlefield\.png'/.test(html),
  hasFavicon: /rel='icon' type='image\/svg\+xml' href='[^']*solobattlefield__[a-f0-9]{8}\.svg'/.test(html),
  hasTouchIcon: /rel='apple-touch-icon'[^>]*href='[^']*solobattlefield-180\.png'/.test(html),
};
console.log('header-enrollment:', JSON.stringify(gates));
if (Object.values(gates).some(v => !v)) allOk = false;
server.close();
writeFileSync(join(__dirname, 'fire149-prove-result.json'), JSON.stringify({ ok: allOk, results, gates }, null, 2));
console.log(allOk ? 'PROVE_PASS' : 'PROVE_FAIL');
process.exit(allOk ? 0 : 1);
