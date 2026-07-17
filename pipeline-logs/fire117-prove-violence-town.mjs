import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const GAME = '/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/source/web/src/main/webapp/static/games/violence-town';
const BODY = fs.readFileSync('/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/source/static/src/main/webapp/resources/view/CMS/BODYHTMLviolencetown.html','utf8');
const BODYJS = fs.readFileSync('/Users/ktran/Documents/Code/new/freetoolonline-frontend/freetoolonline-web-test/source/static/src/main/webapp/resources/view/CMS/BODYJSviolencetown.html','utf8');
const pageHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Violence Town PROVE</title>
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<script>window.web = window.web || {};</script>
</head><body>
${BODY}
${BODYJS}
<script>
if (typeof doAfterPageRendered === 'function') doAfterPageRendered();
</script>
</body></html>`;

const mime = { '.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.webmanifest':'application/manifest+json','.txt':'text/plain' };
const server = http.createServer((req,res)=>{
  let u = decodeURIComponent((req.url||'/').split('?')[0]);
  if (u === '/games/violence-town.html') {
    res.writeHead(200,{'Content-Type':'text/html'}); res.end(pageHtml); return;
  }
  if (u.startsWith('/games/violence-town/')) {
    const rel = u.slice('/games/violence-town/'.length) || 'index.html';
    const fp = path.join(GAME, rel);
    if (!fp.startsWith(GAME) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, {'Content-Type': mime[path.extname(fp)]||'application/octet-stream'});
    fs.createReadStream(fp).pipe(res); return;
  }
  res.writeHead(404); res.end('404');
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const port = server.address().port;
const url = `http://127.0.0.1:${port}/games/violence-town.html`;
const browser = await chromium.launch({ args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const results = [];
for (const w of [390, 1440]) {
  const page = await browser.newPage({ viewport:{width:w,height:800} });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', msg => { if (msg.type()==='error') errs.push(msg.text()); });
  await page.goto(url, { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForSelector('#vtnPlayBtn', { timeout:15000 });
  await page.click('#vtnPlayBtn');
  await page.waitForSelector('#vtnFrame', { timeout:15000 });
  await page.waitForTimeout(4000);
  const frame = page.frameLocator('#vtnFrame');
  const hasCanvas = await frame.locator('#splash-canvas, #game-canvas, canvas').count().catch(()=>0);
  const splash = await frame.locator('#splash-go, #splash').count().catch(()=>0);
  const gameOriginErrs = errs.filter(e => !/get-rating|adsbygoogle|gtag|403|Failed to load resource|heath-check|CORS|w3schools/i.test(e));
  results.push({ w, hasCanvas, splash, errs: gameOriginErrs.slice(0,8), ok: hasCanvas>0 && gameOriginErrs.length===0 });
  await page.close();
}
await browser.close();
server.close();
console.log(JSON.stringify(results,null,2));
if (!results.every(r=>r.ok)) process.exit(2);
console.log('PROVE_PASS');
