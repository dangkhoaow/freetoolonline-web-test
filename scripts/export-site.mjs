import { access, copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
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
  isInfoRoute,
  buildJspIndex,
  loadCmsPageData,
  loadSharedFragments,
  loadTextIfExists,
  normalizeRoute,
  parseSitemapRoutes,
  resolveJspPathForRoute,
  stripTrailingSlash,
} from './site-data.mjs';
import { parseJspPageSource, renderAlternateAdPage, renderPageDocument, renderRedirectPage } from './page-renderer.mjs';
import { resolvePageMtime } from './page-mtimes.mjs';
import { createInternalContentRewriter, normalizeBasePath } from './staging-utils.mjs';
import { writeSplitSitemaps } from './sitemap-writer.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.resolve(repoRoot, process.env.DIST_DIR ?? 'dist');
const isStaging = /^(1|true|yes)$/i.test(process.env.STAGING ?? '');
const siteOrigin = stripTrailingSlash(process.env.SITE_URL ?? DEFAULT_SITE_ORIGIN);
const canonicalOrigin = stripTrailingSlash(process.env.CANONICAL_ORIGIN ?? DEFAULT_SITE_ORIGIN);
const basePath = normalizeBasePath(process.env.BASE_PATH ?? '');
const apiOrigin = ensureTrailingSlash(process.env.API_ORIGIN ?? DEFAULT_API_ORIGIN);
const shortenDomain = stripTrailingSlash(process.env.SHORTEN_DOMAIN ?? DEFAULT_SHORTEN_DOMAIN);

const sourceRepoRoot = await resolveSourceRepoRoot();
const sourceWebRoot = path.join(sourceRepoRoot, 'web', 'src', 'main', 'webapp');
const jspRoot = path.join(sourceWebRoot, 'WEB-INF', 'jsp');
const tagsRoot = path.join(sourceWebRoot, 'WEB-INF', 'tags');
const staticViewRoot = path.join(sourceRepoRoot, 'static', 'src', 'main', 'webapp', 'resources', 'view');
const staticAssetsRoot = path.join(sourceWebRoot, 'static');
const runtimeViewRoot = path.join(staticAssetsRoot, 'view');
const cmsRoot = path.join(staticViewRoot, 'CMS');
const sitemapPath = path.join(staticAssetsRoot, 'sitemap.xml');
const robotsPath = path.join(staticAssetsRoot, 'robots.txt');
const adsPath = path.join(staticAssetsRoot, 'ads.txt');
const themeCssPath = path.join(tagsRoot, 'style-all-default.tag');
const runtimeConfig = await loadRuntimeConfig(staticAssetsRoot);
const deploySha = resolveDeploySha();

