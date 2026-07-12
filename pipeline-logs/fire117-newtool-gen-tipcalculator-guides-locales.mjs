// new-tool-discovery-loop-runbook — guide_locale_fanout for tip-calculator
// (fire117). Authors pt/es/vi/id/de locale variants of the 3 EN companion guide
// angles (tip-calculator-when, -step-by-step, -vs-alternatives) shipped
// EN-only by build-tool-page.mjs this same fire. Content translated faithfully
// from the EN BODYHTMLguidestipcalculator{when,stepbystep,vsalternatives}.html
// sources, which themselves paraphrase ONLY
// .agent/skills/tool-tipcalculator/SKILL.md ## Reader-benefit framing menu.
// Same generator shape as fire116-newtool-gen-bmicalculator-guides-locales.mjs.
// VI/ID diacritic-free, DE ue/oe/ae/ss, ASCII hyphen only (R9), no SEO-query echo.
import fs from 'node:fs';
import path from 'node:path';

const CMS = 'source/static/src/main/webapp/resources/view/CMS';
const JSP = 'source/web/src/main/webapp/WEB-INF/jsp/guide';
const REVIEWED = '2026-07-12';

const JSP_TEMPLATE = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<freetoolonline:page browserTitle='\${pageBodyTitle}' description='\${pageBodyDesc}'>
	<freetoolonline:loading/>
	<!-- BODYHTML -->
	\${pageBodyHTML}
