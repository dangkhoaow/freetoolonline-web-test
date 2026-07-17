import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const DIST = join(ROOT, 'dist');
const PORT = 8768;
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png' };

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

async function prove(viewport) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://127.0.0.1:${PORT}/games/idle-capitalist-loop.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#iclPlayBtn', { timeout: 30000 });
  await page.evaluate(() => { if (typeof doAfterPageRendered === 'function') doAfterPageRendered(); });
  await page.click('#iclPlayBtn');
  await page.waitForSelector('#iclFrame', { timeout: 30000 });
  const frame = page.frameLocator('#iclFrame');
  await frame.locator('.cap-root').waitFor({ timeout: 30000 });
  const gameOk = await frame.locator('.cap-root .cap-biz').first().evaluate((el) => {
    return el.classList.contains('cap-biz') && el.textContent.includes('Lemonade');
  });
  await browser.close();
  return { viewport, gameOk, errors: errors.filter((e) => !/ResizeObserver|favicon/i.test(e)) };
}

const server = serve();
const results = [];
for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  results.push(await prove(vp));
}
server.close();
const fail = results.some((r) => !r.gameOk || r.errors.length);
console.log(JSON.stringify({ ok: !fail, results }, null, 2));
process.exit(fail ? 1 : 0);
