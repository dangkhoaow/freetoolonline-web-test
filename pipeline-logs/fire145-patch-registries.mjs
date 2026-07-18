#!/usr/bin/env node
/** fire145: patch registries for darkline-paws */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FRONTEND = join(ROOT, '..');

function patch(file, ...replacements) {
  let s = readFileSync(file, 'utf8');
  if (s.includes('/games/darkline-paws.html')) {
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
  // game-discovery-loop-runbook fire145 (2026-07-18): darkline-paws companion guides
  '/guides/how-to-play-darkline-paws.html',
  '/guides/darkline-paws-when.html',
  '/guides/darkline-paws-vs-alternatives.html',
  '/guides/pt/how-to-play-darkline-paws.html',
  '/guides/pt/darkline-paws-when.html',
  '/guides/pt/darkline-paws-vs-alternatives.html',
  '/guides/es/how-to-play-darkline-paws.html',
  '/guides/es/darkline-paws-when.html',
  '/guides/es/darkline-paws-vs-alternatives.html',
  '/guides/vi/how-to-play-darkline-paws.html',
  '/guides/vi/darkline-paws-when.html',
  '/guides/vi/darkline-paws-vs-alternatives.html',
  '/guides/id/how-to-play-darkline-paws.html',
  '/guides/id/darkline-paws-when.html',
  '/guides/id/darkline-paws-vs-alternatives.html',
  '/guides/de/how-to-play-darkline-paws.html',
  '/guides/de/darkline-paws-when.html',
  '/guides/de/darkline-paws-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire145 (2026-07-18): darkline-paws companion guides
  '/guides/how-to-play-darkline-paws.html': 'guide/how-to-play-darkline-paws.jsp',
  '/guides/darkline-paws-when.html': 'guide/darkline-paws-when.jsp',
  '/guides/darkline-paws-vs-alternatives.html': 'guide/darkline-paws-vs-alternatives.jsp',
  '/guides/pt/how-to-play-darkline-paws.html': 'guide/pt/how-to-play-darkline-paws.jsp',
  '/guides/pt/darkline-paws-when.html': 'guide/pt/darkline-paws-when.jsp',
  '/guides/pt/darkline-paws-vs-alternatives.html': 'guide/pt/darkline-paws-vs-alternatives.jsp',
  '/guides/es/how-to-play-darkline-paws.html': 'guide/es/how-to-play-darkline-paws.jsp',
  '/guides/es/darkline-paws-when.html': 'guide/es/darkline-paws-when.jsp',
  '/guides/es/darkline-paws-vs-alternatives.html': 'guide/es/darkline-paws-vs-alternatives.jsp',
  '/guides/vi/how-to-play-darkline-paws.html': 'guide/vi/how-to-play-darkline-paws.jsp',
  '/guides/vi/darkline-paws-when.html': 'guide/vi/darkline-paws-when.jsp',
  '/guides/vi/darkline-paws-vs-alternatives.html': 'guide/vi/darkline-paws-vs-alternatives.jsp',
  '/guides/id/how-to-play-darkline-paws.html': 'guide/id/how-to-play-darkline-paws.jsp',
  '/guides/id/darkline-paws-when.html': 'guide/id/darkline-paws-when.jsp',
  '/guides/id/darkline-paws-vs-alternatives.html': 'guide/id/darkline-paws-vs-alternatives.jsp',
  '/guides/de/how-to-play-darkline-paws.html': 'guide/de/how-to-play-darkline-paws.jsp',
  '/guides/de/darkline-paws-when.html': 'guide/de/darkline-paws-when.jsp',
  '/guides/de/darkline-paws-vs-alternatives.html': 'guide/de/darkline-paws-vs-alternatives.jsp',
`;

// Single-line anchors only (fire143 lesson: paired before/after context breaks
// when a sibling insertion lands between the two anchor lines).
patch(
  join(ROOT, 'scripts/site-data.mjs'),
  [`  '/guides/de/boing-cat-platformer-vs-alternatives.html',\n`, `  '/guides/de/boing-cat-platformer-vs-alternatives.html',\n${guideRoutes}`],
  [`  '/boing-cat-platformer.html': '/games/boing-cat-platformer.html',\n`, `  '/boing-cat-platformer.html': '/games/boing-cat-platformer.html',\n  '/darkline-paws.html': '/games/darkline-paws.html',\n`],
  [`  '/guides/de/boing-cat-platformer-vs-alternatives.html': 'guide/de/boing-cat-platformer-vs-alternatives.jsp',\n`, `  '/guides/de/boing-cat-platformer-vs-alternatives.html': 'guide/de/boing-cat-platformer-vs-alternatives.jsp',\n${guideJsp}`],
  [`  '/games/boing-cat-platformer.html': 'games/boing-cat-platformer.jsp',\n`, `  '/games/boing-cat-platformer.html': 'games/boing-cat-platformer.jsp',\n  '/games/darkline-paws.html': 'games/darkline-paws.jsp',\n`],
);

// games cluster array tail drifts as sibling fires land - match whatever the
// CURRENT last element is rather than a fixed slug.
{
  const p = join(ROOT, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/darkline-paws.html')) {
    console.log('already patched', p);
  } else {
    const m = s.match(/'\/games\/[a-z0-9-]+\.html'\]/);
    if (!m) throw new Error('seo-clusters.mjs: could not find games array tail');
    s = s.replace(m[0], `${m[0].slice(0, -1)}, '/games/darkline-paws.html']`);
    writeFileSync(p, s, 'utf8');
    console.log('patched', p, '(tail was', m[0], ')');
  }
}

patch(
  join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'),
  [
    `{ title: "Boing Cat Platformer", url: "https://freetoolonline.com/games/boing-cat-platformer.html", include: !1, tags: "games" },`,
    `{ title: "Boing Cat Platformer", url: "https://freetoolonline.com/games/boing-cat-platformer.html", include: !1, tags: "games" },\n    { title: "DarkLine Paws", url: "https://freetoolonline.com/games/darkline-paws.html", include: !1, tags: "games" },`,
  ],
);

patch(
  join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'),
  [
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/boing-cat-platformer.html'>Boing Cat Platformer (Auto-Run Jump)</a>`,
    `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/boing-cat-platformer.html'>Boing Cat Platformer (Auto-Run Jump)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/darkline-paws.html'>DarkLine Paws (3-in-1 Bundle)</a>`,
  ],
);

const cfPath = join(FRONTEND, 'seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js');
let cf = readFileSync(cfPath, 'utf8');
if (!cf.includes('darkline-paws')) {
  cf = cf.replace(
    `  "/boing-cat-platformer.html": "/games/boing-cat-platformer.html"`,
    `  "/boing-cat-platformer.html": "/games/boing-cat-platformer.html",\n  "/darkline-paws.html": "/games/darkline-paws.html"`,
  );
  writeFileSync(cfPath, cf, 'utf8');
  console.log('patched cloudfront 301');
} else {
  console.log('cloudfront 301 already patched');
}

console.log('fire145 registry patch complete');
