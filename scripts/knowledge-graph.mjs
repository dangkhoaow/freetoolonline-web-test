// knowledge-graph.mjs - build-time data for the homepage knowledge explorer
// (desktop-only Obsidian-style view: directory tree left, 3D force graph
// right; operator request 2026-07-08).
//
// Two artifacts, both derived from the same route registry every other
// build surface already uses (JSP_BY_ROUTE + SEO_CLUSTER_GROUPS +
// home-counts helpers), so the map can never disagree with the datalist,
// the sitemap, or the l-menu:
//
//   1. graph  -> dist/data/knowledge-graph.json, fetched lazily by
//      script/knowledge-graph.js on desktop viewports only. Nodes use
//      short keys ({id,n,g,t,v}) and links are [srcIdx, tgtIdx] pairs to
//      keep the payload small (~1.7k nodes).
//   2. treeHtml -> spliced between the KNOWLEDGE_TREE markers in the
//      homepage BODYHTML (same warn-on-miss contract as the datalist
//      splice). Tool/news/page leaves are server-rendered real <a> links
//      (crawlable); the ~1.6k guide leaves are client-rendered from the
//      graph JSON when the reader opens a locale folder - the homepage
//      does not need 1,600 extra anchors when /guides.html + sitemap.xml
//      already own guide discovery.
//
// Reader copy notes: labels come from BODYTITLE fragments (already
// gate-clean); folder names are plain topic words - never editor-internal
// vocabulary (see CLAUDE.md locked rules).

import path from 'node:path';
import {
  ALIAS_ROUTES,
  loadTextIfExists,
  routeToSlug,
} from './site-data.mjs';
import { getSeoClusterGroups } from './seo-clusters.mjs';
import {
  getCanonicalToolRoutes,
  getDynamicGuideRoutes,
  getDynamicNewsRoutes,
} from './home-counts.mjs';

const TREE_FOLDER_LABELS = {
  zip: 'ZIP tools',
  'image-conversion': 'Image converters',
  'image-editing': 'Image editing',
  pdf: 'PDF tools',
  developer: 'Developer tools',
  'device-test': 'Device tests',
  video: 'Video tools',
  utility: 'Utilities',
  games: 'Games',
  'space-3d': 'Space 3D',
  news: 'News',
  guides: 'Guides',
};

const LOCALE_LABELS = {
  en: 'English',
  pt: 'Portuguese',
  es: 'Spanish',
  vi: 'Vietnamese',
  id: 'Indonesian',
  de: 'German',
};

