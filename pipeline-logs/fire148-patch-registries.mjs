#!/usr/bin/env node
/** fire148: patch registries for machine-guard-corps */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FRONTEND = join(ROOT, '..');

function patch(file, ...replacements) {
  let s = readFileSync(file, 'utf8');
  if (s.includes('/games/machine-guard-corps.html')) {
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
  // game-discovery-loop-runbook fire148 (2026-07-18): machine-guard-corps companion guides
  '/guides/how-to-play-machine-guard-corps.html',
  '/guides/machine-guard-corps-when.html',
  '/guides/machine-guard-corps-vs-alternatives.html',
  '/guides/pt/how-to-play-machine-guard-corps.html',
  '/guides/pt/machine-guard-corps-when.html',
  '/guides/pt/machine-guard-corps-vs-alternatives.html',
  '/guides/es/how-to-play-machine-guard-corps.html',
  '/guides/es/machine-guard-corps-when.html',
  '/guides/es/machine-guard-corps-vs-alternatives.html',
  '/guides/vi/how-to-play-machine-guard-corps.html',
  '/guides/vi/machine-guard-corps-when.html',
  '/guides/vi/machine-guard-corps-vs-alternatives.html',
  '/guides/id/how-to-play-machine-guard-corps.html',
  '/guides/id/machine-guard-corps-when.html',
  '/guides/id/machine-guard-corps-vs-alternatives.html',
  '/guides/de/how-to-play-machine-guard-corps.html',
  '/guides/de/machine-guard-corps-when.html',
  '/guides/de/machine-guard-corps-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire148 (2026-07-18): machine-guard-corps companion guides
  '/guides/how-to-play-machine-guard-corps.html': 'guide/how-to-play-machine-guard-corps.jsp',
  '/guides/machine-guard-corps-when.html': 'guide/machine-guard-corps-when.jsp',
  '/guides/machine-guard-corps-vs-alternatives.html': 'guide/machine-guard-corps-vs-alternatives.jsp',
  '/guides/pt/how-to-play-machine-guard-corps.html': 'guide/pt/how-to-play-machine-guard-corps.jsp',
  '/guides/pt/machine-guard-corps-when.html': 'guide/pt/machine-guard-corps-when.jsp',
  '/guides/pt/machine-guard-corps-vs-alternatives.html': 'guide/pt/machine-guard-corps-vs-alternatives.jsp',
  '/guides/es/how-to-play-machine-guard-corps.html': 'guide/es/how-to-play-machine-guard-corps.jsp',
  '/guides/es/machine-guard-corps-when.html': 'guide/es/machine-guard-corps-when.jsp',
  '/guides/es/machine-guard-corps-vs-alternatives.html': 'guide/es/machine-guard-corps-vs-alternatives.jsp',
  '/guides/vi/how-to-play-machine-guard-corps.html': 'guide/vi/how-to-play-machine-guard-corps.jsp',
  '/guides/vi/machine-guard-corps-when.html': 'guide/vi/machine-guard-corps-when.jsp',
  '/guides/vi/machine-guard-corps-vs-alternatives.html': 'guide/vi/machine-guard-corps-vs-alternatives.jsp',
  '/guides/id/how-to-play-machine-guard-corps.html': 'guide/id/how-to-play-machine-guard-corps.jsp',
  '/guides/id/machine-guard-corps-when.html': 'guide/id/machine-guard-corps-when.jsp',
  '/guides/id/machine-guard-corps-vs-alternatives.html': 'guide/id/machine-guard-corps-vs-alternatives.jsp',
  '/guides/de/how-to-play-machine-guard-corps.html': 'guide/de/how-to-play-machine-guard-corps.jsp',
  '/guides/de/machine-guard-corps-when.html': 'guide/de/machine-guard-corps-when.jsp',
  '/guides/de/machine-guard-corps-vs-alternatives.html': 'guide/de/machine-guard-corps-vs-alternatives.jsp',
`;

// Single-line anchors only (fire143 lesson: paired before/after context breaks
// when a sibling insertion lands between the two anchor lines).
patch(
  join(ROOT, 'scripts/site-data.mjs'),
  [`  '/guides/de/black-cat-hot-tin-roof-vs-alternatives.html',\n`, `  '/guides/de/black-cat-hot-tin-roof-vs-alternatives.html',\n${guideRoutes}`],
  [`  '/black-cat-hot-tin-roof.html': '/games/black-cat-hot-tin-roof.html',\n`, `  '/black-cat-hot-tin-roof.html': '/games/black-cat-hot-tin-roof.html',\n  '/machine-guard-corps.html': '/games/machine-guard-corps.html',\n`],
  [`  '/guides/de/black-cat-hot-tin-roof-vs-alternatives.html': 'guide/de/black-cat-hot-tin-roof-vs-alternatives.jsp',\n`, `  '/guides/de/black-cat-hot-tin-roof-vs-alternatives.html': 'guide/de/black-cat-hot-tin-roof-vs-alternatives.jsp',\n${guideJsp}`],
  [`  '/games/black-cat-hot-tin-roof.html': 'games/black-cat-hot-tin-roof.jsp',\n`, `  '/games/black-cat-hot-tin-roof.html': 'games/black-cat-hot-tin-roof.jsp',\n  '/games/machine-guard-corps.html': 'games/machine-guard-corps.jsp',\n`],
);

// games cluster array tail drifts as sibling fires land - match whatever the
// CURRENT last element is rather than a fixed slug.
{
  const p = join(ROOT, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/machine-guard-corps.html')) {
    console.log('already patched', p);
  } else {
    const m = s.match(/'\/games\/[a-z0-9-]+\.html'\]/);
    if (!m) throw new Error('seo-clusters.mjs: could not find games array tail');
    s = s.replace(m[0], `${m[0].slice(0, -1)}, '/games/machine-guard-corps.html']`);
    writeFileSync(p, s, 'utf8');
    console.log('patched', p, '(tail was', m[0], ')');
  }
}

patch(
  join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'),
  [
    `{ title: "Black Cat on a Hot Tin Roof", url: "https://freetoolonline.com/games/black-cat-hot-tin-roof.html", include: !1, tags: "games" },`,
    `{ title: "Black Cat on a Hot Tin Roof", url: "https://freetoolonline.com/games/black-cat-hot-tin-roof.html", include: !1, tags: "games" },\n    { title: "Machine Guard Corps", url: "https://freetoolonline.com/games/machine-guard-corps.html", include: !1, tags: "games" },`,
  ],
);

patch(
  join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'),
  [
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/black-cat-hot-tin-roof.html'>Black Cat on a Hot Tin Roof (60s Runner)</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/black-cat-hot-tin-roof.html'>Black Cat on a Hot Tin Roof (60s Runner)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/machine-guard-corps.html'>Machine Guard Corps (Lane Defense)</a>`,
  ],
);

const cfPath = join(FRONTEND, 'seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js');
let cf = readFileSync(cfPath, 'utf8');
if (!cf.includes('machine-guard-corps')) {
  cf = cf.replace(
    `  "/black-cat-hot-tin-roof.html": "/games/black-cat-hot-tin-roof.html"`,
    `  "/black-cat-hot-tin-roof.html": "/games/black-cat-hot-tin-roof.html",\n  "/machine-guard-corps.html": "/games/machine-guard-corps.html"`,
  );
  writeFileSync(cfPath, cf, 'utf8');
  console.log('patched cloudfront 301');
} else {
  console.log('cloudfront 301 already patched');
}

console.log('fire148 registry patch complete');
