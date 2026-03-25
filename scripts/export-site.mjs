import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ALIAS_ROUTES,
  DEFAULT_ALTER_UPLOADER_DELAY_MS,
  DEFAULT_API_ORIGIN,
  DEFAULT_APP_VERSION,
  DEFAULT_BGS_COLLECTION,
  DEFAULT_IO_INFOS,
  DEFAULT_IO_VERSION,
  DEFAULT_RANDOM_STRING,
  DEFAULT_SHORTEN_DOMAIN,
  DEFAULT_SITE_ORIGIN,
  DEFAULT_UNSPLASH_KEY,
  JSP_BY_ROUTE,
  SPECIAL_ROUTES,
  buildJspIndex,
  canonicalForRoute,
  loadCmsPageData,
  loadSharedFragments,
  loadTextIfExists,
  normalizeRoute,
  parseSitemapRoutes,
  resolveJspPathForRoute,
  stripTrailingSlash,
} from './site-data.mjs';
import { parseJspPageSource, renderAlternateAdPage, renderPageDocument, renderRedirectPage } from './page-renderer.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.resolve(repoRoot, process.env.DIST_DIR ?? 'dist');
const siteOrigin = stripTrailingSlash(process.env.SITE_URL ?? DEFAULT_SITE_ORIGIN);
const apiOrigin = ensureTrailingSlash(process.env.API_ORIGIN ?? DEFAULT_API_ORIGIN);
const shortenDomain = stripTrailingSlash(process.env.SHORTEN_DOMAIN ?? DEFAULT_SHORTEN_DOMAIN);
const runtimeConfig = {
  appVersion: process.env.APP_VERSION ?? DEFAULT_APP_VERSION,
  ioVersion: process.env.IO_VERSION ?? DEFAULT_IO_VERSION,
  unsplashKey: process.env.UNSPLASH_KEY ?? DEFAULT_UNSPLASH_KEY,
  randomString: process.env.RANDOM_STRING ?? DEFAULT_RANDOM_STRING,
  bgsCollection: process.env.BGS_COLLECTION ?? DEFAULT_BGS_COLLECTION,
  ioInfos: process.env.IO_INFOS ?? DEFAULT_IO_INFOS,
  getAlterUploaderDelayMs: process.env.GET_ALTER_UPLOADER_DELAY_MS ?? DEFAULT_ALTER_UPLOADER_DELAY_MS,
};

const sourceRepoRoot = await resolveSourceRepoRoot();
const sourceWebRoot = path.join(sourceRepoRoot, 'web', 'src', 'main', 'webapp');
const jspRoot = path.join(sourceWebRoot, 'WEB-INF', 'jsp');
const tagsRoot = path.join(sourceWebRoot, 'WEB-INF', 'tags');
const staticViewRoot = path.join(sourceRepoRoot, 'static', 'src', 'main', 'webapp', 'resources', 'view');
const staticAssetsRoot = path.join(sourceWebRoot, 'static');
const cmsRoot = path.join(staticViewRoot, 'CMS');
const sitemapPath = path.join(staticAssetsRoot, 'sitemap.xml');
const robotsPath = path.join(staticAssetsRoot, 'robots.txt');
const adsPath = path.join(staticAssetsRoot, 'ads.txt');
const themeCssPath = path.join(tagsRoot, 'style-all-default.tag');

async function main() {
  await mkdir(distDir, { recursive: true });

  const jspIndex = await buildJspIndex(jspRoot);
  const sharedFragments = await loadSharedFragments(staticViewRoot, themeCssPath);
  const sitemapRoutes = await parseSitemapRoutes(sitemapPath);
  const routeCandidates = unique([
    ...sitemapRoutes,
    ...Object.keys(JSP_BY_ROUTE),
    ...Object.keys(ALIAS_ROUTES),
    ...Array.from(SPECIAL_ROUTES),
  ])
    .map(normalizeRoute)
    .filter((route) => route === '/' || route.endsWith('.html'));

  const canonicalRoutes = [];
  for (const route of routeCandidates) {
    const { html, canonical } = await renderRoute(route, { jspIndex, sharedFragments });
    await writeOutput(outputPathForRoute(route), html);
    if (canonical) {
      canonicalRoutes.push(route);
    }
    console.log(`Exported ${route} -> ${outputPathForRoute(route)}`);
  }

  const sourceRobotsTxt = (await loadTextIfExists(robotsPath)).trim();
  const sourceAdsTxt = (await loadTextIfExists(adsPath)).trim();

  await writeGeneratedSitemap(unique(canonicalRoutes));
  await writeRootTextFile('robots.txt', buildRobotsTxt(sourceRobotsTxt));
  await writeRootTextFile('ads.txt', sourceAdsTxt ? `${sourceAdsTxt}\n` : '');
  await writeFile(path.join(distDir, '.nojekyll'), '');
  await writeFile(path.join(distDir, 'CNAME'), `${new URL(siteOrigin).hostname}\n`);

  console.log(`Rendered ${routeCandidates.length} routes and published ${canonicalRoutes.length} pages to ${distDir}`);
}

