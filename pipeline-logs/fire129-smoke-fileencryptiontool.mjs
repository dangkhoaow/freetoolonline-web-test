import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const distPath = path.resolve('freetoolonline-web-test/dist/developer-tools/file-encryption-tool.html');
const url = 'file://' + distPath;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const consoleErrors = [];
page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));

await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(500);

const initial = await page.evaluate(() => ({
  fileInput: !!document.querySelector('#feFile'),
  passInput: !!document.querySelector('#fePass'),
  encBtn: document.querySelector('#feEnc') ? document.querySelector('#feEnc').disabled : null,
  decBtn: document.querySelector('#feDec') ? document.querySelector('#feDec').disabled : null,
  statusText: document.querySelector('#feStatus') ? document.querySelector('#feStatus').textContent : null,
}));
console.log('AFTER LOAD:', JSON.stringify(initial));

// Prepare a small test file on disk to upload via setInputFiles.
const testFilePath = '/tmp/fire129-fe-test-input.txt';
const originalContent = 'Hello from fire129 smoke test - round trip check 12345.';
fs.writeFileSync(testFilePath, originalContent);

await page.setInputFiles('#feFile', testFilePath);
await page.fill('#fePass', 'CorrectHorseBatteryStaple');
await page.waitForTimeout(200);

const afterFileChosen = await page.evaluate(() => ({
  encBtnDisabled: document.querySelector('#feEnc').disabled,
  decBtnDisabled: document.querySelector('#feDec').disabled,
}));
console.log('AFTER FILE+PASSWORD:', JSON.stringify(afterFileChosen));

// Encrypt.
await page.click('#feEnc');
await page.waitForFunction(() => {
  const dl = document.querySelector('#feDl');
  return dl && dl.style.display !== 'none' && dl.getAttribute('href');
}, { timeout: 10000 });

const encHref = await page.evaluate(() => document.querySelector('#feDl').getAttribute('href'));
const encStatus = await page.evaluate(() => document.querySelector('#feStatus').textContent);
console.log('AFTER ENCRYPT: hrefIsBlob=', String(encHref).startsWith('blob:'), 'status=', encStatus);

// Fetch the encrypted blob content out of the page context, save to disk.
const encBase64 = await page.evaluate(async (href) => {
  const res = await fetch(href);
  const buf = await res.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}, encHref);
const encBuf = Buffer.from(encBase64, 'base64');
const encFilePath = '/tmp/fire129-fe-test-output.enc';
fs.writeFileSync(encFilePath, encBuf);
console.log('ENCRYPTED FILE BYTES:', encBuf.length);

// Reload fresh, then decrypt with the CORRECT password - full round trip proof.
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(300);
await page.setInputFiles('#feFile', encFilePath);
await page.fill('#fePass', 'CorrectHorseBatteryStaple');
await page.waitForTimeout(200);
await page.click('#feDec');
await page.waitForFunction(() => {
  const dl = document.querySelector('#feDl');
  return dl && dl.style.display !== 'none' && dl.getAttribute('href');
}, { timeout: 10000 });

const decHref = await page.evaluate(() => document.querySelector('#feDl').getAttribute('href'));
const decodedText = await page.evaluate(async (href) => {
  const res = await fetch(href);
  return await res.text();
}, decHref);
console.log('AFTER DECRYPT (correct password): matches original =', decodedText === originalContent, 'decoded=', JSON.stringify(decodedText));

// Reload fresh, then decrypt with the WRONG password - must show a plain error, not garbage.
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(300);
await page.setInputFiles('#feFile', encFilePath);
await page.fill('#fePass', 'WrongPassword999');
await page.waitForTimeout(200);
await page.click('#feDec');
await page.waitForTimeout(1500);
const wrongPassStatus = await page.evaluate(() => document.querySelector('#feStatus').textContent);
console.log('AFTER DECRYPT (wrong password): status=', JSON.stringify(wrongPassStatus));

console.log('CONSOLE ERRORS:', JSON.stringify(consoleErrors));

await browser.close();