const INFO_TREE_PAGES = [
  '/about-us.html',
  '/editorial-team.html',
  '/contact-us.html',
  '/privacy-policy.html',
  '/sitemap.html',
];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function humanizeRoute(route) {
  const tail = String(route).split('/').pop().replace(/\.html$/, '');
  return tail
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

function resolveCanonical(route) {
  const alias = ALIAS_ROUTES[route];
  if (typeof alias === 'string') return alias;
  if (alias && typeof alias.target === 'string') return alias.target;
  return route;
}

/** Parse a guide route into { locale, tail }. Bare legacy guides count as EN. */
function parseGuideRoute(route) {
  const m = route.match(/^\/guides\/([a-z]{2})\/(.+)\.html$/);
  if (m && LOCALE_LABELS[m[1]]) return { locale: m[1], tail: m[2] };
  const bare = route.match(/^\/guides\/(.+)\.html$/);
  return bare ? { locale: 'en', tail: bare[1] } : null;
}

export async function buildKnowledgeGraph({ cmsRoot, relatedToolsData } = {}) {
  if (!cmsRoot) throw new Error('buildKnowledgeGraph: cmsRoot is required');

  const readTitle = async (route) => {
    const slug = routeToSlug(route);
    const raw = slug ? await loadTextIfExists(path.join(cmsRoot, `BODYTITLE${slug}.txt`)) : '';
    const title = String(raw || '').replace(/\s+/g, ' ').trim();
    return title || humanizeRoute(route);
  };

  const toolRouteSet = new Set(getCanonicalToolRoutes());
  const clusterGroups = getSeoClusterGroups();
  const clusterKeys = new Set(clusterGroups.map((g) => g.cluster));

  // urlMaps tags let editorial pages (guides, news) point at the topic hubs
  // they support - same tag vocabulary related-tools.js uses for the
  // Related-links sections.
  const tagsByPath = new Map();
  for (const entry of relatedToolsData?.urlMaps ?? []) {
    if (!entry?.url || !entry?.tags) continue;
    let pathname = '';
    try {
      pathname = new URL(String(entry.url)).pathname;
    } catch {
      pathname = String(entry.url);
    }
    tagsByPath.set(pathname, String(entry.tags).split(',').map((t) => t.trim()).filter(Boolean));
  }

  const nodes = [];
  const nodeIndexById = new Map();
  const links = [];
  const addNode = (node) => {
    if (nodeIndexById.has(node.id)) return nodeIndexById.get(node.id);
    const idx = nodes.length;
    nodes.push(node);
    nodeIndexById.set(node.id, idx);
    return idx;
  };
  const addLink = (fromId, toId) => {
    const a = nodeIndexById.get(fromId);
    const b = nodeIndexById.get(toId);
    if (a === undefined || b === undefined || a === b) return;
    links.push([a, b]);
  };

  addNode({ id: '/', n: 'Free Tool Online', g: 'home', t: 'home', v: 18 });

  // --- Tool clusters: hub node + member nodes, tree folder per cluster ---
  const treeFolders = [];
  for (const group of clusterGroups) {
    if (group.cluster === 'guides' || group.cluster === 'news') continue;
    const hubRoute = group.hubRoute;
    const members = [...new Set(group.routes.map(resolveCanonical))].filter((r) => toolRouteSet.has(r)).sort();
    const label = TREE_FOLDER_LABELS[group.cluster] ?? humanizeRoute(hubRoute);
    addNode({
      id: hubRoute,
      n: label,
      g: group.cluster,
      t: 'hub',
      v: Math.min(14, 6 + members.length * 0.2),
    });
    addLink('/', hubRoute);

    const items = [];
    for (const route of members) {
      const title = await readTitle(route);
      addNode({ id: route, n: title, g: group.cluster, t: 'tool', v: 2.5 });
      addLink(hubRoute, route);
      items.push(`<li><a href="${route}" data-ke="${route}">${escapeHtml(title)}</a></li>`);
    }
    treeFolders.push(
      `<details class="ke-folder" data-ke-group="${group.cluster}">` +
      `<summary>${escapeHtml(label)} <span class="ke-count">${members.length}</span></summary>` +
      `<ul class="ke-list">` +
      `<li class="ke-hub-link"><a href="${hubRoute}" data-ke="${hubRoute}">${escapeHtml(label)} overview</a></li>` +
      items.join('') +
      `</ul></details>`
    );
  }

  // --- Guides: hub node + one node per published guide (all locales).
  // Bare legacy /guides/<slug>.html and /guides/en/<slug>.html serve the
  // same fragment (routing shim) - keep ONE node per content unit,
  // preferring the /guides/en/ form. Non-EN locales link to their EN
  // sibling (not the hub), so each guide family clusters together. ---
  const guidesHub = '/guides.html';
  addNode({ id: guidesHub, n: 'Guides', g: 'guides', t: 'hub', v: 14 });
  addLink('/', guidesHub);

  const guideRoutes = getDynamicGuideRoutes();
  const parsed = guideRoutes.map((route) => ({ route, meta: parseGuideRoute(route) })).filter((x) => x.meta);
  const enByTail = new Map();
  for (const { route, meta } of parsed) {
    if (meta.locale !== 'en') continue;
    const existing = enByTail.get(meta.tail);
    // Prefer the /guides/en/ form over the bare legacy twin.
    if (!existing || route.startsWith('/guides/en/')) enByTail.set(meta.tail, route);
  }
  const localeCounts = {};
  const guideNodesAdded = new Set();
  const hubLinkTargetsForTags = (route) => {
    const tags = tagsByPath.get(route) ?? [];
    const hubs = [];
    for (const tag of tags) {
      if (clusterKeys.has(tag) && tag !== 'guides' && tag !== 'news') {
        const grp = clusterGroups.find((g) => g.cluster === tag);
        if (grp) hubs.push(grp.hubRoute);
      }
      if (hubs.length >= 3) break;
    }
    return hubs;
  };

  // EN guides first so every non-EN guide can attach to its EN sibling in
  // one pass (family clusters: hub -> EN guide -> locale satellites).
  const orderedGuides = [...parsed].sort((a, b) => {
    const ea = a.meta.locale === 'en' ? 0 : 1;
    const eb = b.meta.locale === 'en' ? 0 : 1;
    return ea !== eb ? ea - eb : a.route.localeCompare(b.route);
  });
  for (const { route, meta } of orderedGuides) {
    const isEn = meta.locale === 'en';
    const canonicalEnRoute = enByTail.get(meta.tail);
    if (isEn && canonicalEnRoute !== route) continue; // bare twin of an /en/ route
    if (guideNodesAdded.has(route)) continue;
    guideNodesAdded.add(route);
    localeCounts[meta.locale] = (localeCounts[meta.locale] ?? 0) + 1;
    const title = await readTitle(route);
    addNode({
      id: route,
      n: title.length > 90 ? `${title.slice(0, 87)}...` : title,
      g: `guide-${meta.locale}`,
      t: 'guide',
      v: isEn ? 1.3 : 0.7,
    });
    if (isEn) {
      addLink(guidesHub, route);
      for (const hub of hubLinkTargetsForTags(route)) addLink(route, hub);
    } else if (canonicalEnRoute && guideNodesAdded.has(canonicalEnRoute)) {
      addLink(canonicalEnRoute, route);
    } else {
      addLink(guidesHub, route);
    }
  }

  const guideTotal = guideNodesAdded.size;
  const localeOrder = ['en', 'pt', 'es', 'vi', 'id', 'de'].filter((l) => localeCounts[l]);
  treeFolders.push(
    `<details class="ke-folder" data-ke-group="guides" data-ke-lazy-guides="${localeOrder.map((l) => `${l}:${localeCounts[l]}`).join(',')}">` +
    `<summary>${escapeHtml(TREE_FOLDER_LABELS.guides)} <span class="ke-count">${guideTotal}</span></summary>` +
    `<ul class="ke-list">` +
    `<li class="ke-hub-link"><a href="${guidesHub}" data-ke="${guidesHub}">All guides overview</a></li>` +
    `</ul>` +
    `<div class="ke-lazy-slot"></div>` +
    `</details>`
  );

  // --- News: hub + dated articles; tag links point at topic hubs ---
  const newsHub = '/news.html';
  const newsRoutes = getDynamicNewsRoutes().sort();
  addNode({ id: newsHub, n: TREE_FOLDER_LABELS.news, g: 'news', t: 'hub', v: 7 });
  addLink('/', newsHub);
  const newsItems = [];
  for (const route of newsRoutes) {
    const title = await readTitle(route);
    addNode({ id: route, n: title, g: 'news', t: 'news', v: 2 });
    addLink(newsHub, route);
    for (const hub of hubLinkTargetsForTags(route)) addLink(route, hub);
    newsItems.push(`<li><a href="${route}" data-ke="${route}">${escapeHtml(title)}</a></li>`);
  }
  treeFolders.push(
    `<details class="ke-folder" data-ke-group="news">` +
    `<summary>${escapeHtml(TREE_FOLDER_LABELS.news)} <span class="ke-count">${newsRoutes.length}</span></summary>` +
    `<ul class="ke-list">` +
    `<li class="ke-hub-link"><a href="${newsHub}" data-ke="${newsHub}">${escapeHtml(TREE_FOLDER_LABELS.news)} overview</a></li>` +
    newsItems.join('') +
    `</ul></details>`
  );

  // --- Site pages (about, contact, ...) ---
  const pageItems = [];
  for (const route of INFO_TREE_PAGES) {
    const title = await readTitle(route);
    addNode({ id: route, n: title, g: 'page', t: 'page', v: 1.6 });
    addLink('/', route);
    pageItems.push(`<li><a href="${route}" data-ke="${route}">${escapeHtml(title)}</a></li>`);
  }
  treeFolders.push(
    `<details class="ke-folder" data-ke-group="page">` +
    `<summary>Site pages <span class="ke-count">${INFO_TREE_PAGES.length}</span></summary>` +
    `<ul class="ke-list">${pageItems.join('')}</ul></details>`
  );

  const treeHtml =
    `<p class="ke-tree-root"><a href="/" data-ke="/">Free Tool Online</a></p>\n` +
    treeFolders.join('\n');

  return {
    graph: { v: 1, nodes, links },
    treeHtml,
    stats: {
      nodeCount: nodes.length,
      linkCount: links.length,
      guideCount: guideTotal,
      localeCounts,
    },
  };
}
