import { access, copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
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
  loadCmsPageData,
  loadSharedFragments,
  loadTextIfExists,
  normalizeRoute,
  parseSitemapRoutes,
  resolveJspPathForRoute,
  stripTrailingSlash,
} from './site-data.mjs';
import { parseJspPageSource, renderAlternateAdPage, renderPageDocument, renderRedirectPage } from './page-renderer.mjs';
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
const cmsRoot = path.join(staticViewRoot, 'CMS');
const sitemapPath = path.join(staticAssetsRoot, 'sitemap.xml');
const robotsPath = path.join(staticAssetsRoot, 'robots.txt');
const adsPath = path.join(staticAssetsRoot, 'ads.txt');
const themeCssPath = path.join(tagsRoot, 'style-all-default.tag');
const runtimeConfig = await loadRuntimeConfig(staticAssetsRoot);

async function main() {
  await mkdir(distDir, { recursive: true });
  await copyStaticAssets(staticAssetsRoot, distDir);

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
  const rewriteInternalContent = createInternalContentRewriter({ siteOrigin, basePath, routeCandidates });

  const canonicalRoutes = [];
  for (const route of routeCandidates) {
    const { html, canonical } = await renderRoute(route, {
      jspIndex,
      sharedFragments,
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

  await writeSplitSitemaps({ distDir, routes: unique(canonicalRoutes), origin: canonicalOrigin, isStaging });

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

async function renderRoute(route, { jspIndex, sharedFragments, canonicalOrigin, basePath, isStaging, rewriteInternalContent }) {
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
