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

async function gitMostRecentIso(repoRoot, pathspecs) {
  const candidates = pathspecs.filter(Boolean);
  if (candidates.length === 0) return null;
  try {
    const { stdout } = await execFileAsync(
      'git',
      ['log', '-1', '--format=%cI', '--', ...candidates],
      { cwd: repoRoot, maxBuffer: 4 * 1024 * 1024 },
    );
    const iso = stdout.trim();
    return iso || null;
  } catch {
    return null;
  }
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
