import { canonicalForRoute, isInfoRoute, isGuideRoute, isRelatedGuidesEnabled, RELATED_GUIDES_CURATED, routeToSlug, ALIAS_ROUTES, JSP_BY_ROUTE } from './site-data.mjs';
import { getTestimonialsForTool, renderTestimonialsSection } from './testimonials.mjs';

// 2026-05-28 plan-warm-pascal-v2 S1.3 — multilingual /guides/ locale support.
// Build a map of canonical-EN-slug → [{ lang, route, isCanonical }] for every
// guide with locale variants. Derived from JSP_BY_ROUTE (locale URLs have
// shape `/guides/<lang>/<slug>.html`) + ALIAS_ROUTES (old localized URL →
// new locale URL gives the reverse-mapping).
//
// Hard rules:
//   - EN canonical stays at `/guides/<slug>.html`
//   - Non-EN locale URLs are `/guides/<lang>/<slug>.html`
//   - <lang> is 2 char ISO 639-1 (pt, es, de, fr, vi, it, ...)
//
// Per-country variants (e.g. pt-BR, pt-PT) are emitted as additional
// hreflang values on the SAME canonical-pt URL — Google's spec allows
// multiple hreflang pointing at the same URL.
// plan-warm-pascal-v3 S1.1 (2026-05-29): 'en' is now a first-class locale
// prefix. Canonical EN guides migrate from /guides/<slug>.html to
// /guides/en/<slug>.html; the legacy root path 301s to the locale-prefixed
// canonical via CloudFront + ALIAS_ROUTES origin fallback. Locale URLs
// become uniform (en/pt/es/vi/id/de all first-class) so hreflang signals
// are symmetric and AI crawlers pick the locale matching the user query.
const SUPPORTED_LOCALE_PREFIXES = new Set(['en', 'pt', 'es', 'de', 'fr', 'vi', 'it', 'ja', 'ko', 'zh', 'ru', 'id', 'tr', 'pl', 'nl', 'ar']);
// English regional hreflang = the PREMIUM English-market tier (2026-06-22):
// US/CA/GB/AU/IE/NZ. en-IN dropped (India isn't a premium target; `en` +
// `x-default` still serve it). Single source of truth: used by BOTH the guide
// locale builder AND the sitewide builder so guides + tools declare the SAME
// English regions. Reciprocity is trivial — every en-XX points at the page's
// own canonical (self).
const EN_PREMIUM_REGIONS = Object.freeze(['en-US', 'en-CA', 'en-GB', 'en-AU', 'en-IE', 'en-NZ']);
const COUNTRY_VARIANTS_BY_LANG = Object.freeze({
  pt: ['pt-BR', 'pt-PT'],
  es: ['es-ES', 'es-MX', 'es-AR', 'es-CO'],
  de: ['de-DE', 'de-AT', 'de-CH'],
  fr: ['fr-FR', 'fr-CA', 'fr-BE'],
  vi: ['vi-VN'],
  it: ['it-IT'],
  en: EN_PREMIUM_REGIONS,
});

// Sitewide English hreflang for NON-guide pages (tools/hubs/info) — declares the
// premium-English-region COVERAGE of a single English page. `en` + `x-default` +
// each premium region, all pointing at the page's own canonical (self). This
// makes the regional intent explicit + consistent with guides; it declares
// coverage, NOT ranking priority (Google has no country dial — see
// .agent/skills/seo-page-structure-rules/references/geo-targeting-playbook.md).
function buildSitewideEnglishHreflang(canonicalUrl) {
  if (!canonicalUrl) return [];
  return [
    { hreflang: 'en', href: canonicalUrl },
    { hreflang: 'x-default', href: canonicalUrl },
    ...EN_PREMIUM_REGIONS.map((hreflang) => ({ hreflang, href: canonicalUrl })),
  ];
}

// Detect locale from a /guides/<lang>/<slug>.html route.
// Returns null for /guides/<slug>.html (EN canonical) or non-guide routes.
function detectGuideLocaleFromRoute(route) {
  const m = /^\/guides\/([a-z]{2})\/[^/]+\.html$/.exec(route || '');
  if (!m) return null;
  const lang = m[1];
  return SUPPORTED_LOCALE_PREFIXES.has(lang) ? lang : null;
}

// Build the locale-sibling map at module load. Keys are canonical EN slugs
// (the slug suffix without `/guides/<lang>/` prefix); values list every
// locale-variant route that exists in JSP_BY_ROUTE for that slug.
let _localizedGuideMap = null;
function getLocalizedGuideMap() {
  if (_localizedGuideMap) return _localizedGuideMap;
  const map = new Map(); // canonicalSlug → [{lang, route}]
  for (const route of Object.keys(JSP_BY_ROUTE || {})) {
    if (!route.startsWith('/guides/')) continue;
    const lang = detectGuideLocaleFromRoute(route);
    if (lang) {
      // Locale URL — extract the canonical EN slug
      const m = /^\/guides\/[a-z]{2}\/([^/]+)\.html$/.exec(route);
      if (m) {
        const slug = m[1];
        if (!map.has(slug)) map.set(slug, []);
        map.get(slug).push({ lang, route, isCanonical: false });
      }
    } else {
      // EN canonical guide route
      const m = /^\/guides\/([^/]+)\.html$/.exec(route);
      if (m) {
        const slug = m[1];
        if (!map.has(slug)) map.set(slug, []);
        // EN canonical only counts if there exists at least one locale variant.
        // We add it provisionally; final filter happens below.
        map.get(slug).push({ lang: 'en', route, isCanonical: true });
      }
    }
  }
  // Drop entries that only have EN (no locale variants → no hreflang needed)
  for (const [slug, list] of map) {
    if (list.length === 1) map.delete(slug);
  }
  _localizedGuideMap = map;
  return map;
}

// news-loop (2026-07-09): locale siblings for /news/<slug>.html (EN) and
// /news/<lang>/<slug>.html (non-EN). Same hreflang shape as guides.
let _localizedNewsMap = null;
function getLocalizedNewsMap() {
  if (_localizedNewsMap) return _localizedNewsMap;
  const map = new Map();
  for (const route of Object.keys(JSP_BY_ROUTE || {})) {
    if (!route.startsWith('/news/')) continue;
    const localeMatch = /^\/news\/([a-z]{2})\/([^/]+)\.html$/.exec(route);
    if (localeMatch) {
      const lang = localeMatch[1];
      const slug = localeMatch[2];
      if (!SUPPORTED_LOCALE_PREFIXES.has(lang)) continue;
      if (!map.has(slug)) map.set(slug, []);
      map.get(slug).push({ lang, route, isCanonical: false });
      continue;
    }
    const enMatch = /^\/news\/([^/]+)\.html$/.exec(route);
    if (enMatch && !SUPPORTED_LOCALE_PREFIXES.has(enMatch[1])) {
      const slug = enMatch[1];
      if (!map.has(slug)) map.set(slug, []);
      map.get(slug).push({ lang: 'en', route, isCanonical: true });
    }
  }
  for (const [slug, list] of map) {
    if (list.length === 1) map.delete(slug);
  }
  _localizedNewsMap = map;
  return map;
}

function buildNewsLocaleHreflangLinks(route, siteOrigin) {
  const map = getLocalizedNewsMap();
  let canonicalSlug = null;
  const localeMatch = /^\/news\/[a-z]{2}\/([^/]+)\.html$/.exec(route);
  const enMatch = /^\/news\/([^/]+)\.html$/.exec(route);
  if (localeMatch) canonicalSlug = localeMatch[1];
  else if (enMatch && !SUPPORTED_LOCALE_PREFIXES.has(enMatch[1])) canonicalSlug = enMatch[1];
  if (!canonicalSlug) return [];
  const siblings = map.get(canonicalSlug);
  if (!siblings || siblings.length < 2) return [];

  const links = [];
  const enSibling = siblings.find((s) => s.isCanonical);
  if (enSibling) {
    const enUrl = `${siteOrigin}${enSibling.route}`;
    links.push({ hreflang: 'x-default', href: enUrl });
    links.push({ hreflang: 'en', href: enUrl });
    for (const cv of (COUNTRY_VARIANTS_BY_LANG.en || [])) {
      links.push({ hreflang: cv, href: enUrl });
    }
  }
  for (const s of siblings) {
    if (s.isCanonical) continue;
    const url = `${siteOrigin}${s.route}`;
    links.push({ hreflang: s.lang, href: url });
    for (const cv of (COUNTRY_VARIANTS_BY_LANG[s.lang] || [])) {
      links.push({ hreflang: cv, href: url });
    }
  }
  return links;
}

// For a given guide route (EN canonical or locale-prefixed), return the
// full hreflang list. Returns an empty array when the guide has no locale
// variants registered (the existing default hreflang block stays in effect).
function buildGuideLocaleHreflangLinks(route, siteOrigin) {
  const map = getLocalizedGuideMap();
  // Determine canonical slug
  let canonicalSlug = null;
  const localeMatch = /^\/guides\/[a-z]{2}\/([^/]+)\.html$/.exec(route);
  const enMatch = /^\/guides\/([^/]+)\.html$/.exec(route);
  if (localeMatch) canonicalSlug = localeMatch[1];
  else if (enMatch) canonicalSlug = enMatch[1];
  if (!canonicalSlug) return [];
  const siblings = map.get(canonicalSlug);
  if (!siblings || siblings.length < 2) return [];

  const links = [];
  // x-default → EN canonical
  const enSibling = siblings.find((s) => s.isCanonical);
  if (enSibling) {
    const enUrl = `${siteOrigin}${enSibling.route}`;
    links.push({ hreflang: 'x-default', href: enUrl });
    links.push({ hreflang: 'en', href: enUrl });
    for (const cv of (COUNTRY_VARIANTS_BY_LANG.en || [])) {
      links.push({ hreflang: cv, href: enUrl });
    }
  }
  // Non-EN siblings → each gets primary lang + per-country variants
  for (const s of siblings) {
    if (s.isCanonical) continue;
    const url = `${siteOrigin}${s.route}`;
    links.push({ hreflang: s.lang, href: url });
    for (const cv of (COUNTRY_VARIANTS_BY_LANG[s.lang] || [])) {
      links.push({ hreflang: cv, href: url });
    }
  }
  return links;
}

export {
  detectGuideLocaleFromRoute,
  getLocalizedGuideMap,
  buildGuideLocaleHreflangLinks,
};
import { getSeoClusterGroups, resolveHubBacklink } from './seo-clusters.mjs';
import { DEFAULT_PAGE_SVG_LOGO, escapeCssString, escapeHtml, renderBaseScript, renderDownloadTag, renderLoadingTag, renderShareButtons, renderUploadSecondTag, renderUploadStartupSecondTag, renderUploadStartupTag, renderUploadTag, renderWelcomeTag, replaceExpressions, unwrapStyleBlock } from './page-fragments.mjs';
import { formatHumanDate, rewriteLastUpdatedTag } from './page-mtimes.mjs';
import { buildStagingBannerHtml, normalizeBasePath, resolveCanonicalUrl } from './staging-utils.mjs';

