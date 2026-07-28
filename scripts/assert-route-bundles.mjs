#!/usr/bin/env node
// assert-route-bundles.mjs - route/bundle completeness preflight (2026-07-28).
//
// WHY THIS EXISTS. export-site.mjs renders routeCandidates in an un-guarded
// loop: the FIRST route whose JSP wrapper is missing throws
// `Missing JSP source at <path>` and aborts the ENTIRE Pages build - after
// several minutes of rendering, naming only one of the missing routes.
//
// FORCING EXAMPLE (2026-07-28, subnet-calculator): the guide-farm-prune lane
// committed scripts/site-data.mjs wholesale while a concurrent
// new-tool-discovery lane (fire395) had 15 half-finished
// subnet-calculator-ipv4-cidr locale rows in the same working copy - registry
// entries written, JSP + CMS bundles not authored yet. Those 15 rows rode into
// 8e1a3ad5 ("pt-batch-1", whose message claims GUIDE_SITEMAP_EXCLUDE-only) and
// broke every staging build for ~1h until the rows were removed (254c0c44e).
//
// A pre-push hook already covers this, but it lives in the WRAPPER tree
// (.agent/skills/_lib/route-bundle-completeness.mjs), outside this repo, so it
// only protects machines where install-git-hooks.sh has been run. With lanes
// running on more than one machine that is not a guarantee. This script is
// self-contained IN the repo so CI can run it on every push, and it fails in
// seconds listing EVERY gap instead of one-at-a-time after a long render.
//
// Usage: node scripts/assert-route-bundles.mjs
//   exit 0 = every registered route resolves to an existing JSP wrapper
//   exit 1 = at least one gap (full list printed); build must not proceed

import fs from 'node:fs';
import path from 'node:path';
import {
  JSP_BY_ROUTE,
  ALIAS_ROUTES,
  SPECIAL_ROUTES,
  INFO_ROUTES,
  normalizeRoute,
} from './site-data.mjs';

const repoRoot = path.resolve(import.meta.dirname, '..');
const jspRoot = path.join(repoRoot, 'source/web/src/main/webapp/WEB-INF/jsp');

// Mirror buildJspIndex(): basename -> first matching .jsp, used as the fallback
// when a route has no explicit JSP_BY_ROUTE override.
const byBaseName = new Map();
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.jsp')) {
      const base = path.basename(entry.name, '.jsp');
      if (!byBaseName.has(base)) byBaseName.set(base, full);
    }
  }
})(jspRoot);

// Mirror resolveJspPathForRoute() exactly - an override wins, otherwise the
// basename index decides.
function resolveJsp(route) {
  const override = JSP_BY_ROUTE[route];
  if (override) return override;
  const base = route === '/' ? 'index' : path.basename(route, '.html');
  const abs = byBaseName.get(base);
  return abs ? path.relative(jspRoot, abs).replaceAll(path.sep, '/') : null;
}

// Mirror export-site.mjs's routeCandidates construction.
const routeCandidates = [
  ...new Set([
    ...Object.keys(JSP_BY_ROUTE),
    ...Object.keys(ALIAS_ROUTES),
    ...SPECIAL_ROUTES,
    ...INFO_ROUTES,
  ]),
]
  .map(normalizeRoute)
  .filter((route) => route === '/' || route.endsWith('.html') || route.endsWith('/'));

const unresolvable = [];
const missingFile = [];
const wrongLocale = [];

for (const route of routeCandidates) {
  // Aliases render a redirect stub and specials render inline - neither reads a JSP.
  if (route in ALIAS_ROUTES || SPECIAL_ROUTES.has(route)) continue;

  const jspPath = resolveJsp(route);
  if (!jspPath) {
    unresolvable.push(route);
    continue;
  }
  if (!fs.existsSync(path.join(jspRoot, jspPath))) {
    missingFile.push([route, jspPath]);
    continue;
  }
  // A /guides/<locale>/ route that falls through to a non-locale wrapper still
  // builds, but serves the wrong language - a silent duplicate-content bug that
  // only appears when a locale row is registered without its locale wrapper.
  const locale = route.match(/^\/guides\/(pt|es|vi|id|de)\//)?.[1];
  if (locale && !new RegExp(`^guides?/${locale}/`).test(jspPath)) {
    wrongLocale.push([route, jspPath]);
  }
}

console.log(`[route-bundles] checked ${routeCandidates.length} registered routes.`);

if (wrongLocale.length > 0) {
  console.warn(`[route-bundles] WARNING: ${wrongLocale.length} locale route(s) fall back to a non-locale JSP (wrong-language content):`);
  for (const [route, jspPath] of wrongLocale.slice(0, 20)) {
    console.warn(`  ${route} -> ${jspPath}`);
  }
}

if (unresolvable.length === 0 && missingFile.length === 0) {
  console.log('[route-bundles] OK - every registered route resolves to an existing JSP wrapper.');
  process.exit(0);
}

console.error('\n[route-bundles] FAIL - the Pages build would abort on these routes:\n');
for (const route of unresolvable) {
  console.error(`  ${route}\n      no JSP mapping at all (absent from JSP_BY_ROUTE and no basename match)`);
}
for (const [route, jspPath] of missingFile) {
  console.error(`  ${route}\n      registered -> ${jspPath} (file does not exist)`);
}
console.error(`
[route-bundles] ${unresolvable.length + missingFile.length} gap(s). A route is registered in
JSP_BY_ROUTE/INFO_ROUTES but its bundle was never authored, so export-site.mjs
throws and NO pages deploy.

Fix by either:
  1. committing the FULL bundle for each route above (JSP wrapper under
     source/web/src/main/webapp/WEB-INF/jsp/ + the BODYTITLE/BODYDESC/BODYHTML
     CMS fragments) - if the bundle exists on another machine, push that commit; or
  2. removing the premature registry rows if the content was never authored.

If these rows appeared in a commit that was NOT about adding them, they were
swept in by staging scripts/site-data.mjs wholesale while another lane had
in-progress edits in the same file. Stage only your own hunks - see
prompts/guide-farm-prune-runbook.md HARD GUARD 7.
`);
process.exit(1);
