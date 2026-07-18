#!/usr/bin/env node
/** fire143: scaffold boing-cat-platformer CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..'); // web-test
const SKILL = join(ROOT, '..', '.agent/skills/tool-boingcatplatformer');
const DATE = '2026-07-18';
const SIZE = '~130 KB';

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

cmsTxt('boingcatplatformer', 'BODYTITLE', 'Boing Cat Platformer - Free Online Auto-Run Jump Game');
cmsTxt('boingcatplatformer', 'BODYDESC', 'Boing Cat Platformer - free browser auto-run platformer: time Space-bar jumps over spikes and gaps across three tile-built levels to a duck-held finish flag, about 130 KB, no install.');
cmsTxt('boingcatplatformer', 'BODYKW', 'boing cat platformer game, auto run cat jump game, browser platformer spikes, js13k kontra platformer, free online cat jumping game');

cmsHtml('boingcatplatformer', 'BODYHTML', `<div class="w3-container">
    <p>Boing Cat Platformer is a free browser auto-run platformer: press Space (or a gamepad button) to time jumps over spikes and gaps while your cat runs forward on its own, across three tile-built levels to a finish flag held by a duck friend. About ${SIZE} after Play, no install, no account.</p>
    <p>Want an endless high-score chase instead? Try <a href="/games/pixel-spike-run.html">Pixel Spike Run</a>.</p>
</div>

<div id="bcpWrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="bcpStage" style="position:relative; width:100%; aspect-ratio:4/3; min-height:360px; background:#87CEEB; border-radius:6px; overflow:hidden;">
            <div id="bcpLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#1c1c1e; padding:16px; background:rgba(135,206,235,0.92);">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#1c1c1e;">BOING CAT</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#2f2f33;">Time Space-bar jumps over spikes and gaps in three tile-built levels. From BoingKat by Make Classic Games (MIT, JS13K). About ${SIZE} downloads once when you press Play.</p>
                <button id="bcpPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#2f2f33; max-width:480px; margin-top:12px;">Keyboard: Space jumps (the cat auto-runs forward). Gamepad: bottom face button jumps. Best with a keyboard or gamepad.</p>
            </div>
        </div>
        <div id="bcpStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="bcpFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Session-only play - no save data in this build.</span>
    </div>
    <style>
        #bcpStage:fullscreen { border-radius: 0; }
        #bcpStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('boingcatplatformer', 'BODYWELCOME', `<p>Welcome to Boing Cat Platformer - a free browser auto-run platformer you can play without an account or install. Press Play to load the ${SIZE} canvas engine in a same-origin iframe, then press Space (or a gamepad button) on the title screen to start. Your cat runs forward on its own; time each Space press to hop over spikes and gaps across three tile-built levels. Reach the flag held by a duck friend to clear a level, then clear all three for a final score screen. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('boingcatplatformer', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var BCP_GAME_URL = 'boing-cat-platformer/index.html';
    function bcpStatus(text) {
        var el = document.getElementById('bcpStatus');
        if (el) el.textContent = text;
    }
    function bcpInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'bcpFrame';
        frame.src = BCP_GAME_URL;
        frame.title = 'Boing Cat Platformer game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            bcpStatus('Game loaded. Press Space (or a gamepad button) to start.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('bcpLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('bcpStage');
        var playBtn = document.getElementById('bcpPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('bcpFullscreenBtn');
        playBtn.addEventListener('click', function () {
            bcpStatus('Loading the game (about 130 KB, one time - then cached)...');
            bcpInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('bcpFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('boingcatplatformer', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Boing Cat Platformer?</summary><p>An auto-run platformer. Your cat moves forward on its own across three tile-built levels; press Space (or a gamepad button) to time jumps over spikes and gaps and reach the flag held by a duck friend.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>Space jumps; the cat runs forward automatically. A connected gamepad's bottom face button also jumps. Press Space again on Game Over, a level win screen, or the final screen to continue.</p></details>
<details class="faq-item"><summary>What is the goal?</summary><p>Clear three levels by reaching each level's end flag. Score adds roughly one point per ten pixels traveled; the run ends with a final score after level three.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>This build is session-only. There is no save data. Closing the tab resets progress and score.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of HTML, JavaScript, and two small PNG images after you press Play. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>The page loads on mobile, but jump timing needs a keyboard Space key or a connected gamepad; a touch button is not included in this build. Desktop or laptop is the recommended experience.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from BoingKat by Zerasul and Banus10 (Make Classic Games, js13kGames 2025) under the MIT license, built with the Kontra.js engine and ZzFX audio (both MIT). This site build adds noindex on the iframe, rebrands the title screen to Boing Cat, converts the three level files to plain JavaScript modules, and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/boing-cat-platformer.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Boing Cat Platformer - Step by Step</b></h1>
<p>The <a href="/games/boing-cat-platformer.html">Boing Cat Platformer</a> page loads a ${SIZE} auto-run platformer in an iframe. Your cat runs forward on its own across three tile-built levels; time Space presses to clear spikes and gaps.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Play, then press Space (or a gamepad button) to start and to jump.</b></p></div>
<h2><b>Step 1 - press Play and Space to start</b></h2><p>Press Play to inject the iframe (${SIZE}). On the title screen press Space, or a gamepad bottom face button, to start.</p>
<h2><b>Step 2 - time your jumps</b></h2><p>The cat runs forward on its own. Press Space to jump over spikes and gaps; a well-timed jump clears longer gaps.</p>
<h2><b>Step 3 - reach the flag</b></h2><p>Each of the three levels ends at a flag held by a duck friend. Reaching it shows a win screen with that level's score.</p>
<h2><b>Step 4 - clear all three levels</b></h2><p>Press Space after a win screen to continue to the next level. After level three, a congratulations screen shows the total score.</p>
<h2><b>Step 5 - restart after Game Over</b></h2><p>Falling off a platform or hitting a spike ends the run. Press Space to try again from level one.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>index.html + js modules</td></tr><tr><td>Input</td><td>Space (+ gamepad)</td><td>auto-run, timed jump</td></tr><tr><td>Saves</td><td>none</td><td>session-only</td></tr><tr><td>Levels</td><td>3 tile-built</td><td>duck-flag finish</td></tr></table>
<p>See <a href="/guides/boing-cat-platformer-when.html">when to play</a>, <a href="/guides/boing-cat-platformer-vs-alternatives.html">comparisons</a>, and <a href="/games/pixel-spike-run.html">Pixel Spike Run</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Boing Cat Platformer</b></h1>
<p><a href="/games/boing-cat-platformer.html">Boing Cat Platformer</a> fits quick timing-focused breaks where you want short, fixed levels rather than an endless runner - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>Quick timed-jump sessions</b></h2><p>Only Space matters: press it at the right moment to clear spikes and gaps while your cat runs forward automatically.</p>
<h2><b>When you want a finish line, not an endless loop</b></h2><p>Three tile-built levels end at a duck-held flag, then a final score screen - a short, complete play session.</p>
<h2><b>When to pick another game</b></h2><p>Want an endless high-score chase instead? Use <a href="/games/pixel-spike-run.html">Pixel Spike Run</a>. Want a light/dark layer-swap puzzle across 25 stages? Use <a href="/games/layer-flip-platformer.html">Layer Flip Platformer</a>.</p>
<p>See <a href="/guides/how-to-play-boing-cat-platformer.html">how to play</a> and <a href="/guides/boing-cat-platformer-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Boing Cat Platformer vs Alternatives</b></h1>
<p><a href="/games/boing-cat-platformer.html">Boing Cat Platformer</a> is a fixed-level auto-run platformer with timed jumps. Compare it with two other free browser platformers on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Boing Cat Platformer</td><td>${SIZE}</td><td>Space (auto-run + timed jump)</td><td>none (session)</td></tr>
<tr><td><a href="/games/pixel-spike-run.html">Pixel Spike Run</a></td><td>~25 KB</td><td>Space/click/tap (endless)</td><td>none (session)</td></tr>
<tr><td><a href="/games/layer-flip-platformer.html">Layer Flip Platformer</a></td><td>~44 KB</td><td>Space flips layers (25 stages)</td><td>none</td></tr>
</table>
<p>Pick Boing Cat Platformer for three fixed tile levels with a duck-flag finish line. Pick Pixel Spike Run for an endless high-score spike dodge. Pick Layer Flip Platformer for a 25-stage light/dark puzzle platformer.</p>
<p>See <a href="/guides/how-to-play-boing-cat-platformer.html">how to play</a> and <a href="/guides/boing-cat-platformer-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-boing-cat-platformer', slug: 'guideshowtoplayboingcatplatformer', enTitle: 'How to Play Boing Cat Platformer - Step by Step', enDesc: 'How to play Boing Cat Platformer: Space to jump, auto-run, spikes and gaps, three tile levels, ~130 KB browser platformer.', html: howToEn },
  { route: 'boing-cat-platformer-when', slug: 'guidesboingcatplatformerwhen', enTitle: 'When to Play Boing Cat Platformer', enDesc: 'When Boing Cat Platformer fits: quick timed-jump sessions, fixed three-level runs, ~130 KB.', html: whenEn },
  { route: 'boing-cat-platformer-vs-alternatives', slug: 'guidesboingcatplatformervsalternatives', enTitle: 'Boing Cat Platformer vs Alternatives', enDesc: 'Compare Boing Cat Platformer with Pixel Spike Run and Layer Flip Platformer - download size, input, saves.', html: vsEn },
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
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplayboingcatplatformer`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}boingcatplatformerwhen`;
    else cmsSlug = `guides${loc.prefix}boingcatplatformervsalternatives`;

    const howTitles = {
      pt: ['Como jogar Boing Cat Platformer', 'Como jogar Boing Cat Platformer: pulos com Espaco, corrida automatica, 3 fases, ~130 KB.'],
      es: ['Como jugar Boing Cat Platformer', 'Como jugar Boing Cat Platformer: saltos con Espacio, carrera automatica, 3 niveles, ~130 KB.'],
      vi: ['Cach choi Boing Cat Platformer', 'Huong dan Boing Cat Platformer: nhay bang phim Space, tu chay, 3 man, ~130 KB.'],
      id: ['Cara main Boing Cat Platformer', 'Panduan Boing Cat Platformer: lompat tombol Space, lari otomatis, 3 level, ~130 KB.'],
      de: ['Boing Cat Platformer spielen', 'Boing Cat Platformer spielen: Space-Sprung, Auto-Lauf, 3 Level, ~130 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar Boing Cat Platformer', 'Quando Boing Cat Platformer encaixa: sessoes rapidas de pulo, ~130 KB.'],
      es: ['Cuando jugar Boing Cat Platformer', 'Cuando jugar Boing Cat Platformer: sesiones rapidas de salto, ~130 KB.'],
      vi: ['Khi nao choi Boing Cat Platformer', 'Khi nao choi Boing Cat Platformer: phien nhay ngan, ~130 KB.'],
      id: ['Kapan main Boing Cat Platformer', 'Kapan main Boing Cat Platformer: sesi lompat singkat, ~130 KB.'],
      de: ['Wann Boing Cat Platformer spielen', 'Wann Boing Cat Platformer spielen: kurze Sprung-Runden, ~130 KB.'],
    };
    const vsTitles = {
      pt: ['Boing Cat Platformer vs alternativas', 'Compare Boing Cat Platformer com Pixel Spike Run e Layer Flip Platformer.'],
      es: ['Boing Cat Platformer vs alternativas', 'Compara Boing Cat Platformer con Pixel Spike Run y Layer Flip Platformer.'],
      vi: ['Boing Cat Platformer vs lua chon khac', 'So sanh Boing Cat Platformer voi Pixel Spike Run va Layer Flip Platformer.'],
      id: ['Boing Cat Platformer vs alternatif', 'Bandingkan Boing Cat Platformer dengan Pixel Spike Run dan Layer Flip Platformer.'],
      de: ['Boing Cat Platformer vs Alternativen', 'Boing Cat Platformer vs Pixel Spike Run und Layer Flip Platformer vergleichen.'],
    };

    let title, desc;
    if (!loc.code) { title = g.enTitle; desc = g.enDesc; }
    else if (g.route.includes('how-to-play')) [title, desc] = howTitles[loc.code];
    else if (g.route.includes('when')) [title, desc] = whenTitles[loc.code];
    else [title, desc] = vsTitles[loc.code];

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser cat platformer on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/boing-cat-platformer.html">Boing Cat Platformer</a> laedt ein ${SIZE} Auto-Lauf-Platformer im iframe. Die Katze laeuft automatisch; Space springt ueber Spikes und Luecken in drei Levels.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Drei feste Level, session-only (kein Speicherstand). Engine MIT (BoingKat, Make Classic Games, JS13K 2025).</p>
<p><a href="${routePath}">Diese Sprachversion</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/boing-cat-platformer.html">Boing Cat Platformer</a> loads a ${SIZE} auto-run platformer in an iframe. The cat runs forward on its own; Space jumps over spikes and gaps across three levels.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Three fixed levels, session-only (no save data). Engine MIT (BoingKat, Make Classic Games, JS13K 2025).</p>
<p><a href="${routePath}">This locale guide</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-bcp-title svg-minipictogram-bcp-desc">
  <title id="svg-minipictogram-bcp-title">Boing Cat Platformer</title>
  <desc id="svg-minipictogram-bcp-desc">Cat jumping over a spike between two platforms</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <rect x="6" y="42" width="18" height="8" fill="#7DAFA3"/>
  <rect x="40" y="42" width="18" height="8" fill="#7DAFA3"/>
  <polygon points="27,50 32,38 37,50" fill="#B3C5B0"/>
  <circle cx="30" cy="26" r="8" fill="#FFFFFF"/>
  <path d="M24 20 L27 12 L30 19 Z" fill="#FFFFFF"/>
  <path d="M32 19 L35 12 L38 20 Z" fill="#FFFFFF"/>
  <circle cx="27" cy="26" r="1.4" fill="#1C1C1E"/>
  <circle cx="33" cy="26" r="1.4" fill="#1C1C1E"/>
</svg>`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picRel = `source/web/src/main/webapp/static/img/illustrations/mini-pictogram/boingcatplatformer__${hash8}.svg`;
w(picRel, pictogramBody);
console.log('pictogram', picRel);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-boingcatplatformer
description: |
  Ground-truth for /games/boing-cat-platformer.html. Hand-authored 2026-07-18
  (game-discovery-loop-runbook fire143) from makeclassicgames/BoingKat
  at static/games/boing-cat-platformer/.
---

# tool-boingcatplatformer - /games/boing-cat-platformer.html

## Identity

- **Route**: /games/boing-cat-platformer.html
- **Slug**: \`boing-cat-platformer\` (CMS: \`boingcatplatformer\`)
- **Cluster**: games
- **Aliases**: /boing-cat-platformer.html

## Reader task

Press Space (or a gamepad button) to time jumps over spikes and gaps while the cat auto-runs across three tile-built levels, reaching the flag a duck friend holds at the end of each level.

## Processing model

**client-side-only** - multi-file Canvas 2D engine (Kontra.js + ZzFX, ~130 KB total: index.html + 6 JS modules + 2 PNG tiles), same-origin iframe. No CDN, no analytics, no external fonts, no localStorage. Engine HTML is noindex; canonical URL is /games/boing-cat-platformer.html. Fixed 640x480 canvas#gameCanvas. Title screen text is drawn on canvas (no DOM start button - Space itself starts the run).

## License analysis

- Upstream: makeclassicgames **BoingKat** (package.json repo also tags it js13k-geomKat), js13kGames 2025, **MIT, Copyright (c) 2025 Make Classic Games** (LICENSE vendored verbatim).
- Programming: Zerasul + Banus10; Graphics: Maxi_oscar (per upstream Readme.md).
- Vendored libraries already bundled by upstream and kept unmodified: Kontra.js (MIT, Steven Lambert), ZzFX (MIT, Frank Force).
- package.json itself says \`"license": "ISC"\` (metadata mismatch flagged at scan time, fire141) - the repo's own LICENSE file is MIT and controls; ISC in package.json is a copy-paste error, not a second license grant.
- Original tile-platformer with hand-designed Tiled levels; not a commercial franchise clone.
- Adaptations: noindex meta, title-screen text rebrand "Boing Kat" -> "Boing Cat", the three level*.json files converted to plain \`export default {...}\` ES modules (drops the JSON import-attribute syntax for broader browser compatibility; tile data byte-identical), LICENSE + CREDITS shipped.
- Clean ELIGIBLE_WITH_CAVEAT resolved at ship time (multi-file vendor completed; caveat was about needing multi-file vendoring + the license-metadata note above, not about redistribution rights).

## Reader-benefit framing menu

- V1: Space (keyboard) or a gamepad bottom face button jumps; no other input exists.
- V2: The cat runs forward automatically - only jump timing is player-controlled.
- V3: Three hand-built tile levels (Tiled editor), each ending at a flag held by a duck friend.
- V4: Falling into a gap or touching a spike tile ends the run immediately.
- V5: Score adds roughly one point per ten pixels of horizontal distance traveled.
- V6: A win screen shows between levels; press Space to continue to the next one.
- V7: A congratulations screen with total score shows after clearing level three.
- V8: About ${SIZE} after Play; session-only (no save data, no localStorage).
- V9: Gamepad support is native (Kontra gamepad API), in addition to keyboard Space.
- V10: Adapted from BoingKat (MIT, Make Classic Games, JS13K 2025); ships LICENSE + CREDITS.

## Implemented features

- Canvas tile-based platformer (Kontra TileEngine) with three levels loaded from bundled tile data.
- Auto-run horizontal movement; Space/gamepad-south triggers a fixed-force jump with a short rotation animation.
- Spike-tile collision detection (two spike tile categories) causing an immediate death state.
- Score tracked per level from horizontal scroll distance; carried across levels; shown on a final congratulations screen.
- Procedural ZzFX jump and death sound effects (no audio files).

## Anti-claims

- Does NOT use a server backend, CDN, or fetch at runtime.
- Does NOT persist scores or progress (no localStorage in this build).
- Is NOT the same game as Pixel Spike Run: Pixel Spike Run is an endless procedurally-scrolling spike dodge with a variable-height hold-to-jump and an in-memory session high score; Boing Cat Platformer has three fixed, hand-built Tiled levels with a single fixed-force jump, a duck-flag finish per level, and a final total-score screen after level three (no endless mode).
- Is NOT the same game as Layer Flip Platformer: that game's core mechanic is flipping between light/dark layers across 25 stages; this game has no layer-flip mechanic at all.
- Is NOT the same game as One Tap Platformer: that game is a tap-to-dash vector-art wave-survival game; this game is a fixed-level tile jumper with a finish flag, not a wave/enemy survival loop.
- Does NOT require touch controls; keyboard Space or a gamepad is required for play (no on-screen touch button in this build).
- Is NOT a branded clone of a commercial franchise.

## claim_catalogue_status

verified
`, 'utf8');

console.log('fire143 scaffold complete');
