#!/usr/bin/env node
/**
 * new-tool-discovery-loop fire306: companion guides for retro-arcade-shooter
 * (3 angles x EN + pt/es/vi/id/de). Claims ONLY from tool-retroarcadeshooter/SKILL.md.
 * Peers: Chili Blast Shooter (~26 KB) + Retro FPS Online (WASM Freedoom campaigns)
 * from their SKILL.md. Not an FPS - tilted top-down Underrun view.
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
    route: 'how-to-play-retro-arcade-shooter',
    slugBase: 'howtoplayretroarcadeshooter',
    titleEn: 'How to Play Retro Arcade Shooter - Step by Step',
    descEn: 'How to play Retro Arcade Shooter: press Play, WASD move, mouse aim, hold click to fire, reboot every CPU across three Underrun levels. Free browser shooter on FreeToolOnline.',
    titles: {
      pt: 'Como Jogar Retro Arcade Shooter - Passo a Passo',
      es: 'Como Jugar Retro Arcade Shooter - Paso a Paso',
      vi: 'Cach choi Retro Arcade Shooter - tung buoc',
      id: 'Cara Main Retro Arcade Shooter - Langkah demi Langkah',
      de: 'Retro Arcade Shooter spielen - Schritt fuer Schritt',
    },
    descs: {
      pt: 'Como jogar Retro Arcade Shooter: aperte Play, WASD move, mouse mira, segure clique para atirar, reinicie cada CPU em tres niveis Underrun.',
      es: 'Como jugar Retro Arcade Shooter: pulsa Play, WASD mover, raton apuntar, mantén clic para disparar, reinicia cada CPU en tres niveles Underrun.',
      vi: 'Cach choi Retro Arcade Shooter: nhan Play, WASD di chuyen, chuot ngam, giu click ban, reboot moi CPU qua ba man Underrun.',
      id: 'Cara main Retro Arcade Shooter: tekan Play, WASD gerak, mouse bidik, tahan klik tembak, reboot setiap CPU di tiga level Underrun.',
      de: 'Retro Arcade Shooter spielen: Play, WASD bewegen, Maus zielen, Klick halten zum Feuern, jeden CPU in drei Underrun-Leveln rebooten.',
    },
  },
  when: {
    route: 'retro-arcade-shooter-when',
    slugBase: 'retroarcadeshooterwhen',
    titleEn: 'When to Play Retro Arcade Shooter',
    descEn: 'When Retro Arcade Shooter fits: ~120 KB WebGL top-down run, keyboard + mouse only, three short levels, no saves. Free Underrun browser shooter on FreeToolOnline.',
    titles: {
      pt: 'Quando Jogar Retro Arcade Shooter',
      es: 'Cuando Jugar Retro Arcade Shooter',
      vi: 'Khi nao choi Retro Arcade Shooter',
      id: 'Kapan Main Retro Arcade Shooter',
      de: 'Wann Retro Arcade Shooter spielen',
    },
    descs: {
      pt: 'Quando Retro Arcade Shooter encaixa: ~120 KB WebGL top-down, so teclado + mouse, tres niveis curtos, sem saves.',
      es: 'Cuando encaja Retro Arcade Shooter: ~120 KB WebGL vista superior, solo teclado + raton, tres niveles cortos, sin guardados.',
      vi: 'Khi nao Retro Arcade Shooter phu hop: ~120 KB WebGL top-down, chi ban phim + chuot, ba man ngan, khong save.',
      id: 'Kapan Retro Arcade Shooter cocok: ~120 KB WebGL top-down, hanya keyboard + mouse, tiga level singkat, tanpa save.',
      de: 'Wann Retro Arcade Shooter passt: ~120 KB WebGL Top-Down, nur Tastatur + Maus, drei kurze Level, keine Saves.',
    },
  },
  vs: {
    route: 'retro-arcade-shooter-vs-alternatives',
    slugBase: 'retroarcadeshootervsalternatives',
    titleEn: 'Retro Arcade Shooter vs Alternatives',
    descEn: 'Compare Retro Arcade Shooter (~120 KB Underrun, three levels) with Chili Blast Shooter (~26 KB) and Retro FPS Online (WASM Freedoom). Free browser shooters on FreeToolOnline.',
    titles: {
      pt: 'Retro Arcade Shooter vs Alternativas',
      es: 'Retro Arcade Shooter vs Alternativas',
      vi: 'Retro Arcade Shooter vs lua chon khac',
      id: 'Retro Arcade Shooter vs Alternatif',
      de: 'Retro Arcade Shooter vs Alternativen',
    },
    descs: {
      pt: 'Compare Retro Arcade Shooter (~120 KB Underrun, tres niveis) com Chili Blast Shooter (~26 KB) e Retro FPS Online (WASM Freedoom).',
      es: 'Compara Retro Arcade Shooter (~120 KB Underrun, tres niveles) con Chili Blast Shooter (~26 KB) y Retro FPS Online (WASM Freedoom).',
      vi: 'So sanh Retro Arcade Shooter (~120 KB Underrun, ba man) voi Chili Blast Shooter (~26 KB) va Retro FPS Online (WASM Freedoom).',
      id: 'Bandingkan Retro Arcade Shooter (~120 KB Underrun, tiga level) dengan Chili Blast Shooter (~26 KB) dan Retro FPS Online (WASM Freedoom).',
      de: 'Vergleiche Retro Arcade Shooter (~120 KB Underrun, drei Level) mit Chili Blast Shooter (~26 KB) und Retro FPS Online (WASM Freedoom).',
    },
  },
};

guides.howtoplay.html = {
  en: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Retro Arcade Shooter - Step by Step</b></h1>
<p>The <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> page loads Underrun in a same-origin iframe (~120 KB). Clear a dark underground server facility: WASD to move, mouse to aim, hold click to fire, and reboot every CPU to open the next of three levels. Press Play to start.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Keyboard + mouse only. Needs WebGL. No touch controls - phones load the page but cannot play.</b></p></div>
<h2><b>Step 1 - press Play on this page</b></h2><p>Press Play to inject the iframe (readable Underrun source + PNG level maps + texture atlas). The launch panel notes the coarse-pointer limit. The game is Underrun by Dominic Szablewski (MIT); music by Andreas Loesch; LICENSE and credits ship beside the files.</p>
<h2><b>Step 2 - unlock audio and start level 1</b></h2><p>Click once in the game canvas to unlock audio (Sonant-X synthesizes music and SFX in the tab - no audio file downloads). Terminal-style boot text appears; then you spawn in level 1.</p>
<h2><b>Step 3 - move, aim, and fire</b></h2><p>WASD or arrow keys move. Mouse aims. Hold left click to fire plasma (per-shot cooldown while held). Spider robots swarm melee; sentry turrets shoot projectiles. Grab health packs when they drop.</p>
<h2><b>Step 4 - reboot every CPU</b></h2><p>Each level has a CPU count you must reboot to open the exit. Finish all three levels (maps loaded from tiny PNG images). On death the level auto-reloads after about three seconds - runs stay short.</p>
<h2><b>Step 5 - what this page does not do</b></h2><p>No saves, scores, accounts, or leaderboards. No touch or gamepad. One plasma gun, no upgrades. Exactly three levels - not procedural. This is a tilted top-down view, not a first-person shooter (see <a href="/games/retro-fps-online.html">Retro FPS Online</a> for that).</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Download</td><td>~120 KB</td><td>Same-origin iframe; zero network after load</td></tr><tr><td>Renderer</td><td>WebGL 320x180</td><td>Pixelated upscale; needs WebGL</td></tr><tr><td>Input</td><td>Keyboard + mouse</td><td>No touch; no gamepad</td></tr><tr><td>Levels</td><td>3</td><td>PNG maps; reboot CPUs to advance</td></tr><tr><td>Saves</td><td>None</td><td>Nothing written to browser storage</td></tr></table>
<p>See <a href="/guides/retro-arcade-shooter-when.html">when to play</a>, <a href="/guides/retro-arcade-shooter-vs-alternatives.html">comparisons</a>, and <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
  pt: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Como Jogar Retro Arcade Shooter - Passo a Passo</b></h1>
<p>A pagina <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> carrega Underrun no iframe (~120 KB). Limpe a instalacao: WASD move, mouse mira, segure clique para atirar, reinicie cada CPU nos tres niveis. Aperte Play.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>So teclado + mouse. Precisa de WebGL. Sem toque - celular carrega mas nao joga.</b></p></div>
<h2><b>Passo 1 - apertar Play</b></h2><p>Play injeta o iframe (fonte Underrun + mapas PNG). Underrun por Dominic Szablewski (MIT); musica Andreas Loesch; LICENSE ao lado.</p>
<h2><b>Passo 2 - audio e nivel 1</b></h2><p>Clique no canvas para liberar audio (Sonant-X sintetiza no tab). Texto de boot; depois nivel 1.</p>
<h2><b>Passo 3 - mover e atirar</b></h2><p>WASD ou setas. Mouse mira. Segure clique esquerdo (plasma com cooldown). Aranhas melee; sentries atiram. Pegue health packs.</p>
<h2><b>Passo 4 - reiniciar CPUs</b></h2><p>Reboot cada CPU do nivel para abrir a saida. Tres niveis. Na morte o nivel recarrega em ~3s.</p>
<h2><b>Passo 5 - o que nao tem</b></h2><p>Sem saves, scores ou contas. Sem toque ou gamepad. Uma arma. Vista top-down inclinada, nao FPS (<a href="/games/retro-fps-online.html">Retro FPS Online</a>).</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Item</th><th>Valor</th><th>Notas</th></tr><tr><td>Download</td><td>~120 KB</td><td>Iframe same-origin</td></tr><tr><td>Renderer</td><td>WebGL 320x180</td><td>Precisa WebGL</td></tr><tr><td>Input</td><td>Teclado + mouse</td><td>Sem toque</td></tr><tr><td>Niveis</td><td>3</td><td>Mapas PNG</td></tr><tr><td>Saves</td><td>Nenhum</td><td>Sem storage</td></tr></table>
<p>Veja <a href="/guides/pt/retro-arcade-shooter-when.html">quando jogar</a>, <a href="/guides/pt/retro-arcade-shooter-vs-alternatives.html">comparacoes</a> e <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a>.</p>
<p><a href="/games.html">&larr; Voltar aos jogos</a></p>
</div>`,
  es: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Como Jugar Retro Arcade Shooter - Paso a Paso</b></h1>
<p>La pagina <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> carga Underrun en el iframe (~120 KB). Limpia la instalacion: WASD mover, raton apuntar, mantén clic para disparar, reinicia cada CPU en tres niveles. Pulsa Play.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Solo teclado + raton. Necesita WebGL. Sin tactil - el movil carga pero no juega.</b></p></div>
<h2><b>Paso 1 - pulsar Play</b></h2><p>Play inyecta el iframe (fuente Underrun + mapas PNG). Underrun por Dominic Szablewski (MIT); musica Andreas Loesch; LICENSE al lado.</p>
<h2><b>Paso 2 - audio y nivel 1</b></h2><p>Clic en el canvas para desbloquear audio (Sonant-X sintetiza en la pestana). Texto de boot; luego nivel 1.</p>
<h2><b>Paso 3 - mover y disparar</b></h2><p>WASD o flechas. Raton apunta. Mantén clic izquierdo (plasma con cooldown). Aranas melee; torretas disparan. Coge health packs.</p>
<h2><b>Paso 4 - reiniciar CPUs</b></h2><p>Reboot cada CPU del nivel para abrir la salida. Tres niveles. Al morir el nivel recarga en ~3s.</p>
<h2><b>Paso 5 - lo que no tiene</b></h2><p>Sin guardados, scores ni cuentas. Sin tactil ni mando. Un arma. Vista superior inclinada, no FPS (<a href="/games/retro-fps-online.html">Retro FPS Online</a>).</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Item</th><th>Valor</th><th>Notas</th></tr><tr><td>Descarga</td><td>~120 KB</td><td>Iframe same-origin</td></tr><tr><td>Renderer</td><td>WebGL 320x180</td><td>Necesita WebGL</td></tr><tr><td>Input</td><td>Teclado + raton</td><td>Sin tactil</td></tr><tr><td>Niveles</td><td>3</td><td>Mapas PNG</td></tr><tr><td>Saves</td><td>Ninguno</td><td>Sin storage</td></tr></table>
<p>Ver <a href="/guides/es/retro-arcade-shooter-when.html">cuando jugar</a>, <a href="/guides/es/retro-arcade-shooter-vs-alternatives.html">comparaciones</a> y <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a>.</p>
<p><a href="/games.html">&larr; Volver a juegos</a></p>
</div>`,
  vi: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Cach choi Retro Arcade Shooter - tung buoc</b></h1>
<p>Trang <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> tai Underrun trong iframe (~120 KB). Don co so: WASD di chuyen, chuot ngam, giu click ban, reboot moi CPU qua ba man. Nhan Play.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Chi ban phim + chuot. Can WebGL. Khong cam ung - dien thoai tai duoc nhung khong choi duoc.</b></p></div>
<h2><b>Buoc 1 - nhan Play</b></h2><p>Play chen iframe (ma Underrun + ban do PNG). Underrun cua Dominic Szablewski (MIT); nhac Andreas Loesch; LICENSE kem theo.</p>
<h2><b>Buoc 2 - am thanh va man 1</b></h2><p>Click canvas de mo am thanh (Sonant-X tong hop trong tab). Chu boot; roi man 1.</p>
<h2><b>Buoc 3 - di chuyen va ban</b></h2><p>WASD hoac mui ten. Chuot ngam. Giu chuot trai (plasma co cooldown). Nhen melee; thap ban. Nhat health pack.</p>
<h2><b>Buoc 4 - reboot CPU</b></h2><p>Reboot moi CPU de mo loi ra. Ba man. Chet thi man tai lai sau ~3s.</p>
<h2><b>Buoc 5 - khong co gi</b></h2><p>Khong save, diem, tai khoan. Khong cam ung hay gamepad. Mot sung. Goc top-down nghieng, khong phai FPS (<a href="/games/retro-fps-online.html">Retro FPS Online</a>).</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Muc</th><th>Gia tri</th><th>Ghi chu</th></tr><tr><td>Tai</td><td>~120 KB</td><td>Iframe same-origin</td></tr><tr><td>Renderer</td><td>WebGL 320x180</td><td>Can WebGL</td></tr><tr><td>Input</td><td>Ban phim + chuot</td><td>Khong cam ung</td></tr><tr><td>Man</td><td>3</td><td>Ban do PNG</td></tr><tr><td>Save</td><td>Khong</td><td>Khong storage</td></tr></table>
<p>Xem <a href="/guides/vi/retro-arcade-shooter-when.html">khi nao choi</a>, <a href="/guides/vi/retro-arcade-shooter-vs-alternatives.html">so sanh</a> va <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a>.</p>
<p><a href="/games.html">&larr; Ve games</a></p>
</div>`,
  id: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Cara Main Retro Arcade Shooter - Langkah demi Langkah</b></h1>
<p>Halaman <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> memuat Underrun di iframe (~120 KB). Bersihkan fasilitas: WASD gerak, mouse bidik, tahan klik tembak, reboot setiap CPU di tiga level. Tekan Play.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Hanya keyboard + mouse. Butuh WebGL. Tanpa sentuh - ponsel memuat tapi tidak bisa main.</b></p></div>
<h2><b>Langkah 1 - tekan Play</b></h2><p>Play menyuntik iframe (kode Underrun + peta PNG). Underrun oleh Dominic Szablewski (MIT); musik Andreas Loesch; LICENSE di samping.</p>
<h2><b>Langkah 2 - audio dan level 1</b></h2><p>Klik canvas untuk buka audio (Sonant-X sintesis di tab). Teks boot; lalu level 1.</p>
<h2><b>Langkah 3 - gerak dan tembak</b></h2><p>WASD atau panah. Mouse bidik. Tahan klik kiri (plasma dengan cooldown). Laba-laba melee; menara tembak. Ambil health pack.</p>
<h2><b>Langkah 4 - reboot CPU</b></h2><p>Reboot setiap CPU level untuk buka pintu. Tiga level. Mati = level reload ~3s.</p>
<h2><b>Langkah 5 - yang tidak ada</b></h2><p>Tanpa save, skor, akun. Tanpa sentuh atau gamepad. Satu senjata. Sudut top-down miring, bukan FPS (<a href="/games/retro-fps-online.html">Retro FPS Online</a>).</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Item</th><th>Nilai</th><th>Catatan</th></tr><tr><td>Unduhan</td><td>~120 KB</td><td>Iframe same-origin</td></tr><tr><td>Renderer</td><td>WebGL 320x180</td><td>Butuh WebGL</td></tr><tr><td>Input</td><td>Keyboard + mouse</td><td>Tanpa sentuh</td></tr><tr><td>Level</td><td>3</td><td>Peta PNG</td></tr><tr><td>Save</td><td>Tidak ada</td><td>Tanpa storage</td></tr></table>
<p>Lihat <a href="/guides/id/retro-arcade-shooter-when.html">kapan main</a>, <a href="/guides/id/retro-arcade-shooter-vs-alternatives.html">perbandingan</a>, dan <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a>.</p>
<p><a href="/games.html">&larr; Kembali ke games</a></p>
</div>`,
  de: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Retro Arcade Shooter spielen - Schritt fuer Schritt</b></h1>
<p>Die Seite <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> laedt Underrun im iframe (~120 KB). Saeubere die Anlage: WASD bewegen, Maus zielen, Klick halten zum Feuern, jeden CPU in drei Leveln rebooten. Play druecken.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Nur Tastatur + Maus. Braucht WebGL. Kein Touch - Handy laedt, spielt aber nicht.</b></p></div>
<h2><b>Schritt 1 - Play druecken</b></h2><p>Play injiziert das iframe (Underrun-Quellcode + PNG-Karten). Underrun von Dominic Szablewski (MIT); Musik Andreas Loesch; LICENSE daneben.</p>
<h2><b>Schritt 2 - Audio und Level 1</b></h2><p>Klick auf die Canvas fuer Audio (Sonant-X synthetisiert im Tab). Boot-Text; dann Level 1.</p>
<h2><b>Schritt 3 - bewegen und schiessen</b></h2><p>WASD oder Pfeile. Maus zielt. Linksklick halten (Plasma mit Cooldown). Spinnen-Nahkampf; Tuermen schiessen. Health-Packs einsammeln.</p>
<h2><b>Schritt 4 - CPUs rebooten</b></h2><p>Jeden CPU des Levels rebooten fuer den Ausgang. Drei Level. Bei Tod Reload nach ~3s.</p>
<h2><b>Schritt 5 - was fehlt</b></h2><p>Keine Saves, Scores oder Accounts. Kein Touch oder Gamepad. Eine Waffe. Geneigte Top-Down-Ansicht, kein FPS (<a href="/games/retro-fps-online.html">Retro FPS Online</a>).</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Punkt</th><th>Wert</th><th>Notiz</th></tr><tr><td>Download</td><td>~120 KB</td><td>Same-Origin-iframe</td></tr><tr><td>Renderer</td><td>WebGL 320x180</td><td>Braucht WebGL</td></tr><tr><td>Input</td><td>Tastatur + Maus</td><td>Kein Touch</td></tr><tr><td>Level</td><td>3</td><td>PNG-Karten</td></tr><tr><td>Saves</td><td>Keine</td><td>Kein Storage</td></tr></table>
<p>Siehe <a href="/guides/de/retro-arcade-shooter-when.html">wann spielen</a>, <a href="/guides/de/retro-arcade-shooter-vs-alternatives.html">Vergleiche</a> und <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a>.</p>
<p><a href="/games.html">&larr; Zurueck zu Games</a></p>
</div>`,
};

guides.when.html = {
  en: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Retro Arcade Shooter</b></h1>
<p><a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> fits when you want a ~120 KB WebGL top-down Underrun run with keyboard and mouse, three short levels, synthesized audio, and no browser saves.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>When you have a keyboard and mouse</b></h2><p>WASD move, mouse aim, hold click to fire. No touch controls and no gamepad - phones load the page but cannot play.</p>
<h2><b>When you want a tiny one-time download</b></h2><p>About 120 KB total. Music and SFX are synthesized in the tab (Sonant-X). Zero network calls after load.</p>
<h2><b>When short arcade runs are enough</b></h2><p>Exactly three levels. Death reloads the level after a few seconds. Nothing is saved between sessions.</p>
<h2><b>When to pick something else</b></h2><p>Want a tiny canvas twin-stick without WebGL maps? Try <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a> (~26 KB). Want a true first-person campaign with saves? Use <a href="/games/retro-fps-online.html">Retro FPS Online</a>.</p>
<p>See <a href="/guides/how-to-play-retro-arcade-shooter.html">how to play</a> and <a href="/guides/retro-arcade-shooter-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
  pt: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Quando Jogar Retro Arcade Shooter</b></h1>
<p><a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> serve quando voce quer um run Underrun WebGL ~120 KB com teclado e mouse, tres niveis curtos, audio sintetizado e sem saves.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Quando tem teclado e mouse</b></h2><p>WASD move, mouse mira, segure clique. Sem toque e sem gamepad - celular carrega mas nao joga.</p>
<h2><b>Quando o download minimo importa</b></h2><p>Cerca de 120 KB. Musica e SFX via Sonant-X no tab. Zero rede depois do load.</p>
<h2><b>Quando runs curtos bastam</b></h2><p>Exatamente tres niveis. Morte recarrega em poucos segundos. Nada salvo entre sessoes.</p>
<h2><b>Quando escolher outro</b></h2><p>Quer canvas twin-stick ~26 KB? Use <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a>. Quer campanha FPS com saves? Use <a href="/games/retro-fps-online.html">Retro FPS Online</a>.</p>
<p>Veja <a href="/guides/pt/how-to-play-retro-arcade-shooter.html">como jogar</a> e <a href="/guides/pt/retro-arcade-shooter-vs-alternatives.html">comparacoes</a>.</p>
<p><a href="/games.html">&larr; Voltar aos jogos</a></p>
</div>`,
  es: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Cuando Jugar Retro Arcade Shooter</b></h1>
<p><a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> encaja cuando quieres una partida Underrun WebGL ~120 KB con teclado y raton, tres niveles cortos, audio sintetizado y sin guardados.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Cuando tienes teclado y raton</b></h2><p>WASD mover, raton apuntar, mantén clic. Sin tactil ni mando - el movil carga pero no juega.</p>
<h2><b>Cuando importa la descarga minima</b></h2><p>Unos 120 KB. Musica y SFX con Sonant-X en la pestana. Cero red tras la carga.</p>
<h2><b>Cuando bastan partidas cortas</b></h2><p>Exactamente tres niveles. Al morir recarga en pocos segundos. Nada se guarda entre sesiones.</p>
<h2><b>Cuando elegir otro</b></h2><p>Quieres twin-stick canvas ~26 KB? Usa <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a>. Quieres campana FPS con guardados? Usa <a href="/games/retro-fps-online.html">Retro FPS Online</a>.</p>
<p>Ver <a href="/guides/es/how-to-play-retro-arcade-shooter.html">como jugar</a> y <a href="/guides/es/retro-arcade-shooter-vs-alternatives.html">comparaciones</a>.</p>
<p><a href="/games.html">&larr; Volver a juegos</a></p>
</div>`,
  vi: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Khi nao choi Retro Arcade Shooter</b></h1>
<p><a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> phu hop khi ban muon van Underrun WebGL ~120 KB voi ban phim va chuot, ba man ngan, am thanh tong hop, khong save.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Khi co ban phim va chuot</b></h2><p>WASD di chuyen, chuot ngam, giu click. Khong cam ung, khong gamepad - dien thoai tai duoc nhung khong choi duoc.</p>
<h2><b>Khi can tai nhe</b></h2><p>Khoang 120 KB. Nhac va SFX qua Sonant-X trong tab. Khong goi mang sau khi load.</p>
<h2><b>Khi chi can van ngan</b></h2><p>Dung ba man. Chet thi tai lai sau vai giay. Khong luu gi giua session.</p>
<h2><b>Khi chon game khac</b></h2><p>Muon twin-stick canvas ~26 KB? Dung <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a>. Muon FPS co save? Dung <a href="/games/retro-fps-online.html">Retro FPS Online</a>.</p>
<p>Xem <a href="/guides/vi/how-to-play-retro-arcade-shooter.html">cach choi</a> va <a href="/guides/vi/retro-arcade-shooter-vs-alternatives.html">so sanh</a>.</p>
<p><a href="/games.html">&larr; Ve games</a></p>
</div>`,
  id: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Kapan Main Retro Arcade Shooter</b></h1>
<p><a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> cocok saat Anda ingin run Underrun WebGL ~120 KB dengan keyboard dan mouse, tiga level singkat, audio sintetis, tanpa save.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Saat punya keyboard dan mouse</b></h2><p>WASD gerak, mouse bidik, tahan klik. Tanpa sentuh dan gamepad - ponsel memuat tapi tidak bisa main.</p>
<h2><b>Saat unduhan kecil penting</b></h2><p>Sekitar 120 KB. Musik dan SFX via Sonant-X di tab. Nol jaringan setelah load.</p>
<h2><b>Saat run singkat cukup</b></h2><p>Tepat tiga level. Mati = reload beberapa detik. Tidak ada yang disimpan antar sesi.</p>
<h2><b>Saat pilih yang lain</b></h2><p>Ingin twin-stick canvas ~26 KB? Pakai <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a>. Ingin kampanye FPS dengan save? Pakai <a href="/games/retro-fps-online.html">Retro FPS Online</a>.</p>
<p>Lihat <a href="/guides/id/how-to-play-retro-arcade-shooter.html">cara main</a> dan <a href="/guides/id/retro-arcade-shooter-vs-alternatives.html">perbandingan</a>.</p>
<p><a href="/games.html">&larr; Kembali ke games</a></p>
</div>`,
  de: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Wann Retro Arcade Shooter spielen</b></h1>
<p><a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> passt, wenn du einen ~120 KB WebGL-Underrun-Lauf mit Tastatur und Maus willst: drei kurze Level, synthetisiertes Audio, keine Browser-Saves.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Wenn Tastatur und Maus da sind</b></h2><p>WASD bewegen, Maus zielen, Klick halten. Kein Touch, kein Gamepad - Handy laedt, spielt aber nicht.</p>
<h2><b>Wenn der Download klein bleiben soll</b></h2><p>Etwa 120 KB. Musik und SFX via Sonant-X im Tab. Kein Netz nach dem Load.</p>
<h2><b>Wenn kurze Laeufe reichen</b></h2><p>Genau drei Level. Tod = Reload nach wenigen Sekunden. Nichts wird zwischen Sessions gespeichert.</p>
<h2><b>Wann etwas anderes</b></h2><p>Willst du Twin-Stick-Canvas ~26 KB? Nimm <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a>. Willst du FPS-Kampagne mit Saves? Nimm <a href="/games/retro-fps-online.html">Retro FPS Online</a>.</p>
<p>Siehe <a href="/guides/de/how-to-play-retro-arcade-shooter.html">Anleitung</a> und <a href="/guides/de/retro-arcade-shooter-vs-alternatives.html">Vergleiche</a>.</p>
<p><a href="/games.html">&larr; Zurueck zu Games</a></p>
</div>`,
};

guides.vs.html = {
  en: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Retro Arcade Shooter vs Alternatives</b></h1>
<p>Compare <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB Underrun, three top-down levels) with <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a> (~26 KB canvas) and <a href="/games/retro-fps-online.html">Retro FPS Online</a> (WASM Freedoom campaigns).</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Size / tech</th><th>View / input</th><th>Progress</th></tr>
<tr><td>Retro Arcade Shooter</td><td>~120 KB WebGL</td><td>Tilted top-down; keyboard + mouse</td><td>3 levels; no saves</td></tr>
<tr><td>Chili Blast Shooter</td><td>~26 KB canvas</td><td>Top-down twin-stick style</td><td>Arcade runs; tiny single file</td></tr>
<tr><td>Retro FPS Online</td><td>WASM + campaign data</td><td>First-person; click-gated downloads</td><td>Many levels; exportable saves</td></tr></table>
<h2><b>Pick Retro Arcade Shooter when</b></h2><p>You want the original Underrun facility run: reboot CPUs, plasma vs spiders and sentries, synthesized dark-synth audio, and a fixed three-level clear with zero storage.</p>
<h2><b>Pick Chili Blast Shooter when</b></h2><p>You want the smallest shooter payload (~26 KB) with procedural canvas art and chiptune SFX in one HTML file.</p>
<h2><b>Pick Retro FPS Online when</b></h2><p>You want a true first-person Freedoom campaign, offline play after the one-time download, and portable save export (.ftolfps).</p>
<p>See <a href="/guides/how-to-play-retro-arcade-shooter.html">how to play</a> and <a href="/guides/retro-arcade-shooter-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
  pt: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Retro Arcade Shooter vs Alternativas</b></h1>
<p>Compare <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB Underrun, tres niveis) com <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a> (~26 KB) e <a href="/games/retro-fps-online.html">Retro FPS Online</a> (WASM Freedoom).</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered w3-small"><tr><th>Jogo</th><th>Tamanho</th><th>Vista / input</th><th>Progresso</th></tr>
<tr><td>Retro Arcade Shooter</td><td>~120 KB WebGL</td><td>Top-down inclinada; teclado + mouse</td><td>3 niveis; sem saves</td></tr>
<tr><td>Chili Blast Shooter</td><td>~26 KB canvas</td><td>Top-down twin-stick</td><td>Runs arcade; um arquivo</td></tr>
<tr><td>Retro FPS Online</td><td>WASM + campanha</td><td>Primeira pessoa; download sob clique</td><td>Muitos niveis; saves exportaveis</td></tr></table>
<h2><b>Escolha Retro Arcade Shooter quando</b></h2><p>Quer o Underrun original: reboot de CPUs, plasma, audio sintetizado, tres niveis fixos sem storage.</p>
<h2><b>Escolha Chili Blast Shooter quando</b></h2><p>Quer o shooter mais leve (~26 KB) com arte canvas e chiptune num HTML.</p>
<h2><b>Escolha Retro FPS Online quando</b></h2><p>Quer campanha Freedoom em primeira pessoa, offline apos o download e export .ftolfps.</p>
<p>Veja <a href="/guides/pt/how-to-play-retro-arcade-shooter.html">como jogar</a> e <a href="/guides/pt/retro-arcade-shooter-when.html">quando encaixa</a>.</p>
<p><a href="/games.html">&larr; Voltar aos jogos</a></p>
</div>`,
  es: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Retro Arcade Shooter vs Alternativas</b></h1>
<p>Compara <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB Underrun, tres niveles) con <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a> (~26 KB) y <a href="/games/retro-fps-online.html">Retro FPS Online</a> (WASM Freedoom).</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered w3-small"><tr><th>Juego</th><th>Tamano</th><th>Vista / input</th><th>Progreso</th></tr>
<tr><td>Retro Arcade Shooter</td><td>~120 KB WebGL</td><td>Superior inclinada; teclado + raton</td><td>3 niveles; sin guardados</td></tr>
<tr><td>Chili Blast Shooter</td><td>~26 KB canvas</td><td>Superior twin-stick</td><td>Partidas arcade; un archivo</td></tr>
<tr><td>Retro FPS Online</td><td>WASM + campana</td><td>Primera persona; descarga al clic</td><td>Muchos niveles; saves exportables</td></tr></table>
<h2><b>Elige Retro Arcade Shooter cuando</b></h2><p>Quieres Underrun original: reboot de CPUs, plasma, audio sintetizado, tres niveles fijos sin storage.</p>
<h2><b>Elige Chili Blast Shooter cuando</b></h2><p>Quieres el shooter mas ligero (~26 KB) con canvas y chiptune en un HTML.</p>
<h2><b>Elige Retro FPS Online cuando</b></h2><p>Quieres campana Freedoom en primera persona, offline tras la descarga y export .ftolfps.</p>
<p>Ver <a href="/guides/es/how-to-play-retro-arcade-shooter.html">como jugar</a> y <a href="/guides/es/retro-arcade-shooter-when.html">cuando encaja</a>.</p>
<p><a href="/games.html">&larr; Volver a juegos</a></p>
</div>`,
  vi: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Retro Arcade Shooter vs lua chon khac</b></h1>
<p>So sanh <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB Underrun, ba man) voi <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a> (~26 KB) va <a href="/games/retro-fps-online.html">Retro FPS Online</a> (WASM Freedoom).</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Dung luong</th><th>Goc / input</th><th>Tien do</th></tr>
<tr><td>Retro Arcade Shooter</td><td>~120 KB WebGL</td><td>Top-down nghieng; ban phim + chuot</td><td>3 man; khong save</td></tr>
<tr><td>Chili Blast Shooter</td><td>~26 KB canvas</td><td>Top-down twin-stick</td><td>Van arcade; mot file</td></tr>
<tr><td>Retro FPS Online</td><td>WASM + chien dich</td><td>Ngoi thu nhat; tai khi click</td><td>Nhieu man; save xuat duoc</td></tr></table>
<h2><b>Chon Retro Arcade Shooter khi</b></h2><p>Muon Underrun goc: reboot CPU, plasma, am thanh tong hop, dung ba man, khong storage.</p>
<h2><b>Chon Chili Blast Shooter khi</b></h2><p>Muon shooter nhe nhat (~26 KB) canvas + chiptune trong mot HTML.</p>
<h2><b>Chon Retro FPS Online khi</b></h2><p>Muon chien dich Freedoom goc nhin thu nhat, offline sau khi tai, export .ftolfps.</p>
<p>Xem <a href="/guides/vi/how-to-play-retro-arcade-shooter.html">cach choi</a> va <a href="/guides/vi/retro-arcade-shooter-when.html">khi nao phu hop</a>.</p>
<p><a href="/games.html">&larr; Ve games</a></p>
</div>`,
  id: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Retro Arcade Shooter vs Alternatif</b></h1>
<p>Bandingkan <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB Underrun, tiga level) dengan <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a> (~26 KB) dan <a href="/games/retro-fps-online.html">Retro FPS Online</a> (WASM Freedoom).</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Ukuran</th><th>Sudut / input</th><th>Progres</th></tr>
<tr><td>Retro Arcade Shooter</td><td>~120 KB WebGL</td><td>Top-down miring; keyboard + mouse</td><td>3 level; tanpa save</td></tr>
<tr><td>Chili Blast Shooter</td><td>~26 KB canvas</td><td>Top-down twin-stick</td><td>Run arcade; satu file</td></tr>
<tr><td>Retro FPS Online</td><td>WASM + kampanye</td><td>Orang pertama; unduh saat klik</td><td>Banyak level; save bisa diekspor</td></tr></table>
<h2><b>Pilih Retro Arcade Shooter saat</b></h2><p>Ingin Underrun asli: reboot CPU, plasma, audio sintetis, tiga level tetap, tanpa storage.</p>
<h2><b>Pilih Chili Blast Shooter saat</b></h2><p>Ingin shooter paling ringan (~26 KB) canvas + chiptune dalam satu HTML.</p>
<h2><b>Pilih Retro FPS Online saat</b></h2><p>Ingin kampanye Freedoom orang pertama, offline setelah unduh, ekspor .ftolfps.</p>
<p>Lihat <a href="/guides/id/how-to-play-retro-arcade-shooter.html">cara main</a> dan <a href="/guides/id/retro-arcade-shooter-when.html">kapan cocok</a>.</p>
<p><a href="/games.html">&larr; Kembali ke games</a></p>
</div>`,
  de: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Retro Arcade Shooter vs Alternativen</b></h1>
<p>Vergleiche <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB Underrun, drei Level) mit <a href="/games/chili-blast-shooter.html">Chili Blast Shooter</a> (~26 KB) und <a href="/games/retro-fps-online.html">Retro FPS Online</a> (WASM Freedoom).</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered w3-small"><tr><th>Spiel</th><th>Groesse</th><th>Sicht / Input</th><th>Fortschritt</th></tr>
<tr><td>Retro Arcade Shooter</td><td>~120 KB WebGL</td><td>Geneigtes Top-Down; Tastatur + Maus</td><td>3 Level; keine Saves</td></tr>
<tr><td>Chili Blast Shooter</td><td>~26 KB Canvas</td><td>Top-Down Twin-Stick</td><td>Arcade-Laeufe; eine Datei</td></tr>
<tr><td>Retro FPS Online</td><td>WASM + Kampagne</td><td>Ego-Perspektive; Download per Klick</td><td>Viele Level; exportierbare Saves</td></tr></table>
<h2><b>Nimm Retro Arcade Shooter wenn</b></h2><p>Du Original-Underrun willst: CPUs rebooten, Plasma, synthetisiertes Audio, drei feste Level ohne Storage.</p>
<h2><b>Nimm Chili Blast Shooter wenn</b></h2><p>Du den leichtesten Shooter (~26 KB) mit Canvas und Chiptune in einer HTML-Datei willst.</p>
<h2><b>Nimm Retro FPS Online wenn</b></h2><p>Du eine Freedoom-Ego-Kampagne willst, offline nach dem Download, mit .ftolfps-Export.</p>
<p>Siehe <a href="/guides/de/how-to-play-retro-arcade-shooter.html">Anleitung</a> und <a href="/guides/de/retro-arcade-shooter-when.html">wann es passt</a>.</p>
<p><a href="/games.html">&larr; Zurueck zu Games</a></p>
</div>`,
};

const locales = ['en', 'pt', 'es', 'vi', 'id', 'de'];

function cmsSlug(slugBase, locale) {
  if (locale === 'en') return `guides${slugBase}`;
  return `guides${locale}${slugBase}`;
}

for (const g of Object.values(guides)) {
  for (const locale of locales) {
    const slug = cmsSlug(g.slugBase, locale);
    writeFileSync(join(CMS, `BODYHTML${slug}.html`), g.html[locale] + '\n');
    writeFileSync(join(CMS, `BODYTITLE${slug}.txt`), (locale === 'en' ? g.titleEn : g.titles[locale]) + '\n');
    writeFileSync(join(CMS, `BODYDESC${slug}.txt`), (locale === 'en' ? g.descEn : g.descs[locale]) + '\n');
    const jspDir = locale === 'en' ? JSP : join(JSP, locale);
    mkdirSync(jspDir, { recursive: true });
    writeFileSync(join(jspDir, `${g.route}.jsp`), jspTpl);
  }
}

const guideRoutes = [
  '/guides/how-to-play-retro-arcade-shooter.html',
  '/guides/retro-arcade-shooter-when.html',
  '/guides/retro-arcade-shooter-vs-alternatives.html',
  '/guides/pt/how-to-play-retro-arcade-shooter.html',
  '/guides/pt/retro-arcade-shooter-when.html',
  '/guides/pt/retro-arcade-shooter-vs-alternatives.html',
  '/guides/es/how-to-play-retro-arcade-shooter.html',
  '/guides/es/retro-arcade-shooter-when.html',
  '/guides/es/retro-arcade-shooter-vs-alternatives.html',
  '/guides/vi/how-to-play-retro-arcade-shooter.html',
  '/guides/vi/retro-arcade-shooter-when.html',
  '/guides/vi/retro-arcade-shooter-vs-alternatives.html',
  '/guides/id/how-to-play-retro-arcade-shooter.html',
  '/guides/id/retro-arcade-shooter-when.html',
  '/guides/id/retro-arcade-shooter-vs-alternatives.html',
  '/guides/de/how-to-play-retro-arcade-shooter.html',
  '/guides/de/retro-arcade-shooter-when.html',
  '/guides/de/retro-arcade-shooter-vs-alternatives.html',
];

const jspMaps = guideRoutes.map((r) => {
  const parts = r.replace('/guides/', '').replace('.html', '');
  const jsp = parts.includes('/') ? `guide/${parts}.jsp` : `guide/${parts}.jsp`;
  return `  '${r}': '${jsp}',`;
});

const sitePath = join(ROOT, 'scripts/site-data.mjs');
let site = readFileSync(sitePath, 'utf8');
if (!site.includes('how-to-play-retro-arcade-shooter')) {
  const guideBlock =
    `  // new-tool-discovery-loop-runbook fire306 (2026-07-18): retro-arcade-shooter companion guides\n` +
    guideRoutes.map((r) => `  '${r}',`).join('\n') +
    '\n';
  const jspBlock =
    `  // new-tool-discovery-loop-runbook fire306 (2026-07-18): retro-arcade-shooter companion guides\n` +
    jspMaps.join('\n') +
    '\n';
  const anchor = `  // game-discovery-loop-runbook fire133 (2026-07-18): ritual-catacombs companion guides`;
  if (!site.includes(anchor)) {
    throw new Error('site-data anchor missing: ritual-catacombs fire133');
  }
  // Insert GUIDE_ROUTES before first ritual anchor, JSP before second
  const first = site.indexOf(anchor);
  const second = site.indexOf(anchor, first + 1);
  if (second < 0) throw new Error('second ritual-catacombs anchor missing');
  site = site.slice(0, first) + guideBlock + site.slice(first);
  const second2 = site.indexOf(anchor, site.indexOf(anchor) + 1);
  site = site.slice(0, second2) + jspBlock + site.slice(second2);
  writeFileSync(sitePath, site);
  console.log('patched site-data.mjs');
} else {
  console.log('site-data already has retro-arcade-shooter guides');
}

console.log('Generated retro-arcade-shooter guide CMS + JSP (18 pages)');
