#!/usr/bin/env node
/** fire134: mirror potion-brew-shop bundle from staging to prod (seo-boost) */
import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const STAGING = ROOT;
const PROD = join(ROOT, '..', 'freetoolonline-web');
const FRONTEND = join(ROOT, '..');

function copyTree(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const s = join(src, name);
    const d = join(dest, name);
    if (statSync(s).isDirectory()) copyTree(s, d);
    else cpSync(s, d);
  }
}

function walkCopy(base, filter) {
  const srcBase = join(STAGING, base);
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (filter(relative(srcBase, full))) {
        const rel = relative(STAGING, full);
        const dest = join(PROD, rel);
        mkdirSync(dirname(dest), { recursive: true });
        cpSync(full, dest);
      }
    }
  }
  walk(srcBase);
}

walkCopy('source/static/src/main/webapp/resources/view/CMS', (r) => /potionbrewshop/i.test(r));
walkCopy('source/web/src/main/webapp/WEB-INF/jsp', (r) => /potion-brew-shop/i.test(r));
copyTree(
  join(STAGING, 'source/web/src/main/webapp/static/games/potion-brew-shop'),
  join(PROD, 'source/web/src/main/webapp/static/games/potion-brew-shop'),
);
cpSync(
  join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram/potionbrewshop__c7e2a4f9.svg'),
  join(PROD, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram/potionbrewshop__c7e2a4f9.svg'),
);

function patch(file, ...replacements) {
  const p = join(PROD, file);
  let s = readFileSync(p, 'utf8');
  for (const [from, to] of replacements) {
    if (!s.includes(from)) throw new Error(`patch miss in ${file}: ${from.slice(0, 80)}...`);
    s = s.replace(from, to);
  }
  writeFileSync(p, s, 'utf8');
  console.log('patched prod', file);
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

patch('scripts/site-data.mjs',
  [`  '/guides/de/ritual-catacombs-vs-alternatives.html': 'guide/de/ritual-catacombs-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/ritual-catacombs-vs-alternatives.html': 'guide/de/ritual-catacombs-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire16`],
  [`  '/guides/de/ritual-catacombs-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/ritual-catacombs-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire16`],
  [`  '/ritual-catacombs.html': '/games/ritual-catacombs.html',\n\n  '/gravity-orbit-golf.html'`, `  '/ritual-catacombs.html': '/games/ritual-catacombs.html',\n  '/potion-brew-shop.html': '/games/potion-brew-shop.html',\n\n  '/gravity-orbit-golf.html'`],
  [`  '/games/ritual-catacombs.html': 'games/ritual-catacombs.jsp',\n  '/games/asteroid-blaster.html'`, `  '/games/ritual-catacombs.html': 'games/ritual-catacombs.jsp',\n  '/games/potion-brew-shop.html': 'games/potion-brew-shop.jsp',\n  '/games/asteroid-blaster.html'`],
);

patch('scripts/seo-clusters.mjs', [`'/games/ritual-catacombs.html']`, `'/games/ritual-catacombs.html', '/games/potion-brew-shop.html']`]);

const prodClusters = readFileSync(join(PROD, 'scripts/seo-clusters.mjs'), 'utf8');
let parked = prodClusters;
for (const dino of ['ichthyosaurus', 'edmontosaurus']) {
  const re = new RegExp(`, '/dinosaur-3d/${dino}.html'`);
  if (re.test(parked)) {
    parked = parked.replace(re, '');
    console.log(`parked ${dino} from prod dinosaur seo-clusters (MODEL-FIRST)`);
  }
}
if (parked !== prodClusters) {
  writeFileSync(join(PROD, 'scripts/seo-clusters.mjs'), parked, 'utf8');
}

patch('source/web/src/main/webapp/static/script/related-tools.js',
  [`    { title: "Ritual Catacombs", url: "https://freetoolonline.com/games/ritual-catacombs.html", include: !1, tags: "games" },`, `    { title: "Ritual Catacombs", url: "https://freetoolonline.com/games/ritual-catacombs.html", include: !1, tags: "games" },\n    { title: "Potion Brew Shop", url: "https://freetoolonline.com/games/potion-brew-shop.html", include: !1, tags: "games" },`],
);

const lmenu = readFileSync(join(PROD, 'source/static/src/main/webapp/resources/view/l-menu.html'), 'utf8');
if (!lmenu.includes('potion-brew-shop.html')) {
  patch('source/static/src/main/webapp/resources/view/l-menu.html',
    [`                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/ritual-catacombs.html'>Ritual Catacombs (Horror FPS)</a>`, `                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/ritual-catacombs.html'>Ritual Catacombs (Horror FPS)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/potion-brew-shop.html'>Potion Brew Shop (Click Puzzle)</a>`],
  );
}

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

console.log('fire134 prod mirror files ready');
