#!/usr/bin/env node
/**
 * new-tool-discovery-loop fire305: companion guides for hover-racing
 * (3 angles x EN + pt/es/vi/id/de). Claims ONLY from tool-hoverracing/SKILL.md.
 * Peer sizes: retro-highway-racer (~34 KB) + neon-circuit-racer (~43 KB) from their SKILL.md.
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');
const REVIEW = '2026-07-18';

const jspTpl = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
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

const guides = {
  howtoplay: {
    route: 'how-to-play-hover-racing',
    slugBase: 'howtoplayhoverracing',
    titleEn: 'How to Play Hover Racing - Step by Step',
    descEn: 'How to play Hover Racing: press Play, pick controls and quality, air-brake a ~11 MB WebGL city track, beat your best lap with a ghost. Free browser racer on FreeToolOnline.',
    titles: {
      pt: 'Como Jogar Hover Racing - Passo a Passo',
      es: 'Como Jugar Hover Racing - Paso a Paso',
      vi: 'Cach choi Hover Racing - tung buoc',
      id: 'Cara Main Hover Racing - Langkah demi Langkah',
      de: 'Hover Racing spielen - Schritt fuer Schritt',
    },
    descs: {
      pt: 'Como jogar Hover Racing: aperte Play, escolha controles e qualidade, use air-brakes numa pista WebGL ~11 MB e bata sua melhor volta com ghost.',
      es: 'Como jugar Hover Racing: pulsa Play, elige controles y calidad, usa air-brakes en una pista WebGL ~11 MB y supera tu mejor vuelta con fantasma.',
      vi: 'Cach choi Hover Racing: nhan Play, chon dieu khien va chat luong, air-brake duong dua WebGL ~11 MB, pha ky luc voi ghost.',
      id: 'Cara main Hover Racing: tekan Play, pilih kontrol dan kualitas, air-brake trek WebGL ~11 MB, kalahkan best lap dengan ghost.',
      de: 'Hover Racing spielen: Play druecken, Steuerung und Qualitaet waehlen, Air-Brakes auf ~11 MB WebGL-Strecke, Bestzeit mit Ghost schlagen.',
    },
  },
  when: {
    route: 'hover-racing-when',
    slugBase: 'hoverracingwhen',
    titleEn: 'When to Play Hover Racing',
    descEn: 'When Hover Racing fits: WebGL time-attack laps, ~11 MB once, keyboard touch or gamepad, best lap + ghost in this browser. Free neon racer on FreeToolOnline.',
    titles: {
      pt: 'Quando Jogar Hover Racing',
      es: 'Cuando Jugar Hover Racing',
      vi: 'Khi nao choi Hover Racing',
      id: 'Kapan Main Hover Racing',
      de: 'Wann Hover Racing spielen',
    },
    descs: {
      pt: 'Quando Hover Racing encaixa: voltas time-attack WebGL, ~11 MB uma vez, teclado toque ou gamepad, melhor volta + ghost neste navegador.',
      es: 'Cuando encaja Hover Racing: vueltas time-attack WebGL, ~11 MB una vez, teclado tactil o mando, mejor vuelta + fantasma en este navegador.',
      vi: 'Khi nao Hover Racing phu hop: vong dua time-attack WebGL, ~11 MB mot lan, ban phim cam ung hoac gamepad, best lap + ghost tren trinh duyet nay.',
      id: 'Kapan Hover Racing cocok: putaran time-attack WebGL, ~11 MB sekali, keyboard sentuh atau gamepad, best lap + ghost di browser ini.',
      de: 'Wann Hover Racing passt: WebGL-Time-Attack-Runden, ~11 MB einmal, Tastatur Touch oder Gamepad, Bestzeit + Ghost in diesem Browser.',
    },
  },
  vs: {
    route: 'hover-racing-vs-alternatives',
    slugBase: 'hoverracingvsalternatives',
    titleEn: 'Hover Racing vs Alternatives',
    descEn: 'Compare Hover Racing (~11 MB WebGL, best lap + ghost) with Retro Highway Racer (~34 KB) and Neon Circuit Racer (~43 KB). Free browser racers on FreeToolOnline.',
    titles: {
      pt: 'Hover Racing vs Alternativas',
      es: 'Hover Racing vs Alternativas',
      vi: 'Hover Racing vs lua chon khac',
      id: 'Hover Racing vs Alternatif',
      de: 'Hover Racing vs Alternativen',
    },
    descs: {
      pt: 'Compare Hover Racing (~11 MB WebGL, melhor volta + ghost) com Retro Highway Racer (~34 KB) e Neon Circuit Racer (~43 KB).',
      es: 'Compara Hover Racing (~11 MB WebGL, mejor vuelta + fantasma) con Retro Highway Racer (~34 KB) y Neon Circuit Racer (~43 KB).',
      vi: 'So sanh Hover Racing (~11 MB WebGL, best lap + ghost) voi Retro Highway Racer (~34 KB) va Neon Circuit Racer (~43 KB).',
      id: 'Bandingkan Hover Racing (~11 MB WebGL, best lap + ghost) dengan Retro Highway Racer (~34 KB) dan Neon Circuit Racer (~43 KB).',
      de: 'Vergleiche Hover Racing (~11 MB WebGL, Bestzeit + Ghost) mit Retro Highway Racer (~34 KB) und Neon Circuit Racer (~43 KB).',
    },
  },
};

guides.howtoplay.html = {
  en: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Hover Racing - Step by Step</b></h1>
<p>The <a href="/games/hover-racing.html">Hover Racing</a> page loads a ~11 MB anti-gravity time-attack racer in an iframe. Pilot a hover ship down a neon 3D city track, feather the air-brakes, and beat the best lap saved in this browser. Press Play to start.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Keyboard: arrows steer, A/Q and D/E air-brake. Or pick touch or gamepad on the start menu. Needs WebGL. No mouse steering.</b></p></div>
<h2><b>Step 1 - press Play on this page</b></h2><p>Press Play to inject the iframe (~11 MB: engine, Cityscape track, ship, textures, ogg SFX). The start menu appears over the title art. The engine is HexGL by Thibaut Despoulain (BKcore); LICENSE and credits ship beside the game files.</p>
<h2><b>Step 2 - pick controls, quality, and HUD</b></h2><p>On the start menu choose keyboard, on-screen touch, or a standard gamepad. Set quality to low / mid / high / very high to match your hardware. Toggle the HUD (speed + shield) if you want a clean view.</p>
<h2><b>Step 3 - start and drive</b></h2><p>Press Start. Accelerate down the straights; hit boost pads for speed. Feather left and right air-brakes (A/Q and D/E on keyboard) through hairpins - the ship drifts wide if you do not. Walls bleed speed; a hard enough hit destroys the ship and ends the run.</p>
<h2><b>Step 4 - finish the lap and beat your ghost</b></h2><p>Pass checkpoints and finish the Cityscape lap. Your best time is stored in this browser, along with a ghost replay of that best run so you can race it next time. No accounts or online leaderboards.</p>
<h2><b>Step 5 - credits and replay</b></h2><p>Open Credits on the menu for the full HexGL team list. Use replay mode to race your saved ghost. One track and one ship only - there is no track or ship select.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>~11 MB</td><td>Same-origin iframe; cached after first load</td></tr><tr><td>Renderer</td><td>WebGL (Three.js)</td><td>Non-WebGL devices see a plain notice</td></tr><tr><td>Input</td><td>Keyboard / touch / gamepad</td><td>No mouse steering; no tilt menu option</td></tr><tr><td>Track</td><td>Cityscape</td><td>One track, one ship</td></tr><tr><td>Saves</td><td>localStorage</td><td>Best lap + ghost replay keys</td></tr></table>
<p>See <a href="/guides/hover-racing-when.html">when to play</a>, <a href="/guides/hover-racing-vs-alternatives.html">comparisons</a>, and <a href="/games/retro-highway-racer.html">Retro Highway Racer</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
  pt: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Como Jogar Hover Racing - Passo a Passo</b></h1>
<p>A pagina <a href="/games/hover-racing.html">Hover Racing</a> carrega um racer anti-gravidade ~11 MB no iframe. Pilote uma nave numa pista neon 3D, use air-brakes e bata a melhor volta neste navegador. Aperte Play.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Teclado: setas dirigem, A/Q e D/E air-brake. Ou toque / gamepad no menu. Precisa de WebGL. Sem mouse.</b></p></div>
<h2><b>Passo 1 - apertar Play</b></h2><p>Play injeta o iframe (~11 MB). Menu sobre a arte de titulo. Engine HexGL (Thibaut Despoulain / BKcore); LICENSE e creditos ao lado.</p>
<h2><b>Passo 2 - controles, qualidade, HUD</b></h2><p>Escolha teclado, toque ou gamepad. Qualidade low / mid / high / very high. Ligue ou desligue o HUD (velocidade + escudo).</p>
<h2><b>Passo 3 - dirigir</b></h2><p>Start. Use boost pads nas retas. Air-brakes nas curvas. Paredes tiram velocidade; impacto forte destroi a nave e acaba a corrida.</p>
<h2><b>Passo 4 - voltas e ghost</b></h2><p>Termine a volta Cityscape. Melhor tempo e ghost ficam neste navegador. Sem contas ou ranking online.</p>
<h2><b>Passo 5 - creditos</b></h2><p>Credits lista o time HexGL. Replay corre contra o ghost. Uma pista, uma nave.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Item</th><th>Valor</th><th>Notas</th></tr><tr><td>Download</td><td>~11 MB</td><td>Iframe same-origin</td></tr><tr><td>Renderer</td><td>WebGL</td><td>Sem WebGL = aviso simples</td></tr><tr><td>Input</td><td>Teclado / toque / gamepad</td><td>Sem mouse</td></tr><tr><td>Pista</td><td>Cityscape</td><td>Uma pista</td></tr><tr><td>Saves</td><td>localStorage</td><td>Melhor volta + ghost</td></tr></table>
<p>Veja <a href="/guides/pt/hover-racing-when.html">quando jogar</a>, <a href="/guides/pt/hover-racing-vs-alternatives.html">comparacoes</a> e <a href="/games/retro-highway-racer.html">Retro Highway Racer</a>.</p>
<p><a href="/games.html">&larr; Voltar aos jogos</a></p>
</div>`,
  es: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Como Jugar Hover Racing - Paso a Paso</b></h1>
<p>La pagina <a href="/games/hover-racing.html">Hover Racing</a> carga un racer antigravedad ~11 MB en un iframe. Pilota una nave por una pista neon 3D, usa air-brakes y supera la mejor vuelta en este navegador. Pulsa Play.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Teclado: flechas dirigen, A/Q y D/E air-brake. O tactil / mando en el menu. Requiere WebGL. Sin raton.</b></p></div>
<h2><b>Paso 1 - pulsar Play</b></h2><p>Play inyecta el iframe (~11 MB). Menu sobre el arte. Motor HexGL (Thibaut Despoulain / BKcore); LICENSE y creditos junto a los archivos.</p>
<h2><b>Paso 2 - controles, calidad, HUD</b></h2><p>Elige teclado, tactil o mando. Calidad low / mid / high / very high. Activa o desactiva el HUD (velocidad + escudo).</p>
<h2><b>Paso 3 - conducir</b></h2><p>Start. Boost pads en rectas. Air-brakes en curvas. Las paredes restan velocidad; un golpe fuerte destruye la nave.</p>
<h2><b>Paso 4 - vuelta y fantasma</b></h2><p>Termina la vuelta Cityscape. Mejor tiempo y fantasma quedan en este navegador. Sin cuentas ni ranking online.</p>
<h2><b>Paso 5 - creditos</b></h2><p>Credits lista el equipo HexGL. Replay corre contra el fantasma. Una pista, una nave.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Dato</th><th>Valor</th><th>Notas</th></tr><tr><td>Descarga</td><td>~11 MB</td><td>Iframe same-origin</td></tr><tr><td>Renderer</td><td>WebGL</td><td>Sin WebGL = aviso</td></tr><tr><td>Entrada</td><td>Teclado / tactil / mando</td><td>Sin raton</td></tr><tr><td>Pista</td><td>Cityscape</td><td>Una pista</td></tr><tr><td>Guardados</td><td>localStorage</td><td>Mejor vuelta + fantasma</td></tr></table>
<p>Ver <a href="/guides/es/hover-racing-when.html">cuando jugar</a>, <a href="/guides/es/hover-racing-vs-alternatives.html">comparaciones</a> y <a href="/games/retro-highway-racer.html">Retro Highway Racer</a>.</p>
<p><a href="/games.html">&larr; Volver a juegos</a></p>
</div>`,
  vi: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Cach choi Hover Racing - tung buoc</b></h1>
<p>Trang <a href="/games/hover-racing.html">Hover Racing</a> tai racer chong trong luc ~11 MB trong iframe. Lai tau hover tren duong neon 3D, dung air-brake, pha best lap luu tren trinh duyet. Nhan Play.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Ban phim: mui ten lai, A/Q va D/E air-brake. Hoac cam ung / gamepad tren menu. Can WebGL. Khong chuot.</b></p></div>
<h2><b>Buoc 1 - nhan Play</b></h2><p>Play chen iframe (~11 MB). Menu tren anh tieu de. Engine HexGL (Thibaut Despoulain / BKcore); LICENSE va credits di kem.</p>
<h2><b>Buoc 2 - dieu khien, chat luong, HUD</b></h2><p>Chon ban phim, cam ung hoac gamepad. Chat luong low / mid / high / very high. Bat/tat HUD (toc do + shield).</p>
<h2><b>Buoc 3 - lai</b></h2><p>Start. Boost pad tren duong thang. Air-brake o cua. Tuong mat toc do; va manh se pha tau.</p>
<h2><b>Buoc 4 - vong va ghost</b></h2><p>Hoan thanh vong Cityscape. Best time va ghost luu tren trinh duyet nay. Khong tai khoan hay bang xep hang online.</p>
<h2><b>Buoc 5 - credits</b></h2><p>Credits liet ke team HexGL. Replay dua voi ghost. Mot track, mot tau.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Muc</th><th>Gia tri</th><th>Ghi chu</th></tr><tr><td>Tai xuong</td><td>~11 MB</td><td>Iframe same-origin</td></tr><tr><td>Renderer</td><td>WebGL</td><td>Khong WebGL = thong bao</td></tr><tr><td>Dieu khien</td><td>Ban phim / cam ung / gamepad</td><td>Khong chuot</td></tr><tr><td>Track</td><td>Cityscape</td><td>Mot track</td></tr><tr><td>Luu</td><td>localStorage</td><td>Best lap + ghost</td></tr></table>
<p>Xem <a href="/guides/vi/hover-racing-when.html">khi nao choi</a>, <a href="/guides/vi/hover-racing-vs-alternatives.html">so sanh</a> va <a href="/games/retro-highway-racer.html">Retro Highway Racer</a>.</p>
<p><a href="/games.html">&larr; Quay lai games</a></p>
</div>`,
  id: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Cara Main Hover Racing - Langkah demi Langkah</b></h1>
<p>Halaman <a href="/games/hover-racing.html">Hover Racing</a> memuat racer antigravitasi ~11 MB di iframe. Terbangkan kapal hover di trek neon 3D, gunakan air-brake, kalahkan best lap di browser ini. Tekan Play.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Keyboard: panah kemudi, A/Q dan D/E air-brake. Atau sentuh / gamepad di menu. Butuh WebGL. Tanpa mouse.</b></p></div>
<h2><b>Langkah 1 - tekan Play</b></h2><p>Play menyisipkan iframe (~11 MB). Menu di atas title art. Engine HexGL (Thibaut Despoulain / BKcore); LICENSE dan credits di samping.</p>
<h2><b>Langkah 2 - kontrol, kualitas, HUD</b></h2><p>Pilih keyboard, sentuh, atau gamepad. Kualitas low / mid / high / very high. Toggle HUD (kecepatan + shield).</p>
<h2><b>Langkah 3 - mengemudi</b></h2><p>Start. Boost pad di lurus. Air-brake di tikungan. Dinding mengurangi kecepatan; tabrakan keras menghancurkan kapal.</p>
<h2><b>Langkah 4 - putaran dan ghost</b></h2><p>Selesaikan putaran Cityscape. Best time dan ghost disimpan di browser ini. Tanpa akun atau leaderboard online.</p>
<h2><b>Langkah 5 - credits</b></h2><p>Credits menampilkan tim HexGL. Replay balapan melawan ghost. Satu trek, satu kapal.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Item</th><th>Nilai</th><th>Catatan</th></tr><tr><td>Unduhan</td><td>~11 MB</td><td>Iframe same-origin</td></tr><tr><td>Renderer</td><td>WebGL</td><td>Tanpa WebGL = pemberitahuan</td></tr><tr><td>Input</td><td>Keyboard / sentuh / gamepad</td><td>Tanpa mouse</td></tr><tr><td>Trek</td><td>Cityscape</td><td>Satu trek</td></tr><tr><td>Save</td><td>localStorage</td><td>Best lap + ghost</td></tr></table>
<p>Lihat <a href="/guides/id/hover-racing-when.html">kapan main</a>, <a href="/guides/id/hover-racing-vs-alternatives.html">perbandingan</a>, dan <a href="/games/retro-highway-racer.html">Retro Highway Racer</a>.</p>
<p><a href="/games.html">&larr; Kembali ke games</a></p>
</div>`,
  de: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Hover Racing spielen - Schritt fuer Schritt</b></h1>
<p>Die Seite <a href="/games/hover-racing.html">Hover Racing</a> laedt einen ~11 MB Antigravitations-Time-Attack-Racer im iframe. Steuern Sie ein Hover-Schiff auf einer neonfarbenen 3D-City-Strecke, dosieren Sie die Air-Brakes und schlagen Sie die Bestzeit in diesem Browser. Play startet.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Tastatur: Pfeile steuern, A/Q und D/E Air-Brake. Oder Touch / Gamepad im Startmenue. Braucht WebGL. Keine Maussteuerung.</b></p></div>
<h2><b>Schritt 1 - Play druecken</b></h2><p>Play laedt das iframe (~11 MB). Startmenue ueber dem Titelbild. Engine HexGL (Thibaut Despoulain / BKcore); LICENSE und Credits neben den Dateien.</p>
<h2><b>Schritt 2 - Steuerung, Qualitaet, HUD</b></h2><p>Waehlen Sie Tastatur, Touch oder Gamepad. Qualitaet low / mid / high / very high. HUD (Tempo + Schild) ein oder aus.</p>
<h2><b>Schritt 3 - fahren</b></h2><p>Start. Boost-Pads auf Geraden. Air-Brakes in Kurven. Waende rauben Tempo; ein harter Treffer zerstoert das Schiff.</p>
<h2><b>Schritt 4 - Runde und Ghost</b></h2><p>Beenden Sie die Cityscape-Runde. Bestzeit und Ghost bleiben in diesem Browser. Keine Konten, kein Online-Ranking.</p>
<h2><b>Schritt 5 - Credits</b></h2><p>Credits listet das HexGL-Team. Replay faehrt gegen den Ghost. Eine Strecke, ein Schiff.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Angabe</th><th>Wert</th><th>Notiz</th></tr><tr><td>Download</td><td>~11 MB</td><td>Same-origin-iframe</td></tr><tr><td>Renderer</td><td>WebGL</td><td>Ohne WebGL = Hinweis</td></tr><tr><td>Eingabe</td><td>Tastatur / Touch / Gamepad</td><td>Keine Maus</td></tr><tr><td>Strecke</td><td>Cityscape</td><td>Eine Strecke</td></tr><tr><td>Saves</td><td>localStorage</td><td>Bestzeit + Ghost</td></tr></table>
<p>Siehe <a href="/guides/de/hover-racing-when.html">wann spielen</a>, <a href="/guides/de/hover-racing-vs-alternatives.html">Vergleiche</a> und <a href="/games/retro-highway-racer.html">Retro Highway Racer</a>.</p>
<p><a href="/games.html">&larr; Zurueck zu Spielen</a></p>
</div>`,
};

guides.when.html = {
  en: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Hover Racing</b></h1>
<p><a href="/games/hover-racing.html">Hover Racing</a> fits when you want a WebGL neon time-attack lap with air-brake handling, a one-time ~11 MB download, and a best lap plus ghost saved only in this browser.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>When you have WebGL and a few minutes</b></h2><p>A Cityscape lap is a focused session: checkpoints, boost pads, and air-brakes through hairpins. Pick it when you can wait for the first ~11 MB load, then race from cache.</p>
<h2><b>When keyboard, touch, or gamepad is available</b></h2><p>The start menu offers all three. There is no mouse steering and no tilt option. Skip if you only have a pointer and no keyboard, touch, or gamepad.</p>
<h2><b>When local best-lap tracking matters</b></h2><p>Best times and ghost replays stay in this browser's localStorage. No accounts, no online boards - good when you want a private PB to chase.</p>
<h2><b>When to pick another racer</b></h2><p>Want a ~34 KB canvas highway with pointer-lock mouse steering and no saves? Use <a href="/games/retro-highway-racer.html">Retro Highway Racer</a>. Want a tiny neon run with a saved best score? Use <a href="/games/neon-circuit-racer.html">Neon Circuit Racer</a> (~43 KB).</p>
<p>See <a href="/guides/how-to-play-hover-racing.html">how to play</a> and <a href="/guides/hover-racing-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
  pt: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Quando Jogar Hover Racing</b></h1>
<p><a href="/games/hover-racing.html">Hover Racing</a> serve quando voce quer uma volta time-attack neon WebGL com air-brakes, download ~11 MB uma vez, e melhor volta + ghost so neste navegador.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Quando tem WebGL e alguns minutos</b></h2><p>Uma volta Cityscape e uma sessao focada. Espere o primeiro load ~11 MB; depois corre do cache.</p>
<h2><b>Quando tem teclado, toque ou gamepad</b></h2><p>O menu oferece teclado, toque ou gamepad. Sem mouse e sem tilt. Pule se so tem ponteiro.</p>
<h2><b>Quando o PB local importa</b></h2><p>Melhores tempos e ghost ficam no localStorage. Sem contas ou ranking online.</p>
<h2><b>Quando escolher outro</b></h2><p>Quer ~34 KB canvas com mouse pointer-lock e sem saves? Use <a href="/games/retro-highway-racer.html">Retro Highway Racer</a>. Quer run neon pequeno com score salvo? Use <a href="/games/neon-circuit-racer.html">Neon Circuit Racer</a> (~43 KB).</p>
<p>Veja <a href="/guides/pt/how-to-play-hover-racing.html">como jogar</a> e <a href="/guides/pt/hover-racing-vs-alternatives.html">comparacoes</a>.</p>
<p><a href="/games.html">&larr; Voltar aos jogos</a></p>
</div>`,
  es: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Cuando Jugar Hover Racing</b></h1>
<p><a href="/games/hover-racing.html">Hover Racing</a> encaja cuando quieres una vuelta time-attack neon WebGL con air-brakes, descarga ~11 MB una vez, y mejor vuelta + fantasma solo en este navegador.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Cuando tienes WebGL y unos minutos</b></h2><p>Una vuelta Cityscape es una sesion centrada. Espera el primer load ~11 MB; luego corre desde la cache.</p>
<h2><b>Cuando tienes teclado, tactil o mando</b></h2><p>El menu ofrece los tres. Sin raton y sin tilt. Evitalo si solo tienes puntero.</p>
<h2><b>Cuando importa el PB local</b></h2><p>Mejores tiempos y fantasma viven en localStorage. Sin cuentas ni ranking online.</p>
<h2><b>Cuando elegir otro</b></h2><p>Quieres ~34 KB canvas con raton pointer-lock y sin guardados? Usa <a href="/games/retro-highway-racer.html">Retro Highway Racer</a>. Quieres un run neon pequeno con marca guardada? Usa <a href="/games/neon-circuit-racer.html">Neon Circuit Racer</a> (~43 KB).</p>
<p>Ver <a href="/guides/es/how-to-play-hover-racing.html">como jugar</a> y <a href="/guides/es/hover-racing-vs-alternatives.html">comparaciones</a>.</p>
<p><a href="/games.html">&larr; Volver a juegos</a></p>
</div>`,
  vi: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Khi nao choi Hover Racing</b></h1>
<p><a href="/games/hover-racing.html">Hover Racing</a> phu hop khi ban muon vong time-attack neon WebGL voi air-brake, tai ~11 MB mot lan, va best lap + ghost chi tren trinh duyet nay.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Khi co WebGL va vai phut</b></h2><p>Mot vong Cityscape la phien tap trung. Cho lan tai ~11 MB dau; sau do chay tu cache.</p>
<h2><b>Khi co ban phim, cam ung hoac gamepad</b></h2><p>Menu cho ca ba. Khong chuot, khong tilt. Bo qua neu chi co con tro.</p>
<h2><b>Khi can PB cuc bo</b></h2><p>Best time va ghost nam trong localStorage. Khong tai khoan hay bang online.</p>
<h2><b>Khi chon game khac</b></h2><p>Muon ~34 KB canvas voi chuot pointer-lock, khong luu? Dung <a href="/games/retro-highway-racer.html">Retro Highway Racer</a>. Muon run neon nho co diem luu? Dung <a href="/games/neon-circuit-racer.html">Neon Circuit Racer</a> (~43 KB).</p>
<p>Xem <a href="/guides/vi/how-to-play-hover-racing.html">cach choi</a> va <a href="/guides/vi/hover-racing-vs-alternatives.html">so sanh</a>.</p>
<p><a href="/games.html">&larr; Quay lai games</a></p>
</div>`,
  id: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Kapan Main Hover Racing</b></h1>
<p><a href="/games/hover-racing.html">Hover Racing</a> cocok saat Anda ingin putaran time-attack neon WebGL dengan air-brake, unduhan ~11 MB sekali, dan best lap + ghost hanya di browser ini.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Saat punya WebGL dan beberapa menit</b></h2><p>Satu putaran Cityscape adalah sesi fokus. Tunggu unduhan pertama ~11 MB; lalu balapan dari cache.</p>
<h2><b>Saat punya keyboard, sentuh, atau gamepad</b></h2><p>Menu menawarkan ketiganya. Tanpa mouse dan tanpa tilt. Lewati jika hanya punya pointer.</p>
<h2><b>Saat PB lokal penting</b></h2><p>Best time dan ghost tinggal di localStorage. Tanpa akun atau papan online.</p>
<h2><b>Kapan pilih yang lain</b></h2><p>Ingin ~34 KB canvas dengan mouse pointer-lock tanpa save? Pakai <a href="/games/retro-highway-racer.html">Retro Highway Racer</a>. Ingin run neon kecil dengan skor tersimpan? Pakai <a href="/games/neon-circuit-racer.html">Neon Circuit Racer</a> (~43 KB).</p>
<p>Lihat <a href="/guides/id/how-to-play-hover-racing.html">cara main</a> dan <a href="/guides/id/hover-racing-vs-alternatives.html">perbandingan</a>.</p>
<p><a href="/games.html">&larr; Kembali ke games</a></p>
</div>`,
  de: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Wann Hover Racing spielen</b></h1>
<p><a href="/games/hover-racing.html">Hover Racing</a> passt, wenn Sie eine WebGL-Neon-Time-Attack-Runde mit Air-Brakes wollen, einen einmaligen ~11 MB Download, und Bestzeit plus Ghost nur in diesem Browser.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Wenn WebGL und ein paar Minuten da sind</b></h2><p>Eine Cityscape-Runde ist eine fokussierte Session. Warten Sie den ersten ~11 MB Load ab; danach aus dem Cache.</p>
<h2><b>Wenn Tastatur, Touch oder Gamepad da ist</b></h2><p>Das Menue bietet alle drei. Keine Maus, kein Tilt. Ueberspringen Sie es bei nur einem Zeiger.</p>
<h2><b>Wenn lokaler PB zaehlt</b></h2><p>Bestzeiten und Ghosts bleiben in localStorage. Keine Konten, kein Online-Board.</p>
<h2><b>Wann ein anderes Rennspiel</b></h2><p>Wollen Sie ~34 KB Canvas mit Pointer-Lock-Maus und ohne Saves? Nutzen Sie <a href="/games/retro-highway-racer.html">Retro Highway Racer</a>. Wollen Sie einen kleinen Neon-Lauf mit gespeichertem Bestscore? Nutzen Sie <a href="/games/neon-circuit-racer.html">Neon Circuit Racer</a> (~43 KB).</p>
<p>Siehe <a href="/guides/de/how-to-play-hover-racing.html">Anleitung</a> und <a href="/guides/de/hover-racing-vs-alternatives.html">Vergleiche</a>.</p>
<p><a href="/games.html">&larr; Zurueck zu Spielen</a></p>
</div>`,
};

guides.vs.html = {
  en: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Hover Racing vs Alternatives</b></h1>
<p><a href="/games/hover-racing.html">Hover Racing</a> is a ~11 MB WebGL anti-gravity time-attack on the Cityscape track with best lap and ghost in this browser. Compare it with two lighter free racers on this site.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Download after Play</th><th>Renderer</th><th>Saves</th></tr>
<tr><td>Hover Racing</td><td>~11 MB</td><td>WebGL (Three.js)</td><td>Best lap + ghost in localStorage</td></tr>
<tr><td><a href="/games/retro-highway-racer.html">Retro Highway Racer</a></td><td>~34 KB</td><td>Canvas 2D</td><td>None</td></tr>
<tr><td><a href="/games/neon-circuit-racer.html">Neon Circuit Racer</a></td><td>~43 KB</td><td>Canvas 2D</td><td>Best score (ftol:neoncircuitracer:*)</td></tr>
</table>
<p>Pick Hover Racing for neon WebGL air-brake handling, quality presets, and a ghost to chase. Pick Retro Highway Racer for the lightest canvas highway with pointer-lock mouse steering and a hard checkpoint clock. Pick Neon Circuit Racer for a tiny neon run that keeps a best score.</p>
<p>See <a href="/guides/how-to-play-hover-racing.html">how to play</a> and <a href="/guides/hover-racing-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
  pt: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Hover Racing vs Alternativas</b></h1>
<p><a href="/games/hover-racing.html">Hover Racing</a> e um time-attack anti-gravidade ~11 MB WebGL na pista Cityscape com melhor volta + ghost neste navegador. Compare com dois racers mais leves neste site.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered"><tr><th>Jogo</th><th>Download apos Play</th><th>Renderer</th><th>Saves</th></tr>
<tr><td>Hover Racing</td><td>~11 MB</td><td>WebGL (Three.js)</td><td>Melhor volta + ghost no localStorage</td></tr>
<tr><td><a href="/games/retro-highway-racer.html">Retro Highway Racer</a></td><td>~34 KB</td><td>Canvas 2D</td><td>Nenhum</td></tr>
<tr><td><a href="/games/neon-circuit-racer.html">Neon Circuit Racer</a></td><td>~43 KB</td><td>Canvas 2D</td><td>Melhor score (ftol:neoncircuitracer:*)</td></tr>
</table>
<p>Escolha Hover Racing para air-brakes WebGL neon, presets de qualidade e ghost. Escolha Retro Highway Racer para a rodovia canvas mais leve com mouse pointer-lock. Escolha Neon Circuit Racer para um run neon pequeno com score salvo.</p>
<p>Veja <a href="/guides/pt/how-to-play-hover-racing.html">como jogar</a> e <a href="/guides/pt/hover-racing-when.html">quando encaixa</a>.</p>
<p><a href="/games.html">&larr; Voltar aos jogos</a></p>
</div>`,
  es: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Hover Racing vs Alternativas</b></h1>
<p><a href="/games/hover-racing.html">Hover Racing</a> es un time-attack antigravedad ~11 MB WebGL en Cityscape con mejor vuelta + fantasma en este navegador. Comparalo con dos racers mas ligeros en este sitio.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered"><tr><th>Juego</th><th>Descarga tras Play</th><th>Renderer</th><th>Guardados</th></tr>
<tr><td>Hover Racing</td><td>~11 MB</td><td>WebGL (Three.js)</td><td>Mejor vuelta + fantasma en localStorage</td></tr>
<tr><td><a href="/games/retro-highway-racer.html">Retro Highway Racer</a></td><td>~34 KB</td><td>Canvas 2D</td><td>Ninguno</td></tr>
<tr><td><a href="/games/neon-circuit-racer.html">Neon Circuit Racer</a></td><td>~43 KB</td><td>Canvas 2D</td><td>Mejor marca (ftol:neoncircuitracer:*)</td></tr>
</table>
<p>Elige Hover Racing para air-brakes WebGL neon, presets de calidad y fantasma. Elige Retro Highway Racer para la autopista canvas mas ligera con raton pointer-lock. Elige Neon Circuit Racer para un run neon pequeno con marca guardada.</p>
<p>Ver <a href="/guides/es/how-to-play-hover-racing.html">como jugar</a> y <a href="/guides/es/hover-racing-when.html">cuando encaja</a>.</p>
<p><a href="/games.html">&larr; Volver a juegos</a></p>
</div>`,
  vi: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Hover Racing vs lua chon khac</b></h1>
<p><a href="/games/hover-racing.html">Hover Racing</a> la time-attack chong trong luc ~11 MB WebGL tren Cityscape voi best lap + ghost tren trinh duyet nay. So sanh voi hai racer nhe hon tren site.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Tai sau Play</th><th>Renderer</th><th>Luu</th></tr>
<tr><td>Hover Racing</td><td>~11 MB</td><td>WebGL (Three.js)</td><td>Best lap + ghost trong localStorage</td></tr>
<tr><td><a href="/games/retro-highway-racer.html">Retro Highway Racer</a></td><td>~34 KB</td><td>Canvas 2D</td><td>Khong</td></tr>
<tr><td><a href="/games/neon-circuit-racer.html">Neon Circuit Racer</a></td><td>~43 KB</td><td>Canvas 2D</td><td>Diem cao (ftol:neoncircuitracer:*)</td></tr>
</table>
<p>Chon Hover Racing cho air-brake WebGL neon, preset chat luong va ghost. Chon Retro Highway Racer cho duong cao toc canvas nhe nhat voi chuot pointer-lock. Chon Neon Circuit Racer cho run neon nho co diem luu.</p>
<p>Xem <a href="/guides/vi/how-to-play-hover-racing.html">cach choi</a> va <a href="/guides/vi/hover-racing-when.html">khi nao phu hop</a>.</p>
<p><a href="/games.html">&larr; Quay lai games</a></p>
</div>`,
  id: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Hover Racing vs Alternatif</b></h1>
<p><a href="/games/hover-racing.html">Hover Racing</a> adalah time-attack antigravitasi ~11 MB WebGL di Cityscape dengan best lap + ghost di browser ini. Bandingkan dengan dua racer lebih ringan di situs ini.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered"><tr><th>Game</th><th>Unduhan setelah Play</th><th>Renderer</th><th>Save</th></tr>
<tr><td>Hover Racing</td><td>~11 MB</td><td>WebGL (Three.js)</td><td>Best lap + ghost di localStorage</td></tr>
<tr><td><a href="/games/retro-highway-racer.html">Retro Highway Racer</a></td><td>~34 KB</td><td>Canvas 2D</td><td>Tidak ada</td></tr>
<tr><td><a href="/games/neon-circuit-racer.html">Neon Circuit Racer</a></td><td>~43 KB</td><td>Canvas 2D</td><td>Skor terbaik (ftol:neoncircuitracer:*)</td></tr>
</table>
<p>Pilih Hover Racing untuk air-brake WebGL neon, preset kualitas, dan ghost. Pilih Retro Highway Racer untuk jalan canvas paling ringan dengan mouse pointer-lock. Pilih Neon Circuit Racer untuk run neon kecil dengan skor tersimpan.</p>
<p>Lihat <a href="/guides/id/how-to-play-hover-racing.html">cara main</a> dan <a href="/guides/id/hover-racing-when.html">kapan cocok</a>.</p>
<p><a href="/games.html">&larr; Kembali ke games</a></p>
</div>`,
  de: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Hover Racing vs Alternativen</b></h1>
<p><a href="/games/hover-racing.html">Hover Racing</a> ist ein ~11 MB WebGL-Antigravitations-Time-Attack auf Cityscape mit Bestzeit und Ghost in diesem Browser. Vergleich mit zwei leichteren kostenlosen Racern auf dieser Seite.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered"><tr><th>Spiel</th><th>Download nach Play</th><th>Renderer</th><th>Saves</th></tr>
<tr><td>Hover Racing</td><td>~11 MB</td><td>WebGL (Three.js)</td><td>Bestzeit + Ghost in localStorage</td></tr>
<tr><td><a href="/games/retro-highway-racer.html">Retro Highway Racer</a></td><td>~34 KB</td><td>Canvas 2D</td><td>Keine</td></tr>
<tr><td><a href="/games/neon-circuit-racer.html">Neon Circuit Racer</a></td><td>~43 KB</td><td>Canvas 2D</td><td>Bestscore (ftol:neoncircuitracer:*)</td></tr>
</table>
<p>Waehlen Sie Hover Racing fuer Neon-WebGL-Air-Brakes, Qualitaetsstufen und Ghost. Waehlen Sie Retro Highway Racer fuer die leichteste Canvas-Autobahn mit Pointer-Lock-Maus. Waehlen Sie Neon Circuit Racer fuer einen kleinen Neon-Lauf mit gespeichertem Bestscore.</p>
<p>Siehe <a href="/guides/de/how-to-play-hover-racing.html">Anleitung</a> und <a href="/guides/de/hover-racing-when.html">wann es passt</a>.</p>
<p><a href="/games.html">&larr; Zurueck zu Spielen</a></p>
</div>`,
};

function writeGuide(key, locale) {
  const g = guides[key];
  const slug = locale === 'en' ? `guides${g.slugBase}` : `guides${locale}${g.slugBase}`;
  writeFileSync(join(CMS, `BODYHTML${slug}.html`), g.html[locale] + '\n');
  writeFileSync(join(CMS, `BODYTITLE${slug}.txt`), (locale === 'en' ? g.titleEn : g.titles[locale]) + '\n');
  writeFileSync(join(CMS, `BODYDESC${slug}.txt`), (locale === 'en' ? g.descEn : g.descs[locale]) + '\n');
  const jspDir = locale === 'en' ? JSP : join(JSP, locale);
  mkdirSync(jspDir, { recursive: true });
  writeFileSync(join(jspDir, `${g.route}.jsp`), jspTpl);
}

for (const key of Object.keys(guides)) {
  for (const loc of ['en', 'pt', 'es', 'vi', 'id', 'de']) writeGuide(key, loc);
}

const siteDataPath = join(ROOT, 'scripts/site-data.mjs');
let site = readFileSync(siteDataPath, 'utf8');
const guideRoutes = `
  // new-tool-discovery-loop-runbook fire305 (2026-07-18): hover-racing companion guides
  '/guides/how-to-play-hover-racing.html',
  '/guides/hover-racing-when.html',
  '/guides/hover-racing-vs-alternatives.html',
  '/guides/pt/how-to-play-hover-racing.html',
  '/guides/pt/hover-racing-when.html',
  '/guides/pt/hover-racing-vs-alternatives.html',
  '/guides/es/how-to-play-hover-racing.html',
  '/guides/es/hover-racing-when.html',
  '/guides/es/hover-racing-vs-alternatives.html',
  '/guides/vi/how-to-play-hover-racing.html',
  '/guides/vi/hover-racing-when.html',
  '/guides/vi/hover-racing-vs-alternatives.html',
  '/guides/id/how-to-play-hover-racing.html',
  '/guides/id/hover-racing-when.html',
  '/guides/id/hover-racing-vs-alternatives.html',
  '/guides/de/how-to-play-hover-racing.html',
  '/guides/de/hover-racing-when.html',
  '/guides/de/hover-racing-vs-alternatives.html',
`;
const guideJsp = `
  // new-tool-discovery-loop-runbook fire305 (2026-07-18): hover-racing companion guides
  '/guides/how-to-play-hover-racing.html': 'guide/how-to-play-hover-racing.jsp',
  '/guides/hover-racing-when.html': 'guide/hover-racing-when.jsp',
  '/guides/hover-racing-vs-alternatives.html': 'guide/hover-racing-vs-alternatives.jsp',
  '/guides/pt/how-to-play-hover-racing.html': 'guide/pt/how-to-play-hover-racing.jsp',
  '/guides/pt/hover-racing-when.html': 'guide/pt/hover-racing-when.jsp',
  '/guides/pt/hover-racing-vs-alternatives.html': 'guide/pt/hover-racing-vs-alternatives.jsp',
  '/guides/es/how-to-play-hover-racing.html': 'guide/es/how-to-play-hover-racing.jsp',
  '/guides/es/hover-racing-when.html': 'guide/es/hover-racing-when.jsp',
  '/guides/es/hover-racing-vs-alternatives.html': 'guide/es/hover-racing-vs-alternatives.jsp',
  '/guides/vi/how-to-play-hover-racing.html': 'guide/vi/how-to-play-hover-racing.jsp',
  '/guides/vi/hover-racing-when.html': 'guide/vi/hover-racing-when.jsp',
  '/guides/vi/hover-racing-vs-alternatives.html': 'guide/vi/hover-racing-vs-alternatives.jsp',
  '/guides/id/how-to-play-hover-racing.html': 'guide/id/how-to-play-hover-racing.jsp',
  '/guides/id/hover-racing-when.html': 'guide/id/hover-racing-when.jsp',
  '/guides/id/hover-racing-vs-alternatives.html': 'guide/id/hover-racing-vs-alternatives.jsp',
  '/guides/de/how-to-play-hover-racing.html': 'guide/de/how-to-play-hover-racing.jsp',
  '/guides/de/hover-racing-when.html': 'guide/de/hover-racing-when.jsp',
  '/guides/de/hover-racing-vs-alternatives.html': 'guide/de/hover-racing-vs-alternatives.jsp',
`;

const routeAnchor = `  '/guides/de/retro-highway-racer-vs-alternatives.html',\n\n  // game-discovery-loop-runbook fire133 (2026-07-18): ritual-catacombs companion guides`;
const jspAnchor = `  '/guides/de/retro-highway-racer-vs-alternatives.html': 'guide/de/retro-highway-racer-vs-alternatives.jsp',\n\n  // game-discovery-loop-runbook fire133 (2026-07-18): ritual-catacombs companion guides`;

if (!site.includes('how-to-play-hover-racing')) {
  if (!site.includes(routeAnchor)) throw new Error('route anchor miss');
  if (!site.includes(jspAnchor)) throw new Error('jsp anchor miss');
  site = site.replace(routeAnchor, `  '/guides/de/retro-highway-racer-vs-alternatives.html',\n${guideRoutes}\n  // game-discovery-loop-runbook fire133 (2026-07-18): ritual-catacombs companion guides`);
  site = site.replace(jspAnchor, `  '/guides/de/retro-highway-racer-vs-alternatives.html': 'guide/de/retro-highway-racer-vs-alternatives.jsp',\n${guideJsp}\n  // game-discovery-loop-runbook fire133 (2026-07-18): ritual-catacombs companion guides`);
  writeFileSync(siteDataPath, site);
  console.log('patched site-data.mjs');
} else {
  console.log('site-data already has hover-racing guides');
}
console.log('Generated hover-racing guide CMS + JSP (18 pages)');
