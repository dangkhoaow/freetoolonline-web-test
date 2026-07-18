#!/usr/bin/env node
/** fire136: patch site-data, seo-clusters, related-tools, l-menu, cloudfront 301 */
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

patch(
  join(ROOT, 'scripts/site-data.mjs'),
  [`  '/guides/de/cat-typing-race-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/cat-typing-race-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire16`],
  [`  '/cat-typing-race.html': '/games/cat-typing-race.html',\n\n  '/gravity-orbit-golf.html'`, `  '/cat-typing-race.html': '/games/cat-typing-race.html',\n  '/unlucky-crossing.html': '/games/unlucky-crossing.html',\n\n  '/gravity-orbit-golf.html'`],
  [`  '/guides/de/cat-typing-race-vs-alternatives.html': 'guide/de/cat-typing-race-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire16`, `  '/guides/de/cat-typing-race-vs-alternatives.html': 'guide/de/cat-typing-race-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire16`],
  [`  '/games/cat-typing-race.html': 'games/cat-typing-race.jsp',\n  '/games/asteroid-blaster.html'`, `  '/games/cat-typing-race.html': 'games/cat-typing-race.jsp',\n  '/games/unlucky-crossing.html': 'games/unlucky-crossing.jsp',\n  '/games/asteroid-blaster.html'`],
);

patch(
  join(ROOT, 'scripts/seo-clusters.mjs'),
  [`'/games/cat-typing-race.html']`, `'/games/cat-typing-race.html', '/games/unlucky-crossing.html']`],
);

patch(
  join(ROOT, 'source/web/src/main/webapp/static/script/related-tools.js'),
  [`    { title: "Cat Typing Race", url: "https://freetoolonline.com/games/cat-typing-race.html", include: !1, tags: "games" },`, `    { title: "Cat Typing Race", url: "https://freetoolonline.com/games/cat-typing-race.html", include: !1, tags: "games" },\n    { title: "Unlucky Crossing", url: "https://freetoolonline.com/games/unlucky-crossing.html", include: !1, tags: "games" },`],
);

patch(
  join(ROOT, 'source/static/src/main/webapp/resources/view/l-menu.html'),
  [`                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/cat-typing-race.html'>Cat Typing Race (Keyboard Duel)</a>`, `                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/cat-typing-race.html'>Cat Typing Race (Keyboard Duel)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/unlucky-crossing.html'>Unlucky Crossing (Street Cat)</a>`],
);

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

console.log('fire136 registry patch complete');
