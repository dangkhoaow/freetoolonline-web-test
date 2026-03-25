import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALIAS_ROUTES, JSP_BY_ROUTE, SPECIAL_ROUTES, normalizeRoute, parseSitemapRoutes } from '../../scripts/site-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const OLD_ORIGIN = process.env.OLD_ORIGIN ?? 'https://freetoolonline.com';
export const NEW_ORIGIN = process.env.NEW_ORIGIN ?? 'https://dangkhoaow.github.io/freetoolonline-web';

export async function resolveSourceRoot() {
  const candidates = [
    path.resolve(repoRoot, 'source'),
    process.env.SOURCE_REPO_ROOT,
    path.resolve(repoRoot, '..', 'freetoolonline'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return path.resolve(candidate);
    } catch {
      // Try the next candidate.
    }
  }

  throw new Error('Unable to locate the freetoolonline source snapshot. Populate ./source, set SOURCE_REPO_ROOT, or check out the source repo beside this project.');
}

export async function loadParityRoutes() {
  const sourceRoot = await resolveSourceRoot();
  const sitemapPath = path.join(sourceRoot, 'web', 'src', 'main', 'webapp', 'static', 'sitemap.xml');
  const sitemapRoutes = await parseSitemapRoutes(sitemapPath);

  return unique([
    ...sitemapRoutes,
    ...Object.keys(JSP_BY_ROUTE),
    ...Object.keys(ALIAS_ROUTES),
    ...Array.from(SPECIAL_ROUTES),
  ])
    .map(normalizeRoute)
    .filter((route) => (route === '/' || route.endsWith('.html')) && route !== '/alternatead.html');
}

