#!/usr/bin/env node
/** fire129: scaffold pipe-rotate-puzzle CMS + guide bundle (staging only) */
import { writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GAME = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/games');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');
const PICTO = join(ROOT, 'source/web/src/main/webapp/static/img/illustrations/mini-pictogram');
const SKILL = join(ROOT, '..', '.agent/skills/tool-piperotatepuzzle');

const JSP_WRAPPER = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/functions' prefix='fn' %>
<freetoolonline:page
\tcustomStyle='\${pageStyle}'
\tbrowserTitle='\${pageBodyTitle}'
\tkeyword='\${pageBodyKeyword}'
\tdescription='\${pageBodyDesc}'>

\t<freetoolonline:loading/>
\t\${pageBodyHTML}
\t<freetoolonline:welcome welcomeTest='\${pageBodyWelcome}'/>
\t<freetoolonline:share-btns></freetoolonline:share-btns>
\t\${pageBodyJS}
</freetoolonline:page>
`;

function w(rel, content) {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, 'utf8');
  return p;
}

function cmsTxt(slug, prefix, text) {
  w(`source/static/src/main/webapp/resources/view/CMS/${prefix}${slug}.txt`, text + '\n');
}
function cmsHtml(slug, prefix, html) {
  w(`source/static/src/main/webapp/resources/view/CMS/${prefix}${slug}.html`, html + '\n');
}

// --- Game CMS ---
cmsTxt('piperotatepuzzle', 'BODYTITLE', 'Pipe Rotate Puzzle - Free Online Pipe Link Game');
cmsTxt('piperotatepuzzle', 'BODYDESC', 'Pipe Rotate Puzzle - free browser pipe link game: rotate tiles to connect every pipe from the power source. Olive or light theme, undo, ~32 KB, no install.');
cmsTxt('piperotatepuzzle', 'BODYKW', 'pipe rotate puzzle, pipe link game, rotate connect puzzle, browser pipe puzzle, free online pipe game');

cmsHtml('piperotatepuzzle', 'BODYHTML', `<div class="w3-container">
    <p>Pipe Rotate Puzzle is a minimal pipe-link game in the browser: tap or click tiles to rotate them until every pipe connects from the power source. Grid grows with level (3x3 up to 7x7). About ~32 KB after Play, no install, no account.</p>
    <p>Prefer a sliding tile puzzle? Try <a href="/games/cyber-slide-puzzle.html">Cyber Slide Puzzle</a>.</p>
</div>

<div id="prpWrapper" class="w3-container" style="background:#fafafa; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="prpStage" style="position:relative; width:100%; aspect-ratio:4/5; min-height:480px; background:#1a1f1c; border-radius:6px; overflow:hidden;">
            <div id="prpLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#e6ece4; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#b8c9b3;">PIPE ROTATE PUZZLE</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#8f9b94;">Rotate pipe tiles to link every cell from the power source. From pipzzle by kiy995 (MIT). About ~32 KB downloads once when you press Play. Level and theme stay in your browser.</p>
                <button id="prpPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#8f9b94; max-width:480px; margin-top:12px;">Tap or click a tile to rotate it 90 degrees. R reset board, U undo, N new game (clears level progress). Settings drawer for olive or light theme. Works on touch screens.</p>
            </div>
        </div>
        <div id="prpStatus" style="font:400 14px sans-serif; color:#333; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="prpFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#555; margin-left:8px;">Saves use ftol:piperotatepuzzle:theme and ftol:piperotatepuzzle:level.</span>
    </div>
    <style>
        #prpStage:fullscreen { border-radius: 0; }
        #prpStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('piperotatepuzzle', 'BODYWELCOME', `<p>Welcome - press Play to load Pipe Rotate Puzzle. Theme and level progress use ftol:piperotatepuzzle:* keys in localStorage.</p>`);

