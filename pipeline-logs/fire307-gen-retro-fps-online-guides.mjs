#!/usr/bin/env node
/**
 * new-tool-discovery-loop fire307: companion guides for retro-fps-online
 * (3 angles x EN + pt/es/vi/id/de). Claims ONLY from tool-retrofpsonline/SKILL.md.
 * Peers: Retro Arcade Shooter (~120 KB Underrun top-down) + Voxel FPS Arena (~18 KB)
 * from their SKILL.md.
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
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
    route: 'how-to-play-retro-fps-online',
    slugBase: 'howtoplayretrofpsonline',
    titleEn: 'How to Play Retro FPS Online - Step by Step',
    descEn: 'How to play Retro FPS Online: pick a Freedoom campaign, wait for the one-time WASM download, play offline from IndexedDB, save in-game, export .ftolfps. Free browser FPS on FreeToolOnline.',
    titles: {
      pt: 'Como Jogar Retro FPS Online - Passo a Passo',
      es: 'Como Jugar Retro FPS Online - Paso a Paso',
      vi: 'Cach choi Retro FPS Online - tung buoc',
      id: 'Cara Main Retro FPS Online - Langkah demi Langkah',
      de: 'Retro FPS Online spielen - Schritt fuer Schritt',
    },
    descs: {
      pt: 'Como jogar Retro FPS Online: escolha uma campanha Freedoom, aguarde o download WASM uma vez, jogue offline do IndexedDB, salve no jogo, exporte .ftolfps.',
      es: 'Como jugar Retro FPS Online: elige una campana Freedoom, espera la descarga WASM una vez, juega offline desde IndexedDB, guarda en el juego, exporta .ftolfps.',
      vi: 'Cach choi Retro FPS Online: chon chien dich Freedoom, cho tai WASM mot lan, choi offline tu IndexedDB, save trong game, xuat .ftolfps.',
      id: 'Cara main Retro FPS Online: pilih kampanye Freedoom, tunggu unduhan WASM sekali, main offline dari IndexedDB, save in-game, ekspor .ftolfps.',
      de: 'Retro FPS Online spielen: Freedoom-Kampagne waehlen, einmaligen WASM-Download abwarten, offline aus IndexedDB spielen, im Spiel speichern, .ftolfps exportieren.',
    },
  },
  when: {
    route: 'retro-fps-online-when',
    slugBase: 'retrofpsonlinewhen',
    titleEn: 'When to Play Retro FPS Online',
    descEn: 'When Retro FPS Online fits: full Freedoom FPS in the browser, one-time campaign download, IndexedDB cache, in-game saves, portable .ftolfps export. Free on FreeToolOnline.',
    titles: {
      pt: 'Quando Jogar Retro FPS Online',
      es: 'Cuando Jugar Retro FPS Online',
      vi: 'Khi nao choi Retro FPS Online',
      id: 'Kapan Main Retro FPS Online',
      de: 'Wann Retro FPS Online spielen',
    },
    descs: {
      pt: 'Quando Retro FPS Online encaixa: FPS Freedoom completo no navegador, download unico, cache IndexedDB, saves no jogo, export .ftolfps.',
      es: 'Cuando encaja Retro FPS Online: FPS Freedoom completo en el navegador, descarga unica, cache IndexedDB, guardados in-game, export .ftolfps.',
      vi: 'Khi nao Retro FPS Online phu hop: FPS Freedoom day du tren trinh duyet, tai mot lan, cache IndexedDB, save trong game, xuat .ftolfps.',
      id: 'Kapan Retro FPS Online cocok: FPS Freedoom lengkap di browser, unduh sekali, cache IndexedDB, save in-game, ekspor .ftolfps.',
      de: 'Wann Retro FPS Online passt: volles Freedoom-FPS im Browser, einmaliger Download, IndexedDB-Cache, In-Game-Saves, .ftolfps-Export.',
    },
  },
  vs: {
    route: 'retro-fps-online-vs-alternatives',
    slugBase: 'retrofpsonlinevsalternatives',
    titleEn: 'Retro FPS Online vs Alternatives',
    descEn: 'Compare Retro FPS Online (WASM Freedoom campaigns + .ftolfps) with Retro Arcade Shooter (~120 KB) and Voxel FPS Arena (~18 KB). Free browser shooters on FreeToolOnline.',
    titles: {
      pt: 'Retro FPS Online vs Alternativas',
      es: 'Retro FPS Online vs Alternativas',
      vi: 'Retro FPS Online vs lua chon khac',
      id: 'Retro FPS Online vs Alternatif',
      de: 'Retro FPS Online vs Alternativen',
    },
    descs: {
      pt: 'Compare Retro FPS Online (campanhas WASM Freedoom + .ftolfps) com Retro Arcade Shooter (~120 KB) e Voxel FPS Arena (~18 KB).',
      es: 'Compara Retro FPS Online (campanas WASM Freedoom + .ftolfps) con Retro Arcade Shooter (~120 KB) y Voxel FPS Arena (~18 KB).',
      vi: 'So sanh Retro FPS Online (chien dich WASM Freedoom + .ftolfps) voi Retro Arcade Shooter (~120 KB) va Voxel FPS Arena (~18 KB).',
      id: 'Bandingkan Retro FPS Online (kampanye WASM Freedoom + .ftolfps) dengan Retro Arcade Shooter (~120 KB) dan Voxel FPS Arena (~18 KB).',
      de: 'Vergleiche Retro FPS Online (WASM-Freedoom-Kampagnen + .ftolfps) mit Retro Arcade Shooter (~120 KB) und Voxel FPS Arena (~18 KB).',
    },
  },
};

guides.howtoplay.html = {
  en: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>How to Play Retro FPS Online - Step by Step</b></h1>
<p>The <a href="/games/retro-fps-online.html">Retro FPS Online</a> page runs a complete Freedoom first-person shooter in WebAssembly. Pick a campaign card, wait for the one-time download, then play and save in this browser. Export a .ftolfps file to move progress to another computer.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Keyboard-first (arrows move, Ctrl fires, Space opens doors). Mouse turn after you click the screen. No download until you click a campaign card.</b></p></div>
<h2><b>Step 1 - open the page and read the cards</b></h2><p>Campaign 1 (four episodes, 36 levels), Campaign 2 (32 levels, wider bestiary, double-barrelled shotgun), and Import paint immediately. The status panel and storage estimate also render with zero network fetch.</p>
<h2><b>Step 2 - click one campaign</b></h2><p>Click Campaign 1 or Campaign 2. The page states the one-time download size, then streams engine + Freedoom data from the project's assets host into IndexedDB. Nothing is fetched before this click.</p>
<h2><b>Step 3 - reach the title screen and play</b></h2><p>When the download finishes, the engine title screen appears. Start from the in-game menu. Later visits load from IndexedDB and work offline. Music is synthesized on-device; sound effects come from the freely licensed game data.</p>
<h2><b>Step 4 - save, load, and export</b></h2><p>Press Esc for Save Game, Load Game, and settings - same pattern as the desktop originals. Saves stay in this browser across reloads. Use Export for a .ftolfps file of every slot and setting; Import on another machine validates the engine version before making saves loadable again.</p>
<h2><b>Step 5 - stop, switch campaigns, and limits</b></h2><p>Stop or switching campaigns reloads the page (one campaign per load); saves are unaffected. No multiplayer, accounts, or server storage. Touch-only phones are not the target. Clearing this site's data deletes cache and saves - keep .ftolfps backups.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Setting</th><th>Value</th><th>Notes</th></tr><tr><td>Engine</td><td>WASM (PrBoom+ family)</td><td>GPL-2.0; public CI build</td></tr><tr><td>Game</td><td>Freedoom 0.13.0</td><td>Freely licensed; not a commercial demo</td></tr><tr><td>Cache</td><td>IndexedDB</td><td>Keyed by engine version</td></tr><tr><td>Saves</td><td>In-browser + .ftolfps</td><td>Export/Import portable</td></tr><tr><td>Input</td><td>Keyboard + mouse</td><td>Focus required on the screen</td></tr></table>
<p>See <a href="/guides/retro-fps-online-when.html">when to play</a>, <a href="/guides/retro-fps-online-vs-alternatives.html">comparisons</a>, and <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
  pt: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Como Jogar Retro FPS Online - Passo a Passo</b></h1>
<p>A pagina <a href="/games/retro-fps-online.html">Retro FPS Online</a> roda Freedoom completo em WebAssembly. Escolha uma campanha, aguarde o download unico, jogue e salve neste navegador. Exporte .ftolfps para levar o progresso a outro PC.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Teclado primeiro (setas movem, Ctrl atira, Space abre portas). Mouse apos clicar na tela. Sem download ate clicar na campanha.</b></p></div>
<h2><b>Passo 1 - ver os cards</b></h2><p>Campanha 1 (36 niveis), Campanha 2 (32 niveis) e Import aparecem na hora. Zero rede ate o clique.</p>
<h2><b>Passo 2 - clicar uma campanha</b></h2><p>O download unico vai para IndexedDB. Nada e buscado antes deste clique.</p>
<h2><b>Passo 3 - tela de titulo</b></h2><p>Depois do download, menu do jogo. Visitas seguintes usam IndexedDB e funcionam offline.</p>
<h2><b>Passo 4 - salvar e exportar</b></h2><p>Esc abre Save/Load. Export gera .ftolfps; Import em outro PC valida a versao do engine.</p>
<h2><b>Passo 5 - limites</b></h2><p>Trocar campanha recarrega a pagina. Sem multiplayer ou contas. Celular so-toque nao e o alvo. Limpar dados do site apaga cache e saves.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Item</th><th>Valor</th><th>Notas</th></tr><tr><td>Engine</td><td>WASM</td><td>Familia PrBoom+</td></tr><tr><td>Jogo</td><td>Freedoom 0.13.0</td><td>Licenca livre</td></tr><tr><td>Cache</td><td>IndexedDB</td><td>Por versao do engine</td></tr><tr><td>Saves</td><td>Navegador + .ftolfps</td><td>Export/Import</td></tr><tr><td>Input</td><td>Teclado + mouse</td><td>Foco na tela</td></tr></table>
<p>Veja <a href="/guides/pt/retro-fps-online-when.html">quando jogar</a>, <a href="/guides/pt/retro-fps-online-vs-alternatives.html">comparacoes</a> e <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>.</p>
<p><a href="/games.html">&larr; Voltar aos jogos</a></p>
</div>`,
  es: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Como Jugar Retro FPS Online - Paso a Paso</b></h1>
<p>La pagina <a href="/games/retro-fps-online.html">Retro FPS Online</a> ejecuta Freedoom completo en WebAssembly. Elige una campana, espera la descarga unica, juega y guarda en este navegador. Exporta .ftolfps para llevar el progreso a otro PC.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Teclado primero (flechas mueven, Ctrl dispara, Space abre puertas). Raton tras clic en la pantalla. Sin descarga hasta clic en la campana.</b></p></div>
<h2><b>Paso 1 - ver las tarjetas</b></h2><p>Campana 1 (36 niveles), Campana 2 (32 niveles) e Import aparecen al instante. Cero red hasta el clic.</p>
<h2><b>Paso 2 - clic en una campana</b></h2><p>La descarga unica va a IndexedDB. Nada se pide antes de este clic.</p>
<h2><b>Paso 3 - pantalla de titulo</b></h2><p>Tras la descarga, menu del juego. Visitas siguientes usan IndexedDB y funcionan offline.</p>
<h2><b>Paso 4 - guardar y exportar</b></h2><p>Esc abre Save/Load. Export crea .ftolfps; Import en otro PC valida la version del motor.</p>
<h2><b>Paso 5 - limites</b></h2><p>Cambiar de campana recarga la pagina. Sin multiplayer ni cuentas. Movil solo tactil no es el objetivo. Borrar datos del sitio borra cache y guardados.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Item</th><th>Valor</th><th>Notas</th></tr><tr><td>Motor</td><td>WASM</td><td>Familia PrBoom+</td></tr><tr><td>Juego</td><td>Freedoom 0.13.0</td><td>Licencia libre</td></tr><tr><td>Cache</td><td>IndexedDB</td><td>Por version del motor</td></tr><tr><td>Saves</td><td>Navegador + .ftolfps</td><td>Export/Import</td></tr><tr><td>Input</td><td>Teclado + raton</td><td>Foco en pantalla</td></tr></table>
<p>Ver <a href="/guides/es/retro-fps-online-when.html">cuando jugar</a>, <a href="/guides/es/retro-fps-online-vs-alternatives.html">comparaciones</a> y <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>.</p>
<p><a href="/games.html">&larr; Volver a juegos</a></p>
</div>`,
  vi: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Cach choi Retro FPS Online - tung buoc</b></h1>
<p>Trang <a href="/games/retro-fps-online.html">Retro FPS Online</a> chay Freedoom day du bang WebAssembly. Chon chien dich, cho tai mot lan, choi va save tren trinh duyet nay. Xuat .ftolfps de mang tien do sang may khac.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Uu tien ban phim (mui ten di chuyen, Ctrl ban, Space mo cua). Chuot sau khi click man hinh. Khong tai truoc khi click chien dich.</b></p></div>
<h2><b>Buoc 1 - xem the</b></h2><p>Chien dich 1 (36 man), Chien dich 2 (32 man) va Import hien ngay. Khong goi mang truoc khi click.</p>
<h2><b>Buoc 2 - click mot chien dich</b></h2><p>Tai mot lan vao IndexedDB. Khong fetch truoc click nay.</p>
<h2><b>Buoc 3 - man hinh title</b></h2><p>Xong tai thi vao menu game. Lan sau load tu IndexedDB, choi offline duoc.</p>
<h2><b>Buoc 4 - save va xuat</b></h2><p>Esc mo Save/Load. Export tao .ftolfps; Import may khac se kiem tra phien ban engine.</p>
<h2><b>Buoc 5 - gioi han</b></h2><p>Doi chien dich se reload trang. Khong multiplayer hay tai khoan. Dien thoai chi cam ung khong phai muc tieu. Xoa du lieu site se mat cache va save.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Muc</th><th>Gia tri</th><th>Ghi chu</th></tr><tr><td>Engine</td><td>WASM</td><td>Ho PrBoom+</td></tr><tr><td>Game</td><td>Freedoom 0.13.0</td><td>Giay phep tu do</td></tr><tr><td>Cache</td><td>IndexedDB</td><td>Theo phien ban engine</td></tr><tr><td>Save</td><td>Trinh duyet + .ftolfps</td><td>Export/Import</td></tr><tr><td>Input</td><td>Ban phim + chuot</td><td>Can focus man hinh</td></tr></table>
<p>Xem <a href="/guides/vi/retro-fps-online-when.html">khi nao choi</a>, <a href="/guides/vi/retro-fps-online-vs-alternatives.html">so sanh</a> va <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>.</p>
<p><a href="/games.html">&larr; Ve games</a></p>
</div>`,
  id: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Cara Main Retro FPS Online - Langkah demi Langkah</b></h1>
<p>Halaman <a href="/games/retro-fps-online.html">Retro FPS Online</a> menjalankan Freedoom lengkap di WebAssembly. Pilih kampanye, tunggu unduhan sekali, main dan simpan di browser ini. Ekspor .ftolfps untuk memindah progres ke PC lain.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Keyboard dulu (panah gerak, Ctrl tembak, Space buka pintu). Mouse setelah klik layar. Tidak ada unduhan sebelum klik kampanye.</b></p></div>
<h2><b>Langkah 1 - lihat kartu</b></h2><p>Kampanye 1 (36 level), Kampanye 2 (32 level), dan Import muncul segera. Nol jaringan sampai klik.</p>
<h2><b>Langkah 2 - klik satu kampanye</b></h2><p>Unduhan sekali masuk IndexedDB. Tidak ada fetch sebelum klik ini.</p>
<h2><b>Langkah 3 - layar judul</b></h2><p>Setelah unduh, menu game. Kunjungan berikutnya dari IndexedDB dan bisa offline.</p>
<h2><b>Langkah 4 - simpan dan ekspor</b></h2><p>Esc membuka Save/Load. Export membuat .ftolfps; Import di PC lain memvalidasi versi engine.</p>
<h2><b>Langkah 5 - batas</b></h2><p>Ganti kampanye memuat ulang halaman. Tanpa multiplayer atau akun. Ponsel hanya sentuh bukan target. Hapus data situs menghapus cache dan save.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Item</th><th>Nilai</th><th>Catatan</th></tr><tr><td>Engine</td><td>WASM</td><td>Keluarga PrBoom+</td></tr><tr><td>Game</td><td>Freedoom 0.13.0</td><td>Lisensi bebas</td></tr><tr><td>Cache</td><td>IndexedDB</td><td>Per versi engine</td></tr><tr><td>Save</td><td>Browser + .ftolfps</td><td>Export/Import</td></tr><tr><td>Input</td><td>Keyboard + mouse</td><td>Fokus di layar</td></tr></table>
<p>Lihat <a href="/guides/id/retro-fps-online-when.html">kapan main</a>, <a href="/guides/id/retro-fps-online-vs-alternatives.html">perbandingan</a>, dan <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>.</p>
<p><a href="/games.html">&larr; Kembali ke games</a></p>
</div>`,
  de: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Retro FPS Online spielen - Schritt fuer Schritt</b></h1>
<p>Die Seite <a href="/games/retro-fps-online.html">Retro FPS Online</a> laeuft mit vollstaendigem Freedoom in WebAssembly. Kampagne waehlen, einmaligen Download abwarten, in diesem Browser spielen und speichern. .ftolfps exportieren, um den Fortschritt auf einen anderen PC zu bringen.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>Tastatur zuerst (Pfeile bewegen, Ctrl schiesst, Space oeffnet Tueren). Maus nach Klick auf den Screen. Kein Download vor dem Kampagnen-Klick.</b></p></div>
<h2><b>Schritt 1 - Karten lesen</b></h2><p>Kampagne 1 (36 Level), Kampagne 2 (32 Level) und Import erscheinen sofort. Kein Netz bis zum Klick.</p>
<h2><b>Schritt 2 - eine Kampagne klicken</b></h2><p>Der einmalige Download landet in IndexedDB. Vor diesem Klick wird nichts geholt.</p>
<h2><b>Schritt 3 - Titelbildschirm</b></h2><p>Nach dem Download das Spielmenue. Spaetere Besuche starten aus IndexedDB und funktionieren offline.</p>
<h2><b>Schritt 4 - speichern und exportieren</b></h2><p>Esc oeffnet Save/Load. Export erzeugt .ftolfps; Import auf einem anderen PC prueft die Engine-Version.</p>
<h2><b>Schritt 5 - Grenzen</b></h2><p>Kampagnenwechsel laedt die Seite neu. Kein Multiplayer, keine Accounts. Touch-only-Handys sind nicht das Ziel. Site-Daten loeschen entfernt Cache und Saves.</p>
<table class="w3-table w3-bordered w3-small"><tr><th>Punkt</th><th>Wert</th><th>Notiz</th></tr><tr><td>Engine</td><td>WASM</td><td>PrBoom+-Familie</td></tr><tr><td>Spiel</td><td>Freedoom 0.13.0</td><td>Freie Lizenz</td></tr><tr><td>Cache</td><td>IndexedDB</td><td>Pro Engine-Version</td></tr><tr><td>Saves</td><td>Browser + .ftolfps</td><td>Export/Import</td></tr><tr><td>Input</td><td>Tastatur + Maus</td><td>Fokus auf dem Screen</td></tr></table>
<p>Siehe <a href="/guides/de/retro-fps-online-when.html">wann spielen</a>, <a href="/guides/de/retro-fps-online-vs-alternatives.html">Vergleiche</a> und <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>.</p>
<p><a href="/games.html">&larr; Zurueck zu Games</a></p>
</div>`,
};

guides.when.html = {
  en: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>When to Play Retro FPS Online</b></h1>
<p><a href="/games/retro-fps-online.html">Retro FPS Online</a> fits when you want a full Freedoom first-person campaign in the browser: one-time download, IndexedDB cache, in-game saves, and portable .ftolfps export - no install and no account.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>When you have a keyboard (and ideally a mouse)</b></h2><p>Arrows move, Ctrl fires, Space opens doors, Esc opens the menu. Mouse turn after you click the screen. Touch-only phones are not the target.</p>
<h2><b>When you can wait for one download</b></h2><p>Campaign cards state the size before anything is fetched. After that, later visits start from IndexedDB and work offline.</p>
<h2><b>When you want real saves</b></h2><p>In-game Save/Load like the desktop originals, plus Export/Import of .ftolfps across machines (engine-version checked).</p>
<h2><b>When to pick something else</b></h2><p>Want a tiny top-down Underrun run with zero storage? Try <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB). Want a short js13k voxel FPS? Use <a href="/games/voxel-fps-arena.html">Voxel FPS Arena</a> (~18 KB).</p>
<p>See <a href="/guides/how-to-play-retro-fps-online.html">how to play</a> and <a href="/guides/retro-fps-online-vs-alternatives.html">comparisons</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
  pt: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Quando Jogar Retro FPS Online</b></h1>
<p><a href="/games/retro-fps-online.html">Retro FPS Online</a> serve quando voce quer uma campanha Freedoom completa no navegador: download unico, cache IndexedDB, saves no jogo e export .ftolfps - sem instalar e sem conta.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Quando tem teclado (e de preferencia mouse)</b></h2><p>Setas movem, Ctrl atira, Space abre portas. Celular so-toque nao e o alvo.</p>
<h2><b>Quando pode esperar um download</b></h2><p>Os cards mostram o tamanho antes de baixar. Depois, visitas usam IndexedDB e funcionam offline.</p>
<h2><b>Quando quer saves de verdade</b></h2><p>Save/Load no jogo mais Export/Import .ftolfps entre PCs.</p>
<h2><b>Quando escolher outro</b></h2><p>Quer Underrun top-down ~120 KB? Use <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>. Quer voxel FPS curto ~18 KB? Use <a href="/games/voxel-fps-arena.html">Voxel FPS Arena</a>.</p>
<p>Veja <a href="/guides/pt/how-to-play-retro-fps-online.html">como jogar</a> e <a href="/guides/pt/retro-fps-online-vs-alternatives.html">comparacoes</a>.</p>
<p><a href="/games.html">&larr; Voltar aos jogos</a></p>
</div>`,
  es: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Cuando Jugar Retro FPS Online</b></h1>
<p><a href="/games/retro-fps-online.html">Retro FPS Online</a> encaja cuando quieres una campana Freedoom completa en el navegador: descarga unica, cache IndexedDB, guardados in-game y export .ftolfps - sin instalar y sin cuenta.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Cuando tienes teclado (y mejor un raton)</b></h2><p>Flechas mueven, Ctrl dispara, Space abre puertas. Movil solo tactil no es el objetivo.</p>
<h2><b>Cuando puedes esperar una descarga</b></h2><p>Las tarjetas muestran el tamano antes de bajar. Luego IndexedDB y offline.</p>
<h2><b>Cuando quieres guardados reales</b></h2><p>Save/Load en el juego mas Export/Import .ftolfps entre PCs.</p>
<h2><b>Cuando elegir otro</b></h2><p>Quieres Underrun superior ~120 KB? Usa <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>. Quieres voxel FPS corto ~18 KB? Usa <a href="/games/voxel-fps-arena.html">Voxel FPS Arena</a>.</p>
<p>Ver <a href="/guides/es/how-to-play-retro-fps-online.html">como jugar</a> y <a href="/guides/es/retro-fps-online-vs-alternatives.html">comparaciones</a>.</p>
<p><a href="/games.html">&larr; Volver a juegos</a></p>
</div>`,
  vi: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Khi nao choi Retro FPS Online</b></h1>
<p><a href="/games/retro-fps-online.html">Retro FPS Online</a> phu hop khi ban muon chien dich Freedoom day du tren trinh duyet: tai mot lan, cache IndexedDB, save trong game va xuat .ftolfps - khong cai dat, khong tai khoan.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Khi co ban phim (va nen co chuot)</b></h2><p>Mui ten di chuyen, Ctrl ban, Space mo cua. Dien thoai chi cam ung khong phai muc tieu.</p>
<h2><b>Khi cho duoc mot lan tai</b></h2><p>The cho size truoc khi tai. Sau do IndexedDB va offline.</p>
<h2><b>Khi can save that</b></h2><p>Save/Load trong game plus Export/Import .ftolfps giua cac may.</p>
<h2><b>Khi chon game khac</b></h2><p>Muon Underrun top-down ~120 KB? Dung <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>. Muon voxel FPS ngan ~18 KB? Dung <a href="/games/voxel-fps-arena.html">Voxel FPS Arena</a>.</p>
<p>Xem <a href="/guides/vi/how-to-play-retro-fps-online.html">cach choi</a> va <a href="/guides/vi/retro-fps-online-vs-alternatives.html">so sanh</a>.</p>
<p><a href="/games.html">&larr; Ve games</a></p>
</div>`,
  id: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Kapan Main Retro FPS Online</b></h1>
<p><a href="/games/retro-fps-online.html">Retro FPS Online</a> cocok saat Anda ingin kampanye Freedoom lengkap di browser: unduh sekali, cache IndexedDB, save in-game, dan ekspor .ftolfps - tanpa instal dan tanpa akun.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Saat punya keyboard (idealnya juga mouse)</b></h2><p>Panah gerak, Ctrl tembak, Space buka pintu. Ponsel hanya sentuh bukan target.</p>
<h2><b>Saat bisa menunggu satu unduhan</b></h2><p>Kartu menyatakan ukuran sebelum unduh. Setelah itu IndexedDB dan offline.</p>
<h2><b>Saat ingin save sungguhan</b></h2><p>Save/Load in-game plus Export/Import .ftolfps antar mesin.</p>
<h2><b>Saat pilih yang lain</b></h2><p>Ingin Underrun top-down ~120 KB? Pakai <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>. Ingin voxel FPS singkat ~18 KB? Pakai <a href="/games/voxel-fps-arena.html">Voxel FPS Arena</a>.</p>
<p>Lihat <a href="/guides/id/how-to-play-retro-fps-online.html">cara main</a> dan <a href="/guides/id/retro-fps-online-vs-alternatives.html">perbandingan</a>.</p>
<p><a href="/games.html">&larr; Kembali ke games</a></p>
</div>`,
  de: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Wann Retro FPS Online spielen</b></h1>
<p><a href="/games/retro-fps-online.html">Retro FPS Online</a> passt, wenn du eine volle Freedoom-Ego-Kampagne im Browser willst: einmaliger Download, IndexedDB-Cache, In-Game-Saves und .ftolfps-Export - ohne Installation und ohne Account.</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>Wenn Tastatur da ist (ideal auch Maus)</b></h2><p>Pfeile bewegen, Ctrl schiesst, Space oeffnet Tueren. Touch-only-Handys sind nicht das Ziel.</p>
<h2><b>Wenn ein Download ok ist</b></h2><p>Karten nennen die Groesse vor dem Fetch. Danach IndexedDB und offline.</p>
<h2><b>Wenn echte Saves wichtig sind</b></h2><p>Save/Load im Spiel plus Export/Import von .ftolfps zwischen PCs.</p>
<h2><b>Wann etwas anderes</b></h2><p>Willst du Underrun Top-Down ~120 KB? Nimm <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>. Willst du kurzes Voxel-FPS ~18 KB? Nimm <a href="/games/voxel-fps-arena.html">Voxel FPS Arena</a>.</p>
<p>Siehe <a href="/guides/de/how-to-play-retro-fps-online.html">Anleitung</a> und <a href="/guides/de/retro-fps-online-vs-alternatives.html">Vergleiche</a>.</p>
<p><a href="/games.html">&larr; Zurueck zu Games</a></p>
</div>`,
};

guides.vs.html = {
  en: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Retro FPS Online vs Alternatives</b></h1>
<p>Compare <a href="/games/retro-fps-online.html">Retro FPS Online</a> (WASM Freedoom campaigns + .ftolfps) with <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB Underrun) and <a href="/games/voxel-fps-arena.html">Voxel FPS Arena</a> (~18 KB js13k).</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Size / tech</th><th>View / input</th><th>Progress</th></tr>
<tr><td>Retro FPS Online</td><td>WASM + campaign data</td><td>First-person; keyboard + mouse</td><td>Many levels; IndexedDB + .ftolfps</td></tr>
<tr><td>Retro Arcade Shooter</td><td>~120 KB WebGL</td><td>Tilted top-down; keyboard + mouse</td><td>3 levels; no saves</td></tr>
<tr><td>Voxel FPS Arena</td><td>~18 KB WebGL</td><td>First-person voxel; mouse aim</td><td>Short js13k runs</td></tr></table>
<h2><b>Pick Retro FPS Online when</b></h2><p>You want a complete Freedoom campaign, offline play after one download, in-game saves, and portable .ftolfps export.</p>
<h2><b>Pick Retro Arcade Shooter when</b></h2><p>You want a tiny Underrun facility clear with synthesized audio, three fixed levels, and zero browser storage.</p>
<h2><b>Pick Voxel FPS Arena when</b></h2><p>You want the smallest first-person payload (~18 KB) for a short voxel arena session behind Play.</p>
<p>See <a href="/guides/how-to-play-retro-fps-online.html">how to play</a> and <a href="/guides/retro-fps-online-when.html">when it fits</a>.</p>
<p><a href="/games.html">&larr; Back to games</a></p>
</div>`,
  pt: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Retro FPS Online vs Alternativas</b></h1>
<p>Compare <a href="/games/retro-fps-online.html">Retro FPS Online</a> (WASM Freedoom + .ftolfps) com <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB) e <a href="/games/voxel-fps-arena.html">Voxel FPS Arena</a> (~18 KB).</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered w3-small"><tr><th>Jogo</th><th>Tamanho</th><th>Vista / input</th><th>Progresso</th></tr>
<tr><td>Retro FPS Online</td><td>WASM + campanha</td><td>Primeira pessoa; teclado + mouse</td><td>Muitos niveis; IndexedDB + .ftolfps</td></tr>
<tr><td>Retro Arcade Shooter</td><td>~120 KB WebGL</td><td>Top-down inclinada</td><td>3 niveis; sem saves</td></tr>
<tr><td>Voxel FPS Arena</td><td>~18 KB WebGL</td><td>FPS voxel</td><td>Runs js13k curtos</td></tr></table>
<h2><b>Escolha Retro FPS Online quando</b></h2><p>Quer campanha Freedoom completa, offline apos um download, saves no jogo e export .ftolfps.</p>
<h2><b>Escolha Retro Arcade Shooter quando</b></h2><p>Quer Underrun leve com tres niveis e zero storage.</p>
<h2><b>Escolha Voxel FPS Arena quando</b></h2><p>Quer o FPS mais leve (~18 KB) para uma sessao voxel curta.</p>
<p>Veja <a href="/guides/pt/how-to-play-retro-fps-online.html">como jogar</a> e <a href="/guides/pt/retro-fps-online-when.html">quando encaixa</a>.</p>
<p><a href="/games.html">&larr; Voltar aos jogos</a></p>
</div>`,
  es: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Retro FPS Online vs Alternativas</b></h1>
<p>Compara <a href="/games/retro-fps-online.html">Retro FPS Online</a> (WASM Freedoom + .ftolfps) con <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB) y <a href="/games/voxel-fps-arena.html">Voxel FPS Arena</a> (~18 KB).</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered w3-small"><tr><th>Juego</th><th>Tamano</th><th>Vista / input</th><th>Progreso</th></tr>
<tr><td>Retro FPS Online</td><td>WASM + campana</td><td>Primera persona; teclado + raton</td><td>Muchos niveles; IndexedDB + .ftolfps</td></tr>
<tr><td>Retro Arcade Shooter</td><td>~120 KB WebGL</td><td>Superior inclinada</td><td>3 niveles; sin guardados</td></tr>
<tr><td>Voxel FPS Arena</td><td>~18 KB WebGL</td><td>FPS voxel</td><td>Partidas js13k cortas</td></tr></table>
<h2><b>Elige Retro FPS Online cuando</b></h2><p>Quieres campana Freedoom completa, offline tras una descarga, guardados in-game y export .ftolfps.</p>
<h2><b>Elige Retro Arcade Shooter cuando</b></h2><p>Quieres Underrun ligero con tres niveles y cero storage.</p>
<h2><b>Elige Voxel FPS Arena cuando</b></h2><p>Quieres el FPS mas ligero (~18 KB) para una sesion voxel corta.</p>
<p>Ver <a href="/guides/es/how-to-play-retro-fps-online.html">como jugar</a> y <a href="/guides/es/retro-fps-online-when.html">cuando encaja</a>.</p>
<p><a href="/games.html">&larr; Volver a juegos</a></p>
</div>`,
  vi: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Retro FPS Online vs lua chon khac</b></h1>
<p>So sanh <a href="/games/retro-fps-online.html">Retro FPS Online</a> (WASM Freedoom + .ftolfps) voi <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB) va <a href="/games/voxel-fps-arena.html">Voxel FPS Arena</a> (~18 KB).</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Dung luong</th><th>Goc / input</th><th>Tien do</th></tr>
<tr><td>Retro FPS Online</td><td>WASM + chien dich</td><td>Ngoi thu nhat; ban phim + chuot</td><td>Nhieu man; IndexedDB + .ftolfps</td></tr>
<tr><td>Retro Arcade Shooter</td><td>~120 KB WebGL</td><td>Top-down nghieng</td><td>3 man; khong save</td></tr>
<tr><td>Voxel FPS Arena</td><td>~18 KB WebGL</td><td>FPS voxel</td><td>Van js13k ngan</td></tr></table>
<h2><b>Chon Retro FPS Online khi</b></h2><p>Muon chien dich Freedoom day du, offline sau mot lan tai, save trong game va xuat .ftolfps.</p>
<h2><b>Chon Retro Arcade Shooter khi</b></h2><p>Muon Underrun nhe ba man, khong storage.</p>
<h2><b>Chon Voxel FPS Arena khi</b></h2><p>Muon FPS nhe nhat (~18 KB) cho phien voxel ngan.</p>
<p>Xem <a href="/guides/vi/how-to-play-retro-fps-online.html">cach choi</a> va <a href="/guides/vi/retro-fps-online-when.html">khi nao phu hop</a>.</p>
<p><a href="/games.html">&larr; Ve games</a></p>
</div>`,
  id: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Retro FPS Online vs Alternatif</b></h1>
<p>Bandingkan <a href="/games/retro-fps-online.html">Retro FPS Online</a> (WASM Freedoom + .ftolfps) dengan <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB) dan <a href="/games/voxel-fps-arena.html">Voxel FPS Arena</a> (~18 KB).</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered w3-small"><tr><th>Game</th><th>Ukuran</th><th>Sudut / input</th><th>Progres</th></tr>
<tr><td>Retro FPS Online</td><td>WASM + kampanye</td><td>Orang pertama; keyboard + mouse</td><td>Banyak level; IndexedDB + .ftolfps</td></tr>
<tr><td>Retro Arcade Shooter</td><td>~120 KB WebGL</td><td>Top-down miring</td><td>3 level; tanpa save</td></tr>
<tr><td>Voxel FPS Arena</td><td>~18 KB WebGL</td><td>FPS voxel</td><td>Run js13k singkat</td></tr></table>
<h2><b>Pilih Retro FPS Online saat</b></h2><p>Ingin kampanye Freedoom lengkap, offline setelah satu unduhan, save in-game, dan ekspor .ftolfps.</p>
<h2><b>Pilih Retro Arcade Shooter saat</b></h2><p>Ingin Underrun ringan tiga level tanpa storage.</p>
<h2><b>Pilih Voxel FPS Arena saat</b></h2><p>Ingin FPS paling ringan (~18 KB) untuk sesi voxel singkat.</p>
<p>Lihat <a href="/guides/id/how-to-play-retro-fps-online.html">cara main</a> dan <a href="/guides/id/retro-fps-online-when.html">kapan cocok</a>.</p>
<p><a href="/games.html">&larr; Kembali ke games</a></p>
</div>`,
  de: `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>Retro FPS Online vs Alternativen</b></h1>
<p>Vergleiche <a href="/games/retro-fps-online.html">Retro FPS Online</a> (WASM Freedoom + .ftolfps) mit <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB) und <a href="/games/voxel-fps-arena.html">Voxel FPS Arena</a> (~18 KB).</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered w3-small"><tr><th>Spiel</th><th>Groesse</th><th>Sicht / Input</th><th>Fortschritt</th></tr>
<tr><td>Retro FPS Online</td><td>WASM + Kampagne</td><td>Ego; Tastatur + Maus</td><td>Viele Level; IndexedDB + .ftolfps</td></tr>
<tr><td>Retro Arcade Shooter</td><td>~120 KB WebGL</td><td>Geneigtes Top-Down</td><td>3 Level; keine Saves</td></tr>
<tr><td>Voxel FPS Arena</td><td>~18 KB WebGL</td><td>Voxel-FPS</td><td>Kurze js13k-Laeufe</td></tr></table>
<h2><b>Nimm Retro FPS Online wenn</b></h2><p>Du eine volle Freedoom-Kampagne willst, offline nach einem Download, In-Game-Saves und .ftolfps-Export.</p>
<h2><b>Nimm Retro Arcade Shooter wenn</b></h2><p>Du leichtes Underrun mit drei Leveln und ohne Storage willst.</p>
<h2><b>Nimm Voxel FPS Arena wenn</b></h2><p>Du das leichteste FPS (~18 KB) fuer eine kurze Voxel-Session willst.</p>
<p>Siehe <a href="/guides/de/how-to-play-retro-fps-online.html">Anleitung</a> und <a href="/guides/de/retro-fps-online-when.html">wann es passt</a>.</p>
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
  '/guides/how-to-play-retro-fps-online.html',
  '/guides/retro-fps-online-when.html',
  '/guides/retro-fps-online-vs-alternatives.html',
  '/guides/pt/how-to-play-retro-fps-online.html',
  '/guides/pt/retro-fps-online-when.html',
  '/guides/pt/retro-fps-online-vs-alternatives.html',
  '/guides/es/how-to-play-retro-fps-online.html',
  '/guides/es/retro-fps-online-when.html',
  '/guides/es/retro-fps-online-vs-alternatives.html',
  '/guides/vi/how-to-play-retro-fps-online.html',
  '/guides/vi/retro-fps-online-when.html',
  '/guides/vi/retro-fps-online-vs-alternatives.html',
  '/guides/id/how-to-play-retro-fps-online.html',
  '/guides/id/retro-fps-online-when.html',
  '/guides/id/retro-fps-online-vs-alternatives.html',
  '/guides/de/how-to-play-retro-fps-online.html',
  '/guides/de/retro-fps-online-when.html',
  '/guides/de/retro-fps-online-vs-alternatives.html',
];

const jspMaps = guideRoutes.map((r) => {
  const parts = r.replace('/guides/', '').replace('.html', '');
  return `  '${r}': 'guide/${parts}.jsp',`;
});

const sitePath = join(ROOT, 'scripts/site-data.mjs');
let site = readFileSync(sitePath, 'utf8');
if (!site.includes('how-to-play-retro-fps-online')) {
  const guideBlock =
    `  // new-tool-discovery-loop-runbook fire307 (2026-07-18): retro-fps-online companion guides\n` +
    guideRoutes.map((r) => `  '${r}',`).join('\n') +
    '\n';
  const jspBlock =
    `  // new-tool-discovery-loop-runbook fire307 (2026-07-18): retro-fps-online companion guides\n` +
    jspMaps.join('\n') +
    '\n';
  const anchor = `  // game-discovery-loop-runbook fire133 (2026-07-18): ritual-catacombs companion guides`;
  if (!site.includes(anchor)) throw new Error('site-data anchor missing: ritual-catacombs fire133');
  const first = site.indexOf(anchor);
  site = site.slice(0, first) + guideBlock + site.slice(first);
  const second = site.indexOf(anchor, site.indexOf(anchor) + 1);
  if (second < 0) throw new Error('second ritual-catacombs anchor missing');
  site = site.slice(0, second) + jspBlock + site.slice(second);
  writeFileSync(sitePath, site);
  console.log('patched site-data.mjs');
} else {
  console.log('site-data already has retro-fps-online guides');
}

console.log('Generated retro-fps-online guide CMS + JSP (18 pages)');
