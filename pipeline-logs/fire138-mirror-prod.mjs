#!/usr/bin/env node
/** fire138: mirror cat-hop-cloud bundle from staging to prod (seo-boost) */
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

walkCopy('source/static/src/main/webapp/resources/view/CMS', (r) => /cathopcloud/i.test(r));
walkCopy('source/web/src/main/webapp/WEB-INF/jsp', (r) => /cat-hop-cloud/i.test(r));
copyTree(
  join(STAGING, 'source/web/src/main/webapp/static/games/cat-hop-cloud'),
  join(PROD, 'source/web/src/main/webapp/static/games/cat-hop-cloud'),
);
cpSync(
  join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram/cathopcloud__e2b7c4f1.svg'),
  join(PROD, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram/cathopcloud__e2b7c4f1.svg'),
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
  'scripts/site-data.mjs',
  [`  '/guides/de/mystic-card-paw-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/mystic-card-paw-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire16`],
  [`  '/mystic-card-paw.html': '/games/mystic-card-paw.html',\n\n  '/gravity-orbit-golf.html'`, `  '/mystic-card-paw.html': '/games/mystic-card-paw.html',\n  '/cat-hop-cloud.html': '/games/cat-hop-cloud.html',\n\n  '/gravity-orbit-golf.html'`],
  [`  '/guides/de/mystic-card-paw-vs-alternatives.html': 'guide/de/mystic-card-paw-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/mystic-card-paw-vs-alternatives.html': 'guide/de/mystic-card-paw-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire16`],
  [`  '/games/mystic-card-paw.html': 'games/mystic-card-paw.jsp',\n  '/games/asteroid-blaster.html'`, `  '/games/mystic-card-paw.html': 'games/mystic-card-paw.jsp',\n  '/games/cat-hop-cloud.html': 'games/cat-hop-cloud.jsp',\n  '/games/asteroid-blaster.html'`],
);

patch('scripts/seo-clusters.mjs', [`'/games/mystic-card-paw.html']`, `'/games/mystic-card-paw.html', '/games/cat-hop-cloud.html']`]);

patch(
  'source/web/src/main/webapp/static/script/related-tools.js',
  [`    { title: "Mystic Card Paw", url: "https://freetoolonline.com/games/mystic-card-paw.html", include: !1, tags: "games" },`, `    { title: "Mystic Card Paw", url: "https://freetoolonline.com/games/mystic-card-paw.html", include: !1, tags: "games" },\n    { title: "Cat Hop Cloud", url: "https://freetoolonline.com/games/cat-hop-cloud.html", include: !1, tags: "games" },`],
);

patch(
  'source/static/src/main/webapp/resources/view/l-menu.html',
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

console.log('fire138 prod mirror patch complete');
