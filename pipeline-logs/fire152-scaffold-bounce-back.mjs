#!/usr/bin/env node
/** fire152: scaffold bounce-back CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const WRAPPER = process.env.WRAPPER_ROOT || '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const SKILL = join(WRAPPER, '.agent/skills/tool-bounceback');
const DATE = '2026-07-19';
const SIZE = '~120 KB';

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

cmsTxt('bounceback', 'BODYTITLE', 'Bounce Back - Free Online Boomerang Roguelite Game');
cmsTxt('bounceback', 'BODYDESC', 'Bounce Back - free browser boomerang roguelite: throw, dash, clear 10 procedural levels, about 120 KB.');
cmsTxt('bounceback', 'BODYKW', 'bounce back game, boomerang roguelite online, frank force bounceback, js13k boomerang dungeon, free browser roguelite');

cmsHtml('bounceback', 'BODYHTML', `<div class="w3-container">
    <p>Bounce Back is a free browser boomerang roguelite. Move with WASD, aim with the mouse, click to throw your boomerang, and press Space to dash through hits. Clear ten procedural dungeon levels, keep coins after death, and buy shop upgrades between runs. About ${SIZE}, no install, no account.</p>
    <p>Want draw-to-move arena combat instead? Try <a href="/games/rune-keeper.html">Rune Keeper</a>.</p>
</div>

<div id="bbWrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="bbStage" style="position:relative; width:100%; aspect-ratio:16/10; max-width:960px; margin:0 auto; min-height:420px; background:#1a1a1a; border-radius:6px; overflow:hidden;">
            <div id="bbLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#E8C547;">BOUNCE BACK</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Throw your boomerang, dash through damage, clear 10 levels. Adapted from Bounce Back by Frank Force (GPL-2). About ${SIZE}, downloads once when you press Play.</p>
                <button id="bbPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">WASD move, mouse aim, click throw, Space dash. Best on desktop with a mouse; keyboard required.</p>
            </div>
        </div>
        <div id="bbStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="bbFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Coins and max level save on this device only (ftol:bounceback:*).</span>
    </div>
    <style>
        #bbStage:fullscreen { border-radius: 0; max-width: none; }
        #bbStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('bounceback', 'BODYWELCOME', `<p>Welcome to Bounce Back - a free browser boomerang roguelite you can play without an account or install. Press Play to load the ${SIZE} game in a same-origin iframe. Move with WASD, aim and throw with the mouse, dash with Space, and keep coins after death for shop upgrades. Privacy note: save keys stay on this device under ftol:bounceback:*; nothing else leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('bounceback', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var BB_GAME_URL = 'bounce-back/index.html';
    function bbStatus(text) {
        var el = document.getElementById('bbStatus');
        if (el) el.textContent = text;
    }
    function bbInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'bbFrame';
        frame.src = BB_GAME_URL;
        frame.title = 'Bounce Back game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            bbStatus('Game loaded. WASD move, mouse aim, click throw, Space dash.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('bbLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('bbStage');
        var playBtn = document.getElementById('bbPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('bbFullscreenBtn');
        playBtn.addEventListener('click', function () {
            bbStatus('Loading the game (about 120 KB, one time - then cached)...');
            bbInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('bbFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('bounceback', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Bounce Back?</summary><p>A free browser boomerang roguelite: throw a returning boomerang, dash through damage, clear ten procedural dungeon levels, and spend coins at the shop.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>WASD to move, mouse to aim, click to throw, Space to dash. A keyboard and mouse work best; touch alone is not the designed control set.</p></details>
<details class="faq-item"><summary>What is the goal?</summary><p>Survive and clear all ten levels, including the final boss. Coins persist after death so you can buy upgrades and push farther on the next run.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>Yes on this device only. Coins, max warp level, best speed-run time, and win flag use localStorage keys under ftol:bounceback:*.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of HTML, JavaScript, and a small tilesheet after you press Play. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>It can load on a phone, but the designed controls are WASD + mouse aim + click + Space, so a desktop or laptop is the better fit.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from Bounce Back by Frank Force under the GNU GPL version 2 (or later). This site build adds noindex on the engine page, namespaces save keys, and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/bounce-back.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Bounce Back - Step by Step</b></h1>
<p>The <a href="/games/bounce-back.html">Bounce Back</a> page loads a ${SIZE} boomerang roguelite in an iframe.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Play, then WASD move, mouse aim, click throw, Space dash through ten levels.</b></p></div>
<h2><b>Step 1 - press Play</b></h2><p>Press Play to inject the iframe (${SIZE}). The pixel canvas boots on a black field.</p>
<h2><b>Step 2 - move and throw</b></h2><p>Use WASD to walk. Aim with the mouse and click to throw the boomerang; it returns after the flight.</p>
<h2><b>Step 3 - dash and shop</b></h2><p>Press Space to dash - dashing avoids damage. Spend coins between lives on shop upgrades; coins stay after death.</p>
<h2><b>Step 4 - clear ten levels</b></h2><p>Push through procedural rooms, sand slow zones, and the final boss. Beat the full run to open speed-run mode on this device.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>JS + tiles.png</td></tr><tr><td>Input</td><td>WASD + mouse + Space</td><td>desktop-first</td></tr><tr><td>Saves</td><td>ftol:bounceback:*</td><td>coins, warp, bestTime, won</td></tr><tr><td>Core loop</td><td>throw -> dash -> clear</td><td>10 levels + boss</td></tr></table>
<p>See <a href="/guides/bounce-back-when.html">when to play</a>, <a href="/guides/bounce-back-vs-alternatives.html">comparisons</a>, and <a href="/games/rune-keeper.html">Rune Keeper</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Bounce Back</b></h1>
<p><a href="/games/bounce-back.html">Bounce Back</a> fits a short boomerang-skill dungeon session - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>When you want thrown-weapon combat</b></h2><p>The boomerang is the main attack. Timing throws and dashes matters more than auto-fire.</p>
<h2><b>When you want a short roguelite loop</b></h2><p>Ten levels, shop upgrades, and coins that persist after death make good 10-20 minute sessions.</p>
<h2><b>When to pick another game</b></h2><p>Want draw-to-move gestures instead? Use <a href="/games/rune-keeper.html">Rune Keeper</a>. Want a medieval first-person story fight? Use <a href="/games/feast-night.html">Feast Night</a>.</p>
<p>See <a href="/guides/how-to-play-bounce-back.html">how to play</a> and <a href="/guides/bounce-back-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Bounce Back vs Alternatives</b></h1>
<p><a href="/games/bounce-back.html">Bounce Back</a> is a boomerang roguelite. Compare it with two other free browser games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Bounce Back</td><td>${SIZE}</td><td>WASD + mouse throw + Space dash</td><td>ftol:bounceback:*</td></tr>
<tr><td><a href="/games/rune-keeper.html">Rune Keeper</a></td><td>~28 KB</td><td>Mouse or touch drawing</td><td>none (session)</td></tr>
<tr><td><a href="/games/feast-night.html">Feast Night</a></td><td>~17 KB</td><td>WASD + mouse look + nod/shake</td><td>none (session)</td></tr>
</table>
<p>Pick Bounce Back for boomerang dungeon combat with persistent coins. Pick Rune Keeper for gesture drawing. Pick Feast Night for a medieval first-person story fight.</p>
<p>See <a href="/guides/how-to-play-bounce-back.html">how to play</a> and <a href="/guides/bounce-back-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-bounce-back', slug: 'guideshowtoplaybounceback', enTitle: 'How to Play Bounce Back - Step by Step', enDesc: 'How to play Bounce Back: WASD, mouse throw, Space dash, clear 10 levels, ~120 KB browser roguelite.', html: howToEn },
  { route: 'bounce-back-when', slug: 'guidesbouncebackwhen', enTitle: 'When to Play Bounce Back', enDesc: 'When Bounce Back fits: short boomerang roguelite sessions with shop upgrades, ~120 KB.', html: whenEn },
  { route: 'bounce-back-vs-alternatives', slug: 'guidesbouncebackvsalternatives', enTitle: 'Bounce Back vs Alternatives', enDesc: 'Compare Bounce Back with Rune Keeper and Feast Night - size, input, saves.', html: vsEn },
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
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplaybounceback`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}bouncebackwhen`;
    else cmsSlug = `guides${loc.prefix}bouncebackvsalternatives`;

    const howTitles = {
      pt: ['Como jogar Bounce Back', 'Como jogar Bounce Back: WASD, arremesso, dash, ~120 KB.'],
      es: ['Como jugar Bounce Back', 'Como jugar Bounce Back: WASD, lanzar, dash, ~120 KB.'],
      vi: ['Cach choi Bounce Back', 'Huong dan Bounce Back: WASD, nem, dash, ~120 KB.'],
      id: ['Cara main Bounce Back', 'Panduan Bounce Back: WASD, lempar, dash, ~120 KB.'],
      de: ['Bounce Back spielen', 'Bounce Back spielen: WASD, Wurf, Dash, ~120 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar Bounce Back', 'Quando encaixa: sessoes curtas de roguelite com boomerang, ~120 KB.'],
      es: ['Cuando jugar Bounce Back', 'Cuando encaja: sesiones cortas de roguelite con boomerang, ~120 KB.'],
      vi: ['Khi nao choi Bounce Back', 'Khi nao phu hop: phien roguelite boomerang ngan, ~120 KB.'],
      id: ['Kapan main Bounce Back', 'Kapan cocok: sesi roguelite boomerang singkat, ~120 KB.'],
      de: ['Wann Bounce Back spielen', 'Wann es passt: kurze Boomerang-Roguelite-Sessions, ~120 KB.'],
    };
    const vsTitles = {
      pt: ['Bounce Back vs alternativas', 'Compare com Rune Keeper e Feast Night.'],
      es: ['Bounce Back vs alternativas', 'Compara con Rune Keeper y Feast Night.'],
      vi: ['Bounce Back vs lua chon khac', 'So sanh voi Rune Keeper va Feast Night.'],
      id: ['Bounce Back vs alternatif', 'Bandingkan dengan Rune Keeper dan Feast Night.'],
      de: ['Bounce Back vs Alternativen', 'Vergleich mit Rune Keeper und Feast Night.'],
    };

    let title, desc;
    if (!loc.code) { title = g.enTitle; desc = g.enDesc; }
    else if (g.route.includes('how-to-play')) [title, desc] = howTitles[loc.code];
    else if (g.route.includes('when')) [title, desc] = whenTitles[loc.code];
    else [title, desc] = vsTitles[loc.code];

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser roguelite on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/bounce-back.html">Bounce Back</a> laedt einen ${SIZE} Boomerang-Roguelite-Lauf im iframe: WASD, Mauswurf, Space-Dash, 10 Level.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Speicher lokal unter ftol:bounceback:*. Engine GPL-2 (Frank Force).</p>
<p><a href="${routePath}">Diese Sprachversion</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/bounce-back.html">Bounce Back</a> loads a ${SIZE} boomerang roguelite in an iframe: WASD, mouse throw, Space dash, 10 levels.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Saves stay on-device under ftol:bounceback:*. Engine GPL-2 (Frank Force).</p>
<p><a href="${routePath}">This locale guide</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-bb-title svg-minipictogram-bb-desc">
  <title id="svg-minipictogram-bb-title">Bounce Back</title>
  <desc id="svg-minipictogram-bb-desc">Pixel hero with a curved boomerang arc</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <circle cx="28" cy="36" r="8" fill="#E8C547"/>
  <rect x="24" y="42" width="8" height="10" fill="#6B8F71"/>
  <path d="M38 22 C48 18 54 28 48 36 C44 40 40 38 38 34" fill="none" stroke="#F2E6A8" stroke-width="3" stroke-linecap="round"/>
</svg>`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picName = `bounceback__${hash8}.svg`;
w(`source/web/src/main/webapp/static/img/illustrations/mini-pictogram/${picName}`, pictogramBody);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-bounceback
description: |
  Ground-truth for /games/bounce-back.html. Hand-authored
  ${DATE} (game-discovery-loop-runbook fire152) from
  KilledByAPixel/BounceBack at static/games/bounce-back/.
---

# tool-bounceback - /games/bounce-back.html

## Identity

- **Route**: /games/bounce-back.html
- **Slug**: \`bounce-back\` (CMS: \`bounceback\`)
- **Cluster**: games
- **Aliases**: /bounce-back.html

## Reader task

Throw a returning boomerang, dash through damage, clear ten procedural dungeon levels, and spend persistent coins at the shop.

## Processing model

**client-side-only** - \`index.html\` + \`gameEngine.js\` + \`gameEngineDebug.js\` + \`game.js\` + \`tiles.png\` (~120 KB). Zero CDN, zero fetch/XHR. localStorage keys namespaced to \`ftol:bounceback:*\`. Page carries noindex; canonical URL is /games/bounce-back.html.

## License analysis

- Upstream: **KilledByAPixel/BounceBack**, **GNU GPL v2 (or later), Copyright (C) 2019 Frank Force** (LICENSE vendored).
- Original JS13k 2019 boomerang roguelite; not a commercial franchise clone.
- Adaptation: noindex meta; localStorage namespace \`kbap_*\` -> \`ftol:bounceback:*\`; comment wording for site copy policy.
- Clean ELIGIBLE (GPL allowed by runbook gates).

## Reader-benefit framing menu

- V1: Boomerang throw/return combat with mouse aim (game.js throw path).
- V2: WASD move + Space dash (dash avoids damage).
- V3: Ten procedural levels + final boss + shop between deaths.
- V4: Persistent coins/warp/bestTime/won under ftol:bounceback:*.
- V5: Adapted from Bounce Back (GPL-2, Frank Force).

## Implemented features

- Canvas pixel dungeon with boomerang physics and dash i-frames.
- Procedural rooms, sand slow zones, shop upgrades, minimap.
- Device-local saves for coins, max level, best time, win flag.

## Anti-claims

- Does NOT use a server, CDN, or fetch at runtime.
- Does NOT claim touch-first controls; designed for WASD + mouse.
- Is NOT the same game as Precision Bounce Loop (different upstream).
- Does NOT use the forbidden reader token "unlock" in site CMS copy.

## claim_catalogue_status

verified
`, 'utf8');

console.log('scaffold done', { picName, hash8, skill: SKILL });
