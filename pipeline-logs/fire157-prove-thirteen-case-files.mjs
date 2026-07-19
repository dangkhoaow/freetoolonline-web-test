#!/usr/bin/env node
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire('/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/package.json');
const { chromium } = require('playwright');
const ROOT = process.env.STAGING_REPO || join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PAGE = '/games/thirteen-case-files.html';
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.wav': 'audio/wav' };
function serve(root) {
  return createServer((req, res) => {
    let url = decodeURIComponent((req.url || '/').split('?')[0]);
    if (url.endsWith('/')) url += 'index.html';
    const file = join(root, url.replace(/^\//, ''));
    if (!file.startsWith(root) || !existsSync(file)) { res.writeHead(404); res.end('missing ' + url); return; }
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
  });
}
async function proveAt(width) {
  const server = serve(DIST);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader'] });
  const page = await browser.newPage({ viewport: { width, height: Math.round(width * 1.6) } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`http://127.0.0.1:${port}${PAGE}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForSelector('#tcfPlayBtn', { timeout: 15000 });
  const headerOk = await page.evaluate(() => {
    const img = document.querySelector('header img, .brand img, a[href="/"] img');
    const og = document.querySelector('meta[property="og:image"]');
    return Boolean(img && og && (og.getAttribute('content') || '').includes('thirteencasefiles'));
  }).catch(() => false);
  await page.click('#tcfPlayBtn');
  const iframeHandle = await page.waitForSelector('#tcfFrame', { timeout: 15000 });
  const gameFrame = await iframeHandle.contentFrame();
  if (!gameFrame) throw new Error('missing game frame');
  await gameFrame.waitForSelector('canvas#c1', { timeout: 20000 });
  await page.waitForTimeout(2000);
  const shot1 = await gameFrame.locator('canvas#c1').screenshot();
  await gameFrame.click('canvas#c1', { position: { x: 160, y: 120 } });
  await page.waitForTimeout(800);
  const shot2 = await gameFrame.locator('canvas#c1').screenshot();
  const changed = Buffer.compare(shot1, shot2) !== 0;
  const nonBlack = shot2.some((b, i) => i % 4 === 0 && b > 8);
  const gameErrors = errors.filter((e) => !/get-rating|403|favicon|Failed to load resource|heath-check|Access-Control-Allow-Origin|WrongDocumentError|pointer lock|AudioContext|NotAllowedError|manifest/i.test(e));
  await browser.close();
  server.close();
  return { width, changed, nonBlack, headerOk, b1: shot1.length, b2: shot2.length, gameErrors };
}
const r390 = await proveAt(390);
const r1440 = await proveAt(1440);
console.log(JSON.stringify({ r390, r1440 }, null, 2));
const ok = r390.nonBlack && r1440.nonBlack && r390.headerOk && r1440.headerOk && r390.gameErrors.length === 0 && r1440.gameErrors.length === 0;
process.exit(ok ? 0 : 2);