async function renderRoute(route, { jspIndex, sharedFragments }) {
  const normalizedRoute = normalizeRoute(route);

  if (Object.prototype.hasOwnProperty.call(ALIAS_ROUTES, normalizedRoute)) {
    return {
      html: renderRedirectPage({ siteOrigin, sourceRoute: normalizedRoute, targetRoute: ALIAS_ROUTES[normalizedRoute] }),
      canonical: false,
    };
  }

  if (SPECIAL_ROUTES.has(normalizedRoute)) {
    return {
      html: renderAlternateAdPage({ siteOrigin }),
      canonical: false,
    };
  }

  const jspPath = resolveJspPathForRoute(normalizedRoute, jspIndex);
  if (!jspPath) {
    throw new Error(`No JSP mapping found for ${normalizedRoute}`);
  }

  const jspSource = await loadTextIfExists(path.join(jspRoot, jspPath));
  if (!jspSource) {
    throw new Error(`Missing JSP source at ${jspPath}`);
  }

  const { attrs: pageAttrs, innerHtml: bodyHtml } = parseJspPageSource(jspSource);
  const pageData = await loadCmsPageData(cmsRoot, normalizedRoute);

  return {
    html: renderPageDocument({
      route: normalizedRoute,
      siteOrigin,
      apiOrigin,
      shortenDomain,
      appVersion: runtimeConfig.appVersion,
      ioVersion: runtimeConfig.ioVersion,
      getAlterUploaderDelayMs: runtimeConfig.getAlterUploaderDelayMs,
      bgsCollection: runtimeConfig.bgsCollection,
      ioInfos: runtimeConfig.ioInfos,
      unsplashKey: runtimeConfig.unsplashKey,
      randomString: runtimeConfig.randomString,
      sharedFragments,
      pageData,
      pageAttrs,
      bodyHtml,
      themeCss: sharedFragments.themeCss,
    }),
    canonical: true,
  };
}

async function writeOutput(outputPath, contents) {
  const fullOutputPath = path.join(distDir, outputPath);
  await mkdir(path.dirname(fullOutputPath), { recursive: true });
  await writeFile(fullOutputPath, contents, 'utf8');
}

function outputPathForRoute(route) {
  const pathname = normalizeRoute(route);
  if (pathname === '/' || pathname === '') {
    return 'index.html';
  }
  if (pathname.endsWith('/')) {
    return path.posix.join(pathname.slice(1), 'index.html');
  }
  return pathname.replace(/^\/+/, '');
}

async function writeRootTextFile(name, content) {
  await writeFile(path.join(distDir, name), content, 'utf8');
}

function buildRobotsTxt(sourceRobotsTxt) {
  const sitemapUrl = new URL('/sitemap.xml', siteOrigin).href;
  if (!sourceRobotsTxt) {
    return `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`;
  }

  if (/^Sitemap:/im.test(sourceRobotsTxt)) {
    return sourceRobotsTxt.replace(/^Sitemap:.*$/gim, `Sitemap: ${sitemapUrl}`);
  }

  return `${sourceRobotsTxt.trim()}\nSitemap: ${sitemapUrl}\n`;
}

async function writeGeneratedSitemap(routes) {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map((route) => `  <url><loc>${canonicalForRoute(siteOrigin, route)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
  await writeFile(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
}

async function resolveSourceRepoRoot() {
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

function ensureTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

function unique(values) {
  return [...new Set(values)];
}

await main();
