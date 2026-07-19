#!/usr/bin/env node
/** fire152: patch registries for bounce-back */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.ROOT || join(__dirname, '..');

function patch(file, ...replacements) {
  const p = join(ROOT, file);
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/bounce-back.html') && !file.includes('header-pictogram')) {
    console.log('already patched', file);
    return;
  }
  for (const [from, to] of replacements) {
    if (!s.includes(from)) throw new Error(`patch miss in ${file}: ${from.slice(0, 120)}`);
    s = s.replace(from, to);
  }
  writeFileSync(p, s, 'utf8');
  console.log('patched', file);
}

const guideRoutes = `
  // game-discovery-loop-runbook fire152 (2026-07-19): bounce-back companion guides
  '/guides/how-to-play-bounce-back.html',
  '/guides/bounce-back-when.html',
  '/guides/bounce-back-vs-alternatives.html',
  '/guides/pt/how-to-play-bounce-back.html',
  '/guides/pt/bounce-back-when.html',
  '/guides/pt/bounce-back-vs-alternatives.html',
  '/guides/es/how-to-play-bounce-back.html',
  '/guides/es/bounce-back-when.html',
  '/guides/es/bounce-back-vs-alternatives.html',
  '/guides/vi/how-to-play-bounce-back.html',
  '/guides/vi/bounce-back-when.html',
  '/guides/vi/bounce-back-vs-alternatives.html',
  '/guides/id/how-to-play-bounce-back.html',
  '/guides/id/bounce-back-when.html',
  '/guides/id/bounce-back-vs-alternatives.html',
  '/guides/de/how-to-play-bounce-back.html',
  '/guides/de/bounce-back-when.html',
  '/guides/de/bounce-back-vs-alternatives.html',
`;

const guideJsp = `
  // game-discovery-loop-runbook fire152 (2026-07-19): bounce-back companion guides
  '/guides/how-to-play-bounce-back.html': 'guide/how-to-play-bounce-back.jsp',
  '/guides/bounce-back-when.html': 'guide/bounce-back-when.jsp',
  '/guides/bounce-back-vs-alternatives.html': 'guide/bounce-back-vs-alternatives.jsp',
  '/guides/pt/how-to-play-bounce-back.html': 'guide/pt/how-to-play-bounce-back.jsp',
  '/guides/pt/bounce-back-when.html': 'guide/pt/bounce-back-when.jsp',
  '/guides/pt/bounce-back-vs-alternatives.html': 'guide/pt/bounce-back-vs-alternatives.jsp',
  '/guides/es/how-to-play-bounce-back.html': 'guide/es/how-to-play-bounce-back.jsp',
  '/guides/es/bounce-back-when.html': 'guide/es/bounce-back-when.jsp',
  '/guides/es/bounce-back-vs-alternatives.html': 'guide/es/bounce-back-vs-alternatives.jsp',
  '/guides/vi/how-to-play-bounce-back.html': 'guide/vi/how-to-play-bounce-back.jsp',
  '/guides/vi/bounce-back-when.html': 'guide/vi/bounce-back-when.jsp',
  '/guides/vi/bounce-back-vs-alternatives.html': 'guide/vi/bounce-back-vs-alternatives.jsp',
  '/guides/id/how-to-play-bounce-back.html': 'guide/id/how-to-play-bounce-back.jsp',
  '/guides/id/bounce-back-when.html': 'guide/id/bounce-back-when.jsp',
  '/guides/id/bounce-back-vs-alternatives.html': 'guide/id/bounce-back-vs-alternatives.jsp',
  '/guides/de/how-to-play-bounce-back.html': 'guide/de/how-to-play-bounce-back.jsp',
  '/guides/de/bounce-back-when.html': 'guide/de/bounce-back-when.jsp',
  '/guides/de/bounce-back-vs-alternatives.html': 'guide/de/bounce-back-vs-alternatives.jsp',
`;

patch('scripts/site-data.mjs',
  [`  '/guides/de/rune-keeper-vs-alternatives.html',\n`, `  '/guides/de/rune-keeper-vs-alternatives.html',\n${guideRoutes}`],
  [`  '/rune-keeper.html': '/games/rune-keeper.html',\n`, `  '/rune-keeper.html': '/games/rune-keeper.html',\n  '/bounce-back.html': '/games/bounce-back.html',\n`],
  [`  '/guides/de/rune-keeper-vs-alternatives.html': 'guide/de/rune-keeper-vs-alternatives.jsp',\n`, `  '/guides/de/rune-keeper-vs-alternatives.html': 'guide/de/rune-keeper-vs-alternatives.jsp',\n${guideJsp}`],
  [`  '/games/rune-keeper.html': 'games/rune-keeper.jsp',\n`, `  '/games/rune-keeper.html': 'games/rune-keeper.jsp',\n  '/games/bounce-back.html': 'games/bounce-back.jsp',\n`],
);

{
  const p = join(ROOT, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/bounce-back.html')) {
    console.log('already patched', p);
  } else {
    const needle = "'/games/rune-keeper.html']";
    if (!s.includes(needle)) throw new Error('seo-clusters.mjs: missing rune-keeper tail');
    s = s.replace(needle, "'/games/rune-keeper.html', '/games/bounce-back.html']");
    writeFileSync(p, s, 'utf8');
    console.log('patched', p);
  }
}

patch('source/web/src/main/webapp/static/script/related-tools.js',
  [`{ title: "Rune Keeper", url: "https://freetoolonline.com/games/rune-keeper.html", include: !1, tags: "games" },`, `{ title: "Rune Keeper", url: "https://freetoolonline.com/games/rune-keeper.html", include: !1, tags: "games" },\n    { title: "Bounce Back", url: "https://freetoolonline.com/games/bounce-back.html", include: !1, tags: "games" },`],
);

patch('source/static/src/main/webapp/resources/view/l-menu.html',
  [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/rune-keeper.html'>Rune Keeper (Draw-to-Move Arena)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/rune-keeper.html'>Rune Keeper (Draw-to-Move Arena)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/bounce-back.html'>Bounce Back (Boomerang Roguelite)</a>`],
);

{
  const p = join(ROOT, 'scripts/header-pictogram-enrolled.json');
  const j = JSON.parse(readFileSync(p, 'utf8'));
  if (!j.slugs.includes('bounceback')) {
    const idx = j.slugs.findIndex((s) => s > 'bounceback');
    j.slugs.splice(idx === -1 ? j.slugs.length : idx, 0, 'bounceback');
    writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
    console.log('enrolled bounceback in', p);
  } else {
    console.log('already enrolled', p);
  }
}

console.log('fire152 registries ready');
