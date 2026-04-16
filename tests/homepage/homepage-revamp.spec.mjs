import { expect, test } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { access, mkdir, stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const distDir = path.join(repoRoot, 'dist');
const screenshotBaseDir = path.join(repoRoot, 'test', 'homepage', 'screenshoot');
const VIEWPORTS = [
  { label: '320', viewport: { width: 320, height: 844 } },
  { label: '390', viewport: { width: 390, height: 844 } },
  { label: '768', viewport: { width: 768, height: 1024 } },
  { label: '1024', viewport: { width: 1024, height: 900 } },
  { label: '1440', viewport: { width: 1440, height: 900 } },
];

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const resolveContentType = (filePath) => MIME_TYPES[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream';

async function startStaticServer(rootDir) {
  await access(rootDir);
  return await new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req?.url ?? '/', 'http://localhost');
        const normalizedPath = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
        const filePath = path.join(rootDir, normalizedPath);
        const fileStat = await stat(filePath);
        if (!fileStat.isFile()) {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', resolveContentType(filePath));
        createReadStream(filePath).pipe(res);
      } catch (error) {
        res.statusCode = 404;
        res.end('Not found');
      }
    });

    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      const origin = `http://127.0.0.1:${port}`;
      console.log(`[homepage-test] Static server started at ${origin}`);
      resolve({ server, origin });
    });
  });
}

async function captureHomepage({ browser, origin, label, contextOptions, screenshotDir }) {
  const context = await browser.newContext(contextOptions);
  console.log(`[homepage-test] ${label} context=${JSON.stringify(contextOptions)}`);

  try {
    const page = await context.newPage();
    const homeUrl = `${origin}/`;
    console.log(`[homepage-test] ${label} url=${homeUrl}`);

    await page.goto(homeUrl, { waitUntil: 'load' });
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1500);

    const heading = page.locator('h1');
    await expect(heading, `${label} should include the H1 heading`).toContainText('Free Tool Online');
    await expect(page.locator('.searchAutoCmp'), `${label} search should render`).toBeVisible();
    const popularCount = await page.locator('#popularToolsList li').count();
    console.log(`[homepage-test] ${label} popularCount=${popularCount}`);
    expect(popularCount, `${label} should show popular tools list`).toBeGreaterThan(0);

    const layout = await page.evaluate(() => {
      return {
        scrollHeight: document.documentElement.scrollHeight,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        innerHeight: window.innerHeight,
        buttonOverflowCount: Array.from(document.querySelectorAll('.main-text .w3-card .w3-button')).filter((button) => button.scrollWidth > button.clientWidth + 1).length,
      };
    });
    console.log(`[homepage-test] ${label} scrollHeight=${layout.scrollHeight} scrollWidth=${layout.scrollWidth} clientWidth=${layout.clientWidth} innerHeight=${layout.innerHeight} buttonOverflowCount=${layout.buttonOverflowCount}`);
    expect(layout.scrollHeight, `${label} should be scrollable`).toBeGreaterThan(layout.innerHeight);
    expect(layout.scrollWidth, `${label} should not overflow horizontally`).toBeLessThanOrEqual(layout.clientWidth);
    expect(layout.buttonOverflowCount, `${label} category buttons should not clip text`).toBe(0);

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);
    const scrollY = await page.evaluate(() => window.scrollY);
    console.log(`[homepage-test] ${label} scrollY=${scrollY}`);
    expect(scrollY, `${label} should allow vertical scrolling`).toBeGreaterThan(0);

    const screenshotPath = path.join(screenshotDir, `homepage-${label}.png`);
    console.log(`[homepage-test] ${label} screenshot=${screenshotPath}`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
  } finally {
    await context.close();
  }
}

test('homepage revamp renders + captures screenshots', async ({ browser }) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  console.log(`[homepage-test] timestamp=${timestamp}`);

  const screenshotDir = path.join(screenshotBaseDir, timestamp);
  console.log(`[homepage-test] screenshotDir=${screenshotDir}`);
  await mkdir(screenshotDir, { recursive: true });

  const originOverride = process.env.HOMEPAGE_TEST_ORIGIN?.trim();
  console.log(`[homepage-test] originOverride=${originOverride || 'none'}`);

  let server = null;
  let origin = originOverride;

  if (!origin) {
    const serverState = await startStaticServer(distDir);
    server = serverState.server;
    origin = serverState.origin;
  }

  try {
    for (const { label, viewport } of VIEWPORTS) {
      await captureHomepage({
        browser,
        origin,
        label,
        contextOptions: { viewport },
        screenshotDir,
      });
    }
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }
});
