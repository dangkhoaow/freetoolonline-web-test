#!/usr/bin/env node
/** fire145: standalone engine smoke test for darkline-paws (all 3 modes) */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ENGINE_DIR = join(ROOT, 'source/web/src/main/webapp/static/games/darkline-paws');

const mime = { '.html': 'text/html', '.webp': 'image/webp' };
const PORT = 9500 + Math.floor(Math.random() * 300);

const server = createServer((req, res) => {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === '/') url = '/index.html';
  const file = join(ENGINE_DIR, url);
  if (!file.startsWith(ENGINE_DIR) || !existsSync(file)) {
    res.writeHead(404);
    res.end('missing: ' + url);
    return;
  }
  res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
console.log('engine smoke server', PORT, ENGINE_DIR);

let allOk = true;

async function checkPage(path, label, opts) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  const errors = [];
  const requestFails = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('requestfailed', (r) => requestFails.push(r.url() + ' :: ' + (r.failure()?.errorText || '')));
  await page.goto(`http://127.0.0.1:${PORT}${path}`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(700);
  const result = await opts.probe(page);
  await browser.close();
  const ok = result.ok && requestFails.length === 0 && errors.length === 0;
  console.log(label, ok ? 'PASS' : 'FAIL', JSON.stringify({ result, requestFails, errors }));
  if (!ok) allOk = false;
  return ok;
}

// index.html: raycasted maze. Intro screen "BEGIN ADVENTURE" (onclick,
// reveals #menu) -> #startBtn (addEventListener, sets gameState=playing and
// kicks off the requestAnimationFrame render loop for the first time - the
// canvas is genuinely blank/untouched before this click, by design).
await checkPage('/index.html', 'index.html (maze)', {
  probe: async (page) => {
    await page.click('button.intro-button');
    await page.waitForTimeout(150);
    await page.click('#startBtn');
    await page.waitForTimeout(500);
    const info = await page.locator('#view').evaluate((c) => {
      const ctx = c.getContext('2d');
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      let nonBlack = 0;
      for (let i = 0; i < data.length; i += 4) if (data[i] + data[i + 1] + data[i + 2] > 10) nonBlack++;
      return { w: c.width, h: c.height, nonBlack, total: data.length / 4 };
    });
    return { ok: info.w > 0 && info.h > 0 && info.nonBlack > 100, info };
  },
});

// index2.html: tic-tac-toe DOM grid, no canvas. Click a cell, expect the
// human piece + (after the 300ms AI setTimeout) the AI piece to both render.
await checkPage('/index2.html', 'index2.html (tic-tac-toe)', {
  probe: async (page) => {
    await page.locator('.cell').first().click();
    await page.waitForTimeout(600);
    const taken = await page.locator('.cell.taken').count();
    return { ok: taken >= 2, taken }; // human move + AI reply
  },
});

// index3.html: Cat Jumper auto-runner canvas, fullscreen responsive.
// gameLoop() runs unconditionally from load (no start gate); buildings are
// drawn rising from canvas.height upward, so sample the BOTTOM strip, not
// the top-left corner (top strip is legitimately untouched/transparent sky).
await checkPage('/index3.html', 'index3.html (cat jumper)', {
  probe: async (page) => {
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);
    const info = await page.locator('#gameCanvas').evaluate((c) => {
      const ctx = c.getContext('2d');
      const sampleH = Math.min(250, c.height);
      const data = ctx.getImageData(0, c.height - sampleH, c.width, sampleH).data;
      let nonBlack = 0;
      for (let i = 0; i < data.length; i += 4) if (data[i] + data[i + 1] + data[i + 2] > 10) nonBlack++;
      return { w: c.width, h: c.height, nonBlack };
    });
    return { ok: info.w > 0 && info.h > 0 && info.nonBlack > 100, info };
  },
});

server.close();
console.log(allOk ? 'ENGINE_PROVE_PASS' : 'ENGINE_PROVE_FAIL');
process.exit(allOk ? 0 : 1);