const SEO_CLUSTER_GROUPS = getSeoClusterGroups();
const RELATED_TOOLS_LIST_STYLE = 'margin-top: 0px;display: block;padding-inline-start: 40px;list-style-type: disc;';
// plan-kahan: cap the dedicated Related-guides list so it reads as a tidy
// curated section (like Related tools), not a wall of every tag-matched guide.
// Tag matches are collected before title-word matches, so the kept slice is the
// most-relevant set. Both sections are capped: slug-word matching (added 2026-06-28
// to fix localized/entry-less coverage) widens the match pool, so without a tools
// cap broad-slug guide pages produced 30+ related-tool walls. Cap keeps the leading
// (tag-matched, then title/slug-matched) most-relevant items.
const RELATED_GUIDES_MAX = 12;
const RELATED_TOOLS_MAX = 12;
// news-loop (2026-07-08): dedicated Related-news bucket, same partition
// pattern as Related-guides. Cap is small on purpose - the news corpus is
// deliberately thin (max 3 new articles/7d per the news-discovery-loop
// runbook's volume cap), so a wall-of-news would misrepresent the corpus.
const RELATED_NEWS_MAX = 6;
const RELATED_TOOLS_STOP_WORDS = new Set(['free', 'tool', 'online', 'convert', 'converter', 'in', 'editor', 'maker', 'by', 'and']);
const RELATED_TOOLS_TAGS_PAGE_TITLES = new Set(['tags collection', 'tags cloud:']);
const APPLICATION_CATEGORY_BY_CLUSTER = {
  zip: 'UtilitiesApplication',
  'image-editing': 'GraphicsApplication',
  'image-conversion': 'GraphicsApplication',
  pdf: 'UtilitiesApplication',
  developer: 'DeveloperApplication',
  video: 'MultimediaApplication',
  'device-test': 'UtilitiesApplication',
  utility: 'UtilitiesApplication',
};

function resolveApplicationCategory(route) {
  for (const group of SEO_CLUSTER_GROUPS) {
    if (group.hubRoute === route || (group.routes && group.routes.includes(route))) {
      return APPLICATION_CATEGORY_BY_CLUSTER[group.cluster] || 'UtilitiesApplication';
    }
  }
  return 'UtilitiesApplication';
}

const HOWTO_ROUTES = new Set([
  '/heic-to-jpg.html',
  '/camera-test.html',
  '/microphone-test.html',
  '/keyboard-test.html',
  '/lcd-test.html',
  '/js-minifier.html',
  '/css-minifier.html',
  '/json-parser.html',
  '/md5-converter.html',
  '/pdf-to-text.html',
  '/images-to-pdf.html',
  '/compose-pdf.html',
  '/compress-image.html',
  '/video-converter.html',
  '/convert-time-in-millisecond-to-date.html',
  '/pdf-to-images.html',
  '/extract-gif-to-image-frames.html',
  '/remove-pdf-password.html',
  '/protect-pdf-by-password.html',
  '/video-maker.html',
  '/ffmpeg-online.html',
  '/pdf-to-html.html',
  // P10.2.5 Phase 10 Cycle 4 - HowTo +3. (html-to-pdf.html route does not
  // exist in JSP_BY_ROUTE; base64-to-image.html substituted as the
  // developer-cluster peer.) Each slug listed here has a w3-pale-green
  // answer panel with a 3-step <ol> that extractHowToSteps picks up.
  '/gif-maker.html',
  '/qr-code-generator.html',
  '/base64-to-image.html',
  // P11.2.2 Phase 11 Cycle 2 - PDF cluster HowTo backfill. Plan called for
  // /pdf-to-word.html but that route does not exist in JSP_BY_ROUTE; substituted
  // /join-pdf-from-multiple-files.html (PDF cluster peer with an existing
  // FAQ file and a clean merge-workflow intent). HowTo 25/51 → 26/51.
  '/join-pdf-from-multiple-files.html',
  // P11.2.5 Phase 11 Cycle 3 - HowTo wave 3 (+4 → 30/51). Plan originally
  // listed pdf-to-images + pdf-to-html which were already in HOWTO_ROUTES
  // (Phase 8/9 carryover); substituted /split-pdf-by-range.html (PDF peer)
  // and /svg-to-png.html (image-conversion peer) to keep the +4 count with
  // non-overlapping additions. Each new slug has a w3-pale-green answer
  // panel with a 3-step <ol> authored via seo-content-writer.
  '/image-to-base64.html',
  '/css-gradient-generator.html',
  '/split-pdf-by-range.html',
  '/svg-to-png.html',
  // P12.2.2 Phase 12 Cycle 2 - HowTo wave 4 (+4 -> 34/51 = 67%). Image-editing
  // cluster backfill: existing 2/8 (compress-image, gif-maker) -> 6/8 with these
  // additions. Each tool gets a w3-pale-green answer panel with a 3-step <ol>
  // authored via seo-content-writer.
  '/crop-image.html',
  '/resize-image.html',
  '/photo-editor.html',
  '/insights-image-optimizer.html',
  // P12.2.6 Phase 12 Cycle 3 - HowTo backfill image-conversion. Plan called
  // for png-to-svg + extract-gif-to-image-frames; extract-gif was already in
  // HOWTO_ROUTES + already had a w3-pale-green answer panel from a prior
  // phase, so net addition is +1 -> 35/51. Answer panel authored via
  // seo-content-writer (raster-to-vector tracing 3-step).
  '/png-to-svg.html',
  // geo-batch-99: new tool pages — each has a w3-pale-green answer panel with steps
  '/pdf-tools/pdf-filler-form-editor.html',
  '/image-converter-tools/audio-converter.html',
  // geo-batch-101: code-formatter-beautifier has a w3-pale-green 3-step panel in BODYHTML
  '/developer-tools/code-formatter-beautifier.html',
  // geo-batch-122: sort-text-lines has a 3-step <ol> in BODYHTML (extractHowToSteps fallback path)
  '/developer-tools/sort-text-lines.html',
  // geo-batch-123: remove-duplicate-lines has a 3-step <ol> in BODYHTML (extractHowToSteps fallback path)
  '/developer-tools/remove-duplicate-lines.html',
]);

// P10.3.1 - Per-tool og:image differentiation (Phase 10 Cycle 4).
// The default og:image (CloudFront logo) is identical across 82 URLs which
// produces zero Discover / Twitter / LinkedIn preview differentiation. This
// map targets the top 5 non-ZIP URLs with per-tool 1200×630 PNGs once the
// assets are uploaded to the existing CloudFront bucket under
// `image/og/<slug>-1200x630.png`. Until the assets exist, the lookup is
// gated behind USE_TOOL_OG_IMAGES so stale references never reach prod.
//
// Owner action remaining: produce the 5 PNGs (heic-to-jpg, lcd-test,
// md5-converter, camera-test, css-minifier) + upload to CDN + flip
// USE_TOOL_OG_IMAGES=true in the build env. No site-level changes required.
const TOOL_OG_IMAGE_MAP = {
  '/heic-to-jpg.html': 'https://dkbg1jftzfsd2.cloudfront.net/image/og/heic-to-jpg-1200x630.png',
  '/lcd-test.html': 'https://dkbg1jftzfsd2.cloudfront.net/image/og/lcd-test-1200x630.png',
  '/md5-converter.html': 'https://dkbg1jftzfsd2.cloudfront.net/image/og/md5-converter-1200x630.png',
  '/camera-test.html': 'https://dkbg1jftzfsd2.cloudfront.net/image/og/camera-test-1200x630.png',
  '/css-minifier.html': 'https://dkbg1jftzfsd2.cloudfront.net/image/og/css-minifier-1200x630.png',
};
const DEFAULT_OG_IMAGE = 'https://dkbg1jftzfsd2.cloudfront.net/image/logo.200x200.png';

// Cycle 27 P27.A - Per-route additional hreflang signals for cohorts captured
// only by Bing (Indonesian `cek lcd` 6.7k imp / 377 clicks @ pos 2.5 on
// /lcd-test.html). Strictly additive: existing self + x-default emissions
// remain untouched. The map self-references the same canonical URL because
// no translated variant exists; per Google's hreflang spec, a self-reference
// is valid when the page is the best match for the language cohort.
const EXTRA_HREFLANG_BY_ROUTE = {
  '/lcd-test.html': ['id'],
};

function resolveOgImage(route) {
  const useToolOgImages = process.env.USE_TOOL_OG_IMAGES === 'true';
  if (!useToolOgImages) {
    return DEFAULT_OG_IMAGE;
  }
  return TOOL_OG_IMAGE_MAP[route] ?? DEFAULT_OG_IMAGE;
}

