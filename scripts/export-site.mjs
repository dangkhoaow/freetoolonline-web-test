import { access, copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import {
  ALIAS_ROUTES,
  DEFAULT_ALTER_UPLOADER_DELAY_MS,
  DEFAULT_API_ORIGIN,
  DEFAULT_APP_VERSION,
  DEFAULT_BGS_COLLECTION,
  DEFAULT_IO_INFOS,
  DEFAULT_IO_VERSION,
  DEFAULT_RANDOM_STRING,
  DEFAULT_SHORTEN_DOMAIN,
  DEFAULT_SITE_ORIGIN,
  DEFAULT_UNSPLASH_KEY,
  INFO_ROUTES,
  JSP_BY_ROUTE,
  SPECIAL_ROUTES,
  isInfoRoute,
  buildJspIndex,
  loadCmsPageData,
  loadSharedFragments,
  loadTextIfExists,
  normalizeRoute,
  resolveJspPathForRoute,
  routeToSlug,
  stripTrailingSlash,
} from './site-data.mjs';
import { parseJspPageSource, renderAlternateAdPage, renderPageDocument, renderRedirectPage } from './page-renderer.mjs';
import { resolvePageMtime, resolvePageCreated } from './page-mtimes.mjs';
import { createInternalContentRewriter, normalizeBasePath } from './staging-utils.mjs';
import { writeSplitSitemaps } from './sitemap-writer.mjs';
import { isHubRoute } from './seo-clusters.mjs';
import { buildDynamicSitemapBody, buildDynamicGuidesHubBody, buildDynamicToolHubBodies, spliceToolHubList, buildPerPageLMenuBodies, buildDynamicHomeSearchData } from './sitemap-html-builder.mjs';
import { getHomeCounts, spliceHomeBodyHtml, spliceHomeWelcome, spliceCountsInText } from './home-counts.mjs';
import { buildKnowledgeGraph } from './knowledge-graph.mjs';
import { getFeaturedTestimonials, renderTestimonialsSection } from './testimonials.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.resolve(repoRoot, process.env.DIST_DIR ?? 'dist');
const isStaging = /^(1|true|yes)$/i.test(process.env.STAGING ?? '');
const siteOrigin = stripTrailingSlash(process.env.SITE_URL ?? DEFAULT_SITE_ORIGIN);
const canonicalOrigin = stripTrailingSlash(process.env.CANONICAL_ORIGIN ?? DEFAULT_SITE_ORIGIN);
const basePath = normalizeBasePath(process.env.BASE_PATH ?? '');
const apiOrigin = ensureTrailingSlash(process.env.API_ORIGIN ?? DEFAULT_API_ORIGIN);
const shortenDomain = stripTrailingSlash(process.env.SHORTEN_DOMAIN ?? DEFAULT_SHORTEN_DOMAIN);

const sourceRepoRoot = await resolveSourceRepoRoot();
const sourceWebRoot = path.join(sourceRepoRoot, 'web', 'src', 'main', 'webapp');
const jspRoot = path.join(sourceWebRoot, 'WEB-INF', 'jsp');
const tagsRoot = path.join(sourceWebRoot, 'WEB-INF', 'tags');
const staticViewRoot = path.join(sourceRepoRoot, 'static', 'src', 'main', 'webapp', 'resources', 'view');
const staticAssetsRoot = path.join(sourceWebRoot, 'static');
const runtimeViewRoot = path.join(staticAssetsRoot, 'view');
const cmsRoot = path.join(staticViewRoot, 'CMS');
const robotsPath = path.join(staticAssetsRoot, 'robots.txt');
const adsPath = path.join(staticAssetsRoot, 'ads.txt');
const themeCssPath = path.join(tagsRoot, 'style-all-default.tag');
const runtimeConfig = await loadRuntimeConfig(staticAssetsRoot);
const deploySha = resolveDeploySha();

function resolveDeploySha() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 12);
  try {
    return execSync('git rev-parse HEAD', { cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim().slice(0, 12);
  } catch {
    return 'local-dev';
  }
}

async function main() {
  await mkdir(distDir, { recursive: true });
  await copyStaticAssets(staticAssetsRoot, distDir);

  const jspIndex = await buildJspIndex(jspRoot);
  const sharedFragments = await loadSharedFragments(staticViewRoot, runtimeViewRoot, themeCssPath);
  const relatedToolsData = await loadRelatedToolsData(staticAssetsRoot);
  // /sitemap.html body is regenerated on every build from the live route
  // registry (JSP_BY_ROUTE + GUIDE_ROUTES + INFO_ROUTES + cluster groups)
  // so adding a guide or tool flows through automatically on the next
  // GitHub Pages deploy. The static BODYHTMLsitemap.html fragment is a
  // placeholder; the real body is injected per-render below.
  const sitemapDynamicBody = await buildDynamicSitemapBody({
    cmsRoot,
    lastReviewedIso: new Date().toISOString(),
  });
  console.log(`[sitemap-html] Generated dynamic /sitemap.html body (${sitemapDynamicBody.length} chars).`);
  // /guides.html hub body regenerates on every build from GUIDE_ROUTES +
  // BODYTITLE/BODYDESC fragments. Adding a guide to site-data.mjs +
  // creating the per-slug fragments is sufficient - no more hand-edit of
  // BODYHTMLguides.html. The static fragment is now a placeholder; the
  // dynamic body computed once here wins in renderRoute below.
  const guidesHubDynamicBody = await buildDynamicGuidesHubBody({ cmsRoot });
  console.log(`[guides-hub] Generated dynamic /guides.html body (${guidesHubDynamicBody.length} chars).`);
  // Cluster tool-hub directory lists (/utility-tools.html, /pdf-tools.html,
  // ...) regenerate on every build from the same cluster-member resolver
  // sitemap.html + l-menu use, then splice between HUB_TOOL_LIST markers in
  // each hub's BODYHTML. Closes the "hub page forgot the new tool" defect
  // class (operator-caught 2026-07-03: /utility-tools.html missing 23 of 28
  // tools) the same way /guides.html + l-menu closed theirs. Hand-curated
  // hub prose outside the markers is untouched.
  const toolHubBodies = await buildDynamicToolHubBodies({ cmsRoot });
  console.log(`[tool-hub] Generated ${toolHubBodies.size} dynamic hub tool-directory lists.`);
  // l-menu (left navigation sidebar) - splice the dynamic body into the
  // static l-menu.html shell which keeps the inline <style> + <script>
  // blocks. The body is everything between </style> and the closing
  // <script>. Same defect-class fix as /guides.html - agents no longer
  // need to hand-edit the sidebar when shipping a new tool or guide.
  // Homepage search box - datalist + tagline/placeholder counts. Splice
  // into pageData.bodyHtml when renderRoute hits `/`. Closes the same
  // "agent forgot to update the homepage search options" defect class
  // /guides.html + l-menu just fixed.
  const homeSearchData = await buildDynamicHomeSearchData({ cmsRoot });
  console.log(`[home-search] Built dynamic datalist: ${homeSearchData.totalCount} options (${homeSearchData.toolCount} tools + ${homeSearchData.guideCount} guides).`);
  // Homepage knowledge explorer (desktop-only Obsidian-style view): the
  // directory tree splices between the KNOWLEDGE_TREE markers in BODYHTML
  // when renderRoute hits `/`, and the 3D graph data lands at
  // dist/data/knowledge-graph.json for the lazy client script. Both derive
  // from the same registry as the datalist above, so they can never drift.
  const knowledgeGraphData = await buildKnowledgeGraph({ cmsRoot, relatedToolsData });
  await mkdir(path.join(distDir, 'data'), { recursive: true });
  await writeFile(
    path.join(distDir, 'data', 'knowledge-graph.json'),
    JSON.stringify(knowledgeGraphData.graph)
  );
  console.log(`[knowledge-graph] ${knowledgeGraphData.stats.nodeCount} nodes / ${knowledgeGraphData.stats.linkCount} links -> dist/data/knowledge-graph.json; tree ${Math.round(knowledgeGraphData.treeHtml.length / 1024)} KB.`);
  // l-menu is now a FOCUSED per-page menu (per cluster+locale, + a 'default'
  // variant for home/info pages) instead of the same ~1,150-link full-site
  // mega-menu on every page. Build one body per variant, splice each into the
  // shared <style>/<script> shell, and select the right one per route in the
  // render loop below via resolveRouteCluster. Discovery is unaffected
  // (sitemap.xml / sitemap.html / llms.txt list every page); see
  // buildPerPageLMenuBodies for the no-orphan guarantee.
  const { bodies: lMenuBodies, resolveRouteCluster } = await buildPerPageLMenuBodies({ cmsRoot });
  const lMenuByVariant = new Map();
  if (sharedFragments.lMenu) {
    const styleEndIdx = sharedFragments.lMenu.indexOf('</style>');
    const scriptStartIdx = sharedFragments.lMenu.indexOf('<script>', styleEndIdx >= 0 ? styleEndIdx : 0);
    if (styleEndIdx >= 0 && scriptStartIdx > styleEndIdx) {
      const cssPrefix = sharedFragments.lMenu.slice(0, styleEndIdx + '</style>'.length);
      const scriptSuffix = sharedFragments.lMenu.slice(scriptStartIdx);
      for (const [variant, body] of lMenuBodies) {
        lMenuByVariant.set(variant, `${cssPrefix}\n${body}\n${scriptSuffix}`);
      }
      const sizes = [...lMenuByVariant.values()].map((s) => s.length);
      const avgKb = sizes.length ? Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length / 1024) : 0;
      console.log(`[lmenu] Built ${lMenuByVariant.size} focused per-page menu variants (avg ${avgKb} KB each).`);
      // Back-compat: any render path that does not pass an explicit lMenu opt
      // falls back to sharedFragments.lMenu - point it at the 'default' variant.
      sharedFragments.lMenu = lMenuByVariant.get('default') ?? sharedFragments.lMenu;
    } else {
      console.warn('[lmenu] Could not locate </style>/<script> boundaries in l-menu.html - leaving static body in place.');
    }
  }
  // Route candidates come exclusively from the in-code route registry so
  // the build has a single source of truth. The static `source/.../static/
  // sitemap.xml` is no longer parsed (and no longer copied to dist) - the
  // dynamic `dist/sitemap.xml` chain is owned end-to-end by sitemap-writer.mjs
  // and built from the rendered route set below.
  const routeCandidates = unique([
    ...Object.keys(JSP_BY_ROUTE),
    ...Object.keys(ALIAS_ROUTES),
    ...Array.from(SPECIAL_ROUTES),
    ...Array.from(INFO_ROUTES),
  ])
    .map(normalizeRoute)
    .filter((route) => route === '/' || route.endsWith('.html') || route.endsWith('/'));
  const rewriteInternalContent = createInternalContentRewriter({ siteOrigin, basePath, routeCandidates });

  const canonicalRoutes = [];
  for (const route of routeCandidates) {
    const lMenu = lMenuByVariant.get(resolveRouteCluster(route)) ?? sharedFragments.lMenu;
    const { html, canonical } = await renderRoute(route, {
      jspIndex,
      sharedFragments,
      relatedToolsData,
      canonicalOrigin,
      basePath,
      isStaging,
      rewriteInternalContent,
      sitemapDynamicBody,
      guidesHubDynamicBody,
      toolHubBodies,
      homeSearchData,
      knowledgeGraphData,
      lMenu,
    });
    await writeOutput(outputPathForRoute(route), html);
    if (canonical) {
      canonicalRoutes.push(route);
    }
    console.log(`Exported ${route} -> ${outputPathForRoute(route)}`);
  }

  const sourceRobotsTxt = (await loadTextIfExists(robotsPath)).trim();
  const sourceAdsTxt = (await loadTextIfExists(adsPath)).trim();

  await writeSplitSitemaps({
    distDir,
    routes: unique(canonicalRoutes),
    origin: canonicalOrigin,
    isStaging,
    cmsRoot,
  });

  await writeRootTextFile('robots.txt', buildRobotsTxt(sourceRobotsTxt, { isStaging, siteOrigin }));
  await writeRootTextFile('ads.txt', sourceAdsTxt ? `${sourceAdsTxt}\n` : '');
  await writeFile(path.join(distDir, '.nojekyll'), '');
  if (!isStaging) {
    await writeFile(path.join(distDir, 'CNAME'), `${new URL(siteOrigin).hostname}\n`);
  }

  if (isStaging) {
    await rewriteStaticAsset(path.join(distDir, 'script', 'related-tools.js'), rewriteInternalContent);
  }

  console.log(`Rendered ${routeCandidates.length} routes and published ${canonicalRoutes.length} pages to ${distDir}`);
}

