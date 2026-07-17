#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '../..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const REVIEW = '2026-07-17';

const guides = {
  howtoplay: {
    route: 'how-to-play-violence-town',
    slugBase: 'howtoplayviolencetown',
    titleEn: 'How to Play Violence Town - Step-by-Step Guide',
    descEn: 'Step-by-step guide to Violence Town: walk zones, use the action wheel, manage inventory, and autosave a turn-based browser RPG.',
    titles: {
      pt: 'Como Jogar Violence Town - Passo a Passo',
      es: 'Como Jugar Violence Town - Paso a Paso',
      vi: 'Cach choi Violence Town - tung buoc',
      id: 'Cara Main Violence Town - Langkah demi Langkah',
      de: 'Violence Town spielen - Schritt fuer Schritt',
    },
    descs: {
      pt: 'Guia passo a passo de Violence Town: ande pelas zonas, use a roda de acao, gerencie inventario e autosalve um RPG por turnos no navegador.',
      es: 'Guia paso a paso de Violence Town: recorre zonas, usa la rueda de accion, gestiona inventario y guarda un RPG por turnos en el navegador.',
      vi: 'Huong dan tung buoc Violence Town: di chuyen vung, dung banh xe hanh dong, quan ly tui do va tu luu RPG theo luot tren trinh duyet.',
      id: 'Panduan langkah demi langkah Violence Town: jelajahi zona, gunakan roda aksi, kelola inventori, dan autosave RPG giliran di browser.',
      de: 'Schritt-fuer-Schritt-Anleitung zu Violence Town: Zonen erkunden, Aktionsrad nutzen, Inventar verwalten und rundenbasiertes Browser-RPG autospeichern.',
    },
    htmlEn: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Violence Town - Step by Step</b></h1>
<p>The <a href="/games/violence-town.html">Violence Town</a> page loads a ~1.1 MB turn-based 2D RPG in an iframe. You deliver burgers for Borgir, explore eight overworld zones plus interiors, fight with a radial action wheel, and autosave locally. Press Play to start.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>WASD or arrows move (hold to keep walking); tap/click the ground to path; Space opens the action wheel; 1-9 pick inventory; T wait; Esc cancel; ? help; L log; E examine; Tab Remoticon. Autosaves to ftol:violencetown:save; settings use ftol:violencetown:settings.</b></p></div>
<h2><b>Step 1 - press Play and start or continue</b></h2><p>Press Play on the game page to inject the iframe (~1.1 MB). On the splash, press GAME START or Space for a new run, or CONTINUE when a namespaced save exists. The engine is Violencetown by Caelan Gander (MIT); LICENSE and CREDITS ship beside the game files.</p>
<h2><b>Step 2 - move and interact</b></h2><p>Walk one tile with WASD or arrows (hold to keep going) or tap/click the ground to path around buildings. Tap/click a target to walk over and do the obvious thing (Take / Talk / Attack). Long-press, right-click, or F opens the full verb list for who you face.</p>
<h2><b>Step 3 - fight with the action wheel</b></h2><p>Press Space anywhere to open the radial action wheel pre-aimed at the nearest enemy. Double-tap Space repeats your last action. On the wheel, Up/Down pick a ring (action / item / direction), Left/Right spin, Space fires, Esc backs out. On touch, tap ✦ to open the wheel.</p>
<h2><b>Step 4 - inventory and Remoticon</b></h2><p>Press 1 through 9 to select a hotbar slot; Space opens Use / Smash / Give (throwing is on the wheel). Tab opens the Remoticon (ITEMS / GEAR / QUESTS / MAP); [ ] switch tabs; C / J / M jump to GEAR / QUESTS / MAP. On touch, tap ▤ for Remoticon.</p>
<h2><b>Step 5 - save, options, and zones</b></h2><p>Autosaves write to ftol:violencetown:save with backup and staging keys. Options (music, SFX, mute, reduce motion, fullscreen, wheel-open mode) persist under ftol:violencetown:settings. Eight overworld zones (Town, Downtown, Factory, Sewer, Carnival, Graveyard, Wilderness, Canyon) connect on the world map.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download size</td><td>~1.1 MB</td><td>HTML + JS + maps in a same-origin iframe</td></tr><tr><td>Input</td><td>Keyboard + touch</td><td>Space wheel; 1-9 inventory; Tab Remoticon</td></tr><tr><td>Combat</td><td>Turn-based</td><td>Radial action wheel; T waits one turn</td></tr><tr><td>Saves</td><td>localStorage</td><td>ftol:violencetown:save (+ .bak / .tmp)</td></tr><tr><td>Server calls</td><td>0</td><td>Client-side Canvas 2D + Web Audio</td></tr></table>
<p>See <a href="/guides/violence-town-when.html">when to play it</a>, <a href="/guides/violence-town-vs-alternatives.html">how it compares</a>, and <a href="/games/pixel-realm-rpg.html">Pixel Realm RPG</a> on this site.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
  },
  when: {
    route: 'violence-town-when',
    slugBase: 'violencetownwhen',
    titleEn: 'When to Play Violence Town',
    descEn: 'When Violence Town fits: turn-based browser RPG sessions, local autosave, keyboard or touch, and a ~1.1 MB client-side download.',
    titles: {
      pt: 'Quando Jogar Violence Town',
      es: 'Cuando Jugar Violence Town',
      vi: 'Khi nao choi Violence Town',
      id: 'Kapan Main Violence Town',
      de: 'Wann Violence Town spielen',
    },
    descs: {
      pt: 'Quando Violence Town encaixa: sessoes de RPG por turnos no navegador, autosave local, teclado ou toque e download client-side de ~1,1 MB.',
      es: 'Cuando encaja Violence Town: sesiones de RPG por turnos en el navegador, autoguardado local, teclado o tactil y descarga client-side de ~1,1 MB.',
      vi: 'Khi nao Violence Town phu hop: phien RPG theo luot tren trinh duyet, tu luu cuc bo, ban phim hoac cam ung va tai ~1,1 MB phia client.',
      id: 'Kapan Violence Town cocok: sesi RPG giliran di browser, autosave lokal, keyboard atau sentuh, unduhan client-side ~1,1 MB.',
      de: 'Wann Violence Town passt: rundenbasierte Browser-RPG-Sessions, lokales Autosave, Tastatur oder Touch und ~1,1 MB Client-Download.',
    },
    htmlEn: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Violence Town</b></h1>
<p><a href="/games/violence-town.html">Violence Town</a> is a turn-based 2D RPG that runs in a browser tab with local autosave and no account. It fits a 20 - 60 minute session where you explore hand-authored zones, manage inventory, and fight with a radial action wheel. Here is when it is the right pick.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>When you want turn-based exploration, not twitch combat</b></h2><p>Movement and fights advance in turns. Space opens a radial action wheel instead of real-time aiming. Pick Violence Town when you want to read the log, examine objects, and plan the next tile.</p>
<h2><b>When local continue matters</b></h2><p>Autosaves land in ftol:violencetown:save with backup and staging keys; CONTINUE on the splash resumes your run. Settings (music, SFX, reduce motion, wheel-open mode) persist separately under ftol:violencetown:settings. Nothing uploads to a server.</p>
<h2><b>When you have keyboard or touch</b></h2><p>Desktop players can use WASD, Space, 1-9, Tab, and ? for help. Touch players get tap-to-path movement, tap targets, and on-screen ✦ / ☰ / ▤ buttons. Both paths ship in the same build.</p>
<h2><b>When privacy and a modest download matter</b></h2><p>Everything runs client-side after a one-time ~1.1 MB load: no sign-in, no multiplayer, and zero server calls during play. Service worker and Google Fonts CDN usage were removed for this iframe build.</p>
<h2><b>When it is not the right pick</b></h2><p>Skip it if you want a tiny arcade session with no saves (try <a href="/games/void-trader.html">Void Trader</a> at ~50 KB permadeath), or if you need a real-time action RPG. For a larger tile-RPG with fifteen maps at ~3.8 MB, see <a href="/games/pixel-realm-rpg.html">Pixel Realm RPG</a>.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Question</th><th>Answer</th></tr><tr><td>Best device</td><td>Desktop keyboard or touch phone/tablet</td></tr><tr><td>Session length</td><td>~20 - 60 min (autosave between visits)</td></tr><tr><td>Needs internet</td><td>Only the one-time ~1.1 MB load, then cached</td></tr><tr><td>Account / cloud saves</td><td>None; localStorage only on this device</td></tr><tr><td>Multiplayer</td><td>No (single-player only)</td></tr></table>
<p>See <a href="/guides/how-to-play-violence-town.html">how to play step by step</a> and <a href="/guides/violence-town-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
  },
  vs: {
    route: 'violence-town-vs-alternatives',
    slugBase: 'violencetownvsalternatives',
    titleEn: 'Violence Town vs Other Browser RPGs',
    descEn: 'Compare Violence Town (~1.1 MB, turn-based, local save) with Pixel Realm RPG, Void Trader, and installed RPG apps.',
    titles: {
      pt: 'Violence Town vs Outros RPGs de Browser',
      es: 'Violence Town vs Otros RPG de Navegador',
      vi: 'Violence Town vs RPG trinh duyet khac',
      id: 'Violence Town vs RPG Browser Lain',
      de: 'Violence Town vs andere Browser-RPGs',
    },
    descs: {
      pt: 'Compare Violence Town (~1,1 MB, por turnos, save local) com Pixel Realm RPG, Void Trader e apps RPG instalados.',
      es: 'Compara Violence Town (~1,1 MB, por turnos, guardado local) con Pixel Realm RPG, Void Trader y apps RPG instaladas.',
      vi: 'So sanh Violence Town (~1,1 MB, theo luot, luu cuc bo) voi Pixel Realm RPG, Void Trader va app RPG cai dat.',
      id: 'Bandingkan Violence Town (~1,1 MB, giliran, save lokal) dengan Pixel Realm RPG, Void Trader, dan app RPG terinstal.',
      de: 'Vergleiche Violence Town (~1,1 MB, rundenbasiert, lokaler Save) mit Pixel Realm RPG, Void Trader und installierten RPG-Apps.',
    },
    htmlEn: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Violence Town vs Other Browser RPGs</b></h1>
<p><a href="/games/violence-town.html">Violence Town</a> is a turn-based 2D RPG that runs in the browser with local autosave (~1.1 MB, Canvas 2D). Its loop is explore hand-authored zones, fight with a radial action wheel, and continue from ftol:violencetown:save. Here is how it compares with other games on this site and with installed alternatives.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>vs Pixel Realm RPG (top-down tile RPG)</b></h2><p><a href="/games/pixel-realm-rpg.html">Pixel Realm RPG</a> is a real-time-feeling top-down tile RPG (~3.8 MB) with fifteen CSV/JSON maps, equipment panels, and save key ftol:pixelrealmrpg:jsrpg_save. Violence Town is smaller (~1.1 MB vs ~3.8 MB), turn-based with a radial action wheel, and autosaves under ftol:violencetown:save. Pick Pixel Realm for larger map count and gear UI depth; pick Violence Town for tick combat and the action wheel on a lighter download.</p>
<h2><b>vs Void Trader (space roguelike)</b></h2><p><a href="/games/void-trader.html">Void Trader</a> is a real-time space trading roguelike (~50 KB, Canvas 2D) with permadeath and no localStorage at all. Violence Town is about twenty times larger (~1.1 MB vs ~50 KB) but adds town exploration, inventory, quests, and autosave continue. Pick Void Trader for a quick one-life space run; pick Violence Town when you want a saved RPG session in a hand-authored town.</p>
<h2><b>vs installed RPG apps</b></h2><p>Native RPG apps often ship large campaigns, 3D art, cloud saves, and sometimes multiplayer, but they need a store download and often an account. Violence Town trades scope for zero friction: one ~1.1 MB load in a tab, no account, localStorage only on this device, and no service worker in this build.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Feature</th><th>Violence Town</th><th>Pixel Realm RPG</th><th>Void Trader</th></tr><tr><td>Download</td><td>~1.1 MB</td><td>~3.8 MB</td><td>~50 KB</td></tr><tr><td>Combat pace</td><td>Turn-based / tick</td><td>Real-time tile</td><td>Real-time space</td></tr><tr><td>Saves</td><td>ftol:violencetown:save</td><td>ftol:pixelrealmrpg:jsrpg_save</td><td>None (permadeath)</td></tr><tr><td>Distinctive UI</td><td>Radial action wheel</td><td>Inventory / gear panels</td><td>Dock / trade HUD</td></tr><tr><td>Multiplayer</td><td>No</td><td>No</td><td>No</td></tr><tr><td>Account</td><td>None</td><td>None</td><td>None</td></tr></table>
<p>See <a href="/guides/how-to-play-violence-town.html">how to play step by step</a>, <a href="/guides/violence-town-when.html">when to play it</a>, and <a href="/games/pixel-realm-rpg.html">Pixel Realm RPG</a> on this site.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
  },
};

