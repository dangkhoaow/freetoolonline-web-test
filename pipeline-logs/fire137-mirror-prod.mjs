#!/usr/bin/env node
/** fire137: mirror mystic-card-paw bundle from staging to prod (seo-boost) */
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

walkCopy('source/static/src/main/webapp/resources/view/CMS', (r) => /mysticcardpaw/i.test(r));
walkCopy('source/web/src/main/webapp/WEB-INF/jsp', (r) => /mystic-card-paw/i.test(r));
copyTree(
  join(STAGING, 'source/web/src/main/webapp/static/games/mystic-card-paw'),
  join(PROD, 'source/web/src/main/webapp/static/games/mystic-card-paw'),
);
cpSync(
  join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram/mysticcardpaw__b4e7c2a8.svg'),
  join(PROD, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram/mysticcardpaw__b4e7c2a8.svg'),
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
  'scripts/site-data.mjs',
  [`  '/guides/de/unlucky-crossing-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/unlucky-crossing-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire16`],
  [`  '/unlucky-crossing.html': '/games/unlucky-crossing.html',\n\n  '/gravity-orbit-golf.html'`, `  '/unlucky-crossing.html': '/games/unlucky-crossing.html',\n  '/mystic-card-paw.html': '/games/mystic-card-paw.html',\n\n  '/gravity-orbit-golf.html'`],
  [`  '/guides/de/unlucky-crossing-vs-alternatives.html': 'guide/de/unlucky-crossing-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/unlucky-crossing-vs-alternatives.html': 'guide/de/unlucky-crossing-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire16`],
  [`  '/games/unlucky-crossing.html': 'games/unlucky-crossing.jsp',\n  '/games/asteroid-blaster.html'`, `  '/games/unlucky-crossing.html': 'games/unlucky-crossing.jsp',\n  '/games/mystic-card-paw.html': 'games/mystic-card-paw.jsp',\n  '/games/asteroid-blaster.html'`],
);

patch('scripts/seo-clusters.mjs', [`'/games/unlucky-crossing.html']`, `'/games/unlucky-crossing.html', '/games/mystic-card-paw.html']`]);

patch(
  'source/web/src/main/webapp/static/script/related-tools.js',
  [`    { title: "Unlucky Crossing", url: "https://freetoolonline.com/games/unlucky-crossing.html", include: !1, tags: "games" },`, `    { title: "Unlucky Crossing", url: "https://freetoolonline.com/games/unlucky-crossing.html", include: !1, tags: "games" },\n    { title: "Mystic Card Paw", url: "https://freetoolonline.com/games/mystic-card-paw.html", include: !1, tags: "games" },`],
);

patch(
  'source/static/src/main/webapp/resources/view/l-menu.html',
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

console.log('fire137 prod mirror patch complete');
