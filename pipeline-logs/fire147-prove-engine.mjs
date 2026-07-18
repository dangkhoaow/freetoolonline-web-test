import { chromium } from 'playwright';
import { createHash } from 'node:crypto';

const INDEX = process.env.PROVE_URL || 'http://localhost:8947/index.html';

function pngStats(buf) {
  // Cheap non-uniformity signal for a screenshot buffer: hash a handful of
  // byte-offset windows and count how many distinct hashes appear. A flat
  // gradient-only frame compresses very differently across scanlines than a
  // frame with sprites/text, so distinct-window-count is a robust, purely
  // black-box liveness signal (avoids WebGL preserveDrawingBuffer pitfalls
  // of reading canvas pixels from page.evaluate, which returns a blank
  // buffer for a context created without preserveDrawingBuffer:true).
  const windows = new Set();
  const step = 4096;
  for (let i = 0; i + 64 <= buf.length; i += step) {
    windows.add(createHash('sha1').update(buf.subarray(i, i + 64)).digest('hex'));
  }
  return { size: buf.length, distinctWindows: windows.size };
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const page = await browser.newPage({ viewport: { width: 800, height: 450 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console.error: ' + msg.text());
  });

  await page.goto(INDEX, { waitUntil: 'load' });
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(500);

  const canvas = page.locator('canvas');

  const shot0 = await canvas.screenshot();
  const stats0 = pngStats(shot0);
  console.log('title-screen-shot stats:', JSON.stringify(stats0));

  // Step 1: first click anywhere - triggers audio init + intro (per src/scenes/game.ts onClick).
  await page.mouse.click(400, 225);
  await page.waitForTimeout(2600); // intro is ~2s

  const shot1 = await canvas.screenshot();
  const stats1 = pngStats(shot1);
  console.log('after-intro-shot stats:', JSON.stringify(stats1));

  // Step 2: press Space to trigger EVENT_START (the actual 60s run).
  await page.keyboard.press('Space');
  await page.waitForTimeout(1200);

  const shot2 = await canvas.screenshot();
  const stats2 = pngStats(shot2);
  console.log('after-start-shot stats:', JSON.stringify(stats2));

  // Step 3: simulate a jump input and confirm the frame changes (interactivity).
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);
  const shot3 = await canvas.screenshot();
  const changedByteLen = Buffer.compare(shot2, shot3) !== 0;
  console.log('frame-changed-after-jump (byte compare):', changedByteLen);

  if (errors.length) {
    console.log('PAGE ERRORS:', JSON.stringify(errors, null, 2));
  }

  await browser.close();

  // A frame with real sprite/text/UI content over the gradient should have
  // noticeably MORE distinct 64-byte windows than an all-gradient frame
  // (more local variety = less run-length-compressible = more distinct
  // hashes at fixed byte strides). Empirically a live title screen or
  // running game clears this floor by a wide margin; tune conservatively.
  const ok = stats1.distinctWindows > 5 && stats2.distinctWindows > 5 && changedByteLen && errors.length === 0;
  const result = { ok, stats0, stats1, stats2, changedByteLen, errors };
  console.log('RESULT', JSON.stringify(result));
  if (!result.ok) process.exit(1);
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
