import path from 'node:path';
import {
  ALIAS_ROUTES,
  GUIDE_ROUTES,
  GUIDE_SITEMAP_EXCLUDE,
  INFO_ROUTES,
  JSP_BY_ROUTE,
  loadTextIfExists,
  routeToSlug,
} from './site-data.mjs';

// Single source of truth for "which routes are guides shipped in dynamic
// discovery surfaces (sitemap-guides.xml, /sitemap.html, /guides.html hub,
// l-menu sidebar, homepage search datalist)". Derived dynamically from
// JSP_BY_ROUTE by URL prefix; excludes alias sources and opt-out routes.
// Replaces the historical `Array.from(GUIDE_ROUTES).filter(... has JSP)`
// pattern that was a STATIC intersection - any /guides/* JSP shipped
// without a GUIDE_ROUTES register entry was silently dropped from all
// four surfaces. See cycle 50 follow-up #2 (orphan-guide defect class).
function getDynamicGuideRoutes() {
  return Object.keys(JSP_BY_ROUTE)
    .filter((route) => route.startsWith('/guides/'))
    .filter((route) => !(route in ALIAS_ROUTES))
    .filter((route) => !GUIDE_SITEMAP_EXCLUDE.has(route));
}
import { getSeoClusterGroups, isHubRoute } from './seo-clusters.mjs';

// Dynamic /sitemap.html body builder.
//
// The page is regenerated on every build from the same route registry the
// renderer iterates over (`JSP_BY_ROUTE` + `GUIDE_ROUTES` + `INFO_ROUTES` +
// `SEO_CLUSTER_GROUPS`). When a new tool or guide route is added, this body
// updates automatically on the next GitHub Pages deploy - no hand edit
// needed and no truth drift between BODYDESC ("a full index ...") and the
// rendered list.
//
// Reader-value layer added on top of the structural correctness:
//   - one-line description per tool / guide drawn from the page's own
//     `BODYDESC<slug>.txt` so the sitemap reads as a directory, not a link
//     dump.
//   - guides grouped by topic (mirrors /guides.html groupings).
//   - in-page TOC (jump links) so the page is navigable on mobile-390.
//
// Title labels are read from each route's `BODYTITLE<slug>.txt` so the
// sitemap stays in lockstep with the per-page H1 voice.

const TOOL_CLUSTER_ORDER = [
  'zip',
  'image-editing',
  'image-conversion',
  'pdf',
  'developer',
  'video',
  'device-test',
  'utility',
  'games',
  'space-3d',
];

const TOOL_CLUSTER_LABELS = {
  zip: 'ZIP and archive tools',
  'image-editing': 'Image editing tools',
  'image-conversion': 'Image conversion tools',
  pdf: 'PDF tools',
  developer: 'Developer tools',
  video: 'Video tools',
  'device-test': 'Device test tools',
  utility: 'Utility tools',
  games: 'Browser games',
  'space-3d': 'Space 3D',
};

const TOOL_CLUSTER_BLURBS = {
  zip: 'Browser-based compression and password workflows for ZIP archives.',
  'image-editing': 'Compress, resize, crop, and edit images directly in the browser.',
  'image-conversion': 'Convert between image formats (HEIC, JPG, PNG, SVG, Base64) in the browser.',
  pdf: 'Compose, split, merge, protect, and convert PDFs fully in the browser.',
  developer: 'Minifiers, beautifiers, diff, and generators used in day-to-day web development.',
  video: 'Browser-based video conversion and remixing via WebAssembly-powered FFmpeg.',
  'device-test': 'Quick browser-only checks for microphone, camera, display, and keyboard.',
  utility: 'Timestamps, QR codes, and small utilities that do not fit the other categories.',
  games: 'Free browser games that run entirely on this page - no install, no account.',
  'space-3d': 'Interactive 3D space visualizations that render in the browser - explore and learn.',
};

// Guide topic groups - mirrors the topical groupings on /guides.html so the
// sitemap reads consistently with the dedicated hub. Order matters; topics
// are emitted in this sequence. The classifier below is regex-based and
// runs against the slug under /guides/. Anything that fails to match falls
// into the trailing "Editorial and other" bucket so nothing is silently
// dropped.
const GUIDE_TOPIC_ORDER = [
  'zip-and-file-compression',
  'heic-and-image-conversion',
  'image-editing-and-graphics',
  'pdf',
  'video',
  'device-tests',
  'developer-and-encoding',
  'games',
  'space',
  'editorial-and-other',
];

const GUIDE_TOPIC_LABELS = {
  'zip-and-file-compression': 'ZIP and file compression',
  'heic-and-image-conversion': 'HEIC and image conversion',
  'image-editing-and-graphics': 'Image editing and graphics',
  pdf: 'PDF',
  video: 'Video',
  'device-tests': 'Device tests',
  'developer-and-encoding': 'Developer and encoding',
  games: 'Browser games',
  space: 'Space 3D',
  'editorial-and-other': 'Editorial and other',
};

function classifyGuide(slug) {
  if (/(^|-)(zip|7z|rar|archive|file-compressor|compress-a-file|compress-a-folder|compress-zip|reduce-zip|make-a-zip|recover-corrupt-zip|zip-folder)/.test(slug)) {
    return 'zip-and-file-compression';
  }
  if (/(^|-)(heic|jpg-vs|jpg-vs-jpeg|jpeg|iphone-photo|convert-iphone|convert-heic|png-vs-svg|svg-to-png|when-to-compress-vs-convert)/.test(slug)) {
    return 'heic-and-image-conversion';
  }
  if (/(^|-)(crop|gif|photo-editor|qr-code|extract-frames|split-a-gif)/.test(slug)) {
    return 'image-editing-and-graphics';
  }
  if (/(^|-)pdf/.test(slug)) {
    return 'pdf';
  }
  if (/(^|-)(mp4|webm|mov|mkv|ffmpeg)/.test(slug)) {
    return 'video';
  }
  if (/(^|-)(dead-pixel|lcd|microphone|webcam|camera-quality|keyboard-tester|device-test|interview)/.test(slug)) {
    return 'device-tests';
  }
  if (/(^|-)(md5|sha256|css-minifier|uglifier|tree-shaking|json|yaml|toml|csv|cloud-run|text-diff|word-diff|line-diff|git-diff|base64|unix-timestamps)/.test(slug)) {
    return 'developer-and-encoding';
  }
  // fire-23: guides for the two new categories. Slug tokens match the 7
  // shipped units (snake-classic, retro-tank-battle, garden-defense,
  // voxel-world-builder / solar-system, black-hole, galaxy) + generic
  // genre words so future game/space guides classify without edits here.
  if (/(^|-)(snake|tank|garden-defense|voxel|browser-game|how-to-play)/.test(slug)) {
    return 'games';
  }
  if (/(^|-)(solar-system|black-hole|galaxy|planet|space-3d)/.test(slug)) {
    return 'space';
  }
  return 'editorial-and-other';
}

