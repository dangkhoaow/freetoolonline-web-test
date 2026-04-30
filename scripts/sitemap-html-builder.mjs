import path from 'node:path';
import {
  ALIAS_ROUTES,
  GUIDE_ROUTES,
  INFO_ROUTES,
  JSP_BY_ROUTE,
  loadTextIfExists,
  routeToSlug,
} from './site-data.mjs';
import { getSeoClusterGroups } from './seo-clusters.mjs';

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

export async function buildDynamicSitemapBody({ cmsRoot, lastReviewedIso } = {}) {
  if (!cmsRoot) {
    throw new Error('buildDynamicSitemapBody: cmsRoot is required');
  }

  const aliasSourceSet = new Set(Object.keys(ALIAS_ROUTES));
  const clusterGroups = getSeoClusterGroups();
  const toolClusterMap = new Map(clusterGroups.map((g) => [g.cluster, g]));

  // Tool clusters - load each cluster's hub and member routes.
  const toolSections = [];
  let toolCount = 0;
  for (const cluster of TOOL_CLUSTER_ORDER) {
    const group = toolClusterMap.get(cluster);
    if (!group) continue;
    const hubMeta = group.hubRoute ? await loadRouteMetadata(cmsRoot, group.hubRoute) : null;
    const itemMetas = [];
    for (const memberRoute of group.routes) {
      if (aliasSourceSet.has(memberRoute)) continue; // never list a 301 alias
      if (!Object.prototype.hasOwnProperty.call(JSP_BY_ROUTE, memberRoute)) continue;
      itemMetas.push(await loadRouteMetadata(cmsRoot, memberRoute));
    }
    if (itemMetas.length === 0) continue;
    toolCount += itemMetas.length;
    toolSections.push(renderToolClusterSection(cluster, hubMeta, itemMetas));
  }

  // Guides - take every route in GUIDE_ROUTES, classify by topic, render in
  // the canonical topic order. Anything unclassified falls into the
  // "Editorial and other" bucket so nothing is silently dropped.
  const guideRoutes = Array.from(GUIDE_ROUTES).filter((route) => Object.prototype.hasOwnProperty.call(JSP_BY_ROUTE, route));
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

  const html = `<div class="w3-container w3-margin-top">
    <h1 class="text-uppercase"><b>Site Map</b></h1>
    <p><em>Last rebuilt ${escapeHtml(reviewDate)}. This page regenerates on every deploy from the live route registry, so the lists below match what is actually shipping today.</em></p>

    <p>Use this page when you know what you need but cannot remember the exact tool name. Tools are grouped by category; long-form guides are grouped by topic. Every link below is a canonical URL - no redirect aliases. For the machine-readable index Google and other crawlers consume, see <a href="/sitemap.xml">sitemap.xml</a>.</p>

    <h2 class="text-uppercase"><b>Jump to</b></h2>
    <ul>
        <li><a href="#tools">Tools by category</a> (${toolCount})</li>
        <li><a href="#guides">Guides by topic</a> (${totalGuides})</li>
        <li><a href="#resources">Site resources</a></li>
    </ul>

    <h2 id="tools" class="text-uppercase"><b>Tools by category</b></h2>
    <p>The ${toolCount} tools on the site are grouped into eight categories. Each category links to a hub page that explains the trade-offs between the tools in it; every tool below the hub is the canonical URL for that tool.</p>

${toolSections.join('\n\n')}

    <h2 id="guides" class="text-uppercase"><b>Guides by topic</b></h2>
    <p>${totalGuides} long-form guides covering decision trade-offs, step-by-step workflows, and editorial case studies. Browse the full topical hub at <a href="/guides.html">All Guides</a>; the lists below are an exhaustive index for fast lookup.</p>

${guideSections.join('\n\n')}

    <h2 id="resources" class="text-uppercase"><b>Site resources</b></h2>
    <p>Editorial, contact, and policy pages.</p>
    <ul>
${resourceItems.map(renderResourceItem).join('\n')}
        <li><a href="/sitemap.xml">sitemap.xml (machine-readable)</a></li>
    </ul>
</div>
`;

  return html;
}
