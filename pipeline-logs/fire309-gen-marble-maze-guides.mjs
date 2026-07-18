#!/usr/bin/env node
/**
 * new-tool-discovery-loop fire309: companion guides for marble-maze
 * (3 angles x EN + pt/es/vi/id/de). Claims ONLY from tool-marblemaze/SKILL.md.
 * Peers: Asteroid Blaster (~245 KB) + Hover Racing (~11 MB) from their SKILL.md.
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
    route: 'how-to-play-marble-maze',
    slugBase: 'howtoplaymarblemaze',
    titleEn: 'How to Play Marble Maze - Step by Step',
    descEn: 'How to play Marble Maze: click Play, tilt-steer with arrows or h/j/k/l, find the exit, grow the maze each level. ~1.7 MB WebGL game on FreeToolOnline.',
    titles: {
      pt: 'Como Jogar Marble Maze - Passo a Passo',
      es: 'Como Jugar Marble Maze - Paso a Paso',
      vi: 'Cach choi Marble Maze - tung buoc',
      id: 'Cara Main Marble Maze - Langkah demi Langkah',
      de: 'Marble Maze spielen - Schritt fuer Schritt',
    },
    descs: {
      pt: 'Como jogar Marble Maze: Play, setas ou h/j/k/l dirigem a bola, ache a saida, labirinto cresce. ~1.7 MB WebGL no FreeToolOnline.',
      es: 'Como jugar Marble Maze: Play, flechas o h/j/k/l dirigen la bola, halla la salida, el laberinto crece. ~1.7 MB WebGL en FreeToolOnline.',
      vi: 'Cach choi Marble Maze: bam Play, mui ten hoac h/j/k/l lai bi, tim loi ra, me cung lon dan. ~1.7 MB WebGL tren FreeToolOnline.',
      id: 'Cara main Marble Maze: klik Play, panah atau h/j/k/l mengarahkan bola, cari keluar, labirin membesar. ~1.7 MB WebGL di FreeToolOnline.',
      de: 'Marble Maze spielen: Play, Pfeile oder h/j/k/l steuern die Kugel, Exit finden, Labyrinth waechst. ~1.7 MB WebGL auf FreeToolOnline.',
    },
  },
  when: {
    route: 'marble-maze-when',
    slugBase: 'marblemazewhen',
    titleEn: 'When to Play Marble Maze',
    descEn: 'When Marble Maze fits: 3D WebGL marble puzzle, ~1.7 MB, procedural mazes that grow, keyboard tilt-steer, no save needed. Free on FreeToolOnline.',
    titles: {
      pt: 'Quando Jogar Marble Maze',
      es: 'Cuando Jugar Marble Maze',
      vi: 'Khi nao choi Marble Maze',
      id: 'Kapan Main Marble Maze',
      de: 'Wann Marble Maze spielen',
    },
    descs: {
      pt: 'Quando Marble Maze encaixa: puzzle marble WebGL 3D, ~1.7 MB, labirintos que crescem, teclado, sem save.',
      es: 'Cuando encaja Marble Maze: puzzle marble WebGL 3D, ~1.7 MB, laberintos que crecen, teclado, sin guardado.',
      vi: 'Khi nao Marble Maze phu hop: puzzle marble WebGL 3D, ~1.7 MB, me cung lon dan, ban phim, khong can save.',
      id: 'Kapan Marble Maze cocok: puzzle marble WebGL 3D, ~1.7 MB, labirin membesar, keyboard, tanpa save.',
      de: 'Wann Marble Maze passt: 3D-WebGL-Marble-Puzzle, ~1.7 MB, wachsende Labyrinthe, Tastatur, ohne Save.',
    },
  },
  vs: {
    route: 'marble-maze-vs-alternatives',
    slugBase: 'marblemazevsalternatives',
    titleEn: 'Marble Maze vs Alternatives',
    descEn: 'Compare Marble Maze (~1.7 MB WebGL) with Asteroid Blaster (~245 KB Canvas 2D) and Hover Racing (~11 MB WebGL). Free browser games on FreeToolOnline.',
    titles: {
      pt: 'Marble Maze vs Alternativas',
      es: 'Marble Maze vs Alternativas',
      vi: 'Marble Maze vs lua chon khac',
      id: 'Marble Maze vs Alternatif',
      de: 'Marble Maze vs Alternativen',
    },
    descs: {
      pt: 'Compare Marble Maze (~1.7 MB WebGL) com Asteroid Blaster (~245 KB Canvas 2D) e Hover Racing (~11 MB WebGL).',
      es: 'Compara Marble Maze (~1.7 MB WebGL) con Asteroid Blaster (~245 KB Canvas 2D) y Hover Racing (~11 MB WebGL).',
      vi: 'So sanh Marble Maze (~1.7 MB WebGL) voi Asteroid Blaster (~245 KB Canvas 2D) va Hover Racing (~11 MB WebGL).',
      id: 'Bandingkan Marble Maze (~1.7 MB WebGL) dengan Asteroid Blaster (~245 KB Canvas 2D) dan Hover Racing (~11 MB WebGL).',
      de: 'Vergleiche Marble Maze (~1.7 MB WebGL) mit Asteroid Blaster (~245 KB Canvas 2D) und Hover Racing (~11 MB WebGL).',
    },
  },
};

function howto(lang) {
  const L = {
    en: {
      h1: 'How to Play Marble Maze - Step by Step',
      lead: 'The <a href="/games/marble-maze.html">Marble Maze</a> page runs a 3D WebGL marble puzzle in a same-origin iframe. Click Play, tilt-steer the ball through a procedural maze to the exit, then a bigger maze generates for the next level.',
      call: 'Keyboard only: arrow keys or Vim h / j / k / l. Hold I for instructions. About 1.7 MB total - WebGL required; no network after load.',
      s1: 'Step 1 - open the page', p1: 'The launch panel, Play button, and status line render immediately. The game iframe does not load until you click Play.',
      s2: 'Step 2 - click Play', p2: 'Play injects the iframe at /games/marble-maze/. The WebGL field shows a lit 3D maze and a rolling ball. Total payload is about 1.7 MB (engine, physics, three textures).',
      s3: 'Step 3 - tilt-steer the ball', p3: 'Hold left/right/up/down (or h/j/k/l) to roll. Release to coast and slow down. There is no mouse, touch, or gamepad steering.',
      s4: 'Step 4 - find the exit and level up', p4: 'Reach the exit to complete the level. A fade transition plays, then a new maze generates two cells larger (dimension starts at 11 and grows by 2). The Level N HUD updates in the top-left.',
      s5: 'Step 5 - instructions and limits', p5: 'Hold I to show or hide the instructions panel without pausing. No save, sound, or accounts - closing the tab resets to level 1. Mazes grow forever; there is no final win screen.',
      th: ['Setting', 'Value', 'Notes'],
      rows: [
        ['Engine', 'WebGL Three.js + Box2dWeb', 'Same-origin iframe'],
        ['Size', '~1.7 MB', 'Cached after first load'],
        ['Controls', 'Arrows or h/j/k/l', 'Hold I for help'],
        ['Mazes', 'Procedural', 'Start 11, +2 per level'],
        ['Progress', 'Level HUD only', 'No localStorage save'],
      ],
      see: 'See <a href="/guides/marble-maze-when.html">when to play</a>, <a href="/guides/marble-maze-vs-alternatives.html">comparisons</a>, and <a href="/games/asteroid-blaster.html">Asteroid Blaster</a>.',
      back: 'Back to games',
    },
    pt: {
      h1: 'Como Jogar Marble Maze - Passo a Passo',
      lead: 'A pagina <a href="/games/marble-maze.html">Marble Maze</a> roda um puzzle marble WebGL 3D em iframe. Clique Play, dirija a bola ate a saida; o labirinto seguinte fica maior.',
      call: 'So teclado: setas ou h/j/k/l. Segure I para instrucoes. ~1.7 MB - precisa WebGL; sem rede depois do load.',
      s1: 'Passo 1 - abrir a pagina', s2: 'Passo 2 - clicar Play', s3: 'Passo 3 - dirigir a bola',
      s4: 'Passo 4 - achar a saida', s5: 'Passo 5 - limites',
      p1: 'Painel e Play aparecem na hora. O iframe so carrega apos Play.',
      p2: 'Play injeta /games/marble-maze/. WebGL mostra labirinto 3D e bola. ~1.7 MB.',
      p3: 'Segure setas (ou h/j/k/l) para rolar. Solte para desacelerar. Sem toque ou gamepad.',
      p4: 'Chegue a saida. Fade, depois labirinto maior (comeca em 11, +2). HUD Level N no canto.',
      p5: 'Segure I para instrucoes. Sem save, som ou contas. Fechar a aba volta ao nivel 1.',
      th: ['Item', 'Valor', 'Notas'],
      rows: [
        ['Engine', 'WebGL Three.js + Box2dWeb', 'Iframe same-origin'],
        ['Tamanho', '~1.7 MB', 'Cache apos 1o load'],
        ['Controles', 'Setas ou h/j/k/l', 'Segure I'],
        ['Labirintos', 'Procedural', '11, +2 por nivel'],
        ['Progresso', 'So HUD', 'Sem localStorage'],
      ],
      see: 'Veja <a href="/guides/pt/marble-maze-when.html">quando jogar</a>, <a href="/guides/pt/marble-maze-vs-alternatives.html">comparacoes</a> e <a href="/games/asteroid-blaster.html">Asteroid Blaster</a>.',
      back: 'Voltar aos jogos',
    },
    es: {
      h1: 'Como Jugar Marble Maze - Paso a Paso',
      lead: 'La pagina <a href="/games/marble-maze.html">Marble Maze</a> ejecuta un puzzle marble WebGL 3D en iframe. Pulsa Play, dirige la bola hasta la salida; el siguiente laberinto es mas grande.',
      call: 'Solo teclado: flechas o h/j/k/l. Mantén I para instrucciones. ~1.7 MB - necesita WebGL; sin red tras la carga.',
      s1: 'Paso 1 - abrir la pagina', s2: 'Paso 2 - pulsar Play', s3: 'Paso 3 - dirigir la bola',
      s4: 'Paso 4 - hallar la salida', s5: 'Paso 5 - limites',
      p1: 'Panel y Play aparecen al instante. El iframe solo carga tras Play.',
      p2: 'Play inyecta /games/marble-maze/. WebGL muestra laberinto 3D y bola. ~1.7 MB.',
      p3: 'Mantén flechas (o h/j/k/l) para rodar. Suelta para frenar. Sin tactil ni gamepad.',
      p4: 'Llega a la salida. Fade, luego laberinto mayor (empieza en 11, +2). HUD Level N.',
      p5: 'Mantén I para instrucciones. Sin guardado, sonido ni cuentas. Cerrar la pestana vuelve al nivel 1.',
      th: ['Item', 'Valor', 'Notas'],
      rows: [
        ['Motor', 'WebGL Three.js + Box2dWeb', 'Iframe same-origin'],
        ['Tamano', '~1.7 MB', 'Cache tras 1a carga'],
        ['Controles', 'Flechas o h/j/k/l', 'Mantén I'],
        ['Laberintos', 'Procedural', '11, +2 por nivel'],
        ['Progreso', 'Solo HUD', 'Sin localStorage'],
      ],
      see: 'Ver <a href="/guides/es/marble-maze-when.html">cuando jugar</a>, <a href="/guides/es/marble-maze-vs-alternatives.html">comparaciones</a> y <a href="/games/asteroid-blaster.html">Asteroid Blaster</a>.',
      back: 'Volver a juegos',
    },
    vi: {
      h1: 'Cach choi Marble Maze - tung buoc',
      lead: 'Trang <a href="/games/marble-maze.html">Marble Maze</a> chay puzzle marble WebGL 3D trong iframe. Bam Play, lai bi den loi ra; me cung sau lon hon.',
      call: 'Chi ban phim: mui ten hoac h/j/k/l. Giu I de xem huong dan. ~1.7 MB - can WebGL; khong mang sau load.',
      s1: 'Buoc 1 - mo trang', s2: 'Buoc 2 - bam Play', s3: 'Buoc 3 - lai bi',
      s4: 'Buoc 4 - tim loi ra', s5: 'Buoc 5 - gioi han',
      p1: 'Panel va Play hien ngay. Iframe chi load sau Play.',
      p2: 'Play chen /games/marble-maze/. WebGL hien me cung 3D va bi. ~1.7 MB.',
      p3: 'Giu mui ten (hoac h/j/k/l) de lan. Tha de cham lai. Khong cam ung hay gamepad.',
      p4: 'Den loi ra. Fade, roi me cung lon hon (bat dau 11, +2). HUD Level N goc trai.',
      p5: 'Giu I de huong dan. Khong save, am thanh hay tai khoan. Dong tab ve level 1.',
      th: ['Muc', 'Gia tri', 'Ghi chu'],
      rows: [
        ['Engine', 'WebGL Three.js + Box2dWeb', 'Iframe same-origin'],
        ['Size', '~1.7 MB', 'Cache sau lan dau'],
        ['Dieu khien', 'Mui ten hoac h/j/k/l', 'Giu I'],
        ['Me cung', 'Procedural', '11, +2 moi level'],
        ['Tien do', 'Chi HUD', 'Khong localStorage'],
      ],
      see: 'Xem <a href="/guides/vi/marble-maze-when.html">khi nao choi</a>, <a href="/guides/vi/marble-maze-vs-alternatives.html">so sanh</a> va <a href="/games/asteroid-blaster.html">Asteroid Blaster</a>.',
      back: 'Ve games',
    },
    id: {
      h1: 'Cara Main Marble Maze - Langkah demi Langkah',
      lead: 'Halaman <a href="/games/marble-maze.html">Marble Maze</a> menjalankan puzzle marble WebGL 3D di iframe. Klik Play, arahkan bola ke pintu keluar; labirin berikutnya lebih besar.',
      call: 'Keyboard saja: panah atau h/j/k/l. Tahan I untuk instruksi. ~1.7 MB - butuh WebGL; tanpa jaringan setelah load.',
      s1: 'Langkah 1 - buka halaman', s2: 'Langkah 2 - klik Play', s3: 'Langkah 3 - arahkan bola',
      s4: 'Langkah 4 - temukan keluar', s5: 'Langkah 5 - batas',
      p1: 'Panel dan Play muncul segera. Iframe hanya load setelah Play.',
      p2: 'Play menyisipkan /games/marble-maze/. WebGL menampilkan labirin 3D dan bola. ~1.7 MB.',
      p3: 'Tahan panah (atau h/j/k/l) untuk menggelinding. Lepas untuk melambat. Tanpa sentuh atau gamepad.',
      p4: 'Capai keluar. Fade, lalu labirin lebih besar (mulai 11, +2). HUD Level N kiri atas.',
      p5: 'Tahan I untuk instruksi. Tanpa save, suara, atau akun. Tutup tab kembali ke level 1.',
      th: ['Item', 'Nilai', 'Catatan'],
      rows: [
        ['Engine', 'WebGL Three.js + Box2dWeb', 'Iframe same-origin'],
        ['Ukuran', '~1.7 MB', 'Cache setelah load pertama'],
        ['Kontrol', 'Panah atau h/j/k/l', 'Tahan I'],
        ['Labirin', 'Procedural', '11, +2 per level'],
        ['Progres', 'Hanya HUD', 'Tanpa localStorage'],
      ],
      see: 'Lihat <a href="/guides/id/marble-maze-when.html">kapan main</a>, <a href="/guides/id/marble-maze-vs-alternatives.html">perbandingan</a>, dan <a href="/games/asteroid-blaster.html">Asteroid Blaster</a>.',
      back: 'Kembali ke games',
    },
    de: {
      h1: 'Marble Maze spielen - Schritt fuer Schritt',
      lead: 'Die Seite <a href="/games/marble-maze.html">Marble Maze</a> laeuft als 3D-WebGL-Marble-Puzzle im iframe. Play klicken, die Kugel zum Exit steuern; das naechste Labyrinth wird groesser.',
      call: 'Nur Tastatur: Pfeile oder h/j/k/l. I halten fuer Hilfe. ~1.7 MB - WebGL noetig; kein Netz nach dem Load.',
      s1: 'Schritt 1 - Seite oeffnen', s2: 'Schritt 2 - Play klicken', s3: 'Schritt 3 - Kugel steuern',
      s4: 'Schritt 4 - Exit finden', s5: 'Schritt 5 - Grenzen',
      p1: 'Panel und Play erscheinen sofort. Das iframe laedt erst nach Play.',
      p2: 'Play injiziert /games/marble-maze/. WebGL zeigt 3D-Labyrinth und Kugel. ~1.7 MB.',
      p3: 'Pfeile (oder h/j/k/l) halten zum Rollen. Loslassen zum Abbremsen. Kein Touch oder Gamepad.',
      p4: 'Exit erreichen. Fade, dann groesseres Labyrinth (Start 11, +2). HUD Level N oben links.',
      p5: 'I halten fuer Anleitung. Kein Save, Sound oder Accounts. Tab schliessen setzt auf Level 1 zurueck.',
      th: ['Punkt', 'Wert', 'Notiz'],
      rows: [
        ['Engine', 'WebGL Three.js + Box2dWeb', 'Same-Origin-Iframe'],
        ['Groesse', '~1.7 MB', 'Cache nach erstem Load'],
        ['Steuerung', 'Pfeile oder h/j/k/l', 'I halten'],
        ['Labyrinthe', 'Prozedural', '11, +2 je Level'],
        ['Fortschritt', 'Nur HUD', 'Kein localStorage'],
      ],
      see: 'Siehe <a href="/guides/de/marble-maze-when.html">wann spielen</a>, <a href="/guides/de/marble-maze-vs-alternatives.html">Vergleiche</a> und <a href="/games/asteroid-blaster.html">Asteroid Blaster</a>.',
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
      h1: 'When to Play Marble Maze',
      lead: '<a href="/games/marble-maze.html">Marble Maze</a> fits when you want a 3D WebGL marble puzzle in the browser: ~1.7 MB, procedural mazes that grow each level, keyboard tilt-steer - no install and no save file.',
      h2a: 'When you have a keyboard and WebGL',
      pa: 'Arrows or h/j/k/l roll the ball. Hold I for instructions. Touch-only phones are not the target.',
      h2b: 'When you want endless maze growth',
      pb: 'Each exit unlocks a fresh maze two cells larger. Closing the tab resets to level 1 - there is no localStorage save.',
      h2c: 'When a mid-size download is fine',
      pc: 'About 1.7 MB total, cached after the first load. No network calls after load, no accounts inside the game frame.',
      h2d: 'When to pick something else',
      pd: 'Want a tiny Canvas space shooter at ~245 KB? Try <a href="/games/asteroid-blaster.html">Asteroid Blaster</a>. Want a fast WebGL hover race at ~11 MB? Use <a href="/games/hover-racing.html">Hover Racing</a>.',
      see: 'See <a href="/guides/how-to-play-marble-maze.html">how to play</a> and <a href="/guides/marble-maze-vs-alternatives.html">comparisons</a>.',
      back: 'Back to games',
    },
    pt: {
      h1: 'Quando Jogar Marble Maze',
      lead: '<a href="/games/marble-maze.html">Marble Maze</a> serve quando voce quer um puzzle marble WebGL 3D: ~1.7 MB, labirintos que crescem, teclado - sem instalar e sem save.',
      h2a: 'Quando tem teclado e WebGL', pa: 'Setas ou h/j/k/l. Segure I. Celular so-toque nao e o alvo.',
      h2b: 'Quando quer crescimento sem fim', pb: 'Cada saida gera labirinto maior (+2). Fechar a aba volta ao nivel 1 - sem localStorage.',
      h2c: 'Quando um download medio serve', pc: '~1.7 MB, cache apos o primeiro load. Sem rede depois, sem contas.',
      h2d: 'Quando escolher outra coisa', pd: 'Quer shooter Canvas ~245 KB? <a href="/games/asteroid-blaster.html">Asteroid Blaster</a>. Quer corrida hover ~11 MB? <a href="/games/hover-racing.html">Hover Racing</a>.',
      see: 'Veja <a href="/guides/pt/how-to-play-marble-maze.html">como jogar</a> e <a href="/guides/pt/marble-maze-vs-alternatives.html">comparacoes</a>.',
      back: 'Voltar aos jogos',
    },
    es: {
      h1: 'Cuando Jugar Marble Maze',
      lead: '<a href="/games/marble-maze.html">Marble Maze</a> encaja cuando quieres un puzzle marble WebGL 3D: ~1.7 MB, laberintos que crecen, teclado - sin instalar y sin guardado.',
      h2a: 'Cuando tienes teclado y WebGL', pa: 'Flechas o h/j/k/l. Mantén I. Movil solo tactil no es el objetivo.',
      h2b: 'Cuando quieres crecimiento sin fin', pb: 'Cada salida genera un laberinto mayor (+2). Cerrar la pestana vuelve al nivel 1 - sin localStorage.',
      h2c: 'Cuando basta una descarga media', pc: '~1.7 MB, cache tras la primera carga. Sin red despues, sin cuentas.',
      h2d: 'Cuando elegir otra cosa', pd: 'Quieres shooter Canvas ~245 KB? <a href="/games/asteroid-blaster.html">Asteroid Blaster</a>. Quieres carrera hover ~11 MB? <a href="/games/hover-racing.html">Hover Racing</a>.',
      see: 'Ver <a href="/guides/es/how-to-play-marble-maze.html">como jugar</a> y <a href="/guides/es/marble-maze-vs-alternatives.html">comparaciones</a>.',
      back: 'Volver a juegos',
    },
    vi: {
      h1: 'Khi nao choi Marble Maze',
      lead: '<a href="/games/marble-maze.html">Marble Maze</a> phu hop khi ban muon puzzle marble WebGL 3D: ~1.7 MB, me cung lon dan, ban phim - khong cai dat, khong save.',
      h2a: 'Khi co ban phim va WebGL', pa: 'Mui ten hoac h/j/k/l. Giu I. Dien thoai chi cam ung khong phai muc tieu.',
      h2b: 'Khi muon me cung lon mai', pb: 'Moi loi ra tao me cung lon hon (+2). Dong tab ve level 1 - khong localStorage.',
      h2c: 'Khi tai vua duoc', pc: '~1.7 MB, cache sau lan dau. Khong mang sau load, khong tai khoan.',
      h2d: 'Khi chon cai khac', pd: 'Muon shooter Canvas ~245 KB? <a href="/games/asteroid-blaster.html">Asteroid Blaster</a>. Muon dua hover ~11 MB? <a href="/games/hover-racing.html">Hover Racing</a>.',
      see: 'Xem <a href="/guides/vi/how-to-play-marble-maze.html">cach choi</a> va <a href="/guides/vi/marble-maze-vs-alternatives.html">so sanh</a>.',
      back: 'Ve games',
    },
    id: {
      h1: 'Kapan Main Marble Maze',
      lead: '<a href="/games/marble-maze.html">Marble Maze</a> cocok saat Anda ingin puzzle marble WebGL 3D: ~1.7 MB, labirin membesar, keyboard - tanpa instal dan tanpa save.',
      h2a: 'Saat punya keyboard dan WebGL', pa: 'Panah atau h/j/k/l. Tahan I. Ponsel hanya sentuh bukan target.',
      h2b: 'Saat ingin labirin terus membesar', pb: 'Setiap keluar membuat labirin lebih besar (+2). Tutup tab kembali ke level 1 - tanpa localStorage.',
      h2c: 'Saat unduhan sedang cukup', pc: '~1.7 MB, cache setelah load pertama. Tanpa jaringan setelahnya, tanpa akun.',
      h2d: 'Saat pilih yang lain', pd: 'Ingin shooter Canvas ~245 KB? <a href="/games/asteroid-blaster.html">Asteroid Blaster</a>. Ingin balap hover ~11 MB? <a href="/games/hover-racing.html">Hover Racing</a>.',
      see: 'Lihat <a href="/guides/id/how-to-play-marble-maze.html">cara main</a> dan <a href="/guides/id/marble-maze-vs-alternatives.html">perbandingan</a>.',
      back: 'Kembali ke games',
    },
    de: {
      h1: 'Wann Marble Maze spielen',
      lead: '<a href="/games/marble-maze.html">Marble Maze</a> passt, wenn du ein 3D-WebGL-Marble-Puzzle willst: ~1.7 MB, wachsende Labyrinthe, Tastatur - ohne Install und ohne Save.',
      h2a: 'Wenn du Tastatur und WebGL hast', pa: 'Pfeile oder h/j/k/l. I halten. Touch-only-Handys sind nicht das Ziel.',
      h2b: 'Wenn du endloses Wachstum willst', pb: 'Jeder Exit erzeugt ein groesseres Labyrinth (+2). Tab schliessen setzt auf Level 1 - kein localStorage.',
      h2c: 'Wenn ein mittlerer Download ok ist', pc: '~1.7 MB, Cache nach dem ersten Load. Kein Netz danach, keine Accounts.',
      h2d: 'Wann etwas anderes', pd: 'Willst du Canvas-Shooter ~245 KB? <a href="/games/asteroid-blaster.html">Asteroid Blaster</a>. Willst du Hover-Rennen ~11 MB? <a href="/games/hover-racing.html">Hover Racing</a>.',
      see: 'Siehe <a href="/guides/de/how-to-play-marble-maze.html">Anleitung</a> und <a href="/guides/de/marble-maze-vs-alternatives.html">Vergleiche</a>.',
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
      h1: 'Marble Maze vs Alternatives',
      lead: 'Compare <a href="/games/marble-maze.html">Marble Maze</a> (~1.7 MB WebGL) with <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> (~245 KB Canvas 2D) and <a href="/games/hover-racing.html">Hover Racing</a> (~11 MB WebGL).',
      th: ['Game', 'Size', 'View / input', 'Progress'],
      rows: [
        ['Marble Maze', '~1.7 MB WebGL', '3D maze; arrows or h/j/k/l', 'Growing levels; no save'],
        ['Asteroid Blaster', '~245 KB Canvas 2D', 'Top-down vector; keyboard', 'Endless waves; no save'],
        ['Hover Racing', '~11 MB WebGL', '3D hover race; keyboard', 'Track laps; no account'],
      ],
      h2a: 'Pick Marble Maze when', pa: 'You want procedural 3D mazes that grow after each exit on a mid-size WebGL payload.',
      h2b: 'Pick Asteroid Blaster when', pb: 'You want a tiny Canvas space shooter with rock splitting and screen wrap.',
      h2c: 'Pick Hover Racing when', pc: 'You want a heavier WebGL hover race with city-track assets.',
      see: 'See <a href="/guides/how-to-play-marble-maze.html">how to play</a> and <a href="/guides/marble-maze-when.html">when it fits</a>.',
      back: 'Back to games',
    },
    pt: {
      h1: 'Marble Maze vs Alternativas',
      lead: 'Compare <a href="/games/marble-maze.html">Marble Maze</a> (~1.7 MB WebGL) com <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> (~245 KB Canvas 2D) e <a href="/games/hover-racing.html">Hover Racing</a> (~11 MB WebGL).',
      th: ['Jogo', 'Tamanho', 'Vista / input', 'Progresso'],
      rows: [
        ['Marble Maze', '~1.7 MB WebGL', 'Labirinto 3D; setas ou h/j/k/l', 'Niveis que crescem; sem save'],
        ['Asteroid Blaster', '~245 KB Canvas 2D', 'Top-down vetorial; teclado', 'Ondas sem fim; sem save'],
        ['Hover Racing', '~11 MB WebGL', 'Corrida hover 3D; teclado', 'Voltas; sem conta'],
      ],
      h2a: 'Escolha Marble Maze quando', pa: 'Quer labirintos 3D procedurais que crescem apos cada saida.',
      h2b: 'Escolha Asteroid Blaster quando', pb: 'Quer shooter Canvas leve com pedras que se dividem.',
      h2c: 'Escolha Hover Racing quando', pc: 'Quer corrida hover WebGL mais pesada com pista de cidade.',
      see: 'Veja <a href="/guides/pt/how-to-play-marble-maze.html">como jogar</a> e <a href="/guides/pt/marble-maze-when.html">quando encaixa</a>.',
      back: 'Voltar aos jogos',
    },
    es: {
      h1: 'Marble Maze vs Alternativas',
      lead: 'Compara <a href="/games/marble-maze.html">Marble Maze</a> (~1.7 MB WebGL) con <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> (~245 KB Canvas 2D) y <a href="/games/hover-racing.html">Hover Racing</a> (~11 MB WebGL).',
      th: ['Juego', 'Tamano', 'Vista / input', 'Progreso'],
      rows: [
        ['Marble Maze', '~1.7 MB WebGL', 'Laberinto 3D; flechas o h/j/k/l', 'Niveles que crecen; sin guardado'],
        ['Asteroid Blaster', '~245 KB Canvas 2D', 'Top-down vectorial; teclado', 'Olas sin fin; sin guardado'],
        ['Hover Racing', '~11 MB WebGL', 'Carrera hover 3D; teclado', 'Vueltas; sin cuenta'],
      ],
      h2a: 'Elige Marble Maze cuando', pa: 'Quieres laberintos 3D procedurales que crecen tras cada salida.',
      h2b: 'Elige Asteroid Blaster cuando', pb: 'Quieres un shooter Canvas ligero con rocas que se dividen.',
      h2c: 'Elige Hover Racing cuando', pc: 'Quieres una carrera hover WebGL mas pesada con pista de ciudad.',
      see: 'Ver <a href="/guides/es/how-to-play-marble-maze.html">como jugar</a> y <a href="/guides/es/marble-maze-when.html">cuando encaja</a>.',
      back: 'Volver a juegos',
    },
    vi: {
      h1: 'Marble Maze vs lua chon khac',
      lead: 'So sanh <a href="/games/marble-maze.html">Marble Maze</a> (~1.7 MB WebGL) voi <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> (~245 KB Canvas 2D) va <a href="/games/hover-racing.html">Hover Racing</a> (~11 MB WebGL).',
      th: ['Game', 'Size', 'Goc / input', 'Tien do'],
      rows: [
        ['Marble Maze', '~1.7 MB WebGL', 'Me cung 3D; mui ten hoac h/j/k/l', 'Level lon dan; khong save'],
        ['Asteroid Blaster', '~245 KB Canvas 2D', 'Top-down vector; ban phim', 'Song vo tan; khong save'],
        ['Hover Racing', '~11 MB WebGL', 'Dua hover 3D; ban phim', 'Vong dua; khong tai khoan'],
      ],
      h2a: 'Chon Marble Maze khi', pa: 'Muon me cung 3D procedural lon dan sau moi loi ra.',
      h2b: 'Chon Asteroid Blaster khi', pb: 'Muon shooter Canvas nhe voi da vo manh.',
      h2c: 'Chon Hover Racing khi', pc: 'Muon dua hover WebGL nang hon voi track thanh pho.',
      see: 'Xem <a href="/guides/vi/how-to-play-marble-maze.html">cach choi</a> va <a href="/guides/vi/marble-maze-when.html">khi nao phu hop</a>.',
      back: 'Ve games',
    },
    id: {
      h1: 'Marble Maze vs Alternatif',
      lead: 'Bandingkan <a href="/games/marble-maze.html">Marble Maze</a> (~1.7 MB WebGL) dengan <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> (~245 KB Canvas 2D) dan <a href="/games/hover-racing.html">Hover Racing</a> (~11 MB WebGL).',
      th: ['Game', 'Ukuran', 'Sudut / input', 'Progres'],
      rows: [
        ['Marble Maze', '~1.7 MB WebGL', 'Labirin 3D; panah atau h/j/k/l', 'Level membesar; tanpa save'],
        ['Asteroid Blaster', '~245 KB Canvas 2D', 'Top-down vektor; keyboard', 'Gelombang tanpa akhir; tanpa save'],
        ['Hover Racing', '~11 MB WebGL', 'Balap hover 3D; keyboard', 'Putaran; tanpa akun'],
      ],
      h2a: 'Pilih Marble Maze saat', pa: 'Ingin labirin 3D procedural yang membesar setelah setiap keluar.',
      h2b: 'Pilih Asteroid Blaster saat', pb: 'Ingin shooter Canvas ringan dengan batu pecah.',
      h2c: 'Pilih Hover Racing saat', pc: 'Ingin balap hover WebGL lebih berat dengan track kota.',
      see: 'Lihat <a href="/guides/id/how-to-play-marble-maze.html">cara main</a> dan <a href="/guides/id/marble-maze-when.html">kapan cocok</a>.',
      back: 'Kembali ke games',
    },
    de: {
      h1: 'Marble Maze vs Alternativen',
      lead: 'Vergleiche <a href="/games/marble-maze.html">Marble Maze</a> (~1.7 MB WebGL) mit <a href="/games/asteroid-blaster.html">Asteroid Blaster</a> (~245 KB Canvas 2D) und <a href="/games/hover-racing.html">Hover Racing</a> (~11 MB WebGL).',
      th: ['Spiel', 'Groesse', 'Sicht / Input', 'Fortschritt'],
      rows: [
        ['Marble Maze', '~1.7 MB WebGL', '3D-Labyrinth; Pfeile oder h/j/k/l', 'Wachsend; kein Save'],
        ['Asteroid Blaster', '~245 KB Canvas 2D', 'Top-Down-Vektor; Tastatur', 'Endlose Wellen; kein Save'],
        ['Hover Racing', '~11 MB WebGL', '3D-Hover-Rennen; Tastatur', 'Runden; kein Account'],
      ],
      h2a: 'Nimm Marble Maze wenn', pa: 'Du prozedurale 3D-Labyrinthe willst, die nach jedem Exit wachsen.',
      h2b: 'Nimm Asteroid Blaster wenn', pb: 'Du einen kleinen Canvas-Shooter mit Felsen-Split willst.',
      h2c: 'Nimm Hover Racing wenn', pc: 'Du ein schwereres WebGL-Hover-Rennen mit Stadt-Track willst.',
      see: 'Siehe <a href="/guides/de/how-to-play-marble-maze.html">Anleitung</a> und <a href="/guides/de/marble-maze-when.html">wann es passt</a>.',
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
  '/guides/how-to-play-marble-maze.html',
  '/guides/marble-maze-when.html',
  '/guides/marble-maze-vs-alternatives.html',
  '/guides/pt/how-to-play-marble-maze.html',
  '/guides/pt/marble-maze-when.html',
  '/guides/pt/marble-maze-vs-alternatives.html',
  '/guides/es/how-to-play-marble-maze.html',
  '/guides/es/marble-maze-when.html',
  '/guides/es/marble-maze-vs-alternatives.html',
  '/guides/vi/how-to-play-marble-maze.html',
  '/guides/vi/marble-maze-when.html',
  '/guides/vi/marble-maze-vs-alternatives.html',
  '/guides/id/how-to-play-marble-maze.html',
  '/guides/id/marble-maze-when.html',
  '/guides/id/marble-maze-vs-alternatives.html',
  '/guides/de/how-to-play-marble-maze.html',
  '/guides/de/marble-maze-when.html',
  '/guides/de/marble-maze-vs-alternatives.html',
];

const jspMaps = guideRoutes.map((r) => {
  const parts = r.replace('/guides/', '').replace('.html', '');
  return `  '${r}': 'guide/${parts}.jsp',`;
});

const sitePath = join(ROOT, 'scripts/site-data.mjs');
let site = readFileSync(sitePath, 'utf8');
if (!site.includes('how-to-play-marble-maze')) {
  const guideBlock =
    `  // new-tool-discovery-loop-runbook fire309 (2026-07-18): marble-maze companion guides\n` +
    guideRoutes.map((r) => `  '${r}',`).join('\n') +
    '\n';
  const jspBlock =
    `  // new-tool-discovery-loop-runbook fire309 (2026-07-18): marble-maze companion guides\n` +
    jspMaps.join('\n') +
    '\n';
  const anchor = `  // new-tool-discovery-loop-runbook fire308 (2026-07-18): asteroid-blaster companion guides`;
  if (!site.includes(anchor)) throw new Error('site-data anchor missing: fire308 asteroid');
  const first = site.indexOf(anchor);
  site = site.slice(0, first) + guideBlock + site.slice(first);
  const second = site.indexOf(anchor, site.indexOf(anchor) + 1);
  if (second < 0) throw new Error('second fire308 anchor missing');
  site = site.slice(0, second) + jspBlock + site.slice(second);
  writeFileSync(sitePath, site);
  console.log('patched site-data.mjs');
} else {
  console.log('site-data already has marble-maze guides');
}

console.log('Generated marble-maze guide CMS + JSP (18 pages)');
