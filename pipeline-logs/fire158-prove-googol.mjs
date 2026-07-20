#!/usr/bin/env node
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire('/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/package.json');
const { chromium } = require('playwright');
const ROOT = process.env.STAGING_REPO || '/tmp/fto-fire158-stg';
const DIST = join(ROOT, 'dist');
const PAGE = '/games/googol-stopping-game.html';
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

function serve(root) {
  return createServer((req, res) => {
    let url = decodeURIComponent((req.url || '/').split('?')[0]);
    if (url.endsWith('/')) url += 'index.html';
    const file = join(root, url.replace(/^\//, ''));
    if (!file.startsWith(root) || !existsSync(file)) {
      res.writeHead(404);
      res.end('missing ' + url);
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
  });
}

async function proveAt(width) {
  const server = serve(DIST);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const page = await browser.newPage({ viewport: { width, height: Math.round(width * 1.6) } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto(`http://127.0.0.1:${port}${PAGE}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForSelector('#gsgPlayBtn', { timeout: 15000 });
  const headerOk = await page.evaluate(() => {
    const img = document.querySelector('header img, .brand img, a[href="/"] img');
    const og = document.querySelector('meta[property="og:image"]');
    return Boolean(img && og && (og.getAttribute('content') || '').includes('googolstoppinggame'));
  }).catch(() => false);
  await page.click('#gsgPlayBtn');
  const iframeHandle = await page.waitForSelector('#gsgFrame', { timeout: 15000 });
  const gameFrame = await iframeHandle.contentFrame();
  if (!gameFrame) throw new Error('missing game frame');
  await gameFrame.waitForSelector('#main button', { timeout: 20000 });
  const before = await gameFrame.evaluate(() => document.querySelector('#history')?.innerHTML || '');
  await gameFrame.click('#main button');
  await page.waitForTimeout(500);
  const after = await gameFrame.evaluate(() => ({
    history: document.querySelector('#history')?.innerHTML || '',
    plays: document.querySelector('#status div')?.innerHTML || '',
    btnDisabled: document.querySelector('#main button')?.disabled,
  }));
  const bootOk = after.history.length > before.length || after.plays.includes('1');
  const gameErrors = errors.filter(
    (e) =>
      !/get-rating|403|favicon|Failed to load resource|heath-check|Access-Control-Allow-Origin|WrongDocumentError|pointer lock|AudioContext|NotAllowedError|manifest|serviceWorker/i.test(
        e,
      ),
  );
  await browser.close();
  server.close();
  return { width, bootOk, headerOk, after, gameErrors };
}

const r390 = await proveAt(390);
const r1440 = await proveAt(1440);
console.log(JSON.stringify({ r390, r1440 }, null, 2));
const ok =
  r390.bootOk &&
  r1440.bootOk &&
  r390.headerOk &&
  r1440.headerOk &&
  r390.gameErrors.length === 0 &&
  r1440.gameErrors.length === 0;
process.exit(ok ? 0 : 2);
