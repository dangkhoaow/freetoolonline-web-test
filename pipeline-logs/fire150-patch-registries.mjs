#!/usr/bin/env node
/** fire150: patch registries for feast-night (staging or prod via ROOT env) */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.ROOT || join(__dirname, '..');

function patch(file, ...replacements) {
  const p = join(ROOT, file);
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/feast-night.html') && !file.includes('header-pictogram')) {
    console.log('already patched', file);
    return;
  }
  for (const [from, to] of replacements) {
    if (!s.includes(from)) throw new Error(`patch miss in ${file}: ${from.slice(0, 100)}`);
    s = s.replace(from, to);
  }
  writeFileSync(p, s, 'utf8');
  console.log('patched', file);
}

const guideRoutes = `
  // game-discovery-loop-runbook fire150 (2026-07-18): feast-night companion guides
  '/guides/how-to-play-feast-night.html',
  '/guides/feast-night-when.html',
  '/guides/feast-night-vs-alternatives.html',
  '/guides/pt/how-to-play-feast-night.html',
  '/guides/pt/feast-night-when.html',
  '/guides/pt/feast-night-vs-alternatives.html',
  '/guides/es/how-to-play-feast-night.html',
  '/guides/es/feast-night-when.html',
  '/guides/es/feast-night-vs-alternatives.html',
  '/guides/vi/how-to-play-feast-night.html',
  '/guides/vi/feast-night-when.html',
  '/guides/vi/feast-night-vs-alternatives.html',
  '/guides/id/how-to-play-feast-night.html',
  '/guides/id/feast-night-when.html',
  '/guides/id/feast-night-vs-alternatives.html',
  '/guides/de/how-to-play-feast-night.html',
  '/guides/de/feast-night-when.html',
  '/guides/de/feast-night-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire150 (2026-07-18): feast-night companion guides
  '/guides/how-to-play-feast-night.html': 'guide/how-to-play-feast-night.jsp',
  '/guides/feast-night-when.html': 'guide/feast-night-when.jsp',
  '/guides/feast-night-vs-alternatives.html': 'guide/feast-night-vs-alternatives.jsp',
  '/guides/pt/how-to-play-feast-night.html': 'guide/pt/how-to-play-feast-night.jsp',
  '/guides/pt/feast-night-when.html': 'guide/pt/feast-night-when.jsp',
  '/guides/pt/feast-night-vs-alternatives.html': 'guide/pt/feast-night-vs-alternatives.jsp',
  '/guides/es/how-to-play-feast-night.html': 'guide/es/how-to-play-feast-night.jsp',
  '/guides/es/feast-night-when.html': 'guide/es/feast-night-when.jsp',
  '/guides/es/feast-night-vs-alternatives.html': 'guide/es/feast-night-vs-alternatives.jsp',
  '/guides/vi/how-to-play-feast-night.html': 'guide/vi/how-to-play-feast-night.jsp',
  '/guides/vi/feast-night-when.html': 'guide/vi/feast-night-when.jsp',
  '/guides/vi/feast-night-vs-alternatives.html': 'guide/vi/feast-night-vs-alternatives.jsp',
  '/guides/id/how-to-play-feast-night.html': 'guide/id/how-to-play-feast-night.jsp',
  '/guides/id/feast-night-when.html': 'guide/id/feast-night-when.jsp',
  '/guides/id/feast-night-vs-alternatives.html': 'guide/id/feast-night-vs-alternatives.jsp',
  '/guides/de/how-to-play-feast-night.html': 'guide/de/how-to-play-feast-night.jsp',
  '/guides/de/feast-night-when.html': 'guide/de/feast-night-when.jsp',
  '/guides/de/feast-night-vs-alternatives.html': 'guide/de/feast-night-vs-alternatives.jsp',
`;

patch('scripts/site-data.mjs',
  [`  '/guides/de/solo-battlefield-vs-alternatives.html',\n`, `  '/guides/de/solo-battlefield-vs-alternatives.html',\n${guideRoutes}`],
  [`  '/solo-battlefield.html': '/games/solo-battlefield.html',\n`, `  '/solo-battlefield.html': '/games/solo-battlefield.html',\n  '/feast-night.html': '/games/feast-night.html',\n`],
  [`  '/guides/de/solo-battlefield-vs-alternatives.html': 'guide/de/solo-battlefield-vs-alternatives.jsp',\n`, `  '/guides/de/solo-battlefield-vs-alternatives.html': 'guide/de/solo-battlefield-vs-alternatives.jsp',\n${guideJsp}`],
  [`  '/games/solo-battlefield.html': 'games/solo-battlefield.jsp',\n`, `  '/games/solo-battlefield.html': 'games/solo-battlefield.jsp',\n  '/games/feast-night.html': 'games/feast-night.jsp',\n`],
);

{
  const p = join(ROOT, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/feast-night.html')) {
    console.log('already patched', p);
  } else {
    const m = s.match(/'\/games\/[a-z0-9-]+\.html'\]/);
    if (!m) throw new Error('seo-clusters.mjs: could not find games array tail');
    s = s.replace(m[0], `${m[0].slice(0, -1)}, '/games/feast-night.html']`);
    writeFileSync(p, s, 'utf8');
    console.log('patched', p, '(tail was', m[0], ')');
  }
}

patch('source/web/src/main/webapp/static/script/related-tools.js',
  [`{ title: "Solo Battlefield", url: "https://freetoolonline.com/games/solo-battlefield.html", include: !1, tags: "games" },`, `{ title: "Solo Battlefield", url: "https://freetoolonline.com/games/solo-battlefield.html", include: !1, tags: "games" },\n    { title: "Feast Night", url: "https://freetoolonline.com/games/feast-night.html", include: !1, tags: "games" },`],
);

patch('source/static/src/main/webapp/resources/view/l-menu.html',
  [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/solo-battlefield.html'>Solo Battlefield (Last-Alive Combat)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/solo-battlefield.html'>Solo Battlefield (Last-Alive Combat)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/feast-night.html'>Feast Night (Medieval Soul FPS)</a>`],
);

{
  const p = join(ROOT, 'scripts/header-pictogram-enrolled.json');
  const j = JSON.parse(readFileSync(p, 'utf8'));
  if (!j.slugs.includes('feastnight')) {
    const idx = j.slugs.findIndex((s) => s > 'feastnight');
    j.slugs.splice(idx === -1 ? j.slugs.length : idx, 0, 'feastnight');
    writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
    console.log('enrolled feastnight in', p);
  } else {
    console.log('already enrolled', p);
  }
}

console.log('fire150 registries ready');
