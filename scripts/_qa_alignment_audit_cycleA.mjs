// Step-4 layout-alignment audit (corrected): compare sibling content
// elements (h1 / h2 / answer panel / decision table) — they should all share
// identical `left` position because they live inside the same w3-container.
// The container itself (`#content.w3-content`) is full-viewport-width and is
// excluded from the sibling-alignment check.
//
// Tolerance: ≤ 1 px between any two siblings inside the same route+viewport.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const ORIGIN = 'https://dangkhoaow.github.io/freetoolonline-web-test';
const ROUTES = [
  // baseline (existing well-tested guide)
  '/guides/file-compressor-vs-zip-what-to-pick.html',
  // Cycle A new guides
  '/guides/what-is-a-file-compressor-and-which-to-use.html',
  '/guides/how-to-compress-a-file-online.html',
  '/guides/how-to-reduce-zip-file-size-online.html',
];
const VIEWPORTS = [
  { label: 'mobile-390', width: 390, height: 844 },
  { label: 'desktop-1440', width: 1440, height: 900 },
  { label: 'desktop-1920', width: 1920, height: 1080 },
];

const browser = await chromium.launch();
const results = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    await page.goto(`${ORIGIN}${route}?noads=1`, { waitUntil: 'networkidle' });
    const rects = await page.evaluate(() => {
      const sel = (q) => Array.from(document.querySelectorAll(q)).map((el) => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, cls: String(el.className).slice(0, 60), left: +r.left.toFixed(2), right: +r.right.toFixed(2), width: +r.width.toFixed(2) };
      });
      return {
        h1: sel('#content h1'),
        h2: sel('#content h2'),
        answerPanel: sel('#content .w3-panel.w3-pale-green'),
        decisionTable: sel('#content table.w3-table-all'),
        list: sel('#content ul, #content ol').slice(0, 3),
      };
    });
    const siblings = [...rects.h1, ...rects.h2, ...rects.answerPanel, ...rects.decisionTable, ...rects.list];
    const lefts = siblings.map((r) => r.left).filter((n) => Number.isFinite(n));
    const rights = siblings.map((r) => r.right).filter((n) => Number.isFinite(n));
    const minL = Math.min(...lefts);
    const maxL = Math.max(...lefts);
    const minR = Math.min(...rights);
    const maxR = Math.max(...rights);
    const leftDelta = lefts.length ? +(maxL - minL).toFixed(2) : null;
    const rightDelta = rights.length ? +(maxR - minR).toFixed(2) : null;
    results.push({
      viewport: vp.label,
      route,
      siblings: siblings.length,
      left_delta_px: leftDelta,
      right_delta_px: rightDelta,
      pass: leftDelta != null && leftDelta <= 1.0 && rightDelta != null && rightDelta <= 1.0,
    });
    await page.close();
  }
  await ctx.close();
}

await browser.close();

const RUN_DIR = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/seo-reports/20260427';
await fs.mkdir(RUN_DIR, { recursive: true });
const outFile = path.join(RUN_DIR, 'alignment-audit-cycleA-1777269000000.json');
await fs.writeFile(outFile, JSON.stringify({ origin: ORIGIN, routes: ROUTES, viewports: VIEWPORTS, results }, null, 2));
console.log('wrote', outFile);
console.log();
console.log('=== alignment audit (sibling left/right deltas) ===');
console.log('  pass | viewport      | siblings | left Δ | right Δ | route');
results.forEach((r) => {
  const verdict = r.pass ? 'PASS' : 'FAIL';
  console.log(`  ${verdict} | ${r.viewport.padEnd(13)} | ${String(r.siblings).padStart(8)} | ${String(r.left_delta_px).padStart(6)} | ${String(r.right_delta_px).padStart(7)} | ${r.route}`);
});
const failures = results.filter((r) => !r.pass);
console.log(`\nfailures: ${failures.length} / ${results.length}`);
process.exit(failures.length ? 1 : 0);
