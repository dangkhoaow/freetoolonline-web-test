// Per-page "last modified" resolver: returns the ISO timestamp of the most
// recent git commit that touched any of the page's CMS fragments or its JSP
// wrapper. Used at build time by renderPageDocument to emit Schema.org
// dateModified (JSON-LD + visible <time> tag) so a page's freshness stamp
// only changes when its own content changes.
//
// Requires GH Actions checkout with `fetch-depth: 0`. The default
// `fetch-depth: 1` yields one shallow commit and every page would receive
// the same stamp. See .github/workflows/pages.yml.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const execFileAsync = promisify(execFile);
const NOW_ISO = new Date().toISOString();
const cache = new Map();

// Perf note (2026-07-11): this used to shell out to `git log -1 -- <paths>`
// once PER PAGE (1000+ routes x up to 6 locales = thousands of subprocess
// spawns, each walking full history for its own narrow pathspec). At current
// repo scale that made every export take 15-40+ minutes and repeatedly blew
// through the pipeline's build-gate timeout ceilings (900s, then 2400s).
// Fix: walk history ONCE per repoRoot with --name-only and build a
// path -> most-recent-commit-ISO map; resolvePageMtime then does an in-memory
// lookup instead of spawning git. git log is newest-first, so the first time
// a path is seen while iterating is its most recent modifying commit.
const mtimeIndexPromises = new Map();

async function buildMtimeIndex(repoRoot) {
  try {
    const { stdout } = await execFileAsync(
      'git',
      ['log', '--format=%x01%cI', '--name-only', '--', 'source/'],
      { cwd: repoRoot, maxBuffer: 512 * 1024 * 1024 },
    );
    // One walk, two maps (2026-07-21, review/20260720 P1#7): git log is
    // newest-first, so the FIRST time a path is seen = its most recent
    // modifying commit (modified), and the LAST time = the commit that
    // created it (created). `created` drives real Article datePublished;
    // `modified` drives dateModified + sitemap <lastmod>.
    const modified = new Map();
    const created = new Map();
    let currentIso = null;
    for (const line of stdout.split('\n')) {
      if (line.startsWith('\x01')) {
        currentIso = line.slice(1).trim();
        continue;
      }
      const file = line.trim();
      if (!file || !currentIso) continue;
      if (!modified.has(file)) modified.set(file, currentIso);
      created.set(file, currentIso); // keep overwriting -> oldest commit wins
    }
    return { modified, created };
  } catch {
    return { modified: new Map(), created: new Map() };
  }
}

function getMtimeIndex(repoRoot) {
  if (!mtimeIndexPromises.has(repoRoot)) {
    mtimeIndexPromises.set(repoRoot, buildMtimeIndex(repoRoot));
  }
  return mtimeIndexPromises.get(repoRoot);
}

async function gitMostRecentIso(repoRoot, pathspecs) {
  const candidates = pathspecs.filter(Boolean);
  if (candidates.length === 0) return null;
  const index = await getMtimeIndex(repoRoot);
  let best = null;
  for (const candidate of candidates) {
    const iso = index.modified.get(candidate);
    if (iso && (!best || iso > best)) best = iso;
  }
  return best;
}

// Earliest creation commit across the page's fragments = the page's real
// first-publish moment. Returns null (never NOW) when nothing is in the
// index, so callers can apply their own honest fallback.
async function gitEarliestCreatedIso(repoRoot, pathspecs) {
  const candidates = pathspecs.filter(Boolean);
  if (candidates.length === 0) return null;
  const index = await getMtimeIndex(repoRoot);
  let earliest = null;
  for (const candidate of candidates) {
    const iso = index.created.get(candidate);
    if (iso && (!earliest || iso < earliest)) earliest = iso;
  }
  return earliest;
}

function buildPageFragmentNames(slug) {
  const suffix = slug || '';
  return [
    `BODYTITLE${suffix}.txt`,
    `BODYDESC${suffix}.txt`,
    `BODYKW${suffix}.txt`,
    `BODYHTML${suffix}.html`,
    `BODYWELCOME${suffix}.html`,
    `BODYJS${suffix}.html`,
    `BODYFILETYPE${suffix}.txt`,
    `BODYFILETYPE2${suffix}.txt`,
    `FAQ${suffix}.html`,
    `PAGESTYLE${suffix}.css`,
    `PAGEBROWSERTITLE${suffix}.txt`,
    `PAGEBROWSERTITLE${suffix}-mobile.txt`,
    `PAGECANO${suffix}.txt`,
    `PAGEHASSETTINGS${suffix}.txt`,
  ];
}

