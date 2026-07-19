#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const WRAPPER = process.env.WRAPPER_ROOT || '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const SKILL = join(WRAPPER, '.agent/skills/tool-classicpong');
const DATE = '2026-07-19';
const SIZE = '~60 KB';

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

cmsTxt('classicpong', 'BODYTITLE', 'Classic Pong - Free Online Canvas Pong Game');
cmsTxt('classicpong', 'BODYDESC', 'Classic Pong - free browser canvas table tennis: 1P vs AI, 2P local, or demo mode, about 60 KB.');
cmsTxt('classicpong', 'BODYKW', 'classic pong game, canvas pong online, jake gordon javascript pong, free browser table tennis, html5 pong');

cmsHtml('classicpong', 'BODYHTML', `<div class="w3-container">
    <p>Classic Pong is a free browser canvas table-tennis game. Press 1 for single player vs AI, 2 for two players on one keyboard, or 0 to watch the computers play. About ${SIZE}, no install, no account.</p>
    <p>Want a boomerang dungeon instead? Try <a href="/games/bounce-back.html">Bounce Back</a>.</p>
</div>

<div id="cpWrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="cpStage" style="position:relative; width:100%; aspect-ratio:4/3; max-width:800px; margin:0 auto; min-height:360px; background:#1a1a1a; border-radius:6px; overflow:hidden;">
            <div id="cpLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#9FD;">CLASSIC PONG</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Press 1 for vs AI, 2 for two players, 0 for demo. Adapted from Canvas Pong by Jake Gordon (MIT). About ${SIZE}.</p>
                <button id="cpPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Player 1: Q/A. Player 2: P/L. Esc abandons a match. Best on desktop with a keyboard.</p>
            </div>
        </div>
        <div id="cpStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="cpFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Session-only play - no save data in this build.</span>
    </div>
    <style>
        #cpStage:fullscreen { border-radius: 0; max-width: none; }
        #cpStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('classicpong', 'BODYWELCOME', `<p>Welcome to Classic Pong - a free browser canvas table-tennis game you can play without an account or install. Press Play to load the ${SIZE} game in a same-origin iframe. Choose 1 for vs AI, 2 for local two-player, or 0 for a computer demo. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('classicpong', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var CP_GAME_URL = 'classic-pong/index.html';
    function cpStatus(text) {
        var el = document.getElementById('cpStatus');
        if (el) el.textContent = text;
    }
    function cpInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'cpFrame';
        frame.src = CP_GAME_URL;
        frame.title = 'Classic Pong game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            cpStatus('Game loaded. Press 1, 2, or 0 inside the game, then use Q/A and P/L.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('cpLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('cpStage');
        var playBtn = document.getElementById('cpPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('cpFullscreenBtn');
        playBtn.addEventListener('click', function () {
            cpStatus('Loading the game (about 60 KB, one time - then cached)...');
            cpInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('cpFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('classicpong', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Classic Pong?</summary><p>A free browser canvas version of classic table tennis: bounce the ball past the other paddle to score.</p></details>
<details class="faq-item"><summary>How do I start a match?</summary><p>After Play loads the game, press 1 for single player vs AI, 2 for two players on one keyboard, or 0 for computer vs computer.</p></details>
<details class="faq-item"><summary>What are the controls?</summary><p>Player 1 uses Q and A. Player 2 uses P and L. Esc abandons the current match.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>No. This build is session-only with no localStorage saves.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of HTML, JavaScript, CSS, images, and short WAV sounds after you press Play.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>It can load on a phone, but the designed controls are keyboard keys, so a desktop or laptop is the better fit.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from Canvas Pong by Jake Gordon under the MIT license. This site build adds noindex, trims tutorial part-links, and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/classic-pong.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Classic Pong - Step by Step</b></h1>
<p>The <a href="/games/classic-pong.html">Classic Pong</a> page loads a ${SIZE} canvas table-tennis game in an iframe.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Play, then 1/2/0 to start, and move paddles with Q/A and P/L.</b></p></div>
<h2><b>Step 1 - press Play</b></h2><p>Press Play to inject the iframe (${SIZE}). The court boots with the press-1 / press-2 menu art.</p>
<h2><b>Step 2 - choose a mode</b></h2><p>Press 1 for vs AI, 2 for two players, or 0 for a computer demo. Esc abandons a match.</p>
<h2><b>Step 3 - move your paddle</b></h2><p>Player 1 uses Q (up) and A (down). Player 2 uses P (up) and L (down).</p>
<h2><b>Step 4 - score</b></h2><p>Bounce the ball past the other paddle. First to win the rally race - keep returning until someone misses.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>JS + CSS + images + WAV</td></tr><tr><td>Input</td><td>keyboard</td><td>1/2/0 + Q/A + P/L</td></tr><tr><td>Saves</td><td>none</td><td>session-only</td></tr><tr><td>Core loop</td><td>serve -> rally -> score</td><td>classic pong</td></tr></table>
<p>See <a href="/guides/classic-pong-when.html">when to play</a>, <a href="/guides/classic-pong-vs-alternatives.html">comparisons</a>, and <a href="/games/bounce-back.html">Bounce Back</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Classic Pong</b></h1>
<p><a href="/games/classic-pong.html">Classic Pong</a> fits a short keyboard table-tennis session - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>When you want pure paddle skill</b></h2><p>No power-ups or campaigns - just timing and angles.</p>
<h2><b>When you want local two-player</b></h2><p>Mode 2 shares one keyboard for a quick couch match.</p>
<h2><b>When to pick another game</b></h2><p>Want a boomerang roguelite? Use <a href="/games/bounce-back.html">Bounce Back</a>. Want draw-to-move? Use <a href="/games/rune-keeper.html">Rune Keeper</a>.</p>
<p>See <a href="/guides/how-to-play-classic-pong.html">how to play</a> and <a href="/guides/classic-pong-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Classic Pong vs Alternatives</b></h1>
<p><a href="/games/classic-pong.html">Classic Pong</a> is canvas table tennis. Compare it with two other free browser games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Classic Pong</td><td>${SIZE}</td><td>Keyboard 1/2/0 + Q/A + P/L</td><td>none (session)</td></tr>
<tr><td><a href="/games/bounce-back.html">Bounce Back</a></td><td>~120 KB</td><td>WASD + mouse throw + Space</td><td>ftol:bounceback:*</td></tr>
<tr><td><a href="/games/rune-keeper.html">Rune Keeper</a></td><td>~28 KB</td><td>Mouse or touch drawing</td><td>none (session)</td></tr>
</table>
<p>Pick Classic Pong for pure paddle rallies. Pick Bounce Back for boomerang dungeon combat. Pick Rune Keeper for gesture drawing.</p>
<p>See <a href="/guides/how-to-play-classic-pong.html">how to play</a> and <a href="/guides/classic-pong-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-classic-pong', slug: 'guideshowtoplayclassicpong', enTitle: 'How to Play Classic Pong - Step by Step', enDesc: 'How to play Classic Pong: press 1/2/0, move with Q/A and P/L, ~60 KB browser canvas pong.', html: howToEn },
  { route: 'classic-pong-when', slug: 'guidesclassicpongwhen', enTitle: 'When to Play Classic Pong', enDesc: 'When Classic Pong fits: short keyboard table-tennis sessions, ~60 KB.', html: whenEn },
  { route: 'classic-pong-vs-alternatives', slug: 'guidesclassicpongvsalternatives', enTitle: 'Classic Pong vs Alternatives', enDesc: 'Compare Classic Pong with Bounce Back and Rune Keeper - size, input, saves.', html: vsEn },
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
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplayclassicpong`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}classicpongwhen`;
    else cmsSlug = `guides${loc.prefix}classicpongvsalternatives`;

    const howTitles = {
      pt: ['Como jogar Classic Pong', 'Como jogar Classic Pong: 1/2/0, Q/A e P/L, ~60 KB.'],
      es: ['Como jugar Classic Pong', 'Como jugar Classic Pong: 1/2/0, Q/A y P/L, ~60 KB.'],
      vi: ['Cach choi Classic Pong', 'Huong dan Classic Pong: 1/2/0, Q/A va P/L, ~60 KB.'],
      id: ['Cara main Classic Pong', 'Panduan Classic Pong: 1/2/0, Q/A dan P/L, ~60 KB.'],
      de: ['Classic Pong spielen', 'Classic Pong spielen: 1/2/0, Q/A und P/L, ~60 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar Classic Pong', 'Quando encaixa: sessoes curtas de tenis de mesa no teclado, ~60 KB.'],
      es: ['Cuando jugar Classic Pong', 'Cuando encaja: sesiones cortas de tenis de mesa con teclado, ~60 KB.'],
      vi: ['Khi nao choi Classic Pong', 'Khi nao phu hop: phien bong ban ngan tren ban phim, ~60 KB.'],
      id: ['Kapan main Classic Pong', 'Kapan cocok: sesi tenis meja singkat di keyboard, ~60 KB.'],
      de: ['Wann Classic Pong spielen', 'Wann es passt: kurze Tischtennis-Sessions mit Tastatur, ~60 KB.'],
    };
    const vsTitles = {
      pt: ['Classic Pong vs alternativas', 'Compare com Bounce Back e Rune Keeper.'],
      es: ['Classic Pong vs alternativas', 'Compara con Bounce Back y Rune Keeper.'],
      vi: ['Classic Pong vs lua chon khac', 'So sanh voi Bounce Back va Rune Keeper.'],
      id: ['Classic Pong vs alternatif', 'Bandingkan dengan Bounce Back dan Rune Keeper.'],
      de: ['Classic Pong vs Alternativen', 'Vergleich mit Bounce Back und Rune Keeper.'],
    };

    let title, desc;
    if (!loc.code) { title = g.enTitle; desc = g.enDesc; }
    else if (g.route.includes('how-to-play')) [title, desc] = howTitles[loc.code];
    else if (g.route.includes('when')) [title, desc] = whenTitles[loc.code];
    else [title, desc] = vsTitles[loc.code];

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser pong on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/classic-pong.html">Classic Pong</a> laedt einen ${SIZE} Canvas-Tischtennis-Lauf im iframe: 1/2/0 starten, Q/A und P/L bewegen.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Kein Speicherstand, session-only. Engine MIT (Jake Gordon).</p>
<p><a href="${routePath}">Diese Sprachversion</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/classic-pong.html">Classic Pong</a> loads a ${SIZE} canvas table-tennis game in an iframe: press 1/2/0, move with Q/A and P/L.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>No save data, session-only. Engine MIT (Jake Gordon).</p>
<p><a href="${routePath}">This locale guide</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-cp-title svg-minipictogram-cp-desc">
  <title id="svg-minipictogram-cp-title">Classic Pong</title>
  <desc id="svg-minipictogram-cp-desc">Pong court with two paddles and a ball</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <rect x="14" y="18" width="4" height="18" fill="#D9C7A3"/>
  <rect x="46" y="28" width="4" height="18" fill="#7DAFA3"/>
  <circle cx="34" cy="30" r="3" fill="#5B73AE"/>
  <line x1="32" y1="12" x2="32" y2="52" stroke="#5B73AE" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>
</svg>
`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picName = `classicpong__${hash8}.svg`;
w(`source/web/src/main/webapp/static/img/illustrations/mini-pictogram/${picName}`, pictogramBody);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-classicpong
description: |
  Ground-truth for /games/classic-pong.html. Hand-authored
  ${DATE} (game-discovery-loop-runbook fire153) from
  jakesgordon/javascript-pong at static/games/classic-pong/.
---

# tool-classicpong - /games/classic-pong.html

## Identity

- **Route**: /games/classic-pong.html
- **Slug**: \`classic-pong\` (CMS: \`classicpong\`)
- **Cluster**: games
- **Aliases**: /classic-pong.html

## Reader task

Play classic canvas table tennis: start with 1/2/0, move paddles with Q/A and P/L, score by sending the ball past the opponent.

## Processing model

**client-side-only** - \`index.html\` + \`game.js\` + \`pong.js\` + \`pong.css\` + images + WAV sounds (~60 KB). Zero CDN, zero fetch/XHR, zero localStorage. Page carries noindex; canonical URL is /games/classic-pong.html.

## License analysis

- Upstream: **jakesgordon/javascript-pong**, **MIT, Copyright (c) 2011-2016 Jake Gordon and contributors** (LICENSE vendored).
- Original HTML5 canvas Pong tutorial/game; classic genre, not a commercial franchise clone.
- Adaptation: noindex; trimmed tutorial part-links; kept \`Game.ready\` + \`Game.start\` boot with sound on.
- Clean ELIGIBLE. Distinct from Mono Paddle Duel (different upstream).

## Reader-benefit framing menu

- V1: Modes 1 (vs AI), 2 (local 2P), 0 (demo).
- V2: Keyboard paddles Q/A and P/L; Esc abandons.
- V3: Optional sound effects (ping/pong/wall/goal WAV).
- V4: ~60 KB after Play; session-only.
- V5: Adapted from Canvas Pong (MIT, Jake Gordon).

## Implemented features

- Canvas court with walls, paddles, ball acceleration, AI levels.
- Menu art (press1/press2/winner images).
- Short WAV SFX via Game.createAudio.

## Anti-claims

- Does NOT use a server, CDN, or fetch at runtime.
- Does NOT persist progress (no localStorage).
- Is NOT the same game as Mono Paddle Duel (cursor-arcade extract).
- Does NOT claim touch-first controls.

## claim_catalogue_status

verified
`, 'utf8');

console.log('scaffold done', { picName, hash8, skill: SKILL });
