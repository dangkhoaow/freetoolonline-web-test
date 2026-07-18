#!/usr/bin/env node
/** fire145: vendor + adapt shaurya6903/DarkLine-Paws -> /games/darkline-paws.html
 * A 3-mode bundle selected via index.html's own dropdown (upstream's own
 * unified UX - shipped as ONE /games entry, no custom launcher menu needed):
 *   index.html  - raycasted first-person maze (2 layouts, health/damage/heal)
 *   index2.html - Tic-Tac-Toe vs an unbeatable minimax cat AI
 *   index3.html - "Cat Jumper" endless building-hop auto-runner
 * All navigation between the 3 (window.location.href) is relative and stays
 * correct as long as the 3 files + 2 webp assets sit flat in one directory. */
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..'); // web-test
const SRC = process.env.SRC_REPO || '/tmp/fire145-darklinepaws';
const DEST = join(ROOT, 'source/web/src/main/webapp/static/games/darkline-paws');

if (!existsSync(SRC)) throw new Error(`source repo missing: ${SRC}`);

mkdirSync(DEST, { recursive: true });

const VIEWPORT_LC = '<meta name=viewport content="width=device-width,initial-scale=1">';
const NOINDEX = '<meta name="robots" content="noindex">';

function addNoindex(html, file) {
  if (!html.includes(VIEWPORT_LC)) throw new Error(`${file}: viewport meta anchor not found`);
  const out = html.replace(VIEWPORT_LC, `${VIEWPORT_LC}${NOINDEX}`);
  if (!out.includes('noindex')) throw new Error(`${file}: noindex injection failed`);
  return out;
}

// --- 3 HTML modes: add noindex only (zero CDN/fetch/localStorage in any of
// the 3 - confirmed by full-text scan at fire144/fire145 scan time; titles
// are already clean English, no rebrand needed). ---
for (const file of ['index.html', 'index2.html', 'index3.html']) {
  const html = readFileSync(join(SRC, file), 'utf8');
  writeFileSync(join(DEST, file), addNoindex(html, file), 'utf8');
}

// --- verbatim vendor (unmodified upstream assets, used by index2.html's
// tic-tac-toe piece icons via --human-url/--ai-url CSS custom properties) ---
cpSync(join(SRC, 'cat1.ng.webp'), join(DEST, 'cat1.ng.webp'));
cpSync(join(SRC, 'cat2.webp'), join(DEST, 'cat2.webp'));

// --- LICENSE (verbatim MIT text from upstream) ---
cpSync(join(SRC, 'LICENSE'), join(DEST, 'LICENSE'));

// --- CREDITS.txt ---
writeFileSync(join(DEST, 'CREDITS.txt'), `DarkLine Paws - vendored for FreeToolOnline (game-discovery-loop-runbook fire145, 2026-07-18).

Upstream: shaurya6903/DarkLine-Paws (also mirrored at js13kGames/darkline-paws)
https://github.com/shaurya6903/DarkLine-Paws
js13kGames 2025, Black Cat theme.
License: MIT, Copyright (c) 2025 shaurya6903 (see LICENSE).

This is a 3-mode bundle selected from index.html's own dropdown menu:
- index.html  - raycasted first-person maze ("Deadly Maze" / "Maze" layouts)
- index2.html - Tic-Tac-Toe vs an unbeatable minimax cat AI
- index3.html - "Cat Jumper" endless rooftop building-hop auto-runner

Adaptations made in this build:
- Added <meta name="robots" content="noindex"> to all 3 HTML files (this
  iframe-only engine bundle is not meant to be indexed; the canonical URL
  is /games/darkline-paws.html).
- No CDN, no analytics, no localStorage anywhere in the upstream code;
  none added here. No rebrand needed - all 3 titles were already clean
  English ("DarkLine Paws - Enhanced Edition", "Tic Tac Toe", "Cat Jumper -
  Rooftop Adventure").
- cat1.ng.webp / cat2.webp are the upstream tic-tac-toe piece icons
  (index2.html only), vendored byte-identical.
`, 'utf8');

console.log('fire145 vendor complete ->', DEST);
