#!/usr/bin/env node
/** fire142: scaffold desk-cat-coder CMS + guides + pictogram + SKILL */
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..'); // web-test
const SKILL = join(ROOT, '..', '.agent/skills/tool-deskcatcoder');
const DATE = '2026-07-18';
const SIZE = '~72 KB';

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

cmsTxt('deskcatcoder', 'BODYTITLE', 'Desk Cat Coder - Free Online Stealth Desk Platformer');
cmsTxt('deskcatcoder', 'BODYDESC', 'Desk Cat Coder - free browser stealth platformer: guide a desk cat to the keyboard, type lines while the owner is away, distract with snacks, seven work days, ~72 KB, no install.');
cmsTxt('deskcatcoder', 'BODYKW', 'desk cat coder game, stealth cat platformer, browser desk cat game, js13k cat hacker, free online cat platformer');

cmsHtml('deskcatcoder', 'BODYHTML', `<div class="w3-container">
    <p>Desk Cat Coder is a stealth desk platformer in the browser: you guide Script the cat across shelves to the computer, type letter keys to ship lines while the owner is away, and distract with drinks or snacks when they return. Seven work-day rounds fill a git-style contribution grid. About ${SIZE} after Play, no install, no account.</p>
    <p>Prefer a typing duel instead? Try <a href="/games/cat-typing-race.html">Cat Typing Race</a>.</p>
</div>

<div id="dccWrapper" class="w3-container" style="background:#222; padding:12px 8px 16px 8px;">
    <div class="outputImgs" style="visibility:visible !important;">
        <div id="dccStage" style="position:relative; width:100%; aspect-ratio:16/10; min-height:420px; background:#1a1a1a; border-radius:6px; overflow:hidden;">
            <div id="dccLaunch" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#ececec; padding:16px;">
                <div style="font:700 22px -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing:1px; color:#2ea043;">DESK CAT CODER</div>
                <p style="font-size:14px; max-width:540px; margin:10px 0 14px 0; color:#a8a8a8;">Sneak to the keyboard, spam letters to ship code, distract the owner with desk items. From BlackCat_Hacker (MIT, JS13K 2025). About ${SIZE} downloads once when you press Play.</p>
                <button id="dccPlayBtn" type="button" class="w3-button w3-green w3-large" style="font-weight:700;">Play now</button>
                <p style="font-size:12.5px; color:#a8a8a8; max-width:480px; margin-top:12px;">Keyboard: arrows move and jump; letter keys type at the PC; push items to distract. Best on desktop with a keyboard.</p>
            </div>
        </div>
        <div id="dccStatus" style="font:400 14px sans-serif; color:#ccc; margin-top:8px; min-height:20px;">Press Play to load the game.</div>
        <noscript>This game runs entirely in your browser and needs JavaScript enabled.</noscript>
    </div>
    <div style="text-align:center; margin-top:10px;">
        <button id="dccFullscreenBtn" type="button" class="w3-button w3-blue" disabled>Fullscreen</button>
        <span style="font-size:12.5px; color:#888; margin-left:8px;">Session-only play - no localStorage saves in this build.</span>
    </div>
    <style>
        #dccStage:fullscreen { border-radius: 0; }
        #dccStage iframe { display:block; width:100%; height:100%; border:0; }
    </style>
</div>`);

cmsHtml('deskcatcoder', 'BODYWELCOME', `<p>Welcome to Desk Cat Coder - a free browser stealth desk platformer you can play without an account or install. Press Play to load the ${SIZE} canvas engine in a same-origin iframe, click Start Game on the title screen, then use arrow keys to climb shelves to the computer. Spam letter keys to add lines while the owner is away. When they return, drink, snack, or push desk items to buy more typing time. Seven work days fill a git-style grid; ranks update from total lines shipped. Privacy note: nothing leaves this device except the initial page and game files from this site. For more free browser games, open the <a href="/games.html">games hub</a>.</p>`);

