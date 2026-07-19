#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const WRAPPER = process.env.WRAPPER_ROOT || '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const SKILL = join(WRAPPER, '.agent/skills/tool-rollermaze');
const DATE = '2026-07-20';
const SIZE = '~59 KB';

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

cmsTxt('rollermaze', 'BODYTITLE', 'Rollermaze - Free Online Maze Escape Puzzle');
cmsTxt('rollermaze', 'BODYDESC', 'Rollermaze - free browser maze puzzle: roll a cuboctahedron through timed mazes, hit floor buttons to open paths, dodge sentinels, about 59 KB.');
cmsTxt('rollermaze', 'BODYKW', 'rollermaze game, maze escape browser, js13k roll puzzle, free browser maze game, picosonic rollermaze');

cmsHtml('rollermaze', 'BODYHTML', `<div class="w3-container">
    <p>Rollermaze is a free browser maze puzzle. Roll a cuboctahedron with arrow keys or WASD, press floor buttons to open blocked paths, and reach the forest before the 13-second timer runs out. About ${SIZE}, no install, no account.</p>
    <p>Want a particle outline puzzle instead? Try <a href="/games/quantum-shift.html">Quantum Shift</a>. Want clock-chain timing? Try <a href="/games/thirteen-hours.html">Thirteen Hours</a>.</p>
</div>

<div id="rmzWrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="rmzStage" style="position:relative; width:100%; aspect-ratio:16/9; max-width:960px; margin:0 auto; min-height:360px; background:#1a1a1a; border-radius:6px; overflow:hidden;">
            <div id="rmzLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#9FD;">ROLLERMAZE</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Arrow keys or WASD roll your shape through maze tiles. Step on buttons to open paths, avoid deadly sentinels, and reach the forest before 13 seconds. Adapted from Jasper Renow-Clarke's js13k entry (MIT). About ${SIZE}.</p>
                <button id="rmzPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">WebGL maze with on-screen timer. Session-only - no save data in this build.</p>
            </div>
        </div>
    </div>
    <div id="rmzStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
    <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="rmzFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Session-only play - no localStorage saves.</span>
    </div>
    <style>
        #rmzStage:fullscreen { border-radius: 0; max-width: none; }
        #rmzStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('rollermaze', 'BODYWELCOME', `<p>Welcome to Rollermaze - a free browser maze puzzle you can play without an account or install. Press Play to load the ${SIZE} WebGL game in a same-origin iframe. Roll through tile mazes, trigger floor buttons to open routes, dodge chasing sentinels, and beat the 13-second countdown to the forest exit. Privacy note: nothing is saved on this device; only the initial page and game files load from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('rollermaze', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var RMZ_GAME_URL = 'roller-maze-escape/index.html';
    function rmzStatus(text) {
        var el = document.getElementById('rmzStatus');
        if (el) el.textContent = text;
    }
    function rmzInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'rmzFrame';
        frame.src = RMZ_GAME_URL;
        frame.title = 'Rollermaze game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            rmzStatus('Game loaded. Use arrow keys or WASD to roll; reach the forest before the timer hits zero.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('rmzLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('rmzStage');
        var playBtn = document.getElementById('rmzPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('rmzFullscreenBtn');
        playBtn.addEventListener('click', function () {
            rmzStatus('Loading the game (about 59 KB, one time - then cached)...');
            rmzInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('rmzFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('rollermaze', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Rollermaze?</summary><p>A free browser maze puzzle where you roll a cuboctahedron through tile mazes, open paths with floor buttons, and reach the forest before a 13-second timer expires.</p></details>
<details class="faq-item"><summary>How do I play?</summary><p>After Play loads the game, use arrow keys or WASD to roll one tile at a time. Step on button tiles to open blocked routes and avoid deadly sentinel NPCs.</p></details>
<details class="faq-item"><summary>What does the timer mean?</summary><p>Once you start moving, a 13-second countdown begins. Reach the forest exit tile before it hits zero or the level fails.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>No. This build is session-only with no localStorage saves.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of HTML, JavaScript, CSS, and inlined level data after you press Play.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>It can load on a phone with touch-drag steering on the overlay canvas, but a keyboard is the smoother fit.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from picosonic/js13k-2024 by Jasper Renow-Clarke under the MIT license. This site build adds noindex and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/roller-maze-escape.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Rollermaze - Step by Step</b></h1>
<p>The <a href="/games/roller-maze-escape.html">Rollermaze</a> page loads a ${SIZE} WebGL maze in an iframe.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Play, roll with arrow keys or WASD, open paths with floor buttons, and reach the forest before 13 seconds.</b></p></div>
<h2><b>Step 1 - press Play</b></h2><p>Press Play to inject the iframe (${SIZE}). The WebGL canvas boots immediately with your cuboctahedron above the maze.</p>
<h2><b>Step 2 - wait to land, then roll</b></h2><p>After the shape settles on the floor, use arrow keys or WASD to move one tile at a time. Each roll rotates the shape 90 degrees.</p>
<h2><b>Step 3 - hit floor buttons</b></h2><p>Button tiles open matching blockers elsewhere on the map. Plan a route through opened corridors.</p>
<h2><b>Step 4 - beat the timer to the forest</b></h2><p>Your first move starts a 13-second countdown. Reach the forest exit tile before zero while avoiding deadly sentinels that chase you.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>HTML + JS + CSS + levels</td></tr><tr><td>Input</td><td>arrow keys / WASD</td><td>touch drag on overlay also works</td></tr><tr><td>Saves</td><td>none</td><td>session-only</td></tr><tr><td>Core loop</td><td>roll -> button -> forest</td><td>timed multi-level maze</td></tr></table>
<p>See <a href="/guides/roller-maze-escape-when.html">when to play</a>, <a href="/guides/roller-maze-escape-vs-alternatives.html">comparisons</a>, and <a href="/games/quantum-shift.html">Quantum Shift</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Rollermaze</b></h1>
<p><a href="/games/roller-maze-escape.html">Rollermaze</a> fits a short timed maze session - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>When you want spatial maze routing under pressure</b></h2><p>Floor buttons, blockers, and a 13-second timer combine route planning with quick execution.</p>
<h2><b>When you have a keyboard handy</b></h2><p>Arrow keys or WASD drive tile-by-tile rolls; the 640x360 canvas scales inside the page frame.</p>
<h2><b>When to pick another game</b></h2><p>Want particle outline matching? Use <a href="/games/quantum-shift.html">Quantum Shift</a>. Want clock chains? Use <a href="/games/thirteen-hours.html">Thirteen Hours</a>.</p>
<p>See <a href="/guides/how-to-play-roller-maze-escape.html">how to play</a> and <a href="/guides/roller-maze-escape-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Rollermaze vs Alternatives</b></h1>
<p><a href="/games/roller-maze-escape.html">Rollermaze</a> is a timed WebGL maze roll puzzle. Compare it with two other free browser games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Rollermaze</td><td>${SIZE}</td><td>Arrow keys / WASD roll</td><td>none (session)</td></tr>
<tr><td><a href="/games/quantum-shift.html">Quantum Shift</a></td><td>~68 KB</td><td>Arrow keys + particle touch</td><td>none (session)</td></tr>
<tr><td><a href="/games/thirteen-hours.html">Thirteen Hours</a></td><td>~30 KB</td><td>Tap / click active clock</td><td>ftol:thirteenhours</td></tr>
</table>
<p>Pick Rollermaze for timed maze routing with floor buttons. Pick Quantum Shift for outline-matching particle puzzles. Pick Thirteen Hours for clock-chain timing.</p>
<p>See <a href="/guides/how-to-play-roller-maze-escape.html">how to play</a> and <a href="/guides/roller-maze-escape-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-roller-maze-escape', slug: 'guideshowtoplayrollermaze', enTitle: 'How to Play Rollermaze - Step by Step', enDesc: 'How to play Rollermaze: roll with arrow keys or WASD, open paths with buttons, beat the 13-second timer, ~59 KB browser maze.', html: howToEn },
  { route: 'roller-maze-escape-when', slug: 'guidesrollermazewhen', enTitle: 'When to Play Rollermaze', enDesc: 'When Rollermaze fits: short timed WebGL maze sessions with floor buttons and sentinels, ~59 KB.', html: whenEn },
  { route: 'roller-maze-escape-vs-alternatives', slug: 'guidesrollermazevsalternatives', enTitle: 'Rollermaze vs Alternatives', enDesc: 'Compare Rollermaze with Quantum Shift and Thirteen Hours - size, input, saves.', html: vsEn },
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
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplayrollermaze`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}rollermazewhen`;
    else cmsSlug = `guides${loc.prefix}rollermazevsalternatives`;

    const howTitles = {
      pt: ['Como jogar Rollermaze', 'Como jogar Rollermaze: setas ou WASD para rolar, botoes abrem caminhos, timer de 13s, ~59 KB.'],
      es: ['Como jugar Rollermaze', 'Como jugar Rollermaze: flechas o WASD para rodar, botones abren rutas, timer de 13s, ~59 KB.'],
      vi: ['Cach choi Rollermaze', 'Huong dan Rollermaze: mui ten hoac WASD de lan, nut san mo loi di, dem 13 giay, ~59 KB.'],
      id: ['Cara main Rollermaze', 'Panduan Rollermaze: panah atau WASD untuk menggelinding, tombol lantai buka jalur, timer 13 detik, ~59 KB.'],
      de: ['Rollermaze spielen', 'Rollermaze spielen: Pfeiltasten oder WASD rollen, Bodenknopfe oeffnen Wege, 13-Sekunden-Timer, ~59 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar Rollermaze', 'Quando encaixa: labirintos WebGL curtos com botoes e sentinelas, ~59 KB.'],
      es: ['Cuando jugar Rollermaze', 'Cuando encaja: laberintos WebGL cortos con botones y centinelas, ~59 KB.'],
      vi: ['Khi nao choi Rollermaze', 'Khi nao phu hop: me cung WebGL ngan voi nut san va linh canh, ~59 KB.'],
      id: ['Kapan main Rollermaze', 'Kapan cocok: labirin WebGL singkat dengan tombol lantai dan sentinel, ~59 KB.'],
      de: ['Wann Rollermaze spielen', 'Wann es passt: kurze WebGL-Labyrinthe mit Bodenknopfen und Wachen, ~59 KB.'],
    };
    const vsTitles = {
      pt: ['Rollermaze vs alternativas', 'Compare com Quantum Shift e Thirteen Hours.'],
      es: ['Rollermaze vs alternativas', 'Compara con Quantum Shift y Thirteen Hours.'],
      vi: ['Rollermaze vs lua chon khac', 'So sanh voi Quantum Shift va Thirteen Hours.'],
      id: ['Rollermaze vs alternatif', 'Bandingkan dengan Quantum Shift dan Thirteen Hours.'],
      de: ['Rollermaze vs Alternativen', 'Vergleich mit Quantum Shift und Thirteen Hours.'],
    };

    let title, desc;
    if (!loc.code) { title = g.enTitle; desc = g.enDesc; }
    else if (g.route.includes('how-to-play')) [title, desc] = howTitles[loc.code];
    else if (g.route.includes('when')) [title, desc] = whenTitles[loc.code];
    else [title, desc] = vsTitles[loc.code];

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser maze puzzle on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/roller-maze-escape.html">Rollermaze</a> laedt einen ${SIZE} WebGL-Labyrinth-Lauf im iframe: rollen, Bodenknopfe, 13-Sekunden-Timer.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Session-only, keine Speicherung. Engine MIT (Jasper Renow-Clarke / picosonic).</p>
<p><a href="${routePath}">Diese Sprachversion</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/roller-maze-escape.html">Rollermaze</a> loads a ${SIZE} WebGL maze in an iframe: roll with arrow keys or WASD, open paths with floor buttons, beat the 13-second timer.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Session-only play with no localStorage. Engine MIT (Jasper Renow-Clarke / picosonic).</p>
<p><a href="${routePath}">This locale guide</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-rmz-title svg-minipictogram-rmz-desc">
  <title id="svg-minipictogram-rmz-title">Rollermaze</title>
  <desc id="svg-minipictogram-rmz-desc">Faceted rolling shape on a maze grid with a timer arc suggesting a timed escape puzzle</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <rect x="12" y="40" width="10" height="10" fill="#5B73AE" opacity="0.35"/>
  <rect x="24" y="40" width="10" height="10" fill="#5B73AE" opacity="0.35"/>
  <rect x="36" y="40" width="10" height="10" fill="#7DAFA3"/>
  <rect x="24" y="28" width="10" height="10" fill="#5B73AE" opacity="0.35"/>
  <polygon points="29,16 35,22 29,28 23,22" fill="#D9C7A3" stroke="#5B73AE" stroke-width="2"/>
  <path d="M44 14a12 12 0 0 1 0 18" fill="none" stroke="#7DAFA3" stroke-width="3" stroke-linecap="round"/>
</svg>
`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picName = `rollermaze__${hash8}.svg`;
w(`source/web/src/main/webapp/static/img/illustrations/mini-pictogram/${picName}`, pictogramBody);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-rollermaze
description: |
  Ground-truth for /games/roller-maze-escape.html. Hand-authored
  ${DATE} (game-discovery-loop-runbook fire156) from
  picosonic/js13k-2024 at static/games/roller-maze-escape/.
---

# tool-rollermaze - /games/roller-maze-escape.html

## Identity

- **Route**: /games/roller-maze-escape.html
- **Slug**: \`roller-maze-escape\` (CMS: \`rollermaze\`)
- **Cluster**: games
- **Aliases**: /roller-maze-escape.html

## Reader task

Roll a cuboctahedron through tile mazes with arrow keys or WASD, press floor buttons to open blocked paths, dodge deadly sentinels, and reach the forest exit before the 13-second timer expires.

## Processing model

**client-side-only** - \`index.html\` + CSS/JS runtime bundle (~59 KB). WebGL2 on \`canvas#canvas\` with 2D OSD overlay on \`canvas#osd\`. Zero CDN, zero runtime fetch beyond same-origin assets. No localStorage - session-only. Page carries noindex; canonical URL is /games/roller-maze-escape.html.

## License analysis

- Upstream: **picosonic/js13k-2024**, **MIT, Copyright (c) 2024 Jasper Renow-Clarke** (LICENSE vendored).
- Original js13kGames 2024 entry "Rollermaze"; reader brand Rollermaze.
- Adaptation: title rebrand, noindex meta, LICENSE+CREDITS shipped.
- Clean ELIGIBLE. Distinct from quantum-shift particle puzzle and thirteen-hours clock chain.

## Reader-benefit framing menu

- V1: Timed WebGL maze roll puzzle with floor buttons and sentinels.
- V2: Tile-by-tile arrow-key or WASD movement with 90-degree rolls.
- V3: 13-second countdown starts on first move; reach forest exit before zero.
- V4: ~59 KB after Play; session-only, no saves.
- V5: Adapted from Jasper Renow-Clarke's MIT js13k-2024 entry.

## Implemented features

- WebGL2 renderer (w.js microW lineage) with 2D OSD timer and hints.
- Floor button tiles open matching blockers.
- Deadly NPC sentinels chase the player on some levels.
- Multi-level progression with end-game celebration particles.
- Touch drag on OSD canvas maps to movement (keyboard primary).

## Anti-claims

- Does NOT use a server or CDN at runtime.
- Does NOT persist progress in localStorage.
- Does NOT require touch-only input (keyboard is primary).
- Is NOT a first-person shooter or endless runner.

## claim_catalogue_status

verified
`, 'utf8');

console.log('scaffold done', { picName, hash8, skill: SKILL });