</freetoolonline:page>
`;

function html({ h1, intro, sections, backLabel }) {
  let out = `<h1 class="text-uppercase"><b>${h1}</b></h1>\n`;
  out += `<time itemprop="dateUpdated" datetime="${REVIEWED}T00:00:00"><b>Last reviewed: ${REVIEWED}</b></time>\n`;
  out += `<hr/>\n<p>${intro}</p>\n`;
  for (const s of sections) {
    if (s.h2) out += `<br/><h2><b>${s.h2}</b></h2>\n`;
    if (s.table) {
      out += `<table class="w3-table w3-bordered w3-small">\n<tr>${s.table.header.map(h => `<th>${h}</th>`).join('')}</tr>\n`;
      for (const row of s.table.rows) out += `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>\n`;
      out += `</table>\n`;
    }
    for (const p of s.paragraphs || []) out += `<p>${p}</p>\n`;
  }
  out += `<p><a href="/utility-tools.html">&larr; ${backLabel}</a></p>\n`;
  return out;
}

const TOOL_LINK_EN = `<a href="/utility-tools/tip-calculator.html">`;

const LOCALES = {
  pt: {
    step: {
      title: 'Calculadora de Gorjeta Passo a Passo',
      desc: 'Calculadora de Gorjeta Passo a Passo - os passos exatos para executar a Calculadora de Gorjeta desde abrir até obter o resultado.',
      h1: 'Calculadora de Gorjeta Passo a Passo',
      intro: `${TOOL_LINK_EN}Calculadora de Gorjeta</a> funciona em três passos: abra a ferramenta, forneça sua entrada e depois veja o resultado. Esta página explica o que cada passo espera.`,
      sections: [
        { h2: 'Passo 1 - abra a ferramenta', paragraphs: [`Abra a ${TOOL_LINK_EN}Calculadora de Gorjeta</a>. Nada precisa ser instalado ou conectado antes de começar.`] },
        { h2: 'Passo 2 - forneça sua entrada', paragraphs: ['Informe o valor da conta, a porcentagem de gorjeta e o número de pessoas; a gorjeta, o total e a parte por pessoa são atualizados enquanto você digita.'] },
        { h2: 'Passo 3 - obtenha o resultado', paragraphs: ['O cálculo roda localmente no navegador - sem envio de arquivo e sem conta.', 'Altere qualquer campo a qualquer momento e todos os totais recalculam na hora.'] },
      ],
      backLabel: 'Voltar para ferramentas utilitárias',
    },
    when: {
      title: 'Calculadora de Gorjeta Quando Usar',
      desc: 'Calculadora de Gorjeta Quando Usar - quando abrir a Calculadora de Gorjeta faz sentido e o que esperar quando faz.',
      h1: 'Calculadora de Gorjeta Quando Usar',
      intro: `${TOOL_LINK_EN}Calculadora de Gorjeta</a> vale a pena abrir quando você precisa de uma execução rápida e única sem instalar nada. Esta página mostra quando isso faz sentido e quando não.`,
      sections: [
        { h2: 'Quando faz sentido', paragraphs: ['Use-a para dividir a conta de um restaurante ou serviço em grupo rapidamente, sem fazer a conta na mão.'] },
        { h2: 'O que esperar', paragraphs: ['O cálculo roda localmente no navegador - sem envio de arquivo e sem conta.', 'Altere qualquer campo a qualquer momento e todos os totais recalculam na hora.'] },
      ],
      backLabel: 'Voltar para ferramentas utilitárias',
    },
    vs: {
      title: 'Calculadora de Gorjeta Vs Alternativas',
      desc: 'Calculadora de Gorjeta Vs Alternativas - como a Calculadora de Gorjeta se compara a um aplicativo de desktop ou a um serviço online baseado em envio de arquivo.',
      h1: 'Calculadora de Gorjeta Vs Alternativas',
      intro: `${TOOL_LINK_EN}Calculadora de Gorjeta</a> é uma de três formas comuns de fazer isso: uma ferramenta no navegador como esta, um aplicativo de desktop, ou fazer a conta na mão. Cada uma tem vantagens diferentes quanto a velocidade e ao que você precisa instalar.`,
      sections: [
        { h2: 'Como a Calculadora de Gorjeta se compara', table: { header: ['Aspecto', 'Calculadora de Gorjeta (esta ferramenta)', 'Aplicativo de desktop', 'Conta na mão'], rows: [
          ['Onde os dados ficam', 'Permanecem neste dispositivo - roda no navegador', 'Permanecem neste dispositivo', 'Não se aplica'],
          ['Instalação necessária', 'Não', 'Sim', 'Não'],
          ['Atualização em tempo real ao digitar', 'Sim', 'Varia por aplicativo', 'Não'],
        ] }, paragraphs: ['Informe o valor da conta, a porcentagem de gorjeta e o número de pessoas; a gorjeta, o total e a parte por pessoa são atualizados enquanto você digita.', 'O cálculo roda localmente no navegador - sem envio de arquivo e sem conta.'] },
      ],
      backLabel: 'Voltar para ferramentas utilitárias',
    },
  },
  es: {
    step: {
      title: 'Calculadora de Propina Paso a Paso',
      desc: 'Calculadora de Propina Paso a Paso - los pasos exactos para ejecutar la Calculadora de Propina desde abrir hasta obtener el resultado.',
      h1: 'Calculadora de Propina Paso a Paso',
      intro: `${TOOL_LINK_EN}Calculadora de Propina</a> funciona en tres pasos: abre la herramienta, proporciona tu entrada y luego ve el resultado. Esta página explica qué espera cada paso.`,
      sections: [
        { h2: 'Paso 1 - abre la herramienta', paragraphs: [`Abre la ${TOOL_LINK_EN}Calculadora de Propina</a>. No necesitas instalar ni iniciar sesión antes de empezar.`] },
        { h2: 'Paso 2 - proporciona tu entrada', paragraphs: ['Ingresa el monto de la cuenta, el porcentaje de propina y el número de personas; la propina, el total y la parte por persona se actualizan mientras escribes.'] },
        { h2: 'Paso 3 - obtén el resultado', paragraphs: ['El cálculo se ejecuta localmente en el navegador - sin subir archivos y sin cuenta.', 'Cambia cualquier campo en cualquier momento y todos los totales se recalculan al instante.'] },
      ],
      backLabel: 'Volver a herramientas de utilidad',
    },
    when: {
      title: 'Calculadora de Propina Cuando Usarla',
      desc: 'Calculadora de Propina Cuando Usarla - cuando abrir la Calculadora de Propina tiene sentido y qué esperar cuando lo hace.',
      h1: 'Calculadora de Propina Cuando Usarla',
      intro: `${TOOL_LINK_EN}Calculadora de Propina</a> vale la pena abrirla cuando necesitas una ejecución rápida y puntual sin instalar nada. Esta página explica cuándo eso tiene sentido y cuándo no.`,
      sections: [
        { h2: 'Cuando tiene sentido', paragraphs: ['Úsala para dividir la cuenta de un restaurante o servicio en grupo rapidamente, sin hacer la cuenta a mano.'] },
        { h2: 'Qué esperar', paragraphs: ['El cálculo se ejecuta localmente en el navegador - sin subir archivos y sin cuenta.', 'Cambia cualquier campo en cualquier momento y todos los totales se recalculan al instante.'] },
      ],
      backLabel: 'Volver a herramientas de utilidad',
    },
    vs: {
      title: 'Calculadora de Propina Vs Alternativas',
      desc: 'Calculadora de Propina Vs Alternativas - cómo se compara la Calculadora de Propina con una aplicación de escritorio o hacer la cuenta a mano.',
      h1: 'Calculadora de Propina Vs Alternativas',
      intro: `${TOOL_LINK_EN}Calculadora de Propina</a> es una de tres formas comunes de hacer esto: una herramienta en el navegador como esta, una aplicación de escritorio, o hacer la cuenta a mano. Cada una tiene ventajas distintas en velocidad y en qué necesitas instalar.`,
      sections: [
        { h2: 'Cómo se compara la Calculadora de Propina', table: { header: ['Aspecto', 'Calculadora de Propina (esta herramienta)', 'Aplicación de escritorio', 'Cuenta a mano'], rows: [
          ['Dónde quedan tus datos', 'Permanecen en este dispositivo - se ejecuta en el navegador', 'Permanecen en este dispositivo', 'No aplica'],
          ['Instalación necesaria', 'No', 'Sí', 'No'],
          ['Se actualiza en vivo al escribir', 'Sí', 'Varía por aplicación', 'No'],
        ] }, paragraphs: ['Ingresa el monto de la cuenta, el porcentaje de propina y el número de personas; la propina, el total y la parte por persona se actualizan mientras escribes.', 'El cálculo se ejecuta localmente en el navegador - sin subir archivos y sin cuenta.'] },
      ],
      backLabel: 'Volver a herramientas de utilidad',
    },
  },
  vi: {
    step: {
      title: 'May Tinh Tien Tip Tung Buoc',
      desc: 'May Tinh Tien Tip Tung Buoc - cac buoc chinh xac de chay May Tinh Tien Tip tu khi mo den khi nhan ket qua.',
      h1: 'May Tinh Tien Tip Tung Buoc',
      intro: `${TOOL_LINK_EN}May Tinh Tien Tip</a> chay theo ba buoc: mo cong cu, nhap du lieu, roi xem ket qua. Trang nay giai thich moi buoc can gi.`,
      sections: [
        { h2: 'Buoc 1 - mo cong cu', paragraphs: [`Mo ${TOOL_LINK_EN}May Tinh Tien Tip</a>. Khong can cai dat hay dang nhap truoc khi bat dau.`] },
        { h2: 'Buoc 2 - nhap du lieu', paragraphs: ['Nhap so tien hoa don, ty le tien tip, va so nguoi; tien tip, tong cong, va phan chia moi nguoi se cap nhat ngay khi ban go.'] },
        { h2: 'Buoc 3 - nhan ket qua', paragraphs: ['Phep tinh chay ngay trong trinh duyet - khong tai file len va khong can tai khoan.', 'Doi bat ky truong nao luc nao va moi so tong se tinh lai ngay lap tuc.'] },
      ],
      backLabel: 'Ve lai cong cu tien ich',
    },
    when: {
      title: 'May Tinh Tien Tip Khi Nao Nen Dung',
      desc: 'May Tinh Tien Tip Khi Nao Nen Dung - khi nao mo May Tinh Tien Tip phu hop, va ban se nhan duoc gi khi dung no.',
      h1: 'May Tinh Tien Tip Khi Nao Nen Dung',
      intro: `${TOOL_LINK_EN}May Tinh Tien Tip</a> dang de mo khi ban can chay nhanh, mot lan, khong can cai dat gi. Trang nay noi ro khi nao phu hop va khi nao khong.`,
      sections: [
        { h2: 'Khi nao phu hop', paragraphs: ['Dung de chia hoa don nha hang hoac dich vu theo nhom nhanh chong, khong can tinh bang tay.'] },
        { h2: 'Ban se nhan duoc gi', paragraphs: ['Phep tinh chay ngay trong trinh duyet - khong tai file len va khong can tai khoan.', 'Doi bat ky truong nao luc nao va moi so tong se tinh lai ngay lap tuc.'] },
      ],
      backLabel: 'Ve lai cong cu tien ich',
    },
    vs: {
      title: 'May Tinh Tien Tip So Sanh Voi Cac Lua Chon Khac',
      desc: 'May Tinh Tien Tip So Sanh Voi Cac Lua Chon Khac - May Tinh Tien Tip khac gi voi ung dung desktop hoac tinh bang tay.',
      h1: 'May Tinh Tien Tip So Sanh Voi Cac Lua Chon Khac',
      intro: `${TOOL_LINK_EN}May Tinh Tien Tip</a> la mot trong ba cach pho bien de lam viec nay: mot cong cu chay trong trinh duyet nhu the nay, mot ung dung desktop, hoac tinh bang tay. Moi cach danh doi khac nhau ve toc do va nhung gi ban can cai dat.`,
      sections: [
        { h2: 'May Tinh Tien Tip so sanh nhu the nao', table: { header: ['Khia canh', 'May Tinh Tien Tip (cong cu nay)', 'Ung dung desktop', 'Tinh bang tay'], rows: [
          ['Du lieu cua ban di dau', 'Van o tren thiet bi nay - chay trong trinh duyet', 'Van o tren thiet bi nay', 'Khong ap dung'],
          ['Can cai dat', 'Khong', 'Co', 'Khong'],
          ['Cap nhat ngay khi go', 'Co', 'Tuy ung dung', 'Khong'],
        ] }, paragraphs: ['Nhap so tien hoa don, ty le tien tip, va so nguoi; tien tip, tong cong, va phan chia moi nguoi se cap nhat ngay khi ban go.', 'Phep tinh chay ngay trong trinh duyet - khong tai file len va khong can tai khoan.'] },
      ],
      backLabel: 'Ve lai cong cu tien ich',
    },
  },
  id: {
    step: {
      title: 'Kalkulator Tip Langkah demi Langkah',
      desc: 'Kalkulator Tip Langkah demi Langkah - langkah pasti untuk menjalankan Kalkulator Tip dari membuka hingga mendapatkan hasilnya.',
      h1: 'Kalkulator Tip Langkah demi Langkah',
      intro: `${TOOL_LINK_EN}Kalkulator Tip</a> berjalan dalam tiga langkah: buka alat, masukkan data Anda, lalu lihat hasilnya. Halaman ini menjelaskan apa yang diharapkan di setiap langkah.`,
      sections: [
        { h2: 'Langkah 1 - buka alat', paragraphs: [`Buka ${TOOL_LINK_EN}Kalkulator Tip</a>. Tidak perlu memasang apa pun atau masuk akun sebelum memulai.`] },
        { h2: 'Langkah 2 - masukkan data Anda', paragraphs: ['Masukkan jumlah tagihan, persentase tip, dan jumlah orang; tip, total, dan bagian per orang diperbarui saat Anda mengetik.'] },
        { h2: 'Langkah 3 - dapatkan hasilnya', paragraphs: ['Perhitungan berjalan langsung di browser - tanpa mengunggah file dan tanpa akun.', 'Ubah kolom mana pun kapan saja dan setiap total dihitung ulang langsung.'] },
      ],
      backLabel: 'Kembali ke alat utilitas',
    },
    when: {
      title: 'Kalkulator Tip Kapan Digunakan',
      desc: 'Kalkulator Tip Kapan Digunakan - kapan membuka Kalkulator Tip cocok dan apa yang diharapkan.',
      h1: 'Kalkulator Tip Kapan Digunakan',
      intro: `${TOOL_LINK_EN}Kalkulator Tip</a> layak dibuka saat kamu perlu proses cepat sekali jalan tanpa memasang apa pun. Halaman ini membahas kapan itu cocok dan kapan tidak.`,
      sections: [
        { h2: 'Kapan cocok', paragraphs: ['Gunakan untuk membagi tagihan restoran atau layanan bersama secara cepat, tanpa menghitung manual.'] },
        { h2: 'Apa yang diharapkan', paragraphs: ['Perhitungan berjalan langsung di browser - tanpa mengunggah file dan tanpa akun.', 'Ubah kolom mana pun kapan saja dan setiap total dihitung ulang langsung.'] },
      ],
      backLabel: 'Kembali ke alat utilitas',
    },
    vs: {
      title: 'Kalkulator Tip Vs Alternatif',
      desc: 'Kalkulator Tip Vs Alternatif - bagaimana Kalkulator Tip dibandingkan dengan aplikasi desktop atau menghitung manual.',
      h1: 'Kalkulator Tip Vs Alternatif',
      intro: `${TOOL_LINK_EN}Kalkulator Tip</a> adalah satu dari tiga cara umum melakukan ini: alat berbasis browser seperti ini, aplikasi desktop, atau menghitung manual. Masing-masing punya kelebihan berbeda soal kecepatan dan apa yang perlu dipasang.`,
      sections: [
        { h2: 'Bagaimana Kalkulator Tip dibandingkan', table: { header: ['Aspek', 'Kalkulator Tip (alat ini)', 'Aplikasi desktop', 'Menghitung manual'], rows: [
          ['Ke mana data Anda pergi', 'Tetap di perangkat ini - berjalan di browser', 'Tetap di perangkat ini', 'Tidak berlaku'],
          ['Perlu instalasi', 'Tidak', 'Ya', 'Tidak'],
          ['Update langsung saat mengetik', 'Ya', 'Bergantung pada aplikasi', 'Tidak'],
        ] }, paragraphs: ['Masukkan jumlah tagihan, persentase tip, dan jumlah orang; tip, total, dan bagian per orang diperbarui saat Anda mengetik.', 'Perhitungan berjalan langsung di browser - tanpa mengunggah file dan tanpa akun.'] },
      ],
      backLabel: 'Kembali ke alat utilitas',
    },
  },
  de: {
    step: {
      title: 'Trinkgeldrechner Schritt fuer Schritt',
      desc: 'Trinkgeldrechner Schritt fuer Schritt - die genauen Schritte, um den Trinkgeldrechner vom Oeffnen bis zum Ergebnis auszufuehren.',
      h1: 'Trinkgeldrechner Schritt fuer Schritt',
      intro: `${TOOL_LINK_EN}Trinkgeldrechner</a> laeuft in drei Schritten ab: das Werkzeug oeffnen, die Eingabe machen, dann das Ergebnis ansehen. Diese Seite erklaert, was jeder Schritt erwartet.`,
      sections: [
        { h2: 'Schritt 1 - Werkzeug oeffnen', paragraphs: [`Oeffne den ${TOOL_LINK_EN}Trinkgeldrechner</a>. Vor dem Start muss nichts installiert oder angemeldet werden.`] },
        { h2: 'Schritt 2 - Eingabe machen', paragraphs: ['Gib den Rechnungsbetrag, den Trinkgeld-Prozentsatz und die Anzahl der Personen ein; Trinkgeld, Gesamtbetrag und Anteil pro Person aktualisieren sich waehrend der Eingabe.'] },
        { h2: 'Schritt 3 - Ergebnis erhalten', paragraphs: ['Die Berechnung laeuft direkt im Browser ab - kein Datei-Upload und kein Konto.', 'Aendere ein beliebiges Feld jederzeit und alle Summen werden sofort neu berechnet.'] },
      ],
      backLabel: 'Zurueck zu Dienstprogrammen',
    },
    when: {
      title: 'Trinkgeldrechner Wann Nutzen',
      desc: 'Trinkgeldrechner Wann Nutzen - wann das Oeffnen des Trinkgeldrechners passt und was dabei zu erwarten ist.',
      h1: 'Trinkgeldrechner Wann Nutzen',
      intro: `${TOOL_LINK_EN}Trinkgeldrechner</a> lohnt sich, wenn du einen schnellen, einmaligen Durchlauf ohne Installation brauchst. Diese Seite zeigt, wann das passt und wann nicht.`,
      sections: [
        { h2: 'Wann es passt', paragraphs: ['Nutze ihn, um eine Restaurant- oder Gruppenrechnung schnell aufzuteilen, ohne von Hand zu rechnen.'] },
        { h2: 'Was zu erwarten ist', paragraphs: ['Die Berechnung laeuft direkt im Browser ab - kein Datei-Upload und kein Konto.', 'Aendere ein beliebiges Feld jederzeit und alle Summen werden sofort neu berechnet.'] },
      ],
      backLabel: 'Zurueck zu Dienstprogrammen',
    },
    vs: {
      title: 'Trinkgeldrechner Vs Alternativen',
      desc: 'Trinkgeldrechner Vs Alternativen - wie der Trinkgeldrechner im Vergleich zu einer Desktop-Anwendung oder Kopfrechnen abschneidet.',
      h1: 'Trinkgeldrechner Vs Alternativen',
      intro: `${TOOL_LINK_EN}Trinkgeldrechner</a> ist eine von drei gaengigen Methoden dafuer: ein browserbasiertes Werkzeug wie dieses, eine Desktop-Anwendung, oder Kopfrechnen. Jede Variante hat andere Vorteile bei Geschwindigkeit und dem, was du installieren musst.`,
      sections: [
        { h2: 'Wie der Trinkgeldrechner abschneidet', table: { header: ['Aspekt', 'Trinkgeldrechner (dieses Werkzeug)', 'Desktop-Anwendung', 'Kopfrechnen'], rows: [
          ['Wohin deine Daten gehen', 'Bleiben auf diesem Geraet - laeuft im Browser', 'Bleiben auf diesem Geraet', 'Nicht zutreffend'],
          ['Installation erforderlich', 'Nein', 'Ja', 'Nein'],
          ['Live-Aktualisierung bei Eingabe', 'Ja', 'Je nach Anwendung unterschiedlich', 'Nein'],
        ] }, paragraphs: ['Gib den Rechnungsbetrag, den Trinkgeld-Prozentsatz und die Anzahl der Personen ein; Trinkgeld, Gesamtbetrag und Anteil pro Person aktualisieren sich waehrend der Eingabe.', 'Die Berechnung laeuft direkt im Browser ab - kein Datei-Upload und kein Konto.'] },
      ],
      backLabel: 'Zurueck zu Dienstprogrammen',
    },
  },
};

const ANGLE_SLUG = { step: 'stepbystep', when: 'when', vs: 'vsalternatives' };
const ANGLE_ROUTE = { step: 'step-by-step', when: 'when', vs: 'vs-alternatives' };

let written = 0;
for (const [lang, angles] of Object.entries(LOCALES)) {
  for (const [angleKey, content] of Object.entries(angles)) {
    const slug = `guides${lang}tipcalculator${ANGLE_SLUG[angleKey]}`;
    fs.writeFileSync(path.join(CMS, `BODYTITLE${slug}.txt`), content.title + '\n');
    fs.writeFileSync(path.join(CMS, `BODYDESC${slug}.txt`), content.desc + '\n');
    fs.writeFileSync(path.join(CMS, `BODYHTML${slug}.html`), html(content));
    written += 3;

    const jspDir = path.join(JSP, lang);
    fs.mkdirSync(jspDir, { recursive: true });
    fs.writeFileSync(path.join(jspDir, `tip-calculator-${ANGLE_ROUTE[angleKey]}.jsp`), JSP_TEMPLATE);
    written += 1;
  }
}
console.log(`Wrote ${written} files (15 guide pages x [BODYTITLE, BODYDESC, BODYHTML, JSP]).`);
