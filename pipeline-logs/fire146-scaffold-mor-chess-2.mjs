#!/usr/bin/env node
/** fire146: scaffold mor-chess-2 CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..'); // web-test
const SKILL = join(ROOT, '..', '.agent/skills/tool-morchess2');
const DATE = '2026-07-18';
const SIZE = '~13 KB';

const JSP = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/functions' prefix='fn' %>
<freetoolonline:page
customStyle='\${pageStyle}'
browserTitle='\${pageBodyTitle}'
keyword='\${pageBodyKeyword}'
description='\${pageBodyDesc}'>

<freetoolonline:loading/>
\${pageBodyHTML}
<freetoolonline:welcome welcomeTest='\${pageBodyWelcome}'/>
<freetoolonline:share-btns></freetoolonline:share-btns>
\${pageBodyJS}
</freetoolonline:page>
`;

function w(rel, content) {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, 'utf8');
}
function cmsTxt(slug, prefix, text) {
  w(`source/static/src/main/webapp/resources/view/CMS/${prefix}${slug}.txt`, text + '\n');
}
function cmsHtml(slug, prefix, html) {
  w(`source/static/src/main/webapp/resources/view/CMS/${prefix}${slug}.html`, html + '\n');
}

const FAQ_STYLE = `<style>
    details.faq-item { margin: 8px 0; border-bottom: 1px solid #e0e0e0; padding: 6px 0; }
    details.faq-item > summary { list-style: none; cursor: pointer; padding: 8px 0 8px 28px; position: relative; font-weight: 600; }
    details.faq-item > summary::-webkit-details-marker { display: none; }
    details.faq-item > summary::before { content: '>'; position: absolute; left: 8px; top: 8px; transition: transform 0.15s ease; color: #555; font-size: 0.9em; }
    details.faq-item[open] > summary::before { transform: rotate(90deg); }
    details.faq-item > p, details.faq-item > div { padding: 0 8px 8px 28px; margin: 0; }
</style>`;

cmsTxt('morchess2', 'BODYTITLE', 'Mor Chess 2 - Free Online Chess Positional Puzzle Game');
cmsTxt('morchess2', 'BODYDESC', 'Mor Chess 2 - free browser chess puzzle: pick named positional ideas each turn to build a strong position against Black Cat, about 13 KB, no install.');
cmsTxt('morchess2', 'BODYKW', 'mor chess 2 game, chess puzzle browser game, chess positional trainer online, black cat chess game, js13k black cat game');

cmsHtml('morchess2', 'BODYHTML', `<div class="w3-container">
    <p>Mor Chess 2 is a free browser chess puzzle: instead of dragging pieces move by move, you pick from a short menu of named positional ideas (fianchetto, rook lift, knight outpost, pawn chain, king safety, and more) each turn, and the game plays that idea out on the board against an opponent called Black Cat. A stronger sequence of choices raises your position's evaluation and your chances of forcing checkmate. About ${SIZE}, no install, no account.</p>
    <p>Want a different kind of puzzle instead? Try <a href="/games/mystic-card-paw.html">Mystic Card Paw</a>.</p>
</div>

<div id="mc2Wrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="mc2Stage" style="position:relative; width:100%; aspect-ratio:16/9; min-height:380px; background:#1d2b53; border-radius:6px; overflow:hidden;">
            <div id="mc2Launch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#ff6b81;">MOR CHESS 2</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Pick positional ideas each turn and out-plan an opponent called Black Cat. From Mor Chess 2 by eguneys (MIT, JS13K). About ${SIZE}, downloads once when you press Play.</p>
                <button id="mc2PlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Mouse or touch only - click or tap to pick a choice, no keyboard needed.</p>
            </div>
        </div>
        <div id="mc2Status" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="mc2FullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Session-only play - no save data in this build.</span>
    </div>
    <style>
        #mc2Stage:fullscreen { border-radius: 0; }
        #mc2Stage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('morchess2', 'BODYWELCOME', `<p>Welcome to Mor Chess 2 - a free browser chess puzzle you can play without an account or install. Press Play to load the ${SIZE} game in a same-origin iframe. Each turn shows a short menu of named positional ideas (for example, a knight outpost, a bishop fianchetto, a rook lift, or a pawn chain); click one to play it out on the board against an opponent called Black Cat. A better evaluation - built from stronger positional choices - raises your chances of finding a checkmate. Click or tap is the only input; no keyboard is needed. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('morchess2', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var MC2_GAME_URL = 'mor-chess-2/index.html';
    function mc2Status(text) {
        var el = document.getElementById('mc2Status');
        if (el) el.textContent = text;
    }
    function mc2InjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'mc2Frame';
        frame.src = MC2_GAME_URL;
        frame.title = 'Mor Chess 2 game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            mc2Status('Game loaded. Click a choice to make your first move.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('mc2Launch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('mc2Stage');
        var playBtn = document.getElementById('mc2PlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('mc2FullscreenBtn');
        playBtn.addEventListener('click', function () {
            mc2Status('Loading the game (about 13 KB, one time - then cached)...');
            mc2InjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('mc2Frame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('morchess2', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Mor Chess 2?</summary><p>A free browser chess puzzle where you build a position by picking named positional ideas each turn - fianchettos, outposts, rook lifts, pawn chains, king safety, and more - against an opponent called Black Cat.</p></details>
<details class="faq-item"><summary>Do I need to know how to move chess pieces?</summary><p>No dragging or manual piece moves. You click a labeled choice from a short menu each turn, and the game plays that idea out on the board for you.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>Mouse or touch only - click or tap a choice. No keyboard is needed.</p></details>
<details class="faq-item"><summary>What is the goal?</summary><p>Build a strong position through good positional choices. A better evaluation raises your chances of finding a checkmate against Black Cat.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>This build is session-only. There is no save data. Closing the tab resets the game.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of HTML, JavaScript, and CSS after you press Play - one of the smallest games on this site. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from Mor Chess 2 by eguneys (Emre Guneyler) - a js13kGames 2025 Black Cat theme entry - under the MIT license. This site build adds noindex on the engine page and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/mor-chess-2.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Mor Chess 2 - Step by Step</b></h1>
<p>The <a href="/games/mor-chess-2.html">Mor Chess 2</a> page loads a ${SIZE} chess positional puzzle in an iframe.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Play, then click a labeled choice each turn to build your position.</b></p></div>
<h2><b>Step 1 - press Play</b></h2><p>Press Play to inject the iframe (${SIZE}). The board and a menu of positional choices appear immediately - no separate title screen to click through.</p>
<h2><b>Step 2 - read the choices</b></h2><p>Each turn shows a short list of named positional ideas for your pieces - for example a knight outpost, a bishop fianchetto, a rook on an open file, or a pawn chain.</p>
<h2><b>Step 3 - click a choice</b></h2><p>Click or tap the idea you want to play. The game carries out that move on the board for you - there is no manual piece dragging.</p>
<h2><b>Step 4 - watch your evaluation</b></h2><p>Stronger, better-timed choices raise your position's evaluation. A better evaluation increases your chances of finding a checkmate against Black Cat.</p>
<h2><b>Step 5 - reach checkmate or replay</b></h2><p>The game announces either "Player wins" or "Black Cat wins" on the board when the game ends. Reload the page to try a fresh sequence of choices.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>HTML + JS + CSS, no images</td></tr><tr><td>Input</td><td>mouse/touch only</td><td>click a choice, no dragging</td></tr><tr><td>Saves</td><td>none</td><td>session-only</td></tr><tr><td>Opponent</td><td>Black Cat</td><td>fixed in-engine name</td></tr></table>
<p>See <a href="/guides/mor-chess-2-when.html">when to play</a>, <a href="/guides/mor-chess-2-vs-alternatives.html">comparisons</a>, and <a href="/games/mystic-card-paw.html">Mystic Card Paw</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Mor Chess 2 Online</b></h1>
<p><a href="/games/mor-chess-2.html">Mor Chess 2</a> fits short breaks where you want a chess-flavored puzzle without needing to know full chess notation or piece-by-piece move rules - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>When you like chess ideas but not manual play</b></h2><p>Picking labeled positional ideas (fianchetto, outpost, rook lift) instead of dragging individual pieces suits a quick, low-friction session.</p>
<h2><b>When you want a tiny, instant-load game</b></h2><p>At about ${SIZE}, Mor Chess 2 is one of the smallest downloads on this site - it loads almost instantly even on a slow connection.</p>
<h2><b>When to pick another game</b></h2><p>Want a card-based puzzle instead? Use <a href="/games/mystic-card-paw.html">Mystic Card Paw</a>. Want a 3-in-1 arcade bundle? Use <a href="/games/darkline-paws.html">DarkLine Paws</a>.</p>
<p>See <a href="/guides/how-to-play-mor-chess-2.html">how to play</a> and <a href="/guides/mor-chess-2-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Mor Chess 2 vs Alternatives Compared</b></h1>
<p><a href="/games/mor-chess-2.html">Mor Chess 2</a> is a choice-driven chess positional puzzle. Compare it with two other free browser puzzle-style games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Mor Chess 2</td><td>${SIZE}</td><td>Click/tap a positional choice</td><td>none (session)</td></tr>
<tr><td><a href="/games/mystic-card-paw.html">Mystic Card Paw</a></td><td>~36 KB</td><td>Click/tap poker actions</td><td>ftol:mysticcardpaw:highScore</td></tr>
<tr><td><a href="/games/darkline-paws.html">DarkLine Paws</a></td><td>~36 KB</td><td>Keyboard + click (3 modes)</td><td>none (session)</td></tr>
</table>
<p>Pick Mor Chess 2 for a chess-themed positional puzzle with no manual piece dragging. Pick Mystic Card Paw for a card-based puzzle. Pick DarkLine Paws for three unrelated arcade modes in one download.</p>
<p>See <a href="/guides/how-to-play-mor-chess-2.html">how to play</a> and <a href="/guides/mor-chess-2-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-mor-chess-2', slug: 'guideshowtoplaymorchess2', enTitle: 'How to Play Mor Chess 2 - Step by Step', enDesc: 'How to play Mor Chess 2: click positional choices, build your evaluation, checkmate an opponent called Black Cat, ~13 KB browser game.', html: howToEn },
  { route: 'mor-chess-2-when', slug: 'guidesmorchess2when', enTitle: 'When to Play Mor Chess 2 Online', enDesc: 'When Mor Chess 2 fits: chess ideas without manual piece play, a tiny ~13 KB instant-load puzzle.', html: whenEn },
  { route: 'mor-chess-2-vs-alternatives', slug: 'guidesmorchess2vsalternatives', enTitle: 'Mor Chess 2 vs Alternatives Compared', enDesc: 'Compare Mor Chess 2 with Mystic Card Paw and DarkLine Paws - download size, input, saves.', html: vsEn },
];

const locales = [
  { code: '', prefix: '' },
  { code: 'pt', prefix: 'pt' },
  { code: 'es', prefix: 'es' },
  { code: 'vi', prefix: 'vi' },
  { code: 'id', prefix: 'id' },
  { code: 'de', prefix: 'de' },
];

for (const g of guides) {
  for (const loc of locales) {
    const routePath = loc.prefix ? `/guides/${loc.prefix}/${g.route}.html` : `/guides/${g.route}.html`;
    const jspPath = loc.prefix ? `guide/${loc.prefix}/${g.route}.jsp` : `guide/${g.route}.jsp`;
    w(`source/web/src/main/webapp/WEB-INF/jsp/${jspPath}`, JSP);

    let cmsSlug;
    if (!loc.prefix) cmsSlug = g.slug;
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplaymorchess2`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}morchess2when`;
    else cmsSlug = `guides${loc.prefix}morchess2vsalternatives`;

    const howTitles = {
      pt: ['Como jogar Mor Chess 2', 'Como jogar Mor Chess 2: escolhas posicionais, avaliacao, xeque-mate contra Black Cat, ~13 KB.'],
      es: ['Como jugar Mor Chess 2', 'Como jugar Mor Chess 2: elecciones posicionales, evaluacion, jaque mate contra Black Cat, ~13 KB.'],
      vi: ['Cach choi Mor Chess 2', 'Huong dan Mor Chess 2: chon y tuong vi tri, tang danh gia, chieu tuong Black Cat, ~13 KB.'],
      id: ['Cara main Mor Chess 2', 'Panduan Mor Chess 2: pilih ide posisi, tingkatkan evaluasi, skakmat Black Cat, ~13 KB.'],
      de: ['Mor Chess 2 spielen', 'Mor Chess 2 spielen: Positionswahl, Bewertung steigern, Matt gegen Black Cat, ~13 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar Mor Chess 2', 'Quando Mor Chess 2 encaixa: ideias de xadrez sem mover pecas manualmente, ~13 KB.'],
      es: ['Cuando jugar Mor Chess 2', 'Cuando jugar Mor Chess 2: ideas de ajedrez sin mover piezas a mano, ~13 KB.'],
      vi: ['Khi nao choi Mor Chess 2', 'Khi nao choi Mor Chess 2: y tuong co vua khong can di quan tay, ~13 KB.'],
      id: ['Kapan main Mor Chess 2', 'Kapan main Mor Chess 2: ide catur tanpa menggerakkan bidak manual, ~13 KB.'],
      de: ['Wann Mor Chess 2 spielen', 'Wann Mor Chess 2 spielen: Schachideen ohne manuelle Zuege, ~13 KB.'],
    };
    const vsTitles = {
      pt: ['Mor Chess 2 vs alternativas', 'Compare Mor Chess 2 com Mystic Card Paw e DarkLine Paws.'],
      es: ['Mor Chess 2 vs alternativas', 'Compara Mor Chess 2 con Mystic Card Paw y DarkLine Paws.'],
      vi: ['Mor Chess 2 vs lua chon khac', 'So sanh Mor Chess 2 voi Mystic Card Paw va DarkLine Paws.'],
      id: ['Mor Chess 2 vs alternatif', 'Bandingkan Mor Chess 2 dengan Mystic Card Paw dan DarkLine Paws.'],
      de: ['Mor Chess 2 vs Alternativen', 'Mor Chess 2 vs Mystic Card Paw und DarkLine Paws vergleichen.'],
    };

    let title, desc;
    if (!loc.code) { title = g.enTitle; desc = g.enDesc; }
    else if (g.route.includes('how-to-play')) [title, desc] = howTitles[loc.code];
    else if (g.route.includes('when')) [title, desc] = whenTitles[loc.code];
    else [title, desc] = vsTitles[loc.code];

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser chess puzzle game on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/mor-chess-2.html">Mor Chess 2</a> laedt ein ${SIZE} Schach-Positionspuzzle im iframe: waehle jede Runde eine benannte positionelle Idee gegen einen Gegner namens Black Cat.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Kein manuelles Ziehen von Figuren, session-only (kein Speicherstand). Engine MIT (Mor Chess 2, eguneys, JS13K 2025).</p>
<p><a href="${routePath}">Diese Sprachversion</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/mor-chess-2.html">Mor Chess 2</a> loads a ${SIZE} chess positional puzzle in an iframe: pick a named positional idea each turn against an opponent called Black Cat.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>No manual piece dragging, session-only (no save data). Engine MIT (Mor Chess 2, eguneys, JS13K 2025).</p>
<p><a href="${routePath}">This locale guide</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-mc2-title svg-minipictogram-mc2-desc">
  <title id="svg-minipictogram-mc2-title">Mor Chess 2</title>
  <desc id="svg-minipictogram-mc2-desc">Chess knight silhouette on a checkered tile</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <rect x="14" y="14" width="18" height="18" fill="#5B73AE"/>
  <rect x="32" y="32" width="18" height="18" fill="#5B73AE"/>
  <path d="M24 46 L24 40 Q24 34 29 32 L27 26 Q27 22 31 21 Q35 20 36 24 L38 30 Q40 34 38 38 L40 46 Z" fill="#FFFFFF"/>
  <circle cx="33" cy="24" r="1.6" fill="#1C1C1E"/>
</svg>`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picRel = `source/web/src/main/webapp/static/img/illustrations/mini-pictogram/morchess2__${hash8}.svg`;
w(picRel, pictogramBody);
console.log('pictogram', picRel);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-morchess2
description: |
  Ground-truth for /games/mor-chess-2.html. Hand-authored 2026-07-18
  (game-discovery-loop-runbook fire146) from js13kGames/mor-chess-2
  (eguneys) at static/games/mor-chess-2/.
---

# tool-morchess2 - /games/mor-chess-2.html

## Identity

- **Route**: /games/mor-chess-2.html
- **Slug**: \`mor-chess-2\` (CMS: \`morchess2\`)
- **Cluster**: games
- **Aliases**: /mor-chess-2.html

## Reader task

Build a strong chess position by picking from a short menu of named positional ideas each turn (for example a knight outpost, a bishop fianchetto, a rook lift, or a pawn chain) instead of dragging individual pieces, aiming to raise an internal evaluation and force checkmate against an opponent called Black Cat.

## Processing model

**client-side-only** - single-file competition bundle (index.html + assets/index.min.js + assets/index-DctGsCWz.css, ~13.5 KB total, roadroller-packed js13k build), same-origin iframe. Canvas rendered at a fixed 1920x1080 internal resolution scaled to a 16:9 box via CSS; the app draws its own cursor (page CSS sets \`cursor:none\`). Input is pointer-only (a custom \`TouchMouse\` handler in the upstream source) - no keyboard is used anywhere. Zero CDN, zero localStorage/sessionStorage, zero fetch/XHR/WebSocket anywhere in the TypeScript source (verified by grepping the plaintext src/*.ts - the shipped bundle itself is roadroller-packed via \`eval(Function(...))\` self-decompression and is not directly greppable, so the source was the ground truth for this check). Page carries noindex; canonical URL is /games/mor-chess-2.html.

## License analysis

- Upstream: **js13kGames/mor-chess-2** (org mirror of eguneys' / Emre Guneyler's second js13kGames 2025 Black Cat theme entry), **MIT, Copyright (c) 2025 eguneys** (LICENSE vendored verbatim, verified via raw fetch).
- Important distinction: eguneys' FIRST 2025 entry, "Mor Chess" (repo eguneys/morchess_js13k_25), has **no LICENSE file** (GitHub API reports \`license: null\`) and was deliberately NOT used for this reason. Only "Mor Chess 2" (a separately-listed js13kgames.com/2025/games entry by the same author, hosted at js13kGames/mor-chess-2 with a real MIT LICENSE file) was vendored.
- Vendored the exact pre-built competition artifact from the repo's \`.website/game.zip\` (the already-built, roadroller-minified submission bundle) rather than re-running the Vite+TypeScript build locally - this guarantees byte-for-byte parity with what was actually judged/played and avoids any local build-environment risk.
- Original chess-positional-puzzle mechanic; standard chess piece movement/evaluation concepts are not copyrightable, and the game is not a copy or clone of any specific commercial chess product or UI.
- Adaptation: added \`<meta name="robots" content="noindex">\` to index.html. No other changes - asset references were already relative (\`./assets/...\`), so no path rewriting was needed.
- Clean ELIGIBLE; no operator adjudication needed.

## Reader-benefit framing menu

- V1: Turn-based choice menu of NAMED positional chess ideas (per-piece-type constants in the upstream source: knight outpost/flank/center/eye-king/invade, bishop fianchetto/pin/infiltrate, queen centralized/battery/infiltrate, rooks connected/open-file/7th-rank/lift, king castled/exposed/running, pawn chain/tension/space/thorn, and more) - no manual piece dragging.
- V2: An internal position evaluation rises or falls based on the strength of your choices; the in-engine hint text states "A better evaluation increases your chances to find checkmates."
- V3: The opponent is a fixed in-engine character named "Black Cat" (directly ties to the js13kGames 2025 "Black Cat" competition theme) - end-of-game text reads "Player wins." or "Black Cat wins." on the canvas.
- V4: Procedural Web Audio sound effects (no audio files) - the upstream source credits arikwex/infernal-sigil as the technique's inspiration in a code comment.
- V5: Pointer/touch-only input - click or tap a choice; nothing requires a keyboard.
- V6: About ${SIZE} total after Play - among the smallest games on this site (an actual sub-13KB js13k competition build, not just "inspired by" the size limit).
- V7: Session-only - no save data, no localStorage anywhere in the source.
- V8: Zero CDN, zero analytics, zero external fonts - fully offline-capable once cached.
- V9: Sequel/second entry to eguneys' original "Mor Chess" (which this site does NOT ship, due to its missing LICENSE file).
- V10: Adapted from Mor Chess 2 (MIT, eguneys, JS13K 2025 Black Cat theme); ships LICENSE + CREDITS.

## Implemented features

- Turn-based positional-choice chess puzzle engine with a large catalogue of named per-piece-type strategic ideas (see V1) driving an internal position evaluation.
- Canvas-drawn chessboard, pieces, and custom cursor at a fixed 1920x1080 internal resolution.
- Procedural Web Audio sound-effect synthesis (no audio asset files).
- Fixed named opponent ("Black Cat") with win/loss end-state text rendered directly on the canvas.

## Anti-claims

- Does NOT use a server backend, CDN, or fetch at runtime.
- Does NOT persist scores, evaluation, or progress between sessions (no localStorage anywhere in the source).
- Does NOT support manual piece dragging or free-form chess move input - all moves are made by selecting a named positional choice from a menu; this is a positional-pattern puzzle, not a full interactive chess-play interface.
- Is NOT the original "Mor Chess" (eguneys' first 2025 entry) - that repo has no LICENSE file and was not used. Mor Chess 2 is a separate, separately-licensed, separately-listed js13kgames.com/2025/games entry by the same author.
- Is NOT a clone of any specific commercial chess product or UI; basic chess piece movement and positional-concept terminology (fianchetto, outpost, pawn chain, etc.) are standard, uncopyrightable chess vocabulary.
- Does NOT require a keyboard; all input is pointer/touch-based.

## claim_catalogue_status

verified
`, 'utf8');

console.log('fire146 scaffold complete');
