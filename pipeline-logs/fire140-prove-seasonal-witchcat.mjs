#!/usr/bin/env node
/** fire140: Playwright PROVE seasonal-witchcat engine + launcher @390+1440 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const DIST = join(ROOT, 'dist');
console.log('DIST', DIST);
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };

function serve() {
  return createServer((req, res) => {
    let p = (req.url || '/').split('?')[0];
    if (p.endsWith('/')) p += 'index.html';
    const file = join(DIST, p.replace(/^\//, ''));
    if (!existsSync(file)) { res.writeHead(404); res.end('missing ' + p); return; }
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
  }).listen(0);
}

async function paintCheck(page, selector) {
  return page.locator(selector).first().evaluate((c) => {
    if (!c || c.width < 50 || c.height < 50) return { ok: false, reason: 'canvas too small', w: c?.width, h: c?.height };
    const ctx = c.getContext('2d');
    if (!ctx) return { ok: false, reason: 'no ctx' };
    const sw = Math.min(48, c.width);
    const sh = Math.min(48, c.height);
    const regions = [
      [0, 0],
      [Math.max(0, c.width - sw), 0],
      [0, Math.max(0, c.height - sh)],
      [Math.max(0, Math.floor((c.width - sw) / 2)), Math.max(0, Math.floor((c.height - sh) / 2))],
    ];
    let visible = 0;
    for (const [sx, sy] of regions) {
      const d = ctx.getImageData(sx, sy, sw, sh).data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 0 && (d[i] > 10 || d[i + 1] > 10 || d[i + 2] > 10)) visible++;
      }
    }
    return { ok: visible > 50, visible, w: c.width, h: c.height };
  });
}

async function prove(port, viewport) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  // 1) Engine boots standalone (core gate)
  await page.goto(`http://127.0.0.1:${port}/games/seasonal-witchcat/index.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#gc', { state: 'attached', timeout: 30000 });
  await page.waitForTimeout(5000);
  const enginePaint = await paintCheck(page, '#gc');

  // 2) Launcher page exposes Play button + injects iframe to same engine
  await page.goto(`http://127.0.0.1:${port}/games/seasonal-witchcat.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#swcPlayBtn', { state: 'attached', timeout: 30000 });
  const launcherOk = await page.evaluate(() => {
    const stage = document.getElementById('swcStage');
    const play = document.getElementById('swcPlayBtn');
    if (!stage || !play) return { ok: false, reason: 'missing stage/play' };
    const frame = document.createElement('iframe');
    frame.id = 'swcFrame';
    frame.src = 'seasonal-witchcat/index.html';
    frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0';
    const launch = document.getElementById('swcLaunch');
    if (launch) launch.remove();
    stage.appendChild(frame);
    return { ok: !!document.getElementById('swcFrame') };
  });
  let iframePaint = { ok: false, reason: 'skipped' };
  if (launcherOk.ok) {
    const handle = await page.$('#swcFrame');
    const child = handle ? await handle.contentFrame() : null;
    if (child) {
      await child.waitForSelector('#gc', { state: 'attached', timeout: 45000 });
      await page.waitForTimeout(5000);
      iframePaint = await child.locator('#gc').evaluate((c) => {
        if (!c || c.width < 50 || c.height < 50) return { ok: false, reason: 'canvas too small', w: c?.width, h: c?.height };
        const ctx = c.getContext('2d');
        if (!ctx) return { ok: false, reason: 'no ctx' };
        const d = ctx.getImageData(0, 0, Math.min(48, c.width), Math.min(48, c.height)).data;
        let visible = 0;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] > 0 && (d[i] > 10 || d[i + 1] > 10 || d[i + 2] > 10)) visible++;
        }
        return { ok: visible > 20, visible, w: c.width, h: c.height };
      });
    } else {
      iframePaint = { ok: false, reason: 'no contentFrame' };
    }
  }

  const hard = errors.filter((e) => !/ResizeObserver|favicon|pointerlock|AudioContext|autoplay|NotAllowedError/i.test(e));
  await browser.close();
  const paint = { ok: enginePaint.ok && launcherOk.ok && iframePaint.ok, enginePaint, launcherOk, iframePaint };
  return { viewport, paint, errors: hard };
}

const server = serve();
await new Promise((r) => server.once('listening', r));
const port = server.address().port;
console.log('PROVE_PORT', port);
const results = [];
for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  const r = await prove(port, vp);
  results.push(r);
  console.log(JSON.stringify(r));
  if (!r.paint.ok) {
    server.close();
    process.exit(2);
  }
  if (r.errors.length) {
    console.error('pageerrors', r.errors);
    server.close();
    process.exit(3);
  }
}
server.close();
console.log('PROVE_PASS', JSON.stringify(results));