export function buildRouteUrl(origin, route) {
  const baseUrl = new URL(origin.endsWith('/') ? origin : `${origin}/`);
  const url = new URL(normalizeRoute(route).replace(/^\//, ''), baseUrl);
  url.searchParams.set('noads', '1');
  return url.toString();
}

export async function prepareParityContext(context) {
  const blockedHosts = [
    '**/api.unsplash.com/**',
    '**/www.googletagmanager.com/**',
    '**/google-analytics.com/**',
    '**/pagead2.googlesyndication.com/**',
    '**/doubleclick.net/**',
  ];

  for (const pattern of blockedHosts) {
    await context.route(pattern, (route) => route.abort());
  }

  const forcedOrigin = process.env.PARITY_ALLOWED_REQUEST_ORIGIN?.trim();
  if (forcedOrigin) {
    const applyForcedOrigin = async (route) => {
      const headers = {
        ...route.request().headers(),
        origin: forcedOrigin,
      };
      await route.continue({ headers });
    };

    await context.route('**/service.us-east-1a.freetool.online/**', applyForcedOrigin);
    await context.route('**/downloader*.us-east-1a.freetool.online/**', applyForcedOrigin);
  }

  await context.addInitScript(() => {
    Math.random = () => 0.314159265;

    window.addEventListener(
      'DOMContentLoaded',
      () => {
        const style = document.createElement('style');
        style.setAttribute('data-parity', 'true');
        style.textContent = `
          *,
          *::before,
          *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
            scroll-behavior: auto !important;
          }
        `;
        (document.head || document.documentElement).appendChild(style);
      },
      { once: true },
    );
  });
}

export async function navigateAndStabilize(page, routeUrl, route) {
  await page.goto(routeUrl, { waitUntil: 'load' });
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(1200);

  if (route === '/') {
    await page.waitForFunction(() => document.querySelectorAll('#popularToolsList li').length > 0, null, {
      timeout: 10000,
    }).catch(() => {});
  }

  if (await page.locator('.uploadContainer, .uploadContainerSecond').count()) {
    await waitForSettledUploadText(page, '.target .fs-upload-target').catch(() => {});
    await waitForSettledUploadText(page, '.targetSecond .fs-upload-target').catch(() => {});
  }
}

export async function captureSnapshot(page) {
  const [title, finalUrl, fullHtml, pageState] = await Promise.all([
    page.title(),
    Promise.resolve(page.url()),
    page.content(),
    page.evaluate(() => {
      const text = (selector) => document.querySelector(selector)?.textContent ?? '';
      const html = (selector) => document.querySelector(selector)?.innerHTML ?? '';
      const count = (selector) => document.querySelectorAll(selector).length;
      const layoutSelectors = ['#content', '.page-main-content', '.page-section', '#editor-c', '#wrap', '#home', '#home-box', '.navBarContainer'];
      const layoutMetrics = {};

      for (const selector of layoutSelectors) {
        const el = document.querySelector(selector);
        if (!el) {
          continue;
        }

        const rect = el.getBoundingClientRect();
        layoutMetrics[selector] = {
          width: Math.round(rect.width),
          x: Math.round(rect.x),
        };
      }

      return {
        h1Text: text('h1'),
        canonicalHref: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
        contentHtml: html('#content'),
        layoutMetrics,
        popularToolsCount: count('#popularToolsList li'),
        searchOptionCount: count('#combobox option'),
        uploadText: text('.target .fs-upload-target'),
        uploadSecondText: text('.targetSecond .fs-upload-target'),
        bgCreditText: text('a.bg-credit'),
      };
    }),
  ]);

  return {
    title: normalizeText(title),
    finalUrl: normalizeRouteUrl(finalUrl),
    h1Text: normalizeText(pageState.h1Text),
    canonicalHref: normalizeText(pageState.canonicalHref),
    fullHtml: normalizeHtml(fullHtml),
    contentHtml: normalizeHtml(pageState.contentHtml),
    layoutMetrics: pageState.layoutMetrics,
    popularToolsCount: pageState.popularToolsCount,
    searchOptionCount: pageState.searchOptionCount,
    uploadText: normalizeUploadText(pageState.uploadText),
    uploadSecondText: normalizeUploadText(pageState.uploadSecondText),
    bgCreditText: normalizeText(pageState.bgCreditText),
  };
}

export function compareSnapshots(oldSnapshot, newSnapshot) {
  const fields = ['title', 'finalUrl', 'h1Text', 'canonicalHref', 'layoutMetrics', 'popularToolsCount', 'searchOptionCount', 'uploadText', 'uploadSecondText'];
  const diffs = [];

  for (const field of fields) {
    const oldValue = field === 'layoutMetrics' ? JSON.stringify(oldSnapshot[field]) : oldSnapshot[field];
    const newValue = field === 'layoutMetrics' ? JSON.stringify(newSnapshot[field]) : newSnapshot[field];
    if (oldValue !== newValue) {
      diffs.push({
        field,
        oldValue,
        newValue,
      });
    }
  }

  return diffs;
}

export function formatDiff(route, diffs) {
  const lines = [`Route: ${route}`, `Mismatch count: ${diffs.length}`];
  for (const diff of diffs) {
    lines.push('');
    lines.push(`Field: ${diff.field}`);
    lines.push(`Old: ${summarizeValue(diff.oldValue)}`);
    lines.push(`New: ${summarizeValue(diff.newValue)}`);
  }
  return lines.join('\n');
}

export function normalizeHtml(value) {
  return String(value ?? '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/\r\n/g, '\n')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function normalizeUploadText(value) {
  return normalizeText(String(value ?? '').replace(/\d+/g, '<n>'));
}

function summarizeValue(value) {
  const text = String(value ?? '');
  if (text.length <= 240) {
    return text;
  }

  return `${text.slice(0, 120)} … ${text.slice(-120)}`;
}

function normalizeRouteUrl(value) {
  const url = new URL(String(value ?? ''));
  const projectPrefix = new URL(NEW_ORIGIN.endsWith('/') ? NEW_ORIGIN : `${NEW_ORIGIN}/`).pathname.replace(/\/$/, '');
  const pathname = projectPrefix && url.pathname.startsWith(projectPrefix) ? url.pathname.slice(projectPrefix.length) || '/' : url.pathname;

  return normalizeText(`${pathname}${url.search}${url.hash}`);
}

async function waitForSettledUploadText(page, selector) {
  const loadingMarkers = ['Finding optimal server, please wait a second', 'Initializing, please wait a second'];
  const timeoutMs = 18000;
  const startedAt = Date.now();
  let lastStableText = '';
  let stableChecks = 0;

  while (Date.now() - startedAt < timeoutMs) {
    const text = normalizeText(await page.evaluate((currentSelector) => document.querySelector(currentSelector)?.textContent ?? '', selector));
    const isLoading = !text || loadingMarkers.some((marker) => text.includes(marker));

    if (!isLoading) {
      if (text === lastStableText) {
        stableChecks += 1;
      } else {
        lastStableText = text;
        stableChecks = 1;
      }

      if (stableChecks >= 2) {
        return text;
      }
    } else {
      lastStableText = '';
      stableChecks = 0;
    }

    await page.waitForTimeout(1000);
  }

  return lastStableText;
}

function unique(values) {
  return [...new Set(values)];
}
