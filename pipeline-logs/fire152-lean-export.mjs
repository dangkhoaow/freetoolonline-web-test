#!/usr/bin/env node
/** fire152: lean export of bounce-back routes + static game assets for PROVE */
import { access, copyFile, mkdir, readdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ALIAS_ROUTES,
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
  buildJspIndex,
  loadCmsPageData,
  loadSharedFragments,
  loadTextIfExists,
  normalizeRoute,
  resolveJspPathForRoute,
  stripTrailingSlash,
} from '../scripts/site-data.mjs';
import { parseJspPageSource, renderPageDocument } from '../scripts/page-renderer.mjs';
import { resolvePageMtime } from '../scripts/page-mtimes.mjs';
import { createInternalContentRewriter, normalizeBasePath } from '../scripts/staging-utils.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.resolve(repoRoot, 'dist');
const isStaging = true;
const siteOrigin = stripTrailingSlash(process.env.SITE_URL ?? 'https://dangkhoaow.github.io/freetoolonline-web-test');
const canonicalOrigin = stripTrailingSlash(DEFAULT_SITE_ORIGIN);
const basePath = normalizeBasePath(process.env.BASE_PATH ?? '/freetoolonline-web-test');
const apiOrigin = DEFAULT_API_ORIGIN;
const shortenDomain = DEFAULT_SHORTEN_DOMAIN;

const ROUTES = [
  '/games/bounce-back.html',
  '/guides/how-to-play-bounce-back.html',
  '/guides/bounce-back-when.html',
  '/guides/bounce-back-vs-alternatives.html',
];

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  for (const ent of await readdir(src, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue;
    const s = path.join(src, ent.name);
    const d = path.join(dest, ent.name);
    if (ent.isDirectory()) await copyDir(s, d);
    else await copyFile(s, d);
  }
}

const sourceWebRoot = path.join(repoRoot, 'source/web/src/main/webapp');
const staticRoot = path.join(sourceWebRoot, 'static');
const cmsRoot = path.join(repoRoot, 'source/static/src/main/webapp/resources/view/CMS');
const jspRoot = path.join(sourceWebRoot, 'WEB-INF/jsp');

await mkdir(distDir, { recursive: true });
// Minimal static shell assets
for (const rel of ['css', 'script', 'fonts', 'img', 'games/bounce-back']) {
  const src = path.join(staticRoot, rel);
  try {
    await access(src);
    await copyDir(src, path.join(distDir, rel));
    console.log('copied', rel);
  } catch {
    console.warn('skip missing', rel);
  }
}

const jspIndex = await buildJspIndex(jspRoot);
const sharedFragments = await loadSharedFragments(path.join(repoRoot, 'source/static/src/main/webapp/resources/view'));
const rewriteInternalContent = createInternalContentRewriter({
  siteOrigin,
  basePath,
  routeCandidates: Object.keys(JSP_BY_ROUTE),
});

for (const route of ROUTES) {
  const normalizedRoute = normalizeRoute(route);
  const jspPath = resolveJspPathForRoute(normalizedRoute, jspIndex);
  if (!jspPath) throw new Error('no jsp for ' + route);
  const jspSource = await loadTextIfExists(path.join(jspRoot, jspPath));
  const { attrs: pageAttrs, innerHtml: bodyHtml } = parseJspPageSource(jspSource);
  const pageData = await loadCmsPageData(cmsRoot, normalizedRoute);
  const lastUpdatedIso = await resolvePageMtime({
    repoRoot,
    cmsRoot,
    jspRoot,
    slug: pageData.slug,
    jspRelativePath: jspPath,
  });
  const html = await renderPageDocument({
    route: normalizedRoute,
    siteOrigin,
    canonicalOrigin,
    basePath,
    isStaging,
    rewriteInternalContent,
    apiOrigin,
    shortenDomain,
    appVersion: DEFAULT_APP_VERSION,
    ioVersion: DEFAULT_IO_VERSION,
    deploySha: 'fire152',
    getAlterUploaderDelayMs: () => 0,
    bgsCollection: DEFAULT_BGS_COLLECTION,
    ioInfos: DEFAULT_IO_INFOS,
    unsplashKey: DEFAULT_UNSPLASH_KEY,
    randomString: DEFAULT_RANDOM_STRING,
    sharedFragments,
    lMenu: sharedFragments.lMenu,
    pageData,
    pageAttrs,
    bodyHtml,
    themeCss: '',
    aggregateRating: null,
    relatedToolsData: null,
    lastUpdatedIso,
  });
  const out = path.join(distDir, normalizedRoute.replace(/^\//, ''));
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, html);
  console.log('rendered', route, '->', out, html.length);
}

// Header enrollment smoke check
const pageHtml = await readFile(path.join(distDir, 'games/bounce-back.html'), 'utf8');
const checks = {
  playBtn: /id=["']bbPlayBtn["']/.test(pageHtml),
  headerIcon: /bounceback__[a-f0-9]{8}\.svg/.test(pageHtml),
  og: /bounceback\.png/.test(pageHtml),
  touch: /bounceback-180\.png/.test(pageHtml),
};
console.log('enrollment', checks);
if (!checks.playBtn || !checks.headerIcon || !checks.og) {
  console.error('LEAN_EXPORT enrollment incomplete');
  process.exit(2);
}
console.log('LEAN_EXPORT_OK');
