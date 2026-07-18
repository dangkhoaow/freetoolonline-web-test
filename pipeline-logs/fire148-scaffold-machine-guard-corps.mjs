#!/usr/bin/env node
/** fire148: scaffold machine-guard-corps CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..'); // web-test
const SKILL = join(ROOT, '..', '.agent/skills/tool-machineguardcorps');
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

cmsTxt('machineguardcorps', 'BODYTITLE', 'Machine Guard Corps - Free Online Lane Defense Auto-Battler');
cmsTxt('machineguardcorps', 'BODYDESC', 'Machine Guard Corps - free browser sci-fi lane defense auto-battler: summon machines, evolve units, upgrade your tower, and defeat an adaptive alien hive, about 130 KB.');
cmsTxt('machineguardcorps', 'BODYKW', 'machine guard corps game, lane defense auto battler browser, tower defense game online, sci fi base defense game, alien hive defense game');

cmsHtml('machineguardcorps', 'BODYHTML', `<div class="w3-container">
    <p>Machine Guard Corps is a free browser sci-fi lane defense auto-battler. Your command base sits on the left, an alien hive on the right - summon five kinds of machine units, buy permanent evolutions, upgrade your Command Tower and turret, and use three active skills to hold the line. The hive is not a fixed wave script: it manages its own energy, upgrades itself, and eventually sends boss after boss, then double-boss rounds. About ${SIZE}, no install, no account.</p>
    <p>Want a faster, timed arcade game instead? Try <a href="/games/black-cat-hot-tin-roof.html">Black Cat on a Hot Tin Roof</a>.</p>
</div>

<div id="mgcWrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="mgcStage" style="position:relative; width:100%; aspect-ratio:16/9; min-height:420px; background:#0a1420; border-radius:6px; overflow:hidden;">
            <div id="mgcLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#4ecdc4;">MACHINE GUARD CORPS</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Summon machines, evolve units, and defend your base from an adaptive alien hive. From Machine Guard Corps by Mars723 (MIT). About ${SIZE}, downloads once when you press Play.</p>
                <button id="mgcPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Number keys 1-5 summon units, or use the on-screen buttons. Works with mouse/touch alone.</p>
            </div>
        </div>
        <div id="mgcStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="mgcFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Session-only play - no save data in this build.</span>
    </div>
    <style>
        #mgcStage:fullscreen { border-radius: 0; }
        #mgcStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('machineguardcorps', 'BODYWELCOME', `<p>Welcome to Machine Guard Corps - a free browser sci-fi lane defense auto-battler you can play without an account or install. Press Play to load the ${SIZE} game in a same-origin iframe, then press Start Defense on its own title screen. Summon Robot Infantry, Mech Dogs, Attack Drones, Big Fat Bots, and Railgun Walkers with number keys 1-5 (or the on-screen buttons); spend Scrap on permanent unit evolutions and on Command Tower, Base Turret, Coolant Banks, and Combat Firmware upgrades. Use Missile Strike, EMP Pulse, and Repair Swarm to swing tough fights. The alien hive manages its own energy and upgrades and eventually sends named bosses - win by reducing the hive's core HP to zero before your base falls. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('machineguardcorps', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var MGC_GAME_URL = 'machine-guard-corps/index.html';
    function mgcStatus(text) {
        var el = document.getElementById('mgcStatus');
        if (el) el.textContent = text;
    }
    function mgcInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'mgcFrame';
        frame.src = MGC_GAME_URL;
        frame.title = 'Machine Guard Corps game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            mgcStatus('Game loaded. Press Start Defense to begin.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('mgcLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('mgcStage');
        var playBtn = document.getElementById('mgcPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('mgcFullscreenBtn');
        playBtn.addEventListener('click', function () {
            mgcStatus('Loading the game (about 130 KB, one time - then cached)...');
            mgcInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('mgcFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('machineguardcorps', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Machine Guard Corps?</summary><p>A free browser sci-fi lane defense auto-battler: defend your command base from an adaptive alien hive by summoning machine units, buying evolutions, upgrading your base, and using active skills.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>Number keys 1-5 summon units, Q/W/E trigger skills, Z/X/C/V buy upgrades, and Cmd/Ctrl+1-0 buy evolutions - or click the on-screen buttons for every action, so mouse/touch alone works too.</p></details>
<details class="faq-item"><summary>What is the goal?</summary><p>Reduce the alien hive's core HP to zero. You lose if your command base HP reaches zero first. The hive sends progressively stronger named bosses over time, then double-boss rounds if the fight runs long.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>This build is session-only. There is no save data - closing the tab resets the game.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of HTML, JavaScript, and CSS after you press Play. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>Yes - every action (summon, skills, upgrades, evolutions) has an on-screen button, so it is fully playable with touch alone.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from Machine Guard Corps by Mars723, under the MIT license. This site build adds noindex on the engine page and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/machine-guard-corps.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Machine Guard Corps - Step by Step</b></h1>
<p>The <a href="/games/machine-guard-corps.html">Machine Guard Corps</a> page loads a ${SIZE} lane-defense auto-battler in an iframe.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Play, then Start Defense, then summon Robot Infantry and Mech Dogs first to hold the lane.</b></p></div>
<h2><b>Step 1 - press Play and Start Defense</b></h2><p>Press Play to inject the iframe (${SIZE}). Read the tutorial overlay, then press Start Defense.</p>
<h2><b>Step 2 - summon your first units</b></h2><p>Press 1 for Robot Infantry or 2 for Mech Dog (or click their buttons) as Energy allows. These cheap units hold the lane while your economy grows.</p>
<h2><b>Step 3 - use skills when the lane gets crowded</b></h2><p>Press Q for a Missile Strike when enemies stack up, W for an EMP Pulse to slow a push, or E for a Repair Swarm after your frontline takes damage.</p>
<h2><b>Step 4 - spend Scrap on upgrades and evolutions</b></h2><p>Press Z/X/C/V to upgrade your Command Tower, Base Turret, Coolant Banks, or Combat Firmware. Once you can afford it, buy a permanent evolution for a unit line with Cmd/Ctrl plus a number key.</p>
<h2><b>Step 5 - survive the boss rounds</b></h2><p>The hive sends progressively stronger named bosses as the fight goes on. Boss kills grant large Energy and Scrap rewards, but the hive only falls when its core HP hits zero. Hold on through double-boss rounds if the match runs long.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>HTML + JS + CSS, no images</td></tr><tr><td>Input</td><td>keyboard or on-screen buttons</td><td>fully playable with touch alone</td></tr><tr><td>Saves</td><td>none</td><td>session-only</td></tr><tr><td>Units</td><td>5 lines, 10 evolutions</td><td>2 evolution paths per unit line</td></tr></table>
<p>See <a href="/guides/machine-guard-corps-when.html">when to play</a>, <a href="/guides/machine-guard-corps-vs-alternatives.html">comparisons</a>, and <a href="/games/black-cat-hot-tin-roof.html">Black Cat on a Hot Tin Roof</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Machine Guard Corps</b></h1>
<p><a href="/games/machine-guard-corps.html">Machine Guard Corps</a> fits a longer session where you want to build an economy and watch a strategy pay off - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>When you want a run that escalates</b></h2><p>The alien hive manages its own economy and sends progressively stronger named bosses, then double-boss rounds - a single run can run long if you are holding well.</p>
<h2><b>When you like build-your-own-strategy games</b></h2><p>Five unit lines with two evolutions each, four upgrade trees, and three active skills give real room to react to what the hive is doing.</p>
<h2><b>When to pick another game</b></h2><p>Want a fixed 60-second arcade run instead? Use <a href="/games/black-cat-hot-tin-roof.html">Black Cat on a Hot Tin Roof</a>. Want a slower chess-themed puzzle? Use <a href="/games/mor-chess-2.html">Mor Chess 2</a>.</p>
<p>See <a href="/guides/how-to-play-machine-guard-corps.html">how to play</a> and <a href="/guides/machine-guard-corps-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Machine Guard Corps vs Alternatives</b></h1>
<p><a href="/games/machine-guard-corps.html">Machine Guard Corps</a> is a lane-defense auto-battler against an adaptive AI economy. Compare it with two other free browser games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Machine Guard Corps</td><td>${SIZE}</td><td>Keyboard or on-screen buttons</td><td>none (session)</td></tr>
<tr><td><a href="/games/black-cat-hot-tin-roof.html">Black Cat on a Hot Tin Roof</a></td><td>~16 KB</td><td>Space or click/tap to jump</td><td>high score (localStorage)</td></tr>
<tr><td><a href="/games/mor-chess-2.html">Mor Chess 2</a></td><td>~13 KB</td><td>Click/tap a positional choice</td><td>none (session)</td></tr>
</table>
<p>Pick Machine Guard Corps for a longer, strategy-driven lane defense against a self-upgrading enemy. Pick Black Cat on a Hot Tin Roof for a fast, fixed-length arcade run. Pick Mor Chess 2 for a slower chess-themed puzzle.</p>
<p>See <a href="/guides/how-to-play-machine-guard-corps.html">how to play</a> and <a href="/guides/machine-guard-corps-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-machine-guard-corps', slug: 'guideshowtoplaymachineguardcorps', enTitle: 'How to Play Machine Guard Corps - Step by Step', enDesc: 'How to play Machine Guard Corps: summon units, evolutions, upgrades, skills, boss rounds, ~130 KB browser auto-battler.', html: howToEn },
  { route: 'machine-guard-corps-when', slug: 'guidesmachineguardcorpswhen', enTitle: 'When to Play Machine Guard Corps', enDesc: 'When Machine Guard Corps fits: longer strategy sessions against an adaptive alien AI economy, ~130 KB.', html: whenEn },
  { route: 'machine-guard-corps-vs-alternatives', slug: 'guidesmachineguardcorpsvsalternatives', enTitle: 'Machine Guard Corps vs Alternatives', enDesc: 'Compare Machine Guard Corps with Black Cat on a Hot Tin Roof and Mor Chess 2 - download size, input, saves.', html: vsEn },
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
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplaymachineguardcorps`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}machineguardcorpswhen`;
    else cmsSlug = `guides${loc.prefix}machineguardcorpsvsalternatives`;

    const howTitles = {
      pt: ['Como jogar Machine Guard Corps', 'Como jogar Machine Guard Corps: unidades, evolucoes, upgrades, habilidades, chefes, ~130 KB.'],
      es: ['Como jugar Machine Guard Corps', 'Como jugar Machine Guard Corps: unidades, evoluciones, mejoras, habilidades, jefes, ~130 KB.'],
      vi: ['Cach choi Machine Guard Corps', 'Huong dan Machine Guard Corps: don vi, tien hoa, nang cap, ky nang, boss, ~130 KB.'],
      id: ['Cara main Machine Guard Corps', 'Panduan Machine Guard Corps: unit, evolusi, peningkatan, skill, bos, ~130 KB.'],
      de: ['Machine Guard Corps spielen', 'Machine Guard Corps spielen: Einheiten, Evolutionen, Upgrades, Faehigkeiten, Bosse, ~130 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar Machine Guard Corps', 'Quando encaixa: sessoes longas de estrategia contra uma IA adaptativa, ~130 KB.'],
      es: ['Cuando jugar Machine Guard Corps', 'Cuando encaja: sesiones largas de estrategia contra una IA adaptativa, ~130 KB.'],
      vi: ['Khi nao choi Machine Guard Corps', 'Khi nao phu hop: phien chien luoc dai voi AI thich ung, ~130 KB.'],
      id: ['Kapan main Machine Guard Corps', 'Kapan cocok: sesi strategi panjang melawan AI adaptif, ~130 KB.'],
      de: ['Wann Machine Guard Corps spielen', 'Wann es passt: lange Strategie-Sessions gegen eine adaptive KI, ~130 KB.'],
    };
    const vsTitles = {
      pt: ['Machine Guard Corps vs alternativas', 'Compare com Black Cat on a Hot Tin Roof e Mor Chess 2.'],
      es: ['Machine Guard Corps vs alternativas', 'Compara con Black Cat on a Hot Tin Roof y Mor Chess 2.'],
      vi: ['Machine Guard Corps vs lua chon khac', 'So sanh voi Black Cat on a Hot Tin Roof va Mor Chess 2.'],
      id: ['Machine Guard Corps vs alternatif', 'Bandingkan dengan Black Cat on a Hot Tin Roof dan Mor Chess 2.'],
      de: ['Machine Guard Corps vs Alternativen', 'Vergleich mit Black Cat on a Hot Tin Roof und Mor Chess 2.'],
    };

    let title, desc;
    if (!loc.code) { title = g.enTitle; desc = g.enDesc; }
    else if (g.route.includes('how-to-play')) [title, desc] = howTitles[loc.code];
    else if (g.route.includes('when')) [title, desc] = whenTitles[loc.code];
    else [title, desc] = vsTitles[loc.code];

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser auto-battler game on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/machine-guard-corps.html">Machine Guard Corps</a> laedt einen ${SIZE} Lane-Defense-Auto-Battler im iframe: Einheiten beschwoeren, Basis upgraden, Bosse ueberleben.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Kein Speicherstand, session-only. Engine MIT (Machine Guard Corps, Mars723).</p>
<p><a href="${routePath}">Diese Sprachversion</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/machine-guard-corps.html">Machine Guard Corps</a> loads a ${SIZE} lane-defense auto-battler in an iframe: summon units, upgrade your base, survive boss rounds.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>No save data, session-only. Engine MIT (Machine Guard Corps, Mars723).</p>
<p><a href="${routePath}">This locale guide</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-mgc-title svg-minipictogram-mgc-desc">
  <title id="svg-minipictogram-mgc-title">Machine Guard Corps</title>
  <desc id="svg-minipictogram-mgc-desc">Robot sentry facing an alien hive shield</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <rect x="12" y="24" width="14" height="18" fill="#7DAFA3"/>
  <rect x="12" y="18" width="8" height="6" fill="#7DAFA3"/>
  <circle cx="16" cy="21" r="2" fill="#1C1C1E"/>
  <path d="M40 20 L48 26 L48 38 L40 44 L32 38 L32 26 Z" fill="#E8C5C9"/>
  <circle cx="40" cy="32" r="4" fill="#1C1C1E"/>
</svg>`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picRel = `source/web/src/main/webapp/static/img/illustrations/mini-pictogram/machineguardcorps__${hash8}.svg`;
w(picRel, pictogramBody);
console.log('pictogram', picRel);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-machineguardcorps
description: |
  Ground-truth for /games/machine-guard-corps.html. Hand-authored
  2026-07-18 (game-discovery-loop-runbook fire148) from
  Mars723/Machine-Guard-Corps at static/games/machine-guard-corps/.
---

# tool-machineguardcorps - /games/machine-guard-corps.html

## Identity

- **Route**: /games/machine-guard-corps.html
- **Slug**: \`machine-guard-corps\` (CMS: \`machineguardcorps\`)
- **Cluster**: games
- **Aliases**: /machine-guard-corps.html

## Reader task

Defend a command base from an adaptive alien hive in a sci-fi lane-defense auto-battler: summon 5 machine unit lines (each with 2 permanent evolution paths), spend Scrap on 4 upgrade trees (5 levels each), and use 3 active skills (Missile Strike, EMP Pulse, Repair Swarm) to survive an escalating boss sequence and eventual double-boss rounds, winning by reducing the hive's core HP to zero.

## Processing model

**client-side-only** - 3 plain (unminified, unbundled) source files: index.html (3666B) + game.js (~118KB, 3456 lines - canvas rendering, simulation, AI, units, skills, upgrades) + style.css (~7KB). No build step in the upstream project; these ARE the deployed files, not compiled output. Canvas is a fixed 960x540 \`#gameCanvas\`. Every action (summon/skill/upgrade/evolution/pause/restart) has BOTH a keyboard shortcut AND an on-screen button, so the game is fully playable with mouse/touch alone. Zero CDN, zero fetch/XHR/WebSocket, zero localStorage/sessionStorage anywhere in the source (directly verified by grep - unlike several other recent js13k-style vendors in this catalog, this bundle is NOT minified/packed, so this was a direct, complete-coverage check). No progress or score persists between sessions. Page carries noindex; canonical URL is /games/machine-guard-corps.html.

## License analysis

- Upstream: **Mars723/Machine-Guard-Corps**, **MIT, Copyright (c) 2026 Mars** (LICENSE vendored verbatim, verified via raw fetch AND via GitHub API's structured \`license\` object - the strongest confirmation signal used this session, not just a topic tag or README badge).
- Original sci-fi lane-defense auto-battler with the author's own unit/skill/upgrade/boss design; "alien hive" vs "machine corps" is generic sci-fi vocabulary, not tied to any specific commercial franchise or copyrighted property.
- Adaptation: added \`<meta name="robots" content="noindex">\` to index.html. No other changes - the vendored index.html/game.js/style.css are byte-identical to upstream.
- Clean ELIGIBLE; no operator adjudication needed.

## Reader-benefit framing menu

- V1: 5 distinct unit lines (Robot Infantry, Mech Dog, Attack Drone, Big Fat Bot, Railgun Walker), each with exactly 2 permanent evolution choices purchasable with Scrap (10 evolutions total) - verified from README + config data in game.js.
- V2: 4 upgrade trees (Command Tower, Base Turret, Coolant Banks, Combat Firmware), 5 levels each, bought with Scrap via keyboard (Z/X/C/V) or on-screen buttons.
- V3: 3 active skills (Missile Strike, EMP Pulse, Repair Swarm) on independent cooldowns, each improved by the Command Tower/Coolant Banks upgrade trees.
- V4: The alien hive is NOT a fixed wave script - it manages its own Alien Energy resource, upgrades itself over time, and triggers emergency invulnerability shields at 50% and 15% HP (which also refill its own energy) - verified directly from the README's own mechanic description.
- V5: A heat/overheat system: machine units that attack build heat and shut down for 2 seconds at 100 heat; Coolant Banks upgrades mitigate this.
- V6: A named 6-boss roster (Hive Siege Core, Broodmaw Crusher, Void Prism Tyrant, Carapace Sovereign, Dreadspire Artillery, Star-Eater Monarch) escalating to double-boss rounds once exhausted.
- V7: Fully dual-input: every action has both a keyboard shortcut and an on-screen button, confirmed playable with touch/mouse alone (no keyboard-only gate).
- V8: Both fortresses (player base and alien hive) auto-repair after 8 seconds without taking damage, with repair speed tied to the Command Tower upgrade.
- V9: About ${SIZE} total after Play; session-only (no localStorage anywhere in the source, verified by direct grep since the bundle is unminified).
- V10: Adapted from Machine Guard Corps (MIT, Mars723); ships LICENSE + CREDITS.

## Implemented features

- Canvas-rendered lane-defense battlefield with 2 opposing fortresses, automatic turret weapons, and a live HUD (Energy, Alien Energy, Scrap, Base HP, Hive HP, Threat level, Status).
- 5 summonable unit lines with a 2-choice permanent evolution system per line (10 evolutions total).
- 4 five-level upgrade trees affecting base stats, turret performance, heat management, and unit combat stats.
- 3 active skills with independent cooldowns (area damage, crowd-control slow, area heal).
- Self-upgrading adaptive enemy AI with its own resource economy, emergency shield thresholds, and a 6-entry named boss roster escalating to double-boss endless rounds.
- Heat/overheat mechanic and automatic out-of-combat fortress repair for both sides.

## Anti-claims

- Does NOT use a server backend, CDN, or fetch at runtime.
- Does NOT persist scores, progress, or unlocks between sessions (no localStorage anywhere in the source).
- Is NOT a fixed-wave tower-defense; the opposing hive has its own adaptive economy/upgrade/boss-timing logic rather than a scripted enemy sequence.
- Is NOT the same genre as any other shipped game in this catalog - no lane-defense/auto-battler with unit evolutions + an adaptive enemy AI economy exists elsewhere on this site.
- Is NOT a clone of any specific commercial tower-defense or auto-battler franchise; unit names, boss names, and upgrade trees are original to this project.
- Does NOT require a keyboard; every action has an on-screen button equivalent.

## claim_catalogue_status

verified
`, 'utf8');

console.log('fire148 scaffold complete');
