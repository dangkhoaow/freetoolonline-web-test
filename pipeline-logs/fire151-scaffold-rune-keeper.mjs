#!/usr/bin/env node
/** fire151: scaffold rune-keeper CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const WRAPPER = process.env.WRAPPER_ROOT || '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const SKILL = join(WRAPPER, '.agent/skills/tool-runekeeper');
const DATE = '2026-07-19';
const SIZE = '~28 KB';

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

cmsTxt('runekeeper', 'BODYTITLE', 'Rune Keeper - Free Online Draw-to-Move Arena Game');
cmsTxt('runekeeper', 'BODYDESC', 'Rune Keeper - free browser draw-to-move arena: draw rune symbols to shift the runestone, clear enemies, about 28 KB.');
cmsTxt('runekeeper', 'BODYKW', 'rune keeper game, draw symbols browser game, runestone arena online, gesture spell caster game, arikwex runekeeper');

cmsHtml('runekeeper', 'BODYHTML', `<div class="w3-container">
    <p>Rune Keeper is a free browser draw-to-move arena game. Draw rune symbols with your mouse or finger to push the runestone across the field, dodge or clear enemies, and keep the stone alive. About ${SIZE}, no install, no account.</p>
    <p>Want a medieval first-person feast instead? Try <a href="/games/feast-night.html">Feast Night</a>.</p>
</div>

<div id="rkWrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="rkStage" style="position:relative; width:100%; aspect-ratio:16/10; max-width:960px; margin:0 auto; min-height:420px; background:#1a1a1a; border-radius:6px; overflow:hidden;">
            <div id="rkLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#D9C7A3;">RUNE KEEPER</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Draw symbols to move the runestone. Adapted from Runekeeper by Ariel Wexler (MIT). About ${SIZE}, downloads once when you press Play.</p>
                <button id="rkPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Mouse or touch: draw rune shapes on the canvas to cast moves. Works on phones and desktops.</p>
            </div>
        </div>
        <div id="rkStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="rkFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Session-only play - no save data in this build.</span>
    </div>
    <style>
        #rkStage:fullscreen { border-radius: 0; max-width: none; }
        #rkStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('runekeeper', 'BODYWELCOME', `<p>Welcome to Rune Keeper - a free browser draw-to-move arena you can play without an account or install. Press Play to load the ${SIZE} game in a same-origin iframe. Draw rune symbols with a mouse or finger to move the runestone, survive enemy waves, and keep casting. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('runekeeper', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var RK_GAME_URL = 'rune-keeper/index.html';
    function rkStatus(text) {
        var el = document.getElementById('rkStatus');
        if (el) el.textContent = text;
    }
    function rkInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'rkFrame';
        frame.src = RK_GAME_URL;
        frame.title = 'Rune Keeper game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            rkStatus('Game loaded. Draw rune symbols on the canvas to move the stone.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('rkLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('rkStage');
        var playBtn = document.getElementById('rkPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('rkFullscreenBtn');
        playBtn.addEventListener('click', function () {
            rkStatus('Loading the game (about 28 KB, one time - then cached)...');
            rkInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('rkFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('runekeeper', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Rune Keeper?</summary><p>A free browser draw-to-move arena: you draw rune symbols to push a runestone across the field while enemies press in.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>Draw shapes with the mouse or a finger on the canvas. Recognized runes move or affect the runestone. Touch works on phones; a mouse works on desktop.</p></details>
<details class="faq-item"><summary>What is the goal?</summary><p>Keep the runestone alive by casting the right symbols, placing power effects, and clearing or avoiding enemies.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>This build is session-only. There is no save data - closing the tab resets the run.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of HTML and JavaScript after you press Play. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>Yes. The engine listens for touchstart/touchmove/touchend as well as mouse events, so drawing with a thumb is supported.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from Runekeeper by Ariel Wexler under the MIT license. This site build adds noindex on the engine page and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/rune-keeper.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Rune Keeper - Step by Step</b></h1>
<p>The <a href="/games/rune-keeper.html">Rune Keeper</a> page loads a ${SIZE} draw-to-move arena in an iframe.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Play, then draw rune symbols on the canvas to move the runestone and survive enemy pressure.</b></p></div>
<h2><b>Step 1 - press Play</b></h2><p>Press Play to inject the iframe (${SIZE}). The arena boots with the on-canvas prompt to draw symbols.</p>
<h2><b>Step 2 - draw a rune</b></h2><p>Press and drag on the canvas (or use a finger) to draw a symbol. The classifier matches shapes such as waves, triangles, and circles to moves.</p>
<h2><b>Step 3 - steer the stone</b></h2><p>Successful casts move the runestone. Keep it off hazards and away from enemy paths while you set up the next stroke.</p>
<h2><b>Step 4 - clear the field</b></h2><p>Use placement and power effects to thin enemies. If a cast fails, redraw - the prompt shows when a place attempt fails.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>single HTML competition build</td></tr><tr><td>Input</td><td>mouse or touch draw</td><td>no WASD required</td></tr><tr><td>Saves</td><td>none</td><td>session-only</td></tr><tr><td>Core loop</td><td>draw -> move stone</td><td>gesture classification</td></tr></table>
<p>See <a href="/guides/rune-keeper-when.html">when to play</a>, <a href="/guides/rune-keeper-vs-alternatives.html">comparisons</a>, and <a href="/games/feast-night.html">Feast Night</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Rune Keeper</b></h1>
<p><a href="/games/rune-keeper.html">Rune Keeper</a> fits a short gesture-skill session where drawing is the main control - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>When you want draw-based controls</b></h2><p>Mouse or thumb strokes replace WASD. It is a good pick on a tablet or phone.</p>
<h2><b>When you want a short arena run</b></h2><p>Rounds are about keeping the stone alive under enemy pressure, not a long campaign save.</p>
<h2><b>When to pick another game</b></h2><p>Want first-person narrative FPS instead? Use <a href="/games/feast-night.html">Feast Night</a>. Want top-down click combat? Use <a href="/games/solo-battlefield.html">Solo Battlefield</a>.</p>
<p>See <a href="/guides/how-to-play-rune-keeper.html">how to play</a> and <a href="/guides/rune-keeper-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Rune Keeper vs Alternatives</b></h1>
<p><a href="/games/rune-keeper.html">Rune Keeper</a> is a draw-to-move arena. Compare it with two other free browser games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Rune Keeper</td><td>${SIZE}</td><td>Mouse or touch drawing</td><td>none (session)</td></tr>
<tr><td><a href="/games/feast-night.html">Feast Night</a></td><td>~17 KB</td><td>WASD + mouse look + nod/shake</td><td>none (session)</td></tr>
<tr><td><a href="/games/solo-battlefield.html">Solo Battlefield</a></td><td>~12 KB</td><td>WASD + click/tap</td><td>none (session)</td></tr>
</table>
<p>Pick Rune Keeper for gesture drawing on any pointer. Pick Feast Night for a medieval first-person story fight. Pick Solo Battlefield for top-down last-alive combat.</p>
<p>See <a href="/guides/how-to-play-rune-keeper.html">how to play</a> and <a href="/guides/rune-keeper-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-rune-keeper', slug: 'guideshowtoplayrunekeeper', enTitle: 'How to Play Rune Keeper - Step by Step', enDesc: 'How to play Rune Keeper: draw rune symbols to move the runestone, clear enemies, ~28 KB browser arena.', html: howToEn },
  { route: 'rune-keeper-when', slug: 'guidesrunekeeperwhen', enTitle: 'When to Play Rune Keeper', enDesc: 'When Rune Keeper fits: short draw-to-move arena sessions on mouse or touch, ~28 KB.', html: whenEn },
  { route: 'rune-keeper-vs-alternatives', slug: 'guidesrunekeepervsalternatives', enTitle: 'Rune Keeper vs Alternatives', enDesc: 'Compare Rune Keeper with Feast Night and Solo Battlefield - size, input, saves.', html: vsEn },
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
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplayrunekeeper`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}runekeeperwhen`;
    else cmsSlug = `guides${loc.prefix}runekeepervsalternatives`;

    const howTitles = {
      pt: ['Como jogar Rune Keeper', 'Como jogar Rune Keeper: desenhe runas para mover a pedra, ~28 KB.'],
      es: ['Como jugar Rune Keeper', 'Como jugar Rune Keeper: dibuja runas para mover la piedra, ~28 KB.'],
      vi: ['Cach choi Rune Keeper', 'Huong dan Rune Keeper: ve rune de di chuyen da, ~28 KB.'],
      id: ['Cara main Rune Keeper', 'Panduan Rune Keeper: gambar rune untuk gerak batu, ~28 KB.'],
      de: ['Rune Keeper spielen', 'Rune Keeper spielen: Runen zeichnen um den Stein zu bewegen, ~28 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar Rune Keeper', 'Quando encaixa: sessoes curtas draw-to-move no mouse ou touch, ~28 KB.'],
      es: ['Cuando jugar Rune Keeper', 'Cuando encaja: sesiones cortas draw-to-move con raton o touch, ~28 KB.'],
      vi: ['Khi nao choi Rune Keeper', 'Khi nao phu hop: phien ve-de-di-chuyen ngan tren chuot/touch, ~28 KB.'],
      id: ['Kapan main Rune Keeper', 'Kapan cocok: sesi draw-to-move singkat di mouse/touch, ~28 KB.'],
      de: ['Wann Rune Keeper spielen', 'Wann es passt: kurze Draw-to-Move-Sessions mit Maus oder Touch, ~28 KB.'],
    };
    const vsTitles = {
      pt: ['Rune Keeper vs alternativas', 'Compare com Feast Night e Solo Battlefield.'],
      es: ['Rune Keeper vs alternativas', 'Compara con Feast Night y Solo Battlefield.'],
      vi: ['Rune Keeper vs lua chon khac', 'So sanh voi Feast Night va Solo Battlefield.'],
      id: ['Rune Keeper vs alternatif', 'Bandingkan dengan Feast Night dan Solo Battlefield.'],
      de: ['Rune Keeper vs Alternativen', 'Vergleich mit Feast Night und Solo Battlefield.'],
    };

    let title, desc;
    if (!loc.code) { title = g.enTitle; desc = g.enDesc; }
    else if (g.route.includes('how-to-play')) [title, desc] = howTitles[loc.code];
    else if (g.route.includes('when')) [title, desc] = whenTitles[loc.code];
    else [title, desc] = vsTitles[loc.code];

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser arena game on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/rune-keeper.html">Rune Keeper</a> laedt einen ${SIZE} Draw-to-Move-Arena-Lauf im iframe: Runen zeichnen, Stein bewegen, Feinde abwehren.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Kein Speicherstand, session-only. Engine MIT (Runekeeper, Ariel Wexler).</p>
<p><a href="${routePath}">Diese Sprachversion</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/rune-keeper.html">Rune Keeper</a> loads a ${SIZE} draw-to-move arena in an iframe: draw runes to move the stone and survive enemies.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>No save data, session-only. Engine MIT (Runekeeper, Ariel Wexler).</p>
<p><a href="${routePath}">This locale guide</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-rk-title svg-minipictogram-rk-desc">
  <title id="svg-minipictogram-rk-title">Rune Keeper</title>
  <desc id="svg-minipictogram-rk-desc">Glowing runestone tablet with a drawn triangle rune</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <rect x="18" y="14" width="28" height="36" rx="4" ry="4" fill="#D9C7A3"/>
  <path d="M32 22 L42 40 L22 40 Z" fill="none" stroke="#7DAFA3" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="32" cy="34" r="3" fill="#5B73AE"/>
</svg>`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picName = `runekeeper__${hash8}.svg`;
w(`source/web/src/main/webapp/static/img/illustrations/mini-pictogram/${picName}`, pictogramBody);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-runekeeper
description: |
  Ground-truth for /games/rune-keeper.html. Hand-authored
  ${DATE} (game-discovery-loop-runbook fire151) from
  arikwex/runekeeper at static/games/rune-keeper/.
---

# tool-runekeeper - /games/rune-keeper.html

## Identity

- **Route**: /games/rune-keeper.html
- **Slug**: \`rune-keeper\` (CMS: \`runekeeper\`)
- **Cluster**: games
- **Aliases**: /rune-keeper.html

## Reader task

Draw rune symbols with mouse or touch to move a runestone across an arena, place effects, and survive enemy pressure without WASD.

## Processing model

**client-side-only** - competition \`game/index.html\` / \`build.zip\` (~28 KB single HTML with inlined canvas classifier + audio). Zero CDN, zero fetch/XHR, zero localStorage (verified on shipped HTML). Page carries noindex; canonical URL is /games/rune-keeper.html.

## License analysis

- Upstream: **arikwex/runekeeper**, **MIT, Copyright (c) 2023 Ariel Wexler** (LICENSE vendored).
- Original draw-to-move rune arena; not a commercial franchise clone.
- Adaptation: \`<meta name="robots" content="noindex">\` only. In-engine title kept as Runekeeper; site page uses Rune Keeper.
- Clean ELIGIBLE.

## Reader-benefit framing menu

- V1: Draw-symbol classifier drives runestone movement (wave, triangle, circle, and related shapes in src/runes.js).
- V2: Mouse and touch drawing (mousedown/mousemove/mouseup + touch*).
- V3: Enemy spawner + powerup placement around the stone.
- V4: ~28 KB after Play; session-only (no localStorage).
- V5: Adapted from Runekeeper (MIT, Ariel Wexler).

## Implemented features

- Canvas arena with gesture recognition for rune casts.
- Runestone motion and landing feedback with procedural audio.
- Touch-friendly left/right draw zones in the spell caster.

## Anti-claims

- Does NOT use a server, CDN, or fetch at runtime.
- Does NOT persist progress (no localStorage in the competition build).
- Is NOT a WASD shooter; primary input is drawing.
- Does NOT require a keyboard.

## claim_catalogue_status

verified
`, 'utf8');

console.log('scaffold done', { picName, hash8, skill: SKILL });