async function copyStaticAssets(sourceDir, targetDir, depth = 0) {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }
    // sitemap.xml + sitemap-*.xml are owned end-to-end by sitemap-writer.mjs
    // (built per deploy from the live route registry). Skip any source-side
    // copy at the static-assets root so the dynamic writer's output is the
    // only thing that ever lands in dist - no risk of a stale checked-in
    // sitemap shadowing the build output before the writer runs.
    if (depth === 0 && entry.isFile() && /^sitemap(?:-[a-z0-9]+)?\.xml$/i.test(entry.name)) {
      continue;
    }

    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await mkdir(targetPath, { recursive: true });
      await copyStaticAssets(sourcePath, targetPath, depth + 1);
      continue;
    }

    if (entry.isFile()) {
      await mkdir(path.dirname(targetPath), { recursive: true });
      await copyFile(sourcePath, targetPath);
    }
  }
}

async function loadRelatedToolsData(staticAssetsRootPath) {
  const relatedToolsPath = path.join(staticAssetsRootPath, 'script', 'related-tools.js');
  const scriptSource = await loadTextIfExists(relatedToolsPath);
  if (!scriptSource) {
    console.log(`[related-tools:ssr] Missing related-tools.js at ${relatedToolsPath}.`);
    return null;
  }

  const match = scriptSource.match(/var urlMaps\s*=\s*(\[[\s\S]*?\])\s*,\s*currentTitle/);
  if (!match) {
    console.log('[related-tools:ssr] Failed to locate urlMaps array in related-tools.js.');
    return null;
  }

  try {
    const urlMaps = new Function(`return (${match[1]});`)();
    if (!Array.isArray(urlMaps)) {
      console.log('[related-tools:ssr] urlMaps payload is not an array.');
      return null;
    }
    // plan-kahan: attach a short one-line `desc` to every entry so the
    // Related-tools AND Related-guides sections render "Title - desc". An
    // explicit `desc` authored in related-tools.js wins (curated override);
    // otherwise it is auto-seeded from the page's own BODYDESC fragment (the
    // first sentence, capped). BODYDESC is gate-clean (R9 ASCII, truthful meta),
    // so the derived blurb inherits that compliance. Missing BODYDESC -> no
    // desc (link renders title-only). This makes descriptions site-wide without
    // hand-authoring every entry; the migration runbook can still replace any
    // auto-seeded blurb with a curated one in related-tools.js.
    let descSeeded = 0;
    for (const entry of urlMaps) {
      if (entry && typeof entry.desc === 'string' && entry.desc.trim()) continue;
      const derived = await deriveRelatedDescFromBodyDesc(entry?.url, cmsRoot);
      if (derived) {
        entry.desc = derived;
        descSeeded += 1;
      }
    }
    console.log(`[related-tools:ssr] Loaded ${urlMaps.length} urlMaps entries from related-tools.js (desc auto-seeded for ${descSeeded}).`);
    return { urlMaps, sourcePath: relatedToolsPath };
  } catch (error) {
    console.log(`[related-tools:ssr] Failed to parse urlMaps: ${error?.message || error}.`);
    return null;
  }
}

