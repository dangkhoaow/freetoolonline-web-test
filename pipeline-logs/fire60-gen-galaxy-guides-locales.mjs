#!/usr/bin/env node
// newtool-discovery-loop fire60 (LEAN one-off session): locale fanout (pt/es/vi/id/de)
// for the 3 EN-only galaxy-3d-simulator guide angles (when/step-by-step/vs-alternatives).
// New-tool-build was Exhausted(no_candidates) this fire (only candidate:
// converter-images is Gate-H registry-starved on ffmpegwasm; the other 4
// candidates are branded PDF-editor-clone trademark-risk junk, correctly not
// promoted) so per the SS4b interleave rule this fire drains a pending
// guide_locale_fanout unit: galaxy-3d-simulator-guides
// ("pending_en_only_locales_missing"). Faithful translation of the already-live
// EN content (no new claims added beyond what EN already states); DE uses
// ue/oe/ae/ss ASCII substitution, pt/es/vi/id are diacritic-free, per the
// site's established locale-typography convention.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CMS = join(ROOT, 'source/static/src/main/webapp/resources/view/CMS');
const JSP_GUIDE = join(ROOT, 'source/web/src/main/webapp/WEB-INF/jsp/guide');
const DATE = '2026-07-12';

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

const enJsp = readFileSync(join(JSP_GUIDE, 'galaxy-3d-simulator-when.jsp'), 'utf8');

const LOCALES = ['pt', 'es', 'vi', 'id', 'de'];

const svgSrc = '/img/illustrations/card-row-4/guidesgalaxy3dsimulatorvsalternatives__da7ad8aa.svg';
function vsFigure(alt, caption) {
  return `<figure class="illustration"><img src="${svgSrc}" alt="${alt}" loading="lazy" width="640" height="180"><figcaption>${caption}</figcaption></figure>\n`;
}

