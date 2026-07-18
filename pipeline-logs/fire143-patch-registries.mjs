#!/usr/bin/env node
/** fire143: patch registries for boing-cat-platformer */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FRONTEND = join(ROOT, '..');

function patch(file, ...replacements) {
  let s = readFileSync(file, 'utf8');
  if (s.includes('/games/boing-cat-platformer.html')) {
    console.log('already patched', file);
    return;
  }
  for (const [from, to] of replacements) {
    if (!s.includes(from)) throw new Error(`patch miss in ${file}: ${from.slice(0, 80)}...`);
    s = s.replace(from, to);
  }
  writeFileSync(file, s, 'utf8');
  console.log('patched', file);
}

const guideRoutes = `
  // game-discovery-loop-runbook fire143 (2026-07-18): boing-cat-platformer companion guides
  '/guides/how-to-play-boing-cat-platformer.html',
  '/guides/boing-cat-platformer-when.html',
  '/guides/boing-cat-platformer-vs-alternatives.html',
  '/guides/pt/how-to-play-boing-cat-platformer.html',
  '/guides/pt/boing-cat-platformer-when.html',
  '/guides/pt/boing-cat-platformer-vs-alternatives.html',
  '/guides/es/how-to-play-boing-cat-platformer.html',
  '/guides/es/boing-cat-platformer-when.html',
  '/guides/es/boing-cat-platformer-vs-alternatives.html',
  '/guides/vi/how-to-play-boing-cat-platformer.html',
  '/guides/vi/boing-cat-platformer-when.html',
  '/guides/vi/boing-cat-platformer-vs-alternatives.html',
  '/guides/id/how-to-play-boing-cat-platformer.html',
  '/guides/id/boing-cat-platformer-when.html',
  '/guides/id/boing-cat-platformer-vs-alternatives.html',
  '/guides/de/how-to-play-boing-cat-platformer.html',
  '/guides/de/boing-cat-platformer-when.html',
  '/guides/de/boing-cat-platformer-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire143 (2026-07-18): boing-cat-platformer companion guides
  '/guides/how-to-play-boing-cat-platformer.html': 'guide/how-to-play-boing-cat-platformer.jsp',
  '/guides/boing-cat-platformer-when.html': 'guide/boing-cat-platformer-when.jsp',
  '/guides/boing-cat-platformer-vs-alternatives.html': 'guide/boing-cat-platformer-vs-alternatives.jsp',
  '/guides/pt/how-to-play-boing-cat-platformer.html': 'guide/pt/how-to-play-boing-cat-platformer.jsp',
  '/guides/pt/boing-cat-platformer-when.html': 'guide/pt/boing-cat-platformer-when.jsp',
  '/guides/pt/boing-cat-platformer-vs-alternatives.html': 'guide/pt/boing-cat-platformer-vs-alternatives.jsp',
  '/guides/es/how-to-play-boing-cat-platformer.html': 'guide/es/how-to-play-boing-cat-platformer.jsp',
  '/guides/es/boing-cat-platformer-when.html': 'guide/es/boing-cat-platformer-when.jsp',
  '/guides/es/boing-cat-platformer-vs-alternatives.html': 'guide/es/boing-cat-platformer-vs-alternatives.jsp',
  '/guides/vi/how-to-play-boing-cat-platformer.html': 'guide/vi/how-to-play-boing-cat-platformer.jsp',
  '/guides/vi/boing-cat-platformer-when.html': 'guide/vi/boing-cat-platformer-when.jsp',
  '/guides/vi/boing-cat-platformer-vs-alternatives.html': 'guide/vi/boing-cat-platformer-vs-alternatives.jsp',
  '/guides/id/how-to-play-boing-cat-platformer.html': 'guide/id/how-to-play-boing-cat-platformer.jsp',
  '/guides/id/boing-cat-platformer-when.html': 'guide/id/boing-cat-platformer-when.jsp',
  '/guides/id/boing-cat-platformer-vs-alternatives.html': 'guide/id/boing-cat-platformer-vs-alternatives.jsp',
  '/guides/de/how-to-play-boing-cat-platformer.html': 'guide/de/how-to-play-boing-cat-platformer.jsp',
  '/guides/de/boing-cat-platformer-when.html': 'guide/de/boing-cat-platformer-when.jsp',
  '/guides/de/boing-cat-platformer-vs-alternatives.html': 'guide/de/boing-cat-platformer-vs-alternatives.jsp',
`;

patch(
  join(ROOT, 'scripts/site-data.mjs'),
  [`  '/guides/de/desk-cat-coder-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/desk-cat-coder-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire16`],
  [`  '/desk-cat-coder.html': '/games/desk-cat-coder.html',\n\n  '/gravity-orbit-golf.html'`, `  '/desk-cat-coder.html': '/games/desk-cat-coder.html',\n  '/boing-cat-platformer.html': '/games/boing-cat-platformer.html',\n\n  '/gravity-orbit-golf.html'`],
  [`  '/guides/de/desk-cat-coder-vs-alternatives.html': 'guide/de/desk-cat-coder-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/desk-cat-coder-vs-alternatives.html': 'guide/de/desk-cat-coder-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire16`],
  [`  '/games/desk-cat-coder.html': 'games/desk-cat-coder.jsp',\n  '/games/asteroid-blaster.html'`, `  '/games/desk-cat-coder.html': 'games/desk-cat-coder.jsp',\n  '/games/boing-cat-platformer.html': 'games/boing-cat-platformer.jsp',\n  '/games/asteroid-blaster.html'`],
);

patch(
  join(ROOT, 'scripts/seo-clusters.mjs'),
  [`'/games/desk-cat-coder.html']`, `'/games/desk-cat-coder.html', '/games/boing-cat-platformer.html']`],
);

patch(
  join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'),
  [
    `{ title: "Desk Cat Coder", url: "https://freetoolonline.com/games/desk-cat-coder.html", include: !1, tags: "games" },`,
    `{ title: "Desk Cat Coder", url: "https://freetoolonline.com/games/desk-cat-coder.html", include: !1, tags: "games" },\n    { title: "Boing Cat Platformer", url: "https://freetoolonline.com/games/boing-cat-platformer.html", include: !1, tags: "games" },`,
  ],
);

patch(
  join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'),
  [
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/desk-cat-coder.html'>Desk Cat Coder (Stealth Desk)</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/desk-cat-coder.html'>Desk Cat Coder (Stealth Desk)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/boing-cat-platformer.html'>Boing Cat Platformer (Auto-Run Jump)</a>`,
  ],
);

const cfPath = join(FRONTEND, 'seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js');
let cf = readFileSync(cfPath, 'utf8');
if (!cf.includes('boing-cat-platformer')) {
  cf = cf.replace(
    `  "/desk-cat-coder.html": "/games/desk-cat-coder.html"`,
    `  "/desk-cat-coder.html": "/games/desk-cat-coder.html",\n  "/boing-cat-platformer.html": "/games/boing-cat-platformer.html"`,
  );
  writeFileSync(cfPath, cf, 'utf8');
  console.log('patched cloudfront 301');
} else {
  console.log('cloudfront 301 already patched');
}

console.log('fire143 registry patch complete');