// plan-kahan: derive a tidy one-line blurb from a page's BODYDESC<slug>.txt.
// Returns the first sentence (with its terminal punctuation) or a word-bounded
// ~100-char cut; empty string when the fragment is absent/empty.
async function deriveRelatedDescFromBodyDesc(url, cmsFragmentsRoot) {
  if (!url) return '';
  let route = '';
  try {
    route = new URL(String(url)).pathname || '';
  } catch {
    route = String(url);
  }
  const slug = routeToSlug(route);
  if (!slug) return '';
  const raw = await loadTextIfExists(path.join(cmsFragmentsRoot, `BODYDESC${slug}.txt`));
  if (!raw) return '';
  const text = String(raw).replace(/\s+/g, ' ').trim();
  if (!text) return '';
  const sentence = text.match(/^(.*?[.!?])(\s|$)/);
  let blurb = sentence ? sentence[1] : text;
  if (blurb.length > 100) {
    blurb = blurb.slice(0, 100);
    const lastSpace = blurb.lastIndexOf(' ');
    if (lastSpace > 40) blurb = blurb.slice(0, lastSpace);
  }
  return blurb.trim();
}

async function renderRoute(route, { jspIndex, sharedFragments, relatedToolsData, canonicalOrigin, basePath, isStaging, rewriteInternalContent, sitemapDynamicBody, guidesHubDynamicBody, toolHubBodies, homeSearchData, knowledgeGraphData, lMenu }) {
  const normalizedRoute = normalizeRoute(route);

  if (Object.prototype.hasOwnProperty.call(ALIAS_ROUTES, normalizedRoute)) {
    return {
      html: renderRedirectPage({
        siteOrigin,
        canonicalOrigin,
        sourceRoute: normalizedRoute,
        targetRoute: ALIAS_ROUTES[normalizedRoute],
      }),
      canonical: false,
    };
  }

  if (SPECIAL_ROUTES.has(normalizedRoute)) {
    return {
      html: renderAlternateAdPage({ canonicalOrigin }),
      canonical: false,
    };
  }

  const jspPath = resolveJspPathForRoute(normalizedRoute, jspIndex);
  if (!jspPath) {
    throw new Error(`No JSP mapping found for ${normalizedRoute}`);
  }

  const jspSource = await loadTextIfExists(path.join(jspRoot, jspPath));
  if (!jspSource) {
    throw new Error(`Missing JSP source at ${jspPath}`);
  }

  const { attrs: pageAttrs, innerHtml: bodyHtml } = parseJspPageSource(jspSource);
  const pageData = await loadCmsPageData(cmsRoot, normalizedRoute);
  // /sitemap.html body is build-generated from the live route registry so
  // it never falls out of sync with the actual published tools / guides.
  // The static `BODYHTMLsitemap.html` fragment is a placeholder; the
  // dynamic body computed once in main() wins here.
  if (normalizedRoute === '/sitemap.html' && sitemapDynamicBody) {
    pageData.bodyHtml = sitemapDynamicBody;
  }
  // /guides.html hub body is build-generated from GUIDE_ROUTES so it never
  // falls out of sync with the actual published guides. The static
  // `BODYHTMLguides.html` fragment is a placeholder; the dynamic body
  // computed once in main() wins here.
  if (normalizedRoute === '/guides.html' && guidesHubDynamicBody) {
    pageData.bodyHtml = guidesHubDynamicBody;
  }
  // Cluster hub tool-directory <ul> is build-generated from the cluster
  // member resolver (see buildDynamicToolHubBodies) and spliced between the
  // HUB_TOOL_LIST markers; hand-curated prose outside the markers survives.
  if (toolHubBodies && toolHubBodies.has(normalizedRoute) && pageData.bodyHtml) {
    pageData.bodyHtml = spliceToolHubList(pageData.bodyHtml, toolHubBodies.get(normalizedRoute), { route: normalizedRoute });
  }
  // Homepage: splice live counts + dynamic datalist into BODYHTML.html.
  // 3 surgical replacements preserve all surrounding hero/bento markup.
  // If a regex misses (e.g. operator restructured the hero), leave the
  // static value in place and emit a console.warn - no silent breakage.
  if (normalizedRoute === '/' && homeSearchData && pageData.bodyHtml) {
    const { toolCount, guideCount, totalCount, datalistInnerHTML } = homeSearchData;
    const taglineRe = /(\d+)\s+fast tools/;
    const placeholderRe = /placeholder="Search \d+ tools - try ([^"]*)"/;
    const datalistRe = /<datalist id="home-tool-list">[\s\S]*?<\/datalist>/;
    let next = pageData.bodyHtml;
    let hit = 0;
    if (taglineRe.test(next)) { next = next.replace(taglineRe, `${toolCount} fast tools + ${guideCount} guides`); hit++; }
    if (placeholderRe.test(next)) { next = next.replace(placeholderRe, `placeholder="Search ${totalCount} tools and guides - try $1"`); hit++; }
    if (datalistRe.test(next)) { next = next.replace(datalistRe, `<datalist id="home-tool-list">\n${datalistInnerHTML}\n      </datalist>`); hit++; }
    if (hit === 3) {
      pageData.bodyHtml = next;
      console.log(`[home-search] Spliced into / bodyHtml: ${toolCount}+${guideCount}=${totalCount}.`);
    } else {
      console.warn(`[home-search] Only ${hit}/3 regex hits on / bodyHtml - leaving static values in place. Check BODYHTML.html structure.`);
    }
    // 2026-07-06 operator fix: the REMAINING homepage counts were hardcoded
    // and stale (title "122 Browser Tools" vs registry 108; bento "9 dev
    // tools" vs registry 21; TRUSTED badge; why-bullets; BODYWELCOME prose).
    // Same warn-on-miss splice contract, counts from home-counts.mjs (the
    // registry-derived single source shared with the datalist above).
    const homeCounts = getHomeCounts();
    // TRUSTED ratings badge: best-effort live fetch (same endpoint the
    // gated JSON-LD path uses); static 4.5/226+ stays when unavailable.
    let homeRatings = null;
    try {
      homeRatings = await loadAggregateRating({ apiOrigin, pageName: pageData.pageName, route: normalizedRoute });
    } catch { /* keep static badge */ }
    const bodyRes = spliceHomeBodyHtml(pageData.bodyHtml, homeCounts, homeRatings);
    pageData.bodyHtml = bodyRes.html;
    if (bodyRes.misses.length) {
      console.warn(`[home-counts] ${bodyRes.hits} hits, missed: ${bodyRes.misses.join(', ')} - static values left in place. Check BODYHTML.html structure.`);
    } else {
      console.log(`[home-counts] Spliced ${bodyRes.hits} count surfaces into / bodyHtml (tools=${homeCounts.toolCount}, guides=${homeCounts.guideCount}, categories=${homeCounts.categoryCount}${homeRatings ? `, ratings=${homeRatings.ratingValue}/${homeRatings.ratingCount}` : ''}).`);
    }
    if (pageData.bodyWelcome) {
      const welcomeRes = spliceHomeWelcome(pageData.bodyWelcome, homeCounts);
      pageData.bodyWelcome = welcomeRes.html;
      if (welcomeRes.misses.length) {
        console.warn(`[home-counts] BODYWELCOME missed: ${welcomeRes.misses.join(', ')}.`);
      }
    }
    // Meta surfaces: <title>/og:title (renderer reads pageBrowserTitle/
    // bodyTitle for home since this fix) + meta/og description.
    if (pageData.bodyTitle) pageData.bodyTitle = spliceCountsInText(pageData.bodyTitle, homeCounts);
    if (pageData.pageBrowserTitle) pageData.pageBrowserTitle = spliceCountsInText(pageData.pageBrowserTitle, homeCounts);
    if (pageData.bodyDesc) pageData.bodyDesc = spliceCountsInText(pageData.bodyDesc, homeCounts);
    // Knowledge explorer: regenerate the directory tree between the
    // KNOWLEDGE_TREE markers (same warn-on-miss contract as the datalist),
    // and stamp the deploy base path so the lazy loader + client script can
    // fetch /data/knowledge-graph.json under a subpath deploy (staging).
    if (knowledgeGraphData?.treeHtml) {
      const treeRe = /<!-- KNOWLEDGE_TREE_START -->[\s\S]*?<!-- KNOWLEDGE_TREE_END -->/;
      if (treeRe.test(pageData.bodyHtml)) {
        pageData.bodyHtml = pageData.bodyHtml.replace(
          treeRe,
          `<!-- KNOWLEDGE_TREE_START -->\n${knowledgeGraphData.treeHtml}\n<!-- KNOWLEDGE_TREE_END -->`
        );
        pageData.bodyHtml = pageData.bodyHtml.replace('data-base=""', `data-base="${basePath}"`);
        console.log(`[knowledge-graph] Spliced directory tree into / bodyHtml (${knowledgeGraphData.stats.nodeCount} nodes).`);
      } else {
        console.warn('[knowledge-graph] KNOWLEDGE_TREE markers missing in / bodyHtml - static fallback left in place.');
      }
    }
    // Testimonials trust section: splice the curated featured set + Trustpilot
    // widget between the TESTIMONIALS markers (same warn-on-miss contract).
    const featured = getFeaturedTestimonials(6);
    if (featured.length) {
      const tRe = /<!-- TESTIMONIALS_START -->[\s\S]*?<!-- TESTIMONIALS_END -->/;
      if (tRe.test(pageData.bodyHtml)) {
        const section = renderTestimonialsSection(featured, { variant: 'home', widget: true });
        pageData.bodyHtml = pageData.bodyHtml.replace(tRe, `<!-- TESTIMONIALS_START -->\n${section}\n<!-- TESTIMONIALS_END -->`);
        console.log(`[testimonials] Spliced ${featured.length} featured testimonials into / bodyHtml.`);
      } else {
        console.warn('[testimonials] TESTIMONIALS markers missing in / bodyHtml - static fallback left in place.');
      }
    }
  }
  // Per-page "last modified" stamp from git history of this page's CMS
  // fragments + JSP wrapper. Drives Schema.org dateModified (JSON-LD +
  // visible <time> tag). Requires `fetch-depth: 0` in the GH Actions
  // checkout step; see .github/workflows/pages.yml.
  const lastUpdatedIso = await resolvePageMtime({
    repoRoot,
    cmsRoot,
    jspRoot,
    slug: pageData.slug,
    jspRelativePath: jspPath,
  });
  // Real first-publish date (earliest creating commit across the page's
  // fragments). Replaces the hardcoded 2026-04-19 anchor on guide Article
  // JSON-LD (review/20260720 P1#7). Null on shallow checkouts -> renderer
  // falls back to the legacy anchor.
  const createdIso = await resolvePageCreated({
    repoRoot,
    cmsRoot,
    jspRoot,
    slug: pageData.slug,
    jspRelativePath: jspPath,
  });
  // fire-23: hub detection via the shared helper so non-'-tools' hubs
  // (/games.html, /space-3d.html, /guides.html) are treated as hubs here too.
  const isHubPage = isHubRoute(normalizedRoute);
  const showRating = !isHubPage && !isInfoRoute(normalizedRoute) && normalizedRoute !== '/' && normalizedRoute !== '/alternatead.html';
  // P10.1.1 - AggregateRating emission gate (Path A). Until a visible rating UI
  // renders on the tool page, JSON-LD rating data violates Google's structured-data
  // visibility policy (March 2026 spam update exposure). Emission defaults OFF; flip
  // EMIT_AGGREGATE_RATING=true once a visible on-page rating block ships.
  const emitAggregateRating = process.env.EMIT_AGGREGATE_RATING === 'true';
  const aggregateRating = showRating && emitAggregateRating
    ? await loadAggregateRating({ apiOrigin, pageName: pageData.pageName, route: normalizedRoute })
    : null;
  if (!showRating) {
    console.log(`[ratings] Skip rating fetch for ${normalizedRoute} (showRating=false).`);
  } else if (!emitAggregateRating) {
    console.log(`[seo:rating] emit=false route=${normalizedRoute} reason=gated-P10.1.1.`);
  }

  return {
    html: renderPageDocument({
      route: normalizedRoute,
      siteOrigin,
      canonicalOrigin,
      basePath,
      isStaging,
      rewriteInternalContent,
      apiOrigin,
      shortenDomain,
      appVersion: runtimeConfig.appVersion,
      ioVersion: runtimeConfig.ioVersion,
      deploySha,
      getAlterUploaderDelayMs: runtimeConfig.getAlterUploaderDelayMs,
      bgsCollection: runtimeConfig.bgsCollection,
      ioInfos: runtimeConfig.ioInfos,
      unsplashKey: runtimeConfig.unsplashKey,
      randomString: runtimeConfig.randomString,
      sharedFragments,
      lMenu,
      pageData,
      pageAttrs,
      bodyHtml,
      themeCss: sharedFragments.themeCss,
      aggregateRating,
      relatedToolsData,
      lastUpdatedIso,
      createdIso,
    }),
    canonical: true,
  };
}

