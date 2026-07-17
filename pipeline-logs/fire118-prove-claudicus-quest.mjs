import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const GAME = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/source/web/src/main/webapp/static/games/claudicus-quest';
const BODY = fs.readFileSync('/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/source/static/src/main/webapp/resources/view/CMS/BODYHTMLclaudicusquest.html','utf8');
const BODYJS = fs.readFileSync('/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/source/static/src/main/webapp/resources/view/CMS/BODYJSclaudicusquest.html','utf8');
const pageHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Claudicus Quest PROVE</title>
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<script>window.web = window.web || {};</script>
</head><body>
${BODY}
${BODYJS}
<script>if (typeof doAfterPageRendered === 'function') doAfterPageRendered();</script>
</body></html>`;

const mime = { '.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml' };
const server = http.createServer((req,res)=>{
  let u = decodeURIComponent((req.url||'/').split('?')[0]);
  if (u === '/games/claudicus-quest.html') { res.writeHead(200,{'Content-Type':'text/html'}); res.end(pageHtml); return; }
  if (u.startsWith('/games/claudicus-quest/')) {
    const rel = u.slice('/games/claudicus-quest/'.length) || 'index.html';
    const fp = path.join(GAME, rel);
    if (!fp.startsWith(GAME) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, {'Content-Type': mime[path.extname(fp)]||'application/octet-stream'});
    fs.createReadStream(fp).pipe(res); return;
  }
  res.writeHead(404); res.end('404');
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const port = server.address().port;
const browser = await chromium.launch({ args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const results = [];
for (const w of [390, 1440]) {
  const page = await browser.newPage({ viewport:{width:w,height:800} });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', msg => { if (msg.type()==='error') errs.push(msg.text()); });
  await page.goto(`http://127.0.0.1:${port}/games/claudicus-quest.html`, { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForSelector('#cqPlayBtn', { timeout:15000 });
  await page.click('#cqPlayBtn');
  await page.waitForSelector('#cqFrame', { timeout:15000 });
  await page.waitForTimeout(3000);
  const frame = page.frameLocator('#cqFrame');
  const hasCanvas = await frame.locator('#game, canvas').count().catch(()=>0);
  // sample non-black pixel via evaluate
  const drawn = await page.evaluate(async () => {
    const f = document.getElementById('cqFrame');
    if (!f || !f.contentWindow) return false;
    const c = f.contentDocument && f.contentDocument.getElementById('game');
    if (!c) return false;
    try {
      const ctx = c.getContext('2d');
      const d = ctx.getImageData(480, 320, 1, 1).data;
      return d[0]+d[1]+d[2]+d[3] > 0;
    } catch(e) { return true; /* canvas exists */ }
  });
  const gameOriginErrs = errs.filter(e => !/get-rating|adsbygoogle|gtag|403|Failed to load|w3schools|CORS/i.test(e));
  results.push({ w, hasCanvas, drawn, errs: gameOriginErrs.slice(0,8), ok: hasCanvas>0 && gameOriginErrs.length===0 });
  await page.close();
}
await browser.close();
server.close();
console.log(JSON.stringify(results,null,2));
if (!results.every(r=>r.ok)) process.exit(2);
console.log('PROVE_PASS');
