#!/usr/bin/env node
/** fire140: scaffold seasonal-witchcat CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SKILL = join(ROOT, '..', '.agent/skills/tool-seasonalwitchcat');
const DATE = '2026-07-18';
const LS_KEY = 'ftol:seasonalwitchcat:save';

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
    details.faq-item > p, details.faq-item > div { padding: 0 8px 8px 28px; margin: 0; }
</style>`;

cmsTxt('seasonalwitchcat', 'BODYTITLE', 'Seasonal Witchcat - Free Online Season-Switching Adventure');
cmsTxt('seasonalwitchcat', 'BODYDESC', 'Seasonal Witchcat - free browser adventure: explore a pixel world, switch spring/summer/fall/winter, collect hidden cats, shoot fireballs. Arrow keys, ~34 KB, no install.');
cmsTxt('seasonalwitchcat', 'BODYKW', 'seasonal witchcat game, season switch adventure, browser cat collect game, js13k witchcat, free online pixel adventure');

cmsHtml('seasonalwitchcat', 'BODYHTML', `<div class="w3-container">
    <p>Seasonal Witchcat is a pixel adventure in the browser: you explore a large map, open season orbs (spring, summer, fall, winter), and change how the world behaves - ice over water, vines for climbing, mushrooms, leaves that fill holes. Find every hidden cat and bring them home. About ~34 KB after Play, no install, no account.</p>
    <p>Prefer a push-crate escape with a step budget? Try <a href="/games/thirteen-step-escape.html">Thirteen Step Escape</a> from the same JS13K season.</p>
</div>

<div id="swcWrapper" class="w3-container" style="background:#1a1528; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="swcStage" style="position:relative; width:100%; aspect-ratio:16/10; min-height:420px; background:#0d1b2a; border-radius:6px; overflow:hidden;">
            <div id="swcLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#c2e8f7;">SEASONAL WITCHCAT</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Explore temples across four seasons, open season orbs, and rescue every cat. From Jonathan Vallet Witchcat (MIT, JS13K 2025). About ~34 KB downloads once when you press Play.</p>
                <button id="swcPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Keyboard: WASD or arrows move. Space or Enter shoots a fireball / opens signs / cycles seasons on stone triggers. Gamepad supported. Best on desktop with a keyboard.</p>
            </div>
        </div>
        <div id="swcStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="swcFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Progress saves locally under ${LS_KEY} in your browser.</span>
    </div>
    <style>
        #swcStage:fullscreen { border-radius: 0; }
        #swcStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('seasonalwitchcat', 'BODYWELCOME', `<p>Welcome to Seasonal Witchcat - a free browser season-switching adventure you can play without an account or install. Press Play to load the ~34 KB canvas engine in a same-origin iframe, then explore the map with WASD or arrow keys. Collect season orbs to open winter ice, summer vines, autumn mushrooms, and spring flowers. Stand on stone triggers and press action to cycle seasons. Shoot fireballs to clear bushes and foes. Find every hidden cat and escort them back to their markers. Checkpoints and cat rescues save locally. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('seasonalwitchcat', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var SWC_GAME_URL = 'seasonal-witchcat/index.html';
    function swcStatus(text) {
        var el = document.getElementById('swcStatus');
        if (el) el.textContent = text;
    }
    function swcInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'swcFrame';
        frame.src = SWC_GAME_URL;
        frame.title = 'Seasonal Witchcat game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            swcStatus('Game loaded. Move with WASD or arrows; Space shoots and uses season stones.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('swcLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('swcStage');
        var playBtn = document.getElementById('swcPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('swcFullscreenBtn');
        playBtn.addEventListener('click', function () {
            swcStatus('Loading the game (about 34 KB, one time - then cached)...');
            swcInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('swcFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('seasonalwitchcat', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Seasonal Witchcat?</summary><p>A pixel adventure where you explore one large map, open four seasons with orbs, and rescue hidden cats. Season changes rewrite tiles (ice, vines, mushrooms, leaves) so new paths open.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>WASD or arrow keys move. Space or Enter is the action key: shoot a fireball when facing a direction, read stone signs while facing up, and cycle seasons when standing on a season trigger stone. A standard gamepad also works.</p></details>
<details class="faq-item"><summary>How do seasons work?</summary><p>Collect season orbs scattered in temples. Once opened, stand on a stone trigger and press action to switch the active season. Winter freezes water; summer grows climbable roots; autumn fills holes with leaves and grows mushrooms; spring blooms stone flowers.</p></details>
<details class="faq-item"><summary>How do I win?</summary><p>Find all twelve cats on the map and walk into them so they return to their home markers near the hub. When every cat is rescued, a congrats sequence plays.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>Yes. Position, active season, max lives from orbs, opened seasons, and rescued cat IDs save under ${LS_KEY} at checkpoints and after key events.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ~34 KB of a single HTML file after you press Play. Procedural audio is generated in the browser; there are no external CDN assets.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>The engine is keyboard and gamepad first. Touch has no on-screen stick in this build, so a desktop or laptop keyboard is the intended experience.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from Witchcat by Jonathan Vallet and Lylouf (Music and Bits) under the MIT license (copyright Satanimax in upstream LICENSE). This site build adds noindex on the iframe, namespaces localStorage to ${LS_KEY}, and ships LICENSE plus CREDITS next to the engine. Embedded Sonant-style music player uses a zlib-style permissive notice in source.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/seasonal-witchcat.jsp', JSP_WRAPPER);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Seasonal Witchcat - Step by Step</b></h1>
<p>The <a href="/games/seasonal-witchcat.html">Seasonal Witchcat</a> page loads a ~34 KB season-switching adventure in an iframe. Explore temples, open seasons, and rescue every cat. Press Play on this page to start.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Move with WASD or arrows; Space shoots fireballs and cycles seasons on stone triggers; collect orbs then rescue all cats.</b></p></div>
<h2><b>Step 1 - press Play</b></h2><p>Press Play to inject the iframe (~34 KB). The canvas fills the stage. Upstream is Witchcat by Jonathan Vallet (MIT, JS13K 2025).</p>
<h2><b>Step 2 - move and read signs</b></h2><p>WASD or arrow keys walk the witch. Face a stone sign and press Space while looking up to read temple hints. Heart icons at the top show remaining lives.</p>
<h2><b>Step 3 - open season orbs</b></h2><p>Explore north, south, east, and west temples. Touch season orbs to open winter, summer, fall, and spring. Each orb also raises your max lives.</p>
<h2><b>Step 4 - switch seasons on stone triggers</b></h2><p>Stand on a season stone and press action to cycle opened seasons. Winter freezes water into ice. Summer grows roots and vines to climb. Autumn grows mushrooms and fills holes with leaves. Spring blooms flowers on stone.</p>
<h2><b>Step 5 - fight and clear paths</b></h2><p>Space shoots a fireball in the facing direction. Burn bushes and some enemies. Avoid spikes, moving hazards, and falling into water or holes when the season does not protect you.</p>
<h2><b>Step 6 - rescue every cat</b></h2><p>Hidden cats sit across the map. Walk into a cat to send it home to its hub marker. Checkpoints save progress under ${LS_KEY}. Win when all cats are rescued.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>~34 KB</td><td>single index.html</td></tr><tr><td>Input</td><td>WASD/arrows, Space/Enter</td><td>gamepad supported</td></tr><tr><td>Saves</td><td>position + seasons + cats</td><td>${LS_KEY}</td></tr><tr><td>Goal</td><td>12 cats</td><td>season temples</td></tr></table>
<p>See <a href="/guides/seasonal-witchcat-when.html">when to play</a>, <a href="/guides/seasonal-witchcat-vs-alternatives.html">comparisons</a>, and <a href="/games/thirteen-step-escape.html">Thirteen Step Escape</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Seasonal Witchcat</b></h1>
<p><a href="/games/seasonal-witchcat.html">Seasonal Witchcat</a> fits longer exploration breaks where you want a season-puzzle adventure - about ~34 KB after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>When you want world-rewriting seasons</b></h2><p>Switching seasons changes tiles across the whole map, so routing is about which season opens the next temple path.</p>
<h2><b>When you like collect-and-return goals</b></h2><p>Twelve cats are hidden far from the hub. You plan loops through temples, then escort each cat home.</p>
<h2><b>When to pick another game</b></h2><p>Want a short push-crate escape with a hard step budget? Use <a href="/games/thirteen-step-escape.html">Thirteen Step Escape</a>. Want multi-cat isometric herding? Use <a href="/games/herd-cats-home.html">Herd Cats Home</a>.</p>
<p>See <a href="/guides/how-to-play-seasonal-witchcat.html">how to play</a> and <a href="/guides/seasonal-witchcat-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Seasonal Witchcat vs Alternatives</b></h1>
<p><a href="/games/seasonal-witchcat.html">Seasonal Witchcat</a> is an open-world season-switch adventure with cat rescues and fireballs. Compare it with two other free browser games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Seasonal Witchcat</td><td>~34 KB</td><td>WASD/arrows + Space</td><td>${LS_KEY}</td></tr>
<tr><td><a href="/games/thirteen-step-escape.html">Thirteen Step Escape</a></td><td>~16 KB</td><td>Arrow keys push crates</td><td>none</td></tr>
<tr><td><a href="/games/herd-cats-home.html">Herd Cats Home</a></td><td>~30 KB</td><td>Arrow keys herd cats</td><td>ftol:herdcathome:CAT</td></tr>
</table>
<p>Pick Seasonal Witchcat for season-orb exploration and cat collecting across one large map. Pick Thirteen Step Escape for a short crate-push flag race. Pick Herd Cats Home for isometric color-matched herding with step counters.</p>
<p>See <a href="/guides/how-to-play-seasonal-witchcat.html">how to play</a> and <a href="/guides/seasonal-witchcat-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-seasonal-witchcat', slug: 'guideshowtoplayseasonalwitchcat', enTitle: 'How to Play Seasonal Witchcat - Step by Step', enDesc: 'How to play Seasonal Witchcat: WASD move, Space fireball and season stones, open orbs, rescue 12 cats, ~34 KB.', html: howToEn },
  { route: 'seasonal-witchcat-when', slug: 'guidesseasonalwitchcatwhen', enTitle: 'When to Play Seasonal Witchcat', enDesc: 'When Seasonal Witchcat fits: season-switch exploration, cat rescues, ~34 KB browser adventure.', html: whenEn },
  { route: 'seasonal-witchcat-vs-alternatives', slug: 'guidesseasonalwitchcatvsalternatives', enTitle: 'Seasonal Witchcat vs Alternatives', enDesc: 'Compare Seasonal Witchcat with Thirteen Step Escape and Herd Cats Home - download size, input, saves.', html: vsEn },
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
    } else if (g.route === 'how-to-play-seasonal-witchcat') {
      cmsSlug = `guides${loc.prefix}howtoplayseasonalwitchcat`;
    } else if (g.route === 'seasonal-witchcat-when') {
      cmsSlug = `guides${loc.prefix}seasonalwitchcatwhen`;
    } else {
      cmsSlug = `guides${loc.prefix}seasonalwitchcatvsalternatives`;
    }

    const howTitles = {
      pt: [`Como jogar Seasonal Witchcat`, `Como jogar Seasonal Witchcat: estacoes, gatos, ~34 KB.`],
      es: [`Como jugar Seasonal Witchcat`, `Como jugar Seasonal Witchcat: estaciones, gatos, ~34 KB.`],
      vi: [`Cach choi Seasonal Witchcat`, `Huong dan Seasonal Witchcat: doi mua, cuu meo, ~34 KB.`],
      id: [`Cara main Seasonal Witchcat`, `Panduan Seasonal Witchcat: musim, kucing, ~34 KB.`],
      de: [`Seasonal Witchcat spielen`, `Seasonal Witchcat spielen: Jahreszeiten, Katzen, ~34 KB.`],
    };
    const whenTitles = {
      pt: [`Quando jogar Seasonal Witchcat`, `Quando Seasonal Witchcat encaixa: aventura de estacoes, ~34 KB.`],
      es: [`Cuando jugar Seasonal Witchcat`, `Cuando jugar Seasonal Witchcat: aventura de estaciones, ~34 KB.`],
      vi: [`Khi nao choi Seasonal Witchcat`, `Khi nao choi Seasonal Witchcat: phieu luu doi mua, ~34 KB.`],
      id: [`Kapan main Seasonal Witchcat`, `Kapan main Seasonal Witchcat: petualangan musim, ~34 KB.`],
      de: [`Wann Seasonal Witchcat spielen`, `Wann Seasonal Witchcat spielen: Saison-Abenteuer, ~34 KB.`],
    };
    const vsTitles = {
      pt: [`Seasonal Witchcat vs alternativas`, `Compare Seasonal Witchcat com Thirteen Step Escape e Herd Cats Home.`],
      es: [`Seasonal Witchcat vs alternativas`, `Compara Seasonal Witchcat con Thirteen Step Escape y Herd Cats Home.`],
      vi: [`Seasonal Witchcat vs lua chon khac`, `So sanh Seasonal Witchcat voi Thirteen Step Escape va Herd Cats Home.`],
      id: [`Seasonal Witchcat vs alternatif`, `Bandingkan Seasonal Witchcat dengan Thirteen Step Escape dan Herd Cats Home.`],
      de: [`Seasonal Witchcat vs Alternativen`, `Seasonal Witchcat vs Thirteen Step Escape und Herd Cats Home vergleichen.`],
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
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser season adventure on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/seasonal-witchcat.html">Seasonal Witchcat</a> laedt ein ~34 KB Saison-Abenteuer im iframe. WASD bewegen; Leertaste schiesst und wechselt Jahreszeiten auf Steinen.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Orbs freischalten, 12 Katzen retten. Speichert unter ${LS_KEY}. Engine MIT (Witchcat / Jonathan Vallet, JS13K 2025).</p>
<p><a href="${routePath}">Diese Sprachversion</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/seasonal-witchcat.html">Seasonal Witchcat</a> loads a ~34 KB season-switching adventure in an iframe. WASD or arrows move; Space shoots and cycles seasons on stone triggers.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>open season orbs, rescue twelve cats. Saves under ${LS_KEY}. Engine MIT (Witchcat / Jonathan Vallet, JS13K 2025).</p>
<p><a href="${routePath}">This locale guide</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

w('source/web/src/main/webapp/static/img/illustrations/mini-pictogram/seasonalwitchcat__c8d4e1a7.svg', `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-swc-title svg-minipictogram-swc-desc">
  <title id="svg-minipictogram-swc-title">Seasonal Witchcat</title>
  <desc id="svg-minipictogram-swc-desc">Season-switching pixel adventure collecting cats</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#0d1b2a" aria-hidden="true"/>
  <circle cx="22" cy="24" r="7" fill="#76af2b"/>
  <circle cx="42" cy="24" r="7" fill="#e4b000"/>
  <circle cx="22" cy="42" r="7" fill="#dc752b"/>
  <circle cx="42" cy="42" r="7" fill="#9dace0"/>
  <ellipse cx="32" cy="33" rx="5" ry="4" fill="#ffaa87"/>
  <path d="M28 29 L30 24 L32 29 Z" fill="#ffaa87"/>
  <path d="M32 29 L34 24 L36 29 Z" fill="#ffaa87"/>
  <text x="32" y="58" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="6" font-weight="700" letter-spacing="0.3" fill="#c2e8f7">SWC</text>
</svg>`);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-seasonalwitchcat
description: |
  Ground-truth for /games/seasonal-witchcat.html. Hand-authored 2026-07-18
  (game-discovery-loop-runbook fire140) from jonathan-vallet Witchcat at
  static/games/seasonal-witchcat/.
---

# tool-seasonalwitchcat - /games/seasonal-witchcat.html

## Identity

- **Route**: /games/seasonal-witchcat.html
- **Slug**: \`seasonal-witchcat\` (CMS: \`seasonalwitchcat\`)
- **Cluster**: games
- **Aliases**: /seasonal-witchcat.html

## Reader task

Explore a large pixel map as a witch, open four season orbs, switch seasons on stone triggers to rewrite tiles, shoot fireballs, and rescue twelve hidden cats back to hub markers.

## Processing model

**client-side-only** - single-file canvas engine (~34 KB index.html), same-origin iframe. No CDN, no analytics, no external fonts at runtime. Procedural Sonant-style music/SFX via Web Audio + Blob URLs. Engine HTML is noindex; canonical URL is /games/seasonal-witchcat.html. Main canvas \`#gc\` plus blurred background canvas \`#gbc\`.

## License analysis

- Upstream: Jonathan Vallet / Lylouf **Witchcat**, js13kGames 2025 monorepo \`jonathan-vallet/js13k-2025\` games/witchcat, also \`js13kGames/witchcat\`.
- **MIT**, Copyright (c) 2024 Satanimax (upstream LICENSE text).
- Embedded music player by Marcus Geelnard (zlib-style permissive notice in source).
- Original season-adventure; G51-distinct from \`thirteen-step-escape\` (same monorepo, different game - push-crate escape).
- localStorage save namespaced to \`${LS_KEY}\`.
- Adaptations: noindex meta, LICENSE + CREDITS shipped, localStorage key prefixed.
- Clean ELIGIBLE; no operator adjudication.

## Reader-benefit framing menu

- V1: WASD or arrow keys move the witch on a large tile map.
- V2: Space / Enter shoots a fireball in the facing direction, reads up-facing signs, and cycles seasons on stone triggers.
- V3: Four season orbs open winter, summer, fall, and spring and raise max lives.
- V4: Season switches rewrite tiles: ice over water, climbable roots, mushrooms, leaves filling holes, spring flowers.
- V5: Twelve cats are hidden across temples; walking into a cat sends it to its hub marker.
- V6: Checkpoints and key events persist position, season, lives, opened seasons, and rescued cats under \`${LS_KEY}\`.
- V7: Heart HUD shows remaining lives; damage flashes and respawns at last checkpoint.
- V8: Standard gamepad mapping supported (D-pad + face button).
- V9: About ~34 KB after Play; procedural audio only - no external asset CDN.
- V10: Adapted from Witchcat (MIT, JS13K 2025); ships LICENSE + CREDITS.

## Implemented features

- Pixel canvas world with four seasonal palettes and season-dependent tile remaps.
- Fireball projectile, moving enemies (skulls, moles), spikes, bushes, temples, signs.
- Season orb pickups and stone trigger season cycling among opened seasons.
- Cat rescue quest with hub return markers and end congrats sequence.
- Checkpoint save via localStorage \`${LS_KEY}\`.
- Procedural music per season + SFX (damage, fall, text, season effect).
- Resize-aware pixel-scale rendering with blurred backdrop canvas.

## Anti-claims (do NOT say)

- Do not claim touch virtual joystick or mobile-first controls (keyboard/gamepad only).
- Do not claim online multiplayer, accounts, or cloud saves.
- Do not claim this is the same game as Thirteen Step Escape (different entry in the monorepo).
- Do not claim external CDN fonts, images, or music files are downloaded at runtime.
`);

console.log('fire140 scaffold complete');
