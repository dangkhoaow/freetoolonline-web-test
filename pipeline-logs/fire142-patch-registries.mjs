#!/usr/bin/env node
/** fire142: patch registries for desk-cat-coder */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FRONTEND = join(ROOT, '..');

function patch(file, ...replacements) {
  let s = readFileSync(file, 'utf8');
  if (s.includes('/games/desk-cat-coder.html')) {
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
  // game-discovery-loop-runbook fire142 (2026-07-18): desk-cat-coder companion guides
  '/guides/how-to-play-desk-cat-coder.html',
  '/guides/desk-cat-coder-when.html',
  '/guides/desk-cat-coder-vs-alternatives.html',
  '/guides/pt/how-to-play-desk-cat-coder.html',
  '/guides/pt/desk-cat-coder-when.html',
  '/guides/pt/desk-cat-coder-vs-alternatives.html',
  '/guides/es/how-to-play-desk-cat-coder.html',
  '/guides/es/desk-cat-coder-when.html',
  '/guides/es/desk-cat-coder-vs-alternatives.html',
  '/guides/vi/how-to-play-desk-cat-coder.html',
  '/guides/vi/desk-cat-coder-when.html',
  '/guides/vi/desk-cat-coder-vs-alternatives.html',
  '/guides/id/how-to-play-desk-cat-coder.html',
  '/guides/id/desk-cat-coder-when.html',
  '/guides/id/desk-cat-coder-vs-alternatives.html',
  '/guides/de/how-to-play-desk-cat-coder.html',
  '/guides/de/desk-cat-coder-when.html',
  '/guides/de/desk-cat-coder-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire142 (2026-07-18): desk-cat-coder companion guides
  '/guides/how-to-play-desk-cat-coder.html': 'guide/how-to-play-desk-cat-coder.jsp',
  '/guides/desk-cat-coder-when.html': 'guide/desk-cat-coder-when.jsp',
  '/guides/desk-cat-coder-vs-alternatives.html': 'guide/desk-cat-coder-vs-alternatives.jsp',
  '/guides/pt/how-to-play-desk-cat-coder.html': 'guide/pt/how-to-play-desk-cat-coder.jsp',
  '/guides/pt/desk-cat-coder-when.html': 'guide/pt/desk-cat-coder-when.jsp',
  '/guides/pt/desk-cat-coder-vs-alternatives.html': 'guide/pt/desk-cat-coder-vs-alternatives.jsp',
  '/guides/es/how-to-play-desk-cat-coder.html': 'guide/es/how-to-play-desk-cat-coder.jsp',
  '/guides/es/desk-cat-coder-when.html': 'guide/es/desk-cat-coder-when.jsp',
  '/guides/es/desk-cat-coder-vs-alternatives.html': 'guide/es/desk-cat-coder-vs-alternatives.jsp',
  '/guides/vi/how-to-play-desk-cat-coder.html': 'guide/vi/how-to-play-desk-cat-coder.jsp',
  '/guides/vi/desk-cat-coder-when.html': 'guide/vi/desk-cat-coder-when.jsp',
  '/guides/vi/desk-cat-coder-vs-alternatives.html': 'guide/vi/desk-cat-coder-vs-alternatives.jsp',
  '/guides/id/how-to-play-desk-cat-coder.html': 'guide/id/how-to-play-desk-cat-coder.jsp',
  '/guides/id/desk-cat-coder-when.html': 'guide/id/desk-cat-coder-when.jsp',
  '/guides/id/desk-cat-coder-vs-alternatives.html': 'guide/id/desk-cat-coder-vs-alternatives.jsp',
  '/guides/de/how-to-play-desk-cat-coder.html': 'guide/de/how-to-play-desk-cat-coder.jsp',
  '/guides/de/desk-cat-coder-when.html': 'guide/de/desk-cat-coder-when.jsp',
  '/guides/de/desk-cat-coder-vs-alternatives.html': 'guide/de/desk-cat-coder-vs-alternatives.jsp',
`;

patch(
  join(ROOT, 'scripts/site-data.mjs'),
  [`  '/guides/de/seasonal-witchcat-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/seasonal-witchcat-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire16`],
  [`  '/seasonal-witchcat.html': '/games/seasonal-witchcat.html',\n\n  '/gravity-orbit-golf.html'`, `  '/seasonal-witchcat.html': '/games/seasonal-witchcat.html',\n  '/desk-cat-coder.html': '/games/desk-cat-coder.html',\n\n  '/gravity-orbit-golf.html'`],
  [`  '/guides/de/seasonal-witchcat-vs-alternatives.html': 'guide/de/seasonal-witchcat-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/seasonal-witchcat-vs-alternatives.html': 'guide/de/seasonal-witchcat-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire16`],
  [`  '/games/seasonal-witchcat.html': 'games/seasonal-witchcat.jsp',\n  '/games/asteroid-blaster.html'`, `  '/games/seasonal-witchcat.html': 'games/seasonal-witchcat.jsp',\n  '/games/desk-cat-coder.html': 'games/desk-cat-coder.jsp',\n  '/games/asteroid-blaster.html'`],
);

patch(
  join(ROOT, 'scripts/seo-clusters.mjs'),
  [`'/games/seasonal-witchcat.html']`, `'/games/seasonal-witchcat.html', '/games/desk-cat-coder.html']`],
);

patch(
  join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'),
  [
    `{ title: "Seasonal Witchcat", url: "https://freetoolonline.com/games/seasonal-witchcat.html", include: !1, tags: "games" },`,
    `{ title: "Seasonal Witchcat", url: "https://freetoolonline.com/games/seasonal-witchcat.html", include: !1, tags: "games" },\n    { title: "Desk Cat Coder", url: "https://freetoolonline.com/games/desk-cat-coder.html", include: !1, tags: "games" },`,
  ],
);

patch(
  join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'),
  [
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/seasonal-witchcat.html'>Seasonal Witchcat (Season Adventure)</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/seasonal-witchcat.html'>Seasonal Witchcat (Season Adventure)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/desk-cat-coder.html'>Desk Cat Coder (Stealth Desk)</a>`,
  ],
);

const cfPath = join(FRONTEND, 'seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js');
let cf = readFileSync(cfPath, 'utf8');
if (!cf.includes('desk-cat-coder')) {
  cf = cf.replace(
    `  "/seasonal-witchcat.html": "/games/seasonal-witchcat.html"`,
    `  "/seasonal-witchcat.html": "/games/seasonal-witchcat.html",\n  "/desk-cat-coder.html": "/games/desk-cat-coder.html"`,
  );
  writeFileSync(cfPath, cf, 'utf8');
  console.log('patched cloudfront 301');
}

console.log('fire142 registry patch complete');
