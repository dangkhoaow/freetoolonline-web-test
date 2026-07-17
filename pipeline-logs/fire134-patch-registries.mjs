#!/usr/bin/env node
/** fire134: patch site-data, seo-clusters, related-tools, l-menu, cloudfront 301 */
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
  // game-discovery-loop-runbook fire134 (2026-07-18): potion-brew-shop companion guides
  '/guides/how-to-play-potion-brew-shop.html',
  '/guides/potion-brew-shop-when.html',
  '/guides/potion-brew-shop-vs-alternatives.html',
  '/guides/pt/how-to-play-potion-brew-shop.html',
  '/guides/pt/potion-brew-shop-when.html',
  '/guides/pt/potion-brew-shop-vs-alternatives.html',
  '/guides/es/how-to-play-potion-brew-shop.html',
  '/guides/es/potion-brew-shop-when.html',
  '/guides/es/potion-brew-shop-vs-alternatives.html',
  '/guides/vi/how-to-play-potion-brew-shop.html',
  '/guides/vi/potion-brew-shop-when.html',
  '/guides/vi/potion-brew-shop-vs-alternatives.html',
  '/guides/id/how-to-play-potion-brew-shop.html',
  '/guides/id/potion-brew-shop-when.html',
  '/guides/id/potion-brew-shop-vs-alternatives.html',
  '/guides/de/how-to-play-potion-brew-shop.html',
  '/guides/de/potion-brew-shop-when.html',
  '/guides/de/potion-brew-shop-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire134 (2026-07-18): potion-brew-shop companion guides
  '/guides/how-to-play-potion-brew-shop.html': 'guide/how-to-play-potion-brew-shop.jsp',
  '/guides/potion-brew-shop-when.html': 'guide/potion-brew-shop-when.jsp',
  '/guides/potion-brew-shop-vs-alternatives.html': 'guide/potion-brew-shop-vs-alternatives.jsp',
  '/guides/pt/how-to-play-potion-brew-shop.html': 'guide/pt/how-to-play-potion-brew-shop.jsp',
  '/guides/pt/potion-brew-shop-when.html': 'guide/pt/potion-brew-shop-when.jsp',
  '/guides/pt/potion-brew-shop-vs-alternatives.html': 'guide/pt/potion-brew-shop-vs-alternatives.jsp',
  '/guides/es/how-to-play-potion-brew-shop.html': 'guide/es/how-to-play-potion-brew-shop.jsp',
  '/guides/es/potion-brew-shop-when.html': 'guide/es/potion-brew-shop-when.jsp',
  '/guides/es/potion-brew-shop-vs-alternatives.html': 'guide/es/potion-brew-shop-vs-alternatives.jsp',
  '/guides/vi/how-to-play-potion-brew-shop.html': 'guide/vi/how-to-play-potion-brew-shop.jsp',
  '/guides/vi/potion-brew-shop-when.html': 'guide/vi/potion-brew-shop-when.jsp',
  '/guides/vi/potion-brew-shop-vs-alternatives.html': 'guide/vi/potion-brew-shop-vs-alternatives.jsp',
  '/guides/id/how-to-play-potion-brew-shop.html': 'guide/id/how-to-play-potion-brew-shop.jsp',
  '/guides/id/potion-brew-shop-when.html': 'guide/id/potion-brew-shop-when.jsp',
  '/guides/id/potion-brew-shop-vs-alternatives.html': 'guide/id/potion-brew-shop-vs-alternatives.jsp',
  '/guides/de/how-to-play-potion-brew-shop.html': 'guide/de/how-to-play-potion-brew-shop.jsp',
  '/guides/de/potion-brew-shop-when.html': 'guide/de/potion-brew-shop-when.jsp',
  '/guides/de/potion-brew-shop-vs-alternatives.html': 'guide/de/potion-brew-shop-vs-alternatives.jsp',
`;

patch(
  join(ROOT, 'scripts/site-data.mjs'),
  [`  '/guides/de/ritual-catacombs-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/ritual-catacombs-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire16`],
  [`  '/ritual-catacombs.html': '/games/ritual-catacombs.html',\n\n  '/gravity-orbit-golf.html'`, `  '/ritual-catacombs.html': '/games/ritual-catacombs.html',\n  '/potion-brew-shop.html': '/games/potion-brew-shop.html',\n\n  '/gravity-orbit-golf.html'`],
  [`  '/guides/de/ritual-catacombs-vs-alternatives.html': 'guide/de/ritual-catacombs-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/ritual-catacombs-vs-alternatives.html': 'guide/de/ritual-catacombs-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire16`],
  [`  '/games/ritual-catacombs.html': 'games/ritual-catacombs.jsp',\n  '/games/asteroid-blaster.html'`, `  '/games/ritual-catacombs.html': 'games/ritual-catacombs.jsp',\n  '/games/potion-brew-shop.html': 'games/potion-brew-shop.jsp',\n  '/games/asteroid-blaster.html'`],
);

patch(
  join(ROOT, 'scripts/seo-clusters.mjs'),
  [`'/games/ritual-catacombs.html']`, `'/games/ritual-catacombs.html', '/games/potion-brew-shop.html']`],
);

patch(
  join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'),
  [`    { title: "Ritual Catacombs", url: "https://freetoolonline.com/games/ritual-catacombs.html", include: !1, tags: "games" },`, `    { title: "Ritual Catacombs", url: "https://freetoolonline.com/games/ritual-catacombs.html", include: !1, tags: "games" },\n    { title: "Potion Brew Shop", url: "https://freetoolonline.com/games/potion-brew-shop.html", include: !1, tags: "games" },`],
);

patch(
  join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'),
  [`                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/ritual-catacombs.html'>Ritual Catacombs (Horror FPS)</a>`, `                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/ritual-catacombs.html'>Ritual Catacombs (Horror FPS)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/potion-brew-shop.html'>Potion Brew Shop (Click Puzzle)</a>`],
);

const cfPath = join(FRONTEND, 'seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js');
let cf = readFileSync(cfPath, 'utf8');
if (!cf.includes('potion-brew-shop')) {
  cf = cf.replace(
    `  "/ritual-catacombs.html": "/games/ritual-catacombs.html"`,
    `  "/ritual-catacombs.html": "/games/ritual-catacombs.html",\n  "/potion-brew-shop.html": "/games/potion-brew-shop.html"`,
  );
  writeFileSync(cfPath, cf, 'utf8');
  console.log('patched cloudfront 301');
}

console.log('fire134 registry patch complete');
