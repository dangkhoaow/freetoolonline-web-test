#!/usr/bin/env node
/** fire147: patch registries for black-cat-hot-tin-roof */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FRONTEND = join(ROOT, '..');

function patch(file, ...replacements) {
  let s = readFileSync(file, 'utf8');
  if (s.includes('/games/black-cat-hot-tin-roof.html')) {
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
  // game-discovery-loop-runbook fire147 (2026-07-18): black-cat-hot-tin-roof companion guides
  '/guides/how-to-play-black-cat-hot-tin-roof.html',
  '/guides/black-cat-hot-tin-roof-when.html',
  '/guides/black-cat-hot-tin-roof-vs-alternatives.html',
  '/guides/pt/how-to-play-black-cat-hot-tin-roof.html',
  '/guides/pt/black-cat-hot-tin-roof-when.html',
  '/guides/pt/black-cat-hot-tin-roof-vs-alternatives.html',
  '/guides/es/how-to-play-black-cat-hot-tin-roof.html',
  '/guides/es/black-cat-hot-tin-roof-when.html',
  '/guides/es/black-cat-hot-tin-roof-vs-alternatives.html',
  '/guides/vi/how-to-play-black-cat-hot-tin-roof.html',
  '/guides/vi/black-cat-hot-tin-roof-when.html',
  '/guides/vi/black-cat-hot-tin-roof-vs-alternatives.html',
  '/guides/id/how-to-play-black-cat-hot-tin-roof.html',
  '/guides/id/black-cat-hot-tin-roof-when.html',
  '/guides/id/black-cat-hot-tin-roof-vs-alternatives.html',
  '/guides/de/how-to-play-black-cat-hot-tin-roof.html',
  '/guides/de/black-cat-hot-tin-roof-when.html',
  '/guides/de/black-cat-hot-tin-roof-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire147 (2026-07-18): black-cat-hot-tin-roof companion guides
  '/guides/how-to-play-black-cat-hot-tin-roof.html': 'guide/how-to-play-black-cat-hot-tin-roof.jsp',
  '/guides/black-cat-hot-tin-roof-when.html': 'guide/black-cat-hot-tin-roof-when.jsp',
  '/guides/black-cat-hot-tin-roof-vs-alternatives.html': 'guide/black-cat-hot-tin-roof-vs-alternatives.jsp',
  '/guides/pt/how-to-play-black-cat-hot-tin-roof.html': 'guide/pt/how-to-play-black-cat-hot-tin-roof.jsp',
  '/guides/pt/black-cat-hot-tin-roof-when.html': 'guide/pt/black-cat-hot-tin-roof-when.jsp',
  '/guides/pt/black-cat-hot-tin-roof-vs-alternatives.html': 'guide/pt/black-cat-hot-tin-roof-vs-alternatives.jsp',
  '/guides/es/how-to-play-black-cat-hot-tin-roof.html': 'guide/es/how-to-play-black-cat-hot-tin-roof.jsp',
  '/guides/es/black-cat-hot-tin-roof-when.html': 'guide/es/black-cat-hot-tin-roof-when.jsp',
  '/guides/es/black-cat-hot-tin-roof-vs-alternatives.html': 'guide/es/black-cat-hot-tin-roof-vs-alternatives.jsp',
  '/guides/vi/how-to-play-black-cat-hot-tin-roof.html': 'guide/vi/how-to-play-black-cat-hot-tin-roof.jsp',
  '/guides/vi/black-cat-hot-tin-roof-when.html': 'guide/vi/black-cat-hot-tin-roof-when.jsp',
  '/guides/vi/black-cat-hot-tin-roof-vs-alternatives.html': 'guide/vi/black-cat-hot-tin-roof-vs-alternatives.jsp',
  '/guides/id/how-to-play-black-cat-hot-tin-roof.html': 'guide/id/how-to-play-black-cat-hot-tin-roof.jsp',
  '/guides/id/black-cat-hot-tin-roof-when.html': 'guide/id/black-cat-hot-tin-roof-when.jsp',
  '/guides/id/black-cat-hot-tin-roof-vs-alternatives.html': 'guide/id/black-cat-hot-tin-roof-vs-alternatives.jsp',
  '/guides/de/how-to-play-black-cat-hot-tin-roof.html': 'guide/de/how-to-play-black-cat-hot-tin-roof.jsp',
  '/guides/de/black-cat-hot-tin-roof-when.html': 'guide/de/black-cat-hot-tin-roof-when.jsp',
  '/guides/de/black-cat-hot-tin-roof-vs-alternatives.html': 'guide/de/black-cat-hot-tin-roof-vs-alternatives.jsp',
`;

// Single-line anchors only (fire143 lesson: paired before/after context breaks
// when a sibling insertion lands between the two anchor lines).
patch(
  join(ROOT, 'scripts/site-data.mjs'),
  [`  '/guides/de/mor-chess-2-vs-alternatives.html',\n`, `  '/guides/de/mor-chess-2-vs-alternatives.html',\n${guideRoutes}`],
  [`  '/mor-chess-2.html': '/games/mor-chess-2.html',\n`, `  '/mor-chess-2.html': '/games/mor-chess-2.html',\n  '/black-cat-hot-tin-roof.html': '/games/black-cat-hot-tin-roof.html',\n`],
  [`  '/guides/de/mor-chess-2-vs-alternatives.html': 'guide/de/mor-chess-2-vs-alternatives.jsp',\n`, `  '/guides/de/mor-chess-2-vs-alternatives.html': 'guide/de/mor-chess-2-vs-alternatives.jsp',\n${guideJsp}`],
  [`  '/games/mor-chess-2.html': 'games/mor-chess-2.jsp',\n`, `  '/games/mor-chess-2.html': 'games/mor-chess-2.jsp',\n  '/games/black-cat-hot-tin-roof.html': 'games/black-cat-hot-tin-roof.jsp',\n`],
);

// games cluster array tail drifts as sibling fires land - match whatever the
// CURRENT last element is rather than a fixed slug.
{
  const p = join(ROOT, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/black-cat-hot-tin-roof.html')) {
    console.log('already patched', p);
  } else {
    const m = s.match(/'\/games\/[a-z0-9-]+\.html'\]/);
    if (!m) throw new Error('seo-clusters.mjs: could not find games array tail');
    s = s.replace(m[0], `${m[0].slice(0, -1)}, '/games/black-cat-hot-tin-roof.html']`);
    writeFileSync(p, s, 'utf8');
    console.log('patched', p, '(tail was', m[0], ')');
  }
}

patch(
  join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'),
  [
    `{ title: "Mor Chess 2", url: "https://freetoolonline.com/games/mor-chess-2.html", include: !1, tags: "games" },`,
    `{ title: "Mor Chess 2", url: "https://freetoolonline.com/games/mor-chess-2.html", include: !1, tags: "games" },\n    { title: "Black Cat on a Hot Tin Roof", url: "https://freetoolonline.com/games/black-cat-hot-tin-roof.html", include: !1, tags: "games" },`,
  ],
);

patch(
  join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'),
  [
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/mor-chess-2.html'>Mor Chess 2 (Positional Puzzle)</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/mor-chess-2.html'>Mor Chess 2 (Positional Puzzle)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/black-cat-hot-tin-roof.html'>Black Cat on a Hot Tin Roof (60s Runner)</a>`,
  ],
);

const cfPath = join(FRONTEND, 'seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js');
let cf = readFileSync(cfPath, 'utf8');
if (!cf.includes('black-cat-hot-tin-roof')) {
  cf = cf.replace(
    `  "/mor-chess-2.html": "/games/mor-chess-2.html"`,
    `  "/mor-chess-2.html": "/games/mor-chess-2.html",\n  "/black-cat-hot-tin-roof.html": "/games/black-cat-hot-tin-roof.html"`,
  );
  writeFileSync(cfPath, cf, 'utf8');
  console.log('patched cloudfront 301');
} else {
  console.log('cloudfront 301 already patched');
}

console.log('fire147 registry patch complete');
