#!/usr/bin/env node
/** fire137: patch site-data, seo-clusters, related-tools, l-menu, cloudfront 301 */
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
  // game-discovery-loop-runbook fire137 (2026-07-18): mystic-card-paw companion guides
  '/guides/how-to-play-mystic-card-paw.html',
  '/guides/mystic-card-paw-when.html',
  '/guides/mystic-card-paw-vs-alternatives.html',
  '/guides/pt/how-to-play-mystic-card-paw.html',
  '/guides/pt/mystic-card-paw-when.html',
  '/guides/pt/mystic-card-paw-vs-alternatives.html',
  '/guides/es/how-to-play-mystic-card-paw.html',
  '/guides/es/mystic-card-paw-when.html',
  '/guides/es/mystic-card-paw-vs-alternatives.html',
  '/guides/vi/how-to-play-mystic-card-paw.html',
  '/guides/vi/mystic-card-paw-when.html',
  '/guides/vi/mystic-card-paw-vs-alternatives.html',
  '/guides/id/how-to-play-mystic-card-paw.html',
  '/guides/id/mystic-card-paw-when.html',
  '/guides/id/mystic-card-paw-vs-alternatives.html',
  '/guides/de/how-to-play-mystic-card-paw.html',
  '/guides/de/mystic-card-paw-when.html',
  '/guides/de/mystic-card-paw-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire137 (2026-07-18): mystic-card-paw companion guides
  '/guides/how-to-play-mystic-card-paw.html': 'guide/how-to-play-mystic-card-paw.jsp',
  '/guides/mystic-card-paw-when.html': 'guide/mystic-card-paw-when.jsp',
  '/guides/mystic-card-paw-vs-alternatives.html': 'guide/mystic-card-paw-vs-alternatives.jsp',
  '/guides/pt/how-to-play-mystic-card-paw.html': 'guide/pt/how-to-play-mystic-card-paw.jsp',
  '/guides/pt/mystic-card-paw-when.html': 'guide/pt/mystic-card-paw-when.jsp',
  '/guides/pt/mystic-card-paw-vs-alternatives.html': 'guide/pt/mystic-card-paw-vs-alternatives.jsp',
  '/guides/es/how-to-play-mystic-card-paw.html': 'guide/es/how-to-play-mystic-card-paw.jsp',
  '/guides/es/mystic-card-paw-when.html': 'guide/es/mystic-card-paw-when.jsp',
  '/guides/es/mystic-card-paw-vs-alternatives.html': 'guide/es/mystic-card-paw-vs-alternatives.jsp',
  '/guides/vi/how-to-play-mystic-card-paw.html': 'guide/vi/how-to-play-mystic-card-paw.jsp',
  '/guides/vi/mystic-card-paw-when.html': 'guide/vi/mystic-card-paw-when.jsp',
  '/guides/vi/mystic-card-paw-vs-alternatives.html': 'guide/vi/mystic-card-paw-vs-alternatives.jsp',
  '/guides/id/how-to-play-mystic-card-paw.html': 'guide/id/how-to-play-mystic-card-paw.jsp',
  '/guides/id/mystic-card-paw-when.html': 'guide/id/mystic-card-paw-when.jsp',
  '/guides/id/mystic-card-paw-vs-alternatives.html': 'guide/id/mystic-card-paw-vs-alternatives.jsp',
  '/guides/de/how-to-play-mystic-card-paw.html': 'guide/de/how-to-play-mystic-card-paw.jsp',
  '/guides/de/mystic-card-paw-when.html': 'guide/de/mystic-card-paw-when.jsp',
  '/guides/de/mystic-card-paw-vs-alternatives.html': 'guide/de/mystic-card-paw-vs-alternatives.jsp',
`;

patch(
  join(ROOT, 'scripts/site-data.mjs'),
  [`  '/guides/de/unlucky-crossing-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/unlucky-crossing-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire16`],
  [`  '/unlucky-crossing.html': '/games/unlucky-crossing.html',\n\n  '/gravity-orbit-golf.html'`, `  '/unlucky-crossing.html': '/games/unlucky-crossing.html',\n  '/mystic-card-paw.html': '/games/mystic-card-paw.html',\n\n  '/gravity-orbit-golf.html'`],
  [`  '/guides/de/unlucky-crossing-vs-alternatives.html': 'guide/de/unlucky-crossing-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/unlucky-crossing-vs-alternatives.html': 'guide/de/unlucky-crossing-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire16`],
  [`  '/games/unlucky-crossing.html': 'games/unlucky-crossing.jsp',\n  '/games/asteroid-blaster.html'`, `  '/games/unlucky-crossing.html': 'games/unlucky-crossing.jsp',\n  '/games/mystic-card-paw.html': 'games/mystic-card-paw.jsp',\n  '/games/asteroid-blaster.html'`],
);

patch(
  join(ROOT, 'scripts/seo-clusters.mjs'),
  [`'/games/unlucky-crossing.html']`, `'/games/unlucky-crossing.html', '/games/mystic-card-paw.html']`],
);

patch(
  join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'),
  [`    { title: "Unlucky Crossing", url: "https://freetoolonline.com/games/unlucky-crossing.html", include: !1, tags: "games" },`, `    { title: "Unlucky Crossing", url: "https://freetoolonline.com/games/unlucky-crossing.html", include: !1, tags: "games" },\n    { title: "Mystic Card Paw", url: "https://freetoolonline.com/games/mystic-card-paw.html", include: !1, tags: "games" },`],
);

patch(
  join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'),
  [`                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/unlucky-crossing.html'>Unlucky Crossing (Street Cat)</a>`, `                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/unlucky-crossing.html'>Unlucky Crossing (Street Cat)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/mystic-card-paw.html'>Mystic Card Paw (Poker Puzzle)</a>`],
);

const cfPath = join(FRONTEND, 'seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js');
let cf = readFileSync(cfPath, 'utf8');
if (!cf.includes('mystic-card-paw')) {
  cf = cf.replace(
    `  "/unlucky-crossing.html": "/games/unlucky-crossing.html"`,
    `  "/unlucky-crossing.html": "/games/unlucky-crossing.html",\n  "/mystic-card-paw.html": "/games/mystic-card-paw.html"`,
  );
  writeFileSync(cfPath, cf, 'utf8');
  console.log('patched cloudfront 301');
}

console.log('fire137 registry patch complete');
