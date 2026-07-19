#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const WRAPPER = process.env.WRAPPER_ROOT || '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const SKILL = join(WRAPPER, '.agent/skills/tool-quantumshift');
const DATE = '2026-07-19';
const SIZE = '~68 KB';

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

cmsTxt('quantumshift', 'BODYTITLE', 'Quantum Shift - Free Online Particle Puzzle');
cmsTxt('quantumshift', 'BODYDESC', 'Quantum Shift - free browser particle puzzle: arrow keys to move, touch blocks to match red or purple outlines, about 68 KB.');
cmsTxt('quantumshift', 'BODYKW', 'quantum shift game, particle puzzle browser, js13k quantum puzzle, free browser puzzle game, dr5hn quantam shift');

cmsHtml('quantumshift', 'BODYHTML', `<div class="w3-container">
    <p>Quantum Shift is a free browser particle puzzle. Move with arrow keys, touch red and purple blocks to flip their state, and match every outline target on the level. About ${SIZE}, no install, no account.</p>
    <p>Want a clock-chain puzzle instead? Try <a href="/games/thirteen-hours.html">Thirteen Hours</a>. Want paddle rallies? Try <a href="/games/classic-pong.html">Classic Pong</a>.</p>
</div>

<div id="qsWrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="qsStage" style="position:relative; width:100%; aspect-ratio:1/1; max-width:640px; margin:0 auto; min-height:360px; background:#1a1a1a; border-radius:6px; overflow:hidden;">
            <div id="qsLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#9FD;">QUANTUM SHIFT</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Arrow keys move your block. Touch particles to toggle red and purple until each one matches its outline. Adapted from Darshan Gada's js13k entry (MIT). About ${SIZE}.</p>
                <button id="qsPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Pick a level from the menu, then use arrow keys. Session-only - no save data in this build.</p>
            </div>
        </div>
        <div id="qsStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="qsFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Session-only play - no localStorage saves.</span>
    </div>
    <style>
        #qsStage:fullscreen { border-radius: 0; max-width: none; }
        #qsStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('quantumshift', 'BODYWELCOME', `<p>Welcome to Quantum Shift - a free browser particle puzzle you can play without an account or install. Press Play to load the ${SIZE} game in a same-origin iframe. Pick a level, move with arrow keys, and touch particles until each block matches its red or purple outline. Privacy note: nothing is saved on this device; only the initial page and game files load from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('quantumshift', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var QS_GAME_URL = 'quantum-shift/index.html';
    function qsStatus(text) {
        var el = document.getElementById('qsStatus');
        if (el) el.textContent = text;
    }
    function qsInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'qsFrame';
        frame.src = QS_GAME_URL;
        frame.title = 'Quantum Shift game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            qsStatus('Game loaded. Pick a level, then use arrow keys to move and touch particles.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('qsLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('qsStage');
        var playBtn = document.getElementById('qsPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('qsFullscreenBtn');
        playBtn.addEventListener('click', function () {
            qsStatus('Loading the game (about 68 KB, one time - then cached)...');
            qsInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('qsFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('quantumshift', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Quantum Shift?</summary><p>A free browser particle puzzle: move with arrow keys and touch blocks to flip red and purple states until each one matches its outline target.</p></details>
<details class="faq-item"><summary>How do I play?</summary><p>After Play loads the level menu, pick a level. Use arrow keys to move your blue block into particles and toggle their color to match the outline.</p></details>
<details class="faq-item"><summary>What do the outlines mean?</summary><p>A red outline wants the normal (red) state. A purple outline wants the quantum (purple) state. Touch a particle while overlapping it to flip states.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>No. This build is session-only with no localStorage saves.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of HTML, JavaScript, and inlined level data after you press Play.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>It can load on a phone, but arrow-key movement is the primary control, so a keyboard is the better fit.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from dr5hn/quantam-shift by Darshan Gada under the MIT license. This site build adds noindex, inlines levels.json, and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/quantum-shift.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Quantum Shift - Step by Step</b></h1>
<p>The <a href="/games/quantum-shift.html">Quantum Shift</a> page loads a ${SIZE} particle puzzle in an iframe.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Play, pick a level, move with arrow keys, and touch particles until every outline target matches.</b></p></div>
<h2><b>Step 1 - press Play</b></h2><p>Press Play to inject the iframe (${SIZE}). The canvas shows a level picker with numbered buttons.</p>
<h2><b>Step 2 - pick a level</b></h2><p>Click a level button. Obstacles appear as gray blocks; particles spawn with red or purple outline targets.</p>
<h2><b>Step 3 - move with arrow keys</b></h2><p>Your blue block moves with the arrow keys. Slide around obstacles to reach each particle.</p>
<h2><b>Step 4 - touch particles to match outlines</b></h2><p>Overlap a particle to toggle red/purple. Match every outline to finish the level and advance.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>HTML + JS + inlined levels</td></tr><tr><td>Input</td><td>arrow keys + click</td><td>move + level pick</td></tr><tr><td>Saves</td><td>none</td><td>session-only</td></tr><tr><td>Core loop</td><td>move -> touch -> match</td><td>multi-level puzzle</td></tr></table>
<p>See <a href="/guides/quantum-shift-when.html">when to play</a>, <a href="/guides/quantum-shift-vs-alternatives.html">comparisons</a>, and <a href="/games/thirteen-hours.html">Thirteen Hours</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Quantum Shift</b></h1>
<p><a href="/games/quantum-shift.html">Quantum Shift</a> fits a short logic-and-movement session - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>When you want spatial puzzle thinking</b></h2><p>Each level mixes obstacles with particles that need the right red or purple state - not just speed.</p>
<h2><b>When you have a keyboard handy</b></h2><p>Arrow keys drive movement; the square canvas scales inside the page frame.</p>
<h2><b>When to pick another game</b></h2><p>Want timed clock chains? Use <a href="/games/thirteen-hours.html">Thirteen Hours</a>. Want paddle rallies? Use <a href="/games/classic-pong.html">Classic Pong</a>.</p>
<p>See <a href="/guides/how-to-play-quantum-shift.html">how to play</a> and <a href="/guides/quantum-shift-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Quantum Shift vs Alternatives</b></h1>
<p><a href="/games/quantum-shift.html">Quantum Shift</a> is a particle state-matching puzzle. Compare it with two other free browser games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Quantum Shift</td><td>${SIZE}</td><td>Arrow keys + particle touch</td><td>none (session)</td></tr>
<tr><td><a href="/games/thirteen-hours.html">Thirteen Hours</a></td><td>~30 KB</td><td>Tap / click active clock</td><td>ftol:thirteenhours</td></tr>
<tr><td><a href="/games/classic-pong.html">Classic Pong</a></td><td>~60 KB</td><td>Keyboard 1/2/0 + Q/A + P/L</td><td>none (session)</td></tr>
</table>
<p>Pick Quantum Shift for outline-matching particle puzzles. Pick Thirteen Hours for timed clock chains. Pick Classic Pong for paddle rallies.</p>
<p>See <a href="/guides/how-to-play-quantum-shift.html">how to play</a> and <a href="/guides/quantum-shift-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-quantum-shift', slug: 'guideshowtoplayquantumshift', enTitle: 'How to Play Quantum Shift - Step by Step', enDesc: 'How to play Quantum Shift: arrow keys to move, touch particles to match outlines, ~68 KB browser puzzle.', html: howToEn },
  { route: 'quantum-shift-when', slug: 'guidesquantumshiftwhen', enTitle: 'When to Play Quantum Shift', enDesc: 'When Quantum Shift fits: short particle outline-matching sessions, ~68 KB.', html: whenEn },
  { route: 'quantum-shift-vs-alternatives', slug: 'guidesquantumshiftvsalternatives', enTitle: 'Quantum Shift vs Alternatives', enDesc: 'Compare Quantum Shift with Thirteen Hours and Classic Pong - size, input, saves.', html: vsEn },
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
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplayquantumshift`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}quantumshiftwhen`;
    else cmsSlug = `guides${loc.prefix}quantumshiftvsalternatives`;

    const howTitles = {
      pt: ['Como jogar Quantum Shift', 'Como jogar Quantum Shift: setas para mover, toque particulas para combinar contornos, ~68 KB.'],
      es: ['Como jugar Quantum Shift', 'Como jugar Quantum Shift: flechas para mover, toca particulas para igualar contornos, ~68 KB.'],
      vi: ['Cach choi Quantum Shift', 'Huong dan Quantum Shift: mui ten di chuyen, cham hat de khoi outline, ~68 KB.'],
      id: ['Cara main Quantum Shift', 'Panduan Quantum Shift: panah untuk bergerak, sentuh partikel agar outline cocok, ~68 KB.'],
      de: ['Quantum Shift spielen', 'Quantum Shift spielen: Pfeiltasten bewegen, Teilchen beruehren fuer Outline-Treffer, ~68 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar Quantum Shift', 'Quando encaixa: sessoes curtas de puzzle de particulas, ~68 KB.'],
      es: ['Cuando jugar Quantum Shift', 'Cuando encaja: sesiones cortas de puzzle de particulas, ~68 KB.'],
      vi: ['Khi nao choi Quantum Shift', 'Khi nao phu hop: phien puzzle hat ngan, ~68 KB.'],
      id: ['Kapan main Quantum Shift', 'Kapan cocok: sesi puzzle partikel singkat, ~68 KB.'],
      de: ['Wann Quantum Shift spielen', 'Wann es passt: kurze Teilchen-Outline-Sessions, ~68 KB.'],
    };
    const vsTitles = {
      pt: ['Quantum Shift vs alternativas', 'Compare com Thirteen Hours e Classic Pong.'],
      es: ['Quantum Shift vs alternativas', 'Compara con Thirteen Hours y Classic Pong.'],
      vi: ['Quantum Shift vs lua chon khac', 'So sanh voi Thirteen Hours va Classic Pong.'],
      id: ['Quantum Shift vs alternatif', 'Bandingkan dengan Thirteen Hours dan Classic Pong.'],
      de: ['Quantum Shift vs Alternativen', 'Vergleich mit Thirteen Hours und Classic Pong.'],
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
<p><a href="/games/quantum-shift.html">Quantum Shift</a> laedt einen ${SIZE} Teilchen-Puzzle-Lauf im iframe: Level waehlen, Pfeiltasten, Teilchen beruehren.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Session-only, keine Speicherung. Engine MIT (Darshan Gada / dr5hn).</p>
<p><a href="${routePath}">Diese Sprachversion</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/quantum-shift.html">Quantum Shift</a> loads a ${SIZE} particle puzzle in an iframe: pick a level, arrow keys to move, touch particles to match outlines.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Session-only play with no localStorage. Engine MIT (Darshan Gada / dr5hn).</p>
<p><a href="${routePath}">This locale guide</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-qs-title svg-minipictogram-qs-desc">
  <title id="svg-minipictogram-qs-title">Quantum Shift</title>
  <desc id="svg-minipictogram-qs-desc">Blue player block beside two outlined particles suggesting a state-matching puzzle</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <rect x="14" y="18" width="16" height="16" fill="#5B73AE" stroke="#D9C7A3" stroke-width="2"/>
  <rect x="36" y="18" width="16" height="16" fill="#7DAFA3" stroke="#5B73AE" stroke-width="2"/>
  <rect x="24" y="40" width="12" height="12" fill="#5B73AE" aria-hidden="true"/>
</svg>
`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picName = `quantumshift__${hash8}.svg`;
w(`source/web/src/main/webapp/static/img/illustrations/mini-pictogram/${picName}`, pictogramBody);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-quantumshift
description: |
  Ground-truth for /games/quantum-shift.html. Hand-authored
  ${DATE} (game-discovery-loop-runbook fire155) from
  dr5hn/quantam-shift at static/games/quantum-shift/.
---

# tool-quantumshift - /games/quantum-shift.html

## Identity

- **Route**: /games/quantum-shift.html
- **Slug**: \`quantum-shift\` (CMS: \`quantumshift\`)
- **Cluster**: games
- **Aliases**: /quantum-shift.html

## Reader task

Move with arrow keys and touch red/purple particles until each block matches its outline target and the level clears.

## Processing model

**client-side-only** - \`index.html\` + \`kontra.min.js\` + \`game.js\` with inlined levels (~68 KB). Zero CDN, zero runtime fetch beyond same-origin assets. No localStorage - session-only. Page carries noindex; canonical URL is /games/quantum-shift.html.

## License analysis

- Upstream: **dr5hn/quantam-shift**, **MIT, Copyright (c) 2024 Darshan Gada** (LICENSE vendored).
- Original js13kGames-style puzzle entry "Quantum Shift"; reader brand Quantum Shift.
- Adaptation: noindex; levels.json inlined at build time; R5 copy avoids gated-progress wording.
- Clean ELIGIBLE. Distinct from other quantum-themed tools on site.

## Reader-benefit framing menu

- V1: Multi-level particle outline-matching puzzle.
- V2: Arrow-key movement around gray obstacle blocks.
- V3: Touch particles to toggle red (normal) and purple (quantum) states.
- V4: ~68 KB after Play; session-only, no saves.
- V5: Adapted from Darshan Gada's MIT quantam-shift entry.

## Implemented features

- Kontra.js canvas loop with level selection menu.
- Particle state toggling on player overlap.
- Obstacle collision and level completion scoring.
- Inlined level data (no runtime JSON fetch).

## Anti-claims

- Does NOT use a server or CDN at runtime.
- Does NOT persist progress in localStorage.
- Does NOT require touch-only input (keyboard is primary).
- Is NOT a physics sandbox or educational quantum simulator.

## claim_catalogue_status

verified
`, 'utf8');

console.log('scaffold done', { picName, hash8, skill: SKILL });
