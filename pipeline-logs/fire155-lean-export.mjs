#!/usr/bin/env node
import { access, copyFile, mkdir, readdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_API_ORIGIN, DEFAULT_APP_VERSION, DEFAULT_BGS_COLLECTION, DEFAULT_IO_INFOS,
  DEFAULT_IO_VERSION, DEFAULT_RANDOM_STRING, DEFAULT_SHORTEN_DOMAIN, DEFAULT_SITE_ORIGIN,
  DEFAULT_UNSPLASH_KEY, JSP_BY_ROUTE, buildJspIndex, loadCmsPageData, loadSharedFragments,
  loadTextIfExists, normalizeRoute, resolveJspPathForRoute, stripTrailingSlash,
} from '../scripts/site-data.mjs';
import { parseJspPageSource, renderPageDocument } from '../scripts/page-renderer.mjs';
import { resolvePageMtime } from '../scripts/page-mtimes.mjs';
import { createInternalContentRewriter, normalizeBasePath } from '../scripts/staging-utils.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.resolve(repoRoot, 'dist');
const siteOrigin = stripTrailingSlash(process.env.SITE_URL ?? 'https://dangkhoaow.github.io/freetoolonline-web-test');
const canonicalOrigin = stripTrailingSlash(DEFAULT_SITE_ORIGIN);
const basePath = normalizeBasePath(process.env.BASE_PATH ?? '/freetoolonline-web-test');
const ROUTES = ['/games/quantum-shift.html','/guides/how-to-play-quantum-shift.html','/guides/quantum-shift-when.html','/guides/quantum-shift-vs-alternatives.html'];

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  for (const ent of await readdir(src, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue;
    const s = path.join(src, ent.name), d = path.join(dest, ent.name);
    if (ent.isDirectory()) await copyDir(s, d); else await copyFile(s, d);
  }
}
const sourceWebRoot = path.join(repoRoot, 'source/web/src/main/webapp');
const staticRoot = path.join(sourceWebRoot, 'static');
const cmsRoot = path.join(repoRoot, 'source/static/src/main/webapp/resources/view/CMS');
const jspRoot = path.join(sourceWebRoot, 'WEB-INF/jsp');
await mkdir(distDir, { recursive: true });
for (const rel of ['script', 'img', 'games/quantum-shift']) {
  try { await access(path.join(staticRoot, rel)); await copyDir(path.join(staticRoot, rel), path.join(distDir, rel)); console.log('copied', rel); }
  catch { console.warn('skip', rel); }
}
const jspIndex = await buildJspIndex(jspRoot);
const sharedFragments = await loadSharedFragments(path.join(repoRoot, 'source/static/src/main/webapp/resources/view'));
const rewriteInternalContent = createInternalContentRewriter({ siteOrigin, basePath, routeCandidates: Object.keys(JSP_BY_ROUTE) });
for (const route of ROUTES) {
  const normalizedRoute = normalizeRoute(route);
  const jspPath = resolveJspPathForRoute(normalizedRoute, jspIndex);
  const jspSource = await loadTextIfExists(path.join(jspRoot, jspPath));
  const { attrs: pageAttrs, innerHtml: bodyHtml } = parseJspPageSource(jspSource);
  const pageData = await loadCmsPageData(cmsRoot, normalizedRoute);
  const lastUpdatedIso = await resolvePageMtime({ repoRoot, cmsRoot, jspRoot, slug: pageData.slug, jspRelativePath: jspPath });
  const html = await renderPageDocument({
    route: normalizedRoute, siteOrigin, canonicalOrigin, basePath, isStaging: true, rewriteInternalContent,
    apiOrigin: DEFAULT_API_ORIGIN, shortenDomain: DEFAULT_SHORTEN_DOMAIN, appVersion: DEFAULT_APP_VERSION,
    ioVersion: DEFAULT_IO_VERSION, deploySha: 'fire155', getAlterUploaderDelayMs: () => 0,
    bgsCollection: DEFAULT_BGS_COLLECTION, ioInfos: DEFAULT_IO_INFOS, unsplashKey: DEFAULT_UNSPLASH_KEY,
    randomString: DEFAULT_RANDOM_STRING, sharedFragments, lMenu: sharedFragments.lMenu, pageData, pageAttrs,
    bodyHtml, themeCss: '', aggregateRating: null, relatedToolsData: null, lastUpdatedIso,
  });
  const out = path.join(distDir, normalizedRoute.replace(/^\//, ''));
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, html);
  console.log('rendered', route, html.length);
}
const pageHtml = await readFile(path.join(distDir, 'games/quantum-shift.html'), 'utf8');
const checks = {
  playBtn: /id=["']qsPlayBtn["']/.test(pageHtml),
  headerIcon: /quantumshift__[a-f0-9]{8}\.svg/.test(pageHtml),
  og: /quantumshift\.png/.test(pageHtml),
  touch: /quantumshift-180\.png/.test(pageHtml),
};
console.log('enrollment', checks);
if (!checks.playBtn || !checks.headerIcon || !checks.og) process.exit(2);
console.log('LEAN_EXPORT_OK');
