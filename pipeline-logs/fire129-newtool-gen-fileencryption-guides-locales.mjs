// new-tool-discovery-loop-runbook (LEAN one-off session, fire129).
// Finishes shipping /developer-tools/file-encryption-tool.html (built by
// fire127, tool-skill verified by fire127's extractor fix). This generator
// authors the pt/es/vi/id/de locale fanout for the 3 EN companion guide
// angles (file-encryption-{when,step-by-step,vs-alternatives}) - 15 CMS
// bundles (title+desc+html) + 15 JSP wrappers, mirroring the exact structure
// of the (byline-corrected) EN guides, no FAQ / no extra sections added.
//
// Every sentence paraphrases ONLY .agent/skills/tool-fileencryptiontool/SKILL.md
// ## Implemented features (AES-256/PBKDF2-250k/fresh salt+IV, wrong-password/
// corrupt-file rejection, no password recovery). VI/ID/PT/ES diacritic-free
// (site convention per the note-taking-app / date-difference-calculator
// locale fanout precedent), DE ue/oe/ae/ss, ASCII hyphen only (R9), no
// SEO-query echo, anchors/hrefs point at the SAME-locale sibling guide (not EN).
import fs from 'node:fs';

const CMS = 'source/static/src/main/webapp/resources/view/CMS';
const JSP = 'source/web/src/main/webapp/WEB-INF/jsp/guide';
const REVIEWED = '2026-07-13';

const JSP_TEMPLATE = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<freetoolonline:page browserTitle='\${pageBodyTitle}' description='\${pageBodyDesc}'>
	<freetoolonline:loading/>
	<!-- BODYHTML -->
	\${pageBodyHTML}
