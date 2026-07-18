#!/usr/bin/env node
/** fire147: scaffold black-cat-hot-tin-roof CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..'); // web-test
const SKILL = join(ROOT, '..', '.agent/skills/tool-blackcathottinroof');
const DATE = '2026-07-18';
const SIZE = '~16 KB';

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

cmsTxt('blackcathottinroof', 'BODYTITLE', 'Black Cat on a Hot Tin Roof - Free Online Runner Game');
cmsTxt('blackcathottinroof', 'BODYDESC', 'Black Cat on a Hot Tin Roof - free browser rooftop runner: jump spikes, clear birds, gain a super power, and catch Black Bird in 60 seconds, about 16 KB.');
cmsTxt('blackcathottinroof', 'BODYKW', 'black cat hot tin roof game, rooftop runner browser game, cat jump game online, 60 second arcade game, js13k black cat game');

cmsHtml('blackcathottinroof', 'BODYHTML', `<div class="w3-container">
    <p>Black Cat on a Hot Tin Roof is a free browser rooftop runner: Black Bird and his gang captured Kitty, and Black Cat has exactly 60 seconds to cross the rooftops and catch Black Bird. Clear spikes and obstacles, attack birds from above, collect power-up items, and try to beat your own high score before time runs out. About ${SIZE}, no install, no account.</p>
    <p>Want a chess-style puzzle instead? Try <a href="/games/mor-chess-2.html">Mor Chess 2</a>.</p>
</div>

<div id="bchtrWrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="bchtrStage" style="position:relative; width:100%; aspect-ratio:16/9; min-height:380px; background:#ef6e10; border-radius:6px; overflow:hidden;">
            <div id="bchtrLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#1c1c1e; text-shadow:0 1px 0 rgba(255,255,255,0.3);">BLACK CAT ON A HOT TIN ROOF</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#3a2a1a;">Run, jump, and clear rooftops for 60 seconds to catch Black Bird. From Black Cat on a Hot Tin Roof by tricsi (MIT, JS13K). About ${SIZE}, downloads once when you press Play.</p>
                <button id="bchtrPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#3a2a1a; max-width:480px; margin-top:12px;">Click anywhere once to enable sound, then press Space or click/tap to jump.</p>
            </div>
        </div>
        <div id="bchtrStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="bchtrFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">High score saved on this device only.</span>
    </div>
    <style>
        #bchtrStage:fullscreen { border-radius: 0; }
        #bchtrStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('blackcathottinroof', 'BODYWELCOME', `<p>Welcome to Black Cat on a Hot Tin Roof - a free browser rooftop runner you can play without an account or install. Press Play to load the ${SIZE} game in a same-origin iframe. Click once anywhere on the game to enable sound and start the intro, then press Space or click/tap to begin your 60-second run. Jump with Space or a click; clear spikes from the side and attack birds from above; collect power-up items that grant Black Cat's super power. Survive the full 60 seconds to face Black Bird. Your best score is saved on this device (localStorage) so you can try to beat it next time. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('blackcathottinroof', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var BCHTR_GAME_URL = 'black-cat-hot-tin-roof/index.html';
    function bchtrStatus(text) {
        var el = document.getElementById('bchtrStatus');
        if (el) el.textContent = text;
    }
    function bchtrInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'bchtrFrame';
        frame.src = BCHTR_GAME_URL;
        frame.title = 'Black Cat on a Hot Tin Roof game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            bchtrStatus('Game loaded. Click once to enable sound, then press Space to start.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('bchtrLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('bchtrStage');
        var playBtn = document.getElementById('bchtrPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('bchtrFullscreenBtn');
        playBtn.addEventListener('click', function () {
            bchtrStatus('Loading the game (about 16 KB, one time - then cached)...');
            bchtrInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('bchtrFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('blackcathottinroof', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Black Cat on a Hot Tin Roof?</summary><p>A free browser rooftop runner: Black Bird and his gang captured Kitty, and Black Cat has 60 seconds to cross the rooftops and catch Black Bird.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>Click anywhere once to enable sound and start the intro. Then press Space (or click/tap) to begin the run and to jump. Hold the jump button for a bigger jump, and press it again in mid-air for a double jump.</p></details>
<details class="faq-item"><summary>What is the goal?</summary><p>Clear obstacles and earn points for 60 seconds. Spikes can be cleared from the side; birds can be attacked from above. Collecting items grants Black Cat's super power. Surviving the full 60 seconds leads to a Black Bird encounter.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>Your best score (high score) is saved on this device using your browser's local storage. There is no account or cloud save.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of HTML, JavaScript, and WebGL2 shaders after you press Play - a single file. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>Yes - the game detects mobile devices and shows a tap prompt instead of "Press Space". Tap to jump.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from Black Cat on a Hot Tin Roof by tricsi (Csaba Csecskedi) - a js13kGames 2025 Black Cat theme entry - under the MIT license. This site build adds noindex on the engine page and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/black-cat-hot-tin-roof.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Black Cat on a Hot Tin Roof</b></h1>
<p>The <a href="/games/black-cat-hot-tin-roof.html">Black Cat on a Hot Tin Roof</a> page loads a ${SIZE} rooftop runner in an iframe.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Click once to enable sound, then press Space (or tap) to start your 60-second run.</b></p></div>
<h2><b>Step 1 - press Play</b></h2><p>Press Play to inject the iframe (${SIZE}). The title screen shows a black cat silhouette over a city skyline.</p>
<h2><b>Step 2 - click once to enable sound</b></h2><p>Click anywhere on the game once - this turns on audio (a browser requirement) and plays a short intro. A "Press Space to Play" (or "Tap to Play" on mobile) prompt then appears.</p>
<h2><b>Step 3 - start the run</b></h2><p>Press Space or click/tap to begin the 60-second countdown. Black Cat starts running across the rooftops automatically.</p>
<h2><b>Step 4 - jump and clear obstacles</b></h2><p>Press Space or click/tap to jump. Hold the button for a bigger jump, and press again in mid-air for a double jump. Clear spikes from the side and attack birds from above to score points.</p>
<h2><b>Step 5 - collect power-ups and survive</b></h2><p>Collect items that appear in the sky to gain Black Cat's super power. Survive the full 60 seconds to reach the Black Bird encounter. Your best score is saved automatically.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>single HTML file, WebGL2</td></tr><tr><td>Input</td><td>Space or click/tap</td><td>jump; double jump in mid-air</td></tr><tr><td>Run length</td><td>60 seconds</td><td>fixed per run</td></tr><tr><td>Saves</td><td>high score only</td><td>localStorage, this device</td></tr></table>
<p>See <a href="/guides/black-cat-hot-tin-roof-when.html">when to play</a>, <a href="/guides/black-cat-hot-tin-roof-vs-alternatives.html">comparisons</a>, and <a href="/games/mor-chess-2.html">Mor Chess 2</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Black Cat on a Hot Tin Roof</b></h1>
<p><a href="/games/black-cat-hot-tin-roof.html">Black Cat on a Hot Tin Roof</a> fits a quick 60-second break where you want a fast, score-chasing runner - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>When you have exactly one minute</b></h2><p>Each run is a fixed 60 seconds - a natural fit for a single quick break between tasks.</p>
<h2><b>When you want a beatable high score</b></h2><p>Your best score saves automatically on this device, so short repeat sessions build toward a personal best.</p>
<h2><b>When to pick another game</b></h2><p>Want a slower, thinking-focused puzzle instead? Use <a href="/games/mor-chess-2.html">Mor Chess 2</a>. Want a longer 3-in-1 arcade session? Use <a href="/games/darkline-paws.html">DarkLine Paws</a>.</p>
<p>See <a href="/guides/how-to-play-black-cat-hot-tin-roof.html">how to play</a> and <a href="/guides/black-cat-hot-tin-roof-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Black Cat on a Hot Tin Roof vs Alternatives</b></h1>
<p><a href="/games/black-cat-hot-tin-roof.html">Black Cat on a Hot Tin Roof</a> is a fixed 60-second rooftop runner. Compare it with two other free browser games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Black Cat on a Hot Tin Roof</td><td>${SIZE}</td><td>Space or click/tap to jump</td><td>high score (localStorage)</td></tr>
<tr><td><a href="/games/mor-chess-2.html">Mor Chess 2</a></td><td>~13 KB</td><td>Click/tap a positional choice</td><td>none (session)</td></tr>
<tr><td><a href="/games/darkline-paws.html">DarkLine Paws</a></td><td>~36 KB</td><td>Keyboard + click (3 modes)</td><td>none (session)</td></tr>
</table>
<p>Pick Black Cat on a Hot Tin Roof for a fast, fixed-length 60-second runner with a saved high score. Pick Mor Chess 2 for a slower chess-themed puzzle. Pick DarkLine Paws for three unrelated arcade modes in one download.</p>
<p>See <a href="/guides/how-to-play-black-cat-hot-tin-roof.html">how to play</a> and <a href="/guides/black-cat-hot-tin-roof-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-black-cat-hot-tin-roof', slug: 'guideshowtoplayblackcathottinroof', enTitle: 'How to Play Black Cat on a Hot Tin Roof', enDesc: 'How to play Black Cat on a Hot Tin Roof: jump timing, power-ups, the 60-second run, ~16 KB browser game.', html: howToEn },
  { route: 'black-cat-hot-tin-roof-when', slug: 'guidesblackcathottinroofwhen', enTitle: 'When to Play Black Cat on a Hot Tin Roof', enDesc: 'When Black Cat on a Hot Tin Roof fits: quick 60-second runs, a saved high score, ~16 KB.', html: whenEn },
  { route: 'black-cat-hot-tin-roof-vs-alternatives', slug: 'guidesblackcathottinroofvsalternatives', enTitle: 'Black Cat on a Hot Tin Roof vs Alternatives', enDesc: 'Compare Black Cat on a Hot Tin Roof with Mor Chess 2 and DarkLine Paws - download size, input, saves.', html: vsEn },
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
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplayblackcathottinroof`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}blackcathottinroofwhen`;
    else cmsSlug = `guides${loc.prefix}blackcathottinroofvsalternatives`;

    const howTitles = {
      pt: ['Como jogar Black Cat on a Hot Tin Roof', 'Como jogar Black Cat on a Hot Tin Roof: tempo de salto, power-ups, corrida de 60 segundos, ~16 KB.'],
      es: ['Como jugar Black Cat on a Hot Tin Roof', 'Como jugar Black Cat on a Hot Tin Roof: tiempo de salto, power-ups, carrera de 60 segundos, ~16 KB.'],
      vi: ['Cach choi Black Cat on a Hot Tin Roof', 'Huong dan Black Cat on a Hot Tin Roof: thoi diem nhay, vat pham, phien 60 giay, ~16 KB.'],
      id: ['Cara main Black Cat on a Hot Tin Roof', 'Panduan Black Cat on a Hot Tin Roof: waktu lompat, power-up, sesi 60 detik, ~16 KB.'],
      de: ['Black Cat on a Hot Tin Roof spielen', 'Black Cat on a Hot Tin Roof spielen: Sprungtiming, Power-ups, 60-Sekunden-Lauf, ~16 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar Black Cat on a Hot Tin Roof', 'Quando encaixa: corridas rapidas de 60 segundos, pontuacao salva, ~16 KB.'],
      es: ['Cuando jugar Black Cat on a Hot Tin Roof', 'Cuando encaja: carreras rapidas de 60 segundos, puntuacion guardada, ~16 KB.'],
      vi: ['Khi nao choi Black Cat on a Hot Tin Roof', 'Khi nao phu hop: phien 60 giay nhanh, luu diem cao, ~16 KB.'],
      id: ['Kapan main Black Cat on a Hot Tin Roof', 'Kapan cocok: sesi cepat 60 detik, skor tersimpan, ~16 KB.'],
      de: ['Wann Black Cat on a Hot Tin Roof spielen', 'Wann es passt: schnelle 60-Sekunden-Laeufe, gespeicherter Highscore, ~16 KB.'],
    };
    const vsTitles = {
      pt: ['Black Cat on a Hot Tin Roof vs alternativas', 'Compare com Mor Chess 2 e DarkLine Paws.'],
      es: ['Black Cat on a Hot Tin Roof vs alternativas', 'Compara con Mor Chess 2 y DarkLine Paws.'],
      vi: ['Black Cat on a Hot Tin Roof vs lua chon khac', 'So sanh voi Mor Chess 2 va DarkLine Paws.'],
      id: ['Black Cat on a Hot Tin Roof vs alternatif', 'Bandingkan dengan Mor Chess 2 dan DarkLine Paws.'],
      de: ['Black Cat on a Hot Tin Roof vs Alternativen', 'Vergleich mit Mor Chess 2 und DarkLine Paws.'],
    };

    let title, desc;
    if (!loc.code) { title = g.enTitle; desc = g.enDesc; }
    else if (g.route.includes('how-to-play')) [title, desc] = howTitles[loc.code];
    else if (g.route.includes('when')) [title, desc] = whenTitles[loc.code];
    else [title, desc] = vsTitles[loc.code];

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser cat runner game on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/black-cat-hot-tin-roof.html">Black Cat on a Hot Tin Roof</a> laedt einen ${SIZE} Dach-Runner im iframe: 60 Sekunden springen, Hindernisse ueberwinden, Black Bird fangen.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Highscore wird lokal gespeichert. Engine MIT (Black Cat on a Hot Tin Roof, tricsi, JS13K 2025).</p>
<p><a href="${routePath}">Diese Sprachversion</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/black-cat-hot-tin-roof.html">Black Cat on a Hot Tin Roof</a> loads a ${SIZE} rooftop runner in an iframe: jump for 60 seconds, clear obstacles, catch Black Bird.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>High score saved on this device. Engine MIT (Black Cat on a Hot Tin Roof, tricsi, JS13K 2025).</p>
<p><a href="${routePath}">This locale guide</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-bchtr-title svg-minipictogram-bchtr-desc">
  <title id="svg-minipictogram-bchtr-title">Black Cat on a Hot Tin Roof</title>
  <desc id="svg-minipictogram-bchtr-desc">Cat silhouette leaping over a rooftop</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#3C3C3E" aria-hidden="true"/>
  <rect x="8" y="42" width="48" height="8" fill="#D9C7A3"/>
  <rect x="8" y="42" width="6" height="14" fill="#D9C7A3"/>
  <rect x="50" y="42" width="6" height="14" fill="#D9C7A3"/>
  <path d="M18 40 L24 34 Q28 30 33 32 L37 27 Q40 24 43 27 Q45 30 42 32 L36 38 Q32 42 27 40 Z" fill="#1C1C1E"/>
  <path d="M32 26 L35 20 L37 27 Z" fill="#1C1C1E"/>
  <circle cx="47" cy="16" r="4" fill="#D9C7A3"/>
</svg>`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picRel = `source/web/src/main/webapp/static/img/illustrations/mini-pictogram/blackcathottinroof__${hash8}.svg`;
w(picRel, pictogramBody);
console.log('pictogram', picRel);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-blackcathottinroof
description: |
  Ground-truth for /games/black-cat-hot-tin-roof.html. Hand-authored
  2026-07-18 (game-discovery-loop-runbook fire147) from
  js13kGames/black-cat-on-a-hot-tin-roof (tricsi) at
  static/games/black-cat-hot-tin-roof/.
---

# tool-blackcathottinroof - /games/black-cat-hot-tin-roof.html

## Identity

- **Route**: /games/black-cat-hot-tin-roof.html
- **Slug**: \`black-cat-hot-tin-roof\` (CMS: \`blackcathottinroof\`)
- **Cluster**: games
- **Aliases**: /black-cat-hot-tin-roof.html

## Reader task

Run and jump across auto-scrolling rooftops for a fixed 60-second timer, clearing spikes (from the side) and birds (from above), collecting power-up items to gain a super power, and trying to reach the Black Bird encounter at time's end while beating a saved high score.

## Processing model

**client-side-only** - single-file competition bundle (index.html only, ~16 KB, roadroller-packed js13k build), same-origin iframe. Custom WebGL2 rendering engine (own entity-component-system under src/modules + src/scenes in the upstream source; GLSL vertex/fragment shaders authored by the same developer) at an internally-resized canvas resolution (starts at 192x108, resizes to viewport x devicePixelRatio at runtime - see src/modules/2d/context.ts::resizeContext). Input is Space key or Mouse0/tap (upstream \`CONTROLS = ["Space", "Mouse0"]\`); the FIRST click anywhere turns on Web Audio (browser autoplay policy) and plays a ~2s intro before the "Press Space to Play" / "Tap to Play" prompt appears. Zero CDN, zero fetch/XHR/WebSocket anywhere in the TypeScript source (verified by grepping the plaintext src/**/*.ts - the shipped bundle itself is roadroller-packed via \`eval(Function(...))\` self-decompression and is not directly greppable). Exactly ONE localStorage key (the high score), read/written through a namespaced \`storage()\` helper keyed off the \`<body data-prefix>\` attribute. Page carries noindex; canonical URL is /games/black-cat-hot-tin-roof.html.

## License analysis

- Upstream: **js13kGames/black-cat-on-a-hot-tin-roof** (org mirror of tricsi's / Csaba Csecskedi's js13kGames 2025 Black Cat theme entry), **MIT, Copyright (c) 2025 Csaba Csecskedi** (LICENSE vendored verbatim, verified via raw fetch; package.json's \`"license": "MIT"\` field also matches - no metadata mismatch).
- Vendored the exact pre-built competition artifact from the repo's \`.website/game.zip\` (the already-built, roadroller-minified submission bundle) rather than running the esbuild+roadroller build locally - this guarantees byte-for-byte parity with what was actually judged/played and avoids any local build-environment risk (the repo's package.json build script chains esbuild -> roadroller -> a custom zip step).
- Original rooftop-runner mechanic with the author's own WebGL2 engine, sprites, and GLSL shaders; "Black Bird" is an original antagonist character created for this entry, not a copy of any commercial franchise.
- Adaptation: added \`<meta name="robots" content="noindex">\` to index.html. Changed the \`<body data-prefix>\` attribute from \`bcoahtr_\` to \`ftol:bchtr:\` (site-wide localStorage-namespacing convention; the upstream \`storage()\` helper reads this attribute at runtime, so this is a pure data-attribute value change, not a code change).
- Clean ELIGIBLE; no operator adjudication needed.

## Reader-benefit framing menu

- V1: Fixed 60-second timed run (upstream \`GAME_TIME = 60\`) - a natural quick-break length.
- V2: Jump input supports variable height (hold for a bigger jump) and a mid-air double jump (per the upstream README's own control tips).
- V3: Spikes are clearable from the side; birds are attackable from above - two distinct obstacle-clearing techniques, not just "jump over everything."
- V4: Collectible power-up items (LAYER_POWER in the upstream source) grant Black Cat's "super power."
- V5: A named antagonist, "Black Bird," is encountered/caught at the end of a full 60-second survival run (upstream \`createBoss()\` call).
- V6: High score persists across sessions via a single namespaced localStorage key (\`ftol:bchtr:high\` after adaptation) - no account needed.
- V7: Procedural, code-generated chiptune music and sound effects (Web Audio, custom wave-synthesis helpers in the upstream source) - no audio files.
- V8: Mobile-aware: shows "Tap to Play" instead of "Press Space to Play" when a mobile user agent is detected.
- V9: About ${SIZE} total after Play - a single HTML file, one of the smallest games on this site.
- V10: Adapted from Black Cat on a Hot Tin Roof (MIT, tricsi/Csaba Csecskedi, JS13K 2025 Black Cat theme); ships LICENSE + CREDITS.

## Implemented features

- Custom WebGL2 rendering engine (own entity-component-system, GLSL shaders, sprite/tilemap/text/polygon render components) driving an auto-scrolling rooftop parallax scene (clouds, houses, floor tiles).
- Timed 60-second run with a live countdown and score display in the HUD.
- Jump physics with hold-for-height and mid-air double-jump support; side-clearable spike obstacles and top-attackable bird enemies.
- Collectible power-up item system feeding a "super power" grant.
- A named boss/antagonist ("Black Bird") triggered at the end of a full-length survival run.
- Procedural Web Audio music/SFX synthesis (no audio asset files) and a single persisted high-score value.

## Anti-claims

- Does NOT use a server backend, CDN, or fetch at runtime.
- Does NOT persist anything beyond a single high-score number (no other progress/save data).
- Is NOT the same game as Ritual Catacombs (a WebGL2 horror shooter) or any other shipped WebGL/Canvas action title on this site - its mechanic (fixed 60-second timed rooftop run with a named boss encounter and side/top-directional obstacle clearing) is distinct from every prior shipped game.
- Is NOT a clone of any specific commercial platformer; "Black Bird" and the rooftop-chase premise are original to this js13k entry.
- Does NOT require a gamepad or complex input scheme; Space or a single mouse/touch input covers every action.

## claim_catalogue_status

verified
`, 'utf8');

console.log('fire147 scaffold complete');