// Resources block - canonical ordering for the trailing "Resources" list.
// Anything in INFO_ROUTES that is not a guide and not /sitemap.html itself
// is eligible. Order is defined here (rather than alphabetically) so the
// page leads with the most-used informational routes.
const RESOURCE_ROUTE_ORDER = [
  '/',
  '/guides.html',
  '/about-us.html',
  '/editorial-team.html',
  '/contact-us.html',
  '/privacy-policy.html',
  '/tags.html',
];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function firstSentence(text, maxChars = 160) {
  const trimmed = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (!trimmed) return '';
  // Prefer a real sentence break over arbitrary truncation - readers parse
  // a complete short sentence faster than a clipped fragment.
  const sentenceMatch = trimmed.match(/^(.+?[.!?])(\s|$)/);
  const candidate = sentenceMatch ? sentenceMatch[1] : trimmed;
  if (candidate.length <= maxChars) return candidate;
  return `${candidate.slice(0, maxChars - 1).trimEnd()}...`;
}

async function readCmsText(cmsRoot, fragment, slug) {
  const filename = `${fragment}${slug}.txt`;
  return (await loadTextIfExists(path.join(cmsRoot, filename))).trim();
}

function fallbackLabelFromRoute(route) {
  const last = route.replace(/\.html$/i, '').split('/').filter(Boolean).pop() ?? route;
  return last
    .split('-')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ''))
    .join(' ')
    .trim();
}

async function loadRouteMetadata(cmsRoot, route) {
  const slug = routeToSlug(route);
  const [titleRaw, descRaw] = await Promise.all([
    readCmsText(cmsRoot, 'BODYTITLE', slug),
    readCmsText(cmsRoot, 'BODYDESC', slug),
  ]);
  const title = titleRaw || fallbackLabelFromRoute(route);
  const description = firstSentence(descRaw);
  return { route, slug, title, description };
}

function renderToolItem({ route, title, description }) {
  const desc = description
    ? ` <span class="w3-text-grey">- ${escapeHtml(description)}</span>`
    : '';
  return `        <li><a href="${route}">${escapeHtml(title)}</a>${desc}</li>`;
}

function renderToolClusterSection(cluster, hubMeta, items) {
  const lines = [];
  lines.push(`    <h3 id="tools-${cluster}"><b>${escapeHtml(TOOL_CLUSTER_LABELS[cluster] ?? cluster)}</b></h3>`);
  const blurb = TOOL_CLUSTER_BLURBS[cluster] ?? '';
  const hubLink = hubMeta
    ? `Hub: <a href="${hubMeta.route}">${escapeHtml(hubMeta.title)}</a>.`
    : '';
  lines.push(`    <p>${escapeHtml(blurb)}${blurb && hubLink ? ' ' : ''}${hubLink}</p>`);
  lines.push('    <ul>');
  for (const item of items) {
    lines.push(renderToolItem(item));
  }
  lines.push('    </ul>');
  return lines.join('\n');
}

function renderGuideItem({ route, title, description }) {
  const desc = description
    ? ` <span class="w3-text-grey">- ${escapeHtml(description)}</span>`
    : '';
  return `        <li><a href="${route}">${escapeHtml(title)}</a>${desc}</li>`;
}

function renderGuideTopicSection(topic, items) {
  const lines = [];
  lines.push(`    <h3 id="guides-${topic}"><b>${escapeHtml(GUIDE_TOPIC_LABELS[topic] ?? topic)} (${items.length})</b></h3>`);
  lines.push('    <ul>');
  for (const item of items) {
    lines.push(renderGuideItem(item));
  }
  lines.push('    </ul>');
  return lines.join('\n');
}

function renderResourceItem({ route, title }) {
  return `        <li><a href="${route}">${escapeHtml(title)}</a></li>`;
}