function buildPagePathspecs({ repoRoot, cmsRoot, jspRoot, slug, jspRelativePath }) {
  const cmsPathspecs = buildPageFragmentNames(slug).map((name) =>
    path.relative(repoRoot, path.join(cmsRoot, name)),
  );
  const jspPathspec = jspRelativePath && jspRoot
    ? path.relative(repoRoot, path.join(jspRoot, jspRelativePath))
    : null;
  return [...cmsPathspecs, jspPathspec];
}

export async function resolvePageMtime({ repoRoot, cmsRoot, jspRoot, slug, jspRelativePath }) {
  const cacheKey = `${slug ?? ''}|${jspRelativePath ?? ''}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const pathspecs = buildPagePathspecs({ repoRoot, cmsRoot, jspRoot, slug, jspRelativePath });
  const iso = (await gitMostRecentIso(repoRoot, pathspecs)) || NOW_ISO;
  cache.set(cacheKey, iso);
  return iso;
}

// Real first-publish date for a page (earliest commit that created any of
// its CMS fragments / JSP wrapper). Added 2026-07-21 (review/20260720 P1#7)
// to replace the hardcoded `datePublished: '2026-04-19T08:00:00Z'` on ~6.9k
// guide Article JSON-LDs — 1,310+ articles "published" the same second is a
// fabricated-freshness red flag. Returns null on shallow checkouts.
const createdCache = new Map();
export async function resolvePageCreated({ repoRoot, cmsRoot, jspRoot, slug, jspRelativePath }) {
  const cacheKey = `${slug ?? ''}|${jspRelativePath ?? ''}`;
  if (createdCache.has(cacheKey)) return createdCache.get(cacheKey);

  const pathspecs = buildPagePathspecs({ repoRoot, cmsRoot, jspRoot, slug, jspRelativePath });
  const iso = await gitEarliestCreatedIso(repoRoot, pathspecs);
  createdCache.set(cacheKey, iso);
  return iso;
}

// Route-level git lastmod for the sitemap writer (review/20260720 P1#7).
// UNLIKE resolvePageMtime this returns null (not NOW) on a miss: sitemap
// <lastmod> must NEVER silently equal build time again - fresh `actions/
// checkout` resets every fs mtime, which is exactly the bug this replaces
// (Google ignores lastmod once it detects it is unreliable).
export async function resolveRouteGitLastmod({ repoRoot, cmsRoot, slug }) {
  const pathspecs = buildPagePathspecs({ repoRoot, cmsRoot, jspRoot: null, slug, jspRelativePath: null });
  return gitMostRecentIso(repoRoot, pathspecs);
}

// Stable human-readable date for the visible <time> element. Locale fixed
// to en-US so the rendered string is deterministic across CI runners.
export function formatHumanDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export function getBuildTimeIso() {
  return NOW_ISO;
}

// 48 BODYWELCOME*.html fragments ship with a hardcoded
// `<time itemprop="dateUpdated" datetime="2024-11-13T..."><b>Last updated: Nov
// 13, 2024</b></time>` line under the H1. Rewrite that block in place at
// build time with the page's real mtime + the standard `dateModified`
// itemprop. Returns { html, replaced } so the renderer can skip the
// bottom-of-page fallback stamp when the welcome already carries one.
const LEGACY_LAST_UPDATED_RE = /<time\s+itemprop="(?:dateUpdated|dateModified)"\s+datetime="[^"]*"\s*>\s*<b>\s*Last updated:[^<]*<\/b>\s*<\/time>/gi;

export function rewriteLastUpdatedTag(html, lastUpdatedIso) {
  if (!html || !lastUpdatedIso) return { html, replaced: false };
  const human = formatHumanDate(lastUpdatedIso);
  if (!human) return { html, replaced: false };
  let replaced = false;
  const out = String(html).replace(LEGACY_LAST_UPDATED_RE, () => {
    replaced = true;
    return `<time itemprop="dateModified" datetime="${lastUpdatedIso}"><b>Last updated: ${human}</b></time>`;
  });
  return { html: out, replaced };
}