function renderMetaTags(ctx) {
  const canonicalUrl = ctx.canonicalUrl;
  const siteUrl = canonicalForRoute(ctx.siteOrigin, ctx.route);
  // 2026-05-28 S1.3: detect locale-prefix guide routes
  const guideLocale = detectGuideLocaleFromRoute(ctx.route);
  const isVietnamese = ctx.lang === 'vi';
  // Self-hreflang: for locale guides, use the detected lang; else fall back to existing logic
  const selfHreflang = guideLocale
    ? guideLocale
    : (isVietnamese ? 'vi-vn' : 'en-us');
  // Home title comes from BODYTITLE.txt (already the full brand-form string),
  // count-spliced at export time from the route registry (home-counts.mjs) so
  // the tool count can never drift from the registry again. The literal is a
  // last-resort fallback only (empty/missing home BODYTITLE fragment).
  const homeTitleFallback = 'Free Tool Online - 122 Browser Tools for ZIP, PDF, Image, Dev, Device';
  const homeTitle = ctx.isHome ? (String(ctx.browserTitle ?? '').trim() || homeTitleFallback) : '';
  const title = ctx.isHome ? homeTitle : `${ctx.browserTitle} - Free Tool Online`;
  const ogTitle = ctx.isHome ? homeTitle : `Free Tool Online - ${ctx.browserTitle}`;
  const mobileTitleBase = String(ctx.mobileBrowserTitle ?? '').trim();
  const mobileTitle = mobileTitleBase ? `${mobileTitleBase} - Free Tool Online` : '';
  const description = escapeHtml(ctx.description || '');
  const keywords = escapeHtml(ctx.keyword || '');
  const resolvedCanonical = canonicalUrl || siteUrl;
  const canonical = escapeHtml(resolvedCanonical);
  let canonicalOrigin = '';
  try {
    canonicalOrigin = new URL(resolvedCanonical).origin;
  } catch {
    canonicalOrigin = '';
  }
  // Emit x-default for every route. For EN routes, x-default points to the page's own
  // canonical (valid per hreflang spec when no translated variant exists). For VI routes
  // where the EN equivalent slug is unknown, fall back to the site origin.
  const xDefaultHref = isVietnamese ? canonicalOrigin : resolvedCanonical;
  console.log(`[seo:hreflang] route=${ctx.route} lang=${ctx.lang} canonical=${resolvedCanonical} self=${selfHreflang} x-default=${xDefaultHref || 'none'}.`);
  if (ctx.isStaging && !ctx.isHome && mobileTitleBase) {
    console.log(`[seo:mobile-title] route=${ctx.route} mobileTitle="${mobileTitleBase}".`);
  }
  const extraHreflangs = EXTRA_HREFLANG_BY_ROUTE[ctx.route] || [];
  // 2026-05-28 S1.3: if this guide has locale variants registered, emit
  // the full per-locale hreflang block (x-default + each locale + per-country
  // variants). Otherwise fall back to the legacy self + x-default + extras.
  const guideLocaleLinks = buildGuideLocaleHreflangLinks(ctx.route, ctx.siteOrigin || '');
  const newsLocaleLinks = guideLocaleLinks.length === 0
    ? buildNewsLocaleHreflangLinks(ctx.route, ctx.siteOrigin || '')
    : [];
  const clusterLocaleLinks = guideLocaleLinks.length > 0 ? guideLocaleLinks : newsLocaleLinks;
  // Non-guide English pages (tools/hubs/info) declare premium-English-region
  // COVERAGE sitewide (en + x-default + en-US/CA/GB/AU/IE/NZ, all -> self), so
  // the regional intent is explicit + consistent with guides. Non-English
  // non-guide pages (rare) keep the legacy self + x-default. Per-route EXTRA
  // hreflang (alias targets) are preserved + deduped. Declares coverage, NOT
  // ranking priority (Google has no country dial — see geo-targeting-playbook.md).
  let alternateLinks;
  if (clusterLocaleLinks.length > 0) {
    alternateLinks = [
      // Self-reference still emitted (Google's spec recommends it explicitly)
      `<link rel='alternate' href='${canonical}' hreflang='${selfHreflang}' />`,
      ...clusterLocaleLinks.map((l) =>
        `<link rel='alternate' href='${escapeHtml(l.href)}' hreflang='${l.hreflang}' />`
      ),
    ];
  } else {
    const isEnglishPage = (ctx.lang || 'en') === 'en';
    const baseLinks = isEnglishPage
      ? buildSitewideEnglishHreflang(canonical)
      : [
          { hreflang: selfHreflang, href: canonical },
          ...(xDefaultHref ? [{ hreflang: 'x-default', href: xDefaultHref }] : []),
        ];
    const seen = new Set(baseLinks.map((l) => l.hreflang));
    for (const lang of extraHreflangs) {
      if (!seen.has(lang)) { baseLinks.push({ hreflang: lang, href: canonical }); seen.add(lang); }
    }
    alternateLinks = baseLinks.map((l) =>
      `<link rel='alternate' href='${escapeHtml(l.href)}' hreflang='${l.hreflang}' />`
    );
  }
  const mobileTitleScript = ctx.isStaging && !ctx.isHome && mobileTitle
    ? `<script>(function(){try{var t=${JSON.stringify(mobileTitle)};var m=(window.matchMedia?window.matchMedia('(max-width: 480px)').matches:((window.innerWidth||0)<=480));if(m&&t){document.title=t;}}catch(e){}})();</script>`
    : '';
  return [
    `<title>${escapeHtml(title)}</title>`,
    mobileTitleScript,
    `<meta http-equiv='cache-control' content='max-age=0, public'/>`,
    `<meta http-equiv='expires' content='0'/>`,
    `<meta http-equiv='pragma' content='no-cache'/>`,
    `<meta http-equiv='cleartype' content='on'>`,
    `<meta charset="utf-8"/>`,
    `<meta name='description' content='${description}' />`,
    `<meta name='keywords' content='${keywords}'/>`,
    `<meta name="author" content='freetoolonline.com' />`,
    `<link rel="author" href="https://www.linkedin.com/in/ktran1991/" />`,
    `<meta name="copyright" content="Copyright 2017 freetoolonline.com" />`,
    `<meta name='msvalidate.01' content='505D81A78DC4F7E37C1BD2E1092B4420' />`,
    `<meta name="baidu-site-verification" content="swIR2wbBvq" />`,
    `<meta name="yandex-verification" content="efeeb1a14a628297" />`,
    `<meta name="google-site-verification" content="G2vSQjrnGdjMgxsydPFQBuLffcKtZyo4f7VSzefzvQ4" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1">`,
    ctx.deploySha ? `<meta name="deploy-sha" content="${escapeHtml(ctx.deploySha)}">` : '',
    `<link rel="preconnect" href="https://dkbg1jftzfsd2.cloudfront.net" crossorigin>`,
    `<link rel="dns-prefetch" href="https://dkbg1jftzfsd2.cloudfront.net">`,
    `<meta name='apple-mobile-web-app-capable' content='yes'>`,
    `<meta name='mobile-web-app-capable' content='yes'>`,
    `<meta name='HandheldFriendly' content='True'>`,
    `<meta name='MobileOptimized' content='320'>`,
    `<meta name='apple-mobile-web-app-status-bar-style' content='black'>`,
    ctx.isStaging ? `<meta name="robots" content="noindex, nofollow">` : '',
    `<meta property='og:title' content='${escapeHtml(ogTitle)}'/>`,
    `<meta property='og:description' content='${description}'/>`,
    `<meta property='og:image' content='${resolveOgImage(ctx.route)}'/>`,
    `<meta property='og:type' content='${ctx.isGuide ? 'article' : 'website'}'/>`,
    // Primary locale signal for English pages: en_US + premium-region alternates
    // (declares the English markets this page serves; reinforces inLanguage/USD).
    (ctx.lang || 'en') === 'en' ? `<meta property='og:locale' content='en_US'/>` : '',
    ...((ctx.lang || 'en') === 'en'
      ? ['en_GB', 'en_CA', 'en_AU', 'en_IE', 'en_NZ'].map((l) => `<meta property='og:locale:alternate' content='${l}'/>`)
      : []),
    ctx.isGuide ? `<meta property='article:author' content='freetoolonline editorial team'/>` : '',
    ctx.isGuide ? `<meta property='article:publisher' content='${escapeHtml(ctx.siteOrigin)}'/>` : '',
    ctx.isGuide && ctx.articlePublishedAt ? `<meta property='article:published_time' content='${escapeHtml(ctx.articlePublishedAt)}'/>` : '',
    ctx.isGuide && ctx.articleModifiedAt ? `<meta property='article:modified_time' content='${escapeHtml(ctx.articleModifiedAt)}'/>` : '',
    `<meta property='og:url' content='${canonical}'/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:site" content="@freetoolonline1"/>`,
    `<meta name="twitter:title" content='${escapeHtml(ctx.browserTitle)}'/>`,
    `<meta name="twitter:creator" content="@freetoolonline1"/>`,
    `<meta name="twitter:description" content='${description}'>`,
    `<meta name="twitter:image:src" content="https://dkbg1jftzfsd2.cloudfront.net/image/logo.200x200.png"/>`,
    `<meta name="twitter:url" content='${canonical}'/>`,
    ...alternateLinks,
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel='shortcut icon' type='image/png' href='https://dkbg1jftzfsd2.cloudfront.net/favicon.32x32.png'/>`,
    ctx.jsonLd,
    `<link rel="stylesheet" type="text/css" href="https://dkbg1jftzfsd2.cloudfront.net/style/common.css?v=${escapeHtml(ctx.appVersion)}" />`,
    `<style>${unwrapStyleBlock(ctx.themeCss)}${ctx.pageStyle ? `\n${ctx.pageStyle}` : ''}${ctx.customStyle ? `\n${ctx.customStyle}` : ''}</style>`,
  ].join('\n');
}

function renderHeader(ctx) {
  const pageTitleText = ctx.pageTitle || ctx.browserTitle;
  const logo = ctx.pageSvgLogo || DEFAULT_PAGE_SVG_LOGO;
  return `<header class="w3-top navBarContainer"><div class='w3-bar w3-card-2 new-style-nav-bar' id="mainNavBar"><label title="Toggle Dark Mode/Light Mode" class="dark-ctn toggle-switch"><input id="dark-tgl" class="w3-check" type="checkbox"><span class="slider"></span><span class="mode-icon"><i class="fas fa-sun sun-icon"></i><i class="fas fa-moon moon-icon"></i></span></label><button title="Show or hide the menu" class='w3-bar-item w3-button fa fa-bars menuToogle hide' href='javascript:void(0);' style='width: 40px' onclick='toggleMenu()'> <i class="fa fa-caret-down" style="display: inline;opacity: 0;"></i><i class="fa fa-caret-up" style="display: none;opacity: 0;"></i></button><div id='paypalDonateContainer'><form title="Donate via PayPal" class="w3-right paypalBtn" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank"><input type="hidden" name="cmd" value="_s-xclick" /><input type="hidden" name="hosted_button_id" value="W56TRR5BUFEGQ" /><input type="hidden" name="currency_code" value="USD" /><button id="donateBtnID" name="submit" alt="PayPal - The safer, easier way to pay online!" class="w3-button w3-orange donateBtn new-style-donateBtn"><i class="fa fa-paypal"></i> Donate </button></form></div><a id="buyMeACoffeeBtnID" target="_blank" href="https://www.buymeacoffee.com/freetoolonline.com" alt="Buy Me A Coffee" class="w3-button w3-orange donateBtn new-style-donateBtn buy-me-a-coffee" style="margin-top: 8.5px;float: right;margin-right: 10px;"><i class="fa fa-coffee"></i> Buy Me A Coffee</a><a class="w3-bar-item w3-button headerLogo color" href="${escapeHtml(ctx.siteOrigin)}" title="Go to Home page">${logo}</a><a title='Click to reload this page' href='${escapeHtml(ctx.siteOrigin)}${escapeHtml(ctx.pageUrl)}' class='w3-dropdown-hover pageNameContainer' ${ctx.hasSettings ? '' : "style='max-width: calc(100% - 100px)'"}>${pageTitleText ? `<div class='w3-padding-large w3-button navPageName'>${escapeHtml(pageTitleText)}</div>` : ''}</a>${ctx.showAds ? `<button style="display: none" id="disableAds" title='Click to disable ads' onclick="disableAds()" class="settingsBtn w3-right new-style-donateBtn"><i class="fa fa-file-image"></i>&nbsp;Disable Ads</button>` : ''}${ctx.hasSettings ? `<button title='Click to open the tool settings' onclick="document.getElementById('settings').style.display='block'" class="settingsBtn w3-right new-style-donateBtn"><i class="fa fa-cog"></i>&nbsp;Settings</button>` : ''}</div></header>`;
}

function renderToolSections(ctx) {
  // showRelatedLinks lets guide pages (showAds=false because they live in
  // INFO_ROUTES) still render the internal related-tools / related-guides bands.
  // Ads, the rating widget, the FAQ widget and the bottom ad banner stay gated on
  // showAds. Defaults to showAds so non-guide callers are unaffected.
  const showRelatedLinks = ctx.showRelatedLinks ?? ctx.showAds;
  if (!ctx.showAds && !showRelatedLinks) {
    return '';
  }
  const ratingBlock = (!ctx.showAds || ctx.showRating === false)
    ? ''
    : `<div class="w3-row page-section"><div id="star-rating-container">Loading reviews...</div></div>`;
  const relatedToolsHtml = ctx.relatedToolsHtml ?? '';
  const relatedToolsTagsHtml = ctx.relatedToolsTagsHtml ?? '';
  // Dedicated "Related guides" section (plan-kahan). Renderer-injected so it
  // can sit directly BELOW the Related-tools block (a CMS-authored block would
  // render above it, since the renderer appends after all body content) and so
  // it honors the "no hardcoded related blocks in CMS" rule. Gated by the
  // per-route allowlist (ctx.showRelatedGuides) for staged 5-pages/batch rollout;
  // renders only when the page actually has matched guide links. The client
  // related-tools.js fallback populates `.relatedGuides` only if that container
  // exists in the DOM, so the allowlist gate also governs the client path.
  const relatedGuidesHtml = ctx.relatedGuidesHtml ?? '';
  const relatedGuidesBlock = (showRelatedLinks && ctx.showRelatedGuides && relatedGuidesHtml)
    ? `<!-- SEO_BLOCK:RELATED_GUIDES --><div class="w3-row page-section relatedGuidesSection"><p style="margin-bottom: 0px;">Related guides:</p><div class="relatedGuides">${relatedGuidesHtml}</div></div><!-- END_SEO_BLOCK:RELATED_GUIDES -->`
    : '';
  // Dedicated "Related news" section (news-loop 2026-07-08). Same pattern as
  // Related-guides above, minus the staged-rollout allowlist gate (news is a
  // brand-new, deliberately thin corpus - it renders only when a page has an
  // actual matched news link, so there is nothing to stage).
  const relatedNewsHtml = ctx.relatedNewsHtml ?? '';
  const relatedNewsBlock = (showRelatedLinks && relatedNewsHtml)
    ? `<!-- SEO_BLOCK:RELATED_NEWS --><div class="w3-row page-section relatedNewsSection"><p style="margin-bottom: 0px;">Related news:</p><div class="relatedNews">${relatedNewsHtml}</div></div><!-- END_SEO_BLOCK:RELATED_NEWS -->`
    : '';
  // Cluster-hub callout - single anchor above the related-tools band. Cluster-aware
  // via seo-clusters.mjs::resolveHubBacklink. Renders only for tool pages that have
  // a resolvable cluster hub (§3.12).
  const clusterHubLink = ctx.clusterHubLink;
  const clusterHubBlock = clusterHubLink && clusterHubLink.href && clusterHubLink.label
    ? `<div class="w3-row page-section clusterHubCallout"><p style="margin: 0 0 8px;"><a href="${escapeHtml(clusterHubLink.href)}" style="color: #4caf50; font-weight: 600;">See all ${escapeHtml(clusterHubLink.label)} &rarr;</a></p></div>`
    : '';
  // Related-tools band renders only when there are matched tool links - avoids an
  // empty "Related tools:" heading on guide pages whose matches are guide-only.
  const relatedToolsBlock = (showRelatedLinks && relatedToolsHtml)
    ? `<div class="w3-row page-section relatedToolsSection"><p style="margin-bottom: 0px;">Related tools:</p><div class="relatedTools">${relatedToolsHtml}</div>${relatedToolsTagsHtml}<script>loadRelatedTools = function(){try{var relatedEl=document.querySelector('.relatedTools');if(relatedEl&&relatedEl.children&&relatedEl.children.length>0){window.__relatedToolsRequested=!0;return;}if(window.__relatedToolsRequested)return;if(document.querySelector('script[src*="related-tools.js"]')){window.__relatedToolsRequested=!0;return;}window.__relatedToolsRequested=!0;loadScript('${ctx.relatedToolsScriptPath}?v=' + APP_VERSION, function(){});}catch(e){}};document.addEventListener('DOMContentLoaded',function(){try{if(window.__relatedToolsBootstrapped)return;window.__relatedToolsBootstrapped=!0;loadRelatedTools();}catch(e){}});</script></div>`
    : '';
  // Testimonials sit in the "User Rating" area - directly above the rating
  // widget - so real social proof and the star widget read as one trust unit
  // (operator request 2026-07-10). Renders only when the tool has genuinely
  // relevant testimonials (already filtered upstream). Gated on the same
  // related-links flag so guide/tool pages both qualify, ad-only chrome does not.
  const testimonialsBlock = (showRelatedLinks && ctx.testimonialsHtml) ? ctx.testimonialsHtml : '';
  // FAQ widget + bottom ad banner are ad-page surfaces - stay gated on showAds so
  // guide pages get only the internal related-links bands, no ad banner.
  return `<!-- SEO_BLOCK:RELATED_TOOLS -->${clusterHubBlock}${relatedToolsBlock}${relatedGuidesBlock}${relatedNewsBlock}${testimonialsBlock}${ratingBlock}${ctx.showAds && ctx.pageFaq ? ctx.pageFaq : ''}${ctx.showAds ? (ctx.bottomPageBannerAd || '') : ''}<!-- END_SEO_BLOCK:RELATED_TOOLS -->`;
}

function buildJsonLdScript(payload) {
  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}

// Cycle132 (Strategy #1 Citability) — `@type` switched WebApplication →
// SoftwareApplication. Schema.org treats WebApplication as a subtype of
// SoftwareApplication; the Rich Results gallery + AI-Overview citation
// surface favor SoftwareApplication for tool pages. The function name
// reflects the new type. Existing offers/operatingSystem/applicationCategory
// fields are retained as-is (already required by SoftwareApplication and
// already populated correctly).
function buildSoftwareApplicationJsonLd({ browserTitle, canonicalUrl, description, applicationCategory, aggregateRating, dateModified }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Free Tool Online - ${browserTitle}`,
    url: canonicalUrl,
    ...(description ? { description } : {}),
    operatingSystem: 'Any',
    applicationCategory: applicationCategory || 'UtilitiesApplication',
    // P8.2.4 schema-polish additions (Phase 8 Cycle 3): browserRequirements,
    // inLanguage, and a brand-logo screenshot so Google has a canonical visual
    // asset for SoftwareApp rich results. Per-tool screenshot upgrade deferred
    // to a dedicated CDN pipeline (P8.4.6 interim - default logo).
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    inLanguage: 'en-US',
    screenshot: 'https://dkbg1jftzfsd2.cloudfront.net/image/logo.200x200.png',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: '0',
    },
    ...(dateModified ? { dateModified } : {}),
    ...(aggregateRating ? { aggregateRating } : {}),
  };
  return buildJsonLdScript(jsonLd);
}

// Article JSON-LD for /guides/* routes. Attributes the article to the
// freetoolonline editorial team (Person schema added to Organization) and
// records the publication/modified date for freshness signals.
function buildArticleJsonLd({ canonicalUrl, canonicalOrigin, headline, description, datePublished, dateModified }) {
  const siteUrl = canonicalForRoute(canonicalOrigin, '/');
  const orgId = `${siteUrl}#organization`;
  const editorialTeamId = `${siteUrl}#editorial-team`;
  return buildJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    ...(description ? { description } : {}),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    author: { '@id': editorialTeamId },
    publisher: { '@id': orgId },
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    image: 'https://dkbg1jftzfsd2.cloudfront.net/image/logo.200x200.png',
    speakable: {
      // P10.3.7 - `.answer` selector was a dead match on guides (0/19 guide
      // pages emit that class; it's a tool-page idiom). Drop it and keep the
      // two selectors that resolve reliably on every guide: the H1 and the
      // pale-green answer/definition panel.
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.w3-pale-green'],
    },
  });
}

