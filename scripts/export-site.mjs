import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.resolve(repoRoot, process.env.DIST_DIR ?? 'dist');
const sourceBase = normalizeUrl(process.env.SOURCE_URL ?? 'https://freetoolonline.com/');
const siteBase = normalizeUrl(process.env.SITE_URL ?? sourceBase);
const apiOrigin = normalizeUrl(process.env.API_ORIGIN ?? 'https://service.us-east-1a.freetool.online/');
const renderDelayMs = Number(process.env.RENDER_DELAY_MS ?? 2500);

async function main() {
  await mkdir(distDir, { recursive: true });

  const sitemapXml = await fetchText(new URL('/sitemap.xml', sourceBase));
  const pageUrls = unique([
    ...extractUrlsFromSitemap(sitemapXml, sourceBase),
    new URL('/', sourceBase).href,
    new URL('/about-us.html', sourceBase).href,
    new URL('/contact-us.html', sourceBase).href,
    new URL('/privacy-policy.html', sourceBase).href,
    new URL('/tags.html', sourceBase).href,
  ]).filter((url) => isExportablePage(url));

  const browser = await chromium.launch({ headless: true });
  let exportedCount = 0;
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 2000 },
      ignoreHTTPSErrors: true,
    });

    const exportedPageUrls = [];
    for (const pageUrl of pageUrls) {
      try {
        await exportPage(context, pageUrl);
        exportedPageUrls.push(pageUrl);
        exportedCount += 1;
      } catch (error) {
        console.warn(`Skipped ${pageUrl}: ${error.message}`);
      }
    }

    await writeGeneratedSitemap(exportedPageUrls);
  } finally {
    await browser.close();
  }

  await writeRootTextFile('robots.txt', await buildRobotsTxt());
  await writeRootTextFile('ads.txt', await fetchOptionalText(new URL('/ads.txt', sourceBase)) ?? '');
  await writeFile(path.join(distDir, '.nojekyll'), '');
  await writeFile(path.join(distDir, 'CNAME'), new URL(siteBase).hostname + '\n');

  console.log(`Exported ${exportedCount} pages to ${distDir}`);
}

async function exportPage(context, pageUrl) {
  const page = await context.newPage();
  try {
    await page.goto(pageUrl, { waitUntil: 'load', timeout: 120000 });
    await page.waitForTimeout(renderDelayMs);

    let html = await page.content();
    html = rewriteBaseDomain(html, sourceBase, siteBase);
    html = injectApiOriginOverride(html, apiOrigin);

    const outputPath = outputPathForUrl(pageUrl);
    const fullOutputPath = path.join(distDir, outputPath);
    await mkdir(path.dirname(fullOutputPath), { recursive: true });
    await writeFile(fullOutputPath, html, 'utf8');
    console.log(`Exported ${new URL(pageUrl).pathname || '/'} -> ${outputPath}`);
  } finally {
    await page.close();
  }
}

function outputPathForUrl(pageUrl) {
  const url = new URL(pageUrl);
  const pathname = decodeURIComponent(url.pathname);
  if (pathname === '/' || pathname === '') {
    return 'index.html';
  }
  if (pathname.endsWith('/')) {
    return path.posix.join(pathname.slice(1), 'index.html');
  }
  return pathname.replace(/^\/+/, '');
}

function injectApiOriginOverride(html, origin) {
  const override = `<script>window.getRootPath=function(){return ${JSON.stringify(origin)};};</script>`;
  const getRootPathPattern = /(?:var\s+)?(?:window\.)?getRootPath\s*=\s*function\s*\(\)\s*\{\s*return\s*['"][^'"]*['"];\s*\};/g;
  const rewritten = html.replace(getRootPathPattern, `window.getRootPath=function(){return ${JSON.stringify(origin)};};`);
  if (rewritten.includes(override)) {
    return rewritten;
  }
  return rewritten.replace(/<\/head>/i, `${override}\n</head>`);
}

function rewriteBaseDomain(html, from, to) {
  if (from === to) {
    return html;
  }
  return html
    .split(from)
    .join(to)
    .split(stripTrailingSlash(from))
    .join(stripTrailingSlash(to));
}

async function writeRootTextFile(name, content) {
  await writeFile(path.join(distDir, name), content, 'utf8');
}

async function buildRobotsTxt() {
  const sourceRobots = await fetchOptionalText(new URL('/robots.txt', sourceBase));
  if (!sourceRobots) {
    return `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', siteBase).href}\n`;
  }

  const sitemapUrl = new URL('/sitemap.xml', siteBase).href;
  if (/^Sitemap:/im.test(sourceRobots)) {
    return sourceRobots.replace(/^Sitemap:.*$/gim, `Sitemap: ${sitemapUrl}`);
  }
  return `${sourceRobots.trim()}\nSitemap: ${sitemapUrl}\n`;
}

async function writeGeneratedSitemap(pageUrls) {
  const sitemapUrlBase = siteBase;
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pageUrls.map((pageUrl) => `  <url><loc>${new URL(new URL(pageUrl).pathname, sitemapUrlBase).href}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
  await writeFile(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url.href}: ${response.status}`);
  }
  return await response.text();
}

async function fetchOptionalText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }
  return await response.text();
}

function extractUrlsFromSitemap(xml, baseUrl) {
  const urls = [];
  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/gims)) {
    try {
      const url = new URL(match[1].trim(), baseUrl);
      if (isExportablePage(url.href)) {
        urls.push(url.href);
      }
    } catch {
      // Ignore malformed entries.
    }
  }
  return urls;
}

function isExportablePage(pageUrl) {
  const pathname = new URL(pageUrl).pathname;
  return pathname === '/' || pathname.endsWith('.html');
}

function normalizeUrl(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

function stripTrailingSlash(value) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function unique(values) {
  return [...new Set(values)];
}

await main();
