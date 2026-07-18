#!/usr/bin/env node
/** fire136: mirror unlucky-crossing bundle from staging to prod (seo-boost) */
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

walkCopy('source/static/src/main/webapp/resources/view/CMS', (r) => /unluckycrossing/i.test(r));
walkCopy('source/web/src/main/webapp/WEB-INF/jsp', (r) => /unlucky-crossing/i.test(r));
copyTree(
  join(STAGING, 'source/web/src/main/webapp/static/games/unlucky-crossing'),
  join(PROD, 'source/web/src/main/webapp/static/games/unlucky-crossing'),
);
cpSync(
  join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram/unluckycrossing__a9f3b2e1.svg'),
  join(PROD, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram/unluckycrossing__a9f3b2e1.svg'),
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
  // game-discovery-loop-runbook fire136 (2026-07-18): unlucky-crossing companion guides
  '/guides/how-to-play-unlucky-crossing.html',
  '/guides/unlucky-crossing-when.html',
  '/guides/unlucky-crossing-vs-alternatives.html',
  '/guides/pt/how-to-play-unlucky-crossing.html',
  '/guides/pt/unlucky-crossing-when.html',
  '/guides/pt/unlucky-crossing-vs-alternatives.html',
  '/guides/es/how-to-play-unlucky-crossing.html',
  '/guides/es/unlucky-crossing-when.html',
  '/guides/es/unlucky-crossing-vs-alternatives.html',
  '/guides/vi/how-to-play-unlucky-crossing.html',
  '/guides/vi/unlucky-crossing-when.html',
  '/guides/vi/unlucky-crossing-vs-alternatives.html',
  '/guides/id/how-to-play-unlucky-crossing.html',
  '/guides/id/unlucky-crossing-when.html',
  '/guides/id/unlucky-crossing-vs-alternatives.html',
  '/guides/de/how-to-play-unlucky-crossing.html',
  '/guides/de/unlucky-crossing-when.html',
  '/guides/de/unlucky-crossing-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire136 (2026-07-18): unlucky-crossing companion guides
  '/guides/how-to-play-unlucky-crossing.html': 'guide/how-to-play-unlucky-crossing.jsp',
  '/guides/unlucky-crossing-when.html': 'guide/unlucky-crossing-when.jsp',
  '/guides/unlucky-crossing-vs-alternatives.html': 'guide/unlucky-crossing-vs-alternatives.jsp',
  '/guides/pt/how-to-play-unlucky-crossing.html': 'guide/pt/how-to-play-unlucky-crossing.jsp',
  '/guides/pt/unlucky-crossing-when.html': 'guide/pt/unlucky-crossing-when.jsp',
  '/guides/pt/unlucky-crossing-vs-alternatives.html': 'guide/pt/unlucky-crossing-vs-alternatives.jsp',
  '/guides/es/how-to-play-unlucky-crossing.html': 'guide/es/how-to-play-unlucky-crossing.jsp',
  '/guides/es/unlucky-crossing-when.html': 'guide/es/unlucky-crossing-when.jsp',
  '/guides/es/unlucky-crossing-vs-alternatives.html': 'guide/es/unlucky-crossing-vs-alternatives.jsp',
  '/guides/vi/how-to-play-unlucky-crossing.html': 'guide/vi/how-to-play-unlucky-crossing.jsp',
  '/guides/vi/unlucky-crossing-when.html': 'guide/vi/unlucky-crossing-when.jsp',
  '/guides/vi/unlucky-crossing-vs-alternatives.html': 'guide/vi/unlucky-crossing-vs-alternatives.jsp',
  '/guides/id/how-to-play-unlucky-crossing.html': 'guide/id/how-to-play-unlucky-crossing.jsp',
  '/guides/id/unlucky-crossing-when.html': 'guide/id/unlucky-crossing-when.jsp',
  '/guides/id/unlucky-crossing-vs-alternatives.html': 'guide/id/unlucky-crossing-vs-alternatives.jsp',
  '/guides/de/how-to-play-unlucky-crossing.html': 'guide/de/how-to-play-unlucky-crossing.jsp',
  '/guides/de/unlucky-crossing-when.html': 'guide/de/unlucky-crossing-when.jsp',
  '/guides/de/unlucky-crossing-vs-alternatives.html': 'guide/de/unlucky-crossing-vs-alternatives.jsp',
`;

patch('scripts/site-data.mjs',
  [`  '/guides/de/cat-typing-race-vs-alternatives.html': 'guide/de/cat-typing-race-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/cat-typing-race-vs-alternatives.html': 'guide/de/cat-typing-race-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire16`],
  [`  '/guides/de/cat-typing-race-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/cat-typing-race-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire16`],
  [`  '/cat-typing-race.html': '/games/cat-typing-race.html',\n\n  '/gravity-orbit-golf.html'`, `  '/cat-typing-race.html': '/games/cat-typing-race.html',\n  '/unlucky-crossing.html': '/games/unlucky-crossing.html',\n\n  '/gravity-orbit-golf.html'`],
  [`  '/games/cat-typing-race.html': 'games/cat-typing-race.jsp',\n  '/games/asteroid-blaster.html'`, `  '/games/cat-typing-race.html': 'games/cat-typing-race.jsp',\n  '/games/unlucky-crossing.html': 'games/unlucky-crossing.jsp',\n  '/games/asteroid-blaster.html'`],
);

patch('scripts/seo-clusters.mjs', [`'/games/cat-typing-race.html']`, `'/games/cat-typing-race.html', '/games/unlucky-crossing.html']`]);

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
  [`    { title: "Cat Typing Race", url: "https://freetoolonline.com/games/cat-typing-race.html", include: !1, tags: "games" },`, `    { title: "Cat Typing Race", url: "https://freetoolonline.com/games/cat-typing-race.html", include: !1, tags: "games" },\n    { title: "Unlucky Crossing", url: "https://freetoolonline.com/games/unlucky-crossing.html", include: !1, tags: "games" },`],
);

const lmenu = readFileSync(join(PROD, 'source/static/src/main/webapp/resources/view/l-menu.html'), 'utf8');
if (!lmenu.includes('unlucky-crossing.html')) {
  patch('source/static/src/main/webapp/resources/view/l-menu.html',
    [`                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/cat-typing-race.html'>Cat Typing Race (Keyboard Duel)</a>`, `                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/cat-typing-race.html'>Cat Typing Race (Keyboard Duel)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/unlucky-crossing.html'>Unlucky Crossing (Street Cat)</a>`],
  );
}

const cfPath = join(FRONTEND, 'seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js');
let cf = readFileSync(cfPath, 'utf8');
if (!cf.includes('unlucky-crossing')) {
  cf = cf.replace(
    `  "/cat-typing-race.html": "/games/cat-typing-race.html"`,
    `  "/cat-typing-race.html": "/games/cat-typing-race.html",\n  "/unlucky-crossing.html": "/games/unlucky-crossing.html"`,
  );
  writeFileSync(cfPath, cf, 'utf8');
  console.log('patched cloudfront 301');
}

console.log('fire136 prod mirror files ready');