// ---- angle: when ----
const when = {
  kebab: 'galaxy-3d-simulator-when',
  pt: {
    title: 'Quando Usar o Galaxy 3D Simulator (e Quando Nao)',
    desc: 'Onde o Galaxy 3D Simulator se encaixa - pausas rapidas na tela, criancas curiosas, visuais ambientes em tela cheia - e as tarefas que esta espiral honestamente nao faz.',
    html: `<h1 class="text-uppercase"><b>Quando Usar o Galaxy 3D Simulator (e Quando Nao)</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> e uma galaxia espiral giravel de ate 100.000 pontos que abre em segundos, gratis, nesta aba do navegador. Aqui esta onde ele genuinamente se encaixa - pausas rapidas na tela, momentos de curiosidade, visuais ambientes - e as tarefas que ele honestamente nao faz.</p>
<br/><h2><b>Uma pausa de dois minutos na tela</b></h2>
<p>Galaxy 3D Simulator funciona bem como uma pausa de dois minutos na tela: abra, arraste o disco num giro lento, e descanse os olhos em algo vasto. Quando seus olhos precisam de um descanso do texto, girar algo vasto e um bom reset. Arraste o disco num giro lento, va com zoom ate o nucleo quente, e solte - o amortecimento da camera suaviza o movimento ate parar, e depois de alguns segundos parado uma rotacao automatica lenta assume. Nao ha som e nada para pontuar ou terminar, entao a cena nao pede nada de voce.</p>
<br/><h2><b>Uma faisca de curiosidade para criancas e salas de aula</b></h2>
<p>Galaxy 3D Simulator desperta curiosidade em salas de aula: aperte o botao Nova espiral algumas vezes e cada versao retorna com um numero diferente de bracos, dando aos alunos um gancho natural sobre como as galaxias reais variam. A cena funciona bem como gancho de conversa. Aperte o botao Nova espiral algumas vezes e cada versao volta com um numero diferente de bracos e dispersao, um gancho natural para como as galaxias reais variam. O painel de fatos mantem os numeros reais a mao: mais de 100 bilhoes de estrelas na Via Lactea, um disco de cerca de 100.000 anos-luz de diametro, nosso sol a cerca de 26.000 anos-luz de distancia numa orbita de aproximadamente 230 milhoes de anos. Girar o disco fino de lado da uma sensacao real de quao plana e vasta uma galaxia e.</p>
<br/><h2><b>Um fundo ambiente em tela cheia</b></h2>
<p>Um clique no controle de tela cheia transforma o Galaxy 3D Simulator num fundo girando lentamente para uma mesa, uma chamada, ou um ambiente silencioso. Tudo roda no seu proprio aparelho, e a contagem de pontos e ajustada ao hardware - 100.000 pontos num desktop, 30.000 num celular - para o movimento continuar suave em vez de sobrecarregar a maquina.</p>
<br/><h2><b>Onde ele nao se encaixa</b></h2>
<p>Galaxy 3D Simulator nao se encaixa em tarefas que precisam de dados orbitais reais, posicoes reais de estrelas, ou trabalho de fisica. Honestidade importa aqui. A espiral e arte parametrica ajustada para parecer certa - nao e um modelo gravitacional, entao nao pode sustentar trabalho de fisica ou previsoes orbitais. Tambem nao e um mapa do ceu real; nenhum catalogo de estrelas e usado, e cada ponto renderizado representa muito mais estrelas do que qualquer navegador conseguiria desenhar. Se voce precisa localizar estrelas reais ou constelacoes, uma referencia de astronomia dedicada e a ferramenta certa. A cena tambem exige WebGL - num navegador sem isso, a pagina mostra um aviso simples em vez disso.</p>
<p><a href="/space-3d.html">&larr; Voltar para Space 3D</a></p>`,
  },
  es: {
    title: 'Cuando Usar Galaxy 3D Simulator (y Cuando No)',
    desc: 'Donde encaja Galaxy 3D Simulator - pausas rapidas de pantalla, ninos curiosos, visuales ambientales en pantalla completa - y las tareas que esta espiral honestamente no hace.',
    html: `<h1 class="text-uppercase"><b>Cuando Usar Galaxy 3D Simulator (y Cuando No)</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> es una galaxia espiral giratoria de hasta 100.000 puntos que abre en segundos, gratis, en esta pestana del navegador. Aqui esta donde realmente encaja - pausas rapidas de pantalla, momentos de curiosidad, visuales ambientales - y las tareas que honestamente no hace.</p>
<br/><h2><b>Una pausa de pantalla de dos minutos</b></h2>
<p>Galaxy 3D Simulator funciona bien como una pausa de pantalla de dos minutos: abrelo, arrastra el disco en un giro lento, y descansa los ojos en algo vasto. Cuando tus ojos necesitan un descanso del texto, girar algo vasto es un buen reinicio. Arrastra el disco en un giro lento, haz zoom hasta el nucleo calido, y suelta - el amortiguamiento de la camara suaviza el movimiento hasta detenerse, y despues de unos segundos quieto una rotacion automatica lenta toma el control. No hay sonido y nada que puntuar o terminar, asi que la escena no te pide nada.</p>
<br/><h2><b>Una chispa de curiosidad para ninos y aulas</b></h2>
<p>Galaxy 3D Simulator despierta curiosidad en las aulas: presiona el boton Nueva espiral varias veces y cada version vuelve con un numero diferente de brazos, dando a los estudiantes un tema natural sobre cuanto varian las galaxias reales. La escena funciona bien como tema de conversacion. Presiona el boton Nueva espiral varias veces y cada version vuelve con un numero diferente de brazos y dispersion, un tema natural para cuanto varian las galaxias reales. El panel de datos mantiene las cifras reales a la mano: mas de 100 mil millones de estrellas en la Via Lactea, un disco de unos 100.000 anos luz de diametro, nuestro sol a unos 26.000 anos luz de distancia en una orbita de aproximadamente 230 millones de anos. Girar el disco delgado de canto da una sensacion real de cuan plana y vasta es una galaxia.</p>
<br/><h2><b>Un fondo ambiental en pantalla completa</b></h2>
<p>Un clic en el control de pantalla completa convierte a Galaxy 3D Simulator en un fondo girando lentamente para un escritorio, una llamada, o una habitacion tranquila. Todo se procesa en tu propio dispositivo, y el numero de puntos se ajusta al hardware - 100.000 puntos en un escritorio, 30.000 en un telefono - para que el movimiento siga fluido en vez de sobrecargar la maquina.</p>
<br/><h2><b>Donde no encaja</b></h2>
<p>Galaxy 3D Simulator no encaja en tareas que necesitan datos orbitales reales, posiciones reales de estrellas, o trabajo de fisica. La honestidad importa aqui. La espiral es arte parametrico ajustado para verse bien - no es un modelo gravitacional, asi que no puede respaldar trabajo de fisica ni predicciones orbitales. Tampoco es un mapa del cielo real; no se usan catalogos de estrellas, y cada punto renderizado representa muchas mas estrellas de las que cualquier navegador podria dibujar. Si necesitas localizar estrellas reales o constelaciones, una referencia de astronomia dedicada es la herramienta correcta. La escena tambien requiere WebGL - en un navegador sin eso, la pagina muestra un aviso simple en su lugar.</p>
<p><a href="/space-3d.html">&larr; Volver a Space 3D</a></p>`,
  },
  vi: {
    title: 'Khi Nao Nen Dung Galaxy 3D Simulator (va Khi Nao Khong)',
    desc: 'Nhung luc Galaxy 3D Simulator phu hop - nghi ngoi man hinh ngan, tre em to mo, hinh anh nen toan man hinh - va nhung viec ma vong xoay nay khong lam duoc.',
    html: `<h1 class="text-uppercase"><b>Khi Nao Nen Dung Galaxy 3D Simulator (va Khi Nao Khong)</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> la mot thien ha xoay hinh xoan co the quay voi toi 100.000 diem, mo trong vai giay, mien phi, ngay trong tab trinh duyet nay. Day la nhung luc no thuc su phu hop - nghi ngoi man hinh ngan, nhung khoanh khac to mo, hinh anh nen - va nhung viec no khong lam duoc.</p>
<br/><h2><b>Mot lan nghi man hinh hai phut</b></h2>
<p>Galaxy 3D Simulator phu hop lam mot lan nghi man hinh hai phut: mo len, keo dia quay cham, va cho mat nghi ngoi voi thu gi do rong lon. Khi mat can nghi ngoi khoi chu, xoay thu gi do rong lon la mot cach lam moi tot. Keo dia quay cham, zoom vao loi am nong, roi tha ra - do giam chan cua camera lam chuyen dong cham lai roi dung, va sau vai giay khong dong, mot vong xoay tu dong cham se tiep tuc. Khong co am thanh va khong co gi de ghi diem hay hoan thanh, nen canh nay khong yeu cau gi tu ban.</p>
<br/><h2><b>Mot tia to mo cho tre em va lop hoc</b></h2>
<p>Galaxy 3D Simulator khoi day su to mo trong lop hoc: nhan nut Xoan moi vai lan va moi lan tao ra tra ve mot so canh khac nhau, cho hoc sinh mot diem noi chuyen tu nhien ve viec cac thien ha thuc te da dang nhu the nao. Canh nay lam tot vai tro mot diem noi chuyen. Nhan nut Xoan moi vai lan va moi lan tao ra tra ve voi mot so canh va cach phan tan khac nhau, mot cach dan nhap tu nhien vao viec cac thien ha thuc te da dang nhu the nao. Bang thong tin giu san cac so lieu thuc te: hon 100 ty ngoi sao trong Dai Ngan Ha, mot dia rong khoang 100.000 nam anh sang, mat troi cua chung ta cach khoang 26.000 nam anh sang tren mot quy dao khoang 230 trieu nam. Xoay dia mong nhin tu canh cho cam giac thuc su ve viec mot thien ha phang va rong lon nhu the nao.</p>
<br/><h2><b>Mot nen toan man hinh mang tinh ambient</b></h2>
<p>Mot lan nhan vao nut toan man hinh bien Galaxy 3D Simulator thanh mot nen quay cham cho mot ban lam viec, mot cuoc goi, hay mot khong gian yen tinh. Moi thu duoc render tren thiet bi cua ban, va so luong diem duoc phan cap theo phan cung - 100.000 diem tren desktop, 30.000 tren dien thoai - de chuyen dong van muot ma khong lam qua tai may.</p>
<br/><h2><b>Nhung luc no khong phu hop</b></h2>
<p>Galaxy 3D Simulator khong phu hop cho cac cong viec can du lieu quy dao thuc te, vi tri sao thuc te, hay bai tap vat ly. Su trung thuc quan trong o day. Hinh xoan la nghe thuat tham so duoc chinh de trong dung - day khong phai mo hinh hap dan, nen khong the ho tro bai tap vat ly hay du doan quy dao. No cung khong phai la ban do bau troi thuc; khong co danh muc sao nao duoc su dung, va moi diem duoc render dai dien cho rat nhieu sao hon bat ky trinh duyet nao co the ve. Neu ban can dinh vi sao thuc te hay chom sao, mot tai lieu tham khao thien van chuyen dung la cong cu phu hop. Canh nay cung can WebGL - tren trinh duyet khong co, trang se hien mot thong bao don gian thay vao do.</p>
<p><a href="/space-3d.html">&larr; Quay lai Space 3D</a></p>`,
  },
  id: {
    title: 'Kapan Menggunakan Galaxy 3D Simulator (dan Kapan Tidak)',
    desc: 'Di mana Galaxy 3D Simulator cocok - istirahat layar singkat, anak-anak yang penasaran, visual ambient layar penuh - dan tugas yang sejujurnya tidak bisa dilakukan spiral ini.',
    html: `<h1 class="text-uppercase"><b>Kapan Menggunakan Galaxy 3D Simulator (dan Kapan Tidak)</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> adalah galaksi spiral yang bisa diputar dengan hingga 100.000 titik yang terbuka dalam hitungan detik, gratis, di tab browser ini. Berikut di mana ia benar-benar cocok - istirahat layar singkat, momen penasaran, visual ambient - dan tugas yang sejujurnya tidak bisa dilakukannya.</p>
<br/><h2><b>Istirahat layar dua menit</b></h2>
<p>Galaxy 3D Simulator cocok sebagai istirahat layar dua menit: buka, seret cakram ke putaran pelan, dan istirahatkan matamu pada sesuatu yang luas. Saat matamu butuh istirahat dari teks, memutar sesuatu yang luas adalah reset yang baik. Seret cakram ke putaran pelan, zoom ke inti hangat, dan lepaskan - peredaman kamera membuat gerakan melambat hingga berhenti, dan setelah beberapa detik diam, rotasi otomatis pelan akan mengambil alih. Tidak ada suara dan tidak ada yang harus diselesaikan, jadi adegan ini tidak menuntut apa pun darimu.</p>
<br/><h2><b>Pemicu rasa ingin tahu untuk anak-anak dan kelas</b></h2>
<p>Galaxy 3D Simulator memicu rasa ingin tahu di kelas: tekan tombol Spiral baru beberapa kali dan setiap hasil kembali dengan jumlah lengan yang berbeda, memberi siswa bahan obrolan alami tentang betapa beragamnya galaksi nyata. Adegan ini bekerja baik sebagai bahan obrolan. Tekan tombol Spiral baru beberapa kali dan setiap hasil kembali dengan jumlah lengan dan penyebaran yang berbeda, pengantar alami untuk betapa beragamnya galaksi nyata. Panel fakta menyimpan angka nyata: lebih dari 100 miliar bintang di Bima Sakti, cakram sekitar 100.000 tahun cahaya lebarnya, matahari kita sekitar 26.000 tahun cahaya jauhnya dengan orbit sekitar 230 juta tahun. Memutar cakram tipis dari sisi memberi rasa nyata tentang betapa datar dan luasnya sebuah galaksi.</p>
<br/><h2><b>Latar ambient layar penuh</b></h2>
<p>Satu klik pada kontrol layar penuh mengubah Galaxy 3D Simulator menjadi latar yang berputar pelan untuk meja kerja, panggilan, atau ruangan yang tenang. Semuanya diproses di perangkatmu sendiri, dan jumlah titik disesuaikan dengan tingkat perangkat keras - 100.000 titik di desktop, 30.000 di ponsel - agar gerakan tetap mulus alih-alih membebani perangkat.</p>
<br/><h2><b>Di mana ia tidak cocok</b></h2>
<p>Galaxy 3D Simulator tidak cocok untuk tugas yang butuh data orbit nyata, posisi bintang aktual, atau tugas kuliah fisika. Kejujuran penting di sini. Spiral ini adalah seni parametrik yang disetel agar terlihat benar - ini bukan model gravitasi, jadi tidak bisa mendukung tugas fisika atau prediksi orbit. Ini juga bukan peta langit nyata; tidak ada katalog bintang yang digunakan, dan setiap titik yang dirender mewakili jauh lebih banyak bintang daripada yang bisa digambar browser mana pun. Jika kamu perlu menemukan bintang nyata atau konstelasi, referensi astronomi khusus adalah alat yang tepat. Adegan ini juga membutuhkan WebGL - di browser tanpa itu, halaman menampilkan pemberitahuan sederhana sebagai gantinya.</p>
<p><a href="/space-3d.html">&larr; Kembali ke Space 3D</a></p>`,
  },
  de: {
    title: 'Wann Galaxy 3D Simulator Nutzen (und Wann Nicht)',
    desc: 'Wo Galaxy 3D Simulator passt - kurze Bildschirmpausen, neugierige Kinder, ambiente Vollbild-Visuals - und die Aufgaben, die diese Spirale ehrlich gesagt nicht kann.',
    html: `<h1 class="text-uppercase"><b>Wann Galaxy 3D Simulator Nutzen (und Wann Nicht)</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> ist eine drehbare Spiralgalaxie mit bis zu 100.000 Punkten, die in Sekunden oeffnet, kostenlos, in diesem Browser-Tab. Hier ist, wo es wirklich passt - kurze Bildschirmpausen, neugierige Momente, ambiente Visuals - und die Aufgaben, die es ehrlich gesagt nicht kann.</p>
<br/><h2><b>Eine zweiminuetige Bildschirmpause</b></h2>
<p>Galaxy 3D Simulator eignet sich gut als zweiminuetige Bildschirmpause: oeffne es, ziehe die Scheibe in eine langsame Drehung, und lass deine Augen auf etwas Riesigem ausruhen. Wenn deine Augen eine Pause vom Text brauchen, ist das Drehen von etwas Riesigem ein guter Reset. Ziehe die Scheibe in eine langsame Drehung, zoome zum warmen Kern, und lass los - die Daempfung der Kamera bremst die Bewegung sanft ab, und nach ein paar Sekunden Ruhe uebernimmt eine langsame automatische Drehung. Es gibt keinen Ton und nichts zu punkten oder zu beenden, also fordert die Szene nichts von dir.</p>
<br/><h2><b>Ein Funke Neugier fuer Kinder und Klassenzimmer</b></h2>
<p>Galaxy 3D Simulator weckt Neugier in Klassenzimmern: druecke den Neue-Spirale-Knopf ein paar Mal und jeder Aufbau kommt mit einer anderen Anzahl von Armen zurueck, was den Schuelern einen natuerlichen Gespraechsanlass gibt, wie unterschiedlich echte Galaxien sind. Die Szene funktioniert gut als Gespraechsanlass. Druecke den Neue-Spirale-Knopf ein paar Mal und jeder Aufbau kommt mit einer anderen Anzahl von Armen und Streuung zurueck, ein natuerlicher Einstieg dafuer, wie unterschiedlich echte Galaxien sind. Das Fakten-Panel haelt die echten Zahlen bereit: mehr als 100 Milliarden Sterne in der Milchstrasse, eine Scheibe von etwa 100.000 Lichtjahren Durchmesser, unsere Sonne etwa 26.000 Lichtjahre entfernt auf einer Umlaufbahn von rund 230 Millionen Jahren. Die duenne Scheibe seitlich zu drehen gibt ein echtes Gefuehl dafuer, wie flach und riesig eine Galaxie ist.</p>
<br/><h2><b>Ein ambienter Vollbild-Hintergrund</b></h2>
<p>Ein Klick auf die Vollbild-Steuerung verwandelt Galaxy 3D Simulator in einen sich langsam drehenden Hintergrund fuer einen Schreibtisch, einen Anruf, oder einen ruhigen Raum. Alles wird auf deinem eigenen Geraet gerendert, und die Punktzahl ist nach Hardware gestuft - 100.000 Punkte auf einem Desktop, 30.000 auf einem Handy - damit die Bewegung fluessig bleibt, statt die Maschine auszubremsen.</p>
<br/><h2><b>Wo es nicht passt</b></h2>
<p>Galaxy 3D Simulator passt nicht zu Aufgaben, die echte Orbitaldaten, tatsaechliche Sternpositionen, oder Physik-Kursarbeit brauchen. Ehrlichkeit zaehlt hier. Die Spirale ist parametrische Kunst, die so eingestellt ist, dass sie richtig aussieht - sie ist kein Gravitationsmodell, kann also keine Physik-Kursarbeit oder Orbitalvorhersagen unterstuetzen. Sie ist auch keine Karte des echten Himmels; es werden keine Sternkataloge verwendet, und jeder gerenderte Punkt steht fuer weit mehr Sterne, als ein Browser je zeichnen koennte. Wenn du echte Sterne oder Sternbilder finden musst, ist eine dedizierte Astronomie-Referenz das richtige Werkzeug. Die Szene braucht auch WebGL - in einem Browser ohne das zeigt die Seite stattdessen einen einfachen Hinweis.</p>
<p><a href="/space-3d.html">&larr; Zurueck zu Space 3D</a></p>`,
  },
};