async function loadAggregateRating({ apiOrigin, pageName, route }) {
  if (!pageName) {
    console.log(`[ratings] Omit rating for ${route}: missing pageName.`);
    return null;
  }

  const ratingUrl = new URL('ajax/get-rating', apiOrigin);
  ratingUrl.searchParams.set('pageName', pageName);
  const ratingOrigin = resolveRatingOrigin(siteOrigin);
  const timeoutMs = Number.parseInt(process.env.RATING_FETCH_TIMEOUT_MS ?? '5000', 10);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  console.log(`[ratings] Fetching rating for ${pageName} (${route}) from ${ratingUrl.href} (origin=${ratingOrigin})`);

  try {
    const response = await fetch(ratingUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json; charset=UTF-8',
        Origin: ratingOrigin,
        Pragma: 'no-cache',
        Referer: `${ratingOrigin}/`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: '{}',
      signal: controller.signal,
    });
    const responseUrl = response.url;
    const contentType = response.headers.get('content-type') ?? '';
    if (!response.ok) {
      console.log(`[ratings] Omit rating for ${pageName}: HTTP ${response.status} (content-type=${contentType}, url=${responseUrl}).`);
      return null;
    }

    const payload = await response.json();
    const ratingCountRaw = payload?.total ?? payload?.ratingCount ?? payload?.reviewCount;
    const ratingValueRaw = payload?.avg ?? payload?.ratingValue;
    const ratingCount = Number.parseInt(ratingCountRaw, 10);
    const ratingValue = Number.parseFloat(ratingValueRaw);

    if (!Number.isFinite(ratingCount) || !Number.isFinite(ratingValue)) {
      console.log(`[ratings] Omit rating for ${pageName}: invalid numeric payload ${JSON.stringify(payload).slice(0, 200)} (content-type=${contentType}, url=${responseUrl}).`);
      return null;
    }

    if (ratingCount < 1 || ratingValue < 1 || ratingValue > 5) {
      console.log(`[ratings] Omit rating for ${pageName}: out-of-range avg=${ratingValue}, total=${ratingCount}.`);
      return null;
    }

    const normalizedRatingValue = Number.parseFloat(ratingValue.toFixed(1));
    console.log(`[ratings] Using rating for ${pageName}: avg=${normalizedRatingValue}, total=${ratingCount}.`);
    return { ratingValue: normalizedRatingValue, ratingCount };
  } catch (error) {
    console.log(`[ratings] Omit rating for ${pageName}: ${error instanceof Error ? error.message : 'unknown error'}.`);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeOrigin(value) {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return '';
  }
  try {
    return new URL(raw).origin;
  } catch {
    return raw.replace(/\/+$/, '');
  }
}

