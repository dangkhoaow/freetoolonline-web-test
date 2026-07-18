#!/usr/bin/env node
/** fire139: mirror herd-cats-home bundle from staging to prod (seo-boost) */
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

walkCopy('source/static/src/main/webapp/resources/view/CMS', (r) => /herdcats/i.test(r));
walkCopy('source/web/src/main/webapp/WEB-INF/jsp', (r) => /herd-cats-home/i.test(r));
copyTree(
  join(STAGING, 'source/web/src/main/webapp/static/games/herd-cats-home'),
  join(PROD, 'source/web/src/main/webapp/static/games/herd-cats-home'),
);
cpSync(
  join(STAGING, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram/herdcatshome__f1a8c3d2.svg'),
  join(PROD, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram/herdcatshome__f1a8c3d2.svg'),
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
  // game-discovery-loop-runbook fire139 (2026-07-18): herd-cats-home companion guides
  '/guides/how-to-play-herd-cats-home.html',
  '/guides/herd-cats-home-when.html',
  '/guides/herd-cats-home-vs-alternatives.html',
  '/guides/pt/how-to-play-herd-cats-home.html',
  '/guides/pt/herd-cats-home-when.html',
  '/guides/pt/herd-cats-home-vs-alternatives.html',
  '/guides/es/how-to-play-herd-cats-home.html',
  '/guides/es/herd-cats-home-when.html',
  '/guides/es/herd-cats-home-vs-alternatives.html',
  '/guides/vi/how-to-play-herd-cats-home.html',
  '/guides/vi/herd-cats-home-when.html',
  '/guides/vi/herd-cats-home-vs-alternatives.html',
  '/guides/id/how-to-play-herd-cats-home.html',
  '/guides/id/herd-cats-home-when.html',
  '/guides/id/herd-cats-home-vs-alternatives.html',
  '/guides/de/how-to-play-herd-cats-home.html',
  '/guides/de/herd-cats-home-when.html',
  '/guides/de/herd-cats-home-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire139 (2026-07-18): herd-cats-home companion guides
  '/guides/how-to-play-herd-cats-home.html': 'guide/how-to-play-herd-cats-home.jsp',
  '/guides/herd-cats-home-when.html': 'guide/herd-cats-home-when.jsp',
  '/guides/herd-cats-home-vs-alternatives.html': 'guide/herd-cats-home-vs-alternatives.jsp',
  '/guides/pt/how-to-play-herd-cats-home.html': 'guide/pt/how-to-play-herd-cats-home.jsp',
  '/guides/pt/herd-cats-home-when.html': 'guide/pt/herd-cats-home-when.jsp',
  '/guides/pt/herd-cats-home-vs-alternatives.html': 'guide/pt/herd-cats-home-vs-alternatives.jsp',
  '/guides/es/how-to-play-herd-cats-home.html': 'guide/es/how-to-play-herd-cats-home.jsp',
  '/guides/es/herd-cats-home-when.html': 'guide/es/herd-cats-home-when.jsp',
  '/guides/es/herd-cats-home-vs-alternatives.html': 'guide/es/herd-cats-home-vs-alternatives.jsp',
  '/guides/vi/how-to-play-herd-cats-home.html': 'guide/vi/how-to-play-herd-cats-home.jsp',
  '/guides/vi/herd-cats-home-when.html': 'guide/vi/herd-cats-home-when.jsp',
  '/guides/vi/herd-cats-home-vs-alternatives.html': 'guide/vi/herd-cats-home-vs-alternatives.jsp',
  '/guides/id/how-to-play-herd-cats-home.html': 'guide/id/how-to-play-herd-cats-home.jsp',
  '/guides/id/herd-cats-home-when.html': 'guide/id/herd-cats-home-when.jsp',
  '/guides/id/herd-cats-home-vs-alternatives.html': 'guide/id/herd-cats-home-vs-alternatives.jsp',
  '/guides/de/how-to-play-herd-cats-home.html': 'guide/de/how-to-play-herd-cats-home.jsp',
  '/guides/de/herd-cats-home-when.html': 'guide/de/herd-cats-home-when.jsp',
  '/guides/de/herd-cats-home-vs-alternatives.html': 'guide/de/herd-cats-home-vs-alternatives.jsp',
`;

patch(
  'scripts/site-data.mjs',
  [`  '/guides/de/cat-hop-cloud-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/cat-hop-cloud-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire16`],
  [`  '/cat-hop-cloud.html': '/games/cat-hop-cloud.html',\n\n  '/gravity-orbit-golf.html'`, `  '/cat-hop-cloud.html': '/games/cat-hop-cloud.html',\n  '/herd-cats-home.html': '/games/herd-cats-home.html',\n\n  '/gravity-orbit-golf.html'`],
  [`  '/guides/de/cat-hop-cloud-vs-alternatives.html': 'guide/de/cat-hop-cloud-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/cat-hop-cloud-vs-alternatives.html': 'guide/de/cat-hop-cloud-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire16`],
  [`  '/games/cat-hop-cloud.html': 'games/cat-hop-cloud.jsp',\n  '/games/asteroid-blaster.html'`, `  '/games/cat-hop-cloud.html': 'games/cat-hop-cloud.jsp',\n  '/games/herd-cats-home.html': 'games/herd-cats-home.jsp',\n  '/games/asteroid-blaster.html'`],
);

patch('scripts/seo-clusters.mjs', [`'/games/cat-hop-cloud.html']`, `'/games/cat-hop-cloud.html', '/games/herd-cats-home.html']`]);

patch(
  'source/web/src/main/webapp/static/script/related-tools.js',
  [`    { title: "Cat Hop Cloud", url: "https://freetoolonline.com/games/cat-hop-cloud.html", include: !1, tags: "games" },`, `    { title: "Cat Hop Cloud", url: "https://freetoolonline.com/games/cat-hop-cloud.html", include: !1, tags: "games" },\n    { title: "Herd Cats Home", url: "https://freetoolonline.com/games/herd-cats-home.html", include: !1, tags: "games" },`],
);

patch(
  'source/static/src/main/webapp/resources/view/l-menu.html',
  [`                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/cat-hop-cloud.html'>Cat Hop Cloud (Luck Puzzle)</a>`, `                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/cat-hop-cloud.html'>Cat Hop Cloud (Luck Puzzle)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/herd-cats-home.html'>Herd Cats Home (Cat Herding)</a>`],
);

const cfPath = join(FRONTEND, 'seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js');
let cf = readFileSync(cfPath, 'utf8');
if (!cf.includes('herd-cats-home')) {
  cf = cf.replace(
    `  "/cat-hop-cloud.html": "/games/cat-hop-cloud.html"`,
    `  "/cat-hop-cloud.html": "/games/cat-hop-cloud.html",\n  "/herd-cats-home.html": "/games/herd-cats-home.html"`,
  );
  writeFileSync(cfPath, cf, 'utf8');
  console.log('patched cloudfront 301');
}

console.log('fire139 prod mirror patch complete');
