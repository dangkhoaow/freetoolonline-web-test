#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.ROOT || join(__dirname, '..');
function patch(file, ...replacements) {
  const p = join(ROOT, file);
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/classic-pong.html') && !file.includes('header-pictogram')) {
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
  // game-discovery-loop-runbook fire153 (2026-07-19): classic-pong companion guides
  '/guides/how-to-play-classic-pong.html',
  '/guides/classic-pong-when.html',
  '/guides/classic-pong-vs-alternatives.html',
  '/guides/pt/how-to-play-classic-pong.html',
  '/guides/pt/classic-pong-when.html',
  '/guides/pt/classic-pong-vs-alternatives.html',
  '/guides/es/how-to-play-classic-pong.html',
  '/guides/es/classic-pong-when.html',
  '/guides/es/classic-pong-vs-alternatives.html',
  '/guides/vi/how-to-play-classic-pong.html',
  '/guides/vi/classic-pong-when.html',
  '/guides/vi/classic-pong-vs-alternatives.html',
  '/guides/id/how-to-play-classic-pong.html',
  '/guides/id/classic-pong-when.html',
  '/guides/id/classic-pong-vs-alternatives.html',
  '/guides/de/how-to-play-classic-pong.html',
  '/guides/de/classic-pong-when.html',
  '/guides/de/classic-pong-vs-alternatives.html',
`;
const guideJsp = `
  // game-discovery-loop-runbook fire153 (2026-07-19): classic-pong companion guides
  '/guides/how-to-play-classic-pong.html': 'guide/how-to-play-classic-pong.jsp',
  '/guides/classic-pong-when.html': 'guide/classic-pong-when.jsp',
  '/guides/classic-pong-vs-alternatives.html': 'guide/classic-pong-vs-alternatives.jsp',
  '/guides/pt/how-to-play-classic-pong.html': 'guide/pt/how-to-play-classic-pong.jsp',
  '/guides/pt/classic-pong-when.html': 'guide/pt/classic-pong-when.jsp',
  '/guides/pt/classic-pong-vs-alternatives.html': 'guide/pt/classic-pong-vs-alternatives.jsp',
  '/guides/es/how-to-play-classic-pong.html': 'guide/es/how-to-play-classic-pong.jsp',
  '/guides/es/classic-pong-when.html': 'guide/es/classic-pong-when.jsp',
  '/guides/es/classic-pong-vs-alternatives.html': 'guide/es/classic-pong-vs-alternatives.jsp',
  '/guides/vi/how-to-play-classic-pong.html': 'guide/vi/how-to-play-classic-pong.jsp',
  '/guides/vi/classic-pong-when.html': 'guide/vi/classic-pong-when.jsp',
  '/guides/vi/classic-pong-vs-alternatives.html': 'guide/vi/classic-pong-vs-alternatives.jsp',
  '/guides/id/how-to-play-classic-pong.html': 'guide/id/how-to-play-classic-pong.jsp',
  '/guides/id/classic-pong-when.html': 'guide/id/classic-pong-when.jsp',
  '/guides/id/classic-pong-vs-alternatives.html': 'guide/id/classic-pong-vs-alternatives.jsp',
  '/guides/de/how-to-play-classic-pong.html': 'guide/de/how-to-play-classic-pong.jsp',
  '/guides/de/classic-pong-when.html': 'guide/de/classic-pong-when.jsp',
  '/guides/de/classic-pong-vs-alternatives.html': 'guide/de/classic-pong-vs-alternatives.jsp',
`;
patch('scripts/site-data.mjs',
  [`  '/guides/de/bounce-back-vs-alternatives.html',\n`, `  '/guides/de/bounce-back-vs-alternatives.html',\n${guideRoutes}`],
  [`  '/bounce-back.html': '/games/bounce-back.html',\n`, `  '/bounce-back.html': '/games/bounce-back.html',\n  '/classic-pong.html': '/games/classic-pong.html',\n`],
  [`  '/guides/de/bounce-back-vs-alternatives.html': 'guide/de/bounce-back-vs-alternatives.jsp',\n`, `  '/guides/de/bounce-back-vs-alternatives.html': 'guide/de/bounce-back-vs-alternatives.jsp',\n${guideJsp}`],
  [`  '/games/bounce-back.html': 'games/bounce-back.jsp',\n`, `  '/games/bounce-back.html': 'games/bounce-back.jsp',\n  '/games/classic-pong.html': 'games/classic-pong.jsp',\n`],
);
{
  const p = join(ROOT, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/classic-pong.html')) console.log('already patched', p);
  else {
    const needle = "'/games/bounce-back.html']";
    if (!s.includes(needle)) throw new Error('seo-clusters missing bounce-back tail');
    s = s.replace(needle, "'/games/bounce-back.html', '/games/classic-pong.html']");
    writeFileSync(p, s, 'utf8');
    console.log('patched', p);
  }
}
patch('source/web/src/main/webapp/static/script/related-tools.js',
  [`{ title: "Bounce Back", url: "https://freetoolonline.com/games/bounce-back.html", include: !1, tags: "games" },`, `{ title: "Bounce Back", url: "https://freetoolonline.com/games/bounce-back.html", include: !1, tags: "games" },\n    { title: "Classic Pong", url: "https://freetoolonline.com/games/classic-pong.html", include: !1, tags: "games" },`],
);
patch('source/static/src/main/webapp/resources/view/l-menu.html',
  [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/bounce-back.html'>Bounce Back (Boomerang Roguelite)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/bounce-back.html'>Bounce Back (Boomerang Roguelite)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/classic-pong.html'>Classic Pong (Canvas Table Tennis)</a>`],
);
{
  const p = join(ROOT, 'scripts/header-pictogram-enrolled.json');
  const j = JSON.parse(readFileSync(p, 'utf8'));
  if (!j.slugs.includes('classicpong')) {
    const idx = j.slugs.findIndex((s) => s > 'classicpong');
    j.slugs.splice(idx === -1 ? j.slugs.length : idx, 0, 'classicpong');
    writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
    console.log('enrolled classicpong');
  }
}
console.log('fire153 registries ready');