function resolveRatingOrigin(siteOriginValue) {
  const override = String(process.env.RATING_ORIGIN ?? '').trim();
  if (override) {
    return normalizeOrigin(override);
  }

  const origin = normalizeOrigin(siteOriginValue);
  if (/github\.io$/i.test(origin)) {
    return 'https://dangkhoaow.github.io';
  }
  return 'https://freetoolonline.com';
}

// HTML comments authored by the SEO agent (Phase B authoring markers,
// cycle annotations, ROW dividers, etc.) are useful in source for audit
// trail but add page weight + DOM noise in the published artifact. Strip
// them at writeOutput time; keep IE conditional comments and the GTM /
// AdSense markers that downstream tooling looks for.
const PRESERVE_COMMENT_PATTERNS = [
  /^\s*\[if /i,
  /\s*<!\[endif\]/i,
  /Google Tag Manager/i,
  /google_ad_/i,
  /Responsive-ad/i,
];

function stripHtmlComments(html) {
  return html.replace(/<!--([\s\S]*?)-->/g, (match, inner) => {
    if (PRESERVE_COMMENT_PATTERNS.some((re) => re.test(inner))) return match;
    return '';
  });
}

async function writeOutput(outputPath, contents) {
  const fullOutputPath = path.join(distDir, outputPath);
  await mkdir(path.dirname(fullOutputPath), { recursive: true });
  const isHtml = /\.html?$/i.test(outputPath);
  const finalContents = isHtml ? stripHtmlComments(contents) : contents;
  await writeFile(fullOutputPath, finalContents, 'utf8');
}

function outputPathForRoute(route) {
  const pathname = normalizeRoute(route);
  if (pathname === '/' || pathname === '') {
    return 'index.html';
  }
  if (pathname.endsWith('/')) {
    return path.posix.join(pathname.slice(1), 'index.html');
  }
  return pathname.replace(/^\/+/, '');
}

async function writeRootTextFile(name, content) {
  await writeFile(path.join(distDir, name), content, 'utf8');
}

async function rewriteStaticAsset(assetPath, rewriteInternalContent) {
  const contents = await readFile(assetPath, 'utf8');
  await writeFile(assetPath, rewriteInternalContent(contents), 'utf8');
}

function buildRobotsTxt(sourceRobotsTxt, { isStaging, siteOrigin }) {
  if (isStaging) {
    return 'User-agent: *\nDisallow: /\n';
  }

  const sitemapUrl = new URL('/sitemap.xml', siteOrigin).href;
  if (!sourceRobotsTxt) {
    return `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`;
  }

  if (/^Sitemap:/im.test(sourceRobotsTxt)) {
    return sourceRobotsTxt.replace(/^Sitemap:.*$/gim, `Sitemap: ${sitemapUrl}`);
  }

  return `${sourceRobotsTxt.trim()}\nSitemap: ${sitemapUrl}\n`;
}

async function loadRuntimeConfig(staticAssetsRoot) {
  const snapshotConfigPath = path.join(staticAssetsRoot, 'runtime-config.json');
  const snapshotText = (await loadTextIfExists(snapshotConfigPath)).trim();
  const snapshot = snapshotText ? JSON.parse(snapshotText) : {};

  return {
    appVersion: snapshot.appVersion ?? DEFAULT_APP_VERSION,
    ioVersion: snapshot.ioVersion ?? DEFAULT_IO_VERSION,
    unsplashKey: snapshot.unsplashKey ?? DEFAULT_UNSPLASH_KEY,
    randomString: snapshot.randomString ?? DEFAULT_RANDOM_STRING,
    bgsCollection: snapshot.bgsCollection ?? DEFAULT_BGS_COLLECTION,
    ioInfos: snapshot.ioInfos ?? DEFAULT_IO_INFOS,
    getAlterUploaderDelayMs: snapshot.getAlterUploaderDelayMs ?? DEFAULT_ALTER_UPLOADER_DELAY_MS,
    ...(process.env.APP_VERSION ? { appVersion: process.env.APP_VERSION } : {}),
    ...(process.env.IO_VERSION ? { ioVersion: process.env.IO_VERSION } : {}),
    ...(process.env.UNSPLASH_KEY ? { unsplashKey: process.env.UNSPLASH_KEY } : {}),
    ...(process.env.RANDOM_STRING ? { randomString: process.env.RANDOM_STRING } : {}),
    ...(process.env.BGS_COLLECTION ? { bgsCollection: process.env.BGS_COLLECTION } : {}),
    ...(process.env.IO_INFOS ? { ioInfos: process.env.IO_INFOS } : {}),
    ...(process.env.GET_ALTER_UPLOADER_DELAY_MS ? { getAlterUploaderDelayMs: process.env.GET_ALTER_UPLOADER_DELAY_MS } : {}),
  };
}

async function resolveSourceRepoRoot() {
  const candidates = [
    path.resolve(repoRoot, 'source'),
    process.env.SOURCE_REPO_ROOT,
    path.resolve(repoRoot, '..', 'freetoolonline'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return path.resolve(candidate);
    } catch {
      // Try the next candidate.
    }
  }

  throw new Error('Unable to locate the freetoolonline source snapshot. Populate ./source, set SOURCE_REPO_ROOT, or check out the source repo beside this project.');
}

function ensureTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

function unique(values) {
  return [...new Set(values)];
}

await main();