// ---- angle: step-by-step ----
const step = {
  kebab: 'galaxy-3d-simulator-step-by-step',
  pt: {
    title: 'Como Explorar o Galaxy 3D Simulator - Passo a Passo',
    desc: 'Abra o Galaxy 3D Simulator, arraste para girar, aproxime o zoom no nucleo, e regenere novos bracos espirais - um passo a passo curto de cada controle na pagina.',
    html: `<h1 class="text-uppercase"><b>Como Explorar o Galaxy 3D Simulator - Passo a Passo</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> desenha uma galaxia espiral com ate 100.000 pontos renderizados, direto nesta aba do navegador - sem instalar, sem conta. Este passo a passo cobre cada controle: girar e aproximar a camera, ir para tela cheia, regenerar novas formas espirais, e ler os numeros reais da Via Lactea ao lado da cena.</p>
<br/><h2><b>Passo 1 - abra a cena</b></h2>
<p>Va para a pagina e de um momento na primeira visita. O motor 3D baixa uma vez e fica em cache, entao visitas depois comecam mais rapido. Tudo roda no seu proprio aparelho - nada e enviado e nenhum servidor desenha nada. Num desktop a espiral e construida com ate 100.000 pontos; num celular usa 30.000 para o giro continuar suave. A linha de status mostra o numero exato de pontos renderizados agora. Se seu navegador nao roda WebGL, a pagina mostra um aviso simples em vez de uma caixa preta.</p>
<br/><h2><b>Passo 2 - gire, aproxime o zoom, e va para tela cheia</b></h2>
<p>Arraste em qualquer lugar da cena para girar a galaxia; a camera tem amortecimento, entao o movimento desacelera suavemente em vez de cortar de repente. Role a roda do mouse, ou faca um pinca numa tela sensivel ao toque, para dar zoom - aproxime bem e o disco se resolve em pontos individuais ao redor do nucleo quente e brilhante. Um clique no controle de tela cheia expande a cena para a tela toda, e se voce deixar quieto por alguns segundos, uma rotacao automatica lenta mantem a vista viva por conta propria.</p>
<br/><h2><b>Passo 3 - regenere uma nova espiral</b></h2>
<p>Aperte o botao Nova espiral para reconstruir a galaxia com um numero diferente de bracos - de 3 a 5 bracos - e um novo padrao de dispersao, entao nenhuma espiral parece igual a outra. A geometria antiga e descartada a cada vez, o que evita que a memoria grafica vaze durante sessoes longas. A coloracao e procedural e nao fotografica: um nucleo denso e quente se funde em bracos azul-branco, com estrelas quentes espalhadas pelo disco.</p>
<br/><h2><b>Passo 4 - leia o painel de fatos</b></h2>
<p>O painel de fatos traz os numeros reais da Via Lactea: mais de 100 bilhoes de estrelas, um disco de cerca de 100.000 anos-luz de diametro, e o sol a cerca de 26.000 anos-luz do centro numa orbita de cerca de 230 milhoes de anos. Uma nota honesta - a espiral em si e arte parametrica ajustada para parecer certa, nao um modelo gravitacional ou um mapa de catalogos reais de estrelas. Os numeros da tabela sao os reais; os pontos renderizados sao apenas representacoes.</p>
<p><a href="/space-3d.html">&larr; Voltar para Space 3D</a></p>`,
  },
  es: {
    title: 'Como Explorar Galaxy 3D Simulator - Paso a Paso',
    desc: 'Abre Galaxy 3D Simulator, arrastra para girar, haz zoom al nucleo, y regenera nuevos brazos espirales - un recorrido corto por cada control de la pagina.',
    html: `<h1 class="text-uppercase"><b>Como Explorar Galaxy 3D Simulator - Paso a Paso</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> dibuja una galaxia espiral con hasta 100.000 puntos renderizados, directo en esta pestana del navegador - sin instalar, sin cuenta. Este recorrido cubre cada control: girar y hacer zoom con la camara, pasar a pantalla completa, regenerar nuevas formas espirales, y leer las cifras reales de la Via Lactea junto a la escena.</p>
<br/><h2><b>Paso 1 - abre la escena</b></h2>
<p>Ve a la pagina y dale un momento en la primera visita. El motor 3D se descarga una vez y queda en cache, asi que las visitas posteriores empiezan mas rapido. Todo se procesa en tu propio dispositivo - nada se sube y ningun servidor dibuja nada. En un escritorio la espiral se construye con hasta 100.000 puntos; en un telefono usa 30.000 para que el giro siga fluido. La linea de estado reporta el numero exacto de puntos renderizados en ese momento. Si tu navegador no puede ejecutar WebGL, la pagina muestra un aviso simple en vez de una caja negra.</p>
<br/><h2><b>Paso 2 - gira, haz zoom, y pasa a pantalla completa</b></h2>
<p>Arrastra en cualquier parte de la escena para girar la galaxia; la camara tiene amortiguamiento, asi que el movimiento se detiene suavemente en vez de cortarse de golpe. Usa la rueda del mouse, o pellizca en una pantalla tactil, para hacer zoom - acercate y el disco se resuelve en puntos individuales alrededor del nucleo calido y brillante. Un clic en el control de pantalla completa expande la escena a toda la pantalla, y si la dejas quieta unos segundos, una rotacion automatica lenta mantiene la vista viva por si sola.</p>
<br/><h2><b>Paso 3 - regenera una nueva espiral</b></h2>
<p>Presiona el boton Nueva espiral para reconstruir la galaxia con un numero diferente de brazos - entre 3 y 5 brazos - y un nuevo patron de dispersion, asi que no hay dos espirales iguales. La geometria anterior se descarta cada vez, lo que evita que la memoria grafica se filtre durante sesiones largas. El color es procedural y no fotografico: un nucleo denso y calido se difumina en brazos azul-blanco, con estrellas calientes dispersas por el disco.</p>
<br/><h2><b>Paso 4 - lee el panel de datos</b></h2>
<p>El panel de datos lleva las cifras reales de la Via Lactea: mas de 100 mil millones de estrellas, un disco de unos 100.000 anos luz de diametro, y el sol a unos 26.000 anos luz del centro en una orbita de unos 230 millones de anos. Una nota honesta - la espiral en si es arte parametrico ajustado para verse bien, no un modelo gravitacional ni un mapa de catalogos reales de estrellas. Las cifras de la tabla son las reales; los puntos renderizados son solo representaciones.</p>
<p><a href="/space-3d.html">&larr; Volver a Space 3D</a></p>`,
  },
  vi: {
    title: 'Cach Kham Pha Galaxy 3D Simulator - Tung Buoc',
    desc: 'Mo Galaxy 3D Simulator, keo de xoay, zoom vao loi, va tao lai canh xoan moi - mot huong dan ngan qua tung dieu khien tren trang.',
    html: `<h1 class="text-uppercase"><b>Cach Kham Pha Galaxy 3D Simulator - Tung Buoc</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> ve mot thien ha xoan tu toi 100.000 diem duoc render, ngay trong tab trinh duyet nay - khong can cai dat, khong can tai khoan. Huong dan nay bao gom tung dieu khien: xoay va zoom camera, chuyen sang toan man hinh, tao lai hinh xoan moi, va doc cac so lieu thuc te ve Dai Ngan Ha ben canh canh.</p>
<br/><h2><b>Buoc 1 - mo canh</b></h2>
<p>Vao trang va cho no mot chut thoi gian trong lan truy cap dau tien. Dong co 3D duoc tai xuong mot lan va luu cache, nen cac lan truy cap sau se bat dau nhanh hon. Moi thu duoc render tren thiet bi cua ban - khong co gi duoc tai len va khong may chu nao ve bat cu thu gi. Tren desktop, hinh xoan duoc dung tu toi 100.000 diem; tren dien thoai dung 30.000 de vong xoay van muot. Dong trang thai bao cao so diem chinh xac dang duoc render. Neu trinh duyet cua ban khong chay duoc WebGL, trang se hien mot thong bao don gian thay vi mot hop den.</p>
<br/><h2><b>Buoc 2 - xoay, zoom, va chuyen sang toan man hinh</b></h2>
<p>Keo bat cu dau tren canh de xoay thien ha; camera co do giam chan, nen chuyen dong cham lai nhe nhang thay vi dung dot ngot. Cuon banh xe chuot, hoac chum hai ngon tay tren man hinh cam ung, de zoom - zoom vao gan va dia se tach thanh cac diem rieng le quanh loi am nong ruc sang. Mot lan nhan vao nut toan man hinh se mo rong canh ra toan bo man hinh, va neu ban de yen vai giay, mot vong xoay tu dong cham se giu canh song dong tu no.</p>
<br/><h2><b>Buoc 3 - tao lai mot hinh xoan moi</b></h2>
<p>Nhan nut Xoan moi de dung lai thien ha voi mot so canh khac - dao dong tu 3 den 5 canh - va mot kieu phan tan moi, nen khong co hai hinh xoan nao giong nhau. Hinh hoc cu duoc huy moi lan, giup bo nho do hoa khong bi ro ri trong cac phien lam viec dai. Mau sac la thu tuc chu khong phai anh chup: mot loi dam dac nong nhoa dan thanh cac canh xanh-trang, voi cac sao nong ran rac trong dia.</p>
<br/><h2><b>Buoc 4 - doc bang thong tin</b></h2>
<p>Bang thong tin mang cac so lieu thuc te ve Dai Ngan Ha: hon 100 ty ngoi sao, mot dia rong khoang 100.000 nam anh sang, va mat troi nam cach trung tam khoang 26.000 nam anh sang tren mot quy dao khoang 230 trieu nam. Mot ghi chu trung thuc - hinh xoan tu than la nghe thuat tham so duoc chinh de trong dung, khong phai mo hinh hap dan hay ban do danh muc sao thuc te. Cac so lieu trong bang la so thuc; cac diem duoc render chi la vat dai dien.</p>
<p><a href="/space-3d.html">&larr; Quay lai Space 3D</a></p>`,
  },
  id: {
    title: 'Cara Menjelajahi Galaxy 3D Simulator - Langkah Demi Langkah',
    desc: 'Buka Galaxy 3D Simulator, seret untuk memutar, zoom ke inti, dan buat ulang lengan spiral baru - panduan singkat untuk setiap kontrol di halaman.',
    html: `<h1 class="text-uppercase"><b>Cara Menjelajahi Galaxy 3D Simulator - Langkah Demi Langkah</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> menggambar galaksi spiral dari hingga 100.000 titik yang dirender, langsung di tab browser ini - tanpa instalasi, tanpa akun. Panduan ini mencakup setiap kontrol: memutar dan zoom kamera, masuk mode layar penuh, membuat ulang bentuk spiral baru, dan membaca angka nyata Bima Sakti di samping adegan.</p>
<br/><h2><b>Langkah 1 - buka adegan</b></h2>
<p>Buka halaman dan beri waktu sebentar pada kunjungan pertama. Mesin 3D diunduh sekali dan disimpan di cache, jadi kunjungan berikutnya mulai lebih cepat. Semuanya dirender di perangkatmu sendiri - tidak ada yang diunggah dan tidak ada server yang menggambar apa pun. Di desktop spiral dibangun dari hingga 100.000 titik; di ponsel menggunakan 30.000 agar putaran tetap mulus. Baris status melaporkan jumlah pasti titik yang sedang dirender. Jika browsermu tidak bisa menjalankan WebGL, halaman menampilkan pemberitahuan sederhana alih-alih kotak hitam.</p>
<br/><h2><b>Langkah 2 - putar, zoom, dan masuk layar penuh</b></h2>
<p>Seret di mana saja pada adegan untuk memutar galaksi; kamera memiliki peredaman, jadi gerakan melambat dengan halus alih-alih berhenti tiba-tiba. Gulir dengan roda mouse, atau cubit di layar sentuh, untuk zoom - dekatkan dan cakram terurai menjadi titik-titik individual di sekitar inti hangat yang bercahaya. Satu klik pada kontrol layar penuh memperluas adegan ke seluruh tampilan, dan jika kamu membiarkannya beberapa detik, rotasi otomatis pelan menjaga tampilan tetap hidup sendiri.</p>
<br/><h2><b>Langkah 3 - buat ulang spiral baru</b></h2>
<p>Tekan tombol Spiral baru untuk membangun ulang galaksi dengan jumlah lengan yang berbeda - antara 3 hingga 5 lengan - dan pola penyebaran baru, jadi tidak ada dua spiral yang terlihat sama. Geometri lama dibuang setiap kali, yang mencegah memori grafis bocor selama sesi panjang. Pewarnaannya prosedural bukan fotografis: inti hangat yang padat memudar menjadi lengan biru-putih, dengan bintang panas yang tersebar di seluruh cakram.</p>
<br/><h2><b>Langkah 4 - baca panel fakta</b></h2>
<p>Panel fakta membawa angka nyata Bima Sakti: lebih dari 100 miliar bintang, cakram sekitar 100.000 tahun cahaya lebarnya, dan matahari berada sekitar 26.000 tahun cahaya dari pusat dengan orbit sekitar 230 juta tahun. Satu catatan jujur - spiral itu sendiri adalah seni parametrik yang disetel agar terlihat benar, bukan model gravitasi atau peta katalog bintang nyata. Angka di tabel adalah yang nyata; titik yang dirender hanyalah pengganti.</p>
<p><a href="/space-3d.html">&larr; Kembali ke Space 3D</a></p>`,
  },
  de: {
    title: 'Wie Man Galaxy 3D Simulator Erkundet - Schritt Fuer Schritt',
    desc: 'Oeffne Galaxy 3D Simulator, ziehe zum Drehen, zoome zum Kern, und erzeuge neue Spiralarme - eine kurze Anleitung zu jeder Steuerung auf der Seite.',
    html: `<h1 class="text-uppercase"><b>Wie Man Galaxy 3D Simulator Erkundet - Schritt Fuer Schritt</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p><a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> zeichnet eine Spiralgalaxie aus bis zu 100.000 gerenderten Punkten, direkt in diesem Browser-Tab - keine Installation, kein Konto. Diese Anleitung deckt jede Steuerung ab: die Kamera drehen und zoomen, in den Vollbildmodus gehen, neue Spiralformen erzeugen, und die echten Milchstrassen-Zahlen neben der Szene lesen.</p>
<br/><h2><b>Schritt 1 - die Szene oeffnen</b></h2>
<p>Gehe zur Seite und gib ihr beim ersten Besuch einen Moment. Die 3D-Engine wird einmal heruntergeladen und dann zwischengespeichert, sodass spaetere Besuche schneller starten. Alles wird auf deinem eigenen Geraet gerendert - nichts wird hochgeladen und kein Server zeichnet irgendetwas. Auf einem Desktop wird die Spirale aus bis zu 100.000 Punkten aufgebaut; auf einem Handy nutzt sie 30.000, damit die Drehung fluessig bleibt. Die Statuszeile meldet die genaue Anzahl der aktuell gerenderten Punkte. Wenn dein Browser kein WebGL ausfuehren kann, zeigt die Seite stattdessen einen einfachen Hinweis statt einer schwarzen Box.</p>
<br/><h2><b>Schritt 2 - drehen, zoomen, und in den Vollbildmodus gehen</b></h2>
<p>Ziehe an einer beliebigen Stelle der Szene, um die Galaxie zu drehen; die Kamera hat eine Daempfung, sodass die Bewegung sanft ausklingt statt abrupt zu stoppen. Nutze das Mausrad, oder mache eine Zoom-Geste auf einem Touchscreen, um zu zoomen - komm nah heran und die Scheibe loest sich in einzelne Punkte um den warmen, leuchtenden Kern auf. Ein Klick auf die Vollbild-Steuerung erweitert die Szene auf den gesamten Bildschirm, und wenn du sie ein paar Sekunden in Ruhe laesst, haelt eine langsame automatische Drehung die Ansicht von selbst lebendig.</p>
<br/><h2><b>Schritt 3 - eine neue Spirale erzeugen</b></h2>
<p>Druecke den Neue-Spirale-Knopf, um die Galaxie mit einer anderen Anzahl von Armen neu aufzubauen - irgendwo zwischen 3 und 5 Armen - und einem neuen Streumuster, sodass keine zwei Spiralen gleich aussehen. Die alte Geometrie wird jedes Mal entsorgt, was verhindert, dass der Grafikspeicher waehrend langer Sitzungen ausleiert. Die Faerbung ist prozedural statt fotografisch: ein warmer, dichter Kern geht in blau-weisse Arme ueber, mit verstreuten heissen Sternen im Inneren der Scheibe.</p>
<br/><h2><b>Schritt 4 - das Fakten-Panel lesen</b></h2>
<p>Das Fakten-Panel enthaelt die echten Milchstrassen-Zahlen: mehr als 100 Milliarden Sterne, eine Scheibe von etwa 100.000 Lichtjahren Durchmesser, und die Sonne sitzt etwa 26.000 Lichtjahre vom Zentrum entfernt auf einer Umlaufbahn von etwa 230 Millionen Jahren. Eine ehrliche Anmerkung - die Spirale selbst ist parametrische Kunst, die so eingestellt ist, dass sie richtig aussieht, kein Gravitationsmodell oder eine Karte echter Sternkataloge. Die Zahlen in der Tabelle sind die echten; die gerenderten Punkte sind Platzhalter.</p>
<p><a href="/space-3d.html">&larr; Zurueck zu Space 3D</a></p>`,
  },
};