/**
 * ItemList JSON-LD for the homepage - top-N popular tools per cycle-16
 * GA4 28d-pageviews ranking. Helps Google's `ItemList` rich-result and the
 * "site:freetoolonline.com" SERP knowledge-panel surface popular tools
 * directly. Order MUST match the visible <ol id="popularToolsList"> in
 * BODYHTML.html so machine + human surfaces agree (qa-truthful-content-claim).
 */
function buildHomepageItemListJsonLd({ canonicalOrigin }) {
  // Top-6 by GA4 28d pageviews. List matches the visible <ol id="popularToolsList">
  // in BODYHTML.html exactly so machine + human surfaces stay byte-identical
  // (qa-truthful-content-claim G10 parity). Trimmed from 10 to 6 in cycle-17
  // W/E follow-up #4 to balance bento row-1 cell heights.
  const items = [
    { name: 'Compress, Zip File and Folder', url: '/zip-file.html' },
    { name: 'Remove Zip Password', url: '/remove-zip-password.html' },
    { name: 'HEIC to JPG', url: '/heic-to-jpg.html' },
    { name: 'LCD Test (Dead Pixel)', url: '/lcd-test.html' },
    { name: 'MD5 Converter', url: '/md5-converter.html' },
    { name: 'Camera Test', url: '/camera-test.html' },
  ];
  return buildJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Popular Free Tool Online tools',
    description: 'Six most-used tools on freetoolonline.com, ranked by GA4 28-day pageviews.',
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      url: canonicalForRoute(canonicalOrigin, item.url),
    })),
  });
}

function buildWebSiteJsonLd({ canonicalUrl, name, includeSearchAction = false, dateModified }) {
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: canonicalUrl,
    inLanguage: 'en-US',
    ...(dateModified ? { dateModified } : {}),
  };
  // SearchAction is only meaningful on the home route - enables the SERP
  // sitelinks-searchbox rich feature. The target uses the /tags.html route
  // because freetoolonline.com does not operate a dedicated /search endpoint;
  // the tag index is the closest canonical match for a query-driven browse.
  if (includeSearchAction) {
    payload.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${canonicalUrl.replace(/\/$/, '')}/tags.html?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    };
  }
  return buildJsonLdScript(payload);
}

function buildOrganizationJsonLd({ canonicalOrigin }) {
  const siteUrl = canonicalForRoute(canonicalOrigin, '/');
  const orgId = `${siteUrl}#organization`;
  const editorialTeamId = `${siteUrl}#editorial-team`;
  return buildJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    name: 'Free Tool Online',
    alternateName: 'freetoolonline',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: 'https://dkbg1jftzfsd2.cloudfront.net/image/logo.200x200.png',
      caption: 'Free Tool Online',
      width: 200,
      height: 200,
    },
    foundingDate: '2015',
    description: 'A collection of 100+ free online tools (ZIP, PDF, image conversion, device tests, developer utilities, video) curated by the freetoolonline editorial team since 2015.',
    slogan: 'Free online tools, no sign-up, no install.',
    sameAs: [
      'https://twitter.com/freetoolonline1',
      'https://www.buymeacoffee.com/freetoolonline.com',
      'https://www.trustpilot.com/review/freetoolonline.com',
      'https://github.com/dangkhoaow/freetoolonline-web',
    ],
    knowsAbout: [
      'file compression',
      'image conversion',
      'PDF tools',
      'HEIC to JPG conversion',
      'browser-based hardware diagnostics',
      'JavaScript and CSS minification',
      'video format conversion',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: canonicalForRoute(canonicalOrigin, '/contact-us.html'),
        availableLanguage: ['en', 'vi'],
      },
    ],
    // Editorial team surfaced as a named Person for E-E-A-T reinforcement.
    // Matches the editorial-byline.html fragment shipped in Phase 7 HIGH PRIORITY.
    employee: [
      {
        '@type': 'Person',
        '@id': editorialTeamId,
        name: 'freetoolonline editorial team',
        jobTitle: 'Editorial team',
        worksFor: { '@id': orgId },
        description: 'The Free Tool Online editorial team has shipped browser-based tools since 2015. Every tool is tested in the current versions of Chrome, Firefox, Safari, and Edge before publishing, processes your file inside your browser without uploading it, and is retired from the site if it breaks.',
        knowsAbout: [
          'in-browser file processing',
          'image and video conversion',
          'PDF manipulation',
          'browser hardware diagnostics',
          'JavaScript and CSS minification',
          'cross-browser testing',
        ],
      },
    ],
  });
}

