#!/usr/bin/env node
/** fire140: patch site-data, seo-clusters, related-tools, l-menu, cloudfront 301 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const FRONTEND = join(ROOT, '..');

function patch(file, ...replacements) {
  let s = readFileSync(file, 'utf8');
  for (const [from, to] of replacements) {
    if (!s.includes(from)) throw new Error(`patch miss in ${file}: ${from.slice(0, 60)}...`);
    if (s.includes(to.includes('\n') ? to.trim().split('\n')[0] : to) && to.includes('seasonal-witchcat')) {
      // idempotent skip if already patched for seasonal-witchcat route
    }
    s = s.replace(from, to);
  }
  writeFileSync(file, s, 'utf8');
  console.log('patched', file);
}

const guideRoutes = `
  // game-discovery-loop-runbook fire140 (2026-07-18): seasonal-witchcat companion guides
  '/guides/how-to-play-seasonal-witchcat.html',
  '/guides/seasonal-witchcat-when.html',
  '/guides/seasonal-witchcat-vs-alternatives.html',
  '/guides/pt/how-to-play-seasonal-witchcat.html',
  '/guides/pt/seasonal-witchcat-when.html',
  '/guides/pt/seasonal-witchcat-vs-alternatives.html',
  '/guides/es/how-to-play-seasonal-witchcat.html',
  '/guides/es/seasonal-witchcat-when.html',
  '/guides/es/seasonal-witchcat-vs-alternatives.html',
  '/guides/vi/how-to-play-seasonal-witchcat.html',
  '/guides/vi/seasonal-witchcat-when.html',
  '/guides/vi/seasonal-witchcat-vs-alternatives.html',
  '/guides/id/how-to-play-seasonal-witchcat.html',
  '/guides/id/seasonal-witchcat-when.html',
  '/guides/id/seasonal-witchcat-vs-alternatives.html',
  '/guides/de/how-to-play-seasonal-witchcat.html',
  '/guides/de/seasonal-witchcat-when.html',
  '/guides/de/seasonal-witchcat-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire140 (2026-07-18): seasonal-witchcat companion guides
  '/guides/how-to-play-seasonal-witchcat.html': 'guide/how-to-play-seasonal-witchcat.jsp',
  '/guides/seasonal-witchcat-when.html': 'guide/seasonal-witchcat-when.jsp',
  '/guides/seasonal-witchcat-vs-alternatives.html': 'guide/seasonal-witchcat-vs-alternatives.jsp',
  '/guides/pt/how-to-play-seasonal-witchcat.html': 'guide/pt/how-to-play-seasonal-witchcat.jsp',
  '/guides/pt/seasonal-witchcat-when.html': 'guide/pt/seasonal-witchcat-when.jsp',
  '/guides/pt/seasonal-witchcat-vs-alternatives.html': 'guide/pt/seasonal-witchcat-vs-alternatives.jsp',
  '/guides/es/how-to-play-seasonal-witchcat.html': 'guide/es/how-to-play-seasonal-witchcat.jsp',
  '/guides/es/seasonal-witchcat-when.html': 'guide/es/seasonal-witchcat-when.jsp',
  '/guides/es/seasonal-witchcat-vs-alternatives.html': 'guide/es/seasonal-witchcat-vs-alternatives.jsp',
  '/guides/vi/how-to-play-seasonal-witchcat.html': 'guide/vi/how-to-play-seasonal-witchcat.jsp',
  '/guides/vi/seasonal-witchcat-when.html': 'guide/vi/seasonal-witchcat-when.jsp',
  '/guides/vi/seasonal-witchcat-vs-alternatives.html': 'guide/vi/seasonal-witchcat-vs-alternatives.jsp',
  '/guides/id/how-to-play-seasonal-witchcat.html': 'guide/id/how-to-play-seasonal-witchcat.jsp',
  '/guides/id/seasonal-witchcat-when.html': 'guide/id/seasonal-witchcat-when.jsp',
  '/guides/id/seasonal-witchcat-vs-alternatives.html': 'guide/id/seasonal-witchcat-vs-alternatives.jsp',
  '/guides/de/how-to-play-seasonal-witchcat.html': 'guide/de/how-to-play-seasonal-witchcat.jsp',
  '/guides/de/seasonal-witchcat-when.html': 'guide/de/seasonal-witchcat-when.jsp',
  '/guides/de/seasonal-witchcat-vs-alternatives.html': 'guide/de/seasonal-witchcat-vs-alternatives.jsp',
`;

patch(
  join(ROOT, 'scripts/site-data.mjs'),
  [`  '/guides/de/herd-cats-home-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/herd-cats-home-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire16`],
  [`  '/herd-cats-home.html': '/games/herd-cats-home.html',\n\n  '/gravity-orbit-golf.html'`, `  '/herd-cats-home.html': '/games/herd-cats-home.html',\n  '/seasonal-witchcat.html': '/games/seasonal-witchcat.html',\n\n  '/gravity-orbit-golf.html'`],
  [`  '/guides/de/herd-cats-home-vs-alternatives.html': 'guide/de/herd-cats-home-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/herd-cats-home-vs-alternatives.html': 'guide/de/herd-cats-home-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire16`],
  [`  '/games/herd-cats-home.html': 'games/herd-cats-home.jsp',\n  '/games/asteroid-blaster.html'`, `  '/games/herd-cats-home.html': 'games/herd-cats-home.jsp',\n  '/games/seasonal-witchcat.html': 'games/seasonal-witchcat.jsp',\n  '/games/asteroid-blaster.html'`],
);

patch(
  join(ROOT, 'scripts/seo-clusters.mjs'),
  [`'/games/herd-cats-home.html']`, `'/games/herd-cats-home.html', '/games/seasonal-witchcat.html']`],
);

patch(
  join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'),
  [`    { title: "Herd Cats Home", url: "https://freetoolonline.com/games/herd-cats-home.html", include: !1, tags: "games" },`, `    { title: "Herd Cats Home", url: "https://freetoolonline.com/games/herd-cats-home.html", include: !1, tags: "games" },\n    { title: "Seasonal Witchcat", url: "https://freetoolonline.com/games/seasonal-witchcat.html", include: !1, tags: "games" },`],
);

patch(
  join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'),
  [`                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/herd-cats-home.html'>Herd Cats Home (Cat Herding)</a>`, `                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/herd-cats-home.html'>Herd Cats Home (Cat Herding)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/seasonal-witchcat.html'>Seasonal Witchcat (Season Adventure)</a>`],
);

const cfPath = join(FRONTEND, 'seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js');
let cf = readFileSync(cfPath, 'utf8');
if (!cf.includes('seasonal-witchcat')) {
  cf = cf.replace(
    `  "/herd-cats-home.html": "/games/herd-cats-home.html"`,
    `  "/herd-cats-home.html": "/games/herd-cats-home.html",\n  "/seasonal-witchcat.html": "/games/seasonal-witchcat.html"`,
  );
  writeFileSync(cfPath, cf, 'utf8');
  console.log('patched cloudfront 301');
}

console.log('fire140 registry patch complete');
