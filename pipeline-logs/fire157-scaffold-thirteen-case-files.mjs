#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const WRAPPER = process.env.WRAPPER_ROOT || '/Users/ktran/Documents/Code/new/freetoolonline-frontend';
const SKILL = join(WRAPPER, '.agent/skills/tool-thirteencasefiles');
const DATE = '2026-07-20';
const SIZE = '~10 KB';

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

cmsTxt('thirteencasefiles', 'BODYTITLE', 'Thirteen Case Files - Free Online Detective Puzzle');
cmsTxt('thirteencasefiles', 'BODYDESC', 'Thirteen Case Files - free browser detective puzzle: review police reports, protect or arrest suspects in a serial-killer case, about 10 KB.');
cmsTxt('thirteencasefiles', 'BODYKW', 'thirteen case files game, detective browser puzzle, js13k serial killer game, free browser detective game, wiserim thirteen');

cmsHtml('thirteencasefiles', 'BODYHTML', `<div class="w3-container">
    <p>Thirteen Case Files is a free browser detective puzzle. Click through police reports and personal files, then protect one person from the serial killer or arrest a suspect - only one action per day. About ${SIZE}, no install, no account.</p>
    <p>Want a timed maze roll instead? Try <a href="/games/roller-maze-escape.html">Rollermaze</a>. Want clock-chain timing? Try <a href="/games/thirteen-hours.html">Thirteen Hours</a>.</p>
</div>

<div id="tcfWrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="tcfStage" style="position:relative; width:100%; aspect-ratio:4/3; max-width:640px; margin:0 auto; min-height:360px; background:#1a1a1a; border-radius:6px; overflow:hidden;">
            <div id="tcfLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#9FD;">THIRTEEN CASE FILES</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Review daily police reports and suspect files, then protect a potential victim or arrest a suspect - one choice per day. Adapted from Marcin Walczak's js13k entry (MIT). About ${SIZE}.</p>
                <button id="tcfPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Click or touch to interact on a 320x240 canvas. Session-only - no save data in this build.</p>
            </div>
        </div>
    </div>
    <div id="tcfStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
    <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="tcfFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Session-only play - no localStorage saves.</span>
    </div>
    <style>
        #tcfStage:fullscreen { border-radius: 0; max-width: none; }
        #tcfStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('thirteencasefiles', 'BODYWELCOME', `<p>Welcome to Thirteen Case Files - a free browser detective puzzle you can play without an account or install. Press Play to load the ${SIZE} canvas game in a same-origin iframe. Read police reports, inspect suspect files, and choose to protect or arrest one person each day as you investigate a serial killer tied to the number 13. Privacy note: nothing is saved on this device; only the initial page and game files load from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('thirteencasefiles', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var TCF_GAME_URL = 'thirteen-case-files/index.html';
    function tcfStatus(text) {
        var el = document.getElementById('tcfStatus');
        if (el) el.textContent = text;
    }
    function tcfInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'tcfFrame';
        frame.src = TCF_GAME_URL;
        frame.title = 'Thirteen Case Files game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            tcfStatus('Game loaded. Click or touch on the canvas to read reports and choose protect or arrest.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('tcfLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('tcfStage');
        var playBtn = document.getElementById('tcfPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('tcfFullscreenBtn');
        playBtn.addEventListener('click', function () {
            tcfStatus('Loading the game (about 10 KB, one time - then cached)...');
            tcfInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('tcfFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('thirteencasefiles', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Thirteen Case Files?</summary><p>A free browser detective puzzle where you investigate a serial killer case tied to the number 13 by reading police reports and choosing to protect or arrest one person per day.</p></details>
<details class="faq-item"><summary>How do I play?</summary><p>After Play loads the game, click or touch the canvas to open reports and suspect files, then choose protect or arrest for one person each day.</p></details>
<details class="faq-item"><summary>Can I protect and arrest on the same day?</summary><p>No. You can protect one person or arrest one suspect per day, not both.</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>No. This build is session-only with no localStorage saves.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of HTML and JavaScript after you press Play.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>Yes. The game supports click and touch on the 320x240 canvas scaled inside the page frame.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from wiserim/js13k-2024-13 by Marcin Walczak under the MIT license. This site build adds noindex and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/thirteen-case-files.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Thirteen Case Files - Step by Step</b></h1>
<p>The <a href="/games/thirteen-case-files.html">Thirteen Case Files</a> page loads a ${SIZE} detective puzzle in an iframe.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Play, read the daily police report, inspect suspect files, then protect one person or arrest one suspect.</b></p></div>
<h2><b>Step 1 - press Play</b></h2><p>Press Play to inject the iframe (${SIZE}). The 320x240 canvas boots with the case briefing screen.</p>
<h2><b>Step 2 - open reports and files</b></h2><p>Click or touch menu items on the canvas to read the police report and personal files for each suspect.</p>
<h2><b>Step 3 - choose protect or arrest</b></h2><p>Each day you may protect one potential victim from the killer or arrest one suspect you believe is guilty - only one action per day.</p>
<h2><b>Step 4 - advance the investigation</b></h2><p>Correct choices keep potential victims alive and narrow the case toward identifying the serial killer tied to the number 13.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>single-file HTML + JS</td></tr><tr><td>Input</td><td>click / touch</td><td>320x240 canvas</td></tr><tr><td>Saves</td><td>none</td><td>session-only</td></tr><tr><td>Core loop</td><td>report -> protect or arrest</td><td>detective choice puzzle</td></tr></table>
<p>See <a href="/guides/thirteen-case-files-when.html">when to play</a>, <a href="/guides/thirteen-case-files-vs-alternatives.html">comparisons</a>, and <a href="/games/roller-maze-escape.html">Rollermaze</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Thirteen Case Files</b></h1>
<p><a href="/games/thirteen-case-files.html">Thirteen Case Files</a> fits a short detective session - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>When you want a narrative choice puzzle</b></h2><p>Daily reports, suspect files, and one protect-or-arrest decision combine reading with deduction.</p>
<h2><b>When you have a few quiet minutes</b></h2><p>The compact canvas loads quickly and runs entirely in the browser with click or touch.</p>
<h2><b>When to pick another game</b></h2><p>Want timed maze rolling? Use <a href="/games/roller-maze-escape.html">Rollermaze</a>. Want clock chains? Use <a href="/games/thirteen-hours.html">Thirteen Hours</a>.</p>
<p>See <a href="/guides/how-to-play-thirteen-case-files.html">how to play</a> and <a href="/guides/thirteen-case-files-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Thirteen Case Files vs Alternatives</b></h1>
<p><a href="/games/thirteen-case-files.html">Thirteen Case Files</a> is a click-driven detective choice puzzle. Compare it with two other free browser games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Thirteen Case Files</td><td>${SIZE}</td><td>Click / touch canvas</td><td>none (session)</td></tr>
<tr><td><a href="/games/roller-maze-escape.html">Rollermaze</a></td><td>~59 KB</td><td>Arrow keys / WASD roll</td><td>none (session)</td></tr>
<tr><td><a href="/games/thirteen-hours.html">Thirteen Hours</a></td><td>~30 KB</td><td>Tap / click active clock</td><td>ftol:thirteenhours</td></tr>
</table>
<p>Pick Thirteen Case Files for narrative detective choices. Pick Rollermaze for timed maze routing. Pick Thirteen Hours for clock-chain timing.</p>
<p>See <a href="/guides/how-to-play-thirteen-case-files.html">how to play</a> and <a href="/guides/thirteen-case-files-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-thirteen-case-files', slug: 'guideshowtoplaythirteencasefiles', enTitle: 'How to Play Thirteen Case Files - Step by Step', enDesc: 'How to play Thirteen Case Files: read reports, protect or arrest one person per day, ~10 KB browser detective puzzle.', html: howToEn },
  { route: 'thirteen-case-files-when', slug: 'guidesthirteencasefileswhen', enTitle: 'When to Play Thirteen Case Files', enDesc: 'When Thirteen Case Files fits: short detective choice sessions with police reports and protect-or-arrest decisions, ~10 KB.', html: whenEn },
  { route: 'thirteen-case-files-vs-alternatives', slug: 'guidesthirteencasefilesvsalternatives', enTitle: 'Thirteen Case Files vs Alternatives', enDesc: 'Compare Thirteen Case Files with Rollermaze and Thirteen Hours - size, input, saves.', html: vsEn },
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
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplaythirteencasefiles`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}thirteencasefileswhen`;
    else cmsSlug = `guides${loc.prefix}thirteencasefilesvsalternatives`;

    const howTitles = {
      pt: ['Como jogar Thirteen Case Files', 'Como jogar: leia relatorios, proteja ou prenda um suspeito por dia, ~10 KB.'],
      es: ['Como jugar Thirteen Case Files', 'Como jugar: lee informes, protege o arresta a un sospechoso por dia, ~10 KB.'],
      vi: ['Cach choi Thirteen Case Files', 'Huong dan: doc bao cao, bao ve hoac bat mot nghi pham moi ngay, ~10 KB.'],
      id: ['Cara main Thirteen Case Files', 'Panduan: baca laporan, lindungi atau tangkap satu tersangka per hari, ~10 KB.'],
      de: ['Thirteen Case Files spielen', 'Anleitung: Berichte lesen, pro Tag schuetzen oder verhaften, ~10 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar Thirteen Case Files', 'Quando encaixa: sessoes curtas de detetive com escolhas proteger ou prender, ~10 KB.'],
      es: ['Cuando jugar Thirteen Case Files', 'Cuando encaja: sesiones cortas de detective con proteger o arrestar, ~10 KB.'],
      vi: ['Khi nao choi Thirteen Case Files', 'Khi nao phu hop: phien dieu tra ngan voi bao ve hoac bat, ~10 KB.'],
      id: ['Kapan main Thirteen Case Files', 'Kapan cocok: sesi detektif singkat dengan lindungi atau tangkap, ~10 KB.'],
      de: ['Wann Thirteen Case Files spielen', 'Wann es passt: kurze Detektiv-Sessions mit Schuetzen-oder-Verhaften, ~10 KB.'],
    };
    const vsTitles = {
      pt: ['Thirteen Case Files vs alternativas', 'Compare com Rollermaze e Thirteen Hours.'],
      es: ['Thirteen Case Files vs alternativas', 'Compara con Rollermaze y Thirteen Hours.'],
      vi: ['Thirteen Case Files vs lua chon khac', 'So sanh voi Rollermaze va Thirteen Hours.'],
      id: ['Thirteen Case Files vs alternatif', 'Bandingkan dengan Rollermaze dan Thirteen Hours.'],
      de: ['Thirteen Case Files vs Alternativen', 'Vergleich mit Rollermaze und Thirteen Hours.'],
    };

    let title, desc;
    if (!loc.code) { title = g.enTitle; desc = g.enDesc; }
    else if (g.route.includes('how-to-play')) [title, desc] = howTitles[loc.code];
    else if (g.route.includes('when')) [title, desc] = whenTitles[loc.code];
    else [title, desc] = vsTitles[loc.code];

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser detective puzzle on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/thirteen-case-files.html">Thirteen Case Files</a> laedt ein ${SIZE} Detektiv-Raetsel im iframe: Berichte lesen, pro Tag schuetzen oder verhaften.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Session-only, keine Speicherung. Engine MIT (Marcin Walczak / wiserim).</p>
<p><a href="${routePath}">Diese Sprachversion</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/thirteen-case-files.html">Thirteen Case Files</a> loads a ${SIZE} detective puzzle in an iframe: read reports, protect or arrest one person per day.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Session-only play with no localStorage. Engine MIT (Marcin Walczak / wiserim).</p>
<p><a href="${routePath}">This locale guide</a> &middot; <a href="/guides/${g.route}.html">EN</a> &middot; <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-tcf-title svg-minipictogram-tcf-desc">
  <title id="svg-minipictogram-tcf-title">Thirteen Case Files</title>
  <desc id="svg-minipictogram-tcf-desc">Detective folder with magnifying glass and the number 13 suggesting a serial case investigation puzzle</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <rect x="14" y="18" width="28" height="34" rx="2" fill="#5B73AE" opacity="0.9"/>
  <rect x="18" y="14" width="20" height="8" rx="2" fill="#7DAFA3"/>
  <circle cx="40" cy="38" r="10" fill="none" stroke="#D9C7A3" stroke-width="3"/>
  <line x1="47" y1="45" x2="52" y2="50" stroke="#D9C7A3" stroke-width="3" stroke-linecap="round"/>
  <text x="24" y="36" font-family="sans-serif" font-size="12" font-weight="700" fill="#D9C7A3">13</text>
</svg>
`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picName = `thirteencasefiles__${hash8}.svg`;
w(`source/web/src/main/webapp/static/img/illustrations/mini-pictogram/${picName}`, pictogramBody);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-thirteencasefiles
description: |
  Ground-truth for /games/thirteen-case-files.html. Hand-authored
  ${DATE} (game-discovery-loop-runbook fire157) from
  wiserim/js13k-2024-13 at static/games/thirteen-case-files/.
---

# tool-thirteencasefiles - /games/thirteen-case-files.html

## Identity

- **Route**: /games/thirteen-case-files.html
- **Slug**: \`thirteen-case-files\` (CMS: \`thirteencasefiles\`)
- **Cluster**: games
- **Aliases**: /thirteen-case-files.html

## Reader task

Read daily police reports and suspect personal files, then protect one potential victim from the serial killer or arrest one suspect - only one action per day - as you investigate a homicide case tied to the number 13.

## Processing model

**client-side-only** - \`index.html\` single-file roadrolled bundle (~10 KB). Canvas 2D on \`canvas#c1\` at 320x240. Zero CDN, zero runtime fetch beyond same-origin assets. No localStorage - session-only. Page carries noindex; canonical URL is /games/thirteen-case-files.html.

## License analysis

- Upstream: **wiserim/js13k-2024-13**, **MIT, Copyright (c) 2024 Marcin Walczak** (LICENSE vendored).
- Original js13kGames 2024 entry "Thirteen"; reader brand Thirteen Case Files.
- Adaptation: title rebrand, noindex meta, LICENSE+CREDITS shipped; vendored pre-built competition artifact.
- Clean ELIGIBLE. Distinct from thirteen-hours clock puzzle, thirteen-card-duel, and roller-maze escape.

## Reader-benefit framing menu

- V1: Narrative detective choice puzzle with daily protect-or-arrest decisions.
- V2: Click or touch to read police reports and suspect files on a 320x240 canvas.
- V3: One protect or one arrest action allowed per in-game day.
- V4: ~10 KB after Play; session-only, no saves.
- V5: Adapted from Marcin Walczak's MIT js13k-2024-13 entry.

## Implemented features

- Police report and personal file menus on canvas.
- Protect-or-arrest daily action loop.
- Procedural miniMusic audio (xem lineage, inlined).
- Pixel-art UI with mouse and touch input.

## Anti-claims

- Does NOT use a server or CDN at runtime.
- Does NOT persist progress in localStorage.
- Does NOT require keyboard input (click/touch primary).
- Is NOT a first-person shooter or hidden-object photoreal hunt.

## claim_catalogue_status

verified
`, 'utf8');

console.log('scaffold done', { picName, hash8, skill: SKILL });
