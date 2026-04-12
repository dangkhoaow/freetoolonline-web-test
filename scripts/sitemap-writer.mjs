import { unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { INFO_ROUTES, canonicalForRoute, normalizeRoute } from './site-data.mjs';

const SITEMAP_FILES = ['sitemap.xml', 'sitemap-tools.xml', 'sitemap-hubs.xml', 'sitemap-pages.xml'];

function unique(values) {
  return [...new Set(values)];
}

function buildUrlSetXml(routes, origin) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map((route) => `  <url><loc>${canonicalForRoute(origin, route)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
}

function buildSitemapIndexXml(origin) {
  const sitemapFiles = ['sitemap-tools.xml', 'sitemap-hubs.xml', 'sitemap-pages.xml'];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapFiles.map((filename) => `  <sitemap><loc>${canonicalForRoute(origin, `/${filename}`)}</loc></sitemap>`),
    '</sitemapindex>',
    '',
  ].join('\n');
}

async function writeTextFile(distDir, filename, contents) {
  await writeFile(path.join(distDir, filename), contents, 'utf8');
}

async function removeSitemapFiles(distDir) {
  await Promise.all(SITEMAP_FILES.map((filename) => unlink(path.join(distDir, filename)).catch(() => {})));
}

export async function writeSplitSitemaps({ distDir, routes, origin, isStaging }) {
  if (isStaging) {
    await removeSitemapFiles(distDir);
    return;
  }

  const normalizedRoutes = unique(routes.map(normalizeRoute));
  const hubRoutes = normalizedRoutes.filter((route) => route.endsWith('-tools.html'));
  const pageRoutes = [...INFO_ROUTES].filter((route) => normalizedRoutes.includes(route));
  const toolRoutes = normalizedRoutes.filter((route) => route !== '/' && !INFO_ROUTES.has(route) && !route.endsWith('-tools.html'));

  await writeTextFile(distDir, 'sitemap-tools.xml', buildUrlSetXml(toolRoutes, origin));
  await writeTextFile(distDir, 'sitemap-hubs.xml', buildUrlSetXml(hubRoutes, origin));
  await writeTextFile(distDir, 'sitemap-pages.xml', buildUrlSetXml(pageRoutes, origin));
  await writeTextFile(distDir, 'sitemap.xml', buildSitemapIndexXml(origin));
}
