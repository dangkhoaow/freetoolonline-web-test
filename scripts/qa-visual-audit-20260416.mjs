import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium, devices } from '@playwright/test';
import {
  buildRouteUrl,
  loadParityRoutes,
  prepareParityContext,
  NEW_ORIGIN,
} from '../tests/helpers/parity.mjs';

function readArg(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) {
    return null;
  }
  return process.argv[idx + 1] ?? null;
}

function sanitizeRoute(route) {
  if (route === '/') {
    return 'home';
  }
  return route
    .replace(/^\//, '')
    .replace(/\.html$/, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

async function tryFetch(url) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    const text = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      finalUrl: res.url,
      length: text.length,
    };
  } catch (error) {
    return { ok: false, status: 0, finalUrl: url, length: 0, error: String(error?.message ?? error) };
  }
}

const outDirArg = readArg('--outDir');
if (!outDirArg) {
  // eslint-disable-next-line no-console
  console.error('Missing required arg: --outDir <path>');
  process.exit(2);
}

const outDir = path.resolve(outDirArg);
const origin = (readArg('--origin') ?? NEW_ORIGIN).replace(/\/$/, '');

// eslint-disable-next-line no-console
console.log(`[audit] outDir=${outDir}`);
// eslint-disable-next-line no-console
console.log(`[audit] origin=${origin}`);

const VIEWPORTS = [
  {
    label: '390',
    name: 'mobile-390',
    contextOptions: devices['iPhone 12'],
  },
  {
    label: '1440',
    name: 'desktop-1440',
    contextOptions: {
      viewport: { width: 1440, height: 900 },
      locale: 'en-US',
      timezoneId: 'UTC',
      colorScheme: 'light',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    },
  },
  {
    label: '1920',
    name: 'desktop-1920',
    contextOptions: {
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'UTC',
      colorScheme: 'light',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    },
  },
];

const startedAtIso = new Date().toISOString();

await fs.mkdir(outDir, { recursive: true });
await fs.mkdir(path.join(outDir, 'screenshots'), { recursive: true });
await fs.mkdir(path.join(outDir, 'diagnostic'), { recursive: true });

for (const viewport of VIEWPORTS) {
  await fs.mkdir(path.join(outDir, 'screenshots', viewport.name), { recursive: true });
  await fs.mkdir(path.join(outDir, 'diagnostic', viewport.name), { recursive: true });
}

const routes = await loadParityRoutes();

// eslint-disable-next-line no-console
console.log(`[audit] routes=${routes.length}`);

const results = {
  startedAt: startedAtIso,
  origin,
  routeCount: routes.length,
  viewports: VIEWPORTS.map((v) => ({ label: v.label, name: v.name })),
  pages: {},
  summary: {
    totalChecks: 0,
    totalFailures: 0,
    failuresByViewport: {},
    failuresByType: {},
  },
};

const fail = (viewportName, route, type, details) => {
  results.summary.totalFailures += 1;
  results.summary.failuresByViewport[viewportName] = (results.summary.failuresByViewport[viewportName] ?? 0) + 1;
  results.summary.failuresByType[type] = (results.summary.failuresByType[type] ?? 0) + 1;
  const key = `${viewportName}:${route}`;
  const pageRec = results.pages[key];
  pageRec.failures.push({ type, details });
};

let fatalError = '';