// ---- angle: vs-alternatives ----
const vs = {
  kebab: 'galaxy-3d-simulator-vs-alternatives',
  pt: {
    title: 'Galaxy 3D Simulator vs um App de Astronomia de Desktop',
    desc: 'Um olhar honesto sobre o Galaxy 3D Simulator numa aba do navegador comparado a instalar um app de astronomia de desktop - 0 MB de instalacao, segundos para a primeira vista, $0.',
    html: `<h1 class="text-uppercase"><b>Galaxy 3D Simulator vs um App de Astronomia de Desktop</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Instalar um aplicativo nativo de 3D ou astronomia compra poder, mas custa tempo de download, espaco em disco, e configuracao. <a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> troca parte desse poder por zero friccao. A tabela e as notas abaixo mostram essa troca honestamente, em numeros.</p>
<br/><h2><b>Os numeros lado a lado</b></h2>
${vsFigure('Galaxy 3D Simulator em resumo', 'Zero instalacao, carrega em segundos, gratis para usar, e sem conta - antes de voce recorrer a um app de desktop de 150 MB.')}<p>Estes numeros comparam abrir esta pagina com baixar e instalar um aplicativo nativo tipico de 3D ou astronomia num computador desktop.</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Aspecto</th><th>Galaxy 3D Simulator</th><th>App de desktop instalado tipico</th></tr>
<tr><td>Tamanho da instalacao</td><td>0 MB instalados</td><td>Dezenas a centenas de MB</td></tr>
<tr><td>Tempo para a primeira vista</td><td>Alguns segundos</td><td>Varios minutos para baixar, instalar, e abrir</td></tr>
<tr><td>Preco</td><td>$0</td><td>Gratis a dezenas de dolares</td></tr>
<tr><td>Conta ou login</td><td>Nenhuma</td><td>As vezes necessario</td></tr>
</table>
<p>O unico download que esta pagina faz e o motor 3D em si, buscado uma vez e depois em cache, e e por isso que visitas depois da primeira comecam mais rapido.</p>
<br/><h2><b>O que a pagina no navegador te da</b></h2>
<p>Voce tem o essencial da experiencia sem nenhuma cerimonia: arraste para girar, role ou pinca para zoom, um clique para tela cheia, e um botao Nova espiral que regenera os bracos e a dispersao entao nenhuma versao combina com outra. A renderizacao acontece totalmente no seu aparelho - nada e enviado e nenhuma conta e criada - e a contagem de pontos se adapta ao hardware, ate 100.000 pontos num desktop e 30.000 num celular. Um painel de fatos mantem os numeros reais da Via Lactea ao lado da arte.</p>
<br/><h2><b>O que um app instalado ainda faz melhor</b></h2>
<p>Um aplicativo serio e nativo de astronomia pode carregar catalogos reais de estrelas, modelar gravidade e orbitas, funcionar totalmente offline, e processar conjuntos de dados muito maiores do que uma aba de navegador deveria tentar. Galaxy 3D Simulator nao compete nisso - sua espiral e arte parametrica ajustada para parecer certa em vez de calculada pela fisica, e os numeros reais vivem no painel de fatos, nao nos pontos renderizados. Se a tarefa e pesquisa, mapas precisos do ceu, ou movimento fisicamente exato, instale a ferramenta dedicada.</p>
<br/><h2><b>Como decidir</b></h2>
<p>Recorra a pagina no navegador quando o objetivo e um olhar rapido e bonito para uma galaxia espiral - uma pausa na tela, uma crianca curiosa, uma cena ambiente em tela cheia. Comprometa-se com uma instalacao quando precisao e profundidade sao a tarefa real. A parte boa de uma opcao sem custo e sem instalacao e que experimenta-la primeiro nao custa nada alem dos poucos segundos que leva para carregar.</p>
<p>Para um olhar mais de perto sobre os melhores casos de uso, veja <a href="/guides/pt/galaxy-3d-simulator-when.html">quando usar o Galaxy 3D Simulator</a>.</p>
<p><a href="/space-3d.html">&larr; Voltar para Space 3D</a></p>`,
  },
  es: {
    title: 'Galaxy 3D Simulator vs una App de Astronomia de Escritorio',
    desc: 'Una mirada honesta a Galaxy 3D Simulator en una pestana del navegador frente a instalar una app de astronomia de escritorio - 0 MB de instalacion, segundos para la primera vista, $0.',
    html: `<h1 class="text-uppercase"><b>Galaxy 3D Simulator vs una App de Astronomia de Escritorio</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Instalar una aplicacion nativa de 3D o astronomia compra poder, pero cuesta tiempo de descarga, espacio en disco, y configuracion. <a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> cambia parte de ese poder por cero friccion. La tabla y las notas de abajo muestran ese intercambio honestamente, en numeros.</p>
<br/><h2><b>Los numeros lado a lado</b></h2>
${vsFigure('Galaxy 3D Simulator de un vistazo', 'Cero instalacion, carga en segundos, gratis para usar, y sin cuenta - antes de que recurras a una app de escritorio de 150 MB.')}<p>Estas cifras comparan abrir esta pagina con descargar e instalar una aplicacion nativa tipica de 3D o astronomia en una computadora de escritorio.</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Aspecto</th><th>Galaxy 3D Simulator</th><th>App de escritorio instalada tipica</th></tr>
<tr><td>Tamano de instalacion</td><td>0 MB instalados</td><td>Decenas a cientos de MB</td></tr>
<tr><td>Tiempo para la primera vista</td><td>Unos segundos</td><td>Varios minutos para descargar, instalar, y abrir</td></tr>
<tr><td>Precio</td><td>$0</td><td>Gratis a decenas de dolares</td></tr>
<tr><td>Cuenta o inicio de sesion</td><td>Ninguna</td><td>A veces requerida</td></tr>
</table>
<p>La unica descarga que hace esta pagina es el motor 3D en si, obtenido una vez y luego almacenado en cache, por lo que las visitas despues de la primera empiezan mas rapido.</p>
<br/><h2><b>Lo que te da la pagina del navegador</b></h2>
<p>Obtienes el nucleo de la experiencia sin ninguna ceremonia: arrastra para girar, desplaza o pellizca para hacer zoom, un clic para pantalla completa, y un boton Nueva espiral que regenera los brazos y la dispersion asi que ninguna version coincide con otra. El renderizado ocurre completamente en tu dispositivo - nada se sube y no se crea ninguna cuenta - y el numero de puntos se adapta al hardware, hasta 100.000 puntos en un escritorio y 30.000 en un telefono. Un panel de datos mantiene las cifras reales de la Via Lactea junto al arte.</p>
<br/><h2><b>Lo que una app instalada todavia hace mejor</b></h2>
<p>Una aplicacion nativa de astronomia seria puede cargar catalogos reales de estrellas, modelar gravedad y orbitas, funcionar completamente sin conexion, y procesar conjuntos de datos mucho mas grandes de lo que una pestana de navegador deberia intentar. Galaxy 3D Simulator no compite ahi - su espiral es arte parametrico ajustado para verse bien en vez de calculado por fisica, y las cifras reales viven en su panel de datos, no en los puntos renderizados. Si la tarea es investigacion, mapas precisos del cielo, o movimiento fisicamente exacto, instala la herramienta dedicada.</p>
<br/><h2><b>Como decidir</b></h2>
<p>Recurre a la pagina del navegador cuando el objetivo es una mirada rapida y hermosa a una galaxia espiral - una pausa de pantalla, un nino curioso, una escena ambiental en pantalla completa. Comprometete con una instalacion cuando la precision y la profundidad son la tarea real. La parte buena de una opcion sin costo y sin instalacion es que probarla primero no cuesta nada mas que los pocos segundos que tarda en cargar.</p>
<p>Para ver mas de cerca los mejores casos de uso, consulta <a href="/guides/es/galaxy-3d-simulator-when.html">cuando usar Galaxy 3D Simulator</a>.</p>
<p><a href="/space-3d.html">&larr; Volver a Space 3D</a></p>`,
  },
  vi: {
    title: 'Galaxy 3D Simulator So Voi Ung Dung Thien Van May Tinh',
    desc: 'Mot cai nhin trung thuc ve Galaxy 3D Simulator trong tab trinh duyet so voi viec cai mot ung dung thien van may tinh - 0 MB cai dat, vai giay de xem lan dau, 0 USD.',
    html: `<h1 class="text-uppercase"><b>Galaxy 3D Simulator So Voi Ung Dung Thien Van May Tinh</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Cai mot ung dung 3D hay thien van native mua duoc suc manh, nhung ton thoi gian tai xuong, dung luong o dia, va cai dat. <a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> danh doi mot phan suc manh do de doi lay khong ma sat. Bang va cac ghi chu duoi day trinh bay su danh doi nay mot cach trung thuc, bang so lieu.</p>
<br/><h2><b>So sanh cac so lieu</b></h2>
${vsFigure('Galaxy 3D Simulator nhin nhanh', 'Khong can cai dat, tai trong vai giay, mien phi su dung, va khong can tai khoan - truoc khi ban phai dung den mot ung dung desktop 150 MB.')}<p>Cac so lieu nay so sanh viec mo trang nay voi viec tai xuong va cai dat mot ung dung 3D hay thien van native dien hinh tren mot may tinh de ban.</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Yeu to</th><th>Galaxy 3D Simulator</th><th>Ung dung desktop cai dat dien hinh</th></tr>
<tr><td>Dung luong cai dat</td><td>0 MB duoc cai</td><td>Vai chuc den vai tram MB</td></tr>
<tr><td>Thoi gian xem lan dau</td><td>Vai giay</td><td>Vai phut de tai xuong, cai dat, va mo</td></tr>
<tr><td>Gia</td><td>0 USD</td><td>Mien phi den vai chuc USD</td></tr>
<tr><td>Tai khoan hay dang nhap</td><td>Khong can</td><td>Doi khi can</td></tr>
</table>
<p>Lan tai xuong duy nhat trang nay thuc hien la dong co 3D, duoc lay mot lan roi luu cache, do la ly do cac lan truy cap sau lan dau bat dau nhanh hon.</p>
<br/><h2><b>Trang trinh duyet cho ban gi</b></h2>
<p>Ban co duoc phan chinh cua trai nghiem ma khong can nghi thuc nao: keo de xoay, cuon hoac chum de zoom, mot lan nhan de toan man hinh, va nut Xoan moi tao lai canh va cach phan tan de khong co hai lan tao nao giong nhau. Viec render dien ra hoan toan tren thiet bi cua ban - khong co gi duoc tai len va khong co tai khoan nao duoc tao - va so luong diem thich ung voi phan cung, toi 100.000 diem tren desktop va 30.000 tren dien thoai. Mot bang thong tin giu cac so lieu thuc te ve Dai Ngan Ha ben canh phan nghe thuat.</p>
<br/><h2><b>Nhung gi mot ung dung cai dat van lam tot hon</b></h2>
<p>Mot ung dung thien van native nghiem tuc co the tai danh muc sao thuc te, mo hinh hoa hap dan va quy dao, chay hoan toan khong can mang, va xu ly cac tap du lieu lon hon nhieu so voi mot tab trinh duyet nen thu. Galaxy 3D Simulator khong canh tranh o do - hinh xoan cua no la nghe thuat tham so duoc chinh de trong dung thay vi duoc tinh toan tu vat ly, va cac so lieu thuc te nam trong bang thong tin cua no, khong nam trong cac diem duoc render. Neu cong viec la nghien cuu, ban do bau troi chinh xac, hay chuyen dong chinh xac ve vat ly, hay cai cong cu chuyen dung.</p>
<br/><h2><b>Cach quyet dinh</b></h2>
<p>Dung trang trinh duyet khi muc tieu la mot cai nhin nhanh va dep ve mot thien ha xoan - mot lan nghi man hinh, mot dua tre to mo, mot canh nen toan man hinh. Cam ket cai dat khi do chinh xac va do sau la cong viec thuc su. Phan hay cua mot lua chon khong tinh phi va khong can cai dat la thu no truoc khong mat gi ngoai vai giay de tai.</p>
<p>De xem gan hon cac truong hop su dung tot nhat, xem <a href="/guides/vi/galaxy-3d-simulator-when.html">khi nao nen dung Galaxy 3D Simulator</a>.</p>
<p><a href="/space-3d.html">&larr; Quay lai Space 3D</a></p>`,
  },
  id: {
    title: 'Galaxy 3D Simulator vs Aplikasi Astronomi Desktop',
    desc: 'Pandangan jujur tentang Galaxy 3D Simulator di tab browser dibandingkan menginstal aplikasi astronomi desktop - instal 0 MB, beberapa detik untuk tampilan pertama, $0.',
    html: `<h1 class="text-uppercase"><b>Galaxy 3D Simulator vs Aplikasi Astronomi Desktop</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Menginstal aplikasi 3D atau astronomi native membeli kekuatan, tetapi memakan waktu unduh, ruang disk, dan pengaturan. <a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> menukar sebagian kekuatan itu dengan nol gesekan. Tabel dan catatan di bawah menunjukkan pertukaran itu secara jujur, dalam angka.</p>
<br/><h2><b>Angka-angka berdampingan</b></h2>
${vsFigure('Galaxy 3D Simulator secara sekilas', 'Nol instalasi, memuat dalam hitungan detik, gratis digunakan, dan tanpa akun - sebelum kamu harus memakai aplikasi desktop 150 MB.')}<p>Angka-angka ini membandingkan membuka halaman ini dengan mengunduh dan menginstal aplikasi 3D atau astronomi native umum di komputer desktop.</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Aspek</th><th>Galaxy 3D Simulator</th><th>Aplikasi desktop terinstal yang umum</th></tr>
<tr><td>Ukuran instalasi</td><td>0 MB terinstal</td><td>Puluhan hingga ratusan MB</td></tr>
<tr><td>Waktu ke tampilan pertama</td><td>Beberapa detik</td><td>Beberapa menit untuk unduh, instal, dan buka</td></tr>
<tr><td>Harga</td><td>$0</td><td>Gratis hingga puluhan dolar</td></tr>
<tr><td>Akun atau login</td><td>Tidak ada</td><td>Terkadang diperlukan</td></tr>
</table>
<p>Satu-satunya unduhan yang dilakukan halaman ini adalah mesin 3D itu sendiri, diambil sekali lalu disimpan di cache, itulah sebabnya kunjungan setelah yang pertama mulai lebih cepat.</p>
<br/><h2><b>Apa yang diberikan halaman browser ini</b></h2>
<p>Kamu mendapatkan inti dari pengalaman tanpa formalitas apa pun: seret untuk memutar, gulir atau cubit untuk zoom, satu klik untuk layar penuh, dan tombol Spiral baru yang membuat ulang lengan dan penyebaran sehingga tidak ada dua hasil yang cocok. Rendering terjadi sepenuhnya di perangkatmu - tidak ada yang diunggah dan tidak ada akun yang dibuat - dan jumlah titik menyesuaikan dengan perangkat keras, hingga 100.000 titik di desktop dan 30.000 di ponsel. Panel fakta menyimpan angka nyata Bima Sakti di samping karya seninya.</p>
<br/><h2><b>Apa yang masih dilakukan lebih baik oleh aplikasi terinstal</b></h2>
<p>Aplikasi astronomi native yang serius dapat memuat katalog bintang nyata, memodelkan gravitasi dan orbit, bekerja sepenuhnya offline, dan mengolah kumpulan data yang jauh lebih besar daripada yang seharusnya dicoba oleh tab browser. Galaxy 3D Simulator tidak bersaing di sana - spiralnya adalah seni parametrik yang disetel agar terlihat benar bukan dihitung dari fisika, dan angka nyata ada di panel faktanya, bukan di titik yang dirender. Jika tugasnya adalah penelitian, peta langit yang presisi, atau gerakan yang akurat secara fisik, instal alat khusus itu.</p>
<br/><h2><b>Cara memutuskan</b></h2>
<p>Gunakan halaman browser ini saat tujuannya adalah pandangan cepat dan indah tentang galaksi spiral - istirahat layar, anak yang penasaran, adegan ambient layar penuh. Berkomitmen pada instalasi saat akurasi dan kedalaman adalah tugas sebenarnya. Bagian baiknya dari opsi tanpa biaya dan tanpa instalasi adalah mencobanya lebih dulu tidak memakan apa pun selain beberapa detik yang dibutuhkan untuk memuat.</p>
<p>Untuk melihat lebih dekat kasus penggunaan terbaik, lihat <a href="/guides/id/galaxy-3d-simulator-when.html">kapan menggunakan Galaxy 3D Simulator</a>.</p>
<p><a href="/space-3d.html">&larr; Kembali ke Space 3D</a></p>`,
  },
  de: {
    title: 'Galaxy 3D Simulator vs eine Desktop-Astronomie-App',
    desc: 'Ein ehrlicher Blick auf Galaxy 3D Simulator in einem Browser-Tab im Vergleich zur Installation einer Desktop-Astronomie-App - 0 MB Installation, Sekunden bis zur ersten Ansicht, 0 USD.',
    html: `<h1 class="text-uppercase"><b>Galaxy 3D Simulator vs eine Desktop-Astronomie-App</b></h1>
<time itemprop="dateUpdated" datetime="${DATE}T00:00:00"><b>Last reviewed: ${DATE}</b></time>
<hr/>
<p>Eine native 3D- oder Astronomie-Anwendung zu installieren kauft Leistung, kostet aber Download-Zeit, Speicherplatz, und Einrichtung. <a href="/space-3d/galaxy.html">Galaxy 3D Simulator</a> tauscht einen Teil dieser Leistung gegen null Reibung. Die Tabelle und die Anmerkungen unten legen diesen Tausch ehrlich dar, in Zahlen.</p>
<br/><h2><b>Die Zahlen im Vergleich</b></h2>
${vsFigure('Galaxy 3D Simulator auf einen Blick', 'Null Installation, laedt in Sekunden, kostenlos nutzbar, und kein Konto - bevor du zu einer 150-MB-Desktop-App greifst.')}<p>Diese Zahlen vergleichen das Oeffnen dieser Seite mit dem Herunterladen und Installieren einer typischen nativen 3D- oder Astronomie-Anwendung auf einem Desktop-Computer.</p>
<table class="w3-table w3-bordered w3-small">
<tr><th>Aspekt</th><th>Galaxy 3D Simulator</th><th>Typische installierte Desktop-App</th></tr>
<tr><td>Installationsgroesse</td><td>0 MB installiert</td><td>Zig bis Hunderte MB</td></tr>
<tr><td>Zeit bis zur ersten Ansicht</td><td>Ein paar Sekunden</td><td>Mehrere Minuten zum Herunterladen, Installieren, und Starten</td></tr>
<tr><td>Preis</td><td>0 USD</td><td>Kostenlos bis zu einigen zehn Dollar</td></tr>
<tr><td>Konto oder Anmeldung</td><td>Keine</td><td>Manchmal erforderlich</td></tr>
</table>
<p>Der einzige Download, den diese Seite macht, ist die 3D-Engine selbst, einmal geladen und dann zwischengespeichert, weshalb Besuche nach dem ersten schneller starten.</p>
<br/><h2><b>Was dir die Browser-Seite gibt</b></h2>
<p>Du bekommst den Kern der Erfahrung ohne jede Umstaende: ziehen zum Drehen, scrollen oder zoomen mit einer Geste, ein Klick fuer Vollbild, und ein Neue-Spirale-Knopf, der die Arme und die Streuung neu erzeugt, sodass keine zwei Aufbauten uebereinstimmen. Das Rendering passiert komplett auf deinem Geraet - nichts wird hochgeladen und kein Konto wird erstellt - und die Punktzahl passt sich der Hardware an, bis zu 100.000 Punkte auf einem Desktop und 30.000 auf einem Handy. Ein Fakten-Panel haelt die echten Milchstrassen-Zahlen neben der Kunst bereit.</p>
<br/><h2><b>Was eine installierte App immer noch besser macht</b></h2>
<p>Eine ernsthafte native Astronomie-Anwendung kann echte Sternkataloge laden, Schwerkraft und Umlaufbahnen modellieren, komplett offline funktionieren, und weit groessere Datensaetze verarbeiten, als ein Browser-Tab versuchen sollte. Galaxy 3D Simulator konkurriert dort nicht - seine Spirale ist parametrische Kunst, die so eingestellt ist, dass sie richtig aussieht, statt aus der Physik berechnet zu werden, und die echten Zahlen leben in seinem Fakten-Panel, nicht in den gerenderten Punkten. Wenn die Aufgabe Forschung, praezise Himmelskarten, oder physikalisch genaue Bewegung ist, installiere das dedizierte Werkzeug.</p>
<br/><h2><b>Wie man sich entscheidet</b></h2>
<p>Greife zur Browser-Seite, wenn das Ziel ein schneller, schoener Blick auf eine Spiralgalaxie ist - eine Bildschirmpause, ein neugieriges Kind, eine ambiente Vollbildszene. Entscheide dich fuer eine Installation, wenn Genauigkeit und Tiefe die eigentliche Aufgabe sind. Der schoene Teil einer kostenlosen, installationsfreien Option ist, dass sie zuerst auszuprobieren nichts kostet als die paar Sekunden, die das Laden dauert.</p>
<p>Fuer einen genaueren Blick auf die besten Anwendungsfaelle, siehe <a href="/guides/de/galaxy-3d-simulator-when.html">wann Galaxy 3D Simulator nutzen</a>.</p>
<p><a href="/space-3d.html">&larr; Zurueck zu Space 3D</a></p>`,
  },
};

const ANGLES = [when, step, vs];
let count = 0;
for (const angle of ANGLES) {
  for (const lang of LOCALES) {
    const entry = angle[lang];
    const cmsKey = `guides${lang}${angle.kebab.replace(/-/g, '')}`;
    w(join(CMS, `BODYTITLE${cmsKey}.txt`), entry.title);
    w(join(CMS, `BODYDESC${cmsKey}.txt`), entry.desc);
    w(join(CMS, `BODYHTML${cmsKey}.html`), entry.html);
    w(join(JSP_GUIDE, lang, `${angle.kebab}.jsp`), enJsp);
    count += 3;
  }
}
console.log(`Generated ${count} CMS files + ${ANGLES.length * LOCALES.length} JSP wrappers for galaxy-3d-simulator guides (pt/es/vi/id/de).`);
