#!/usr/bin/env node
/** fire150: scaffold feast-night CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const WRAPPER = process.env.WRAPPER_ROOT || '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const SKILL = join(WRAPPER, '.agent/skills/tool-feastnight');
const DATE = '2026-07-18';
const SIZE = '~17 KB';

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

cmsTxt('feastnight', 'BODYTITLE', 'Feast Night - Free Online Medieval Soul-Saving FPS');
cmsTxt('feastnight', 'BODYDESC', 'Feast Night - free browser medieval first-person game: walk the feast, answer with nod or shake, save souls from demons, about 17 KB.');
cmsTxt('feastnight', 'BODYKW', 'feast night game, medieval feast browser fps, soul saving webgl game, js13k feast night, nod shake yes no game');

cmsHtml('feastnight', 'BODYHTML', `<div class="w3-container">
    <p>Feast Night is a free browser medieval first-person game. You are Brother Doen at a village feast: walk with WASD, look with the mouse, talk by nodding or shaking your head, and save souls when guests turn demonic. About ${SIZE}, no install, no account.</p>
    <p>Want a top-down last-alive fight instead? Try <a href="/games/solo-battlefield.html">Solo Battlefield</a>.</p>
</div>

<div id="fnWrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="fnStage" style="position:relative; width:100%; aspect-ratio:16/10; max-width:960px; margin:0 auto; min-height:420px; background:#1a1a1a; border-radius:6px; overflow:hidden;">
            <div id="fnLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#D9C7A3;">FEAST NIGHT</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Walk a medieval feast, answer with nod or shake, and save souls. Adapted from FEAST NIGHT by Almar (MIT). About ${SIZE}, downloads once when you press Play.</p>
                <button id="fnPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Click the canvas to start, WASD or arrows to walk, mouse to look, nod or shake for yes/no, click to fire when demons appear. Best with a mouse and keyboard.</p>
            </div>
        </div>
        <div id="fnStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="fnFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Session-only play - competition build has no save data.</span>
    </div>
    <style>
        #fnStage:fullscreen { border-radius: 0; max-width: none; }
        #fnStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('feastnight', 'BODYWELCOME', `<p>Welcome to Feast Night - a free browser medieval first-person game you can play without an account or install. Press Play to load the ${SIZE} WebGL build in a same-origin iframe. Click the canvas to begin, walk with WASD or arrow keys, look with the mouse, answer villagers by nodding or shaking your head, and fire when demons appear so you can save souls and reach the gate. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('feastnight', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var FN_GAME_URL = 'feast-night/index.html';
    function fnStatus(text) {
        var el = document.getElementById('fnStatus');
        if (el) el.textContent = text;
    }
    function fnInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'fnFrame';
        frame.src = FN_GAME_URL;
        frame.title = 'Feast Night game';
        frame.setAttribute('allow', 'fullscreen; pointer-lock');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            fnStatus('Game loaded. Click the canvas, then walk with WASD and look with the mouse.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('fnLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('fnStage');
        var playBtn = document.getElementById('fnPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('fnFullscreenBtn');
        playBtn.addEventListener('click', function () {
            fnStatus('Loading the game (about 17 KB, one time - then cached)...');
            fnInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('fnFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('feastnight', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Feast Night?</summary><p>A free browser medieval first-person game set at a village feast: walk, talk with nod or shake answers, and save souls when guests become demons.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>Click the canvas to start. WASD or arrow keys walk. Mouse looks around. Nod (tilt up/down) or shake (tilt left/right) to answer yes or no. Click to fire when combat starts. Space advances some ending screens.</p></details>
<details class="faq-item"><summary>What is the goal?</summary><p>Save enough souls during the feast and reach the gate. Ending text depends on how many souls you saved.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>This competition build is session-only. Closing the tab resets the run.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of HTML and JavaScript after you press Play. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>The build targets mouse look plus WASD, so a desktop or laptop is the comfortable setup. Touch may start the game but nod/shake and precise look are awkward without a pointer.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from FEAST NIGHT by Almar (js13kGames 2023), under the MIT license. This site build adds noindex on the engine page and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/feast-night.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Feast Night - Step by Step</b></h1>
<p>The <a href="/games/feast-night.html">Feast Night</a> page loads a ${SIZE} medieval first-person game in an iframe.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Play, click the canvas, walk with WASD, answer with nod or shake, and save souls when demons appear.</b></p></div>
<h2><b>Step 1 - press Play</b></h2><p>Press Play to inject the iframe (${SIZE}). The WebGL feast scene boots behind a [click to play] prompt.</p>
<h2><b>Step 2 - start and move</b></h2><p>Click the canvas to begin. Hold WASD or arrow keys to walk. Move the mouse to look around the feast ground and buildings.</p>
<h2><b>Step 3 - talk with gestures</b></h2><p>When a villager speaks, nod (tilt the view up and down) for yes or shake (tilt left and right) for no. Outcomes change who you meet next.</p>
<h2><b>Step 4 - save souls</b></h2><p>When guests turn demonic, click to fire. Saving souls raises your count toward the gate ending. Space skips some result screens.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>single HTML competition build</td></tr><tr><td>Input</td><td>WASD + mouse</td><td>nod/shake for dialogue; click to fire</td></tr><tr><td>Saves</td><td>none</td><td>session-only in this build</td></tr><tr><td>Renderer</td><td>WebGL</td><td>billboard sprites + room meshes</td></tr></table>
<p>See <a href="/guides/feast-night-when.html">when to play</a>, <a href="/guides/feast-night-vs-alternatives.html">comparisons</a>, and <a href="/games/solo-battlefield.html">Solo Battlefield</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Feast Night</b></h1>
<p><a href="/games/feast-night.html">Feast Night</a> fits a short narrative FPS session where you want gesture dialogue and a medieval feast mood - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>When you want story plus light combat</b></h2><p>Talking with nod or shake answers sits beside demon fights, so the run is more than a pure shooter.</p>
<h2><b>When you have a mouse and keyboard</b></h2><p>Mouse look and WASD are required for comfort. A laptop or desktop is the natural fit.</p>
<h2><b>When to pick another game</b></h2><p>Want top-down click combat instead? Use <a href="/games/solo-battlefield.html">Solo Battlefield</a>. Want a longer lane-defense session? Use <a href="/games/machine-guard-corps.html">Machine Guard Corps</a>.</p>
<p>See <a href="/guides/how-to-play-feast-night.html">how to play</a> and <a href="/guides/feast-night-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Feast Night vs Alternatives</b></h1>
<p><a href="/games/feast-night.html">Feast Night</a> is a medieval first-person feast game with nod/shake dialogue and soul-saving combat. Compare it with two other free browser games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Feast Night</td><td>${SIZE}</td><td>WASD + mouse look + nod/shake</td><td>none (session)</td></tr>
<tr><td><a href="/games/solo-battlefield.html">Solo Battlefield</a></td><td>~12 KB</td><td>WASD + click/tap</td><td>none (session)</td></tr>
<tr><td><a href="/games/machine-guard-corps.html">Machine Guard Corps</a></td><td>~130 KB</td><td>Keyboard or on-screen buttons</td><td>none (session)</td></tr>
</table>
<p>Pick Feast Night for a short first-person narrative feast. Pick Solo Battlefield for top-down last-alive combat. Pick Machine Guard Corps for a longer lane-defense strategy session.</p>
<p>See <a href="/guides/how-to-play-feast-night.html">how to play</a> and <a href="/guides/feast-night-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-feast-night', slug: 'guideshowtoplayfeastnight', enTitle: 'How to Play Feast Night - Step by Step', enDesc: 'How to play Feast Night: WASD walk, mouse look, nod or shake answers, save souls, ~17 KB browser FPS.', html: howToEn },
  { route: 'feast-night-when', slug: 'guidesfeastnightwhen', enTitle: 'When to Play Feast Night', enDesc: 'When Feast Night fits: short medieval first-person sessions with gesture dialogue, ~17 KB.', html: whenEn },
  { route: 'feast-night-vs-alternatives', slug: 'guidesfeastnightvsalternatives', enTitle: 'Feast Night vs Alternatives', enDesc: 'Compare Feast Night with Solo Battlefield and Machine Guard Corps - size, input, saves.', html: vsEn },
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
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplayfeastnight`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}feastnightwhen`;
    else cmsSlug = `guides${loc.prefix}feastnightvsalternatives`;

    const howTitles = {
      pt: ['Como jogar Feast Night', 'Como jogar Feast Night: WASD, mouse, aceno sim/nao, salvar almas, ~17 KB.'],
      es: ['Como jugar Feast Night', 'Como jugar Feast Night: WASD, raton, asentir o negar, salvar almas, ~17 KB.'],
      vi: ['Cach choi Feast Night', 'Huong dan Feast Night: WASD, chuot, gat/lac dau, cuu linh hon, ~17 KB.'],
      id: ['Cara main Feast Night', 'Panduan Feast Night: WASD, mouse, angguk/geleng, selamatkan jiwa, ~17 KB.'],
      de: ['Feast Night spielen', 'Feast Night spielen: WASD, Maus, Nicken/Schuetteln, Seelen retten, ~17 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar Feast Night', 'Quando encaixa: sessoes curtas de FPS medieval com dialogo por gesto, ~17 KB.'],
      es: ['Cuando jugar Feast Night', 'Cuando encaja: sesiones cortas de FPS medieval con dialogo por gestos, ~17 KB.'],
      vi: ['Khi nao choi Feast Night', 'Khi nao phu hop: phien FPS medieval ngan voi hoi thoai cu chi, ~17 KB.'],
      id: ['Kapan main Feast Night', 'Kapan cocok: sesi FPS abad pertengahan singkat dengan dialog gestur, ~17 KB.'],
      de: ['Wann Feast Night spielen', 'Wann es passt: kurze mittelalterliche FPS-Sessions mit Gesten-Dialog, ~17 KB.'],
    };
    const vsTitles = {
      pt: ['Feast Night vs alternativas', 'Compare com Solo Battlefield e Machine Guard Corps.'],
      es: ['Feast Night vs alternativas', 'Compara con Solo Battlefield y Machine Guard Corps.'],
      vi: ['Feast Night vs lua chon khac', 'So sanh voi Solo Battlefield va Machine Guard Corps.'],
      id: ['Feast Night vs alternatif', 'Bandingkan dengan Solo Battlefield dan Machine Guard Corps.'],
      de: ['Feast Night vs Alternativen', 'Vergleich mit Solo Battlefield und Machine Guard Corps.'],
    };

    let title, desc;
    if (!loc.code) { title = g.enTitle; desc = g.enDesc; }
    else if (g.route.includes('how-to-play')) [title, desc] = howTitles[loc.code];
    else if (g.route.includes('when')) [title, desc] = whenTitles[loc.code];
    else [title, desc] = vsTitles[loc.code];

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser medieval game on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/feast-night.html">Feast Night</a> laedt einen ${SIZE} mittelalterlichen First-Person-Lauf im iframe: WASD laufen, Maus schauen, nicken oder schuetteln antworten.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Kein Speicherstand, session-only. Engine MIT (FEAST NIGHT, Almar).</p>
<p><a href="${routePath}">Diese Sprachversion</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      // VI/ID must be diacritic-free per runbook; strip combining marks from titles already ASCII-ish
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/feast-night.html">Feast Night</a> loads a ${SIZE} medieval first-person game in an iframe: WASD walk, mouse look, nod or shake to answer.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>No save data, session-only. Engine MIT (FEAST NIGHT, Almar).</p>
<p><a href="${routePath}">This locale guide</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

// Fix VI how-title diacritics (gật) - rewrite ASCII
cmsTxt('guidesvihowtoplayfeastnight', 'BODYTITLE', 'Cach choi Feast Night');
cmsTxt('guidesvihowtoplayfeastnight', 'BODYDESC', 'Huong dan Feast Night: WASD, chuot, gat/lac dau, cuu linh hon, ~17 KB. Free browser medieval game on FreeToolOnline.');

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-fn-title svg-minipictogram-fn-desc">
  <title id="svg-minipictogram-fn-title">Feast Night</title>
  <desc id="svg-minipictogram-fn-desc">Church silhouette and feast table under an orange night sky</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <path d="M12 40 L20 22 L28 40 Z" fill="#D9C7A3"/>
  <rect x="18" y="34" width="4" height="6" fill="#1C1C1E"/>
  <rect x="32" y="36" width="20" height="6" fill="#D9C7A3"/>
  <circle cx="36" cy="34" r="2.5" fill="#7DAFA3"/>
  <circle cx="44" cy="34" r="2.5" fill="#7DAFA3"/>
  <circle cx="52" cy="34" r="2.5" fill="#7DAFA3"/>
</svg>`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picName = `feastnight__${hash8}.svg`;
w(`source/web/src/main/webapp/static/img/illustrations/mini-pictogram/${picName}`, pictogramBody);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-feastnight
description: |
  Ground-truth for /games/feast-night.html. Hand-authored
  ${DATE} (game-discovery-loop-runbook fire150) from
  wololoa/js13k2023 at static/games/feast-night/.
---

# tool-feastnight - /games/feast-night.html

## Identity

- **Route**: /games/feast-night.html
- **Slug**: \`feast-night\` (CMS: \`feastnight\`)
- **Cluster**: games
- **Aliases**: /feast-night.html

## Reader task

Walk a medieval village feast as Brother Doen in first person: click to start, move with WASD or arrow keys, look with the mouse, answer villagers by nodding or shaking your head, fire when guests turn demonic, and save enough souls to reach a favorable gate ending.

## Processing model

**client-side-only** - js13k competition \`release/index.html\` (~17 KB single HTML with inlined WebGL/ZzFX). Zero CDN, zero fetch/XHR. Competition build has no localStorage (source tree tracked \`_feast_night_runs_\` but that key is absent from the shipped release). Page carries noindex; canonical URL is /games/feast-night.html.

## License analysis

- Upstream: **wololoa/js13k2023**, **MIT, Copyright (c) 2023 Almar** (LICENSE vendored).
- Original js13kGames 2023 entry ("FEAST NIGHT"); medieval feast / soul-saving fantasy is generic, not a commercial franchise clone.
- Adaptation: \`<meta name="robots" content="noindex">\` plus a pointer-lock promise swallow for iframe/headless hosts. Title kept in-engine.
- Clean ELIGIBLE.

## Reader-benefit framing menu

- V1: First-person WebGL feast with billboard NPCs and room meshes.
- V2: WASD / arrow-key walk plus mouse look.
- V3: Nod (pitch) / shake (yaw) gesture answers for yes/no dialogue.
- V4: Click-to-fire combat when demons appear; soul count drives endings.
- V5: ~17 KB after Play; session-only in the competition build.
- V6: Adapted from FEAST NIGHT (MIT, Almar / js13k 2023).

## Implemented features

- Medieval feast exploration with priest and villager dialogue branches.
- Gesture yes/no input via camera nod/shake.
- Demon transformation combat and soul-saving endings (including Heaven / failed Judgment text).
- Embedded ZzFX sounds in the competition build.

## Anti-claims

- Does NOT use a server, CDN, or fetch at runtime.
- Does NOT persist progress in the competition build (no localStorage in release/index.html).
- Is NOT a top-down arena fighter; it is a first-person narrative FPS.
- Does NOT provide on-screen WASD buttons; a mouse and keyboard are expected.
- Does NOT claim VR support (VR was considered upstream and dropped).

## claim_catalogue_status

verified
`, 'utf8');

console.log('scaffold done', { picName, hash8, skill: SKILL });