</freetoolonline:page>
`;

const AUTHOR_BYLINE = `<address class="author"><a rel="author" href="/about-us.html">freetoolonline.com Editorial Team</a></address>`;

const TOOL_HREF = '/developer-tools/file-encryption-tool.html';
const BACK_HREF = '/developer-tools.html';

const L = {
  pt: {
    toolName: 'Ferramenta de Criptografia de Arquivos',
    reviewLabel: 'Last reviewed',
    backLink: '&larr; Voltar para ferramentas de desenvolvedor',
    when: {
      title: 'Ferramenta de Criptografia de Arquivos Quando Usar',
      desc: 'Ferramenta de Criptografia de Arquivos Quando Usar - quando abrir a Ferramenta de Criptografia de Arquivos se encaixa e o que esperar quando isso acontece.',
      intro: 'vale a pena abrir quando voce precisa de uma execucao rapida e pontual, sem instalar nada. Esta pagina explica quando isso se encaixa e quando nao.',
      h2a: 'Quando se encaixa',
      pa: 'O arquivo e embaralhado com AES-256 usando uma chave derivada da sua senha (PBKDF2, 250.000 rounds) mais um salt e IV aleatorios novos a cada vez, entao criptografar o mesmo arquivo duas vezes com a mesma senha produz dois arquivos .enc diferentes - isso e esperado, nao e um erro.',
      h2b: 'O que esperar',
      pb: 'Uma senha errada, ou um arquivo .enc que foi editado ou corrompido, e recusado com uma mensagem de erro simples em vez de gerar um arquivo quebrado ou com lixo.',
      pc: 'Nao ha recuperacao de senha: esta ferramenta nao guarda sua senha em lugar nenhum, entao uma senha perdida torna o arquivo criptografado permanentemente irrecuperavel - anote-a em um lugar seguro antes de fechar esta aba.',
    },
    step: {
      title: 'Ferramenta de Criptografia de Arquivos Passo A Passo',
      desc: 'Ferramenta de Criptografia de Arquivos Passo A Passo - os passos exatos para abrir a ferramenta, informar sua entrada e baixar o resultado.',
      intro: 'funciona em tres passos: abrir a ferramenta, informar sua entrada, depois baixar o resultado. Esta pagina detalha o que cada passo espera.',
      h2a: 'Passo 1 - abrir a ferramenta',
      pa: 'Acesse a Ferramenta de Criptografia de Arquivos. Nada precisa ser instalado ou ter login antes de comecar.',
      h2b: 'Passo 2 - informar sua entrada',
      pb: 'O arquivo e embaralhado com AES-256 usando uma chave derivada da sua senha (PBKDF2, 250.000 rounds) mais um salt e IV aleatorios novos a cada vez, entao criptografar o mesmo arquivo duas vezes com a mesma senha produz dois arquivos .enc diferentes - isso e esperado, nao e um erro.',
      h2c: 'Passo 3 - obter o resultado',
      pc: 'Uma senha errada, ou um arquivo .enc que foi editado ou corrompido, e recusado com uma mensagem de erro simples em vez de gerar um arquivo quebrado ou com lixo.',
      pd: 'Nao ha recuperacao de senha: esta ferramenta nao guarda sua senha em lugar nenhum, entao uma senha perdida torna o arquivo criptografado permanentemente irrecuperavel - anote-a em um lugar seguro antes de fechar esta aba.',
    },
    vs: {
      title: 'Ferramenta de Criptografia de Arquivos Vs Alternativas',
      desc: 'Ferramenta de Criptografia de Arquivos Vs Alternativas - como a Ferramenta de Criptografia de Arquivos se compara com um aplicativo de desktop ou um servico baseado em upload.',
      intro: 'e uma das tres formas comuns de fazer isso: uma ferramenta baseada no navegador como esta, um aplicativo de desktop, ou um servico online baseado em upload. Cada uma tem vantagens diferentes sobre onde seus dados vao e o que voce precisa instalar.',
      h2a: 'Como a Ferramenta de Criptografia de Arquivos se compara',
      thisTool: 'Ferramenta de Criptografia de Arquivos (esta ferramenta)',
      aspect: 'Aspecto',
      desktopApp: 'Aplicativo de desktop',
      uploadService: 'Servico online baseado em upload',
      rowFile: 'Onde seus dados vao',
      valStaysDevice: 'Permanece neste dispositivo - roda no navegador',
      valStaysDeviceApp: 'Permanece neste dispositivo',
      valUploaded: 'Enviado para um servidor',
      rowInstall: 'Instalacao necessaria',
      no: 'Nao',
      yes: 'Sim',
      rowAccount: 'Funciona sem conta',
      valVaries: 'Varia por servico',
      pa: 'O arquivo e embaralhado com AES-256 usando uma chave derivada da sua senha (PBKDF2, 250.000 rounds) mais um salt e IV aleatorios novos a cada vez, entao criptografar o mesmo arquivo duas vezes com a mesma senha produz dois arquivos .enc diferentes - isso e esperado, nao e um erro.',
      pb: 'Uma senha errada, ou um arquivo .enc que foi editado ou corrompido, e recusado com uma mensagem de erro simples em vez de gerar um arquivo quebrado ou com lixo.',
    },
  },
  es: {
    toolName: 'Herramienta de Cifrado de Archivos',
    reviewLabel: 'Last reviewed',
    backLink: '&larr; Volver a herramientas de desarrollador',
    when: {
      title: 'Herramienta de Cifrado de Archivos Cuando Usarla',
      desc: 'Herramienta de Cifrado de Archivos Cuando Usarla - cuando abrir la Herramienta de Cifrado de Archivos encaja y que esperar cuando lo hace.',
      intro: 'vale la pena abrirla cuando necesitas una ejecucion rapida y puntual, sin instalar nada. Esta pagina explica cuando eso encaja y cuando no.',
      h2a: 'Cuando encaja',
      pa: 'El archivo se cifra con AES-256 usando una clave derivada de tu contrasena (PBKDF2, 250.000 rondas) mas una sal e IV aleatorios nuevos cada vez, asi que cifrar el mismo archivo dos veces con la misma contrasena produce dos archivos .enc distintos - eso es lo esperado, no un error.',
      h2b: 'Que esperar',
      pb: 'Una contrasena incorrecta, o un archivo .enc que fue editado o corrompido, se rechaza con un mensaje de error simple en lugar de generar un archivo roto o con datos basura.',
      pc: 'No hay recuperacion de contrasena: esta herramienta no guarda tu contrasena en ningun lugar, asi que una contrasena perdida hace que el archivo cifrado sea permanentemente irrecuperable - anotala en un lugar seguro antes de cerrar esta pestana.',
    },
    step: {
      title: 'Herramienta de Cifrado de Archivos Paso A Paso',
      desc: 'Herramienta de Cifrado de Archivos Paso A Paso - los pasos exactos para abrir la herramienta, proporcionar tu entrada y descargar el resultado.',
      intro: 'funciona en tres pasos: abrir la herramienta, proporcionar tu entrada, luego descargar el resultado. Esta pagina detalla lo que espera cada paso.',
      h2a: 'Paso 1 - abrir la herramienta',
      pa: 'Ve a la Herramienta de Cifrado de Archivos. No necesitas instalar nada ni iniciar sesion antes de empezar.',
      h2b: 'Paso 2 - proporcionar tu entrada',
      pb: 'El archivo se cifra con AES-256 usando una clave derivada de tu contrasena (PBKDF2, 250.000 rondas) mas una sal e IV aleatorios nuevos cada vez, asi que cifrar el mismo archivo dos veces con la misma contrasena produce dos archivos .enc distintos - eso es lo esperado, no un error.',
      h2c: 'Paso 3 - obtener el resultado',
      pc: 'Una contrasena incorrecta, o un archivo .enc que fue editado o corrompido, se rechaza con un mensaje de error simple en lugar de generar un archivo roto o con datos basura.',
      pd: 'No hay recuperacion de contrasena: esta herramienta no guarda tu contrasena en ningun lugar, asi que una contrasena perdida hace que el archivo cifrado sea permanentemente irrecuperable - anotala en un lugar seguro antes de cerrar esta pestana.',
    },
    vs: {
      title: 'Herramienta de Cifrado de Archivos Vs Alternativas',
      desc: 'Herramienta de Cifrado de Archivos Vs Alternativas - como se compara la Herramienta de Cifrado de Archivos con una app de escritorio o un servicio basado en subida de archivos.',
      intro: 'es una de tres formas comunes de hacer esto: una herramienta basada en el navegador como esta, una aplicacion de escritorio, o un servicio en linea basado en subida de archivos. Cada una tiene ventajas distintas sobre a donde van tus datos y que necesitas instalar.',
      h2a: 'Como se compara la Herramienta de Cifrado de Archivos',
      thisTool: 'Herramienta de Cifrado de Archivos (esta herramienta)',
      aspect: 'Aspecto',
      desktopApp: 'Aplicacion de escritorio',
      uploadService: 'Servicio en linea basado en subida de archivos',
      rowFile: 'A donde van tus datos',
      valStaysDevice: 'Permanece en este dispositivo - corre en el navegador',
      valStaysDeviceApp: 'Permanece en este dispositivo',
      valUploaded: 'Se sube a un servidor',
      rowInstall: 'Instalacion requerida',
      no: 'No',
      yes: 'Si',
      rowAccount: 'Funciona sin cuenta',
      valVaries: 'Varia segun el servicio',
      pa: 'El archivo se cifra con AES-256 usando una clave derivada de tu contrasena (PBKDF2, 250.000 rondas) mas una sal e IV aleatorios nuevos cada vez, asi que cifrar el mismo archivo dos veces con la misma contrasena produce dos archivos .enc distintos - eso es lo esperado, no un error.',
      pb: 'Una contrasena incorrecta, o un archivo .enc que fue editado o corrompido, se rechaza con un mensaje de error simple en lugar de generar un archivo roto o con datos basura.',
    },
  },
  vi: {
    toolName: 'Cong Cu Ma Hoa File',
    reviewLabel: 'Last reviewed',
    backLink: '&larr; Ve lai cong cu danh cho nha phat trien',
    when: {
      title: 'Cong Cu Ma Hoa File Khi Nao Nen Dung',
      desc: 'Cong Cu Ma Hoa File Khi Nao Nen Dung - khi nao mo Cong Cu Ma Hoa File la phu hop va nen mong doi dieu gi.',
      intro: 'dang mo ra khi ban can lam mot viec nhanh, chi mot lan, ma khong can cai dat gi. Trang nay noi ve khi nao viec do phu hop va khi nao khong.',
      h2a: 'Khi nao phu hop',
      pa: 'File duoc xao tron bang AES-256 dung mot khoa duoc suy ra tu mat khau cua ban (PBKDF2, 250.000 vong lap) cong voi salt va IV ngau nhien moi lan, nen ma hoa cung mot file hai lan voi cung mat khau se tao ra hai file .enc khac nhau - dieu nay la binh thuong, khong phai loi.',
      h2b: 'Nen mong doi dieu gi',
      pb: 'Mat khau sai, hoac file .enc bi sua doi hoac hong, se bi tu choi voi mot thong bao loi ro rang thay vi tao ra mot file hong hoac day du lieu vo nghia.',
      pc: 'Khong co cach khoi phuc mat khau: cong cu nay khong luu mat khau cua ban o bat ky dau, nen mat mat khau khien file da ma hoa vinh vien khong the khoi phuc - hay ghi lai o mot noi an toan truoc khi dong tab nay.',
    },
    step: {
      title: 'Cong Cu Ma Hoa File Tung Buoc',
      desc: 'Cong Cu Ma Hoa File Tung Buoc - cac buoc chinh xac de mo cong cu, nhap du lieu, va tai xuong ket qua.',
      intro: 'chay theo ba buoc: mo cong cu, nhap du lieu, roi tai xuong ket qua. Trang nay noi chi tiet dieu moi buoc can.',
      h2a: 'Buoc 1 - mo cong cu',
      pa: 'Vao Cong Cu Ma Hoa File. Khong can cai dat hay dang nhap truoc khi bat dau.',
      h2b: 'Buoc 2 - nhap du lieu',
      pb: 'File duoc xao tron bang AES-256 dung mot khoa duoc suy ra tu mat khau cua ban (PBKDF2, 250.000 vong lap) cong voi salt va IV ngau nhien moi lan, nen ma hoa cung mot file hai lan voi cung mat khau se tao ra hai file .enc khac nhau - dieu nay la binh thuong, khong phai loi.',
      h2c: 'Buoc 3 - lay ket qua',
      pc: 'Mat khau sai, hoac file .enc bi sua doi hoac hong, se bi tu choi voi mot thong bao loi ro rang thay vi tao ra mot file hong hoac day du lieu vo nghia.',
      pd: 'Khong co cach khoi phuc mat khau: cong cu nay khong luu mat khau cua ban o bat ky dau, nen mat mat khau khien file da ma hoa vinh vien khong the khoi phuc - hay ghi lai o mot noi an toan truoc khi dong tab nay.',
    },
    vs: {
      title: 'Cong Cu Ma Hoa File So Sanh Lua Chon Khac',
      desc: 'Cong Cu Ma Hoa File So Sanh Lua Chon Khac - Cong Cu Ma Hoa File so sanh the nao voi ung dung desktop hoac dich vu tai len.',
      intro: 'la mot trong ba cach pho bien de lam viec nay: mot cong cu chay tren trinh duyet nhu the nay, mot ung dung desktop, hoac mot dich vu truc tuyen dua tren tai len. Moi cach co diem manh yeu khac nhau ve noi du lieu cua ban di den va thu ban can cai dat.',
      h2a: 'Cong Cu Ma Hoa File so sanh the nao',
      thisTool: 'Cong Cu Ma Hoa File (cong cu nay)',
      aspect: 'Khia canh',
      desktopApp: 'Ung dung desktop',
      uploadService: 'Dich vu truc tuyen dua tren tai len',
      rowFile: 'Noi du lieu cua ban di den',
      valStaysDevice: 'O lai tren thiet bi nay - chay trong trinh duyet',
      valStaysDeviceApp: 'O lai tren thiet bi nay',
      valUploaded: 'Tai len mot server',
      rowInstall: 'Can cai dat',
      no: 'Khong',
      yes: 'Co',
      rowAccount: 'Hoat dong khong can tai khoan',
      valVaries: 'Khac nhau theo dich vu',
      pa: 'File duoc xao tron bang AES-256 dung mot khoa duoc suy ra tu mat khau cua ban (PBKDF2, 250.000 vong lap) cong voi salt va IV ngau nhien moi lan, nen ma hoa cung mot file hai lan voi cung mat khau se tao ra hai file .enc khac nhau - dieu nay la binh thuong, khong phai loi.',
      pb: 'Mat khau sai, hoac file .enc bi sua doi hoac hong, se bi tu choi voi mot thong bao loi ro rang thay vi tao ra mot file hong hoac day du lieu vo nghia.',
    },
  },
  id: {
    toolName: 'Alat Enkripsi File',
    reviewLabel: 'Last reviewed',
    backLink: '&larr; Kembali ke alat developer',
    when: {
      title: 'Alat Enkripsi File Kapan Digunakan',
      desc: 'Alat Enkripsi File Kapan Digunakan - kapan membuka Alat Enkripsi File cocok dan apa yang bisa diharapkan.',
      intro: 'layak dibuka saat kamu butuh proses cepat dan sekali pakai tanpa memasang apa pun. Halaman ini membahas kapan itu cocok dan kapan tidak.',
      h2a: 'Kapan cocok',
      pa: 'File diacak dengan AES-256 memakai kunci yang diturunkan dari kata sandimu (PBKDF2, 250.000 putaran) plus salt dan IV acak baru setiap kali, jadi mengenkripsi file yang sama dua kali dengan kata sandi yang sama menghasilkan dua file .enc yang berbeda - itu memang seperti itu, bukan bug.',
      h2b: 'Apa yang bisa diharapkan',
      pb: 'Kata sandi yang salah, atau file .enc yang diedit atau rusak, akan ditolak dengan pesan error sederhana, bukan menghasilkan file rusak atau berisi data acak.',
      pc: 'Tidak ada pemulihan kata sandi: alat ini tidak menyimpan kata sandimu di mana pun, jadi kata sandi yang hilang membuat file terenkripsi permanen tidak dapat dipulihkan - catat di tempat aman sebelum menutup tab ini.',
    },
    step: {
      title: 'Alat Enkripsi File Langkah Demi Langkah',
      desc: 'Alat Enkripsi File Langkah Demi Langkah - langkah pasti untuk membuka alat, memberikan input, dan mengunduh hasilnya.',
      intro: 'berjalan dalam tiga langkah: buka alat, berikan input, lalu unduh hasilnya. Halaman ini merinci apa yang diharapkan di setiap langkah.',
      h2a: 'Langkah 1 - buka alat',
      pa: 'Buka Alat Enkripsi File. Tidak perlu memasang apa pun atau login sebelum mulai.',
      h2b: 'Langkah 2 - berikan input',
      pb: 'File diacak dengan AES-256 memakai kunci yang diturunkan dari kata sandimu (PBKDF2, 250.000 putaran) plus salt dan IV acak baru setiap kali, jadi mengenkripsi file yang sama dua kali dengan kata sandi yang sama menghasilkan dua file .enc yang berbeda - itu memang seperti itu, bukan bug.',
      h2c: 'Langkah 3 - dapatkan hasilnya',
      pc: 'Kata sandi yang salah, atau file .enc yang diedit atau rusak, akan ditolak dengan pesan error sederhana, bukan menghasilkan file rusak atau berisi data acak.',
      pd: 'Tidak ada pemulihan kata sandi: alat ini tidak menyimpan kata sandimu di mana pun, jadi kata sandi yang hilang membuat file terenkripsi permanen tidak dapat dipulihkan - catat di tempat aman sebelum menutup tab ini.',
    },
    vs: {
      title: 'Alat Enkripsi File Vs Alternatif',
      desc: 'Alat Enkripsi File Vs Alternatif - bagaimana Alat Enkripsi File dibandingkan dengan aplikasi desktop atau layanan berbasis unggah.',
      intro: 'adalah satu dari tiga cara umum melakukan ini: alat berbasis browser seperti ini, aplikasi desktop, atau layanan online berbasis unggah. Masing-masing punya kelebihan berbeda soal ke mana data kamu pergi dan apa yang perlu dipasang.',
      h2a: 'Bagaimana Alat Enkripsi File dibandingkan',
      thisTool: 'Alat Enkripsi File (alat ini)',
      aspect: 'Aspek',
      desktopApp: 'Aplikasi desktop',
      uploadService: 'Layanan online berbasis unggah',
      rowFile: 'Ke mana data kamu pergi',
      valStaysDevice: 'Tetap di perangkat ini - berjalan di browser',
      valStaysDeviceApp: 'Tetap di perangkat ini',
      valUploaded: 'Diunggah ke server',
      rowInstall: 'Perlu instalasi',
      no: 'Tidak',
      yes: 'Ya',
      rowAccount: 'Berfungsi tanpa akun',
      valVaries: 'Berbeda per layanan',
      pa: 'File diacak dengan AES-256 memakai kunci yang diturunkan dari kata sandimu (PBKDF2, 250.000 putaran) plus salt dan IV acak baru setiap kali, jadi mengenkripsi file yang sama dua kali dengan kata sandi yang sama menghasilkan dua file .enc yang berbeda - itu memang seperti itu, bukan bug.',
      pb: 'Kata sandi yang salah, atau file .enc yang diedit atau rusak, akan ditolak dengan pesan error sederhana, bukan menghasilkan file rusak atau berisi data acak.',
    },
  },
  de: {
    toolName: 'Datei-Verschluesselungstool',
    reviewLabel: 'Last reviewed',
    backLink: '&larr; Zurueck zu Entwicklertools',
    when: {
      title: 'Datei-Verschluesselungstool Wann Nutzen',
      desc: 'Datei-Verschluesselungstool Wann Nutzen - wann das Datei-Verschluesselungstool passt und was dann zu erwarten ist.',
      intro: 'lohnt sich, wenn du einen schnellen, einmaligen Durchlauf brauchst, ohne etwas zu installieren. Diese Seite erklaert, wann das passt und wann nicht.',
      h2a: 'Wann es passt',
      pa: 'Die Datei wird mit AES-256 verschluesselt, mit einem Schluessel, der aus deinem Passwort abgeleitet wird (PBKDF2, 250.000 Runden), plus einem frischen zufaelligen Salt und IV bei jedem Durchlauf - deshalb erzeugt das zweimalige Verschluesseln derselben Datei mit demselben Passwort zwei unterschiedliche .enc-Dateien. Das ist so beabsichtigt, kein Fehler.',
      h2b: 'Was zu erwarten ist',
      pb: 'Ein falsches Passwort oder eine .enc-Datei, die bearbeitet oder beschaedigt wurde, wird mit einer klaren Fehlermeldung abgelehnt, statt eine defekte oder sinnlose Datei zu erzeugen.',
      pc: 'Es gibt keine Passwort-Wiederherstellung: dieses Tool speichert dein Passwort nirgendwo, daher macht ein verlorenes Passwort die verschluesselte Datei dauerhaft nicht wiederherstellbar - schreibe es dir an einem sicheren Ort auf, bevor du diesen Tab schliesst.',
    },
    step: {
      title: 'Datei-Verschluesselungstool Schritt Fuer Schritt',
      desc: 'Datei-Verschluesselungstool Schritt Fuer Schritt - die genauen Schritte, um das Tool zu oeffnen, deine Eingabe zu machen und das Ergebnis herunterzuladen.',
      intro: 'laeuft in drei Schritten ab: das Tool oeffnen, deine Eingabe machen, dann das Ergebnis herunterladen. Diese Seite erklaert, was jeder Schritt erwartet.',
      h2a: 'Schritt 1 - das Tool oeffnen',
      pa: 'Gehe zum Datei-Verschluesselungstool. Vor dem Start muss nichts installiert oder eingeloggt werden.',
      h2b: 'Schritt 2 - deine Eingabe machen',
      pb: 'Die Datei wird mit AES-256 verschluesselt, mit einem Schluessel, der aus deinem Passwort abgeleitet wird (PBKDF2, 250.000 Runden), plus einem frischen zufaelligen Salt und IV bei jedem Durchlauf - deshalb erzeugt das zweimalige Verschluesseln derselben Datei mit demselben Passwort zwei unterschiedliche .enc-Dateien. Das ist so beabsichtigt, kein Fehler.',
      h2c: 'Schritt 3 - das Ergebnis erhalten',
      pc: 'Ein falsches Passwort oder eine .enc-Datei, die bearbeitet oder beschaedigt wurde, wird mit einer klaren Fehlermeldung abgelehnt, statt eine defekte oder sinnlose Datei zu erzeugen.',
      pd: 'Es gibt keine Passwort-Wiederherstellung: dieses Tool speichert dein Passwort nirgendwo, daher macht ein verlorenes Passwort die verschluesselte Datei dauerhaft nicht wiederherstellbar - schreibe es dir an einem sicheren Ort auf, bevor du diesen Tab schliesst.',
    },
    vs: {
      title: 'Datei-Verschluesselungstool Vs Alternativen',
      desc: 'Datei-Verschluesselungstool Vs Alternativen - wie sich das Datei-Verschluesselungstool mit einer Desktop-App oder einem Upload-basierten Dienst vergleicht.',
      intro: 'ist eine von drei gaengigen Wegen, das zu erledigen: ein browserbasiertes Tool wie dieses, eine Desktop-Anwendung, oder ein Upload-basierter Online-Dienst. Jeder hat andere Vor- und Nachteile darin, wohin deine Daten gehen und was du installieren musst.',
      h2a: 'Wie sich das Datei-Verschluesselungstool vergleicht',
      thisTool: 'Datei-Verschluesselungstool (dieses Tool)',
      aspect: 'Aspekt',
      desktopApp: 'Desktop-Anwendung',
      uploadService: 'Upload-basierter Online-Dienst',
      rowFile: 'Wohin deine Daten gehen',
      valStaysDevice: 'Bleibt auf diesem Geraet - laeuft im Browser',
      valStaysDeviceApp: 'Bleibt auf diesem Geraet',
      valUploaded: 'Auf einen Server hochgeladen',
      rowInstall: 'Installation erforderlich',
      no: 'Nein',
      yes: 'Ja',
      rowAccount: 'Funktioniert ohne Konto',
      valVaries: 'Variiert je nach Dienst',
      pa: 'Die Datei wird mit AES-256 verschluesselt, mit einem Schluessel, der aus deinem Passwort abgeleitet wird (PBKDF2, 250.000 Runden), plus einem frischen zufaelligen Salt und IV bei jedem Durchlauf - deshalb erzeugt das zweimalige Verschluesseln derselben Datei mit demselben Passwort zwei unterschiedliche .enc-Dateien. Das ist so beabsichtigt, kein Fehler.',
      pb: 'Ein falsches Passwort oder eine .enc-Datei, die bearbeitet oder beschaedigt wurde, wird mit einer klaren Fehlermeldung abgelehnt, statt eine defekte oder sinnlose Datei zu erzeugen.',
    },
  },
};

function whenPage(lang) {
  const d = L[lang];
  const w = d.when;
  return `<h1 class="text-uppercase"><b>${w.title}</b></h1>
