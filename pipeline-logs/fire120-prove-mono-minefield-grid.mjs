import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const DIST = path.resolve('dist');
const PORT = 8766;
function contentType(p) {
  if (p.endsWith('.html')) return 'text/html; charset=utf-8';
  if (p.endsWith('.js')) return 'application/javascript';
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}
const server = http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url.endsWith('/')) url += 'index.html';
  const file = path.join(DIST, url.replace(/^\//, ''));
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end('missing'); return;
  }
  res.writeHead(200, { 'Content-Type': contentType(file) });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
async function prove(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror:' + e.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push('console:' + msg.text()); });
  await page.goto(`http://127.0.0.1:${PORT}/games/mono-minefield-grid.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#mmgPlayBtn', { timeout: 15000 });
  await page.click('#mmgPlayBtn');
  await page.waitForSelector('#mmgFrame', { timeout: 15000 });
  const frame = page.frameLocator('#mmgFrame');
  await frame.locator('.sweeper-board, #gameHost').first().waitFor({ timeout: 20000 });
  await page.waitForTimeout(1000);
  const board = await frame.locator('.sweeper-board').count();
  const cells = await frame.locator('.sweeper-cell').count();
  const gameErrors = errors.filter((e) => !/get-rating|403|favicon|Failed to load resource|heath-check|CORS policy|downloader\\.freetool/i.test(e));
  console.log(JSON.stringify({ width, board, cells, errors: gameErrors }, null, 2));
  if (!board || cells < 9) throw new Error('board missing @' + width);
  if (gameErrors.length) throw new Error('game errors @' + width + ': ' + gameErrors.join(' | '));
  await page.close();
}
try {
  await prove(390);
  await prove(1440);
  console.log('PROVE PASS');
} finally {
  await browser.close();
  server.close();
}