function normalizeBreadcrumbLabel(label) {
  const raw = String(label ?? '').trim();
  if (!raw) {
    return '';
  }
  const normalized = raw.replace(/^back to\s+/i, '').trim();
  return normalized || raw;
}

function buildCollectionPageJsonLd({ canonicalOrigin, canonicalUrl, name, itemRoutes, dateModified }) {
  const itemListElement = (itemRoutes ?? []).map((route, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: canonicalForRoute(canonicalOrigin, route),
  }));
  // lastReviewed mirrors dateModified when available - both come from the
  // most recent commit that touched the hub's CMS fragments / JSP wrapper,
  // so a hub's "last reviewed" stamp tracks real edits to the hub itself.
  // Falls back to the historical 2026-04-25 anchor when no mtime is supplied
  // (e.g. uncommitted local builds).
  const lastReviewed = (dateModified || '').slice(0, 10) || '2026-04-25';
  return buildJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: canonicalUrl,
    inLanguage: 'en-US',
    lastReviewed,
    ...(dateModified ? { dateModified } : {}),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement,
    },
  });
}

function buildBreadcrumbJsonLd({ canonicalOrigin, items }) {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: canonicalForRoute(canonicalOrigin, item.route),
  }));
  return buildJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  });
}

function buildRelatedToolsSsr({ route, navTitle, urlMaps }) {
const currentTitle = String(navTitle ?? '').trim();
  const currentTitleLower = currentTitle.toLowerCase();
  const currentRoute = String(route ?? '').trim();
  const currentRouteKey = (() => {
    if (!currentRoute || currentRoute === '/') return '/';
    const clean = currentRoute.split('?')[0].split('#')[0];
    const parts = clean.split('/').filter(Boolean);
    const leaf = parts[parts.length - 1] || '';
    if (!leaf || leaf === 'index.html') return '/';
    return leaf.startsWith('/') ? leaf : `/${leaf}`;
  })();

  if (!currentTitle || RELATED_TOOLS_TAGS_PAGE_TITLES.has(currentTitleLower)) {
    return { listHtml: '', guidesListHtml: '', newsListHtml: '', tagsHtml: '', linkCount: 0, guideCount: 0, newsCount: 0, tagsCount: 0 };
  }

  const items = (urlMaps ?? []).map((item) => {
    const url = String(item?.url ?? '');
    let routeKey = '';
    try {
      const parsed = new URL(url);
      const pathname = String(parsed.pathname ?? '');
      const parts = pathname.split('/').filter(Boolean);
      const leaf = parts[parts.length - 1] || '';
      routeKey = !leaf || leaf === 'index.html' ? '/' : `/${leaf.replace(/^\//, '')}`;
    } catch {
      routeKey = '';
    }
    return {
      title: String(item?.title ?? ''),
      url,
      tags: String(item?.tags ?? ''),
      // Optional one-line blurb (urlMaps[].desc). Rendered as "Title - desc" in
      // both the Related-tools and Related-guides sections. ASCII-hyphen only
      // (locked rule R9); desc text is authored R9-clean in related-tools.js.
      desc: String(item?.desc ?? '').trim(),
      // A /guides/ URL routes into the dedicated Related-guides section; every
      // other URL stays in Related-tools. Locale guide URLs (/guides/<lang>/...)
      // also match. (plan-kahan: partition the matched links into two sections.)
      isGuide: /\/guides\//.test(url),
      // news-loop (2026-07-08): a /news/ URL routes into the dedicated
      // Related-news section instead of Related-tools. Checked before isGuide
      // is irrelevant here since the two prefixes never overlap.
      isNews: /\/news\//.test(url),
      include: false,
      routeKey,
    };
  });
  let allCurrentTags = '';
  let isAddedAll = false;

  const getTagsFromCurrentPage = () => {
    const currentItem =
      items.find((item) => item.routeKey && item.routeKey === currentRouteKey) ||
      items.find((item) => item.title.toLowerCase() === currentTitleLower) ||
      null;

    if (!currentItem) {
      console.log(`[related-tools:ssr] Unable to match current page (route=${currentRoute}, title=${currentTitle}).`);
      return [];
    }

    const tagList = currentItem.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    if (!isAddedAll) {
      for (const tag of tagList) {
        const lower = tag.toLowerCase();
        allCurrentTags =
          (allCurrentTags !== '' ? `${allCurrentTags}, ` : allCurrentTags) +
          `<a target="_blank" style="color: #4caf50" href="https://freetoolonline.com/tags.html?tag=${lower}">#${lower}</a>`;
      }
    }
    isAddedAll = true;
    return tagList;
  };

  const addPagesHasTheSameTag = (candidateTags, currentTags) => {
    if (!candidateTags || !currentTags || !currentTags.length) {
      return '';
    }
    let matchedTags = '';
    for (const candidateTag of candidateTags) {
      for (const currentTag of currentTags) {
        if (
          candidateTag.toLowerCase() !== '' &&
          candidateTag.toLowerCase() !== 'null' &&
          candidateTag.toLowerCase() === currentTag.toLowerCase()
        ) {
          matchedTags = `${matchedTags} #${candidateTag.toLowerCase()}`;
        }
      }
    }
    return matchedTags;
  };

  const currentTags = getTagsFromCurrentPage();
  // Partitioned buckets: tools -> Related tools section, guides -> Related
  // guides section (plan-kahan), news -> Related news section (news-loop
  // 2026-07-08). Each <li> carries an optional "- desc" blurb.
  const toolItems = [];
  const guideItems = [];
  const newsItems = [];

  // Render one <li>. Title is the colored link; the optional desc renders as
  // plain grey text after an ASCII " - " separator (matches the legacy inline
  // "Related guides" markup + locked rule R9 - no em/en-dash).
  const renderLi = (item, titleAttr, color) => {
    const descHtml = item.desc ? ` - <span class="desc">${escapeHtml(item.desc)}</span>` : '';
    return `<li class="d-inline"><a title="${titleAttr}" style="color: ${color};" href="${item.url}">${item.title}</a>${descHtml}</li>`;
  };
  const pushLi = (item, html) => {
    if (item.isNews) { newsItems.push(html); return; }
    (item.isGuide ? guideItems : toolItems).push(html);
  };

  for (const item of items) {
    if (!item.include && item.routeKey !== currentRouteKey) {
      const matchedTags = addPagesHasTheSameTag(item.tags.split(','), currentTags);
      if (matchedTags !== '') {
        item.include = true;
        pushLi(item, renderLi(item, `This page has the same tag(s): ${matchedTags}`, '#4caf50'));
      }
    }
  }

  // Language-independent relevance. The URL slug is ALWAYS English kebab-case,
  // even on localized /guides/<lang>/... routes and bare-path /guides/... routes,
  // whereas navTitle is the (possibly non-English) display title. Matching on the
  // display title alone means a non-English navTitle word-matches none of the
  // English urlMaps titles -> zero related links -> NEITHER related section can
  // render. That is the root cause of 0/945 localized guide pages (and entry-less
  // EN guides) showing no Related-tools/Related-guides block. Merging the canonical
  // slug words into the match pool lets every route surface related links in any
  // locale. Tag-match (above) stays the primary signal; this augments title-match.
  const slugWords = currentRouteKey
    .replace(/^\//, '')
    .replace(/\.html?$/i, '')
    .split('-')
    .filter(Boolean);
  const currentTitleWords = [...new Set([
    ...currentTitle.toLowerCase().replace(/,/g, '').split(' '),
    ...slugWords,
  ])];
  for (const item of items) {
    let firstMatchedWord = false;
    const titleLower = item.title.toLowerCase();
    for (const word of currentTitleWords) {
      if (
        !item.include &&
        item.routeKey !== currentRouteKey &&
        !RELATED_TOOLS_STOP_WORDS.has(word) &&
        titleLower.indexOf(word) > -1
      ) {
        if (firstMatchedWord) {
          item.include = true;
          pushLi(item, renderLi(item, `Go to ${item.title}`, '#3b73af'));
        } else {
          firstMatchedWord = true;
        }
      }
    }
  }

  // §1a curated overrides: promote hand-curated guide URLs (from RELATED_GUIDES_CURATED) to
  // the front of guideItems so the coverage-preserving contract holds regardless of cap order.
  // Root cause fix (2026-06-28): the tag-match loops may already add all curated items to
  // guideItems (because they have matching tags), but as items #13-#79 — beyond the
  // RELATED_GUIDES_MAX=12 cap. Simple unshift-if-absent fails because all are already present.
  // Fix: remove each curated item from its current position in guideItems, then prepend.
  const curatedPaths = RELATED_GUIDES_CURATED[routeToSlug(currentRoute)] ?? [];
  if (curatedPaths.length > 0) {
    const curatedHtml = [];
    const curatedUrls = new Set();
    for (const path of curatedPaths) {
      const matchedItem = items.find((item) => {
        try {
          const itemPath = new URL(item.url).pathname;
          return itemPath === path || itemPath === path.replace('/guides/en/', '/guides/');
        } catch { return false; }
      });
      if (matchedItem && matchedItem.isGuide && !curatedUrls.has(matchedItem.url)) {
        curatedHtml.push(renderLi(matchedItem, `Go to ${matchedItem.title}`, '#3b73af'));
        curatedUrls.add(matchedItem.url);
      }
    }
    // Remove curated items from their existing positions (they may be at positions > cap).
    for (let i = guideItems.length - 1; i >= 0; i--) {
      const m = /href="(https:\/\/freetoolonline\.com\/guides[^"]+)"/.exec(guideItems[i]);
      if (m && curatedUrls.has(m[1])) guideItems.splice(i, 1);
    }
    guideItems.unshift(...curatedHtml);
  }

  const cappedToolItems = toolItems.slice(0, RELATED_TOOLS_MAX);
  const cappedGuideItems = guideItems.slice(0, RELATED_GUIDES_MAX);
  const cappedNewsItems = newsItems.slice(0, RELATED_NEWS_MAX);
  const hasTools = cappedToolItems.length > 0;
  const hasGuides = cappedGuideItems.length > 0;
  const hasNews = cappedNewsItems.length > 0;
  const listHtml = hasTools ? `<ul style="${RELATED_TOOLS_LIST_STYLE}">${cappedToolItems.join('')}</ul>` : '';
  const guidesListHtml = hasGuides ? `<ul style="${RELATED_TOOLS_LIST_STYLE}">${cappedGuideItems.join('')}</ul>` : '';
  const newsListHtml = hasNews ? `<ul style="${RELATED_TOOLS_LIST_STYLE}">${cappedNewsItems.join('')}</ul>` : '';
  // Tags line stays attached to the Related-tools section (unchanged) and shows
  // whenever any link (tool, guide, or news) matched by tag.
  const tagsHtml = (hasTools || hasGuides || hasNews) && allCurrentTags !== '' ? `<p>Tags: ${allCurrentTags}</p>` : '';
  return {
    listHtml,
    guidesListHtml,
    newsListHtml,
    tagsHtml,
    linkCount: cappedToolItems.length,
    guideCount: cappedGuideItems.length,
    newsCount: cappedNewsItems.length,
    tagsCount: tagsHtml ? currentTags.length : 0,
  };
}