<time itemprop="dateUpdated" datetime="${REVIEWED}T00:00:00"><b>${d.reviewLabel}: ${REVIEWED}</b></time>
${AUTHOR_BYLINE}
<hr/>
<p><a href="${TOOL_HREF}">${d.toolName}</a> ${w.intro}</p>
<br/><h2><b>${w.h2a}</b></h2>
<p>${w.pa}</p>
<br/><h2><b>${w.h2b}</b></h2>
<p>${w.pb}</p>
<p>${w.pc}</p>
<p><a href="${BACK_HREF}">${d.backLink}</a></p>`;
}

function stepPage(lang) {
  const d = L[lang];
  const s = d.step;
  return `<h1 class="text-uppercase"><b>${s.title}</b></h1>
<time itemprop="dateUpdated" datetime="${REVIEWED}T00:00:00"><b>${d.reviewLabel}: ${REVIEWED}</b></time>
${AUTHOR_BYLINE}
<hr/>
<p><a href="${TOOL_HREF}">${d.toolName}</a> ${s.intro}</p>
<br/><h2><b>${s.h2a}</b></h2>
<p>${s.pa}</p>
<br/><h2><b>${s.h2b}</b></h2>
<p>${s.pb}</p>
<br/><h2><b>${s.h2c}</b></h2>
<p>${s.pc}</p>
<p>${s.pd}</p>
<p><a href="${BACK_HREF}">${d.backLink}</a></p>`;
}

function vsPage(lang) {
  const d = L[lang];
  const v = d.vs;
  return `<h1 class="text-uppercase"><b>${v.title}</b></h1>
