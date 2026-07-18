#!/usr/bin/env node
/** fire149: scaffold solo-battlefield CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SKILL = join(ROOT, '..', '.agent/skills/tool-solobattlefield');
const DATE = '2026-07-18';
const SIZE = '~12 KB';

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

cmsTxt('solobattlefield', 'BODYTITLE', 'Solo Battlefield - Free Online Last-Alive Combat Game');
cmsTxt('solobattlefield', 'BODYDESC', 'Solo Battlefield - free browser last-alive combat game: move with WASD, click to strike, clear 8 escalating levels, about 12 KB.');
cmsTxt('solobattlefield', 'BODYKW', 'solo battlefield game, last alive combat browser, 8 level arena fighter online, wasd click combat game, js13k only one game');

cmsHtml('solobattlefield', 'BODYHTML', `<div class="w3-container">
    <p>Solo Battlefield is a free browser last-alive combat game. You are the last fighter standing: clear eight escalating levels of melee foes and archers on a square battlefield. Move with WASD or the arrow keys, click to strike, and press Space after a clear to advance. About ${SIZE}, no install, no account.</p>
    <p>Want a longer strategy defense instead? Try <a href="/games/machine-guard-corps.html">Machine Guard Corps</a>.</p>
</div>

<div id="sbfWrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="sbfStage" style="position:relative; width:100%; aspect-ratio:1/1; max-width:720px; margin:0 auto; min-height:420px; background:#1a1a1a; border-radius:6px; overflow:hidden;">
            <div id="sbfLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#e8b86d;">SOLO BATTLEFIELD</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Clear 8 levels as the last fighter alive. Adapted from Only One by Cemal Gonultas (MIT). About ${SIZE}, downloads once when you press Play.</p>
                <button id="sbfPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">WASD or arrows to move, click/tap to strike, Space to advance after a clear. Best with a mouse; touch works for attacks.</p>
            </div>
        </div>
        <div id="sbfStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="sbfFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Session-only play - no save data in this build.</span>
    </div>
    <style>
        #sbfStage:fullscreen { border-radius: 0; max-width: none; }
        #sbfStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('solobattlefield', 'BODYWELCOME', `<p>Welcome to Solo Battlefield - a free browser last-alive combat game you can play without an account or install. Press Play to load the ${SIZE} game in a same-origin iframe. Move with WASD or arrow keys, click (or tap) to strike nearby foes, and press Space after you clear a wave to start the next of eight levels. Archers fire arrows you can knock back with a strike. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('solobattlefield', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var SBF_GAME_URL = 'solo-battlefield/index.html';
    function sbfStatus(text) {
        var el = document.getElementById('sbfStatus');
        if (el) el.textContent = text;
    }
    function sbfInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'sbfFrame';
        frame.src = SBF_GAME_URL;
        frame.title = 'Solo Battlefield game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            sbfStatus('Game loaded. Move with WASD and click to strike.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('sbfLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('sbfStage');
        var playBtn = document.getElementById('sbfPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('sbfFullscreenBtn');
        playBtn.addEventListener('click', function () {
            sbfStatus('Loading the game (about 12 KB, one time - then cached)...');
            sbfInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('sbfFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('solobattlefield', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Solo Battlefield?</summary><p>A free browser last-alive combat game: clear eight escalating levels of melee foes and archers on a square battlefield.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>WASD or arrow keys move your fighter. Click or tap the battlefield to strike. Press Space after a clear to start the next level. You can knock arrows back by striking them.</p></details>
<details class="faq-item"><summary>What is the goal?</summary><p>Survive and clear all 8 levels. Enemy count, spawn timing, and archer chance escalate as you advance.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>This build is session-only. There is no save data - closing the tab resets the game.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of HTML and JavaScript after you press Play. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>Attacks work with touch, but movement uses WASD/arrows, so a keyboard or on-screen keyboard helps. A desktop or laptop is the most comfortable setup.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from Only One by Cemal Gonultas (js13kGames 2023), under the MIT license. This site build adds noindex on the engine page and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/solo-battlefield.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Solo Battlefield - Step by Step</b></h1>
<p>The <a href="/games/solo-battlefield.html">Solo Battlefield</a> page loads a ${SIZE} last-alive combat game in an iframe.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Play, then move with WASD and click to strike until the level clears - Space starts the next of 8 levels.</b></p></div>
<h2><b>Step 1 - press Play</b></h2><p>Press Play to inject the iframe (${SIZE}). The square battlefield appears immediately.</p>
<h2><b>Step 2 - move and strike</b></h2><p>Hold WASD or arrow keys to move. Click near a foe to strike. Keep circling so melee enemies do not surround you.</p>
<h2><b>Step 3 - handle archers</b></h2><p>Later levels spawn archers. Strike their arrows to send them back. Close the distance before the next volley.</p>
<h2><b>Step 4 - advance with Space</b></h2><p>When the level is clear, a wait screen appears. Press Space to start the next level. Complete all 8 for victory.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>HTML + JS, no image assets at runtime</td></tr><tr><td>Input</td><td>WASD + click</td><td>keyboard for movement; mouse/touch for strikes</td></tr><tr><td>Saves</td><td>none</td><td>session-only</td></tr><tr><td>Levels</td><td>8</td><td>enemy count and archer chance escalate</td></tr></table>
<p>See <a href="/guides/solo-battlefield-when.html">when to play</a>, <a href="/guides/solo-battlefield-vs-alternatives.html">comparisons</a>, and <a href="/games/machine-guard-corps.html">Machine Guard Corps</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Solo Battlefield</b></h1>
<p><a href="/games/solo-battlefield.html">Solo Battlefield</a> fits a short combat session where you want crisp WASD movement and click-to-strike action - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>When you want a compact arcade fight</b></h2><p>Eight levels escalate enemy count and archer chance without a long economy or build phase.</p>
<h2><b>When you have a keyboard handy</b></h2><p>Movement is WASD/arrows, so a laptop or desktop is the natural fit. Touch still works for strikes.</p>
<h2><b>When to pick another game</b></h2><p>Want a longer strategy defense instead? Use <a href="/games/machine-guard-corps.html">Machine Guard Corps</a>. Want a fixed 60-second runner? Use <a href="/games/black-cat-hot-tin-roof.html">Black Cat on a Hot Tin Roof</a>.</p>
<p>See <a href="/guides/how-to-play-solo-battlefield.html">how to play</a> and <a href="/guides/solo-battlefield-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Solo Battlefield vs Alternatives</b></h1>
<p><a href="/games/solo-battlefield.html">Solo Battlefield</a> is a last-alive click-combat game across 8 levels. Compare it with two other free browser games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Solo Battlefield</td><td>${SIZE}</td><td>WASD + click/tap</td><td>none (session)</td></tr>
<tr><td><a href="/games/machine-guard-corps.html">Machine Guard Corps</a></td><td>~130 KB</td><td>Keyboard or on-screen buttons</td><td>none (session)</td></tr>
<tr><td><a href="/games/black-cat-hot-tin-roof.html">Black Cat on a Hot Tin Roof</a></td><td>~16 KB</td><td>Space or click/tap to jump</td><td>high score (localStorage)</td></tr>
</table>
<p>Pick Solo Battlefield for a short last-alive combat run. Pick Machine Guard Corps for a longer lane-defense strategy session. Pick Black Cat on a Hot Tin Roof for a fixed-length arcade runner.</p>
<p>See <a href="/guides/how-to-play-solo-battlefield.html">how to play</a> and <a href="/guides/solo-battlefield-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-solo-battlefield', slug: 'guideshowtoplaysolobattlefield', enTitle: 'How to Play Solo Battlefield - Step by Step', enDesc: 'How to play Solo Battlefield: WASD move, click to strike, Space to advance, 8 levels, ~12 KB browser combat.', html: howToEn },
  { route: 'solo-battlefield-when', slug: 'guidessolobattlefieldwhen', enTitle: 'When to Play Solo Battlefield', enDesc: 'When Solo Battlefield fits: short last-alive combat sessions with WASD + click, ~12 KB.', html: whenEn },
  { route: 'solo-battlefield-vs-alternatives', slug: 'guidessolobattlefieldvsalternatives', enTitle: 'Solo Battlefield vs Alternatives', enDesc: 'Compare Solo Battlefield with Machine Guard Corps and Black Cat on a Hot Tin Roof - size, input, saves.', html: vsEn },
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
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplaysolobattlefield`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}solobattlefieldwhen`;
    else cmsSlug = `guides${loc.prefix}solobattlefieldvsalternatives`;

    const howTitles = {
      pt: ['Como jogar Solo Battlefield', 'Como jogar Solo Battlefield: WASD, clique para atacar, 8 niveis, ~12 KB.'],
      es: ['Como jugar Solo Battlefield', 'Como jugar Solo Battlefield: WASD, clic para atacar, 8 niveles, ~12 KB.'],
      vi: ['Cach choi Solo Battlefield', 'Huong dan Solo Battlefield: WASD, click tan cong, 8 man, ~12 KB.'],
      id: ['Cara main Solo Battlefield', 'Panduan Solo Battlefield: WASD, klik serang, 8 level, ~12 KB.'],
      de: ['Solo Battlefield spielen', 'Solo Battlefield spielen: WASD, Klick zum Schlagen, 8 Level, ~12 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar Solo Battlefield', 'Quando encaixa: sessoes curtas de combate last-alive com WASD + clique, ~12 KB.'],
      es: ['Cuando jugar Solo Battlefield', 'Cuando encaja: sesiones cortas de combate last-alive con WASD + clic, ~12 KB.'],
      vi: ['Khi nao choi Solo Battlefield', 'Khi nao phu hop: phien combat ngan WASD + click, ~12 KB.'],
      id: ['Kapan main Solo Battlefield', 'Kapan cocok: sesi combat singkat WASD + klik, ~12 KB.'],
      de: ['Wann Solo Battlefield spielen', 'Wann es passt: kurze Last-Alive-Combat-Sessions mit WASD + Klick, ~12 KB.'],
    };
    const vsTitles = {
      pt: ['Solo Battlefield vs alternativas', 'Compare com Machine Guard Corps e Black Cat on a Hot Tin Roof.'],
      es: ['Solo Battlefield vs alternativas', 'Compara con Machine Guard Corps y Black Cat on a Hot Tin Roof.'],
      vi: ['Solo Battlefield vs lua chon khac', 'So sanh voi Machine Guard Corps va Black Cat on a Hot Tin Roof.'],
      id: ['Solo Battlefield vs alternatif', 'Bandingkan dengan Machine Guard Corps dan Black Cat on a Hot Tin Roof.'],
      de: ['Solo Battlefield vs Alternativen', 'Vergleich mit Machine Guard Corps und Black Cat on a Hot Tin Roof.'],
    };

    let title, desc;
    if (!loc.code) { title = g.enTitle; desc = g.enDesc; }
    else if (g.route.includes('how-to-play')) [title, desc] = howTitles[loc.code];
    else if (g.route.includes('when')) [title, desc] = whenTitles[loc.code];
    else [title, desc] = vsTitles[loc.code];

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser combat game on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/solo-battlefield.html">Solo Battlefield</a> laedt einen ${SIZE} Last-Alive-Combat im iframe: WASD bewegen, klicken zum Schlagen, 8 Level.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Kein Speicherstand, session-only. Engine MIT (Only One, Cemal Gonultas).</p>
<p><a href="${routePath}">Diese Sprachversion</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/solo-battlefield.html">Solo Battlefield</a> loads a ${SIZE} last-alive combat game in an iframe: WASD move, click to strike, 8 levels.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>No save data, session-only. Engine MIT (Only One, Cemal Gonultas).</p>
<p><a href="${routePath}">This locale guide</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-sbf-title svg-minipictogram-sbf-desc">
  <title id="svg-minipictogram-sbf-title">Solo Battlefield</title>
  <desc id="svg-minipictogram-sbf-desc">Lone fighter silhouette with a raised sword on a dark field</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <circle cx="32" cy="20" r="6" fill="#E8B86D"/>
  <path d="M24 28 L40 28 L38 48 L26 48 Z" fill="#7DAFA3"/>
  <rect x="42" y="14" width="4" height="22" fill="#E8C5C9"/>
  <path d="M40 14 L48 14 L44 8 Z" fill="#E8C5C9"/>
</svg>`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picName = `solobattlefield__${hash8}.svg`;
w(`source/web/src/main/webapp/static/img/illustrations/mini-pictogram/${picName}`, pictogramBody);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-solobattlefield
description: |
  Ground-truth for /games/solo-battlefield.html. Hand-authored
  ${DATE} (game-discovery-loop-runbook fire149) from
  cemalgnlts/only-one-js13k at static/games/solo-battlefield/.
---

# tool-solobattlefield - /games/solo-battlefield.html

## Identity

- **Route**: /games/solo-battlefield.html
- **Slug**: \`solo-battlefield\` (CMS: \`solobattlefield\`)
- **Cluster**: games
- **Aliases**: /solo-battlefield.html

## Reader task

Clear eight escalating combat levels as the last fighter alive on a square battlefield: move with WASD or arrow keys, click or tap to strike melee foes and archers, knock arrows back with strikes, and press Space after each clear to advance.

## Processing model

**client-side-only** - competition build \`index.html\` + \`game.min.js\` (~12 KB total). Source \`main.js\` uses Kontra but the shipped roadroller build is self-contained (no kontra.mjs fetch at runtime). Canvas 640x640. Zero CDN, zero fetch/XHR, zero localStorage (verified on game.min.js). Page carries noindex; canonical URL is /games/solo-battlefield.html.

## License analysis

- Upstream: **cemalgnlts/only-one-js13k**, **MIT, Copyright (c) 2023 Cemal Gonultas** (LICENSE vendored; GitHub API license MIT).
- Original js13kGames 2023 entry ("Only One"); last-alive battlefield combat is generic, not a commercial franchise clone.
- Adaptation: \`<meta name="robots" content="noindex">\` only. Title kept in-engine; site page uses Solo Battlefield rebrand.
- Clean ELIGIBLE.

## Reader-benefit framing menu

- V1: 8 levels with escalating enemy count, spawn timing, and archer chance (from levelData in main.js).
- V2: WASD / arrow-key movement plus click/tap strike.
- V3: Space advances after a clear (wait screen).
- V4: Strike arrows to send them back.
- V5: ~12 KB after Play; session-only (no localStorage).
- V6: Adapted from Only One (MIT, Cemal Gonultas / js13k 2023).

## Implemented features

- Top-down square battlefield combat with melee foes and archers across 8 levels.
- Keyboard movement + pointer strike; Space to resume after clear.
- Embedded ZzFX sounds in the competition build.

## Anti-claims

- Does NOT use a server, CDN, or fetch at runtime.
- Does NOT persist progress or scores (no localStorage).
- Is NOT a tower-defense or auto-battler; it is direct last-alive combat.
- Does NOT provide full on-screen movement buttons (WASD/arrows required for movement).

## claim_catalogue_status

verified
`, 'utf8');

console.log('scaffold done', { picName, hash8 });
