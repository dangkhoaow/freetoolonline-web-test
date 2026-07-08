// home-counts.mjs - single source of truth for the reader-facing site counts.
//
// Problem class (operator report 2026-07-06): the homepage shipped HARDCODED
// counts that drifted from the route registry - the <title> said "122 Browser
// Tools", the TRUSTED badge said 122 tools / 60+ guides, the bento category
// CTAs said "9 dev tools" (registry: 21) and "5 utilities" (registry: 28),
// while the hero tagline (already dynamic via buildDynamicHomeSearchData)
// said 108 tools + 1572 guides. Machine-vs-human surface disagreement is a
// truthfulness-classifier and AI-answer-engine tripwire.
//
// Fix: every count is derived at BUILD time (GitHub Pages serves the static
// export, so build-time IS dynamic for this site) from the same registry the
// build already iterates: JSP_BY_ROUTE + GUIDE_ROUTES + ALIAS_ROUTES +
// SEO_CLUSTER_GROUPS. The CMS fragments KEEP their static numbers as
// fallbacks - each splice is a targeted regex with warn-on-miss (the same
// contract as the existing hero/datalist splice in export-site.mjs).
//
// Consumers:
//   - export-site.mjs      -> spliceHomeBodyHtml / spliceHomeWelcome /
//                             spliceCountsInText (BODYDESC + titles)
//   - page-renderer.mjs    -> home <title>/og:title use the spliced
//                             browserTitle instead of a hardcoded literal
//   - sitemap-writer.mjs   -> llms.txt homepage entry title/description
//   - sitemap-html-builder -> getCanonicalToolRoutes/getDynamicGuideRoutes
//                             (moved here so the datalist and the counts can
//                             never disagree)

import { JSP_BY_ROUTE, GUIDE_ROUTES, ALIAS_ROUTES, INFO_ROUTES, GUIDE_SITEMAP_EXCLUDE } from './site-data.mjs';
import { getSeoClusterGroups, isHubRoute } from './seo-clusters.mjs';

/**
 * Canonical searchable tool routes: every JSP_BY_ROUTE entry EXCLUDING alias
 * sources, hubs, /guides/*, the homepage, and info pages. This is the exact
 * filter the homepage datalist has always used (moved from
 * sitemap-html-builder.mjs so both surfaces share one implementation).
 */
export function getCanonicalToolRoutes() {
  const aliasSourceSet = new Set(Object.keys(ALIAS_ROUTES));
  return Object.keys(JSP_BY_ROUTE).filter((r) => {
    if (aliasSourceSet.has(r)) return false;
    if (r === '/') return false;
    if (isHubRoute(r)) return false;
    if (r.startsWith('/guides/')) return false;
    // news-loop (2026-07-08): news articles are editorial, not tools - exclude
    // them from the tool count/registry same as guides, or "122 tools" would
    // silently include a news article (truthfulness classifier tripwire).
    if (r.startsWith('/news/')) return false;
    if (INFO_ROUTES.has(r) && !r.startsWith('/guides/')) return false;
    return true;
  });
}

/**
 * All published guide routes (every locale), minus aliases and sitemap
 * exclusions. Same implementation previously private to sitemap-html-builder.
 */
export function getDynamicGuideRoutes() {
  return Object.keys(JSP_BY_ROUTE)
    .filter((route) => route.startsWith('/guides/'))
    .filter((route) => !(route in ALIAS_ROUTES))
    .filter((route) => !GUIDE_SITEMAP_EXCLUDE.has(route));
}

/**
 * All published news article routes, minus alias sources. Mirrors
 * getDynamicGuideRoutes() - same shape, same reason (single source of truth
 * for the homepage count + the news bento tile + llms/sitemap consumers).
 */
export function getDynamicNewsRoutes() {
  return Object.keys(JSP_BY_ROUTE)
    .filter((route) => route.startsWith('/news/'))
    .filter((route) => !(route in ALIAS_ROUTES));
}

/**
 * The full count bundle. perCluster applies the same canonical-tool filter to
 * each SEO_CLUSTER_GROUPS member list so bento CTAs agree with the hubs.
 */
export function getHomeCounts() {
  const toolRoutes = getCanonicalToolRoutes();
  const toolRouteSet = new Set(toolRoutes);
  const guideRoutes = getDynamicGuideRoutes();
  const newsRoutes = getDynamicNewsRoutes();
  // SEO_CLUSTER_GROUPS still lists some members by their LEGACY flat route
  // ('/zip-file.html') while the canonical moved to a subfolder during the
  // root->subfolder URL migration ('/zip-tools/zip-file.html', flat form now
  // an ALIAS_ROUTES source). Resolve each member through the alias table
  // before counting, or migrated clusters would count 0.
  const resolveCanonical = (route) => {
    const alias = ALIAS_ROUTES[route];
    if (typeof alias === 'string') return alias;
    if (alias && typeof alias.target === 'string') return alias.target;
    return route;
  };
  const perCluster = {};
  let categoryCount = 0;
  for (const group of getSeoClusterGroups()) {
    // news, like guides, is an editorial cluster, not a TOOL category - skip
    // it here (categoryCount feeds "Our N tools fall into M categories") and
    // count it directly from newsRoutes below so it does not need to pass the
    // toolRouteSet filter (news articles were just excluded from that set).
    if (group.cluster === 'guides' || group.cluster === 'news') continue;
    const canonicalMembers = new Set(
      group.routes.map(resolveCanonical).filter((r) => toolRouteSet.has(r))
    );
    perCluster[group.cluster] = canonicalMembers.size;
    if (canonicalMembers.size > 0) categoryCount += 1;
  }
  perCluster.news = newsRoutes.length;
  return {
    toolCount: toolRoutes.length,
    guideCount: guideRoutes.length,
    newsCount: newsRoutes.length,
    totalCount: toolRoutes.length + guideRoutes.length,
    categoryCount,
    perCluster,
  };
}