for (const viewport of VIEWPORTS) {
  // eslint-disable-next-line no-console
  console.log(`[audit] viewport ${viewport.name} (${viewport.label})`);

  let browser;
  let context;
  try {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext(viewport.contextOptions);
    await prepareParityContext(context);
    const page = await context.newPage();

    for (const route of routes) {
      const url = buildRouteUrl(origin, route);
      const key = `${viewport.name}:${route}`;
      const baseName = sanitizeRoute(route);
      const screenshotPath = path.join(outDir, 'screenshots', viewport.name, `${baseName}.png`);

      results.pages[key] = {
        viewport: viewport.name,
        viewportLabel: viewport.label,
        route,
        url,
        finalUrl: '',
        title: '',
        checks: {},
        layout: {},
        failures: [],
        screenshot: path.relative(outDir, screenshotPath),
        diagnosticScreenshots: [],
      };

      results.summary.totalChecks += 1;

      // eslint-disable-next-line no-console
      console.log(`  [route] ${route} -> ${url}`);

      let navOk = true;
      let navError = '';

      const fetched = await tryFetch(url);
      results.pages[key].checks.fetch = fetched;

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        await page
          .waitForFunction(() => window.__QA_NOADS_READY__ === true, null, { timeout: 4000 })
          .catch(() => {});
        await page.waitForTimeout(200);
      } catch (error) {
        navOk = false;
        navError = String(error?.message ?? error);
      }

      if (!navOk) {
        results.pages[key].checks.navigation = { ok: false, error: navError };
        fail(viewport.name, route, 'navigation', { error: navError, fetched });
        continue;
      }

      const pageState = await page.evaluate(() => {
        const hasHorizontalScroll =
          document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 ||
          document.body.scrollWidth > document.documentElement.clientWidth + 1;

        const readRect = (el) => {
          const r = el.getBoundingClientRect();
          return {
            left: Math.round(r.left),
            right: Math.round(r.right),
            top: Math.round(r.top),
            bottom: Math.round(r.bottom),
            width: Math.round(r.width),
            height: Math.round(r.height),
          };
        };

        const qaNoAds = document.documentElement.classList.contains('qa-noads');
        const visibleAdSections = Array.from(document.querySelectorAll('.ad-section')).filter((el) => {
          const r = el.getBoundingClientRect();
          if (Math.round(r.width) <= 0 || Math.round(r.height) <= 0) return false;
          const s = getComputedStyle(el);
          return s.display !== 'none' && s.visibility !== 'hidden';
        });

        const footerEl =
          document.querySelector('footer .footer-inner') ||
          document.querySelector('footer .w3-row.first') ||
          document.querySelector('footer');

        const homeMainTextEl = document.querySelector('#home > .main-text');
        const sectionElsRaw = Array.from(document.querySelectorAll('.page-main-content .page-section'));
        const sectionEls = sectionElsRaw.filter((el) => {
          const r = el.getBoundingClientRect();
          if (Math.round(r.width) <= 0 || Math.round(r.height) <= 0) return false;
          const s = getComputedStyle(el);
          return s.display !== 'none' && s.visibility !== 'hidden';
        });

        const heroEl = homeMainTextEl || sectionEls[0] || null;
        const heroSelector = homeMainTextEl ? '#home > .main-text' : '.page-main-content .page-section:first';

        const anchors = [];

        if (heroEl) {
          anchors.push({ name: 'main', selector: heroSelector, rect: readRect(heroEl) });
          anchors.push({ name: 'hero', selector: heroSelector, rect: readRect(heroEl) });
        }

        if (!homeMainTextEl && sectionEls.length > 0) {
          for (const [idx, el] of sectionEls.entries()) {
            anchors.push({ name: `section:${idx}`, selector: '.page-main-content .page-section', rect: readRect(el) });
          }
        }

        if (footerEl) {
          anchors.push({
            name: 'footer',
            selector: footerEl.matches('footer .footer-inner')
              ? 'footer .footer-inner'
              : footerEl.matches('footer .w3-row.first')
                ? 'footer .w3-row.first'
                : 'footer',
            rect: readRect(footerEl),
          });
        }

        const heroRect = heroEl ? readRect(heroEl) : null;
        const heroLeft = heroRect?.left ?? 0;
        const heroRight = heroRect?.right ?? 0;
        let deltaLeft = 0;
        let deltaRight = 0;
        for (const anchor of anchors) {
          deltaLeft = Math.max(deltaLeft, Math.abs(anchor.rect.left - heroLeft));
          deltaRight = Math.max(deltaRight, Math.abs(anchor.rect.right - heroRight));
        }

        return {
          title: document.title,
          finalUrl: location.href,
          hasHorizontalScroll,
          qaNoAds,
          visibleAdSectionsCount: visibleAdSections.length,
          anchors,
          hero: heroRect,
          deltas: { deltaLeft, deltaRight, heroLeft, heroRight },
        };
      });

      results.pages[key].finalUrl = pageState.finalUrl;
      results.pages[key].title = pageState.title;
      results.pages[key].checks.navigation = { ok: true };
      results.pages[key].checks.horizontalScroll = { ok: !pageState.hasHorizontalScroll };
      results.pages[key].checks.qaNoAds = { ok: Boolean(pageState.qaNoAds) };
      results.pages[key].checks.adSectionsRemoved = { ok: (pageState.visibleAdSectionsCount ?? 0) === 0, count: pageState.visibleAdSectionsCount ?? 0 };
      results.pages[key].layout.anchors = pageState.anchors;
      results.pages[key].layout.deltas = pageState.deltas;
      results.pages[key].layout.hero = pageState.hero;

      if (!pageState.qaNoAds) {
        fail(viewport.name, route, 'qa-noads-missing', { expected: true, actual: Boolean(pageState.qaNoAds) });
      }

      if ((pageState.visibleAdSectionsCount ?? 0) !== 0) {
        fail(viewport.name, route, 'ads-not-removed', { count: pageState.visibleAdSectionsCount ?? 0 });
      }

      if (pageState.hasHorizontalScroll) {
        fail(viewport.name, route, 'horizontal-scroll', {
          scrollWidth: 'documentElement/body exceeds clientWidth',
        });
      }

      const deltaLeft = pageState.deltas?.deltaLeft ?? 0;
      const deltaRight = pageState.deltas?.deltaRight ?? 0;
      const alignmentOk = deltaLeft <= 1 && deltaRight <= 1;
      results.pages[key].checks.alignment = { ok: alignmentOk, deltaLeft, deltaRight };

      if (!alignmentOk) {
        fail(viewport.name, route, 'alignment', { deltaLeft, deltaRight, anchors: pageState.anchors });
      }

      await page.screenshot({ path: screenshotPath, fullPage: true });

      if (!alignmentOk || pageState.hasHorizontalScroll) {
        const diagPath = path.join(outDir, 'diagnostic', viewport.name, `${baseName}.png`);
        await page.evaluate(() => {
          const existing = document.getElementById('__qa_guides__');
          if (existing) {
            existing.remove();
          }

          const guides = document.createElement('div');
          guides.id = '__qa_guides__';
          guides.style.position = 'fixed';
          guides.style.left = '0';
          guides.style.top = '0';
          guides.style.right = '0';
          guides.style.bottom = '0';
          guides.style.pointerEvents = 'none';
          guides.style.zIndex = '2147483647';

          const homeHero = document.querySelector('#home > .main-text');
          const hero = homeHero || document.querySelector('.page-main-content .page-section');
          const footer = document.querySelector('footer .footer-inner') || document.querySelector('footer .w3-row.first') || document.querySelector('footer');
          const sectionEls = (homeHero ? [] : Array.from(document.querySelectorAll('.page-main-content .page-section'))).filter((el) => {
            const r = el.getBoundingClientRect();
            if (Math.round(r.width) <= 0 || Math.round(r.height) <= 0) return false;
            const s = getComputedStyle(el);
            return s.display !== 'none' && s.visibility !== 'hidden';
          });
          if (!hero) {
            document.body.appendChild(guides);
            return;
          }

          const heroRect = hero.getBoundingClientRect();
          const expectedLeft = Math.round(heroRect.left);
          const expectedRight = Math.round(heroRect.right);

          const makeLine = (x, color) => {
            const line = document.createElement('div');
            line.style.position = 'absolute';
            line.style.top = '0';
            line.style.bottom = '0';
            line.style.left = `${x}px`;
            line.style.width = '2px';
            line.style.background = color;
            line.style.opacity = '0.85';
            return line;
          };

          guides.appendChild(makeLine(expectedLeft, '#00a000'));
          guides.appendChild(makeLine(expectedRight, '#00a000'));

          const candidates = [...sectionEls, footer].filter(Boolean);
          for (const el of candidates) {
            const r = el.getBoundingClientRect();
            const left = Math.round(r.left);
            const right = Math.round(r.right);
            if (Math.abs(left - expectedLeft) > 1) guides.appendChild(makeLine(left, '#ff0000'));
            if (Math.abs(right - expectedRight) > 1) guides.appendChild(makeLine(right, '#ff0000'));
          }

          document.body.appendChild(guides);
        });

        await page.screenshot({ path: diagPath, fullPage: true });
        results.pages[key].diagnosticScreenshots.push(path.relative(outDir, diagPath));
      }
    }
  } catch (error) {
    const message = String(error?.message ?? error);
    // eslint-disable-next-line no-console
    console.error(`[audit] viewport ${viewport.name} crashed: ${message}`);
    fatalError = fatalError ? `${fatalError}\n${viewport.name}: ${message}` : `${viewport.name}: ${message}`;
  } finally {
    await context?.close().catch(() => {});
    await browser?.close().catch(() => {});
  }
}

results.summary.totalFailures = Object.values(results.pages).reduce((sum, p) => sum + p.failures.length, 0);
if (fatalError) {
  results.summary.fatalError = fatalError;
}

await fs.writeFile(path.join(outDir, 'audit-results.json'), JSON.stringify(results, null, 2));

// eslint-disable-next-line no-console
console.log('[audit] complete');
// eslint-disable-next-line no-console
console.log(JSON.stringify(results.summary, null, 2));

process.exitCode = results.summary.totalFailures > 0 || fatalError ? 1 : 0;

