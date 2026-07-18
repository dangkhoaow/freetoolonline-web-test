#!/usr/bin/env node
/** fire138: patch site-data, seo-clusters, related-tools, l-menu, cloudfront 301 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const FRONTEND = join(ROOT, '..');

function patch(file, ...replacements) {
  let s = readFileSync(file, 'utf8');
  for (const [from, to] of replacements) {
    if (!s.includes(from)) throw new Error(`patch miss in ${file}: ${from.slice(0, 60)}...`);
    s = s.replace(from, to);
  }
  writeFileSync(file, s, 'utf8');
  console.log('patched', file);
}

const guideRoutes = `
  // game-discovery-loop-runbook fire138 (2026-07-18): cat-hop-cloud companion guides
  '/guides/how-to-play-cat-hop-cloud.html',
  '/guides/cat-hop-cloud-when.html',
  '/guides/cat-hop-cloud-vs-alternatives.html',
  '/guides/pt/how-to-play-cat-hop-cloud.html',
  '/guides/pt/cat-hop-cloud-when.html',
  '/guides/pt/cat-hop-cloud-vs-alternatives.html',
  '/guides/es/how-to-play-cat-hop-cloud.html',
  '/guides/es/cat-hop-cloud-when.html',
  '/guides/es/cat-hop-cloud-vs-alternatives.html',
  '/guides/vi/how-to-play-cat-hop-cloud.html',
  '/guides/vi/cat-hop-cloud-when.html',
  '/guides/vi/cat-hop-cloud-vs-alternatives.html',
  '/guides/id/how-to-play-cat-hop-cloud.html',
  '/guides/id/cat-hop-cloud-when.html',
  '/guides/id/cat-hop-cloud-vs-alternatives.html',
  '/guides/de/how-to-play-cat-hop-cloud.html',
  '/guides/de/cat-hop-cloud-when.html',
  '/guides/de/cat-hop-cloud-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire138 (2026-07-18): cat-hop-cloud companion guides
  '/guides/how-to-play-cat-hop-cloud.html': 'guide/how-to-play-cat-hop-cloud.jsp',
  '/guides/cat-hop-cloud-when.html': 'guide/cat-hop-cloud-when.jsp',
  '/guides/cat-hop-cloud-vs-alternatives.html': 'guide/cat-hop-cloud-vs-alternatives.jsp',
  '/guides/pt/how-to-play-cat-hop-cloud.html': 'guide/pt/how-to-play-cat-hop-cloud.jsp',
  '/guides/pt/cat-hop-cloud-when.html': 'guide/pt/cat-hop-cloud-when.jsp',
  '/guides/pt/cat-hop-cloud-vs-alternatives.html': 'guide/pt/cat-hop-cloud-vs-alternatives.jsp',
  '/guides/es/how-to-play-cat-hop-cloud.html': 'guide/es/how-to-play-cat-hop-cloud.jsp',
  '/guides/es/cat-hop-cloud-when.html': 'guide/es/cat-hop-cloud-when.jsp',
  '/guides/es/cat-hop-cloud-vs-alternatives.html': 'guide/es/cat-hop-cloud-vs-alternatives.jsp',
  '/guides/vi/how-to-play-cat-hop-cloud.html': 'guide/vi/how-to-play-cat-hop-cloud.jsp',
  '/guides/vi/cat-hop-cloud-when.html': 'guide/vi/cat-hop-cloud-when.jsp',
  '/guides/vi/cat-hop-cloud-vs-alternatives.html': 'guide/vi/cat-hop-cloud-vs-alternatives.jsp',
  '/guides/id/how-to-play-cat-hop-cloud.html': 'guide/id/how-to-play-cat-hop-cloud.jsp',
  '/guides/id/cat-hop-cloud-when.html': 'guide/id/cat-hop-cloud-when.jsp',
  '/guides/id/cat-hop-cloud-vs-alternatives.html': 'guide/id/cat-hop-cloud-vs-alternatives.jsp',
  '/guides/de/how-to-play-cat-hop-cloud.html': 'guide/de/how-to-play-cat-hop-cloud.jsp',
  '/guides/de/cat-hop-cloud-when.html': 'guide/de/cat-hop-cloud-when.jsp',
  '/guides/de/cat-hop-cloud-vs-alternatives.html': 'guide/de/cat-hop-cloud-vs-alternatives.jsp',
`;

patch(
  join(ROOT, 'scripts/site-data.mjs'),
  [`  '/guides/de/mystic-card-paw-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/mystic-card-paw-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire16`],
  [`  '/mystic-card-paw.html': '/games/mystic-card-paw.html',\n\n  '/gravity-orbit-golf.html'`, `  '/mystic-card-paw.html': '/games/mystic-card-paw.html',\n  '/cat-hop-cloud.html': '/games/cat-hop-cloud.html',\n\n  '/gravity-orbit-golf.html'`],
  [`  '/guides/de/mystic-card-paw-vs-alternatives.html': 'guide/de/mystic-card-paw-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/mystic-card-paw-vs-alternatives.html': 'guide/de/mystic-card-paw-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire16`],
  [`  '/games/mystic-card-paw.html': 'games/mystic-card-paw.jsp',\n  '/games/asteroid-blaster.html'`, `  '/games/mystic-card-paw.html': 'games/mystic-card-paw.jsp',\n  '/games/cat-hop-cloud.html': 'games/cat-hop-cloud.jsp',\n  '/games/asteroid-blaster.html'`],
);

patch(
  join(ROOT, 'scripts/seo-clusters.mjs'),
  [`'/games/mystic-card-paw.html']`, `'/games/mystic-card-paw.html', '/games/cat-hop-cloud.html']`],
);

patch(
  join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'),
  [`    { title: "Mystic Card Paw", url: "https://freetoolonline.com/games/mystic-card-paw.html", include: !1, tags: "games" },`, `    { title: "Mystic Card Paw", url: "https://freetoolonline.com/games/mystic-card-paw.html", include: !1, tags: "games" },\n    { title: "Cat Hop Cloud", url: "https://freetoolonline.com/games/cat-hop-cloud.html", include: !1, tags: "games" },`],
);

patch(
  join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'),
  [`                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/mystic-card-paw.html'>Mystic Card Paw (Poker Puzzle)</a>`, `                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/mystic-card-paw.html'>Mystic Card Paw (Poker Puzzle)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/cat-hop-cloud.html'>Cat Hop Cloud (Luck Puzzle)</a>`],
);

const cfPath = join(FRONTEND, 'seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js');
let cf = readFileSync(cfPath, 'utf8');
if (!cf.includes('cat-hop-cloud')) {
  cf = cf.replace(
    `  "/mystic-card-paw.html": "/games/mystic-card-paw.html"`,
    `  "/mystic-card-paw.html": "/games/mystic-card-paw.html",\n  "/cat-hop-cloud.html": "/games/cat-hop-cloud.html"`,
  );
  writeFileSync(cfPath, cf, 'utf8');
  console.log('patched cloudfront 301');
}

console.log('fire138 registry patch complete');