function stripHtml(value) {
  return String(value ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFaqItems(faqHtml, pageName = '') {
  const raw = String(faqHtml ?? '').trim();
  if (!raw) {
    return [];
  }

  const logPrefix = pageName ? `[faq:${pageName}]` : '[faq]';

  // Fast path: faq-item class detected — extract directly from <details class="faq-item">
  // elements without requiring a <h2>FAQ</h2> header. This handles guide pages where the
  // FAQ is embedded inline in BODYHTML with translated headers.
  if (/class=["'][^"']*faq-item[^"']*["']/.test(raw)) {
    const detailsRe = /<details[^>]*class=["'][^"']*faq-item[^"']*["'][^>]*>([\s\S]*?)<\/details>/gi;
    const items = [];
    let dm;
    while ((dm = detailsRe.exec(raw)) !== null) {
      const inner = dm[1];
      const qm = /<summary[^>]*>([\s\S]*?)<\/summary>/i.exec(inner);
      const am = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(inner);
      if (qm && am) {
        const question = stripHtml(qm[1]);
        const answer = stripHtml(am[1]);
        if (question && answer) items.push({ question, answer });
      }
    }
    if (items.length > 0) {
      console.log(`${logPrefix} FAQ items extracted via faq-item class (${items.length} entries).`);
      return items;
    }
  }

  // Primary: canonical "Frequently Asked Questions" header.
  // Extended: also accept FAQ-variant headers ("FAQ:", "FAQs", or "FAQ <topic>")
  // so fragments whose H2 uses a non-canonical phrasing still emit FAQPage JSON-LD.
  const headerRegex = /<h2[^>]*>[\s\S]*?(?:frequently asked questions|\bfaqs?\b[:\s][\s\S]*?)[\s\S]*?<\/h2>/i;
  let headerIndex = -1;
  let headerHtml = '';
  const headerMatch = raw.match(headerRegex);

  if (headerMatch && typeof headerMatch.index === 'number') {
    headerIndex = headerMatch.index;
    headerHtml = headerMatch[0];
    console.log(`${logPrefix} FAQ header matched with <h2> tag.`);
  } else {
    const lower = raw.toLowerCase();
    const probes = ['frequently asked questions', 'faq:', 'faqs:', 'faqs '];
    let textIndex = -1;
    for (const needle of probes) {
      const idx = lower.indexOf(needle);
      if (idx >= 0 && (textIndex < 0 || idx < textIndex)) textIndex = idx;
    }
    if (textIndex >= 0) {
      const startIndex = raw.lastIndexOf('<h2', textIndex);
      const endIndex = raw.indexOf('</h2>', textIndex);
      if (startIndex >= 0 && endIndex >= 0) {
        headerIndex = startIndex;
        headerHtml = raw.slice(startIndex, endIndex + 5);
        console.log(`${logPrefix} FAQ header matched via fallback slice.`);
      }
    }
  }

  if (headerIndex < 0) {
    console.log(`${logPrefix} FAQ header not found; skipping JSON-LD.`);
    return [];
  }

  const afterHeader = raw.slice(headerIndex + headerHtml.length);
  const nextHeaderIndex = afterHeader.search(/<h2[^>]*>/i);
  const faqSection = nextHeaderIndex >= 0 ? afterHeader.slice(0, nextHeaderIndex) : afterHeader;
  // Cycle 20260514-9 — collapsible FAQ migration. The new canonical FAQ
  // entry shape is `<details class="faq-item"><summary>Question?</summary>
  // <p>Answer.</p></details>` (default-collapsed disclosure widget; reduces
  // page-height bloat so readers can scan the question list and expand only
  // what they want). The regex below accepts BOTH the new <summary>Q</summary>
  // shape AND the legacy <h3>Q</h3> shape so FAQPage JSON-LD continues
  // emitting during the migration. Once every FAQ file is migrated, the
  // legacy alternation can be removed.
  const qaRegex = /<(?:h3|summary)[^>]*>([\s\S]*?)<\/(?:h3|summary)>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  const items = [];
  let match = null;

  while ((match = qaRegex.exec(faqSection)) !== null) {
    const question = stripHtml(match[1]);
    const answer = stripHtml(match[2]);
    if (question && answer) {
      items.push({ question, answer });
    }
  }

  if (items.length === 0) {
    console.log(`${logPrefix} FAQ header found but no Q/A pairs extracted.`);
  }

  return items;
}

function buildFaqJsonLd(faqItems) {
  return buildJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  });
}

function deriveHowToStepName(text) {
  const cleaned = String(text ?? '').trim();
  if (!cleaned) {
    return '';
  }
  const firstSentence = cleaned.split(/[.!?]/)[0].trim();
  const base = firstSentence || cleaned;
  return base.length > 80 ? `${base.slice(0, 77)}…` : base;
}

function extractHowToSteps(bodyHtml, pageName = '', route = '') {
  const raw = String(bodyHtml ?? '').trim();
  if (!raw) {
    return [];
  }

  const logPrefix = pageName ? `[howto:${pageName}]` : '[howto]';
  const headSlice = raw.slice(0, 8000);
  const panelMatch = headSlice.match(/<div[^>]*class=['"][^'"]*w3-pale-green[^'"]*['"][^>]*>[\s\S]*?<\/div>/i);
  const scopeHtml = panelMatch ? panelMatch[0] : headSlice;
  const olMatch = scopeHtml.match(/<ol[^>]*>([\s\S]*?)<\/ol>/i);

  if (!olMatch) {
    console.log(`${logPrefix} No <ol> steps found for ${route || '(unknown route)'}.`);
    return [];
  }

  const steps = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match = null;
  while ((match = liRegex.exec(olMatch[1])) !== null) {
    const stepText = stripHtml(match[1]);
    if (stepText) {
      steps.push(stepText);
    }
  }

  if (steps.length === 0) {
    console.log(`${logPrefix} <ol> found but no <li> steps extracted for ${route || '(unknown route)'}.`);
  } else {
    console.log(`${logPrefix} Extracted ${steps.length} steps for ${route || '(unknown route)'}.`);
  }

  return steps;
}

function buildHowToJsonLd({ canonicalUrl, name, description, steps }) {
  const safeSteps = (steps ?? [])
    .map((text) => {
      const cleaned = String(text ?? '').trim();
      if (!cleaned) {
        return null;
      }
      const stepName = deriveHowToStepName(cleaned);
      return {
        '@type': 'HowToStep',
        ...(stepName ? { name: stepName } : {}),
        text: cleaned,
      };
    })
    .filter(Boolean);

  if (safeSteps.length === 0) {
    return '';
  }

  return buildJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    url: canonicalUrl,
    ...(description ? { description } : {}),
    step: safeSteps,
  });
}

export function parseJspPageSource(jspSource) {
  const match = String(jspSource ?? '').match(/<freetoolonline:page\b([^>]*)>([\s\S]*)<\/freetoolonline:page>/i);
  if (!match) {
    return { attrs: {}, innerHtml: String(jspSource ?? '') };
  }
  const attrs = {};
  for (const attrMatch of match[1].matchAll(/([\w-]+)=('([^']*)'|"([^"]*)")/g)) {
    attrs[attrMatch[1]] = attrMatch[3] ?? attrMatch[4] ?? '';
  }
  return { attrs, innerHtml: match[2] };
}

export function renderJspBody(innerHtml, ctx) {
  let html = replaceExpressions(innerHtml, ctx);
  html = html.replace(/<freetoolonline:loading\s*\/>/gi, renderLoadingTag());
  html = html.replace(/<freetoolonline:download\s*\/>/gi, renderDownloadTag());
  html = html.replace(/<freetoolonline:upload-second\s*\/>/gi, renderUploadSecondTag());
  html = html.replace(/<freetoolonline:upload(?:\s*\/>|>\s*<\/freetoolonline:upload>)/gi, renderUploadTag(ctx, ctx.appVersion));
  html = html.replace(/<freetoolonline:upload-startup\s+multiple='([^']*)'\s+fileType='([^']*)'\s*\/>/gi, (_, multiple, fileType) => renderUploadStartupTag(multiple, fileType, ctx));
  html = html.replace(/<freetoolonline:upload-startup-second\s+multiple='([^']*)'\s+fileType='([^']*)'\s*\/>/gi, (_, multiple, fileType) => renderUploadStartupSecondTag(multiple, fileType));
  html = html.replace(/<freetoolonline:welcome\s+welcomeTest='([^']*)'\s*\/>/gi, (_, welcomeTest) => renderWelcomeTag(replaceExpressions(welcomeTest, ctx)));
  html = html.replace(/<freetoolonline:share-btns>\s*<\/freetoolonline:share-btns>/gi, renderShareButtons(ctx));
  return html;
}

export function renderPageDocument({ route, siteOrigin, canonicalOrigin, basePath, isStaging, rewriteInternalContent, apiOrigin, shortenDomain, appVersion, ioVersion, deploySha, getAlterUploaderDelayMs, bgsCollection, ioInfos, unsplashKey, randomString, sharedFragments, lMenu, pageData, pageAttrs, bodyHtml, themeCss, aggregateRating, relatedToolsData, lastUpdatedIso }) {
  const normalizedRoute = route;
  const normalizedBasePath = normalizeBasePath(basePath);
  const pageName = pageData.pageName;
  const pageUrl = pageData.pageUrl;
  const isHome = normalizedRoute === '/';
  // Rewrite the legacy hardcoded "Last updated: Nov 13, 2024" stamp baked
  // into 48 BODYWELCOME fragments - replace it in place with the page's
  // real git mtime so the visible under-H1 stamp tracks actual edits.
  // welcomeHasInlineStamp tells the renderer to skip the bottom-of-page
  // fallback stamp on these pages (one stamp per page; under-H1 wins).
  const welcomeRewrite = rewriteLastUpdatedTag(pageData.bodyWelcome, lastUpdatedIso);
  const bodyWelcome = welcomeRewrite.html;
  const welcomeHasInlineStamp = welcomeRewrite.replaced;
  const expressionCtx = {
    pageBodyTitle: pageData.bodyTitle,
    pageBodyDesc: pageData.bodyDesc,
    pageBodyKeyword: pageData.bodyKeyword,
    pageBodyHTML: pageData.bodyHtml,
    pageBodyJS: pageData.bodyJs,
    pageBodyWelcome: bodyWelcome,
    pageBodyFileType: pageData.bodyFileType,
    pageBodyFileType2: pageData.bodyFileType2,
    pageFaq: pageData.faq,
    pageStyle: pageData.pageStyle,
    pageBrowserTitle: pageData.pageBrowserTitle,
    pageHasSettings: pageData.pageHasSettings,
    privacyContent: sharedFragments.privacyContent,
    shortenDomain,
    pageUrl,
    pageName,
  };
  const resolveAttr = (value) => replaceExpressions(value ?? '', expressionCtx).trim();

  // Priority: PAGEBROWSERTITLE<slug>.txt fragment wins over the JSP attribute (which
  // historically defaulted to `${pageBodyTitle}` across 120 JSPs and was shadowing
  // per-route SEO title overrides). Fragment-based override is the cycle-11 truth-source
  // mechanism for trimming `<title>` to the G4 30-65 char band without rewriting BODYTITLE
  // (which still drives the in-page H1 brand voice). Falls back to JSP attr (for routes
  // that explicitly want a JSP-driven title) or BODYTITLE if neither override exists.
  const browserTitle = pageData.pageBrowserTitle || resolveAttr(pageAttrs.browserTitle) || pageData.bodyTitle;
  const pageTitle = resolveAttr(pageAttrs.pageTitle) || '';
  const description = resolveAttr(pageAttrs.description) || pageData.bodyDesc || '';
  const keyword = resolveAttr(pageAttrs.keyword) || pageData.bodyKeyword || '';
  const customStyle = resolveAttr(pageAttrs.customStyle) || '';
  const pageStyle = pageData.pageStyle || '';
  // 2026-05-28 S1.3: locale-prefix guide URLs (`/guides/<lang>/<slug>.html`)
  // override the JSP-declared lang attribute. The <lang> path segment is the
  // authoritative locale signal for these routes.
  const _detectedGuideLocale = detectGuideLocaleFromRoute(route);
  const lang = _detectedGuideLocale || resolveAttr(pageAttrs.lang) || 'en';
  const hasSettingsAttr = resolveAttr(pageAttrs.hasSettings);
  const hasSettings = hasSettingsAttr === 'true' || hasSettingsAttr === 'TRUE' || pageData.pageHasSettings;
  const hasUpload = /<freetoolonline:upload(?:-startup(?:-second)?|-second)?\b/i.test(bodyHtml)
    || /id=['"]hasUploadFunc['"]/.test(bodyHtml)
    || /uploadContainerSecond/.test(bodyHtml)
    || /uploadContainer/.test(bodyHtml);
  const showAds = !isHome && !isInfoRoute(normalizedRoute) && normalizedRoute !== '/alternatead.html';
  const isGuide = isGuideRoute(normalizedRoute);
  // Ad slots load on tool pages AND guide pages. Guides remain Article-only
  // (no rating / related-tools / FAQ / SoftwareApplication JSON-LD) — those
  // stay gated on showAds. See INFO_ROUTES comment in site-data.mjs.
  const showAdSlots = showAds || isGuide;
  // Phase 16 Cycle B: detect hub pages either by suffix (existing
  // /<X>-tools.html convention) or by explicit hubRoute registration in
  // SEO_CLUSTER_GROUPS (added so /guides.html participates in the same
  // hub treatment without renaming it to /guide-tools.html).
  const isHubPage = normalizedRoute.endsWith('-tools.html')
    || SEO_CLUSTER_GROUPS.some((group) => group.hubRoute === normalizedRoute);
  const showRating = showAds && !isHubPage;
  // For guide pages with FAQ items embedded inline in BODYHTML (no separate FAQ*.html),
  // fall back to BODYHTML so FAQPage JSON-LD is still emitted. Tool/hub pages always use
  // the dedicated FAQ*.html fragment only.
  const faqSource = isGuide && !pageData.faq ? pageData.bodyHtml : pageData.faq;
  const faqItems = extractFaqItems(faqSource, pageName);
  if (faqSource) {
    console.log(`[faq] Parsed ${faqItems.length} FAQ entries for ${pageName}.`);
  }
  const canonicalUrl = resolveCanonicalUrl({
    canonicalOrigin,
    route: normalizedRoute,
    canonicalUrl: pageData.canonicalUrl,
    basePath: normalizedBasePath,
  });
  const relatedToolsScriptPath = `${normalizedBasePath}/script/related-tools.js`;
  const navTitle = pageTitle || browserTitle;
  const hubBacklink = resolveHubBacklink(normalizedRoute);
  const hubGroup = SEO_CLUSTER_GROUPS.find((group) => group.hubRoute === normalizedRoute) ?? null;
  const hubLabelFromGroup = hubGroup ? normalizeBreadcrumbLabel(hubGroup.hubLabel) : '';
  const hubLabelFromBacklink = hubBacklink ? normalizeBreadcrumbLabel(hubBacklink.label) : '';
  const hubLabel = hubLabelFromBacklink || hubLabelFromGroup || (isHubPage ? browserTitle : '');
  const hubRoute = hubBacklink?.href || (isHubPage ? normalizedRoute : '');
  const hubItemRoutes = hubGroup ? hubGroup.routes : [];
  if (isHubPage) {
    console.log(`[schema] Hub ${normalizedRoute} item routes=${hubItemRoutes.length}.`);
  }
  const breadcrumbItems = [];
  if (!isHome) {
    breadcrumbItems.push({ name: 'Home', route: '/' });
    if (hubLabel && hubRoute) {
      breadcrumbItems.push({ name: hubLabel, route: hubRoute });
    }
    if (!isHubPage) {
      breadcrumbItems.push({ name: browserTitle, route: normalizedRoute });
    }
  }
  if (breadcrumbItems.length > 0) {
    console.log(`[schema] Breadcrumbs for ${normalizedRoute}: ${breadcrumbItems.length} items.`);
  }
  const aggregateRatingPayload = showRating && aggregateRating
    ? {
      '@type': 'AggregateRating',
      worstRating: 1,
      bestRating: 5,
      ratingValue: aggregateRating.ratingValue,
      ratingCount: aggregateRating.ratingCount,
    }
    : null;
  const jsonLd = showAds
    ? isHubPage
      ? buildCollectionPageJsonLd({ canonicalOrigin, canonicalUrl, name: browserTitle, itemRoutes: hubItemRoutes, dateModified: lastUpdatedIso })
      : buildSoftwareApplicationJsonLd({
        browserTitle,
        canonicalUrl,
        description,
        applicationCategory: resolveApplicationCategory(normalizedRoute),
        aggregateRating: aggregateRatingPayload,
        dateModified: lastUpdatedIso,
      })
    : isHome
      ? buildWebSiteJsonLd({ canonicalUrl, name: 'Home Page - Free Tool Online', includeSearchAction: true, dateModified: lastUpdatedIso })
      : buildWebSiteJsonLd({ canonicalUrl, name: `Free Tool Online - ${browserTitle}`, dateModified: lastUpdatedIso });
  const faqJsonLd = faqItems.length > 0 ? buildFaqJsonLd(faqItems) : '';
  const breadcrumbJsonLd = breadcrumbItems.length > 0
    ? buildBreadcrumbJsonLd({ canonicalOrigin, items: breadcrumbItems })
    : '';
  // Organization JSON-LD: emit on home, hub pages, AND guide pages (guide Article
  // schema references the Organization and its editorial-team Person by @id).
  const organizationJsonLd = (isHome || isHubPage || isGuide) ? buildOrganizationJsonLd({ canonicalOrigin }) : '';
  if (organizationJsonLd) {
    console.log(`[schema:org] Injected Organization JSON-LD on ${normalizedRoute}.`);
  }
  // Article JSON-LD for /guides/* routes. Uses the page's browserTitle as
  // headline, meta description as abstract, the 2026-04-19 publish anchor
  // (matches the visible <time> element in each guide BODYHTML), and a
  // dateModified derived from the most recent commit that touched the
  // guide's own CMS fragments / JSP wrapper. Falls back to the publish
  // date when no per-page mtime is available.
  const articleJsonLd = isGuide
    ? buildArticleJsonLd({
        canonicalUrl,
        canonicalOrigin,
        headline: browserTitle,
        description,
        datePublished: '2026-04-19T08:00:00Z',
        dateModified: lastUpdatedIso || '2026-04-19T08:00:00Z',
      })
    : '';
  if (articleJsonLd) {
    console.log(`[schema:article] ${normalizedRoute} headline="${browserTitle}".`);
  }
  const shouldIncludeHowTo = showAds && !isHubPage && HOWTO_ROUTES.has(normalizedRoute);
  const howToSteps = shouldIncludeHowTo ? extractHowToSteps(pageData.bodyHtml, pageName, normalizedRoute) : [];
  const howToJsonLd = shouldIncludeHowTo
    ? buildHowToJsonLd({ canonicalUrl, name: browserTitle, description, steps: howToSteps })
    : '';
  if (shouldIncludeHowTo) {
    console.log(`[schema:howto] ${normalizedRoute} steps=${howToSteps.length}.`);
  }
  const homepageItemListJsonLd = isHome ? buildHomepageItemListJsonLd({ canonicalOrigin }) : '';
  if (homepageItemListJsonLd) {
    console.log(`[schema:itemlist] Injected ItemList JSON-LD on homepage (10 popular tools).`);
  }
  const jsonLdBlock = [jsonLd, organizationJsonLd, articleJsonLd, homepageItemListJsonLd, breadcrumbJsonLd, howToJsonLd, faqJsonLd].filter(Boolean).join('\n');
  const head = renderMetaTags({
    siteOrigin,
    route: normalizedRoute,
    pageName,
    pageUrl,
    isHome,
    isStaging,
    isGuide,
    articlePublishedAt: isGuide ? '2026-04-19T08:00:00Z' : '',
    articleModifiedAt: isGuide ? (lastUpdatedIso || '2026-04-19T08:00:00Z') : '',
    browserTitle,
    mobileBrowserTitle: pageData.pageBrowserTitleMobile,
    description,
    keyword,
    canonicalUrl,
    lang,
    pageTitle,
    themeCss,
    customStyle,
    pageStyle,
    jsonLd: jsonLdBlock,
    appVersion,
    deploySha,
  });
  const titleText = navTitle;
  const body = renderJspBody(bodyHtml, {
    siteOrigin,
    apiOrigin,
    shortenDomain,
    pageName,
    pageUrl,
    bodyTitle: pageData.bodyTitle,
    bodyDesc: pageData.bodyDesc,
    bodyKeyword: pageData.bodyKeyword,
    pageBodyTitle: pageData.bodyTitle,
    pageBodyDesc: pageData.bodyDesc,
    pageBodyKeyword: pageData.bodyKeyword,
    pageBodyHTML: pageData.bodyHtml,
    pageBodyJS: pageData.bodyJs,
    pageBodyWelcome: bodyWelcome,
    pageBodyFileType: pageData.bodyFileType,
    pageBodyFileType2: pageData.bodyFileType2,
    pageFaq: pageData.faq,
    pageStyle: pageData.pageStyle,
    pageBrowserTitle: pageData.pageBrowserTitle,
    pageHasSettings: pageData.pageHasSettings,
    privacyContent: sharedFragments.privacyContent,
    appVersion,
    ioVersion,
    getAlterUploaderDelayMs,
    bgsCollection,
    ioInfos,
  });
  // Related-links (tools + guides) gate. Distinct from showAds: guide pages are
  // registered in INFO_ROUTES (so showAds=false -> no ad slots by design), but they
  // MUST still render internal related links - cross-guide linking is the whole
  // point of the section. So compute related links on every tool + guide page,
  // excluding only true info pages (about/contact/privacy/editorial), home, and the
  // ad-backfill route. Root cause (2026-06-28): ~945 localized + most EN guide pages
  // rendered NO related section because the computation was gated on showAds. Ads
  // themselves are UNCHANGED - still gated on showAds.
  const showRelatedLinks = !isHome
    && normalizedRoute !== '/alternatead.html'
    && (!isInfoRoute(normalizedRoute) || isGuideRoute(normalizedRoute));
  const relatedToolsState = showRelatedLinks && relatedToolsData?.urlMaps
    ? buildRelatedToolsSsr({ route: normalizedRoute, navTitle, urlMaps: relatedToolsData.urlMaps })
    : { listHtml: '', guidesListHtml: '', newsListHtml: '', tagsHtml: '', linkCount: 0, guideCount: 0, newsCount: 0, tagsCount: 0 };
  // Dedicated Related-guides section gate (plan-kahan): RELATED_GUIDES_GLOBAL-driven.
  // The guide links are always computed (partitioned out of the matched set); this
  // flag only controls whether the section is emitted for this route.
  const showRelatedGuides = showRelatedLinks && isRelatedGuidesEnabled(normalizedRoute);
  if (showRelatedLinks && relatedToolsData?.urlMaps) {
    console.log(`[related-tools:ssr] ${normalizedRoute} tools=${relatedToolsState.linkCount} guides=${relatedToolsState.guideCount} news=${relatedToolsState.newsCount} tags=${relatedToolsState.tagsCount} guides_section=${showRelatedGuides ? 'on' : 'off'}.`);
  }
  // Cluster-hub link above related-tools on tool pages (not hubs/home/info).
  // resolveHubBacklink returns { href, label } for tool pages in a cluster; null otherwise.
  const clusterHubLink = !isHubPage && !isHome && !isInfoRoute(normalizedRoute)
    ? resolveHubBacklink(normalizedRoute)
    : null;
  if (clusterHubLink) {
    console.log(`[seo:cluster-hub] ${normalizedRoute} → ${clusterHubLink.href} (${clusterHubLink.label}).`);
  }
  // Real-user testimonials (E-E-A-T / trust, 2026-07-10). Tool pages get the
  // testimonials genuinely ABOUT that tool (matched by slug or its related-
  // tools tags); pages with no tool-specific testimonial show nothing (no
  // generic filler). Homepage testimonials are spliced into BODYHTML markers
  // in export-site.mjs. The .user-testimonials container is excluded from the
  // truthful-claim diff (attributed third-party quotes, not tool claims).
  const pageMapEntry = (relatedToolsData?.urlMaps || []).find((e) => {
    try { return new URL(String(e.url)).pathname === normalizedRoute; } catch { return false; }
  });
  const pageTags = pageMapEntry?.tags ? String(pageMapEntry.tags).split(',').map((s) => s.trim()).filter(Boolean) : [];
  const pageSlug = normalizedRoute.replace(/^\//, '').replace(/\.html$/, '').split('/').pop();
  const toolTestimonials = (!isHome && showRelatedLinks) ? getTestimonialsForTool(pageSlug, pageTags) : [];
  const testimonialsHtml = toolTestimonials.length ? renderTestimonialsSection(toolTestimonials, { variant: 'tool' }) : '';
  if (testimonialsHtml) {
    console.log(`[seo:testimonials] ${normalizedRoute} rendered ${toolTestimonials.length} tool-specific testimonial(s).`);
  }
  const toolSections = renderToolSections({
    showAds,
    showRelatedLinks,
    showRating,
    pageFaq: pageData.faq,
    bottomPageBannerAd: sharedFragments.bottomPageBannerAd,
    relatedToolsScriptPath,
    relatedToolsHtml: relatedToolsState.listHtml,
    relatedToolsTagsHtml: relatedToolsState.tagsHtml,
    relatedGuidesHtml: relatedToolsState.guidesListHtml,
    showRelatedGuides,
    relatedNewsHtml: relatedToolsState.newsListHtml,
    testimonialsHtml,
    clusterHubLink,
  });
  const relatedStyles = !hasUpload ? `<style>#content.w3-content { margin-top: 50px; }</style>` : '';
  // Per-page "Last updated" stamp (Schema.org dateModified microdata).
  // Driven by the most recent git commit that touched this page's CMS
  // fragments or its JSP wrapper (see scripts/page-mtimes.mjs); a stamp
  // therefore only changes when the page's own content changes. The
  // visible string is a user freshness signal; the canonical machine
  // signal lives in JSON-LD dateModified above.
  const lastUpdatedHuman = lastUpdatedIso ? formatHumanDate(lastUpdatedIso) : '';
  // Bottom-of-page fallback stamp. Suppressed in three cases:
  //   1. welcomeHasInlineStamp - pages with a rewritten under-H1 stamp
  //      (the prominent placement); a bottom tag would duplicate.
  //   2. isHome - the home page has its own trust/freshness surface
  //      ("Last refreshed April 2026" inside WHY TRUST THESE TOOLS) and
  //      the bare bottom stamp lands in dead space between cards.
  //      JSON-LD dateModified still emits on home (machine signal); only
  //      the visible <time> is hidden.
  const showBottomLastUpdated = lastUpdatedIso && lastUpdatedHuman && !welcomeHasInlineStamp && !isHome;
  const lastUpdatedHtml = showBottomLastUpdated
    ? `<p class="page-mtime" style="font-size:12px;color:#5f6368;margin:8px 0 0;text-align:right;"><time itemprop="dateModified" datetime="${escapeHtml(lastUpdatedIso)}">Last updated: ${escapeHtml(lastUpdatedHuman)}</time></p>`
    : '';
  const showDisableAdsScript = showAdSlots ? `<script>isLoadAds = true;</script>` : '';
  const toolContent = (showAds || showRelatedLinks) ? toolSections : '';
  const showEditorialSurface = isHome || isHubPage || isGuide;
  const editorialByline = showEditorialSurface ? (sharedFragments.editorialByline || '') : '';
  const editorialTrust = showEditorialSurface ? (sharedFragments.editorialTrust || '') : '';
  if (showEditorialSurface && (editorialByline || editorialTrust)) {
    console.log(`[seo:editorial] Injected byline/trust on ${normalizedRoute}.`);
  }
  const stagingBanner = isStaging ? buildStagingBannerHtml() : '';
  // P10.1.2 - Staging GA4 isolation. Staging must not emit the prod GA4/GTM
  // property; `noindex` does not suppress GA event transmission. Default ON for
  // production builds (isStaging=false). Flip GA4_DISABLED=1 for any build to
  // suppress all GTM + GA injection (used by staging CI to prevent prod GA4
  // property pollution from `/freetoolonline-web-test/*` pageviews).
  const ga4Disabled = isStaging || process.env.GA4_DISABLED === '1';
  const gtmHead = ga4Disabled ? '' : (sharedFragments.firstLoadJsThirdParty || '');
  const gtmNoscript = ga4Disabled ? '' : (sharedFragments.topBodyContent || '');
  const gaExtendedScript = ga4Disabled ? '' : (sharedFragments.extendedJsThirdParty || '');
  if (ga4Disabled) {
    console.log(`[seo:ga4] disabled route=${normalizedRoute} reason=${isStaging ? 'staging' : 'env-flag'}.`);
  }
  const bodyMarkup = rewriteInternalContent(`
<body class="new-style-body">
${gtmNoscript}
${renderBaseScript({ siteOrigin, apiOrigin, pageUrl, pageName, appVersion, ioVersion, getAlterUploaderDelayMs, bgsCollection, ioInfos, unsplashKey, randomString, basePath: normalizedBasePath })}
${showDisableAdsScript}
${renderHeader({ siteOrigin, pageUrl, pageName, browserTitle, pageTitle, hasSettings, showAds, pageSvgLogo: sharedFragments.pageSvgLogo, })}
${stagingBanner}
<div class='w3-content' id='content'>
<div class='w3-row'>
${sharedFragments.rightBannerAd || ''}
<main class="w3-rest w3-container page-main-content" role="main">
${sharedFragments.topPageBannerAd || ''}
<style>@media(max-width: 999px) {.ad-section.top-ad>ins:after { content: '${escapeCssString(titleText)}'; }}</style>
<div class='w3-row page-section'>
<div class='w3-container w3-padding-0'>
${body}
${lastUpdatedHtml}
${relatedStyles}
</div>
</div>
${editorialByline}
${editorialTrust}
${sharedFragments.inContentBannerAd || ''}
${toolContent}
</main>
<div id="cookieConsent"></div>
</div>
</div>
${sharedFragments.footer || ''}
<div id='nav_menu' class='w3-sidebar w3-bar-block new-style-nav_menu w3-hide-small' style="display: none">
${lMenu ?? sharedFragments.lMenu ?? ''}
</div>
<script>${gaExtendedScript}</script>
<style type="text/css">
${sharedFragments.extendedBodyContent ? '' : ''}
</style>
${sharedFragments.extendedBodyContent || ''}
</body>`);
  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}" class="main-html ads-init ads-disabled page-${escapeHtml(pageName)}root${hasUpload ? ' has-upload' : ''}">
<head>
${gtmHead}
${head}
</head>
${bodyMarkup}
</html>`;
}

export function renderRedirectPage({ siteOrigin, canonicalOrigin, sourceRoute, targetRoute }) {
  const targetUrl = canonicalForRoute(siteOrigin, targetRoute);
  const canonicalUrl = canonicalForRoute(canonicalOrigin, targetRoute);
  // noindex,follow consolidates canonical authority from alias URLs onto the target
  // page (plan §3.8). `follow` lets crawlers pass link equity through to the target,
  // which is what we want for alias→canonical redirects.
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8"/>\n<meta name="robots" content="noindex, follow"/>\n<meta http-equiv="refresh" content="0; url=${escapeHtml(targetUrl)}"/>\n<link rel="canonical" href="${escapeHtml(canonicalUrl)}"/>\n<title>Redirecting...</title>\n<script>\n(function(){\n  var target = ${JSON.stringify(targetUrl)};\n  var suffix = (window.location.search || '') + (window.location.hash || '');\n  window.location.replace(target + suffix);\n})();\n</script>\n</head>\n<body>\n<p>Redirecting from ${escapeHtml(sourceRoute)} to <a href="${escapeHtml(targetUrl)}">${escapeHtml(targetUrl)}</a>.</p>\n</body>\n</html>`;
}

export function renderAlternateAdPage({ canonicalOrigin }) {
  const canonicalUrl = canonicalForRoute(canonicalOrigin, '/alternatead.html');
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8"/>\n<meta name="robots" content="noindex, nofollow"/>\n<link rel="canonical" href="${escapeHtml(canonicalUrl)}"/>\n<title>Alternate Ad</title>\n<script>\n(function(){\n  var params = new URLSearchParams(window.location.search);\n  var url = params.get('url') || '';\n  var img = params.get('img') || '';\n  document.addEventListener('DOMContentLoaded', function(){\n    document.body.innerHTML = '<a href="' + url.replaceAll('"', '&quot;') + '" target="_top"><img src="https://dkbg1jftzfsd2.cloudfront.net/image/ad/' + img.replaceAll('"', '&quot;') + '.jpg"/></a>';\n  });\n})();\n</script>\n</head>\n<body></body>\n</html>`;
}

