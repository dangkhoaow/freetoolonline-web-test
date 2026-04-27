// One-shot scaffold for cycle 8 — writes 25 guides' metadata + JSP wrapper files.
// BODYHTML.html files are NOT written here (authored separately).
import fs from 'node:fs';
import path from 'node:path';

const REPO = path.resolve(import.meta.dirname, '..');
const CMS = path.join(REPO, 'source/static/src/main/webapp/resources/view/CMS');
const JSP = path.join(REPO, 'source/web/src/main/webapp/WEB-INF/jsp/guide');

const slugify = (s) => s.replace(/[-/]/g, '');

// title <= 46 c so rendered <= 65 c
// desc 70-160 c
const guides = [
  // ZIP cluster (7)
  { id: 'N3',  slug: 'how-to-make-a-zip-file-smaller', title: 'How to Make a Zip File Smaller', desc: 'Make a zip smaller without losing files: pick the right compression level, drop pre-compressed media first, split if it must clear an email size cap.', kw: 'how to make a zip file smaller, reduce zip size, compress zip, smaller zip, zip compression level', tags: 'guide,zip,compress' },
  { id: 'N5',  slug: 'how-to-compress-zip-file-to-smaller-size', title: 'How to Compress a Zip to a Smaller Size', desc: 'Compress an existing zip again, the right way: when re-zipping helps, when it does nothing, and the in-browser tool to use without uploading the archive.', kw: 'how to compress zip file to smaller size, compress zip again, smaller zip', tags: 'guide,zip,compress' },
  { id: 'N6',  slug: 'online-zip-vs-7z-vs-rar-which-to-pick', title: 'Online Zip vs 7z vs Rar - Which to Pick', desc: 'Pick the right archive format online: zip for compatibility, 7z for best compression, rar when you must open one. Decision matrix and browser-tool routing.', kw: 'zip vs 7z vs rar, compress rar file online, archive format comparison, online zip vs 7z', tags: 'guide,zip,compress' },
  { id: 'N7',  slug: 'how-to-zip-multiple-files-into-one', title: 'How to Zip Multiple Files Into One', desc: 'Zip several files into a single archive in your browser: select, name the output, choose a compression level, and download. No upload or install required.', kw: 'how to zip multiple files into one, make zip file online, online zip file maker, create zip file online', tags: 'guide,zip,compress' },
  { id: 'N8',  slug: 'how-to-zip-folder-online-step-by-step', title: 'How to Zip a Folder Online, Step by Step', desc: 'Zip a folder online in five steps: pick the folder, keep the structure, set compression, name the output, download. Browser-only, with the traps to avoid.', kw: 'how to zip folder online, zip folder online, how to compress folder to zip, online folder zipper', tags: 'guide,zip,compress' },
  { id: 'N9',  slug: 'zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained', title: 'Zip vs Zipx vs Rar vs 7z, Explained', desc: 'Four archive formats compared: which Windows opens by default, which compresses smallest, and which is worth a separate app. Plain-language guide.', kw: 'zip vs zipx vs rar vs 7z, archive formats explained, zipx vs zip, rar vs 7z', tags: 'guide,zip,compress' },
  { id: 'N10', slug: 'recover-corrupt-zip-file-options', title: 'Recover a Corrupt Zip File - Options', desc: 'Practical paths for a zip that will not open: re-download, partial extract, repair tools, and when to give up. What works, what does not, what to try first.', kw: 'corrupt zip file, zip file repair, zip file is corrupted, fix zip file, recover zip', tags: 'guide,zip' },
  // HEIC / image-conversion (4)
  { id: 'N12', slug: 'iphone-photo-format-explained-heic-jpg-png-raw', title: 'iPhone Photo Format Explained', desc: 'iPhone photos can be HEIC, JPG, PNG, or RAW. Here is what each format is, when iOS uses it, and the right one to convert to before sharing outside Apple.', kw: 'iphone photo format, heic vs jpg vs png, iphone raw, heic explained, iphone image format', tags: 'guide,image-conversion,heic,jpg' },
  { id: 'N13', slug: 'how-to-convert-iphone-photo-to-jpg', title: 'How to Convert an iPhone Photo to JPG', desc: 'Convert an iPhone photo from HEIC to JPG without iCloud, an installed app, or a desktop. Browser walkthrough that handles single photos and batches alike.', kw: 'how to convert iphone photo to jpg, heic to jpg iphone, iphone photo to jpg, convert iphone heic', tags: 'guide,image-conversion,heic,jpg' },
  { id: 'N14', slug: 'jpg-vs-jpeg-are-they-the-same', title: 'JPG vs JPEG - Are They the Same?', desc: 'JPG and JPEG are the same image format. The two extensions exist because of an old Windows three-letter limit. Here is the story and which name to prefer.', kw: 'jpg vs jpeg, are jpg and jpeg the same, jpeg vs jpg difference, jpg jpeg', tags: 'guide,image-conversion,jpg' },
  { id: 'N15', slug: 'svg-to-png-when-to-rasterize-an-svg', title: 'SVG to PNG - When to Rasterize', desc: 'Most SVGs should stay vector. The exceptions: legacy software that does not parse SVG, social-share previews, email clients. When and how to rasterize cleanly.', kw: 'svg to png, when to rasterize svg, png to svg, vector vs raster, svg conversion', tags: 'guide,image-conversion,png,svg' },
  // Device-test (3)
  { id: 'N17', slug: 'how-to-check-camera-quality-on-your-phone', title: 'How to Check Camera Quality on Your Phone', desc: 'A two-minute browser test for phone camera quality: resolution, focus, low-light, dust on the lens. What good looks like, and hardware vs software.', kw: 'how to check camera quality on phone, phone camera test, camera quality test, mobile camera check', tags: 'guide,device-test' },
  { id: 'N18', slug: 'microphone-test-online-what-it-actually-checks', title: 'Microphone Test Online - What It Checks', desc: 'A browser microphone test confirms the mic is selected, captures sound, and matches your expected volume. What it cannot check, and where to go for more.', kw: 'microphone test online, mic check online, online mic test, microphone diagnostic', tags: 'guide,device-test,utility' },
  { id: 'N19', slug: 'keyboard-tester-online-rollover-vs-anti-ghosting', title: 'Keyboard Tester - Rollover vs Anti-Ghost', desc: 'N-key rollover and anti-ghosting are different keyboard features. A browser keyboard test surfaces both. What to press, what to look for, what the result means.', kw: 'keyboard tester online, keyboard test, n-key rollover, nkro, anti-ghosting, keyboard rollover', tags: 'guide,device-test' },
  // Developer (5)
  { id: 'N20', slug: 'why-md5-cannot-be-decrypted', title: 'Why MD5 Cannot Be Decrypted', desc: 'MD5 is a one-way hash, not encryption, so there is no decrypt key. What "md5 decrypt" tools actually do, why MD5 is unsafe for passwords, and what to use.', kw: 'md5 decrypt, why md5 cannot be decrypted, md5 hash, md5 decode, md5 reverse, md5 vs encryption', tags: 'guide,developer,md5,hash' },
  { id: 'N21', slug: 'text-diff-vs-line-diff-vs-word-diff-vs-git-diff', title: 'Text vs Line vs Word vs Git Diff', desc: 'Four kinds of diff answer different questions. Text diff for any pair, line diff for code, word diff for prose, git diff for tracked changes. Each explained.', kw: 'text diff vs line diff, online diff tool, word diff, git diff, diff comparison', tags: 'guide,developer' },
  { id: 'N22', slug: 'json-vs-yaml-vs-toml-config-formats-explained', title: 'JSON vs YAML vs TOML, Explained', desc: 'Three config formats, three ergonomics. JSON for machines, YAML for humans, TOML for shallow config. The trade-offs that decide what your project needs.', kw: 'json vs yaml vs toml, config formats, yaml vs json, toml vs yaml, config file format', tags: 'guide,developer,json' },
  { id: 'N23', slug: 'css-minifier-vs-uglifier-vs-tree-shaking', title: 'CSS Minifier vs Uglifier vs Tree-Shaking', desc: 'Three size-reduction tactics for one goal. Minifier strips whitespace, uglifier renames symbols, tree-shaking drops unused rules. When each pays off.', kw: 'css minifier vs uglifier, tree shaking css, css minify uglify, minifier vs uglifier difference', tags: 'guide,developer,css,minifier,pagespeed' },
  { id: 'N24', slug: 'base64-when-to-use-and-when-not-to', title: 'Base64 - When to Use and When Not To', desc: 'Base64 makes binary data text-safe at a 33 percent size cost. Right for inline data URLs and small icons; wrong for assets over a few kilobytes. Decision rules.', kw: 'base64, when to use base64, base64 to image, image to base64, data url, base64 size', tags: 'guide,developer' },
  // Image-editing / video (4)
  { id: 'N25', slug: 'how-to-split-a-gif-into-frames-for-editing', title: 'How to Split a GIF Into Frames', desc: 'Pull individual frames out of an animated GIF for editing, archiving, or social posts. Browser walkthrough that keeps the original timing data per frame.', kw: 'how to split a gif into frames, gif to frames, gif frame extractor, split gif into frames', tags: 'guide,gif,image-conversion,split,image-editing,video' },
  { id: 'N26', slug: 'how-to-crop-and-rotate-an-image', title: 'How to Crop and Rotate an Image', desc: 'Crop and rotate an image in the browser without losing the original. Pixel-precise crop, lossless 90-degree rotation, and where the EXIF rotation flag matters.', kw: 'how to crop and rotate an image, crop and rotate image, online image crop, image rotate online', tags: 'guide,image-editing' },
  { id: 'N27', slug: 'photo-editor-vs-graphics-app-vs-batch-processor', title: 'Photo Editor vs Graphics App vs Batch', desc: 'Three image-tool categories solve three different problems. Photo editor for one image, graphics app for design, batch processor for many files at once.', kw: 'photo editor vs graphics app, batch image processor, image editor types, photo editing tools', tags: 'guide,image-editing' },
  { id: 'N28', slug: 'mp4-vs-mov-vs-mkv-which-container-when', title: 'MP4 vs MOV vs MKV - Which Container When', desc: 'Three video containers compared. MP4 for everywhere, MOV for the Apple pipeline, MKV for archival with multiple tracks. Clean rules for picking and converting.', kw: 'mp4 vs mov vs mkv, video container comparison, mov to mp4, mkv vs mp4, mp4 container', tags: 'guide,video,mp4' },
  // Cross-cluster (2)
  { id: 'N29', slug: 'free-online-tools-that-work-without-uploading-files', title: 'Free Online Tools - No Upload Required', desc: 'How browser-based tools convert, compress, and edit files without ever uploading them. The technical reason it works, the limits, and the privacy you get free.', kw: 'free online tools, free online tools no upload, online tools that work without uploading, browser-based tools', tags: 'guide,utility' },
  { id: 'N30', slug: 'qr-code-generator-best-practices', title: 'QR Code Generator - Best Practices', desc: 'A QR code that always scans is a small set of choices: error correction, contrast, size, payload. Defaults that work, ones that fail in the field.', kw: 'qr code generator, qr code best practices, qr code error correction, qr code size, scannable qr', tags: 'guide,utility' },
];

