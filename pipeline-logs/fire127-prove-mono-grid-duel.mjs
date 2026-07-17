import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const DIST = join(ROOT, 'dist');
const PORT = 8770;
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
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://127.0.0.1:${PORT}/games/mono-grid-duel.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#mgdPlayBtn', { timeout: 30000 });
  await page.evaluate(() => { if (typeof doAfterPageRendered === 'function') doAfterPageRendered(); });
  await page.click('#mgdPlayBtn');
  await page.waitForSelector('#mgdFrame', { timeout: 30000 });
  const frame = page.frameLocator('#mgdFrame');
  await frame.locator('canvas').first().waitFor({ timeout: 30000 });
  const canvasOk = await frame.locator('canvas').first().evaluate((c) => c.width > 0 && c.height > 0);
  await browser.close();
  return { viewport, canvasOk, errors: errors.filter((e) => !/ResizeObserver|favicon/i.test(e)) };
}

const server = serve();
const results = [];
for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  results.push(await prove(vp));
}
server.close();
const fail = results.some((r) => !r.canvasOk || r.errors.length);
console.log(JSON.stringify({ ok: !fail, results }, null, 2));
process.exit(fail ? 1 : 0);
