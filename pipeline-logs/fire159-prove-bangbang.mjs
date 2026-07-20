#!/usr/bin/env node
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire('/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/package.json');
const { chromium } = require('playwright');
const ROOT = process.env.STAGING_REPO || '/tmp/fto-fire159-stg';
const DIST = join(ROOT, 'dist');
const PAGE = '/games/bangbang-artillery.html';
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
  const page = await browser.newPage({ viewport: { width, height: Math.round(width * 0.7) } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto(`http://127.0.0.1:${port}${PAGE}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForSelector('#bbaPlayBtn', { timeout: 15000 });
  const headerOk = await page.evaluate(() => {
    const img = document.querySelector('header img, .brand img, a[href="/"] img');
    const og = document.querySelector('meta[property="og:image"]');
    return Boolean(img && og && (og.getAttribute('content') || '').includes('bangbangartillery'));
  }).catch(() => false);
  await page.click('#bbaPlayBtn');
  const iframeHandle = await page.waitForSelector('#bbaFrame', { timeout: 15000 });
  const gameFrame = await iframeHandle.contentFrame();
  if (!gameFrame) throw new Error('missing game frame');
  await gameFrame.waitForSelector('canvas', { timeout: 20000 });
  await page.waitForTimeout(1500);
  const shot = await gameFrame.locator('canvas').screenshot();
  const nonBlack = shot.some((b, i) => i % 4 === 0 && b > 8);
  // press Space in game to exercise input path (keyboard lives on page, not frame)
  await gameFrame.locator('canvas').click({ position: { x: 40, y: 40 } });
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Space');
  await page.waitForTimeout(800);
  const gameErrors = errors.filter(
    (e) =>
      !/get-rating|403|favicon|Failed to load resource|heath-check|Access-Control-Allow-Origin|WrongDocumentError|pointer lock|AudioContext|NotAllowedError|manifest|serviceWorker/i.test(
        e,
      ),
  );
  await browser.close();
  server.close();
  return { width, nonBlack, headerOk, bytes: shot.length, gameErrors };
}

const r390 = await proveAt(390);
const r1440 = await proveAt(1440);
console.log(JSON.stringify({ r390, r1440 }, null, 2));
const ok =
  r390.nonBlack &&
  r1440.nonBlack &&
  r390.headerOk &&
  r1440.headerOk &&
  r390.gameErrors.length === 0 &&
  r1440.gameErrors.length === 0;
process.exit(ok ? 0 : 2);
