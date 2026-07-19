#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.ROOT || join(__dirname, '..');
function patch(file, ...replacements) {
  const p = join(ROOT, file);
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/thirteen-hours.html') && !file.includes('header-pictogram')) {
    console.log('already patched', file); return;
  }
  for (const [from, to] of replacements) {
    if (!s.includes(from)) throw new Error(`patch miss in ${file}: ${from.slice(0, 120)}`);
    s = s.replace(from, to);
  }
  writeFileSync(p, s, 'utf8');
  console.log('patched', file);
}
const guideRoutes = `
  // game-discovery-loop-runbook fire154 (2026-07-19): thirteen-hours companion guides
  '/guides/how-to-play-thirteen-hours.html',
  '/guides/thirteen-hours-when.html',
  '/guides/thirteen-hours-vs-alternatives.html',
  '/guides/pt/how-to-play-thirteen-hours.html',
  '/guides/pt/thirteen-hours-when.html',
  '/guides/pt/thirteen-hours-vs-alternatives.html',
  '/guides/es/how-to-play-thirteen-hours.html',
  '/guides/es/thirteen-hours-when.html',
  '/guides/es/thirteen-hours-vs-alternatives.html',
  '/guides/vi/how-to-play-thirteen-hours.html',
  '/guides/vi/thirteen-hours-when.html',
  '/guides/vi/thirteen-hours-vs-alternatives.html',
  '/guides/id/how-to-play-thirteen-hours.html',
  '/guides/id/thirteen-hours-when.html',
  '/guides/id/thirteen-hours-vs-alternatives.html',
  '/guides/de/how-to-play-thirteen-hours.html',
  '/guides/de/thirteen-hours-when.html',
  '/guides/de/thirteen-hours-vs-alternatives.html',
`;
const guideJsp = `
  // game-discovery-loop-runbook fire154 (2026-07-19): thirteen-hours companion guides
  '/guides/how-to-play-thirteen-hours.html': 'guide/how-to-play-thirteen-hours.jsp',
  '/guides/thirteen-hours-when.html': 'guide/thirteen-hours-when.jsp',
  '/guides/thirteen-hours-vs-alternatives.html': 'guide/thirteen-hours-vs-alternatives.jsp',
  '/guides/pt/how-to-play-thirteen-hours.html': 'guide/pt/how-to-play-thirteen-hours.jsp',
  '/guides/pt/thirteen-hours-when.html': 'guide/pt/thirteen-hours-when.jsp',
  '/guides/pt/thirteen-hours-vs-alternatives.html': 'guide/pt/thirteen-hours-vs-alternatives.jsp',
  '/guides/es/how-to-play-thirteen-hours.html': 'guide/es/how-to-play-thirteen-hours.jsp',
  '/guides/es/thirteen-hours-when.html': 'guide/es/thirteen-hours-when.jsp',
  '/guides/es/thirteen-hours-vs-alternatives.html': 'guide/es/thirteen-hours-vs-alternatives.jsp',
  '/guides/vi/how-to-play-thirteen-hours.html': 'guide/vi/how-to-play-thirteen-hours.jsp',
  '/guides/vi/thirteen-hours-when.html': 'guide/vi/thirteen-hours-when.jsp',
  '/guides/vi/thirteen-hours-vs-alternatives.html': 'guide/vi/thirteen-hours-vs-alternatives.jsp',
  '/guides/id/how-to-play-thirteen-hours.html': 'guide/id/how-to-play-thirteen-hours.jsp',
  '/guides/id/thirteen-hours-when.html': 'guide/id/thirteen-hours-when.jsp',
  '/guides/id/thirteen-hours-vs-alternatives.html': 'guide/id/thirteen-hours-vs-alternatives.jsp',
  '/guides/de/how-to-play-thirteen-hours.html': 'guide/de/how-to-play-thirteen-hours.jsp',
  '/guides/de/thirteen-hours-when.html': 'guide/de/thirteen-hours-when.jsp',
  '/guides/de/thirteen-hours-vs-alternatives.html': 'guide/de/thirteen-hours-vs-alternatives.jsp',
`;
patch('scripts/site-data.mjs',
  [`  '/guides/de/classic-pong-vs-alternatives.html',\n`, `  '/guides/de/classic-pong-vs-alternatives.html',\n${guideRoutes}`],
  [`  '/classic-pong.html': '/games/classic-pong.html',\n`, `  '/classic-pong.html': '/games/classic-pong.html',\n  '/thirteen-hours.html': '/games/thirteen-hours.html',\n`],
  [`  '/guides/de/classic-pong-vs-alternatives.html': 'guide/de/classic-pong-vs-alternatives.jsp',\n`, `  '/guides/de/classic-pong-vs-alternatives.html': 'guide/de/classic-pong-vs-alternatives.jsp',\n${guideJsp}`],
  [`  '/games/classic-pong.html': 'games/classic-pong.jsp',\n`, `  '/games/classic-pong.html': 'games/classic-pong.jsp',\n  '/games/thirteen-hours.html': 'games/thirteen-hours.jsp',\n`],
);
{
  const p = join(ROOT, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/thirteen-hours.html')) console.log('already patched', p);
  else {
    const needle = "'/games/classic-pong.html']";
    if (!s.includes(needle)) throw new Error('seo-clusters missing classic-pong tail');
    s = s.replace(needle, "'/games/classic-pong.html', '/games/thirteen-hours.html']");
    writeFileSync(p, s, 'utf8');
    console.log('patched', p);
  }
}
patch('source/web/src/main/webapp/static/script/related-tools.js',
  [`{ title: "Classic Pong", url: "https://freetoolonline.com/games/classic-pong.html", include: !1, tags: "games" },`, `{ title: "Classic Pong", url: "https://freetoolonline.com/games/classic-pong.html", include: !1, tags: "games" },\n    { title: "Thirteen Hours", url: "https://freetoolonline.com/games/thirteen-hours.html", include: !1, tags: "games" },`],
);
patch('source/static/src/main/webapp/resources/view/l-menu.html',
  [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/classic-pong.html'>Classic Pong (Canvas Table Tennis)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/classic-pong.html'>Classic Pong (Canvas Table Tennis)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/thirteen-hours.html'>Thirteen Hours (Clock Chain Puzzle)</a>`],
);
{
  const p = join(ROOT, 'scripts/header-pictogram-enrolled.json');
  const j = JSON.parse(readFileSync(p, 'utf8'));
  if (!j.slugs.includes('thirteenhours')) {
    const idx = j.slugs.findIndex((s) => s > 'thirteenhours');
    j.slugs.splice(idx === -1 ? j.slugs.length : idx, 0, 'thirteenhours');
    writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
    console.log('enrolled thirteenhours');
  }
}
console.log('fire154 registries ready');
