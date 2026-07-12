#!/usr/bin/env node
// newtool-discovery-loop fire58 (LEAN one-off session): locale fanout
// (pt/es/vi/id/de) for the 3 EN-only sky-gates-flight guide angles
// (when/step-by-step/vs-alternatives). new_tool_build exhausted this fire
// (Gate-H starvation on converter-images + branded/piracy-adjacent PDF
// editor slugs which should be REJECTED, not registry-seeded; G51 blocks
// the calculator/case-converter/hash-generator family pending an existing-
// tool differentiation edit that is out of scope for this creation-only
// loop) so per the SS4b interleave rule this fire drains a pending
// guide_locale_fanout unit that does NOT collide with the live sibling
// session (which is on solar-system/black-hole/galaxy guides right now).
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

// Safety net: PT/ES/VI/ID must be diacritic-free (site convention); DE uses
// ue/oe/ae/ss substitution instead of umlauts/eszett (R9 + typography rule).
function stripDiacritics(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
function germanize(s) {
  return s
    .replace(/ä/g, 'ae').replace(/Ä/g, 'Ae')
    .replace(/ö/g, 'oe').replace(/Ö/g, 'Oe')
    .replace(/ü/g, 'ue').replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function clean(lang, s) {
  return lang === 'de' ? germanize(s) : stripDiacritics(s);
}

const enJsp = readFileSync(join(JSP_GUIDE, 'sky-gates-flight-when.jsp'), 'utf8');
const LOCALES = ['pt', 'es', 'vi', 'id', 'de'];
const DATE = '2026-07-12';

// ---- angle: when ----
const when = {
  kebab: 'sky-gates-flight-when',
  pt: {
    title: 'Sky Gates Flight: Quando Serve e Quando Nao Serve',
    desc: 'Onde o Sky Gates Flight serve - pausas curtas, celular, computador compartilhado, buscar sua melhor corrida - e onde nao serve: fisica arcade, nao um simulador de voo.',
    html: `<h1 class="text-uppercase"><b>Sky Gates Flight: Quando Serve e Quando Nao Serve</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Sky Gates Flight e uma corrida arcade rapida: pilote um aviao pequeno sobre o oceano, passe pelos portais verdes que somam energia e pelos vermelhos que a drenam, e a corrida termina quando a energia chega a zero. Jogue em <a href="/games/sky-gates-flight.html">Sky Gates Flight</a>. Veja aqui onde ele serve para um dia real - e onde ele honestamente nao serve.</p>
<br/><h2><b>Uma pausa de cinco minutos entre tarefas</b></h2>
<p>Aperte Start flight e voce ja esta voando. O controle e um so gesto - arraste na cena, ou use as setas ou WASD - e nao ha mais nada para aprender: portais verdes somam o numero deles a sua energia, portais vermelhos subtraem o deles, e a corrida termina quando a energia chega a zero, com o botao Restart a um clique de distancia. Os sons dos portais sao sintetizados no seu aparelho e ficam mudos ate voce ativar o som, entao uma partida rapida no escritorio ou na biblioteca fica silenciosa por padrao.</p>
<br/><h2><b>Um celular em uma mao, ou um computador de outra pessoa</b></h2>
<p>O controle por arraste e pensado primeiro para toque, entao uma unica pagina cobre tanto celular quanto desktop com teclado. Nao ha contas, nao ha upload e nao ha ranking - sua melhor distancia e energia maxima ficam salvas neste navegador e aparecem antes mesmo de voce comecar. Isso torna o jogo uma boa escolha para uma maquina compartilhada, e o botao de tela cheia coloca a corrida inteira na sua tela quando voce quiser.</p>
<br/><h2><b>Buscando sua propria melhor distancia</b></h2>
<figure class="illustration"><img src="/img/illustrations/card-row-4/guidesskygatesflightwhen__8a706c2a.svg" alt="Quatro mecanicas de pontuacao para buscar sua melhor distancia: energia inicial de 10, velocidade que afeta a pontuacao, portais vermelhos que subtraem mais com o tempo, e portais dourados que multiplicam a energia por dois." loading="lazy" width="640" height="180"><figcaption>Confira estas quatro mecanicas de pontuacao para superar sua melhor distancia no Sky Gates Flight.</figcaption></figure>
<p>O mundo nao fica facil, e e isso que torna um recorde interessante de buscar. A dificuldade sobe no relogio:</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Elemento</th><th>Os numeros</th></tr>
<tr><td>Energia inicial</td><td>10</td></tr>
<tr><td>Velocidade</td><td>Comeca em 40, sobe a cada dez segundos, limite de 90</td></tr>
<tr><td>Portais vermelhos</td><td>Subtraem mais conforme a corrida avanca</td></tr>
<tr><td>Portais dourados x2</td><td>Aparecem de vez em quando apos 30 segundos e dobram sua energia</td></tr>
</table>
<p>Como sua melhor corrida fica salva neste navegador, o recorde de ontem ja aparece na tela antes do primeiro voo de hoje - um alvo natural se voce gosta de superar seus proprios numeros.</p>
<br/><h2><b>Onde ele nao serve</b></h2>
<p>Este e um jogo arcade com fisica simplificada, nao um simulador de voo - nao ha sustentacao, estol ou modelo de combustivel, e nenhuma dinamica de voo realista para praticar. Nao ha multiplayer nem ranking, entao voce nao pode competir com um amigo online; comparar corridas significa jogar por turnos no mesmo navegador. Tambem nao ha missoes, upgrades ou escolha de aviao - um aviao, uma corrida sem fim. As melhores pontuacoes vivem apenas no localStorage deste navegador, entao limpar os dados do site as remove, e um recorde do celular nunca aparece no seu notebook.</p>
<p>Para os controles e o primeiro voo explicados em ordem, veja <a href="/guides/pt/sky-gates-flight-step-by-step.html">Sky Gates Flight passo a passo</a>.</p>
<p>Para uma comparacao honesta com jogos de voo instalados - o que cada um oferece e onde cada um ganha - veja <a href="/guides/pt/sky-gates-flight-vs-alternatives.html">Sky Gates Flight vs instalar um jogo de voo</a>.</p>
<p><a href="/games.html">&larr; Voltar para jogos</a></p>`,
  },
  es: {
    title: 'Sky Gates Flight: Cuando Sirve y Cuando No',
    desc: 'Donde sirve Sky Gates Flight - pausas cortas, telefono, computadora compartida, buscar tu mejor carrera - y donde no: fisica arcade, no un simulador de vuelo.',
    html: `<h1 class="text-uppercase"><b>Sky Gates Flight: Cuando Sirve y Cuando No</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Sky Gates Flight es una carrera arcade rapida: pilota un avioncito sobre el oceano, atraviesa los portales verdes que suman energia y evita los rojos que la drenan, y la carrera termina cuando la energia llega a cero. Juega en <a href="/games/sky-gates-flight.html">Sky Gates Flight</a>. Aqui esta donde sirve para un dia real - y donde honestamente no sirve.</p>
<br/><h2><b>Una pausa de cinco minutos entre tareas</b></h2>
<p>Presiona Start flight y ya estas volando. El control es un solo gesto - arrastra en la escena, o usa las flechas o WASD - y no hay nada mas que aprender: los portales verdes suman su numero a tu energia, los rojos restan el suyo, y la carrera termina cuando la energia llega a cero, con el boton Restart a un clic de distancia. Los sonidos de los portales se sintetizan en tu dispositivo y quedan mudos hasta que activas el sonido, asi que una partida rapida en la oficina o la biblioteca queda silenciosa por defecto.</p>
<br/><h2><b>Un telefono en una mano, o una computadora prestada</b></h2>
<p>El control por arrastre esta pensado primero para pantalla tactil, asi que una sola pagina cubre tanto telefono como escritorio con teclado. No hay cuentas, no hay subida de archivos y no hay tabla de clasificacion - tu mejor distancia y energia maxima quedan guardadas en este navegador y se muestran antes de que empieces. Eso lo convierte en una buena opcion para una maquina compartida, y el boton de pantalla completa pone toda la carrera en tu pantalla cuando quieras.</p>
<br/><h2><b>Buscando tu propia mejor distancia</b></h2>
<figure class="illustration"><img src="/img/illustrations/card-row-4/guidesskygatesflightwhen__8a706c2a.svg" alt="Cuatro mecanicas de puntuacion para buscar tu mejor distancia: energia inicial de 10, velocidad que afecta la puntuacion, portales rojos que restan mas con el tiempo, y portales dorados que multiplican la energia por dos." loading="lazy" width="640" height="180"><figcaption>Revisa estas cuatro mecanicas de puntuacion para superar tu mejor distancia en Sky Gates Flight.</figcaption></figure>
<p>El mundo no se queda facil, y por eso vale la pena perseguir un record. La dificultad avanza con el reloj:</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Elemento</th><th>Los numeros</th></tr>
<tr><td>Energia inicial</td><td>10</td></tr>
<tr><td>Velocidad</td><td>Empieza en 40, sube cada diez segundos, tope de 90</td></tr>
<tr><td>Portales rojos</td><td>Restan mas conforme avanza la carrera</td></tr>
<tr><td>Portales dorados x2</td><td>Aparecen de vez en cuando despues de 30 segundos y duplican tu energia</td></tr>
</table>
<p>Como tu mejor carrera queda guardada en este navegador, el record de ayer ya esta en pantalla antes de tu primer vuelo de hoy - un objetivo natural si te gusta superar tus propios numeros.</p>
<br/><h2><b>Donde no sirve</b></h2>
<p>Este es un juego arcade con fisica simplificada, no un simulador de vuelo - no hay sustentacion, perdida de sustentacion ni modelo de combustible, y ninguna dinamica de vuelo realista para practicar. No hay multijugador ni tabla de clasificacion, asi que no puedes competir con un amigo en linea; comparar carreras significa turnarse en el mismo navegador. Tampoco hay misiones, mejoras ni eleccion de avion - un avion, una carrera sin fin. Los mejores puntajes viven solo en el localStorage de este navegador, asi que borrar los datos del sitio los elimina, y un record del telefono nunca aparece en tu laptop.</p>
<p>Para los controles y el primer vuelo explicados en orden, mira <a href="/guides/es/sky-gates-flight-step-by-step.html">Sky Gates Flight paso a paso</a>.</p>
<p>Para una comparacion honesta con juegos de vuelo instalados - que ofrece cada uno y donde gana cada uno - mira <a href="/guides/es/sky-gates-flight-vs-alternatives.html">Sky Gates Flight vs instalar un juego de vuelo</a>.</p>
<p><a href="/games.html">&larr; Volver a juegos</a></p>`,
  },
  vi: {
    title: 'Sky Gates Flight: Khi Nao Phu Hop Va Khi Nao Khong',
    desc: 'Sky Gates Flight phu hop khi nao - nghi ngan, dien thoai, may tinh dung chung, san pha ky luc rieng - va khi nao khong: vat ly arcade, khong phai mo phong bay.',
    html: `<h1 class="text-uppercase"><b>Sky Gates Flight: Khi Nao Phu Hop Va Khi Nao Khong</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Sky Gates Flight la mot man choi arcade nhanh: lai mot chiec may bay nho tren mat bien, luon qua cac cong xanh de tang nang luong va tranh cong do lam giam nang luong, man choi ket thuc khi nang luong ve khong. Choi ngay tai <a href="/games/sky-gates-flight.html">Sky Gates Flight</a>. Day la nhung luc no phu hop voi mot ngay thuc te - va nhung luc no thuc su khong phu hop.</p>
<br/><h2><b>Mot lan nghi 5 phut giua cac viec</b></h2>
<p>Nhan Start flight la ban da bay ngay. Dieu khien chi bang mot dong tac - keo tren man hinh, hoac dung phim mui ten hay WASD - va khong con gi khac de hoc: cong xanh cong so cua no vao nang luong, cong do tru so cua no, va man choi ket thuc khi nang luong ve khong, voi nut Restart chi mot lan bam. Am thanh cong duoc tong hop ngay tren may cua ban va im lang cho den khi ban bat am thanh, nen mot luot choi nhanh o van phong hay thu vien van yen tinh theo mac dinh.</p>
<br/><h2><b>Mot chiec dien thoai tren tay, hoac mot may tinh muon</b></h2>
<p>Dieu khien keo duoc thiet ke truoc tien cho man hinh cham, nen mot trang duy nhat dung tot ca cho dien thoai va desktop co ban phim. Khong co tai khoan, khong tai len, khong bang xep hang - khoang cach xa nhat va nang luong cao nhat cua ban duoc luu trong trinh duyet nay va hien ra truoc khi ban bat dau. Dieu nay khien man choi la lua chon thoai mai cho mot may dung chung, va nut toan man hinh dua ca man choi len man hinh khi ban muon xem lon.</p>
<br/><h2><b>San pha ky luc khoang cach cua chinh minh</b></h2>
<figure class="illustration"><img src="/img/illustrations/card-row-4/guidesskygatesflightwhen__8a706c2a.svg" alt="Bon co che tinh diem de san pha ky luc khoang cach: nang luong khoi dau la 10, toc do anh huong diem so, cong do tru nhieu hon theo thoi gian, va cong vang nhan doi nang luong." loading="lazy" width="640" height="180"><figcaption>Xem bon co che tinh diem nay de vuot ky luc khoang cach trong Sky Gates Flight.</figcaption></figure>
<p>The gioi khong de mai, va do la dieu khien ky luc dang de san. Do kho tang theo dong ho:</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Yeu to</th><th>Con so</th></tr>
<tr><td>Nang luong khoi dau</td><td>10</td></tr>
<tr><td>Toc do</td><td>Bat dau tu 40, tang moi muoi giay, gioi han 90</td></tr>
<tr><td>Cong do</td><td>Tru nhieu hon khi man choi keo dai</td></tr>
<tr><td>Cong vang x2</td><td>Xuat hien doi khi sau 30 giay va nhan doi nang luong cua ban</td></tr>
</table>
<p>Vi ky luc tot nhat cua ban duoc luu trong trinh duyet nay, ky luc hom qua da hien tren man hinh truoc chuyen bay dau tien hom nay - mot muc tieu tu nhien neu ban thich vuot qua chinh minh.</p>
<br/><h2><b>Nhung luc no khong phu hop</b></h2>
<p>Day la game arcade voi vat ly don gian hoa, khong phai mo phong bay - khong co luc nang, khong co mat luc nang hay mo hinh nhien lieu, va khong co dong luc bay thuc te de luyen tap. Khong co choi nhieu nguoi va khong co bang xep hang, nen ban khong the dua voi ban qua mang; so sanh luot choi nghia la thay phien nhau tren cung mot trinh duyet. Cung khong co nhiem vu, nang cap hay chon may bay - mot chiec may bay, mot man choi khong ket thuc. Diem cao nhat chi song trong localStorage cua trinh duyet nay, nen xoa du lieu trang se mat diem, va ky luc tren dien thoai khong bao gio hien tren laptop cua ban.</p>
<p>De biet dieu khien va chuyen bay dau tien theo tung buoc, xem <a href="/guides/vi/sky-gates-flight-step-by-step.html">Sky Gates Flight tung buoc</a>.</p>
<p>De so sanh trung thuc voi cac game bay da cai dat - moi ben co gi va ben nao thang o dau - xem <a href="/guides/vi/sky-gates-flight-vs-alternatives.html">Sky Gates Flight so voi cai dat mot game bay</a>.</p>
<p><a href="/games.html">&larr; Ve trang games</a></p>`,
  },
  id: {
    title: 'Sky Gates Flight: Kapan Cocok Dan Kapan Tidak',
    desc: 'Sky Gates Flight cocok untuk apa - istirahat singkat, ponsel, komputer bersama, mengejar rekor terbaik - dan untuk apa tidak: fisika arcade, bukan simulator penerbangan.',
    html: `<h1 class="text-uppercase"><b>Sky Gates Flight: Kapan Cocok Dan Kapan Tidak</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Sky Gates Flight adalah permainan arcade singkat: terbangkan pesawat kecil di atas laut, lewati gerbang hijau yang menambah tenaga dan hindari gerbang merah yang menguranginya, dan permainan berakhir saat tenaga mencapai nol. Mainkan di <a href="/games/sky-gates-flight.html">Sky Gates Flight</a>. Berikut kapan permainan ini cocok untuk hari yang nyata - dan kapan sejujurnya tidak cocok.</p>
<br/><h2><b>Istirahat lima menit di antara tugas</b></h2>
<p>Tekan Start flight dan kamu langsung terbang. Kontrolnya satu gestur saja - seret di layar, atau pakai tombol panah atau WASD - dan tidak ada lagi yang perlu dipelajari: gerbang hijau menambahkan angkanya ke tenagamu, gerbang merah mengurangi angkanya, dan permainan berakhir saat tenaga mencapai nol, dengan tombol Restart hanya satu klik. Suara gerbang disintesis langsung di perangkatmu dan tetap bisu sampai kamu menyalakan suara, jadi sesi cepat di kantor atau perpustakaan tetap sunyi secara default.</p>
<br/><h2><b>Ponsel di satu tangan, atau komputer pinjaman</b></h2>
<p>Kontrol seret dirancang untuk sentuhan lebih dulu, jadi satu halaman ini cocok untuk ponsel maupun desktop dengan keyboard. Tidak ada akun, tidak ada unggahan, dan tidak ada papan peringkat - jarak terbaik dan tenaga puncak kamu disimpan di browser ini dan ditampilkan sebelum kamu mulai. Itu membuatnya pilihan yang nyaman untuk komputer bersama, dan tombol layar penuh menampilkan seluruh permainan di layarmu saat kamu mau.</p>
<br/><h2><b>Mengejar jarak terbaikmu sendiri</b></h2>
<figure class="illustration"><img src="/img/illustrations/card-row-4/guidesskygatesflightwhen__8a706c2a.svg" alt="Empat mekanisme skor untuk mengejar jarak terbaikmu: tenaga awal 10, kecepatan yang memengaruhi skor, gerbang merah yang mengurangi lebih banyak seiring waktu, dan gerbang emas yang melipatgandakan tenaga dua kali." loading="lazy" width="640" height="180"><figcaption>Perhatikan empat mekanisme skor ini untuk mengalahkan jarak terbaikmu di Sky Gates Flight.</figcaption></figure>
<p>Dunia permainan tidak tetap mudah, dan itulah yang membuat rekor layak dikejar. Kesulitan naik sesuai jam:</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Elemen</th><th>Angkanya</th></tr>
<tr><td>Tenaga awal</td><td>10</td></tr>
<tr><td>Kecepatan</td><td>Mulai dari 40, naik setiap sepuluh detik, batas maksimum 90</td></tr>
<tr><td>Gerbang merah</td><td>Mengurangi lebih banyak seiring permainan berlangsung</td></tr>
<tr><td>Gerbang emas x2</td><td>Muncul sesekali setelah 30 detik dan melipatgandakan tenagamu</td></tr>
</table>
<p>Karena permainan terbaikmu tersimpan di browser ini, rekor kemarin sudah tampil di layar sebelum penerbangan pertamamu hari ini - target alami jika kamu suka mengalahkan angkamu sendiri.</p>
<br/><h2><b>Kapan tidak cocok</b></h2>
<p>Ini adalah game arcade dengan fisika yang disederhanakan, bukan simulator penerbangan - tidak ada model gaya angkat, stall, atau bahan bakar, dan tidak ada dinamika penerbangan realistis untuk dilatih. Tidak ada mode multiplayer atau papan peringkat, jadi kamu tidak bisa bertanding online dengan teman; membandingkan permainan berarti bergiliran di browser yang sama. Juga tidak ada misi, peningkatan, atau pilihan pesawat - satu pesawat, satu permainan tanpa akhir. Skor terbaik hanya hidup di localStorage browser ini, jadi menghapus data situs akan menghilangkannya, dan rekor dari ponsel tidak pernah muncul di laptopmu.</p>
<p>Untuk kontrol dan penerbangan pertama yang dijelaskan urut, lihat <a href="/guides/id/sky-gates-flight-step-by-step.html">Sky Gates Flight langkah demi langkah</a>.</p>
<p>Untuk perbandingan jujur dengan game penerbangan yang diinstal - apa yang ditawarkan masing-masing dan di mana masing-masing menang - lihat <a href="/guides/id/sky-gates-flight-vs-alternatives.html">Sky Gates Flight vs menginstal game penerbangan</a>.</p>
<p><a href="/games.html">&larr; Kembali ke games</a></p>`,
  },
  de: {
    title: 'Sky Gates Flight: Wann Es Passt Und Wann Nicht',
    desc: 'Wofuer Sky Gates Flight passt - kurze Pausen, Handy, geteilter Computer, die eigene Bestleistung jagen - und wofuer nicht: Arcade-Physik, kein Flugsimulator.',
    html: `<h1 class="text-uppercase"><b>Sky Gates Flight: Wann Es Passt Und Wann Nicht</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Sky Gates Flight ist eine schnelle Arcade-Runde: steuere ein kleines Flugzeug ueber den Ozean, fliege durch gruene Tore, die Energie hinzufuegen, und meide rote, die sie abziehen - die Runde endet, wenn die Energie null erreicht. Spiele es unter <a href="/games/sky-gates-flight.html">Sky Gates Flight</a>. Hier siehst du, wofuer es im echten Alltag passt - und wofuer ehrlich gesagt nicht.</p>
<br/><h2><b>Eine fuenf-minuetige Pause zwischen Aufgaben</b></h2>
<p>Druecke Start flight und du fliegst sofort. Die Steuerung ist eine einzige Geste - ziehen auf der Szene, oder die Pfeiltasten bzw. WASD - und es gibt nichts weiter zu lernen: gruene Tore addieren ihre Zahl zu deiner Energie, rote ziehen ihre ab, und die Runde endet, wenn die Energie null erreicht, mit dem Restart-Knopf einen Klick entfernt. Die Toengeraeusche werden direkt auf deinem Geraet synthetisiert und bleiben stumm, bis du den Ton einschaltest, also bleibt eine schnelle Runde im Buero oder in der Bibliothek standardmaessig lautlos.</p>
<br/><h2><b>Ein Handy in einer Hand, oder ein geliehener Computer</b></h2>
<p>Die Ziehsteuerung ist zuerst fuer Touch gedacht, also deckt eine einzige Seite sowohl Handy als auch Desktop mit Tastatur ab. Es gibt keine Konten, keine Uploads und keine Bestenlisten - deine beste Distanz und Spitzenenergie werden in diesem Browser gespeichert und schon vor dem Start angezeigt. Das macht es zu einer angenehmen Wahl fuer einen geteilten Rechner, und der Vollbild-Knopf bringt die ganze Runde auf deinen Bildschirm, wenn du sie gross sehen willst.</p>
<br/><h2><b>Deine eigene Bestdistanz jagen</b></h2>
<figure class="illustration"><img src="/img/illustrations/card-row-4/guidesskygatesflightwhen__8a706c2a.svg" alt="Vier Punktemechaniken, um deine Bestdistanz zu jagen: Startenergie von 10, Geschwindigkeit, die die Punktzahl beeinflusst, rote Tore, die mit der Zeit mehr abziehen, und goldene Tore, die die Energie verdoppeln." loading="lazy" width="640" height="180"><figcaption>Behalte diese vier Punktemechaniken im Blick, um deine Bestdistanz in Sky Gates Flight zu schlagen.</figcaption></figure>
<p>Die Welt bleibt nicht einfach, und genau das macht einen Rekord interessant. Der Schwierigkeitsgrad steigt nach der Uhr:</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Element</th><th>Die Zahlen</th></tr>
<tr><td>Startenergie</td><td>10</td></tr>
<tr><td>Geschwindigkeit</td><td>Beginnt bei 40, steigt alle zehn Sekunden, Obergrenze 90</td></tr>
<tr><td>Rote Tore</td><td>Ziehen im Laufe der Runde mehr ab</td></tr>
<tr><td>Goldene x2-Tore</td><td>Erscheinen gelegentlich nach 30 Sekunden und verdoppeln deine Energie</td></tr>
</table>
<p>Weil deine beste Runde in diesem Browser bleibt, steht der gestrige Rekord schon auf dem Bildschirm, bevor der heutige erste Flug beginnt - ein natuerliches Ziel, wenn du gern deine eigenen Zahlen schlaegst.</p>
<br/><h2><b>Wo es nicht passt</b></h2>
<p>Das ist ein Arcade-Spiel mit vereinfachter Physik, kein Flugsimulator - es gibt kein Auftriebs-, Stall- oder Treibstoffmodell und keine realistische Flugdynamik zum Ueben. Es gibt keinen Mehrspielermodus und keine Bestenliste, du kannst also nicht online gegen einen Freund antreten; Runden vergleichen bedeutet, sich im selben Browser abzuwechseln. Es gibt auch keine Missionen, Upgrades oder Flugzeugauswahl - ein Flugzeug, eine endlose Runde. Bestwerte leben nur im localStorage dieses Browsers, das Loeschen der Website-Daten entfernt sie also, und ein Handy-Rekord taucht nie auf deinem Laptop auf.</p>
<p>Fuer die Steuerung und den ersten Flug Schritt fuer Schritt siehe <a href="/guides/de/sky-gates-flight-step-by-step.html">Sky Gates Flight Schritt fuer Schritt</a>.</p>
<p>Fuer einen ehrlichen Vergleich mit installierten Flugspielen - was jedes bietet und wo jedes gewinnt - siehe <a href="/guides/de/sky-gates-flight-vs-alternatives.html">Sky Gates Flight vs ein Flugspiel installieren</a>.</p>
<p><a href="/games.html">&larr; Zurueck zu Spielen</a></p>`,
  },
};

// ---- angle: step-by-step ----
const step = {
  kebab: 'sky-gates-flight-step-by-step',
  pt: {
    title: 'Como Jogar Sky Gates Flight - Passo a Passo',
    desc: 'Comece um voo, passe pelos portais verdes, evite os vermelhos e sobreviva a rampa de velocidade no Sky Gates Flight - um passo a passo de cada etapa.',
    html: `<h1 class="text-uppercase"><b>Como Jogar Sky Gates Flight - Passo a Passo</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/games/sky-gates-flight.html">Sky Gates Flight</a> e um jogo arcade de voo direto no navegador: pilote um aviao pequeno sobre o oceano, passe pelos portais verdes para ganhar energia, evite os vermelhos, e continue enquanto a energia durar. Toda corrida comeca com 10 de energia, e sua melhor distancia fica salva neste aparelho.</p>
<br/><h2><b>Comece um voo</b></h2>
<p>Abra a pagina e sua melhor distancia e energia maxima de corridas anteriores aparecem antes mesmo de voce decolar - nao ha nada para instalar nem conta para criar. Clique em Start flight e o aviao decola sobre o oceano com energia de 10. Esse numero e a barra de vida da corrida: cada portal que voce atravessa muda esse valor, e o voo dura enquanto ele ficar acima de zero.</p>
<br/><h2><b>Controle por arraste ou teclado</b></h2>
<p>Arraste em qualquer lugar da cena para mover o aviao - funciona com o dedo no celular e com o mouse no desktop - ou use as setas ou WASD. O controle cobre esquerda, direita, cima e baixo dentro de um corredor enquanto o cenario rola em sua direcao. O aviao inclina nas curvas e sobe a bico durante a subida, e uma camera de perseguicao segue por tras. Um clique no botao de tela cheia coloca a corrida inteira na sua tela.</p>
<br/><h2><b>Leia os portais</b></h2>
<p>Faixas de portais amarradas entre postes aparecem em fileiras adiante. Portais verdes somam o numero deles a sua energia, portais vermelhos subtraem o deles, e depois de 30 segundos um portal dourado x2 ocasional dobra o que voce tiver. Toda fileira contem pelo menos uma opcao verde, entao sempre existe um caminho sobrevivivel - a habilidade e enxergar essa opcao a tempo de alcanca-la. Os portais estouram e desaparecem quando voce passa por eles.</p>
<br/><h2><b>Sobreviva a rampa de velocidade</b></h2>
<p>O ritmo aumenta enquanto voce voa: a velocidade sobe a cada dez segundos de 40 rumo a um limite de 90, os portais vermelhos ficam mais duros com o tempo, e as fileiras de portais se apertam com a distancia. Isso e voo arcade com fisica simplificada, nao um simulador de voo - sem modelo de combustivel, sem estol, apenas controle. Quando a energia chega a zero a corrida termina com sua distancia final e energia maxima, alem de um botao Restart para a proxima tentativa.</p>
<br/><h2><b>Guarde seu melhor resultado e ative o som</b></h2>
<p>Sua melhor corrida - energia maxima e distancia - fica salva automaticamente no localStorage deste navegador e aparece antes do seu proximo voo. Ela fica apenas neste aparelho: nao ha contas, uploads ou ranking, e limpar os dados do site a remove. Os sons dos portais sao sintetizados no seu aparelho em vez de carregados como arquivo de audio, e ficam mudos ate voce clicar no botao de som.</p>
<p>Para ajudar a decidir quando uma corrida arcade curta como esta serve melhor, veja <a href="/guides/pt/sky-gates-flight-when.html">quando jogar Sky Gates Flight</a>.</p>
<p>Para uma comparacao honesta com jogos de voo instalados - o que cada um oferece e onde cada um ganha - veja <a href="/guides/pt/sky-gates-flight-vs-alternatives.html">Sky Gates Flight vs instalar um jogo de voo</a>.</p>
<p><a href="/games.html">&larr; Voltar para jogos</a></p>`,
  },
  es: {
    title: 'Como Jugar Sky Gates Flight - Paso a Paso',
    desc: 'Empieza un vuelo, esquiva portales rojos, atraviesa los verdes, y sobrevive la rampa de velocidad en Sky Gates Flight - un recorrido paso a paso de cada etapa.',
    html: `<h1 class="text-uppercase"><b>Como Jugar Sky Gates Flight - Paso a Paso</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/games/sky-gates-flight.html">Sky Gates Flight</a> es un juego arcade de vuelo directo en el navegador: pilota un avioncito sobre el oceano, atraviesa los portales verdes para ganar energia, evita los rojos, y sigue mientras la energia dure. Cada carrera empieza con 10 de energia, y tu mejor distancia queda guardada en este dispositivo.</p>
<br/><h2><b>Empieza un vuelo</b></h2>
<p>Abre la pagina y tu mejor distancia y energia maxima de carreras anteriores se muestran antes de que despegues - no hay nada que instalar ni cuenta que crear. Haz clic en Start flight y el avion despega sobre el oceano con energia de 10. Ese numero es la barra de vida de la carrera: cada portal que atraviesas la cambia, y el vuelo dura mientras se mantenga por encima de cero.</p>
<br/><h2><b>Controla con arrastre o teclado</b></h2>
<p>Arrastra en cualquier parte de la escena para mover el avion - funciona con el dedo en el telefono y con el mouse en el escritorio - o usa las flechas o WASD. El control cubre izquierda, derecha, arriba y abajo dentro de un corredor mientras el mundo se desplaza hacia ti. El avion se inclina en los giros y sube el morro al subir, y una camara de seguimiento va detras. Un clic en el boton de pantalla completa pone toda la carrera en tu pantalla.</p>
<br/><h2><b>Lee los portales</b></h2>
<p>Filas de portales colgados entre postes aparecen mas adelante. Los portales verdes suman su numero a tu energia, los rojos restan el suyo, y despues de 30 segundos un portal dorado x2 ocasional duplica lo que tengas. Cada fila tiene al menos una opcion verde, asi que siempre hay un camino con el que sobrevivir - la habilidad es verla a tiempo para alcanzarla. Los portales estallan y se desvanecen cuando los atraviesas.</p>
<br/><h2><b>Sobrevive la rampa de velocidad</b></h2>
<p>El ritmo sube mientras vuelas: la velocidad crece cada diez segundos de 40 hacia un tope de 90, los portales rojos se vuelven mas duros con el tiempo, y las filas de portales se cierran con la distancia. Esto es vuelo arcade con fisica simplificada, no un simulador de vuelo - sin modelo de combustible, sin perdida de sustentacion, solo control. Cuando la energia llega a cero la carrera termina con tu distancia final y energia maxima, mas un boton Restart para el siguiente intento.</p>
<br/><h2><b>Guarda tu mejor resultado y activa el sonido</b></h2>
<p>Tu mejor carrera - energia maxima y distancia - se guarda automaticamente en el localStorage de este navegador y se muestra antes de tu siguiente vuelo. Se queda solo en este dispositivo: no hay cuentas, subidas ni tablas de clasificacion, y borrar los datos del sitio la elimina. Los sonidos de los portales se sintetizan en tu dispositivo en vez de cargarse como archivos de audio, y quedan mudos hasta que haces clic en el boton de sonido.</p>
<p>Para ayudarte a decidir cuando sirve mejor una carrera arcade corta como esta, mira <a href="/guides/es/sky-gates-flight-when.html">cuando jugar Sky Gates Flight</a>.</p>
<p>Para una comparacion honesta con juegos de vuelo instalados - que ofrece cada uno y donde gana cada uno - mira <a href="/guides/es/sky-gates-flight-vs-alternatives.html">Sky Gates Flight vs instalar un juego de vuelo</a>.</p>
<p><a href="/games.html">&larr; Volver a juegos</a></p>`,
  },
  vi: {
    title: 'Cach Choi Sky Gates Flight - Tung Buoc',
    desc: 'Bat dau bay, luon qua cong xanh, tranh cong do, va song sot qua muc tang toc do trong Sky Gates Flight - huong dan tung buoc cho moi giai doan.',
    html: `<h1 class="text-uppercase"><b>Cach Choi Sky Gates Flight - Tung Buoc</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/games/sky-gates-flight.html">Sky Gates Flight</a> la game bay arcade choi ngay tren trinh duyet: lai mot chiec may bay nho tren mat bien, bay qua cong xanh de tang nang luong, tranh cong do, va tiep tuc bay khi nang luong con. Moi man choi bat dau voi 10 nang luong, va khoang cach xa nhat cua ban duoc luu tren may nay.</p>
<br/><h2><b>Bat dau mot chuyen bay</b></h2>
<p>Mo trang va khoang cach xa nhat cung nang luong cao nhat tu nhung lan truoc hien ra truoc khi ban cat canh - khong co gi de cai dat va khong can tao tai khoan. Nhan Start flight va may bay cat canh tren mat bien voi nang luong 10. Con so nay la thanh mau cua man choi: moi cong ban bay qua se thay doi no, va chuyen bay keo dai chung nao no con tren khong.</p>
<br/><h2><b>Dieu khien bang keo hoac ban phim</b></h2>
<p>Keo bat cu dau tren man hinh de di chuyen may bay - dung ngon tay tren dien thoai va dung chuot tren desktop deu duoc - hoac dung phim mui ten hay WASD. Dieu khien bao gom trai, phai, len, xuong trong mot hanh lang khi the gioi cuon ve phia ban. May bay nghieng khi re va ngoc mui khi len cao, va mot camera theo sau doi theo phia sau. Mot lan nhan nut toan man hinh dua ca man choi len man hinh cua ban.</p>
<br/><h2><b>Doc cac cong</b></h2>
<p>Cac day cong treo giua nhung cot xuat hien thanh hang phia truoc. Cong xanh cong so cua no vao nang luong, cong do tru so cua no, va sau 30 giay mot cong vang x2 doi khi nhan doi nang luong ban dang co. Moi hang co it nhat mot lua chon xanh, nen luon co mot duong de song sot - ky nang la nhan ra no du som de toi duoc. Cong no va bien mat khi ban bay qua.</p>
<br/><h2><b>Song sot qua muc tang toc do</b></h2>
<p>Nhip do tang len khi ban bay: toc do tang moi muoi giay tu 40 huong toi gioi han 90, cong do tro nen kho hon theo thoi gian, va cac hang cong xit lai gan hon theo khoang cach. Day la kieu bay arcade voi vat ly don gian hoa, khong phai mo phong bay - khong mo hinh nhien lieu, khong mat luc nang, chi co dieu khien. Khi nang luong ve khong man choi ket thuc voi khoang cach cuoi cung va nang luong cao nhat cua ban, cong voi nut Restart cho lan thu tiep theo.</p>
<br/><h2><b>Luu ky luc va bat am thanh</b></h2>
<p>Man choi tot nhat cua ban - nang luong cao nhat va khoang cach - tu dong duoc luu trong localStorage cua trinh duyet nay va hien ra truoc chuyen bay tiep theo. No chi o lai tren may nay: khong co tai khoan, tai len hay bang xep hang, va xoa du lieu trang se mat no. Am thanh cong duoc tong hop ngay tren may cua ban thay vi tai len duoi dang file am thanh, va im lang cho den khi ban nhan nut am thanh.</p>
<p>De giup quyet dinh khi nao mot man bay arcade ngan nhu the nay phu hop nhat, xem <a href="/guides/vi/sky-gates-flight-when.html">khi nao nen choi Sky Gates Flight</a>.</p>
<p>De so sanh trung thuc voi cac game bay da cai dat - moi ben co gi va ben nao thang o dau - xem <a href="/guides/vi/sky-gates-flight-vs-alternatives.html">Sky Gates Flight so voi cai dat mot game bay</a>.</p>
<p><a href="/games.html">&larr; Ve trang games</a></p>`,
  },
  id: {
    title: 'Cara Bermain Sky Gates Flight - Langkah Demi Langkah',
    desc: 'Mulai penerbangan, lewati gerbang hijau, hindari yang merah, dan bertahan dari kenaikan kecepatan di Sky Gates Flight - panduan langkah demi langkah setiap tahap.',
    html: `<h1 class="text-uppercase"><b>Cara Bermain Sky Gates Flight - Langkah Demi Langkah</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/games/sky-gates-flight.html">Sky Gates Flight</a> adalah game arcade penerbangan yang dimainkan langsung di browser: kendalikan pesawat kecil di atas laut, terbang melewati gerbang hijau untuk menambah tenaga, hindari yang merah, dan terus terbang selama tenaga masih ada. Setiap permainan dimulai dengan tenaga 10, dan jarak terbaikmu disimpan di perangkat ini.</p>
<br/><h2><b>Mulai penerbangan</b></h2>
<p>Buka halaman dan jarak terbaik serta tenaga puncak dari permainan sebelumnya ditampilkan sebelum kamu lepas landas - tidak ada yang perlu diinstal dan tidak perlu membuat akun. Klik Start flight dan pesawat lepas landas di atas laut dengan tenaga 10. Angka itu adalah bar nyawa permainan: setiap gerbang yang kamu lewati mengubahnya, dan penerbangan berlangsung selama angka itu di atas nol.</p>
<br/><h2><b>Kendalikan dengan seret atau keyboard</b></h2>
<p>Seret di mana saja pada layar untuk menggerakkan pesawat - berfungsi dengan jari di ponsel dan mouse di desktop - atau pakai tombol panah atau WASD. Kontrol mencakup kiri, kanan, atas, dan bawah di dalam sebuah koridor sementara dunia menggulir ke arahmu. Pesawat miring saat berbelok dan mendongak saat naik, dan kamera pengikut bergerak di belakang. Satu klik pada tombol layar penuh menampilkan seluruh permainan di layarmu.</p>
<br/><h2><b>Membaca gerbang</b></h2>
<p>Deretan gerbang yang terikat di antara tiang muncul berbaris di depan. Gerbang hijau menambahkan angkanya ke tenagamu, gerbang merah mengurangi angkanya, dan setelah 30 detik sebuah gerbang emas x2 sesekali melipatgandakan tenaga yang kamu punya. Setiap baris punya setidaknya satu pilihan hijau, jadi selalu ada jalur yang bisa dilalui - keahliannya adalah melihatnya cukup awal untuk mencapainya. Gerbang meletup dan menghilang saat kamu melewatinya.</p>
<br/><h2><b>Bertahan dari kenaikan kecepatan</b></h2>
<p>Tempo naik saat kamu terbang: kecepatan naik setiap sepuluh detik dari 40 menuju batas 90, gerbang merah makin keras seiring waktu, dan deretan gerbang makin rapat dengan jarak. Ini adalah penerbangan arcade dengan fisika yang disederhanakan, bukan simulator penerbangan - tidak ada model bahan bakar, tidak ada stall, hanya kendali. Saat tenaga mencapai nol permainan berakhir dengan jarak akhir dan tenaga puncakmu, ditambah tombol Restart untuk percobaan berikutnya.</p>
<br/><h2><b>Simpan rekor dan nyalakan suara</b></h2>
<p>Permainan terbaikmu - tenaga puncak dan jarak - otomatis disimpan di localStorage browser ini dan ditampilkan sebelum penerbangan berikutnya. Itu hanya tersimpan di perangkat ini: tidak ada akun, unggahan, atau papan peringkat, dan menghapus data situs akan menghilangkannya. Suara gerbang disintesis langsung di perangkatmu alih-alih dimuat sebagai file audio, dan tetap bisu sampai kamu mengklik sakelar suara.</p>
<p>Untuk membantu memutuskan kapan permainan arcade singkat seperti ini paling cocok, lihat <a href="/guides/id/sky-gates-flight-when.html">kapan bermain Sky Gates Flight</a>.</p>
<p>Untuk perbandingan jujur dengan game penerbangan yang diinstal - apa yang ditawarkan masing-masing dan di mana masing-masing menang - lihat <a href="/guides/id/sky-gates-flight-vs-alternatives.html">Sky Gates Flight vs menginstal game penerbangan</a>.</p>
<p><a href="/games.html">&larr; Kembali ke games</a></p>`,
  },
  de: {
    title: 'Sky Gates Flight Spielen - Schritt fuer Schritt',
    desc: 'Starte einen Flug, fliege durch gruene Tore, weiche roten aus, und ueberlebe die Geschwindigkeitsrampe in Sky Gates Flight - eine Schritt-fuer-Schritt-Anleitung jeder Phase.',
    html: `<h1 class="text-uppercase"><b>Sky Gates Flight Spielen - Schritt fuer Schritt</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/games/sky-gates-flight.html">Sky Gates Flight</a> ist ein Arcade-Flugspiel direkt im Browser: steuere ein kleines Flugzeug ueber den Ozean, fliege durch gruene Tore, um Energie aufzubauen, weiche roten aus, und fliege weiter, solange die Energie reicht. Jede Runde beginnt mit 10 Energie, und deine beste Distanz wird auf diesem Geraet gespeichert.</p>
<br/><h2><b>Einen Flug starten</b></h2>
<p>Oeffne die Seite und deine beste Distanz und Spitzenenergie aus frueheren Runden werden angezeigt, noch bevor du abhebst - es gibt nichts zu installieren und kein Konto zu erstellen. Klicke auf Start flight und das Flugzeug hebt ueber dem Ozean ab, mit einer Energie von 10. Diese Zahl ist die Lebensanzeige der Runde: jedes Tor, durch das du fliegst, veraendert sie, und der Flug dauert, solange sie ueber null bleibt.</p>
<br/><h2><b>Mit Ziehen oder Tastatur steuern</b></h2>
<p>Ziehe irgendwo auf der Szene, um das Flugzeug zu bewegen - das funktioniert mit dem Finger auf dem Handy und mit der Maus am Desktop - oder benutze die Pfeiltasten oder WASD. Die Steuerung deckt links, rechts, oben und unten innerhalb eines Korridors ab, waehrend die Welt auf dich zurollt. Das Flugzeug legt sich in Kurven und richtet die Nase beim Steigen auf, und eine Verfolgungskamera bleibt dahinter. Ein Klick auf den Vollbild-Knopf bringt die ganze Runde auf deinen Bildschirm.</p>
<br/><h2><b>Die Tore lesen</b></h2>
<p>Zwischen Pfosten gespannte Torreihen erscheinen vor dir. Gruene Tore addieren ihre Zahl zu deiner Energie, rote ziehen ihre ab, und nach 30 Sekunden verdoppelt ein gelegentliches goldenes x2-Tor, was du hast. Jede Reihe enthaelt mindestens eine gruene Option, es gibt also immer einen ueberlebbaren Weg - die Kunst ist, ihn frueh genug zu erkennen, um ihn zu erreichen. Tore ploppen und verblassen, wenn du durch sie fliegst.</p>
<br/><h2><b>Die Geschwindigkeitsrampe ueberleben</b></h2>
<p>Das Tempo steigt, waehrend du fliegst: die Geschwindigkeit klettert alle zehn Sekunden von 40 auf eine Obergrenze von 90, rote Tore werden mit der Zeit haerter, und die Torreihen ruecken mit der Distanz enger zusammen. Das ist Arcade-Fliegen mit vereinfachter Physik, kein Flugsimulator - kein Treibstoffmodell, kein Stall, nur Steuerung. Wenn die Energie null erreicht, endet die Runde mit deiner Enddistanz und Spitzenenergie, plus einem Restart-Knopf fuer den naechsten Versuch.</p>
<br/><h2><b>Rekord speichern und Ton einschalten</b></h2>
<p>Deine beste Runde - Spitzenenergie und Distanz - wird automatisch im localStorage dieses Browsers gespeichert und vor deinem naechsten Flug angezeigt. Sie bleibt nur auf diesem Geraet: es gibt keine Konten, Uploads oder Bestenlisten, und das Loeschen der Website-Daten entfernt sie. Torgeraeusche werden direkt auf deinem Geraet synthetisiert statt als Audiodateien geladen, und bleiben stumm, bis du den Ton-Schalter anklickst.</p>
<p>Um zu entscheiden, wann eine kurze Arcade-Runde wie diese am besten passt, siehe <a href="/guides/de/sky-gates-flight-when.html">wann Sky Gates Flight spielen</a>.</p>
<p>Fuer einen ehrlichen Vergleich mit installierten Flugspielen - was jedes bietet und wo jedes gewinnt - siehe <a href="/guides/de/sky-gates-flight-vs-alternatives.html">Sky Gates Flight vs ein Flugspiel installieren</a>.</p>
<p><a href="/games.html">&larr; Zurueck zu Spielen</a></p>`,
  },
};

// ---- angle: vs-alternatives ----
const vs = {
  kebab: 'sky-gates-flight-vs-alternatives',
  pt: {
    title: 'Sky Gates Flight vs Instalar um Jogo de Voo',
    desc: 'Sky Gates Flight comparado a um jogo de voo instalado tipico: 0 MB para instalar, segundos para o primeiro voo, e um olhar honesto sobre onde cada lado ganha.',
    html: `<h1 class="text-uppercase"><b>Sky Gates Flight vs Instalar um Jogo de Voo</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Para um voo arcade rapido, <a href="/games/sky-gates-flight.html">Sky Gates Flight</a> coloca voce no ar direto no navegador sem nada instalado, enquanto um app de jogo de voo pede download e configuracao primeiro. Aqui esta um olhar honesto sobre o que cada lado oferece, com numeros inclusos.</p>
<br/><h2><b>Os numeros lado a lado</b></h2>
<figure class="illustration"><img src="/img/illustrations/card-row-4/guidesskygatesflightvsalternatives__3971d429.svg" alt="Numeros rapidos do Sky Gates Flight: zero MB de tamanho de instalacao, segundos para o primeiro voo, gratis sem conta, um aviao em uma corrida sem fim." loading="lazy" width="640" height="180"><figcaption>Compare Sky Gates Flight com um jogo instalado: zero instalacao, gratis, e voando em segundos.</figcaption></figure>
<p>Sky Gates Flight zera a configuracao habitual: nada para instalar, gratis, e voando em segundos. Um jogo de voo instalado pede mais de voce antes de comecar.</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Aspecto</th><th>Sky Gates Flight no navegador</th><th>Jogo de voo instalado tipico</th></tr>
<tr><td>Tamanho da instalacao</td><td>0 MB - um motor 3D de 0.7 MB carrega uma vez e fica em cache</td><td>Centenas de MB ou mais</td></tr>
<tr><td>Tempo para o primeiro voo</td><td>Segundos - carregue a pagina, clique em Start flight</td><td>Minutos - baixar, instalar, abrir</td></tr>
<tr><td>Preco</td><td>0 - gratis, sem conta</td><td>Muitas vezes pago ou cheio de compras</td></tr>
<tr><td>Conteudo</td><td>Um aviao, uma corrida sem fim</td><td>Missoes, upgrades, escolha de aviao</td></tr>
</table>
<p>A diferenca fica principalmente no comeco. Tudo na tela - aviao, oceano, ilhas, nuvens, portais - e geometria procedural desenhada em tempo real no seu navegador, entao nenhum arquivo de modelo, sprite ou audio e baixado.</p>
<br/><h2><b>Onde a versao no navegador ganha</b></h2>
<p>Uma pagina cobre desktop e celular: controle arrastando na cena ou com as setas e WASD, e o botao de tela cheia coloca a corrida inteira na sua tela. O jogo aumenta a dificuldade por conta propria - a velocidade sobe a cada dez segundos de 40 rumo a um limite de 90, os portais vermelhos ficam mais duros com o tempo, e um portal dourado x2 ocasional dobra sua energia depois de 30 segundos de voo. Sua melhor distancia e energia maxima ficam salvas neste navegador e aparecem antes mesmo de voce comecar, sem contas, uploads ou ranking envolvidos.</p>
<br/><h2><b>Onde um jogo instalado ainda ganha</b></h2>
<p>Um jogo de voo instalado geralmente justifica o download em algum ponto. Muitos trazem modelos de voo realistas com sustentacao, estol e combustivel; Sky Gates Flight e um jogo arcade com fisica simplificada, nao um simulador de voo. Titulos instalados costumam somar missoes, upgrades, escolha de aviao e trilhas sonoras completas; aqui ha um aviao, uma corrida sem fim, e sons de portal sintetizados no seu aparelho que ficam mudos ate voce ativar o som. Os salvamentos tambem funcionam diferente: sua corrida recorde vive apenas no armazenamento local deste navegador, entao limpar os dados do site a remove, e ela nao viaja entre aparelhos.</p>
<br/><h2><b>A regra pratica</b></h2>
<p>A regra pratica para Sky Gates Flight: use a versao no navegador quando o ponto e voar agora mesmo - uma pausa curta, um computador compartilhado, um celular sem espaco de sobra. Escolha um jogo instalado quando quiser fisica de voo realista, missoes e progressao, ou som pensado como trilha sonora em vez de um simples botao.</p>
<p>Para os portais, controles e pontuacao em detalhe, veja <a href="/guides/pt/sky-gates-flight-step-by-step.html">Sky Gates Flight passo a passo</a>.</p>
<p>Para as situacoes em que uma corrida curta no navegador realmente serve - e onde nao serve - veja <a href="/guides/pt/sky-gates-flight-when.html">quando jogar Sky Gates Flight</a>.</p>
<p><a href="/games.html">&larr; Voltar para jogos</a></p>`,
  },
  es: {
    title: 'Sky Gates Flight vs Instalar un Juego de Vuelo',
    desc: 'Sky Gates Flight comparado con un juego de vuelo instalado tipico: 0 MB para instalar, segundos para el primer vuelo, y una mirada honesta a donde gana cada lado.',
    html: `<h1 class="text-uppercase"><b>Sky Gates Flight vs Instalar un Juego de Vuelo</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Para un vuelo arcade rapido, <a href="/games/sky-gates-flight.html">Sky Gates Flight</a> te pone en el aire directo en el navegador sin nada instalado, mientras que una app de juego de vuelo pide descarga y configuracion primero. Aqui una mirada honesta a lo que ofrece cada lado, con numeros incluidos.</p>
<br/><h2><b>Los numeros lado a lado</b></h2>
<figure class="illustration"><img src="/img/illustrations/card-row-4/guidesskygatesflightvsalternatives__3971d429.svg" alt="Datos rapidos de Sky Gates Flight: cero MB de tamano de instalacion, segundos para el primer vuelo, gratis sin cuenta, un avion en una carrera sin fin." loading="lazy" width="640" height="180"><figcaption>Compara Sky Gates Flight con un juego instalado: cero instalacion, gratis, y volando en segundos.</figcaption></figure>
<p>Sky Gates Flight reduce la configuracion habitual a cero: nada que instalar, gratis, y volando en segundos. Un juego de vuelo instalado pide mas de entrada.</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Aspecto</th><th>Sky Gates Flight en el navegador</th><th>Juego de vuelo instalado tipico</th></tr>
<tr><td>Tamano de instalacion</td><td>0 MB - un motor 3D de 0.7 MB carga una vez y queda en cache</td><td>Cientos de MB o mas</td></tr>
<tr><td>Tiempo al primer vuelo</td><td>Segundos - carga la pagina, haz clic en Start flight</td><td>Minutos - descargar, instalar, abrir</td></tr>
<tr><td>Precio</td><td>0 - gratis, sin cuenta</td><td>A menudo de pago o lleno de compras</td></tr>
<tr><td>Contenido</td><td>Un avion, una carrera sin fin</td><td>Misiones, mejoras, eleccion de avion</td></tr>
</table>
<p>La diferencia esta sobre todo al inicio. Todo en pantalla - avion, oceano, islas, nubes, portales - es geometria procedural dibujada en vivo en tu navegador, asi que no se descarga ningun archivo de modelo, sprite ni audio.</p>
<br/><h2><b>Donde gana la version del navegador</b></h2>
<p>Una pagina cubre escritorio y telefono: controla arrastrando en la escena o con las flechas y WASD, y el boton de pantalla completa pone toda la carrera en tu pantalla. El juego aumenta la dificultad por si solo - la velocidad sube cada diez segundos de 40 hacia un tope de 90, los portales rojos se vuelven mas duros con el tiempo, y un portal dorado x2 ocasional duplica tu energia despues de 30 segundos de vuelo. Tu mejor distancia y energia maxima quedan guardadas en este navegador y se muestran antes de que empieces, sin cuentas, subidas ni tablas de clasificacion.</p>
<br/><h2><b>Donde todavia gana un juego instalado</b></h2>
<p>Un juego de vuelo instalado suele justificar la descarga en algun punto. Muchos traen modelos de vuelo realistas con sustentacion, perdida de sustentacion y combustible; Sky Gates Flight es un juego arcade con fisica simplificada, no un simulador de vuelo. Los titulos instalados suelen sumar misiones, mejoras, eleccion de avion y bandas sonoras completas; aqui hay un avion, una carrera sin fin, y sonidos de portal sintetizados en tu dispositivo que quedan mudos hasta que activas el sonido. Los guardados tambien funcionan distinto: tu carrera record vive solo en el almacenamiento local de este navegador, asi que borrar los datos del sitio la elimina, y no viaja entre dispositivos.</p>
<br/><h2><b>La regla practica</b></h2>
<p>La regla practica para Sky Gates Flight: usa la version del navegador cuando el punto es volar ahora mismo - una pausa corta, una computadora compartida, un telefono sin espacio de sobra. Elige un juego instalado cuando quieras fisica de vuelo realista, misiones y progresion, o sonido pensado como banda sonora en vez de un simple interruptor.</p>
<p>Para los portales, controles y puntuacion en detalle, mira <a href="/guides/es/sky-gates-flight-step-by-step.html">Sky Gates Flight paso a paso</a>.</p>
<p>Para las situaciones en las que una carrera corta en el navegador realmente sirve - y donde no - mira <a href="/guides/es/sky-gates-flight-when.html">cuando jugar Sky Gates Flight</a>.</p>
<p><a href="/games.html">&larr; Volver a juegos</a></p>`,
  },
  vi: {
    title: 'Sky Gates Flight so voi Cai Dat Mot Game Bay',
    desc: 'Sky Gates Flight so voi mot game bay cai dat thong thuong: 0 MB de cai dat, vai giay de bay lan dau, va cai nhin trung thuc ve noi moi ben thang.',
    html: `<h1 class="text-uppercase"><b>Sky Gates Flight so voi Cai Dat Mot Game Bay</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>De co mot man bay arcade nhanh, <a href="/games/sky-gates-flight.html">Sky Gates Flight</a> dua ban len khong trung ngay tren trinh duyet ma khong can cai gi, con mot app game bay thi can tai xuong va cai dat truoc. Day la cai nhin trung thuc ve nhung gi moi ben mang lai, kem so lieu cu the.</p>
<br/><h2><b>So lieu dat canh nhau</b></h2>
<figure class="illustration"><img src="/img/illustrations/card-row-4/guidesskygatesflightvsalternatives__3971d429.svg" alt="Thong tin nhanh ve Sky Gates Flight: dung luong cai dat bang khong, bay lan dau trong vai giay, mien phi khong can tai khoan, mot may bay trong man choi khong ket thuc." loading="lazy" width="640" height="180"><figcaption>So sanh Sky Gates Flight voi mot game cai dat: khong can cai dat, mien phi, va bay duoc trong vai giay.</figcaption></figure>
<p>Sky Gates Flight dua buoc chuan bi thuong thay ve khong: khong can cai gi, mien phi, va bay duoc trong vai giay. Mot game bay cai dat thi doi hoi nhieu hon tu dau.</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Khia canh</th><th>Sky Gates Flight tren trinh duyet</th><th>Game bay cai dat thong thuong</th></tr>
<tr><td>Dung luong cai dat</td><td>0 MB - dong co 3D 0.7 MB tai mot lan roi luu cache</td><td>Hang tram MB hoac hon</td></tr>
<tr><td>Thoi gian den lan bay dau</td><td>Vai giay - tai trang, nhan Start flight</td><td>Vai phut - tai xuong, cai dat, mo</td></tr>
<tr><td>Gia</td><td>0 - mien phi, khong can tai khoan</td><td>Thuong co phi hoac nhieu muc mua trong game</td></tr>
<tr><td>Noi dung</td><td>Mot may bay, mot man choi khong ket thuc</td><td>Nhiem vu, nang cap, chon may bay</td></tr>
</table>
<p>Khoang cach chu yeu nam o phan dau. Moi thu tren man hinh - may bay, mat bien, dao, may, cong - deu la hinh khoi thu tuc duoc ve truc tiep tren trinh duyet cua ban, nen khong co file mo hinh, sprite hay am thanh nao duoc tai xuong.</p>
<br/><h2><b>Noi ban trinh duyet thang</b></h2>
<p>Mot trang dung tot cho ca desktop va dien thoai: dieu khien bang keo tren man hinh hoac bang phim mui ten va WASD, va nut toan man hinh dua ca man choi len man hinh cua ban. Game tu tang do kho - toc do tang moi muoi giay tu 40 huong toi gioi han 90, cong do tro nen kho hon theo thoi gian, va mot cong vang x2 doi khi xuat hien sau 30 giay bay se nhan doi nang luong cua ban. Khoang cach xa nhat va nang luong cao nhat cua ban duoc luu trong trinh duyet nay va hien ra truoc khi ban bat dau, khong can tai khoan, tai len hay bang xep hang.</p>
<br/><h2><b>Noi mot game cai dat van thang</b></h2>
<p>Mot game bay cai dat thuong dang gia tai xuong o mot diem nao do. Nhieu game co mo hinh bay thuc te voi luc nang, mat luc nang va nhien lieu; Sky Gates Flight la game arcade voi vat ly don gian hoa, khong phai mo phong bay. Cac game cai dat thuong them nhiem vu, nang cap, chon may bay va nhac nen day du; o day chi co mot may bay, mot man choi khong ket thuc, va am thanh cong duoc tong hop ngay tren may cua ban va im lang cho den khi ban bat am thanh. Cach luu cung khac: man choi ky luc cua ban chi song trong bo nho cuc bo cua trinh duyet nay, nen xoa du lieu trang se mat no, va no khong theo ban sang thiet bi khac.</p>
<br/><h2><b>Quy tac thuc te</b></h2>
<p>Quy tac thuc te cho Sky Gates Flight: dung ban trinh duyet khi muc tieu la bay ngay bay gio - mot lan nghi ngan, mot may tinh dung chung, mot dien thoai khong con nhieu dung luong trong. Chon mot game cai dat khi ban muon vat ly bay thuc te, nhiem vu va tien trinh, hoac am thanh duoc thiet ke nhu mot ban nhac thay vi chi la mot nut bat tat.</p>
<p>De xem chi tiet ve cong, dieu khien va tinh diem, xem <a href="/guides/vi/sky-gates-flight-step-by-step.html">Sky Gates Flight tung buoc</a>.</p>
<p>De xem nhung tinh huong ma mot man bay ngan tren trinh duyet thuc su phu hop - va khi nao khong - xem <a href="/guides/vi/sky-gates-flight-when.html">khi nao nen choi Sky Gates Flight</a>.</p>
<p><a href="/games.html">&larr; Ve trang games</a></p>`,
  },
  id: {
    title: 'Sky Gates Flight vs Menginstal Game Penerbangan',
    desc: 'Sky Gates Flight dibandingkan dengan game penerbangan terinstal yang umum: 0 MB untuk instal, hitungan detik ke penerbangan pertama, dan pandangan jujur soal siapa menang di mana.',
    html: `<h1 class="text-uppercase"><b>Sky Gates Flight vs Menginstal Game Penerbangan</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Untuk penerbangan arcade cepat, <a href="/games/sky-gates-flight.html">Sky Gates Flight</a> membuatmu terbang langsung di browser tanpa instalasi apa pun, sementara app game penerbangan meminta unduhan dan pengaturan dulu. Berikut pandangan jujur soal apa yang ditawarkan masing-masing, lengkap dengan angka.</p>
<br/><h2><b>Angka berdampingan</b></h2>
<figure class="illustration"><img src="/img/illustrations/card-row-4/guidesskygatesflightvsalternatives__3971d429.svg" alt="Fakta cepat Sky Gates Flight: ukuran instalasi nol MB, penerbangan pertama dalam hitungan detik, gratis tanpa akun, satu pesawat dalam permainan tanpa akhir." loading="lazy" width="640" height="180"><figcaption>Bandingkan Sky Gates Flight dengan game terinstal: nol instalasi, gratis, dan terbang dalam hitungan detik.</figcaption></figure>
<p>Sky Gates Flight memangkas persiapan biasa jadi nol: tidak ada yang perlu diinstal, gratis, dan terbang dalam hitungan detik. Game penerbangan terinstal meminta lebih banyak di awal.</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Aspek</th><th>Sky Gates Flight di browser</th><th>Game penerbangan terinstal yang umum</th></tr>
<tr><td>Ukuran instalasi</td><td>0 MB - mesin 3D 0.7 MB dimuat sekali lalu disimpan cache</td><td>Ratusan MB atau lebih</td></tr>
<tr><td>Waktu ke penerbangan pertama</td><td>Detik - muat halaman, klik Start flight</td><td>Menit - unduh, instal, buka</td></tr>
<tr><td>Harga</td><td>0 - gratis, tanpa akun</td><td>Sering berbayar atau penuh pembelian dalam game</td></tr>
<tr><td>Konten</td><td>Satu pesawat, satu permainan tanpa akhir</td><td>Misi, peningkatan, pilihan pesawat</td></tr>
</table>
<p>Selisihnya kebanyakan ada di awal. Semua yang tampil di layar - pesawat, laut, pulau, awan, gerbang - adalah geometri prosedural yang digambar langsung di browsermu, jadi tidak ada file model, sprite, atau audio yang diunduh.</p>
<br/><h2><b>Di mana versi browser menang</b></h2>
<p>Satu halaman ini cocok untuk desktop maupun ponsel: kendalikan dengan menyeret di layar atau dengan tombol panah dan WASD, dan tombol layar penuh menampilkan seluruh permainan di layarmu. Game ini menaikkan kesulitan sendiri - kecepatan naik setiap sepuluh detik dari 40 menuju batas 90, gerbang merah makin keras seiring waktu, dan gerbang emas x2 sesekali melipatgandakan tenagamu setelah 30 detik terbang. Jarak terbaik dan tenaga puncakmu disimpan di browser ini dan ditampilkan sebelum kamu mulai, tanpa akun, unggahan, atau papan peringkat.</p>
<br/><h2><b>Di mana game terinstal masih menang</b></h2>
<p>Game penerbangan terinstal biasanya sepadan dengan unduhannya di suatu titik. Banyak yang membawa model penerbangan realistis dengan gaya angkat, stall, dan bahan bakar; Sky Gates Flight adalah game arcade dengan fisika yang disederhanakan, bukan simulator penerbangan. Judul terinstal biasanya menambah misi, peningkatan, pilihan pesawat, dan soundtrack lengkap; di sini hanya ada satu pesawat, satu permainan tanpa akhir, dan suara gerbang yang disintesis di perangkatmu dan tetap bisu sampai kamu menyalakan suara. Cara menyimpan juga berbeda: rekor permainanmu hanya hidup di penyimpanan lokal browser ini, jadi menghapus data situs akan menghilangkannya, dan tidak berpindah antar perangkat.</p>
<br/><h2><b>Aturan praktisnya</b></h2>
<p>Aturan praktis untuk Sky Gates Flight: pakai versi browser saat intinya adalah terbang sekarang juga - istirahat singkat, komputer bersama, ponsel yang ruang simpannya terbatas. Pilih game terinstal saat kamu menginginkan fisika penerbangan realistis, misi dan progresi, atau suara yang dirancang sebagai soundtrack alih-alih sekadar sakelar.</p>
<p>Untuk gerbang, kontrol, dan skor secara detail, lihat <a href="/guides/id/sky-gates-flight-step-by-step.html">Sky Gates Flight langkah demi langkah</a>.</p>
<p>Untuk situasi di mana permainan singkat di browser ini benar-benar cocok - dan di mana tidak - lihat <a href="/guides/id/sky-gates-flight-when.html">kapan bermain Sky Gates Flight</a>.</p>
<p><a href="/games.html">&larr; Kembali ke games</a></p>`,
  },
  de: {
    title: 'Sky Gates Flight vs ein Flugspiel installieren',
    desc: 'Sky Gates Flight im Vergleich zu einem typischen installierten Flugspiel: 0 MB Installation, Sekunden bis zum ersten Flug, und ein ehrlicher Blick darauf, wo jede Seite gewinnt.',
    html: `<h1 class="text-uppercase"><b>Sky Gates Flight vs ein Flugspiel installieren</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Fuer eine schnelle Arcade-Flugrunde bringt dich <a href="/games/sky-gates-flight.html">Sky Gates Flight</a> direkt im Browser in die Luft, ohne dass etwas installiert wird, waehrend eine Flugspiel-App zuerst Download und Einrichtung verlangt. Hier ein ehrlicher Blick darauf, was jede Seite bietet, mit Zahlen.</p>
<br/><h2><b>Die Zahlen im Vergleich</b></h2>
<figure class="illustration"><img src="/img/illustrations/card-row-4/guidesskygatesflightvsalternatives__3971d429.svg" alt="Sky Gates Flight auf einen Blick: null MB Installationsgroesse, erster Flug in Sekunden, kostenlos ohne Konto, ein Flugzeug in einer endlosen Runde." loading="lazy" width="640" height="180"><figcaption>Vergleiche Sky Gates Flight mit einem installierten Spiel: keine Installation, kostenlos, und in Sekunden fliegen.</figcaption></figure>
<p>Sky Gates Flight reduziert die uebliche Einrichtung auf null: nichts zu installieren, kostenlos, und in Sekunden fliegen. Ein installiertes Flugspiel verlangt vorab mehr.</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Aspekt</th><th>Sky Gates Flight im Browser</th><th>Typisches installiertes Flugspiel</th></tr>
<tr><td>Installationsgroesse</td><td>0 MB - eine 0.7-MB-3D-Engine laedt einmal und wird dann zwischengespeichert</td><td>Hunderte MB oder mehr</td></tr>
<tr><td>Zeit bis zum ersten Flug</td><td>Sekunden - Seite laden, Start flight klicken</td><td>Minuten - herunterladen, installieren, starten</td></tr>
<tr><td>Preis</td><td>0 - kostenlos, kein Konto</td><td>Oft kostenpflichtig oder voller Kaeufe</td></tr>
<tr><td>Inhalt</td><td>Ein Flugzeug, eine endlose Runde</td><td>Missionen, Upgrades, Flugzeugauswahl</td></tr>
</table>
<p>Der Unterschied liegt meist am Anfang. Alles auf dem Bildschirm - Flugzeug, Ozean, Inseln, Wolken, Tore - ist prozedurale Geometrie, die live in deinem Browser gezeichnet wird, also werden keine Modell-, Sprite- oder Audiodateien heruntergeladen.</p>
<br/><h2><b>Wo die Browser-Version gewinnt</b></h2>
<p>Eine Seite deckt Desktop und Handy ab: steuere durch Ziehen auf der Szene oder mit den Pfeiltasten und WASD, und der Vollbild-Knopf bringt die ganze Runde auf deinen Bildschirm. Das Spiel steigert die Schwierigkeit selbststaendig - die Geschwindigkeit steigt alle zehn Sekunden von 40 auf eine Obergrenze von 90, rote Tore werden mit der Zeit haerter, und ein gelegentliches goldenes x2-Tor verdoppelt deine Energie nach 30 Sekunden Flug. Deine beste Distanz und Spitzenenergie werden in diesem Browser gespeichert und schon vor dem Start angezeigt, ohne Konten, Uploads oder Bestenlisten.</p>
<br/><h2><b>Wo ein installiertes Spiel noch gewinnt</b></h2>
<p>Ein installiertes Flugspiel rechtfertigt seinen Download meist irgendwo. Viele bringen realistische Flugmodelle mit Auftrieb, Stall und Treibstoff mit; Sky Gates Flight ist ein Arcade-Spiel mit vereinfachter Physik, kein Flugsimulator. Installierte Titel fuegen oft Missionen, Upgrades, Flugzeugauswahl und vollstaendige Soundtracks hinzu; hier gibt es ein Flugzeug, eine endlose Runde, und auf deinem Geraet synthetisierte Torgeraeusche, die stumm bleiben, bis du den Ton einschaltest. Auch das Speichern funktioniert anders: dein Rekordlauf lebt nur im lokalen Speicher dieses Browsers, das Loeschen der Website-Daten entfernt ihn also, und er wandert nicht zwischen Geraeten.</p>
<br/><h2><b>Die praktische Regel</b></h2>
<p>Die praktische Regel fuer Sky Gates Flight: greife zur Browser-Version, wenn es dir jetzt sofort ums Fliegen geht - eine kurze Pause, ein geteilter Computer, ein Handy mit wenig freiem Speicher. Waehle ein installiertes Spiel, wenn du realistische Flugphysik, Missionen und Fortschritt willst, oder Sound, der als Soundtrack gestaltet ist statt als einfacher Schalter.</p>
<p>Fuer Tore, Steuerung und Punktevergabe im Detail siehe <a href="/guides/de/sky-gates-flight-step-by-step.html">Sky Gates Flight Schritt fuer Schritt</a>.</p>
<p>Fuer die Situationen, in denen eine kurze Browser-Runde wirklich passt - und wo nicht - siehe <a href="/guides/de/sky-gates-flight-when.html">wann Sky Gates Flight spielen</a>.</p>
<p><a href="/games.html">&larr; Zurueck zu Spielen</a></p>`,
  },
};

const ANGLES = [when, step, vs];
let count = 0;
for (const angle of ANGLES) {
  for (const lang of LOCALES) {
    const entry = angle[lang];
    const cmsKey = `guides${lang}${angle.kebab.replace(/-/g, '')}`;
    w(join(CMS, `BODYTITLE${cmsKey}.txt`), clean(lang, entry.title));
    w(join(CMS, `BODYDESC${cmsKey}.txt`), clean(lang, entry.desc));
    w(join(CMS, `BODYHTML${cmsKey}.html`), clean(lang, entry.html));
    w(join(JSP_GUIDE, lang, `${angle.kebab}.jsp`), enJsp);
    count += 3;
  }
}
console.log(`Generated ${count} CMS files + ${ANGLES.length * LOCALES.length} JSP wrappers for sky-gates-flight guides (pt/es/vi/id/de).`);
