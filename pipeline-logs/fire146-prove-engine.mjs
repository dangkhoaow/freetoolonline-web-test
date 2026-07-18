import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const INDEX = process.env.PROVE_URL || 'http://localhost:8946/index.html';

function pixelAt(imgData, w, x, y) {
  const i = (y * w + x) * 4;
  return [imgData.data[i], imgData.data[i + 1], imgData.data[i + 2]];
}

function closeTo(a, b, tol = 6) {
  return Math.abs(a[0] - b[0]) <= tol && Math.abs(a[1] - b[1]) <= tol && Math.abs(a[2] - b[2]) <= tol;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console.error: ' + msg.text());
  });

  await page.goto(INDEX, { waitUntil: 'load' });
  await page.waitForSelector('#app canvas', { timeout: 10000 });
  await page.waitForTimeout(1200);

  const bg = [0x1d, 0x2b, 0x53];

  const sample1 = await page.evaluate(() => {
    const c = document.querySelector('#app canvas');
    const cx = c.getContext('2d');
    const img = cx.getImageData(0, 0, c.width, c.height);
    return { w: c.width, h: c.height, data: Array.from(img.data) };
  });
  const img1 = { data: sample1.data };
  const w1 = sample1.w, h1 = sample1.h;

  const points = [
    [Math.floor(w1 * 0.5), Math.floor(h1 * 0.5)],
    [Math.floor(w1 * 0.25), Math.floor(h1 * 0.5)],
    [Math.floor(w1 * 0.75), Math.floor(h1 * 0.5)],
    [Math.floor(w1 * 0.5), Math.floor(h1 * 0.15)],
    [Math.floor(w1 * 0.5), Math.floor(h1 * 0.85)],
  ];
  let nonBgCount = 0;
  for (const [x, y] of points) {
    const p = pixelAt(img1, w1, x, y);
    if (!closeTo(p, bg)) nonBgCount++;
  }
  console.log('initial-render nonBgCount:', nonBgCount, '/', points.length);
  if (nonBgCount === 0) {
    throw new Error('Canvas appears to render only the flat background color - no board/UI content detected.');
  }

  // Simulate pointer interaction: move to a plausible board-choice location and click.
  const box = await page.$eval('#app canvas', (c) => {
    const r = c.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  });
  await page.mouse.move(box.left + box.width * 0.5, box.top + box.height * 0.6);
  await page.waitForTimeout(200);
  await page.mouse.down();
  await page.waitForTimeout(120);
  await page.mouse.up();
  await page.waitForTimeout(800);

  const sample2 = await page.evaluate(() => {
    const c = document.querySelector('#app canvas');
    const cx = c.getContext('2d');
    const img = cx.getImageData(0, 0, c.width, c.height);
    return { w: c.width, h: c.height, data: Array.from(img.data) };
  });
  let diffCount = 0;
  for (let i = 0; i < sample1.data.length; i += 4) {
    if (
      Math.abs(sample1.data[i] - sample2.data[i]) > 8 ||
      Math.abs(sample1.data[i + 1] - sample2.data[i + 1]) > 8 ||
      Math.abs(sample1.data[i + 2] - sample2.data[i + 2]) > 8
    ) diffCount++;
  }
  console.log('post-click changed-pixel count:', diffCount);

  if (errors.length) {
    console.log('PAGE ERRORS:', JSON.stringify(errors, null, 2));
  }

  await browser.close();

  const result = {
    ok: nonBgCount > 0 && errors.length === 0,
    nonBgCount,
    diffCount,
    errors,
  };
  console.log('RESULT', JSON.stringify(result));
  if (!result.ok) process.exit(1);
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