function resolveDeploySha() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 12);
  try {
    return execSync('git rev-parse HEAD', { cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim().slice(0, 12);
  } catch {
    return 'local-dev';
  }
}

async function main() {
  await mkdir(distDir, { recursive: true });
  await copyStaticAssets(staticAssetsRoot, distDir);

  const jspIndex = await buildJspIndex(jspRoot);
  const sharedFragments = await loadSharedFragments(staticViewRoot, runtimeViewRoot, themeCssPath);
  const relatedToolsData = await loadRelatedToolsData(staticAssetsRoot);
  const sitemapRoutes = await parseSitemapRoutes(sitemapPath);
  const routeCandidates = unique([
    ...sitemapRoutes,
    ...Object.keys(JSP_BY_ROUTE),
    ...Object.keys(ALIAS_ROUTES),
    ...Array.from(SPECIAL_ROUTES),
  ])
    .map(normalizeRoute)
    .filter((route) => route === '/' || route.endsWith('.html'));
  const rewriteInternalContent = createInternalContentRewriter({ siteOrigin, basePath, routeCandidates });

  const canonicalRoutes = [];
  for (const route of routeCandidates) {
    const { html, canonical } = await renderRoute(route, {
      jspIndex,
      sharedFragments,
      relatedToolsData,
      canonicalOrigin,
      basePath,
      isStaging,
      rewriteInternalContent,
    });
    await writeOutput(outputPathForRoute(route), html);
    if (canonical) {
      canonicalRoutes.push(route);
    }
    console.log(`Exported ${route} -> ${outputPathForRoute(route)}`);
  }

  const sourceRobotsTxt = (await loadTextIfExists(robotsPath)).trim();
  const sourceAdsTxt = (await loadTextIfExists(adsPath)).trim();

  await writeSplitSitemaps({
    distDir,
    routes: unique(canonicalRoutes),
    origin: canonicalOrigin,
    isStaging,
    cmsRoot,
  });

  await writeRootTextFile('robots.txt', buildRobotsTxt(sourceRobotsTxt, { isStaging, siteOrigin }));
  await writeRootTextFile('ads.txt', sourceAdsTxt ? `${sourceAdsTxt}\n` : '');
  await writeFile(path.join(distDir, '.nojekyll'), '');
  if (!isStaging) {
    await writeFile(path.join(distDir, 'CNAME'), `${new URL(siteOrigin).hostname}\n`);
  }

  if (isStaging) {
    await rewriteStaticAsset(path.join(distDir, 'script', 'related-tools.js'), rewriteInternalContent);
  }

  console.log(`Rendered ${routeCandidates.length} routes and published ${canonicalRoutes.length} pages to ${distDir}`);
}

async function copyStaticAssets(sourceDir, targetDir) {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }

    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await mkdir(targetPath, { recursive: true });
      await copyStaticAssets(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile()) {
      await mkdir(path.dirname(targetPath), { recursive: true });
      await copyFile(sourcePath, targetPath);
    }
  }
}

async function loadRelatedToolsData(staticAssetsRootPath) {
  const relatedToolsPath = path.join(staticAssetsRootPath, 'script', 'related-tools.js');
  const scriptSource = await loadTextIfExists(relatedToolsPath);
  if (!scriptSource) {
    console.log(`[related-tools:ssr] Missing related-tools.js at ${relatedToolsPath}.`);
    return null;
  }

  const match = scriptSource.match(/var urlMaps\s*=\s*(\[[\s\S]*?\])\s*,\s*currentTitle/);
  if (!match) {
    console.log('[related-tools:ssr] Failed to locate urlMaps array in related-tools.js.');
    return null;
  }

  try {
    const urlMaps = new Function(`return (${match[1]});`)();
    if (!Array.isArray(urlMaps)) {
      console.log('[related-tools:ssr] urlMaps payload is not an array.');
      return null;
    }
    console.log(`[related-tools:ssr] Loaded ${urlMaps.length} urlMaps entries from related-tools.js.`);
    return { urlMaps, sourcePath: relatedToolsPath };
  } catch (error) {
    console.log(`[related-tools:ssr] Failed to parse urlMaps: ${error?.message || error}.`);
    return null;
  }
}