function formatReviewDate(iso) {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function renderGuideHubItem({ route, title, description }) {
  // Hub format mirrors the historical hand-maintained BODYHTMLguides.html
  // (anchor + paragraph description on separate lines) so readers get a
  // scan-and-skim hierarchy. sitemap.html keeps the terser inline format
  // via renderGuideItem above.
  const descBlock = description ? `\n            <p>${escapeHtml(description)}</p>` : '';
  return `        <li>\n            <a href="${route}">${escapeHtml(title)}</a>${descBlock}\n        </li>`;
}

function renderGuideHubTopicSection(topic, items) {
  const lines = [];
  lines.push(`    <h2 class="text-uppercase"><b>${escapeHtml(GUIDE_TOPIC_LABELS[topic] ?? topic)}</b></h2>`);
  lines.push('    <ul>');
  for (const item of items) {
    lines.push(renderGuideHubItem(item));
  }
  lines.push('    </ul>');
  return lines.join('\n');
}

export async function buildDynamicGuidesHubBody({ cmsRoot } = {}) {
  if (!cmsRoot) {
    throw new Error('buildDynamicGuidesHubBody: cmsRoot is required');
  }

  // GUIDE_ROUTES is the single source of truth for "what guide pages
  // exist on this site". Adding a guide to site-data.mjs + creating the
  // BODYTITLE/BODYDESC fragments is now sufficient - this builder picks
  // it up on the next deploy. No more hand-edit of BODYHTMLguides.html.
  //
  // The English hub lists English (canonical) guides ONLY. Locale variants
  // live at /guides/<lang>/<slug>.html and stay discoverable via each guide's
  // hreflang block, the per-(cluster,locale) left-menu, and the per-language
  // sitemaps. Listing every locale variant here produced a ~1100-entry
  // multilingual wall-of-text with heavy within-section duplication (the same
  // guide restated in 6 languages side by side), which failed the Phase-6
  // reader-eye walkthrough on axis A (cannot scan in 15s), axis C (within-page
  // duplication) and axis D (flat unstructured dump).
  const guideRoutes = getDynamicGuideRoutes().filter((route) => guideRouteLocale(route) === 'en');
  const guideMetaByTopic = new Map();
  for (const topic of GUIDE_TOPIC_ORDER) {
    guideMetaByTopic.set(topic, []);
  }
  for (const route of guideRoutes) {
    const slug = route.replace(/^\/guides\//, '').replace(/\.html$/i, '');
    const topic = classifyGuide(slug);
    const meta = await loadRouteMetadata(cmsRoot, route);
    guideMetaByTopic.get(topic).push(meta);
  }
  // Sort each topic alphabetically by title for predictable diffs.
  for (const list of guideMetaByTopic.values()) {
    list.sort((a, b) => a.title.localeCompare(b.title));
  }
  const totalGuides = guideRoutes.length;

  const sections = [];
  for (const topic of GUIDE_TOPIC_ORDER) {
    const items = guideMetaByTopic.get(topic);
    if (!items || items.length === 0) continue;
    sections.push(renderGuideHubTopicSection(topic, items));
  }

  const html = `<div class='w3-container'>
    <h1><b class="text-uppercase">All Guides - Browser Tool Library</b></h1>
    <p>Hands-on, no-fluff guides for the people landing on freetoolonline.com tools. Every guide pairs the problem to the right tool, walks the steps, and explains the trade-offs, so you finish in a couple of minutes instead of two browser tabs. Many linked tools run right in your browser; the file-conversion tools upload over HTTPS and clear the working copy after a short window.</p>

    <p>${totalGuides} English guides grouped by the kind of task you came to do. Where a guide also has an Indonesian or Portuguese edition, the language link sits on the guide page itself. If you are not sure which group your question lives in, the search box on the home page covers every guide and tool by keyword.</p>

    <figure class="illustration">
      <img src="/img/illustrations/decision-tree-2branch/guides__12f3a7f9.svg"
           alt="Decision tree showing how readers pick a guide by the input they already have"
           loading="lazy"
           width="480"
           height="280">
      <figcaption>Pick the walkthrough by what you already hold: a file or folder, or a device to test.</figcaption>
    </figure>

${sections.join('\n\n')}
</div>
`;

  return html;
}

// -------------------------------------------------------------------------- //
// Dynamic homepage search box datalist + counter texts.                      //
// Pre-build: BODYHTML.html had a hand-curated <datalist> of 42 options + a   //
// hard-coded "122 tools" string in the tagline + placeholder. Stale as soon  //
// as a new tool / guide ships. Operator request: "able to get dynamic pages  //
// guides/tools when gh page build (like the same way)".                      //
// -------------------------------------------------------------------------- //

/**
 * Build the dynamic homepage search data - datalist innerHTML + counts -
 * from the live route registry (JSP_BY_ROUTE for tools + GUIDE_ROUTES for
 * guides). Returns an object that export-site.mjs splices into the BODYHTML.
 *
 * Display value for each option = BODYTITLE<slug>.txt (the human-readable
 * title kept in sync with each page's H1). Guides get a "(guide)" suffix so
 * the dropdown lets readers triage tools vs guides at a glance.
 *
 * data-href = canonical route, consumed by the inline option-select handler
 * in BODYHTML.html (exact value match -> navigate straight to the page).
 * Queries that match no option fall through to the form's GET /tags.html,
 * where related-tools.js runs the exact-title redirect + tag/title search.
 */
export async function buildDynamicHomeSearchData({ cmsRoot } = {}) {
  if (!cmsRoot) {
    throw new Error('buildDynamicHomeSearchData: cmsRoot is required');
  }

  const aliasSourceSet = new Set(Object.keys(ALIAS_ROUTES));

  // Tools: every canonical cluster member in JSP_BY_ROUTE, EXCLUDING:
  //   - alias source URLs (legacy non-clustered URLs that 301 to canonical)
  //   - hub pages (end with -tools.html, no children)
  //   - /guides/* (they live in GUIDE_ROUTES instead)
  //   - / (home, no point in searching the home page from the home page)
  //   - INFO_ROUTES other-than guides (about/contact/etc - not action tools)
  const toolRoutes = Object.keys(JSP_BY_ROUTE).filter((r) => {
    if (aliasSourceSet.has(r)) return false;
    if (r === '/') return false;
    // fire-23: shared isHubRoute() so the non-'-tools' hubs (/games.html,
    // /space-3d.html, /guides.html) are excluded from the tool datalist like
    // every other hub (hubs are browse pages, not searchable actions).
    if (isHubRoute(r)) return false;
    if (r.startsWith('/guides/')) return false;
    if (INFO_ROUTES.has(r) && !r.startsWith('/guides/')) return false;
    return true;
  });

  const guideRoutes = getDynamicGuideRoutes();

  // Bucket by cluster prefix for stable listing order (PDF tools next to each
  // other, image tools next to each other, etc.). Native datalist filters
  // as the user types regardless of order, but grouped order also makes the
  // raw HTML easier to diff per cycle.
  const clusterPrefixOrder = [
    '/zip-tools/', '/image-tools/', '/image-converter-tools/',
    '/pdf-tools/', '/developer-tools/', '/video-tools/',
    '/device-test-tools/', '/utility-tools/', '/games/', '/space-3d/',
  ];
  const clusterIndexOf = (route) => {
    for (let i = 0; i < clusterPrefixOrder.length; i++) {
      if (route.startsWith(clusterPrefixOrder[i])) return i;
    }
    return clusterPrefixOrder.length; // un-clustered tools sort last
  };
  toolRoutes.sort((a, b) => {
    const ca = clusterIndexOf(a);
    const cb = clusterIndexOf(b);
    if (ca !== cb) return ca - cb;
    return a.localeCompare(b);
  });
  guideRoutes.sort((a, b) => a.localeCompare(b));

  const optionLines = [];
  for (const route of toolRoutes) {
    const meta = await loadRouteMetadata(cmsRoot, route);
    optionLines.push(`        <option value="${escapeHtml(meta.title)}" data-href="${route}">`);
  }
  for (const route of guideRoutes) {
    const meta = await loadRouteMetadata(cmsRoot, route);
    const guideLabel = `${meta.title} (guide)`;
    optionLines.push(`        <option value="${escapeHtml(guideLabel)}" data-href="${route}">`);
  }

  return {
    toolCount: toolRoutes.length,
    guideCount: guideRoutes.length,
    totalCount: toolRoutes.length + guideRoutes.length,
    datalistInnerHTML: optionLines.join('\n'),
  };
}

// -------------------------------------------------------------------------- //
// Dynamic l-menu (left navigation sidebar) - same defect class fix.          //
// Pre-build: l-menu.html was hand-maintained and intermixed tool + guide     //
// entries with no visual distinction. Operator-approved structure (Option B):
//   - 8 categories aligned with SEO_CLUSTER_GROUPS (single source of truth   //
//     with sitemap.html + guides.html).                                      //
//   - Within each category, TOOLS first (fa-circle), then a thin separator,  //
//     then GUIDES (fa-book + small [GUIDE] badge for unambiguous signal).    //
//   - Membership: tools from cluster.routes; guides classified by            //
//     classifyGuide() then mapped to the matching cluster.                   //
// -------------------------------------------------------------------------- //

const LMENU_CLUSTER_ORDER = [
  'pdf',
  'image-editing',
  'image-conversion',
  'video',
  'zip',
  'developer',
  'device-test',
  'utility',
  'games',
  'space-3d',
];

const LMENU_CLUSTER_LABELS = {
  pdf: 'PDF',
  'image-editing': 'IMAGE EDITING',
  'image-conversion': 'IMAGE CONVERTER',
  video: 'VIDEO',
  zip: 'ZIP TOOLS',
  developer: 'DEVELOPER',
  'device-test': 'DEVICE TESTS',
  utility: 'UTILITY',
  games: 'GAMES',
  'space-3d': 'SPACE 3D',
};

const LMENU_CLUSTER_ICONS = {
  pdf: 'fa-file-pdf',
  'image-editing': 'fa-file-image',
  'image-conversion': 'fa-images',
  video: 'fa-file-video',
  zip: 'fa-file-archive',
  developer: 'fa-code',
  'device-test': 'fa-laptop',
  utility: 'fa-tools',
  games: 'fa-gamepad',
  'space-3d': 'fa-globe',
};

/**
 * Shared cluster-member resolver used by buildDynamicSitemapBody and
 * buildDynamicLMenuBody. Walks JSP_BY_ROUTE for routes under the cluster's
 * hub directory pattern (e.g. `/pdf-tools/`). This is the source of truth
 * because cluster.routes[] still carries legacy URLs that 301 to canonical
 * cluster URLs via ALIAS_ROUTES.
 */
async function resolveClusterMemberRoutes(group, aliasSourceSet) {
  if (!group?.hubRoute) return [];
  const hubDir = group.hubRoute.replace(/\.html$/i, '/');
  const allRoutes = Object.keys(JSP_BY_ROUTE).filter((r) => !aliasSourceSet.has(r));
  const memberRoutes = allRoutes.filter((r) => r.startsWith(hubDir));
  const curatedCanonicals = [];
  const seen = new Set();
  for (const legacyRoute of (group.routes || [])) {
    const canonical = aliasSourceSet.has(legacyRoute) ? ALIAS_ROUTES[legacyRoute] : legacyRoute;
    if (!Object.prototype.hasOwnProperty.call(JSP_BY_ROUTE, canonical)) continue;
    if (!canonical.startsWith(hubDir)) continue;
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    curatedCanonicals.push(canonical);
  }
  const tail = memberRoutes.filter((r) => !seen.has(r));
  return [...curatedCanonicals, ...tail];
}

// -------------------------------------------------------------------------- //
// Dynamic tool-hub directory lists - same defect class as /guides.html, one //
// level deeper. Each cluster hub page (/utility-tools.html, /pdf-tools.html, //
// ...) hand-maintained its own tool-directory <ul> as static CMS content.   //
// A new tool shipped via build-tool-page.mjs updates seo-clusters.mjs +     //
// l-menu.html + sitemap.html + related-tools.js automatically, but NOTHING  //
// ever touched the hub page's own directory list - so every hub silently   //
// drifted stale. Operator-caught 2026-07-03: /utility-tools.html was       //
// missing 23 of its 28 tools (every fire-19/20/21 tool); every other       //
// cluster hub had the same gap for its own backlog (developer-tools.html   //
// missing code-formatter-beautifier/word-counter/sort-text-lines/          //
// remove-duplicate-lines/reverse-text; video-tools.html missing            //
// video-trimmer; etc).                                                     //
//                                                                           //
// Fix: regenerate ONLY the tool-directory <ul> on every export, from the   //
// SAME resolveClusterMemberRoutes() resolver sitemap.html + l-menu already //
// trust (canonicalizes ALIAS_ROUTES, self-heals against any route shipped  //
// under the hub's URL prefix but missing from seo-clusters.mjs). The       //
// regenerated <ul> is spliced between HUB_TOOL_LIST:START/END marker       //
// comments in the hub's BODYHTML fragment - everything else on the page    //
// (intro prose, "common workflows", comparison tables, FAQ-adjacent        //
// sections, illustrations, byline) is HAND-CURATED and stays untouched.    //
// This mirrors why the fix is a targeted splice, not a full-body replace   //
// like /guides.html: unlike the guides hub, every tool hub already carries //
// deep Phase-6-approved prose that a full-body regenerate would destroy.   //
// A hub missing the markers is left with its static list + a console.warn //
// (fail-open - never breaks the build).                                   //
// -------------------------------------------------------------------------- //

const HUB_TOOL_LIST_START = '<!-- HUB_TOOL_LIST:START';
const HUB_TOOL_LIST_END = '<!-- HUB_TOOL_LIST:END -->';

function renderHubToolItem({ route, title, description }) {
  // Mirrors the existing hand-authored hub markup shape (anchor + one-line
  // description paragraph per <li>) so the regenerated block is visually
  // indistinguishable from the content it replaces.
  const descBlock = description ? `\n            <p>${escapeHtml(description)}</p>` : '';
  return `        <li>\n            <a href="${route}">${escapeHtml(title)}</a>${descBlock}\n        </li>`;
}

/**
 * Build the dynamic tool-directory <ul> for every cluster hub page, keyed by
 * hubRoute. Excludes the 'guides' cluster (its own dedicated builder above).
 * Route order follows resolveClusterMemberRoutes() (curated seo-clusters.mjs
 * order first, then any self-healed tail) - the same order l-menu.html and
 * sitemap.html already render, so all three surfaces stay visually
 * consistent for the same cluster.
 * @returns {Promise<Map<string,string>>} hubRoute -> `<ul>...</ul>` HTML
 */
export async function buildDynamicToolHubBodies({ cmsRoot } = {}) {
  if (!cmsRoot) {
    throw new Error('buildDynamicToolHubBodies: cmsRoot is required');
  }
  const aliasSourceSet = new Set(Object.keys(ALIAS_ROUTES));
  const out = new Map();
  for (const group of getSeoClusterGroups()) {
    if (group.cluster === 'guides' || !group.hubRoute) continue;
    const memberRoutes = await resolveClusterMemberRoutes(group, aliasSourceSet);
    const items = [];
    for (const route of memberRoutes) {
      if (route === group.hubRoute) continue; // never list the hub linking to itself
      items.push(await loadRouteMetadata(cmsRoot, route));
    }
    const lines = ['    <ul>'];
    for (const item of items) lines.push(renderHubToolItem(item));
    lines.push('    </ul>');
    out.set(group.hubRoute, lines.join('\n'));
  }
  return out;
}

/**
 * Splice a freshly-built tool-directory <ul> between the HUB_TOOL_LIST
 * marker comments in a hub page's bodyHtml. Every other section (intro,
 * workflows, comparison tables, FAQ prose, byline) is untouched because the
 * splice only replaces the exact span between the markers.
 * Fail-open: markers missing/malformed -> return bodyHtml unchanged + warn
 * (never breaks the build; the static list just stays visible that render).
 */
export function spliceToolHubList(bodyHtml, ulHtml, { route } = {}) {
  const startIdx = bodyHtml.indexOf(HUB_TOOL_LIST_START);
  if (startIdx === -1) {
    console.warn(`[tool-hub] No HUB_TOOL_LIST:START marker in ${route ?? 'hub'} - leaving static tool list in place.`);
    return bodyHtml;
  }
  const startCommentEnd = bodyHtml.indexOf('-->', startIdx);
  const endIdx = startCommentEnd === -1 ? -1 : bodyHtml.indexOf(HUB_TOOL_LIST_END, startCommentEnd);
  if (startCommentEnd === -1 || endIdx === -1) {
    console.warn(`[tool-hub] Malformed HUB_TOOL_LIST markers in ${route ?? 'hub'} - leaving static tool list in place.`);
    return bodyHtml;
  }
  const before = bodyHtml.slice(0, startCommentEnd + '-->'.length);
  const after = bodyHtml.slice(endIdx);
  return `${before}\n${ulHtml}\n    ${after}`;
}

// classifyGuide() topic ids → cluster id. The "editorial-and-other" topic
// is the catch-all; route it into UTILITY so no guide gets dropped.
const GUIDE_TOPIC_TO_CLUSTER = {
  'zip-and-file-compression': 'zip',
  'heic-and-image-conversion': 'image-conversion',
  'image-editing-and-graphics': 'image-editing',
  pdf: 'pdf',
  video: 'video',
  'device-tests': 'device-test',
  'developer-and-encoding': 'developer',
  games: 'games',
  space: 'space-3d',
  'editorial-and-other': 'utility',
};

function renderLMenuToolItem({ route, title }) {
  // Tool item - keep the historical fa-circle icon for backward visual
  // compatibility with the hand-maintained l-menu items.
  return `                <a class='w3-bar-item w3-button' href='https://freetoolonline.com${route}'>\n                    <i class="fa fa-circle" data-kind="tool" style="margin-right: 10px;"></i>\n                    ${escapeHtml(title)}\n                </a>`;
}

function renderLMenuGuideItem({ route, title }) {
  // Guide item - distinct fa-book icon + small [GUIDE] badge for
  // unambiguous visual signal. data-kind="guide" lets the menu-search /
  // analytics layer also filter by kind without parsing the URL.
  return `                <a class='w3-bar-item w3-button' href='https://freetoolonline.com${route}'>\n                    <i class="fa fa-book" data-kind="guide" style="margin-right: 10px;"></i>\n                    ${escapeHtml(title)}\n                    <span class="lmenu-kind-badge">guide</span>\n                </a>`;
}

function renderLMenuClusterSection({ clusterId, icon, label, tools }) {
  // Tool-only cluster section. Guides are now grouped into a dedicated
  // "GUIDES" top-level menu item (see renderLMenuGuidesSection) per the
  // plan-warm-pascal-v3 S7 restructure — readers shopping for a tool see
  // just tools; readers shopping for editorial reading see just guides.
  const menuId = `${clusterId.replace(/-/g, '')}Menu`;
  const lines = [];
  lines.push(`        <div class='w3-col l2 m6'>`);
  lines.push(`            <button style='font-size: 15px !important;padding: 10px 0px 10px 13px' class="w3-button w3-block w3-left-align menu-btn" onclick="myAccFunc(document.getElementById('${menuId}'))">`);
  lines.push(`                <i class="fa ${icon}" style="margin-right: 10px;"></i>`);
  lines.push(`                ${escapeHtml(label)}`);
  lines.push(`            </button>`);
  lines.push(`            <div id="${menuId}" class="w3-hide menuGroup">`);
  for (const t of tools) {
    lines.push(renderLMenuToolItem(t));
  }
  lines.push(`            </div>`);
  lines.push(`        </div>`);
  return lines.join('\n');
}

// Topic-label map for the dedicated GUIDES menu sub-headings. Order matches
// LMENU_CLUSTER_ORDER so readers see a consistent grouping across the l-menu.
const LMENU_GUIDE_TOPIC_LABELS = {
  pdf: 'PDF guides',
  'image-editing': 'Image editing guides',
  'image-conversion': 'Image converter guides',
  video: 'Video guides',
  zip: 'ZIP guides',
  developer: 'Developer guides',
  'device-test': 'Device-test guides',
  utility: 'Other guides',
  games: 'Game guides',
  'space-3d': 'Space 3D guides',
};

function renderLMenuGuidesSection(guidesByCluster) {
  const lines = [];
  lines.push(`        <div class='w3-col l2 m6'>`);
  lines.push(`            <button style='font-size: 15px !important;padding: 10px 0px 10px 13px' class="w3-button w3-block w3-left-align menu-btn" onclick="myAccFunc(document.getElementById('guidesMenu'))">`);
  lines.push(`                <i class="fa fa-book" style="margin-right: 10px;"></i>`);
  lines.push(`                GUIDES`);
  lines.push(`            </button>`);
  lines.push(`            <div id="guidesMenu" class="w3-hide menuGroup" style="font-size: 15px !important;padding: 10px 0px 10px 13px">`);
  let emittedTopics = 0;
  for (const clusterId of LMENU_CLUSTER_ORDER) {
    const items = guidesByCluster.get(clusterId) || [];
    if (items.length === 0) continue;
    if (emittedTopics > 0) {
      lines.push(`                <hr class="lmenu-sep">`);
    }
    lines.push(`                <div class="lmenu-guide-topic"><small><strong>${escapeHtml(LMENU_GUIDE_TOPIC_LABELS[clusterId] || clusterId)}</strong></small></div>`);
    for (const g of items) {
      lines.push(renderLMenuGuideItem(g));
    }
    emittedTopics += 1;
  }
  lines.push(`            </div>`);
  lines.push(`        </div>`);
  return lines.join('\n');
}

// Variant key for routes that don't belong to a single tool cluster (home,
// info pages, anything unmatched). Gets a hub-directory menu, no cluster
// expanded.
const LMENU_DEFAULT_CLUSTER = 'default';

function guideRouteLocale(route) {
  const m = /^\/guides\/(en|pt|es|vi|id|de)\//.exec(route);
  return m ? m[1] : 'en';
}

function guideRouteBareSlug(route) {
  return route
    .replace(/^\/guides\/(en|pt|es|vi|id|de)\//, '')
    .replace(/^\/guides\//, '')
    .replace(/\.html$/i, '');
}

// "All <Cluster> tools" forward-nav label derived from the cluster group's
// "Back to <X>" hub label. ASCII only (no arrow glyph) per the R9 typography
// rule.
function lmenuHubLabel(group, clusterId) {
  return (group?.hubLabel || LMENU_CLUSTER_LABELS[clusterId] || clusterId).replace(/^Back to /, 'All ');
}

// Hub-only stub for the OTHER clusters in a focused body: the cluster header
// button + a single link to its hub page (which enumerates every tool in
// that cluster). This is the no-orphan guarantee - every hub stays one
// inline click away from every page, without inlining the full cross-cluster
// tool list. Same button/group markup + id scheme as renderLMenuClusterSection
// so myAccFunc() collapsibles and focusCurrentMenu() work unchanged.
function renderLMenuClusterStub({ clusterId, icon, label, hubRoute, hubLabel }) {
  const menuId = `${clusterId.replace(/-/g, '')}Menu`;
  return [
    `        <div class='w3-col l2 m6'>`,
    `            <button style='font-size: 15px !important;padding: 10px 0px 10px 13px' class="w3-button w3-block w3-left-align menu-btn" onclick="myAccFunc(document.getElementById('${menuId}'))">`,
    `                <i class="fa ${icon}" style="margin-right: 10px;"></i>`,
    `                ${escapeHtml(label)}`,
    `            </button>`,
    `            <div id="${menuId}" class="w3-hide menuGroup">`,
    `                <a class='w3-bar-item w3-button' href='https://freetoolonline.com${hubRoute}'>`,
    `                    <i class="fa fa-circle" style="margin-right: 10px;"></i>`,
    `                    ${escapeHtml(hubLabel)}`,
    `                </a>`,
    `            </div>`,
    `        </div>`,
  ].join('\n');
}

// Footer / info section - restores the Home + info + support links the
// legacy static l-menu.html carried (dropped when the body went dynamic in
// cycle 50) and surfaces /guides.html + /sitemap.html so every page links
// inline to the full guide hub + the complete sitemap (belt-and-suspenders
// for the no-orphan guarantee, and gives info pages a focusCurrentMenu
// self-match). fa-circle is used throughout - it is the one icon guaranteed
// in the curated fa subset.
function renderLMenuFooterSection() {
  const item = (href, label) =>
    `                <a class='w3-bar-item w3-button' href='https://freetoolonline.com${href}'>\n                    <i class="fa fa-circle" style="margin-right: 10px;"></i>\n                    ${escapeHtml(label)}\n                </a>`;
  return [
    `        <div class='w3-col l2 m6'>`,
    `            <hr/><div class="lmenu-guide-topic" style="padding: 10px 0px 10px 13px;text-transform: uppercase;"><small><strong>More</strong></small></div>`,
    item('/', 'Home'),
    item('/guides.html', 'All guides'), 
    item('/sitemap.html', 'Sitemap'),
    item('/tags.html', 'Tags collection'),
    item('/about-us.html', 'About us'),
    item('/contact-us.html', 'Contact us'),
    item('/privacy-policy.html', 'Privacy policy'),
    `        </div>`,
  ].join('\n');
}

function wrapLMenuBody(sections) {
  return `<div id="menu-content-id" class="menu-content">\n    <div class='w3-row-padding'>\n${sections.join('\n')}\n    </div>\n</div>`;
}

/**
 * Build the FOCUSED per-page l-menu bodies (replaces the previous
 * buildDynamicLMenuBody, which inlined the SAME ~1,150-link full-site
 * mega-menu on every page - ~460 KB/page, ~758 MB dist).
 *
 * Returns one compact menu body per (cluster, locale) plus a 'default'
 * variant for home/info pages, and a resolveRouteCluster(route) that maps any
 * rendered route to its variant key. Each focused body carries only the
 * current cluster's tools + that locale's guides, plus a hub link to all 8
 * clusters + /guides.html + /sitemap.html, so every page stays reachable
 * inline (no orphan) while page weight drops ~50%. Discovery is independently
 * covered by sitemap.xml / sitemap.html / llms.txt, so trimming the menu
 * loses no crawl coverage.
 *
 * The route -> variant map is the INVERSE of the SAME bucketing used to
 * populate the bodies, so the focus invariant holds by construction: a page
 * is assigned the variant whose menu contains that page's own anchor, so
 * focusCurrentMenu() always finds + highlights it. Variant key =
 * `${clusterId}:${locale}` for tool/guide/hub pages (tools + hubs use 'en'),
 * or 'default' for home/info/unmatched.
 *
 * The surrounding <style>/<script> shell of l-menu.html is preserved by
 * export-site.mjs which splices each body in; guides stay under the single
 * `#guidesMenu` id so the shell's locale-rewrite IIFE + focus logic are
 * unchanged.
 */
export async function buildPerPageLMenuBodies({ cmsRoot } = {}) {
  if (!cmsRoot) {
    throw new Error('buildPerPageLMenuBodies: cmsRoot is required');
  }

  const aliasSourceSet = new Set(Object.keys(ALIAS_ROUTES));
  const clusterGroups = getSeoClusterGroups();
  const toolClusterMap = new Map(clusterGroups.map((g) => [g.cluster, g]));

  // route -> variant key, emitted as the inverse of the bucketing below.
  const routeToVariant = new Map();

  // Tools per cluster (locale-agnostic; tools are EN-only). Also seeds the
  // hub-route -> cluster mapping so hub pages get their own cluster variant.
  const toolsByCluster = new Map();
  for (const clusterId of LMENU_CLUSTER_ORDER) toolsByCluster.set(clusterId, []);
  for (const clusterId of LMENU_CLUSTER_ORDER) {
    const group = toolClusterMap.get(clusterId);
    const orderedRoutes = await resolveClusterMemberRoutes(group, aliasSourceSet);
    for (const route of orderedRoutes) {
      const meta = await loadRouteMetadata(cmsRoot, route);
      toolsByCluster.get(clusterId).push(meta);
      routeToVariant.set(route, `${clusterId}:en`);
    }
    if (group?.hubRoute) routeToVariant.set(group.hubRoute, `${clusterId}:en`);
  }

  // Guides per (cluster, locale). classifyGuide runs on the bare slug so a
  // locale-prefixed route classifies the same as its EN canonical. Titles
  // sort alphabetically within each bucket for predictable diffs.
  const guidesByClusterLocale = new Map(); // `${clusterId}:${locale}` -> meta[]
  for (const route of getDynamicGuideRoutes()) {
    const locale = guideRouteLocale(route);
    const topic = classifyGuide(guideRouteBareSlug(route));
    const clusterId = GUIDE_TOPIC_TO_CLUSTER[topic] || 'utility';
    const key = `${clusterId}:${locale}`;
    if (!guidesByClusterLocale.has(key)) guidesByClusterLocale.set(key, []);
    const meta = await loadRouteMetadata(cmsRoot, route);
    guidesByClusterLocale.get(key).push(meta);
    routeToVariant.set(route, key);
  }
  for (const list of guidesByClusterLocale.values()) {
    list.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Which locales each cluster actually has guides in. Always include 'en'
  // so tool/hub pages (which use `${cluster}:en`) get a variant even when a
  // cluster has zero EN guides.
  const localesByCluster = new Map();
  for (const clusterId of LMENU_CLUSTER_ORDER) localesByCluster.set(clusterId, new Set(['en']));
  for (const key of guidesByClusterLocale.keys()) {
    const [clusterId, locale] = key.split(':');
    if (localesByCluster.has(clusterId)) localesByCluster.get(clusterId).add(locale);
  }

  const bodies = new Map();
  for (const clusterId of LMENU_CLUSTER_ORDER) {
    const group = toolClusterMap.get(clusterId);
    const hubRoute = group?.hubRoute;
    const hubLabel = lmenuHubLabel(group, clusterId);
    for (const locale of localesByCluster.get(clusterId)) {
      const sections = [];
      // 1. Current cluster's tools, with a hub self-link first (so the hub
      //    page self-matches focusCurrentMenu). Tools are EN-only.
      const toolItems = [];
      if (hubRoute) toolItems.push({ route: hubRoute, title: hubLabel });
      toolItems.push(...(toolsByCluster.get(clusterId) || []));
      sections.push(renderLMenuClusterSection({
        clusterId,
        icon: LMENU_CLUSTER_ICONS[clusterId],
        label: LMENU_CLUSTER_LABELS[clusterId],
        tools: toolItems,
      }));
      // 2. Current cluster + locale guides under the single #guidesMenu id
      //    (reuses renderLMenuGuidesSection so the locale-rewrite IIFE + focus
      //    logic keep working). Skipped when this cluster+locale has no guides
      //    (no guide pages use this variant, so no focus need - avoids an
      //    empty GUIDES dropdown).
      const myGuides = guidesByClusterLocale.get(`${clusterId}:${locale}`) || [];
      if (myGuides.length) {
        const guideMap = new Map();
        for (const c of LMENU_CLUSTER_ORDER) guideMap.set(c, c === clusterId ? myGuides : []);
        sections.push(renderLMenuGuidesSection(guideMap));
      }
      // 3. The other 7 clusters as hub-only stubs (no-orphan guarantee).
      for (const other of LMENU_CLUSTER_ORDER) {
        if (other === clusterId) continue;
        const og = toolClusterMap.get(other);
        sections.push(renderLMenuClusterStub({
          clusterId: other,
          icon: LMENU_CLUSTER_ICONS[other],
          label: LMENU_CLUSTER_LABELS[other],
          hubRoute: og?.hubRoute,
          hubLabel: lmenuHubLabel(og, other),
        }));
      }
      // 4. Footer / info links.
      sections.push(renderLMenuFooterSection());
      bodies.set(`${clusterId}:${locale}`, wrapLMenuBody(sections));
    }
  }

  // 'default' variant for home / info / unmatched routes: all 8 cluster hub
  // stubs + the footer (Home/guides/sitemap/info links self-match here).
  {
    const sections = [];
    for (const clusterId of LMENU_CLUSTER_ORDER) {
      const g = toolClusterMap.get(clusterId);
      sections.push(renderLMenuClusterStub({
        clusterId,
        icon: LMENU_CLUSTER_ICONS[clusterId],
        label: LMENU_CLUSTER_LABELS[clusterId],
        hubRoute: g?.hubRoute,
        hubLabel: lmenuHubLabel(g, clusterId),
      }));
    }
    sections.push(renderLMenuFooterSection());
    bodies.set(LMENU_DEFAULT_CLUSTER, wrapLMenuBody(sections));
  }

  // route -> variant resolver. exact -> `${cluster}:en` -> default.
  function resolveRouteCluster(route) {
    const r = route && route.startsWith('/') ? route : `/${route || ''}`;
    const exact = routeToVariant.get(r);
    if (exact && bodies.has(exact)) return exact;
    if (exact) {
      const enKey = `${exact.split(':')[0]}:en`;
      if (bodies.has(enKey)) return enKey;
    }
    return LMENU_DEFAULT_CLUSTER;
  }

  return { bodies, resolveRouteCluster };
}

export async function buildDynamicSitemapBody({ cmsRoot, lastReviewedIso } = {}) {
  if (!cmsRoot) {
    throw new Error('buildDynamicSitemapBody: cmsRoot is required');
  }

  const aliasSourceSet = new Set(Object.keys(ALIAS_ROUTES));
  const clusterGroups = getSeoClusterGroups();
  const toolClusterMap = new Map(clusterGroups.map((g) => [g.cluster, g]));

  // Tool clusters - reuse the shared resolveClusterMemberRoutes helper so
  // sitemap.html stays in lockstep with /guides.html + l-menu cluster
  // membership. Pre-fix: this builder walked cluster.routes[] directly which
  // still carries the legacy non-clustered URLs (e.g. /compose-pdf.html) all
  // sent to ALIAS_ROUTES post cluster-URL migration → 0 tools listed.
  const toolSections = [];
  let toolCount = 0;
  for (const cluster of TOOL_CLUSTER_ORDER) {
    const group = toolClusterMap.get(cluster);
    if (!group) continue;
    const hubMeta = group.hubRoute ? await loadRouteMetadata(cmsRoot, group.hubRoute) : null;
    const memberRoutes = await resolveClusterMemberRoutes(group, aliasSourceSet);
    const itemMetas = [];
    for (const memberRoute of memberRoutes) {
      itemMetas.push(await loadRouteMetadata(cmsRoot, memberRoute));
    }
    if (itemMetas.length === 0) continue;
    toolCount += itemMetas.length;
    toolSections.push(renderToolClusterSection(cluster, hubMeta, itemMetas));
  }

  // Guides - take every route in GUIDE_ROUTES, classify by topic, render in
  // the canonical topic order. Anything unclassified falls into the
  // "Editorial and other" bucket so nothing is silently dropped.
  const guideRoutes = getDynamicGuideRoutes();
  const guideMetaByTopic = new Map();
  for (const topic of GUIDE_TOPIC_ORDER) {
    guideMetaByTopic.set(topic, []);
  }
  for (const route of guideRoutes) {
    const slug = route.replace(/^\/guides\//, '').replace(/\.html$/i, '');
    const topic = classifyGuide(slug);
    const meta = await loadRouteMetadata(cmsRoot, route);
    guideMetaByTopic.get(topic).push(meta);
  }
  // Sort each topic alphabetically by title for predictable diffs.
  for (const list of guideMetaByTopic.values()) {
    list.sort((a, b) => a.title.localeCompare(b.title));
  }
  const totalGuides = guideRoutes.length;
  const guideSections = [];
  for (const topic of GUIDE_TOPIC_ORDER) {
    const items = guideMetaByTopic.get(topic);
    if (!items || items.length === 0) continue;
    guideSections.push(renderGuideTopicSection(topic, items));
  }

  // Resources - canonical ordering for the trailing list. Includes every
  // INFO_ROUTES entry that is not a guide and not /sitemap.html itself.
  const resourceCandidates = RESOURCE_ROUTE_ORDER.filter((route) => {
    if (route === '/sitemap.html') return false;
    if (route === '/') return INFO_ROUTES.has('/');
    return INFO_ROUTES.has(route);
  });
  const resourceItems = [];
  for (const route of resourceCandidates) {
    const meta = await loadRouteMetadata(cmsRoot, route);
    const label = route === '/' ? 'Home' : meta.title;
    resourceItems.push({ route, title: label });
  }

  const reviewDate = formatReviewDate(lastReviewedIso);

  // plan-warm-pascal-v3 S3.3: locale picker row above the Jump-to block.
  // Surfaces the five non-EN locale guide sitemaps so a reader who landed on
  // sitemap.html in their native language can switch the guide universe to
  // their locale in one click. Per-language guide counts come from the
  // sitemap-guides-<lang>.xml emit step in sitemap-writer.mjs.
  const localeGuidePickerHtml = `    <p><strong>Browse guides in your language:</strong>
        <a href="/guides.html">English</a>
        &middot; <a href="/sitemap-guides-pt.xml">Portuguese (XML)</a>
        &middot; <a href="/sitemap-guides-es.xml">Spanish (XML)</a>
        &middot; <a href="/sitemap-guides-vi.xml">Vietnamese (XML)</a>
        &middot; <a href="/sitemap-guides-id.xml">Indonesian (XML)</a>
        &middot; <a href="/sitemap-guides-de.xml">German (XML)</a>
    </p>`;

  const html = `<div class="w3-container w3-margin-top">
    <h1 class="text-uppercase"><b>Site Map</b></h1>
    <p>Looking for the right tool but cannot recall the name? Skim the list below. Every tool runs in your browser - no signup, no upload to a server - and every link points to the canonical page (no redirects to slow you down).</p>

    <p>Tools sit under eight task-based categories. Long-form guides - decision walkthroughs, step-by-step recipes, and trade-off explainers - sit below them, grouped by the kind of problem they solve. If a category looks empty for a tool you remember using, the link likely moved into the new category-tools hub; the URL still works.</p>

${localeGuidePickerHtml}

    <h2 class="text-uppercase"><b>Jump to</b></h2>
    <ul>
        <li><a href="#tools">Tools by category</a> (${toolCount})</li>
        <li><a href="#guides">Guides by topic</a> (${totalGuides})</li>
        <li><a href="#resources">Site resources</a></li>
    </ul>

    <h2 id="tools" class="text-uppercase"><b>Tools by category</b></h2>
    <p>${toolCount} tools across eight task categories. Tap a category heading to jump to its hub - the hub page explains when to pick each tool in that group and which inputs each one expects.</p>

${toolSections.join('\n\n')}

    <h2 id="guides" class="text-uppercase"><b>Guides by topic</b></h2>
    <p>${totalGuides} guides written to answer the question behind the search. Most are 3-7 minute reads that pick the right tool, show the steps, and call out the trade-offs (when ZIP saves space, when HEIC is fine to keep, when MD5 is the wrong hash). For a one-page browse, see <a href="/guides.html">All Guides</a>.</p>

${guideSections.join('\n\n')}

    <h2 id="resources" class="text-uppercase"><b>Site resources</b></h2>
    <p>About the team, contact, and policy pages. Last reviewed ${escapeHtml(reviewDate)}.</p>
    <ul>
${resourceItems.map(renderResourceItem).join('\n')}
        <li><a href="/sitemap.xml">sitemap.xml (for search engines)</a></li>
    </ul>
</div>
`;

  return html;
}
