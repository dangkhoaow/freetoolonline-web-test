#!/usr/bin/env node
/** fire146: patch registries for mor-chess-2 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FRONTEND = join(ROOT, '..');

function patch(file, ...replacements) {
  let s = readFileSync(file, 'utf8');
  if (s.includes('/games/mor-chess-2.html')) {
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
  // game-discovery-loop-runbook fire146 (2026-07-18): mor-chess-2 companion guides
  '/guides/how-to-play-mor-chess-2.html',
  '/guides/mor-chess-2-when.html',
  '/guides/mor-chess-2-vs-alternatives.html',
  '/guides/pt/how-to-play-mor-chess-2.html',
  '/guides/pt/mor-chess-2-when.html',
  '/guides/pt/mor-chess-2-vs-alternatives.html',
  '/guides/es/how-to-play-mor-chess-2.html',
  '/guides/es/mor-chess-2-when.html',
  '/guides/es/mor-chess-2-vs-alternatives.html',
  '/guides/vi/how-to-play-mor-chess-2.html',
  '/guides/vi/mor-chess-2-when.html',
  '/guides/vi/mor-chess-2-vs-alternatives.html',
  '/guides/id/how-to-play-mor-chess-2.html',
  '/guides/id/mor-chess-2-when.html',
  '/guides/id/mor-chess-2-vs-alternatives.html',
  '/guides/de/how-to-play-mor-chess-2.html',
  '/guides/de/mor-chess-2-when.html',
  '/guides/de/mor-chess-2-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire146 (2026-07-18): mor-chess-2 companion guides
  '/guides/how-to-play-mor-chess-2.html': 'guide/how-to-play-mor-chess-2.jsp',
  '/guides/mor-chess-2-when.html': 'guide/mor-chess-2-when.jsp',
  '/guides/mor-chess-2-vs-alternatives.html': 'guide/mor-chess-2-vs-alternatives.jsp',
  '/guides/pt/how-to-play-mor-chess-2.html': 'guide/pt/how-to-play-mor-chess-2.jsp',
  '/guides/pt/mor-chess-2-when.html': 'guide/pt/mor-chess-2-when.jsp',
  '/guides/pt/mor-chess-2-vs-alternatives.html': 'guide/pt/mor-chess-2-vs-alternatives.jsp',
  '/guides/es/how-to-play-mor-chess-2.html': 'guide/es/how-to-play-mor-chess-2.jsp',
  '/guides/es/mor-chess-2-when.html': 'guide/es/mor-chess-2-when.jsp',
  '/guides/es/mor-chess-2-vs-alternatives.html': 'guide/es/mor-chess-2-vs-alternatives.jsp',
  '/guides/vi/how-to-play-mor-chess-2.html': 'guide/vi/how-to-play-mor-chess-2.jsp',
  '/guides/vi/mor-chess-2-when.html': 'guide/vi/mor-chess-2-when.jsp',
  '/guides/vi/mor-chess-2-vs-alternatives.html': 'guide/vi/mor-chess-2-vs-alternatives.jsp',
  '/guides/id/how-to-play-mor-chess-2.html': 'guide/id/how-to-play-mor-chess-2.jsp',
  '/guides/id/mor-chess-2-when.html': 'guide/id/mor-chess-2-when.jsp',
  '/guides/id/mor-chess-2-vs-alternatives.html': 'guide/id/mor-chess-2-vs-alternatives.jsp',
  '/guides/de/how-to-play-mor-chess-2.html': 'guide/de/how-to-play-mor-chess-2.jsp',
  '/guides/de/mor-chess-2-when.html': 'guide/de/mor-chess-2-when.jsp',
  '/guides/de/mor-chess-2-vs-alternatives.html': 'guide/de/mor-chess-2-vs-alternatives.jsp',
`;

// Single-line anchors only (fire143 lesson: paired before/after context breaks
// when a sibling insertion lands between the two anchor lines).
patch(
  join(ROOT, 'scripts/site-data.mjs'),
  [`  '/guides/de/darkline-paws-vs-alternatives.html',\n`, `  '/guides/de/darkline-paws-vs-alternatives.html',\n${guideRoutes}`],
  [`  '/darkline-paws.html': '/games/darkline-paws.html',\n`, `  '/darkline-paws.html': '/games/darkline-paws.html',\n  '/mor-chess-2.html': '/games/mor-chess-2.html',\n`],
  [`  '/guides/de/darkline-paws-vs-alternatives.html': 'guide/de/darkline-paws-vs-alternatives.jsp',\n`, `  '/guides/de/darkline-paws-vs-alternatives.html': 'guide/de/darkline-paws-vs-alternatives.jsp',\n${guideJsp}`],
  [`  '/games/darkline-paws.html': 'games/darkline-paws.jsp',\n`, `  '/games/darkline-paws.html': 'games/darkline-paws.jsp',\n  '/games/mor-chess-2.html': 'games/mor-chess-2.jsp',\n`],
);

// games cluster array tail drifts as sibling fires land - match whatever the
// CURRENT last element is rather than a fixed slug.
{
  const p = join(ROOT, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/mor-chess-2.html')) {
    console.log('already patched', p);
  } else {
    const m = s.match(/'\/games\/[a-z0-9-]+\.html'\]/);
    if (!m) throw new Error('seo-clusters.mjs: could not find games array tail');
    s = s.replace(m[0], `${m[0].slice(0, -1)}, '/games/mor-chess-2.html']`);
    writeFileSync(p, s, 'utf8');
    console.log('patched', p, '(tail was', m[0], ')');
  }
}

patch(
  join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'),
  [
    `{ title: "DarkLine Paws", url: "https://freetoolonline.com/games/darkline-paws.html", include: !1, tags: "games" },`,
    `{ title: "DarkLine Paws", url: "https://freetoolonline.com/games/darkline-paws.html", include: !1, tags: "games" },\n    { title: "Mor Chess 2", url: "https://freetoolonline.com/games/mor-chess-2.html", include: !1, tags: "games" },`,
  ],
);

patch(
  join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'),
  [
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/darkline-paws.html'>DarkLine Paws (3-in-1 Bundle)</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/darkline-paws.html'>DarkLine Paws (3-in-1 Bundle)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/mor-chess-2.html'>Mor Chess 2 (Positional Puzzle)</a>`,
  ],
);

const cfPath = join(FRONTEND, 'seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js');
let cf = readFileSync(cfPath, 'utf8');
if (!cf.includes('mor-chess-2')) {
  cf = cf.replace(
    `  "/darkline-paws.html": "/games/darkline-paws.html"`,
    `  "/darkline-paws.html": "/games/darkline-paws.html",\n  "/mor-chess-2.html": "/games/mor-chess-2.html"`,
  );
  writeFileSync(cfPath, cf, 'utf8');
  console.log('patched cloudfront 301');
} else {
  console.log('cloudfront 301 already patched');
}

console.log('fire146 registry patch complete');
