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

    const finalScrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const effectiveScrollHeight = Math.max(layout.scrollHeight, finalScrollHeight);
    console.log(`[homepage-test] ${label} effectiveScrollHeight=${effectiveScrollHeight}`);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);

    const viewport = page.viewportSize();
    const screenshotHeight = Math.min(effectiveScrollHeight, 6000);
    if (viewport && viewport.height !== screenshotHeight) {
      console.log(`[homepage-test] ${label} resizeViewport height=${viewport.height} -> ${screenshotHeight}`);
      await page.setViewportSize({ width: viewport.width, height: screenshotHeight });
      await page.waitForTimeout(150);
    }

    const backgroundCheck = await page.evaluate(() => {
      const html = document.documentElement;
      const footer = document.querySelector('footer.page-footer');
      const htmlStyle = getComputedStyle(html);
      const footerStyle = footer ? getComputedStyle(footer) : null;
      return {
        isHome: html.classList.contains('page-root'),
        htmlBgColor: htmlStyle.backgroundColor,
        footerBgColor: footerStyle?.backgroundColor ?? null,
      };
    });
    if (backgroundCheck.isHome) {
      console.log(`[homepage-test] ${label} htmlBgColor=${backgroundCheck.htmlBgColor} footerBgColor=${backgroundCheck.footerBgColor}`);
      expect(backgroundCheck.footerBgColor, `${label} footer should be transparent on homepage background`).toBe('rgba(0, 0, 0, 0)');
    }

    if (label === '1024' || label === '1440') {
      const alignment = await page.evaluate(() => {
        const box = (el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
        };

        const mainText = document.querySelector('#home .main-text');
        const leftCol = document.querySelector('#home .main-text > .w3-row-padding > .w3-col.l7');
        const popularCard = document.querySelector('#home .relatedToolsSection .w3-card');
        const footerInner = document.querySelector('footer.page-footer .footer-inner');

        return {
          mainText: box(mainText),
          leftCol: box(leftCol),
          popularCard: box(popularCard),
          footerInner: box(footerInner),
        };
      });

      console.log(`[homepage-test] ${label} alignment=${JSON.stringify(alignment)}`);
      if (alignment.mainText && alignment.footerInner) {
        const delta = Math.abs(alignment.mainText.x - alignment.footerInner.x);
        expect(delta, `${label} sections should align with footer (delta=${delta})`).toBeLessThanOrEqual(1);
      }
      if (alignment.leftCol && alignment.mainText) {
        const delta = Math.abs(alignment.leftCol.x - alignment.mainText.x);
        expect(delta, `${label} hero left column should align with section cards (delta=${delta})`).toBeLessThanOrEqual(1);
      }
      if (alignment.popularCard && alignment.mainText) {
        const delta = Math.abs(alignment.popularCard.x - alignment.mainText.x);
        expect(delta, `${label} section cards should align with main-text (delta=${delta})`).toBeLessThanOrEqual(1);
      }
    }

    if (label === '1024' || label === '1440') {
      const cookieReady = await page.locator('.ccInfo').first().waitFor({ state: 'attached', timeout: 5000 }).then(() => true).catch(() => false);
      if (!cookieReady) {
        console.log(`[homepage-test] ${label} cookieBanner=missing`);
      } else {
        const cookieOverlap = await page.evaluate(() => {
          const cookie = document.querySelector('.ccInfo');
          const copyCard = Array.from(document.querySelectorAll('.main-text .w3-card.w3-white')).find((el) => (el.textContent || '').includes('Get more done in one place'));
          if (!cookie || !copyCard) return { ok: false, overlappingTextCount: 0 };

          const toRect = (el) => {
            const r = el.getBoundingClientRect();
            return { x: r.x, y: r.y, w: r.width, h: r.height };
          };
          const intersects = (a, b) => {
            const ax2 = a.x + a.w;
            const ay2 = a.y + a.h;
            const bx2 = b.x + b.w;
            const by2 = b.y + b.h;
            return a.x < bx2 && ax2 > b.x && a.y < by2 && ay2 > b.y;
          };

          const cookieRect = toRect(cookie);
          const texts = Array.from(copyCard.querySelectorAll('p, li')).map((el) => ({ rect: toRect(el) }));
          const overlappingTextCount = texts.filter((t) => intersects(cookieRect, t.rect)).length;

          return {
            ok: true,
            cookieRect: { x: Math.round(cookieRect.x), y: Math.round(cookieRect.y), w: Math.round(cookieRect.w), h: Math.round(cookieRect.h) },
            overlappingTextCount,
          };
        });

        console.log(`[homepage-test] ${label} cookieOverlapTextCount=${cookieOverlap.overlappingTextCount} cookieRect=${cookieOverlap.cookieRect ? JSON.stringify(cookieOverlap.cookieRect) : 'n/a'}`);
        expect(cookieOverlap.overlappingTextCount, `${label} cookie banner should not cover homepage copy`).toBe(0);
      }
    }

    const screenshotPath = path.join(screenshotDir, `homepage-${label}.png`);
    console.log(`[homepage-test] ${label} screenshot=${screenshotPath}`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
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
