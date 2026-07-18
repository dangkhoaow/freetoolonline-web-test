#!/usr/bin/env node
/** fire139: scaffold herd-cats-home CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SKILL = join(ROOT, '..', '.agent/skills/tool-herdcatshome');
const DATE = '2026-07-18';
const LS_KEY = 'ftol:herdcatshome:CAT';

const JSP_WRAPPER = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
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
    details.faq-item > summary:hover { color: #1a73e8; }
    details.faq-item > p, details.faq-item > div { padding: 0 8px 8px 28px; margin: 0; }
</style>`;

cmsTxt('herdcatshome', 'BODYTITLE', 'Herd Cats Home - Free Online Multi-Cat Isometric Puzzle');
cmsTxt('herdcatshome', 'BODYDESC', 'Herd Cats Home - free browser isometric puzzle: lead a black cat and color-matched cats onto home tiles within 13 steps per counter. Arrow keys, Q undo, 16 levels, ~30 KB, no install.');
cmsTxt('herdcatshome', 'BODYKW', 'herd cats home game, isometric cat puzzle, browser cat herding puzzle, js13k cat puzzle, step limit puzzle, free online cat game');

cmsHtml('herdcatshome', 'BODYHTML', `<div class="w3-container">
    <p>Herd Cats Home is an isometric tile puzzle in the browser: you guide a black cat leader and color-matched cats across stacked tiles, tree holes, and swap pads. Each move tile counts steps - stay at or below 13. Send every cat to its matching home tile. About ~30 KB after Play, no install, no account.</p>
    <p>Prefer a push-crate escape instead? Try <a href="/games/thirteen-step-escape.html">Thirteen Step Escape</a>.</p>
</div>

<div id="hchWrapper" class="w3-container" style="background:#2a3a2a; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="hchStage" style="position:relative; width:100%; aspect-ratio:4/3; min-height:480px; background:#1a2a1a; border-radius:6px; overflow:hidden;">
            <div id="hchLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#f4be82;">HERD CATS HOME</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Lead colored cats home with the black cat. Match tile colors, stack cats, and keep step counters at 13 or below. From WMAR-9 black_cat (MIT, JS13K 2025). About ~30 KB downloads once when you press Play.</p>
                <button id="hchPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Keyboard: arrow keys move the active cat. Q undo, W mute, E level menu, R restart. Click or tap the canvas for menus. Best on desktop with a keyboard.</p>
            </div>
        </div>
        <div id="hchStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="hchFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Cleared levels save locally under ${LS_KEY} in your browser.</span>
    </div>
    <style>
        #hchStage:fullscreen { border-radius: 0; }
        #hchStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('herdcatshome', 'BODYWELCOME', `<p>Welcome to Herd Cats Home - a free browser isometric cat-herding puzzle you can play without an account or install. Press Play to load the ~30 KB canvas engine in a same-origin iframe, tap through the title screen, pick a level from the grid, then use arrow keys to move cats across color-matched tiles. Cats only interact with tiles that share their color family. Step counters on move tiles must stay at or below 13; cat food bowls reset a counter to zero. Stack cats on the same tile, use tree holes for height changes, and send each cat onto its matching home pad. Q undoes one move, W toggles sound, E opens the level menu, R restarts the current level. Sixteen levels unlock as you clear them; progress saves locally. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('herdcatshome', 'BODYJS', `<script>
    web.localUpload = false;
    var HCH_GAME_URL = 'herd-cats-home/index.html';
    function hchStatus(text) {
        var el = document.getElementById('hchStatus');
        if (el) el.textContent = text;
    }
    function hchInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'hchFrame';
        frame.src = HCH_GAME_URL;
        frame.title = 'Herd Cats Home game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            hchStatus('Game loaded. Tap to start, pick a level, then use arrow keys to herd cats home.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('hchLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('hchStage');
        var playBtn = document.getElementById('hchPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('hchFullscreenBtn');
        playBtn.addEventListener('click', function () {
            hchStatus('Loading the game (about 30 KB, one time - then cached)...');
            hchInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('hchFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('herdcatshome', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Herd Cats Home?</summary><p>An isometric multi-cat puzzle. You move a black cat leader and color-matched cats across tiles, stack them on shared squares, and send each cat to its matching home pad before step counters exceed 13 on move tiles.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>Arrow keys move the active cat in that direction. Q undoes one move. W toggles sound. E opens the level select menu. R restarts the current level. Click or tap the canvas for title, level grid, and story overlays.</p></details>
<details class="faq-item"><summary>How do color rules work?</summary><p>Each cat has a color family (black plus four pastel cats). Cats only trigger tiles that match their color - home pads, food bowls, swap pads, and counters. Black blocks and neutral tiles follow separate rules shown in the in-game tips.</p></details>
<details class="faq-item"><summary>What is the step limit?</summary><p>Move tiles show a rising counter each time any cat steps on them. If a counter goes above 13, that tile fails the level. Cat food bowls reset their counter to zero when a matching cat stands on them at the right height.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>Yes. Cleared levels save locally under ${LS_KEY} as a level bitmap. Sound mute preference is session-only inside the engine.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ~30 KB of HTML, JavaScript, CSS, and one sprite sheet after you press Play. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>The engine accepts canvas clicks for menus and overlays, but arrow-key moves need a keyboard. Desktop or laptop is the best experience; tablets with a keyboard also work.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from black_cat by WMAR-9 (js13kGames 2025) under the MIT license. This site build adds noindex on the iframe, namespaces localStorage to ${LS_KEY}, and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/herd-cats-home.jsp', JSP_WRAPPER);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Herd Cats Home - Step by Step</b></h1>
<p>The <a href="/games/herd-cats-home.html">Herd Cats Home</a> page loads a ~30 KB isometric cat puzzle in an iframe. Lead colored cats onto matching home tiles without breaking the 13-step counters. Press Play on this page to start.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Use arrow keys to move cats; only color-matched tiles react to each cat; keep move counters at 13 or below.</b></p></div>
<h2><b>Step 1 - press Play and enter a level</b></h2><p>Press Play to inject the iframe (~30 KB). Wait for the loading bar, tap the title screen, then click level 1 on the 4x4 grid. Upstream is WMAR-9 black_cat (MIT, JS13K 2025).</p>
<h2><b>Step 2 - read the isometric board</b></h2><p>Tiles stack in height. Home pads match cat colors. Move tiles show a step counter. Tree holes link height layers. Black X tiles block paths. Hidden tiles reveal numbers when opened.</p>
<h2><b>Step 3 - move with arrow keys</b></h2><p>Press arrow keys to slide the active cat one tile. Cats on the same square stack; taller stacks move together when rules allow. The engine picks which cat moves based on your arrow direction and stack order.</p>
<h2><b>Step 4 - match colors and homes</b></h2><p>Each pastel cat must reach its same-color home pad. The black cat leader helps open routes. Swap pads exchange two cats on one tile. Some tiles crumble after use.</p>
<h2><b>Step 5 - manage step counters</b></h2><p>Every step onto a counter tile adds one. Counters above 13 fail the level. Cat food bowls reset a counter to zero when the matching cat stands on them at the correct height.</p>
<h2><b>Step 6 - clear all cats home</b></h2><p>Win when every cat stands on its home tile. Q undoes one move. R restarts the level. E returns to the level menu. Sixteen levels unlock sequentially; cleared flags save under ${LS_KEY}.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>~30 KB</td><td>index.html + index.js + css + png</td></tr><tr><td>Input</td><td>arrows, Q/W/E/R</td><td>canvas click for menus</td></tr><tr><td>Saves</td><td>level clears</td><td>${LS_KEY}</td></tr><tr><td>Levels</td><td>16</td><td>grid 1-16</td></tr></table>
<p>See <a href="/guides/herd-cats-home-when.html">when to play</a>, <a href="/guides/herd-cats-home-vs-alternatives.html">comparisons</a>, and <a href="/games/cat-hop-cloud.html">Cat Hop Cloud</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Herd Cats Home</b></h1>
<p><a href="/games/herd-cats-home.html">Herd Cats Home</a> fits quiet breaks where you want a color-logic herding puzzle - about ~30 KB after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>Multi-cat planning sessions</b></h2><p>Each level mixes several cats, stacked tiles, and shared step counters. You plan move order before any counter crosses 13.</p>
<h2><b>When you like color-matching rules</b></h2><p>Cats ignore wrong-color tiles, so routing is about pairing the right cat with food resets, swap pads, and home goals.</p>
<h2><b>When to pick another game</b></h2><p>Want a single-character push-crate escape? Use <a href="/games/thirteen-step-escape.html">Thirteen Step Escape</a>. Want luck cloud hops? Use <a href="/games/cat-hop-cloud.html">Cat Hop Cloud</a>.</p>
<p>See <a href="/guides/how-to-play-herd-cats-home.html">how to play</a> and <a href="/guides/herd-cats-home-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Herd Cats Home vs Alternatives</b></h1>
<p><a href="/games/herd-cats-home.html">Herd Cats Home</a> is an isometric multi-cat herding puzzle with color rules and 13-step counters. Compare it with two other free browser puzzles on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Herd Cats Home</td><td>~30 KB</td><td>Arrow keys + canvas click</td><td>${LS_KEY}</td></tr>
<tr><td><a href="/games/thirteen-step-escape.html">Thirteen Step Escape</a></td><td>~16 KB</td><td>Arrow keys push crates</td><td>none</td></tr>
<tr><td><a href="/games/cat-hop-cloud.html">Cat Hop Cloud</a></td><td>~25 KB</td><td>Keyboard 1-9 hop clouds</td><td>ftol:cathopcloud:scores_v2.0.0</td></tr>
</table>
<p>Pick Herd Cats Home for color-matched multi-cat herding with stacked tiles. Pick Thirteen Step Escape for a single push-crate flag race. Pick Cat Hop Cloud for luck routing on a cloud ring.</p>
<p>See <a href="/guides/how-to-play-herd-cats-home.html">how to play</a> and <a href="/guides/herd-cats-home-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-herd-cats-home', slug: 'guideshowtoplayherdcatshome', enTitle: 'How to Play Herd Cats Home - Step by Step', enDesc: 'How to play Herd Cats Home: arrow keys, color-matched cats, 13-step counters, stack tiles, 16 levels, ~30 KB browser puzzle.', html: howToEn },
  { route: 'herd-cats-home-when', slug: 'guidesherdcatshomewhen', enTitle: 'When to Play Herd Cats Home', enDesc: 'When Herd Cats Home fits: multi-cat isometric herding, color rules, step limits, ~30 KB.', html: whenEn },
  { route: 'herd-cats-home-vs-alternatives', slug: 'guidesherdcatshomevsalternatives', enTitle: 'Herd Cats Home vs Alternatives', enDesc: 'Compare Herd Cats Home with Thirteen Step Escape and Cat Hop Cloud - download size, input, saves.', html: vsEn },
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
    w(`source/web/src/main/webapp/WEB-INF/jsp/${jspPath}`, JSP_WRAPPER);

    let cmsSlug;
    if (!loc.prefix) {
      cmsSlug = g.slug;
    } else if (g.route === 'how-to-play-herd-cats-home') {
      cmsSlug = `guides${loc.prefix}howtoplayherdcatshome`;
    } else if (g.route === 'herd-cats-home-when') {
      cmsSlug = `guides${loc.prefix}herdcatshomewhen`;
    } else {
      cmsSlug = `guides${loc.prefix}herdcatshomevsalternatives`;
    }

    const howTitles = {
      pt: [`Como jogar Herd Cats Home`, `Como jogar Herd Cats Home: gatos coloridos, contador 13 passos, ~30 KB.`],
      es: [`Como jugar Herd Cats Home`, `Como jugar Herd Cats Home: gatos de color, contador 13 pasos, ~30 KB.`],
      vi: [`Cach choi Herd Cats Home`, `Huong dan Herd Cats Home: dan meo mau, gioi han 13 buoc, ~30 KB.`],
      id: [`Cara main Herd Cats Home`, `Panduan Herd Cats Home: kucing warna, batas 13 langkah, ~30 KB.`],
      de: [`Herd Cats Home spielen`, `Herd Cats Home spielen: Farb-Katzen, 13-Schritt-Zaehler, ~30 KB.`],
    };
    const whenTitles = {
      pt: [`Quando jogar Herd Cats Home`, `Quando Herd Cats Home encaixa: puzzle isometrico, ~30 KB.`],
      es: [`Cuando jugar Herd Cats Home`, `Cuando jugar Herd Cats Home: rompecabezas isometrico, ~30 KB.`],
      vi: [`Khi nao choi Herd Cats Home`, `Khi nao choi Herd Cats Home: giai do dan meo, ~30 KB.`],
      id: [`Kapan main Herd Cats Home`, `Kapan main Herd Cats Home: teka-teki kucing, ~30 KB.`],
      de: [`Wann Herd Cats Home spielen`, `Wann Herd Cats Home spielen: kurze Katzen-Routen, ~30 KB.`],
    };
    const vsTitles = {
      pt: [`Herd Cats Home vs alternativas`, `Compare Herd Cats Home com Thirteen Step Escape e Cat Hop Cloud.`],
      es: [`Herd Cats Home vs alternativas`, `Compara Herd Cats Home con Thirteen Step Escape y Cat Hop Cloud.`],
      vi: [`Herd Cats Home vs lua chon khac`, `So sanh Herd Cats Home voi Thirteen Step Escape va Cat Hop Cloud.`],
      id: [`Herd Cats Home vs alternatif`, `Bandingkan Herd Cats Home dengan Thirteen Step Escape dan Cat Hop Cloud.`],
      de: [`Herd Cats Home vs Alternativen`, `Herd Cats Home vs Thirteen Step Escape und Cat Hop Cloud vergleichen.`],
    };

    let title, desc;
    if (!loc.code) {
      title = g.enTitle;
      desc = g.enDesc;
    } else if (g.route.includes('how-to-play')) {
      [title, desc] = howTitles[loc.code];
    } else if (g.route.includes('when')) {
      [title, desc] = whenTitles[loc.code];
    } else {
      [title, desc] = vsTitles[loc.code];
    }

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser cat herding puzzle on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/herd-cats-home.html">Herd Cats Home</a> laedt ein ~30 KB isometrisches Katzen-Raetsel im iframe. Pfeiltasten bewegen Katzen; Zaehler-Kacheln duerfen 13 Schritte nicht ueberschreiten.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Steuerung: Pfeile, Q Rueckgaengig, W Ton, E Menue, R Neustart. Speichert unter ${LS_KEY}. Engine MIT (WMAR-9 black_cat, JS13K 2025).</p>
<p><a href="${routePath}">Diese Sprachversion</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/herd-cats-home.html">Herd Cats Home</a> loads a ~30 KB isometric cat herding puzzle in an iframe. Arrow keys move color-matched cats; step counters must stay at or below 13.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Sixteen levels, Q undo, E level menu. Saves cleared levels under ${LS_KEY}. Engine MIT (WMAR-9 black_cat, JS13K 2025).</p>
<p><a href="${routePath}">This locale guide</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

w('source/web/src/main/webapp/static/img/illustrations/mini-pictogram/herdcatshome__f1a8c3d2.svg', `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-hch-title svg-minipictogram-hch-desc">
  <title id="svg-minipictogram-hch-title">Herd Cats Home</title>
  <desc id="svg-minipictogram-hch-desc">Isometric multi-cat herding puzzle game</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#2a3a2a" aria-hidden="true"/>
  <polygon points="20,36 32,28 44,36 32,44" fill="#5E6287" stroke="#888" stroke-width="1"/>
  <polygon points="26,32 32,28 38,32 32,36" fill="#8E5F29"/>
  <ellipse cx="28" cy="26" rx="5" ry="4" fill="#010101"/>
  <path d="M24 22 L26 16 L28 22 Z" fill="#010101"/>
  <path d="M28 22 L30 16 L32 22 Z" fill="#010101"/>
  <ellipse cx="38" cy="24" rx="4" ry="3" fill="#f4be82"/>
  <text x="32" y="58" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="6" font-weight="700" letter-spacing="0.3" fill="#f4be82">HCH</text>
</svg>`);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-herdcatshome
description: |
  Ground-truth for /games/herd-cats-home.html. Hand-authored 2026-07-18
  (game-discovery-loop-runbook fire139) from WMAR-9 black_cat at
  static/games/herd-cats-home/.
---

# tool-herdcatshome - /games/herd-cats-home.html

## Identity

- **Route**: /games/herd-cats-home.html
- **Slug**: \`herd-cats-home\` (CMS: \`herdcatshome\`)
- **Cluster**: games
- **Aliases**: /herd-cats-home.html

## Reader task

Lead a black cat and color-matched cats across isometric tiles, stack them on shared squares, keep move-tile step counters at or below 13, and send every cat to its matching home pad across sixteen levels.

## Processing model

**client-side-only** - Vite-built canvas engine (~30 KB: index.html + index.js + index.css + t.png), same-origin iframe. No CDN, no analytics, no external fonts at runtime. Engine HTML is noindex; canonical URL is /games/herd-cats-home.html. Full-window canvas (#a) with isometric tile rendering.

## License analysis

- Upstream: WMAR-9 **black_cat**, js13kGames 2025, **MIT, Copyright (c) 2025 WMAR-9** (LICENSE vendored).
- Original isometric multi-cat herding puzzle; not a commercial clone.
- localStorage level-clear key namespaced to \`${LS_KEY}\` (upstream used bare \`CAT\`).
- Adaptations: noindex meta, LICENSE + CREDITS shipped, localStorage key prefixed.
- Clean ELIGIBLE; no operator adjudication.

## Reader-benefit framing menu

- V1: Arrow keys move the active cat one isometric tile in that direction.
- V2: Cats only interact with tiles matching their color family (black leader plus four pastel cats).
- V3: Move tiles show a step counter; counters above 13 fail the level.
- V4: Cat food bowls reset their tile counter to zero when a matching cat stands on them at the correct height.
- V5: Cats stack on the same tile; height and stack order affect who can move.
- V6: Home pads (color houses) send matching cats home when triggered at the right height.
- V7: Q undoes one move; W toggles sound; E opens level menu; R restarts the current level.
- V8: Sixteen levels on a 4x4 select grid; cleared levels save locally under \`${LS_KEY}\`.
- V9: About ~30 KB after Play; keyboard plus canvas click for menus and overlays.
- V10: Adapted from black_cat by WMAR-9 (MIT, JS13K 2025); ships LICENSE + CREDITS.

## Implemented features

- Isometric tile map with stacked height, tree-hole tunnels, swap pads, crumble tiles, hidden counters.
- Black cat leader plus up to four color-matched companion cats per level.
- Procedural Web Audio music and SFX (toggle with W).
- Title screen, loading bar (~5 s), story text overlays, and in-level hint strings.
- Undo stack (Q) and per-level restart (R).
- Level select grid with cleared-level dimming persisted in localStorage.

## Anti-claims

- Does NOT use a server backend or CDN at runtime.
- Does NOT use pointer-lock or gamepad controls.
- Is NOT the same game as Thirteen Step Escape (multi-cat color herding vs single push-crate escape).
- Is NOT a branded clone of a commercial franchise (original js13k puzzle).
- Does NOT save scoreboards beyond level-clear flags in \`${LS_KEY}\`.

## claim_catalogue_status

verified
`, 'utf8');

console.log('fire139 scaffold: CMS + JSP + pictogram + SKILL written');