const localeHtml = {
  pt: {
    howtoplay: guides.howtoplay.htmlEn
      .replace('How to Play Violence Town - Step by Step', 'Como Jogar Violence Town - Passo a Passo')
      .replace('The <a href="/games/violence-town.html">Violence Town</a> page loads', 'A pagina do <a href="/games/violence-town.html">Violence Town</a> carrega')
      .replace('Press Play to start.', 'Aperte Play para comecar.')
      .replace('Press Play on the game page', 'Aperte Play na pagina do jogo')
      .replace('Step 1 - press Play', 'Passo 1 - apertar Play')
      .replace('Step 2 - move', 'Passo 2 - mover')
      .replace('Step 3 - fight', 'Passo 3 - lutar')
      .replace('Step 4 - inventory', 'Passo 4 - inventario')
      .replace('Step 5 - save', 'Passo 5 - salvar')
      .replace('when to play it', 'quando jogar')
      .replace('how it compares', 'comparacoes'),
    when: guides.when.htmlEn
      .replace('When to Play Violence Town', 'Quando Jogar Violence Town')
      .replace('Here is when it is the right pick.', 'Veja quando e a escolha certa.')
      .replace('When you want', 'Quando voce quer')
      .replace('When local continue', 'Quando continue local')
      .replace('When you have keyboard', 'Quando voce tem teclado')
      .replace('When privacy', 'Quando privacidade')
      .replace('When it is not', 'Quando nao e')
      .replace('how to play step by step', 'como jogar passo a passo'),
    vs: guides.vs.htmlEn
      .replace('Violence Town vs Other Browser RPGs', 'Violence Town vs Outros RPGs de Browser')
      .replace('Here is how it compares', 'Veja como ele se compara')
      .replace('vs Pixel Realm RPG', 'vs Pixel Realm RPG')
      .replace('vs Void Trader', 'vs Void Trader')
      .replace('vs installed RPG apps', 'vs apps RPG instalados')
      .replace('how to play step by step', 'como jogar passo a passo')
      .replace('when to play it', 'quando jogar'),
  },
  es: {
    howtoplay: guides.howtoplay.htmlEn
      .replace('How to Play Violence Town - Step by Step', 'Como Jugar Violence Town - Paso a Paso')
      .replace('The <a href="/games/violence-town.html">Violence Town</a> page loads', 'La pagina de <a href="/games/violence-town.html">Violence Town</a> carga')
      .replace('Press Play to start.', 'Pulsa Play para empezar.')
      .replace('Press Play on the game page', 'Pulsa Play en la pagina del juego')
      .replace('Step 1 - press Play', 'Paso 1 - pulsar Play')
      .replace('Step 2 - move', 'Paso 2 - moverte')
      .replace('Step 3 - fight', 'Paso 3 - luchar')
      .replace('Step 4 - inventory', 'Paso 4 - inventario')
      .replace('Step 5 - save', 'Paso 5 - guardar')
      .replace('when to play it', 'cuando jugarlo')
      .replace('how it compares', 'comparaciones'),
    when: guides.when.htmlEn
      .replace('When to Play Violence Town', 'Cuando Jugar Violence Town')
      .replace('Here is when it is the right pick.', 'Aqui esta cuando es la eleccion correcta.')
      .replace('When you want', 'Cuando quieres')
      .replace('When local continue', 'Cuando importa continuar local')
      .replace('When you have keyboard', 'Cuando tienes teclado')
      .replace('When privacy', 'Cuando importa la privacidad')
      .replace('When it is not', 'Cuando no es')
      .replace('how to play step by step', 'como jugar paso a paso'),
    vs: guides.vs.htmlEn
      .replace('Violence Town vs Other Browser RPGs', 'Violence Town vs Otros RPG de Navegador')
      .replace('Here is how it compares', 'Asi se compara')
      .replace('vs installed RPG apps', 'vs apps RPG instaladas')
      .replace('how to play step by step', 'como jugar paso a paso')
      .replace('when to play it', 'cuando jugarlo'),
  },
  vi: {
    howtoplay: guides.howtoplay.htmlEn
      .replace('How to Play Violence Town - Step by Step', 'Cach choi Violence Town - tung buoc')
      .replace('The <a href="/games/violence-town.html">Violence Town</a> page loads', 'Trang <a href="/games/violence-town.html">Violence Town</a> tai')
      .replace('Press Play to start.', 'Nhan Play de bat dau.')
      .replace('Press Play on the game page', 'Nhan Play tren trang game')
      .replace('Step 1 - press Play', 'Buoc 1 - nhan Play')
      .replace('Step 2 - move', 'Buoc 2 - di chuyen')
      .replace('Step 3 - fight', 'Buoc 3 - chien dau')
      .replace('Step 4 - inventory', 'Buoc 4 - tui do')
      .replace('Step 5 - save', 'Buoc 5 - luu')
      .replace('when to play it', 'khi nao choi')
      .replace('how it compares', 'so sanh'),
    when: guides.when.htmlEn
      .replace('When to Play Violence Town', 'Khi nao choi Violence Town')
      .replace('Here is when it is the right pick.', 'Day la khi no la lua chon dung.')
      .replace('When you want', 'Khi ban muon')
      .replace('When local continue', 'Khi can tiep tuc cuc bo')
      .replace('When you have keyboard', 'Khi co ban phim')
      .replace('When privacy', 'Khi can rieng tu')
      .replace('When it is not', 'Khi khong phu hop')
      .replace('how to play step by step', 'huong dan tung buoc'),
    vs: guides.vs.htmlEn
      .replace('Violence Town vs Other Browser RPGs', 'Violence Town vs RPG trinh duyet khac')
      .replace('Here is how it compares', 'Day la cach so sanh')
      .replace('vs installed RPG apps', 'vs app RPG cai dat')
      .replace('how to play step by step', 'huong dan tung buoc')
      .replace('when to play it', 'khi nao choi'),
  },
  id: {
    howtoplay: guides.howtoplay.htmlEn
      .replace('How to Play Violence Town - Step by Step', 'Cara Main Violence Town - Langkah demi Langkah')
      .replace('The <a href="/games/violence-town.html">Violence Town</a> page loads', 'Halaman <a href="/games/violence-town.html">Violence Town</a> memuat')
      .replace('Press Play to start.', 'Tekan Play untuk mulai.')
      .replace('Press Play on the game page', 'Tekan Play di halaman game')
      .replace('Step 1 - press Play', 'Langkah 1 - tekan Play')
      .replace('Step 2 - move', 'Langkah 2 - bergerak')
      .replace('Step 3 - fight', 'Langkah 3 - bertarung')
      .replace('Step 4 - inventory', 'Langkah 4 - inventori')
      .replace('Step 5 - save', 'Langkah 5 - simpan')
      .replace('when to play it', 'kapan main')
      .replace('how it compares', 'perbandingan'),
    when: guides.when.htmlEn
      .replace('When to Play Violence Town', 'Kapan Main Violence Town')
      .replace('Here is when it is the right pick.', 'Berikut kapan ini pilihan yang tepat.')
      .replace('When you want', 'Saat Anda ingin')
      .replace('When local continue', 'Saat lanjut lokal penting')
      .replace('When you have keyboard', 'Saat punya keyboard')
      .replace('When privacy', 'Saat privasi penting')
      .replace('When it is not', 'Saat bukan pilihan')
      .replace('how to play step by step', 'cara main langkah demi langkah'),
    vs: guides.vs.htmlEn
      .replace('Violence Town vs Other Browser RPGs', 'Violence Town vs RPG Browser Lain')
      .replace('Here is how it compares', 'Berikut perbandingannya')
      .replace('vs installed RPG apps', 'vs app RPG terinstal')
      .replace('how to play step by step', 'cara main langkah demi langkah')
      .replace('when to play it', 'kapan main'),
  },
  de: {
    howtoplay: guides.howtoplay.htmlEn
      .replace('How to Play Violence Town - Step by Step', 'Violence Town spielen - Schritt fuer Schritt')
      .replace('The <a href="/games/violence-town.html">Violence Town</a> page loads', 'Die Seite <a href="/games/violence-town.html">Violence Town</a> laedt')
      .replace('Press Play to start.', 'Druecken Sie Play zum Start.')
      .replace('Press Play on the game page', 'Druecken Sie Play auf der Spieleseite')
      .replace('Step 1 - press Play', 'Schritt 1 - Play druecken')
      .replace('Step 2 - move', 'Schritt 2 - bewegen')
      .replace('Step 3 - fight', 'Schritt 3 - kaempfen')
      .replace('Step 4 - inventory', 'Schritt 4 - Inventar')
      .replace('Step 5 - save', 'Schritt 5 - speichern')
      .replace('when to play it', 'wann spielen')
      .replace('how it compares', 'Vergleiche'),
    when: guides.when.htmlEn
      .replace('When to Play Violence Town', 'Wann Violence Town spielen')
      .replace('Here is when it is the right pick.', 'Hier ist, wann es die richtige Wahl ist.')
      .replace('When you want', 'Wenn Sie')
      .replace('When local continue', 'Wenn lokales Weiterspielen')
      .replace('When you have keyboard', 'Wenn Sie Tastatur')
      .replace('When privacy', 'Wenn Datenschutz')
      .replace('When it is not', 'Wenn es nicht passt')
      .replace('how to play step by step', 'Schritt-fuer-Schritt-Anleitung'),
    vs: guides.vs.htmlEn
      .replace('Violence Town vs Other Browser RPGs', 'Violence Town vs andere Browser-RPGs')
      .replace('Here is how it compares', 'So vergleicht es sich')
      .replace('vs installed RPG apps', 'vs installierte RPG-Apps')
      .replace('how to play step by step', 'Schritt-fuer-Schritt-Anleitung')
      .replace('when to play it', 'wann spielen'),
  },
};

