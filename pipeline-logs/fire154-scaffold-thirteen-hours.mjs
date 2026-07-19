#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const WRAPPER = process.env.WRAPPER_ROOT || '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const SKILL = join(WRAPPER, '.agent/skills/tool-thirteenhours');
const DATE = '2026-07-19';
const SIZE = '~30 KB';

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

cmsTxt('thirteenhours', 'BODYTITLE', 'Thirteen Hours - Free Online Clock Chain Puzzle');
cmsTxt('thirteenhours', 'BODYDESC', 'Thirteen Hours - free browser clock-chain puzzle: tap timed clocks before the timer ends, about 30 KB.');
cmsTxt('thirteenhours', 'BODYKW', 'thirteen hours game, clock chain puzzle, js13k 2024, free browser puzzle, triskaidekaphobia game');

cmsHtml('thirteenhours', 'BODYHTML', `<div class="w3-container">
    <p>Thirteen Hours is a free browser clock-chain puzzle. Tap the active clock so its hand shoots into the next clock before time runs out. Clear all clocks on a level, earn stars, and open more packs. About ${SIZE}, no install, no account.</p>
    <p>Want canvas table tennis instead? Try <a href="/games/classic-pong.html">Classic Pong</a>.</p>
</div>

<div id="thWrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="thStage" style="position:relative; width:100%; aspect-ratio:412/732; max-width:412px; margin:0 auto; min-height:480px; background:#1a1a1a; border-radius:6px; overflow:hidden;">
            <div id="thLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#9FD;">THIRTEEN HOURS</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Tap clocks in a chain before the timer ends. Progress mode has 60 levels; infinite mode keeps spawning clocks. Adapted from Jorge Rubiano's js13k 2024 entry (MIT). About ${SIZE}.</p>
                <button id="thPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Click or tap the active clock. Progress saves stars on this device under ftol:thirteenhours.</p>
            </div>
        </div>
        <div id="thStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="thFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Stars and theme color save on this device only.</span>
    </div>
    <style>
        #thStage:fullscreen { border-radius: 0; max-width: none; }
        #thStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('thirteenhours', 'BODYWELCOME', `<p>Welcome to Thirteen Hours - a free browser clock-chain puzzle you can play without an account or install. Press Play to load the ${SIZE} game in a same-origin iframe. Choose Progress for 60 levels or Infinite for endless score runs. Privacy note: progress and theme color stay on this device under ftol:thirteenhours; nothing else leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('thirteenhours', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var TH_GAME_URL = 'thirteen-hours/index.html';
    function thStatus(text) {
        var el = document.getElementById('thStatus');
        if (el) el.textContent = text;
    }
    function thInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'thFrame';
        frame.src = TH_GAME_URL;
        frame.title = 'Thirteen Hours game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            thStatus('Game loaded. Pick Progress or Infinite, then tap the active clock.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('thLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('thStage');
        var playBtn = document.getElementById('thPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('thFullscreenBtn');
        playBtn.addEventListener('click', function () {
            thStatus('Loading the game (about 30 KB, one time - then cached)...');
            thInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('thFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('thirteenhours', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Thirteen Hours?</summary><p>A free browser clock-chain puzzle: tap the active clock so its hand hits the next clock and clear the board before the timer ends.</p></details>
<details class="faq-item"><summary>How do I play?</summary><p>After Play loads the lobby, choose Progress (60 levels) or Infinite. Tap or click the highlighted clock to fire its hand into the next target.</p></details>
<details class="faq-item"><summary>What are stars for?</summary><p>Clearing a level with time left awards a star. Later level packs ask for more stars before they open.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>Yes. Cleared levels and theme color save on this device under the ftol:thirteenhours key. Nothing is uploaded.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of HTML, CSS, and JavaScript after you press Play.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>Yes. The layout is built for a tall phone frame and accepts tap input.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from Jorge Rubiano's js13kGames 2024 entry under the MIT license. This site build adds noindex, namespaces localStorage to ftol:thirteenhours, strips the service worker, and ships LICENSE plus CREDITS.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/thirteen-hours.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Thirteen Hours - Step by Step</b></h1>
<p>The <a href="/games/thirteen-hours.html">Thirteen Hours</a> page loads a ${SIZE} clock-chain puzzle in an iframe.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Play, pick Progress or Infinite, then tap the active clock before time runs out.</b></p></div>
<h2><b>Step 1 - press Play</b></h2><p>Press Play to inject the iframe (${SIZE}). The lobby shows Progress, Infinite, and a theme color row.</p>
<h2><b>Step 2 - pick a mode</b></h2><p>Progress opens a level selector with star gates. Infinite starts a score run where cleared clocks spawn new ones.</p>
<h2><b>Step 3 - tap the active clock</b></h2><p>The active clock spins. Tap it when the hand lines up with the next clock so the shot connects.</p>
<h2><b>Step 4 - clear the board</b></h2><p>Chain every clock before the timer hits zero. Finish with time left to earn a star in Progress mode.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>HTML + CSS + JS</td></tr><tr><td>Input</td><td>click / tap</td><td>active clock</td></tr><tr><td>Saves</td><td>ftol:thirteenhours</td><td>levels + color</td></tr><tr><td>Core loop</td><td>aim -> tap -> chain</td><td>60 levels + infinite</td></tr></table>
<p>See <a href="/guides/thirteen-hours-when.html">when to play</a>, <a href="/guides/thirteen-hours-vs-alternatives.html">comparisons</a>, and <a href="/games/classic-pong.html">Classic Pong</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Thirteen Hours</b></h1>
<p><a href="/games/thirteen-hours.html">Thirteen Hours</a> fits a short tap-timing session - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>When you want precision timing</b></h2><p>Each shot depends on the spinning hand angle - not on twitch aim with a mouse cursor.</p>
<h2><b>When you want a phone-friendly layout</b></h2><p>The playfield is a tall 412x732 frame that scales to the viewport.</p>
<h2><b>When to pick another game</b></h2><p>Want paddle rallies? Use <a href="/games/classic-pong.html">Classic Pong</a>. Want a boomerang dungeon? Use <a href="/games/bounce-back.html">Bounce Back</a>.</p>
<p>See <a href="/guides/how-to-play-thirteen-hours.html">how to play</a> and <a href="/guides/thirteen-hours-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Thirteen Hours vs Alternatives</b></h1>
<p><a href="/games/thirteen-hours.html">Thirteen Hours</a> is a clock-chain timing puzzle. Compare it with two other free browser games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Thirteen Hours</td><td>${SIZE}</td><td>Tap / click active clock</td><td>ftol:thirteenhours</td></tr>
<tr><td><a href="/games/classic-pong.html">Classic Pong</a></td><td>~60 KB</td><td>Keyboard 1/2/0 + Q/A + P/L</td><td>none (session)</td></tr>
<tr><td><a href="/games/bounce-back.html">Bounce Back</a></td><td>~120 KB</td><td>WASD + mouse throw + Space</td><td>ftol:bounceback:*</td></tr>
</table>
<p>Pick Thirteen Hours for timed clock chains. Pick Classic Pong for paddle rallies. Pick Bounce Back for boomerang dungeon combat.</p>
<p>See <a href="/guides/how-to-play-thirteen-hours.html">how to play</a> and <a href="/guides/thirteen-hours-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-thirteen-hours', slug: 'guideshowtoplaythirteenhours', enTitle: 'How to Play Thirteen Hours - Step by Step', enDesc: 'How to play Thirteen Hours: tap clock chains in Progress or Infinite, ~30 KB browser puzzle.', html: howToEn },
  { route: 'thirteen-hours-when', slug: 'guidesthirteenhourswhen', enTitle: 'When to Play Thirteen Hours', enDesc: 'When Thirteen Hours fits: short tap-timing clock-chain sessions, ~30 KB.', html: whenEn },
  { route: 'thirteen-hours-vs-alternatives', slug: 'guidesthirteenhoursvsalternatives', enTitle: 'Thirteen Hours vs Alternatives', enDesc: 'Compare Thirteen Hours with Classic Pong and Bounce Back - size, input, saves.', html: vsEn },
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
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplaythirteenhours`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}thirteenhourswhen`;
    else cmsSlug = `guides${loc.prefix}thirteenhoursvsalternatives`;

    const howTitles = {
      pt: ['Como jogar Thirteen Hours', 'Como jogar Thirteen Hours: toque nos relogios em Progress ou Infinite, ~30 KB.'],
      es: ['Como jugar Thirteen Hours', 'Como jugar Thirteen Hours: toca relojes en Progress o Infinite, ~30 KB.'],
      vi: ['Cach choi Thirteen Hours', 'Huong dan Thirteen Hours: cham dong ho Progress/Infinite, ~30 KB.'],
      id: ['Cara main Thirteen Hours', 'Panduan Thirteen Hours: ketuk jam Progress/Infinite, ~30 KB.'],
      de: ['Thirteen Hours spielen', 'Thirteen Hours spielen: Uhren in Progress oder Infinite tippen, ~30 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar Thirteen Hours', 'Quando encaixa: sessoes curtas de timing com toque, ~30 KB.'],
      es: ['Cuando jugar Thirteen Hours', 'Cuando encaja: sesiones cortas de timing con toque, ~30 KB.'],
      vi: ['Khi nao choi Thirteen Hours', 'Khi nao phu hop: phien timing ngan bang cham, ~30 KB.'],
      id: ['Kapan main Thirteen Hours', 'Kapan cocok: sesi timing singkat dengan ketukan, ~30 KB.'],
      de: ['Wann Thirteen Hours spielen', 'Wann es passt: kurze Tip-Timing-Sessions, ~30 KB.'],
    };
    const vsTitles = {
      pt: ['Thirteen Hours vs alternativas', 'Compare com Classic Pong e Bounce Back.'],
      es: ['Thirteen Hours vs alternativas', 'Compara con Classic Pong y Bounce Back.'],
      vi: ['Thirteen Hours vs lua chon khac', 'So sanh voi Classic Pong va Bounce Back.'],
      id: ['Thirteen Hours vs alternatif', 'Bandingkan dengan Classic Pong dan Bounce Back.'],
      de: ['Thirteen Hours vs Alternativen', 'Vergleich mit Classic Pong und Bounce Back.'],
    };

    let title, desc;
    if (!loc.code) { title = g.enTitle; desc = g.enDesc; }
    else if (g.route.includes('how-to-play')) [title, desc] = howTitles[loc.code];
    else if (g.route.includes('when')) [title, desc] = whenTitles[loc.code];
    else [title, desc] = vsTitles[loc.code];

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser puzzle on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/thirteen-hours.html">Thirteen Hours</a> laedt einen ${SIZE} Uhrketten-Puzzle-Lauf im iframe: Progress oder Infinite, aktive Uhr tippen.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Speichert Sterne und Farbe unter ftol:thirteenhours. Engine MIT (Jorge Rubiano).</p>
<p><a href="${routePath}">Diese Sprachversion</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/thirteen-hours.html">Thirteen Hours</a> loads a ${SIZE} clock-chain puzzle in an iframe: pick Progress or Infinite, tap the active clock.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Stars and theme color save under ftol:thirteenhours. Engine MIT (Jorge Rubiano).</p>
<p><a href="${routePath}">This locale guide</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-th-title svg-minipictogram-th-desc">
  <title id="svg-minipictogram-th-title">Thirteen Hours</title>
  <desc id="svg-minipictogram-th-desc">Three linked clock faces suggesting a timed chain puzzle</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <circle cx="22" cy="28" r="10" fill="none" stroke="#5B73AE" stroke-width="3"/>
  <circle cx="42" cy="28" r="10" fill="none" stroke="#7DAFA3" stroke-width="3"/>
  <circle cx="32" cy="44" r="8" fill="none" stroke="#D9C7A3" stroke-width="3"/>
  <line x1="22" y1="28" x2="22" y2="20" stroke="#5B73AE" stroke-width="2"/>
  <line x1="42" y1="28" x2="48" y2="24" stroke="#7DAFA3" stroke-width="2"/>
</svg>
`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picName = `thirteenhours__${hash8}.svg`;
w(`source/web/src/main/webapp/static/img/illustrations/mini-pictogram/${picName}`, pictogramBody);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-thirteenhours
description: |
  Ground-truth for /games/thirteen-hours.html. Hand-authored
  ${DATE} (game-discovery-loop-runbook fire154) from
  Jorger/js13k-2024 at static/games/thirteen-hours/.
---

# tool-thirteenhours - /games/thirteen-hours.html

## Identity

- **Route**: /games/thirteen-hours.html
- **Slug**: \`thirteen-hours\` (CMS: \`thirteenhours\`)
- **Cluster**: games
- **Aliases**: /thirteen-hours.html

## Reader task

Clear spinning clocks by tapping the active clock so its hand hits the next clock before the level timer ends.

## Processing model

**client-side-only** - \`index.html\` + \`bundle.js\` + \`styles.css\` + tiny icon (~30 KB). Zero CDN, zero runtime fetch beyond same-origin assets. localStorage key \`ftol:thirteenhours\` stores cleared levels and theme color. Page carries noindex; canonical URL is /games/thirteen-hours.html.

## License analysis

- Upstream: **Jorger/js13k-2024**, **MIT, Copyright (c) 2024 Jorge Rubiano** (LICENSE vendored).
- Original js13kGames 2024 entry "13 Hours" (Triskaidekaphobia theme); original branding and mechanic.
- Adaptation: noindex; localStorage renamed THIRTEEN_HOURS -> ftol:thirteenhours; service worker stripped; R5 "unlock" copy softened to "open".
- Clean ELIGIBLE. Distinct from thirteen-step-escape / thirteen-card-duel / floor-thirteen-horror.

## Reader-benefit framing menu

- V1: Progress mode with 60 levels and star gates.
- V2: Infinite score mode that respawns clocks.
- V3: Tap/click the active spinning clock to chain shots.
- V4: ~30 KB after Play; saves under ftol:thirteenhours.
- V5: Adapted from Jorge Rubiano's MIT js13k 2024 entry.

## Implemented features

- DOM clock widgets with CSS spin timing.
- Lobby theme color picker.
- Level selector with star requirements across packs.
- Pause / resume / next / run-again overlays.

## Anti-claims

- Does NOT use a server or CDN at runtime.
- Does NOT claim commercial clock IP or trademarked characters.
- Is NOT the same game as Thirteen Step Escape or Floor Thirteen Horror.
- Does NOT require a keyboard (tap/click is enough).

## claim_catalogue_status

verified
`, 'utf8');

console.log('scaffold done', { picName, hash8, skill: SKILL });
