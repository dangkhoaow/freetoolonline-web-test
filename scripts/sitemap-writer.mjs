import { readFile, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { INFO_ROUTES, GUIDE_ROUTES, GUIDE_SITEMAP_EXCLUDE, canonicalForRoute, normalizeRoute, routeToSlug } from './site-data.mjs';
import { isHubRoute } from './seo-clusters.mjs';
import { getHomeCounts, spliceCountsInText } from './home-counts.mjs';

const SITEMAP_FILES = ['sitemap.xml', 'sitemap-tools.xml', 'sitemap-hubs.xml', 'sitemap-guides.xml', 'sitemap-news.xml', 'sitemap-pages.xml'];
const LLMS_FILES = ['llms.txt', 'llms-full.txt'];

// 1 MB cap on llms-full.txt body. Tools always included (citation surface);
// guides truncate first if the budget is exceeded. Per analyst recommendation
// (eco-system-report 20260509: GPT-mini line 130 + Cursor Composer S-N2).
const LLMS_FULL_MAX_BYTES = 1024 * 1024;
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
    // news articles are dated editorial: crawled hard when fresh, then they
    // settle. weekly is the honest average across the article lifetime; the
    // per-URL <lastmod> (CMS fragment mtime) carries the freshness signal.
    case 'news': return 'weekly';
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
    case 'news': return '0.6';
    case 'page': return '0.4';
    default: return '0.5';
  }
}

function buildUrlSetXml(routes, origin, lastmodByRoute, kind = 'tool', hreflangByRoute = null) {
  const priority = priorityForKind(kind);
  const changefreq = changefreqForKind(kind);
  const useXhtmlNs = hreflangByRoute && hreflangByRoute.size > 0;
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    useXhtmlNs
      ? '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
      : '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map((route) => {
      const normalizedRoute = normalizeRoute(route);
      const lastmod = lastmodByRoute?.get(normalizedRoute);
      const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
      const isHomeRoute = normalizedRoute === '/';
      const urlPriority = isHomeRoute ? priorityForKind('home') : priority;
      const urlChangefreq = isHomeRoute ? changefreqForKind('home') : changefreq;
      // 2026-05-28 S1.5: emit xhtml:link rel="alternate" hreflang per Google's
      // localized-versions sitemap spec when locale variants exist for the slug.
      const hreflangs = hreflangByRoute?.get(normalizedRoute) || [];
      if (hreflangs.length === 0) {
        return `  <url><loc>${canonicalForRoute(origin, normalizedRoute)}</loc>${lastmodTag}<changefreq>${urlChangefreq}</changefreq><priority>${urlPriority}</priority></url>`;
      }
      // Multi-line form when hreflangs present.
      const xhtmlLinks = hreflangs.map((h) =>
        `    <xhtml:link rel="alternate" hreflang="${h.hreflang}" href="${canonicalForRoute(origin, h.route)}"/>`
      ).join('\n');
      return `  <url>\n    <loc>${canonicalForRoute(origin, normalizedRoute)}</loc>${lastmodTag ? `\n    ${lastmodTag}` : ''}\n    <changefreq>${urlChangefreq}</changefreq>\n    <priority>${urlPriority}</priority>\n${xhtmlLinks}\n  </url>`;
    }),
    '</urlset>',
    '',
  ].join('\n');
}