const jspTpl = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<freetoolonline:page browserTitle='\${pageBodyTitle}' description='\${pageBodyDesc}'>
\t<freetoolonline:loading/>
\t<!-- BODYHTML -->
\t\${pageBodyHTML}
</freetoolonline:page>
`;

function writeGuide(key, locale) {
  const g = guides[key];
  const slug = locale === 'en' ? `guides${g.slugBase}` : `guides${locale}${g.slugBase}`;
  const html = locale === 'en' ? g.htmlEn : localeHtml[locale][key];
  const title = locale === 'en' ? g.titleEn : g.titles[locale];
  const desc = locale === 'en' ? g.descEn : g.descs[locale];

  writeFileSync(join(CMS, `BODYHTML${slug}.html`), html + '\n');
  writeFileSync(join(CMS, `BODYTITLE${slug}.txt`), title + '\n');
  writeFileSync(join(CMS, `BODYDESC${slug}.txt`), desc + '\n');

  const route = locale === 'en' ? g.route : `${locale}/${g.route}`;
  const jspDir = locale === 'en' ? JSP : join(JSP, locale);
  mkdirSync(jspDir, { recursive: true });
  writeFileSync(join(jspDir, `${g.route}.jsp`), jspTpl);
}

for (const key of Object.keys(guides)) {
  writeGuide(key, 'en');
  for (const loc of ['pt', 'es', 'vi', 'id', 'de']) {
    writeGuide(key, loc);
  }
}

console.log('Generated Violence Town guide CMS + JSP wrappers (18 pages)');
