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
    const index = new Map();
    let currentIso = null;
    for (const line of stdout.split('\n')) {
      if (line.startsWith('\x01')) {
        currentIso = line.slice(1).trim();
        continue;
      }
      const file = line.trim();
      if (!file || !currentIso) continue;
      if (!index.has(file)) index.set(file, currentIso);
    }
    return index;
  } catch {
    return new Map();
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
    const iso = index.get(candidate);
    if (iso && (!best || iso > best)) best = iso;
  }
  return best;
}

export async function resolvePageMtime({ repoRoot, cmsRoot, jspRoot, slug, jspRelativePath }) {
  const cacheKey = `${slug ?? ''}|${jspRelativePath ?? ''}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const suffix = slug || '';
  const fragmentNames = [
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

  const cmsPathspecs = fragmentNames.map((name) =>
    path.relative(repoRoot, path.join(cmsRoot, name)),
  );
  const jspPathspec = jspRelativePath
    ? path.relative(repoRoot, path.join(jspRoot, jspRelativePath))
    : null;

  const iso = (await gitMostRecentIso(repoRoot, [...cmsPathspecs, jspPathspec])) || NOW_ISO;
  cache.set(cacheKey, iso);
  return iso;
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
