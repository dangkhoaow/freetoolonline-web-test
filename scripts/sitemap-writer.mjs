import { stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { INFO_ROUTES, GUIDE_ROUTES, canonicalForRoute, normalizeRoute, routeToSlug } from './site-data.mjs';

const SITEMAP_FILES = ['sitemap.xml', 'sitemap-tools.xml', 'sitemap-hubs.xml', 'sitemap-guides.xml', 'sitemap-pages.xml'];
const CMS_FILE_DEFINITIONS = [
  { prefix: 'BODYTITLE', extension: 'txt' },
  { prefix: 'BODYDESC', extension: 'txt' },
  { prefix: 'BODYKW', extension: 'txt' },
  { prefix: 'BODYHTML', extension: 'html' },
  { prefix: 'BODYJS', extension: 'html' },
  { prefix: 'BODYWELCOME', extension: 'html' },
  { prefix: 'BODYFILETYPE', extension: 'txt' },
  { prefix: 'BODYFILETYPE2', extension: 'txt' },
  { prefix: 'FAQ', extension: 'html' },
  { prefix: 'PAGESTYLE', extension: 'css' },
  { prefix: 'PAGEBROWSERTITLE', extension: 'txt' },
  { prefix: 'PAGEHASSETTINGS', extension: 'txt' },
  { prefix: 'PAGECANO', extension: 'txt' },
];

function unique(values) {
  return [...new Set(values)];
}

// Sitemap crawl-budget hints. Google treats priority as a relative signal within
// this sitemap (not absolute), and changefreq is informational - both nudge the
// crawler toward hubs/guides while letting long-tail tool pages settle to
// monthly crawl cadence. Home wins at 1.0; hubs 0.9 (entry points + largest
// internal-link aggregators); top-tier transactional tools 0.8; long-tail
// tools 0.6; guides 0.7 (stable editorial content); info pages 0.4.
function changefreqForKind(kind) {
  switch (kind) {
    case 'home': return 'daily';
    case 'hub': return 'weekly';
    case 'tool': return 'monthly';
    case 'guide': return 'monthly';
    case 'page': return 'yearly';
    default: return 'monthly';
  }
}

function priorityForKind(kind) {
  switch (kind) {
    case 'home': return '1.0';
    case 'hub': return '0.9';
    case 'tool': return '0.7';
    case 'guide': return '0.7';
    case 'page': return '0.4';
    default: return '0.5';
  }
}

function buildUrlSetXml(routes, origin, lastmodByRoute, kind = 'tool') {
  const priority = priorityForKind(kind);
  const changefreq = changefreqForKind(kind);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map((route) => {
      const normalizedRoute = normalizeRoute(route);
      const lastmod = lastmodByRoute?.get(normalizedRoute);
      const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
      const isHomeRoute = normalizedRoute === '/';
      const urlPriority = isHomeRoute ? priorityForKind('home') : priority;
      const urlChangefreq = isHomeRoute ? changefreqForKind('home') : changefreq;
      return `  <url><loc>${canonicalForRoute(origin, normalizedRoute)}</loc>${lastmodTag}<changefreq>${urlChangefreq}</changefreq><priority>${urlPriority}</priority></url>`;
    }),
    '</urlset>',
    '',
  ].join('\n');
}

function buildCmsFileCandidates(route) {
  const slug = routeToSlug(route);
  return CMS_FILE_DEFINITIONS.map(({ prefix, extension }) => (
    slug ? `${prefix}${slug}.${extension}` : `${prefix}.${extension}`
  ));
}

async function resolveLastmodForRoute({ route, cmsRoot, fallbackLastmod }) {
  const normalizedRoute = normalizeRoute(route);
  if (!cmsRoot) {
    console.log(`[sitemap] lastmod fallback for ${normalizedRoute}: cmsRoot missing.`);
    return fallbackLastmod;
  }

  const candidates = buildCmsFileCandidates(normalizedRoute);
  let newestMtimeMs = 0;
  let matchedCount = 0;

  for (const candidate of candidates) {
    const candidatePath = path.join(cmsRoot, candidate);
    try {
      const stats = await stat(candidatePath);
      matchedCount += 1;
      if (stats.mtimeMs > newestMtimeMs) {
        newestMtimeMs = stats.mtimeMs;
      }
    } catch {
      // Ignore missing files.
    }
  }

  if (!matchedCount) {
    console.log(`[sitemap] lastmod fallback for ${normalizedRoute}: no CMS files.`);
    return fallbackLastmod;
  }

  const lastmod = new Date(newestMtimeMs).toISOString();
  console.log(`[sitemap] lastmod for ${normalizedRoute}: ${lastmod} (sources=${matchedCount}).`);
  return lastmod;
}

function buildSitemapIndexXml(origin) {
  // Order: tools (largest, most crawled) → hubs → guides (long-form editorial,
  // distinct content kind) → pages (home + info: about, contact, privacy, tags).
  // Each child sitemap groups a homogeneous content kind so search engines see
  // focused <lastmod> changes per kind rather than mixed updates.
  const sitemapFiles = ['sitemap-tools.xml', 'sitemap-hubs.xml', 'sitemap-guides.xml', 'sitemap-pages.xml'];
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

export async function writeSplitSitemaps({ distDir, routes, origin, isStaging, cmsRoot }) {
  if (isStaging) {
    await removeSitemapFiles(distDir);
    return;
  }

  const normalizedRoutes = unique(routes.map(normalizeRoute));
  const hubRoutes = normalizedRoutes.filter((route) => route.endsWith('-tools.html'));
  // Guides are a subset of INFO_ROUTES but represent a distinct content kind
  // (long-form editorial). Split them into their own sitemap group so search
  // engines can see guide-group <lastmod> changes separately from info-page
  // updates and so the guide group can scale independently as more pillars
  // land. GUIDE_ROUTES is the source of truth (site-data.mjs §3.3).
  const guideRoutes = [...GUIDE_ROUTES].filter((route) => normalizedRoutes.includes(route));
  const guideRouteSet = new Set(guideRoutes);
  const pageRoutes = [...INFO_ROUTES]
    .filter((route) => normalizedRoutes.includes(route))
    .filter((route) => !guideRouteSet.has(route));
  const toolRoutes = normalizedRoutes.filter((route) => route !== '/' && !INFO_ROUTES.has(route) && !route.endsWith('-tools.html'));
  const fallbackLastmod = new Date().toISOString();
  const lastmodByRoute = new Map();

  for (const route of normalizedRoutes) {
    const lastmod = await resolveLastmodForRoute({ route, cmsRoot, fallbackLastmod });
    if (lastmod) {
      lastmodByRoute.set(normalizeRoute(route), lastmod);
    }
  }

  await writeTextFile(distDir, 'sitemap-tools.xml', buildUrlSetXml(toolRoutes, origin, lastmodByRoute, 'tool'));
  await writeTextFile(distDir, 'sitemap-hubs.xml', buildUrlSetXml(hubRoutes, origin, lastmodByRoute, 'hub'));
  await writeTextFile(distDir, 'sitemap-guides.xml', buildUrlSetXml(guideRoutes, origin, lastmodByRoute, 'guide'));
  await writeTextFile(distDir, 'sitemap-pages.xml', buildUrlSetXml(pageRoutes, origin, lastmodByRoute, 'page'));
  await writeTextFile(distDir, 'sitemap.xml', buildSitemapIndexXml(origin));
}
