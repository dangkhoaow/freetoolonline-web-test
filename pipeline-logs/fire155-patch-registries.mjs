#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.ROOT || join(__dirname, '..');
function patch(file, ...replacements) {
  const p = join(ROOT, file);
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/quantum-shift.html') && !file.includes('header-pictogram')) {
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
  // game-discovery-loop-runbook fire155 (2026-07-19): quantum-shift companion guides
  '/guides/how-to-play-quantum-shift.html',
  '/guides/quantum-shift-when.html',
  '/guides/quantum-shift-vs-alternatives.html',
  '/guides/pt/how-to-play-quantum-shift.html',
  '/guides/pt/quantum-shift-when.html',
  '/guides/pt/quantum-shift-vs-alternatives.html',
  '/guides/es/how-to-play-quantum-shift.html',
  '/guides/es/quantum-shift-when.html',
  '/guides/es/quantum-shift-vs-alternatives.html',
  '/guides/vi/how-to-play-quantum-shift.html',
  '/guides/vi/quantum-shift-when.html',
  '/guides/vi/quantum-shift-vs-alternatives.html',
  '/guides/id/how-to-play-quantum-shift.html',
  '/guides/id/quantum-shift-when.html',
  '/guides/id/quantum-shift-vs-alternatives.html',
  '/guides/de/how-to-play-quantum-shift.html',
  '/guides/de/quantum-shift-when.html',
  '/guides/de/quantum-shift-vs-alternatives.html',
`;
const guideJsp = `
  // game-discovery-loop-runbook fire155 (2026-07-19): quantum-shift companion guides
  '/guides/how-to-play-quantum-shift.html': 'guide/how-to-play-quantum-shift.jsp',
  '/guides/quantum-shift-when.html': 'guide/quantum-shift-when.jsp',
  '/guides/quantum-shift-vs-alternatives.html': 'guide/quantum-shift-vs-alternatives.jsp',
  '/guides/pt/how-to-play-quantum-shift.html': 'guide/pt/how-to-play-quantum-shift.jsp',
  '/guides/pt/quantum-shift-when.html': 'guide/pt/quantum-shift-when.jsp',
  '/guides/pt/quantum-shift-vs-alternatives.html': 'guide/pt/quantum-shift-vs-alternatives.jsp',
  '/guides/es/how-to-play-quantum-shift.html': 'guide/es/how-to-play-quantum-shift.jsp',
  '/guides/es/quantum-shift-when.html': 'guide/es/quantum-shift-when.jsp',
  '/guides/es/quantum-shift-vs-alternatives.html': 'guide/es/quantum-shift-vs-alternatives.jsp',
  '/guides/vi/how-to-play-quantum-shift.html': 'guide/vi/how-to-play-quantum-shift.jsp',
  '/guides/vi/quantum-shift-when.html': 'guide/vi/quantum-shift-when.jsp',
  '/guides/vi/quantum-shift-vs-alternatives.html': 'guide/vi/quantum-shift-vs-alternatives.jsp',
  '/guides/id/how-to-play-quantum-shift.html': 'guide/id/how-to-play-quantum-shift.jsp',
  '/guides/id/quantum-shift-when.html': 'guide/id/quantum-shift-when.jsp',
  '/guides/id/quantum-shift-vs-alternatives.html': 'guide/id/quantum-shift-vs-alternatives.jsp',
  '/guides/de/how-to-play-quantum-shift.html': 'guide/de/how-to-play-quantum-shift.jsp',
  '/guides/de/quantum-shift-when.html': 'guide/de/quantum-shift-when.jsp',
  '/guides/de/quantum-shift-vs-alternatives.html': 'guide/de/quantum-shift-vs-alternatives.jsp',
`;
patch('scripts/site-data.mjs',
  [`  '/guides/de/thirteen-hours-vs-alternatives.html',\n`, `  '/guides/de/thirteen-hours-vs-alternatives.html',\n${guideRoutes}`],
  [`  '/thirteen-hours.html': '/games/thirteen-hours.html',\n`, `  '/thirteen-hours.html': '/games/thirteen-hours.html',\n  '/quantum-shift.html': '/games/quantum-shift.html',\n`],
  [`  '/guides/de/thirteen-hours-vs-alternatives.html': 'guide/de/thirteen-hours-vs-alternatives.jsp',\n`, `  '/guides/de/thirteen-hours-vs-alternatives.html': 'guide/de/thirteen-hours-vs-alternatives.jsp',\n${guideJsp}`],
  [`  '/games/thirteen-hours.html': 'games/thirteen-hours.jsp',\n`, `  '/games/thirteen-hours.html': 'games/thirteen-hours.jsp',\n  '/games/quantum-shift.html': 'games/quantum-shift.jsp',\n`],
);
{
  const p = join(ROOT, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/quantum-shift.html')) console.log('already patched', p);
  else {
    const needle = "'/games/thirteen-hours.html']";
    if (!s.includes(needle)) throw new Error('seo-clusters missing thirteen-hours tail');
    s = s.replace(needle, "'/games/thirteen-hours.html', '/games/quantum-shift.html']");
    writeFileSync(p, s, 'utf8');
    console.log('patched', p);
  }
}
patch('source/web/src/main/webapp/static/script/related-tools.js',
  [`{ title: "Thirteen Hours", url: "https://freetoolonline.com/games/thirteen-hours.html", include: !1, tags: "games" },`, `{ title: "Thirteen Hours", url: "https://freetoolonline.com/games/thirteen-hours.html", include: !1, tags: "games" },\n    { title: "Quantum Shift", url: "https://freetoolonline.com/games/quantum-shift.html", include: !1, tags: "games" },`],
);
patch('source/static/src/main/webapp/resources/view/l-menu.html',
  [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/thirteen-hours.html'>Thirteen Hours (Clock Chain Puzzle)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/thirteen-hours.html'>Thirteen Hours (Clock Chain Puzzle)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/quantum-shift.html'>Quantum Shift (Particle Puzzle)</a>`],
);
{
  const p = join(ROOT, 'scripts/header-pictogram-enrolled.json');
  const j = JSON.parse(readFileSync(p, 'utf8'));
  if (!j.slugs.includes('quantumshift')) {
    const idx = j.slugs.findIndex((s) => s > 'quantumshift');
    j.slugs.splice(idx === -1 ? j.slugs.length : idx, 0, 'quantumshift');
    writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
    console.log('enrolled quantumshift');
  }
}
console.log('fire155 registries ready');
