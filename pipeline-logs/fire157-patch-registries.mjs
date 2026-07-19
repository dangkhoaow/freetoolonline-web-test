#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.ROOT || join(__dirname, '..');
function patch(file, ...replacements) {
  const p = join(ROOT, file);
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/thirteen-case-files.html') && !file.includes('header-pictogram')) {
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
  // game-discovery-loop-runbook fire157 (2026-07-20): thirteencasefiles companion guides
  '/guides/how-to-play-thirteen-case-files.html',
  '/guides/thirteen-case-files-when.html',
  '/guides/thirteen-case-files-vs-alternatives.html',
  '/guides/pt/how-to-play-thirteen-case-files.html',
  '/guides/pt/thirteen-case-files-when.html',
  '/guides/pt/thirteen-case-files-vs-alternatives.html',
  '/guides/es/how-to-play-thirteen-case-files.html',
  '/guides/es/thirteen-case-files-when.html',
  '/guides/es/thirteen-case-files-vs-alternatives.html',
  '/guides/vi/how-to-play-thirteen-case-files.html',
  '/guides/vi/thirteen-case-files-when.html',
  '/guides/vi/thirteen-case-files-vs-alternatives.html',
  '/guides/id/how-to-play-thirteen-case-files.html',
  '/guides/id/thirteen-case-files-when.html',
  '/guides/id/thirteen-case-files-vs-alternatives.html',
  '/guides/de/how-to-play-thirteen-case-files.html',
  '/guides/de/thirteen-case-files-when.html',
  '/guides/de/thirteen-case-files-vs-alternatives.html',
`;
const guideJsp = `
  // game-discovery-loop-runbook fire157 (2026-07-20): thirteencasefiles companion guides
  '/guides/how-to-play-thirteen-case-files.html': 'guide/how-to-play-thirteen-case-files.jsp',
  '/guides/thirteen-case-files-when.html': 'guide/thirteen-case-files-when.jsp',
  '/guides/thirteen-case-files-vs-alternatives.html': 'guide/thirteen-case-files-vs-alternatives.jsp',
  '/guides/pt/how-to-play-thirteen-case-files.html': 'guide/pt/how-to-play-thirteen-case-files.jsp',
  '/guides/pt/thirteen-case-files-when.html': 'guide/pt/thirteen-case-files-when.jsp',
  '/guides/pt/thirteen-case-files-vs-alternatives.html': 'guide/pt/thirteen-case-files-vs-alternatives.jsp',
  '/guides/es/how-to-play-thirteen-case-files.html': 'guide/es/how-to-play-thirteen-case-files.jsp',
  '/guides/es/thirteen-case-files-when.html': 'guide/es/thirteen-case-files-when.jsp',
  '/guides/es/thirteen-case-files-vs-alternatives.html': 'guide/es/thirteen-case-files-vs-alternatives.jsp',
  '/guides/vi/how-to-play-thirteen-case-files.html': 'guide/vi/how-to-play-thirteen-case-files.jsp',
  '/guides/vi/thirteen-case-files-when.html': 'guide/vi/thirteen-case-files-when.jsp',
  '/guides/vi/thirteen-case-files-vs-alternatives.html': 'guide/vi/thirteen-case-files-vs-alternatives.jsp',
  '/guides/id/how-to-play-thirteen-case-files.html': 'guide/id/how-to-play-thirteen-case-files.jsp',
  '/guides/id/thirteen-case-files-when.html': 'guide/id/thirteen-case-files-when.jsp',
  '/guides/id/thirteen-case-files-vs-alternatives.html': 'guide/id/thirteen-case-files-vs-alternatives.jsp',
  '/guides/de/how-to-play-thirteen-case-files.html': 'guide/de/how-to-play-thirteen-case-files.jsp',
  '/guides/de/thirteen-case-files-when.html': 'guide/de/thirteen-case-files-when.jsp',
  '/guides/de/thirteen-case-files-vs-alternatives.html': 'guide/de/thirteen-case-files-vs-alternatives.jsp',
`;
patch('scripts/site-data.mjs',
  [`  '/guides/de/roller-maze-escape-vs-alternatives.html',\n`, `  '/guides/de/roller-maze-escape-vs-alternatives.html',\n${guideRoutes}`],
  [`  '/roller-maze-escape.html': '/games/roller-maze-escape.html',\n`, `  '/roller-maze-escape.html': '/games/roller-maze-escape.html',\n  '/thirteen-case-files.html': '/games/thirteen-case-files.html',\n`],
  [`  '/guides/de/roller-maze-escape-vs-alternatives.html': 'guide/de/roller-maze-escape-vs-alternatives.jsp',\n`, `  '/guides/de/roller-maze-escape-vs-alternatives.html': 'guide/de/roller-maze-escape-vs-alternatives.jsp',\n${guideJsp}`],
  [`  '/games/roller-maze-escape.html': 'games/roller-maze-escape.jsp',\n`, `  '/games/roller-maze-escape.html': 'games/roller-maze-escape.jsp',\n  '/games/thirteen-case-files.html': 'games/thirteen-case-files.jsp',\n`],
);
{
  const p = join(ROOT, 'scripts/seo-clusters.mjs');
  let s = readFileSync(p, 'utf8');
  if (s.includes('/games/thirteen-case-files.html')) console.log('already patched', p);
  else {
    const needle = "'/games/roller-maze-escape.html']";
    if (!s.includes(needle)) throw new Error('seo-clusters missing rollermaze tail');
    s = s.replace(needle, "'/games/roller-maze-escape.html', '/games/thirteen-case-files.html']");
    writeFileSync(p, s, 'utf8');
    console.log('patched', p);
  }
}
patch('source/web/src/main/webapp/static/script/related-tools.js',
  [`{ title: "Rollermaze", url: "https://freetoolonline.com/games/roller-maze-escape.html", include: !1, tags: "games" },`, `{ title: "Rollermaze", url: "https://freetoolonline.com/games/roller-maze-escape.html", include: !1, tags: "games" },\n    { title: "Thirteen Case Files", url: "https://freetoolonline.com/games/thirteen-case-files.html", include: !1, tags: "games" },`],
);
patch('source/static/src/main/webapp/resources/view/l-menu.html',
  [`<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/roller-maze-escape.html'>Rollermaze (Maze Escape)</a>`, `<a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/roller-maze-escape.html'>Rollermaze (Maze Escape)</a>\n                <a class='w3-bar-item w3-button' href='https://freetoolonline.com/games/thirteen-case-files.html'>Thirteen Case Files (Detective Puzzle)</a>`],
);
{
  const p = join(ROOT, 'scripts/header-pictogram-enrolled.json');
  const j = JSON.parse(readFileSync(p, 'utf8'));
  if (!j.slugs.includes('thirteencasefiles')) {
    const idx = j.slugs.findIndex((s) => s > 'thirteencasefiles');
    j.slugs.splice(idx === -1 ? j.slugs.length : idx, 0, 'thirteencasefiles');
    writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
    console.log('enrolled thirteencasefiles');
  }
}
{
  const cf = join(ROOT, '../freetoolonline-frontend/seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js');
  try {
    let s = readFileSync(cf, 'utf8');
    if (!s.includes('/thirteen-case-files.html')) {
      const needle = '  "/roller-maze-escape.html": "/games/roller-maze-escape.html",';
      if (s.includes(needle)) {
        s = s.replace(needle, `${needle}\n  "/thirteen-case-files.html": "/games/thirteen-case-files.html",`);
        writeFileSync(cf, s, 'utf8');
        console.log('patched cloudfront alias');
      }
    }
  } catch (e) {
    console.log('cloudfront alias skip', e.message);
  }
}
console.log('fire157 registries ready');