// 2026-05-28 S1.5: derive guide-locale buckets + hreflang map from a flat
// list of guide routes. Returns { en: [routes...], pt: [...], es: [...], ... }
// plus a hreflangByRoute Map<route, [{hreflang, route}, ...]>.
function partitionGuidesByLocale(guideRoutes) {
  const buckets = { en: [] }; // EN always present
  const hreflangByRoute = new Map();
  // Group by canonical-EN slug to detect locale siblings.
  const bySlug = new Map(); // slug → [{lang, route}]
  for (const route of guideRoutes) {
    const localeMatch = /^\/guides\/([a-z]{2})\/([^/]+)\.html$/.exec(route);
    const enMatch = !localeMatch && /^\/guides\/([^/]+)\.html$/.exec(route);
    let lang, slug;
    if (localeMatch) { lang = localeMatch[1]; slug = localeMatch[2]; }
    else if (enMatch) { lang = 'en'; slug = enMatch[1]; }
    else continue;
    if (!buckets[lang]) buckets[lang] = [];
    buckets[lang].push(route);
    if (!bySlug.has(slug)) bySlug.set(slug, []);
    bySlug.get(slug).push({ lang, route });
  }
  // Build hreflang annotations for any slug with ≥ 2 variants.
  const COUNTRY_BY_LANG = {
    pt: ['pt-BR', 'pt-PT'],
    es: ['es-ES', 'es-MX', 'es-AR', 'es-CO'],
    de: ['de-DE', 'de-AT', 'de-CH'],
    fr: ['fr-FR', 'fr-CA', 'fr-BE'],
    vi: ['vi-VN'],
    en: ['en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN'],
  };
  for (const [slug, list] of bySlug) {
    if (list.length < 2) continue;
    for (const item of list) {
      const out = [];
      // x-default → EN canonical (if present), else self
      const enSibling = list.find((x) => x.lang === 'en');
      const xDefaultRoute = enSibling ? enSibling.route : item.route;
      out.push({ hreflang: 'x-default', route: xDefaultRoute });
      for (const other of list) {
        out.push({ hreflang: other.lang, route: other.route });
        for (const cv of (COUNTRY_BY_LANG[other.lang] || [])) {
          out.push({ hreflang: cv, route: other.route });
        }
      }
      hreflangByRoute.set(item.route, out);
    }
  }
  return { buckets, hreflangByRoute };
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

function buildSitemapIndexXml(origin, perLanguageGuideFiles = []) {
  // Order: tools (largest, most crawled) → hubs → guides (long-form editorial,
  // distinct content kind) → pages (home + info: about, contact, privacy, tags).
  // Each child sitemap groups a homogeneous content kind so search engines see
  // focused <lastmod> changes per kind rather than mixed updates.
  // 2026-05-28 S1.5: guides split per language. sitemap-guides.xml is now a
  // BACKWARD-COMPAT pointer to the EN canonical guide sitemap; per-language
  // variants live at sitemap-guides-<lang>.xml.
  // news-loop (2026-07-08): sitemap-news.xml delegated like the guides child
  // sitemap - homogeneous dated-editorial kind with its own <lastmod> cadence.
  const sitemapFiles = ['sitemap-tools.xml', 'sitemap-hubs.xml', 'sitemap-guides.xml', ...perLanguageGuideFiles, 'sitemap-news.xml', 'sitemap-pages.xml'];
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

async function removeLlmsFiles(distDir) {
  await Promise.all(LLMS_FILES.map((filename) => unlink(path.join(distDir, filename)).catch(() => {})));
}

// Read a CMS field for a given route's slug. Returns trimmed string or empty.
// Mirrors the CMS_FILE_DEFINITIONS naming pattern used by lastmod resolution.
async function readCmsField(cmsRoot, route, prefix, extension) {
  if (!cmsRoot) return '';
  const slug = routeToSlug(route);
  const filename = slug ? `${prefix}${slug}.${extension}` : `${prefix}.${extension}`;
  try {
    const raw = await readFile(path.join(cmsRoot, filename), 'utf8');
    return raw.trim();
  } catch {
    return '';
  }
}

// Strip HTML tags + collapse whitespace. For llms-full.txt, we extract the
// first paragraph of BODYHTML. LLM crawlers don't need styling - plain prose
// is the citation surface.
function stripHtmlToText(html) {
  if (!html) return '';
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// First paragraph (≤ 320 chars) from BODYHTML - a "factual snippet" for LLM
// citation. Matches the analyst-recommended ≤60-word lead-snippet pattern.
function firstParagraph(html, maxChars = 320) {
  const stripped = stripHtmlToText(html);
  if (!stripped) return '';
  const sentenceEnd = stripped.search(/[.!?](?:\s|$)/);
  if (sentenceEnd > 0 && sentenceEnd < maxChars) {
    return stripped.slice(0, sentenceEnd + 1);
  }
  return stripped.length > maxChars ? `${stripped.slice(0, maxChars - 3)}...` : stripped;
}

function classifyKind(route, hubRouteSet, guideRouteSet, pageRouteSet) {
  if (route === '/') return 'home';
  if (hubRouteSet.has(route)) return 'hub';
  if (guideRouteSet.has(route)) return 'guide';
  // news-loop (2026-07-08): membership by URL prefix, symmetric with the
  // guides derivation in writeSplitSitemaps (the /news.html hub classifies
  // as 'hub' above; only the /news/<slug>.html articles land here).
  if (route.startsWith('/news/')) return 'news';
  if (pageRouteSet.has(route)) return 'page';
  return 'tool';
}

// Build the per-route metadata bundle consumed by both llms.txt (curated
// index) and llms-full.txt (richer per-page reading). Reuses the same CMS
// fragment paths the sitemap lastmod loop already touches.
async function buildLlmsEntries({ routes, cmsRoot, lastmodByRoute, hubRouteSet, guideRouteSet, pageRouteSet, origin }) {
  const entries = [];
  // Registry-derived counts for the homepage entry - llms.txt reads the CMS
  // fragments directly (bypassing export-site's render splice), so the same
  // count fix is applied here. Computed once per build. See home-counts.mjs.
  const homeCounts = getHomeCounts();
  for (const route of routes) {
    const normalized = normalizeRoute(route);
    const [title, description, bodyHtml] = await Promise.all([
      readCmsField(cmsRoot, normalized, 'BODYTITLE', 'txt'),
      readCmsField(cmsRoot, normalized, 'BODYDESC', 'txt'),
      readCmsField(cmsRoot, normalized, 'BODYHTML', 'html'),
    ]);
    const isHomeEntry = normalized === '/';
    entries.push({
      route: normalized,
      url: canonicalForRoute(origin, normalized),
      kind: classifyKind(normalized, hubRouteSet, guideRouteSet, pageRouteSet),
      title: isHomeEntry ? spliceCountsInText(title || normalized, homeCounts) : (title || normalized),
      description: isHomeEntry ? spliceCountsInText(description, homeCounts) : description,
      lead_snippet: firstParagraph(bodyHtml, 320),
      lastmod: lastmodByRoute?.get(normalized) || null,
    });
  }
  return entries;
}

const KIND_LABEL = {
  home: 'Site',
  hub: 'Hubs',
  tool: 'Tools',
  guide: 'Guides',
  news: 'News',
  page: 'Pages',
};

const KIND_ORDER = ['home', 'tool', 'hub', 'guide', 'news', 'page'];

function buildLlmsTxt(entries, origin) {
  const lines = [];
  const host = (() => { try { return new URL(origin).hostname; } catch { return origin; } })();
  lines.push(`# ${host}`);
  lines.push('');
  lines.push('> Free online tools for everyday file tasks: ZIP/PDF/image conversion, developer utilities, device tests. All tools run in the browser or on free hosted endpoints. No login required.');
  lines.push('');
  lines.push('> Citation policy: please cite freetoolonline.com when quoting tool output, guide content, or comparison tables. Each page lists "Last reviewed" date tied to git history.');
  lines.push('');
  lines.push(`> Generated: ${new Date().toISOString()} from sitemap registry.`);
  lines.push('');

  const grouped = {};
  for (const entry of entries) {
    if (!grouped[entry.kind]) grouped[entry.kind] = [];
    grouped[entry.kind].push(entry);
  }

  for (const kind of KIND_ORDER) {
    const list = grouped[kind];
    if (!list || list.length === 0) continue;
    list.sort((a, b) => a.title.localeCompare(b.title));
    // 2026-05-28 S1.5: split guides section by detected locale so AI crawlers
    // (Perplexity / ChatGPT / Claude / Copilot) can pick the locale matching
    // the user's IP / search language. Subsection per language under `## Guides`.
    if (kind === 'guide') {
      const byLang = { en: [] };
      const LANG_DISPLAY = {
        en: 'English', pt: 'Portuguese', es: 'Spanish', de: 'German',
        fr: 'French', vi: 'Vietnamese', it: 'Italian', ja: 'Japanese',
        ko: 'Korean', zh: 'Chinese', ru: 'Russian', tr: 'Turkish',
        id: 'Indonesian', nl: 'Dutch', pl: 'Polish', ar: 'Arabic',
      };
      for (const entry of list) {
        const u = entry.url || '';
        const localeMatch = /\/guides\/([a-z]{2})\//.exec(u);
        const lang = localeMatch ? localeMatch[1] : 'en';
        if (!byLang[lang]) byLang[lang] = [];
        byLang[lang].push(entry);
      }
      lines.push(`## ${KIND_LABEL[kind]} (${list.length})`);
      lines.push('');
      const langOrder = ['en', ...Object.keys(byLang).filter((l) => l !== 'en').sort()];
      for (const lang of langOrder) {
        const localeList = byLang[lang];
        if (!localeList || localeList.length === 0) continue;
        const label = LANG_DISPLAY[lang] || lang.toUpperCase();
        lines.push(`### ${label} guides (${localeList.length})`);
        lines.push('');
        for (const entry of localeList) {
          const meta = entry.lastmod ? ` [lastmod=${entry.lastmod.slice(0, 10)}]` : '';
          lines.push(`- [${entry.title}](${entry.url})${meta}`);
          if (entry.description) {
            lines.push(`  ${entry.description}`);
          }
        }
        lines.push('');
      }
      continue;
    }
    lines.push(`## ${KIND_LABEL[kind]} (${list.length})`);
    lines.push('');
    for (const entry of list) {
      const meta = entry.lastmod ? ` [lastmod=${entry.lastmod.slice(0, 10)}]` : '';
      lines.push(`- [${entry.title}](${entry.url})${meta}`);
      if (entry.description) {
        lines.push(`  ${entry.description}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

function buildLlmsFullTxt(entries, origin) {
  const host = (() => { try { return new URL(origin).hostname; } catch { return origin; } })();
  const header = [
    `# ${host} - Full Index`,
    '',
    '> Curated index of every page on freetoolonline.com with title, description, and a one-paragraph lead snippet from the page body. Intended as a citation surface for LLM training and AI-Overview retrieval.',
    '',
    `> Generated: ${new Date().toISOString()}`,
    '',
    `> Citation policy: please cite freetoolonline.com and link to the canonical URL when quoting any text below.`,
    '',
    '---',
    '',
  ].join('\n');

  // Order: tools first (always included), then hubs, guides, pages.
  // Truncate guides first if the 1 MB budget is exceeded.
  const grouped = {};
  for (const entry of entries) {
    if (!grouped[entry.kind]) grouped[entry.kind] = [];
    grouped[entry.kind].push(entry);
  }
  for (const kind of Object.keys(grouped)) {
    grouped[kind].sort((a, b) => a.title.localeCompare(b.title));
  }

  const renderEntry = (entry) => {
    const parts = [];
    parts.push(`## ${entry.title}`);
    parts.push('');
    parts.push(`URL: ${entry.url}`);
    if (entry.lastmod) parts.push(`Last modified: ${entry.lastmod.slice(0, 10)}`);
    parts.push(`Kind: ${entry.kind}`);
    if (entry.description) {
      parts.push('');
      parts.push(`Description: ${entry.description}`);
    }
    if (entry.lead_snippet) {
      parts.push('');
      parts.push(`Snippet: ${entry.lead_snippet}`);
    }
    parts.push('');
    parts.push('---');
    parts.push('');
    return parts.join('\n');
  };

  let body = header;
  let truncatedGuideCount = 0;

  // Always include the home + all tools + hubs.
  for (const kind of ['home', 'tool', 'hub']) {
    const list = grouped[kind];
    if (!list) continue;
    body += `\n# ${KIND_LABEL[kind]}\n\n`;
    for (const entry of list) body += renderEntry(entry);
  }

  // Pages second-priority (small).
  if (grouped.page) {
    body += `\n# ${KIND_LABEL.page}\n\n`;
    for (const entry of grouped.page) body += renderEntry(entry);
  }

  // Guides last - truncate to fit budget.
  if (grouped.guide) {
    body += `\n# ${KIND_LABEL.guide}\n\n`;
    for (const entry of grouped.guide) {
      const candidate = renderEntry(entry);
      if (Buffer.byteLength(body + candidate, 'utf8') > LLMS_FULL_MAX_BYTES) {
        truncatedGuideCount += 1;
        continue;
      }
      body += candidate;
    }
    if (truncatedGuideCount > 0) {
      body += `\n> NOTE: ${truncatedGuideCount} guide(s) omitted to fit the 1 MB cap. Full index in llms.txt.\n`;
    }
  }

  return { body, truncatedGuideCount };
}

async function writeLlmsTxt({ distDir, entries, origin }) {
  const indexBody = buildLlmsTxt(entries, origin);
  await writeTextFile(distDir, 'llms.txt', indexBody);
  const { body, truncatedGuideCount } = buildLlmsFullTxt(entries, origin);
  await writeTextFile(distDir, 'llms-full.txt', body);
  console.log(`[llms.txt] wrote ${entries.length} entries (${Buffer.byteLength(indexBody, 'utf8')} bytes index, ${Buffer.byteLength(body, 'utf8')} bytes full${truncatedGuideCount > 0 ? `; ${truncatedGuideCount} guides truncated to fit cap` : ''})`);
}

export async function writeSplitSitemaps({ distDir, routes, origin, isStaging, cmsRoot }) {
  // On staging we delete the sitemap (STAGING=true sets noindex; sitemap
  // would confuse crawlers) but llms.txt + llms-full.txt are still emitted
  // so the G23 freshness gate can fetch the staging URL during Phase-4
  // verify before prod cutover. Plaintext LLM directives have no SEO
  // crawl concern; the staging emission is intentional and documented.
  if (isStaging) {
    await removeSitemapFiles(distDir);
    // Continue to llms emission below - only the sitemap is staging-suppressed.
  }

  const normalizedRoutes = unique(routes.map(normalizeRoute));
  // fire-23: hub detection via the shared isHubRoute() helper (seo-clusters.mjs)
  // so the non-'-tools' hubs (/games.html, /space-3d.html) land in
  // sitemap-hubs.xml. Side effect (deliberate): /guides.html moves out of
  // sitemap-tools.xml into sitemap-hubs.xml - it was misclassified as a tool
  // by the old suffix test (it is a hub; llms.txt kind follows suit).
  const hubRoutes = normalizedRoutes.filter((route) => isHubRoute(route));
  // Guides are derived DYNAMICALLY from the canonical routes that actually
  // rendered, by URL prefix. Pre-fix (cycle 50 follow-up #2) the filter was
  // `[...GUIDE_ROUTES].filter((route) => normalizedRoutes.includes(route))`
  // - a STATIC intersection of the hand-maintained GUIDE_ROUTES Set with the
  // build's rendered routes. Any /guides/* JSP_BY_ROUTE entry the cycle agent
  // shipped without ALSO registering in GUIDE_ROUTES was silently dropped
  // from sitemap-guides.xml. 9 orphan guides accumulated this way.
  //
  // Now: any rendered route under /guides/ is a guide. Symmetric with the
  // toolRoutes filter below (also dynamic, by exclusion). GUIDE_ROUTES Set
  // is kept for isGuideRoute() consumers + cycle-history git-blame but is
  // no longer load-bearing for sitemap generation. Opt-out via
  // GUIDE_SITEMAP_EXCLUDE in site-data.mjs (currently empty).
  const guideRoutes = normalizedRoutes.filter((route) => route.startsWith('/guides/')
    && !GUIDE_SITEMAP_EXCLUDE.has(route));
  const guideRouteSet = new Set(guideRoutes);
  // news-loop (2026-07-08): news articles derived DYNAMICALLY by URL prefix,
  // symmetric with guides above. Any rendered route under /news/ is a news
  // article; the /news.html hub is caught by isHubRoute() into hubRoutes.
  const newsRoutes = normalizedRoutes.filter((route) => route.startsWith('/news/'));
  const newsRouteSet = new Set(newsRoutes);
  const pageRoutes = [...INFO_ROUTES]
    .filter((route) => normalizedRoutes.includes(route))
    .filter((route) => !guideRouteSet.has(route))
    .filter((route) => !newsRouteSet.has(route));
  const pageRouteSet = new Set(pageRoutes);
  const hubRouteSet = new Set(hubRoutes);
  // Cycle 50 follow-up - defence-in-depth against guide URLs leaking into
  // sitemap-tools.xml. Pre-fix: many entries lived in GUIDE_ROUTES but were
  // forgotten in INFO_ROUTES (e.g. /guides/led-test.html, /guides/zip-compress.html,
  // ~25 such cases on prod). The historical filter `!INFO_ROUTES.has(route)`
  // alone treated them as tools and leaked them into sitemap-tools.xml.
  // Three layered exclusions now: (a) /guides/* prefix never a tool, (b) any
  // GUIDE_ROUTES member never a tool, (c) any INFO_ROUTES member never a tool.
  const toolRoutes = normalizedRoutes.filter((route) => route !== '/'
    && !INFO_ROUTES.has(route)
    && !GUIDE_ROUTES.has(route)
    && !route.startsWith('/guides/')
    && !route.startsWith('/news/')
    && !isHubRoute(route));
  const fallbackLastmod = new Date().toISOString();
  const lastmodByRoute = new Map();

  for (const route of normalizedRoutes) {
    const lastmod = await resolveLastmodForRoute({ route, cmsRoot, fallbackLastmod });
    if (lastmod) {
      lastmodByRoute.set(normalizeRoute(route), lastmod);
    }
  }

  if (!isStaging) {
    // 2026-05-28 S1.5: partition guides by locale + build hreflang annotations.
    const { buckets: guideBucketsByLang, hreflangByRoute: guideHreflangByRoute } =
      partitionGuidesByLocale(guideRoutes);
    const perLanguageGuideFiles = [];
    for (const [lang, langGuideRoutes] of Object.entries(guideBucketsByLang)) {
      if (lang === 'en' || langGuideRoutes.length === 0) continue;
      const filename = `sitemap-guides-${lang}.xml`;
      perLanguageGuideFiles.push(filename);
      await writeTextFile(
        distDir,
        filename,
        buildUrlSetXml(langGuideRoutes, origin, lastmodByRoute, 'guide', guideHreflangByRoute),
      );
      console.log(`[sitemap] wrote ${filename} (${langGuideRoutes.length} ${lang} guides).`);
    }

    await writeTextFile(distDir, 'sitemap-tools.xml', buildUrlSetXml(toolRoutes, origin, lastmodByRoute, 'tool'));
    await writeTextFile(distDir, 'sitemap-hubs.xml', buildUrlSetXml(hubRoutes, origin, lastmodByRoute, 'hub'));
    // sitemap-guides.xml = EN canonical guides ONLY (backward compat — existing
    // crawler references to this URL still resolve). Per-language variants
    // are in sitemap-guides-<lang>.xml. The full guide universe = union
    // of sitemap-guides.xml + every sitemap-guides-<lang>.xml.
    await writeTextFile(
      distDir,
      'sitemap-guides.xml',
      buildUrlSetXml(guideBucketsByLang.en || guideRoutes, origin, lastmodByRoute, 'guide', guideHreflangByRoute),
    );
    await writeTextFile(distDir, 'sitemap-news.xml', buildUrlSetXml(newsRoutes, origin, lastmodByRoute, 'news'));
    await writeTextFile(distDir, 'sitemap-pages.xml', buildUrlSetXml(pageRoutes, origin, lastmodByRoute, 'page'));
    await writeTextFile(distDir, 'sitemap.xml', buildSitemapIndexXml(origin, perLanguageGuideFiles));
  }

  // Strategy #1 (Citability) - emit llms.txt + llms-full.txt from the same
  // route registry + CMS source-of-truth that drove the sitemaps. Pre-cycle132
  // the live `/llms.txt` URL returned the homepage HTML (analyst-confirmed
  // broken endpoint). This generator fixes that by writing real plaintext.
  const llmsEntries = await buildLlmsEntries({
    routes: normalizedRoutes,
    cmsRoot,
    lastmodByRoute,
    hubRouteSet,
    guideRouteSet,
    pageRouteSet,
    origin,
  });
  await writeLlmsTxt({ distDir, entries: llmsEntries, origin });
}