<time itemprop="dateUpdated" datetime="${REVIEWED}T00:00:00"><b>${d.reviewLabel}: ${REVIEWED}</b></time>
${AUTHOR_BYLINE}
<hr/>
<p><a href="${TOOL_HREF}">${d.toolName}</a> ${v.intro}</p>
<br/><h2><b>${v.h2a}</b></h2>
<table class="w3-table w3-bordered w3-small">
<tr><th>${v.aspect}</th><th>${v.thisTool}</th><th>${v.desktopApp}</th><th>${v.uploadService}</th></tr>
<tr><td>${v.rowFile}</td><td>${v.valStaysDevice}</td><td>${v.valStaysDeviceApp}</td><td>${v.valUploaded}</td></tr>
<tr><td>${v.rowInstall}</td><td>${v.no}</td><td>${v.yes}</td><td>${v.no}</td></tr>
<tr><td>${v.rowAccount}</td><td>${v.yes}</td><td>${v.yes}</td><td>${v.valVaries}</td></tr>
</table>
<p>${v.pa}</p>
<p>${v.pb}</p>
<p><a href="${BACK_HREF}">${d.backLink}</a></p>`;
}

const ANGLES = [
  { key: 'when', slugSuffix: 'when', render: whenPage, titleOf: (d) => d.when.title, descOf: (d) => d.when.desc },
  { key: 'step', slugSuffix: 'step-by-step', render: stepPage, titleOf: (d) => d.step.title, descOf: (d) => d.step.desc },
  { key: 'vs', slugSuffix: 'vs-alternatives', render: vsPage, titleOf: (d) => d.vs.title, descOf: (d) => d.vs.desc },
];

const LANGS = ['pt', 'es', 'vi', 'id', 'de'];

let written = 0;
for (const lang of LANGS) {
  const d = L[lang];
  for (const angle of ANGLES) {
    const routeSlug = `file-encryption-${angle.slugSuffix}`;
    const cmsSlug = `guides${lang}fileencryption${angle.key === 'step' ? 'stepbystep' : angle.key === 'vs' ? 'vsalternatives' : 'when'}`;

    const titleFile = `${CMS}/BODYTITLE${cmsSlug}.txt`;
    const descFile = `${CMS}/BODYDESC${cmsSlug}.txt`;
    const htmlFile = `${CMS}/BODYHTML${cmsSlug}.html`;

    fs.writeFileSync(titleFile, angle.titleOf(d) + '\n');
    fs.writeFileSync(descFile, angle.descOf(d) + '\n');
    fs.writeFileSync(htmlFile, angle.render(lang) + '\n');
    written += 3;

    const jspPath = `${JSP}/${lang}/${routeSlug}.jsp`;
    fs.mkdirSync(`${JSP}/${lang}`, { recursive: true });
    fs.writeFileSync(jspPath, JSP_TEMPLATE);
    written += 1;
  }
}

console.log(`fire129: wrote ${written} files (15 CMS bundles x 3 + 15 JSP wrappers) across ${LANGS.length} locales.`);