const JSP_TPL = `<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<freetoolonline:page browserTitle='\${pageBodyTitle}' description='\${pageBodyDesc}'>
\t<freetoolonline:loading/>
\t<!-- BODYHTML -->
\t\${pageBodyHTML}
</freetoolonline:page>`;

let written = 0;
let lengthErrors = 0;
for (const g of guides) {
  const cmsSlug = slugify(`guides${g.slug}`);
  const title = g.title;
  const desc = g.desc;
  const kw = g.kw;
  const jspName = `${g.slug}.jsp`;

  // length validation
  if (title.length > 46) { console.error(`!! title too long for ${g.id}: ${title.length}c`); lengthErrors++; }
  if (desc.length < 70 || desc.length > 160) { console.error(`!! desc out of band for ${g.id}: ${desc.length}c`); lengthErrors++; }

  const titleFile = path.join(CMS, `BODYTITLE${cmsSlug}.txt`);
  const descFile = path.join(CMS, `BODYDESC${cmsSlug}.txt`);
  const kwFile = path.join(CMS, `BODYKW${cmsSlug}.txt`);

  // overwrite metadata so updates land
  fs.writeFileSync(titleFile, title); written++;
  fs.writeFileSync(descFile, desc); written++;
  if (!fs.existsSync(kwFile)) { fs.writeFileSync(kwFile, kw); written++; }

  const jspFile = path.join(JSP, jspName);
  if (!fs.existsSync(jspFile)) { fs.writeFileSync(jspFile, JSP_TPL); written++; }

  console.log(`${g.id} ${g.slug}: title=${title.length}c desc=${desc.length}c`);
}
console.log(`Files written: ${written}; length errors: ${lengthErrors}`);

// Emit a JSON manifest so subsequent edits to site-data, seo-clusters, related-tools, sitemap can use it.
const manifestFile = path.join(REPO, 'scripts/_cycle8_manifest.json');
fs.writeFileSync(manifestFile, JSON.stringify({ guides: guides.map(g => ({
  id: g.id, slug: g.slug, route: `/guides/${g.slug}.html`,
  cmsSlug: slugify(`guides${g.slug}`),
  title: g.title, desc: g.desc, kw: g.kw, tags: g.tags
})) }, null, 2));
console.log(`Manifest: ${manifestFile}`);
