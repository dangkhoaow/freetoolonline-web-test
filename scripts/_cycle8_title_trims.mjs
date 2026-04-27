// Trim 20 guides-cluster BODYTITLE files so rendered (= cms + " - Free Tool Online" 19c suffix) <= 65c.
// Each trim preserves the primary keyword. Pre-trim and post-trim are documented per slug below.
import fs from 'node:fs';
import path from 'node:path';
const REPO = path.resolve(import.meta.dirname, '..');
const CMS = path.join(REPO, 'source/static/src/main/webapp/resources/view/CMS');

// (slug, current_text, new_text) — verified each new_text <= 46c so rendered <= 65c.
const trims = [
  // existing guides cluster (20)
  ['guidescssminifiervscompressor', 'CSS Minifier vs Compressor - When You Need Each', 'CSS Minifier vs Compressor'],
  ['guidesdeadpixeltestingguide', 'Dead Pixel Testing Guide - Find Stuck Pixels', 'Dead Pixel Testing Guide'],
  ['guidesfilecompressorvszipwhattopick', 'File Compressor vs ZIP - What to Pick', 'File Compressor vs ZIP'],
  ['guidesheicvsjpgconverterwheneachwins', 'HEIC vs JPG Converter - When Each Wins', 'HEIC vs JPG Converter'],
  ['guidesheicvsjpgvswebp', 'HEIC vs JPG vs WebP - When to Use Each', 'HEIC vs JPG vs WebP'],
  ['guideshowtocheckwebcamandmicrophonebeforeaninterview', 'How to Check Webcam and Microphone Before an Interview', 'Check Webcam and Mic Before Interview'],
  ['guideshowtocompressafolderforemail', 'How to Compress a Folder for Email', 'Compress a Folder for Email'],
  ['guideshowtoconvert100heicphotostojpg', 'How to Convert 100 HEIC Photos to JPG', 'Convert 100 HEIC Photos to JPG'],
  ['guideshowtoextractframesfromagifforasocialpost', 'How to Extract Frames from a GIF for a Social Post', 'Extract Frames from a GIF'],
  ['guideshowtominifycssjsforcloudruncoldstart', 'How to Minify CSS and JS for Cloud Run Cold Start', 'Minify CSS and JS for Cold Start'],
  ['guideshowtotestfordeadpixelsbeforereturningamonitor', 'How to Test for Dead Pixels Before Returning a Monitor', 'Test Dead Pixels Before Returning a Monitor'],
  ['guidesjpgvspngforweb', 'JPG vs PNG for the Web - Which to Pick When', 'JPG vs PNG for the Web'],
  ['guidesmd5vssha256whentohash', 'MD5 vs SHA-256 - When to Hash With Each', 'MD5 vs SHA-256 - When to Hash'],
  ['guidesmp4vswebmforweb', 'MP4 vs WebM for the Web - Which to Use', 'MP4 vs WebM for the Web'],
  ['guidespdfpasswordtypesownervsuser', 'PDF Password Types - Owner vs User Password', 'PDF Password - Owner vs User'],
  ['guidespdfvsheicfordocumentarchival', 'PDF vs HEIC for Document Archival - Which Lasts', 'PDF vs HEIC for Archival'],
  ['guidespngvssvgwhentouse', 'PNG vs SVG - When to Use Each Format', 'PNG vs SVG - When to Use Each'],
  ['guidesunixtimestampsexplained', 'Unix Timestamps Explained - Epoch and Milliseconds', 'Unix Timestamps Explained'],
  ['guideswhatwelearnedrunningfreeinbrowserimagetoolsfor100kmonthlyusers', 'What We Learned Running Free In-Browser Image Tools', 'In-Browser Image Tools - Lessons Learned'],
  ['guideswhentocompressvsconvertanimage', 'When to Compress vs Convert an Image', 'Compress vs Convert an Image'],
];

let updated = 0;
let skipped = 0;
let mismatches = 0;
for (const [slug, expected, replacement] of trims) {
  if (replacement.length > 46) {
    console.error(`!! REPLACEMENT TOO LONG for ${slug}: ${replacement.length}c`);
    mismatches++;
    continue;
  }
  const file = path.join(CMS, `BODYTITLE${slug}.txt`);
  if (!fs.existsSync(file)) {
    console.error(`!! MISSING ${file}`);
    mismatches++;
    continue;
  }
  const current = fs.readFileSync(file, 'utf8');
  if (current === replacement) { skipped++; continue; }
  // Don't sanity-check `current === expected` — actual on-disk wording can vary slightly.
  fs.writeFileSync(file, replacement);
  console.log(`${slug}: ${current.length}c -> ${replacement.length}c (rendered ${replacement.length+19}c)`);
  updated++;
}
console.log(`Updated: ${updated}; Skipped (already matches): ${skipped}; Mismatches: ${mismatches}`);
