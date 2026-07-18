#!/usr/bin/env node
/** fire136: scaffold unlucky-crossing CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SKILL = join(ROOT, '..', '.agent/skills/tool-unluckycrossing');
const DATE = '2026-07-18';

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

cmsTxt('unluckycrossing', 'BODYTITLE', 'Unlucky Crossing - Free Online Halloween Street Cat Game');
cmsTxt('unluckycrossing', 'BODYDESC', 'Unlucky Crossing - free browser arcade game: steer a black cat across Halloween streets, cause bad luck near humans for points, manage nine happiness lives, eat fish crackers to recover. Keyboard or touch, ~72 KB, no install.');
cmsTxt('unluckycrossing', 'BODYKW', 'unlucky crossing game, halloween cat street game, browser black cat arcade, js13k crossing game, infinite level cat game, free online cat game');

cmsHtml('unluckycrossing', 'BODYHTML', `<div class="w3-container">
    <p>Unlucky Crossing is a Halloween street-crossing arcade game in the browser: move a black cat row by row, dodge humans and obstacles, score points when you cross near pedestrians, and keep nine happiness lives. Fish crackers restore lives. Infinite procedural rows. About ~72 KB after Play, no install, no account.</p>
    <p>Prefer a keyboard typing duel? Try <a href="/games/cat-typing-race.html">Cat Typing Race</a>.</p>
</div>

<div id="ucxWrapper" class="w3-container" style="background:#1a1410; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="ucxStage" style="position:relative; width:100%; aspect-ratio:16/9; min-height:480px; background:#111; border-radius:6px; overflow:hidden;">
            <div id="ucxLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#c9a227;">UNLUCKY CROSSING</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Cross Halloween streets as a black cat, cause bad luck for points, and guard nine happiness lives. From unlucky-street by Ilya Smirnov (MIT, JS13K 2025). About ~72 KB downloads once when you press Play.</p>
                <button id="ucxPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Use arrow keys or WASD (Up to advance, Left/Right to move). On phones, tap L/R buttons or tap the road to step forward. Best on desktop or tablet.</p>
            </div>
        </div>
        <div id="ucxStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="ucxFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">No save data - each run starts fresh in your browser.</span>
    </div>
    <style>
        #ucxStage:fullscreen { border-radius: 0; }
        #ucxStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('unluckycrossing', 'BODYWELCOME', `<p>Welcome to Unlucky Crossing - a free browser Halloween street game you can play without an account or install. Press Play to load the ~72 KB canvas engine in a same-origin iframe, then click Start and use arrow keys or WASD to move your black cat across rows. Score points when you cross roads near humans; bumping a human costs one of nine happiness lives. Fish crackers can restore lives. The map generates new rows forever - chase a high score before lives hit zero. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('unluckycrossing', 'BODYJS', `<script>
    web.localUpload = false;
    var UCX_GAME_URL = 'unlucky-crossing/index.html';
    function ucxStatus(text) {
        var el = document.getElementById('ucxStatus');
        if (el) el.textContent = text;
    }
    function ucxInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'ucxFrame';
        frame.src = UCX_GAME_URL;
        frame.title = 'Unlucky Crossing game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            ucxStatus('Game loaded. Click Start, then use arrow keys or WASD. Up advances a row; Left/Right strafe.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('ucxLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('ucxStage');
        var playBtn = document.getElementById('ucxPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('ucxFullscreenBtn');
        playBtn.addEventListener('click', function () {
            ucxStatus('Loading the game (about 72 KB, one time - then cached)...');
            ucxInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('ucxFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('unluckycrossing', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Unlucky Crossing?</summary><p>A Halloween street-crossing arcade game. You move a black cat row by row across roads with humans and obstacles. Crossing near humans awards bad-luck points; touching a human costs one happiness life. Nine lives start each run.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>Keyboard: Arrow Up or W advances one row; Arrow Left/Right or A/D strafe on the current row. Touch: on-screen L and R buttons strafe; tap the road area to step forward. Click Start on the in-game menu after Play loads the iframe.</p></details>
<details class="faq-item"><summary>What are fish crackers?</summary><p>When you cross a road close enough to humans, they may drop a fish cracker on the next row. Walk over it to restore one happiness life (up from your current count).</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>No. The engine does not use localStorage or accounts. Each run starts from the title screen with nine lives and score zero.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ~72 KB of HTML, JavaScript, CSS, and PNG sprites after you press Play. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>Yes. The engine shows L/R touch buttons and accepts taps on the road to advance. Keyboard play is easiest on desktop.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from unlucky-street by Ilya Smirnov (ilyasmirnov03/unlucky-street) under the MIT license. This site build adds noindex on the iframe, English rebrand, and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/unlucky-crossing.jsp', JSP_WRAPPER);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Unlucky Crossing - Step by Step</b></h1>
<p>The <a href="/games/unlucky-crossing.html">Unlucky Crossing</a> page loads a ~72 KB Halloween street game in an iframe. Cross rows, score near humans, and protect nine happiness lives. Press Play on this page to start.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Up or W to advance a row when the lane is clear; use Left/Right or A/D to dodge humans and obstacles.</b></p></div>
<h2><b>Step 1 - press Play on this page</b></h2><p>Press Play to inject the iframe (~72 KB). Wait for assets to load, then click Start on the in-game menu. Upstream is ilyasmirnov03/unlucky-street (MIT, JS13K 2025).</p>
<h2><b>Step 2 - read the happiness meter</b></h2><p>Nine happy icons track lives. Bumping a human removes one life and grants brief invincibility. At zero lives the run ends and your final score appears.</p>
<h2><b>Step 3 - move along the row</b></h2><p>Hold Left/Right or A/D to strafe before stepping forward. You cannot walk through tombstone obstacles. Stay inside the screen edges.</p>
<h2><b>Step 4 - advance when safe</b></h2><p>Press Up or W (or tap the road on mobile) to move to the next row only when your cat is not blocked by an obstacle on that lane.</p>
<h2><b>Step 5 - score bad-luck points</b></h2><p>When you cross, humans you passed recently can award points - closer crosses score higher. Crossing multiple humans in one step applies a multiplier (about 1.25x for two, 2x for three or more).</p>
<h2><b>Step 6 - grab fish crackers</b></h2><p>High-scoring crosses sometimes spawn a fish cracker on the next row. Walk over it to regain one happiness life.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>~72 KB</td><td>index.html + assets/</td></tr><tr><td>Input</td><td>keyboard + touch</td><td>WASD / arrows; L-R buttons</td></tr><tr><td>Saves</td><td>none</td><td>fresh run each session</td></tr><tr><td>Lives</td><td>9 start</td><td>fish cracker +1</td></tr></table>
<p>See <a href="/guides/unlucky-crossing-when.html">when to play</a>, <a href="/guides/unlucky-crossing-vs-alternatives.html">comparisons</a>, and <a href="/games/glow-firefly-cat.html">Glow Firefly Cat</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Unlucky Crossing</b></h1>
<p><a href="/games/unlucky-crossing.html">Unlucky Crossing</a> fits short breaks where you want a score-chase arcade loop with simple row-by-row movement - about ~72 KB after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>One-more-row score runs</b></h2><p>Each forward step is a quick risk decision: dodge humans, avoid obstacles, and line up close crosses for bigger point splashes.</p>
<h2><b>When you like infinite levels</b></h2><p>New rows generate as you climb. There is no fixed campaign end - only your high score and nine happiness lives.</p>
<h2><b>When to pick another game</b></h2><p>Want keyboard typing instead of crossing? Use <a href="/games/cat-typing-race.html">Cat Typing Race</a>. Want a glow chase? Use <a href="/games/glow-firefly-cat.html">Glow Firefly Cat</a>.</p>
<p>See <a href="/guides/how-to-play-unlucky-crossing.html">how to play</a> and <a href="/guides/unlucky-crossing-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Unlucky Crossing vs Alternatives</b></h1>
<p><a href="/games/unlucky-crossing.html">Unlucky Crossing</a> is a row-crossing Halloween cat arcade with nine lives and proximity scoring. Compare it with two other free browser cat games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Unlucky Crossing</td><td>~72 KB</td><td>WASD / arrows + touch L-R</td><td>none</td></tr>
<tr><td><a href="/games/cat-typing-race.html">Cat Typing Race</a></td><td>~28 KB</td><td>Keyboard A-Z duel</td><td>none</td></tr>
<tr><td><a href="/games/glow-firefly-cat.html">Glow Firefly Cat</a></td><td>~28 KB</td><td>Keyboard move + space</td><td>ftol:glowfireflycat:*</td></tr>
</table>
<p>Pick Unlucky Crossing for infinite street rows and happiness-life management. Pick Cat Typing Race for typing speed duels. Pick Glow Firefly Cat for firefly collection platforming.</p>
<p>See <a href="/guides/how-to-play-unlucky-crossing.html">how to play</a> and <a href="/guides/unlucky-crossing-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-unlucky-crossing', slug: 'guideshowtoplayunluckycrossing', enTitle: 'How to Play Unlucky Crossing - Step by Step', enDesc: 'How to play Unlucky Crossing: cross Halloween rows, score near humans, fish crackers, nine lives, ~72 KB browser arcade.', html: howToEn },
  { route: 'unlucky-crossing-when', slug: 'guidesunluckycrossingwhen', enTitle: 'When to Play Unlucky Crossing', enDesc: 'When Unlucky Crossing fits: infinite row arcade, happiness lives, keyboard or touch, ~72 KB.', html: whenEn },
  { route: 'unlucky-crossing-vs-alternatives', slug: 'guidesunluckycrossingvsalternatives', enTitle: 'Unlucky Crossing vs Alternatives', enDesc: 'Compare Unlucky Crossing with Cat Typing Race and Glow Firefly Cat - download size, input, saves.', html: vsEn },
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
    } else if (g.route === 'how-to-play-unlucky-crossing') {
      cmsSlug = `guides${loc.prefix}howtoplayunluckycrossing`;
    } else if (g.route === 'unlucky-crossing-when') {
      cmsSlug = `guides${loc.prefix}unluckycrossingwhen`;
    } else {
      cmsSlug = `guides${loc.prefix}unluckycrossingvsalternatives`;
    }

    const howTitles = {
      pt: [`Como jogar Unlucky Crossing`, `Como jogar Unlucky Crossing: ruas Halloween, vidas, peixe seco, ~72 KB.`],
      es: [`Como jugar Unlucky Crossing`, `Como jugar Unlucky Crossing: calles Halloween, vidas, galleta pescado, ~72 KB.`],
      vi: [`Cach choi Unlucky Crossing`, `Huong dan Unlucky Crossing: vuot duong, diem xau, 9 mang, ~72 KB.`],
      id: [`Cara main Unlucky Crossing`, `Panduan Unlucky Crossing: lintas jalan, skor, 9 nyawa, ~72 KB.`],
      de: [`Unlucky Crossing spielen`, `Unlucky Crossing spielen: Strassen, Glueck, 9 Leben, ~72 KB.`],
    };
    const whenTitles = {
      pt: [`Quando jogar Unlucky Crossing`, `Quando Unlucky Crossing encaixa: arcade infinito, ~72 KB.`],
      es: [`Cuando jugar Unlucky Crossing`, `Cuando jugar Unlucky Crossing: arcade infinito, ~72 KB.`],
      vi: [`Khi nao choi Unlucky Crossing`, `Khi nao choi Unlucky Crossing: vuot hang vo han, ~72 KB.`],
      id: [`Kapan main Unlucky Crossing`, `Kapan main Unlucky Crossing: arcade baris tak terbatas, ~72 KB.`],
      de: [`Wann Unlucky Crossing spielen`, `Wann Unlucky Crossing spielen: Endlos-Strassen, ~72 KB.`],
    };
    const vsTitles = {
      pt: [`Unlucky Crossing vs alternativas`, `Compare Unlucky Crossing com Cat Typing Race e Glow Firefly Cat.`],
      es: [`Unlucky Crossing vs alternativas`, `Compara Unlucky Crossing con Cat Typing Race y Glow Firefly Cat.`],
      vi: [`Unlucky Crossing vs lua chon khac`, `So sanh Unlucky Crossing voi Cat Typing Race va Glow Firefly Cat.`],
      id: [`Unlucky Crossing vs alternatif`, `Bandingkan Unlucky Crossing dengan Cat Typing Race dan Glow Firefly Cat.`],
      de: [`Unlucky Crossing vs Alternativen`, `Unlucky Crossing vs Cat Typing Race und Glow Firefly Cat vergleichen.`],
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
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser Halloween cat arcade on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/unlucky-crossing.html">Unlucky Crossing</a> laedt ein ~72 KB Halloween-Strassen-Spiel im iframe. WASD oder Pfeiltasten bewegen die schwarze Katze; neun Gluecksleben; Fischcracker heilen.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Steuerung: Pfeil hoch oder W fuer naechste Reihe; links/rechts strafen. Touch: L/R-Tasten. Engine MIT (ilyasmirnov03/unlucky-street, JS13K 2025).</p>
<p><a href="${routePath}">Diese Sprachversion</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/unlucky-crossing.html">Unlucky Crossing</a> loads a ~72 KB Halloween street arcade in an iframe. Cross rows near humans for bad-luck points; nine happiness lives; fish crackers restore one life.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Infinite procedural rows. Keyboard WASD or arrows; touch L/R buttons. Engine MIT (ilyasmirnov03/unlucky-street, JS13K 2025).</p>
<p><a href="${routePath}">This locale guide</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

w('source/web/src/main/webapp/static/img/illustrations/mini-pictogram/unluckycrossing__a9f3b2e1.svg', `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-ucx-title svg-minipictogram-ucx-desc">
  <title id="svg-minipictogram-ucx-title">Unlucky Crossing</title>
  <desc id="svg-minipictogram-ucx-desc">Halloween black cat street crossing arcade game</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1a1410" aria-hidden="true"/>
  <rect x="8" y="36" width="48" height="8" fill="#444" rx="2"/>
  <rect x="8" y="24" width="48" height="8" fill="#555" rx="2"/>
  <ellipse cx="32" cy="20" rx="10" ry="8" fill="#111" stroke="#c9a227" stroke-width="1.5"/>
  <polygon points="26,14 28,8 30,14" fill="#111"/>
  <polygon points="34,14 36,8 38,14" fill="#111"/>
  <circle cx="29" cy="19" r="1.5" fill="#c9a227"/>
  <circle cx="35" cy="19" r="1.5" fill="#c9a227"/>
  <text x="32" y="58" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="6" font-weight="700" letter-spacing="0.3" fill="#c9a227">UCX</text>
</svg>`);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-unluckycrossing
description: |
  Ground-truth for /games/unlucky-crossing.html. Hand-authored 2026-07-18
  (game-discovery-loop-runbook fire136) from ilyasmirnov03/unlucky-street at
  static/games/unlucky-crossing/.
---

# tool-unluckycrossing - /games/unlucky-crossing.html

## Identity

- **Route**: /games/unlucky-crossing.html
- **Slug**: \`unlucky-crossing\` (CMS: \`unluckycrossing\`)
- **Cluster**: games
- **Aliases**: /unlucky-crossing.html

## Reader task

Cross Halloween streets as a black cat row by row: dodge humans and tombstone obstacles, score bad-luck points when crossing near pedestrians, manage nine happiness lives, and eat fish crackers to recover lives in an infinite procedural map.

## Processing model

**client-side-only** - Vite-built canvas game (~72 KB: index.html + assets/ JS/CSS/PNG), same-origin iframe. No CDN, no analytics, no external fonts at runtime. Engine HTML is noindex; canonical URL is /games/unlucky-crossing.html. Canvas id \`game\`, full-viewport 2D canvas scaled by viewport width ratio.

## License analysis

- Upstream: ilyasmirnov03/unlucky-street, **MIT, Copyright (c) 2025 Ilya Smirnov** (LICENSE vendored).
- Original js13k 2025 Black Cat theme entry; not a commercial clone (generic Halloween crossing concept).
- PNG sprites bundled in assets/ (player, human, obstacles, candy fish).
- **No localStorage** in engine source; site policy reserves \`ftol:unluckycrossing:*\` namespace.
- Adaptations: noindex meta, English rebrand Unlucky Crossing on iframe title/menu header, LICENSE + CREDITS shipped.
- Clean ELIGIBLE_WITH_CAVEAT cleared (Vite build base ./ done); no operator adjudication.

## Reader-benefit framing menu

- V1: Arrow Up or W advances one row when the next lane has no obstacle blocking your x position.
- V2: Arrow Left/Right or A/D strafe on the current row; cat faces left/right while moving sideways.
- V3: Nine happiness lives shown as icons; bumping a human costs one life with ~1s invincibility blink.
- V4: Crossing near humans awards bad-luck score (up to ~150 base per human, distance decay; 2-human 1.25x, 3+ 2x multiplier).
- V5: High-scoring crosses can spawn a fish cracker on the next row; walking over it restores one life.
- V6: Infinite level generation - old rows scroll away as new rows with humans/obstacles spawn.
- V7: Touch controls: on-screen L/R buttons strafe; tap elsewhere on mobile overlay to advance a row.
- V8: About ~72 KB after Play; Tutorial button available on start menu.
- V9: Adapted from unlucky-street by Ilya Smirnov (MIT, JS13K 2025); ships LICENSE + CREDITS.

## Implemented features

- Canvas 2D top-down rows with procedurally generated tombstone obstacles and walking humans.
- Start menu with Start and Tutorial buttons; death screen with final score and Restart.
- Score HUD and lives HUD; splash text for point awards on cross.
- Mobile touch overlay with L/R buttons plus tap-to-advance on road area.
- Camera scroll as player climbs rows; row pool recycles for infinite play.

## Anti-claims

- Does NOT use a server backend or CDN at runtime.
- Does NOT persist high scores or progress in localStorage (no saves in engine).
- Is NOT a branded clone of Frogger or a commercial crossing franchise (original Halloween cat theme).
- Does NOT include pointer-lock or gamepad controls.

## claim_catalogue_status

verified
`, 'utf8');

console.log('fire136 scaffold: CMS + JSP + pictogram + SKILL written');