async function renderRoute(route, { jspIndex, sharedFragments, relatedToolsData, canonicalOrigin, basePath, isStaging, rewriteInternalContent }) {
  const normalizedRoute = normalizeRoute(route);

  if (Object.prototype.hasOwnProperty.call(ALIAS_ROUTES, normalizedRoute)) {
    return {
      html: renderRedirectPage({
        siteOrigin,
        canonicalOrigin,
        sourceRoute: normalizedRoute,
        targetRoute: ALIAS_ROUTES[normalizedRoute],
      }),
      canonical: false,
    };
  }

  if (SPECIAL_ROUTES.has(normalizedRoute)) {
    return {
      html: renderAlternateAdPage({ canonicalOrigin }),
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
  // Per-page "last modified" stamp from git history of this page's CMS
  // fragments + JSP wrapper. Drives Schema.org dateModified (JSON-LD +
  // visible <time> tag). Requires `fetch-depth: 0` in the GH Actions
  // checkout step; see .github/workflows/pages.yml.
  const lastUpdatedIso = await resolvePageMtime({
    repoRoot,
    cmsRoot,
    jspRoot,
    slug: pageData.slug,
    jspRelativePath: jspPath,
  });
  const isHubPage = normalizedRoute.endsWith('-tools.html');
  const showRating = !isHubPage && !isInfoRoute(normalizedRoute) && normalizedRoute !== '/' && normalizedRoute !== '/alternatead.html';
  // P10.1.1 - AggregateRating emission gate (Path A). Until a visible rating UI
  // renders on the tool page, JSON-LD rating data violates Google's structured-data
  // visibility policy (March 2026 spam update exposure). Emission defaults OFF; flip
  // EMIT_AGGREGATE_RATING=true once a visible on-page rating block ships.
  const emitAggregateRating = process.env.EMIT_AGGREGATE_RATING === 'true';
  const aggregateRating = showRating && emitAggregateRating
    ? await loadAggregateRating({ apiOrigin, pageName: pageData.pageName, route: normalizedRoute })
    : null;
  if (!showRating) {
    console.log(`[ratings] Skip rating fetch for ${normalizedRoute} (showRating=false).`);
  } else if (!emitAggregateRating) {
    console.log(`[seo:rating] emit=false route=${normalizedRoute} reason=gated-P10.1.1.`);
  }

  return {
    html: renderPageDocument({
      route: normalizedRoute,
      siteOrigin,
      canonicalOrigin,
      basePath,
      isStaging,
      rewriteInternalContent,
      apiOrigin,
      shortenDomain,
      appVersion: runtimeConfig.appVersion,
      ioVersion: runtimeConfig.ioVersion,
      deploySha,
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
      aggregateRating,
      relatedToolsData,
      lastUpdatedIso,
    }),
    canonical: true,
  };
}

async function loadAggregateRating({ apiOrigin, pageName, route }) {
  if (!pageName) {
    console.log(`[ratings] Omit rating for ${route}: missing pageName.`);
    return null;
  }

  const ratingUrl = new URL('ajax/get-rating', apiOrigin);
  ratingUrl.searchParams.set('pageName', pageName);
  const ratingOrigin = resolveRatingOrigin(siteOrigin);
  const timeoutMs = Number.parseInt(process.env.RATING_FETCH_TIMEOUT_MS ?? '5000', 10);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  console.log(`[ratings] Fetching rating for ${pageName} (${route}) from ${ratingUrl.href} (origin=${ratingOrigin})`);

  try {
    const response = await fetch(ratingUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json; charset=UTF-8',
        Origin: ratingOrigin,
        Pragma: 'no-cache',
        Referer: `${ratingOrigin}/`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: '{}',
      signal: controller.signal,
    });
    const responseUrl = response.url;
    const contentType = response.headers.get('content-type') ?? '';
    if (!response.ok) {
      console.log(`[ratings] Omit rating for ${pageName}: HTTP ${response.status} (content-type=${contentType}, url=${responseUrl}).`);
      return null;
    }

    const payload = await response.json();
    const ratingCountRaw = payload?.total ?? payload?.ratingCount ?? payload?.reviewCount;
    const ratingValueRaw = payload?.avg ?? payload?.ratingValue;
    const ratingCount = Number.parseInt(ratingCountRaw, 10);
    const ratingValue = Number.parseFloat(ratingValueRaw);

    if (!Number.isFinite(ratingCount) || !Number.isFinite(ratingValue)) {
      console.log(`[ratings] Omit rating for ${pageName}: invalid numeric payload ${JSON.stringify(payload).slice(0, 200)} (content-type=${contentType}, url=${responseUrl}).`);
      return null;
    }

    if (ratingCount < 1 || ratingValue < 1 || ratingValue > 5) {
      console.log(`[ratings] Omit rating for ${pageName}: out-of-range avg=${ratingValue}, total=${ratingCount}.`);
      return null;
    }

    const normalizedRatingValue = Number.parseFloat(ratingValue.toFixed(1));
    console.log(`[ratings] Using rating for ${pageName}: avg=${normalizedRatingValue}, total=${ratingCount}.`);
    return { ratingValue: normalizedRatingValue, ratingCount };
  } catch (error) {
    console.log(`[ratings] Omit rating for ${pageName}: ${error instanceof Error ? error.message : 'unknown error'}.`);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeOrigin(value) {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return '';
  }
  try {
    return new URL(raw).origin;
  } catch {
    return raw.replace(/\/+$/, '');
  }
}

function resolveRatingOrigin(siteOriginValue) {
  const override = String(process.env.RATING_ORIGIN ?? '').trim();
  if (override) {
    return normalizeOrigin(override);
  }

  const origin = normalizeOrigin(siteOriginValue);
  if (/github\.io$/i.test(origin)) {
    return 'https://dangkhoaow.github.io';
  }
  return 'https://freetoolonline.com';
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

async function rewriteStaticAsset(assetPath, rewriteInternalContent) {
  const contents = await readFile(assetPath, 'utf8');
  await writeFile(assetPath, rewriteInternalContent(contents), 'utf8');
}

function buildRobotsTxt(sourceRobotsTxt, { isStaging, siteOrigin }) {
  if (isStaging) {
    return 'User-agent: *\nDisallow: /\n';
  }

  const sitemapUrl = new URL('/sitemap.xml', siteOrigin).href;
  if (!sourceRobotsTxt) {
    return `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`;
  }

  if (/^Sitemap:/im.test(sourceRobotsTxt)) {
    return sourceRobotsTxt.replace(/^Sitemap:.*$/gim, `Sitemap: ${sitemapUrl}`);
  }

  return `${sourceRobotsTxt.trim()}\nSitemap: ${sitemapUrl}\n`;
}

async function loadRuntimeConfig(staticAssetsRoot) {
  const snapshotConfigPath = path.join(staticAssetsRoot, 'runtime-config.json');
  const snapshotText = (await loadTextIfExists(snapshotConfigPath)).trim();
  const snapshot = snapshotText ? JSON.parse(snapshotText) : {};

  return {
    appVersion: snapshot.appVersion ?? DEFAULT_APP_VERSION,
    ioVersion: snapshot.ioVersion ?? DEFAULT_IO_VERSION,
    unsplashKey: snapshot.unsplashKey ?? DEFAULT_UNSPLASH_KEY,
    randomString: snapshot.randomString ?? DEFAULT_RANDOM_STRING,
    bgsCollection: snapshot.bgsCollection ?? DEFAULT_BGS_COLLECTION,
    ioInfos: snapshot.ioInfos ?? DEFAULT_IO_INFOS,
    getAlterUploaderDelayMs: snapshot.getAlterUploaderDelayMs ?? DEFAULT_ALTER_UPLOADER_DELAY_MS,
    ...(process.env.APP_VERSION ? { appVersion: process.env.APP_VERSION } : {}),
    ...(process.env.IO_VERSION ? { ioVersion: process.env.IO_VERSION } : {}),
    ...(process.env.UNSPLASH_KEY ? { unsplashKey: process.env.UNSPLASH_KEY } : {}),
    ...(process.env.RANDOM_STRING ? { randomString: process.env.RANDOM_STRING } : {}),
    ...(process.env.BGS_COLLECTION ? { bgsCollection: process.env.BGS_COLLECTION } : {}),
    ...(process.env.IO_INFOS ? { ioInfos: process.env.IO_INFOS } : {}),
    ...(process.env.GET_ALTER_UPLOADER_DELAY_MS ? { getAlterUploaderDelayMs: process.env.GET_ALTER_UPLOADER_DELAY_MS } : {}),
  };
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