function applySplices(html, splices) {
  let next = html;
  const misses = [];
  let hits = 0;
  for (const { name, re, to } of splices) {
    if (re.test(next)) {
      next = next.replace(re, to);
      hits += 1;
    } else {
      misses.push(name);
    }
  }
  return { html: next, hits, misses };
}

/**
 * Homepage BODYHTML splices beyond the hero/datalist trio export-site already
 * handles: TRUSTED counters, the 10 bento category CTAs (+ count-bearing
 * aria-labels), the why-bullets, and the guides CTA. `ratings` is optional
 * ({ ratingValue, ratingCount }) - when absent the static badge stays.
 */
export function spliceHomeBodyHtml(html, counts, ratings = null) {
  const c = counts.perCluster || {};
  const splices = [
    { name: 'trusted_tools', re: /<b>\d+<\/b><span>tools<\/span>/, to: `<b>${counts.toolCount}</b><span>tools</span>` },
    { name: 'trusted_guides', re: /<b>\d+\+?<\/b><span>guides<\/span>/, to: `<b>${counts.guideCount}</b><span>guides</span>` },
    { name: 'why_tools_free', re: /\d+ tools, all free/, to: `${counts.toolCount} tools, all free` },
    { name: 'why_guides', re: /✓ \d+\+? guides\./, to: `✓ ${counts.guideCount} guides.` },
    { name: 'guides_cta', re: /Browse all \d+\+? guides/, to: `Browse all ${counts.guideCount} guides` },
    { name: 'zip_cta', re: /Browse \d+ ZIP tools/, to: `Browse ${c.zip} ZIP tools` },
    { name: 'zip_aria', re: /aria-label="ZIP tools - \d+ tools"/, to: `aria-label="ZIP tools - ${c.zip} tools"` },
    { name: 'converters_cta', re: /\d+ converters/, to: `${c['image-conversion']} converters` },
    { name: 'image_cta', re: /\d+ image tools/, to: `${c['image-editing']} image tools` },
    { name: 'pdf_cta', re: /\d+ PDF tools/, to: `${c.pdf} PDF tools` },
    { name: 'pdf_aria', re: /aria-label="PDF tools - \d+ tools"/, to: `aria-label="PDF tools - ${c.pdf} tools"` },
    { name: 'dev_cta', re: /\d+ dev tools/, to: `${c.developer} dev tools` },
    { name: 'devicetest_cta', re: /\d+ device tests/, to: `${c['device-test']} device tests` },
    { name: 'video_cta', re: /\d+ video tools/, to: `${c.video} video tools` },
    { name: 'utility_cta', re: /\d+ utilities/, to: `${c.utility} utilities` },
    { name: 'games_cta', re: /Play \d+ browser games/, to: `Play ${c.games} browser games` },
    { name: 'space3d_cta', re: /Explore \d+ scenes/, to: `Explore ${c['space-3d']} scenes` },
    { name: 'news_cta', re: /Read \d+ updates?/, to: `Read ${c.news} ${c.news === 1 ? 'update' : 'updates'}` },
    { name: 'news_aria', re: /aria-label="News - \d+ updates?"/, to: `aria-label="News - ${c.news} ${c.news === 1 ? 'update' : 'updates'}"` },
  ];
  if (ratings && Number.isFinite(ratings.ratingValue) && Number.isFinite(ratings.ratingCount)) {
    splices.push({
      name: 'trusted_ratings',
      re: /<b>★ [\d.]+<\/b><span>\d+\+ ratings<\/span>/,
      to: `<b>★ ${ratings.ratingValue}</b><span>${ratings.ratingCount}+ ratings</span>`,
    });
  }
  return applySplices(html, splices);
}

/** Homepage BODYWELCOME splices (tool count x2 + category count). */
export function spliceHomeWelcome(html, counts) {
  return applySplices(html, [
    { name: 'welcome_collects', re: /collects \d+ of them/, to: `collects ${counts.toolCount} of them` },
    {
      name: 'welcome_categories',
      re: /Our \d+ tools fall into \w+ categories/,
      to: `Our ${counts.toolCount} tools fall into ${counts.categoryCount} categories`,
    },
  ]);
}

/**
 * Plain-text count fixes for the home title / meta description / llms.txt
 * entry ("N Browser Tools", "N free online tools").
 */
export function spliceCountsInText(text, counts) {
  return String(text ?? '')
    .replace(/\d+ Browser Tools/g, `${counts.toolCount} Browser Tools`)
    .replace(/\d+ free online tools/g, `${counts.toolCount} free online tools`);
}