cmsHtml('piperotatepuzzle', 'BODYJS', `<script>
    web.localUpload = false;
    var PRP_GAME_URL = 'pipe-rotate-puzzle/index.html';
    function prpStatus(text) {
        var el = document.getElementById('prpStatus');
        if (el) el.textContent = text;
    }
    function prpInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'prpFrame';
        frame.src = PRP_GAME_URL;
        frame.title = 'Pipe Rotate Puzzle game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            prpStatus('Game loaded. Tap tiles to rotate. R reset, U undo, N new game. Open settings for theme.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('prpLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('prpStage');
        var playBtn = document.getElementById('prpPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('prpFullscreenBtn');
        playBtn.addEventListener('click', function () {
            prpStatus('Loading the game (about 32 KB, one time - then cached)...');
            prpInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('prpFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('piperotatepuzzle', 'FAQ', `<style>
    details.faq-item { margin: 8px 0; border-bottom: 1px solid #e0e0e0; padding: 6px 0; }
    details.faq-item > summary { list-style: none; cursor: pointer; padding: 8px 0 8px 28px; position: relative; font-weight: 600; }
    details.faq-item > summary::-webkit-details-marker { display: none; }
    details.faq-item > summary::before { content: '>'; position: absolute; left: 8px; top: 8px; transition: transform 0.15s ease; color: #555; font-size: 0.9em; }
    details.faq-item[open] > summary::before { transform: rotate(90deg); }
    details.faq-item > summary:hover { color: #1a73e8; }
    details.faq-item > p, details.faq-item > div { padding: 0 8px 8px 28px; margin: 0; }
</style>
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What does Pipe Rotate Puzzle do?</summary><p>You rotate pipe tiles on a grid until every cell connects to the power source. Locked tiles unlock when power reaches them. Completing a board advances the level and grows the grid up to 7x7.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>Yes. Tap a tile to rotate it. The layout is touch-friendly. Keyboard shortcuts R, U, and N work on desktop.</p></details>
<details class="faq-item"><summary>Is anything saved in my browser?</summary><p>Yes. Theme uses <code>ftol:piperotatepuzzle:theme</code> (olive or light). Level progress uses <code>ftol:piperotatepuzzle:level</code>. New game clears level progress. Nothing is uploaded.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ~32 KB of HTML and JS after you press Play. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>How do I play?</summary><p>Click or tap a tile to rotate 90 degrees. Connect all pipes from the source. R resets the current board rotations. U undoes the last rotation. N starts a new game from level 1. Open settings for theme and keyboard help.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from pipzzle by kiy995 (kiy995/pipzzle) under the MIT license. This site build namespaces localStorage and ships LICENSE next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/pipe-rotate-puzzle.jsp', JSP_WRAPPER.replace(/\t/g, ''));

// --- Guides EN ---
const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Pipe Rotate Puzzle - Step by Step</b></h1>
<p>The <a href="/games/pipe-rotate-puzzle.html">Pipe Rotate Puzzle</a> page loads a ~32 KB pipe-link grid in an iframe. Rotate tiles until every pipe connects. Press Play to start.</p>
<p><time itemprop="dateReviewed" datetime="2026-07-18">Last reviewed: 2026-07-18</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Tap or click tiles to rotate 90 degrees. R reset board, U undo, N new game. Saves: ftol:piperotatepuzzle:theme and ftol:piperotatepuzzle:level.</b></p></div>
<h2><b>Step 1 - press Play</b></h2><p>Press Play to inject the iframe (~32 KB). The engine opens on level 1 with a 3x3 grid. Upstream is pipzzle by kiy995 (MIT).</p>
<h2><b>Step 2 - find the source</b></h2><p>One tile is the power source (filled dot). Powered pipes glow when connected. Rotate neighbors until power flows through every cell.</p>
<h2><b>Step 3 - rotate tiles</b></h2><p>Click or tap any unlocked tile to rotate it 90 degrees. Locked tiles (lock icon) unlock when power reaches them. Use undo if you mis-rotate.</p>
<h2><b>Step 4 - complete the grid</b></h2><p>When every tile is powered, the level completes and the next board loads with a larger grid at higher levels (up to 7x7). Progress saves under ftol:piperotatepuzzle:level.</p>
<h2><b>Step 5 - settings and shortcuts</b></h2><p>Open the gear icon for theme (olive or light). Keyboard: R reset current board, U undo, N new game from level 1, Escape closes settings.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>~32 KB</td><td>HTML + JS + favicon</td></tr><tr><td>Grid</td><td>3x3 to 7x7</td><td>grows with level</td></tr><tr><td>Saves</td><td>localStorage</td><td>ftol:piperotatepuzzle:*</td></tr><tr><td>Server calls</td><td>0</td><td>Client-side only</td></tr></table>
<p>See <a href="/guides/pipe-rotate-puzzle-when.html">when to play</a>, <a href="/guides/pipe-rotate-puzzle-vs-alternatives.html">comparisons</a>, and <a href="/games/cyber-slide-puzzle.html">Cyber Slide Puzzle</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Pipe Rotate Puzzle</b></h1>
<p><a href="/games/pipe-rotate-puzzle.html">Pipe Rotate Puzzle</a> fits quiet logic breaks where you want a pipe-link grid without timers or ads - about ~32 KB after Play.</p>
<p><time itemprop="dateReviewed" datetime="2026-07-18">Last reviewed: 2026-07-18</time></p>
<h2><b>Short logic rounds</b></h2><p>Each board is a self-contained rotate-to-connect puzzle. Undo mistakes with U and pick up level progress later from ftol:piperotatepuzzle:level.</p>
<h2><b>Touch-friendly pipe grids</b></h2><p>Tap tiles on a phone during a commute. Olive and light themes reduce eye strain for longer sessions.</p>
<h2><b>When to pick another game</b></h2><p>Want sliding tiles? Use <a href="/games/cyber-slide-puzzle.html">Cyber Slide Puzzle</a>. Want hex rotation? Use <a href="/games/hex-puzzle-blocks.html">Hex Puzzle Blocks</a>.</p>
<p>See <a href="/guides/how-to-play-pipe-rotate-puzzle.html">how to play</a> and <a href="/guides/pipe-rotate-puzzle-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Pipe Rotate Puzzle vs Alternatives</b></h1>
<p><a href="/games/pipe-rotate-puzzle.html">Pipe Rotate Puzzle</a> is a rotate-to-connect pipe grid with growing levels. Compare it with two other free browser puzzle games on this site.</p>
<p><time itemprop="dateReviewed" datetime="2026-07-18">Last reviewed: 2026-07-18</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save</th></tr>
<tr><td>Pipe Rotate Puzzle</td><td>~32 KB</td><td>Tap / click rotate</td><td>ftol:piperotatepuzzle:level</td></tr>
<tr><td><a href="/games/cyber-slide-puzzle.html">Cyber Slide Puzzle</a></td><td>~45 KB</td><td>Slide tiles</td><td>ftol:cyberslidepuzzle:best</td></tr>
<tr><td><a href="/games/hex-puzzle-blocks.html">Hex Puzzle Blocks</a></td><td>~120 KB</td><td>Keyboard rotate</td><td>local best score</td></tr>
</table>
<p>Pick Pipe Rotate Puzzle for pipe-link rotation logic. Pick Cyber Slide Puzzle for sliding block rearrangement. Pick Hex Puzzle Blocks for fast hex stacking reflex.</p>
<p>See <a href="/guides/how-to-play-pipe-rotate-puzzle.html">how to play</a> and <a href="/guides/pipe-rotate-puzzle-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-pipe-rotate-puzzle', slug: 'guideshowtoplaypiperotatepuzzle', enTitle: 'How to Play Pipe Rotate Puzzle - Step by Step', enDesc: 'How to play Pipe Rotate Puzzle: rotate pipe tiles, connect the grid, undo, themes, ~32 KB, local saves.', html: howToEn },
  { route: 'pipe-rotate-puzzle-when', slug: 'guidespiperotatepuzzlewhen', enTitle: 'When to Play Pipe Rotate Puzzle', enDesc: 'When Pipe Rotate Puzzle fits: quiet pipe-link logic breaks, touch-friendly grids, ~32 KB browser play.', html: whenEn },
  { route: 'pipe-rotate-puzzle-vs-alternatives', slug: 'guidespiperotatepuzzlevsalternatives', enTitle: 'Pipe Rotate Puzzle vs Alternatives', enDesc: 'Compare Pipe Rotate Puzzle with Cyber Slide Puzzle and Hex Puzzle Blocks - download size, input, saves.', html: vsEn },
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
    w(`source/web/src/main/webapp/WEB-INF/jsp/${jspPath}`, JSP_WRAPPER.replace(/\t/g, ''));

    let cmsSlug;
    if (!loc.prefix) {
      cmsSlug = g.slug;
    } else if (g.route === 'how-to-play-pipe-rotate-puzzle') {
      cmsSlug = `guides${loc.prefix}howtoplaypiperotatepuzzle`;
    } else if (g.route === 'pipe-rotate-puzzle-when') {
      cmsSlug = `guides${loc.prefix}piperotatepuzzlewhen`;
    } else {
      cmsSlug = `guides${loc.prefix}piperotatepuzzlevsalternatives`;
    }

    const titles = {
      '': [g.enTitle, g.enDesc],
      pt: [`Como jogar Pipe Rotate Puzzle`, `Como jogar Pipe Rotate Puzzle: gire tubos, conecte a grade, desfazer, ~32 KB.`],
      es: [`Como jugar Pipe Rotate Puzzle`, `Como jugar Pipe Rotate Puzzle: gira tuberias, conecta la cuadricula, ~32 KB.`],
      vi: [`Cach choi Pipe Rotate Puzzle`, `Huong dan Pipe Rotate Puzzle: xoay ong, noi luoi, hoan tac, ~32 KB.`],
      id: [`Cara main Pipe Rotate Puzzle`, `Panduan Pipe Rotate Puzzle: putar pipa, hubungkan grid, undo, ~32 KB.`],
      de: [`Pipe Rotate Puzzle spielen`, `Pipe Rotate Puzzle spielen: Rohre drehen, Raster verbinden, ~32 KB, lokale Speicher.`],
    };
    const whenTitles = {
      pt: [`Quando jogar Pipe Rotate Puzzle`, `Quando Pipe Rotate Puzzle encaixa: pausas de logica com tubos, ~32 KB.`],
      es: [`Cuando jugar Pipe Rotate Puzzle`, `Cuando jugar Pipe Rotate Puzzle: pausas de logica con tuberias, ~32 KB.`],
      vi: [`Khi nao choi Pipe Rotate Puzzle`, `Khi nao choi Pipe Rotate Puzzle: giai do nghi ngoi ong, ~32 KB.`],
      id: [`Kapan main Pipe Rotate Puzzle`, `Kapan main Pipe Rotate Puzzle: istirahat logika pipa, ~32 KB.`],
      de: [`Wann Pipe Rotate Puzzle spielen`, `Wann Pipe Rotate Puzzle spielen: ruhige Rohr-Logik, ~32 KB.`],
    };
    const vsTitles = {
      pt: [`Pipe Rotate Puzzle vs alternativas`, `Compare Pipe Rotate Puzzle com Cyber Slide Puzzle e Hex Puzzle Blocks.`],
      es: [`Pipe Rotate Puzzle vs alternativas`, `Compara Pipe Rotate Puzzle con Cyber Slide Puzzle y Hex Puzzle Blocks.`],
      vi: [`Pipe Rotate Puzzle vs lua chon khac`, `So sanh Pipe Rotate Puzzle voi Cyber Slide Puzzle va Hex Puzzle Blocks.`],
      id: [`Pipe Rotate Puzzle vs alternatif`, `Bandingkan Pipe Rotate Puzzle dengan Cyber Slide Puzzle dan Hex Puzzle Blocks.`],
      de: [`Pipe Rotate Puzzle vs Alternativen`, `Pipe Rotate Puzzle vs Cyber Slide Puzzle und Hex Puzzle Blocks vergleichen.`],
    };

    let title, desc;
    if (!loc.code) {
      title = g.enTitle;
      desc = g.enDesc;
    } else if (g.route.includes('how-to-play')) {
      [title, desc] = titles[loc.code];
    } else if (g.route.includes('when')) {
      [title, desc] = whenTitles[loc.code];
    } else {
      [title, desc] = vsTitles[loc.code];
    }

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser pipe puzzle on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/pipe-rotate-puzzle.html">Pipe Rotate Puzzle</a> laedt ein ~32 KB Rohr-Raster im iframe. Tippen oder klicken zum Drehen. R Reset, U Rueckgaengig, N Neues Spiel. Speicher: ftol:piperotatepuzzle:theme und ftol:piperotatepuzzle:level.</p>
<p><time itemprop="dateReviewed" datetime="2026-07-18">Last reviewed: 2026-07-18</time></p>
<p>Steuerung: Klick/Tipp dreht 90 Grad. Quelle mit Punkt startet Strom. Gesperrte Kacheln oeffnen bei Strom. Thema olive oder light in Einstellungen. Engine MIT (kiy995/pipzzle).</p>
<p><a href="${routePath}">Diese Sprachversion</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/pipe-rotate-puzzle.html">Pipe Rotate Puzzle</a> loads a ~32 KB pipe grid in an iframe. Tap tiles to rotate. R reset, U undo, N new game. Saves: ftol:piperotatepuzzle:theme and ftol:piperotatepuzzle:level.</p>
<p><time itemprop="dateReviewed" datetime="2026-07-18">Last reviewed: 2026-07-18</time></p>
<p>Rotate pipes until every cell connects from the power source. Grid grows to 7x7 on higher levels. Olive or light theme in settings. Engine MIT (kiy995/pipzzle).</p>
<p><a href="${routePath}">This locale guide</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

// pictogram
w('source/web/src/main/webapp/static/img/illustrations/mini-pictogram/piperotatepuzzle__4b8e2a1c.svg', `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-prp-title svg-minipictogram-prp-desc">
  <title id="svg-minipictogram-prp-title">Pipe rotate puzzle</title>
  <desc id="svg-minipictogram-prp-desc">Pipe tiles to rotate and connect</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1A1F1C" aria-hidden="true"/>
  <path d="M20 32 H32 V20" stroke="#B8C9B3" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M32 32 H44 V44" stroke="#7A9B7A" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="20" cy="32" r="3" fill="#7A9B7A"/>
  <text x="32" y="56" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="7" font-weight="600" letter-spacing="0.5" fill="#B8C9B3">PIPE</text>
</svg>`);

// SKILL
mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-piperotatepuzzle
description: |
  Ground-truth for /games/pipe-rotate-puzzle.html. Hand-authored 2026-07-18
  (game-discovery-loop-runbook fire129) from kiy995/pipzzle at
  static/games/pipe-rotate-puzzle/.
---

# tool-piperotatepuzzle - /games/pipe-rotate-puzzle.html

## Identity

- **Route**: /games/pipe-rotate-puzzle.html
- **Slug**: \`pipe-rotate-puzzle\` (CMS: \`piperotatepuzzle\`)
- **Cluster**: games
- **Aliases**: /pipe-rotate-puzzle.html

## Reader task

Rotate pipe tiles on a growing grid until every cell connects to the power source - tap-friendly, with undo, reset, and olive/light themes.

## Processing model

**client-side-only** - vanilla JS from pipzzle (~32 KB: index.html + 4 JS modules + favicon), same-origin iframe. No CDN, no analytics, no external fonts. Engine HTML is noindex; canonical URL is /games/pipe-rotate-puzzle.html.

## License analysis

- Upstream: kiy995/pipzzle, **MIT, Copyright (c) 2026 kiy995** (LICENSE vendored).
- Original pipe-link puzzle concept; no commercial IP clone.
- Persistence: localStorage \`ftol:piperotatepuzzle:theme\` and \`ftol:piperotatepuzzle:level\`.
- Clean ELIGIBLE; no operator adjudication.

## Reader-benefit framing menu

- V1: Rotate pipe tiles until every cell connects from the power source.
- V2: Grid grows from 3x3 to 7x7 as levels advance; board types rotate (maze, grid, sparse, dense, symmetric).
- V3: Tap or click to rotate 90 degrees; locked tiles unlock when powered.
- V4: R reset board rotations, U undo (50 moves), N new game clears level progress.
- V5: Olive and light themes via settings drawer; keyboard R/U/N and Escape.
- V6: About ~32 KB after Play; touch-friendly on phones.
- V7: Adapted from pipzzle by kiy995 (MIT); namespaces localStorage and ships LICENSE.

## Implemented features

- Procedural boards with power propagation and lit pipe styling.
- Level counter with auto-advance on complete; saved under ftol:piperotatepuzzle:level.
- Theme persistence under ftol:piperotatepuzzle:theme (olive default).
- Settings drawer with GitHub attribution link.

## Anti-claims

- Does NOT use a server backend or CDN at runtime.
- Does NOT include screenshot PNG assets from upstream (optional skipped).
- Is NOT a branded clone of a commercial pipe puzzle franchise.

## claim_catalogue_status

verified
`, 'utf8');

console.log('fire129 scaffold: CMS + JSP + pictogram + SKILL written');
