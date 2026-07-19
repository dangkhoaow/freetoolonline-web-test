#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.ROOT || join(__dirname, '..');
function patch(file, ...replacements) {
  const p = join(ROOT, file);
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/roller-maze-escape.html') && !file.includes('header-pictogram')) {
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
  // game-discovery-loop-runbook fire156 (2026-07-20): rollermaze companion guides
  '/guides/how-to-play-roller-maze-escape.html',
  '/guides/roller-maze-escape-when.html',
  '/guides/roller-maze-escape-vs-alternatives.html',
  '/guides/pt/how-to-play-roller-maze-escape.html',
  '/guides/pt/roller-maze-escape-when.html',
  '/guides/pt/roller-maze-escape-vs-alternatives.html',
  '/guides/es/how-to-play-roller-maze-escape.html',
  '/guides/es/roller-maze-escape-when.html',
  '/guides/es/roller-maze-escape-vs-alternatives.html',
  '/guides/vi/how-to-play-roller-maze-escape.html',
  '/guides/vi/roller-maze-escape-when.html',
  '/guides/vi/roller-maze-escape-vs-alternatives.html',
  '/guides/id/how-to-play-roller-maze-escape.html',
  '/guides/id/roller-maze-escape-when.html',
  '/guides/id/roller-maze-escape-vs-alternatives.html',
  '/guides/de/how-to-play-roller-maze-escape.html',
  '/guides/de/roller-maze-escape-when.html',
  '/guides/de/roller-maze-escape-vs-alternatives.html',
`;
const guideJsp = `
  // game-discovery-loop-runbook fire156 (2026-07-20): rollermaze companion guides
  '/guides/how-to-play-roller-maze-escape.html': 'guide/how-to-play-roller-maze-escape.jsp',
  '/guides/roller-maze-escape-when.html': 'guide/roller-maze-escape-when.jsp',
  '/guides/roller-maze-escape-vs-alternatives.html': 'guide/roller-maze-escape-vs-alternatives.jsp',
  '/guides/pt/how-to-play-roller-maze-escape.html': 'guide/pt/how-to-play-roller-maze-escape.jsp',
  '/guides/pt/roller-maze-escape-when.html': 'guide/pt/roller-maze-escape-when.jsp',
  '/guides/pt/roller-maze-escape-vs-alternatives.html': 'guide/pt/roller-maze-escape-vs-alternatives.jsp',
  '/guides/es/how-to-play-roller-maze-escape.html': 'guide/es/how-to-play-roller-maze-escape.jsp',
  '/guides/es/roller-maze-escape-when.html': 'guide/es/roller-maze-escape-when.jsp',
  '/guides/es/roller-maze-escape-vs-alternatives.html': 'guide/es/roller-maze-escape-vs-alternatives.jsp',
  '/guides/vi/how-to-play-roller-maze-escape.html': 'guide/vi/how-to-play-roller-maze-escape.jsp',
  '/guides/vi/roller-maze-escape-when.html': 'guide/vi/roller-maze-escape-when.jsp',
  '/guides/vi/roller-maze-escape-vs-alternatives.html': 'guide/vi/roller-maze-escape-vs-alternatives.jsp',
  '/guides/id/how-to-play-roller-maze-escape.html': 'guide/id/how-to-play-roller-maze-escape.jsp',
  '/guides/id/roller-maze-escape-when.html': 'guide/id/roller-maze-escape-when.jsp',
  '/guides/id/roller-maze-escape-vs-alternatives.html': 'guide/id/roller-maze-escape-vs-alternatives.jsp',
  '/guides/de/how-to-play-roller-maze-escape.html': 'guide/de/how-to-play-roller-maze-escape.jsp',
  '/guides/de/roller-maze-escape-when.html': 'guide/de/roller-maze-escape-when.jsp',
  '/guides/de/roller-maze-escape-vs-alternatives.html': 'guide/de/roller-maze-escape-vs-alternatives.jsp',
`;
patch('scripts/site-data.mjs',
  [`  '/guides/de/quantum-shift-vs-alternatives.html',\n`, `  '/guides/de/quantum-shift-vs-alternatives.html',\n${guideRoutes}`],
  [`  '/quantum-shift.html': '/games/quantum-shift.html',\n`, `  '/quantum-shift.html': '/games/quantum-shift.html',\n  '/roller-maze-escape.html': '/games/roller-maze-escape.html',\n`],
  [`  '/guides/de/quantum-shift-vs-alternatives.html': 'guide/de/quantum-shift-vs-alternatives.jsp',\n`, `  '/guides/de/quantum-shift-vs-alternatives.html': 'guide/de/quantum-shift-vs-alternatives.jsp',\n${guideJsp}`],
  [`  '/games/quantum-shift.html': 'games/quantum-shift.jsp',\n`, `  '/games/quantum-shift.html': 'games/quantum-shift.jsp',\n  '/games/roller-maze-escape.html': 'games/roller-maze-escape.jsp',\n`],
);
{
  const p = join(ROOT, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/roller-maze-escape.html')) console.log('already patched', p);
  else {
    const needle = "'/games/quantum-shift.html']";
    if (!s.includes(needle)) throw new Error('seo-clusters missing quantum-shift tail');
    s = s.replace(needle, "'/games/quantum-shift.html', '/games/roller-maze-escape.html']");
    writeFileSync(p, s, 'utf8');
    console.log('patched', p);
  }
}
patch('source/web/src/main/webapp/static/script/related-tools.js',
  [`{ title: "Quantum Shift", url: "https://freetoolonline.com/games/quantum-shift.html", include: !1, tags: "games" },`, `{ title: "Quantum Shift", url: "https://freetoolonline.com/games/quantum-shift.html", include: !1, tags: "games" },\n    { title: "Rollermaze", url: "https://freetoolonline.com/games/roller-maze-escape.html", include: !1, tags: "games" },`],
);
patch('source/static/src/main/webapp/resources/view/l-menu.html',
  [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/quantum-shift.html'>Quantum Shift (Particle Puzzle)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/quantum-shift.html'>Quantum Shift (Particle Puzzle)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/roller-maze-escape.html'>Rollermaze (Maze Escape)</a>`],
);
{
  const p = join(ROOT, 'scripts/header-pictogram-enrolled.json');
  const j = JSON.parse(readFileSync(p, 'utf8'));
  if (!j.slugs.includes('rollermazeescape')) {
    const idx = j.slugs.findIndex((s) => s > 'rollermazeescape');
    j.slugs.splice(idx === -1 ? j.slugs.length : idx, 0, 'rollermazeescape');
    writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
    console.log('enrolled rollermazeescape');
  }
}
console.log('fire156 registries ready');
