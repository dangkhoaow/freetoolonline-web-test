#!/usr/bin/env node
/**
 * new-tool-discovery-loop fire308: companion guides for asteroid-blaster
 * (3 angles x EN + pt/es/vi/id/de). Claims ONLY from tool-asteroidblaster/SKILL.md.
 * Peers: Retro Arcade Shooter (~120 KB) + Marble Maze (~1.7 MB) from their SKILL.md.
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

const meta = {
  howtoplay: {
    route: 'how-to-play-asteroid-blaster',
    slugBase: 'howtoplayasteroidblaster',
    titleEn: 'How to Play Asteroid Blaster - Step by Step',
    descEn: 'How to play Asteroid Blaster: click Play, rotate with arrows, thrust with up, fire with space, split rocks, dodge the alien. ~245 KB Canvas game on FreeToolOnline.',
    titles: {
      pt: 'Como Jogar Asteroid Blaster - Passo a Passo',
      es: 'Como Jugar Asteroid Blaster - Paso a Paso',
      vi: 'Cach choi Asteroid Blaster - tung buoc',
      id: 'Cara Main Asteroid Blaster - Langkah demi Langkah',
      de: 'Asteroid Blaster spielen - Schritt fuer Schritt',
    },
    descs: {
      pt: 'Como jogar Asteroid Blaster: Play, setas rotacionam, cima impulsiona, espaco atira, pedras se dividem, alien ocasional. ~245 KB no FreeToolOnline.',
      es: 'Como jugar Asteroid Blaster: Play, flechas rotan, arriba impulsa, espacio dispara, rocas se dividen, alien ocasional. ~245 KB en FreeToolOnline.',
      vi: 'Cach choi Asteroid Blaster: bam Play, mui ten xoay, len day, space ban, da vo manh, alien thinh thoang. ~245 KB tren FreeToolOnline.',
      id: 'Cara main Asteroid Blaster: klik Play, panah putar, atas dorong, spasi tembak, batu pecah, alien sesekali. ~245 KB di FreeToolOnline.',
      de: 'Asteroid Blaster spielen: Play, Pfeile drehen, Hoch schubst, Space schiesst, Felsen splitten, Alien gelegentlich. ~245 KB auf FreeToolOnline.',
    },
  },
  when: {
    route: 'asteroid-blaster-when',
    slugBase: 'asteroidblasterwhen',
    titleEn: 'When to Play Asteroid Blaster',
    descEn: 'When Asteroid Blaster fits: keyboard Canvas space shooter, ~245 KB, rock splitting, screen wrap, alien ship, no save needed. Free on FreeToolOnline.',
    titles: {
      pt: 'Quando Jogar Asteroid Blaster',
      es: 'Cuando Jugar Asteroid Blaster',
      vi: 'Khi nao choi Asteroid Blaster',
      id: 'Kapan Main Asteroid Blaster',
      de: 'Wann Asteroid Blaster spielen',
    },
    descs: {
      pt: 'Quando Asteroid Blaster encaixa: shooter Canvas no teclado, ~245 KB, pedras que se dividem, wrap de tela, alien, sem save.',
      es: 'Cuando encaja Asteroid Blaster: shooter Canvas de teclado, ~245 KB, rocas que se dividen, wrap de pantalla, alien, sin guardado.',
      vi: 'Khi nao Asteroid Blaster phu hop: shooter Canvas ban phim, ~245 KB, da vo manh, wrap man hinh, alien, khong can save.',
      id: 'Kapan Asteroid Blaster cocok: shooter Canvas keyboard, ~245 KB, batu pecah, wrap layar, alien, tanpa save.',
      de: 'Wann Asteroid Blaster passt: Tastatur-Canvas-Shooter, ~245 KB, Felsen-Split, Screen-Wrap, Alien, ohne Save.',
    },
  },
  vs: {
    route: 'asteroid-blaster-vs-alternatives',
    slugBase: 'asteroidblastervsalternatives',
    titleEn: 'Asteroid Blaster vs Alternatives',
    descEn: 'Compare Asteroid Blaster (~245 KB Canvas 2D) with Retro Arcade Shooter (~120 KB WebGL) and Marble Maze (~1.7 MB WebGL). Free browser games on FreeToolOnline.',
    titles: {
      pt: 'Asteroid Blaster vs Alternativas',
      es: 'Asteroid Blaster vs Alternativas',
      vi: 'Asteroid Blaster vs lua chon khac',
      id: 'Asteroid Blaster vs Alternatif',
      de: 'Asteroid Blaster vs Alternativen',
    },
    descs: {
      pt: 'Compare Asteroid Blaster (~245 KB Canvas 2D) com Retro Arcade Shooter (~120 KB WebGL) e Marble Maze (~1.7 MB WebGL).',
      es: 'Compara Asteroid Blaster (~245 KB Canvas 2D) con Retro Arcade Shooter (~120 KB WebGL) y Marble Maze (~1.7 MB WebGL).',
      vi: 'So sanh Asteroid Blaster (~245 KB Canvas 2D) voi Retro Arcade Shooter (~120 KB WebGL) va Marble Maze (~1.7 MB WebGL).',
      id: 'Bandingkan Asteroid Blaster (~245 KB Canvas 2D) dengan Retro Arcade Shooter (~120 KB WebGL) dan Marble Maze (~1.7 MB WebGL).',
      de: 'Vergleiche Asteroid Blaster (~245 KB Canvas 2D) mit Retro Arcade Shooter (~120 KB WebGL) und Marble Maze (~1.7 MB WebGL).',
    },
  },
};

function howto(lang) {
  const L = {
    en: {
      h1: 'How to Play Asteroid Blaster - Step by Step',
      lead: 'The <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> page runs a vector-style Canvas space shooter in a same-origin iframe. Click Play, then rotate, thrust, and fire at drifting rocks that split into smaller fragments. An alien ship occasionally fires back.',
      call: 'Keyboard only: left/right rotate, up thrusts, space fires. Pause with P, mute with M. About 245 KB total - no network after load.',
      s1: 'Step 1 - open the page',
      p1: 'The launch panel, Play button, and status line render immediately. The game iframe does not load until you click Play.',
      s2: 'Step 2 - click Play',
      p2: 'Play injects the iframe at /games/asteroid-blaster/. The Canvas field shows the ship, rock outlines, and score. Total payload is about 245 KB (game code, jQuery, two WAV effects).',
      s3: 'Step 3 - fly and shoot',
      p3: 'Left/right arrows rotate. Hold up to thrust (speed is capped). Space fires. The play field wraps at every edge - fly or shoot off one side and you reappear on the opposite side.',
      s4: 'Step 4 - clear rocks and waves',
      p4: 'Each rock hit splits into three smaller fragments until pieces are small enough to destroy outright. Clearing the field starts the next wave with one more rock, capped at twelve. You start with two spare ships.',
      s5: 'Step 5 - alien, pause, limits',
      p5: 'An alien ship can drift in, fire back, and score 200 points when destroyed. P pauses; M mutes laser/explosion sounds. No touch controls, no save, no accounts - closing the tab ends the run.',
      th: ['Setting', 'Value', 'Notes'],
      rows: [
        ['Engine', 'Canvas 2D + jQuery', 'Same-origin iframe'],
        ['Size', '~245 KB', 'Cached after first load'],
        ['Controls', 'Arrows + space', 'P pause, M mute'],
        ['Waves', '2 to 12 rocks', 'Plus one rock each clear'],
        ['Lives', '2 spares', 'No localStorage save'],
      ],
      see: 'See <a href="/guides/asteroid-blaster-when.html">when to play</a>, <a href="/guides/asteroid-blaster-vs-alternatives.html">comparisons</a>, and <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>.',
      back: 'Back to games',
    },
    pt: {
      h1: 'Como Jogar Asteroid Blaster - Passo a Passo',
      lead: 'A pagina <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> roda um shooter Canvas em iframe. Clique Play, gire, impulsione e atire em pedras que se dividem. Um alien dispara de volta.',
      call: 'So teclado: esquerda/direita giram, cima impulsiona, espaco atira. P pausa, M silencia. ~245 KB - sem rede depois do load.',
      s1: 'Passo 1 - abrir a pagina', s2: 'Passo 2 - clicar Play', s3: 'Passo 3 - voar e atirar',
      s4: 'Passo 4 - limpar ondas', s5: 'Passo 5 - alien e limites',
      p1: 'O painel e o botao Play aparecem na hora. O iframe so carrega apos Play.',
      p2: 'Play injeta /games/asteroid-blaster/. Canvas mostra nave, pedras e score. ~245 KB no total.',
      p3: 'Setas giram; cima impulsiona; espaco atira. A tela faz wrap nas bordas.',
      p4: 'Cada acerto divide a pedra em tres. Limpar o campo sobe a onda (+1 pedra, max 12). Duas naves reserva.',
      p5: 'Alien ocasional vale 200 pontos. P pausa; M silencia. Sem toque, sem save, sem contas.',
      th: ['Item', 'Valor', 'Notas'],
      rows: [
        ['Engine', 'Canvas 2D + jQuery', 'Iframe same-origin'],
        ['Tamanho', '~245 KB', 'Cache apos 1o load'],
        ['Controles', 'Setas + espaco', 'P pausa, M mute'],
        ['Ondas', '2 a 12 pedras', '+1 a cada limpeza'],
        ['Vidas', '2 reservas', 'Sem localStorage'],
      ],
      see: 'Veja <a href="/guides/pt/asteroid-blaster-when.html">quando jogar</a>, <a href="/guides/pt/asteroid-blaster-vs-alternatives.html">comparacoes</a> e <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>.',
      back: 'Voltar aos jogos',
    },
    es: {
      h1: 'Como Jugar Asteroid Blaster - Paso a Paso',
      lead: 'La pagina <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> ejecuta un shooter Canvas en iframe. Pulsa Play, gira, impulsa y dispara a rocas que se dividen. Un alien dispara de vuelta.',
      call: 'Solo teclado: izquierda/derecha giran, arriba impulsa, espacio dispara. P pausa, M silencia. ~245 KB - sin red tras la carga.',
      s1: 'Paso 1 - abrir la pagina', s2: 'Paso 2 - pulsar Play', s3: 'Paso 3 - volar y disparar',
      s4: 'Paso 4 - limpiar olas', s5: 'Paso 5 - alien y limites',
      p1: 'El panel y Play aparecen al instante. El iframe solo carga tras Play.',
      p2: 'Play inyecta /games/asteroid-blaster/. Canvas muestra nave, rocas y score. ~245 KB.',
      p3: 'Flechas giran; arriba impulsa; espacio dispara. La pantalla hace wrap en los bordes.',
      p4: 'Cada impacto divide la roca en tres. Limpiar el campo sube la ola (+1, max 12). Dos naves de reserva.',
      p5: 'Alien ocasional vale 200 puntos. P pausa; M silencia. Sin tactil, sin guardado, sin cuentas.',
      th: ['Item', 'Valor', 'Notas'],
      rows: [
        ['Motor', 'Canvas 2D + jQuery', 'Iframe same-origin'],
        ['Tamano', '~245 KB', 'Cache tras 1a carga'],
        ['Controles', 'Flechas + espacio', 'P pausa, M mute'],
        ['Olas', '2 a 12 rocas', '+1 cada limpia'],
        ['Vidas', '2 reservas', 'Sin localStorage'],
      ],
      see: 'Ver <a href="/guides/es/asteroid-blaster-when.html">cuando jugar</a>, <a href="/guides/es/asteroid-blaster-vs-alternatives.html">comparaciones</a> y <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>.',
      back: 'Volver a juegos',
    },
    vi: {
      h1: 'Cach choi Asteroid Blaster - tung buoc',
      lead: 'Trang <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> chay shooter Canvas trong iframe. Bam Play, xoay, day, ban da vo manh. Alien thinh thoang ban lai.',
      call: 'Chi ban phim: trai/phai xoay, len day, space ban. P tam dung, M tat tieng. ~245 KB - khong mang sau khi load.',
      s1: 'Buoc 1 - mo trang', s2: 'Buoc 2 - bam Play', s3: 'Buoc 3 - bay va ban',
      s4: 'Buoc 4 - xoa song', s5: 'Buoc 5 - alien va gioi han',
      p1: 'Panel va Play hien ngay. Iframe chi load sau Play.',
      p2: 'Play chen /games/asteroid-blaster/. Canvas hien tau, da, diem. ~245 KB.',
      p3: 'Mui ten xoay; len day; space ban. Man hinh wrap o mep.',
      p4: 'Moi lan trung da tach thanh ba. Xoa het thi song moi (+1, toi da 12). Hai mang du phong.',
      p5: 'Alien thinh thoang: 200 diem. P pause; M mute. Khong cam ung, khong save, khong tai khoan.',
      th: ['Muc', 'Gia tri', 'Ghi chu'],
      rows: [
        ['Engine', 'Canvas 2D + jQuery', 'Iframe same-origin'],
        ['Size', '~245 KB', 'Cache sau lan dau'],
        ['Dieu khien', 'Mui ten + space', 'P pause, M mute'],
        ['Song', '2 den 12 da', '+1 moi lan xoa'],
        ['Mang', '2 du phong', 'Khong localStorage'],
      ],
      see: 'Xem <a href="/guides/vi/asteroid-blaster-when.html">khi nao choi</a>, <a href="/guides/vi/asteroid-blaster-vs-alternatives.html">so sanh</a> va <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>.',
      back: 'Ve games',
    },
    id: {
      h1: 'Cara Main Asteroid Blaster - Langkah demi Langkah',
      lead: 'Halaman <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> menjalankan shooter Canvas di iframe. Klik Play, putar, dorong, tembak batu yang pecah. Alien sesekali menembak balik.',
      call: 'Keyboard saja: kiri/kanan putar, atas dorong, spasi tembak. P jeda, M bisu. ~245 KB - tanpa jaringan setelah load.',
      s1: 'Langkah 1 - buka halaman', s2: 'Langkah 2 - klik Play', s3: 'Langkah 3 - terbang dan tembak',
      s4: 'Langkah 4 - bersihkan gelombang', s5: 'Langkah 5 - alien dan batas',
      p1: 'Panel dan Play muncul segera. Iframe hanya load setelah Play.',
      p2: 'Play menyisipkan /games/asteroid-blaster/. Canvas menampilkan kapal, batu, skor. ~245 KB.',
      p3: 'Panah putar; atas dorong; spasi tembak. Layar wrap di tepi.',
      p4: 'Setiap hit memecah batu menjadi tiga. Bersihkan lapangan untuk gelombang berikutnya (+1, max 12). Dua nyawa cadangan.',
      p5: 'Alien sesekali: 200 poin. P jeda; M bisu. Tanpa sentuh, tanpa save, tanpa akun.',
      th: ['Item', 'Nilai', 'Catatan'],
      rows: [
        ['Engine', 'Canvas 2D + jQuery', 'Iframe same-origin'],
        ['Ukuran', '~245 KB', 'Cache setelah load pertama'],
        ['Kontrol', 'Panah + spasi', 'P jeda, M mute'],
        ['Gelombang', '2 sampai 12 batu', '+1 tiap bersih'],
        ['Nyawa', '2 cadangan', 'Tanpa localStorage'],
      ],
      see: 'Lihat <a href="/guides/id/asteroid-blaster-when.html">kapan main</a>, <a href="/guides/id/asteroid-blaster-vs-alternatives.html">perbandingan</a>, dan <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>.',
      back: 'Kembali ke games',
    },
    de: {
      h1: 'Asteroid Blaster spielen - Schritt fuer Schritt',
      lead: 'Die Seite <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> laeuft als Canvas-Shooter im iframe. Play klicken, drehen, schubsen, auf Felsen schiessen die splitten. Ein Alien schiesst zurueck.',
      call: 'Nur Tastatur: Links/Rechts drehen, Hoch schubst, Space schiesst. P pausiert, M stumm. ~245 KB - kein Netz nach dem Load.',
      s1: 'Schritt 1 - Seite oeffnen', s2: 'Schritt 2 - Play klicken', s3: 'Schritt 3 - fliegen und schiessen',
      s4: 'Schritt 4 - Wellen raeumen', s5: 'Schritt 5 - Alien und Grenzen',
      p1: 'Panel und Play erscheinen sofort. Das iframe laedt erst nach Play.',
      p2: 'Play injiziert /games/asteroid-blaster/. Canvas zeigt Schiff, Felsen, Score. ~245 KB.',
      p3: 'Pfeile drehen; Hoch schubst; Space schiesst. Das Feld wrappt an allen Raendern.',
      p4: 'Jeder Treffer teilt den Felsen in drei. Feld leer = naechste Welle (+1, max 12). Zwei Ersatzschiffe.',
      p5: 'Alien gelegentlich: 200 Punkte. P Pause; M Mute. Kein Touch, kein Save, keine Accounts.',
      th: ['Punkt', 'Wert', 'Notiz'],
      rows: [
        ['Engine', 'Canvas 2D + jQuery', 'Same-Origin-Iframe'],
        ['Groesse', '~245 KB', 'Cache nach erstem Load'],
        ['Steuerung', 'Pfeile + Space', 'P Pause, M Mute'],
        ['Wellen', '2 bis 12 Felsen', '+1 je Clear'],
        ['Leben', '2 Ersatz', 'Kein localStorage'],
      ],
      see: 'Siehe <a href="/guides/de/asteroid-blaster-when.html">wann spielen</a>, <a href="/guides/de/asteroid-blaster-vs-alternatives.html">Vergleiche</a> und <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>.',
      back: 'Zurueck zu Games',
    },
  }[lang];
  const rows = L.rows.map(([a, b, c]) => `<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`).join('');
  return `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${L.h1}</b></h1>
<p>${L.lead}</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<div class="w3-panel w3-pale-green w3-leftbar w3-border-green"><p style="margin-bottom:0;"><b>${L.call}</b></p></div>
<h2><b>${L.s1}</b></h2><p>${L.p1}</p>
<h2><b>${L.s2}</b></h2><p>${L.p2}</p>
<h2><b>${L.s3}</b></h2><p>${L.p3}</p>
<h2><b>${L.s4}</b></h2><p>${L.p4}</p>
<h2><b>${L.s5}</b></h2><p>${L.p5}</p>
<table class="w3-table w3-bordered w3-small"><tr><th>${L.th[0]}</th><th>${L.th[1]}</th><th>${L.th[2]}</th></tr>${rows}</table>
<p>${L.see}</p>
<p><a href="/games.html">&larr; ${L.back}</a></p>
</div>`;
}

function whenHtml(lang) {
  const L = {
    en: {
      h1: 'When to Play Asteroid Blaster',
      lead: '<a href="/games/asteroid-blaster.html">Asteroid Blaster</a> fits when you want a keyboard Canvas space shooter in the browser: ~245 KB, rock splitting, screen wrap, and an occasional alien - no install and no save file.',
      h2a: 'When you have a keyboard',
      pa: 'Left/right rotate, up thrusts, space fires. Pause with P, mute with M. Touch-only phones are not the target.',
      h2b: 'When you want a short arcade run',
      pb: 'Waves grow from 2 rocks up to 12. Two spare ships. Closing the tab ends the score - there is no localStorage save.',
      h2c: 'When a tiny download is enough',
      pc: 'About 245 KB total, cached after the first load. No network calls after load, no accounts inside the game frame.',
      h2d: 'When to pick something else',
      pd: 'Want a WebGL Underrun run at ~120 KB? Try <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>. Want a 3D marble tilt at ~1.7 MB? Use <a href="/games/marble-maze.html">Marble Maze</a>.',
      see: 'See <a href="/guides/how-to-play-asteroid-blaster.html">how to play</a> and <a href="/guides/asteroid-blaster-vs-alternatives.html">comparisons</a>.',
      back: 'Back to games',
    },
    pt: {
      h1: 'Quando Jogar Asteroid Blaster',
      lead: '<a href="/games/asteroid-blaster.html">Asteroid Blaster</a> serve quando voce quer um shooter Canvas no teclado: ~245 KB, pedras que se dividem, wrap de tela e alien ocasional - sem instalar e sem save.',
      h2a: 'Quando tem teclado', pa: 'Setas e espaco. P pausa, M silencia. Celular so-toque nao e o alvo.',
      h2b: 'Quando quer uma corrida arcade curta', pb: 'Ondas de 2 a 12 pedras. Duas reservas. Fechar a aba encerra o score - sem localStorage.',
      h2c: 'Quando um download pequeno basta', pc: '~245 KB, cache apos o primeiro load. Sem rede depois, sem contas.',
      h2d: 'Quando escolher outra coisa', pd: 'Quer Underrun WebGL ~120 KB? <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>. Quer marble 3D ~1.7 MB? <a href="/games/marble-maze.html">Marble Maze</a>.',
      see: 'Veja <a href="/guides/pt/how-to-play-asteroid-blaster.html">como jogar</a> e <a href="/guides/pt/asteroid-blaster-vs-alternatives.html">comparacoes</a>.',
      back: 'Voltar aos jogos',
    },
    es: {
      h1: 'Cuando Jugar Asteroid Blaster',
      lead: '<a href="/games/asteroid-blaster.html">Asteroid Blaster</a> encaja cuando quieres un shooter Canvas de teclado: ~245 KB, rocas que se dividen, wrap de pantalla y alien ocasional - sin instalar y sin guardado.',
      h2a: 'Cuando tienes teclado', pa: 'Flechas y espacio. P pausa, M silencia. Movil solo tactil no es el objetivo.',
      h2b: 'Cuando quieres una partida arcade corta', pb: 'Olas de 2 a 12 rocas. Dos reservas. Cerrar la pestana termina el score - sin localStorage.',
      h2c: 'Cuando basta una descarga pequena', pc: '~245 KB, cache tras la primera carga. Sin red despues, sin cuentas.',
      h2d: 'Cuando elegir otra cosa', pd: 'Quieres Underrun WebGL ~120 KB? <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>. Quieres marble 3D ~1.7 MB? <a href="/games/marble-maze.html">Marble Maze</a>.',
      see: 'Ver <a href="/guides/es/how-to-play-asteroid-blaster.html">como jugar</a> y <a href="/guides/es/asteroid-blaster-vs-alternatives.html">comparaciones</a>.',
      back: 'Volver a juegos',
    },
    vi: {
      h1: 'Khi nao choi Asteroid Blaster',
      lead: '<a href="/games/asteroid-blaster.html">Asteroid Blaster</a> phu hop khi ban muon shooter Canvas ban phim: ~245 KB, da vo manh, wrap man hinh, alien thinh thoang - khong cai dat, khong save.',
      h2a: 'Khi co ban phim', pa: 'Mui ten va space. P pause, M mute. Dien thoai chi cam ung khong phai muc tieu.',
      h2b: 'Khi muon van arcade ngan', pb: 'Song tu 2 den 12 da. Hai mang du phong. Dong tab mat diem - khong localStorage.',
      h2c: 'Khi tai nhe la du', pc: '~245 KB, cache sau lan dau. Khong mang sau load, khong tai khoan.',
      h2d: 'Khi chon cai khac', pd: 'Muon Underrun WebGL ~120 KB? <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>. Muon marble 3D ~1.7 MB? <a href="/games/marble-maze.html">Marble Maze</a>.',
      see: 'Xem <a href="/guides/vi/how-to-play-asteroid-blaster.html">cach choi</a> va <a href="/guides/vi/asteroid-blaster-vs-alternatives.html">so sanh</a>.',
      back: 'Ve games',
    },
    id: {
      h1: 'Kapan Main Asteroid Blaster',
      lead: '<a href="/games/asteroid-blaster.html">Asteroid Blaster</a> cocok saat Anda ingin shooter Canvas keyboard: ~245 KB, batu pecah, wrap layar, alien sesekali - tanpa instal dan tanpa save.',
      h2a: 'Saat punya keyboard', pa: 'Panah dan spasi. P jeda, M bisu. Ponsel hanya sentuh bukan target.',
      h2b: 'Saat ingin sesi arcade singkat', pb: 'Gelombang 2 sampai 12 batu. Dua nyawa cadangan. Tutup tab mengakhiri skor - tanpa localStorage.',
      h2c: 'Saat unduhan kecil cukup', pc: '~245 KB, cache setelah load pertama. Tanpa jaringan setelahnya, tanpa akun.',
      h2d: 'Saat pilih yang lain', pd: 'Ingin Underrun WebGL ~120 KB? <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>. Ingin marble 3D ~1.7 MB? <a href="/games/marble-maze.html">Marble Maze</a>.',
      see: 'Lihat <a href="/guides/id/how-to-play-asteroid-blaster.html">cara main</a> dan <a href="/guides/id/asteroid-blaster-vs-alternatives.html">perbandingan</a>.',
      back: 'Kembali ke games',
    },
    de: {
      h1: 'Wann Asteroid Blaster spielen',
      lead: '<a href="/games/asteroid-blaster.html">Asteroid Blaster</a> passt, wenn du einen Tastatur-Canvas-Shooter willst: ~245 KB, Felsen-Split, Screen-Wrap und gelegentliches Alien - ohne Install und ohne Save.',
      h2a: 'Wenn du eine Tastatur hast', pa: 'Pfeile und Space. P Pause, M Mute. Touch-only-Handys sind nicht das Ziel.',
      h2b: 'Wenn du eine kurze Arcade-Runde willst', pb: 'Wellen von 2 bis 12 Felsen. Zwei Ersatzschiffe. Tab schliessen beendet den Score - kein localStorage.',
      h2c: 'Wenn ein kleiner Download reicht', pc: '~245 KB, Cache nach dem ersten Load. Kein Netz danach, keine Accounts.',
      h2d: 'Wann etwas anderes', pd: 'Willst du Underrun WebGL ~120 KB? <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a>. Willst du Marble 3D ~1.7 MB? <a href="/games/marble-maze.html">Marble Maze</a>.',
      see: 'Siehe <a href="/guides/de/how-to-play-asteroid-blaster.html">Anleitung</a> und <a href="/guides/de/asteroid-blaster-vs-alternatives.html">Vergleiche</a>.',
      back: 'Zurueck zu Games',
    },
  }[lang];
  return `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${L.h1}</b></h1>
<p>${L.lead}</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<h2><b>${L.h2a}</b></h2><p>${L.pa}</p>
<h2><b>${L.h2b}</b></h2><p>${L.pb}</p>
<h2><b>${L.h2c}</b></h2><p>${L.pc}</p>
<h2><b>${L.h2d}</b></h2><p>${L.pd}</p>
<p>${L.see}</p>
<p><a href="/games.html">&larr; ${L.back}</a></p>
</div>`;
}

function vsHtml(lang) {
  const L = {
    en: {
      h1: 'Asteroid Blaster vs Alternatives',
      lead: 'Compare <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> (~245 KB Canvas 2D) with <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB WebGL) and <a href="/games/marble-maze.html">Marble Maze</a> (~1.7 MB WebGL).',
      th: ['Game', 'Size', 'View / input', 'Progress'],
      rows: [
        ['Asteroid Blaster', '~245 KB Canvas 2D', 'Top-down vector; keyboard', 'Endless waves; no save'],
        ['Retro Arcade Shooter', '~120 KB WebGL', 'Tilted top-down; keyboard', '3 levels; no save'],
        ['Marble Maze', '~1.7 MB WebGL', '3D tilt maze; keyboard/tilt', 'Level paths; no account'],
      ],
      h2a: 'Pick Asteroid Blaster when', pa: 'You want classic rock-splitting, screen wrap, and an alien ship on a tiny Canvas payload.',
      h2b: 'Pick Retro Arcade Shooter when', pb: 'You want a lighter WebGL Underrun run with three scripted levels.',
      h2c: 'Pick Marble Maze when', pc: 'You want a 3D marble tilt maze instead of a space shooter.',
      see: 'See <a href="/guides/how-to-play-asteroid-blaster.html">how to play</a> and <a href="/guides/asteroid-blaster-when.html">when it fits</a>.',
      back: 'Back to games',
    },
    pt: {
      h1: 'Asteroid Blaster vs Alternativas',
      lead: 'Compare <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> (~245 KB Canvas 2D) com <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB WebGL) e <a href="/games/marble-maze.html">Marble Maze</a> (~1.7 MB WebGL).',
      th: ['Jogo', 'Tamanho', 'Vista / input', 'Progresso'],
      rows: [
        ['Asteroid Blaster', '~245 KB Canvas 2D', 'Top-down vetorial; teclado', 'Ondas sem fim; sem save'],
        ['Retro Arcade Shooter', '~120 KB WebGL', 'Top-down inclinado; teclado', '3 niveis; sem save'],
        ['Marble Maze', '~1.7 MB WebGL', 'Labirinto 3D; teclado/tilt', 'Caminhos; sem conta'],
      ],
      h2a: 'Escolha Asteroid Blaster quando', pa: 'Quer pedras que se dividem, wrap de tela e alien num Canvas leve.',
      h2b: 'Escolha Retro Arcade Shooter quando', pb: 'Quer Underrun WebGL mais leve com tres niveis.',
      h2c: 'Escolha Marble Maze quando', pc: 'Quer labirinto marble 3D em vez de shooter espacial.',
      see: 'Veja <a href="/guides/pt/how-to-play-asteroid-blaster.html">como jogar</a> e <a href="/guides/pt/asteroid-blaster-when.html">quando encaixa</a>.',
      back: 'Voltar aos jogos',
    },
    es: {
      h1: 'Asteroid Blaster vs Alternativas',
      lead: 'Compara <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> (~245 KB Canvas 2D) con <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB WebGL) y <a href="/games/marble-maze.html">Marble Maze</a> (~1.7 MB WebGL).',
      th: ['Juego', 'Tamano', 'Vista / input', 'Progreso'],
      rows: [
        ['Asteroid Blaster', '~245 KB Canvas 2D', 'Top-down vectorial; teclado', 'Olas sin fin; sin guardado'],
        ['Retro Arcade Shooter', '~120 KB WebGL', 'Top-down inclinado; teclado', '3 niveles; sin guardado'],
        ['Marble Maze', '~1.7 MB WebGL', 'Laberinto 3D; teclado/tilt', 'Rutas; sin cuenta'],
      ],
      h2a: 'Elige Asteroid Blaster cuando', pa: 'Quieres rocas que se dividen, wrap de pantalla y alien en un Canvas ligero.',
      h2b: 'Elige Retro Arcade Shooter cuando', pb: 'Quieres Underrun WebGL mas ligero con tres niveles.',
      h2c: 'Elige Marble Maze cuando', pc: 'Quieres laberinto marble 3D en vez de shooter espacial.',
      see: 'Ver <a href="/guides/es/how-to-play-asteroid-blaster.html">como jugar</a> y <a href="/guides/es/asteroid-blaster-when.html">cuando encaja</a>.',
      back: 'Volver a juegos',
    },
    vi: {
      h1: 'Asteroid Blaster vs lua chon khac',
      lead: 'So sanh <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> (~245 KB Canvas 2D) voi <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB WebGL) va <a href="/games/marble-maze.html">Marble Maze</a> (~1.7 MB WebGL).',
      th: ['Game', 'Size', 'Goc / input', 'Tien do'],
      rows: [
        ['Asteroid Blaster', '~245 KB Canvas 2D', 'Top-down vector; ban phim', 'Song vo tan; khong save'],
        ['Retro Arcade Shooter', '~120 KB WebGL', 'Top-down nghieng; ban phim', '3 man; khong save'],
        ['Marble Maze', '~1.7 MB WebGL', 'Me cung 3D; ban phim/tilt', 'Duong di; khong tai khoan'],
      ],
      h2a: 'Chon Asteroid Blaster khi', pa: 'Muon da vo manh, wrap man hinh va alien tren Canvas nhe.',
      h2b: 'Chon Retro Arcade Shooter khi', pb: 'Muon Underrun WebGL nhe hon voi ba man.',
      h2c: 'Chon Marble Maze khi', pc: 'Muon me cung marble 3D thay vi shooter khong gian.',
      see: 'Xem <a href="/guides/vi/how-to-play-asteroid-blaster.html">cach choi</a> va <a href="/guides/vi/asteroid-blaster-when.html">khi nao phu hop</a>.',
      back: 'Ve games',
    },
    id: {
      h1: 'Asteroid Blaster vs Alternatif',
      lead: 'Bandingkan <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> (~245 KB Canvas 2D) dengan <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB WebGL) dan <a href="/games/marble-maze.html">Marble Maze</a> (~1.7 MB WebGL).',
      th: ['Game', 'Ukuran', 'Sudut / input', 'Progres'],
      rows: [
        ['Asteroid Blaster', '~245 KB Canvas 2D', 'Top-down vektor; keyboard', 'Gelombang tanpa akhir; tanpa save'],
        ['Retro Arcade Shooter', '~120 KB WebGL', 'Top-down miring; keyboard', '3 level; tanpa save'],
        ['Marble Maze', '~1.7 MB WebGL', 'Labirin 3D; keyboard/tilt', 'Jalur; tanpa akun'],
      ],
      h2a: 'Pilih Asteroid Blaster saat', pa: 'Ingin batu pecah, wrap layar, dan alien di Canvas ringan.',
      h2b: 'Pilih Retro Arcade Shooter saat', pb: 'Ingin Underrun WebGL lebih ringan dengan tiga level.',
      h2c: 'Pilih Marble Maze saat', pc: 'Ingin labirin marble 3D, bukan space shooter.',
      see: 'Lihat <a href="/guides/id/how-to-play-asteroid-blaster.html">cara main</a> dan <a href="/guides/id/asteroid-blaster-when.html">kapan cocok</a>.',
      back: 'Kembali ke games',
    },
    de: {
      h1: 'Asteroid Blaster vs Alternativen',
      lead: 'Vergleiche <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> (~245 KB Canvas 2D) mit <a href="/games/retro-arcade-shooter.html">Retro Arcade Shooter</a> (~120 KB WebGL) und <a href="/games/marble-maze.html">Marble Maze</a> (~1.7 MB WebGL).',
      th: ['Spiel', 'Groesse', 'Sicht / Input', 'Fortschritt'],
      rows: [
        ['Asteroid Blaster', '~245 KB Canvas 2D', 'Top-Down-Vektor; Tastatur', 'Endlose Wellen; kein Save'],
        ['Retro Arcade Shooter', '~120 KB WebGL', 'Geneigtes Top-Down; Tastatur', '3 Level; kein Save'],
        ['Marble Maze', '~1.7 MB WebGL', '3D-Labyrinth; Tastatur/Tilt', 'Pfade; kein Account'],
      ],
      h2a: 'Nimm Asteroid Blaster wenn', pa: 'Du Felsen-Split, Screen-Wrap und Alien auf kleinem Canvas willst.',
      h2b: 'Nimm Retro Arcade Shooter wenn', pb: 'Du leichteres Underrun-WebGL mit drei Leveln willst.',
      h2c: 'Nimm Marble Maze wenn', pc: 'Du ein 3D-Marble-Labyrinth statt eines Space-Shooters willst.',
      see: 'Siehe <a href="/guides/de/how-to-play-asteroid-blaster.html">Anleitung</a> und <a href="/guides/de/asteroid-blaster-when.html">wann es passt</a>.',
      back: 'Zurueck zu Games',
    },
  }[lang];
  const rows = L.rows.map(([a, b, c, d]) => `<tr><td>${a}</td><td>${b}</td><td>${c}</td><td>${d}</td></tr>`).join('');
  return `<div class="w3-container w3-margin-top">
<h1 class="text-uppercase"><b>${L.h1}</b></h1>
<p>${L.lead}</p>
<p><time itemprop="dateReviewed" datetime="${REVIEW}">Last reviewed: ${REVIEW}</time></p>
<table class="w3-table w3-bordered w3-small"><tr><th>${L.th[0]}</th><th>${L.th[1]}</th><th>${L.th[2]}</th><th>${L.th[3]}</th></tr>${rows}</table>
<h2><b>${L.h2a}</b></h2><p>${L.pa}</p>
<h2><b>${L.h2b}</b></h2><p>${L.pb}</p>
<h2><b>${L.h2c}</b></h2><p>${L.pc}</p>
<p>${L.see}</p>
<p><a href="/games.html">&larr; ${L.back}</a></p>
</div>`;
}

const htmlBuilders = { howtoplay: howto, when: whenHtml, vs: vsHtml };
const locales = ['en', 'pt', 'es', 'vi', 'id', 'de'];

function cmsSlug(slugBase, locale) {
  return locale === 'en' ? `guides${slugBase}` : `guides${locale}${slugBase}`;
}

for (const [key, g] of Object.entries(meta)) {
  for (const locale of locales) {
    const slug = cmsSlug(g.slugBase, locale);
    writeFileSync(join(CMS, `BODYHTML${slug}.html`), htmlBuilders[key](locale) + '\n');
    writeFileSync(join(CMS, `BODYTITLE${slug}.txt`), (locale === 'en' ? g.titleEn : g.titles[locale]) + '\n');
    writeFileSync(join(CMS, `BODYDESC${slug}.txt`), (locale === 'en' ? g.descEn : g.descs[locale]) + '\n');
    const jspDir = locale === 'en' ? JSP : join(JSP, locale);
    mkdirSync(jspDir, { recursive: true });
    writeFileSync(join(jspDir, `${g.route}.jsp`), jspTpl);
  }
}

const guideRoutes = [
  '/guides/how-to-play-asteroid-blaster.html',
  '/guides/asteroid-blaster-when.html',
  '/guides/asteroid-blaster-vs-alternatives.html',
  '/guides/pt/how-to-play-asteroid-blaster.html',
  '/guides/pt/asteroid-blaster-when.html',
  '/guides/pt/asteroid-blaster-vs-alternatives.html',
  '/guides/es/how-to-play-asteroid-blaster.html',
  '/guides/es/asteroid-blaster-when.html',
  '/guides/es/asteroid-blaster-vs-alternatives.html',
  '/guides/vi/how-to-play-asteroid-blaster.html',
  '/guides/vi/asteroid-blaster-when.html',
  '/guides/vi/asteroid-blaster-vs-alternatives.html',
  '/guides/id/how-to-play-asteroid-blaster.html',
  '/guides/id/asteroid-blaster-when.html',
  '/guides/id/asteroid-blaster-vs-alternatives.html',
  '/guides/de/how-to-play-asteroid-blaster.html',
  '/guides/de/asteroid-blaster-when.html',
  '/guides/de/asteroid-blaster-vs-alternatives.html',
];

const jspMaps = guideRoutes.map((r) => {
  const parts = r.replace('/guides/', '').replace('.html', '');
  return `  '${r}': 'guide/${parts}.jsp',`;
});

const sitePath = join(ROOT, 'scripts/site-data.mjs');
let site = readFileSync(sitePath, 'utf8');
if (!site.includes('how-to-play-asteroid-blaster')) {
  const guideBlock =
    `  // new-tool-discovery-loop-runbook fire308 (2026-07-18): asteroid-blaster companion guides\n` +
    guideRoutes.map((r) => `  '${r}',`).join('\n') +
    '\n';
  const jspBlock =
    `  // new-tool-discovery-loop-runbook fire308 (2026-07-18): asteroid-blaster companion guides\n` +
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
  console.log('site-data already has asteroid-blaster guides');
}

console.log('Generated asteroid-blaster guide CMS + JSP (18 pages)');