cmsHtml('deskcatcoder', 'BODYJS', `<script>
    if (typeof web !== "undefined") web.localUpload = false;
    var DCC_GAME_URL = 'desk-cat-coder/index.html';
    function dccStatus(text) {
        var el = document.getElementById('dccStatus');
        if (el) el.textContent = text;
    }
    function dccInjectFrame(stage) {
        var frame = document.createElement('iframe');
        frame.id = 'dccFrame';
        frame.src = DCC_GAME_URL;
        frame.title = 'Desk Cat Coder game';
        frame.setAttribute('allow', 'fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.addEventListener('load', function () {
            dccStatus('Game loaded. Click Start Game, then use arrows and letter keys.');
            try { frame.contentWindow.focus(); } catch (e) {}
        });
        var launch = document.getElementById('dccLaunch');
        if (launch && launch.parentNode === stage) stage.removeChild(launch);
        stage.appendChild(frame);
        return frame;
    }
    function doAfterPageRendered() {
        var stage = document.getElementById('dccStage');
        var playBtn = document.getElementById('dccPlayBtn');
        if (!stage || !playBtn) return;
        if (playBtn.dataset.bound === '1') return;
        playBtn.dataset.bound = '1';
        var fsBtn = document.getElementById('dccFullscreenBtn');
        playBtn.addEventListener('click', function () {
            dccStatus('Loading the game (about 72 KB, one time - then cached)...');
            dccInjectFrame(stage);
            if (fsBtn) fsBtn.disabled = false;
        });
        if (fsBtn) fsBtn.addEventListener('click', function () {
            if (stage.requestFullscreen) stage.requestFullscreen();
            else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
            var frame = document.getElementById('dccFrame');
            if (frame) { try { frame.contentWindow.focus(); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doAfterPageRendered);
    } else {
        doAfterPageRendered();
    }
</script>`);

cmsHtml('deskcatcoder', 'FAQ', `${FAQ_STYLE}
<div class="w3-row page-section faq">
<h2 class="text-uppercase"><b>Frequently Asked Questions</b></h2>
<details class="faq-item"><summary>What is Desk Cat Coder?</summary><p>A stealth desk platformer. You guide a cat across shelves to a computer, type letter keys to ship lines while the owner is away, and distract them with desk items across seven work-day rounds.</p></details>
<details class="faq-item"><summary>How do I control it?</summary><p>Arrow Left/Right move. Arrow Up jumps. At the computer, spam letter keys to add lines. Push drinks, food, or objects with arrows to distract the owner. Click Start Game on the title screen after Play.</p></details>
<details class="faq-item"><summary>What is the goal?</summary><p>Ship as many lines as you can across seven work days. A git-style grid fills from your daily totals, and end ranks reflect total lines (for example Script kitty or Grey Cat Hacker thresholds in the engine).</p></details>
<details class="faq-item"><summary>Is progress saved?</summary><p>This build is session-only. There is no localStorage key. Closing the tab resets scores.</p></details>
<details class="faq-item"><summary>How big is the download?</summary><p>About ${SIZE} of single-file HTML and JavaScript after you press Play. The browser caches it for later visits on the same device.</p></details>
<details class="faq-item"><summary>Does it work on a phone?</summary><p>Menus are clickable, but movement and typing need a keyboard. Desktop or laptop is the recommended experience.</p></details>
<details class="faq-item"><summary>Is this open source?</summary><p>Yes. Adapted from BlackCat_Hacker by Zach End / Beanminchild (js13kGames 2025) under the MIT license. This site build adds noindex on the iframe, rebrands the title to Desk Cat Coder, and ships LICENSE plus CREDITS next to the engine.</p></details>
</div>`);

w('source/web/src/main/webapp/WEB-INF/jsp/games/desk-cat-coder.jsp', JSP);

const howToEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Desk Cat Coder - Step by Step</b></h1>
<p>The <a href="/games/desk-cat-coder.html">Desk Cat Coder</a> page loads a ${SIZE} stealth desk platformer in an iframe. Guide the cat to the keyboard, type lines, and distract the owner across seven days.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Press Play, click Start Game, use arrows to reach the PC, then spam letters while the owner is away.</b></p></div>
<h2><b>Step 1 - press Play and Start Game</b></h2><p>Press Play to inject the iframe (${SIZE}). On the black title screen click Start Game. Optional fedora checkbox is cosmetic.</p>
<h2><b>Step 2 - climb to the computer</b></h2><p>Arrow Left/Right walk the shelves. Arrow Up jumps. Reach the computer when the owner is not sitting there.</p>
<h2><b>Step 3 - type lines</b></h2><p>Spam letter keys to raise the green additions counter. The owner undoes lines slowly if they catch you at the keyboard.</p>
<h2><b>Step 4 - distract and recover</b></h2><p>Push drinks, food, or desk items with arrows so the owner leaves. Return to typing before the work-day timer ends.</p>
<h2><b>Step 5 - clear seven days</b></h2><p>Each day ends with a score screen and Next Day. After seven days the grid and rank summarize total lines shipped.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>${SIZE}</td><td>single index.html</td></tr><tr><td>Input</td><td>arrows + letters</td><td>click Start Game</td></tr><tr><td>Saves</td><td>none</td><td>session-only</td></tr><tr><td>Rounds</td><td>7 work days</td><td>git-style grid</td></tr></table>
<p>See <a href="/guides/desk-cat-coder-when.html">when to play</a>, <a href="/guides/desk-cat-coder-vs-alternatives.html">comparisons</a>, and <a href="/games/cat-typing-race.html">Cat Typing Race</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const whenEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Desk Cat Coder</b></h1>
<p><a href="/games/desk-cat-coder.html">Desk Cat Coder</a> fits short breaks where you want a stealth-plus-typing cat game - about ${SIZE} after Play, no install.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<h2><b>Stealth timing sessions</b></h2><p>You watch the owner, dash to the keyboard, and leave before they undo your lines.</p>
<h2><b>When you like keyboard spam score loops</b></h2><p>Letter keys drive the additions counter; distractions buy more typing windows.</p>
<h2><b>When to pick another game</b></h2><p>Want a pure typing duel vs an AI cat? Use <a href="/games/cat-typing-race.html">Cat Typing Race</a>. Want potion crafting instead? Use <a href="/games/potion-brew-shop.html">Potion Brew Shop</a>.</p>
<p>See <a href="/guides/how-to-play-desk-cat-coder.html">how to play</a> and <a href="/guides/desk-cat-coder-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const vsEn = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Desk Cat Coder vs Alternatives</b></h1>
<p><a href="/games/desk-cat-coder.html">Desk Cat Coder</a> is a stealth desk platformer with typing score loops. Compare it with two other free browser cat games on this site.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Primary input</th><th>Save data</th></tr>
<tr><td>Desk Cat Coder</td><td>${SIZE}</td><td>Arrows + letter keys</td><td>none (session)</td></tr>
<tr><td><a href="/games/cat-typing-race.html">Cat Typing Race</a></td><td>~28 KB</td><td>A-Z keyboard duel</td><td>session</td></tr>
<tr><td><a href="/games/wash-the-cat.html">Wash the Cat</a></td><td>~50 KB</td><td>Click valves/pipes</td><td>ftol:washthecat:lj</td></tr>
</table>
<p>Pick Desk Cat Coder for stealth timing plus typing. Pick Cat Typing Race for a head-to-head A-Z duel. Pick Wash the Cat for a pipe valve puzzle.</p>
<p>See <a href="/guides/how-to-play-desk-cat-coder.html">how to play</a> and <a href="/guides/desk-cat-coder-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`;

const guides = [
  { route: 'how-to-play-desk-cat-coder', slug: 'guideshowtoplaydeskcatcoder', enTitle: 'How to Play Desk Cat Coder - Step by Step', enDesc: 'How to play Desk Cat Coder: arrows, letter keys, owner distractions, seven work days, ~72 KB browser stealth platformer.', html: howToEn },
  { route: 'desk-cat-coder-when', slug: 'guidesdeskcatcoderwhen', enTitle: 'When to Play Desk Cat Coder', enDesc: 'When Desk Cat Coder fits: stealth desk timing, typing score loops, ~72 KB.', html: whenEn },
  { route: 'desk-cat-coder-vs-alternatives', slug: 'guidesdeskcatcodervsalternatives', enTitle: 'Desk Cat Coder vs Alternatives', enDesc: 'Compare Desk Cat Coder with Cat Typing Race and Wash the Cat - download size, input, saves.', html: vsEn },
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
    else if (g.route.startsWith('how-to-play')) cmsSlug = `guides${loc.prefix}howtoplaydeskcatcoder`;
    else if (g.route.endsWith('-when')) cmsSlug = `guides${loc.prefix}deskcatcoderwhen`;
    else cmsSlug = `guides${loc.prefix}deskcatcodervsalternatives`;

    const howTitles = {
      pt: ['Como jogar Desk Cat Coder', 'Como jogar Desk Cat Coder: furtividade no escritorio, teclado, 7 dias, ~72 KB.'],
      es: ['Como jugar Desk Cat Coder', 'Como jugar Desk Cat Coder: sigilo en el escritorio, teclado, 7 dias, ~72 KB.'],
      vi: ['Cach choi Desk Cat Coder', 'Huong dan Desk Cat Coder: len ban phim, 7 ngay, ~72 KB.'],
      id: ['Cara main Desk Cat Coder', 'Panduan Desk Cat Coder: stealth meja, keyboard, 7 hari, ~72 KB.'],
      de: ['Desk Cat Coder spielen', 'Desk Cat Coder spielen: Schreibtisch-Stealth, Tastatur, 7 Tage, ~72 KB.'],
    };
    const whenTitles = {
      pt: ['Quando jogar Desk Cat Coder', 'Quando Desk Cat Coder encaixa: stealth curto, ~72 KB.'],
      es: ['Cuando jugar Desk Cat Coder', 'Cuando jugar Desk Cat Coder: sigilo corto, ~72 KB.'],
      vi: ['Khi nao choi Desk Cat Coder', 'Khi nao choi Desk Cat Coder: stealth ngan, ~72 KB.'],
      id: ['Kapan main Desk Cat Coder', 'Kapan main Desk Cat Coder: stealth singkat, ~72 KB.'],
      de: ['Wann Desk Cat Coder spielen', 'Wann Desk Cat Coder spielen: kurze Stealth-Runden, ~72 KB.'],
    };
    const vsTitles = {
      pt: ['Desk Cat Coder vs alternativas', 'Compare Desk Cat Coder com Cat Typing Race e Wash the Cat.'],
      es: ['Desk Cat Coder vs alternativas', 'Compara Desk Cat Coder con Cat Typing Race y Wash the Cat.'],
      vi: ['Desk Cat Coder vs lua chon khac', 'So sanh Desk Cat Coder voi Cat Typing Race va Wash the Cat.'],
      id: ['Desk Cat Coder vs alternatif', 'Bandingkan Desk Cat Coder dengan Cat Typing Race dan Wash the Cat.'],
      de: ['Desk Cat Coder vs Alternativen', 'Desk Cat Coder vs Cat Typing Race und Wash the Cat vergleichen.'],
    };

    let title, desc;
    if (!loc.code) { title = g.enTitle; desc = g.enDesc; }
    else if (g.route.includes('how-to-play')) [title, desc] = howTitles[loc.code];
    else if (g.route.includes('when')) [title, desc] = whenTitles[loc.code];
    else [title, desc] = vsTitles[loc.code];

    cmsTxt(cmsSlug, 'BODYTITLE', title);
    cmsTxt(cmsSlug, 'BODYDESC', desc.length >= 110 ? desc : desc + ' Free browser stealth cat game on FreeToolOnline.');

    let bodyHtml = g.html;
    if (loc.code === 'de') {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/desk-cat-coder.html">Desk Cat Coder</a> laedt ein ${SIZE} Stealth-Schreibtisch-Spiel im iframe. Pfeile bewegen die Katze; Buchstaben tippen Code-Zeilen.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Sieben Arbeitstage, session-only (kein localStorage). Engine MIT (BlackCat_Hacker, JS13K 2025).</p>
<p><a href="${routePath}">Diese Sprachversion</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Spiele</a></p>
</div>`;
    } else if (loc.code) {
      bodyHtml = `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${title}</b></h1>
<p><a href="/games/desk-cat-coder.html">Desk Cat Coder</a> loads a ${SIZE} stealth desk platformer in an iframe. Arrow keys move; letter keys type lines at the PC.</p>
<p><time itemprop="dateReviewed" datetime="${DATE}">Last reviewed: ${DATE}</time></p>
<p>Seven work days, session-only (no localStorage). Engine MIT (BlackCat_Hacker, JS13K 2025).</p>
<p><a href="${routePath}">This locale guide</a> · <a href="/guides/${g.route}.html">EN</a> · <a href="/games.html">Games</a></p>
</div>`;
    }
    cmsHtml(cmsSlug, 'BODYHTML', bodyHtml);
  }
}

const pictogramBody = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-minipictogram-dcc-title svg-minipictogram-dcc-desc">
  <title id="svg-minipictogram-dcc-title">Desk Cat Coder</title>
  <desc id="svg-minipictogram-dcc-desc">Stealth desk cat at a keyboard platformer</desc>
  <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#1C1C1E" aria-hidden="true"/>
  <rect x="14" y="34" width="36" height="10" rx="2" fill="#7DAFA3"/>
  <rect x="18" y="28" width="20" height="8" rx="1" fill="#FFFFFF"/>
  <ellipse cx="40" cy="24" rx="7" ry="5" fill="#FFFFFF"/>
  <path d="M34 20 L36 14 L38 20 Z" fill="#FFFFFF"/>
  <path d="M40 20 L42 14 L44 20 Z" fill="#FFFFFF"/>
  <text x="32" y="57" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="7" font-weight="700" letter-spacing="0.5" fill="#FFFFFF">DCC</text>
</svg>`;
const hash8 = createHash('sha256').update(pictogramBody).digest('hex').slice(0, 8);
const picRel = `source/web/src/main/webapp/static/img/illustrations/mini-pictogram/deskcatcoder__${hash8}.svg`;
w(picRel, pictogramBody);
console.log('pictogram', picRel);

mkdirSync(SKILL, { recursive: true });
writeFileSync(join(SKILL, 'SKILL.md'), `---
name: tool-deskcatcoder
description: |
  Ground-truth for /games/desk-cat-coder.html. Hand-authored 2026-07-18
  (game-discovery-loop-runbook fire142) from Beanminchild/BlackCat_Hacker
  Minified_GameFile at static/games/desk-cat-coder/.
---

# tool-deskcatcoder - /games/desk-cat-coder.html

## Identity

- **Route**: /games/desk-cat-coder.html
- **Slug**: \`desk-cat-coder\` (CMS: \`deskcatcoder\`)
- **Cluster**: games
- **Aliases**: /desk-cat-coder.html

## Reader task

Guide a desk cat across shelves to a computer, type letter keys to ship lines while the owner is away, distract with desk items, and clear seven work-day rounds on a git-style contribution grid.

## Processing model

**client-side-only** - single-file HTML/JS canvas engine (~72 KB), same-origin iframe. No CDN, no analytics, no external fonts, no localStorage. Engine HTML is noindex; canonical URL is /games/desk-cat-coder.html. Main playfield is canvas#gameCanvas; title uses #startButton.

## License analysis

- Upstream: Beanminchild **BlackCat_Hacker**, js13kGames 2025, **MIT, Copyright (c) 2025 Zach End** (LICENSE vendored).
- Original stealth desk platformer; not a commercial franchise clone.
- Adaptations: noindex meta, start-screen rebrand to Desk Cat Coder, LICENSE + CREDITS shipped.
- Clean ELIGIBLE; no operator adjudication.

## Reader-benefit framing menu

- V1: Arrow Left/Right move; Arrow Up jumps on desk shelves.
- V2: Reach the computer when the owner is away; spam letter keys to add lines.
- V3: Owner sitting at the PC slowly undoes lines if you stay visible.
- V4: Push drinks, food, or desk objects with arrows to distract the owner.
- V5: Seven work-day rounds; each day ends with a score screen and Next Day.
- V6: A git-style grid fills from daily totals; ranks reflect total lines shipped.
- V7: Optional fedora checkbox on the title screen is cosmetic only.
- V8: About ${SIZE} after Play; session-only (no localStorage).
- V9: Click Start Game after the outer Play button loads the iframe.
- V10: Adapted from BlackCat_Hacker (MIT, JS13K 2025); ships LICENSE + CREDITS.

## Implemented features

- Canvas stealth platformer with owner AI and desk interactables.
- Letter-key typing score loop (+additions / -deletions UI).
- Seven-day campaign with end ranks and contribution squares.
- Title screen with Start Game (#startButton) and game-over / next-day overlays.

## Anti-claims

- Does NOT use a server backend, CDN, or fetch at runtime.
- Does NOT persist scores (no localStorage in this minified build).
- Is NOT the same game as Cat Typing Race (stealth desk vs A-Z duel).
- Is NOT a branded clone of a commercial franchise.
- Does NOT require touch controls; keyboard is required for play.

## claim_catalogue_status

verified
`, 'utf8');

console.log('fire142 scaffold complete');
