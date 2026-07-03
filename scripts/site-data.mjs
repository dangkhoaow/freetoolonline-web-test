import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { resolveHubBacklink, getSeoClusterGroups } from './seo-clusters.mjs';

export const DEFAULT_SITE_ORIGIN = 'https://freetoolonline.com';
export const DEFAULT_API_ORIGIN = 'https://service.freetool.online/';
export const DEFAULT_SHORTEN_DOMAIN = 'https://freetoolonline.com';
export const DEFAULT_APP_VERSION = new Date().toISOString().slice(0, 10).replaceAll('-', '');
export const DEFAULT_IO_VERSION = '1';
export const DEFAULT_ALTER_UPLOADER_DELAY_MS = '100';
export const DEFAULT_UNSPLASH_KEY = '';
export const DEFAULT_RANDOM_STRING = '';
export const DEFAULT_BGS_COLLECTION = '[]';
export const DEFAULT_IO_INFOS = '[]';

export const INFO_ROUTES = new Set([
  '/',
  '/about-us.html',
  '/contact-us.html',
  '/privacy-policy.html',
  '/tags.html',
  // Phase 11 Cycle 5 P11.4.1 - author bio / editorial team (E-E-A-T surface).
  '/editorial-team.html',
  // Phase 11 Cycle 6 P11.4.8 - HTML sitemap UX / trust / crawl-insurance page.
  // Title uses suffix pattern ("Site Map - ... | Free Tool Online") to avoid
  // brand-query cannibalization at decayed pos 7.25. No JSON-LD deliberately.
  '/sitemap.html',
  // Guides - plan §3.3. Treated as informational (no related-tools, no rating,
  // no HowTo; Article JSON-LD emitted separately by page-renderer.mjs).
  '/guides/en/heic-vs-jpg-vs-webp.html',
  '/guides/en/dead-pixel-testing-guide.html',
  '/guides/en/unix-timestamps-explained.html',
  '/guides/en/pdf-password-types-owner-vs-user.html',
  // §3.5 comparison guides (Cycle 4).
  '/guides/en/png-vs-svg-when-to-use.html',
  '/guides/en/css-minifier-vs-compressor.html',
  // Cycle 74 P74.B - "JSON parser online: validate vs format vs tree view - which feature do you need?" Lane-D disambiguation guide for the
  // /json-parser.html sub-feature triad. Cluster: developer. Non-cannibalizing - no existing guide on this disambiguation; complements the cycle-74
  // jsonparser BODYHTML thin-content fix.
  '/guides/en/json-parser-validate-vs-format-vs-tree-view.html',
  // Cycle 75 P75.B - "Milliseconds to date - UTC vs local time, and why your conversion might look off by hours" Lane-D timezone-interpretation guide
  // for /convert-time-in-millisecond-to-date.html. Cluster: developer. Non-cannibalizing - existing long-number-millisecond-or-second covers ms-vs-s
  // disambiguation, unix-timestamps-explained covers epoch fundamentals; this guide covers the timezone-display angle (UTC vs local).
  '/guides/en/milliseconds-to-date-utc-vs-local-time.html',
  // Cycle 76 P76.A - "Screen test online vs app: which is more accurate, and when each one wins" Lane-D guide for the device-test cluster.
  // Companion to lcd-test-vs-display-test-which-do-you-need (cycle 42) and lcd-test-what-it-checks. Non-cannibalizing - covers the
  // browser-vs-app diagnostic surface comparison, not panel-vs-display-vs-monitor scope. Sourced from sibling tool-guideslcdtestvsdisplaytestwhichdoyouneed
  // framing-menu lines extended with browser/native abstraction-layer claims (W3C CSSOM color-model, browser fullscreen API).
  '/guides/en/screen-test-online-vs-app-which-is-more-accurate.html',
  // Cycle 77 P77.A - "How to compress a ZIP file to a specific size (2 MB / 25 MB / 100 KB)" Lane-D append-only guide for the file-compressor / ZIP intent gap.
  // GSC evidence (28d): "compress zip file to 25mb" 2,932 imp pos 4.9; "compress zip file to 2mb" 1,365 imp pos 4.3; "compress zip file to 100kb" 787 imp pos 4.7.
  // Forward-links to /zip-file.html, /compress-image.html. Does NOT modify any indexed ZIP-cluster page (ZIP-CRITICAL-CARE not gated).
  // Non-cannibalizing vs how-to-make-a-zip-file-smaller (cycle ?) and how-to-compress-zip-file-to-smaller-size; covers the "specific target cap (2/25/100)" sub-intent.
  '/guides/en/how-to-compress-a-zip-file-to-a-specific-size.html',
  // Cycle 20260519-10 create_new_guide_page - "how to compress a zip file" bare-query step-by-step guide.
  // GSC evidence (28d): "how to compress a zip file" 557 imp / 8 clicks / pos 8.8 / CTR 1.43% / opportunity_score 62.38.
  // Distinct intent from the "to a specific size" / "to smaller size" / "to 100kb" siblings: this captures the bare-query
  // reader who just wants the 3-step recipe. Implementing tool: /zip-file.html. Append-only (new URL).
  '/guides/en/how-to-compress-a-zip-file.html',
  // Cycle 20260519-11 create_new_guide_page - "zip folder online free" bare-query step-by-step guide.
  // GSC evidence (28d): "zip folder online free" 488 imp / 16 clicks / pos 7.81 / CTR 3.28% / opportunity_score 60.41.
  // Implementing tool: /zip-file.html. Cluster: zip. Append-only (new URL).
  '/guides/en/zip-folder-online-free.html',
  // Cycle 20260629-2 create_new_guide_page - "resize image online free" bare-query step-by-step guide.
  // Implementing tool: /resize-image.html (client-side in-browser resizer). Cluster: image-editing. Append-only (new URL).
  // EN-first ship; non-EN locales drain over future cycles, so the guide is held back from prod until all locales complete.
  '/guides/en/resize-image-online-free.html',
  // Cycle 20260629-3 create_new_guide_page - PT locale variant of "resize image online free" (locale-drain).
  '/guides/pt/resize-image-online-free.html',
  // Cycle 20260630-8 create_new_guide_page - PT locale variant of "crop image online free" (locale-drain; EN canonical at bare /guides/crop-image-online-free.html).
  '/guides/pt/crop-image-online-free.html',
  // Cycle 20260524-10 create_new_guide_page - "i love zip" bare-query landing (GSC 182 imp / 2 clicks / pos 6.12 / opportunity_score 29.41).
  // Implementing tool: /zip-file.html. Cluster: zip. BODYTITLE is reader-task framed (not brand-mimicking).
  '/guides/en/i-love-zip.html',
  // Cycle 78 P78.A - "QR code error correction and scan failures: why your QR will not scan" Lane-D append-only guide.
  // Companion to /qr-code-generator.html (one of the 4 R7_thin_content fixes in P78.B). Reader-task gap: no QR-related guide existed
  // pre-cycle-78. Diagnoses the four common scan-failure causes (payload size, error-correction level, contrast, print scale) so a
  // reader who generated a QR with our tool and got a non-scannable result can self-diagnose without leaving the site. Append-only
  // (new URL); non-cannibalizing (no other QR guide on /guides/).
  '/guides/en/qr-code-error-correction-and-scan-failures.html',
  // Cycle 79 P79.B - "Image to Base64: embed in HTML/CSS vs link the image file" Lane-D append-only guide.
  // Companion to /image-to-base64.html and /base64-to-image.html (both client-only). Reader-task gap: existing
  // /guides/base64-when-to-use-and-when-not-to.html covers the broader theory; this guide is the practical
  // decision rule (concrete byte thresholds, HTTP/2 break-even, 30-second sanity check) for the developer who
  // already knows what base64 is. Append-only (new URL); non-cannibalizing.
  '/guides/en/image-to-base64-embed-in-html-vs-link.html',
  // Cycle 80 P80.G - "How to test a touchscreen for bad spots" Lane-D append-only guide (device-test cluster).
  // Reader-task gap: existing /lcd-test.html and 8+ lcd-test cluster guides cover the visual / pixel half of a
  // screen check (color cycle, dead-pixel-vs-stuck taxonomy, warranty threshold, return-monitor evidence,
  // online-vs-app accuracy, screen-vs-camera routing); none cover the *touch* half (digitizer dead spots,
  // edge-only failures, vertical-stripe digitizer faults, ghost touches). Bing-only "test my screen" 3,170 imp +
  // "screen tester" 2,849 imp + "screen checker" 2,592 imp cohort lands on /lcd-test.html and bounces because
  // that tool only runs the color cycle. Append-only (new URL); non-cannibalizing.
  '/guides/en/how-to-test-a-touchscreen-for-bad-spots.html',
  // Cycle 81 P81.A - "Webcam mirror vs flip explained" Lane-D append-only guide (camera-test sub-cluster).
  // Reader-task gap: 99 existing guide files contain zero matches for "mirror" / "flip" / "scaleX". Bing
  // "camera test" 100,484 imp / 0.20% CTR / pos 8.4 cohort lands on /camera-test.html, sees a horizontally-
  // mirrored preview (live <video> with transform: scaleX(-1)), and bounces interpreting the mirror as a
  // broken tool. The guide explains preview-mirror is by design vs saved-file usually un-mirrored, gives a
  // 30-second proof procedure, and provides exact disable-mirror steps for OBS / Zoom / Meet / Teams.
  // Append-only (new URL); non-cannibalizing (distinct intent from camera-test-shows-black-screen,
  // camera-test-vs-webcam-test, before-a-video-call, how-to-check-camera-quality-on-your-phone).
  '/guides/en/camera-mirror-vs-flip-explained.html',
  // Cycle 82 P82.A - "CSS Unminifier vs Prettier: when to use each" Lane-D append-only guide
  // (developer / CSS sub-cluster, companion to /css-unminifier.html). Reader-task gap: 99 existing
  // guides cover the forward direction (minifier vs compressor / vs uglifier vs tree-shaking, Cloud
  // Run cold-start) but no guide explains when /css-unminifier.html is the right tool vs Prettier.
  // Append-only (new URL); non-cannibalizing.
  '/guides/en/css-unminifier-vs-prettier-when-to-use-each.html',
  // Cycle 83 P83.A - "LED test vs LCD test: which applies to your screen?" Lane-D append-only
  // guide (device-test / lcd-test sub-cluster, companion to /lcd-test.html). Reader-task gap:
  // GSC `gsc_keyword_opportunities_28d` "led test" 669 imp pos 8.9 + "led tester online" 154
  // imp pos 5.0 + "lcd checker" 356 imp pos 6.8 + "lcd check" 865 imp pos 6.7 land on
  // /lcd-test.html with no on-page explanation that LED-vs-LCD is the same hardware. Existing
  // sibling guides cover panel-vs-display scope (lcd-test-vs-display-test-which-do-you-need),
  // generic synonyms (screen-display-test-synonyms), and laptop checklist (screen-test-for-
  // laptop-5-minute-checklist) but none explain the backlight-vs-panel distinction that
  // generates the LED-test query stream. Append-only (new URL); non-cannibalizing.
  '/guides/en/led-test-vs-lcd-test-which-applies-to-your-screen.html',
  // Cycle 233 P233.E - "OLED test vs LCD test: what changes on an OLED panel" Lane-D append-only guide
  // (device-test / lcd-test sub-cluster, companion to /lcd-test.html and sibling to
  // led-test-vs-lcd-test-which-applies-to-your-screen). Reader-task gap: existing 8 device-test
  // guides cover LCD-as-panel, LED-as-backlight, dead-pixel sweep, display-vs-screen synonyms,
  // and laptop checklist - but none make OLED the primary axis. Bing 28d shows "oled test" 702 imp
  // / 1.28% CTR with no dedicated guide; per-cluster mention in led-test-vs-lcd-test guide treats
  // OLED only as a footnote ("backlight bleed cannot occur"). New URL captures the burn-in /
  // image-retention reader task that LCD-centric guides cannot answer. Append-only (new URL);
  // non-cannibalising vs led-test-vs-lcd-test (different panel technology), vs dead-pixel-testing-
  // guide (OLED burn-in is a distinct defect class), vs lcd-test-vs-display-test (display ≠ OLED).
  // Multi-cycle task: phase 1 (this commit) ships the skeleton (route + JSP wrapper + CMS placeholders +
  // related-tools entry); phase 2 (next cycle) authors CMS content from the SKILL.md framing menu;
  // phase 3 adds structured data; phase 4 adds sibling backlinks; phase 5 promotes to prod.
  '/guides/en/oled-test-vs-lcd-test-what-changes-on-oled.html',
  // Cycle 84 P84.A - "How to compress a JPG for email attachment size limits" Lane-D append-only
  // guide (image-conversion / compression sub-cluster, companion to /compress-image.html).
  // Reader-task gap: existing sibling guides cover folder-mode (how-to-compress-a-folder-for-
  // email), the quality-vs-size axis (compress-jpeg-without-losing-quality-quality-vs-size),
  // the level picker (how-to-choose-a-compression-level), the over-compression diagnosis
  // (how-to-tell-if-a-jpg-was-compressed-too-much), and the format-choice question (when-to-
  // compress-vs-convert-an-image). NONE cover JPG-specific email-attachment caps as the
  // primary axis. GSC top-30 28d shows compressor demand dominated by ZIP / folder head terms
  // (compress folder 1581 clicks @ pos 2.07; compress zip file 986 @ 6.39); JPG-mode email
  // demand is a verifiable gap. Append-only (new URL); non-cannibalizing.
  '/guides/en/how-to-compress-a-jpg-for-email-attachment-limits.html',
  // Cycle 85 P85.A - "Microphone test levels: what quiet, normal, and peak mean" Lane-D append-only
  // guide (device-test / microphone-test sub-cluster, companion to /microphone-test.html).
  // Reader-task gap: existing sibling guides cover what the test verifies (microphone-test-online-
  // what-it-actually-checks) and the flat-meter troubleshooting case (microphone-test-no-sound-
  // four-fixes). NONE explain how to interpret the meter when it IS moving (call-ready level vs
  // too quiet vs clipping). Phase-1 datasource: bing_query_stats + gsc_low_ctr_high_imp_28d.
  // Append-only (new URL); non-cannibalizing per seo-agency-check anti-cannibalization gate.
  '/guides/en/microphone-test-online-quiet-normal-peak-meter.html',
  // Cycle 86 P86.A - "Camera Test Permission Blocked: How to Allow Camera Access in Your Browser"
  // Lane-D append-only guide (device-test / camera-test sub-cluster, companion to /camera-test.html).
  // Reader-task gap: existing sibling camera-test guides cover hardware-failure black screen
  // (camera-test-shows-black-screen-four-fixes), mirror/flip preview (camera-mirror-vs-flip-explained),
  // and the "before an interview" sequencing checklist (how-to-check-webcam-and-microphone-before-an-
  // interview), but NONE walk a reader through "the page looks empty - did the browser block me?"
  // permission-state diagnosis + per-browser allow path. GSC `gsc_keyword_opportunities_28d` shows
  // /camera-test.html sustaining low CTR / high impression on long-tail "camera test not working" /
  // "allow camera in browser" / "camera permission denied" demand; Bing query_stats reinforces.
  // Append-only (new URL); non-cannibalizing per seo-agency-check anti-cannibalization gate.
  '/guides/en/camera-test-permission-blocked-how-to-allow-it.html',
  // Cycle 46 (20260522-7) P46.H - "Camera Check" synonym-disambiguation guide.
  // GSC "camera check" 451 imp / 5 clicks / pos 11.85 28d (op_score 37.63). Routes the
  // reader to /camera-test.html (the implementing tool) while explaining the synonym
  // mapping ("camera check" = "camera test") and the three end-states (allowed /
  // blocked / ignored). Append-only; non-cannibalising vs camera-test-permission-blocked
  // (covers synonym intent, not permission diagnosis) and vs camera-test-shows-black-
  // screen-four-fixes (covers terminology, not hardware failure).
  '/guides/en/camera-check.html',
  // Cycle 87 P87.A - "Microphone test permission blocked: how to allow mic access in your browser" Lane-D guide
  // (device-test / microphone-test sub-cluster, companion to /microphone-test.html, symmetric peer to cycle-86's
  // /guides/camera-test-permission-blocked-how-to-allow-it.html). Reader-task gap: existing microphone-test guides
  // cover the four-cause walkthrough (microphone-test-no-sound-four-fixes), the level-meter semantics
  // (microphone-test-online-quiet-normal-peak-meter cycle-85), and the test-coverage explainer
  // (microphone-test-online-what-it-actually-checks), but NONE drill into "the browser blocked me - per-browser
  // allow path". GSC long-tail "microphone permission denied" / "allow microphone in browser" / "mic blocked safari"
  // demand carries impression float without a single-intent landing page; Bing query_stats reinforces.
  // Append-only (new URL); non-cannibalising per seo-agency-check anti-cannibalization gate.
  '/guides/en/microphone-test-permission-blocked-how-to-allow-it.html',
  // Cycle 88 P88.A - "QR Code Content Types: URL vs vCard vs Wi-Fi vs Text - Which to Pick" Lane-D guide
  // (utility / qr-code-generator sub-cluster, companion to /qr-code-generator.html). Reader-task gap:
  // existing /qr-code-generator.html guides cover MECHANICAL concerns (qr-code-error-correction-and-scan-failures
  // covers EC level / contrast / payload density / scan-failure diagnosis; qr-code-generator-best-practices covers
  // the five reliability settings: error-correction level, contrast, physical size, quiet zone, payload length).
  // NEITHER answers the most-common pre-decision question for first-time users: "what kind of payload do I put
  // inside the QR code?" — the URL vs vCard vs Wi-Fi vs plain-text fork. Sources: ISO/IEC 18004:2015 (QR Code
  // spec), ZXing project wiki (canonical open-source reference; defines the de-facto WIFI: URI scheme), RFC 6350
  // vCard 4.0, RFC 2426 vCard 3.0, RFC 5545 iCalendar VEVENT. Append-only (new URL); non-cannibalising per
  // seo-agency-check anti-cannibalization gate.
  '/guides/en/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html',
  // Cycle 90 P90.A - "EXIF Metadata and Image Compression: What Gets Stripped" Lane-D guide
  // (image-conversion / compress-image sub-cluster, companion to /compress-image.html). Reader-task gap:
  // existing /compress-image.html guides cover quality vs file size (how-to-choose-a-compression-level),
  // over-compression diagnosis (how-to-tell-if-a-jpg-was-compressed-too-much), the basic compress workflow
  // (how-to-compress-a-file-online), and compress-vs-convert (when-to-compress-vs-convert-an-image). NONE
  // cover EXIF metadata behaviour during image compression (the privacy + archival pre-decision question).
  // Sources: JEITA CP-3451C Exif 2.3, Adobe TIFF 6.0, ITU-T T.81 / ISO/IEC 10918-1 (JPEG marker structure
  // APP0..APP15), ICC.1:2010-12 (ICC profile in APP2), libjpeg-turbo + mozjpeg + cjpeg encoder docs,
  // Pillow + Sharp + libvips + ImageMagick + exiftool docs. Append-only (new URL); non-cannibalising per
  // seo-agency-check anti-cannibalization gate.
  '/guides/en/image-compression-and-exif-metadata-what-gets-stripped.html',
  // Phase 8 Cycle 3 §3.4 greenfield guides - 4 pillar + 2 comparison + 6 how-to + 1 case-study.
  '/guides/en/mp4-vs-webm-for-web.html',
  '/guides/en/jpg-vs-png-for-web.html',
  '/guides/en/md5-vs-sha256-when-to-hash.html',
  '/guides/en/csv-vs-json-data-formats.html',
  '/guides/en/pdf-vs-heic-for-document-archival.html',
  '/guides/en/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html',
  '/guides/en/how-to-convert-100-heic-photos-to-jpg.html',
  '/guides/en/how-to-test-for-dead-pixels-before-returning-a-monitor.html',
  '/guides/en/how-to-sign-pdf-after-removing-a-password.html',
  '/guides/en/how-to-extract-frames-from-a-gif-for-a-social-post.html',
  '/guides/en/how-to-check-webcam-and-microphone-before-an-interview.html',
  '/guides/en/how-to-minify-css-js-for-cloud-run-cold-start.html',
  '/guides/en/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html',
  // Phase 10 Cycle 4 P10.3.4 - cluster-disambiguation guide (compress vs convert
  // intent router; upper-funnel capture for "file compressor" / "image compressor" queries).
  '/guides/en/when-to-compress-vs-convert-an-image.html',
  // Phase 11 Cycle 4 P11.3.3 - how-to guide targeting the 9,737-impression
  // `how to compress a folder` keyword opportunity (0.14% CTR / pos 6.10).
  // Upper-funnel routing to the frozen ZIP cluster without modifying any
  // zip satellite.
  '/guides/en/how-to-compress-a-folder-for-email.html',
  // Phase 11 Cycle 5 P11.2.1 - device-test-checklist guide (Phase 10 P10.3.5
  // carryover; upper-funnel routing for device-test cluster).
  '/guides/en/device-test-checklist-for-remote-work.html',
  // Phase 11 Cycle 5 P11.3.5 - PDF cluster disambiguation ladder (routes
  // users across 12 PDF tools by intent).
  '/guides/en/pdf-editing-ladder.html',
  // Phase 13 Cycle 2.1 P13.2.1 - file-compressor head-query recovery
  // (252,050 monthly impressions @ 0.04% CTR, pos 9.94 - leak target).
  // Routes upper-funnel "file compressor" intent into the right tool by file
  // type without modifying any ZIP satellite.
  '/guides/en/file-compressor-vs-zip-what-to-pick.html',
  // Phase 13 Cycle 2.2 P13.2.2 - HEIC vs JPG converter decision guide.
  // Pairs with /heic-to-jpg.html (Cycle 1 verb-first recovery) to absorb
  // top-of-funnel "convert HEIC?" intent into a destination-quality page.
  '/guides/en/heic-vs-jpg-converter-when-each-wins.html',
  // Phase 16 Cycle A P16.N1 - "file compressor" head-query (259,581 impr /
  // 0.04% CTR / pos 9.9). Greenfield explainer + routing guide. Touches
  // no existing tool / hub / guide URL; ZIP-CRITICAL-CARE compliant.
  '/guides/en/what-is-a-file-compressor-and-which-to-use.html',
  // Cycle 121 P121.G - "file compressor" HEAD-query aggregator landing
  // (248,591 impr / 0.04% CTR / pos 9.94 / 12,332 missed clicks per 28d).
  // Operator override carry from cycle120 P120.G. Distinct from the
  // four long-tail /guides/file-compressor-* pages: this URL targets
  // the exact-match HEAD query as canonical landing; the long-tail
  // pages keep their existing intents. Append-only.
  '/guides/en/file-compressor.html',
  // Cycle 122 P122.A - "test lcd" + "lcd tester" + "lcd test online"
  // HEAD-query disambiguation aggregator (combined ~7,773 impr / 28d
  // at pos 5-8). Routes the "which tool to pick" intent to /lcd-test.html
  // action tool while the existing 8 /guides/lcd-* / /guides/dead-pixel-*
  // / /guides/screen-* pages keep their long-tail intents. Append-only.
  '/guides/en/test-lcd.html',
  // Cycle 20260518-30 P30.E - "lcd checker" / "lcd check" / "monitor checker" /
  // "screen checker" Lane-D create_new_guide_page. Sibling to /guides/test-lcd.html
  // and /guides/led-test.html. Covers the "checker" / "check" wording family
  // (verification framing) vs the "tester" / "test" wording family (active
  // verb framing). Both routes point at the same in-browser tool /lcd-test.html.
  // Append-only, kebab-case, does not shadow /lcd-test.html (smashed form
  // "lcdchecker" differs from existing slugs).
  '/guides/en/lcd-checker.html',
  // Phase 16 Cycle A P16.N2 - "how to compress a file" + variants
  // (~10K impr / 0.02% CTR / pos 10.5). Greenfield how-to guide.
  '/guides/en/how-to-compress-a-file-online.html',
  // Phase 16 Cycle A P16.N4 - "how to reduce zip file size" cluster
  // (~2.2K impr / 10-16% CTR / pos 4). Greenfield how-to guide.
  '/guides/en/how-to-reduce-zip-file-size-online.html',
  // Cycle 20260515-14 - kebab-form sibling for the same query (the
  // existing -online suffix variant covers users who type "online";
  // this bare-form covers users who omit it). 723 imp / 5.39 pos /
  // 7.5% CTR per GSC 28d.
  '/guides/en/how-to-reduce-zip-file-size.html',
  // Cycle 20260520-9 create_new_guide_page - exact-match "reduce zip
  // file size online" landing (GSC 397 imp / 54 clicks / pos 5.01 /
  // CTR 13.6% / opportunity_score 68.46). Implementing tool /zip-file.html.
  // Append-only; non-cannibalizing vs how-to-reduce-zip-file-size-online
  // (this guide is the bare-noun phrase, the existing one is the how-to
  // framing for the same intent family).
  '/guides/en/reduce-zip-file-size-online.html',
  // Phase 16 Cycle B P16.N11 - "convert heic to jpg" head query
  // (5,500+ impr / <2% CTR / pos 11-24). Pure step-by-step how-to;
  // pairs with existing heic-vs-jpg-vs-webp (which covers the WHEN).
  '/guides/en/how-to-convert-heic-to-jpg-step-by-step.html',
  // Phase 16 Cycle B P16.N16 - "lcd test" head query (28K aggregate
  // impr / 1.10% CTR / pos 6.1). Explainer + when-to-run + boundary.
  '/guides/en/what-an-lcd-test-does-and-when-to-run-one.html',
  // Cycle 20260517-6 create_new_guide_page - "ms to date" synonym-coverage guide.
  // Implementing tool: /convert-time-in-millisecond-to-date.html.
  '/guides/en/ms-to-date.html',
  // Phase 16 cycle 8 N-series - 25 new long-form guides. INFO_ROUTES
  // membership disables ads + rating widget (matching the rest of the
  // /guides/* cluster); see page-renderer.mjs showAds gate.
  '/guides/en/how-to-make-a-zip-file-smaller.html',
  '/guides/en/how-to-compress-zip-file-to-smaller-size.html',
  // Cycle 20260517-9 create_new_guide_page - exact-match "compress zip file to smaller size" landing.
  '/guides/en/compress-zip-file-to-smaller-size.html',
  '/guides/en/compress-zip-file-to-100kb.html',
  // Cycle 20260521-12 P29.A create_new_guide_page - "compress zip file to 2mb" enterprise-SMTP-cap-specific landing. Operator-approved via card cycle29-create_new_guide_page-compresszipfileto2mb-cannibalisation-1779338089590 (option a). 2 MB is the historical Exchange / SMTP-relay / legacy-webmail attachment cap; distinct angle from the 100kb sibling. Implementing tool /zip-file.html.
  '/guides/en/compress-zip-file-to-2mb.html',
  // Cycle 20260517-10 create_new_guide_page - exact-match "zip size reducer" landing (GSC 605 imp / 56 clicks / pos 5.67 / CTR 9.26%; opportunity_score 96.84).
  '/guides/en/zip-size-reducer.html',
  // Cycle 20260519-12 create_new_guide_page - exact-match "zip file size compressor" landing (GSC 354 imp / 44 clicks / pos 5.43 / CTR 12.43%; opportunity_score 57.07). Implementing tool /zip-file.html. Append-only; non-cannibalizing vs /guides/how-to-make-a-zip-file-smaller.html, /guides/zip-size-reducer.html, /guides/compress-zip-file-to-smaller-size.html (each targets a distinct head-tail intent).
  '/guides/en/zip-file-size-compressor.html',
  // Cycle 20260519-15 create_new_guide_page — "resize zip file" routing/disambiguation Lane-D guide (GSC 406 imp / 19 clicks / pos 6.83 / CTR 4.68%; opportunity_score 56.6). Distinguishing role: addresses the three-way wording ambiguity (shrink vs split vs shrink-photo-inputs-first), routes to the existing shrink / split / image-resize guides — not a 10th compress-zip duplicate.
  '/guides/en/resize-zip-file.html',
  // Cycle 20260520-16 create_new_guide_page — Indonesian-language guide "kompres file zip" (GSC 338 imp / 13 clicks / pos 6.36 / CTR 3.85%; opportunity_score 51.12). Implementing tool /zip-file.html. Companion sibling to /guides/comprimir-zip-online.html (Spanish) and /guides/compactar-pasta.html (Portuguese).
  '/guides/en/kompres-file-zip.html',
  // Cycle 20260523-5 P52.I create_new_guide_page — Indonesian-language size-question guide "kompres zip" (GSC 248 imp / 18 clicks / pos 7.42 / CTR 7.26%; opportunity_score 30.98). Implementing tool /zip-file.html. SIZE-focused sibling to /guides/kompres-file-zip.html (broader Indonesian bundle/privacy guide).
  '/guides/en/kompres-zip.html',
  '/guides/en/online-zip-vs-7z-vs-rar-which-to-pick.html',
  '/guides/en/how-to-zip-multiple-files-into-one.html',
  '/guides/en/how-to-zip-folder-online-step-by-step.html',
  '/guides/en/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html',
  '/guides/en/recover-corrupt-zip-file-options.html',
  '/guides/en/iphone-photo-format-explained-heic-jpg-png-raw.html',
  '/guides/en/how-to-convert-iphone-photo-to-jpg.html',
  '/guides/en/jpg-vs-jpeg-are-they-the-same.html',
  '/guides/en/svg-to-png-when-to-rasterize-an-svg.html',
  '/guides/en/how-to-check-camera-quality-on-your-phone.html',
  '/guides/en/microphone-test-online-what-it-actually-checks.html',
  '/guides/en/keyboard-tester-online-rollover-vs-anti-ghosting.html',
  '/guides/en/why-md5-cannot-be-decrypted.html',
  // Cycle 20260518-24 P24.E — "md5 decode" reader-vocabulary routing guide (distinguishing role).
  '/guides/en/md5-decode.html',
  // Cycle 20260518-28 — "md5 decrypt online" wording routing guide. Same one-way truth as md5-decode but framed
  // around the "decrypt" search wording (more specific; carries the password-recovery sub-intent). Distinct from
  // /guides/why-md5-cannot-be-decrypted.html (cryptographic walkthrough) and /guides/md5-decode.html (broader
  // wording routing). Outbound link to /md5-converter.html.
  '/guides/en/md5-decrypt-online.html',
  // Cycle 20260520-17 — "md5 hash decrypt" dictionary-attack-feasibility guide.
  '/guides/en/md5-hash-decrypt.html',
  // Cycle 20260523 P50.H create_new_guide_page — "md5 password" reader-intent
  // guide. Frames the hashing intent (one-way MD5 of a password string) and
  // routes the password-recovery cohort to the MD5-alternatives guide. Honors
  // cycle 30/35/40/43/44 decrypt-md5 cannibalisation guard: NOT titled or
  // framed as "decrypt md5 password". Outbound link to /md5-converter.html.
  '/guides/en/md5-password.html',
  // cycle 20260609-2 Phase 3 — "md5 decrypter" reader-intent guide. Distinct angle from the 9 existing MD5
  // guides: frames what "MD5 decrypter" actually means (cache lookup, not reversal), covers hash vs SHA-256
  // comparison table, HowTo generate + lookup steps, and explains when MD5 is the wrong tool. Implementing tool:
  // /md5-converter.html. Honors anti-claim: NEVER "decrypt MD5" / "crack MD5" - framed as cache lookup.
  '/guides/en/md5-decrypter.html',
  '/guides/en/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html',
  '/guides/en/json-vs-yaml-vs-toml-config-formats-explained.html',
  '/guides/en/css-minifier-vs-uglifier-vs-tree-shaking.html',
  '/guides/en/base64-when-to-use-and-when-not-to.html',
  '/guides/en/how-to-split-a-gif-into-frames-for-editing.html',
  '/guides/en/how-to-crop-and-rotate-an-image.html',
  '/guides/en/photo-editor-vs-graphics-app-vs-batch-processor.html',
  '/guides/en/mp4-vs-mov-vs-mkv-which-container-when.html',
  '/guides/en/free-online-tools-that-work-without-uploading-files.html',
  '/guides/en/qr-code-generator-best-practices.html',
  // Workstream B sample batch - added 2026-04-30 per SITE_ENHANCEMENT_PLAN.md.
  // Two proof-of-pattern guides for cycle-18 batch-1 ship-loop.
  '/guides/en/how-to-compress-a-folder.html',
  '/guides/en/lcd-test-what-it-checks.html',
  // Cycle 20260514-6-followup URL-convention cleanup: /guides/lcdtest.html
  // moved to ALIAS_ROUTES → /guides/lcd-test-online.html. CMS fragments
  // renamed guideslcdtest → guideslcdtestonline. Comment kept for git-blame
  // forensic recall on cycles 20260513-19+ that originally shipped the
  // non-kebab slug; the URL still 200s via the alias redirect.
  // Cycle 20260514-6-followup URL-convention cleanup: /guides/foldertozipconverter.html
  // moved to ALIAS_ROUTES → /zip-tools/zip-file.html (the working tool that
  // does folder-to-zip compression). CMS fragments deleted; the alias
  // auto-renders a redirect page.
  // Cycle 19 P19.4 - synonym disambiguation guide for "screen test" /
  // "display test" / "monitor test" Bing-only impression gap (KI-19.3:
  // Bing serves 100,484 imp on `camera test` and 51,081 on `screen test`
  // while GSC silent). Routes intent to /lcd-test.html or /camera-test.html
  // without modifying either tool page; anti-cannibalisation cleared by
  // seo-agency-check (no overlap with /guides/lcd-test-what-it-checks.html
  // which explains WHAT the test checks; this guide answers WHICH name = WHICH tool).
  '/guides/en/screen-display-test-synonyms.html',
  // Cycle 27 P27.C - Lane-D mandatory guide page for the Bing keyboard-test
  // cohort (`keyboard test online` 7.7k + `online keyboard test` 6.2k +
  // `test keyboard` 3.4k Bing-only impressions). Routes mid-funnel
  // step-by-step intent to /keyboard-test.html without overlapping the
  // existing /guides/keyboard-tester-online-rollover-vs-anti-ghosting.html
  // (which is the WHAT-IS guide; this is the HOW-TO guide).
  '/guides/en/how-to-test-a-keyboard-online-step-by-step.html',
  // Cycle 28 P28.A - Lane-D mandatory guide page for the GA4 sustained
  // decay on /extract-gif-to-image-frames.html (cycle-21 P21.1 → cycle-27
  // P27.E research carry, executed cycle 28). PNG-vs-JPG format-decision
  // angle — narrowly distinct from the existing how-to-split-a-gif and
  // social-post guides (which both already cover step-by-step intent).
  // Captures pre-decision searchers comparing output formats; helps the
  // tool's GA4 decay by routing format-shopping queries to a dedicated
  // landing page that links INTO the tool's settings panel. Append-only
  // on every existing surface. Cluster: image-editing.
  '/guides/en/extract-gif-frames-png-vs-jpg-which-format.html',
  // Cycle 29 P29.B - Lane-D mandatory guide page on the orthogonal
  // "frames vs frame rate (FPS)" question for the same /extract-gif-to-
  // image-frames.html tool (cycle-29 PA-mode contract: ≥ 1 new guide
  // each cycle when Lane A admits < 3 ship rows). Cycle-28 P28.A guide
  // answered "PNG vs JPG output format"; this cycle answers "frames vs
  // frame rate" — narrowly distinct from every existing extract-gif
  // guide. Captures the head-term cohort searching "gif to frames"
  // (1,643 imp / 28d / 0.30% CTR / pos 8.24) by routing the explanatory
  // sub-cohort to a dedicated landing page that satellite-links back to
  // the tool. Append-only on every existing surface. Cluster: image-editing.
  '/guides/en/gif-frames-extract-vs-frame-rate-fps-explained.html',
  // Cycle 30 P30.A - Lane-D mandatory guide page on the orthogonal
  // "what to use INSTEAD of MD5" decision. Distinct from the existing
  // /guides/why-md5-cannot-be-decrypted.html (which answers the why)
  // and /guides/md5-vs-sha256-when-to-hash.html (narrow MD5-vs-SHA256
  // only). Captures the residual cohort searching "md5 alternatives",
  // "what to use instead of md5", "bcrypt vs argon2id", "argon2id
  // vs bcrypt" - all currently landing on /md5-converter.html at
  // GSC pos 9-11 with sub-2.5% CTR. Append-only on every existing
  // surface. Cluster: guide,developer.
  '/guides/en/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html',
  // Cycle 31 P31.A - "camera test shows black screen" diagnostic-flow
  // guide. Targets Bing "camera test" head query (100k+ impressions @
  // pos 8.4 / 198 clicks) by addressing the failure-mode reader task
  // ("preview is a black rectangle") no existing guide covers.
  // Lane-D PA-mode mandatory; device-test cluster.
  '/guides/en/camera-test-shows-black-screen-four-fixes.html',
  // Cycle 34 P34.A - microphone-test "no sound / flat waveform"
  // diagnostic-flow guide. Targets Bing "microphone test" /
  // "test microphone" / "microphone test online free" cluster
  // (~1500 impressions @ pos 9 / 0.13% CTR) by addressing the
  // failure-mode reader task ("test runs but the meter is flat")
  // no existing guide covers. Closes the last device-test cluster
  // gap (camera/screen/keyboard already have troubleshooting guides).
  // Lane-D PA-mode mandatory; device-test cluster.
  '/guides/en/microphone-test-no-sound-four-fixes.html',
  // Cycle 35 P35.A - keyboard-test "keys not detected / some keys
  // don't highlight" diagnostic-flow guide. Targets Bing
  // "keyboard test" / "online keyboard test" / "keyboard tester" /
  // "test keyboard" cluster (~20,238 impressions @ pos 8-9 / 0.08%
  // CTR per bing_query_stats.json 99 query rows) by addressing the
  // failure-mode reader task ("I pressed keys but nothing highlights")
  // no existing guide covers. Closes the LAST remaining device-test
  // cluster gap (camera + microphone already shipped 31/34; LCD has
  // dead-pixel-testing-guide). Lane-D PA-mode mandatory.
  '/guides/en/keyboard-test-keys-not-detected-four-fixes.html',
  // Cycle 37 P37.A - "compress JPEG without losing quality - quality
  // vs size" decision-table guide. Targets the residual /compress-image.html
  // intent gap (GSC "compress jpeg online free" 156 imp at pos 9.59 /
  // 0.6% CTR per gsc_page_queries__compress_image_html_28d.json) and
  // the GA4 -28.8% page-view decay on /compress-image.html (28d). Pure
  // educational guide on the quality-vs-size tradeoff (50/75/85/95)
  // mapped to the four common reader tasks (web, archival, social,
  // email) plus AI auto-mode. Append-only satellite backlink on
  // /compress-image.html. Cluster: image-editing. Lane-D PA-mode
  // mandatory; non-ZIP, non-destructive.
  '/guides/en/compress-jpeg-without-losing-quality-quality-vs-size.html',
  // Cycle 38 P38.A - "is this long number a timestamp?" diagnostic-flow
  // guide for the GSC `milliseconds to date` (1,662 imp / pos 6.6) +
  // `millis to date` (1,378 imp / pos 6.7) cluster (~3,040 imp / 28d
  // at <= 0.4% CTR per gsc_keyword_opportunities_28d.json) and the
  // long-tail Bing demand on `currentmillis` / `current milliseconds`
  // / `convert milliseconds to date`. Reader task: bottom-up "I have
  // a number, what is it?" (10/13/16/19-digit rule of thumb +
  // not-a-timestamp disambiguation incl. Snowflake/UUIDv7/sequence
  // IDs). Complements existing /guides/unix-timestamps-explained.html
  // (top-down format reference). Cluster: developer-utility. Lane-D
  // PA-mode mandatory; non-ZIP, non-destructive; NO satellite
  // backlinks on /convert-time-in-millisecond-to-date.html (cycle 30
  // monitor active until 2026-05-10).
  '/guides/en/long-number-millisecond-or-second.html',
  // Cycle 39 P39.A - "compressed JPG looks blurry, why?" reactive
  // diagnostic-flow guide complementing the cycle-37 PROACTIVE quality
  // guide. Three named causes (too-low quality, repeated re-encodes,
  // upscaled source) + 30-second side-by-side test + FAQ. Targets the
  // long-tail GSC `compress jpg blurry` / `jpg compression quality
  // lost` / `why jpg pixelated after compression` queries (~600-1k
  // imp / 28d at < 0.5% CTR per gsc_low_ctr_high_imp_28d.json) plus
  // bing_query_stats long-tail. Outbound link only to /compress-image.html
  // (operator-held tool URL); NO satellite backlink (cycles 37/38
  // monitors open until 2026-05-10). Cluster: image-editing.
  // Lane-D PA-mode mandatory; non-ZIP, non-destructive.
  '/guides/en/compressed-jpg-looks-blurry-three-causes.html',
  // Cycle 40 P40.A - "online ffmpeg conversion stalled, why?" reactive
  // diagnostic-flow guide complementing the cycle-12 PROACTIVE
  // online-vs-local decision guide. Three named causes (browser memory
  // cap on WASM ffmpeg, backgrounded-tab worker suspension, codec the
  // WASM build does not include) + 30-second small-file bisection +
  // FAQ. Targets the long-tail GSC `ffmpeg online stalled` / `ffmpeg
  // online stuck` / `ffmpeg online not working` / `ffmpeg online
  // memory error` reactive-bounce queries that aggregate behind the
  // GSC head term `ffmpeg online` (1,787 imp / 28d / 5.1% CTR / pos
  // 6.5 per gsc_keyword_opportunities_28d.json) plus bing_query_stats
  // `ffmpeg online` long-tail. Outbound link only to /ffmpeg-online.html
  // (action tool, last edited cycle 14b 2026-04-25, NOT in any active
  // Day-monitor window) and the proactive companion guide; NO satellite
  // backlinks (cycles 30/31/32/34/35/37/38/39 monitors open until
  // 2026-05-10/2026-05-11). Cluster: video / image-conversion.
  // Lane-D PA-mode mandatory; non-ZIP, non-destructive.
  '/guides/en/ffmpeg-online-conversion-stalled-three-fixes.html',
  // Cycle 41 P41.A - "GIF frame extractor output looks wrong, why?" reactive
  // diagnostic-flow guide. Lane-D pivot because all 7 cycle-41 decision rows
  // are blocked (cycles 30/31/32/34/35/37/38/39/40 active monitors + ZIP-
  // CRITICAL-CARE + operator-held + research-only). The GIF-frame-extractor
  // reactive bounce-back cluster is the largest under-covered long-tail
  // (gif to frames 1600/0.31% + gif frame extractor 847/0.83% + split gif
  // into frames 832/1.80% = ~3.3 K imp / 28d at < 1 % avg CTR per
  // gsc_low_ctr_high_imp_28d.json) plus ga4_content_decay_28d.json
  // /extract-gif-to-image-frames.html 26.3% decay. Outbound link only to
  // /extract-gif-to-image-frames.html (action tool, operator-held under
  // cycle32-extractgif-g11-firstfold-sitewide-jsp - inbound link only,
  // no satellite backlink) and the four proactive companion guides; NO
  // satellite backlinks anywhere this cycle. Cluster: image-conversion /
  // animation. Lane-D PA-mode mandatory; non-ZIP, non-destructive.
  '/guides/en/gif-frame-extractor-output-looks-wrong-three-causes.html',
  // Cycle 20260514-9 create_new_guide_page - "gif frame extractor" head-term
  // Lane-D guide (1,022 imp / 28d, pos 7.77, CTR 1.08%; opportunity score 130).
  // Implementing tool: /extract-gif-to-image-frames.html. Single-cycle complete
  // ship per cycle 20260514-5 contract.
  '/guides/en/gif-frame-extractor.html',
  // Cycle 20260610-12 P12.D create_new_guide_page - "gif to frames converter" head-term
  // (triangulated demand: "gif to frames" query cluster). Implementing tool:
  // /extract-gif-to-image-frames.html. Cluster: utility. Locale-complete (5 variants).
  '/guides/en/gif-to-frames-converter.html',
  // Cycle 20260610-14 create_new_guide_page - "gif to frame" head-term
  // (GSC 238 imp / 1 click / pos 7.96 / opp 29.77). Implementing tool:
  // /extract-gif-to-image-frames.html. Cluster: image-conversion. Locale-complete (5 variants).
  '/guides/en/gif-to-frame.html',
  // Cycle 42 P42.A - "LCD test vs display test vs monitor test - which?"
  // reactive disambiguation-flow guide. Lane-D pivot because all 6 cycle-42
  // decision rows touch active-monitor or auto-status tool URLs (/lcd-test.html
  // tool-skill claim_catalogue_status: auto, /heic-to-jpg.html granted research-
  // only, /compress-image.html in cycle 37 monitor, /zip-file.html ZIP-CRITICAL-
  // CARE blocked). The LCD/display/monitor disambiguation cluster is the
  // largest under-covered long-tail (lcd test 28399 + test lcd 5689 + lcd
  // tester 2237 + lcd check 893 + lcdtest 857 + lcd tes 663 = ~38 K imp /
  // 28d at < 1.5 % avg CTR per gsc_low_ctr_high_imp_28d.json) and AdSense
  // /lcd-test.html under-monetised at $0.32/28d (RPM 1.92). Outbound link
  // only to /lcd-test.html (action tool, in cycle-35 monitor - inbound
  // link only, no satellite backlink) and four existing companion guides;
  // NO satellite backlinks anywhere this cycle. Cluster: device-test.
  // Lane-D PA-mode mandatory; non-ZIP, non-destructive.
  '/guides/en/lcd-test-vs-display-test-which-do-you-need.html',
  // Cycle 43 P43.B - "camera test vs webcam test vs camera quality - which?"
  // reactive disambiguation-flow guide. Lane-D pivot because all 6 cycle-43
  // decision rows touch active-monitor or auto-status tool URLs (/lcd-test.html
  // cycle-35 monitor, /heic-to-jpg.html research-only, /compress-image.html
  // option-B carry, /zip-file.html ZIP-CRITICAL-CARE, /camera-test.html cycle
  // 31 monitor - inbound link only). Captures the camera-test demand cluster
  // (camera test 701 imp / 0.14% CTR / pos 21.87 head term + mobile camera
  // test / phone camera test / back camera test / iphone camera test online
  // tail per gsc_page_queries__camera_test_html_28d.json + Bing tail). Outbound
  // link only to /camera-test.html (action tool, in cycle 31 monitor) and
  // three existing companion guides (camera-test-shows-black-screen-four-fixes,
  // how-to-check-camera-quality-on-your-phone, how-to-check-webcam-and-microphone-
  // before-an-interview, device-test-checklist-for-remote-work) plus cycle-42
  // P42.A LCD-test guide cross-link. NO satellite backlinks anywhere this cycle.
  // Cluster: device-test. Lane-D PA-mode mandatory; non-ZIP, non-destructive.
  '/guides/en/camera-test-vs-webcam-test-which-do-you-need.html',
  // Cycle 20260610-13 - LCD test for laptop screens (device-test)
  '/guides/en/lcd-test-laptop.html',
  // Cycle 73 P73.B - "Screen test vs camera test - which one do you actually need?" cross-cluster
  // disambiguation guide for the ambiguous "test my device" head query. Distinct from cycle-42
  // (within-screen-cluster: lcd vs display vs monitor) and cycle-43 (within-camera-cluster:
  // camera vs webcam) - this one disambiguates ACROSS the two action tools. Sourced from
  // DEC.20260505-18.001/003/004 + opportunity-scout OPP.20260505-18.02/04. Lane-D PA-mode
  // (DASHBOARD-PA contract); cluster: device-test; non-ZIP, non-destructive.
  '/guides/en/screen-test-vs-camera-test-pick-the-right-tool.html',
  // Cycle 44 P44.A - "MD5 to text - why you cannot convert it back, and what to
  // do instead" disambiguation/decision guide for the `md5 to text` (1,385 imp /
  // 28d / pos 3.5 / 20.07% CTR) + `md5 decrypt` (3,158 imp / pos 9.2) demand
  // cohort. Distinct framing from existing /guides/why-md5-cannot-be-decrypted.html
  // (cycle 30 — answers WHY) and /guides/md5-alternatives-bcrypt-argon2id-sha256-
  // when-each-fits.html (cycle 30 — answers WHAT-INSTEAD). This guide answers
  // WHAT-DO-I-DO operationally for a user who typed "md5 to text" expecting
  // a converter: verify forward, rainbow-table look-up (with caveats), or pick
  // the right hash for the real job. Outbound link only to /md5-converter.html
  // (the action tool, satellite source) and three companion developer-cluster
  // guides; one append-only `<p><a>` satellite backlink at file-tail of
  // BODYWELCOMEmd5converter.html. Cluster: guide,developer. Lane-D PA-mode
  // mandatory; non-ZIP, non-destructive.
  '/guides/en/md5-to-text-why-you-cannot-convert-back.html',
  // Cycle 46 P46.B - pre-call checklist guide. Reader question: "I have 5 minutes
  // before a video call - which checks do I run on the screen, the webcam, and
  // the microphone?" Bridges the cycle-42 lcd-test-vs-display-test guide and the
  // cycle-43 camera-test-vs-webcam-test guide as a procedural HOW-DO-I-RUN-THESE
  // sequence (different reader job: which-tools-to-run, not which-tool-is-which).
  // Outbound links: /lcd-test.html, /camera-test.html, /microphone-test.html,
  // /keyboard-test.html, plus three companion device-test guides. Cluster:
  // guide,device-test. Lane-D PA-mode mandatory; non-ZIP, non-destructive.
  '/guides/en/before-a-video-call-which-tools-to-run.html',
  // Cycle 48 P48.A - laptop-specific screen-test 5-minute checklist guide.
  // Targets Bing 'screen test for laptop' (5,222 imp / 1.13% CTR) + 'cek lcd
  // laptop online' (6,639 imp / 2.27% CTR) cluster, both under-served by the
  // existing desktop-monitor-framed lcd-test guides. Five reader-task checks
  // not covered elsewhere: dead pixels, brightness battery-vs-AC, IPS lid
  // tilt color shift, glossy-vs-matte glare in actual room, HiDPI scaling
  // readability. Outbound links: /lcd-test.html (tool), /camera-test.html,
  // /microphone-test.html, plus companion device-test guides. Cluster:
  // guide,device-test,lcd-test. Lane-D PA-mode mandatory; non-ZIP,
  // non-destructive; append-only on every existing surface.
  '/guides/en/screen-test-for-laptop-5-minute-checklist.html',
  // Cycle 49 P49.A - "FFmpeg Online vs Video Converter - which tool to open"
  // routing guide. Targets the GSC "ffmpeg online" 1,843 imp / 94 clicks /
  // pos 6.5 / op_score 270.97 row plus the "convert mov to mp4" / "video
  // converter online" routing-decision intent. Five rules: defaults vs
  // non-default flags vs GIF output vs troubleshooting vs local-FFmpeg.
  // Routes intent across three already-verified tool skills (ffmpegonline,
  // videoconverter, gifmaker) without editing any of them; complements (not
  // duplicates) the cycle-40 ffmpeg-stalled guide and the existing
  // ffmpeg-vs-local-ffmpeg guide. Cluster: guide,video,ffmpeg. Lane-D PA-
  // mode mandatory; non-ZIP, non-destructive; append-only on every existing
  // surface.
  '/guides/en/ffmpeg-online-vs-video-converter-which-to-pick.html',
  // Cycle 50 P50.A - "ImageMagick Online vs Task-Specific Tools - which to
  // pick" routing guide. Image-editing-cluster parallel to cycle 49 P49.A
  // (FFmpeg-vs-Video-Converter routing). Targets the GA4 /imagemagick-
  // online.html 114-sessions / 0.51-engagement cohort plus the GSC
  // "imagemagick online" / "convert image online imagemagick" routing
  // intent. Five rules: task-specific defaults vs non-default flags vs
  // chained operations vs huge/sensitive files vs troubleshooting. Routes
  // intent across tool-imagemagickonline (framing menu hand-verified
  // 2026-05-03 cycle 11 Workstream D) plus already-verified task-specific
  // tool skills (cropimage, resizeimage, compressimage, heictojpg,
  // svgtopng) without editing any of them. Cluster: guide,image-editing,
  // imagemagick. Lane-D PA-mode mandatory; non-ZIP, non-destructive;
  // append-only on every existing surface.
  '/guides/en/imagemagick-online-vs-task-specific-tools-which-to-pick.html',
  // Cycle 51 P51.A - "File Compressor Online: ZIP a Folder vs Compress an
  // Image" routing guide. Disambiguates the GSC "file compressor" SERP
  // intent (258,156 imp / 0.04% CTR / pos 9.9 / 12,797 missed clicks 28d
  // per gsc_low_ctr_high_imp_28d.json on run 20260504-9). The guide does
  // NOT compete for the head term itself - the indexed pages already rank
  // there - but captures the routing-intent variants ("file compressor
  // online", "online file compressor", "free file compressor" combined
  // ~4,000 imp / 28d) where neither indexed page ranks top-3. Routes
  // intent across tool-zipfile (Hand-verified inline 2026-05-03 cycle 11
  // Workstream D) + tool-compressimage (verified cycle 45 P45.B) +
  // tool-unzipfile (verified cycle 11 WD) + tool-removezippassword
  // (verified cycle 11 WD) without editing any of them. Cluster:
  // guide,zip,image-editing. Lane-D PA-mode mandatory; non-ZIP-rewrite
  // (only links to ZIP cluster URLs - ZIP-CRITICAL-CARE preserved).
  '/guides/en/file-compressor-online-when-to-zip-vs-when-to-compress-image.html',
  // Cycle 53 P53.A - "How to Extract a File Online - ZIP, RAR, 7z" routing
  // guide. The reverse-direction inverse of cycle-51's file-compressor
  // guide. Recovers the GSC "extract file online" query (-9.3 pos in 7d:
  // 7.9 -> 17.2 per gsc_ranking_drops_7d_v_prior.json) and the "file
  // zipper" sibling (-8.9 pos in 7d) - neither is owned by an existing
  // guide on this site. Routes the reader by file extension: .zip ->
  // /unzip-file.html (server-upload, optional password); .rar / .7z ->
  // local OS tool (the site has no server-side .rar / .7z extractor and
  // the guide says so honestly); forgotten-password ZIP ->
  // /remove-zip-password.html. Outbound links: /unzip-file.html (action
  // tool) + /remove-zip-password.html + /zip-tools.html + four companion
  // ZIP-cluster guides. Cluster: guide,zip. Lane-D PA-mode mandatory; not
  // ZIP-rewrite (only links to ZIP cluster URLs - ZIP-CRITICAL-CARE
  // preserved).
  '/guides/en/how-to-extract-a-file-online-zip-rar-7z.html',
  // Cycle 54 P54.A - "How to choose a compression level - quality vs file
  // size, with examples" guide. Captures the long-tail "compress image to
  // 100kb / 200kb / 500kb / target file size" intent + "what compression
  // level should I use" decision question that the head term "file
  // compressor" (257,359 imp / 0% CTR / pos 9.9 per
  // gsc_low_ctr_high_imp_28d.json on run 20260504-14) surfaces in
  // long-tail. Anchors level 50 / 70 / 85 / 100 with concrete output-size
  // ranges + visible-quality descriptions; routes the reader to
  // /compress-image.html (verified) for the action tool, /resize-image.html
  // for the pixel-dimension fallback, and to format-choice guides
  // (jpg-vs-png-for-web, heic-vs-jpg-vs-webp) when the format is wrong.
  // Lane-D PA-mode mandatory; non-ZIP, non-destructive; append-only on every
  // existing surface (only the new guide page is created).
  '/guides/en/how-to-choose-a-compression-level.html',
  // Cycle 55 P55.A - "ZIP password types - strong vs weak, explained" guide.
  // Trust-gate education for the highest-traffic ZIP-cluster URL
  // (/remove-zip-password.html: 8 849 28d pageviews / 79.2% engagement /
  // $1.43 RPM per ga4_page_perf__remove_zip_password_html_28d.json +
  // ads_top_url_channels_28d.json on run 20260504-17). Explains the three
  // recoverability cases (legacy ZIP 2.0 + short password = recoverable;
  // AES-256 + strong password = not recoverable; AES-256 + weak password =
  // possibly recoverable, slower). Gives readers a 30-second decision
  // before they upload a 200 MB file to a tool that may not help. Every
  // factual claim in the guide BODYHTML traces to ZIP 2.0 / WinZip AES-256 /
  // 7-Zip public docs cited in the SKILL.md ## Citations block. Lane-D
  // PA-mode mandatory; non-ZIP-cluster URL (/guides/* sits OUTSIDE the
  // ZIP-CRITICAL-CARE cluster); append-only on every existing surface.
  '/guides/en/zip-password-types-strong-vs-weak-explained.html',
  // Cycle 56 P56.A - "PDF preflight online: what it actually checks" guide.
  // Lane-D fresh-capture against the search-vocabulary gap upstream of
  // /preflight-pdf.html. Bing query_stats (run 20260504-20) shows persistent
  // rolling impressions across 2025 for "pdf preflight" / "online pdf
  // validator" / "pdf flatten online" / "check pdf" / "preflight pdf"
  // with /preflight-pdf.html ranking pos 3-20. PDF cluster has only 4
  // existing guides vs 13+ PDF tools — clearest cluster gap on the site.
  // Explains what preflight actually means (a check step, not a fix step),
  // what /preflight-pdf.html validates (PDF/A archival conformance), and
  // what it does NOT validate (PDF/X print preflight, signature legal-
  // validity, corrupt-PDF repair, PDF/UA accessibility tagging). Routes
  // readers to the right tool when "preflight" is not the right word for
  // their actual question. Every factual claim in BODYHTML traces to
  // PDF/A ISO 19005 / PDF/X ISO 15930 / Adobe Acrobat preflight docs cited
  // in the SKILL.md ## Citations block. Lane-D PA-mode mandatory; non-ZIP
  // cluster; append-only on every existing surface.
  '/guides/en/pdf-preflight-online-what-it-actually-checks.html',
  // Cycle 58 P58.A - "Read and compare MD5 hashes correctly: case,
  // whitespace, hex format" guide. Lane-D PA-mode mandatory; guide,
  // developer, md5 cluster (non-ZIP). Bridges the post-conversion
  // verification gap downstream of /md5-converter.html (11,599 imp /
  // 953 clicks / 8.22% CTR / pos 6.7 28d): readers generate a hash,
  // then need to compare it to a published expected value. Distinct
  // from the 4 existing MD5 guides (md5-vs-sha256, why-md5-cannot-be-
  // decrypted, md5-alternatives, md5-to-text). Every BODYHTML claim
  // traces to public RFC 1321 / NIST FIPS 180-4 spec + the
  // tool-md5converter SKILL.md framing-menu D1 line. Append-only on
  // every existing surface.
  '/guides/en/read-and-compare-md5-hashes-correctly.html',
  // Cycle 59 P59.A - "How to tell if a JPG was compressed too much"
  // guide. Bridges /get-jpeg-compression-level.html via the verified
  // tool-getjpegcompressionlevel SKILL.md framing-menu D1 line. Every
  // BODYHTML factual claim about JPEG quality numerics traces to
  // public ITU-T T.81 (JPEG standard) + Independent JPEG Group
  // cjpeg -quality convention (q75 web default, q85 visual breakpoint,
  // q95 print baseline). Distinct from 4 existing JPG/JPEG/compression
  // guides (assess-after vs choose-before). Lane-D PA-mode mandatory;
  // image-conversion / image-editing cluster (non-ZIP); append-only on
  // every existing surface.
  '/guides/en/how-to-tell-if-a-jpg-was-compressed-too-much.html',
  // Cycle 60 P60.A - "How to flatten a PDF - and when to do it" guide.
  // Bridges /flatten-pdf.html (server-side PDF flattening tool with
  // verified tool-flattenpdf SKILL). Distinct from 6 existing PDF guides
  // (pdf-editing-ladder is ladder of edits, pdf-password-types is about
  // passwords, pdf-preflight is print-readiness, pdf-vs-heic is format
  // choice, sign-after-removing is signing flow). New angle: explains
  // the OPERATION of flattening (AcroForm, annotations, signatures,
  // OCG layers) and the WHEN-TO-USE / WHEN-NOT-TO decision.
  // Lane-D PA-mode mandatory; pdf cluster (non-ZIP); append-only on
  // every existing surface.
  '/guides/en/how-to-flatten-a-pdf-and-when-to-do-it.html',
  // Cycle 61 P61.A - "PNG to SVG - when to vectorize a raster image"
  // guide. Bridges /png-to-svg.html (server-side raster-to-vector
  // conversion via the freetoolonline AWS service). Distinct from
  // 85 existing guides (svg-to-png-when-to-rasterize-an-svg is
  // reverse direction; png-vs-svg-when-to-use is format choice;
  // jpg-vs-png-for-web is raster format choice). New angle: explains
  // the OPERATION of vectorization (auto-tracing edges between
  // similar colour regions) and the WHEN-TO-USE / WHEN-NOT-TO
  // decision (logos / line art / icons / UI screenshots work;
  // photos / gradients / fine texture / soft anti-aliased text do
  // not). Lane-D PA-mode mandatory; image-conversion cluster
  // (non-ZIP); append-only on every existing surface.
  '/guides/en/png-to-svg-when-to-vectorize-a-raster-image.html',
  // Cycle 62 P62.E - "Download link not appearing after conversion -
  // 5 fixes" diagnostic guide. Bridges multiple converter tools
  // (heictojpg, compressimage, zipfile, composepdf, etc) for the
  // generic post-conversion no-download-link reader pain point.
  // Distinct from 86 existing guides (only ffmpeg-online-conversion-
  // stalled-three-fixes covers a stall pattern, and that one is for
  // the upload-side bottleneck, not the result-link visibility).
  // Lane-D PA-mode mandatory; troubleshooting cluster (non-ZIP);
  // append-only on every existing surface.
  '/guides/en/download-link-not-appearing-after-conversion-five-fixes.html',
  // Cycle 64 P64.A - "Why HEIC won't open on Windows - three quick
  // fixes" troubleshooting guide. Bridges /heic-to-jpg.html (top
  // revenue page) for the Windows-side codec gap that turns iPhone
  // HEIC photos into "Windows can't open this file" errors. Lane-D
  // PA-mode mandatory; image-conversion cluster (non-ZIP); append-only.
  '/guides/en/why-heic-wont-open-on-windows-three-fixes.html',
  // Cycle 70 P70.A - "Zip file converter - what it actually does"
  // disambiguation guide. Targets ~5K imp/28d at 0.5-1.8% CTR / pos 8-9.
  // Lane-D PA-mode mandatory; non-ZIP-cluster identity; append-only.
  '/guides/en/zip-file-converter-what-it-actually-does.html',
  // Cycle 20260519-1 create_new_guide_page - bare-query "zip file
  // converter" guide. Distinct intent angle from the "what it actually
  // does" sibling above: this is a quick how-to / step-by-step rather
  // than a disambiguation.  Cluster: zip entry-point.  GSC 661 imp/0.9%
  // CTR/pos 10 (28d).
  '/guides/en/zip-file-converter.html',
  // Cycle 71 P71.F - "HEIC to JPG: what the converter actually does
  // (and what it does not)" trust-anchor guide. Sourced verbatim from
  // tool-heictojpg/SKILL.md ## Implemented features + ## NOT implemented
  // (anti-claims). Bridges /heic-to-jpg.html (top revenue page +
  // baseline G15_accretion_drift HIGH on prod) at a NEW URL without
  // touching the indexed copy of /heic-to-jpg.html. Lane-D PA-mode
  // mandatory; image-conversion cluster (non-ZIP); append-only.
  '/guides/en/heic-to-jpg-claims-what-actually-works.html',
  // Cycle1 of 20260513-5 P5.A - "Zip compressor" Lane-D append-only
  // guide (zip cluster, companion to /zip-tools/zip-file.html). Phase A
  // skeleton only — JSP wrapper + INFO_ROUTES/GUIDE_ROUTES/JSP_BY_ROUTE
  // entries (no CMS content yet — phases 2-5 author content,
  // structured data, backlinks, prod-promote). Synth fan-out emitted
  // the non-kebab form /guides/zipcompressor.html; this cycle applies
  // the kebab convention established by granted approval cards
  // compresszipfile-scaffold-url-convention-1778622900000 (20260513-3)
  // and howtocompressafolder-scaffold-url-convention-1778626954066
  // (20260513-4) and ships the kebab-corrected URL.
  '/guides/en/zip-compressor.html',
  // Cycle6 of 20260513-6 — "Compress ZIP" Lane-D append-only guide
  // (zip cluster, companion to /zip-tools/zip-file.html and
  // /guides/zip-compressor.html). Phase A skeleton only — JSP wrapper +
  // INFO_ROUTES/GUIDE_ROUTES/JSP_BY_ROUTE entries. Synth fan-out emitted
  // the non-kebab form /guides/compresszip.html and a plural guides/
  // JSP subdir; this cycle applies the kebab + singular guide/ subdir
  // convention established by the prior granted cards (six cards now in
  // chain: filecompressor, lcdtest, zipfilecompressor, compresszipfile,
  // howtocompressafolder, zipcompressor; this is the seventh).
  '/guides/en/compress-zip.html',
  // Cycle 20260518-21 create_new_guide_page - "Zip password recovery online"
  // Lane-D truthful-framing guide (zip cluster, GSC "zip password recovery
  // online" 690 imp / 147 clicks / pos 6.17 / CTR 21.3% / opportunity_score
  // 87.95). Critical truthful framing: tool-removezippassword/SKILL.md N2
  // says the unlocker does NOT crack, guess, or brute-force unknown
  // passwords (BODYWELCOMEremovezippassword L19 + FAQ Q4). This guide
  // explicitly addresses the "recovery" search intent with the truthful
  // answer — there is no online ZIP cracker that defeats strong encryption;
  // recovery paths are: (1) known-password unlock via /zip-tools/remove-zip-password.html,
  // (2) re-create the archive via /zip-tools/zip-file.html when you have
  // the source files, (3) ask the sender. Append-only kebab URL.
  '/guides/en/zip-password-recovery-online.html',
  // Cycle 20260518-22 create_new_guide_page - "Zip compressor online" Lane-D
  // guide (zip cluster head-query sibling, GSC "zip compressor online"
  // 611 imp / 57 clicks / pos 6.99 / CTR 9.33% / opportunity_score 79.22).
  // Companion to /zip-tools/zip-file.html (the in-browser archive creator)
  // and /guides/zip-compressor.html (the bare-query sibling). Singular
  // kebab URL passes the URL convention regex; smashed form
  // "zipcompressoronline" does not shadow any existing primary route.
  '/guides/en/zip-compressor-online.html',
  // Cycle 20260518-23 create_new_guide_page - "Folder to zip" Lane-D guide
  // (zip cluster, GSC "folder to zip" 773 imp / 13 clicks / pos 9.73 /
  // CTR 1.68% / opportunity_score 78.12). Companion to /zip-tools/zip-file.html
  // (the in-browser archive creator). Kebab URL passes URL convention regex;
  // smashed form "foldertozip" does not shadow any existing primary route.
  '/guides/en/folder-to-zip.html',
  // Cycle 20260605-3 create_new_guide_page - "File to zip" Lane-D guide (zip
  // cluster, GSC "file to zip" 305 imp / 4 clicks / pos 10.05 / CTR 1.31% /
  // opportunity_score 29.96). Companion to /zip-file.html (server-side upload
  // creator). Paraphrases tool-zipfile/SKILL.md M1+M2+M3 + sibling cross-link
  // to /guides/folder-to-zip.html. Kebab URL passes URL convention regex;
  // smashed form "filetozip" does not shadow any existing primary route.
  '/guides/en/file-to-zip.html',
  // Cycle 20260605-4 create_new_guide_page - "Online diff tool" Lane-D guide.
  // Companion to /developer-tools/text-diff.html. Sourced from tool-developertools/SKILL.md M1+M3+M5. Kebab URL passes URL convention regex; smashed form "onlinedifftool" does not shadow any existing primary route.
  '/guides/en/online-diff-tool.html',
  // Cycle 20260605-8 create_new_guide_page - "common::md5::gethash64string" Lane-D guide
  // (developer cluster, GSC 212 imp / 0 clicks / pos 8.31 / CTR 0% / opportunity_score 25.52).
  // Companion to /md5-converter.html. Sourced from tool-md5converter/SKILL.md M1+M2. The
  // query is a framework-style method name (Yii PHP common\md5\getHash64String); the guide
  // honestly redirects the developer reader to the in-browser MD5 hash + cache-lookup tool.
  // Kebab URL passes URL convention regex; the "gethash64string" token is 15 chars but the
  // slug itself is hyphenated so the smashed-multi-word check (single-token >= 13 chars) does
  // NOT fire.
  '/guides/en/common-md5-gethash64string.html',
  // pt/es/vi/id/de locale variants (new-guide locale-completeness gate, 2026-06-05).
  '/guides/pt/common-md5-gethash64string.html', '/guides/es/common-md5-gethash64string.html', '/guides/vi/common-md5-gethash64string.html', '/guides/id/common-md5-gethash64string.html', '/guides/de/common-md5-gethash64string.html',
  // Cycle 20260518-25 create_new_guide_page - "Online Zip File" Lane-D guide
  // (zip cluster, GSC "online zip file" 573 imp / 12 clicks / pos 7.39 /
  // CTR 2.09% / opportunity_score 75.94). Companion to /zip-tools/zip-file.html.
  // Kebab URL passes URL convention regex; smashed form "onlinezipfile" does
  // not shadow any existing primary route.
  '/guides/en/online-zip-file.html',
  // Cycle 20260518-31 create_new_guide_page - "Create Zip File Online" Lane-D
  // guide (zip cluster, GSC "create zip file online" 702 imp / 8 clicks /
  // pos 10.08 / CTR 1.14% / opportunity_score 68.87). Companion to
  // /zip-tools/zip-file.html (the in-browser archive creator). Kebab URL
  // passes URL convention regex; smashed form "createzipfileonline" does not
  // shadow any existing primary route.
  '/guides/en/create-zip-file-online.html',
  // Cycle 20260518-32 create_new_guide_page - "compactar pasta" Lane-D
  // guide (zip cluster, GSC "compactar pasta" 522 imp / 21 clicks /
  // pos 7.59 / CTR 4.02% / opportunity_score 66.02). Portuguese folder
  // compression intent. Companion to /zip-tools/zip-file.html. Kebab URL
  // passes URL convention regex; smashed form "compactarpasta" does not
  // shadow any existing primary route.
  // Cycle 20260521-20 P37.H create_new_guide_page (zip cluster, Portuguese):
  // implementing tool /zip-file.html. Target query "comprimir pasta zipada"
  // (compress an already-zipped folder) — distinct from /guides/compactar-pasta.html
  // (compact a folder) and /guides/comprimir-zip-online.html (compress to ZIP).
  // GSC 398 imp / 17 clicks / pos 8.84 / CTR 4.27% / opportunity_score 43.1.
  // Tier-C (new URL, no GA4 history); Tier-A protocol N/A because this is
  // not modifying an existing high-traffic URL.
  // Cycle 20260521-22 P39.H create_new_guide_page - "zipar pasta" Lane-D guide
  // (ZIP cluster, Portuguese). Implementing tool /zip-file.html. GSC 367 imp /
  // 15 clicks / pos 8.84 / CTR 4.09% / opportunity_score 39.8. Tier-A protocol
  // N/A because this is a net-new GUIDE route, not a modification of an indexed
  // tool URL.
  // Cycle 20260522-10 P10.E create_new_guide_page - "comprimir arquivo zip"
  // Lane-D guide (zip cluster, Portuguese). Implementing tool /zip-file.html.
  // GSC 361 imp / 14 clicks / pos 9.99 / CTR 3.88% / opportunity_score 34.72.
  // Disambiguation between "create a new zip" and "shrink an existing zip"
  // (deflate already removes redundancy on first pass). Tier-A protocol N/A.
  // Cycle 20260520-11 new_guide_page_proposal (developer cluster):
  // implementing tool /js-unminifier.html. GSC 545 imp / 3 clicks /
  // pos 10.12 / CTR 0.55% / opportunity_score 53.55.
  '/guides/en/unminify-js.html',
  // Cycle 20260523-3 (cycle 50) create_new_guide_page - "crop and rotate image"
  // Lane-D guide (image-editing cluster). Implementing tool /crop-image.html.
  // GSC "crop and rotate image" 223 imp / 23 clicks / pos 6.13 / CTR 10.31% /
  // opportunity_score 32.65. Kebab slug passes URL convention regex; smashed
  // form "cropandrotateimage" does not shadow any existing primary route.
  '/guides/en/crop-and-rotate-image.html',

  // cycle 20260625-6 create_new_guide_page (locale completion, EN-first drain) - pt variant of /guides/video-converter-online-free.html (held staging-only until es/vi/id/de complete).
  '/guides/pt/video-converter-online-free.html',
  // cycle 20260626 create_new_guide_page (locale completion) - es variant of /guides/video-converter-online-free.html (staging-only until vi/id/de complete).
  '/guides/es/video-converter-online-free.html',
  // cycle 20260626-2 create_new_guide_page (locale completion) - vi variant of /guides/video-converter-online-free.html (staging-only until id/de complete).
  '/guides/vi/video-converter-online-free.html',
  // 2026-06-28 related-guides-loop: id/de locale completion for video-converter-online-free.
  '/guides/id/video-converter-online-free.html',
  '/guides/de/video-converter-online-free.html',

  // 2026-05-28 plan-warm-pascal-v2 S1 multilingual migration (locale-prefixed guide URLs).
  // plan-warm-pascal-v3 S2 batch 1 (2026-05-29) - 5 locale variants of /guides/lcd-test-online.html
  '/guides/pt/lcd-test-online.html',
  '/guides/es/lcd-test-online.html',
  '/guides/vi/lcd-test-online.html',
  '/guides/id/lcd-test-online.html',
  '/guides/de/lcd-test-online.html',
  // plan-warm-pascal-v3 S2 batch 2 (2026-05-29) - 5 locale variants of /guides/convert-milliseconds-to-date.html
  '/guides/pt/convert-milliseconds-to-date.html',
  '/guides/es/convert-milliseconds-to-date.html',
  '/guides/vi/convert-milliseconds-to-date.html',
  '/guides/id/convert-milliseconds-to-date.html',
  '/guides/de/convert-milliseconds-to-date.html',
  // plan-warm-pascal-v3 S2 batch 3 (2026-05-29) - 5 locale variants × 3 guides (lcd-screen-test + hd-video-converter-when + json-formatter-when)
  '/guides/pt/lcd-screen-test.html', '/guides/es/lcd-screen-test.html', '/guides/vi/lcd-screen-test.html', '/guides/id/lcd-screen-test.html', '/guides/de/lcd-screen-test.html',
  '/guides/pt/hd-video-converter-when.html', '/guides/es/hd-video-converter-when.html', '/guides/vi/hd-video-converter-when.html', '/guides/id/hd-video-converter-when.html', '/guides/de/hd-video-converter-when.html',
  '/guides/pt/json-formatter-when.html', '/guides/es/json-formatter-when.html', '/guides/vi/json-formatter-when.html', '/guides/id/json-formatter-when.html', '/guides/de/json-formatter-when.html',
  // plan-warm-pascal-v3 S2 batch 4 (2026-05-29) - 5 locale variants × 3 guides (zip-file-converter + online-zip-file-compressor + led-test)
  '/guides/pt/zip-file-converter.html', '/guides/es/zip-file-converter.html', '/guides/vi/zip-file-converter.html', '/guides/id/zip-file-converter.html', '/guides/de/zip-file-converter.html',
  '/guides/pt/online-zip-file-compressor.html', '/guides/es/online-zip-file-compressor.html', '/guides/vi/online-zip-file-compressor.html', '/guides/id/online-zip-file-compressor.html', '/guides/de/online-zip-file-compressor.html',
  '/guides/pt/led-test.html', '/guides/es/led-test.html', '/guides/vi/led-test.html', '/guides/id/led-test.html', '/guides/de/led-test.html',
  // plan-warm-pascal-v3 S2 batch 5 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/hd-video-converter-step-by-step.html', '/guides/es/hd-video-converter-step-by-step.html', '/guides/vi/hd-video-converter-step-by-step.html', '/guides/id/hd-video-converter-step-by-step.html', '/guides/de/hd-video-converter-step-by-step.html',
  '/guides/pt/compress-zip-file-to-smaller-size.html', '/guides/es/compress-zip-file-to-smaller-size.html', '/guides/vi/compress-zip-file-to-smaller-size.html', '/guides/id/compress-zip-file-to-smaller-size.html', '/guides/de/compress-zip-file-to-smaller-size.html',
  '/guides/pt/hd-video-converter-vs-alternatives.html', '/guides/es/hd-video-converter-vs-alternatives.html', '/guides/vi/hd-video-converter-vs-alternatives.html', '/guides/id/hd-video-converter-vs-alternatives.html', '/guides/de/hd-video-converter-vs-alternatives.html',
  // plan-warm-pascal-v3 S2 batch 6 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/compress-zip.html', '/guides/es/compress-zip.html', '/guides/vi/compress-zip.html', '/guides/id/compress-zip.html', '/guides/de/compress-zip.html',
  '/guides/pt/gif-into-frames.html', '/guides/es/gif-into-frames.html', '/guides/vi/gif-into-frames.html', '/guides/id/gif-into-frames.html', '/guides/de/gif-into-frames.html',
  '/guides/pt/reduce-zip-file-size-online.html', '/guides/es/reduce-zip-file-size-online.html', '/guides/vi/reduce-zip-file-size-online.html', '/guides/id/reduce-zip-file-size-online.html', '/guides/de/reduce-zip-file-size-online.html',
  // plan-warm-pascal-v3 S2 batch 7 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/json-formatter-step-by-step.html', '/guides/es/json-formatter-step-by-step.html', '/guides/vi/json-formatter-step-by-step.html', '/guides/id/json-formatter-step-by-step.html', '/guides/de/json-formatter-step-by-step.html',
  '/guides/pt/zip-compress.html', '/guides/es/zip-compress.html', '/guides/vi/zip-compress.html', '/guides/id/zip-compress.html', '/guides/de/zip-compress.html',
  '/guides/pt/json-formatter-vs-alternatives.html', '/guides/es/json-formatter-vs-alternatives.html', '/guides/vi/json-formatter-vs-alternatives.html', '/guides/id/json-formatter-vs-alternatives.html', '/guides/de/json-formatter-vs-alternatives.html',
  // plan-warm-pascal-v3 S2 batch 8 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/unlock-zip-file-online.html', '/guides/es/unlock-zip-file-online.html', '/guides/vi/unlock-zip-file-online.html', '/guides/id/unlock-zip-file-online.html', '/guides/de/unlock-zip-file-online.html',
  '/guides/pt/how-to-zip-multiple-files-into-one.html', '/guides/es/how-to-zip-multiple-files-into-one.html', '/guides/vi/how-to-zip-multiple-files-into-one.html', '/guides/id/how-to-zip-multiple-files-into-one.html', '/guides/de/how-to-zip-multiple-files-into-one.html',
  '/guides/pt/crop-and-rotate-image.html', '/guides/es/crop-and-rotate-image.html', '/guides/vi/crop-and-rotate-image.html', '/guides/id/crop-and-rotate-image.html', '/guides/de/crop-and-rotate-image.html',
  // plan-warm-pascal-v3 S2 batch 9 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/how-to-compress-zip-file-to-smaller-size.html', '/guides/es/how-to-compress-zip-file-to-smaller-size.html', '/guides/vi/how-to-compress-zip-file-to-smaller-size.html', '/guides/id/how-to-compress-zip-file-to-smaller-size.html', '/guides/de/how-to-compress-zip-file-to-smaller-size.html',
  '/guides/pt/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html', '/guides/es/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html', '/guides/vi/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html', '/guides/id/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html', '/guides/de/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html',
  '/guides/pt/how-to-check-camera-quality-on-your-phone.html', '/guides/es/how-to-check-camera-quality-on-your-phone.html', '/guides/vi/how-to-check-camera-quality-on-your-phone.html', '/guides/id/how-to-check-camera-quality-on-your-phone.html', '/guides/de/how-to-check-camera-quality-on-your-phone.html',
  // plan-warm-pascal-v3 S2 batch 10 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/online-zip-vs-7z-vs-rar-which-to-pick.html', '/guides/es/online-zip-vs-7z-vs-rar-which-to-pick.html', '/guides/vi/online-zip-vs-7z-vs-rar-which-to-pick.html', '/guides/id/online-zip-vs-7z-vs-rar-which-to-pick.html', '/guides/de/online-zip-vs-7z-vs-rar-which-to-pick.html',
  '/guides/pt/jpg-vs-jpeg-are-they-the-same.html', '/guides/es/jpg-vs-jpeg-are-they-the-same.html', '/guides/vi/jpg-vs-jpeg-are-they-the-same.html', '/guides/id/jpg-vs-jpeg-are-they-the-same.html', '/guides/de/jpg-vs-jpeg-are-they-the-same.html',
  '/guides/pt/iphone-photo-format-explained-heic-jpg-png-raw.html', '/guides/es/iphone-photo-format-explained-heic-jpg-png-raw.html', '/guides/vi/iphone-photo-format-explained-heic-jpg-png-raw.html', '/guides/id/iphone-photo-format-explained-heic-jpg-png-raw.html', '/guides/de/iphone-photo-format-explained-heic-jpg-png-raw.html',
  // plan-warm-pascal-v3 S2 batch 11 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/zip-size-reducer.html', '/guides/es/zip-size-reducer.html', '/guides/vi/zip-size-reducer.html', '/guides/id/zip-size-reducer.html', '/guides/de/zip-size-reducer.html',
  '/guides/pt/zip-folder-online-free.html', '/guides/es/zip-folder-online-free.html', '/guides/vi/zip-folder-online-free.html', '/guides/id/zip-folder-online-free.html', '/guides/de/zip-folder-online-free.html',
  '/guides/pt/svg-to-png-when-to-rasterize-an-svg.html', '/guides/es/svg-to-png-when-to-rasterize-an-svg.html', '/guides/vi/svg-to-png-when-to-rasterize-an-svg.html', '/guides/id/svg-to-png-when-to-rasterize-an-svg.html', '/guides/de/svg-to-png-when-to-rasterize-an-svg.html',
  // plan-warm-pascal-v3 S2 batch 12 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/compress-zip-size.html', '/guides/es/compress-zip-size.html', '/guides/vi/compress-zip-size.html', '/guides/id/compress-zip-size.html', '/guides/de/compress-zip-size.html',
  '/guides/pt/create-zip-file-online.html', '/guides/es/create-zip-file-online.html', '/guides/vi/create-zip-file-online.html', '/guides/id/create-zip-file-online.html', '/guides/de/create-zip-file-online.html',
  '/guides/pt/css-minifier-vs-compressor.html', '/guides/es/css-minifier-vs-compressor.html', '/guides/vi/css-minifier-vs-compressor.html', '/guides/id/css-minifier-vs-compressor.html', '/guides/de/css-minifier-vs-compressor.html',
  // plan-warm-pascal-v3 S2 batch 13 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/compress-folder-online.html', '/guides/es/compress-folder-online.html', '/guides/vi/compress-folder-online.html', '/guides/id/compress-folder-online.html', '/guides/de/compress-folder-online.html',
  '/guides/pt/csv-vs-json-data-formats.html', '/guides/es/csv-vs-json-data-formats.html', '/guides/vi/csv-vs-json-data-formats.html', '/guides/id/csv-vs-json-data-formats.html', '/guides/de/csv-vs-json-data-formats.html',
  '/guides/pt/dead-pixel-testing-guide.html', '/guides/es/dead-pixel-testing-guide.html', '/guides/vi/dead-pixel-testing-guide.html', '/guides/id/dead-pixel-testing-guide.html', '/guides/de/dead-pixel-testing-guide.html',
  // plan-warm-pascal-v3 S2 batch 14 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/current-millis.html', '/guides/es/current-millis.html', '/guides/vi/current-millis.html', '/guides/id/current-millis.html', '/guides/de/current-millis.html',
  '/guides/pt/camera-check.html', '/guides/es/camera-check.html', '/guides/vi/camera-check.html', '/guides/id/camera-check.html', '/guides/de/camera-check.html',
  '/guides/pt/compress-jpeg-without-losing-quality-quality-vs-size.html', '/guides/es/compress-jpeg-without-losing-quality-quality-vs-size.html', '/guides/vi/compress-jpeg-without-losing-quality-quality-vs-size.html', '/guides/id/compress-jpeg-without-losing-quality-quality-vs-size.html', '/guides/de/compress-jpeg-without-losing-quality-quality-vs-size.html',
  // plan-warm-pascal-v3 S2 batch 15 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/current-time-in-milliseconds.html', '/guides/es/current-time-in-milliseconds.html', '/guides/vi/current-time-in-milliseconds.html', '/guides/id/current-time-in-milliseconds.html', '/guides/de/current-time-in-milliseconds.html',
  // Cycle 20260703-4 create_new_guide_page - "time in ms" (utility cluster, companion to /get-time-in-millisecond.html). 5 locale variants.
  '/guides/pt/time-in-ms.html', '/guides/es/time-in-ms.html', '/guides/vi/time-in-ms.html', '/guides/id/time-in-ms.html', '/guides/de/time-in-ms.html',
  '/guides/pt/camera-mirror-vs-flip-explained.html', '/guides/es/camera-mirror-vs-flip-explained.html', '/guides/vi/camera-mirror-vs-flip-explained.html', '/guides/id/camera-mirror-vs-flip-explained.html', '/guides/de/camera-mirror-vs-flip-explained.html',
  '/guides/pt/compressed-jpg-looks-blurry-three-causes.html', '/guides/es/compressed-jpg-looks-blurry-three-causes.html', '/guides/vi/compressed-jpg-looks-blurry-three-causes.html', '/guides/id/compressed-jpg-looks-blurry-three-causes.html', '/guides/de/compressed-jpg-looks-blurry-three-causes.html',
  // plan-warm-pascal-v3 S2 batch 16 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/camera-test-permission-blocked-how-to-allow-it.html', '/guides/es/camera-test-permission-blocked-how-to-allow-it.html', '/guides/vi/camera-test-permission-blocked-how-to-allow-it.html', '/guides/id/camera-test-permission-blocked-how-to-allow-it.html', '/guides/de/camera-test-permission-blocked-how-to-allow-it.html',
  '/guides/pt/css-minifier-vs-uglifier-vs-tree-shaking.html', '/guides/es/css-minifier-vs-uglifier-vs-tree-shaking.html', '/guides/vi/css-minifier-vs-uglifier-vs-tree-shaking.html', '/guides/id/css-minifier-vs-uglifier-vs-tree-shaking.html', '/guides/de/css-minifier-vs-uglifier-vs-tree-shaking.html',
  '/guides/pt/download-link-not-appearing-after-conversion-five-fixes.html', '/guides/es/download-link-not-appearing-after-conversion-five-fixes.html', '/guides/vi/download-link-not-appearing-after-conversion-five-fixes.html', '/guides/id/download-link-not-appearing-after-conversion-five-fixes.html', '/guides/de/download-link-not-appearing-after-conversion-five-fixes.html',
  // plan-warm-pascal-v3 S2 batch 17 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/camera-test-vs-webcam-test-which-do-you-need.html', '/guides/es/camera-test-vs-webcam-test-which-do-you-need.html', '/guides/vi/camera-test-vs-webcam-test-which-do-you-need.html', '/guides/id/camera-test-vs-webcam-test-which-do-you-need.html', '/guides/de/camera-test-vs-webcam-test-which-do-you-need.html',
  // Cycle 20260610-13 - LCD test for laptop screens (device-test) - 5 locale variants
  '/guides/pt/lcd-test-laptop.html', '/guides/es/lcd-test-laptop.html', '/guides/vi/lcd-test-laptop.html', '/guides/id/lcd-test-laptop.html', '/guides/de/lcd-test-laptop.html',
  '/guides/pt/device-test-checklist-for-remote-work.html', '/guides/es/device-test-checklist-for-remote-work.html', '/guides/vi/device-test-checklist-for-remote-work.html', '/guides/id/device-test-checklist-for-remote-work.html', '/guides/de/device-test-checklist-for-remote-work.html',
  '/guides/pt/before-a-video-call-which-tools-to-run.html', '/guides/es/before-a-video-call-which-tools-to-run.html', '/guides/vi/before-a-video-call-which-tools-to-run.html', '/guides/id/before-a-video-call-which-tools-to-run.html', '/guides/de/before-a-video-call-which-tools-to-run.html',
  // plan-warm-pascal-v3 S2 batch 18 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/extract-gif-frames-png-vs-jpg-which-format.html', '/guides/es/extract-gif-frames-png-vs-jpg-which-format.html', '/guides/vi/extract-gif-frames-png-vs-jpg-which-format.html', '/guides/id/extract-gif-frames-png-vs-jpg-which-format.html', '/guides/de/extract-gif-frames-png-vs-jpg-which-format.html',
  '/guides/pt/how-to-compress-a-file-online.html', '/guides/es/how-to-compress-a-file-online.html', '/guides/vi/how-to-compress-a-file-online.html', '/guides/id/how-to-compress-a-file-online.html', '/guides/de/how-to-compress-a-file-online.html',
  '/guides/pt/ffmpeg-online-conversion-stalled-three-fixes.html', '/guides/es/ffmpeg-online-conversion-stalled-three-fixes.html', '/guides/vi/ffmpeg-online-conversion-stalled-three-fixes.html', '/guides/id/ffmpeg-online-conversion-stalled-three-fixes.html', '/guides/de/ffmpeg-online-conversion-stalled-three-fixes.html',
  // plan-warm-pascal-v3 S2 batch 19 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/camera-test-shows-black-screen-four-fixes.html', '/guides/es/camera-test-shows-black-screen-four-fixes.html', '/guides/vi/camera-test-shows-black-screen-four-fixes.html', '/guides/id/camera-test-shows-black-screen-four-fixes.html', '/guides/de/camera-test-shows-black-screen-four-fixes.html',
  '/guides/pt/file-compressor.html', '/guides/es/file-compressor.html', '/guides/vi/file-compressor.html', '/guides/id/file-compressor.html', '/guides/de/file-compressor.html',
  '/guides/pt/gif-frame-extractor.html', '/guides/es/gif-frame-extractor.html', '/guides/vi/gif-frame-extractor.html', '/guides/id/gif-frame-extractor.html', '/guides/de/gif-frame-extractor.html',
  // Cycle 20260610-12 P12.D - 5 locale variants for gif-to-frames-converter
  '/guides/pt/gif-to-frames-converter.html', '/guides/es/gif-to-frames-converter.html', '/guides/vi/gif-to-frames-converter.html', '/guides/id/gif-to-frames-converter.html', '/guides/de/gif-to-frames-converter.html',
  // Cycle 20260610-14 - 5 locale variants for gif-to-frame
  '/guides/pt/gif-to-frame.html', '/guides/es/gif-to-frame.html', '/guides/vi/gif-to-frame.html', '/guides/id/gif-to-frame.html', '/guides/de/gif-to-frame.html',
  // plan-warm-pascal-v3 S2 batch 20 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/how-to-choose-a-compression-level.html', '/guides/es/how-to-choose-a-compression-level.html', '/guides/vi/how-to-choose-a-compression-level.html', '/guides/id/how-to-choose-a-compression-level.html', '/guides/de/how-to-choose-a-compression-level.html',
  '/guides/pt/heic-vs-jpg-vs-webp.html', '/guides/es/heic-vs-jpg-vs-webp.html', '/guides/vi/heic-vs-jpg-vs-webp.html', '/guides/id/heic-vs-jpg-vs-webp.html', '/guides/de/heic-vs-jpg-vs-webp.html',
  '/guides/pt/ffmpeg-online-vs-video-converter-which-to-pick.html', '/guides/es/ffmpeg-online-vs-video-converter-which-to-pick.html', '/guides/vi/ffmpeg-online-vs-video-converter-which-to-pick.html', '/guides/id/ffmpeg-online-vs-video-converter-which-to-pick.html', '/guides/de/ffmpeg-online-vs-video-converter-which-to-pick.html',
  // plan-warm-pascal-v3 S2 batch 21 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/base64-when-to-use-and-when-not-to.html', '/guides/es/base64-when-to-use-and-when-not-to.html', '/guides/vi/base64-when-to-use-and-when-not-to.html', '/guides/id/base64-when-to-use-and-when-not-to.html', '/guides/de/base64-when-to-use-and-when-not-to.html',
  '/guides/pt/how-to-check-webcam-and-microphone-before-an-interview.html', '/guides/es/how-to-check-webcam-and-microphone-before-an-interview.html', '/guides/vi/how-to-check-webcam-and-microphone-before-an-interview.html', '/guides/id/how-to-check-webcam-and-microphone-before-an-interview.html', '/guides/de/how-to-check-webcam-and-microphone-before-an-interview.html',
  '/guides/pt/how-to-compress-a-folder.html', '/guides/es/how-to-compress-a-folder.html', '/guides/vi/how-to-compress-a-folder.html', '/guides/id/how-to-compress-a-folder.html', '/guides/de/how-to-compress-a-folder.html',
  // plan-warm-pascal-v3 S2 batch 22 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/compress-zip-file-to-100kb.html', '/guides/es/compress-zip-file-to-100kb.html', '/guides/vi/compress-zip-file-to-100kb.html', '/guides/id/compress-zip-file-to-100kb.html', '/guides/de/compress-zip-file-to-100kb.html',
  '/guides/pt/gif-frames-extract-vs-frame-rate-fps-explained.html', '/guides/es/gif-frames-extract-vs-frame-rate-fps-explained.html', '/guides/vi/gif-frames-extract-vs-frame-rate-fps-explained.html', '/guides/id/gif-frames-extract-vs-frame-rate-fps-explained.html', '/guides/de/gif-frames-extract-vs-frame-rate-fps-explained.html',
  '/guides/pt/heic-vs-jpg-converter-when-each-wins.html', '/guides/es/heic-vs-jpg-converter-when-each-wins.html', '/guides/vi/heic-vs-jpg-converter-when-each-wins.html', '/guides/id/heic-vs-jpg-converter-when-each-wins.html', '/guides/de/heic-vs-jpg-converter-when-each-wins.html',
  // plan-warm-pascal-v3 S2 batch 23 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/compress-zip-file-to-2mb.html', '/guides/es/compress-zip-file-to-2mb.html', '/guides/vi/compress-zip-file-to-2mb.html', '/guides/id/compress-zip-file-to-2mb.html', '/guides/de/compress-zip-file-to-2mb.html',
  '/guides/pt/folder-to-zip.html', '/guides/es/folder-to-zip.html', '/guides/vi/folder-to-zip.html', '/guides/id/folder-to-zip.html', '/guides/de/folder-to-zip.html',
  '/guides/pt/css-unminifier-vs-prettier-when-to-use-each.html', '/guides/es/css-unminifier-vs-prettier-when-to-use-each.html', '/guides/vi/css-unminifier-vs-prettier-when-to-use-each.html', '/guides/id/css-unminifier-vs-prettier-when-to-use-each.html', '/guides/de/css-unminifier-vs-prettier-when-to-use-each.html',
  // plan-warm-pascal-v3 S2 batch 24 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html', '/guides/es/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html', '/guides/vi/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html', '/guides/id/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html', '/guides/de/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html',
  '/guides/pt/file-compressor-vs-zip-what-to-pick.html', '/guides/es/file-compressor-vs-zip-what-to-pick.html', '/guides/vi/file-compressor-vs-zip-what-to-pick.html', '/guides/id/file-compressor-vs-zip-what-to-pick.html', '/guides/de/file-compressor-vs-zip-what-to-pick.html',
  '/guides/pt/how-to-compress-a-folder-for-email.html', '/guides/es/how-to-compress-a-folder-for-email.html', '/guides/vi/how-to-compress-a-folder-for-email.html', '/guides/id/how-to-compress-a-folder-for-email.html', '/guides/de/how-to-compress-a-folder-for-email.html',
  // plan-warm-pascal-v3 S2 batch 25 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/gif-frame-extractor-output-looks-wrong-three-causes.html', '/guides/es/gif-frame-extractor-output-looks-wrong-three-causes.html', '/guides/vi/gif-frame-extractor-output-looks-wrong-three-causes.html', '/guides/id/gif-frame-extractor-output-looks-wrong-three-causes.html', '/guides/de/gif-frame-extractor-output-looks-wrong-three-causes.html',
  '/guides/pt/heic-to-jpg-claims-what-actually-works.html', '/guides/es/heic-to-jpg-claims-what-actually-works.html', '/guides/vi/heic-to-jpg-claims-what-actually-works.html', '/guides/id/heic-to-jpg-claims-what-actually-works.html', '/guides/de/heic-to-jpg-claims-what-actually-works.html',
  '/guides/pt/how-to-compress-a-jpg-for-email-attachment-limits.html', '/guides/es/how-to-compress-a-jpg-for-email-attachment-limits.html', '/guides/vi/how-to-compress-a-jpg-for-email-attachment-limits.html', '/guides/id/how-to-compress-a-jpg-for-email-attachment-limits.html', '/guides/de/how-to-compress-a-jpg-for-email-attachment-limits.html',
  // plan-warm-pascal-v3 S2 batch 26 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/free-online-tools-that-work-without-uploading-files.html', '/guides/es/free-online-tools-that-work-without-uploading-files.html', '/guides/vi/free-online-tools-that-work-without-uploading-files.html', '/guides/id/free-online-tools-that-work-without-uploading-files.html', '/guides/de/free-online-tools-that-work-without-uploading-files.html',
  '/guides/pt/how-to-compress-a-zip-file.html', '/guides/es/how-to-compress-a-zip-file.html', '/guides/vi/how-to-compress-a-zip-file.html', '/guides/id/how-to-compress-a-zip-file.html', '/guides/de/how-to-compress-a-zip-file.html',
  '/guides/pt/jpg-vs-png-for-web.html', '/guides/es/jpg-vs-png-for-web.html', '/guides/vi/jpg-vs-png-for-web.html', '/guides/id/jpg-vs-png-for-web.html', '/guides/de/jpg-vs-png-for-web.html',
  // plan-warm-pascal-v3 S2 batch 27 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/how-to-extract-a-file-online-zip-rar-7z.html', '/guides/es/how-to-extract-a-file-online-zip-rar-7z.html', '/guides/vi/how-to-extract-a-file-online-zip-rar-7z.html', '/guides/id/how-to-extract-a-file-online-zip-rar-7z.html', '/guides/de/how-to-extract-a-file-online-zip-rar-7z.html',
  '/guides/pt/how-to-test-a-keyboard-online-step-by-step.html', '/guides/es/how-to-test-a-keyboard-online-step-by-step.html', '/guides/vi/how-to-test-a-keyboard-online-step-by-step.html', '/guides/id/how-to-test-a-keyboard-online-step-by-step.html', '/guides/de/how-to-test-a-keyboard-online-step-by-step.html',
  '/guides/pt/how-to-tell-if-a-jpg-was-compressed-too-much.html', '/guides/es/how-to-tell-if-a-jpg-was-compressed-too-much.html', '/guides/vi/how-to-tell-if-a-jpg-was-compressed-too-much.html', '/guides/id/how-to-tell-if-a-jpg-was-compressed-too-much.html', '/guides/de/how-to-tell-if-a-jpg-was-compressed-too-much.html',
  // plan-warm-pascal-v3 S2 batch 28 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/how-to-convert-heic-to-jpg-step-by-step.html', '/guides/es/how-to-convert-heic-to-jpg-step-by-step.html', '/guides/vi/how-to-convert-heic-to-jpg-step-by-step.html', '/guides/id/how-to-convert-heic-to-jpg-step-by-step.html', '/guides/de/how-to-convert-heic-to-jpg-step-by-step.html',
  '/guides/pt/how-to-test-a-touchscreen-for-bad-spots.html', '/guides/es/how-to-test-a-touchscreen-for-bad-spots.html', '/guides/vi/how-to-test-a-touchscreen-for-bad-spots.html', '/guides/id/how-to-test-a-touchscreen-for-bad-spots.html', '/guides/de/how-to-test-a-touchscreen-for-bad-spots.html',
  '/guides/pt/how-to-minify-css-js-for-cloud-run-cold-start.html', '/guides/es/how-to-minify-css-js-for-cloud-run-cold-start.html', '/guides/vi/how-to-minify-css-js-for-cloud-run-cold-start.html', '/guides/id/how-to-minify-css-js-for-cloud-run-cold-start.html', '/guides/de/how-to-minify-css-js-for-cloud-run-cold-start.html',
  // plan-warm-pascal-v3 S2 batch 29 (2026-05-30) - 5 locale variants × 3 guides; CROSSES 50% MILESTONE
  '/guides/pt/how-to-flatten-a-pdf-and-when-to-do-it.html', '/guides/es/how-to-flatten-a-pdf-and-when-to-do-it.html', '/guides/vi/how-to-flatten-a-pdf-and-when-to-do-it.html', '/guides/id/how-to-flatten-a-pdf-and-when-to-do-it.html', '/guides/de/how-to-flatten-a-pdf-and-when-to-do-it.html',
  '/guides/pt/how-to-crop-and-rotate-an-image.html', '/guides/es/how-to-crop-and-rotate-an-image.html', '/guides/vi/how-to-crop-and-rotate-an-image.html', '/guides/id/how-to-crop-and-rotate-an-image.html', '/guides/de/how-to-crop-and-rotate-an-image.html',
  '/guides/pt/how-to-compress-a-zip-file-to-a-specific-size.html', '/guides/es/how-to-compress-a-zip-file-to-a-specific-size.html', '/guides/vi/how-to-compress-a-zip-file-to-a-specific-size.html', '/guides/id/how-to-compress-a-zip-file-to-a-specific-size.html', '/guides/de/how-to-compress-a-zip-file-to-a-specific-size.html',
  // plan-warm-pascal-v3 S2 batch 30 (2026-05-30) - 5 locale variants × 3 guides; PAST 50% R14 threshold
  '/guides/pt/how-to-sign-pdf-after-removing-a-password.html', '/guides/es/how-to-sign-pdf-after-removing-a-password.html', '/guides/vi/how-to-sign-pdf-after-removing-a-password.html', '/guides/id/how-to-sign-pdf-after-removing-a-password.html', '/guides/de/how-to-sign-pdf-after-removing-a-password.html',
  '/guides/pt/how-to-test-for-dead-pixels-before-returning-a-monitor.html', '/guides/es/how-to-test-for-dead-pixels-before-returning-a-monitor.html', '/guides/vi/how-to-test-for-dead-pixels-before-returning-a-monitor.html', '/guides/id/how-to-test-for-dead-pixels-before-returning-a-monitor.html', '/guides/de/how-to-test-for-dead-pixels-before-returning-a-monitor.html',
  '/guides/pt/image-to-base64-embed-in-html-vs-link.html', '/guides/es/image-to-base64-embed-in-html-vs-link.html', '/guides/vi/image-to-base64-embed-in-html-vs-link.html', '/guides/id/image-to-base64-embed-in-html-vs-link.html', '/guides/de/image-to-base64-embed-in-html-vs-link.html',
  // plan-warm-pascal-v3 S2 batch 31 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/mp4-vs-mov-vs-mkv-which-container-when.html', '/guides/es/mp4-vs-mov-vs-mkv-which-container-when.html', '/guides/vi/mp4-vs-mov-vs-mkv-which-container-when.html', '/guides/id/mp4-vs-mov-vs-mkv-which-container-when.html', '/guides/de/mp4-vs-mov-vs-mkv-which-container-when.html',
  '/guides/pt/pdf-password-types-owner-vs-user.html', '/guides/es/pdf-password-types-owner-vs-user.html', '/guides/vi/pdf-password-types-owner-vs-user.html', '/guides/id/pdf-password-types-owner-vs-user.html', '/guides/de/pdf-password-types-owner-vs-user.html',
  '/guides/pt/png-to-svg-when-to-vectorize-a-raster-image.html', '/guides/es/png-to-svg-when-to-vectorize-a-raster-image.html', '/guides/vi/png-to-svg-when-to-vectorize-a-raster-image.html', '/guides/id/png-to-svg-when-to-vectorize-a-raster-image.html', '/guides/de/png-to-svg-when-to-vectorize-a-raster-image.html',
  // plan-warm-pascal-v3 S2 batch 32 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/microphone-test-online-what-it-actually-checks.html', '/guides/es/microphone-test-online-what-it-actually-checks.html', '/guides/vi/microphone-test-online-what-it-actually-checks.html', '/guides/id/microphone-test-online-what-it-actually-checks.html', '/guides/de/microphone-test-online-what-it-actually-checks.html',
  '/guides/pt/unix-timestamps-explained.html', '/guides/es/unix-timestamps-explained.html', '/guides/vi/unix-timestamps-explained.html', '/guides/id/unix-timestamps-explained.html', '/guides/de/unix-timestamps-explained.html',
  '/guides/pt/why-heic-wont-open-on-windows-three-fixes.html', '/guides/es/why-heic-wont-open-on-windows-three-fixes.html', '/guides/vi/why-heic-wont-open-on-windows-three-fixes.html', '/guides/id/why-heic-wont-open-on-windows-three-fixes.html', '/guides/de/why-heic-wont-open-on-windows-three-fixes.html',
  // plan-warm-pascal-v3 S2 batch 33 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/imagemagick-online-vs-task-specific-tools-which-to-pick.html', '/guides/es/imagemagick-online-vs-task-specific-tools-which-to-pick.html', '/guides/vi/imagemagick-online-vs-task-specific-tools-which-to-pick.html', '/guides/id/imagemagick-online-vs-task-specific-tools-which-to-pick.html', '/guides/de/imagemagick-online-vs-task-specific-tools-which-to-pick.html',
  '/guides/pt/json-parser-validate-vs-format-vs-tree-view.html', '/guides/es/json-parser-validate-vs-format-vs-tree-view.html', '/guides/vi/json-parser-validate-vs-format-vs-tree-view.html', '/guides/id/json-parser-validate-vs-format-vs-tree-view.html', '/guides/de/json-parser-validate-vs-format-vs-tree-view.html',
  '/guides/pt/pdf-editing-ladder.html', '/guides/es/pdf-editing-ladder.html', '/guides/vi/pdf-editing-ladder.html', '/guides/id/pdf-editing-ladder.html', '/guides/de/pdf-editing-ladder.html',
  // plan-warm-pascal-v3 S2 batch 34 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/keyboard-tester-online-rollover-vs-anti-ghosting.html', '/guides/es/keyboard-tester-online-rollover-vs-anti-ghosting.html', '/guides/vi/keyboard-tester-online-rollover-vs-anti-ghosting.html', '/guides/id/keyboard-tester-online-rollover-vs-anti-ghosting.html', '/guides/de/keyboard-tester-online-rollover-vs-anti-ghosting.html',
  '/guides/pt/mp4-vs-webm-for-web.html', '/guides/es/mp4-vs-webm-for-web.html', '/guides/vi/mp4-vs-webm-for-web.html', '/guides/id/mp4-vs-webm-for-web.html', '/guides/de/mp4-vs-webm-for-web.html',
  '/guides/pt/png-vs-svg-when-to-use.html', '/guides/es/png-vs-svg-when-to-use.html', '/guides/vi/png-vs-svg-when-to-use.html', '/guides/id/png-vs-svg-when-to-use.html', '/guides/de/png-vs-svg-when-to-use.html',
  // plan-warm-pascal-v3 S2 batch 35 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/json-vs-yaml-vs-toml-config-formats-explained.html', '/guides/es/json-vs-yaml-vs-toml-config-formats-explained.html', '/guides/vi/json-vs-yaml-vs-toml-config-formats-explained.html', '/guides/id/json-vs-yaml-vs-toml-config-formats-explained.html', '/guides/de/json-vs-yaml-vs-toml-config-formats-explained.html',
  '/guides/pt/pdf-preflight-online-what-it-actually-checks.html', '/guides/es/pdf-preflight-online-what-it-actually-checks.html', '/guides/vi/pdf-preflight-online-what-it-actually-checks.html', '/guides/id/pdf-preflight-online-what-it-actually-checks.html', '/guides/de/pdf-preflight-online-what-it-actually-checks.html',
  '/guides/pt/recover-corrupt-zip-file-options.html', '/guides/es/recover-corrupt-zip-file-options.html', '/guides/vi/recover-corrupt-zip-file-options.html', '/guides/id/recover-corrupt-zip-file-options.html', '/guides/de/recover-corrupt-zip-file-options.html',
  // plan-warm-pascal-v3 S2 batch 36 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/how-to-extract-frames-from-a-gif-for-a-social-post.html', '/guides/es/how-to-extract-frames-from-a-gif-for-a-social-post.html', '/guides/vi/how-to-extract-frames-from-a-gif-for-a-social-post.html', '/guides/id/how-to-extract-frames-from-a-gif-for-a-social-post.html', '/guides/de/how-to-extract-frames-from-a-gif-for-a-social-post.html',
  '/guides/pt/keyboard-test-keys-not-detected-four-fixes.html', '/guides/es/keyboard-test-keys-not-detected-four-fixes.html', '/guides/vi/keyboard-test-keys-not-detected-four-fixes.html', '/guides/id/keyboard-test-keys-not-detected-four-fixes.html', '/guides/de/keyboard-test-keys-not-detected-four-fixes.html',
  '/guides/pt/pdf-vs-heic-for-document-archival.html', '/guides/es/pdf-vs-heic-for-document-archival.html', '/guides/vi/pdf-vs-heic-for-document-archival.html', '/guides/id/pdf-vs-heic-for-document-archival.html', '/guides/de/pdf-vs-heic-for-document-archival.html',
  // plan-warm-pascal-v3 S2 batch 37 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/microphone-test-no-sound-four-fixes.html', '/guides/es/microphone-test-no-sound-four-fixes.html', '/guides/vi/microphone-test-no-sound-four-fixes.html', '/guides/id/microphone-test-no-sound-four-fixes.html', '/guides/de/microphone-test-no-sound-four-fixes.html',
  '/guides/pt/why-md5-cannot-be-decrypted.html', '/guides/es/why-md5-cannot-be-decrypted.html', '/guides/vi/why-md5-cannot-be-decrypted.html', '/guides/id/why-md5-cannot-be-decrypted.html', '/guides/de/why-md5-cannot-be-decrypted.html',
  '/guides/pt/how-to-convert-100-heic-photos-to-jpg.html', '/guides/es/how-to-convert-100-heic-photos-to-jpg.html', '/guides/vi/how-to-convert-100-heic-photos-to-jpg.html', '/guides/id/how-to-convert-100-heic-photos-to-jpg.html', '/guides/de/how-to-convert-100-heic-photos-to-jpg.html',
  // plan-warm-pascal-v3 S2 batch 38 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/zip-password-types-strong-vs-weak-explained.html', '/guides/es/zip-password-types-strong-vs-weak-explained.html', '/guides/vi/zip-password-types-strong-vs-weak-explained.html', '/guides/id/zip-password-types-strong-vs-weak-explained.html', '/guides/de/zip-password-types-strong-vs-weak-explained.html',
  '/guides/pt/md5-vs-sha256-when-to-hash.html', '/guides/es/md5-vs-sha256-when-to-hash.html', '/guides/vi/md5-vs-sha256-when-to-hash.html', '/guides/id/md5-vs-sha256-when-to-hash.html', '/guides/de/md5-vs-sha256-when-to-hash.html',
  '/guides/pt/how-to-convert-iphone-photo-to-jpg.html', '/guides/es/how-to-convert-iphone-photo-to-jpg.html', '/guides/vi/how-to-convert-iphone-photo-to-jpg.html', '/guides/id/how-to-convert-iphone-photo-to-jpg.html', '/guides/de/how-to-convert-iphone-photo-to-jpg.html',
  // plan-warm-pascal-v3 S2 batch 39 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/microphone-test-permission-blocked-how-to-allow-it.html', '/guides/es/microphone-test-permission-blocked-how-to-allow-it.html', '/guides/vi/microphone-test-permission-blocked-how-to-allow-it.html', '/guides/id/microphone-test-permission-blocked-how-to-allow-it.html', '/guides/de/microphone-test-permission-blocked-how-to-allow-it.html',
  '/guides/pt/qr-code-error-correction-and-scan-failures.html', '/guides/es/qr-code-error-correction-and-scan-failures.html', '/guides/vi/qr-code-error-correction-and-scan-failures.html', '/guides/id/qr-code-error-correction-and-scan-failures.html', '/guides/de/qr-code-error-correction-and-scan-failures.html',
  '/guides/pt/how-to-split-a-gif-into-frames-for-editing.html', '/guides/es/how-to-split-a-gif-into-frames-for-editing.html', '/guides/vi/how-to-split-a-gif-into-frames-for-editing.html', '/guides/id/how-to-split-a-gif-into-frames-for-editing.html', '/guides/de/how-to-split-a-gif-into-frames-for-editing.html',
  // plan-warm-pascal-v3 S2 batch 40 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/microphone-test-online-quiet-normal-peak-meter.html', '/guides/es/microphone-test-online-quiet-normal-peak-meter.html', '/guides/vi/microphone-test-online-quiet-normal-peak-meter.html', '/guides/id/microphone-test-online-quiet-normal-peak-meter.html', '/guides/de/microphone-test-online-quiet-normal-peak-meter.html',
  '/guides/pt/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html', '/guides/es/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html', '/guides/vi/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html', '/guides/id/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html', '/guides/de/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html',
  '/guides/pt/photo-editor-vs-graphics-app-vs-batch-processor.html', '/guides/es/photo-editor-vs-graphics-app-vs-batch-processor.html', '/guides/vi/photo-editor-vs-graphics-app-vs-batch-processor.html', '/guides/id/photo-editor-vs-graphics-app-vs-batch-processor.html', '/guides/de/photo-editor-vs-graphics-app-vs-batch-processor.html',
  // plan-warm-pascal-v3 S2 batch 41 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-password-recovery-online.html', '/guides/es/zip-password-recovery-online.html', '/guides/vi/zip-password-recovery-online.html', '/guides/id/zip-password-recovery-online.html', '/guides/de/zip-password-recovery-online.html',
  '/guides/pt/qr-code-generator-best-practices.html', '/guides/es/qr-code-generator-best-practices.html', '/guides/vi/qr-code-generator-best-practices.html', '/guides/id/qr-code-generator-best-practices.html', '/guides/de/qr-code-generator-best-practices.html',
  '/guides/pt/when-to-compress-vs-convert-an-image.html', '/guides/es/when-to-compress-vs-convert-an-image.html', '/guides/vi/when-to-compress-vs-convert-an-image.html', '/guides/id/when-to-compress-vs-convert-an-image.html', '/guides/de/when-to-compress-vs-convert-an-image.html',
  // plan-warm-pascal-v3 S2 batch 42 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/how-to-zip-folder-online-step-by-step.html', '/guides/es/how-to-zip-folder-online-step-by-step.html', '/guides/vi/how-to-zip-folder-online-step-by-step.html', '/guides/id/how-to-zip-folder-online-step-by-step.html', '/guides/de/how-to-zip-folder-online-step-by-step.html',
  '/guides/pt/oled-test-vs-lcd-test-what-changes-on-oled.html', '/guides/es/oled-test-vs-lcd-test-what-changes-on-oled.html', '/guides/vi/oled-test-vs-lcd-test-what-changes-on-oled.html', '/guides/id/oled-test-vs-lcd-test-what-changes-on-oled.html', '/guides/de/oled-test-vs-lcd-test-what-changes-on-oled.html',
  '/guides/pt/milliseconds-to-date-utc-vs-local-time.html', '/guides/es/milliseconds-to-date-utc-vs-local-time.html', '/guides/vi/milliseconds-to-date-utc-vs-local-time.html', '/guides/id/milliseconds-to-date-utc-vs-local-time.html', '/guides/de/milliseconds-to-date-utc-vs-local-time.html',
  // plan-warm-pascal-v3 S2 batch 43 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/how-to-reduce-zip-file-size.html', '/guides/es/how-to-reduce-zip-file-size.html', '/guides/vi/how-to-reduce-zip-file-size.html', '/guides/id/how-to-reduce-zip-file-size.html', '/guides/de/how-to-reduce-zip-file-size.html',
  '/guides/pt/screen-test-online-vs-app-which-is-more-accurate.html', '/guides/es/screen-test-online-vs-app-which-is-more-accurate.html', '/guides/vi/screen-test-online-vs-app-which-is-more-accurate.html', '/guides/id/screen-test-online-vs-app-which-is-more-accurate.html', '/guides/de/screen-test-online-vs-app-which-is-more-accurate.html',
  '/guides/pt/image-compression-and-exif-metadata-what-gets-stripped.html', '/guides/es/image-compression-and-exif-metadata-what-gets-stripped.html', '/guides/vi/image-compression-and-exif-metadata-what-gets-stripped.html', '/guides/id/image-compression-and-exif-metadata-what-gets-stripped.html', '/guides/de/image-compression-and-exif-metadata-what-gets-stripped.html',
  // plan-warm-pascal-v3 S2 batch 44 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/how-to-reduce-zip-file-size-online.html', '/guides/es/how-to-reduce-zip-file-size-online.html', '/guides/vi/how-to-reduce-zip-file-size-online.html', '/guides/id/how-to-reduce-zip-file-size-online.html', '/guides/de/how-to-reduce-zip-file-size-online.html',
  '/guides/pt/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html', '/guides/es/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html', '/guides/vi/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html', '/guides/id/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html', '/guides/de/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html',
  '/guides/pt/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html', '/guides/es/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html', '/guides/vi/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html', '/guides/id/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html', '/guides/de/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html',
  // plan-warm-pascal-v3 S2 batch 45 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/how-to-make-a-zip-file-smaller.html', '/guides/es/how-to-make-a-zip-file-smaller.html', '/guides/vi/how-to-make-a-zip-file-smaller.html', '/guides/id/how-to-make-a-zip-file-smaller.html', '/guides/de/how-to-make-a-zip-file-smaller.html',
  '/guides/pt/long-number-millisecond-or-second.html', '/guides/es/long-number-millisecond-or-second.html', '/guides/vi/long-number-millisecond-or-second.html', '/guides/id/long-number-millisecond-or-second.html', '/guides/de/long-number-millisecond-or-second.html',
  '/guides/pt/lcd-test-what-it-checks.html', '/guides/es/lcd-test-what-it-checks.html', '/guides/vi/lcd-test-what-it-checks.html', '/guides/id/lcd-test-what-it-checks.html', '/guides/de/lcd-test-what-it-checks.html',
  // plan-warm-pascal-v3 S2 batch 46 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-file-converter-what-it-actually-does.html', '/guides/es/zip-file-converter-what-it-actually-does.html', '/guides/vi/zip-file-converter-what-it-actually-does.html', '/guides/id/zip-file-converter-what-it-actually-does.html', '/guides/de/zip-file-converter-what-it-actually-does.html',
  '/guides/pt/md5-to-text-why-you-cannot-convert-back.html', '/guides/es/md5-to-text-why-you-cannot-convert-back.html', '/guides/vi/md5-to-text-why-you-cannot-convert-back.html', '/guides/id/md5-to-text-why-you-cannot-convert-back.html', '/guides/de/md5-to-text-why-you-cannot-convert-back.html',
  '/guides/pt/lcd-test-vs-display-test-which-do-you-need.html', '/guides/es/lcd-test-vs-display-test-which-do-you-need.html', '/guides/vi/lcd-test-vs-display-test-which-do-you-need.html', '/guides/id/lcd-test-vs-display-test-which-do-you-need.html', '/guides/de/lcd-test-vs-display-test-which-do-you-need.html',
  // plan-warm-pascal-v3 S2 batch 47 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/what-is-a-file-compressor-and-which-to-use.html', '/guides/es/what-is-a-file-compressor-and-which-to-use.html', '/guides/vi/what-is-a-file-compressor-and-which-to-use.html', '/guides/id/what-is-a-file-compressor-and-which-to-use.html', '/guides/de/what-is-a-file-compressor-and-which-to-use.html',
  '/guides/pt/read-and-compare-md5-hashes-correctly.html', '/guides/es/read-and-compare-md5-hashes-correctly.html', '/guides/vi/read-and-compare-md5-hashes-correctly.html', '/guides/id/read-and-compare-md5-hashes-correctly.html', '/guides/de/read-and-compare-md5-hashes-correctly.html',
  '/guides/pt/what-an-lcd-test-does-and-when-to-run-one.html', '/guides/es/what-an-lcd-test-does-and-when-to-run-one.html', '/guides/vi/what-an-lcd-test-does-and-when-to-run-one.html', '/guides/id/what-an-lcd-test-does-and-when-to-run-one.html', '/guides/de/what-an-lcd-test-does-and-when-to-run-one.html',
  // plan-warm-pascal-v3 S2 batch 48 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html', '/guides/es/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html', '/guides/vi/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html', '/guides/id/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html', '/guides/de/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html',
  '/guides/pt/unminify-js.html', '/guides/es/unminify-js.html', '/guides/vi/unminify-js.html', '/guides/id/unminify-js.html', '/guides/de/unminify-js.html',
  '/guides/pt/screen-test-for-laptop-5-minute-checklist.html', '/guides/es/screen-test-for-laptop-5-minute-checklist.html', '/guides/vi/screen-test-for-laptop-5-minute-checklist.html', '/guides/id/screen-test-for-laptop-5-minute-checklist.html', '/guides/de/screen-test-for-laptop-5-minute-checklist.html',
  // plan-warm-pascal-v3 S2 batch 49 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/file-compressor-online-when-to-zip-vs-when-to-compress-image.html', '/guides/es/file-compressor-online-when-to-zip-vs-when-to-compress-image.html', '/guides/vi/file-compressor-online-when-to-zip-vs-when-to-compress-image.html', '/guides/id/file-compressor-online-when-to-zip-vs-when-to-compress-image.html', '/guides/de/file-compressor-online-when-to-zip-vs-when-to-compress-image.html',
  '/guides/pt/md5-decode.html', '/guides/es/md5-decode.html', '/guides/vi/md5-decode.html', '/guides/id/md5-decode.html', '/guides/de/md5-decode.html',
  '/guides/pt/millisecond-to-date.html', '/guides/es/millisecond-to-date.html', '/guides/vi/millisecond-to-date.html', '/guides/id/millisecond-to-date.html', '/guides/de/millisecond-to-date.html',
  // plan-warm-pascal-v3 S2 batch 50 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-password-unlocker.html', '/guides/es/zip-password-unlocker.html', '/guides/vi/zip-password-unlocker.html', '/guides/id/zip-password-unlocker.html', '/guides/de/zip-password-unlocker.html',
  '/guides/pt/md5-password.html', '/guides/es/md5-password.html', '/guides/vi/md5-password.html', '/guides/id/md5-password.html', '/guides/de/md5-password.html',
  '/guides/pt/screen-test-vs-camera-test-pick-the-right-tool.html', '/guides/es/screen-test-vs-camera-test-pick-the-right-tool.html', '/guides/vi/screen-test-vs-camera-test-pick-the-right-tool.html', '/guides/id/screen-test-vs-camera-test-pick-the-right-tool.html', '/guides/de/screen-test-vs-camera-test-pick-the-right-tool.html',
  // plan-warm-pascal-v3 S2 batch 51 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-file-size-compressor.html', '/guides/es/zip-file-size-compressor.html', '/guides/vi/zip-file-size-compressor.html', '/guides/id/zip-file-size-compressor.html', '/guides/de/zip-file-size-compressor.html',
  '/guides/pt/md5-hash-decrypt.html', '/guides/es/md5-hash-decrypt.html', '/guides/vi/md5-hash-decrypt.html', '/guides/id/md5-hash-decrypt.html', '/guides/de/md5-hash-decrypt.html',
  '/guides/pt/led-test-vs-lcd-test-which-applies-to-your-screen.html', '/guides/es/led-test-vs-lcd-test-which-applies-to-your-screen.html', '/guides/vi/led-test-vs-lcd-test-which-applies-to-your-screen.html', '/guides/id/led-test-vs-lcd-test-which-applies-to-your-screen.html', '/guides/de/led-test-vs-lcd-test-which-applies-to-your-screen.html',
  // plan-warm-pascal-v3 S2 batch 52 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/resize-zip-file.html', '/guides/es/resize-zip-file.html', '/guides/vi/resize-zip-file.html', '/guides/id/resize-zip-file.html', '/guides/de/resize-zip-file.html',
  '/guides/pt/md5-decrypt-online.html', '/guides/es/md5-decrypt-online.html', '/guides/vi/md5-decrypt-online.html', '/guides/id/md5-decrypt-online.html', '/guides/de/md5-decrypt-online.html',
  '/guides/pt/ms-to-date.html', '/guides/es/ms-to-date.html', '/guides/vi/ms-to-date.html', '/guides/id/ms-to-date.html', '/guides/de/ms-to-date.html',
  // plan-warm-pascal-v3 S2 batch 53 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-compressor.html', '/guides/es/zip-compressor.html', '/guides/vi/zip-compressor.html', '/guides/id/zip-compressor.html', '/guides/de/zip-compressor.html',
  '/guides/pt/lcd-checker.html', '/guides/es/lcd-checker.html', '/guides/vi/lcd-checker.html', '/guides/id/lcd-checker.html', '/guides/de/lcd-checker.html',
  '/guides/pt/online-zip-file.html', '/guides/es/online-zip-file.html', '/guides/vi/online-zip-file.html', '/guides/id/online-zip-file.html', '/guides/de/online-zip-file.html',
  // plan-warm-pascal-v3 S2 batch 54 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/test-lcd.html', '/guides/es/test-lcd.html', '/guides/vi/test-lcd.html', '/guides/id/test-lcd.html', '/guides/de/test-lcd.html',
  '/guides/pt/i-love-zip.html', '/guides/es/i-love-zip.html', '/guides/vi/i-love-zip.html', '/guides/id/i-love-zip.html', '/guides/de/i-love-zip.html',
  '/guides/pt/zip-compressor-online.html', '/guides/es/zip-compressor-online.html', '/guides/vi/zip-compressor-online.html', '/guides/id/zip-compressor-online.html', '/guides/de/zip-compressor-online.html',
  // plan-warm-pascal-v3 S2 batch 55 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/screen-display-test-synonyms.html', '/guides/es/screen-display-test-synonyms.html', '/guides/vi/screen-display-test-synonyms.html', '/guides/id/screen-display-test-synonyms.html', '/guides/de/screen-display-test-synonyms.html',
  '/guides/pt/kompres-file-zip.html', '/guides/es/kompres-file-zip.html', '/guides/vi/kompres-file-zip.html', '/guides/id/kompres-file-zip.html', '/guides/de/kompres-file-zip.html',
  '/guides/pt/zip-unlocker-online.html', '/guides/es/zip-unlocker-online.html', '/guides/vi/zip-unlocker-online.html', '/guides/id/zip-unlocker-online.html', '/guides/de/zip-unlocker-online.html',
  // plan-warm-pascal-v3 S2 batch 56 (2026-05-31) - 5 locale variants × 2 guides (FINAL substantive batch; 163 of 166 guides complete; 3 stubs noindex deferred)
  '/guides/pt/kompres-zip.html', '/guides/es/kompres-zip.html', '/guides/vi/kompres-zip.html', '/guides/id/kompres-zip.html', '/guides/de/kompres-zip.html',
  '/guides/pt/zip-file-compressor-online.html', '/guides/es/zip-file-compressor-online.html', '/guides/vi/zip-file-compressor-online.html', '/guides/id/zip-file-compressor-online.html', '/guides/de/zip-file-compressor-online.html',
  // plan-warm-pascal-v3 S2 batch 57 (2026-05-31) - 5 locale variants × 2 guides (NEW make-zip-file-online + split-gif-into-frames, post-ledger-166 expansion to 168 targeted)
  '/guides/pt/make-zip-file-online.html', '/guides/es/make-zip-file-online.html', '/guides/vi/make-zip-file-online.html', '/guides/id/make-zip-file-online.html', '/guides/de/make-zip-file-online.html',
  '/guides/pt/split-gif-into-frames.html', '/guides/es/split-gif-into-frames.html', '/guides/vi/split-gif-into-frames.html', '/guides/id/split-gif-into-frames.html', '/guides/de/split-gif-into-frames.html',
  // plan-warm-pascal-v3 S2 batch 58 (2026-06-01) - 5 locale variants × 1 guide (tes-lcd; CLOSURE batch reaching 100% route-level coverage)
  '/guides/pt/tes-lcd.html', '/guides/es/tes-lcd.html', '/guides/vi/tes-lcd.html', '/guides/id/tes-lcd.html', '/guides/de/tes-lcd.html',
  // plan-warm-pascal-v3 S2 batch 59 (2026-06-05) - 5 locale variants x 2 NEW guides (file-to-zip, online-diff-tool; backfill of pipeline-created EN-only guides)
  '/guides/pt/file-to-zip.html', '/guides/es/file-to-zip.html', '/guides/vi/file-to-zip.html', '/guides/id/file-to-zip.html', '/guides/de/file-to-zip.html',
  '/guides/pt/online-diff-tool.html', '/guides/es/online-diff-tool.html', '/guides/vi/online-diff-tool.html', '/guides/id/online-diff-tool.html', '/guides/de/online-diff-tool.html',
  // plan-warm-pascal-v3 S2 batch 60 (2026-06-05) - tool-free x 5 locales (new_guide_locale_completeness gate backfill)
  '/guides/pt/tool-free.html', '/guides/es/tool-free.html', '/guides/vi/tool-free.html', '/guides/id/tool-free.html', '/guides/de/tool-free.html',
  // cycle20260701 create_new_guide_page (locale completion) - pt variant of compress-image-online-to-50kb (staging-only until es/vi/id/de complete).
  '/guides/pt/compress-image-online-to-50kb.html',
  // cycle20260701-2 create_new_guide_page (locale completion) - es variant (staging-only until vi/id/de complete).
  '/guides/es/compress-image-online-to-50kb.html',
  // cycle20260701-3 create_new_guide_page (locale completion) - vi/id/de complete the bundle (en+pt+es+vi+id+de = locale-complete, prod-eligible).
  '/guides/vi/compress-image-online-to-50kb.html',
  '/guides/id/compress-image-online-to-50kb.html',
  '/guides/de/compress-image-online-to-50kb.html',
  // cycle 20260702 create_new_guide_page (locale completion) - pt variant of cek-layar-laptop (staging-only until es/vi/id/de complete).
  '/guides/pt/cek-layar-laptop.html',
  // cycle 20260702-3 create_new_guide_page (locale completion) - es/vi/id/de variants of cek-layar-laptop (bundle now locale-complete).
  '/guides/es/cek-layar-laptop.html', '/guides/vi/cek-layar-laptop.html', '/guides/id/cek-layar-laptop.html', '/guides/de/cek-layar-laptop.html',
  // cycle 20260702 create_new_guide_page - photo-editor-online-pixlr (EN + pt/es/vi/id/de; locale-complete). Serves "photo editor online pixlr" searchers via our /photo-editor.html.
  '/guides/photo-editor-online-pixlr.html',
  '/guides/pt/photo-editor-online-pixlr.html', '/guides/es/photo-editor-online-pixlr.html', '/guides/vi/photo-editor-online-pixlr.html', '/guides/id/photo-editor-online-pixlr.html', '/guides/de/photo-editor-online-pixlr.html',
  // geo-sitewide-audit-runbook: ship-pending reconciliation - pt/es/vi/id/de variants of mp4-to-gif-online-free (completes the locale bundle for the EN-only stranded scaffold).
  '/guides/pt/mp4-to-gif-online-free.html', '/guides/es/mp4-to-gif-online-free.html', '/guides/vi/mp4-to-gif-online-free.html', '/guides/id/mp4-to-gif-online-free.html', '/guides/de/mp4-to-gif-online-free.html',
  // cycle 20260609-2 - md5-decrypter guide (EN + 5 locale variants)
  '/guides/en/md5-decrypter.html',
  '/guides/pt/md5-decrypter.html', '/guides/es/md5-decrypter.html', '/guides/vi/md5-decrypter.html', '/guides/id/md5-decrypter.html', '/guides/de/md5-decrypter.html',
  '/guides/pt/compress-folder.html', // pt canonical of /guides/compactar-pasta.html
  '/guides/pt/compress-zip-file.html', // pt canonical of /guides/comprimir-arquivo-zip.html
  '/guides/pt/compress-folder-to-zip.html', // pt canonical of /guides/comprimir-pasta-zipada.html
  '/guides/pt/compress-zip-online.html', // pt canonical of /guides/comprimir-zip-online.html
  '/guides/pt/zip-a-folder.html', // pt canonical of /guides/zipar-pasta.html
  '/guides/es/compress-folder-to-zip-online-free.html', // es canonical of /guides/comprimir-carpeta-zip-online-gratis.html
  '/guides/es/reduce-zip-size-online.html', // es canonical of /guides/reducir-tama-o-zip-online.html
  // cycle 20260610-15 - front-camera-test guide locale variants (pt/es/vi/id/de)
  '/guides/pt/front-camera-test.html',
  '/guides/es/front-camera-test.html',
  '/guides/vi/front-camera-test.html',
  '/guides/id/front-camera-test.html',
  '/guides/de/front-camera-test.html',
  // cycle 20260610-16 - compress-pdf-online-free guide locale variants (pt/es/vi/id/de)
  '/guides/pt/compress-pdf-online-free.html',
  '/guides/es/compress-pdf-online-free.html',
  '/guides/vi/compress-pdf-online-free.html',
  '/guides/id/compress-pdf-online-free.html',
  '/guides/de/compress-pdf-online-free.html',
  // cycle 20260615-4 - split-pdf-online-free ID locale variant (EN-first locale drain; de remains)
  '/guides/id/split-pdf-online-free.html',
  // cycle 20260615-5 - split-pdf-online-free DE locale variant (EN-first locale drain COMPLETE)
  '/guides/de/split-pdf-online-free.html',
  // cycle 20260623-54 - mengecilkan-ukuran-zip EN + PT locale variant (create_new_guide_page locale completion)
  '/guides/mengecilkan-ukuran-zip.html',
  '/guides/pt/mengecilkan-ukuran-zip.html',
  // cycle 20260624 - mengecilkan-ukuran-zip ES locale variant (EN-first locale drain; vi/id/de remain)
  '/guides/es/mengecilkan-ukuran-zip.html',
  // cycle 20260624-2 - mengecilkan-ukuran-zip VI locale variant (EN-first locale drain; id/de remain)
  '/guides/vi/mengecilkan-ukuran-zip.html',
  // cycle 20260624-3 - mengecilkan-ukuran-zip ID locale variant (EN-first locale drain; de remains)
  '/guides/id/mengecilkan-ukuran-zip.html',
  // cycle 20260624-4 - mengecilkan-ukuran-zip DE locale variant (EN-first locale drain; locale-complete)
  '/guides/de/mengecilkan-ukuran-zip.html',
  // cycle 20260630-4 - merge-pdf-online-free-unlimited VI locale variant (EN-first locale drain; id/de remain)
  '/guides/vi/merge-pdf-online-free-unlimited.html',
  // cycle 20260630-5 - merge-pdf-online-free-unlimited ID locale variant (EN-first locale drain; de remains)
  '/guides/id/merge-pdf-online-free-unlimited.html',
  // cycle 20260630-6 - merge-pdf-online-free-unlimited DE locale variant (EN-first locale drain; locale-complete after this)
  '/guides/de/merge-pdf-online-free-unlimited.html',
]);

// Guide routes subset of INFO_ROUTES - used by page-renderer.mjs to emit Article
// JSON-LD and to inject editorial-byline/trust surface on guide pages.
//
// ⛔ KEBAB-CASE NON-NEGOTIABLE (cycle 20260514-6-followup):
// Every NEW entry MUST be `^/guides/[a-z0-9]+(-[a-z0-9]+)*\.html$`.
// Multi-word slugs MUST use hyphens. Single-token slugs ≥ 13 chars are
// smashed multi-word queries → CRITICAL audit failure → BLOCK Phase 5.
//   ✅ /guides/how-to-compress-a-folder.html
//   ❌ /guides/howtocompressafolder.html
// See CLAUDE.md "⛔ URL convention" block + the JSP_BY_ROUTE comment below.
//
// Removing an entry here while keeping it in JSP_BY_ROUTE = "abort-in-place":
// the URL still renders (200, not 404) for inbound links, but sitemap-guides.xml
// no longer publishes it. Used for legacy non-kebab URLs that already shipped.
export const GUIDE_ROUTES = new Set([
  // cycle 20260625-6 create_new_guide_page (locale completion) - pt variant of video-converter-online-free (staging-only until es/vi/id/de complete).
  '/guides/pt/video-converter-online-free.html',
  // cycle 20260626 create_new_guide_page (locale completion) - es variant of video-converter-online-free (staging-only until vi/id/de complete).
  '/guides/es/video-converter-online-free.html',
  // cycle 20260626-2 create_new_guide_page (locale completion) - vi variant of video-converter-online-free (staging-only until id/de complete).
  '/guides/vi/video-converter-online-free.html',
  // 2026-06-28 related-guides-loop: id/de locale completion for video-converter-online-free.
  '/guides/id/video-converter-online-free.html',
  '/guides/de/video-converter-online-free.html',
  // plan-warm-pascal-v3 S2 batch 1 (2026-05-29) - 5 locale variants of /guides/lcd-test-online.html
  '/guides/pt/lcd-test-online.html',
  '/guides/es/lcd-test-online.html',
  '/guides/vi/lcd-test-online.html',
  '/guides/id/lcd-test-online.html',
  '/guides/de/lcd-test-online.html',
  // plan-warm-pascal-v3 S2 batch 2 (2026-05-29) - 5 locale variants of /guides/convert-milliseconds-to-date.html
  '/guides/pt/convert-milliseconds-to-date.html',
  '/guides/es/convert-milliseconds-to-date.html',
  '/guides/vi/convert-milliseconds-to-date.html',
  '/guides/id/convert-milliseconds-to-date.html',
  '/guides/de/convert-milliseconds-to-date.html',
  // plan-warm-pascal-v3 S2 batch 3 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/lcd-screen-test.html', '/guides/es/lcd-screen-test.html', '/guides/vi/lcd-screen-test.html', '/guides/id/lcd-screen-test.html', '/guides/de/lcd-screen-test.html',
  '/guides/pt/hd-video-converter-when.html', '/guides/es/hd-video-converter-when.html', '/guides/vi/hd-video-converter-when.html', '/guides/id/hd-video-converter-when.html', '/guides/de/hd-video-converter-when.html',
  '/guides/pt/json-formatter-when.html', '/guides/es/json-formatter-when.html', '/guides/vi/json-formatter-when.html', '/guides/id/json-formatter-when.html', '/guides/de/json-formatter-when.html',
  // plan-warm-pascal-v3 S2 batch 4 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/zip-file-converter.html', '/guides/es/zip-file-converter.html', '/guides/vi/zip-file-converter.html', '/guides/id/zip-file-converter.html', '/guides/de/zip-file-converter.html',
  '/guides/pt/online-zip-file-compressor.html', '/guides/es/online-zip-file-compressor.html', '/guides/vi/online-zip-file-compressor.html', '/guides/id/online-zip-file-compressor.html', '/guides/de/online-zip-file-compressor.html',
  '/guides/pt/led-test.html', '/guides/es/led-test.html', '/guides/vi/led-test.html', '/guides/id/led-test.html', '/guides/de/led-test.html',
  // plan-warm-pascal-v3 S2 batch 5 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/hd-video-converter-step-by-step.html', '/guides/es/hd-video-converter-step-by-step.html', '/guides/vi/hd-video-converter-step-by-step.html', '/guides/id/hd-video-converter-step-by-step.html', '/guides/de/hd-video-converter-step-by-step.html',
  '/guides/pt/compress-zip-file-to-smaller-size.html', '/guides/es/compress-zip-file-to-smaller-size.html', '/guides/vi/compress-zip-file-to-smaller-size.html', '/guides/id/compress-zip-file-to-smaller-size.html', '/guides/de/compress-zip-file-to-smaller-size.html',
  '/guides/pt/hd-video-converter-vs-alternatives.html', '/guides/es/hd-video-converter-vs-alternatives.html', '/guides/vi/hd-video-converter-vs-alternatives.html', '/guides/id/hd-video-converter-vs-alternatives.html', '/guides/de/hd-video-converter-vs-alternatives.html',
  // plan-warm-pascal-v3 S2 batch 6 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/compress-zip.html', '/guides/es/compress-zip.html', '/guides/vi/compress-zip.html', '/guides/id/compress-zip.html', '/guides/de/compress-zip.html',
  '/guides/pt/gif-into-frames.html', '/guides/es/gif-into-frames.html', '/guides/vi/gif-into-frames.html', '/guides/id/gif-into-frames.html', '/guides/de/gif-into-frames.html',
  '/guides/pt/reduce-zip-file-size-online.html', '/guides/es/reduce-zip-file-size-online.html', '/guides/vi/reduce-zip-file-size-online.html', '/guides/id/reduce-zip-file-size-online.html', '/guides/de/reduce-zip-file-size-online.html',
  // plan-warm-pascal-v3 S2 batch 7 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/json-formatter-step-by-step.html', '/guides/es/json-formatter-step-by-step.html', '/guides/vi/json-formatter-step-by-step.html', '/guides/id/json-formatter-step-by-step.html', '/guides/de/json-formatter-step-by-step.html',
  '/guides/pt/zip-compress.html', '/guides/es/zip-compress.html', '/guides/vi/zip-compress.html', '/guides/id/zip-compress.html', '/guides/de/zip-compress.html',
  '/guides/pt/json-formatter-vs-alternatives.html', '/guides/es/json-formatter-vs-alternatives.html', '/guides/vi/json-formatter-vs-alternatives.html', '/guides/id/json-formatter-vs-alternatives.html', '/guides/de/json-formatter-vs-alternatives.html',
  // plan-warm-pascal-v3 S2 batch 8 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/unlock-zip-file-online.html', '/guides/es/unlock-zip-file-online.html', '/guides/vi/unlock-zip-file-online.html', '/guides/id/unlock-zip-file-online.html', '/guides/de/unlock-zip-file-online.html',
  '/guides/pt/how-to-zip-multiple-files-into-one.html', '/guides/es/how-to-zip-multiple-files-into-one.html', '/guides/vi/how-to-zip-multiple-files-into-one.html', '/guides/id/how-to-zip-multiple-files-into-one.html', '/guides/de/how-to-zip-multiple-files-into-one.html',
  '/guides/pt/crop-and-rotate-image.html', '/guides/es/crop-and-rotate-image.html', '/guides/vi/crop-and-rotate-image.html', '/guides/id/crop-and-rotate-image.html', '/guides/de/crop-and-rotate-image.html',
  // plan-warm-pascal-v3 S2 batch 9 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/how-to-compress-zip-file-to-smaller-size.html', '/guides/es/how-to-compress-zip-file-to-smaller-size.html', '/guides/vi/how-to-compress-zip-file-to-smaller-size.html', '/guides/id/how-to-compress-zip-file-to-smaller-size.html', '/guides/de/how-to-compress-zip-file-to-smaller-size.html',
  '/guides/pt/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html', '/guides/es/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html', '/guides/vi/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html', '/guides/id/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html', '/guides/de/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html',
  '/guides/pt/how-to-check-camera-quality-on-your-phone.html', '/guides/es/how-to-check-camera-quality-on-your-phone.html', '/guides/vi/how-to-check-camera-quality-on-your-phone.html', '/guides/id/how-to-check-camera-quality-on-your-phone.html', '/guides/de/how-to-check-camera-quality-on-your-phone.html',
  // plan-warm-pascal-v3 S2 batch 10 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/online-zip-vs-7z-vs-rar-which-to-pick.html', '/guides/es/online-zip-vs-7z-vs-rar-which-to-pick.html', '/guides/vi/online-zip-vs-7z-vs-rar-which-to-pick.html', '/guides/id/online-zip-vs-7z-vs-rar-which-to-pick.html', '/guides/de/online-zip-vs-7z-vs-rar-which-to-pick.html',
  '/guides/pt/jpg-vs-jpeg-are-they-the-same.html', '/guides/es/jpg-vs-jpeg-are-they-the-same.html', '/guides/vi/jpg-vs-jpeg-are-they-the-same.html', '/guides/id/jpg-vs-jpeg-are-they-the-same.html', '/guides/de/jpg-vs-jpeg-are-they-the-same.html',
  '/guides/pt/iphone-photo-format-explained-heic-jpg-png-raw.html', '/guides/es/iphone-photo-format-explained-heic-jpg-png-raw.html', '/guides/vi/iphone-photo-format-explained-heic-jpg-png-raw.html', '/guides/id/iphone-photo-format-explained-heic-jpg-png-raw.html', '/guides/de/iphone-photo-format-explained-heic-jpg-png-raw.html',
  // plan-warm-pascal-v3 S2 batch 11 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/zip-size-reducer.html', '/guides/es/zip-size-reducer.html', '/guides/vi/zip-size-reducer.html', '/guides/id/zip-size-reducer.html', '/guides/de/zip-size-reducer.html',
  '/guides/pt/zip-folder-online-free.html', '/guides/es/zip-folder-online-free.html', '/guides/vi/zip-folder-online-free.html', '/guides/id/zip-folder-online-free.html', '/guides/de/zip-folder-online-free.html',
  '/guides/pt/svg-to-png-when-to-rasterize-an-svg.html', '/guides/es/svg-to-png-when-to-rasterize-an-svg.html', '/guides/vi/svg-to-png-when-to-rasterize-an-svg.html', '/guides/id/svg-to-png-when-to-rasterize-an-svg.html', '/guides/de/svg-to-png-when-to-rasterize-an-svg.html',
  // plan-warm-pascal-v3 S2 batch 12 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/compress-zip-size.html', '/guides/es/compress-zip-size.html', '/guides/vi/compress-zip-size.html', '/guides/id/compress-zip-size.html', '/guides/de/compress-zip-size.html',
  '/guides/pt/create-zip-file-online.html', '/guides/es/create-zip-file-online.html', '/guides/vi/create-zip-file-online.html', '/guides/id/create-zip-file-online.html', '/guides/de/create-zip-file-online.html',
  '/guides/pt/css-minifier-vs-compressor.html', '/guides/es/css-minifier-vs-compressor.html', '/guides/vi/css-minifier-vs-compressor.html', '/guides/id/css-minifier-vs-compressor.html', '/guides/de/css-minifier-vs-compressor.html',
  // plan-warm-pascal-v3 S2 batch 13 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/compress-folder-online.html', '/guides/es/compress-folder-online.html', '/guides/vi/compress-folder-online.html', '/guides/id/compress-folder-online.html', '/guides/de/compress-folder-online.html',
  '/guides/pt/csv-vs-json-data-formats.html', '/guides/es/csv-vs-json-data-formats.html', '/guides/vi/csv-vs-json-data-formats.html', '/guides/id/csv-vs-json-data-formats.html', '/guides/de/csv-vs-json-data-formats.html',
  '/guides/pt/dead-pixel-testing-guide.html', '/guides/es/dead-pixel-testing-guide.html', '/guides/vi/dead-pixel-testing-guide.html', '/guides/id/dead-pixel-testing-guide.html', '/guides/de/dead-pixel-testing-guide.html',
  // plan-warm-pascal-v3 S2 batch 14 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/current-millis.html', '/guides/es/current-millis.html', '/guides/vi/current-millis.html', '/guides/id/current-millis.html', '/guides/de/current-millis.html',
  '/guides/pt/camera-check.html', '/guides/es/camera-check.html', '/guides/vi/camera-check.html', '/guides/id/camera-check.html', '/guides/de/camera-check.html',
  '/guides/pt/compress-jpeg-without-losing-quality-quality-vs-size.html', '/guides/es/compress-jpeg-without-losing-quality-quality-vs-size.html', '/guides/vi/compress-jpeg-without-losing-quality-quality-vs-size.html', '/guides/id/compress-jpeg-without-losing-quality-quality-vs-size.html', '/guides/de/compress-jpeg-without-losing-quality-quality-vs-size.html',
  // plan-warm-pascal-v3 S2 batch 15 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/current-time-in-milliseconds.html', '/guides/es/current-time-in-milliseconds.html', '/guides/vi/current-time-in-milliseconds.html', '/guides/id/current-time-in-milliseconds.html', '/guides/de/current-time-in-milliseconds.html',
  // Cycle 20260703-4 create_new_guide_page - "time in ms" (utility cluster, companion to /get-time-in-millisecond.html). 5 locale variants.
  '/guides/pt/time-in-ms.html', '/guides/es/time-in-ms.html', '/guides/vi/time-in-ms.html', '/guides/id/time-in-ms.html', '/guides/de/time-in-ms.html',
  '/guides/pt/camera-mirror-vs-flip-explained.html', '/guides/es/camera-mirror-vs-flip-explained.html', '/guides/vi/camera-mirror-vs-flip-explained.html', '/guides/id/camera-mirror-vs-flip-explained.html', '/guides/de/camera-mirror-vs-flip-explained.html',
  '/guides/pt/compressed-jpg-looks-blurry-three-causes.html', '/guides/es/compressed-jpg-looks-blurry-three-causes.html', '/guides/vi/compressed-jpg-looks-blurry-three-causes.html', '/guides/id/compressed-jpg-looks-blurry-three-causes.html', '/guides/de/compressed-jpg-looks-blurry-three-causes.html',
  // plan-warm-pascal-v3 S2 batch 16 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/camera-test-permission-blocked-how-to-allow-it.html', '/guides/es/camera-test-permission-blocked-how-to-allow-it.html', '/guides/vi/camera-test-permission-blocked-how-to-allow-it.html', '/guides/id/camera-test-permission-blocked-how-to-allow-it.html', '/guides/de/camera-test-permission-blocked-how-to-allow-it.html',
  '/guides/pt/css-minifier-vs-uglifier-vs-tree-shaking.html', '/guides/es/css-minifier-vs-uglifier-vs-tree-shaking.html', '/guides/vi/css-minifier-vs-uglifier-vs-tree-shaking.html', '/guides/id/css-minifier-vs-uglifier-vs-tree-shaking.html', '/guides/de/css-minifier-vs-uglifier-vs-tree-shaking.html',
  '/guides/pt/download-link-not-appearing-after-conversion-five-fixes.html', '/guides/es/download-link-not-appearing-after-conversion-five-fixes.html', '/guides/vi/download-link-not-appearing-after-conversion-five-fixes.html', '/guides/id/download-link-not-appearing-after-conversion-five-fixes.html', '/guides/de/download-link-not-appearing-after-conversion-five-fixes.html',
  // plan-warm-pascal-v3 S2 batch 17 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/camera-test-vs-webcam-test-which-do-you-need.html', '/guides/es/camera-test-vs-webcam-test-which-do-you-need.html', '/guides/vi/camera-test-vs-webcam-test-which-do-you-need.html', '/guides/id/camera-test-vs-webcam-test-which-do-you-need.html', '/guides/de/camera-test-vs-webcam-test-which-do-you-need.html',
  // Cycle 20260610-13 - LCD test for laptop screens (device-test) - 5 locale variants
  '/guides/pt/lcd-test-laptop.html', '/guides/es/lcd-test-laptop.html', '/guides/vi/lcd-test-laptop.html', '/guides/id/lcd-test-laptop.html', '/guides/de/lcd-test-laptop.html',
  '/guides/pt/device-test-checklist-for-remote-work.html', '/guides/es/device-test-checklist-for-remote-work.html', '/guides/vi/device-test-checklist-for-remote-work.html', '/guides/id/device-test-checklist-for-remote-work.html', '/guides/de/device-test-checklist-for-remote-work.html',
  '/guides/pt/before-a-video-call-which-tools-to-run.html', '/guides/es/before-a-video-call-which-tools-to-run.html', '/guides/vi/before-a-video-call-which-tools-to-run.html', '/guides/id/before-a-video-call-which-tools-to-run.html', '/guides/de/before-a-video-call-which-tools-to-run.html',
  // plan-warm-pascal-v3 S2 batch 18 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/extract-gif-frames-png-vs-jpg-which-format.html', '/guides/es/extract-gif-frames-png-vs-jpg-which-format.html', '/guides/vi/extract-gif-frames-png-vs-jpg-which-format.html', '/guides/id/extract-gif-frames-png-vs-jpg-which-format.html', '/guides/de/extract-gif-frames-png-vs-jpg-which-format.html',
  '/guides/pt/how-to-compress-a-file-online.html', '/guides/es/how-to-compress-a-file-online.html', '/guides/vi/how-to-compress-a-file-online.html', '/guides/id/how-to-compress-a-file-online.html', '/guides/de/how-to-compress-a-file-online.html',
  '/guides/pt/ffmpeg-online-conversion-stalled-three-fixes.html', '/guides/es/ffmpeg-online-conversion-stalled-three-fixes.html', '/guides/vi/ffmpeg-online-conversion-stalled-three-fixes.html', '/guides/id/ffmpeg-online-conversion-stalled-three-fixes.html', '/guides/de/ffmpeg-online-conversion-stalled-three-fixes.html',
  // plan-warm-pascal-v3 S2 batch 19 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/camera-test-shows-black-screen-four-fixes.html', '/guides/es/camera-test-shows-black-screen-four-fixes.html', '/guides/vi/camera-test-shows-black-screen-four-fixes.html', '/guides/id/camera-test-shows-black-screen-four-fixes.html', '/guides/de/camera-test-shows-black-screen-four-fixes.html',
  '/guides/pt/file-compressor.html', '/guides/es/file-compressor.html', '/guides/vi/file-compressor.html', '/guides/id/file-compressor.html', '/guides/de/file-compressor.html',
  '/guides/pt/gif-frame-extractor.html', '/guides/es/gif-frame-extractor.html', '/guides/vi/gif-frame-extractor.html', '/guides/id/gif-frame-extractor.html', '/guides/de/gif-frame-extractor.html',
  // Cycle 20260610-12 P12.D - 5 locale variants for gif-to-frames-converter
  '/guides/pt/gif-to-frames-converter.html', '/guides/es/gif-to-frames-converter.html', '/guides/vi/gif-to-frames-converter.html', '/guides/id/gif-to-frames-converter.html', '/guides/de/gif-to-frames-converter.html',
  // Cycle 20260610-14 - 5 locale variants for gif-to-frame
  '/guides/pt/gif-to-frame.html', '/guides/es/gif-to-frame.html', '/guides/vi/gif-to-frame.html', '/guides/id/gif-to-frame.html', '/guides/de/gif-to-frame.html',
  // plan-warm-pascal-v3 S2 batch 20 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/how-to-choose-a-compression-level.html', '/guides/es/how-to-choose-a-compression-level.html', '/guides/vi/how-to-choose-a-compression-level.html', '/guides/id/how-to-choose-a-compression-level.html', '/guides/de/how-to-choose-a-compression-level.html',
  '/guides/pt/heic-vs-jpg-vs-webp.html', '/guides/es/heic-vs-jpg-vs-webp.html', '/guides/vi/heic-vs-jpg-vs-webp.html', '/guides/id/heic-vs-jpg-vs-webp.html', '/guides/de/heic-vs-jpg-vs-webp.html',
  '/guides/pt/ffmpeg-online-vs-video-converter-which-to-pick.html', '/guides/es/ffmpeg-online-vs-video-converter-which-to-pick.html', '/guides/vi/ffmpeg-online-vs-video-converter-which-to-pick.html', '/guides/id/ffmpeg-online-vs-video-converter-which-to-pick.html', '/guides/de/ffmpeg-online-vs-video-converter-which-to-pick.html',
  // plan-warm-pascal-v3 S2 batch 21 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/base64-when-to-use-and-when-not-to.html', '/guides/es/base64-when-to-use-and-when-not-to.html', '/guides/vi/base64-when-to-use-and-when-not-to.html', '/guides/id/base64-when-to-use-and-when-not-to.html', '/guides/de/base64-when-to-use-and-when-not-to.html',
  '/guides/pt/how-to-check-webcam-and-microphone-before-an-interview.html', '/guides/es/how-to-check-webcam-and-microphone-before-an-interview.html', '/guides/vi/how-to-check-webcam-and-microphone-before-an-interview.html', '/guides/id/how-to-check-webcam-and-microphone-before-an-interview.html', '/guides/de/how-to-check-webcam-and-microphone-before-an-interview.html',
  '/guides/pt/how-to-compress-a-folder.html', '/guides/es/how-to-compress-a-folder.html', '/guides/vi/how-to-compress-a-folder.html', '/guides/id/how-to-compress-a-folder.html', '/guides/de/how-to-compress-a-folder.html',
  // plan-warm-pascal-v3 S2 batch 22 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/compress-zip-file-to-100kb.html', '/guides/es/compress-zip-file-to-100kb.html', '/guides/vi/compress-zip-file-to-100kb.html', '/guides/id/compress-zip-file-to-100kb.html', '/guides/de/compress-zip-file-to-100kb.html',
  '/guides/pt/gif-frames-extract-vs-frame-rate-fps-explained.html', '/guides/es/gif-frames-extract-vs-frame-rate-fps-explained.html', '/guides/vi/gif-frames-extract-vs-frame-rate-fps-explained.html', '/guides/id/gif-frames-extract-vs-frame-rate-fps-explained.html', '/guides/de/gif-frames-extract-vs-frame-rate-fps-explained.html',
  '/guides/pt/heic-vs-jpg-converter-when-each-wins.html', '/guides/es/heic-vs-jpg-converter-when-each-wins.html', '/guides/vi/heic-vs-jpg-converter-when-each-wins.html', '/guides/id/heic-vs-jpg-converter-when-each-wins.html', '/guides/de/heic-vs-jpg-converter-when-each-wins.html',
  // plan-warm-pascal-v3 S2 batch 23 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/compress-zip-file-to-2mb.html', '/guides/es/compress-zip-file-to-2mb.html', '/guides/vi/compress-zip-file-to-2mb.html', '/guides/id/compress-zip-file-to-2mb.html', '/guides/de/compress-zip-file-to-2mb.html',
  '/guides/pt/folder-to-zip.html', '/guides/es/folder-to-zip.html', '/guides/vi/folder-to-zip.html', '/guides/id/folder-to-zip.html', '/guides/de/folder-to-zip.html',
  '/guides/pt/css-unminifier-vs-prettier-when-to-use-each.html', '/guides/es/css-unminifier-vs-prettier-when-to-use-each.html', '/guides/vi/css-unminifier-vs-prettier-when-to-use-each.html', '/guides/id/css-unminifier-vs-prettier-when-to-use-each.html', '/guides/de/css-unminifier-vs-prettier-when-to-use-each.html',
  // plan-warm-pascal-v3 S2 batch 24 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html', '/guides/es/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html', '/guides/vi/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html', '/guides/id/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html', '/guides/de/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html',
  '/guides/pt/file-compressor-vs-zip-what-to-pick.html', '/guides/es/file-compressor-vs-zip-what-to-pick.html', '/guides/vi/file-compressor-vs-zip-what-to-pick.html', '/guides/id/file-compressor-vs-zip-what-to-pick.html', '/guides/de/file-compressor-vs-zip-what-to-pick.html',
  '/guides/pt/how-to-compress-a-folder-for-email.html', '/guides/es/how-to-compress-a-folder-for-email.html', '/guides/vi/how-to-compress-a-folder-for-email.html', '/guides/id/how-to-compress-a-folder-for-email.html', '/guides/de/how-to-compress-a-folder-for-email.html',
  // plan-warm-pascal-v3 S2 batch 25 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/gif-frame-extractor-output-looks-wrong-three-causes.html', '/guides/es/gif-frame-extractor-output-looks-wrong-three-causes.html', '/guides/vi/gif-frame-extractor-output-looks-wrong-three-causes.html', '/guides/id/gif-frame-extractor-output-looks-wrong-three-causes.html', '/guides/de/gif-frame-extractor-output-looks-wrong-three-causes.html',
  '/guides/pt/heic-to-jpg-claims-what-actually-works.html', '/guides/es/heic-to-jpg-claims-what-actually-works.html', '/guides/vi/heic-to-jpg-claims-what-actually-works.html', '/guides/id/heic-to-jpg-claims-what-actually-works.html', '/guides/de/heic-to-jpg-claims-what-actually-works.html',
  '/guides/pt/how-to-compress-a-jpg-for-email-attachment-limits.html', '/guides/es/how-to-compress-a-jpg-for-email-attachment-limits.html', '/guides/vi/how-to-compress-a-jpg-for-email-attachment-limits.html', '/guides/id/how-to-compress-a-jpg-for-email-attachment-limits.html', '/guides/de/how-to-compress-a-jpg-for-email-attachment-limits.html',
  // plan-warm-pascal-v3 S2 batch 26 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/free-online-tools-that-work-without-uploading-files.html', '/guides/es/free-online-tools-that-work-without-uploading-files.html', '/guides/vi/free-online-tools-that-work-without-uploading-files.html', '/guides/id/free-online-tools-that-work-without-uploading-files.html', '/guides/de/free-online-tools-that-work-without-uploading-files.html',
  '/guides/pt/how-to-compress-a-zip-file.html', '/guides/es/how-to-compress-a-zip-file.html', '/guides/vi/how-to-compress-a-zip-file.html', '/guides/id/how-to-compress-a-zip-file.html', '/guides/de/how-to-compress-a-zip-file.html',
  '/guides/pt/jpg-vs-png-for-web.html', '/guides/es/jpg-vs-png-for-web.html', '/guides/vi/jpg-vs-png-for-web.html', '/guides/id/jpg-vs-png-for-web.html', '/guides/de/jpg-vs-png-for-web.html',
  // plan-warm-pascal-v3 S2 batch 27 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/how-to-extract-a-file-online-zip-rar-7z.html', '/guides/es/how-to-extract-a-file-online-zip-rar-7z.html', '/guides/vi/how-to-extract-a-file-online-zip-rar-7z.html', '/guides/id/how-to-extract-a-file-online-zip-rar-7z.html', '/guides/de/how-to-extract-a-file-online-zip-rar-7z.html',
  '/guides/pt/how-to-test-a-keyboard-online-step-by-step.html', '/guides/es/how-to-test-a-keyboard-online-step-by-step.html', '/guides/vi/how-to-test-a-keyboard-online-step-by-step.html', '/guides/id/how-to-test-a-keyboard-online-step-by-step.html', '/guides/de/how-to-test-a-keyboard-online-step-by-step.html',
  '/guides/pt/how-to-tell-if-a-jpg-was-compressed-too-much.html', '/guides/es/how-to-tell-if-a-jpg-was-compressed-too-much.html', '/guides/vi/how-to-tell-if-a-jpg-was-compressed-too-much.html', '/guides/id/how-to-tell-if-a-jpg-was-compressed-too-much.html', '/guides/de/how-to-tell-if-a-jpg-was-compressed-too-much.html',
  // plan-warm-pascal-v3 S2 batch 28 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/how-to-convert-heic-to-jpg-step-by-step.html', '/guides/es/how-to-convert-heic-to-jpg-step-by-step.html', '/guides/vi/how-to-convert-heic-to-jpg-step-by-step.html', '/guides/id/how-to-convert-heic-to-jpg-step-by-step.html', '/guides/de/how-to-convert-heic-to-jpg-step-by-step.html',
  '/guides/pt/how-to-test-a-touchscreen-for-bad-spots.html', '/guides/es/how-to-test-a-touchscreen-for-bad-spots.html', '/guides/vi/how-to-test-a-touchscreen-for-bad-spots.html', '/guides/id/how-to-test-a-touchscreen-for-bad-spots.html', '/guides/de/how-to-test-a-touchscreen-for-bad-spots.html',
  '/guides/pt/how-to-minify-css-js-for-cloud-run-cold-start.html', '/guides/es/how-to-minify-css-js-for-cloud-run-cold-start.html', '/guides/vi/how-to-minify-css-js-for-cloud-run-cold-start.html', '/guides/id/how-to-minify-css-js-for-cloud-run-cold-start.html', '/guides/de/how-to-minify-css-js-for-cloud-run-cold-start.html',
  // plan-warm-pascal-v3 S2 batch 29 (2026-05-30) - 5 locale variants × 3 guides; CROSSES 50% MILESTONE
  '/guides/pt/how-to-flatten-a-pdf-and-when-to-do-it.html', '/guides/es/how-to-flatten-a-pdf-and-when-to-do-it.html', '/guides/vi/how-to-flatten-a-pdf-and-when-to-do-it.html', '/guides/id/how-to-flatten-a-pdf-and-when-to-do-it.html', '/guides/de/how-to-flatten-a-pdf-and-when-to-do-it.html',
  '/guides/pt/how-to-crop-and-rotate-an-image.html', '/guides/es/how-to-crop-and-rotate-an-image.html', '/guides/vi/how-to-crop-and-rotate-an-image.html', '/guides/id/how-to-crop-and-rotate-an-image.html', '/guides/de/how-to-crop-and-rotate-an-image.html',
  '/guides/pt/how-to-compress-a-zip-file-to-a-specific-size.html', '/guides/es/how-to-compress-a-zip-file-to-a-specific-size.html', '/guides/vi/how-to-compress-a-zip-file-to-a-specific-size.html', '/guides/id/how-to-compress-a-zip-file-to-a-specific-size.html', '/guides/de/how-to-compress-a-zip-file-to-a-specific-size.html',
  // plan-warm-pascal-v3 S2 batch 30 (2026-05-30) - 5 locale variants × 3 guides; PAST 50% R14 threshold
  '/guides/pt/how-to-sign-pdf-after-removing-a-password.html', '/guides/es/how-to-sign-pdf-after-removing-a-password.html', '/guides/vi/how-to-sign-pdf-after-removing-a-password.html', '/guides/id/how-to-sign-pdf-after-removing-a-password.html', '/guides/de/how-to-sign-pdf-after-removing-a-password.html',
  '/guides/pt/how-to-test-for-dead-pixels-before-returning-a-monitor.html', '/guides/es/how-to-test-for-dead-pixels-before-returning-a-monitor.html', '/guides/vi/how-to-test-for-dead-pixels-before-returning-a-monitor.html', '/guides/id/how-to-test-for-dead-pixels-before-returning-a-monitor.html', '/guides/de/how-to-test-for-dead-pixels-before-returning-a-monitor.html',
  '/guides/pt/image-to-base64-embed-in-html-vs-link.html', '/guides/es/image-to-base64-embed-in-html-vs-link.html', '/guides/vi/image-to-base64-embed-in-html-vs-link.html', '/guides/id/image-to-base64-embed-in-html-vs-link.html', '/guides/de/image-to-base64-embed-in-html-vs-link.html',
  // plan-warm-pascal-v3 S2 batch 31 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/mp4-vs-mov-vs-mkv-which-container-when.html', '/guides/es/mp4-vs-mov-vs-mkv-which-container-when.html', '/guides/vi/mp4-vs-mov-vs-mkv-which-container-when.html', '/guides/id/mp4-vs-mov-vs-mkv-which-container-when.html', '/guides/de/mp4-vs-mov-vs-mkv-which-container-when.html',
  '/guides/pt/pdf-password-types-owner-vs-user.html', '/guides/es/pdf-password-types-owner-vs-user.html', '/guides/vi/pdf-password-types-owner-vs-user.html', '/guides/id/pdf-password-types-owner-vs-user.html', '/guides/de/pdf-password-types-owner-vs-user.html',
  '/guides/pt/png-to-svg-when-to-vectorize-a-raster-image.html', '/guides/es/png-to-svg-when-to-vectorize-a-raster-image.html', '/guides/vi/png-to-svg-when-to-vectorize-a-raster-image.html', '/guides/id/png-to-svg-when-to-vectorize-a-raster-image.html', '/guides/de/png-to-svg-when-to-vectorize-a-raster-image.html',
  // plan-warm-pascal-v3 S2 batch 32 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/microphone-test-online-what-it-actually-checks.html', '/guides/es/microphone-test-online-what-it-actually-checks.html', '/guides/vi/microphone-test-online-what-it-actually-checks.html', '/guides/id/microphone-test-online-what-it-actually-checks.html', '/guides/de/microphone-test-online-what-it-actually-checks.html',
  '/guides/pt/unix-timestamps-explained.html', '/guides/es/unix-timestamps-explained.html', '/guides/vi/unix-timestamps-explained.html', '/guides/id/unix-timestamps-explained.html', '/guides/de/unix-timestamps-explained.html',
  '/guides/pt/why-heic-wont-open-on-windows-three-fixes.html', '/guides/es/why-heic-wont-open-on-windows-three-fixes.html', '/guides/vi/why-heic-wont-open-on-windows-three-fixes.html', '/guides/id/why-heic-wont-open-on-windows-three-fixes.html', '/guides/de/why-heic-wont-open-on-windows-three-fixes.html',
  // plan-warm-pascal-v3 S2 batch 33 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/imagemagick-online-vs-task-specific-tools-which-to-pick.html', '/guides/es/imagemagick-online-vs-task-specific-tools-which-to-pick.html', '/guides/vi/imagemagick-online-vs-task-specific-tools-which-to-pick.html', '/guides/id/imagemagick-online-vs-task-specific-tools-which-to-pick.html', '/guides/de/imagemagick-online-vs-task-specific-tools-which-to-pick.html',
  '/guides/pt/json-parser-validate-vs-format-vs-tree-view.html', '/guides/es/json-parser-validate-vs-format-vs-tree-view.html', '/guides/vi/json-parser-validate-vs-format-vs-tree-view.html', '/guides/id/json-parser-validate-vs-format-vs-tree-view.html', '/guides/de/json-parser-validate-vs-format-vs-tree-view.html',
  '/guides/pt/pdf-editing-ladder.html', '/guides/es/pdf-editing-ladder.html', '/guides/vi/pdf-editing-ladder.html', '/guides/id/pdf-editing-ladder.html', '/guides/de/pdf-editing-ladder.html',
  // plan-warm-pascal-v3 S2 batch 34 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/keyboard-tester-online-rollover-vs-anti-ghosting.html', '/guides/es/keyboard-tester-online-rollover-vs-anti-ghosting.html', '/guides/vi/keyboard-tester-online-rollover-vs-anti-ghosting.html', '/guides/id/keyboard-tester-online-rollover-vs-anti-ghosting.html', '/guides/de/keyboard-tester-online-rollover-vs-anti-ghosting.html',
  '/guides/pt/mp4-vs-webm-for-web.html', '/guides/es/mp4-vs-webm-for-web.html', '/guides/vi/mp4-vs-webm-for-web.html', '/guides/id/mp4-vs-webm-for-web.html', '/guides/de/mp4-vs-webm-for-web.html',
  '/guides/pt/png-vs-svg-when-to-use.html', '/guides/es/png-vs-svg-when-to-use.html', '/guides/vi/png-vs-svg-when-to-use.html', '/guides/id/png-vs-svg-when-to-use.html', '/guides/de/png-vs-svg-when-to-use.html',
  // plan-warm-pascal-v3 S2 batch 35 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/json-vs-yaml-vs-toml-config-formats-explained.html', '/guides/es/json-vs-yaml-vs-toml-config-formats-explained.html', '/guides/vi/json-vs-yaml-vs-toml-config-formats-explained.html', '/guides/id/json-vs-yaml-vs-toml-config-formats-explained.html', '/guides/de/json-vs-yaml-vs-toml-config-formats-explained.html',
  '/guides/pt/pdf-preflight-online-what-it-actually-checks.html', '/guides/es/pdf-preflight-online-what-it-actually-checks.html', '/guides/vi/pdf-preflight-online-what-it-actually-checks.html', '/guides/id/pdf-preflight-online-what-it-actually-checks.html', '/guides/de/pdf-preflight-online-what-it-actually-checks.html',
  '/guides/pt/recover-corrupt-zip-file-options.html', '/guides/es/recover-corrupt-zip-file-options.html', '/guides/vi/recover-corrupt-zip-file-options.html', '/guides/id/recover-corrupt-zip-file-options.html', '/guides/de/recover-corrupt-zip-file-options.html',
  // plan-warm-pascal-v3 S2 batch 36 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/how-to-extract-frames-from-a-gif-for-a-social-post.html', '/guides/es/how-to-extract-frames-from-a-gif-for-a-social-post.html', '/guides/vi/how-to-extract-frames-from-a-gif-for-a-social-post.html', '/guides/id/how-to-extract-frames-from-a-gif-for-a-social-post.html', '/guides/de/how-to-extract-frames-from-a-gif-for-a-social-post.html',
  '/guides/pt/keyboard-test-keys-not-detected-four-fixes.html', '/guides/es/keyboard-test-keys-not-detected-four-fixes.html', '/guides/vi/keyboard-test-keys-not-detected-four-fixes.html', '/guides/id/keyboard-test-keys-not-detected-four-fixes.html', '/guides/de/keyboard-test-keys-not-detected-four-fixes.html',
  '/guides/pt/pdf-vs-heic-for-document-archival.html', '/guides/es/pdf-vs-heic-for-document-archival.html', '/guides/vi/pdf-vs-heic-for-document-archival.html', '/guides/id/pdf-vs-heic-for-document-archival.html', '/guides/de/pdf-vs-heic-for-document-archival.html',
  // plan-warm-pascal-v3 S2 batch 37 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/microphone-test-no-sound-four-fixes.html', '/guides/es/microphone-test-no-sound-four-fixes.html', '/guides/vi/microphone-test-no-sound-four-fixes.html', '/guides/id/microphone-test-no-sound-four-fixes.html', '/guides/de/microphone-test-no-sound-four-fixes.html',
  '/guides/pt/why-md5-cannot-be-decrypted.html', '/guides/es/why-md5-cannot-be-decrypted.html', '/guides/vi/why-md5-cannot-be-decrypted.html', '/guides/id/why-md5-cannot-be-decrypted.html', '/guides/de/why-md5-cannot-be-decrypted.html',
  '/guides/pt/how-to-convert-100-heic-photos-to-jpg.html', '/guides/es/how-to-convert-100-heic-photos-to-jpg.html', '/guides/vi/how-to-convert-100-heic-photos-to-jpg.html', '/guides/id/how-to-convert-100-heic-photos-to-jpg.html', '/guides/de/how-to-convert-100-heic-photos-to-jpg.html',
  // plan-warm-pascal-v3 S2 batch 38 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/zip-password-types-strong-vs-weak-explained.html', '/guides/es/zip-password-types-strong-vs-weak-explained.html', '/guides/vi/zip-password-types-strong-vs-weak-explained.html', '/guides/id/zip-password-types-strong-vs-weak-explained.html', '/guides/de/zip-password-types-strong-vs-weak-explained.html',
  '/guides/pt/md5-vs-sha256-when-to-hash.html', '/guides/es/md5-vs-sha256-when-to-hash.html', '/guides/vi/md5-vs-sha256-when-to-hash.html', '/guides/id/md5-vs-sha256-when-to-hash.html', '/guides/de/md5-vs-sha256-when-to-hash.html',
  '/guides/pt/how-to-convert-iphone-photo-to-jpg.html', '/guides/es/how-to-convert-iphone-photo-to-jpg.html', '/guides/vi/how-to-convert-iphone-photo-to-jpg.html', '/guides/id/how-to-convert-iphone-photo-to-jpg.html', '/guides/de/how-to-convert-iphone-photo-to-jpg.html',
  // plan-warm-pascal-v3 S2 batch 39 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/microphone-test-permission-blocked-how-to-allow-it.html', '/guides/es/microphone-test-permission-blocked-how-to-allow-it.html', '/guides/vi/microphone-test-permission-blocked-how-to-allow-it.html', '/guides/id/microphone-test-permission-blocked-how-to-allow-it.html', '/guides/de/microphone-test-permission-blocked-how-to-allow-it.html',
  '/guides/pt/qr-code-error-correction-and-scan-failures.html', '/guides/es/qr-code-error-correction-and-scan-failures.html', '/guides/vi/qr-code-error-correction-and-scan-failures.html', '/guides/id/qr-code-error-correction-and-scan-failures.html', '/guides/de/qr-code-error-correction-and-scan-failures.html',
  '/guides/pt/how-to-split-a-gif-into-frames-for-editing.html', '/guides/es/how-to-split-a-gif-into-frames-for-editing.html', '/guides/vi/how-to-split-a-gif-into-frames-for-editing.html', '/guides/id/how-to-split-a-gif-into-frames-for-editing.html', '/guides/de/how-to-split-a-gif-into-frames-for-editing.html',
  // plan-warm-pascal-v3 S2 batch 40 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/microphone-test-online-quiet-normal-peak-meter.html', '/guides/es/microphone-test-online-quiet-normal-peak-meter.html', '/guides/vi/microphone-test-online-quiet-normal-peak-meter.html', '/guides/id/microphone-test-online-quiet-normal-peak-meter.html', '/guides/de/microphone-test-online-quiet-normal-peak-meter.html',
  '/guides/pt/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html', '/guides/es/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html', '/guides/vi/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html', '/guides/id/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html', '/guides/de/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html',
  '/guides/pt/photo-editor-vs-graphics-app-vs-batch-processor.html', '/guides/es/photo-editor-vs-graphics-app-vs-batch-processor.html', '/guides/vi/photo-editor-vs-graphics-app-vs-batch-processor.html', '/guides/id/photo-editor-vs-graphics-app-vs-batch-processor.html', '/guides/de/photo-editor-vs-graphics-app-vs-batch-processor.html',
  // plan-warm-pascal-v3 S2 batch 41 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-password-recovery-online.html', '/guides/es/zip-password-recovery-online.html', '/guides/vi/zip-password-recovery-online.html', '/guides/id/zip-password-recovery-online.html', '/guides/de/zip-password-recovery-online.html',
  '/guides/pt/qr-code-generator-best-practices.html', '/guides/es/qr-code-generator-best-practices.html', '/guides/vi/qr-code-generator-best-practices.html', '/guides/id/qr-code-generator-best-practices.html', '/guides/de/qr-code-generator-best-practices.html',
  '/guides/pt/when-to-compress-vs-convert-an-image.html', '/guides/es/when-to-compress-vs-convert-an-image.html', '/guides/vi/when-to-compress-vs-convert-an-image.html', '/guides/id/when-to-compress-vs-convert-an-image.html', '/guides/de/when-to-compress-vs-convert-an-image.html',
  // plan-warm-pascal-v3 S2 batch 42 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/how-to-zip-folder-online-step-by-step.html', '/guides/es/how-to-zip-folder-online-step-by-step.html', '/guides/vi/how-to-zip-folder-online-step-by-step.html', '/guides/id/how-to-zip-folder-online-step-by-step.html', '/guides/de/how-to-zip-folder-online-step-by-step.html',
  '/guides/pt/oled-test-vs-lcd-test-what-changes-on-oled.html', '/guides/es/oled-test-vs-lcd-test-what-changes-on-oled.html', '/guides/vi/oled-test-vs-lcd-test-what-changes-on-oled.html', '/guides/id/oled-test-vs-lcd-test-what-changes-on-oled.html', '/guides/de/oled-test-vs-lcd-test-what-changes-on-oled.html',
  '/guides/pt/milliseconds-to-date-utc-vs-local-time.html', '/guides/es/milliseconds-to-date-utc-vs-local-time.html', '/guides/vi/milliseconds-to-date-utc-vs-local-time.html', '/guides/id/milliseconds-to-date-utc-vs-local-time.html', '/guides/de/milliseconds-to-date-utc-vs-local-time.html',
  // plan-warm-pascal-v3 S2 batch 43 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/how-to-reduce-zip-file-size.html', '/guides/es/how-to-reduce-zip-file-size.html', '/guides/vi/how-to-reduce-zip-file-size.html', '/guides/id/how-to-reduce-zip-file-size.html', '/guides/de/how-to-reduce-zip-file-size.html',
  '/guides/pt/screen-test-online-vs-app-which-is-more-accurate.html', '/guides/es/screen-test-online-vs-app-which-is-more-accurate.html', '/guides/vi/screen-test-online-vs-app-which-is-more-accurate.html', '/guides/id/screen-test-online-vs-app-which-is-more-accurate.html', '/guides/de/screen-test-online-vs-app-which-is-more-accurate.html',
  '/guides/pt/image-compression-and-exif-metadata-what-gets-stripped.html', '/guides/es/image-compression-and-exif-metadata-what-gets-stripped.html', '/guides/vi/image-compression-and-exif-metadata-what-gets-stripped.html', '/guides/id/image-compression-and-exif-metadata-what-gets-stripped.html', '/guides/de/image-compression-and-exif-metadata-what-gets-stripped.html',
  // plan-warm-pascal-v3 S2 batch 44 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/how-to-reduce-zip-file-size-online.html', '/guides/es/how-to-reduce-zip-file-size-online.html', '/guides/vi/how-to-reduce-zip-file-size-online.html', '/guides/id/how-to-reduce-zip-file-size-online.html', '/guides/de/how-to-reduce-zip-file-size-online.html',
  '/guides/pt/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html', '/guides/es/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html', '/guides/vi/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html', '/guides/id/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html', '/guides/de/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html',
  '/guides/pt/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html', '/guides/es/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html', '/guides/vi/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html', '/guides/id/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html', '/guides/de/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html',
  // plan-warm-pascal-v3 S2 batch 45 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/how-to-make-a-zip-file-smaller.html', '/guides/es/how-to-make-a-zip-file-smaller.html', '/guides/vi/how-to-make-a-zip-file-smaller.html', '/guides/id/how-to-make-a-zip-file-smaller.html', '/guides/de/how-to-make-a-zip-file-smaller.html',
  '/guides/pt/long-number-millisecond-or-second.html', '/guides/es/long-number-millisecond-or-second.html', '/guides/vi/long-number-millisecond-or-second.html', '/guides/id/long-number-millisecond-or-second.html', '/guides/de/long-number-millisecond-or-second.html',
  '/guides/pt/lcd-test-what-it-checks.html', '/guides/es/lcd-test-what-it-checks.html', '/guides/vi/lcd-test-what-it-checks.html', '/guides/id/lcd-test-what-it-checks.html', '/guides/de/lcd-test-what-it-checks.html',
  // plan-warm-pascal-v3 S2 batch 46 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-file-converter-what-it-actually-does.html', '/guides/es/zip-file-converter-what-it-actually-does.html', '/guides/vi/zip-file-converter-what-it-actually-does.html', '/guides/id/zip-file-converter-what-it-actually-does.html', '/guides/de/zip-file-converter-what-it-actually-does.html',
  '/guides/pt/md5-to-text-why-you-cannot-convert-back.html', '/guides/es/md5-to-text-why-you-cannot-convert-back.html', '/guides/vi/md5-to-text-why-you-cannot-convert-back.html', '/guides/id/md5-to-text-why-you-cannot-convert-back.html', '/guides/de/md5-to-text-why-you-cannot-convert-back.html',
  '/guides/pt/lcd-test-vs-display-test-which-do-you-need.html', '/guides/es/lcd-test-vs-display-test-which-do-you-need.html', '/guides/vi/lcd-test-vs-display-test-which-do-you-need.html', '/guides/id/lcd-test-vs-display-test-which-do-you-need.html', '/guides/de/lcd-test-vs-display-test-which-do-you-need.html',
  // plan-warm-pascal-v3 S2 batch 47 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/what-is-a-file-compressor-and-which-to-use.html', '/guides/es/what-is-a-file-compressor-and-which-to-use.html', '/guides/vi/what-is-a-file-compressor-and-which-to-use.html', '/guides/id/what-is-a-file-compressor-and-which-to-use.html', '/guides/de/what-is-a-file-compressor-and-which-to-use.html',
  '/guides/pt/read-and-compare-md5-hashes-correctly.html', '/guides/es/read-and-compare-md5-hashes-correctly.html', '/guides/vi/read-and-compare-md5-hashes-correctly.html', '/guides/id/read-and-compare-md5-hashes-correctly.html', '/guides/de/read-and-compare-md5-hashes-correctly.html',
  '/guides/pt/what-an-lcd-test-does-and-when-to-run-one.html', '/guides/es/what-an-lcd-test-does-and-when-to-run-one.html', '/guides/vi/what-an-lcd-test-does-and-when-to-run-one.html', '/guides/id/what-an-lcd-test-does-and-when-to-run-one.html', '/guides/de/what-an-lcd-test-does-and-when-to-run-one.html',
  // plan-warm-pascal-v3 S2 batch 48 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html', '/guides/es/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html', '/guides/vi/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html', '/guides/id/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html', '/guides/de/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html',
  '/guides/pt/unminify-js.html', '/guides/es/unminify-js.html', '/guides/vi/unminify-js.html', '/guides/id/unminify-js.html', '/guides/de/unminify-js.html',
  '/guides/pt/screen-test-for-laptop-5-minute-checklist.html', '/guides/es/screen-test-for-laptop-5-minute-checklist.html', '/guides/vi/screen-test-for-laptop-5-minute-checklist.html', '/guides/id/screen-test-for-laptop-5-minute-checklist.html', '/guides/de/screen-test-for-laptop-5-minute-checklist.html',
  // plan-warm-pascal-v3 S2 batch 49 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/file-compressor-online-when-to-zip-vs-when-to-compress-image.html', '/guides/es/file-compressor-online-when-to-zip-vs-when-to-compress-image.html', '/guides/vi/file-compressor-online-when-to-zip-vs-when-to-compress-image.html', '/guides/id/file-compressor-online-when-to-zip-vs-when-to-compress-image.html', '/guides/de/file-compressor-online-when-to-zip-vs-when-to-compress-image.html',
  '/guides/pt/md5-decode.html', '/guides/es/md5-decode.html', '/guides/vi/md5-decode.html', '/guides/id/md5-decode.html', '/guides/de/md5-decode.html',
  '/guides/pt/millisecond-to-date.html', '/guides/es/millisecond-to-date.html', '/guides/vi/millisecond-to-date.html', '/guides/id/millisecond-to-date.html', '/guides/de/millisecond-to-date.html',
  // plan-warm-pascal-v3 S2 batch 50 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-password-unlocker.html', '/guides/es/zip-password-unlocker.html', '/guides/vi/zip-password-unlocker.html', '/guides/id/zip-password-unlocker.html', '/guides/de/zip-password-unlocker.html',
  '/guides/pt/md5-password.html', '/guides/es/md5-password.html', '/guides/vi/md5-password.html', '/guides/id/md5-password.html', '/guides/de/md5-password.html',
  '/guides/pt/screen-test-vs-camera-test-pick-the-right-tool.html', '/guides/es/screen-test-vs-camera-test-pick-the-right-tool.html', '/guides/vi/screen-test-vs-camera-test-pick-the-right-tool.html', '/guides/id/screen-test-vs-camera-test-pick-the-right-tool.html', '/guides/de/screen-test-vs-camera-test-pick-the-right-tool.html',
  // plan-warm-pascal-v3 S2 batch 51 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-file-size-compressor.html', '/guides/es/zip-file-size-compressor.html', '/guides/vi/zip-file-size-compressor.html', '/guides/id/zip-file-size-compressor.html', '/guides/de/zip-file-size-compressor.html',
  '/guides/pt/md5-hash-decrypt.html', '/guides/es/md5-hash-decrypt.html', '/guides/vi/md5-hash-decrypt.html', '/guides/id/md5-hash-decrypt.html', '/guides/de/md5-hash-decrypt.html',
  '/guides/pt/led-test-vs-lcd-test-which-applies-to-your-screen.html', '/guides/es/led-test-vs-lcd-test-which-applies-to-your-screen.html', '/guides/vi/led-test-vs-lcd-test-which-applies-to-your-screen.html', '/guides/id/led-test-vs-lcd-test-which-applies-to-your-screen.html', '/guides/de/led-test-vs-lcd-test-which-applies-to-your-screen.html',
  // plan-warm-pascal-v3 S2 batch 52 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/resize-zip-file.html', '/guides/es/resize-zip-file.html', '/guides/vi/resize-zip-file.html', '/guides/id/resize-zip-file.html', '/guides/de/resize-zip-file.html',
  '/guides/pt/md5-decrypt-online.html', '/guides/es/md5-decrypt-online.html', '/guides/vi/md5-decrypt-online.html', '/guides/id/md5-decrypt-online.html', '/guides/de/md5-decrypt-online.html',
  '/guides/pt/ms-to-date.html', '/guides/es/ms-to-date.html', '/guides/vi/ms-to-date.html', '/guides/id/ms-to-date.html', '/guides/de/ms-to-date.html',
  // plan-warm-pascal-v3 S2 batch 53 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-compressor.html', '/guides/es/zip-compressor.html', '/guides/vi/zip-compressor.html', '/guides/id/zip-compressor.html', '/guides/de/zip-compressor.html',
  '/guides/pt/lcd-checker.html', '/guides/es/lcd-checker.html', '/guides/vi/lcd-checker.html', '/guides/id/lcd-checker.html', '/guides/de/lcd-checker.html',
  '/guides/pt/online-zip-file.html', '/guides/es/online-zip-file.html', '/guides/vi/online-zip-file.html', '/guides/id/online-zip-file.html', '/guides/de/online-zip-file.html',
  // plan-warm-pascal-v3 S2 batch 54 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/test-lcd.html', '/guides/es/test-lcd.html', '/guides/vi/test-lcd.html', '/guides/id/test-lcd.html', '/guides/de/test-lcd.html',
  '/guides/pt/i-love-zip.html', '/guides/es/i-love-zip.html', '/guides/vi/i-love-zip.html', '/guides/id/i-love-zip.html', '/guides/de/i-love-zip.html',
  '/guides/pt/zip-compressor-online.html', '/guides/es/zip-compressor-online.html', '/guides/vi/zip-compressor-online.html', '/guides/id/zip-compressor-online.html', '/guides/de/zip-compressor-online.html',
  // plan-warm-pascal-v3 S2 batch 55 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/screen-display-test-synonyms.html', '/guides/es/screen-display-test-synonyms.html', '/guides/vi/screen-display-test-synonyms.html', '/guides/id/screen-display-test-synonyms.html', '/guides/de/screen-display-test-synonyms.html',
  '/guides/pt/kompres-file-zip.html', '/guides/es/kompres-file-zip.html', '/guides/vi/kompres-file-zip.html', '/guides/id/kompres-file-zip.html', '/guides/de/kompres-file-zip.html',
  '/guides/pt/zip-unlocker-online.html', '/guides/es/zip-unlocker-online.html', '/guides/vi/zip-unlocker-online.html', '/guides/id/zip-unlocker-online.html', '/guides/de/zip-unlocker-online.html',
  // plan-warm-pascal-v3 S2 batch 56 (2026-05-31) - 5 locale variants × 2 guides (FINAL substantive batch)
  '/guides/pt/kompres-zip.html', '/guides/es/kompres-zip.html', '/guides/vi/kompres-zip.html', '/guides/id/kompres-zip.html', '/guides/de/kompres-zip.html',
  '/guides/pt/zip-file-compressor-online.html', '/guides/es/zip-file-compressor-online.html', '/guides/vi/zip-file-compressor-online.html', '/guides/id/zip-file-compressor-online.html', '/guides/de/zip-file-compressor-online.html',
  // plan-warm-pascal-v3 S2 batch 57 (2026-05-31) - 5 locale variants × 2 guides (NEW make-zip-file-online + split-gif-into-frames; ledger expanded 166 -> 168 targeted)
  '/guides/pt/make-zip-file-online.html', '/guides/es/make-zip-file-online.html', '/guides/vi/make-zip-file-online.html', '/guides/id/make-zip-file-online.html', '/guides/de/make-zip-file-online.html',
  '/guides/pt/split-gif-into-frames.html', '/guides/es/split-gif-into-frames.html', '/guides/vi/split-gif-into-frames.html', '/guides/id/split-gif-into-frames.html', '/guides/de/split-gif-into-frames.html',
  // plan-warm-pascal-v3 S2 batch 58 (2026-06-01) - 5 locale variants × 1 guide (tes-lcd; CLOSURE batch reaching 100% route-level coverage)
  '/guides/pt/tes-lcd.html', '/guides/es/tes-lcd.html', '/guides/vi/tes-lcd.html', '/guides/id/tes-lcd.html', '/guides/de/tes-lcd.html',
  // plan-warm-pascal-v3 S2 batch 59 (2026-06-05) - 5 locale variants x 2 NEW guides (file-to-zip, online-diff-tool; backfill of pipeline-created EN-only guides)
  '/guides/pt/file-to-zip.html', '/guides/es/file-to-zip.html', '/guides/vi/file-to-zip.html', '/guides/id/file-to-zip.html', '/guides/de/file-to-zip.html',
  '/guides/pt/online-diff-tool.html', '/guides/es/online-diff-tool.html', '/guides/vi/online-diff-tool.html', '/guides/id/online-diff-tool.html', '/guides/de/online-diff-tool.html',
  // plan-warm-pascal-v3 S2 batch 60 (2026-06-05) - tool-free x 5 locales (new_guide_locale_completeness gate backfill)
  '/guides/pt/tool-free.html', '/guides/es/tool-free.html', '/guides/vi/tool-free.html', '/guides/id/tool-free.html', '/guides/de/tool-free.html',
  // cycle20260701 create_new_guide_page (locale completion) - pt variant of compress-image-online-to-50kb (staging-only until es/vi/id/de complete).
  '/guides/pt/compress-image-online-to-50kb.html',
  // cycle20260701-2 create_new_guide_page (locale completion) - es variant (staging-only until vi/id/de complete).
  '/guides/es/compress-image-online-to-50kb.html',
  // cycle20260701-3 create_new_guide_page (locale completion) - vi/id/de complete the bundle.
  '/guides/vi/compress-image-online-to-50kb.html',
  '/guides/id/compress-image-online-to-50kb.html',
  '/guides/de/compress-image-online-to-50kb.html',
  // cycle 20260702 create_new_guide_page (locale completion) - pt variant of cek-layar-laptop (staging-only until es/vi/id/de complete).
  '/guides/pt/cek-layar-laptop.html',
  // cycle 20260702-3 create_new_guide_page (locale completion) - es/vi/id/de variants of cek-layar-laptop (bundle now locale-complete).
  '/guides/es/cek-layar-laptop.html', '/guides/vi/cek-layar-laptop.html', '/guides/id/cek-layar-laptop.html', '/guides/de/cek-layar-laptop.html',
  // cycle 20260702 create_new_guide_page - photo-editor-online-pixlr (EN + pt/es/vi/id/de; locale-complete). Serves "photo editor online pixlr" searchers via our /photo-editor.html.
  '/guides/photo-editor-online-pixlr.html',
  '/guides/pt/photo-editor-online-pixlr.html', '/guides/es/photo-editor-online-pixlr.html', '/guides/vi/photo-editor-online-pixlr.html', '/guides/id/photo-editor-online-pixlr.html', '/guides/de/photo-editor-online-pixlr.html',
  // geo-sitewide-audit-runbook: ship-pending reconciliation - pt/es/vi/id/de variants of mp4-to-gif-online-free (completes the locale bundle for the EN-only stranded scaffold).
  '/guides/pt/mp4-to-gif-online-free.html', '/guides/es/mp4-to-gif-online-free.html', '/guides/vi/mp4-to-gif-online-free.html', '/guides/id/mp4-to-gif-online-free.html', '/guides/de/mp4-to-gif-online-free.html',
  '/guides/en/heic-vs-jpg-vs-webp.html',
  '/guides/en/dead-pixel-testing-guide.html',
  '/guides/en/unix-timestamps-explained.html',
  '/guides/en/pdf-password-types-owner-vs-user.html',
  '/guides/en/png-vs-svg-when-to-use.html',
  '/guides/en/css-minifier-vs-compressor.html',
  // Cycle 74 P74.B - JSON parser sub-feature disambiguation Lane-D guide.
  '/guides/en/json-parser-validate-vs-format-vs-tree-view.html',
  // Cycle 75 P75.B - milliseconds-to-date UTC-vs-local-time Lane-D guide.
  '/guides/en/milliseconds-to-date-utc-vs-local-time.html',
  // Cycle 20260524-19 P19.F create_new_guide_page - "current time in milliseconds" bare-query Lane-D guide (utility cluster, companion to /get-time-in-millisecond.html).
  '/guides/en/current-time-in-milliseconds.html',
  // Cycle 20260703-4 create_new_guide_page - "time in ms" bare-query Lane-D guide (utility cluster, companion to /get-time-in-millisecond.html).
  '/guides/en/time-in-ms.html',
  // Cycle 76 P76.A - screen-test-online-vs-app accuracy Lane-D guide (device-test cluster).
  '/guides/en/screen-test-online-vs-app-which-is-more-accurate.html',
  // Cycle 77 P77.A - "compress ZIP to a specific size" Lane-D append-only guide.
  '/guides/en/how-to-compress-a-zip-file-to-a-specific-size.html',
  // Cycle 20260519-10 create_new_guide_page - "how to compress a zip file" bare-query step-by-step guide.
  '/guides/en/how-to-compress-a-zip-file.html',
  // Cycle 20260519-11 create_new_guide_page - "zip folder online free" bare-query step-by-step guide (companion to /zip-file.html).
  '/guides/en/zip-folder-online-free.html',
  // Cycle 20260629-2 create_new_guide_page - "resize image online free" bare-query step-by-step guide (companion to /resize-image.html).
  '/guides/en/resize-image-online-free.html',
  // Cycle 20260629-3 create_new_guide_page - PT locale variant of "resize image online free" (locale-drain).
  '/guides/pt/resize-image-online-free.html',
  // Cycle 20260630-8 create_new_guide_page - PT locale variant of "crop image online free" (locale-drain; companion to /image-tools/crop-image.html).
  '/guides/pt/crop-image-online-free.html',
  // Cycle 20260524-10 create_new_guide_page - "i love zip" bare-query landing (companion to /zip-file.html).
  '/guides/en/i-love-zip.html',
  // Cycle 78 P78.A - "QR code error correction and scan failures" Lane-D guide (companion to /qr-code-generator.html).
  '/guides/en/qr-code-error-correction-and-scan-failures.html',
  // Cycle 79 P79.B - "Image to Base64: embed in HTML/CSS vs link the image file" Lane-D guide.
  '/guides/en/image-to-base64-embed-in-html-vs-link.html',
  // Cycle 80 P80.G - "How to test a touchscreen for bad spots" Lane-D guide (device-test cluster).
  '/guides/en/how-to-test-a-touchscreen-for-bad-spots.html',
  // Cycle 81 P81.A - "Webcam mirror vs flip explained" Lane-D guide (camera-test sub-cluster).
  '/guides/en/camera-mirror-vs-flip-explained.html',
  // Cycle 82 P82.A - "CSS Unminifier vs Prettier: when to use each" Lane-D guide (developer / CSS sub-cluster).
  '/guides/en/css-unminifier-vs-prettier-when-to-use-each.html',
  // Cycle 83 P83.A - "LED test vs LCD test: which applies to your screen?" Lane-D guide (device-test / lcd-test sub-cluster).
  '/guides/en/led-test-vs-lcd-test-which-applies-to-your-screen.html',
  // Cycle 233 P233.E - "OLED test vs LCD test: what changes on an OLED panel" Lane-D guide (device-test / lcd-test sub-cluster, companion to /lcd-test.html). Multi-cycle skeleton phase 1.
  '/guides/en/oled-test-vs-lcd-test-what-changes-on-oled.html',
  // Cycle 20260517-7 P7.A - "LED test" Lane-D create_new_guide_page (device-test / lcd-test sub-cluster, companion to /lcd-test.html). GSC 28d "led test" 888 imp at pos 8.5 CTR 2% with no dedicated short-tail guide; existing /guides/led-test-vs-lcd-test-which-applies-to-your-screen.html answers the disambiguation question but the bare "led test" query lands on /lcd-test.html with no on-page framing. New URL routes the short query to the implementing tool with one paragraph of context. Append-only.
  '/guides/en/led-test.html',
  // Cycle 84 P84.A - "How to compress a JPG for email attachment size limits" Lane-D guide (image-conversion / compression sub-cluster, companion to /compress-image.html).
  '/guides/en/how-to-compress-a-jpg-for-email-attachment-limits.html',
  // Cycle 85 P85.A - "Microphone test levels: what quiet, normal, and peak mean" Lane-D guide (device-test / microphone-test sub-cluster, companion to /microphone-test.html).
  '/guides/en/microphone-test-online-quiet-normal-peak-meter.html',
  // Cycle 86 P86.A - "Camera test permission blocked: how to allow camera access in your browser" Lane-D guide (device-test / camera-test sub-cluster, companion to /camera-test.html).
  '/guides/en/camera-test-permission-blocked-how-to-allow-it.html',
  // Cycle 87 P87.A - "Microphone test permission blocked: how to allow mic access in your browser" Lane-D guide (device-test / microphone-test sub-cluster, companion to /microphone-test.html, symmetric peer to cycle-86 P86.A).
  '/guides/en/microphone-test-permission-blocked-how-to-allow-it.html',
  // Phase 8 Cycle 3 §3.4 greenfield guides.
  '/guides/en/mp4-vs-webm-for-web.html',
  '/guides/en/jpg-vs-png-for-web.html',
  '/guides/en/md5-vs-sha256-when-to-hash.html',
  '/guides/en/csv-vs-json-data-formats.html',
  '/guides/en/pdf-vs-heic-for-document-archival.html',
  '/guides/en/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html',
  '/guides/en/how-to-convert-100-heic-photos-to-jpg.html',
  '/guides/en/how-to-test-for-dead-pixels-before-returning-a-monitor.html',
  '/guides/en/how-to-sign-pdf-after-removing-a-password.html',
  '/guides/en/how-to-extract-frames-from-a-gif-for-a-social-post.html',
  '/guides/en/how-to-check-webcam-and-microphone-before-an-interview.html',
  '/guides/en/how-to-minify-css-js-for-cloud-run-cold-start.html',
  '/guides/en/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html',
  // Phase 10 Cycle 4 P10.3.4.
  '/guides/en/when-to-compress-vs-convert-an-image.html',
  // Phase 11 Cycle 4 P11.3.3.
  '/guides/en/how-to-compress-a-folder-for-email.html',
  // Phase 11 Cycle 5 P11.2.1 + P11.3.5.
  '/guides/en/device-test-checklist-for-remote-work.html',
  '/guides/en/pdf-editing-ladder.html',
  // Phase 13 Cycle 2.1 P13.2.1.
  '/guides/en/file-compressor-vs-zip-what-to-pick.html',
  // Phase 13 Cycle 2.2 P13.2.2.
  '/guides/en/heic-vs-jpg-converter-when-each-wins.html',
  // Phase 16 Cycle A P16.N1 / P16.N2 / P16.N4.
  '/guides/en/what-is-a-file-compressor-and-which-to-use.html',
  '/guides/en/how-to-compress-a-file-online.html',
  '/guides/en/how-to-reduce-zip-file-size-online.html',
  '/guides/en/how-to-reduce-zip-file-size.html',
  // Cycle 121 P121.G - "file compressor" HEAD-query aggregator landing.
  '/guides/en/file-compressor.html',
  // Cycle 122 P122.A - "test lcd" / "lcd tester" / "lcd test online" HEAD-query
  // disambiguation aggregator (combined ~7.7K impr/28d at pos 5-8); routes
  // intent to /lcd-test.html action tool.
  '/guides/en/test-lcd.html',
  // Cycle 20260518-30 P30.E - "lcd checker" / "lcd check" / "monitor checker"
  // / "screen checker" Lane-D guide. Sibling to /guides/test-lcd.html for
  // the verification-framing query family. Same destination tool.
  '/guides/en/lcd-checker.html',
  // Phase 16 Cycle B P16.N11 / P16.N16.
  '/guides/en/how-to-convert-heic-to-jpg-step-by-step.html',
  '/guides/en/what-an-lcd-test-does-and-when-to-run-one.html',
  // Cycle 20260517-6 create_new_guide_page - "ms to date" synonym-coverage guide.
  '/guides/en/ms-to-date.html',
  // Cycle 20260517-21 create_new_guide_page - "convert milliseconds to date" exact-match landing (GSC 482 imp / 3 clicks / pos 6.02 / CTR 0.62% / opp 79.59). Implementing tool: /convert-time-in-millisecond-to-date.html. Non-cannibalizing - existing ms-to-date covers the short synonym; this guide covers the full natural-language query.
  '/guides/en/convert-milliseconds-to-date.html',
  // Cycle 20260520-12 create_new_guide_page - "millisecond to date" singular-noun landing (GSC 368 imp / 2 clicks / pos 6.86 / CTR 0.54% / opp 53.38). Implementing tool: /convert-time-in-millisecond-to-date.html. Non-cannibalizing - existing /guides/ms-to-date.html covers the abbreviated synonym; /guides/convert-milliseconds-to-date.html covers the verb-led natural-language plural; this guide covers the bare singular-noun query.
  '/guides/en/millisecond-to-date.html',
  '/guides/en/how-to-make-a-zip-file-smaller.html',
  '/guides/en/how-to-compress-zip-file-to-smaller-size.html',
  // Cycle 20260517-9 create_new_guide_page - exact-match "compress zip file to smaller size" landing.
  '/guides/en/compress-zip-file-to-smaller-size.html',
  '/guides/en/compress-zip-file-to-100kb.html',
  // Cycle 20260521-12 P29.A create_new_guide_page - "compress zip file to 2mb" enterprise-SMTP-cap-specific landing. Operator-approved via card cycle29-create_new_guide_page-compresszipfileto2mb-cannibalisation-1779338089590 (option a). 2 MB is the historical Exchange / SMTP-relay / legacy-webmail attachment cap; distinct angle from the 100kb sibling. Implementing tool /zip-file.html.
  '/guides/en/compress-zip-file-to-2mb.html',
  // Cycle 20260517-10 create_new_guide_page - exact-match "zip size reducer" landing (GSC 605 imp / 56 clicks / pos 5.67 / CTR 9.26%; opportunity_score 96.84).
  '/guides/en/zip-size-reducer.html',
  // Cycle 20260519-12 create_new_guide_page - exact-match "zip file size compressor" landing (GSC 354 imp / 44 clicks / pos 5.43 / CTR 12.43%; opportunity_score 57.07). Implementing tool /zip-file.html. Append-only; non-cannibalizing vs /guides/how-to-make-a-zip-file-smaller.html, /guides/zip-size-reducer.html, /guides/compress-zip-file-to-smaller-size.html (each targets a distinct head-tail intent).
  '/guides/en/zip-file-size-compressor.html',
  // Cycle 20260519-15 create_new_guide_page — "resize zip file" routing/disambiguation Lane-D guide (GSC 406 imp / 19 clicks / pos 6.83 / CTR 4.68%; opportunity_score 56.6). Distinguishing role: addresses the three-way wording ambiguity (shrink vs split vs shrink-photo-inputs-first), routes to the existing shrink / split / image-resize guides — not a 10th compress-zip duplicate.
  '/guides/en/resize-zip-file.html',
  // Cycle 20260520-16 create_new_guide_page — Indonesian-language guide "kompres file zip" (GSC 338 imp / 13 clicks / pos 6.36 / CTR 3.85%; opportunity_score 51.12). Implementing tool /zip-file.html. Companion sibling to /guides/comprimir-zip-online.html (Spanish) and /guides/compactar-pasta.html (Portuguese).
  '/guides/en/kompres-file-zip.html',
  // Cycle 20260523-5 P52.I create_new_guide_page — Indonesian-language size-question guide "kompres zip" (GSC 248 imp / 18 clicks / pos 7.42 / CTR 7.26%; opportunity_score 30.98). Implementing tool /zip-file.html. SIZE-focused sibling to /guides/kompres-file-zip.html (broader Indonesian bundle/privacy guide).
  '/guides/en/kompres-zip.html',
  '/guides/en/online-zip-vs-7z-vs-rar-which-to-pick.html',
  '/guides/en/how-to-zip-multiple-files-into-one.html',
  '/guides/en/how-to-zip-folder-online-step-by-step.html',
  '/guides/en/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html',
  '/guides/en/recover-corrupt-zip-file-options.html',
  '/guides/en/iphone-photo-format-explained-heic-jpg-png-raw.html',
  '/guides/en/how-to-convert-iphone-photo-to-jpg.html',
  '/guides/en/jpg-vs-jpeg-are-they-the-same.html',
  '/guides/en/svg-to-png-when-to-rasterize-an-svg.html',
  '/guides/en/how-to-check-camera-quality-on-your-phone.html',
  '/guides/en/microphone-test-online-what-it-actually-checks.html',
  '/guides/en/keyboard-tester-online-rollover-vs-anti-ghosting.html',
  '/guides/en/why-md5-cannot-be-decrypted.html',
  // Cycle 20260518-24 P24.E — "md5 decode" reader-vocabulary routing guide (distinguishing role).
  '/guides/en/md5-decode.html',
  // Cycle 20260518-28 — "md5 decrypt online" wording routing guide. Same one-way truth as md5-decode but framed
  // around the "decrypt" search wording (more specific; carries the password-recovery sub-intent). Distinct from
  // /guides/why-md5-cannot-be-decrypted.html (cryptographic walkthrough) and /guides/md5-decode.html (broader
  // wording routing). Outbound link to /md5-converter.html.
  '/guides/en/md5-decrypt-online.html',
  // Cycle 20260520-17 — "md5 hash decrypt" dictionary-attack-feasibility guide.
  '/guides/en/md5-hash-decrypt.html',
  '/guides/en/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html',
  '/guides/en/json-vs-yaml-vs-toml-config-formats-explained.html',
  '/guides/en/css-minifier-vs-uglifier-vs-tree-shaking.html',
  '/guides/en/base64-when-to-use-and-when-not-to.html',
  '/guides/en/how-to-split-a-gif-into-frames-for-editing.html',
  '/guides/en/how-to-crop-and-rotate-an-image.html',
  '/guides/en/photo-editor-vs-graphics-app-vs-batch-processor.html',
  '/guides/en/mp4-vs-mov-vs-mkv-which-container-when.html',
  '/guides/en/free-online-tools-that-work-without-uploading-files.html',
  '/guides/en/qr-code-generator-best-practices.html',
  // Cycle 20260520-10 - "gif into frames" head-query guide; companion to /extract-gif-to-image-frames.html
  '/guides/en/gif-into-frames.html',
  // Workstream B sample batch - 2026-04-30
  '/guides/en/how-to-compress-a-folder.html',
  '/guides/en/lcd-test-what-it-checks.html',
  // /guides/lcdtest.html ALIAS → /guides/lcd-test-online.html (cycle 20260514-6-followup)
  // — see ALIAS_ROUTES. The kebab URL below is the canonical one in sitemap-guides.xml.
  '/guides/en/lcd-test-online.html',
  // Cycle 20260514-2 Phase A scaffold for "folder to zip converter" was
  // aborted-in-place per granted card
  // create-guide-foldertozipconverter-cannibalisation-1778696200000
  // (cannibalisation against /zip-tools/zip-file.html + existing
  // /guides/how-to-compress-a-folder.html; non-kebab slug). Cycle 20260514-3
  // P1.A implements the "exclude from sitemap" half of the abort-in-place
  // decision by REMOVING the URL from GUIDE_ROUTES so sitemap-guides.xml
  // no longer publishes it. The JSP_BY_ROUTE entry stays so the URL still
  // renders (200, not 404) for any inbound link that already references it.
  // Cycle 19 P19.4 - screen/display/monitor synonym disambiguation guide.
  '/guides/en/screen-display-test-synonyms.html',
  // Cycle 27 P27.C - keyboard-test how-to guide (Lane-D PA-mode mandatory).
  '/guides/en/how-to-test-a-keyboard-online-step-by-step.html',
  // Cycle 28 P28.A - PNG vs JPG output-format comparison guide for the
  // /extract-gif-to-image-frames.html tool (Lane-D PA-mode mandatory;
  // image-editing cluster).
  '/guides/en/extract-gif-frames-png-vs-jpg-which-format.html',
  // Cycle 29 P29.B - GIF frames vs GIF frame rate (FPS) explainer; same
  // tool, orthogonal question to cycle-28 P28.A. Lane-D PA-mode mandatory;
  // image-editing cluster.
  '/guides/en/gif-frames-extract-vs-frame-rate-fps-explained.html',
  // Cycle 30 P30.A - MD5 alternatives (bcrypt vs Argon2id vs SHA-256)
  // decision guide. Lane-D PA-mode mandatory; guide,developer cluster.
  '/guides/en/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html',
  // Cycle 31 P31.A - camera-test black-screen diagnostic-flow guide.
  '/guides/en/camera-test-shows-black-screen-four-fixes.html',
  // Cycle 34 P34.A - microphone-test no-sound diagnostic-flow guide.
  '/guides/en/microphone-test-no-sound-four-fixes.html',
  // Cycle 35 P35.A - keyboard-test keys-not-detected diagnostic-flow guide.
  '/guides/en/keyboard-test-keys-not-detected-four-fixes.html',
  // Cycle 37 P37.A - JPEG quality-vs-size decision-table guide for /compress-image.html.
  '/guides/en/compress-jpeg-without-losing-quality-quality-vs-size.html',
  // Cycle 38 P38.A - "is this long number a timestamp?" diagnostic-flow guide.
  '/guides/en/long-number-millisecond-or-second.html',
  // Cycle 39 P39.A - "compressed JPG looks blurry, why?" reactive diagnostic-flow guide.
  '/guides/en/compressed-jpg-looks-blurry-three-causes.html',
  // Cycle 40 P40.A - "online ffmpeg conversion stalled, why?" reactive diagnostic-flow guide.
  '/guides/en/ffmpeg-online-conversion-stalled-three-fixes.html',
  // Cycle 41 P41.A - "GIF frame extractor output looks wrong, why?" reactive diagnostic-flow guide.
  '/guides/en/gif-frame-extractor-output-looks-wrong-three-causes.html',
  // Cycle 20260514-9 create_new_guide_page - "gif frame extractor" head-term
  // Lane-D guide. Implementing tool: /extract-gif-to-image-frames.html.
  '/guides/en/gif-frame-extractor.html',
  // Cycle 20260610-12 P12.D - gif-to-frames-converter (utility cluster)
  '/guides/en/gif-to-frames-converter.html',
  // Cycle 42 P42.A - "LCD test vs display test vs monitor test - which one do you actually need?" reactive disambiguation-flow guide.
  '/guides/en/lcd-test-vs-display-test-which-do-you-need.html',
  // Cycle 43 P43.B - "Camera test vs webcam test vs camera quality - which one do you actually need?" reactive disambiguation-flow guide.
  '/guides/en/camera-test-vs-webcam-test-which-do-you-need.html',
  // Cycle 20260610-13 - LCD test for laptop screens (device-test)
  '/guides/en/lcd-test-laptop.html',
  // Cycle 73 P73.B - "Screen test vs camera test - which one do you actually need?" cross-cluster disambiguation Lane-D guide.
  '/guides/en/screen-test-vs-camera-test-pick-the-right-tool.html',
  // Cycle 44 P44.A - "MD5 to text - why you cannot convert it back, and what to do instead" disambiguation/decision guide.
  '/guides/en/md5-to-text-why-you-cannot-convert-back.html',
  // Cycle 46 P46.B - "Before a video call - which tools to run (screen / camera / microphone)" pre-call checklist guide.
  '/guides/en/before-a-video-call-which-tools-to-run.html',
  // Cycle 48 P48.A - laptop-specific screen-test 5-minute checklist guide (Bing under-served laptop reader-task gap).
  '/guides/en/screen-test-for-laptop-5-minute-checklist.html',
  // Cycle 49 P49.A - "FFmpeg Online vs Video Converter - which tool to open" routing guide (GSC "ffmpeg online" op_score 270.97 row).
  '/guides/en/ffmpeg-online-vs-video-converter-which-to-pick.html',
  // Cycle 50 P50.A - "ImageMagick Online vs Task-Specific Tools - which to pick" routing guide (image-editing-cluster parallel to cycle 49 P49.A; GA4 /imagemagick-online.html 114 sess / 0.51 engagement cohort).
  '/guides/en/imagemagick-online-vs-task-specific-tools-which-to-pick.html',
  // Cycle 51 P51.A - "File Compressor Online: ZIP a Folder vs Compress an Image" routing guide (GSC "file compressor" 258,156 imp / 0.04% CTR / pos 9.9 / 12,797 missed clicks 28d - cross-cluster routing surface for the head term that neither /zip-file.html nor /compress-image.html owns alone).
  // Cycle 46 (20260522-7) P46.H — "Camera Check" synonym-disambiguation guide. GSC "camera check" 451 imp / 5 clicks / pos 11.85 28d (opportunity score 37.63). Routes the reader to /camera-test.html (the implementing tool) while explaining the synonym mapping ("camera check" = "camera test") and the three end-states (allowed / blocked / ignored). Sibling guides: camera-test-permission-blocked-how-to-allow-it (permissions deep-dive), camera-test-shows-black-screen-four-fixes (hardware failures), camera-mirror-vs-flip-explained (preview semantics).
  '/guides/en/camera-check.html',
  '/guides/en/file-compressor-online-when-to-zip-vs-when-to-compress-image.html',
  // Cycle 53 P53.A - "How to Extract a File Online - ZIP, RAR, 7z" routing guide (GSC "extract file online" -9.3 pos in 7d, "file zipper" -8.9 pos; neither owned by an existing guide. .zip -> /unzip-file.html; .rar / .7z -> local OS tool; forgotten-password .zip -> /remove-zip-password.html).
  '/guides/en/how-to-extract-a-file-online-zip-rar-7z.html',
  // Cycle 54 P54.A - "How to choose a compression level - quality vs file size, with examples" guide. Captures the long-tail "compress image to 100kb / 200kb / 500kb" + "what compression level should I use" decision intent on /compress-image.html. Routes to /resize-image.html when pixel dimensions matter and to format-choice guides when the format is wrong. Append-only Lane-D guide.
  '/guides/en/how-to-choose-a-compression-level.html',
  // Cycle 55 P55.A - "ZIP password types - strong vs weak, explained" guide.
  // Trust-gate education on /remove-zip-password.html (top-2 traffic ZIP-cluster URL).
  // Explains legacy ZIP 2.0 vs WinZip AES-256, password strength interaction, and the
  // 30-second decision flow before a reader uploads. Append-only Lane-D guide; non-ZIP-cluster URL.
  '/guides/en/zip-password-types-strong-vs-weak-explained.html',
  // Cycle 56 P56.A - "PDF preflight online: what it actually checks" guide.
  // Lane-D fresh-capture on the search-vocabulary gap upstream of /preflight-pdf.html
  // (Bing pos 3-20 across the preflight/validator/check vocabulary). PDF cluster
  // had only 4 existing guides vs 13+ PDF tools - clearest cluster gap on the site.
  // Explains preflight as a check step (not a fix step), what /preflight-pdf.html
  // validates (PDF/A archival conformance), and what is out-of-scope (PDF/X print,
  // signature legal-validity, corrupt-PDF repair, PDF/UA). Append-only Lane-D guide.
  '/guides/en/pdf-preflight-online-what-it-actually-checks.html',
  // Cycle 58 P58.A - "Read and compare MD5 hashes correctly" guide.
  // Post-conversion verification flow downstream of /md5-converter.html.
  // Distinct from 4 existing MD5 guides; covers cosmetic vs real
  // differences (case, whitespace, BOM, hex format) plus the 5-step
  // compare flow. Append-only Lane-D guide; non-ZIP cluster.
  '/guides/en/read-and-compare-md5-hashes-correctly.html',
  // Cycle 59 P59.A - "How to tell if a JPG was compressed too much"
  // guide. Bridges /get-jpeg-compression-level.html (assess-after the
  // upload). Distinct from /guides/how-to-choose-a-compression-level
  // (choose-before). Image-conversion / image-editing cluster;
  // non-ZIP; append-only Lane-D guide.
  '/guides/en/how-to-tell-if-a-jpg-was-compressed-too-much.html',
  // Cycle 60 P60.A - "How to flatten a PDF - and when to do it" guide.
  // Bridges /flatten-pdf.html (server-side flatten via FlattenPdfService).
  // Distinct from 6 existing PDF guides. PDF cluster; non-ZIP;
  // append-only Lane-D guide.
  '/guides/en/how-to-flatten-a-pdf-and-when-to-do-it.html',
  // Cycle 61 P61.A - "PNG to SVG - when to vectorize a raster image"
  // guide. Bridges /png-to-svg.html (server-side raster-to-vector
  // via the freetoolonline AWS service). Image-conversion cluster;
  // non-ZIP; append-only Lane-D guide.
  '/guides/en/png-to-svg-when-to-vectorize-a-raster-image.html',
  // Cycle 62 P62.E - "Download link not appearing after conversion -
  // 5 fixes" diagnostic guide. Bridges multiple converter tools.
  // Troubleshooting cluster; non-ZIP; append-only Lane-D guide.
  '/guides/en/download-link-not-appearing-after-conversion-five-fixes.html',
  // Cycle 64 P64.A - "Why HEIC won't open on Windows - three quick
  // fixes" troubleshooting guide. Bridges /heic-to-jpg.html top revenue
  // page; image-conversion cluster; non-ZIP; append-only Lane-D guide.
  '/guides/en/why-heic-wont-open-on-windows-three-fixes.html',
  // Cycle 70 P70.A - "Zip file converter - what it actually does"
  // disambiguation guide. Targets the GSC `zip file converter` /
  // `zip files online` / `make zip file online` / `folder to zip
  // converter` cluster (~5K imp / 28d at 0.5-1.8% CTR / pos 8-9).
  // Reader confusion: ZIP is a container, not a format. Outbound link
  // only to /zip-file.html, /unzip-file.html, /compress-image.html,
  // /heic-to-jpg.html, /compose-pdf.html. NO satellite backlink on
  // /zip-file.html (ZIP-CRITICAL-CARE 24h cooldown). Cluster: zip
  // entry-point. Lane-D PA-mode mandatory; non-ZIP-cluster identity.
  '/guides/en/zip-file-converter-what-it-actually-does.html',
  // Cycle 20260519-1 - bare-query "zip file converter" guide.
  '/guides/en/zip-file-converter.html',
  // Cycle 71 P71.F - "HEIC to JPG: what the converter actually does
  // (and what it does not)" trust-anchor guide. Source-cited claims
  // from tool-heictojpg/SKILL.md (libheif, SlimJpg, EXIF toggle, quality
  // slider, multi-format output). Anti-claims also surfaced (NOT
  // browser-only, NOT account-gated, does NOT extract live-photo
  // motion). Lane-D PA-mode mandatory; image-conversion cluster.
  '/guides/en/heic-to-jpg-claims-what-actually-works.html',
  // Backfill: cycle 88 + cycle 90 guides were added to INFO_ROUTES but
  // omitted from GUIDE_ROUTES. Without GUIDE_ROUTES membership they
  // lose Article JSON-LD, Organization JSON-LD, editorial-byline, AND
  // (post-2026-05-11 showAdSlots split) AdSense loading. Append-only.
  '/guides/en/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html',
  '/guides/en/image-compression-and-exif-metadata-what-gets-stripped.html',
  // Cycle1 of 20260513-5 P5.A - "Zip compressor" Lane-D guide. Phase A
  // skeleton (route + JSP wrapper) only. Kebab URL per granted cards.
  '/guides/en/zip-compressor.html',
  // Cycle6 of 20260513-6 — "Compress ZIP" Lane-D guide. Phase A skeleton
  // (route + JSP wrapper) only. Kebab + singular guide/ JSP subdir.
  '/guides/en/compress-zip.html',
  // Cycle 20260515-16 — "Compress ZIP Size" Lane-D guide. Complete single-cycle
  // ship: compressibility table + DEFLATE level explainer + routing to
  // /zip-tools/zip-file.html. Cluster=zip.
  '/guides/en/compress-zip-size.html',
  // Cycle 20260515-12 — "Make Zip File Online" Lane-D guide (zip cluster,
  // companion to /zip-tools/zip-file.html). Complete single-cycle ship.
  '/guides/en/make-zip-file-online.html',
  // Cycle 20260515-13 — "Comprimir Zip Online" Lane-D guide (zip cluster,
  // Spanish-keyword sibling of /guides/make-zip-file-online.html;
  // companion to /zip-tools/zip-file.html). Complete single-cycle ship.
  // Cycle 20260519-14 — "Comprimir Carpeta Zip Online Gratis" Lane-D guide
  // (zip cluster, Spanish folder-compression intent; 348 imp / 36 clicks /
  // pos 5.49 / CTR 10.34% per 28d GSC; opportunity_score 56.79). Companion
  // to /zip-file.html. Native Spanish prose authored against tool-zipfile
  // SKILL features. Phase A complete single-cycle ship.
  // Cycle 20260523-4 — "Reducir Tamaño Zip Online" Lane-D guide (zip cluster,
  // Spanish size-reduction-wording sibling of /guides/comprimir-zip-online.html;
  // 196 imp / 32 clicks / pos 5.15 / CTR 16.3% per 28d GSC; opportunity_score
  // 31.83). Reader-routed: this guide is a synonym-landing for the "reducir
  // tamaño" wording, ROUTES to /guides/comprimir-zip-online.html for the full
  // compression-wording context AND to /zip-tools/zip-file.html as the creator.
  // Implementing tool is /zip-file.html (tool-zipfile auto; this guide reuses
  // truth-source from the existing comprimir-zip-online verified content).
  // Cycle 20260515-15 — "Zip File Compressor Online" Lane-D guide (zip
  // cluster head-query; 799 imp / 73 clicks / pos 6.2 / CTR 9.1% per 28d
  // GSC; opportunity_score 117.19). Companion to /zip-tools/zip-file.html.
  // Phase A complete single-cycle ship.
  '/guides/en/zip-file-compressor-online.html',
  // Cycle 20260517-8 — "Online Zip File Compressor" Lane-D create_new_guide_page
  // (zip cluster head-query sibling; 634 imp / 27 clicks / pos 5.93 / CTR 4.3%
  // per 28d GSC; opportunity_score 102.3). Companion to /zip-tools/zip-file.html.
  // Complete single-cycle ship per cycle 20260514-5 contract.
  '/guides/en/online-zip-file-compressor.html',
  // Cycle 20260518-20 create_new_guide_page - "Zip Compress" Lane-D guide (zip
  // cluster head-query sibling; 744 imp / 26 clicks / pos 7.71 / CTR 3.49%
  // per 28d GSC; opportunity_score 93.06). Companion to /zip-tools/zip-file.html.
  // Complete single-cycle ship per cycle 20260514-5 contract.
  '/guides/en/zip-compress.html',
  // Cycle 20260518-21 create_new_guide_page - "Zip password recovery online"
  // Lane-D truthful-framing guide. Cluster: zip. GSC 690 imp / 147 clicks /
  // pos 6.17 / CTR 21.3% / opportunity_score 87.95. Sourced from
  // tool-removezippassword/SKILL.md F1-F7 + N2 + N6 (the tool unlocks when
  // password is KNOWN; explicitly does NOT crack unknown passwords).
  '/guides/en/zip-password-recovery-online.html',
  // Cycle 20260518-22 create_new_guide_page - "Zip compressor online" Lane-D
  // guide. Cluster: zip. GSC 611 imp / 57 clicks / pos 6.99 / CTR 9.33% /
  // opportunity_score 79.22. Sourced from tool-zipfile/SKILL.md M1-M7 +
  // tool-guidescompresszip/SKILL.md C1-C6 (size question vs archive question;
  // browser-creator routing; sibling-guide vocabulary disambiguation).
  '/guides/en/zip-compressor-online.html',
  // Cycle 20260518-23 create_new_guide_page - "Folder to zip" Lane-D guide
  // (zip cluster, companion to /zip-tools/zip-file.html). GSC 773 imp / 13
  // clicks / pos 9.73 / CTR 1.68% / opportunity_score 78.12 — folder-to-archive
  // intent. Paraphrases tool-ziptools/SKILL.md M1 (one-click routing) and
  // tool-guidescompresszip/SKILL.md C1-C5 (size question vs archive question
  // for folder inputs).
  '/guides/en/folder-to-zip.html',
  // Cycle 20260605-3 create_new_guide_page - "File To Zip" Lane-D guide (zip
  // cluster, GSC "file to zip" 305 imp / 4 clicks / pos 10.05 / CTR 1.31% /
  // opportunity_score 29.96). Companion to /zip-file.html (server-side upload
  // creator). Paraphrases tool-zipfile/SKILL.md M1 (single-file workflow) +
  // M2 (compressibility expectation) + M3 (optional password). Cross-link to
  // /guides/folder-to-zip.html for folder-input variant. Kebab URL passes URL
  // convention regex; smashed form "filetozip" does not shadow any existing
  // primary route.
  '/guides/en/file-to-zip.html',
  // Cycle 20260605-4 create_new_guide_page - "Online diff tool" Lane-D guide.
  // Companion to /developer-tools/text-diff.html.
  '/guides/en/online-diff-tool.html',
  // Cycle 20260605-8 create_new_guide_page - "common::md5::gethash64string" Lane-D.
  // Companion to /md5-converter.html. Sourced from tool-md5converter/SKILL.md M1+M2.
  '/guides/en/common-md5-gethash64string.html',
  '/guides/pt/common-md5-gethash64string.html', '/guides/es/common-md5-gethash64string.html', '/guides/vi/common-md5-gethash64string.html', '/guides/id/common-md5-gethash64string.html', '/guides/de/common-md5-gethash64string.html',
  // Cycle 20260518-25 create_new_guide_page - "Online Zip File" Lane-D guide
  // (zip cluster, companion to /zip-tools/zip-file.html). GSC 573 imp / 12
  // clicks / pos 7.39 / CTR 2.09% / opportunity_score 75.94 — "online zip file"
  // intent (zip-file as a noun, not as a verb). Paraphrases tool-zipfile/SKILL.md
  // M1-M7 (in-browser creator) and tool-ziptools/SKILL.md M1 (one-click routing).
  '/guides/en/online-zip-file.html',
  // Cycle 20260518-31 create_new_guide_page - "Create Zip File Online" Lane-D
  // guide (zip cluster, companion to /zip-tools/zip-file.html). GSC 702 imp /
  // 8 clicks / pos 10.08 / CTR 1.14% / opportunity_score 68.87 - "create zip
  // file online" intent (the verb-led companion to "online zip file"). Paraphrases
  // tool-zipfile/SKILL.md implemented features (upload + server-side build +
  // optional password + cross-platform output) and the existing in-browser
  // creator copy in BODYHTMLzipfile / BODYWELCOMEzipfile.
  '/guides/en/create-zip-file-online.html',
  // Cycle 20260518-33 create_new_guide_page - "Tes LCD" Lane-D guide (device-test
  // cluster, companion to /lcd-test.html). GSC 503 imp / 17 clicks / pos 7.38 /
  // CTR 3.38% / opportunity_score 65.84 - Indonesian-language "tes lcd" intent
  // (Indonesian for "lcd test"). Authored in Indonesian to serve the actual
  // search audience (GA4 ID share ~6% of sessions). Paraphrases
  // tool-lcdtest/SKILL.md F1-F5 (six-color full-viewport fill + full-screen
  // toggle + reset + display metrics + no-upload disclosure). Kebab slug
  // /guides/tes-lcd.html does not shadow any existing primary tool route
  // (urlToSlug() smashes to "teslcd" which is not in JSP_BY_ROUTE).
  '/guides/en/tes-lcd.html',
  // Cycle 20260518-29 create_new_guide_page - "zip password unlocker" Lane-D
  // guide (zip cluster, companion to /remove-zip-password.html). GSC 432 imp /
  // 44 clicks / pos 5.29 / CTR 10.18% / opportunity_score 73.32. Honest framing:
  // splits the search intent into "remove a known password" (real, points at
  // /remove-zip-password.html) vs "crack an unknown password" (not solvable
  // online; cites tool-removezippassword/SKILL.md N2 + N6 anti-claims).
  '/guides/en/zip-password-unlocker.html',
  // Cycle 20260518-32 create_new_guide_page - "compactar pasta" Lane-D guide
  // (zip cluster, companion to /zip-tools/zip-file.html). GSC 522 imp /
  // 21 clicks / pos 7.59 / CTR 4.02% / opportunity_score 66.02 - Portuguese
  // "compactar pasta" intent (compress folder). Paraphrases tool-zipfile/SKILL.md
  // BODYHTML (folder + multi-file zip, optional password Standard/AES-128/AES-256,
  // browser-side UI) and the existing /zip-file.html action description.
  // Cycle 20260521-20 P37.H create_new_guide_page (zip cluster, Portuguese).
  // Cycle 20260520-11 new_guide_page_proposal (developer cluster):
  // implementing tool /js-unminifier.html.
  '/guides/en/unminify-js.html',
  // Cycle 20260520-13 new_guide_page_proposal (device-test cluster, companion
  // to /lcd-test.html). "lcd screen test" head-tail query. Paraphrases
  // tool-lcdtest/SKILL.md F1-F5. Kebab slug /guides/lcd-screen-test.html
  // does not shadow /lcd-test.html (smashed form "lcdscreentest" is unique).
  '/guides/en/lcd-screen-test.html',
  // Cycle 20260520-15 new_guide_page_proposal (zip cluster, disambiguation
  // guide for "unlock zip file online" query — routes between
  // /remove-zip-password.html (password-protected ZIPs) and
  // /unzip-file.html (plain ZIPs). GSC: 421 impressions / 40 clicks / pos 7.4.
  // Kebab slug /guides/unlock-zip-file-online.html does not shadow any
  // existing route (smashed form "unlockzipfileonline" is unique).
  '/guides/en/unlock-zip-file-online.html',
  // Cycle 20260522-8 (cycle 47) P47.H new_guide_page_proposal — "current millis"
  // query (gsc 289 imp / 2 clk / pos 7.92 / CTR 0.69%; opportunity_score 36.24).
  // Companion to /convert-time-in-millisecond-to-date.html (the implementing
  // tool). Developer-utility cluster; kebab slug /guides/current-millis.html
  // does not shadow any existing route (smashed form "currentmillis" is
  // unique). Complete single-cycle ship per cycle 20260514-5 contract.
  '/guides/en/current-millis.html',
  // Cycle 20260522-9 (cycle 48) P48.H new_guide_page_proposal — "zip unlocker
  // online" query (gsc 269 imp / 33 clk / pos 6.65 / CTR 12.27%; opportunity_score
  // 35.47). Companion to /remove-zip-password.html (the implementing tool — query
  // intent is unlock-when-password-known, not crack). ZIP cluster; kebab slug
  // /guides/zip-unlocker-online.html does not shadow any existing route (smashed
  // form "zipunlockeronline" is unique). Complete single-cycle ship per cycle
  // 20260514-5 contract.
  '/guides/en/zip-unlocker-online.html',
  // Cycle 20260523-3 (cycle 50) create_new_guide_page - "crop and rotate image"
  // Lane-D guide (image-editing cluster, companion to /crop-image.html).
  '/guides/en/crop-and-rotate-image.html',
  // Backfill cycle 20260523-followup-1: /guides/md5-password.html (cycle 50
  // P50.H, real-work floor) + /guides/comprimir-arquivo-zip.html (cycle
  // 20260522-10 P10.E, Portuguese zip cluster) were added to INFO_ROUTES +
  // JSP_BY_ROUTE but omitted from GUIDE_ROUTES — same defect class as the
  // cycle-88/cycle-90 backfill at line ~1140. Without GUIDE_ROUTES membership
  // they render fine but never appear in sitemap-guides.xml or the dynamic
  // /guides.html + /sitemap.html hub bodies (which both filter against this
  // Set). The follow-up to this fix wires buildDynamicGuidesHubBody() into
  // export-site.mjs so /guides.html joins /sitemap.html as a build-generated
  // artifact, closing the "agent edits BODYHTMLguides.html by hand and forgets
  // an entry" defect class permanently. See sitemap-html-builder.mjs.
  '/guides/en/md5-password.html',
  // Cycle 20260524-18 create_new_guide_page - "Compress Folder Online" Lane-D
  // guide (zip cluster, companion to /zip-file.html). GSC 28d 1243 imp /
  // 112 clicks / pos 5.01 / CTR 9.01% / opportunity_score 225.55. The query
  // "compress folder online" is operationally folder-zipping (a folder
  // becomes a single .zip before transfer); the canonical implementing tool
  // on this site is /zip-file.html (upload folder, server bundles it into a
  // ZIP with optional AES password). Paraphrases tool-zipfile/SKILL.md
  // implemented features (upload pipeline, server bundling, S3-backed
  // download with short retention, optional password) + the existing
  // BODYWELCOMEzipfile reader-task framing (folder-as-input, name the
  // archive, optional encryption choice).
  '/guides/en/compress-folder-online.html',
  // cycle 20260610-15 - front-camera-test new guide (EN bare canonical + 5 locale variants)
  '/guides/front-camera-test.html',
  '/guides/pt/front-camera-test.html',
  '/guides/es/front-camera-test.html',
  '/guides/vi/front-camera-test.html',
  '/guides/id/front-camera-test.html',
  '/guides/de/front-camera-test.html',
  // cycle 20260610-16 - compress-pdf-online-free new guide (EN bare canonical + 5 locale variants)
  '/guides/compress-pdf-online-free.html',
  '/guides/pt/compress-pdf-online-free.html',
  '/guides/es/compress-pdf-online-free.html',
  '/guides/vi/compress-pdf-online-free.html',
  '/guides/id/compress-pdf-online-free.html',
  '/guides/de/compress-pdf-online-free.html',
  // cycle 20260614-21 - split-pdf-online-free new guide (EN bare canonical; locale variants drain in later cycles per EN-first contract)
  '/guides/split-pdf-online-free.html',
  // cycle 20260615 - split-pdf-online-free PT locale variant (EN-first locale drain; es/vi/id/de remain)
  '/guides/pt/split-pdf-online-free.html',
  // cycle 20260615-2 - split-pdf-online-free ES locale variant (EN-first locale drain; vi/id/de remain)
  '/guides/es/split-pdf-online-free.html',
  // cycle 20260615-3 - split-pdf-online-free VI locale variant (EN-first locale drain; id/de remain)
  '/guides/vi/split-pdf-online-free.html',
  // cycle 20260615-4 - split-pdf-online-free ID locale variant (EN-first locale drain; de remains)
  '/guides/id/split-pdf-online-free.html',
  // cycle 20260615-5 - split-pdf-online-free DE locale variant (EN-first locale drain COMPLETE)
  '/guides/de/split-pdf-online-free.html',
  // cycle 20260624-2 - mengecilkan-ukuran-zip VI locale variant (EN-first locale drain; id/de remain)
  '/guides/vi/mengecilkan-ukuran-zip.html',
  // cycle 20260624-3 - mengecilkan-ukuran-zip ID locale variant (EN-first locale drain; de remains)
  '/guides/id/mengecilkan-ukuran-zip.html',
  // cycle 20260624-4 - mengecilkan-ukuran-zip DE locale variant (EN-first locale drain; locale-complete)
  '/guides/de/mengecilkan-ukuran-zip.html',
  // cycle 20260630-4 - merge-pdf-online-free-unlimited VI locale variant (EN-first locale drain; id/de remain)
  '/guides/vi/merge-pdf-online-free-unlimited.html',
  // cycle 20260630-5 - merge-pdf-online-free-unlimited ID locale variant (EN-first locale drain; de remains)
  '/guides/id/merge-pdf-online-free-unlimited.html',
  // cycle 20260630-6 - merge-pdf-online-free-unlimited DE locale variant (EN-first locale drain; locale-complete after this)
  '/guides/de/merge-pdf-online-free-unlimited.html',
]);

export function isGuideRoute(route) {
  return GUIDE_ROUTES.has(route && route.startsWith('/') ? route : `/${route ?? ''}`);
}

export const SPECIAL_ROUTES = new Set(['/alternatead.html']);

export const ALIAS_ROUTES = {
  // Hub directory-form safety redirects (added 2026-05-11). Search engines
  // and external links may guess `/cluster-tools/` from the clustered tool
  // URLs (`/cluster-tools/<slug>.html`). Without these entries GitHub Pages
  // returns 404 and may index the broken URL. Map each to its canonical
  // .html hub so crawlers see a single soft-redirect signal pointing back
  // to the canonical hub. The hub URL form-change to canonical-directory
  // was deferred per plan §E.3; until then `/cluster-tools.html` stays
  // canonical and the directory form is a redirect alias.
  '/zip-tools/': '/zip-tools.html',
  '/utility-tools/': '/utility-tools.html',
  '/video-tools/': '/video-tools.html',
  '/image-tools/': '/image-tools.html',
  '/image-converter-tools/': '/image-converter-tools.html',
  '/developer-tools/': '/developer-tools.html',
  '/device-test-tools/': '/device-test-tools.html',
  '/pdf-tools/': '/pdf-tools.html',
  // Same pattern for the /guides/ subdirectory (added 2026-05-11). The
  // guides parent URL is `/guides.html` (200); individual guides live at
  // `/guides/<slug>.html`. Without this entry `/guides/` returns 404 and
  // a crawler that walks up from a guide URL may index the broken parent.
  '/guides/': '/guides.html',
  '/svg-to-image.html': '/image-converter-tools/svg-to-png.html',
  '/split-pdf-to-single-pages.html': '/pdf-tools/split-pdf-by-range.html',
  '/pdf-merge-from-multiple-files.html': '/pdf-tools/join-pdf-from-multiple-files.html',
  // Cycle 20260520 SEO-synonym-mill cleanup. The trending-scout shipped
  // 6 near-duplicate json-formatter-* variants + chatgpt-json-tree-viewer
  // as broken stubs (every click threw "Error: convertForSlug() not
  // implemented"). /json-formatter.html now ships a real working JSON
  // parse + pretty-print + validate impl; the 7 dupes 301-alias here so
  // existing inbound links + sitemap entries route to the canonical tool.
  // See dedupe-against-existing.mjs (cycle 20260520) — escalated
  // substring + token-prefix overlap from SOFT to CRITICAL collision
  // so this pattern cannot recur from the trending-scout pipeline.
  // Cycle 20260520-followup cluster-URL convention: canonical now lives at
  // /developer-tools/json-formatter.html. Root /json-formatter.html + the
  // 6 dupe SEO-synonyms (-editor, -viewer, -compare, -extension, -validator,
  // -check, chatgpt-json-tree-viewer) all 301-alias DIRECTLY to the cluster
  // canonical (no intermediate hop through root). Preserves inbound link
  // equity from cycles 20260518-23 .. 20260519-15.
  // Cycle 20260521-12 semantic-dedup cleanup: /developer-tools/json-formatter.html
  // was a SEMANTIC DUPLICATE of /developer-tools/json-parser.html (titled "JSON
  // Parser & Formatter (Tree View)"). The 2026-05-20 trending-scout candidate
  // passed LEXICAL dedup (token-prefix only 1, JW ~0.85-0.88) but lost on
  // SEMANTIC overlap with json-parser's existing reader-task contract (validate
  // / format / tree / copy beautified JSON — all already implemented). Retargeted
  // all 8 aliases to the real canonical tool. Tool route + CMS fragments +
  // manifest entry + tool-skill deleted in same commit.
  '/json-formatter.html':           '/developer-tools/json-parser.html',
  '/json-formatter-check.html':     '/developer-tools/json-parser.html',
  '/json-formatter-editor.html':    '/developer-tools/json-parser.html',
  '/json-formatter-viewer.html':    '/developer-tools/json-parser.html',
  '/json-formatter-compare.html':   '/developer-tools/json-parser.html',
  '/json-formatter-extension.html': '/developer-tools/json-parser.html',
  '/json-formatter-validator.html': '/developer-tools/json-parser.html',
  '/chatgpt-json-tree-viewer.html': '/developer-tools/json-parser.html',
  // Cycle 20260520-followup: cluster-URL convention aliases for 2 other tools
  // shipped at root by the pre-fix builder.
  '/hd-video-converter.html':       '/video-tools/hd-video-converter.html',
  // Cycle 20260521-12 cleanup: /image-format-converter.html was shipped (cycle 20260520-5)
  // with a SILENT no-op BODYJS stub — user clicks did nothing, no console error either.
  // Better UX (and SEO hygiene) to NOT alias to a broken tool. The /image-converter-tools/
  // hub page already captures the "image format converter" reader query with 6 working
  // converters (heic-to-jpg, png-to-svg, svg-to-png, image-to-base64, base64-to-image,
  // extract-gif-to-image-frames). Removing the alias + CMS fragments + manifest entry
  // entirely. Future search-intent ranking is preserved by the hub page.
  '/mov-to-mp4.html': '/video-tools/video-converter.html',
  '/mov-to-mp3.html': '/video-tools/video-converter.html',
  // Cycle 20260521-19 chain-breaker resolution: /guides/ios-to-jpg.html was flagged
  // as cannibalisation against the existing /guides/how-to-convert-iphone-photo-to-jpg.html
  // for 4 consecutive cycles (chain_length=6, predecessor cycle 35). Per CLAUDE.md
  // "Deferred-approval chain-breaker" L3 + "Semantic dedup" rules, ship as 301 alias
  // (not as a full duplicate guide). Captures the bare-query "ios to jpg" SERP impressions
  // (309 imp/28d at pos 6.6) at ~95-100% equity transfer, no duplicate content.
  // Companion: CloudFront REDIRECTS in url-migration-301.js mirrors this entry.
  '/guides/ios-to-jpg.html': '/guides/en/how-to-convert-iphone-photo-to-jpg.html',
  // Cycle 20260518-29 — new_tool_page_discovery proposal candidate "video-converter-mp4" failed
  // the seo-tool-page-builder verb-detection guard ("slug ends with format token mp4, no I/O
  // verb"). Aliasing the proposed URL into the existing canonical video-converter routes the
  // synonym query traffic to a real working tool without authoring a near-clone that would
  // cannibalize. Same pattern as /mov-to-mp4.html above + /video-converter.html below.
  '/video-converter-mp4.html': '/video-tools/video-converter.html',
  '/zip-file-with-password.html': '/zip-tools/zip-file.html',
  '/unzip-file-with-password.html': '/zip-tools/unzip-file.html',
  '/heic-to-pdf.html': '/image-converter-tools/heic-to-jpg.html',
  '/insights-optimize-image.html': '/image-tools/insights-image-optimizer.html',
  '/cong-cu-chuyen-doi-chu-quoc-ngu-tieng-viet-thanh-tiew-viet-kieu-moi-phan-2.html': '/utility-tools/cong-cu-chuyen-doi-chu-quoc-ngu-tieng-viet-thanh-tieq-viet-kieu-moi.html',
  '/how-to-compress-a-folder.html': '/guides/en/how-to-compress-a-folder.html',
  // Cycle 20260604-2 — capture bare URL traffic for "folder compressor online" query (538 imp / 28d, pos 5.17, CTR 10.4% per GSC). Semantic-dedup: synonym of canonical /guides/en/compress-folder-online.html; alias-emit per CLAUDE.md "Semantic dedup" rule (G51 + dedup gate). Edge-equity preserved via paired CloudFront 301 in seo-reports/static-plan/20260510/cloudfront-function/url-migration-301.js.
  '/folder-compressor-online.html': '/guides/en/compress-folder-online.html',
  // Cycle142 P142.A — capture bare URL traffic to canonical LCD test page (4843 imp / 28d, pos 7.8, CTR 1.28% per GSC; per granted P141.LaneD-residual-saturated-guides option-a).
  '/test-lcd.html': '/device-test-tools/lcd-test.html',
  // Cycle143 P143.A — capture bare URL traffic for "how to compress a file" head-query (5384 imp / 28d, pos 10.65, CTR 0.02% per GSC). Bare URL currently 200-serves the homepage (canonical=/), so Google sees a homepage routing for a file-compression intent. Aliasing into the existing canonical guide page captures the traffic without authoring a parallel page that would cannibalize.
  '/how-to-compress-a-file.html': '/guides/en/how-to-compress-a-file-online.html',
  // Cycle144 P144.A — capture bare URL traffic for "zip file compressor" head-query (16,772 imp / 28d, pos 6.2, CTR 5.31% per GSC). Bare URL currently 200-serves the homepage (canonical=/) so Google routes ~890 monthly clicks to a generic 122-tool index. Aliasing to the existing /zip-file.html ZIP-compress tool re-routes the traffic without editing the indexed ZIP cluster page. Same alias-only playbook as P141.A / P142.A / P143.A.
  '/zip-file-compressor.html': '/zip-tools/zip-file.html',
  // Cycle145 P145.A — capture bare URL traffic for "compress zip file" head-query (16,542 imp / 28d, pos 6.3, CTR 6.47% per GSC). Bare URL currently 200-serves the homepage (canonical=/) so Google routes those clicks to a generic index. Aliasing to /zip-file.html re-routes the traffic without editing the indexed ZIP cluster page (ZIP-CARE preserved — no edit to /zip-file.html HTML). Same alias-only playbook as P141.A / P142.A / P143.A / P144.A.
  '/compress-zip-file.html': '/zip-tools/zip-file.html',
  // Cycle146 P146.A — capture bare URL traffic for "zip compressor" head-query (~4,223 imp / 28d, pos 7.0, CTR 5.09% per GSC). Bare URL currently 200-serves the GitHub-Pages 404 fallback (homepage HTML, canonical=/) so Google routes those clicks to a generic index. Aliasing to /zip-file.html re-routes the traffic without editing the indexed ZIP cluster page (ZIP-CARE preserved — no edit to /zip-file.html HTML). Same alias-only playbook as P141.A / P142.A / P143.A / P144.A / P145.A.
  '/zip-compressor.html': '/zip-tools/zip-file.html',
  // Cycle147 P147.A — capture bare URL traffic for "compress zip" head-query (~4,220 imp / 28d, pos 7.4, CTR 3.46% per GSC). Bare URL currently 200-serves the GitHub-Pages 404 fallback (homepage HTML, canonical=/) so Google routes those clicks to a generic index. Aliasing to /zip-file.html re-routes the traffic without editing the indexed ZIP cluster page (ZIP-CARE preserved — no edit to /zip-file.html HTML). Same alias-only playbook as P141.A / P142.A / P143.A / P144.A / P145.A / P146.A.
  '/compress-zip.html': '/zip-tools/zip-file.html',
  // Cycle148 P148.A — capture bare URL traffic for "how to make a zip file smaller" head-query (~2,429 imp / 28d, pos 5.6, CTR 0.33% per GSC; 113 missed clicks). Bare URL currently 200-serves the GitHub-Pages 404 fallback (homepage HTML, canonical=/) so Google routes those clicks to a generic index instead of the actual ZIP-compress tool.
  // Cycle173 P173.B amendment (2026-05-10) — operator-granted P171.B + P172.B (zip_care chain length=11). Re-target alias from /zip-file.html (generic ZIP tool, doesn't directly answer the head query "how to make a zip file smaller") to /guides/how-to-make-a-zip-file-smaller.html (long-form guide that already exists since Phase-16 cycle-8 N-series; ranks for the same query). Consolidates the 2,429 imp/28d 301 traffic into ONE canonical destination instead of two cannibalizing pages. ZIP-CARE preserved — no edit to indexed copy on /zip-file.html or /guides/how-to-make-a-zip-file-smaller.html; route table edit only. Tier-A protocol applied: pre-deploy snapshot at seo-reports/20260510-47/zip-pre-deploy/howtomakeazipfilesmaller/, halved Day +1/+3/+7 rollback thresholds, four-skill gate N/A (route-only change). Operator approve evidence: seo-reports/20260510-45/.approvals/granted/P171.B-howtomakeazipfilesmaller-zip-care-cooldown.json (2026-05-10T09:58:14.373Z) + seo-reports/20260510-46/.approvals/granted/P172.B-howtomakeazipfilesmaller-zip-care-cooldown.json (2026-05-10T09:58:18.077Z).
  '/how-to-make-a-zip-file-smaller.html': '/guides/en/how-to-make-a-zip-file-smaller.html',
  // Cycle 20260519-18 P18.E (create_new_guide_page re-route per cannibalization grant cycle 17). Capture bare-query traffic for "make zip file smaller" (369 imp / 24 clicks / pos 6.17 / CTR 6.5% per GSC) without splitting rank with the existing canonical guide. Bare URL /guides/make-zip-file-smaller.html aliases to /guides/how-to-make-a-zip-file-smaller.html (the canonical long-form guide). Per cycle 17 grant `new-guide-make-zip-file-smaller-cannibalization-cycle17` option (b) — "re-route the synth to /guides/how-to-make-a-zip-file-smaller.html". Route-table-only edit; no indexed-copy change.
  '/guides/make-zip-file-smaller.html': '/guides/en/how-to-make-a-zip-file-smaller.html',
  // Cycle 20260519-18 P18.F (new_tool_page_discovery re-route per cannibalization grant cycle 16+17). Capture bare-URL traffic for trending-tool candidate cand-50f0efbf185cfb91 ("Image Compressor Online", cycles_seen=19, confidence=0.65) without splitting rank with /compress-image.html canonical. Bare URL /image-compressor.html aliases to /compress-image.html (the canonical client-side image compression tool). Per cycle 16+17 grants `new-tool-image-compressor-cannibalization-intent-overlap-cycle16` option (b/c) — rename to a non-overlapping slug OR drop from candidate pool. Alias is the lightest-touch realisation of intent capture without cannibalization. Route-table-only edit; no indexed-copy change.
  '/image-compressor.html': '/compress-image.html',
  // Cycle149 P149.A — capture bare URL traffic for "zip file size reducer" head-query (2,754 imp / 28d, pos 5.66, CTR 10.46% per GSC; 288 clicks routed to homepage). Bare URL currently 200-serves the GitHub-Pages 404 fallback (homepage HTML, canonical=/). Aliasing to /zip-file.html re-routes the 288 clicks/28d to the actual ZIP-compress action page (ZIP-CARE preserved — no edit to /zip-file.html HTML). Same alias-only playbook as P141.A / P142.A / P143.A / P144.A / P145.A / P146.A / P147.A / P148.A.
  '/zip-file-size-reducer.html': '/zip-tools/zip-file.html',
  // Cycle150 P150.A — capture bare URL traffic for "reduce zip file size" head-query (2,769 imp / 28d, pos 6.2, CTR 10.69% per GSC; 296 clicks routed to homepage). Bare URL currently 200-serves the GitHub-Pages 404 fallback (homepage HTML, canonical=/). Aliasing to /zip-file.html re-routes the 296 clicks/28d to the actual ZIP-compress action page (ZIP-CARE preserved — no edit to /zip-file.html HTML). Same alias-only playbook as P141.A / P142.A / P143.A / P144.A / P145.A / P146.A / P147.A / P148.A / P149.A.
  '/reduce-zip-file-size.html': '/zip-tools/zip-file.html',
  // Cycle151 P151.A — capture bare URL traffic for "gif to frames" head-query (1,674 imp / 28d, pos 8.7, CTR 0.30% per GSC; 5 clicks currently routed to homepage). Bare URL currently 200-serves the GitHub-Pages 404 fallback (homepage HTML 201,113 bytes, canonical=/). Aliasing to the existing /extract-gif-to-image-frames.html action page re-routes the traffic to the canonical extractor without editing it. NOT a ZIP-cluster URL — ZIP-CRITICAL-CARE 24h cooldown does not apply (cooldown anchor 2026-05-09T05:53:00Z still active until 2026-05-10T05:53:00Z; this cycle deliberately ships a non-ZIP alias). Same alias-only playbook as P141.A / P142.A / P143.A / P144.A / P145.A / P146.A / P147.A / P148.A / P149.A / P150.A.
  '/gif-to-frames.html': '/image-converter-tools/extract-gif-to-image-frames.html',
  // Cycle152 P152.A — capture bare URL traffic for "lcd tester" head-query (2,260 imp / 28d, pos 5.11, CTR 2.65% per GSC; 60 clicks currently routed to homepage). Bare URL currently 200-serves the GitHub-Pages 404 fallback (homepage HTML 201,113 bytes, canonical=/, last-modified Sat, 09 May 2026 11:04:31 GMT — post-PR-#117 rebuild). Aliasing to the existing /lcd-test.html canonical device-test tool re-routes the traffic without editing it. NOT a ZIP-cluster URL — ZIP-CRITICAL-CARE 24h cooldown deliberately not engaged (cooldown anchor 2026-05-09T05:53:00Z still active until 2026-05-10T05:53:00Z; this cycle ships a non-ZIP alias). Same alias-only playbook as P141.A / P142.A / P143.A / P144.A / P145.A / P146.A / P147.A / P148.A / P149.A / P150.A / P151.A.
  '/lcd-tester.html': '/device-test-tools/lcd-test.html',
  // Cohort device-test URL migration — generated by update-jsp-by-route.mjs (URLMIG-19 sub-step 3.N.b).
  // Operator-override-2026-05-10 (option B, meta-refresh fallback). Old flat tool URLs alias single-hop
  // to the new clustered canonical URLs registered above. The renderer's renderRedirectPage() emits a
  // <meta refresh 0> + JS replace + <link rel=canonical> + noindex,follow page at each old URL.
  '/microphone-test.html': '/device-test-tools/microphone-test.html',
  '/camera-test.html': '/device-test-tools/camera-test.html',
  '/lcd-test.html': '/device-test-tools/lcd-test.html',
  '/keyboard-test.html': '/device-test-tools/keyboard-test.html',
  // Cohort utility URL migration — generated by update-jsp-by-route.mjs (URLMIG-19 sub-step 3.N.b).
  // Operator-override-2026-05-10 (option B, meta-refresh fallback). Old flat tool URLs alias single-hop
  // to the new clustered canonical URLs registered above. The renderer's renderRedirectPage() emits a
  // <meta refresh 0> + JS replace + <link rel=canonical> + noindex,follow page at each old URL.
  '/file-compressor.html': '/utility-tools/file-compressor.html',
  '/convert-time-in-millisecond-to-date.html': '/utility-tools/convert-time-in-millisecond-to-date.html',
  '/get-time-in-millisecond.html': '/utility-tools/get-time-in-millisecond.html',
  '/qr-code-generator.html': '/utility-tools/qr-code-generator.html',
  '/do-nong-do-con-truc-tuyen.html': '/utility-tools/do-nong-do-con-truc-tuyen.html',
  '/cong-cu-chuyen-doi-chu-quoc-ngu-tieng-viet-thanh-tieq-viet-kieu-moi.html': '/utility-tools/cong-cu-chuyen-doi-chu-quoc-ngu-tieng-viet-thanh-tieq-viet-kieu-moi.html',
  // Cohort video URL migration — generated by update-jsp-by-route.mjs (URLMIG-19 sub-step 3.N.b).
  // Operator-override-2026-05-10 (option B, meta-refresh fallback). Old flat tool URLs alias single-hop
  // to the new clustered canonical URLs registered above. The renderer's renderRedirectPage() emits a
  // <meta refresh 0> + JS replace + <link rel=canonical> + noindex,follow page at each old URL.
  '/video-converter.html': '/video-tools/video-converter.html',
  '/video-maker.html': '/video-tools/video-maker.html',
  '/ffmpeg-online.html': '/video-tools/ffmpeg-online.html',
  // Cohort image-editing URL migration — generated by update-jsp-by-route.mjs (URLMIG-19 sub-step 3.N.b).
  // Operator-override-2026-05-10 (option B, meta-refresh fallback). Old flat tool URLs alias single-hop
  // to the new clustered canonical URLs registered above. The renderer's renderRedirectPage() emits a
  // <meta refresh 0> + JS replace + <link rel=canonical> + noindex,follow page at each old URL.
  '/compress-image.html': '/image-tools/compress-image.html',
  '/resize-image.html': '/image-tools/resize-image.html',
  '/crop-image.html': '/image-tools/crop-image.html',
  '/photo-editor.html': '/image-tools/photo-editor.html',
  '/gif-maker.html': '/image-tools/gif-maker.html',
  '/insights-image-optimizer.html': '/image-tools/insights-image-optimizer.html',
  '/get-jpeg-compression-level.html': '/image-tools/get-jpeg-compression-level.html',
  '/imagemagick-online.html': '/image-tools/imagemagick-online.html',
  // Cohort developer URL migration — generated by update-jsp-by-route.mjs (URLMIG-19 sub-step 3.N.b).
  // Operator-override-2026-05-10 (option B, meta-refresh fallback). Old flat tool URLs alias single-hop
  // to the new clustered canonical URLs registered above. The renderer's renderRedirectPage() emits a
  // <meta refresh 0> + JS replace + <link rel=canonical> + noindex,follow page at each old URL.
  '/json-parser.html': '/developer-tools/json-parser.html',
  '/css-minifier.html': '/developer-tools/css-minifier.html',
  '/css-unminifier.html': '/developer-tools/css-unminifier.html',
  '/js-minifier.html': '/developer-tools/js-minifier.html',
  '/js-unminifier.html': '/developer-tools/js-unminifier.html',
  '/text-diff.html': '/developer-tools/text-diff.html',
  '/md5-converter.html': '/developer-tools/md5-converter.html',
  '/css-gradient-generator.html': '/developer-tools/css-gradient-generator.html',
  '/text-html-editor.html': '/developer-tools/text-html-editor.html',
  // Cohort pdf URL migration — generated by update-jsp-by-route.mjs (URLMIG-19 sub-step 3.N.b).
  // Operator-override-2026-05-10 (option B, meta-refresh fallback). Old flat tool URLs alias single-hop
  // to the new clustered canonical URLs registered above. The renderer's renderRedirectPage() emits a
  // <meta refresh 0> + JS replace + <link rel=canonical> + noindex,follow page at each old URL.
  '/compose-pdf.html': '/pdf-tools/compose-pdf.html',
  '/split-pdf-by-range.html': '/pdf-tools/split-pdf-by-range.html',
  '/split-pdf-to-each-pages.html': '/pdf-tools/split-pdf-to-each-pages.html',
  '/join-pdf-from-multiple-files.html': '/pdf-tools/join-pdf-from-multiple-files.html',
  '/protect-pdf-by-password.html': '/pdf-tools/protect-pdf-by-password.html',
  '/remove-pdf-password.html': '/pdf-tools/remove-pdf-password.html',
  '/preflight-pdf.html': '/pdf-tools/preflight-pdf.html',
  '/flatten-pdf.html': '/pdf-tools/flatten-pdf.html',
  '/pdf-to-text.html': '/pdf-tools/pdf-to-text.html',
  '/pdf-to-images.html': '/pdf-tools/pdf-to-images.html',
  '/pdf-to-html.html': '/pdf-tools/pdf-to-html.html',
  '/images-to-pdf.html': '/pdf-tools/images-to-pdf.html',
  // Cohort image-conversion URL migration — generated by update-jsp-by-route.mjs (URLMIG-19 sub-step 3.N.b).
  // Operator-override-2026-05-10 (option B, meta-refresh fallback). Old flat tool URLs alias single-hop
  // to the new clustered canonical URLs registered above. The renderer's renderRedirectPage() emits a
  // <meta refresh 0> + JS replace + <link rel=canonical> + noindex,follow page at each old URL.
  '/heic-to-jpg.html': '/image-converter-tools/heic-to-jpg.html',
  // Cycle 20260629-3: synonym-query alias (operator-approved option-a on card
  // new-tool-heic-jpg-converter-cannibalizes-heic-to-jpg-20260629-3). Captures the
  // "heic jpg converter" synonym demand WITHOUT a cannibalizing new tool page -
  // routes to the live HEIC->JPG converter. Paired CloudFront 301 entry added.
  '/heic-jpg-converter.html': '/image-converter-tools/heic-to-jpg.html',
  '/svg-to-png.html': '/image-converter-tools/svg-to-png.html',
  '/png-to-svg.html': '/image-converter-tools/png-to-svg.html',
  '/image-to-base64.html': '/image-converter-tools/image-to-base64.html',
  '/base64-to-image.html': '/image-converter-tools/base64-to-image.html',
  '/extract-gif-to-image-frames.html': '/image-converter-tools/extract-gif-to-image-frames.html',
  // Cohort zip URL migration — generated by update-jsp-by-route.mjs (URLMIG-19 sub-step 3.N.b).
  // Operator-override-2026-05-10 (option B, meta-refresh fallback). Old flat tool URLs alias single-hop
  // to the new clustered canonical URLs registered above. The renderer's renderRedirectPage() emits a
  // <meta refresh 0> + JS replace + <link rel=canonical> + noindex,follow page at each old URL.
  '/zip-file.html': '/zip-tools/zip-file.html',
  '/unzip-file.html': '/zip-tools/unzip-file.html',
  '/remove-zip-password.html': '/zip-tools/remove-zip-password.html',
  // Cycle 20260514-6-followup URL-convention cleanup. Both URLs below
  // shipped to staging+prod with smashed-multi-word slugs (non-kebab),
  // were caught by qa-content-quality-gates CRITICAL on subsequent
  // cycles, and are now redirected via alias to the kebab-canonical
  // page (preserves any inbound link 200s while pointing search engines
  // + readers to the canonical URL).
  '/guides/lcdtest.html': '/guides/en/lcd-test-online.html',         // smashed "lcd test"; canonical = lcd-test-online (new guide created cycle 20260514-5)
  '/guides/foldertozipconverter.html': '/zip-tools/zip-file.html', // smashed "folder to zip converter"; redirect to working tool (no dedicated guide)
  // Cycle 20260518 create_new_guide_page synth picked "lcd tes" (GSC query
  // 635 imp / 3 clicks / pos 6.6 — typo of "lcd test"). Authoring a full
  // /guides/lcd-tes.html guide would near-clone /guides/lcd-test-online.html
  // (axis-F cluster_narrative dupe). Routing via alias captures the typo'd
  // query traffic and 301s to the canonical guide — same pattern as the
  // /guides/lcdtest.html cycle 20260514-6-followup cleanup above. Deferred-
  // approval card explains the deviation from the synth's "author a complete
  // page" contract: cluster is saturated (7+ existing lcd-* guides) and the
  // typo'd intent is best served by re-using the canonical lcd-test-online
  // guide rather than authoring an 8th near-duplicate.
  '/guides/lcd-tes.html': '/guides/en/lcd-test-online.html',         // typo of "lcd test"; canonical = lcd-test-online (cluster anti-cannibalization)
  // Multilingual guide migration (2026-05-28 plan-warm-pascal-v2 S1).
  // Per [⛔ Two-layer redirect rule]: CloudFront 301 (~100% equity) is
  // primary; this origin meta-refresh fallback (~95% equity) catches
  // direct origin requests when the CF function is bypassed.
  '/guides/compactar-pasta.html': '/guides/pt/compress-folder.html',
  '/guides/comprimir-arquivo-zip.html': '/guides/pt/compress-zip-file.html',
  '/guides/comprimir-pasta-zipada.html': '/guides/pt/compress-folder-to-zip.html',
  '/guides/comprimir-zip-online.html': '/guides/pt/compress-zip-online.html',
  '/guides/zipar-pasta.html': '/guides/pt/zip-a-folder.html',
  '/guides/comprimir-carpeta-zip-online-gratis.html': '/guides/es/compress-folder-to-zip-online-free.html',
  '/guides/reducir-tama-o-zip-online.html': '/guides/es/reduce-zip-size-online.html',
  // plan-warm-pascal-v3 S1.8 (2026-05-29) — 166 EN canonical routes
  // /guides/<slug>.html aliased to /guides/en/<slug>.html.
  '/guides/base64-when-to-use-and-when-not-to.html': '/guides/en/base64-when-to-use-and-when-not-to.html',
  '/guides/before-a-video-call-which-tools-to-run.html': '/guides/en/before-a-video-call-which-tools-to-run.html',
  '/guides/camera-check.html': '/guides/en/camera-check.html',
  '/guides/camera-mirror-vs-flip-explained.html': '/guides/en/camera-mirror-vs-flip-explained.html',
  '/guides/camera-test-permission-blocked-how-to-allow-it.html': '/guides/en/camera-test-permission-blocked-how-to-allow-it.html',
  '/guides/camera-test-shows-black-screen-four-fixes.html': '/guides/en/camera-test-shows-black-screen-four-fixes.html',
  '/guides/camera-test-vs-webcam-test-which-do-you-need.html': '/guides/en/camera-test-vs-webcam-test-which-do-you-need.html',
  // Cycle 20260610-13 - LCD test for laptop screens (device-test)
  '/guides/lcd-test-laptop.html': '/guides/en/lcd-test-laptop.html',
  '/guides/compress-folder-online.html': '/guides/en/compress-folder-online.html',
  '/guides/folder-compressor-online.html': '/guides/en/compress-folder-online.html',
  // Cycle 20260605 - capture "online folder compressor" query word-order variant (GSC: 216 imp / 28d, pos 5.09, CTR 13.4% per phase1 keyword-opportunities); semantic-dedup target = canonical /guides/en/compress-folder-online.html; alias-emit per CLAUDE.md "Semantic dedup" rule (G51 + dedup gate). Paired CloudFront 301 entry below.
  '/guides/online-folder-compressor.html': '/guides/en/compress-folder-online.html',
  '/guides/compress-jpeg-without-losing-quality-quality-vs-size.html': '/guides/en/compress-jpeg-without-losing-quality-quality-vs-size.html',
  '/guides/compress-zip-file-to-100kb.html': '/guides/en/compress-zip-file-to-100kb.html',
  '/guides/compress-zip-file-to-2mb.html': '/guides/en/compress-zip-file-to-2mb.html',
  '/guides/compress-zip-file-to-smaller-size.html': '/guides/en/compress-zip-file-to-smaller-size.html',
  '/guides/compress-zip-size.html': '/guides/en/compress-zip-size.html',
  '/guides/compress-zip.html': '/guides/en/compress-zip.html',
  '/guides/compressed-jpg-looks-blurry-three-causes.html': '/guides/en/compressed-jpg-looks-blurry-three-causes.html',
  '/guides/convert-milliseconds-to-date.html': '/guides/en/convert-milliseconds-to-date.html',
  '/guides/create-zip-file-online.html': '/guides/en/create-zip-file-online.html',
  '/guides/crop-and-rotate-image.html': '/guides/en/crop-and-rotate-image.html',
  '/guides/css-minifier-vs-compressor.html': '/guides/en/css-minifier-vs-compressor.html',
  '/guides/css-minifier-vs-uglifier-vs-tree-shaking.html': '/guides/en/css-minifier-vs-uglifier-vs-tree-shaking.html',
  '/guides/css-unminifier-vs-prettier-when-to-use-each.html': '/guides/en/css-unminifier-vs-prettier-when-to-use-each.html',
  '/guides/csv-vs-json-data-formats.html': '/guides/en/csv-vs-json-data-formats.html',
  '/guides/current-millis.html': '/guides/en/current-millis.html',
  '/guides/current-time-in-milliseconds.html': '/guides/en/current-time-in-milliseconds.html',
  '/guides/time-in-ms.html': '/guides/en/time-in-ms.html',
  '/guides/dead-pixel-testing-guide.html': '/guides/en/dead-pixel-testing-guide.html',
  '/guides/device-test-checklist-for-remote-work.html': '/guides/en/device-test-checklist-for-remote-work.html',
  '/guides/download-link-not-appearing-after-conversion-five-fixes.html': '/guides/en/download-link-not-appearing-after-conversion-five-fixes.html',
  '/guides/extract-gif-frames-png-vs-jpg-which-format.html': '/guides/en/extract-gif-frames-png-vs-jpg-which-format.html',
  '/guides/ffmpeg-online-conversion-stalled-three-fixes.html': '/guides/en/ffmpeg-online-conversion-stalled-three-fixes.html',
  '/guides/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html': '/guides/en/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html',
  '/guides/ffmpeg-online-vs-video-converter-which-to-pick.html': '/guides/en/ffmpeg-online-vs-video-converter-which-to-pick.html',
  '/guides/file-compressor-online-when-to-zip-vs-when-to-compress-image.html': '/guides/en/file-compressor-online-when-to-zip-vs-when-to-compress-image.html',
  '/guides/file-compressor-vs-zip-what-to-pick.html': '/guides/en/file-compressor-vs-zip-what-to-pick.html',
  '/guides/file-compressor.html': '/guides/en/file-compressor.html',
  '/guides/file-to-zip.html': '/guides/en/file-to-zip.html',
  '/guides/folder-to-zip.html': '/guides/en/folder-to-zip.html',
  '/guides/online-diff-tool.html': '/guides/en/online-diff-tool.html',
  '/guides/common-md5-gethash64string.html': '/guides/en/common-md5-gethash64string.html',
  '/guides/free-online-tools-that-work-without-uploading-files.html': '/guides/en/free-online-tools-that-work-without-uploading-files.html',
  '/guides/gif-frame-extractor-output-looks-wrong-three-causes.html': '/guides/en/gif-frame-extractor-output-looks-wrong-three-causes.html',
  '/guides/gif-frame-extractor.html': '/guides/en/gif-frame-extractor.html',
  '/guides/gif-to-frames-converter.html': '/guides/en/gif-to-frames-converter.html',
  '/guides/gif-to-frame.html': '/guides/en/gif-to-frame.html',
  '/guides/gif-frames-extract-vs-frame-rate-fps-explained.html': '/guides/en/gif-frames-extract-vs-frame-rate-fps-explained.html',
  '/guides/gif-into-frames.html': '/guides/en/gif-into-frames.html',
  '/guides/hd-video-converter-step-by-step.html': '/guides/en/hd-video-converter-step-by-step.html',
  '/guides/hd-video-converter-vs-alternatives.html': '/guides/en/hd-video-converter-vs-alternatives.html',
  '/guides/hd-video-converter-when.html': '/guides/en/hd-video-converter-when.html',
  '/guides/heic-to-jpg-claims-what-actually-works.html': '/guides/en/heic-to-jpg-claims-what-actually-works.html',
  '/guides/heic-vs-jpg-converter-when-each-wins.html': '/guides/en/heic-vs-jpg-converter-when-each-wins.html',
  '/guides/heic-vs-jpg-vs-webp.html': '/guides/en/heic-vs-jpg-vs-webp.html',
  '/guides/how-to-check-camera-quality-on-your-phone.html': '/guides/en/how-to-check-camera-quality-on-your-phone.html',
  '/guides/how-to-check-webcam-and-microphone-before-an-interview.html': '/guides/en/how-to-check-webcam-and-microphone-before-an-interview.html',
  '/guides/how-to-choose-a-compression-level.html': '/guides/en/how-to-choose-a-compression-level.html',
  '/guides/how-to-compress-a-file-online.html': '/guides/en/how-to-compress-a-file-online.html',
  '/guides/how-to-compress-a-folder-for-email.html': '/guides/en/how-to-compress-a-folder-for-email.html',
  '/guides/how-to-compress-a-folder.html': '/guides/en/how-to-compress-a-folder.html',
  '/guides/how-to-compress-a-jpg-for-email-attachment-limits.html': '/guides/en/how-to-compress-a-jpg-for-email-attachment-limits.html',
  '/guides/how-to-compress-a-zip-file-to-a-specific-size.html': '/guides/en/how-to-compress-a-zip-file-to-a-specific-size.html',
  '/guides/how-to-compress-a-zip-file.html': '/guides/en/how-to-compress-a-zip-file.html',
  '/guides/how-to-compress-zip-file-to-smaller-size.html': '/guides/en/how-to-compress-zip-file-to-smaller-size.html',
  '/guides/how-to-convert-100-heic-photos-to-jpg.html': '/guides/en/how-to-convert-100-heic-photos-to-jpg.html',
  '/guides/how-to-convert-heic-to-jpg-step-by-step.html': '/guides/en/how-to-convert-heic-to-jpg-step-by-step.html',
  '/guides/how-to-convert-iphone-photo-to-jpg.html': '/guides/en/how-to-convert-iphone-photo-to-jpg.html',
  '/guides/how-to-crop-and-rotate-an-image.html': '/guides/en/how-to-crop-and-rotate-an-image.html',
  '/guides/how-to-extract-a-file-online-zip-rar-7z.html': '/guides/en/how-to-extract-a-file-online-zip-rar-7z.html',
  '/guides/how-to-extract-frames-from-a-gif-for-a-social-post.html': '/guides/en/how-to-extract-frames-from-a-gif-for-a-social-post.html',
  '/guides/how-to-flatten-a-pdf-and-when-to-do-it.html': '/guides/en/how-to-flatten-a-pdf-and-when-to-do-it.html',
  '/guides/how-to-make-a-zip-file-smaller.html': '/guides/en/how-to-make-a-zip-file-smaller.html',
  '/guides/how-to-minify-css-js-for-cloud-run-cold-start.html': '/guides/en/how-to-minify-css-js-for-cloud-run-cold-start.html',
  '/guides/how-to-reduce-zip-file-size-online.html': '/guides/en/how-to-reduce-zip-file-size-online.html',
  '/guides/how-to-reduce-zip-file-size.html': '/guides/en/how-to-reduce-zip-file-size.html',
  '/guides/how-to-sign-pdf-after-removing-a-password.html': '/guides/en/how-to-sign-pdf-after-removing-a-password.html',
  '/guides/how-to-split-a-gif-into-frames-for-editing.html': '/guides/en/how-to-split-a-gif-into-frames-for-editing.html',
  '/guides/how-to-tell-if-a-jpg-was-compressed-too-much.html': '/guides/en/how-to-tell-if-a-jpg-was-compressed-too-much.html',
  '/guides/how-to-test-a-keyboard-online-step-by-step.html': '/guides/en/how-to-test-a-keyboard-online-step-by-step.html',
  '/guides/how-to-test-a-touchscreen-for-bad-spots.html': '/guides/en/how-to-test-a-touchscreen-for-bad-spots.html',
  '/guides/how-to-test-for-dead-pixels-before-returning-a-monitor.html': '/guides/en/how-to-test-for-dead-pixels-before-returning-a-monitor.html',
  '/guides/how-to-zip-folder-online-step-by-step.html': '/guides/en/how-to-zip-folder-online-step-by-step.html',
  '/guides/how-to-zip-multiple-files-into-one.html': '/guides/en/how-to-zip-multiple-files-into-one.html',
  '/guides/i-love-zip.html': '/guides/en/i-love-zip.html',
  '/guides/image-compression-and-exif-metadata-what-gets-stripped.html': '/guides/en/image-compression-and-exif-metadata-what-gets-stripped.html',
  '/guides/image-to-base64-embed-in-html-vs-link.html': '/guides/en/image-to-base64-embed-in-html-vs-link.html',
  '/guides/imagemagick-online-vs-task-specific-tools-which-to-pick.html': '/guides/en/imagemagick-online-vs-task-specific-tools-which-to-pick.html',
  '/guides/iphone-photo-format-explained-heic-jpg-png-raw.html': '/guides/en/iphone-photo-format-explained-heic-jpg-png-raw.html',
  '/guides/jpg-vs-jpeg-are-they-the-same.html': '/guides/en/jpg-vs-jpeg-are-they-the-same.html',
  '/guides/jpg-vs-png-for-web.html': '/guides/en/jpg-vs-png-for-web.html',
  '/guides/json-formatter-step-by-step.html': '/guides/en/json-formatter-step-by-step.html',
  '/guides/json-formatter-vs-alternatives.html': '/guides/en/json-formatter-vs-alternatives.html',
  '/guides/json-formatter-when.html': '/guides/en/json-formatter-when.html',
  '/guides/json-parser-validate-vs-format-vs-tree-view.html': '/guides/en/json-parser-validate-vs-format-vs-tree-view.html',
  '/guides/json-vs-yaml-vs-toml-config-formats-explained.html': '/guides/en/json-vs-yaml-vs-toml-config-formats-explained.html',
  '/guides/keyboard-test-keys-not-detected-four-fixes.html': '/guides/en/keyboard-test-keys-not-detected-four-fixes.html',
  '/guides/keyboard-tester-online-rollover-vs-anti-ghosting.html': '/guides/en/keyboard-tester-online-rollover-vs-anti-ghosting.html',
  '/guides/kompres-file-zip.html': '/guides/en/kompres-file-zip.html',
  '/guides/kompres-zip.html': '/guides/en/kompres-zip.html',
  '/guides/lcd-checker.html': '/guides/en/lcd-checker.html',
  '/guides/lcd-screen-test.html': '/guides/en/lcd-screen-test.html',
  '/guides/lcd-test-online.html': '/guides/en/lcd-test-online.html',
  '/guides/lcd-test-vs-display-test-which-do-you-need.html': '/guides/en/lcd-test-vs-display-test-which-do-you-need.html',
  '/guides/lcd-test-what-it-checks.html': '/guides/en/lcd-test-what-it-checks.html',
  '/guides/led-test-vs-lcd-test-which-applies-to-your-screen.html': '/guides/en/led-test-vs-lcd-test-which-applies-to-your-screen.html',
  '/guides/led-test.html': '/guides/en/led-test.html',
  '/guides/long-number-millisecond-or-second.html': '/guides/en/long-number-millisecond-or-second.html',
  '/guides/make-zip-file-online.html': '/guides/en/make-zip-file-online.html',
  '/guides/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html': '/guides/en/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html',
  '/guides/md5-decode.html': '/guides/en/md5-decode.html',
  '/guides/md5-decrypt-online.html': '/guides/en/md5-decrypt-online.html',
  '/guides/md5-hash-decrypt.html': '/guides/en/md5-hash-decrypt.html',
  '/guides/md5-password.html': '/guides/en/md5-password.html',
  '/guides/md5-to-text-why-you-cannot-convert-back.html': '/guides/en/md5-to-text-why-you-cannot-convert-back.html',
  '/guides/md5-vs-sha256-when-to-hash.html': '/guides/en/md5-vs-sha256-when-to-hash.html',
  '/guides/microphone-test-no-sound-four-fixes.html': '/guides/en/microphone-test-no-sound-four-fixes.html',
  '/guides/microphone-test-online-quiet-normal-peak-meter.html': '/guides/en/microphone-test-online-quiet-normal-peak-meter.html',
  '/guides/microphone-test-online-what-it-actually-checks.html': '/guides/en/microphone-test-online-what-it-actually-checks.html',
  '/guides/microphone-test-permission-blocked-how-to-allow-it.html': '/guides/en/microphone-test-permission-blocked-how-to-allow-it.html',
  '/guides/millisecond-to-date.html': '/guides/en/millisecond-to-date.html',
  '/guides/milliseconds-to-date-utc-vs-local-time.html': '/guides/en/milliseconds-to-date-utc-vs-local-time.html',
  '/guides/mp4-vs-mov-vs-mkv-which-container-when.html': '/guides/en/mp4-vs-mov-vs-mkv-which-container-when.html',
  '/guides/mp4-vs-webm-for-web.html': '/guides/en/mp4-vs-webm-for-web.html',
  '/guides/ms-to-date.html': '/guides/en/ms-to-date.html',
  '/guides/oled-test-vs-lcd-test-what-changes-on-oled.html': '/guides/en/oled-test-vs-lcd-test-what-changes-on-oled.html',
  '/guides/online-zip-file-compressor.html': '/guides/en/online-zip-file-compressor.html',
  '/guides/online-zip-file.html': '/guides/en/online-zip-file.html',
  '/guides/online-zip-vs-7z-vs-rar-which-to-pick.html': '/guides/en/online-zip-vs-7z-vs-rar-which-to-pick.html',
  '/guides/pdf-editing-ladder.html': '/guides/en/pdf-editing-ladder.html',
  '/guides/pdf-password-types-owner-vs-user.html': '/guides/en/pdf-password-types-owner-vs-user.html',
  '/guides/pdf-preflight-online-what-it-actually-checks.html': '/guides/en/pdf-preflight-online-what-it-actually-checks.html',
  '/guides/pdf-vs-heic-for-document-archival.html': '/guides/en/pdf-vs-heic-for-document-archival.html',
  '/guides/photo-editor-vs-graphics-app-vs-batch-processor.html': '/guides/en/photo-editor-vs-graphics-app-vs-batch-processor.html',
  '/guides/png-to-svg-when-to-vectorize-a-raster-image.html': '/guides/en/png-to-svg-when-to-vectorize-a-raster-image.html',
  '/guides/png-vs-svg-when-to-use.html': '/guides/en/png-vs-svg-when-to-use.html',
  '/guides/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html': '/guides/en/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html',
  '/guides/qr-code-error-correction-and-scan-failures.html': '/guides/en/qr-code-error-correction-and-scan-failures.html',
  '/guides/qr-code-generator-best-practices.html': '/guides/en/qr-code-generator-best-practices.html',
  '/guides/read-and-compare-md5-hashes-correctly.html': '/guides/en/read-and-compare-md5-hashes-correctly.html',
  '/guides/recover-corrupt-zip-file-options.html': '/guides/en/recover-corrupt-zip-file-options.html',
  '/guides/reduce-zip-file-size-online.html': '/guides/en/reduce-zip-file-size-online.html',
  '/guides/resize-image-online-free.html': '/guides/en/resize-image-online-free.html',
  '/guides/resize-zip-file.html': '/guides/en/resize-zip-file.html',
  '/guides/screen-display-test-synonyms.html': '/guides/en/screen-display-test-synonyms.html',
  '/guides/screen-test-for-laptop-5-minute-checklist.html': '/guides/en/screen-test-for-laptop-5-minute-checklist.html',
  '/guides/screen-test-online-vs-app-which-is-more-accurate.html': '/guides/en/screen-test-online-vs-app-which-is-more-accurate.html',
  '/guides/screen-test-vs-camera-test-pick-the-right-tool.html': '/guides/en/screen-test-vs-camera-test-pick-the-right-tool.html',
  '/guides/split-gif-into-frames.html': '/guides/en/split-gif-into-frames.html',
  '/guides/svg-to-png-when-to-rasterize-an-svg.html': '/guides/en/svg-to-png-when-to-rasterize-an-svg.html',
  '/guides/tes-lcd.html': '/guides/en/tes-lcd.html',
  '/guides/test-lcd.html': '/guides/en/test-lcd.html',
  '/guides/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html': '/guides/en/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html',
  '/guides/tool-free.html': '/guides/en/tool-free.html',
  '/guides/unix-timestamps-explained.html': '/guides/en/unix-timestamps-explained.html',
  '/guides/unlock-zip-file-online.html': '/guides/en/unlock-zip-file-online.html',
  '/guides/unminify-js.html': '/guides/en/unminify-js.html',
  '/guides/what-an-lcd-test-does-and-when-to-run-one.html': '/guides/en/what-an-lcd-test-does-and-when-to-run-one.html',
  '/guides/what-is-a-file-compressor-and-which-to-use.html': '/guides/en/what-is-a-file-compressor-and-which-to-use.html',
  '/guides/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html': '/guides/en/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html',
  '/guides/when-to-compress-vs-convert-an-image.html': '/guides/en/when-to-compress-vs-convert-an-image.html',
  '/guides/why-heic-wont-open-on-windows-three-fixes.html': '/guides/en/why-heic-wont-open-on-windows-three-fixes.html',
  '/guides/why-md5-cannot-be-decrypted.html': '/guides/en/why-md5-cannot-be-decrypted.html',
  '/guides/zip-compress.html': '/guides/en/zip-compress.html',
  '/guides/zip-compressor-online.html': '/guides/en/zip-compressor-online.html',
  '/guides/zip-compressor.html': '/guides/en/zip-compressor.html',
  '/guides/zip-file-compressor-online.html': '/guides/en/zip-file-compressor-online.html',
  '/guides/zip-file-converter-what-it-actually-does.html': '/guides/en/zip-file-converter-what-it-actually-does.html',
  '/guides/zip-file-converter.html': '/guides/en/zip-file-converter.html',
  '/guides/zip-file-size-compressor.html': '/guides/en/zip-file-size-compressor.html',
  '/guides/zip-folder-online-free.html': '/guides/en/zip-folder-online-free.html',
  '/guides/zip-password-recovery-online.html': '/guides/en/zip-password-recovery-online.html',
  '/guides/zip-password-types-strong-vs-weak-explained.html': '/guides/en/zip-password-types-strong-vs-weak-explained.html',
  '/guides/zip-password-unlocker.html': '/guides/en/zip-password-unlocker.html',
  '/guides/zip-size-reducer.html': '/guides/en/zip-size-reducer.html',
  '/guides/zip-unlocker-online.html': '/guides/en/zip-unlocker-online.html',
  '/guides/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html': '/guides/en/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html',
  '/regex-tester.html': '/developer-tools/regex-tester.html',
  '/todo-list.html': '/utility-tools/todo-list.html',
  '/unit-converter.html': '/utility-tools/unit-converter.html',
  '/color-picker.html': '/developer-tools/color-picker.html',
  '/data-visualizer.html': '/developer-tools/data-visualizer.html',
  '/screen-recorder.html': '/device-test-tools/screen-recorder.html',
  '/font-generator.html': '/utility-tools/font-generator.html',
  '/code-editor.html': '/developer-tools/code-editor.html',
  '/steganography.html': '/image-tools/steganography.html',
  '/private-ai-chat.html': '/utility-tools/private-ai-chat.html',
  '/pdf-filler-form-editor.html': '/pdf-tools/pdf-filler-form-editor.html',
  '/audio-converter.html': '/image-converter-tools/audio-converter.html',
  '/code-formatter-beautifier.html': '/developer-tools/code-formatter-beautifier.html',
  '/analog-clock.html': '/utility-tools/analog-clock.html',
  '/digital-clock.html': '/utility-tools/digital-clock.html',
  '/countdown-timer.html': '/utility-tools/countdown-timer.html',
  '/stopwatch.html': '/utility-tools/stopwatch.html',
  '/online-alarm-clock.html': '/utility-tools/online-alarm-clock.html',
  '/wheel-spinner.html': '/utility-tools/wheel-spinner.html',
  '/dice-roller.html': '/utility-tools/dice-roller.html',
  '/coin-flip.html': '/utility-tools/coin-flip.html',
  '/random-number-picker.html': '/utility-tools/random-number-picker.html',
  '/name-shuffler.html': '/utility-tools/name-shuffler.html',
  '/yes-or-no-wheel.html': '/utility-tools/yes-or-no-wheel.html',
  '/word-counter.html': '/developer-tools/word-counter.html',
  '/sort-text-lines.html': '/developer-tools/sort-text-lines.html',
  '/remove-duplicate-lines.html': '/developer-tools/remove-duplicate-lines.html',
  '/reverse-text.html': '/developer-tools/reverse-text.html',
  '/password-generator.html': '/utility-tools/password-generator.html',
  '/video-trimmer.html': '/video-tools/video-trimmer.html',
  '/voice-recorder.html': '/utility-tools/voice-recorder.html',
  '/text-to-speech.html': '/utility-tools/text-to-speech.html',
  '/speech-to-text.html': '/utility-tools/speech-to-text.html',
  '/habit-tracker.html': '/utility-tools/habit-tracker.html',
  '/grocery-list.html': '/utility-tools/grocery-list.html',
  '/qr-code-scanner.html': '/utility-tools/qr-code-scanner.html',
  '/text-repeater.html': '/developer-tools/text-repeater.html',
  '/base64-encoder.html': '/developer-tools/base64-encoder.html',
  '/url-decoder.html': '/developer-tools/url-decoder.html',
};

// ─────────────────────────────────────────────────────────────────────────
// JSP_BY_ROUTE — URL → JSP wrapper mapping. EVERY new key MUST match the
// kebab-case convention:
//
//   ^/(guides/)?[a-z0-9]+(-[a-z0-9]+)*\.html$
//
// Rules (cycle 20260514-6-followup, NON-NEGOTIABLE — see CLAUDE.md
// "⛔ URL convention" block):
//
//   ✅ /guides/how-to-compress-a-folder.html   (multi-word, hyphenated)
//   ✅ /lcd-test.html                          (multi-word, hyphenated)
//   ✅ /sitemap.html                           (genuine single-word ≤ 12 chars)
//   ❌ /guides/howtocompressafolder.html       (smashed multi-word, CRITICAL)
//   ❌ /guides/lcdtest.html                    (shadows /lcd-test.html, CRITICAL)
//   ❌ /guides/foldertozipconverter.html       (smashed, CRITICAL)
//
// Audit gate: node .agent/skills/qa-content-quality-gates/scripts/scan.mjs
//   emits CRITICAL on smashed_multi_word_guide_route +
//   guide_shadows_existing_route → BLOCKs Phase 5 mirror.
//
// Legacy non-kebab URLs that already shipped are kept here for inbound-link
// 200s but REMOVED from GUIDE_ROUTES (abort-in-place, sitemap-excluded).
// Operator can rename them to kebab in a future cycle; do NOT add NEW
// non-kebab entries to this map.
// ─────────────────────────────────────────────────────────────────────────
export const JSP_BY_ROUTE = {
  '/': 'index.jsp',
  '/about-us.html': 'about-us.jsp',
  '/contact-us.html': 'contact-us.jsp',
  '/privacy-policy.html': 'privacy-policy.jsp',
  '/tags.html': 'tags.jsp',
  // Phase 11 Cycle 5 P11.4.1.
  '/editorial-team.html': 'editorial-team.jsp',
  // Phase 11 Cycle 6 P11.4.8.
  '/sitemap.html': 'sitemap.jsp',
  '/alternatead.html': 'alternatead.jsp',
  // Guides - plan §3.3 greenfield /guides/ subpath for long-form content.
  '/guides/en/heic-vs-jpg-vs-webp.html': 'guide/en/heic-vs-jpg-vs-webp.jsp',
  '/guides/en/dead-pixel-testing-guide.html': 'guide/en/dead-pixel-testing-guide.jsp',
  '/guides/en/unix-timestamps-explained.html': 'guide/en/unix-timestamps-explained.jsp',
  '/guides/en/pdf-password-types-owner-vs-user.html': 'guide/en/pdf-password-types-owner-vs-user.jsp',
  // §3.5 comparison guides (Cycle 4).
  '/guides/en/png-vs-svg-when-to-use.html': 'guide/en/png-vs-svg-when-to-use.jsp',
  '/guides/en/css-minifier-vs-compressor.html': 'guide/en/css-minifier-vs-compressor.jsp',
  // Cycle 74 P74.B - JSON parser sub-feature disambiguation Lane-D guide.
  '/guides/en/json-parser-validate-vs-format-vs-tree-view.html': 'guide/en/json-parser-validate-vs-format-vs-tree-view.jsp',
  // Cycle 75 P75.B - milliseconds-to-date UTC-vs-local-time Lane-D guide.
  '/guides/en/milliseconds-to-date-utc-vs-local-time.html': 'guide/en/milliseconds-to-date-utc-vs-local-time.jsp',
  // Cycle 20260524-19 P19.F create_new_guide_page - "current time in milliseconds" bare-query Lane-D guide (utility cluster, companion to /get-time-in-millisecond.html).
  '/guides/en/current-time-in-milliseconds.html': 'guide/en/current-time-in-milliseconds.jsp',
  // Cycle 20260703-4 create_new_guide_page - "time in ms" bare-query Lane-D guide (utility cluster, companion to /get-time-in-millisecond.html).
  '/guides/en/time-in-ms.html': 'guide/en/time-in-ms.jsp',
  // Cycle 76 P76.A - screen-test-online-vs-app accuracy Lane-D guide (device-test cluster).
  '/guides/en/screen-test-online-vs-app-which-is-more-accurate.html': 'guide/en/screen-test-online-vs-app-which-is-more-accurate.jsp',
  // Cycle 77 P77.A - "compress ZIP to a specific size" Lane-D append-only guide.
  '/guides/en/how-to-compress-a-zip-file-to-a-specific-size.html': 'guide/en/how-to-compress-a-zip-file-to-a-specific-size.jsp',
  // Cycle 20260519-10 create_new_guide_page - "how to compress a zip file" bare-query step-by-step guide (companion to /zip-file.html).
  '/guides/en/how-to-compress-a-zip-file.html': 'guide/en/how-to-compress-a-zip-file.jsp',
  // Cycle 20260519-11 create_new_guide_page - "zip folder online free" bare-query step-by-step guide (companion to /zip-file.html).
  '/guides/en/zip-folder-online-free.html': 'guide/en/zip-folder-online-free.jsp',
  // Cycle 20260629-2 create_new_guide_page - "resize image online free" bare-query step-by-step guide (companion to /resize-image.html).
  '/guides/en/resize-image-online-free.html': 'guide/en/resize-image-online-free.jsp',
  // Cycle 20260629-3 create_new_guide_page - PT locale variant of "resize image online free" (locale-drain).
  '/guides/pt/resize-image-online-free.html': 'guide/pt/resize-image-online-free.jsp',
  // Cycle 20260630-8 create_new_guide_page - PT locale variant of "crop image online free" (locale-drain; EN canonical at bare /guides/crop-image-online-free.html).
  '/guides/pt/crop-image-online-free.html': 'guide/pt/crop-image-online-free.jsp',
  // Cycle 20260524-10 create_new_guide_page - "i love zip" bare-query landing (companion to /zip-file.html).
  '/guides/en/i-love-zip.html': 'guide/en/i-love-zip.jsp',
  // Cycle 20260604-9 create_new_guide_page - "tool free" chain-breaker force-ship (chain=5 reached per CLAUDE.md L3). Reframes the bare 'tool free' query as a privacy + monetisation explainer ("Are online tools actually free?") to avoid semantic_overlap with /utility-tools.html hub. utility cluster.
  '/guides/en/tool-free.html': 'guide/en/tool-free.jsp',
  // Cycle 78 P78.A - "QR code error correction and scan failures" Lane-D guide (companion to /qr-code-generator.html).
  '/guides/en/qr-code-error-correction-and-scan-failures.html': 'guide/en/qr-code-error-correction-and-scan-failures.jsp',
  // Cycle 79 P79.B - "Image to Base64: embed in HTML/CSS vs link the image file" Lane-D guide (companion to /image-to-base64.html + /base64-to-image.html).
  '/guides/en/image-to-base64-embed-in-html-vs-link.html': 'guide/en/image-to-base64-embed-in-html-vs-link.jsp',
  // Cycle 80 P80.G - "How to test a touchscreen for bad spots" Lane-D guide (device-test cluster, companion to /lcd-test.html).
  '/guides/en/how-to-test-a-touchscreen-for-bad-spots.html': 'guide/en/how-to-test-a-touchscreen-for-bad-spots.jsp',
  // Cycle 81 P81.A - "Webcam mirror vs flip explained" Lane-D guide (camera-test sub-cluster, companion to /camera-test.html).
  '/guides/en/camera-mirror-vs-flip-explained.html': 'guide/en/camera-mirror-vs-flip-explained.jsp',
  // Cycle 82 P82.A - "CSS Unminifier vs Prettier: when to use each" Lane-D guide (developer / CSS sub-cluster, companion to /css-unminifier.html).
  '/guides/en/css-unminifier-vs-prettier-when-to-use-each.html': 'guide/en/css-unminifier-vs-prettier-when-to-use-each.jsp',
  // Cycle 83 P83.A - "LED test vs LCD test: which applies to your screen?" Lane-D guide (device-test / lcd-test sub-cluster, companion to /lcd-test.html).
  '/guides/en/led-test-vs-lcd-test-which-applies-to-your-screen.html': 'guide/en/led-test-vs-lcd-test-which-applies-to-your-screen.jsp',
  // Cycle 233 P233.E - "OLED test vs LCD test: what changes on an OLED panel" Lane-D guide (device-test / lcd-test sub-cluster, companion to /lcd-test.html). Multi-cycle skeleton phase 1.
  '/guides/en/oled-test-vs-lcd-test-what-changes-on-oled.html': 'guide/en/oled-test-vs-lcd-test-what-changes-on-oled.jsp',
  // Cycle 20260517-7 P7.A - "LED test" Lane-D create_new_guide_page guide (device-test / lcd-test sub-cluster, companion to /lcd-test.html).
  '/guides/en/led-test.html': 'guide/en/led-test.jsp',
  // Cycle1/20260514-5 P1.A - "LCD test online" Lane-D guide (device-test / lcd-test sub-cluster, companion to /lcd-test.html). Multi-cycle Phase A skeleton (route scaffolding only).
  '/guides/en/lcd-test-online.html': 'guide/en/lcd-test-online.jsp',
  // Cycle1/20260514-5 create_new_guide_page - "Split GIF into frames" Lane-D guide (image-editing / gif-maker sub-cluster, companion to /gif-maker.html). Multi-cycle Phase A skeleton (route scaffolding only).
  '/guides/en/split-gif-into-frames.html': 'guide/en/split-gif-into-frames.jsp',
  // Cycle 20260515-12 create_new_guide_page - "Make Zip File Online" Lane-D guide (zip cluster, companion to /zip-tools/zip-file.html). Complete single-cycle ship per cycle 20260514-5 contract (no skeleton wait).
  '/guides/en/make-zip-file-online.html': 'guide/en/make-zip-file-online.jsp',
  // Cycle 20260515-13 create_new_guide_page - "Comprimir Zip Online" Lane-D guide (zip cluster, Spanish-keyword sibling of /guides/make-zip-file-online.html; companion to /zip-tools/zip-file.html). Complete single-cycle ship per cycle 20260514-5 contract.
  // Cycle 20260519-14 create_new_guide_page - "Comprimir Carpeta Zip Online Gratis" Lane-D guide (zip cluster, Spanish folder-compression intent; companion to /zip-file.html). Native-Spanish prose authored against tool-zipfile SKILL features. Complete single-cycle ship per cycle 20260514-5 contract.
  // Cycle 20260523-4 create_new_guide_page - "Reducir Tamaño Zip Online" Lane-D synonym-landing guide (zip cluster, Spanish size-reduction wording; companion to /zip-tools/zip-file.html). Routes to /guides/comprimir-zip-online.html for the compression-wording context. Complete single-cycle ship per cycle 20260514-5 contract.
  // Cycle 20260517-8 create_new_guide_page - "Online Zip File Compressor" Lane-D guide (zip cluster head-query sibling, companion to /zip-tools/zip-file.html). Complete single-cycle ship per cycle 20260514-5 contract.
  '/guides/en/online-zip-file-compressor.html': 'guide/en/online-zip-file-compressor.jsp',
  // Cycle 20260518-20 create_new_guide_page - "Zip Compress" Lane-D guide (zip cluster head-query sibling, companion to /zip-tools/zip-file.html). Complete single-cycle ship per cycle 20260514-5 contract.
  '/guides/en/zip-compress.html': 'guide/en/zip-compress.jsp',
  // Cycle 20260518-21 create_new_guide_page - "Zip password recovery online" Lane-D truthful-framing guide. Companion to /zip-tools/remove-zip-password.html. Source: tool-removezippassword/SKILL.md F1-F7 + N2 + N6.
  '/guides/en/zip-password-recovery-online.html': 'guide/en/zip-password-recovery-online.jsp',
  // Cycle 20260518-22 create_new_guide_page - "Zip compressor online" Lane-D guide (zip cluster head-query sibling, companion to /zip-tools/zip-file.html and /guides/zip-compressor.html). Complete single-cycle ship per cycle 20260514-5 contract.
  '/guides/en/zip-compressor-online.html': 'guide/en/zip-compressor-online.jsp',
  // Cycle 20260518-23 create_new_guide_page - "Folder to zip" Lane-D guide. Companion to /zip-tools/zip-file.html. Sourced from tool-ziptools/SKILL.md M1 + tool-guidescompresszip/SKILL.md C1-C5.
  '/guides/en/folder-to-zip.html': 'guide/en/folder-to-zip.jsp',
  // Cycle 20260605-3 create_new_guide_page - "File to zip" Lane-D guide. Companion to /zip-file.html. Sourced from tool-zipfile/SKILL.md M1+M2+M3.
  '/guides/en/file-to-zip.html': 'guide/en/file-to-zip.jsp',
  // Cycle 20260605-4 create_new_guide_page - "Online diff tool" Lane-D guide. Companion to /developer-tools/text-diff.html. Sourced from tool-developertools/SKILL.md M1+M3+M5.
  '/guides/en/online-diff-tool.html': 'guide/en/online-diff-tool.jsp',
  // Cycle 20260605-8 create_new_guide_page - "Common::Md5::Gethash64string" Lane-D. Companion to /md5-converter.html. Sourced from tool-md5converter/SKILL.md M1+M2.
  '/guides/en/common-md5-gethash64string.html': 'guide/en/common-md5-gethash64string.jsp',
  '/guides/pt/common-md5-gethash64string.html': 'guide/pt/common-md5-gethash64string.jsp',
  '/guides/es/common-md5-gethash64string.html': 'guide/es/common-md5-gethash64string.jsp',
  '/guides/vi/common-md5-gethash64string.html': 'guide/vi/common-md5-gethash64string.jsp',
  '/guides/id/common-md5-gethash64string.html': 'guide/id/common-md5-gethash64string.jsp',
  '/guides/de/common-md5-gethash64string.html': 'guide/de/common-md5-gethash64string.jsp',
  // Cycle 20260518-33 create_new_guide_page - "Tes LCD" Lane-D guide (device-test
  // cluster, companion to /lcd-test.html). Indonesian-language guide for the
  // "tes lcd" search intent. Paraphrases tool-lcdtest/SKILL.md F1-F5.
  '/guides/en/tes-lcd.html': 'guide/en/tes-lcd.jsp',
  // Cycle 20260520-16 create_new_guide_page - "Kompres File Zip" Lane-D guide
  // (zip cluster, Indonesian-language sibling to /guides/comprimir-zip-online.html).
  // Companion to /zip-file.html. GSC 28d "kompres file zip" 338 imp / 13 clicks /
  // pos 6.36 / CTR 3.85% / opportunity_score 51.12. Paraphrases tool-zipfile
  // implemented features (server-side bundling, optional AES password, S3-backed
  // download with short retention) into Indonesian reader-task prose.
  '/guides/en/kompres-file-zip.html': 'guide/en/kompres-file-zip.jsp',
  // Cycle 20260523-5 P52.I create_new_guide_page - "Kompres Zip" Lane-D guide
  // (zip cluster, Indonesian-language SIZE-QUESTION companion to /guides/kompres-file-zip.html).
  // Companion to /zip-file.html. GSC 28d "kompres zip" 248 imp / 18 clicks / pos 7.42
  // / CTR 7.26% / opportunity_score 30.98. CMS slug `guideskompreszip` (no hyphen per
  // CLAUDE.md slug normalization). Distinguishing role vs /guides/kompres-file-zip.html:
  // this guide focuses on the SIZE question (kapan ZIP mengecilkan ukuran), the sibling
  // covers the broader BUNDLE/PRIVACY workflow - the two pages mirror /guides/compress-zip.html
  // (size) vs the bigger English compress-zip guide family.
  '/guides/en/kompres-zip.html': 'guide/en/kompres-zip.jsp',
  // Cycle 20260518-25 create_new_guide_page - "Online Zip File" Lane-D guide. Companion to /zip-tools/zip-file.html. Sourced from tool-zipfile/SKILL.md M1-M7 + tool-ziptools/SKILL.md M1.
  '/guides/en/online-zip-file.html': 'guide/en/online-zip-file.jsp',
  // Cycle 20260518-31 create_new_guide_page - "Create Zip File Online" Lane-D guide. Companion to /zip-tools/zip-file.html. Sourced from tool-zipfile/SKILL.md implemented features + BODYHTMLzipfile reader-task copy.
  '/guides/en/create-zip-file-online.html': 'guide/en/create-zip-file-online.jsp',
  // Cycle 20260518-32 create_new_guide_page - "compactar pasta" Lane-D guide (zip cluster, Portuguese folder compression intent). Companion to /zip-tools/zip-file.html. Sourced from tool-zipfile BODYHTML/BODYDESC + cluster-sibling Portuguese guide /guides/comprimir-zip-online.html.
  // Cycle 20260521-20 P37.H create_new_guide_page - "comprimir pasta zipada"
  // Lane-D guide (zip cluster, Portuguese). Implementing tool /zip-file.html.
  // Cycle 20260521-22 P39.H create_new_guide_page - "zipar pasta" Lane-D guide
  // (ZIP cluster, Portuguese - "zipar" = to ZIP, "pasta" = folder). GSC 367 imp
  // / 15 clicks / pos 8.84 / CTR 4.09% / opportunity_score 39.8. Implementing
  // tool /zip-file.html. Sister to /guides/comprimir-pasta-zipada.html (same
  // implementing tool, different intent: "zipar" = create new zip from folder,
  // "comprimir pasta zipada" = re-compress existing zip). Net-additive (new URL);
  // Tier-A protocol: ZIP cluster but this is a new GUIDE route (not modifying an
  // indexed tool URL), so the staged-rollout one-URL-per-deploy constraint does
  // not apply to net-new guide additions in the cluster.
  // Cycle 20260522-10 P10.E create_new_guide_page - "comprimir arquivo zip"
  // Lane-D guide (zip cluster, Portuguese - "comprimir arquivo zip" = compress
  // zip file/archive). GSC 28d 361 imp / 14 clicks / pos 9.99 / CTR 3.88% /
  // opportunity_score 34.72. Implementing tool /zip-file.html. Disambiguation
  // guide between two reader tasks: (a) create a new .zip from a file/folder
  // and (b) reduce the size of an existing .zip (deflate already removes
  // redundancy on the first pass; <1% gain on a second pass). Sister to
  // /guides/compactar-pasta.html (Portuguese, folder-first intent) and
  // /guides/comprimir-pasta-zipada.html (Portuguese, re-compress an existing
  // zipped folder). Kebab slug passes regex; smashed form "comprimirarquivozip"
  // does not shadow any existing primary route. Tier-A protocol N/A — net-new
  // guide route, not a modification of an indexed tool URL.
  // Cycle 20260520-11 new_guide_page_proposal (developer cluster):
  // companion to /js-unminifier.html.
  '/guides/en/unminify-js.html': 'guide/en/unminify-js.jsp',
  // Cycle 20260520-13 new_guide_page_proposal (device-test cluster, companion
  // to /lcd-test.html). "lcd screen test" query - GSC 382 imp / 6 clicks /
  // pos 7.11 / CTR 1.57% / opportunity_score 52.9. Paraphrases
  // tool-lcdtest/SKILL.md F1-F5 (six-color full-viewport fill + reset hook +
  // viewport metrics + no-upload disclosure). Kebab slug
  // /guides/lcd-screen-test.html does not shadow any existing primary tool
  // route (urlToSlug() smashes to "lcdscreentest" which is not in JSP_BY_ROUTE).
  '/guides/en/lcd-screen-test.html': 'guide/en/lcd-screen-test.jsp',
  // Cycle 20260520-15 new_guide_page_proposal (zip cluster). "unlock zip file
  // online" query - GSC 421 imp / 40 clicks / pos 7.4 / CTR 9.5% /
  // opportunity_score 51.51. Disambiguation guide routing between
  // /remove-zip-password.html (password-protected ZIPs) and /unzip-file.html
  // (plain ZIPs). Kebab slug /guides/unlock-zip-file-online.html does not
  // shadow any existing primary route (smashed form "unlockzipfileonline" is
  // unique against JSP_BY_ROUTE). Hand-verified at authoring time —
  // tool-guidesunlockzipfileonline/SKILL.md cites BODYHTML claims back to
  // /unzip-file.html and /remove-zip-password.html behaviour visible on
  // those pages at cycle authoring SHA.
  '/guides/en/unlock-zip-file-online.html': 'guide/en/unlock-zip-file-online.jsp',
  // Cycle 20260520-10 create_new_guide_page - "GIF into frames" Lane-D guide (image-editing cluster, companion to /extract-gif-to-image-frames.html). Sourced from tool-extractgiftoimageframes BODYTITLE/BODYDESC + Implemented features. Single-cycle ship per cycle 20260514-5 contract. Cannibalization chain from -6 expired (4-cycle window closed).
  '/guides/en/gif-into-frames.html': 'guide/en/gif-into-frames.jsp',
  // Cycle 84 P84.A - "How to compress a JPG for email attachment size limits" Lane-D guide (image-conversion / compression sub-cluster, companion to /compress-image.html).
  '/guides/en/how-to-compress-a-jpg-for-email-attachment-limits.html': 'guide/en/how-to-compress-a-jpg-for-email-attachment-limits.jsp',
  // Cycle 85 P85.A - "Microphone test levels: what quiet, normal, and peak mean" Lane-D guide (device-test / microphone-test sub-cluster, companion to /microphone-test.html).
  '/guides/en/microphone-test-online-quiet-normal-peak-meter.html': 'guide/en/microphone-test-online-quiet-normal-peak-meter.jsp',
  // Cycle 86 P86.A - "Camera test permission blocked: how to allow camera access in your browser" Lane-D guide (device-test / camera-test sub-cluster, companion to /camera-test.html).
  '/guides/en/camera-test-permission-blocked-how-to-allow-it.html': 'guide/en/camera-test-permission-blocked-how-to-allow-it.jsp',
  // Cycle 87 P87.A - "Microphone test permission blocked: how to allow mic access in your browser" Lane-D guide (device-test / microphone-test sub-cluster, companion to /microphone-test.html, symmetric peer to cycle-86 P86.A).
  '/guides/en/microphone-test-permission-blocked-how-to-allow-it.html': 'guide/en/microphone-test-permission-blocked-how-to-allow-it.jsp',
  // Cycle 88 P88.A - "QR Code Content Types: URL vs vCard vs Wi-Fi vs Text - Which to Pick" Lane-D guide (utility / qr-code-generator sub-cluster, companion to /qr-code-generator.html).
  '/guides/en/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html': 'guide/en/qr-code-content-types-url-vcard-wifi-text-which-to-pick.jsp',
  // Cycle 90 P90.A - "EXIF Metadata and Image Compression: What Gets Stripped" Lane-D guide (image-conversion / compress-image sub-cluster, companion to /compress-image.html).
  '/guides/en/image-compression-and-exif-metadata-what-gets-stripped.html': 'guide/en/image-compression-and-exif-metadata-what-gets-stripped.jsp',
  // Phase 8 Cycle 3 §3.4 greenfield guides.
  '/guides/en/mp4-vs-webm-for-web.html': 'guide/en/mp4-vs-webm-for-web.jsp',
  '/guides/en/jpg-vs-png-for-web.html': 'guide/en/jpg-vs-png-for-web.jsp',
  '/guides/en/md5-vs-sha256-when-to-hash.html': 'guide/en/md5-vs-sha256-when-to-hash.jsp',
  '/guides/en/csv-vs-json-data-formats.html': 'guide/en/csv-vs-json-data-formats.jsp',
  '/guides/en/pdf-vs-heic-for-document-archival.html': 'guide/en/pdf-vs-heic-for-document-archival.jsp',
  '/guides/en/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html': 'guide/en/ffmpeg-online-vs-local-ffmpeg-when-each-wins.jsp',
  '/guides/en/how-to-convert-100-heic-photos-to-jpg.html': 'guide/en/how-to-convert-100-heic-photos-to-jpg.jsp',
  '/guides/en/how-to-test-for-dead-pixels-before-returning-a-monitor.html': 'guide/en/how-to-test-for-dead-pixels-before-returning-a-monitor.jsp',
  '/guides/en/how-to-sign-pdf-after-removing-a-password.html': 'guide/en/how-to-sign-pdf-after-removing-a-password.jsp',
  '/guides/en/how-to-extract-frames-from-a-gif-for-a-social-post.html': 'guide/en/how-to-extract-frames-from-a-gif-for-a-social-post.jsp',
  '/guides/en/how-to-check-webcam-and-microphone-before-an-interview.html': 'guide/en/how-to-check-webcam-and-microphone-before-an-interview.jsp',
  '/guides/en/how-to-minify-css-js-for-cloud-run-cold-start.html': 'guide/en/how-to-minify-css-js-for-cloud-run-cold-start.jsp',
  '/guides/en/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html': 'guide/en/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.jsp',
  // Phase 10 Cycle 4 P10.3.4.
  '/guides/en/when-to-compress-vs-convert-an-image.html': 'guide/en/when-to-compress-vs-convert-an-image.jsp',
  // Phase 11 Cycle 4 P11.3.3.
  '/guides/en/how-to-compress-a-folder-for-email.html': 'guide/en/how-to-compress-a-folder-for-email.jsp',
  // Phase 11 Cycle 5 P11.2.1 + P11.3.5.
  '/guides/en/device-test-checklist-for-remote-work.html': 'guide/en/device-test-checklist-for-remote-work.jsp',
  '/guides/en/pdf-editing-ladder.html': 'guide/en/pdf-editing-ladder.jsp',
  '/guides/en/file-compressor-vs-zip-what-to-pick.html': 'guide/en/file-compressor-vs-zip-what-to-pick.jsp',
  '/guides/en/heic-vs-jpg-converter-when-each-wins.html': 'guide/en/heic-vs-jpg-converter-when-each-wins.jsp',
  // Phase 16 Cycle A P16.N1 / P16.N2 / P16.N4.
  '/guides/en/what-is-a-file-compressor-and-which-to-use.html': 'guide/en/what-is-a-file-compressor-and-which-to-use.jsp',
  // Cycle 121 P121.G - "file compressor" HEAD-query aggregator landing.
  '/guides/en/file-compressor.html': 'guide/en/file-compressor.jsp',
  // Cycle 122 P122.A - HEAD-query disambiguation aggregator for "test lcd" / "lcd tester" / "lcd test online".
  '/guides/en/test-lcd.html': 'guide/en/test-lcd.jsp',
  // Cycle 20260518-30 P30.E - "lcd checker" / "lcd check" / "monitor checker" verification-framing sibling guide.
  '/guides/en/lcd-checker.html': 'guide/en/lcd-checker.jsp',
  '/guides/en/how-to-compress-a-file-online.html': 'guide/en/how-to-compress-a-file-online.jsp',
  '/guides/en/how-to-reduce-zip-file-size-online.html': 'guide/en/how-to-reduce-zip-file-size-online.jsp',
  '/guides/en/how-to-reduce-zip-file-size.html': 'guide/en/how-to-reduce-zip-file-size.jsp',
  // Cycle 20260520-9 create_new_guide_page - bare-noun landing for "reduce zip file size online" (implementing tool /zip-file.html).
  '/guides/en/reduce-zip-file-size-online.html': 'guide/en/reduce-zip-file-size-online.jsp',
  // Cycle 20260515-15 — "Zip File Compressor Online" Lane-D guide.
  '/guides/en/zip-file-compressor-online.html': 'guide/en/zip-file-compressor-online.jsp',
  // Phase 16 Cycle B P16.G1 hub + P16.N11 + P16.N16.
  '/guides.html': 'utility/guides.jsp',
  '/guides/en/how-to-convert-heic-to-jpg-step-by-step.html': 'guide/en/how-to-convert-heic-to-jpg-step-by-step.jsp',
  '/guides/en/what-an-lcd-test-does-and-when-to-run-one.html': 'guide/en/what-an-lcd-test-does-and-when-to-run-one.jsp',
  // Cycle 20260517-6 create_new_guide_page - "ms to date" synonym-coverage guide.
  '/guides/en/ms-to-date.html': 'guide/en/ms-to-date.jsp',
  // Cycle 20260517-21 create_new_guide_page - "convert milliseconds to date" exact-match landing.
  '/guides/en/convert-milliseconds-to-date.html': 'guide/en/convert-milliseconds-to-date.jsp',
  // Cycle 20260520-12 create_new_guide_page - "millisecond to date" singular-noun landing. Implementing tool /convert-time-in-millisecond-to-date.html.
  '/guides/en/millisecond-to-date.html': 'guide/en/millisecond-to-date.jsp',
  // Phase 16 cycle 8 N-series guides (25 new).

  // Phase 16 cycle 8 N-series guides (25 new).
  '/guides/en/how-to-make-a-zip-file-smaller.html': 'guide/en/how-to-make-a-zip-file-smaller.jsp',
  '/guides/en/how-to-compress-zip-file-to-smaller-size.html': 'guide/en/how-to-compress-zip-file-to-smaller-size.jsp',
  // Cycle 20260517-9 create_new_guide_page - exact-match "compress zip file to smaller size" landing.
  '/guides/en/compress-zip-file-to-smaller-size.html': 'guide/en/compress-zip-file-to-smaller-size.jsp',
  '/guides/en/compress-zip-file-to-100kb.html': 'guide/en/compress-zip-file-to-100kb.jsp',
  // Cycle 20260521-12 P29.A create_new_guide_page - operator-approved "compress zip file to 2mb" enterprise-SMTP-cap-specific landing.
  '/guides/en/compress-zip-file-to-2mb.html': 'guide/en/compress-zip-file-to-2mb.jsp',
  // Cycle 20260517-10 create_new_guide_page - exact-match "zip size reducer" landing.
  '/guides/en/zip-size-reducer.html': 'guide/en/zip-size-reducer.jsp',
  // Cycle 20260519-12 create_new_guide_page — /guides/zip-file-size-compressor.html (implementing tool /zip-file.html).
  '/guides/en/zip-file-size-compressor.html': 'guide/en/zip-file-size-compressor.jsp',
  '/guides/en/online-zip-vs-7z-vs-rar-which-to-pick.html': 'guide/en/online-zip-vs-7z-vs-rar-which-to-pick.jsp',
  '/guides/en/how-to-zip-multiple-files-into-one.html': 'guide/en/how-to-zip-multiple-files-into-one.jsp',
  '/guides/en/how-to-zip-folder-online-step-by-step.html': 'guide/en/how-to-zip-folder-online-step-by-step.jsp',
  '/guides/en/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html': 'guide/en/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.jsp',
  '/guides/en/recover-corrupt-zip-file-options.html': 'guide/en/recover-corrupt-zip-file-options.jsp',
  '/guides/en/iphone-photo-format-explained-heic-jpg-png-raw.html': 'guide/en/iphone-photo-format-explained-heic-jpg-png-raw.jsp',
  '/guides/en/how-to-convert-iphone-photo-to-jpg.html': 'guide/en/how-to-convert-iphone-photo-to-jpg.jsp',
  '/guides/en/jpg-vs-jpeg-are-they-the-same.html': 'guide/en/jpg-vs-jpeg-are-they-the-same.jsp',
  '/guides/en/svg-to-png-when-to-rasterize-an-svg.html': 'guide/en/svg-to-png-when-to-rasterize-an-svg.jsp',
  '/guides/en/how-to-check-camera-quality-on-your-phone.html': 'guide/en/how-to-check-camera-quality-on-your-phone.jsp',
  '/guides/en/microphone-test-online-what-it-actually-checks.html': 'guide/en/microphone-test-online-what-it-actually-checks.jsp',
  '/guides/en/keyboard-tester-online-rollover-vs-anti-ghosting.html': 'guide/en/keyboard-tester-online-rollover-vs-anti-ghosting.jsp',
  '/guides/en/how-to-test-a-keyboard-online-step-by-step.html': 'guide/en/how-to-test-a-keyboard-online-step-by-step.jsp',
  '/guides/en/extract-gif-frames-png-vs-jpg-which-format.html': 'guide/en/extract-gif-frames-png-vs-jpg-which-format.jsp',
  '/guides/en/gif-frames-extract-vs-frame-rate-fps-explained.html': 'guide/en/gif-frames-extract-vs-frame-rate-fps-explained.jsp',
  '/guides/en/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html': 'guide/en/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.jsp',
  '/guides/en/camera-test-shows-black-screen-four-fixes.html': 'guide/en/camera-test-shows-black-screen-four-fixes.jsp',
  '/guides/en/microphone-test-no-sound-four-fixes.html': 'guide/en/microphone-test-no-sound-four-fixes.jsp',
  '/guides/en/keyboard-test-keys-not-detected-four-fixes.html': 'guide/en/keyboard-test-keys-not-detected-four-fixes.jsp',
  '/guides/en/compress-jpeg-without-losing-quality-quality-vs-size.html': 'guide/en/compress-jpeg-without-losing-quality-quality-vs-size.jsp',
  '/guides/en/long-number-millisecond-or-second.html': 'guide/en/long-number-millisecond-or-second.jsp',
  '/guides/en/compressed-jpg-looks-blurry-three-causes.html': 'guide/en/compressed-jpg-looks-blurry-three-causes.jsp',
  '/guides/en/ffmpeg-online-conversion-stalled-three-fixes.html': 'guide/en/ffmpeg-online-conversion-stalled-three-fixes.jsp',
  '/guides/en/gif-frame-extractor-output-looks-wrong-three-causes.html': 'guide/en/gif-frame-extractor-output-looks-wrong-three-causes.jsp',
  '/guides/en/gif-frame-extractor.html': 'guide/en/gif-frame-extractor.jsp',
  '/guides/en/gif-to-frames-converter.html': 'guide/en/gif-to-frames-converter.jsp',
  // Cycle 20260610-14 - gif-to-frame (image-conversion cluster)
  '/guides/en/gif-to-frame.html': 'guide/en/gif-to-frame.jsp',
  '/guides/en/lcd-test-vs-display-test-which-do-you-need.html': 'guide/en/lcd-test-vs-display-test-which-do-you-need.jsp',
  '/guides/en/camera-test-vs-webcam-test-which-do-you-need.html': 'guide/en/camera-test-vs-webcam-test-which-do-you-need.jsp',
  // Cycle 20260610-13 - LCD test for laptop screens (device-test)
  '/guides/en/lcd-test-laptop.html': 'guide/en/lcd-test-laptop.jsp',
  '/guides/en/screen-test-vs-camera-test-pick-the-right-tool.html': 'guide/en/screen-test-vs-camera-test-pick-the-right-tool.jsp',
  '/guides/en/md5-to-text-why-you-cannot-convert-back.html': 'guide/en/md5-to-text-why-you-cannot-convert-back.jsp',
  '/guides/en/before-a-video-call-which-tools-to-run.html': 'guide/en/before-a-video-call-which-tools-to-run.jsp',
  // Cycle 46 (20260522-7) P46.H — camera-check synonym-disambiguation guide.
  '/guides/en/camera-check.html': 'guide/en/camera-check.jsp',
  '/guides/en/screen-test-for-laptop-5-minute-checklist.html': 'guide/en/screen-test-for-laptop-5-minute-checklist.jsp',
  '/guides/en/ffmpeg-online-vs-video-converter-which-to-pick.html': 'guide/en/ffmpeg-online-vs-video-converter-which-to-pick.jsp',
  '/guides/en/imagemagick-online-vs-task-specific-tools-which-to-pick.html': 'guide/en/imagemagick-online-vs-task-specific-tools-which-to-pick.jsp',
  '/guides/en/file-compressor-online-when-to-zip-vs-when-to-compress-image.html': 'guide/en/file-compressor-online-when-to-zip-vs-when-to-compress-image.jsp',
  '/guides/en/how-to-extract-a-file-online-zip-rar-7z.html': 'guide/en/how-to-extract-a-file-online-zip-rar-7z.jsp',
  '/guides/en/how-to-choose-a-compression-level.html': 'guide/en/how-to-choose-a-compression-level.jsp',
  '/guides/en/zip-password-types-strong-vs-weak-explained.html': 'guide/en/zip-password-types-strong-vs-weak-explained.jsp',
  '/guides/en/pdf-preflight-online-what-it-actually-checks.html': 'guide/en/pdf-preflight-online-what-it-actually-checks.jsp',
  '/guides/en/read-and-compare-md5-hashes-correctly.html': 'guide/en/read-and-compare-md5-hashes-correctly.jsp',
  '/guides/en/how-to-tell-if-a-jpg-was-compressed-too-much.html': 'guide/en/how-to-tell-if-a-jpg-was-compressed-too-much.jsp',
  '/guides/en/how-to-flatten-a-pdf-and-when-to-do-it.html': 'guide/en/how-to-flatten-a-pdf-and-when-to-do-it.jsp',
  '/guides/en/png-to-svg-when-to-vectorize-a-raster-image.html': 'guide/en/png-to-svg-when-to-vectorize-a-raster-image.jsp',
  '/guides/en/download-link-not-appearing-after-conversion-five-fixes.html': 'guide/en/download-link-not-appearing-after-conversion-five-fixes.jsp',
  '/guides/en/why-heic-wont-open-on-windows-three-fixes.html': 'guide/en/why-heic-wont-open-on-windows-three-fixes.jsp',
  '/guides/en/why-md5-cannot-be-decrypted.html': 'guide/en/why-md5-cannot-be-decrypted.jsp',
  '/guides/en/md5-decode.html': 'guide/en/md5-decode.jsp',
  '/guides/en/md5-decrypt-online.html': 'guide/en/md5-decrypt-online.jsp',
  // Cycle 20260520-17 create_new_guide_page — "md5 hash decrypt" narrow-frame guide on dictionary-attack vs rainbow-table feasibility. Distinct angle from the existing 7 MD5 guides (md5-decrypt-online = wording routing, why-md5-cannot-be-decrypted = cryptographic math, md5-decode = vocabulary distinguish, md5-alternatives = recommendation, md5-to-text = why-cannot-convert-back, md5-vs-sha256 = algorithm comparison, read-and-compare = verification). New angle: the practical feasibility question - "for the hash I have right now, will a dictionary attack actually find the input?" Append-only on every existing surface.
  '/guides/en/md5-hash-decrypt.html': 'guide/en/md5-hash-decrypt.jsp',
  // Cycle 20260523 P50.H create_new_guide_page — "md5 password" reader-intent guide.
  // Distinct angle from the 8 existing MD5 guides: this one frames the hashing intent
  // (one-way MD5 of a password string for checksum / fingerprint use) and explicitly
  // routes the password-storage cohort to /guides/md5-alternatives-bcrypt-argon2id-...
  // Honors cycle 30/35/40/43/44 decrypt-md5 cannibalisation guard: NOT titled or
  // framed as "decrypt md5 password". Implementing tool: /md5-converter.html.
  '/guides/en/md5-password.html': 'guide/en/md5-password.jsp',
  '/guides/en/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html': 'guide/en/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.jsp',
  '/guides/en/json-vs-yaml-vs-toml-config-formats-explained.html': 'guide/en/json-vs-yaml-vs-toml-config-formats-explained.jsp',
  '/guides/en/css-minifier-vs-uglifier-vs-tree-shaking.html': 'guide/en/css-minifier-vs-uglifier-vs-tree-shaking.jsp',
  '/guides/en/base64-when-to-use-and-when-not-to.html': 'guide/en/base64-when-to-use-and-when-not-to.jsp',
  '/guides/en/how-to-split-a-gif-into-frames-for-editing.html': 'guide/en/how-to-split-a-gif-into-frames-for-editing.jsp',
  '/guides/en/how-to-crop-and-rotate-an-image.html': 'guide/en/how-to-crop-and-rotate-an-image.jsp',
  '/guides/en/photo-editor-vs-graphics-app-vs-batch-processor.html': 'guide/en/photo-editor-vs-graphics-app-vs-batch-processor.jsp',
  '/guides/en/mp4-vs-mov-vs-mkv-which-container-when.html': 'guide/en/mp4-vs-mov-vs-mkv-which-container-when.jsp',
  '/guides/en/free-online-tools-that-work-without-uploading-files.html': 'guide/en/free-online-tools-that-work-without-uploading-files.jsp',
  '/guides/en/qr-code-generator-best-practices.html': 'guide/en/qr-code-generator-best-practices.jsp',
  // Workstream B sample batch - 2026-04-30
  '/guides/en/how-to-compress-a-folder.html': 'guide/en/how-to-compress-a-folder.jsp',
  '/guides/en/lcd-test-what-it-checks.html': 'guide/en/lcd-test-what-it-checks.jsp',
  // Cycle 20260513-19+ multi-cycle - "lcd test" long-tail guide.
  // Cycle 20260514-2 cycle 1 - Phase A scaffold for "folder to zip converter".
  // Cycle 19 P19.4 - screen/display/monitor synonym disambiguation guide.
  '/guides/en/screen-display-test-synonyms.html': 'guide/en/screen-display-test-synonyms.jsp',
  // Cycle 70 P70.A - "Zip file converter - what it actually does" disambiguation guide.
  '/guides/en/zip-file-converter-what-it-actually-does.html': 'guide/en/zip-file-converter-what-it-actually-does.jsp',
  // Cycle 20260519-1 - bare-query "zip file converter" how-to guide.
  '/guides/en/zip-file-converter.html': 'guide/en/zip-file-converter.jsp',
  // Cycle 71 P71.F - "HEIC to JPG: what the converter actually does (and what it does not)" trust-anchor guide.
  '/guides/en/heic-to-jpg-claims-what-actually-works.html': 'guide/en/heic-to-jpg-claims-what-actually-works.jsp',
  // Cycle1 of 20260513-5 P5.A - "Zip compressor" Lane-D guide. Phase A
  // skeleton (route + JSP wrapper) only. Kebab URL + guide/ singular
  // subdir per granted-card convention.
  '/guides/en/zip-compressor.html': 'guide/en/zip-compressor.jsp',
  // Cycle6 of 20260513-6 — "Compress ZIP" Lane-D guide. Phase A skeleton.
  // Kebab URL + guide/ singular subdir per granted-card convention.
  '/guides/en/compress-zip.html': 'guide/en/compress-zip.jsp',
  // Cycle 20260515-16 — "Compress ZIP Size" Lane-D guide.
  '/guides/en/compress-zip-size.html': 'guide/en/compress-zip-size.jsp',
  // Cycle 20260519-15 create_new_guide_page — "resize zip file" wording-disambiguation Lane-D guide (GSC 406 imp / 19 clicks / pos 6.83 / CTR 4.68%; opportunity_score 56.6). Implementing tool /zip-tools/zip-file.html. Append-only routing/disambiguation guide (NOT a 10th compress-zip duplicate); distinguishes from /guides/how-to-make-a-zip-file-smaller.html, /guides/zip-size-reducer.html, /guides/compress-zip-size.html (which all assume "shrink"), by addressing the three-way reader intent ambiguity (shrink vs split vs shrink-inputs-first).
  '/guides/en/resize-zip-file.html': 'guide/en/resize-zip-file.jsp',

  '/pdf-tools/compose-pdf.html': 'pdf/compose-pdf.jsp',
  '/pdf-tools/split-pdf-by-range.html': 'pdf/split-by-range.jsp',
  '/pdf-tools/split-pdf-to-each-pages.html': 'pdf/split-to-single-pages.jsp',
  '/pdf-tools/join-pdf-from-multiple-files.html': 'pdf/merge-from-multiple-files.jsp',
  '/pdf-tools/protect-pdf-by-password.html': 'pdf/encrypt-by-password.jsp',
  '/pdf-tools/remove-pdf-password.html': 'pdf/remove-password.jsp',
  '/pdf-tools/preflight-pdf.html': 'pdf/preflight.jsp',
  '/pdf-tools/flatten-pdf.html': 'pdf/flatten-pdf.jsp',
  '/utility-tools/get-time-in-millisecond.html': 'datetime/get-current-time-in-millisecond.jsp',
  '/utility-tools/convert-time-in-millisecond-to-date.html': 'convert/convert-time-in-millisecond-to-date.jsp',
  '/zip-tools/zip-file.html': 'file/zip-file.jsp',
  '/zip-tools/unzip-file.html': 'file/unzip-file.jsp',
  '/zip-tools/remove-zip-password.html': 'file/remove-zip-password.jsp',
  '/zip-tools.html': 'utility/zip-tools.jsp',
  // Cycle 134 P134.A — top-level "file compressor" tool-hub page (head query
  // 203,069 imp/28d at pos 10.0, CTR 0.05% — operator-authorized via cycle 133
  // P133.C grant accepting cannibalization risk vs the long-form
  // /guides/file-compressor.html decision-tree guide; this bare-URL page is a
  // concise tool-finder layout). new_guide_page real-work-floor satisfier.
  '/utility-tools/file-compressor.html': 'utility/file-compressor.jsp',
  '/image-converter-tools.html': 'utility/image-converter-tools.jsp',
  '/image-tools.html': 'utility/image-tools.jsp',
  '/pdf-tools.html': 'utility/pdf-tools.jsp',
  '/developer-tools.html': 'utility/developer-tools.jsp',
  '/video-tools.html': 'utility/video-tools.jsp',
  '/device-test-tools.html': 'utility/device-test-tools.jsp',
  '/utility-tools.html': 'utility/utility-tools.jsp',
  '/image-tools/resize-image.html': 'image/resize-image.jsp',
  '/image-tools/crop-image.html': 'image/crop-image.jsp',
  '/image-tools/compress-image.html': 'image/compress-image.jsp',
  '/image-tools/insights-image-optimizer.html': 'image/insights-image-optimizer.jsp',
  '/image-tools/gif-maker.html': 'image/gif-maker.jsp',
  '/video-tools/ffmpeg-online.html': 'image/ffmpeg-online.jsp',
  '/image-tools/imagemagick-online.html': 'image/imagemagick-online.jsp',
  '/image-tools/photo-editor.html': 'image/photo-editor.jsp',
  '/image-tools/get-jpeg-compression-level.html': 'image/get-jpeg-compression-level.jsp',
  '/developer-tools/json-parser.html': 'utility/json-parser.jsp',
  '/developer-tools/text-diff.html': 'utility/text-diff.jsp',
  '/developer-tools/css-minifier.html': 'utility/css-minifier.jsp',
  '/developer-tools/css-unminifier.html': 'utility/css-unminifier.jsp',
  '/developer-tools/js-minifier.html': 'utility/js-minifier.jsp',
  '/developer-tools/js-unminifier.html': 'utility/js-unminifier.jsp',
  '/video-tools/video-maker.html': 'utility/video-maker.jsp',
  '/device-test-tools/microphone-test.html': 'utility/microphone-test.jsp',
  '/device-test-tools/camera-test.html': 'utility/camera-test.jsp',
  '/device-test-tools/lcd-test.html': 'utility/lcd-test.jsp',
  '/device-test-tools/keyboard-test.html': 'utility/keyboard-test.jsp',
  '/developer-tools/css-gradient-generator.html': 'utility/css-gradient-generator.jsp',
  '/utility-tools/do-nong-do-con-truc-tuyen.html': 'utility/do-nong-do-con-truc-tuyen.jsp',
  '/pdf-tools/pdf-to-text.html': 'convert/pdf-to-text.jsp',
  '/pdf-tools/images-to-pdf.html': 'convert/images-to-pdf.jsp',
  '/pdf-tools/pdf-to-images.html': 'convert/pdf-to-images.jsp',
  '/pdf-tools/pdf-to-html.html': 'convert/pdf-to-html.jsp',
  '/developer-tools/md5-converter.html': 'convert/md5-converter.jsp',
  '/developer-tools/text-html-editor.html': 'convert/text-html-editor.jsp',
  '/image-converter-tools/svg-to-png.html': 'convert/svg-to-png.jsp',
  '/image-converter-tools/png-to-svg.html': 'convert/png-to-svg.jsp',
  '/image-converter-tools/heic-to-jpg.html': 'convert/heic-to-jpg.jsp',
  '/image-converter-tools/image-to-base64.html': 'convert/image-to-base64.jsp',
  '/image-converter-tools/base64-to-image.html': 'convert/base64-to-image.jsp',
  '/utility-tools/qr-code-generator.html': 'convert/qr-code-generator.jsp',
  '/video-tools/video-converter.html': 'convert/video-converter.jsp',
  '/image-converter-tools/extract-gif-to-image-frames.html': 'convert/extract-gif-to-image-frames.jsp',
  '/utility-tools/cong-cu-chuyen-doi-chu-quoc-ngu-tieng-viet-thanh-tieq-viet-kieu-moi.html': 'convert/new-vietnamese-converter.jsp',
  // Cycle 20260518-29 create_new_guide_page - zip-password-unlocker Lane-D guide.
  '/guides/en/zip-password-unlocker.html': 'guide/en/zip-password-unlocker.jsp',
  // Cycle 20260520-followup: canonical moved from /hd-video-converter.html (root)
  // to /video-tools/hd-video-converter.html per the site cluster-URL convention.
  // Existing canonical pattern: /<cluster>-tools/<slug>.html (canonical) +
  // /<slug>.html (alias). Root URL now lives in ALIAS_ROUTES (see top of file).
  // Pre-cycle-20260520 builder bug: ctx.url hardcoded as /{slug}.html ignoring
  // cluster; fixed in build-tool-page.mjs::deriveUrlsForCluster().
  '/video-tools/hd-video-converter.html': 'convert/hd-video-converter.jsp',
  '/guides/en/hd-video-converter-when.html': 'guide/en/hd-video-converter-when.jsp',
  '/guides/en/hd-video-converter-step-by-step.html': 'guide/en/hd-video-converter-step-by-step.jsp',
  '/guides/en/hd-video-converter-vs-alternatives.html': 'guide/en/hd-video-converter-vs-alternatives.jsp',
  // Cycle 20260520 SEO-synonym-mill cleanup. The 5 dupe variants of
  // /json-formatter.html (-extension, -editor, -viewer, -compare, -validator)
  // shipped as broken stubs that threw "Error: convertForSlug() not implemented"
  // on every user click. /json-formatter.html now ships a working
  // JSON.parse + pretty-print impl (cycle 20260520 working converter-text
  // skeleton); the 5 dupes are 301-aliased to /json-formatter.html via
  // ALIAS_ROUTES (~line 1216). The 3 KEPT guides under /guides/json-formatter-
  // {when,step-by-step,vs-alternatives}.html support the canonical tool and
  // stay in place. See dedupe-against-existing.mjs (cycle 20260520) — that
  // dedupe escalation prevents future variants from re-emerging.
  // Cycle 20260521-12 semantic-dedup cleanup: /developer-tools/json-formatter.html
  // route + CMS fragments + manifest entry + tool-skill deleted. The reader
  // intent (pretty-print + validate JSON) is fully covered by the existing
  // /developer-tools/json-parser.html ("JSON Parser & Formatter (Tree View)").
  // 8 aliases retargeted to json-parser. The 3 companion guides remain but
  // their implementing-tool reference is retargeted to json-parser.
  '/guides/en/json-formatter-when.html': 'guide/en/json-formatter-when.jsp',
  '/guides/en/json-formatter-step-by-step.html': 'guide/en/json-formatter-step-by-step.jsp',
  '/guides/en/json-formatter-vs-alternatives.html': 'guide/en/json-formatter-vs-alternatives.jsp',
  // Cycle 20260521-12 cleanup: deleted /image-converter-tools/image-format-converter.html
  // tool + 3 companion guides. Reasons: (1) BODYJS stub was a silent no-op IIFE that ships
  // a non-functional tool, (2) cluster /image-converter-tools/ already provides 6 working
  // converters covering the same reader intent, (3) avoiding the SEO-synonym mill pattern
  // (alias-to-broken-tool dilutes link equity AND offers a worse user experience than a
  // 301 to a working hub). See cycle 20260520-5 commit d0eb7c0 for the original (broken) ship.
  // Cycle 20260520 cleanup: /chatgpt-json-tree-viewer.html also shipped as
  // a broken "Error: convertForSlug() not implemented" stub. Aliased to
  // /json-formatter.html (which now has a real JSON parser/tree-viewer
  // impl), guides removed. See dedupe-against-existing.mjs SEO-synonym-mill
  // fix that prevents this pattern recurring.
  // Cycle 20260522-8 (cycle 47) P47.H new_guide_page_proposal - /guides/current-millis.html
  '/guides/en/current-millis.html': 'guide/en/current-millis.jsp',
  // Cycle 20260522-9 (cycle 48) P48.H new_guide_page_proposal - /guides/zip-unlocker-online.html (companion to /remove-zip-password.html)
  '/guides/en/zip-unlocker-online.html': 'guide/en/zip-unlocker-online.jsp',
  // Cycle 20260523-3 (cycle 50) create_new_guide_page - /guides/crop-and-rotate-image.html (companion to /crop-image.html, image-editing cluster)
  '/guides/en/crop-and-rotate-image.html': 'guide/en/crop-and-rotate-image.jsp',
  // Cycle 20260524-18 create_new_guide_page - /guides/compress-folder-online.html
  // (zip cluster, companion to /zip-file.html). Cluster override from utility
  // to zip: "compress folder online" is operationally folder-zipping, and the
  // truthful implementing tool is /zip-file.html (server-side ZIP creator with
  // optional AES password). Sourced from tool-zipfile/SKILL.md implemented
  // features + BODYWELCOMEzipfile reader-task framing.
  '/guides/en/compress-folder-online.html': 'guide/en/compress-folder-online.jsp',
  // Multilingual guide migration (2026-05-28 plan-warm-pascal-v2 S1).
  // 7 locale-prefixed URLs serving the existing scattered translations
  // (pt + es) under `/guides/<lang>/<canonical-en-slug>.html`. Each JSP
  // is a 1-line wrapper copied from the source-language JSP.
  '/guides/pt/compress-folder.html': 'guide/pt/compress-folder.jsp',
  '/guides/pt/compress-zip-file.html': 'guide/pt/compress-zip-file.jsp',
  '/guides/pt/compress-folder-to-zip.html': 'guide/pt/compress-folder-to-zip.jsp',
  '/guides/pt/compress-zip-online.html': 'guide/pt/compress-zip-online.jsp',
  '/guides/pt/zip-a-folder.html': 'guide/pt/zip-a-folder.jsp',
  '/guides/es/compress-folder-to-zip-online-free.html': 'guide/es/compress-folder-to-zip-online-free.jsp',
  '/guides/es/reduce-zip-size-online.html': 'guide/es/reduce-zip-size-online.jsp',
  // plan-warm-pascal-v3 S2 batch 1 (2026-05-29) — first 5 locale variants
  // of /guides/lcd-test-online.html. 5 new BODY* CMS bundles per locale.
  // Translations: machine-quality, locale_pending_review until human edit.
  '/guides/pt/lcd-test-online.html': 'guide/pt/lcd-test-online.jsp',
  '/guides/es/lcd-test-online.html': 'guide/es/lcd-test-online.jsp',
  '/guides/vi/lcd-test-online.html': 'guide/vi/lcd-test-online.jsp',
  '/guides/id/lcd-test-online.html': 'guide/id/lcd-test-online.jsp',
  '/guides/de/lcd-test-online.html': 'guide/de/lcd-test-online.jsp',
  // plan-warm-pascal-v3 S2 batch 2 (2026-05-29) - 5 locale variants of convert-milliseconds-to-date
  '/guides/pt/convert-milliseconds-to-date.html': 'guide/pt/convert-milliseconds-to-date.jsp',
  '/guides/es/convert-milliseconds-to-date.html': 'guide/es/convert-milliseconds-to-date.jsp',
  '/guides/vi/convert-milliseconds-to-date.html': 'guide/vi/convert-milliseconds-to-date.jsp',
  '/guides/id/convert-milliseconds-to-date.html': 'guide/id/convert-milliseconds-to-date.jsp',
  '/guides/de/convert-milliseconds-to-date.html': 'guide/de/convert-milliseconds-to-date.jsp',
  // plan-warm-pascal-v3 S2 batch 3 (2026-05-29) - 5 locale variants of lcd-screen-test + hd-video-converter-when + json-formatter-when
  '/guides/pt/lcd-screen-test.html': 'guide/pt/lcd-screen-test.jsp',
  '/guides/es/lcd-screen-test.html': 'guide/es/lcd-screen-test.jsp',
  '/guides/vi/lcd-screen-test.html': 'guide/vi/lcd-screen-test.jsp',
  '/guides/id/lcd-screen-test.html': 'guide/id/lcd-screen-test.jsp',
  '/guides/de/lcd-screen-test.html': 'guide/de/lcd-screen-test.jsp',
  '/guides/pt/hd-video-converter-when.html': 'guide/pt/hd-video-converter-when.jsp',
  '/guides/es/hd-video-converter-when.html': 'guide/es/hd-video-converter-when.jsp',
  '/guides/vi/hd-video-converter-when.html': 'guide/vi/hd-video-converter-when.jsp',
  '/guides/id/hd-video-converter-when.html': 'guide/id/hd-video-converter-when.jsp',
  '/guides/de/hd-video-converter-when.html': 'guide/de/hd-video-converter-when.jsp',
  '/guides/pt/json-formatter-when.html': 'guide/pt/json-formatter-when.jsp',
  '/guides/es/json-formatter-when.html': 'guide/es/json-formatter-when.jsp',
  '/guides/vi/json-formatter-when.html': 'guide/vi/json-formatter-when.jsp',
  '/guides/id/json-formatter-when.html': 'guide/id/json-formatter-when.jsp',
  '/guides/de/json-formatter-when.html': 'guide/de/json-formatter-when.jsp',
  // plan-warm-pascal-v3 S2 batch 4 (2026-05-29) - 5 locale variants × 3 guides (zip-file-converter + online-zip-file-compressor + led-test)
  '/guides/pt/zip-file-converter.html': 'guide/pt/zip-file-converter.jsp', '/guides/es/zip-file-converter.html': 'guide/es/zip-file-converter.jsp', '/guides/vi/zip-file-converter.html': 'guide/vi/zip-file-converter.jsp', '/guides/id/zip-file-converter.html': 'guide/id/zip-file-converter.jsp', '/guides/de/zip-file-converter.html': 'guide/de/zip-file-converter.jsp',
  '/guides/pt/online-zip-file-compressor.html': 'guide/pt/online-zip-file-compressor.jsp', '/guides/es/online-zip-file-compressor.html': 'guide/es/online-zip-file-compressor.jsp', '/guides/vi/online-zip-file-compressor.html': 'guide/vi/online-zip-file-compressor.jsp', '/guides/id/online-zip-file-compressor.html': 'guide/id/online-zip-file-compressor.jsp', '/guides/de/online-zip-file-compressor.html': 'guide/de/online-zip-file-compressor.jsp',
  '/guides/pt/led-test.html': 'guide/pt/led-test.jsp', '/guides/es/led-test.html': 'guide/es/led-test.jsp', '/guides/vi/led-test.html': 'guide/vi/led-test.jsp', '/guides/id/led-test.html': 'guide/id/led-test.jsp', '/guides/de/led-test.html': 'guide/de/led-test.jsp',
  // plan-warm-pascal-v3 S2 batch 5 (2026-05-29) - 5 locale variants × 3 guides (hd-video-converter-step-by-step + compress-zip-file-to-smaller-size + hd-video-converter-vs-alternatives)
  '/guides/pt/hd-video-converter-step-by-step.html': 'guide/pt/hd-video-converter-step-by-step.jsp', '/guides/es/hd-video-converter-step-by-step.html': 'guide/es/hd-video-converter-step-by-step.jsp', '/guides/vi/hd-video-converter-step-by-step.html': 'guide/vi/hd-video-converter-step-by-step.jsp', '/guides/id/hd-video-converter-step-by-step.html': 'guide/id/hd-video-converter-step-by-step.jsp', '/guides/de/hd-video-converter-step-by-step.html': 'guide/de/hd-video-converter-step-by-step.jsp',
  '/guides/pt/compress-zip-file-to-smaller-size.html': 'guide/pt/compress-zip-file-to-smaller-size.jsp', '/guides/es/compress-zip-file-to-smaller-size.html': 'guide/es/compress-zip-file-to-smaller-size.jsp', '/guides/vi/compress-zip-file-to-smaller-size.html': 'guide/vi/compress-zip-file-to-smaller-size.jsp', '/guides/id/compress-zip-file-to-smaller-size.html': 'guide/id/compress-zip-file-to-smaller-size.jsp', '/guides/de/compress-zip-file-to-smaller-size.html': 'guide/de/compress-zip-file-to-smaller-size.jsp',
  '/guides/pt/hd-video-converter-vs-alternatives.html': 'guide/pt/hd-video-converter-vs-alternatives.jsp', '/guides/es/hd-video-converter-vs-alternatives.html': 'guide/es/hd-video-converter-vs-alternatives.jsp', '/guides/vi/hd-video-converter-vs-alternatives.html': 'guide/vi/hd-video-converter-vs-alternatives.jsp', '/guides/id/hd-video-converter-vs-alternatives.html': 'guide/id/hd-video-converter-vs-alternatives.jsp', '/guides/de/hd-video-converter-vs-alternatives.html': 'guide/de/hd-video-converter-vs-alternatives.jsp',
  // plan-warm-pascal-v3 S2 batch 6 (2026-05-29) - 5 locale variants × 3 guides (compress-zip + gif-into-frames + reduce-zip-file-size-online)
  '/guides/pt/compress-zip.html': 'guide/pt/compress-zip.jsp', '/guides/es/compress-zip.html': 'guide/es/compress-zip.jsp', '/guides/vi/compress-zip.html': 'guide/vi/compress-zip.jsp', '/guides/id/compress-zip.html': 'guide/id/compress-zip.jsp', '/guides/de/compress-zip.html': 'guide/de/compress-zip.jsp',
  '/guides/pt/gif-into-frames.html': 'guide/pt/gif-into-frames.jsp', '/guides/es/gif-into-frames.html': 'guide/es/gif-into-frames.jsp', '/guides/vi/gif-into-frames.html': 'guide/vi/gif-into-frames.jsp', '/guides/id/gif-into-frames.html': 'guide/id/gif-into-frames.jsp', '/guides/de/gif-into-frames.html': 'guide/de/gif-into-frames.jsp',
  '/guides/pt/reduce-zip-file-size-online.html': 'guide/pt/reduce-zip-file-size-online.jsp', '/guides/es/reduce-zip-file-size-online.html': 'guide/es/reduce-zip-file-size-online.jsp', '/guides/vi/reduce-zip-file-size-online.html': 'guide/vi/reduce-zip-file-size-online.jsp', '/guides/id/reduce-zip-file-size-online.html': 'guide/id/reduce-zip-file-size-online.jsp', '/guides/de/reduce-zip-file-size-online.html': 'guide/de/reduce-zip-file-size-online.jsp',
  // plan-warm-pascal-v3 S2 batch 7 (2026-05-29) - 5 locale variants × 3 guides (json-formatter-step-by-step + zip-compress + json-formatter-vs-alternatives)
  '/guides/pt/json-formatter-step-by-step.html': 'guide/pt/json-formatter-step-by-step.jsp', '/guides/es/json-formatter-step-by-step.html': 'guide/es/json-formatter-step-by-step.jsp', '/guides/vi/json-formatter-step-by-step.html': 'guide/vi/json-formatter-step-by-step.jsp', '/guides/id/json-formatter-step-by-step.html': 'guide/id/json-formatter-step-by-step.jsp', '/guides/de/json-formatter-step-by-step.html': 'guide/de/json-formatter-step-by-step.jsp',
  '/guides/pt/zip-compress.html': 'guide/pt/zip-compress.jsp', '/guides/es/zip-compress.html': 'guide/es/zip-compress.jsp', '/guides/vi/zip-compress.html': 'guide/vi/zip-compress.jsp', '/guides/id/zip-compress.html': 'guide/id/zip-compress.jsp', '/guides/de/zip-compress.html': 'guide/de/zip-compress.jsp',
  '/guides/pt/json-formatter-vs-alternatives.html': 'guide/pt/json-formatter-vs-alternatives.jsp', '/guides/es/json-formatter-vs-alternatives.html': 'guide/es/json-formatter-vs-alternatives.jsp', '/guides/vi/json-formatter-vs-alternatives.html': 'guide/vi/json-formatter-vs-alternatives.jsp', '/guides/id/json-formatter-vs-alternatives.html': 'guide/id/json-formatter-vs-alternatives.jsp', '/guides/de/json-formatter-vs-alternatives.html': 'guide/de/json-formatter-vs-alternatives.jsp',
  // plan-warm-pascal-v3 S2 batch 8 (2026-05-29) - 5 locale variants × 3 guides (unlock-zip-file-online + how-to-zip-multiple-files-into-one + crop-and-rotate-image)
  '/guides/pt/unlock-zip-file-online.html': 'guide/pt/unlock-zip-file-online.jsp', '/guides/es/unlock-zip-file-online.html': 'guide/es/unlock-zip-file-online.jsp', '/guides/vi/unlock-zip-file-online.html': 'guide/vi/unlock-zip-file-online.jsp', '/guides/id/unlock-zip-file-online.html': 'guide/id/unlock-zip-file-online.jsp', '/guides/de/unlock-zip-file-online.html': 'guide/de/unlock-zip-file-online.jsp',
  '/guides/pt/how-to-zip-multiple-files-into-one.html': 'guide/pt/how-to-zip-multiple-files-into-one.jsp', '/guides/es/how-to-zip-multiple-files-into-one.html': 'guide/es/how-to-zip-multiple-files-into-one.jsp', '/guides/vi/how-to-zip-multiple-files-into-one.html': 'guide/vi/how-to-zip-multiple-files-into-one.jsp', '/guides/id/how-to-zip-multiple-files-into-one.html': 'guide/id/how-to-zip-multiple-files-into-one.jsp', '/guides/de/how-to-zip-multiple-files-into-one.html': 'guide/de/how-to-zip-multiple-files-into-one.jsp',
  '/guides/pt/crop-and-rotate-image.html': 'guide/pt/crop-and-rotate-image.jsp', '/guides/es/crop-and-rotate-image.html': 'guide/es/crop-and-rotate-image.jsp', '/guides/vi/crop-and-rotate-image.html': 'guide/vi/crop-and-rotate-image.jsp', '/guides/id/crop-and-rotate-image.html': 'guide/id/crop-and-rotate-image.jsp', '/guides/de/crop-and-rotate-image.html': 'guide/de/crop-and-rotate-image.jsp',
  // plan-warm-pascal-v3 S2 batch 9 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/how-to-compress-zip-file-to-smaller-size.html': 'guide/pt/how-to-compress-zip-file-to-smaller-size.jsp', '/guides/es/how-to-compress-zip-file-to-smaller-size.html': 'guide/es/how-to-compress-zip-file-to-smaller-size.jsp', '/guides/vi/how-to-compress-zip-file-to-smaller-size.html': 'guide/vi/how-to-compress-zip-file-to-smaller-size.jsp', '/guides/id/how-to-compress-zip-file-to-smaller-size.html': 'guide/id/how-to-compress-zip-file-to-smaller-size.jsp', '/guides/de/how-to-compress-zip-file-to-smaller-size.html': 'guide/de/how-to-compress-zip-file-to-smaller-size.jsp',
  '/guides/pt/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html': 'guide/pt/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.jsp', '/guides/es/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html': 'guide/es/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.jsp', '/guides/vi/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html': 'guide/vi/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.jsp', '/guides/id/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html': 'guide/id/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.jsp', '/guides/de/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html': 'guide/de/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.jsp',
  '/guides/pt/how-to-check-camera-quality-on-your-phone.html': 'guide/pt/how-to-check-camera-quality-on-your-phone.jsp', '/guides/es/how-to-check-camera-quality-on-your-phone.html': 'guide/es/how-to-check-camera-quality-on-your-phone.jsp', '/guides/vi/how-to-check-camera-quality-on-your-phone.html': 'guide/vi/how-to-check-camera-quality-on-your-phone.jsp', '/guides/id/how-to-check-camera-quality-on-your-phone.html': 'guide/id/how-to-check-camera-quality-on-your-phone.jsp', '/guides/de/how-to-check-camera-quality-on-your-phone.html': 'guide/de/how-to-check-camera-quality-on-your-phone.jsp',
  // plan-warm-pascal-v3 S2 batch 10 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/online-zip-vs-7z-vs-rar-which-to-pick.html': 'guide/pt/online-zip-vs-7z-vs-rar-which-to-pick.jsp', '/guides/es/online-zip-vs-7z-vs-rar-which-to-pick.html': 'guide/es/online-zip-vs-7z-vs-rar-which-to-pick.jsp', '/guides/vi/online-zip-vs-7z-vs-rar-which-to-pick.html': 'guide/vi/online-zip-vs-7z-vs-rar-which-to-pick.jsp', '/guides/id/online-zip-vs-7z-vs-rar-which-to-pick.html': 'guide/id/online-zip-vs-7z-vs-rar-which-to-pick.jsp', '/guides/de/online-zip-vs-7z-vs-rar-which-to-pick.html': 'guide/de/online-zip-vs-7z-vs-rar-which-to-pick.jsp',
  '/guides/pt/jpg-vs-jpeg-are-they-the-same.html': 'guide/pt/jpg-vs-jpeg-are-they-the-same.jsp', '/guides/es/jpg-vs-jpeg-are-they-the-same.html': 'guide/es/jpg-vs-jpeg-are-they-the-same.jsp', '/guides/vi/jpg-vs-jpeg-are-they-the-same.html': 'guide/vi/jpg-vs-jpeg-are-they-the-same.jsp', '/guides/id/jpg-vs-jpeg-are-they-the-same.html': 'guide/id/jpg-vs-jpeg-are-they-the-same.jsp', '/guides/de/jpg-vs-jpeg-are-they-the-same.html': 'guide/de/jpg-vs-jpeg-are-they-the-same.jsp',
  '/guides/pt/iphone-photo-format-explained-heic-jpg-png-raw.html': 'guide/pt/iphone-photo-format-explained-heic-jpg-png-raw.jsp', '/guides/es/iphone-photo-format-explained-heic-jpg-png-raw.html': 'guide/es/iphone-photo-format-explained-heic-jpg-png-raw.jsp', '/guides/vi/iphone-photo-format-explained-heic-jpg-png-raw.html': 'guide/vi/iphone-photo-format-explained-heic-jpg-png-raw.jsp', '/guides/id/iphone-photo-format-explained-heic-jpg-png-raw.html': 'guide/id/iphone-photo-format-explained-heic-jpg-png-raw.jsp', '/guides/de/iphone-photo-format-explained-heic-jpg-png-raw.html': 'guide/de/iphone-photo-format-explained-heic-jpg-png-raw.jsp',
  // plan-warm-pascal-v3 S2 batch 11 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/zip-size-reducer.html': 'guide/pt/zip-size-reducer.jsp', '/guides/es/zip-size-reducer.html': 'guide/es/zip-size-reducer.jsp', '/guides/vi/zip-size-reducer.html': 'guide/vi/zip-size-reducer.jsp', '/guides/id/zip-size-reducer.html': 'guide/id/zip-size-reducer.jsp', '/guides/de/zip-size-reducer.html': 'guide/de/zip-size-reducer.jsp',
  '/guides/pt/zip-folder-online-free.html': 'guide/pt/zip-folder-online-free.jsp', '/guides/es/zip-folder-online-free.html': 'guide/es/zip-folder-online-free.jsp', '/guides/vi/zip-folder-online-free.html': 'guide/vi/zip-folder-online-free.jsp', '/guides/id/zip-folder-online-free.html': 'guide/id/zip-folder-online-free.jsp', '/guides/de/zip-folder-online-free.html': 'guide/de/zip-folder-online-free.jsp',
  '/guides/pt/svg-to-png-when-to-rasterize-an-svg.html': 'guide/pt/svg-to-png-when-to-rasterize-an-svg.jsp', '/guides/es/svg-to-png-when-to-rasterize-an-svg.html': 'guide/es/svg-to-png-when-to-rasterize-an-svg.jsp', '/guides/vi/svg-to-png-when-to-rasterize-an-svg.html': 'guide/vi/svg-to-png-when-to-rasterize-an-svg.jsp', '/guides/id/svg-to-png-when-to-rasterize-an-svg.html': 'guide/id/svg-to-png-when-to-rasterize-an-svg.jsp', '/guides/de/svg-to-png-when-to-rasterize-an-svg.html': 'guide/de/svg-to-png-when-to-rasterize-an-svg.jsp',
  // plan-warm-pascal-v3 S2 batch 12 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/compress-zip-size.html': 'guide/pt/compress-zip-size.jsp', '/guides/es/compress-zip-size.html': 'guide/es/compress-zip-size.jsp', '/guides/vi/compress-zip-size.html': 'guide/vi/compress-zip-size.jsp', '/guides/id/compress-zip-size.html': 'guide/id/compress-zip-size.jsp', '/guides/de/compress-zip-size.html': 'guide/de/compress-zip-size.jsp',
  '/guides/pt/create-zip-file-online.html': 'guide/pt/create-zip-file-online.jsp', '/guides/es/create-zip-file-online.html': 'guide/es/create-zip-file-online.jsp', '/guides/vi/create-zip-file-online.html': 'guide/vi/create-zip-file-online.jsp', '/guides/id/create-zip-file-online.html': 'guide/id/create-zip-file-online.jsp', '/guides/de/create-zip-file-online.html': 'guide/de/create-zip-file-online.jsp',
  '/guides/pt/css-minifier-vs-compressor.html': 'guide/pt/css-minifier-vs-compressor.jsp', '/guides/es/css-minifier-vs-compressor.html': 'guide/es/css-minifier-vs-compressor.jsp', '/guides/vi/css-minifier-vs-compressor.html': 'guide/vi/css-minifier-vs-compressor.jsp', '/guides/id/css-minifier-vs-compressor.html': 'guide/id/css-minifier-vs-compressor.jsp', '/guides/de/css-minifier-vs-compressor.html': 'guide/de/css-minifier-vs-compressor.jsp',
  // plan-warm-pascal-v3 S2 batch 13 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/compress-folder-online.html': 'guide/pt/compress-folder-online.jsp', '/guides/es/compress-folder-online.html': 'guide/es/compress-folder-online.jsp', '/guides/vi/compress-folder-online.html': 'guide/vi/compress-folder-online.jsp', '/guides/id/compress-folder-online.html': 'guide/id/compress-folder-online.jsp', '/guides/de/compress-folder-online.html': 'guide/de/compress-folder-online.jsp',
  '/guides/pt/csv-vs-json-data-formats.html': 'guide/pt/csv-vs-json-data-formats.jsp', '/guides/es/csv-vs-json-data-formats.html': 'guide/es/csv-vs-json-data-formats.jsp', '/guides/vi/csv-vs-json-data-formats.html': 'guide/vi/csv-vs-json-data-formats.jsp', '/guides/id/csv-vs-json-data-formats.html': 'guide/id/csv-vs-json-data-formats.jsp', '/guides/de/csv-vs-json-data-formats.html': 'guide/de/csv-vs-json-data-formats.jsp',
  '/guides/pt/dead-pixel-testing-guide.html': 'guide/pt/dead-pixel-testing-guide.jsp', '/guides/es/dead-pixel-testing-guide.html': 'guide/es/dead-pixel-testing-guide.jsp', '/guides/vi/dead-pixel-testing-guide.html': 'guide/vi/dead-pixel-testing-guide.jsp', '/guides/id/dead-pixel-testing-guide.html': 'guide/id/dead-pixel-testing-guide.jsp', '/guides/de/dead-pixel-testing-guide.html': 'guide/de/dead-pixel-testing-guide.jsp',
  // plan-warm-pascal-v3 S2 batch 14 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/current-millis.html': 'guide/pt/current-millis.jsp', '/guides/es/current-millis.html': 'guide/es/current-millis.jsp', '/guides/vi/current-millis.html': 'guide/vi/current-millis.jsp', '/guides/id/current-millis.html': 'guide/id/current-millis.jsp', '/guides/de/current-millis.html': 'guide/de/current-millis.jsp',
  '/guides/pt/camera-check.html': 'guide/pt/camera-check.jsp', '/guides/es/camera-check.html': 'guide/es/camera-check.jsp', '/guides/vi/camera-check.html': 'guide/vi/camera-check.jsp', '/guides/id/camera-check.html': 'guide/id/camera-check.jsp', '/guides/de/camera-check.html': 'guide/de/camera-check.jsp',
  '/guides/pt/compress-jpeg-without-losing-quality-quality-vs-size.html': 'guide/pt/compress-jpeg-without-losing-quality-quality-vs-size.jsp', '/guides/es/compress-jpeg-without-losing-quality-quality-vs-size.html': 'guide/es/compress-jpeg-without-losing-quality-quality-vs-size.jsp', '/guides/vi/compress-jpeg-without-losing-quality-quality-vs-size.html': 'guide/vi/compress-jpeg-without-losing-quality-quality-vs-size.jsp', '/guides/id/compress-jpeg-without-losing-quality-quality-vs-size.html': 'guide/id/compress-jpeg-without-losing-quality-quality-vs-size.jsp', '/guides/de/compress-jpeg-without-losing-quality-quality-vs-size.html': 'guide/de/compress-jpeg-without-losing-quality-quality-vs-size.jsp',
  // plan-warm-pascal-v3 S2 batch 15 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/current-time-in-milliseconds.html': 'guide/pt/current-time-in-milliseconds.jsp', '/guides/es/current-time-in-milliseconds.html': 'guide/es/current-time-in-milliseconds.jsp', '/guides/vi/current-time-in-milliseconds.html': 'guide/vi/current-time-in-milliseconds.jsp', '/guides/id/current-time-in-milliseconds.html': 'guide/id/current-time-in-milliseconds.jsp', '/guides/de/current-time-in-milliseconds.html': 'guide/de/current-time-in-milliseconds.jsp',
  '/guides/pt/time-in-ms.html': 'guide/pt/time-in-ms.jsp', '/guides/es/time-in-ms.html': 'guide/es/time-in-ms.jsp', '/guides/vi/time-in-ms.html': 'guide/vi/time-in-ms.jsp', '/guides/id/time-in-ms.html': 'guide/id/time-in-ms.jsp', '/guides/de/time-in-ms.html': 'guide/de/time-in-ms.jsp',
  '/guides/pt/camera-mirror-vs-flip-explained.html': 'guide/pt/camera-mirror-vs-flip-explained.jsp', '/guides/es/camera-mirror-vs-flip-explained.html': 'guide/es/camera-mirror-vs-flip-explained.jsp', '/guides/vi/camera-mirror-vs-flip-explained.html': 'guide/vi/camera-mirror-vs-flip-explained.jsp', '/guides/id/camera-mirror-vs-flip-explained.html': 'guide/id/camera-mirror-vs-flip-explained.jsp', '/guides/de/camera-mirror-vs-flip-explained.html': 'guide/de/camera-mirror-vs-flip-explained.jsp',
  '/guides/pt/compressed-jpg-looks-blurry-three-causes.html': 'guide/pt/compressed-jpg-looks-blurry-three-causes.jsp', '/guides/es/compressed-jpg-looks-blurry-three-causes.html': 'guide/es/compressed-jpg-looks-blurry-three-causes.jsp', '/guides/vi/compressed-jpg-looks-blurry-three-causes.html': 'guide/vi/compressed-jpg-looks-blurry-three-causes.jsp', '/guides/id/compressed-jpg-looks-blurry-three-causes.html': 'guide/id/compressed-jpg-looks-blurry-three-causes.jsp', '/guides/de/compressed-jpg-looks-blurry-three-causes.html': 'guide/de/compressed-jpg-looks-blurry-three-causes.jsp',
  // plan-warm-pascal-v3 S2 batch 16 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/camera-test-permission-blocked-how-to-allow-it.html': 'guide/pt/camera-test-permission-blocked-how-to-allow-it.jsp', '/guides/es/camera-test-permission-blocked-how-to-allow-it.html': 'guide/es/camera-test-permission-blocked-how-to-allow-it.jsp', '/guides/vi/camera-test-permission-blocked-how-to-allow-it.html': 'guide/vi/camera-test-permission-blocked-how-to-allow-it.jsp', '/guides/id/camera-test-permission-blocked-how-to-allow-it.html': 'guide/id/camera-test-permission-blocked-how-to-allow-it.jsp', '/guides/de/camera-test-permission-blocked-how-to-allow-it.html': 'guide/de/camera-test-permission-blocked-how-to-allow-it.jsp',
  '/guides/pt/css-minifier-vs-uglifier-vs-tree-shaking.html': 'guide/pt/css-minifier-vs-uglifier-vs-tree-shaking.jsp', '/guides/es/css-minifier-vs-uglifier-vs-tree-shaking.html': 'guide/es/css-minifier-vs-uglifier-vs-tree-shaking.jsp', '/guides/vi/css-minifier-vs-uglifier-vs-tree-shaking.html': 'guide/vi/css-minifier-vs-uglifier-vs-tree-shaking.jsp', '/guides/id/css-minifier-vs-uglifier-vs-tree-shaking.html': 'guide/id/css-minifier-vs-uglifier-vs-tree-shaking.jsp', '/guides/de/css-minifier-vs-uglifier-vs-tree-shaking.html': 'guide/de/css-minifier-vs-uglifier-vs-tree-shaking.jsp',
  '/guides/pt/download-link-not-appearing-after-conversion-five-fixes.html': 'guide/pt/download-link-not-appearing-after-conversion-five-fixes.jsp', '/guides/es/download-link-not-appearing-after-conversion-five-fixes.html': 'guide/es/download-link-not-appearing-after-conversion-five-fixes.jsp', '/guides/vi/download-link-not-appearing-after-conversion-five-fixes.html': 'guide/vi/download-link-not-appearing-after-conversion-five-fixes.jsp', '/guides/id/download-link-not-appearing-after-conversion-five-fixes.html': 'guide/id/download-link-not-appearing-after-conversion-five-fixes.jsp', '/guides/de/download-link-not-appearing-after-conversion-five-fixes.html': 'guide/de/download-link-not-appearing-after-conversion-five-fixes.jsp',
  // plan-warm-pascal-v3 S2 batch 17 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/camera-test-vs-webcam-test-which-do-you-need.html': 'guide/pt/camera-test-vs-webcam-test-which-do-you-need.jsp', '/guides/es/camera-test-vs-webcam-test-which-do-you-need.html': 'guide/es/camera-test-vs-webcam-test-which-do-you-need.jsp', '/guides/vi/camera-test-vs-webcam-test-which-do-you-need.html': 'guide/vi/camera-test-vs-webcam-test-which-do-you-need.jsp', '/guides/id/camera-test-vs-webcam-test-which-do-you-need.html': 'guide/id/camera-test-vs-webcam-test-which-do-you-need.jsp', '/guides/de/camera-test-vs-webcam-test-which-do-you-need.html': 'guide/de/camera-test-vs-webcam-test-which-do-you-need.jsp',
  // Cycle 20260610-13 - LCD test for laptop screens (device-test) - 5 locale variants
  '/guides/pt/lcd-test-laptop.html': 'guide/pt/lcd-test-laptop.jsp', '/guides/es/lcd-test-laptop.html': 'guide/es/lcd-test-laptop.jsp', '/guides/vi/lcd-test-laptop.html': 'guide/vi/lcd-test-laptop.jsp', '/guides/id/lcd-test-laptop.html': 'guide/id/lcd-test-laptop.jsp', '/guides/de/lcd-test-laptop.html': 'guide/de/lcd-test-laptop.jsp',
  '/guides/pt/device-test-checklist-for-remote-work.html': 'guide/pt/device-test-checklist-for-remote-work.jsp', '/guides/es/device-test-checklist-for-remote-work.html': 'guide/es/device-test-checklist-for-remote-work.jsp', '/guides/vi/device-test-checklist-for-remote-work.html': 'guide/vi/device-test-checklist-for-remote-work.jsp', '/guides/id/device-test-checklist-for-remote-work.html': 'guide/id/device-test-checklist-for-remote-work.jsp', '/guides/de/device-test-checklist-for-remote-work.html': 'guide/de/device-test-checklist-for-remote-work.jsp',
  '/guides/pt/before-a-video-call-which-tools-to-run.html': 'guide/pt/before-a-video-call-which-tools-to-run.jsp', '/guides/es/before-a-video-call-which-tools-to-run.html': 'guide/es/before-a-video-call-which-tools-to-run.jsp', '/guides/vi/before-a-video-call-which-tools-to-run.html': 'guide/vi/before-a-video-call-which-tools-to-run.jsp', '/guides/id/before-a-video-call-which-tools-to-run.html': 'guide/id/before-a-video-call-which-tools-to-run.jsp', '/guides/de/before-a-video-call-which-tools-to-run.html': 'guide/de/before-a-video-call-which-tools-to-run.jsp',
  // plan-warm-pascal-v3 S2 batch 18 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/extract-gif-frames-png-vs-jpg-which-format.html': 'guide/pt/extract-gif-frames-png-vs-jpg-which-format.jsp', '/guides/es/extract-gif-frames-png-vs-jpg-which-format.html': 'guide/es/extract-gif-frames-png-vs-jpg-which-format.jsp', '/guides/vi/extract-gif-frames-png-vs-jpg-which-format.html': 'guide/vi/extract-gif-frames-png-vs-jpg-which-format.jsp', '/guides/id/extract-gif-frames-png-vs-jpg-which-format.html': 'guide/id/extract-gif-frames-png-vs-jpg-which-format.jsp', '/guides/de/extract-gif-frames-png-vs-jpg-which-format.html': 'guide/de/extract-gif-frames-png-vs-jpg-which-format.jsp',
  '/guides/pt/how-to-compress-a-file-online.html': 'guide/pt/how-to-compress-a-file-online.jsp', '/guides/es/how-to-compress-a-file-online.html': 'guide/es/how-to-compress-a-file-online.jsp', '/guides/vi/how-to-compress-a-file-online.html': 'guide/vi/how-to-compress-a-file-online.jsp', '/guides/id/how-to-compress-a-file-online.html': 'guide/id/how-to-compress-a-file-online.jsp', '/guides/de/how-to-compress-a-file-online.html': 'guide/de/how-to-compress-a-file-online.jsp',
  '/guides/pt/ffmpeg-online-conversion-stalled-three-fixes.html': 'guide/pt/ffmpeg-online-conversion-stalled-three-fixes.jsp', '/guides/es/ffmpeg-online-conversion-stalled-three-fixes.html': 'guide/es/ffmpeg-online-conversion-stalled-three-fixes.jsp', '/guides/vi/ffmpeg-online-conversion-stalled-three-fixes.html': 'guide/vi/ffmpeg-online-conversion-stalled-three-fixes.jsp', '/guides/id/ffmpeg-online-conversion-stalled-three-fixes.html': 'guide/id/ffmpeg-online-conversion-stalled-three-fixes.jsp', '/guides/de/ffmpeg-online-conversion-stalled-three-fixes.html': 'guide/de/ffmpeg-online-conversion-stalled-three-fixes.jsp',
  // plan-warm-pascal-v3 S2 batch 19 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/camera-test-shows-black-screen-four-fixes.html': 'guide/pt/camera-test-shows-black-screen-four-fixes.jsp', '/guides/es/camera-test-shows-black-screen-four-fixes.html': 'guide/es/camera-test-shows-black-screen-four-fixes.jsp', '/guides/vi/camera-test-shows-black-screen-four-fixes.html': 'guide/vi/camera-test-shows-black-screen-four-fixes.jsp', '/guides/id/camera-test-shows-black-screen-four-fixes.html': 'guide/id/camera-test-shows-black-screen-four-fixes.jsp', '/guides/de/camera-test-shows-black-screen-four-fixes.html': 'guide/de/camera-test-shows-black-screen-four-fixes.jsp',
  '/guides/pt/file-compressor.html': 'guide/pt/file-compressor.jsp', '/guides/es/file-compressor.html': 'guide/es/file-compressor.jsp', '/guides/vi/file-compressor.html': 'guide/vi/file-compressor.jsp', '/guides/id/file-compressor.html': 'guide/id/file-compressor.jsp', '/guides/de/file-compressor.html': 'guide/de/file-compressor.jsp',
  '/guides/pt/gif-frame-extractor.html': 'guide/pt/gif-frame-extractor.jsp', '/guides/es/gif-frame-extractor.html': 'guide/es/gif-frame-extractor.jsp', '/guides/vi/gif-frame-extractor.html': 'guide/vi/gif-frame-extractor.jsp', '/guides/id/gif-frame-extractor.html': 'guide/id/gif-frame-extractor.jsp', '/guides/de/gif-frame-extractor.html': 'guide/de/gif-frame-extractor.jsp',
  // Cycle 20260610-12 P12.D - 5 locale JSP routes for gif-to-frames-converter
  '/guides/pt/gif-to-frames-converter.html': 'guide/pt/gif-to-frames-converter.jsp', '/guides/es/gif-to-frames-converter.html': 'guide/es/gif-to-frames-converter.jsp', '/guides/vi/gif-to-frames-converter.html': 'guide/vi/gif-to-frames-converter.jsp', '/guides/id/gif-to-frames-converter.html': 'guide/id/gif-to-frames-converter.jsp', '/guides/de/gif-to-frames-converter.html': 'guide/de/gif-to-frames-converter.jsp',
  // Cycle 20260610-14 - 5 locale JSP routes for gif-to-frame
  '/guides/pt/gif-to-frame.html': 'guide/pt/gif-to-frame.jsp', '/guides/es/gif-to-frame.html': 'guide/es/gif-to-frame.jsp', '/guides/vi/gif-to-frame.html': 'guide/vi/gif-to-frame.jsp', '/guides/id/gif-to-frame.html': 'guide/id/gif-to-frame.jsp', '/guides/de/gif-to-frame.html': 'guide/de/gif-to-frame.jsp',
  // plan-warm-pascal-v3 S2 batch 20 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/how-to-choose-a-compression-level.html': 'guide/pt/how-to-choose-a-compression-level.jsp', '/guides/es/how-to-choose-a-compression-level.html': 'guide/es/how-to-choose-a-compression-level.jsp', '/guides/vi/how-to-choose-a-compression-level.html': 'guide/vi/how-to-choose-a-compression-level.jsp', '/guides/id/how-to-choose-a-compression-level.html': 'guide/id/how-to-choose-a-compression-level.jsp', '/guides/de/how-to-choose-a-compression-level.html': 'guide/de/how-to-choose-a-compression-level.jsp',
  '/guides/pt/heic-vs-jpg-vs-webp.html': 'guide/pt/heic-vs-jpg-vs-webp.jsp', '/guides/es/heic-vs-jpg-vs-webp.html': 'guide/es/heic-vs-jpg-vs-webp.jsp', '/guides/vi/heic-vs-jpg-vs-webp.html': 'guide/vi/heic-vs-jpg-vs-webp.jsp', '/guides/id/heic-vs-jpg-vs-webp.html': 'guide/id/heic-vs-jpg-vs-webp.jsp', '/guides/de/heic-vs-jpg-vs-webp.html': 'guide/de/heic-vs-jpg-vs-webp.jsp',
  '/guides/pt/ffmpeg-online-vs-video-converter-which-to-pick.html': 'guide/pt/ffmpeg-online-vs-video-converter-which-to-pick.jsp', '/guides/es/ffmpeg-online-vs-video-converter-which-to-pick.html': 'guide/es/ffmpeg-online-vs-video-converter-which-to-pick.jsp', '/guides/vi/ffmpeg-online-vs-video-converter-which-to-pick.html': 'guide/vi/ffmpeg-online-vs-video-converter-which-to-pick.jsp', '/guides/id/ffmpeg-online-vs-video-converter-which-to-pick.html': 'guide/id/ffmpeg-online-vs-video-converter-which-to-pick.jsp', '/guides/de/ffmpeg-online-vs-video-converter-which-to-pick.html': 'guide/de/ffmpeg-online-vs-video-converter-which-to-pick.jsp',
  // plan-warm-pascal-v3 S2 batch 21 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/base64-when-to-use-and-when-not-to.html': 'guide/pt/base64-when-to-use-and-when-not-to.jsp', '/guides/es/base64-when-to-use-and-when-not-to.html': 'guide/es/base64-when-to-use-and-when-not-to.jsp', '/guides/vi/base64-when-to-use-and-when-not-to.html': 'guide/vi/base64-when-to-use-and-when-not-to.jsp', '/guides/id/base64-when-to-use-and-when-not-to.html': 'guide/id/base64-when-to-use-and-when-not-to.jsp', '/guides/de/base64-when-to-use-and-when-not-to.html': 'guide/de/base64-when-to-use-and-when-not-to.jsp',
  '/guides/pt/how-to-check-webcam-and-microphone-before-an-interview.html': 'guide/pt/how-to-check-webcam-and-microphone-before-an-interview.jsp', '/guides/es/how-to-check-webcam-and-microphone-before-an-interview.html': 'guide/es/how-to-check-webcam-and-microphone-before-an-interview.jsp', '/guides/vi/how-to-check-webcam-and-microphone-before-an-interview.html': 'guide/vi/how-to-check-webcam-and-microphone-before-an-interview.jsp', '/guides/id/how-to-check-webcam-and-microphone-before-an-interview.html': 'guide/id/how-to-check-webcam-and-microphone-before-an-interview.jsp', '/guides/de/how-to-check-webcam-and-microphone-before-an-interview.html': 'guide/de/how-to-check-webcam-and-microphone-before-an-interview.jsp',
  '/guides/pt/how-to-compress-a-folder.html': 'guide/pt/how-to-compress-a-folder.jsp', '/guides/es/how-to-compress-a-folder.html': 'guide/es/how-to-compress-a-folder.jsp', '/guides/vi/how-to-compress-a-folder.html': 'guide/vi/how-to-compress-a-folder.jsp', '/guides/id/how-to-compress-a-folder.html': 'guide/id/how-to-compress-a-folder.jsp', '/guides/de/how-to-compress-a-folder.html': 'guide/de/how-to-compress-a-folder.jsp',
  // plan-warm-pascal-v3 S2 batch 22 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/compress-zip-file-to-100kb.html': 'guide/pt/compress-zip-file-to-100kb.jsp', '/guides/es/compress-zip-file-to-100kb.html': 'guide/es/compress-zip-file-to-100kb.jsp', '/guides/vi/compress-zip-file-to-100kb.html': 'guide/vi/compress-zip-file-to-100kb.jsp', '/guides/id/compress-zip-file-to-100kb.html': 'guide/id/compress-zip-file-to-100kb.jsp', '/guides/de/compress-zip-file-to-100kb.html': 'guide/de/compress-zip-file-to-100kb.jsp',
  '/guides/pt/gif-frames-extract-vs-frame-rate-fps-explained.html': 'guide/pt/gif-frames-extract-vs-frame-rate-fps-explained.jsp', '/guides/es/gif-frames-extract-vs-frame-rate-fps-explained.html': 'guide/es/gif-frames-extract-vs-frame-rate-fps-explained.jsp', '/guides/vi/gif-frames-extract-vs-frame-rate-fps-explained.html': 'guide/vi/gif-frames-extract-vs-frame-rate-fps-explained.jsp', '/guides/id/gif-frames-extract-vs-frame-rate-fps-explained.html': 'guide/id/gif-frames-extract-vs-frame-rate-fps-explained.jsp', '/guides/de/gif-frames-extract-vs-frame-rate-fps-explained.html': 'guide/de/gif-frames-extract-vs-frame-rate-fps-explained.jsp',
  '/guides/pt/heic-vs-jpg-converter-when-each-wins.html': 'guide/pt/heic-vs-jpg-converter-when-each-wins.jsp', '/guides/es/heic-vs-jpg-converter-when-each-wins.html': 'guide/es/heic-vs-jpg-converter-when-each-wins.jsp', '/guides/vi/heic-vs-jpg-converter-when-each-wins.html': 'guide/vi/heic-vs-jpg-converter-when-each-wins.jsp', '/guides/id/heic-vs-jpg-converter-when-each-wins.html': 'guide/id/heic-vs-jpg-converter-when-each-wins.jsp', '/guides/de/heic-vs-jpg-converter-when-each-wins.html': 'guide/de/heic-vs-jpg-converter-when-each-wins.jsp',
  // plan-warm-pascal-v3 S2 batch 23 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/compress-zip-file-to-2mb.html': 'guide/pt/compress-zip-file-to-2mb.jsp', '/guides/es/compress-zip-file-to-2mb.html': 'guide/es/compress-zip-file-to-2mb.jsp', '/guides/vi/compress-zip-file-to-2mb.html': 'guide/vi/compress-zip-file-to-2mb.jsp', '/guides/id/compress-zip-file-to-2mb.html': 'guide/id/compress-zip-file-to-2mb.jsp', '/guides/de/compress-zip-file-to-2mb.html': 'guide/de/compress-zip-file-to-2mb.jsp',
  '/guides/pt/folder-to-zip.html': 'guide/pt/folder-to-zip.jsp', '/guides/es/folder-to-zip.html': 'guide/es/folder-to-zip.jsp', '/guides/vi/folder-to-zip.html': 'guide/vi/folder-to-zip.jsp', '/guides/id/folder-to-zip.html': 'guide/id/folder-to-zip.jsp', '/guides/de/folder-to-zip.html': 'guide/de/folder-to-zip.jsp',
  '/guides/pt/css-unminifier-vs-prettier-when-to-use-each.html': 'guide/pt/css-unminifier-vs-prettier-when-to-use-each.jsp', '/guides/es/css-unminifier-vs-prettier-when-to-use-each.html': 'guide/es/css-unminifier-vs-prettier-when-to-use-each.jsp', '/guides/vi/css-unminifier-vs-prettier-when-to-use-each.html': 'guide/vi/css-unminifier-vs-prettier-when-to-use-each.jsp', '/guides/id/css-unminifier-vs-prettier-when-to-use-each.html': 'guide/id/css-unminifier-vs-prettier-when-to-use-each.jsp', '/guides/de/css-unminifier-vs-prettier-when-to-use-each.html': 'guide/de/css-unminifier-vs-prettier-when-to-use-each.jsp',
  // plan-warm-pascal-v3 S2 batch 24 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html': 'guide/pt/ffmpeg-online-vs-local-ffmpeg-when-each-wins.jsp', '/guides/es/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html': 'guide/es/ffmpeg-online-vs-local-ffmpeg-when-each-wins.jsp', '/guides/vi/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html': 'guide/vi/ffmpeg-online-vs-local-ffmpeg-when-each-wins.jsp', '/guides/id/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html': 'guide/id/ffmpeg-online-vs-local-ffmpeg-when-each-wins.jsp', '/guides/de/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html': 'guide/de/ffmpeg-online-vs-local-ffmpeg-when-each-wins.jsp',
  '/guides/pt/file-compressor-vs-zip-what-to-pick.html': 'guide/pt/file-compressor-vs-zip-what-to-pick.jsp', '/guides/es/file-compressor-vs-zip-what-to-pick.html': 'guide/es/file-compressor-vs-zip-what-to-pick.jsp', '/guides/vi/file-compressor-vs-zip-what-to-pick.html': 'guide/vi/file-compressor-vs-zip-what-to-pick.jsp', '/guides/id/file-compressor-vs-zip-what-to-pick.html': 'guide/id/file-compressor-vs-zip-what-to-pick.jsp', '/guides/de/file-compressor-vs-zip-what-to-pick.html': 'guide/de/file-compressor-vs-zip-what-to-pick.jsp',
  '/guides/pt/how-to-compress-a-folder-for-email.html': 'guide/pt/how-to-compress-a-folder-for-email.jsp', '/guides/es/how-to-compress-a-folder-for-email.html': 'guide/es/how-to-compress-a-folder-for-email.jsp', '/guides/vi/how-to-compress-a-folder-for-email.html': 'guide/vi/how-to-compress-a-folder-for-email.jsp', '/guides/id/how-to-compress-a-folder-for-email.html': 'guide/id/how-to-compress-a-folder-for-email.jsp', '/guides/de/how-to-compress-a-folder-for-email.html': 'guide/de/how-to-compress-a-folder-for-email.jsp',
  // plan-warm-pascal-v3 S2 batch 25 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/gif-frame-extractor-output-looks-wrong-three-causes.html': 'guide/pt/gif-frame-extractor-output-looks-wrong-three-causes.jsp', '/guides/es/gif-frame-extractor-output-looks-wrong-three-causes.html': 'guide/es/gif-frame-extractor-output-looks-wrong-three-causes.jsp', '/guides/vi/gif-frame-extractor-output-looks-wrong-three-causes.html': 'guide/vi/gif-frame-extractor-output-looks-wrong-three-causes.jsp', '/guides/id/gif-frame-extractor-output-looks-wrong-three-causes.html': 'guide/id/gif-frame-extractor-output-looks-wrong-three-causes.jsp', '/guides/de/gif-frame-extractor-output-looks-wrong-three-causes.html': 'guide/de/gif-frame-extractor-output-looks-wrong-three-causes.jsp',
  '/guides/pt/heic-to-jpg-claims-what-actually-works.html': 'guide/pt/heic-to-jpg-claims-what-actually-works.jsp', '/guides/es/heic-to-jpg-claims-what-actually-works.html': 'guide/es/heic-to-jpg-claims-what-actually-works.jsp', '/guides/vi/heic-to-jpg-claims-what-actually-works.html': 'guide/vi/heic-to-jpg-claims-what-actually-works.jsp', '/guides/id/heic-to-jpg-claims-what-actually-works.html': 'guide/id/heic-to-jpg-claims-what-actually-works.jsp', '/guides/de/heic-to-jpg-claims-what-actually-works.html': 'guide/de/heic-to-jpg-claims-what-actually-works.jsp',
  '/guides/pt/how-to-compress-a-jpg-for-email-attachment-limits.html': 'guide/pt/how-to-compress-a-jpg-for-email-attachment-limits.jsp', '/guides/es/how-to-compress-a-jpg-for-email-attachment-limits.html': 'guide/es/how-to-compress-a-jpg-for-email-attachment-limits.jsp', '/guides/vi/how-to-compress-a-jpg-for-email-attachment-limits.html': 'guide/vi/how-to-compress-a-jpg-for-email-attachment-limits.jsp', '/guides/id/how-to-compress-a-jpg-for-email-attachment-limits.html': 'guide/id/how-to-compress-a-jpg-for-email-attachment-limits.jsp', '/guides/de/how-to-compress-a-jpg-for-email-attachment-limits.html': 'guide/de/how-to-compress-a-jpg-for-email-attachment-limits.jsp',
  // plan-warm-pascal-v3 S2 batch 26 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/free-online-tools-that-work-without-uploading-files.html': 'guide/pt/free-online-tools-that-work-without-uploading-files.jsp', '/guides/es/free-online-tools-that-work-without-uploading-files.html': 'guide/es/free-online-tools-that-work-without-uploading-files.jsp', '/guides/vi/free-online-tools-that-work-without-uploading-files.html': 'guide/vi/free-online-tools-that-work-without-uploading-files.jsp', '/guides/id/free-online-tools-that-work-without-uploading-files.html': 'guide/id/free-online-tools-that-work-without-uploading-files.jsp', '/guides/de/free-online-tools-that-work-without-uploading-files.html': 'guide/de/free-online-tools-that-work-without-uploading-files.jsp',
  '/guides/pt/how-to-compress-a-zip-file.html': 'guide/pt/how-to-compress-a-zip-file.jsp', '/guides/es/how-to-compress-a-zip-file.html': 'guide/es/how-to-compress-a-zip-file.jsp', '/guides/vi/how-to-compress-a-zip-file.html': 'guide/vi/how-to-compress-a-zip-file.jsp', '/guides/id/how-to-compress-a-zip-file.html': 'guide/id/how-to-compress-a-zip-file.jsp', '/guides/de/how-to-compress-a-zip-file.html': 'guide/de/how-to-compress-a-zip-file.jsp',
  '/guides/pt/jpg-vs-png-for-web.html': 'guide/pt/jpg-vs-png-for-web.jsp', '/guides/es/jpg-vs-png-for-web.html': 'guide/es/jpg-vs-png-for-web.jsp', '/guides/vi/jpg-vs-png-for-web.html': 'guide/vi/jpg-vs-png-for-web.jsp', '/guides/id/jpg-vs-png-for-web.html': 'guide/id/jpg-vs-png-for-web.jsp', '/guides/de/jpg-vs-png-for-web.html': 'guide/de/jpg-vs-png-for-web.jsp',
  // plan-warm-pascal-v3 S2 batch 27 (2026-05-29) - 5 locale variants × 3 guides
  '/guides/pt/how-to-extract-a-file-online-zip-rar-7z.html': 'guide/pt/how-to-extract-a-file-online-zip-rar-7z.jsp', '/guides/es/how-to-extract-a-file-online-zip-rar-7z.html': 'guide/es/how-to-extract-a-file-online-zip-rar-7z.jsp', '/guides/vi/how-to-extract-a-file-online-zip-rar-7z.html': 'guide/vi/how-to-extract-a-file-online-zip-rar-7z.jsp', '/guides/id/how-to-extract-a-file-online-zip-rar-7z.html': 'guide/id/how-to-extract-a-file-online-zip-rar-7z.jsp', '/guides/de/how-to-extract-a-file-online-zip-rar-7z.html': 'guide/de/how-to-extract-a-file-online-zip-rar-7z.jsp',
  '/guides/pt/how-to-test-a-keyboard-online-step-by-step.html': 'guide/pt/how-to-test-a-keyboard-online-step-by-step.jsp', '/guides/es/how-to-test-a-keyboard-online-step-by-step.html': 'guide/es/how-to-test-a-keyboard-online-step-by-step.jsp', '/guides/vi/how-to-test-a-keyboard-online-step-by-step.html': 'guide/vi/how-to-test-a-keyboard-online-step-by-step.jsp', '/guides/id/how-to-test-a-keyboard-online-step-by-step.html': 'guide/id/how-to-test-a-keyboard-online-step-by-step.jsp', '/guides/de/how-to-test-a-keyboard-online-step-by-step.html': 'guide/de/how-to-test-a-keyboard-online-step-by-step.jsp',
  '/guides/pt/how-to-tell-if-a-jpg-was-compressed-too-much.html': 'guide/pt/how-to-tell-if-a-jpg-was-compressed-too-much.jsp', '/guides/es/how-to-tell-if-a-jpg-was-compressed-too-much.html': 'guide/es/how-to-tell-if-a-jpg-was-compressed-too-much.jsp', '/guides/vi/how-to-tell-if-a-jpg-was-compressed-too-much.html': 'guide/vi/how-to-tell-if-a-jpg-was-compressed-too-much.jsp', '/guides/id/how-to-tell-if-a-jpg-was-compressed-too-much.html': 'guide/id/how-to-tell-if-a-jpg-was-compressed-too-much.jsp', '/guides/de/how-to-tell-if-a-jpg-was-compressed-too-much.html': 'guide/de/how-to-tell-if-a-jpg-was-compressed-too-much.jsp',
  // plan-warm-pascal-v3 S2 batch 28 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/how-to-convert-heic-to-jpg-step-by-step.html': 'guide/pt/how-to-convert-heic-to-jpg-step-by-step.jsp', '/guides/es/how-to-convert-heic-to-jpg-step-by-step.html': 'guide/es/how-to-convert-heic-to-jpg-step-by-step.jsp', '/guides/vi/how-to-convert-heic-to-jpg-step-by-step.html': 'guide/vi/how-to-convert-heic-to-jpg-step-by-step.jsp', '/guides/id/how-to-convert-heic-to-jpg-step-by-step.html': 'guide/id/how-to-convert-heic-to-jpg-step-by-step.jsp', '/guides/de/how-to-convert-heic-to-jpg-step-by-step.html': 'guide/de/how-to-convert-heic-to-jpg-step-by-step.jsp',
  '/guides/pt/how-to-test-a-touchscreen-for-bad-spots.html': 'guide/pt/how-to-test-a-touchscreen-for-bad-spots.jsp', '/guides/es/how-to-test-a-touchscreen-for-bad-spots.html': 'guide/es/how-to-test-a-touchscreen-for-bad-spots.jsp', '/guides/vi/how-to-test-a-touchscreen-for-bad-spots.html': 'guide/vi/how-to-test-a-touchscreen-for-bad-spots.jsp', '/guides/id/how-to-test-a-touchscreen-for-bad-spots.html': 'guide/id/how-to-test-a-touchscreen-for-bad-spots.jsp', '/guides/de/how-to-test-a-touchscreen-for-bad-spots.html': 'guide/de/how-to-test-a-touchscreen-for-bad-spots.jsp',
  '/guides/pt/how-to-minify-css-js-for-cloud-run-cold-start.html': 'guide/pt/how-to-minify-css-js-for-cloud-run-cold-start.jsp', '/guides/es/how-to-minify-css-js-for-cloud-run-cold-start.html': 'guide/es/how-to-minify-css-js-for-cloud-run-cold-start.jsp', '/guides/vi/how-to-minify-css-js-for-cloud-run-cold-start.html': 'guide/vi/how-to-minify-css-js-for-cloud-run-cold-start.jsp', '/guides/id/how-to-minify-css-js-for-cloud-run-cold-start.html': 'guide/id/how-to-minify-css-js-for-cloud-run-cold-start.jsp', '/guides/de/how-to-minify-css-js-for-cloud-run-cold-start.html': 'guide/de/how-to-minify-css-js-for-cloud-run-cold-start.jsp',
  // plan-warm-pascal-v3 S2 batch 29 (2026-05-30) - 5 locale variants × 3 guides; CROSSES 50% MILESTONE
  '/guides/pt/how-to-flatten-a-pdf-and-when-to-do-it.html': 'guide/pt/how-to-flatten-a-pdf-and-when-to-do-it.jsp', '/guides/es/how-to-flatten-a-pdf-and-when-to-do-it.html': 'guide/es/how-to-flatten-a-pdf-and-when-to-do-it.jsp', '/guides/vi/how-to-flatten-a-pdf-and-when-to-do-it.html': 'guide/vi/how-to-flatten-a-pdf-and-when-to-do-it.jsp', '/guides/id/how-to-flatten-a-pdf-and-when-to-do-it.html': 'guide/id/how-to-flatten-a-pdf-and-when-to-do-it.jsp', '/guides/de/how-to-flatten-a-pdf-and-when-to-do-it.html': 'guide/de/how-to-flatten-a-pdf-and-when-to-do-it.jsp',
  '/guides/pt/how-to-crop-and-rotate-an-image.html': 'guide/pt/how-to-crop-and-rotate-an-image.jsp', '/guides/es/how-to-crop-and-rotate-an-image.html': 'guide/es/how-to-crop-and-rotate-an-image.jsp', '/guides/vi/how-to-crop-and-rotate-an-image.html': 'guide/vi/how-to-crop-and-rotate-an-image.jsp', '/guides/id/how-to-crop-and-rotate-an-image.html': 'guide/id/how-to-crop-and-rotate-an-image.jsp', '/guides/de/how-to-crop-and-rotate-an-image.html': 'guide/de/how-to-crop-and-rotate-an-image.jsp',
  '/guides/pt/how-to-compress-a-zip-file-to-a-specific-size.html': 'guide/pt/how-to-compress-a-zip-file-to-a-specific-size.jsp', '/guides/es/how-to-compress-a-zip-file-to-a-specific-size.html': 'guide/es/how-to-compress-a-zip-file-to-a-specific-size.jsp', '/guides/vi/how-to-compress-a-zip-file-to-a-specific-size.html': 'guide/vi/how-to-compress-a-zip-file-to-a-specific-size.jsp', '/guides/id/how-to-compress-a-zip-file-to-a-specific-size.html': 'guide/id/how-to-compress-a-zip-file-to-a-specific-size.jsp', '/guides/de/how-to-compress-a-zip-file-to-a-specific-size.html': 'guide/de/how-to-compress-a-zip-file-to-a-specific-size.jsp',
  // plan-warm-pascal-v3 S2 batch 30 (2026-05-30) - 5 locale variants × 3 guides; PAST 50% R14 threshold
  '/guides/pt/how-to-sign-pdf-after-removing-a-password.html': 'guide/pt/how-to-sign-pdf-after-removing-a-password.jsp', '/guides/es/how-to-sign-pdf-after-removing-a-password.html': 'guide/es/how-to-sign-pdf-after-removing-a-password.jsp', '/guides/vi/how-to-sign-pdf-after-removing-a-password.html': 'guide/vi/how-to-sign-pdf-after-removing-a-password.jsp', '/guides/id/how-to-sign-pdf-after-removing-a-password.html': 'guide/id/how-to-sign-pdf-after-removing-a-password.jsp', '/guides/de/how-to-sign-pdf-after-removing-a-password.html': 'guide/de/how-to-sign-pdf-after-removing-a-password.jsp',
  '/guides/pt/how-to-test-for-dead-pixels-before-returning-a-monitor.html': 'guide/pt/how-to-test-for-dead-pixels-before-returning-a-monitor.jsp', '/guides/es/how-to-test-for-dead-pixels-before-returning-a-monitor.html': 'guide/es/how-to-test-for-dead-pixels-before-returning-a-monitor.jsp', '/guides/vi/how-to-test-for-dead-pixels-before-returning-a-monitor.html': 'guide/vi/how-to-test-for-dead-pixels-before-returning-a-monitor.jsp', '/guides/id/how-to-test-for-dead-pixels-before-returning-a-monitor.html': 'guide/id/how-to-test-for-dead-pixels-before-returning-a-monitor.jsp', '/guides/de/how-to-test-for-dead-pixels-before-returning-a-monitor.html': 'guide/de/how-to-test-for-dead-pixels-before-returning-a-monitor.jsp',
  '/guides/pt/image-to-base64-embed-in-html-vs-link.html': 'guide/pt/image-to-base64-embed-in-html-vs-link.jsp', '/guides/es/image-to-base64-embed-in-html-vs-link.html': 'guide/es/image-to-base64-embed-in-html-vs-link.jsp', '/guides/vi/image-to-base64-embed-in-html-vs-link.html': 'guide/vi/image-to-base64-embed-in-html-vs-link.jsp', '/guides/id/image-to-base64-embed-in-html-vs-link.html': 'guide/id/image-to-base64-embed-in-html-vs-link.jsp', '/guides/de/image-to-base64-embed-in-html-vs-link.html': 'guide/de/image-to-base64-embed-in-html-vs-link.jsp',
  // plan-warm-pascal-v3 S2 batch 31 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/mp4-vs-mov-vs-mkv-which-container-when.html': 'guide/pt/mp4-vs-mov-vs-mkv-which-container-when.jsp', '/guides/es/mp4-vs-mov-vs-mkv-which-container-when.html': 'guide/es/mp4-vs-mov-vs-mkv-which-container-when.jsp', '/guides/vi/mp4-vs-mov-vs-mkv-which-container-when.html': 'guide/vi/mp4-vs-mov-vs-mkv-which-container-when.jsp', '/guides/id/mp4-vs-mov-vs-mkv-which-container-when.html': 'guide/id/mp4-vs-mov-vs-mkv-which-container-when.jsp', '/guides/de/mp4-vs-mov-vs-mkv-which-container-when.html': 'guide/de/mp4-vs-mov-vs-mkv-which-container-when.jsp',
  '/guides/pt/pdf-password-types-owner-vs-user.html': 'guide/pt/pdf-password-types-owner-vs-user.jsp', '/guides/es/pdf-password-types-owner-vs-user.html': 'guide/es/pdf-password-types-owner-vs-user.jsp', '/guides/vi/pdf-password-types-owner-vs-user.html': 'guide/vi/pdf-password-types-owner-vs-user.jsp', '/guides/id/pdf-password-types-owner-vs-user.html': 'guide/id/pdf-password-types-owner-vs-user.jsp', '/guides/de/pdf-password-types-owner-vs-user.html': 'guide/de/pdf-password-types-owner-vs-user.jsp',
  '/guides/pt/png-to-svg-when-to-vectorize-a-raster-image.html': 'guide/pt/png-to-svg-when-to-vectorize-a-raster-image.jsp', '/guides/es/png-to-svg-when-to-vectorize-a-raster-image.html': 'guide/es/png-to-svg-when-to-vectorize-a-raster-image.jsp', '/guides/vi/png-to-svg-when-to-vectorize-a-raster-image.html': 'guide/vi/png-to-svg-when-to-vectorize-a-raster-image.jsp', '/guides/id/png-to-svg-when-to-vectorize-a-raster-image.html': 'guide/id/png-to-svg-when-to-vectorize-a-raster-image.jsp', '/guides/de/png-to-svg-when-to-vectorize-a-raster-image.html': 'guide/de/png-to-svg-when-to-vectorize-a-raster-image.jsp',
  // plan-warm-pascal-v3 S2 batch 32 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/microphone-test-online-what-it-actually-checks.html': 'guide/pt/microphone-test-online-what-it-actually-checks.jsp', '/guides/es/microphone-test-online-what-it-actually-checks.html': 'guide/es/microphone-test-online-what-it-actually-checks.jsp', '/guides/vi/microphone-test-online-what-it-actually-checks.html': 'guide/vi/microphone-test-online-what-it-actually-checks.jsp', '/guides/id/microphone-test-online-what-it-actually-checks.html': 'guide/id/microphone-test-online-what-it-actually-checks.jsp', '/guides/de/microphone-test-online-what-it-actually-checks.html': 'guide/de/microphone-test-online-what-it-actually-checks.jsp',
  '/guides/pt/unix-timestamps-explained.html': 'guide/pt/unix-timestamps-explained.jsp', '/guides/es/unix-timestamps-explained.html': 'guide/es/unix-timestamps-explained.jsp', '/guides/vi/unix-timestamps-explained.html': 'guide/vi/unix-timestamps-explained.jsp', '/guides/id/unix-timestamps-explained.html': 'guide/id/unix-timestamps-explained.jsp', '/guides/de/unix-timestamps-explained.html': 'guide/de/unix-timestamps-explained.jsp',
  '/guides/pt/why-heic-wont-open-on-windows-three-fixes.html': 'guide/pt/why-heic-wont-open-on-windows-three-fixes.jsp', '/guides/es/why-heic-wont-open-on-windows-three-fixes.html': 'guide/es/why-heic-wont-open-on-windows-three-fixes.jsp', '/guides/vi/why-heic-wont-open-on-windows-three-fixes.html': 'guide/vi/why-heic-wont-open-on-windows-three-fixes.jsp', '/guides/id/why-heic-wont-open-on-windows-three-fixes.html': 'guide/id/why-heic-wont-open-on-windows-three-fixes.jsp', '/guides/de/why-heic-wont-open-on-windows-three-fixes.html': 'guide/de/why-heic-wont-open-on-windows-three-fixes.jsp',
  // plan-warm-pascal-v3 S2 batch 33 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/imagemagick-online-vs-task-specific-tools-which-to-pick.html': 'guide/pt/imagemagick-online-vs-task-specific-tools-which-to-pick.jsp', '/guides/es/imagemagick-online-vs-task-specific-tools-which-to-pick.html': 'guide/es/imagemagick-online-vs-task-specific-tools-which-to-pick.jsp', '/guides/vi/imagemagick-online-vs-task-specific-tools-which-to-pick.html': 'guide/vi/imagemagick-online-vs-task-specific-tools-which-to-pick.jsp', '/guides/id/imagemagick-online-vs-task-specific-tools-which-to-pick.html': 'guide/id/imagemagick-online-vs-task-specific-tools-which-to-pick.jsp', '/guides/de/imagemagick-online-vs-task-specific-tools-which-to-pick.html': 'guide/de/imagemagick-online-vs-task-specific-tools-which-to-pick.jsp',
  '/guides/pt/json-parser-validate-vs-format-vs-tree-view.html': 'guide/pt/json-parser-validate-vs-format-vs-tree-view.jsp', '/guides/es/json-parser-validate-vs-format-vs-tree-view.html': 'guide/es/json-parser-validate-vs-format-vs-tree-view.jsp', '/guides/vi/json-parser-validate-vs-format-vs-tree-view.html': 'guide/vi/json-parser-validate-vs-format-vs-tree-view.jsp', '/guides/id/json-parser-validate-vs-format-vs-tree-view.html': 'guide/id/json-parser-validate-vs-format-vs-tree-view.jsp', '/guides/de/json-parser-validate-vs-format-vs-tree-view.html': 'guide/de/json-parser-validate-vs-format-vs-tree-view.jsp',
  '/guides/pt/pdf-editing-ladder.html': 'guide/pt/pdf-editing-ladder.jsp', '/guides/es/pdf-editing-ladder.html': 'guide/es/pdf-editing-ladder.jsp', '/guides/vi/pdf-editing-ladder.html': 'guide/vi/pdf-editing-ladder.jsp', '/guides/id/pdf-editing-ladder.html': 'guide/id/pdf-editing-ladder.jsp', '/guides/de/pdf-editing-ladder.html': 'guide/de/pdf-editing-ladder.jsp',
  // plan-warm-pascal-v3 S2 batch 34 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/keyboard-tester-online-rollover-vs-anti-ghosting.html': 'guide/pt/keyboard-tester-online-rollover-vs-anti-ghosting.jsp', '/guides/es/keyboard-tester-online-rollover-vs-anti-ghosting.html': 'guide/es/keyboard-tester-online-rollover-vs-anti-ghosting.jsp', '/guides/vi/keyboard-tester-online-rollover-vs-anti-ghosting.html': 'guide/vi/keyboard-tester-online-rollover-vs-anti-ghosting.jsp', '/guides/id/keyboard-tester-online-rollover-vs-anti-ghosting.html': 'guide/id/keyboard-tester-online-rollover-vs-anti-ghosting.jsp', '/guides/de/keyboard-tester-online-rollover-vs-anti-ghosting.html': 'guide/de/keyboard-tester-online-rollover-vs-anti-ghosting.jsp',
  '/guides/pt/mp4-vs-webm-for-web.html': 'guide/pt/mp4-vs-webm-for-web.jsp', '/guides/es/mp4-vs-webm-for-web.html': 'guide/es/mp4-vs-webm-for-web.jsp', '/guides/vi/mp4-vs-webm-for-web.html': 'guide/vi/mp4-vs-webm-for-web.jsp', '/guides/id/mp4-vs-webm-for-web.html': 'guide/id/mp4-vs-webm-for-web.jsp', '/guides/de/mp4-vs-webm-for-web.html': 'guide/de/mp4-vs-webm-for-web.jsp',
  '/guides/pt/png-vs-svg-when-to-use.html': 'guide/pt/png-vs-svg-when-to-use.jsp', '/guides/es/png-vs-svg-when-to-use.html': 'guide/es/png-vs-svg-when-to-use.jsp', '/guides/vi/png-vs-svg-when-to-use.html': 'guide/vi/png-vs-svg-when-to-use.jsp', '/guides/id/png-vs-svg-when-to-use.html': 'guide/id/png-vs-svg-when-to-use.jsp', '/guides/de/png-vs-svg-when-to-use.html': 'guide/de/png-vs-svg-when-to-use.jsp',
  // plan-warm-pascal-v3 S2 batch 35 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/json-vs-yaml-vs-toml-config-formats-explained.html': 'guide/pt/json-vs-yaml-vs-toml-config-formats-explained.jsp', '/guides/es/json-vs-yaml-vs-toml-config-formats-explained.html': 'guide/es/json-vs-yaml-vs-toml-config-formats-explained.jsp', '/guides/vi/json-vs-yaml-vs-toml-config-formats-explained.html': 'guide/vi/json-vs-yaml-vs-toml-config-formats-explained.jsp', '/guides/id/json-vs-yaml-vs-toml-config-formats-explained.html': 'guide/id/json-vs-yaml-vs-toml-config-formats-explained.jsp', '/guides/de/json-vs-yaml-vs-toml-config-formats-explained.html': 'guide/de/json-vs-yaml-vs-toml-config-formats-explained.jsp',
  '/guides/pt/pdf-preflight-online-what-it-actually-checks.html': 'guide/pt/pdf-preflight-online-what-it-actually-checks.jsp', '/guides/es/pdf-preflight-online-what-it-actually-checks.html': 'guide/es/pdf-preflight-online-what-it-actually-checks.jsp', '/guides/vi/pdf-preflight-online-what-it-actually-checks.html': 'guide/vi/pdf-preflight-online-what-it-actually-checks.jsp', '/guides/id/pdf-preflight-online-what-it-actually-checks.html': 'guide/id/pdf-preflight-online-what-it-actually-checks.jsp', '/guides/de/pdf-preflight-online-what-it-actually-checks.html': 'guide/de/pdf-preflight-online-what-it-actually-checks.jsp',
  '/guides/pt/recover-corrupt-zip-file-options.html': 'guide/pt/recover-corrupt-zip-file-options.jsp', '/guides/es/recover-corrupt-zip-file-options.html': 'guide/es/recover-corrupt-zip-file-options.jsp', '/guides/vi/recover-corrupt-zip-file-options.html': 'guide/vi/recover-corrupt-zip-file-options.jsp', '/guides/id/recover-corrupt-zip-file-options.html': 'guide/id/recover-corrupt-zip-file-options.jsp', '/guides/de/recover-corrupt-zip-file-options.html': 'guide/de/recover-corrupt-zip-file-options.jsp',
  // plan-warm-pascal-v3 S2 batch 36 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/how-to-extract-frames-from-a-gif-for-a-social-post.html': 'guide/pt/how-to-extract-frames-from-a-gif-for-a-social-post.jsp', '/guides/es/how-to-extract-frames-from-a-gif-for-a-social-post.html': 'guide/es/how-to-extract-frames-from-a-gif-for-a-social-post.jsp', '/guides/vi/how-to-extract-frames-from-a-gif-for-a-social-post.html': 'guide/vi/how-to-extract-frames-from-a-gif-for-a-social-post.jsp', '/guides/id/how-to-extract-frames-from-a-gif-for-a-social-post.html': 'guide/id/how-to-extract-frames-from-a-gif-for-a-social-post.jsp', '/guides/de/how-to-extract-frames-from-a-gif-for-a-social-post.html': 'guide/de/how-to-extract-frames-from-a-gif-for-a-social-post.jsp',
  '/guides/pt/keyboard-test-keys-not-detected-four-fixes.html': 'guide/pt/keyboard-test-keys-not-detected-four-fixes.jsp', '/guides/es/keyboard-test-keys-not-detected-four-fixes.html': 'guide/es/keyboard-test-keys-not-detected-four-fixes.jsp', '/guides/vi/keyboard-test-keys-not-detected-four-fixes.html': 'guide/vi/keyboard-test-keys-not-detected-four-fixes.jsp', '/guides/id/keyboard-test-keys-not-detected-four-fixes.html': 'guide/id/keyboard-test-keys-not-detected-four-fixes.jsp', '/guides/de/keyboard-test-keys-not-detected-four-fixes.html': 'guide/de/keyboard-test-keys-not-detected-four-fixes.jsp',
  '/guides/pt/pdf-vs-heic-for-document-archival.html': 'guide/pt/pdf-vs-heic-for-document-archival.jsp', '/guides/es/pdf-vs-heic-for-document-archival.html': 'guide/es/pdf-vs-heic-for-document-archival.jsp', '/guides/vi/pdf-vs-heic-for-document-archival.html': 'guide/vi/pdf-vs-heic-for-document-archival.jsp', '/guides/id/pdf-vs-heic-for-document-archival.html': 'guide/id/pdf-vs-heic-for-document-archival.jsp', '/guides/de/pdf-vs-heic-for-document-archival.html': 'guide/de/pdf-vs-heic-for-document-archival.jsp',
  // plan-warm-pascal-v3 S2 batch 37 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/microphone-test-no-sound-four-fixes.html': 'guide/pt/microphone-test-no-sound-four-fixes.jsp', '/guides/es/microphone-test-no-sound-four-fixes.html': 'guide/es/microphone-test-no-sound-four-fixes.jsp', '/guides/vi/microphone-test-no-sound-four-fixes.html': 'guide/vi/microphone-test-no-sound-four-fixes.jsp', '/guides/id/microphone-test-no-sound-four-fixes.html': 'guide/id/microphone-test-no-sound-four-fixes.jsp', '/guides/de/microphone-test-no-sound-four-fixes.html': 'guide/de/microphone-test-no-sound-four-fixes.jsp',
  '/guides/pt/why-md5-cannot-be-decrypted.html': 'guide/pt/why-md5-cannot-be-decrypted.jsp', '/guides/es/why-md5-cannot-be-decrypted.html': 'guide/es/why-md5-cannot-be-decrypted.jsp', '/guides/vi/why-md5-cannot-be-decrypted.html': 'guide/vi/why-md5-cannot-be-decrypted.jsp', '/guides/id/why-md5-cannot-be-decrypted.html': 'guide/id/why-md5-cannot-be-decrypted.jsp', '/guides/de/why-md5-cannot-be-decrypted.html': 'guide/de/why-md5-cannot-be-decrypted.jsp',
  '/guides/pt/how-to-convert-100-heic-photos-to-jpg.html': 'guide/pt/how-to-convert-100-heic-photos-to-jpg.jsp', '/guides/es/how-to-convert-100-heic-photos-to-jpg.html': 'guide/es/how-to-convert-100-heic-photos-to-jpg.jsp', '/guides/vi/how-to-convert-100-heic-photos-to-jpg.html': 'guide/vi/how-to-convert-100-heic-photos-to-jpg.jsp', '/guides/id/how-to-convert-100-heic-photos-to-jpg.html': 'guide/id/how-to-convert-100-heic-photos-to-jpg.jsp', '/guides/de/how-to-convert-100-heic-photos-to-jpg.html': 'guide/de/how-to-convert-100-heic-photos-to-jpg.jsp',
  // plan-warm-pascal-v3 S2 batch 38 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/zip-password-types-strong-vs-weak-explained.html': 'guide/pt/zip-password-types-strong-vs-weak-explained.jsp', '/guides/es/zip-password-types-strong-vs-weak-explained.html': 'guide/es/zip-password-types-strong-vs-weak-explained.jsp', '/guides/vi/zip-password-types-strong-vs-weak-explained.html': 'guide/vi/zip-password-types-strong-vs-weak-explained.jsp', '/guides/id/zip-password-types-strong-vs-weak-explained.html': 'guide/id/zip-password-types-strong-vs-weak-explained.jsp', '/guides/de/zip-password-types-strong-vs-weak-explained.html': 'guide/de/zip-password-types-strong-vs-weak-explained.jsp',
  '/guides/pt/md5-vs-sha256-when-to-hash.html': 'guide/pt/md5-vs-sha256-when-to-hash.jsp', '/guides/es/md5-vs-sha256-when-to-hash.html': 'guide/es/md5-vs-sha256-when-to-hash.jsp', '/guides/vi/md5-vs-sha256-when-to-hash.html': 'guide/vi/md5-vs-sha256-when-to-hash.jsp', '/guides/id/md5-vs-sha256-when-to-hash.html': 'guide/id/md5-vs-sha256-when-to-hash.jsp', '/guides/de/md5-vs-sha256-when-to-hash.html': 'guide/de/md5-vs-sha256-when-to-hash.jsp',
  '/guides/pt/how-to-convert-iphone-photo-to-jpg.html': 'guide/pt/how-to-convert-iphone-photo-to-jpg.jsp', '/guides/es/how-to-convert-iphone-photo-to-jpg.html': 'guide/es/how-to-convert-iphone-photo-to-jpg.jsp', '/guides/vi/how-to-convert-iphone-photo-to-jpg.html': 'guide/vi/how-to-convert-iphone-photo-to-jpg.jsp', '/guides/id/how-to-convert-iphone-photo-to-jpg.html': 'guide/id/how-to-convert-iphone-photo-to-jpg.jsp', '/guides/de/how-to-convert-iphone-photo-to-jpg.html': 'guide/de/how-to-convert-iphone-photo-to-jpg.jsp',
  // plan-warm-pascal-v3 S2 batch 39 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/microphone-test-permission-blocked-how-to-allow-it.html': 'guide/pt/microphone-test-permission-blocked-how-to-allow-it.jsp', '/guides/es/microphone-test-permission-blocked-how-to-allow-it.html': 'guide/es/microphone-test-permission-blocked-how-to-allow-it.jsp', '/guides/vi/microphone-test-permission-blocked-how-to-allow-it.html': 'guide/vi/microphone-test-permission-blocked-how-to-allow-it.jsp', '/guides/id/microphone-test-permission-blocked-how-to-allow-it.html': 'guide/id/microphone-test-permission-blocked-how-to-allow-it.jsp', '/guides/de/microphone-test-permission-blocked-how-to-allow-it.html': 'guide/de/microphone-test-permission-blocked-how-to-allow-it.jsp',
  '/guides/pt/qr-code-error-correction-and-scan-failures.html': 'guide/pt/qr-code-error-correction-and-scan-failures.jsp', '/guides/es/qr-code-error-correction-and-scan-failures.html': 'guide/es/qr-code-error-correction-and-scan-failures.jsp', '/guides/vi/qr-code-error-correction-and-scan-failures.html': 'guide/vi/qr-code-error-correction-and-scan-failures.jsp', '/guides/id/qr-code-error-correction-and-scan-failures.html': 'guide/id/qr-code-error-correction-and-scan-failures.jsp', '/guides/de/qr-code-error-correction-and-scan-failures.html': 'guide/de/qr-code-error-correction-and-scan-failures.jsp',
  '/guides/pt/how-to-split-a-gif-into-frames-for-editing.html': 'guide/pt/how-to-split-a-gif-into-frames-for-editing.jsp', '/guides/es/how-to-split-a-gif-into-frames-for-editing.html': 'guide/es/how-to-split-a-gif-into-frames-for-editing.jsp', '/guides/vi/how-to-split-a-gif-into-frames-for-editing.html': 'guide/vi/how-to-split-a-gif-into-frames-for-editing.jsp', '/guides/id/how-to-split-a-gif-into-frames-for-editing.html': 'guide/id/how-to-split-a-gif-into-frames-for-editing.jsp', '/guides/de/how-to-split-a-gif-into-frames-for-editing.html': 'guide/de/how-to-split-a-gif-into-frames-for-editing.jsp',
  // plan-warm-pascal-v3 S2 batch 40 (2026-05-30) - 5 locale variants × 3 guides
  '/guides/pt/microphone-test-online-quiet-normal-peak-meter.html': 'guide/pt/microphone-test-online-quiet-normal-peak-meter.jsp', '/guides/es/microphone-test-online-quiet-normal-peak-meter.html': 'guide/es/microphone-test-online-quiet-normal-peak-meter.jsp', '/guides/vi/microphone-test-online-quiet-normal-peak-meter.html': 'guide/vi/microphone-test-online-quiet-normal-peak-meter.jsp', '/guides/id/microphone-test-online-quiet-normal-peak-meter.html': 'guide/id/microphone-test-online-quiet-normal-peak-meter.jsp', '/guides/de/microphone-test-online-quiet-normal-peak-meter.html': 'guide/de/microphone-test-online-quiet-normal-peak-meter.jsp',
  '/guides/pt/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html': 'guide/pt/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.jsp', '/guides/es/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html': 'guide/es/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.jsp', '/guides/vi/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html': 'guide/vi/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.jsp', '/guides/id/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html': 'guide/id/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.jsp', '/guides/de/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html': 'guide/de/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.jsp',
  '/guides/pt/photo-editor-vs-graphics-app-vs-batch-processor.html': 'guide/pt/photo-editor-vs-graphics-app-vs-batch-processor.jsp', '/guides/es/photo-editor-vs-graphics-app-vs-batch-processor.html': 'guide/es/photo-editor-vs-graphics-app-vs-batch-processor.jsp', '/guides/vi/photo-editor-vs-graphics-app-vs-batch-processor.html': 'guide/vi/photo-editor-vs-graphics-app-vs-batch-processor.jsp', '/guides/id/photo-editor-vs-graphics-app-vs-batch-processor.html': 'guide/id/photo-editor-vs-graphics-app-vs-batch-processor.jsp', '/guides/de/photo-editor-vs-graphics-app-vs-batch-processor.html': 'guide/de/photo-editor-vs-graphics-app-vs-batch-processor.jsp',
  // plan-warm-pascal-v3 S2 batch 41 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-password-recovery-online.html': 'guide/pt/zip-password-recovery-online.jsp', '/guides/es/zip-password-recovery-online.html': 'guide/es/zip-password-recovery-online.jsp', '/guides/vi/zip-password-recovery-online.html': 'guide/vi/zip-password-recovery-online.jsp', '/guides/id/zip-password-recovery-online.html': 'guide/id/zip-password-recovery-online.jsp', '/guides/de/zip-password-recovery-online.html': 'guide/de/zip-password-recovery-online.jsp',
  '/guides/pt/qr-code-generator-best-practices.html': 'guide/pt/qr-code-generator-best-practices.jsp', '/guides/es/qr-code-generator-best-practices.html': 'guide/es/qr-code-generator-best-practices.jsp', '/guides/vi/qr-code-generator-best-practices.html': 'guide/vi/qr-code-generator-best-practices.jsp', '/guides/id/qr-code-generator-best-practices.html': 'guide/id/qr-code-generator-best-practices.jsp', '/guides/de/qr-code-generator-best-practices.html': 'guide/de/qr-code-generator-best-practices.jsp',
  '/guides/pt/when-to-compress-vs-convert-an-image.html': 'guide/pt/when-to-compress-vs-convert-an-image.jsp', '/guides/es/when-to-compress-vs-convert-an-image.html': 'guide/es/when-to-compress-vs-convert-an-image.jsp', '/guides/vi/when-to-compress-vs-convert-an-image.html': 'guide/vi/when-to-compress-vs-convert-an-image.jsp', '/guides/id/when-to-compress-vs-convert-an-image.html': 'guide/id/when-to-compress-vs-convert-an-image.jsp', '/guides/de/when-to-compress-vs-convert-an-image.html': 'guide/de/when-to-compress-vs-convert-an-image.jsp',
  // plan-warm-pascal-v3 S2 batch 42 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/how-to-zip-folder-online-step-by-step.html': 'guide/pt/how-to-zip-folder-online-step-by-step.jsp', '/guides/es/how-to-zip-folder-online-step-by-step.html': 'guide/es/how-to-zip-folder-online-step-by-step.jsp', '/guides/vi/how-to-zip-folder-online-step-by-step.html': 'guide/vi/how-to-zip-folder-online-step-by-step.jsp', '/guides/id/how-to-zip-folder-online-step-by-step.html': 'guide/id/how-to-zip-folder-online-step-by-step.jsp', '/guides/de/how-to-zip-folder-online-step-by-step.html': 'guide/de/how-to-zip-folder-online-step-by-step.jsp',
  '/guides/pt/oled-test-vs-lcd-test-what-changes-on-oled.html': 'guide/pt/oled-test-vs-lcd-test-what-changes-on-oled.jsp', '/guides/es/oled-test-vs-lcd-test-what-changes-on-oled.html': 'guide/es/oled-test-vs-lcd-test-what-changes-on-oled.jsp', '/guides/vi/oled-test-vs-lcd-test-what-changes-on-oled.html': 'guide/vi/oled-test-vs-lcd-test-what-changes-on-oled.jsp', '/guides/id/oled-test-vs-lcd-test-what-changes-on-oled.html': 'guide/id/oled-test-vs-lcd-test-what-changes-on-oled.jsp', '/guides/de/oled-test-vs-lcd-test-what-changes-on-oled.html': 'guide/de/oled-test-vs-lcd-test-what-changes-on-oled.jsp',
  '/guides/pt/milliseconds-to-date-utc-vs-local-time.html': 'guide/pt/milliseconds-to-date-utc-vs-local-time.jsp', '/guides/es/milliseconds-to-date-utc-vs-local-time.html': 'guide/es/milliseconds-to-date-utc-vs-local-time.jsp', '/guides/vi/milliseconds-to-date-utc-vs-local-time.html': 'guide/vi/milliseconds-to-date-utc-vs-local-time.jsp', '/guides/id/milliseconds-to-date-utc-vs-local-time.html': 'guide/id/milliseconds-to-date-utc-vs-local-time.jsp', '/guides/de/milliseconds-to-date-utc-vs-local-time.html': 'guide/de/milliseconds-to-date-utc-vs-local-time.jsp',
  // plan-warm-pascal-v3 S2 batch 43 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/how-to-reduce-zip-file-size.html': 'guide/pt/how-to-reduce-zip-file-size.jsp', '/guides/es/how-to-reduce-zip-file-size.html': 'guide/es/how-to-reduce-zip-file-size.jsp', '/guides/vi/how-to-reduce-zip-file-size.html': 'guide/vi/how-to-reduce-zip-file-size.jsp', '/guides/id/how-to-reduce-zip-file-size.html': 'guide/id/how-to-reduce-zip-file-size.jsp', '/guides/de/how-to-reduce-zip-file-size.html': 'guide/de/how-to-reduce-zip-file-size.jsp',
  '/guides/pt/screen-test-online-vs-app-which-is-more-accurate.html': 'guide/pt/screen-test-online-vs-app-which-is-more-accurate.jsp', '/guides/es/screen-test-online-vs-app-which-is-more-accurate.html': 'guide/es/screen-test-online-vs-app-which-is-more-accurate.jsp', '/guides/vi/screen-test-online-vs-app-which-is-more-accurate.html': 'guide/vi/screen-test-online-vs-app-which-is-more-accurate.jsp', '/guides/id/screen-test-online-vs-app-which-is-more-accurate.html': 'guide/id/screen-test-online-vs-app-which-is-more-accurate.jsp', '/guides/de/screen-test-online-vs-app-which-is-more-accurate.html': 'guide/de/screen-test-online-vs-app-which-is-more-accurate.jsp',
  '/guides/pt/image-compression-and-exif-metadata-what-gets-stripped.html': 'guide/pt/image-compression-and-exif-metadata-what-gets-stripped.jsp', '/guides/es/image-compression-and-exif-metadata-what-gets-stripped.html': 'guide/es/image-compression-and-exif-metadata-what-gets-stripped.jsp', '/guides/vi/image-compression-and-exif-metadata-what-gets-stripped.html': 'guide/vi/image-compression-and-exif-metadata-what-gets-stripped.jsp', '/guides/id/image-compression-and-exif-metadata-what-gets-stripped.html': 'guide/id/image-compression-and-exif-metadata-what-gets-stripped.jsp', '/guides/de/image-compression-and-exif-metadata-what-gets-stripped.html': 'guide/de/image-compression-and-exif-metadata-what-gets-stripped.jsp',
  // plan-warm-pascal-v3 S2 batch 44 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/how-to-reduce-zip-file-size-online.html': 'guide/pt/how-to-reduce-zip-file-size-online.jsp', '/guides/es/how-to-reduce-zip-file-size-online.html': 'guide/es/how-to-reduce-zip-file-size-online.jsp', '/guides/vi/how-to-reduce-zip-file-size-online.html': 'guide/vi/how-to-reduce-zip-file-size-online.jsp', '/guides/id/how-to-reduce-zip-file-size-online.html': 'guide/id/how-to-reduce-zip-file-size-online.jsp', '/guides/de/how-to-reduce-zip-file-size-online.html': 'guide/de/how-to-reduce-zip-file-size-online.jsp',
  '/guides/pt/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html': 'guide/pt/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.jsp', '/guides/es/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html': 'guide/es/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.jsp', '/guides/vi/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html': 'guide/vi/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.jsp', '/guides/id/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html': 'guide/id/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.jsp', '/guides/de/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html': 'guide/de/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.jsp',
  '/guides/pt/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html': 'guide/pt/qr-code-content-types-url-vcard-wifi-text-which-to-pick.jsp', '/guides/es/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html': 'guide/es/qr-code-content-types-url-vcard-wifi-text-which-to-pick.jsp', '/guides/vi/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html': 'guide/vi/qr-code-content-types-url-vcard-wifi-text-which-to-pick.jsp', '/guides/id/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html': 'guide/id/qr-code-content-types-url-vcard-wifi-text-which-to-pick.jsp', '/guides/de/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html': 'guide/de/qr-code-content-types-url-vcard-wifi-text-which-to-pick.jsp',
  // plan-warm-pascal-v3 S2 batch 45 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/how-to-make-a-zip-file-smaller.html': 'guide/pt/how-to-make-a-zip-file-smaller.jsp', '/guides/es/how-to-make-a-zip-file-smaller.html': 'guide/es/how-to-make-a-zip-file-smaller.jsp', '/guides/vi/how-to-make-a-zip-file-smaller.html': 'guide/vi/how-to-make-a-zip-file-smaller.jsp', '/guides/id/how-to-make-a-zip-file-smaller.html': 'guide/id/how-to-make-a-zip-file-smaller.jsp', '/guides/de/how-to-make-a-zip-file-smaller.html': 'guide/de/how-to-make-a-zip-file-smaller.jsp',
  '/guides/pt/long-number-millisecond-or-second.html': 'guide/pt/long-number-millisecond-or-second.jsp', '/guides/es/long-number-millisecond-or-second.html': 'guide/es/long-number-millisecond-or-second.jsp', '/guides/vi/long-number-millisecond-or-second.html': 'guide/vi/long-number-millisecond-or-second.jsp', '/guides/id/long-number-millisecond-or-second.html': 'guide/id/long-number-millisecond-or-second.jsp', '/guides/de/long-number-millisecond-or-second.html': 'guide/de/long-number-millisecond-or-second.jsp',
  '/guides/pt/lcd-test-what-it-checks.html': 'guide/pt/lcd-test-what-it-checks.jsp', '/guides/es/lcd-test-what-it-checks.html': 'guide/es/lcd-test-what-it-checks.jsp', '/guides/vi/lcd-test-what-it-checks.html': 'guide/vi/lcd-test-what-it-checks.jsp', '/guides/id/lcd-test-what-it-checks.html': 'guide/id/lcd-test-what-it-checks.jsp', '/guides/de/lcd-test-what-it-checks.html': 'guide/de/lcd-test-what-it-checks.jsp',
  // plan-warm-pascal-v3 S2 batch 46 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-file-converter-what-it-actually-does.html': 'guide/pt/zip-file-converter-what-it-actually-does.jsp', '/guides/es/zip-file-converter-what-it-actually-does.html': 'guide/es/zip-file-converter-what-it-actually-does.jsp', '/guides/vi/zip-file-converter-what-it-actually-does.html': 'guide/vi/zip-file-converter-what-it-actually-does.jsp', '/guides/id/zip-file-converter-what-it-actually-does.html': 'guide/id/zip-file-converter-what-it-actually-does.jsp', '/guides/de/zip-file-converter-what-it-actually-does.html': 'guide/de/zip-file-converter-what-it-actually-does.jsp',
  '/guides/pt/md5-to-text-why-you-cannot-convert-back.html': 'guide/pt/md5-to-text-why-you-cannot-convert-back.jsp', '/guides/es/md5-to-text-why-you-cannot-convert-back.html': 'guide/es/md5-to-text-why-you-cannot-convert-back.jsp', '/guides/vi/md5-to-text-why-you-cannot-convert-back.html': 'guide/vi/md5-to-text-why-you-cannot-convert-back.jsp', '/guides/id/md5-to-text-why-you-cannot-convert-back.html': 'guide/id/md5-to-text-why-you-cannot-convert-back.jsp', '/guides/de/md5-to-text-why-you-cannot-convert-back.html': 'guide/de/md5-to-text-why-you-cannot-convert-back.jsp',
  '/guides/pt/lcd-test-vs-display-test-which-do-you-need.html': 'guide/pt/lcd-test-vs-display-test-which-do-you-need.jsp', '/guides/es/lcd-test-vs-display-test-which-do-you-need.html': 'guide/es/lcd-test-vs-display-test-which-do-you-need.jsp', '/guides/vi/lcd-test-vs-display-test-which-do-you-need.html': 'guide/vi/lcd-test-vs-display-test-which-do-you-need.jsp', '/guides/id/lcd-test-vs-display-test-which-do-you-need.html': 'guide/id/lcd-test-vs-display-test-which-do-you-need.jsp', '/guides/de/lcd-test-vs-display-test-which-do-you-need.html': 'guide/de/lcd-test-vs-display-test-which-do-you-need.jsp',
  // plan-warm-pascal-v3 S2 batch 47 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/what-is-a-file-compressor-and-which-to-use.html': 'guide/pt/what-is-a-file-compressor-and-which-to-use.jsp', '/guides/es/what-is-a-file-compressor-and-which-to-use.html': 'guide/es/what-is-a-file-compressor-and-which-to-use.jsp', '/guides/vi/what-is-a-file-compressor-and-which-to-use.html': 'guide/vi/what-is-a-file-compressor-and-which-to-use.jsp', '/guides/id/what-is-a-file-compressor-and-which-to-use.html': 'guide/id/what-is-a-file-compressor-and-which-to-use.jsp', '/guides/de/what-is-a-file-compressor-and-which-to-use.html': 'guide/de/what-is-a-file-compressor-and-which-to-use.jsp',
  '/guides/pt/read-and-compare-md5-hashes-correctly.html': 'guide/pt/read-and-compare-md5-hashes-correctly.jsp', '/guides/es/read-and-compare-md5-hashes-correctly.html': 'guide/es/read-and-compare-md5-hashes-correctly.jsp', '/guides/vi/read-and-compare-md5-hashes-correctly.html': 'guide/vi/read-and-compare-md5-hashes-correctly.jsp', '/guides/id/read-and-compare-md5-hashes-correctly.html': 'guide/id/read-and-compare-md5-hashes-correctly.jsp', '/guides/de/read-and-compare-md5-hashes-correctly.html': 'guide/de/read-and-compare-md5-hashes-correctly.jsp',
  '/guides/pt/what-an-lcd-test-does-and-when-to-run-one.html': 'guide/pt/what-an-lcd-test-does-and-when-to-run-one.jsp', '/guides/es/what-an-lcd-test-does-and-when-to-run-one.html': 'guide/es/what-an-lcd-test-does-and-when-to-run-one.jsp', '/guides/vi/what-an-lcd-test-does-and-when-to-run-one.html': 'guide/vi/what-an-lcd-test-does-and-when-to-run-one.jsp', '/guides/id/what-an-lcd-test-does-and-when-to-run-one.html': 'guide/id/what-an-lcd-test-does-and-when-to-run-one.jsp', '/guides/de/what-an-lcd-test-does-and-when-to-run-one.html': 'guide/de/what-an-lcd-test-does-and-when-to-run-one.jsp',
  // plan-warm-pascal-v3 S2 batch 48 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html': 'guide/pt/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.jsp', '/guides/es/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html': 'guide/es/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.jsp', '/guides/vi/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html': 'guide/vi/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.jsp', '/guides/id/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html': 'guide/id/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.jsp', '/guides/de/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html': 'guide/de/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.jsp',
  '/guides/pt/unminify-js.html': 'guide/pt/unminify-js.jsp', '/guides/es/unminify-js.html': 'guide/es/unminify-js.jsp', '/guides/vi/unminify-js.html': 'guide/vi/unminify-js.jsp', '/guides/id/unminify-js.html': 'guide/id/unminify-js.jsp', '/guides/de/unminify-js.html': 'guide/de/unminify-js.jsp',
  '/guides/pt/screen-test-for-laptop-5-minute-checklist.html': 'guide/pt/screen-test-for-laptop-5-minute-checklist.jsp', '/guides/es/screen-test-for-laptop-5-minute-checklist.html': 'guide/es/screen-test-for-laptop-5-minute-checklist.jsp', '/guides/vi/screen-test-for-laptop-5-minute-checklist.html': 'guide/vi/screen-test-for-laptop-5-minute-checklist.jsp', '/guides/id/screen-test-for-laptop-5-minute-checklist.html': 'guide/id/screen-test-for-laptop-5-minute-checklist.jsp', '/guides/de/screen-test-for-laptop-5-minute-checklist.html': 'guide/de/screen-test-for-laptop-5-minute-checklist.jsp',
  // plan-warm-pascal-v3 S2 batch 49 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/file-compressor-online-when-to-zip-vs-when-to-compress-image.html': 'guide/pt/file-compressor-online-when-to-zip-vs-when-to-compress-image.jsp', '/guides/es/file-compressor-online-when-to-zip-vs-when-to-compress-image.html': 'guide/es/file-compressor-online-when-to-zip-vs-when-to-compress-image.jsp', '/guides/vi/file-compressor-online-when-to-zip-vs-when-to-compress-image.html': 'guide/vi/file-compressor-online-when-to-zip-vs-when-to-compress-image.jsp', '/guides/id/file-compressor-online-when-to-zip-vs-when-to-compress-image.html': 'guide/id/file-compressor-online-when-to-zip-vs-when-to-compress-image.jsp', '/guides/de/file-compressor-online-when-to-zip-vs-when-to-compress-image.html': 'guide/de/file-compressor-online-when-to-zip-vs-when-to-compress-image.jsp',
  '/guides/pt/md5-decode.html': 'guide/pt/md5-decode.jsp', '/guides/es/md5-decode.html': 'guide/es/md5-decode.jsp', '/guides/vi/md5-decode.html': 'guide/vi/md5-decode.jsp', '/guides/id/md5-decode.html': 'guide/id/md5-decode.jsp', '/guides/de/md5-decode.html': 'guide/de/md5-decode.jsp',
  '/guides/pt/millisecond-to-date.html': 'guide/pt/millisecond-to-date.jsp', '/guides/es/millisecond-to-date.html': 'guide/es/millisecond-to-date.jsp', '/guides/vi/millisecond-to-date.html': 'guide/vi/millisecond-to-date.jsp', '/guides/id/millisecond-to-date.html': 'guide/id/millisecond-to-date.jsp', '/guides/de/millisecond-to-date.html': 'guide/de/millisecond-to-date.jsp',
  // plan-warm-pascal-v3 S2 batch 50 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-password-unlocker.html': 'guide/pt/zip-password-unlocker.jsp', '/guides/es/zip-password-unlocker.html': 'guide/es/zip-password-unlocker.jsp', '/guides/vi/zip-password-unlocker.html': 'guide/vi/zip-password-unlocker.jsp', '/guides/id/zip-password-unlocker.html': 'guide/id/zip-password-unlocker.jsp', '/guides/de/zip-password-unlocker.html': 'guide/de/zip-password-unlocker.jsp',
  '/guides/pt/md5-password.html': 'guide/pt/md5-password.jsp', '/guides/es/md5-password.html': 'guide/es/md5-password.jsp', '/guides/vi/md5-password.html': 'guide/vi/md5-password.jsp', '/guides/id/md5-password.html': 'guide/id/md5-password.jsp', '/guides/de/md5-password.html': 'guide/de/md5-password.jsp',
  '/guides/pt/screen-test-vs-camera-test-pick-the-right-tool.html': 'guide/pt/screen-test-vs-camera-test-pick-the-right-tool.jsp', '/guides/es/screen-test-vs-camera-test-pick-the-right-tool.html': 'guide/es/screen-test-vs-camera-test-pick-the-right-tool.jsp', '/guides/vi/screen-test-vs-camera-test-pick-the-right-tool.html': 'guide/vi/screen-test-vs-camera-test-pick-the-right-tool.jsp', '/guides/id/screen-test-vs-camera-test-pick-the-right-tool.html': 'guide/id/screen-test-vs-camera-test-pick-the-right-tool.jsp', '/guides/de/screen-test-vs-camera-test-pick-the-right-tool.html': 'guide/de/screen-test-vs-camera-test-pick-the-right-tool.jsp',
  // plan-warm-pascal-v3 S2 batch 51 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-file-size-compressor.html': 'guide/pt/zip-file-size-compressor.jsp', '/guides/es/zip-file-size-compressor.html': 'guide/es/zip-file-size-compressor.jsp', '/guides/vi/zip-file-size-compressor.html': 'guide/vi/zip-file-size-compressor.jsp', '/guides/id/zip-file-size-compressor.html': 'guide/id/zip-file-size-compressor.jsp', '/guides/de/zip-file-size-compressor.html': 'guide/de/zip-file-size-compressor.jsp',
  '/guides/pt/md5-hash-decrypt.html': 'guide/pt/md5-hash-decrypt.jsp', '/guides/es/md5-hash-decrypt.html': 'guide/es/md5-hash-decrypt.jsp', '/guides/vi/md5-hash-decrypt.html': 'guide/vi/md5-hash-decrypt.jsp', '/guides/id/md5-hash-decrypt.html': 'guide/id/md5-hash-decrypt.jsp', '/guides/de/md5-hash-decrypt.html': 'guide/de/md5-hash-decrypt.jsp',
  '/guides/pt/led-test-vs-lcd-test-which-applies-to-your-screen.html': 'guide/pt/led-test-vs-lcd-test-which-applies-to-your-screen.jsp', '/guides/es/led-test-vs-lcd-test-which-applies-to-your-screen.html': 'guide/es/led-test-vs-lcd-test-which-applies-to-your-screen.jsp', '/guides/vi/led-test-vs-lcd-test-which-applies-to-your-screen.html': 'guide/vi/led-test-vs-lcd-test-which-applies-to-your-screen.jsp', '/guides/id/led-test-vs-lcd-test-which-applies-to-your-screen.html': 'guide/id/led-test-vs-lcd-test-which-applies-to-your-screen.jsp', '/guides/de/led-test-vs-lcd-test-which-applies-to-your-screen.html': 'guide/de/led-test-vs-lcd-test-which-applies-to-your-screen.jsp',
  // plan-warm-pascal-v3 S2 batch 52 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/resize-zip-file.html': 'guide/pt/resize-zip-file.jsp', '/guides/es/resize-zip-file.html': 'guide/es/resize-zip-file.jsp', '/guides/vi/resize-zip-file.html': 'guide/vi/resize-zip-file.jsp', '/guides/id/resize-zip-file.html': 'guide/id/resize-zip-file.jsp', '/guides/de/resize-zip-file.html': 'guide/de/resize-zip-file.jsp',
  '/guides/pt/md5-decrypt-online.html': 'guide/pt/md5-decrypt-online.jsp', '/guides/es/md5-decrypt-online.html': 'guide/es/md5-decrypt-online.jsp', '/guides/vi/md5-decrypt-online.html': 'guide/vi/md5-decrypt-online.jsp', '/guides/id/md5-decrypt-online.html': 'guide/id/md5-decrypt-online.jsp', '/guides/de/md5-decrypt-online.html': 'guide/de/md5-decrypt-online.jsp',
  '/guides/pt/ms-to-date.html': 'guide/pt/ms-to-date.jsp', '/guides/es/ms-to-date.html': 'guide/es/ms-to-date.jsp', '/guides/vi/ms-to-date.html': 'guide/vi/ms-to-date.jsp', '/guides/id/ms-to-date.html': 'guide/id/ms-to-date.jsp', '/guides/de/ms-to-date.html': 'guide/de/ms-to-date.jsp',
  // plan-warm-pascal-v3 S2 batch 53 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/zip-compressor.html': 'guide/pt/zip-compressor.jsp', '/guides/es/zip-compressor.html': 'guide/es/zip-compressor.jsp', '/guides/vi/zip-compressor.html': 'guide/vi/zip-compressor.jsp', '/guides/id/zip-compressor.html': 'guide/id/zip-compressor.jsp', '/guides/de/zip-compressor.html': 'guide/de/zip-compressor.jsp',
  '/guides/pt/lcd-checker.html': 'guide/pt/lcd-checker.jsp', '/guides/es/lcd-checker.html': 'guide/es/lcd-checker.jsp', '/guides/vi/lcd-checker.html': 'guide/vi/lcd-checker.jsp', '/guides/id/lcd-checker.html': 'guide/id/lcd-checker.jsp', '/guides/de/lcd-checker.html': 'guide/de/lcd-checker.jsp',
  '/guides/pt/online-zip-file.html': 'guide/pt/online-zip-file.jsp', '/guides/es/online-zip-file.html': 'guide/es/online-zip-file.jsp', '/guides/vi/online-zip-file.html': 'guide/vi/online-zip-file.jsp', '/guides/id/online-zip-file.html': 'guide/id/online-zip-file.jsp', '/guides/de/online-zip-file.html': 'guide/de/online-zip-file.jsp',
  // plan-warm-pascal-v3 S2 batch 54 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/test-lcd.html': 'guide/pt/test-lcd.jsp', '/guides/es/test-lcd.html': 'guide/es/test-lcd.jsp', '/guides/vi/test-lcd.html': 'guide/vi/test-lcd.jsp', '/guides/id/test-lcd.html': 'guide/id/test-lcd.jsp', '/guides/de/test-lcd.html': 'guide/de/test-lcd.jsp',
  '/guides/pt/i-love-zip.html': 'guide/pt/i-love-zip.jsp', '/guides/es/i-love-zip.html': 'guide/es/i-love-zip.jsp', '/guides/vi/i-love-zip.html': 'guide/vi/i-love-zip.jsp', '/guides/id/i-love-zip.html': 'guide/id/i-love-zip.jsp', '/guides/de/i-love-zip.html': 'guide/de/i-love-zip.jsp',
  '/guides/pt/zip-compressor-online.html': 'guide/pt/zip-compressor-online.jsp', '/guides/es/zip-compressor-online.html': 'guide/es/zip-compressor-online.jsp', '/guides/vi/zip-compressor-online.html': 'guide/vi/zip-compressor-online.jsp', '/guides/id/zip-compressor-online.html': 'guide/id/zip-compressor-online.jsp', '/guides/de/zip-compressor-online.html': 'guide/de/zip-compressor-online.jsp',
  // plan-warm-pascal-v3 S2 batch 55 (2026-05-31) - 5 locale variants × 3 guides
  '/guides/pt/screen-display-test-synonyms.html': 'guide/pt/screen-display-test-synonyms.jsp', '/guides/es/screen-display-test-synonyms.html': 'guide/es/screen-display-test-synonyms.jsp', '/guides/vi/screen-display-test-synonyms.html': 'guide/vi/screen-display-test-synonyms.jsp', '/guides/id/screen-display-test-synonyms.html': 'guide/id/screen-display-test-synonyms.jsp', '/guides/de/screen-display-test-synonyms.html': 'guide/de/screen-display-test-synonyms.jsp',
  '/guides/pt/kompres-file-zip.html': 'guide/pt/kompres-file-zip.jsp', '/guides/es/kompres-file-zip.html': 'guide/es/kompres-file-zip.jsp', '/guides/vi/kompres-file-zip.html': 'guide/vi/kompres-file-zip.jsp', '/guides/id/kompres-file-zip.html': 'guide/id/kompres-file-zip.jsp', '/guides/de/kompres-file-zip.html': 'guide/de/kompres-file-zip.jsp',
  '/guides/pt/zip-unlocker-online.html': 'guide/pt/zip-unlocker-online.jsp', '/guides/es/zip-unlocker-online.html': 'guide/es/zip-unlocker-online.jsp', '/guides/vi/zip-unlocker-online.html': 'guide/vi/zip-unlocker-online.jsp', '/guides/id/zip-unlocker-online.html': 'guide/id/zip-unlocker-online.jsp', '/guides/de/zip-unlocker-online.html': 'guide/de/zip-unlocker-online.jsp',
  // plan-warm-pascal-v3 S2 batch 56 (2026-05-31) - 5 locale variants × 2 guides (FINAL substantive batch)
  '/guides/pt/kompres-zip.html': 'guide/pt/kompres-zip.jsp', '/guides/es/kompres-zip.html': 'guide/es/kompres-zip.jsp', '/guides/vi/kompres-zip.html': 'guide/vi/kompres-zip.jsp', '/guides/id/kompres-zip.html': 'guide/id/kompres-zip.jsp', '/guides/de/kompres-zip.html': 'guide/de/kompres-zip.jsp',
  '/guides/pt/zip-file-compressor-online.html': 'guide/pt/zip-file-compressor-online.jsp', '/guides/es/zip-file-compressor-online.html': 'guide/es/zip-file-compressor-online.jsp', '/guides/vi/zip-file-compressor-online.html': 'guide/vi/zip-file-compressor-online.jsp', '/guides/id/zip-file-compressor-online.html': 'guide/id/zip-file-compressor-online.jsp', '/guides/de/zip-file-compressor-online.html': 'guide/de/zip-file-compressor-online.jsp',
  // plan-warm-pascal-v3 S2 batch 57 (2026-05-31) - 5 locale variants × 2 guides (NEW make-zip-file-online + split-gif-into-frames; ledger expanded 166 -> 168 targeted)
  '/guides/pt/make-zip-file-online.html': 'guide/pt/make-zip-file-online.jsp', '/guides/es/make-zip-file-online.html': 'guide/es/make-zip-file-online.jsp', '/guides/vi/make-zip-file-online.html': 'guide/vi/make-zip-file-online.jsp', '/guides/id/make-zip-file-online.html': 'guide/id/make-zip-file-online.jsp', '/guides/de/make-zip-file-online.html': 'guide/de/make-zip-file-online.jsp',
  '/guides/pt/split-gif-into-frames.html': 'guide/pt/split-gif-into-frames.jsp', '/guides/es/split-gif-into-frames.html': 'guide/es/split-gif-into-frames.jsp', '/guides/vi/split-gif-into-frames.html': 'guide/vi/split-gif-into-frames.jsp', '/guides/id/split-gif-into-frames.html': 'guide/id/split-gif-into-frames.jsp', '/guides/de/split-gif-into-frames.html': 'guide/de/split-gif-into-frames.jsp',
  // plan-warm-pascal-v3 S2 batch 58 (2026-06-01) - 5 locale variants × 1 guide (tes-lcd; CLOSURE batch reaching 100% route-level coverage)
  '/guides/pt/tes-lcd.html': 'guide/pt/tes-lcd.jsp', '/guides/es/tes-lcd.html': 'guide/es/tes-lcd.jsp', '/guides/vi/tes-lcd.html': 'guide/vi/tes-lcd.jsp', '/guides/id/tes-lcd.html': 'guide/id/tes-lcd.jsp', '/guides/de/tes-lcd.html': 'guide/de/tes-lcd.jsp',
  // plan-warm-pascal-v3 S2 batch 59 (2026-06-05) - 5 locale variants x 2 NEW guides (file-to-zip, online-diff-tool)
  '/guides/pt/file-to-zip.html': 'guide/pt/file-to-zip.jsp', '/guides/es/file-to-zip.html': 'guide/es/file-to-zip.jsp', '/guides/vi/file-to-zip.html': 'guide/vi/file-to-zip.jsp', '/guides/id/file-to-zip.html': 'guide/id/file-to-zip.jsp', '/guides/de/file-to-zip.html': 'guide/de/file-to-zip.jsp',
  '/guides/pt/online-diff-tool.html': 'guide/pt/online-diff-tool.jsp', '/guides/es/online-diff-tool.html': 'guide/es/online-diff-tool.jsp', '/guides/vi/online-diff-tool.html': 'guide/vi/online-diff-tool.jsp', '/guides/id/online-diff-tool.html': 'guide/id/online-diff-tool.jsp', '/guides/de/online-diff-tool.html': 'guide/de/online-diff-tool.jsp',
  // plan-warm-pascal-v3 S2 batch 60 (2026-06-05) - tool-free x 5 locales
  '/guides/pt/tool-free.html': 'guide/pt/tool-free.jsp', '/guides/es/tool-free.html': 'guide/es/tool-free.jsp', '/guides/vi/tool-free.html': 'guide/vi/tool-free.jsp', '/guides/id/tool-free.html': 'guide/id/tool-free.jsp', '/guides/de/tool-free.html': 'guide/de/tool-free.jsp',
  // cycle 20260609-2 Phase 3 — md5-decrypter new guide (EN + 5 locale variants)
  '/guides/en/md5-decrypter.html': 'guide/en/md5-decrypter.jsp',
  '/guides/pt/md5-decrypter.html': 'guide/pt/md5-decrypter.jsp', '/guides/es/md5-decrypter.html': 'guide/es/md5-decrypter.jsp', '/guides/vi/md5-decrypter.html': 'guide/vi/md5-decrypter.jsp', '/guides/id/md5-decrypter.html': 'guide/id/md5-decrypter.jsp', '/guides/de/md5-decrypter.html': 'guide/de/md5-decrypter.jsp',
  '/developer-tools/regex-tester.html': 'utility/regex-tester.jsp',
  // cycle 20260610-15 Phase 3 — front-camera-test new guide (EN + 5 locale variants); implementing tool /camera-test.html (cluster device-test)
  '/guides/front-camera-test.html': 'guides/front-camera-test.jsp',
  '/guides/pt/front-camera-test.html': 'guides/pt/front-camera-test.jsp', '/guides/es/front-camera-test.html': 'guides/es/front-camera-test.jsp', '/guides/vi/front-camera-test.html': 'guides/vi/front-camera-test.jsp', '/guides/id/front-camera-test.html': 'guides/id/front-camera-test.jsp', '/guides/de/front-camera-test.html': 'guides/de/front-camera-test.jsp',
  // cycle 20260610-16 Phase 3 — compress-pdf-online-free new guide (EN + 5 locale variants); implementing tools /flatten-pdf.html + /pdf-to-images.html + /compress-image.html + /images-to-pdf.html + /preflight-pdf.html (cluster pdf)
  '/guides/compress-pdf-online-free.html': 'guides/compress-pdf-online-free.jsp',
  '/guides/pt/compress-pdf-online-free.html': 'guides/pt/compress-pdf-online-free.jsp', '/guides/es/compress-pdf-online-free.html': 'guides/es/compress-pdf-online-free.jsp', '/guides/vi/compress-pdf-online-free.html': 'guides/vi/compress-pdf-online-free.jsp', '/guides/id/compress-pdf-online-free.html': 'guides/id/compress-pdf-online-free.jsp', '/guides/de/compress-pdf-online-free.html': 'guides/de/compress-pdf-online-free.jsp',
  // cycle 20260614-21 Phase 3 — split-pdf-online-free new guide (EN bare canonical; locale variants drain later per EN-first); implementing tools /pdf-tools/split-pdf-by-range.html + /pdf-tools/split-pdf-to-each-pages.html (cluster pdf)
  '/guides/split-pdf-online-free.html': 'guides/split-pdf-online-free.jsp',
  // cycle 20260615 Phase 3 - split-pdf-online-free PT locale variant (EN-first locale drain; es/vi/id/de remain)
  '/guides/pt/split-pdf-online-free.html': 'guides/pt/split-pdf-online-free.jsp',
  // cycle 20260615-2 Phase 3 - split-pdf-online-free ES locale variant (EN-first locale drain; vi/id/de remain)
  '/guides/es/split-pdf-online-free.html': 'guides/es/split-pdf-online-free.jsp',
  // cycle 20260615-3 Phase 3 - split-pdf-online-free VI locale variant (EN-first locale drain; id/de remain)
  '/guides/vi/split-pdf-online-free.html': 'guides/vi/split-pdf-online-free.jsp',
  // cycle 20260615-4 Phase 3 - split-pdf-online-free ID locale variant (EN-first locale drain; de remains)
  '/guides/id/split-pdf-online-free.html': 'guides/id/split-pdf-online-free.jsp',
  // cycle 20260615-5 Phase 3 - split-pdf-online-free DE locale variant (EN-first locale drain COMPLETE; en+pt+es+vi+id+de all present)
  '/guides/de/split-pdf-online-free.html': 'guides/de/split-pdf-online-free.jsp',
  '/utility-tools/todo-list.html': 'utility/todo-list.jsp',
  '/guides/how-to-make-a-to-do-list-online.html': 'guide/how-to-make-a-to-do-list-online.jsp',
  '/guides/pt/how-to-make-a-to-do-list-online.html': 'guide/pt/how-to-make-a-to-do-list-online.jsp',
  '/guides/es/how-to-make-a-to-do-list-online.html': 'guide/es/how-to-make-a-to-do-list-online.jsp',
  '/guides/vi/how-to-make-a-to-do-list-online.html': 'guide/vi/how-to-make-a-to-do-list-online.jsp',
  '/guides/id/how-to-make-a-to-do-list-online.html': 'guide/id/how-to-make-a-to-do-list-online.jsp',
  '/guides/de/how-to-make-a-to-do-list-online.html': 'guide/de/how-to-make-a-to-do-list-online.jsp',
  '/utility-tools/unit-converter.html': 'utility/unit-converter.jsp',
  '/utility-tools/private-ai-chat.html': 'utility/private-ai-chat.jsp',
  '/guides/how-to-convert-units-online.html': 'guide/how-to-convert-units-online.jsp',
  '/guides/pt/how-to-convert-units-online.html': 'guide/pt/how-to-convert-units-online.jsp',
  '/guides/es/how-to-convert-units-online.html': 'guide/es/how-to-convert-units-online.jsp',
  '/guides/vi/how-to-convert-units-online.html': 'guide/vi/how-to-convert-units-online.jsp',
  '/guides/id/how-to-convert-units-online.html': 'guide/id/how-to-convert-units-online.jsp',
  '/guides/de/how-to-convert-units-online.html': 'guide/de/how-to-convert-units-online.jsp',
  '/developer-tools/color-picker.html': 'utility/color-picker.jsp',
  '/guides/how-to-pick-a-color-online.html': 'guide/how-to-pick-a-color-online.jsp',
  '/guides/pt/how-to-pick-a-color-online.html': 'guide/pt/how-to-pick-a-color-online.jsp',
  '/guides/es/how-to-pick-a-color-online.html': 'guide/es/how-to-pick-a-color-online.jsp',
  '/guides/vi/how-to-pick-a-color-online.html': 'guide/vi/how-to-pick-a-color-online.jsp',
  '/guides/id/how-to-pick-a-color-online.html': 'guide/id/how-to-pick-a-color-online.jsp',
  '/guides/de/how-to-pick-a-color-online.html': 'guide/de/how-to-pick-a-color-online.jsp',
  '/developer-tools/data-visualizer.html': 'utility/data-visualizer.jsp',
  '/guides/how-to-visualize-data-online.html': 'guide/how-to-visualize-data-online.jsp',
  '/guides/pt/how-to-visualize-data-online.html': 'guide/pt/how-to-visualize-data-online.jsp',
  '/guides/es/how-to-visualize-data-online.html': 'guide/es/how-to-visualize-data-online.jsp',
  '/guides/vi/how-to-visualize-data-online.html': 'guide/vi/how-to-visualize-data-online.jsp',
  '/guides/id/how-to-visualize-data-online.html': 'guide/id/how-to-visualize-data-online.jsp',
  '/guides/de/how-to-visualize-data-online.html': 'guide/de/how-to-visualize-data-online.jsp',
  '/device-test-tools/screen-recorder.html': 'convert/screen-recorder.jsp',
  '/guides/how-to-record-your-screen-online.html': 'guide/how-to-record-your-screen-online.jsp',
  '/guides/pt/how-to-record-your-screen-online.html': 'guide/pt/how-to-record-your-screen-online.jsp',
  '/guides/es/how-to-record-your-screen-online.html': 'guide/es/how-to-record-your-screen-online.jsp',
  '/guides/vi/how-to-record-your-screen-online.html': 'guide/vi/how-to-record-your-screen-online.jsp',
  '/guides/id/how-to-record-your-screen-online.html': 'guide/id/how-to-record-your-screen-online.jsp',
  '/guides/de/how-to-record-your-screen-online.html': 'guide/de/how-to-record-your-screen-online.jsp',
  '/utility-tools/font-generator.html': 'utility/font-generator.jsp',
  '/guides/how-to-turn-text-into-an-image-online.html': 'guide/how-to-turn-text-into-an-image-online.jsp',
  '/guides/pt/how-to-turn-text-into-an-image-online.html': 'guide/pt/how-to-turn-text-into-an-image-online.jsp',
  '/guides/es/how-to-turn-text-into-an-image-online.html': 'guide/es/how-to-turn-text-into-an-image-online.jsp',
  '/guides/vi/how-to-turn-text-into-an-image-online.html': 'guide/vi/how-to-turn-text-into-an-image-online.jsp',
  '/guides/id/how-to-turn-text-into-an-image-online.html': 'guide/id/how-to-turn-text-into-an-image-online.jsp',
  '/guides/de/how-to-turn-text-into-an-image-online.html': 'guide/de/how-to-turn-text-into-an-image-online.jsp',
  '/developer-tools/code-editor.html': 'utility/code-editor.jsp',
  '/image-tools/steganography.html': 'convert/steganography.jsp',
  '/guides/how-to-hide-a-message-in-an-image.html': 'guide/how-to-hide-a-message-in-an-image.jsp',
  '/guides/pt/how-to-hide-a-message-in-an-image.html': 'guide/pt/how-to-hide-a-message-in-an-image.jsp',
  '/guides/es/how-to-hide-a-message-in-an-image.html': 'guide/es/how-to-hide-a-message-in-an-image.jsp',
  '/guides/vi/how-to-hide-a-message-in-an-image.html': 'guide/vi/how-to-hide-a-message-in-an-image.jsp',
  '/guides/id/how-to-hide-a-message-in-an-image.html': 'guide/id/how-to-hide-a-message-in-an-image.jsp',
  '/guides/de/how-to-hide-a-message-in-an-image.html': 'guide/de/how-to-hide-a-message-in-an-image.jsp',
  '/guides/how-to-edit-code-online.html': 'guide/how-to-edit-code-online.jsp',
  '/guides/pt/how-to-edit-code-online.html': 'guide/pt/how-to-edit-code-online.jsp',
  '/guides/es/how-to-edit-code-online.html': 'guide/es/how-to-edit-code-online.jsp',
  '/guides/vi/how-to-edit-code-online.html': 'guide/vi/how-to-edit-code-online.jsp',
  '/guides/id/how-to-edit-code-online.html': 'guide/id/how-to-edit-code-online.jsp',
  '/guides/de/how-to-edit-code-online.html': 'guide/de/how-to-edit-code-online.jsp',
  '/guides/how-to-run-a-private-ai-chat-in-your-browser.html': 'guide/how-to-run-a-private-ai-chat-in-your-browser.jsp',
  '/guides/pt/how-to-run-a-private-ai-chat-in-your-browser.html': 'guide/pt/how-to-run-a-private-ai-chat-in-your-browser.jsp',
  '/guides/es/how-to-run-a-private-ai-chat-in-your-browser.html': 'guide/es/how-to-run-a-private-ai-chat-in-your-browser.jsp',
  '/guides/vi/how-to-run-a-private-ai-chat-in-your-browser.html': 'guide/vi/how-to-run-a-private-ai-chat-in-your-browser.jsp',
  '/guides/id/how-to-run-a-private-ai-chat-in-your-browser.html': 'guide/id/how-to-run-a-private-ai-chat-in-your-browser.jsp',
  '/guides/de/how-to-run-a-private-ai-chat-in-your-browser.html': 'guide/de/how-to-run-a-private-ai-chat-in-your-browser.jsp',
  '/guides/mengecilkan-ukuran-zip.html': 'guide/mengecilkan-ukuran-zip.jsp',
  '/guides/pt/mengecilkan-ukuran-zip.html': 'guide/pt/mengecilkan-ukuran-zip.jsp',
  '/guides/es/mengecilkan-ukuran-zip.html': 'guide/es/mengecilkan-ukuran-zip.jsp',
  '/guides/vi/mengecilkan-ukuran-zip.html': 'guide/vi/mengecilkan-ukuran-zip.jsp',
  '/guides/id/mengecilkan-ukuran-zip.html': 'guide/id/mengecilkan-ukuran-zip.jsp',
  // cycle 20260624-4 - mengecilkan-ukuran-zip DE locale variant (EN-first locale drain; locale-complete)
  '/guides/de/mengecilkan-ukuran-zip.html': 'guide/de/mengecilkan-ukuran-zip.jsp',
  '/guides/video-converter-online-free.html': 'guide/video-converter-online-free.jsp',
  // cycle 20260625-6 create_new_guide_page (locale completion) - pt variant (staging-only until es/vi/id/de complete).
  '/guides/pt/video-converter-online-free.html': 'guide/pt/video-converter-online-free.jsp',
  // cycle 20260626 create_new_guide_page (locale completion) - es variant (staging-only until vi/id/de complete).
  '/guides/es/video-converter-online-free.html': 'guide/es/video-converter-online-free.jsp',
  // cycle 20260626-2 create_new_guide_page (locale completion) - vi variant (staging-only until id/de complete).
  '/guides/vi/video-converter-online-free.html': 'guide/vi/video-converter-online-free.jsp',
  // 2026-06-28 related-guides-loop: id/de locale completion.
  '/guides/id/video-converter-online-free.html': 'guide/id/video-converter-online-free.jsp',
  '/guides/de/video-converter-online-free.html': 'guide/de/video-converter-online-free.jsp',
  '/guides/merge-pdf-online-free-unlimited.html': 'guide/merge-pdf-online-free-unlimited.jsp',
  // cycle 20260629-6 create_new_guide_page (locale completion) - pt variant of merge-pdf-online-free-unlimited (staging-only until es/vi/id/de complete).
  '/guides/pt/merge-pdf-online-free-unlimited.html': 'guide/pt/merge-pdf-online-free-unlimited.jsp',
  // cycle 20260630-2 create_new_guide_page (locale completion) - es variant of merge-pdf-online-free-unlimited (staging-only until vi/id/de complete).
  '/guides/es/merge-pdf-online-free-unlimited.html': 'guide/es/merge-pdf-online-free-unlimited.jsp',
  // cycle 20260630-4 create_new_guide_page (locale completion) - vi variant of merge-pdf-online-free-unlimited (staging-only until id/de complete).
  '/guides/vi/merge-pdf-online-free-unlimited.html': 'guide/vi/merge-pdf-online-free-unlimited.jsp',
  // cycle 20260630-5 create_new_guide_page (locale completion) - id variant of merge-pdf-online-free-unlimited (staging-only until de complete).
  '/guides/id/merge-pdf-online-free-unlimited.html': 'guide/id/merge-pdf-online-free-unlimited.jsp',
  // cycle 20260630-6 create_new_guide_page (locale completion) - de variant of merge-pdf-online-free-unlimited (locale-complete after this).
  '/guides/de/merge-pdf-online-free-unlimited.html': 'guide/de/merge-pdf-online-free-unlimited.jsp',
  '/guides/crop-image-online-free.html': 'guide/crop-image-online-free.jsp',
  '/guides/compress-image-online-to-50kb.html': 'guide/compress-image-online-to-50kb.jsp',
  // cycle20260701 create_new_guide_page (locale completion) - pt variant (staging-only until es/vi/id/de complete).
  '/guides/pt/compress-image-online-to-50kb.html': 'guide/pt/compress-image-online-to-50kb.jsp',
  // cycle20260701-2 create_new_guide_page (locale completion) - es variant (staging-only until vi/id/de complete).
  '/guides/es/compress-image-online-to-50kb.html': 'guide/es/compress-image-online-to-50kb.jsp',
  // cycle20260701-3 create_new_guide_page (locale completion) - vi/id/de variants (bundle locale-complete).
  '/guides/vi/compress-image-online-to-50kb.html': 'guide/vi/compress-image-online-to-50kb.jsp',
  '/guides/id/compress-image-online-to-50kb.html': 'guide/id/compress-image-online-to-50kb.jsp',
  '/guides/de/compress-image-online-to-50kb.html': 'guide/de/compress-image-online-to-50kb.jsp',
  '/guides/cek-layar-laptop.html': 'guide/cek-layar-laptop.jsp',
  // cycle 20260702 create_new_guide_page (locale completion) - pt variant of cek-layar-laptop (staging-only until es/vi/id/de complete).
  '/guides/pt/cek-layar-laptop.html': 'guide/pt/cek-layar-laptop.jsp',
  '/guides/es/cek-layar-laptop.html': 'guide/es/cek-layar-laptop.jsp',
  '/guides/vi/cek-layar-laptop.html': 'guide/vi/cek-layar-laptop.jsp',
  '/guides/id/cek-layar-laptop.html': 'guide/id/cek-layar-laptop.jsp',
  '/guides/de/cek-layar-laptop.html': 'guide/de/cek-layar-laptop.jsp',
  // cycle 20260702 create_new_guide_page - photo-editor-online-pixlr (EN + pt/es/vi/id/de; locale-complete).
  '/guides/photo-editor-online-pixlr.html': 'guide/photo-editor-online-pixlr.jsp',
  '/guides/pt/photo-editor-online-pixlr.html': 'guide/pt/photo-editor-online-pixlr.jsp',
  '/guides/es/photo-editor-online-pixlr.html': 'guide/es/photo-editor-online-pixlr.jsp',
  '/guides/vi/photo-editor-online-pixlr.html': 'guide/vi/photo-editor-online-pixlr.jsp',
  '/guides/id/photo-editor-online-pixlr.html': 'guide/id/photo-editor-online-pixlr.jsp',
  '/guides/de/photo-editor-online-pixlr.html': 'guide/de/photo-editor-online-pixlr.jsp',
  '/guides/mp4-to-gif-online-free.html': 'guide/mp4-to-gif-online-free.jsp',
  // geo-sitewide-audit-runbook: ship-pending reconciliation - completes the locale bundle for mp4-to-gif-online-free.
  '/guides/pt/mp4-to-gif-online-free.html': 'guide/pt/mp4-to-gif-online-free.jsp',
  '/guides/es/mp4-to-gif-online-free.html': 'guide/es/mp4-to-gif-online-free.jsp',
  '/guides/vi/mp4-to-gif-online-free.html': 'guide/vi/mp4-to-gif-online-free.jsp',
  '/guides/id/mp4-to-gif-online-free.html': 'guide/id/mp4-to-gif-online-free.jsp',
  '/guides/de/mp4-to-gif-online-free.html': 'guide/de/mp4-to-gif-online-free.jsp',
  '/pdf-tools/pdf-filler-form-editor.html': 'pdf/pdf-filler-form-editor.jsp',
  '/guides/pdf-filler-form-editor-step-by-step.html': 'guide/pdf-filler-form-editor-step-by-step.jsp',
  '/guides/pt/pdf-filler-form-editor-step-by-step.html': 'guide/pt/pdf-filler-form-editor-step-by-step.jsp',
  '/guides/es/pdf-filler-form-editor-step-by-step.html': 'guide/es/pdf-filler-form-editor-step-by-step.jsp',
  '/guides/vi/pdf-filler-form-editor-step-by-step.html': 'guide/vi/pdf-filler-form-editor-step-by-step.jsp',
  '/guides/id/pdf-filler-form-editor-step-by-step.html': 'guide/id/pdf-filler-form-editor-step-by-step.jsp',
  '/guides/de/pdf-filler-form-editor-step-by-step.html': 'guide/de/pdf-filler-form-editor-step-by-step.jsp',
  '/image-converter-tools/audio-converter.html': 'convert/audio-converter.jsp',
  '/developer-tools/code-formatter-beautifier.html': 'utility/code-formatter-beautifier.jsp',
  '/guides/code-formatter-beautifier-step-by-step.html': 'guide/code-formatter-beautifier-step-by-step.jsp',
  '/guides/pt/code-formatter-beautifier-step-by-step.html': 'guide/pt/code-formatter-beautifier-step-by-step.jsp',
  '/guides/es/code-formatter-beautifier-step-by-step.html': 'guide/es/code-formatter-beautifier-step-by-step.jsp',
  '/guides/vi/code-formatter-beautifier-step-by-step.html': 'guide/vi/code-formatter-beautifier-step-by-step.jsp',
  '/guides/id/code-formatter-beautifier-step-by-step.html': 'guide/id/code-formatter-beautifier-step-by-step.jsp',
  '/guides/de/code-formatter-beautifier-step-by-step.html': 'guide/de/code-formatter-beautifier-step-by-step.jsp',
  '/utility-tools/analog-clock.html': 'utility/analog-clock.jsp',
  '/guides/analog-clock-step-by-step.html': 'guide/analog-clock-step-by-step.jsp',
  '/guides/pt/analog-clock-step-by-step.html': 'guide/pt/analog-clock-step-by-step.jsp',
  '/guides/es/analog-clock-step-by-step.html': 'guide/es/analog-clock-step-by-step.jsp',
  '/guides/vi/analog-clock-step-by-step.html': 'guide/vi/analog-clock-step-by-step.jsp',
  '/guides/id/analog-clock-step-by-step.html': 'guide/id/analog-clock-step-by-step.jsp',
  '/guides/de/analog-clock-step-by-step.html': 'guide/de/analog-clock-step-by-step.jsp',
  '/utility-tools/digital-clock.html': 'utility/digital-clock.jsp',
  '/guides/digital-clock-step-by-step.html': 'guide/digital-clock-step-by-step.jsp',
  '/guides/pt/digital-clock-step-by-step.html': 'guide/pt/digital-clock-step-by-step.jsp',
  '/guides/es/digital-clock-step-by-step.html': 'guide/es/digital-clock-step-by-step.jsp',
  '/guides/vi/digital-clock-step-by-step.html': 'guide/vi/digital-clock-step-by-step.jsp',
  '/guides/id/digital-clock-step-by-step.html': 'guide/id/digital-clock-step-by-step.jsp',
  '/guides/de/digital-clock-step-by-step.html': 'guide/de/digital-clock-step-by-step.jsp',
  '/utility-tools/countdown-timer.html': 'utility/countdown-timer.jsp',
  '/guides/countdown-timer-step-by-step.html': 'guide/countdown-timer-step-by-step.jsp',
  '/guides/pt/countdown-timer-step-by-step.html': 'guide/pt/countdown-timer-step-by-step.jsp',
  '/guides/es/countdown-timer-step-by-step.html': 'guide/es/countdown-timer-step-by-step.jsp',
  '/guides/vi/countdown-timer-step-by-step.html': 'guide/vi/countdown-timer-step-by-step.jsp',
  '/guides/id/countdown-timer-step-by-step.html': 'guide/id/countdown-timer-step-by-step.jsp',
  '/guides/de/countdown-timer-step-by-step.html': 'guide/de/countdown-timer-step-by-step.jsp',
  '/utility-tools/stopwatch.html': 'utility/stopwatch.jsp',
  '/guides/stopwatch-step-by-step.html': 'guide/stopwatch-step-by-step.jsp',
  '/guides/pt/stopwatch-step-by-step.html': 'guide/pt/stopwatch-step-by-step.jsp',
  '/guides/es/stopwatch-step-by-step.html': 'guide/es/stopwatch-step-by-step.jsp',
  '/guides/vi/stopwatch-step-by-step.html': 'guide/vi/stopwatch-step-by-step.jsp',
  '/guides/id/stopwatch-step-by-step.html': 'guide/id/stopwatch-step-by-step.jsp',
  '/guides/de/stopwatch-step-by-step.html': 'guide/de/stopwatch-step-by-step.jsp',
  '/utility-tools/online-alarm-clock.html': 'utility/online-alarm-clock.jsp',
  '/guides/alarm-clock-step-by-step.html': 'guide/alarm-clock-step-by-step.jsp',
  '/guides/pt/alarm-clock-step-by-step.html': 'guide/pt/alarm-clock-step-by-step.jsp',
  '/guides/es/alarm-clock-step-by-step.html': 'guide/es/alarm-clock-step-by-step.jsp',
  '/guides/vi/alarm-clock-step-by-step.html': 'guide/vi/alarm-clock-step-by-step.jsp',
  '/guides/id/alarm-clock-step-by-step.html': 'guide/id/alarm-clock-step-by-step.jsp',
  '/guides/de/alarm-clock-step-by-step.html': 'guide/de/alarm-clock-step-by-step.jsp',
  '/utility-tools/wheel-spinner.html': 'utility/wheel-spinner.jsp',
  '/guides/wheel-spinner-wheel-names-step-by-step.html': 'guide/wheel-spinner-wheel-names-step-by-step.jsp',
  '/guides/pt/wheel-spinner-wheel-names-step-by-step.html': 'guide/pt/wheel-spinner-wheel-names-step-by-step.jsp',
  '/guides/es/wheel-spinner-wheel-names-step-by-step.html': 'guide/es/wheel-spinner-wheel-names-step-by-step.jsp',
  '/guides/vi/wheel-spinner-wheel-names-step-by-step.html': 'guide/vi/wheel-spinner-wheel-names-step-by-step.jsp',
  '/guides/id/wheel-spinner-wheel-names-step-by-step.html': 'guide/id/wheel-spinner-wheel-names-step-by-step.jsp',
  '/guides/de/wheel-spinner-wheel-names-step-by-step.html': 'guide/de/wheel-spinner-wheel-names-step-by-step.jsp',
  '/utility-tools/dice-roller.html': 'utility/dice-roller.jsp',
  '/guides/dice-roller-step-by-step.html': 'guide/dice-roller-step-by-step.jsp',
  '/guides/pt/dice-roller-step-by-step.html': 'guide/pt/dice-roller-step-by-step.jsp',
  '/guides/es/dice-roller-step-by-step.html': 'guide/es/dice-roller-step-by-step.jsp',
  '/guides/vi/dice-roller-step-by-step.html': 'guide/vi/dice-roller-step-by-step.jsp',
  '/guides/id/dice-roller-step-by-step.html': 'guide/id/dice-roller-step-by-step.jsp',
  '/guides/de/dice-roller-step-by-step.html': 'guide/de/dice-roller-step-by-step.jsp',
  '/utility-tools/coin-flip.html': 'utility/coin-flip.jsp',
  '/guides/coin-flip-step-by-step.html': 'guide/coin-flip-step-by-step.jsp',
  '/guides/pt/coin-flip-step-by-step.html': 'guide/pt/coin-flip-step-by-step.jsp',
  '/guides/es/coin-flip-step-by-step.html': 'guide/es/coin-flip-step-by-step.jsp',
  '/guides/vi/coin-flip-step-by-step.html': 'guide/vi/coin-flip-step-by-step.jsp',
  '/guides/id/coin-flip-step-by-step.html': 'guide/id/coin-flip-step-by-step.jsp',
  '/guides/de/coin-flip-step-by-step.html': 'guide/de/coin-flip-step-by-step.jsp',
  '/utility-tools/random-number-picker.html': 'utility/random-number-picker.jsp',
  '/guides/random-number-generator-step-by-step.html': 'guide/random-number-generator-step-by-step.jsp',
  '/guides/pt/random-number-generator-step-by-step.html': 'guide/pt/random-number-generator-step-by-step.jsp',
  '/guides/es/random-number-generator-step-by-step.html': 'guide/es/random-number-generator-step-by-step.jsp',
  '/guides/vi/random-number-generator-step-by-step.html': 'guide/vi/random-number-generator-step-by-step.jsp',
  '/guides/id/random-number-generator-step-by-step.html': 'guide/id/random-number-generator-step-by-step.jsp',
  '/guides/de/random-number-generator-step-by-step.html': 'guide/de/random-number-generator-step-by-step.jsp',
  '/utility-tools/name-shuffler.html': 'utility/name-shuffler.jsp',
  '/guides/random-list-shuffler-when.html': 'guide/random-list-shuffler-when.jsp',
  '/guides/pt/random-list-shuffler-when.html': 'guide/pt/random-list-shuffler-when.jsp',
  '/guides/es/random-list-shuffler-when.html': 'guide/es/random-list-shuffler-when.jsp',
  '/guides/vi/random-list-shuffler-when.html': 'guide/vi/random-list-shuffler-when.jsp',
  '/guides/id/random-list-shuffler-when.html': 'guide/id/random-list-shuffler-when.jsp',
  '/guides/de/random-list-shuffler-when.html': 'guide/de/random-list-shuffler-when.jsp',
  '/guides/random-list-shuffler-step-by-step.html': 'guide/random-list-shuffler-step-by-step.jsp',
  '/guides/pt/random-list-shuffler-step-by-step.html': 'guide/pt/random-list-shuffler-step-by-step.jsp',
  '/guides/es/random-list-shuffler-step-by-step.html': 'guide/es/random-list-shuffler-step-by-step.jsp',
  '/guides/vi/random-list-shuffler-step-by-step.html': 'guide/vi/random-list-shuffler-step-by-step.jsp',
  '/guides/id/random-list-shuffler-step-by-step.html': 'guide/id/random-list-shuffler-step-by-step.jsp',
  '/guides/de/random-list-shuffler-step-by-step.html': 'guide/de/random-list-shuffler-step-by-step.jsp',
  '/guides/random-list-shuffler-vs-alternatives.html': 'guide/random-list-shuffler-vs-alternatives.jsp',
  '/guides/pt/random-list-shuffler-vs-alternatives.html': 'guide/pt/random-list-shuffler-vs-alternatives.jsp',
  '/guides/es/random-list-shuffler-vs-alternatives.html': 'guide/es/random-list-shuffler-vs-alternatives.jsp',
  '/guides/vi/random-list-shuffler-vs-alternatives.html': 'guide/vi/random-list-shuffler-vs-alternatives.jsp',
  '/guides/id/random-list-shuffler-vs-alternatives.html': 'guide/id/random-list-shuffler-vs-alternatives.jsp',
  '/guides/de/random-list-shuffler-vs-alternatives.html': 'guide/de/random-list-shuffler-vs-alternatives.jsp',
  '/utility-tools/yes-or-no-wheel.html': 'utility/yes-or-no-wheel.jsp',
  '/guides/yes-no-wheel-step-by-step.html': 'guide/yes-no-wheel-step-by-step.jsp',
  '/guides/pt/yes-no-wheel-step-by-step.html': 'guide/pt/yes-no-wheel-step-by-step.jsp',
  '/guides/es/yes-no-wheel-step-by-step.html': 'guide/es/yes-no-wheel-step-by-step.jsp',
  '/guides/vi/yes-no-wheel-step-by-step.html': 'guide/vi/yes-no-wheel-step-by-step.jsp',
  '/guides/id/yes-no-wheel-step-by-step.html': 'guide/id/yes-no-wheel-step-by-step.jsp',
  '/guides/de/yes-no-wheel-step-by-step.html': 'guide/de/yes-no-wheel-step-by-step.jsp',
  '/developer-tools/word-counter.html': 'utility/word-counter.jsp',
  '/guides/word-counter-step-by-step.html': 'guide/word-counter-step-by-step.jsp',
  '/guides/pt/word-counter-step-by-step.html': 'guide/pt/word-counter-step-by-step.jsp',
  '/guides/es/word-counter-step-by-step.html': 'guide/es/word-counter-step-by-step.jsp',
  '/guides/vi/word-counter-step-by-step.html': 'guide/vi/word-counter-step-by-step.jsp',
  '/guides/id/word-counter-step-by-step.html': 'guide/id/word-counter-step-by-step.jsp',
  '/guides/de/word-counter-step-by-step.html': 'guide/de/word-counter-step-by-step.jsp',
  '/developer-tools/sort-text-lines.html': 'utility/sort-text-lines.jsp',
  '/guides/sort-text-lines-step-by-step.html': 'guide/sort-text-lines-step-by-step.jsp',
  '/guides/pt/sort-text-lines-step-by-step.html': 'guide/pt/sort-text-lines-step-by-step.jsp',
  '/guides/es/sort-text-lines-step-by-step.html': 'guide/es/sort-text-lines-step-by-step.jsp',
  '/guides/vi/sort-text-lines-step-by-step.html': 'guide/vi/sort-text-lines-step-by-step.jsp',
  '/guides/id/sort-text-lines-step-by-step.html': 'guide/id/sort-text-lines-step-by-step.jsp',
  '/guides/de/sort-text-lines-step-by-step.html': 'guide/de/sort-text-lines-step-by-step.jsp',
  '/developer-tools/remove-duplicate-lines.html': 'utility/remove-duplicate-lines.jsp',
  '/guides/remove-duplicate-lines-step-by-step.html': 'guide/remove-duplicate-lines-step-by-step.jsp',
  '/guides/pt/remove-duplicate-lines-step-by-step.html': 'guide/pt/remove-duplicate-lines-step-by-step.jsp',
  '/guides/es/remove-duplicate-lines-step-by-step.html': 'guide/es/remove-duplicate-lines-step-by-step.jsp',
  '/guides/vi/remove-duplicate-lines-step-by-step.html': 'guide/vi/remove-duplicate-lines-step-by-step.jsp',
  '/guides/id/remove-duplicate-lines-step-by-step.html': 'guide/id/remove-duplicate-lines-step-by-step.jsp',
  '/guides/de/remove-duplicate-lines-step-by-step.html': 'guide/de/remove-duplicate-lines-step-by-step.jsp',
  '/developer-tools/reverse-text.html': 'utility/reverse-text.jsp',
  '/guides/reverse-text-when.html': 'guide/reverse-text-when.jsp',
  '/guides/pt/reverse-text-when.html': 'guide/pt/reverse-text-when.jsp',
  '/guides/es/reverse-text-when.html': 'guide/es/reverse-text-when.jsp',
  '/guides/vi/reverse-text-when.html': 'guide/vi/reverse-text-when.jsp',
  '/guides/id/reverse-text-when.html': 'guide/id/reverse-text-when.jsp',
  '/guides/de/reverse-text-when.html': 'guide/de/reverse-text-when.jsp',
  '/utility-tools/password-generator.html': 'utility/password-generator.jsp',
  '/guides/password-generator-step-by-step.html': 'guide/password-generator-step-by-step.jsp',
  '/guides/pt/password-generator-step-by-step.html': 'guide/pt/password-generator-step-by-step.jsp',
  '/guides/es/password-generator-step-by-step.html': 'guide/es/password-generator-step-by-step.jsp',
  '/guides/vi/password-generator-step-by-step.html': 'guide/vi/password-generator-step-by-step.jsp',
  '/guides/id/password-generator-step-by-step.html': 'guide/id/password-generator-step-by-step.jsp',
  '/guides/de/password-generator-step-by-step.html': 'guide/de/password-generator-step-by-step.jsp',
  '/guides/password-generator-when.html': 'guide/password-generator-when.jsp',
  '/guides/pt/password-generator-when.html': 'guide/pt/password-generator-when.jsp',
  '/guides/es/password-generator-when.html': 'guide/es/password-generator-when.jsp',
  '/guides/vi/password-generator-when.html': 'guide/vi/password-generator-when.jsp',
  '/guides/id/password-generator-when.html': 'guide/id/password-generator-when.jsp',
  '/guides/de/password-generator-when.html': 'guide/de/password-generator-when.jsp',
  '/guides/password-generator-vs-alternatives.html': 'guide/password-generator-vs-alternatives.jsp',
  '/guides/pt/password-generator-vs-alternatives.html': 'guide/pt/password-generator-vs-alternatives.jsp',
  '/guides/es/password-generator-vs-alternatives.html': 'guide/es/password-generator-vs-alternatives.jsp',
  '/guides/vi/password-generator-vs-alternatives.html': 'guide/vi/password-generator-vs-alternatives.jsp',
  '/guides/id/password-generator-vs-alternatives.html': 'guide/id/password-generator-vs-alternatives.jsp',
  '/guides/de/password-generator-vs-alternatives.html': 'guide/de/password-generator-vs-alternatives.jsp',
  '/video-tools/video-trimmer.html': 'convert/video-trimmer.jsp',
  '/guides/video-trimmer-when.html': 'guide/video-trimmer-when.jsp',
  '/guides/video-trimmer-step-by-step.html': 'guide/video-trimmer-step-by-step.jsp',
  '/guides/video-trimmer-vs-alternatives.html': 'guide/video-trimmer-vs-alternatives.jsp',
  '/utility-tools/voice-recorder.html': 'utility/voice-recorder.jsp',
  '/guides/voice-recorder-when.html': 'guide/voice-recorder-when.jsp',
  '/guides/voice-recorder-step-by-step.html': 'guide/voice-recorder-step-by-step.jsp',
  '/guides/voice-recorder-vs-alternatives.html': 'guide/voice-recorder-vs-alternatives.jsp',
  '/guides/pt/voice-recorder-when.html': 'guide/pt/voice-recorder-when.jsp',
  '/guides/pt/voice-recorder-step-by-step.html': 'guide/pt/voice-recorder-step-by-step.jsp',
  '/guides/pt/voice-recorder-vs-alternatives.html': 'guide/pt/voice-recorder-vs-alternatives.jsp',
  '/guides/es/voice-recorder-when.html': 'guide/es/voice-recorder-when.jsp',
  '/guides/es/voice-recorder-step-by-step.html': 'guide/es/voice-recorder-step-by-step.jsp',
  '/guides/es/voice-recorder-vs-alternatives.html': 'guide/es/voice-recorder-vs-alternatives.jsp',
  '/guides/vi/voice-recorder-when.html': 'guide/vi/voice-recorder-when.jsp',
  '/guides/vi/voice-recorder-step-by-step.html': 'guide/vi/voice-recorder-step-by-step.jsp',
  '/guides/vi/voice-recorder-vs-alternatives.html': 'guide/vi/voice-recorder-vs-alternatives.jsp',
  '/guides/id/voice-recorder-when.html': 'guide/id/voice-recorder-when.jsp',
  '/guides/id/voice-recorder-step-by-step.html': 'guide/id/voice-recorder-step-by-step.jsp',
  '/guides/id/voice-recorder-vs-alternatives.html': 'guide/id/voice-recorder-vs-alternatives.jsp',
  '/guides/de/voice-recorder-when.html': 'guide/de/voice-recorder-when.jsp',
  '/guides/de/voice-recorder-step-by-step.html': 'guide/de/voice-recorder-step-by-step.jsp',
  '/guides/de/voice-recorder-vs-alternatives.html': 'guide/de/voice-recorder-vs-alternatives.jsp',
  '/utility-tools/text-to-speech.html': 'utility/text-to-speech.jsp',
  '/guides/text-speech-when.html': 'guide/text-speech-when.jsp',
  '/guides/text-speech-step-by-step.html': 'guide/text-speech-step-by-step.jsp',
  '/guides/text-speech-vs-alternatives.html': 'guide/text-speech-vs-alternatives.jsp',
  '/guides/pt/text-speech-when.html': 'guide/pt/text-speech-when.jsp',
  '/guides/pt/text-speech-step-by-step.html': 'guide/pt/text-speech-step-by-step.jsp',
  '/guides/pt/text-speech-vs-alternatives.html': 'guide/pt/text-speech-vs-alternatives.jsp',
  '/guides/es/text-speech-when.html': 'guide/es/text-speech-when.jsp',
  '/guides/es/text-speech-step-by-step.html': 'guide/es/text-speech-step-by-step.jsp',
  '/guides/es/text-speech-vs-alternatives.html': 'guide/es/text-speech-vs-alternatives.jsp',
  '/guides/vi/text-speech-when.html': 'guide/vi/text-speech-when.jsp',
  '/guides/vi/text-speech-step-by-step.html': 'guide/vi/text-speech-step-by-step.jsp',
  '/guides/vi/text-speech-vs-alternatives.html': 'guide/vi/text-speech-vs-alternatives.jsp',
  '/guides/id/text-speech-when.html': 'guide/id/text-speech-when.jsp',
  '/guides/id/text-speech-step-by-step.html': 'guide/id/text-speech-step-by-step.jsp',
  '/guides/id/text-speech-vs-alternatives.html': 'guide/id/text-speech-vs-alternatives.jsp',
  '/guides/de/text-speech-when.html': 'guide/de/text-speech-when.jsp',
  '/guides/de/text-speech-step-by-step.html': 'guide/de/text-speech-step-by-step.jsp',
  '/guides/de/text-speech-vs-alternatives.html': 'guide/de/text-speech-vs-alternatives.jsp',
  '/utility-tools/speech-to-text.html': 'utility/speech-to-text.jsp',
  '/guides/speech-text-when.html': 'guide/speech-text-when.jsp',
  '/guides/speech-text-step-by-step.html': 'guide/speech-text-step-by-step.jsp',
  '/guides/speech-text-vs-alternatives.html': 'guide/speech-text-vs-alternatives.jsp',
  '/guides/pt/speech-text-when.html': 'guide/pt/speech-text-when.jsp',
  '/guides/pt/speech-text-step-by-step.html': 'guide/pt/speech-text-step-by-step.jsp',
  '/guides/pt/speech-text-vs-alternatives.html': 'guide/pt/speech-text-vs-alternatives.jsp',
  '/guides/es/speech-text-when.html': 'guide/es/speech-text-when.jsp',
  '/guides/es/speech-text-step-by-step.html': 'guide/es/speech-text-step-by-step.jsp',
  '/guides/es/speech-text-vs-alternatives.html': 'guide/es/speech-text-vs-alternatives.jsp',
  '/guides/vi/speech-text-when.html': 'guide/vi/speech-text-when.jsp',
  '/guides/vi/speech-text-step-by-step.html': 'guide/vi/speech-text-step-by-step.jsp',
  '/guides/vi/speech-text-vs-alternatives.html': 'guide/vi/speech-text-vs-alternatives.jsp',
  '/guides/id/speech-text-when.html': 'guide/id/speech-text-when.jsp',
  '/guides/id/speech-text-step-by-step.html': 'guide/id/speech-text-step-by-step.jsp',
  '/guides/id/speech-text-vs-alternatives.html': 'guide/id/speech-text-vs-alternatives.jsp',
  '/guides/de/speech-text-when.html': 'guide/de/speech-text-when.jsp',
  '/guides/de/speech-text-step-by-step.html': 'guide/de/speech-text-step-by-step.jsp',
  '/guides/de/speech-text-vs-alternatives.html': 'guide/de/speech-text-vs-alternatives.jsp',
  '/utility-tools/habit-tracker.html': 'utility/habit-tracker.jsp',
  '/guides/habit-tracker-when.html': 'guide/habit-tracker-when.jsp',
  '/guides/habit-tracker-step-by-step.html': 'guide/habit-tracker-step-by-step.jsp',
  '/guides/habit-tracker-vs-alternatives.html': 'guide/habit-tracker-vs-alternatives.jsp',
  '/utility-tools/grocery-list.html': 'utility/grocery-list.jsp',
  '/guides/grocery-list-when.html': 'guide/grocery-list-when.jsp',
  '/guides/grocery-list-step-by-step.html': 'guide/grocery-list-step-by-step.jsp',
  '/guides/grocery-list-vs-alternatives.html': 'guide/grocery-list-vs-alternatives.jsp',
  '/utility-tools/qr-code-scanner.html': 'utility/qr-code-scanner.jsp',
  '/guides/qr-code-scanner-when.html': 'guide/qr-code-scanner-when.jsp',
  '/guides/qr-code-scanner-step-by-step.html': 'guide/qr-code-scanner-step-by-step.jsp',
  '/guides/qr-code-scanner-vs-alternatives.html': 'guide/qr-code-scanner-vs-alternatives.jsp',
  '/developer-tools/text-repeater.html': 'utility/text-repeater.jsp',
  '/guides/text-repeater-when.html': 'guide/text-repeater-when.jsp',
  '/guides/text-repeater-step-by-step.html': 'guide/text-repeater-step-by-step.jsp',
  // cycle 20260704 create_new_guide_page (locale completion) - pt variant of text-repeater-step-by-step (staging-only until es/vi/id/de complete).
  '/guides/pt/text-repeater-step-by-step.html': 'guide/pt/text-repeater-step-by-step.jsp',
  '/guides/text-repeater-vs-alternatives.html': 'guide/text-repeater-vs-alternatives.jsp',
  '/developer-tools/base64-encoder.html': 'utility/base64-encoder.jsp',
  '/guides/base64-encoder-when.html': 'guide/base64-encoder-when.jsp',
  '/guides/base64-encoder-step-by-step.html': 'guide/base64-encoder-step-by-step.jsp',
  '/guides/base64-encoder-vs-alternatives.html': 'guide/base64-encoder-vs-alternatives.jsp',
  '/developer-tools/url-decoder.html': 'utility/url-decoder.jsp',
  '/guides/url-decoder-when.html': 'guide/url-decoder-when.jsp',
  '/guides/url-decoder-step-by-step.html': 'guide/url-decoder-step-by-step.jsp',
  '/guides/url-decoder-vs-alternatives.html': 'guide/url-decoder-vs-alternatives.jsp',
  '/guides/pt/url-decoder-when.html': 'guide/pt/url-decoder-when.jsp',
  '/guides/pt/url-decoder-step-by-step.html': 'guide/pt/url-decoder-step-by-step.jsp',
  '/guides/pt/url-decoder-vs-alternatives.html': 'guide/pt/url-decoder-vs-alternatives.jsp',
  '/guides/es/url-decoder-when.html': 'guide/es/url-decoder-when.jsp',
  '/guides/es/url-decoder-step-by-step.html': 'guide/es/url-decoder-step-by-step.jsp',
  '/guides/es/url-decoder-vs-alternatives.html': 'guide/es/url-decoder-vs-alternatives.jsp',
  '/guides/vi/url-decoder-when.html': 'guide/vi/url-decoder-when.jsp',
  '/guides/vi/url-decoder-step-by-step.html': 'guide/vi/url-decoder-step-by-step.jsp',
  '/guides/vi/url-decoder-vs-alternatives.html': 'guide/vi/url-decoder-vs-alternatives.jsp',
  '/guides/id/url-decoder-when.html': 'guide/id/url-decoder-when.jsp',
  '/guides/id/url-decoder-step-by-step.html': 'guide/id/url-decoder-step-by-step.jsp',
  '/guides/id/url-decoder-vs-alternatives.html': 'guide/id/url-decoder-vs-alternatives.jsp',
  '/guides/de/url-decoder-when.html': 'guide/de/url-decoder-when.jsp',
  '/guides/de/url-decoder-step-by-step.html': 'guide/de/url-decoder-step-by-step.jsp',
  '/guides/de/url-decoder-vs-alternatives.html': 'guide/de/url-decoder-vs-alternatives.jsp',
};

// Cycle 50 follow-up #2 - GUIDE_ROUTES auto-merge from JSP_BY_ROUTE.
//
// Defect class: cycle agents shipping create_new_guide_page ALWAYS update
// JSP_BY_ROUTE (required for the route to render) but REPEATEDLY forget to
// add the same route to GUIDE_ROUTES (required for sitemap-guides.xml +
// the dynamic /guides.html hub + l-menu sidebar + homepage search). At
// least 4 separate cycles between 20260514 and 20260523 made this mistake;
// 9 orphan guides ended up shipping as 200s with no discovery surface.
//
// Three-level RCA:
//   L1: sitemap-guides.xml missing 9 URLs because they are not in GUIDE_ROUTES.
//   L2: cycle agents updated JSP_BY_ROUTE but not GUIDE_ROUTES on create_new_guide_page.
//   L3: no structural enforcement at the data layer - the two registries are
//       hand-maintained in parallel with no auto-sync.
//
// REAL FIX at L3 parent: auto-include every /guides/* JSP_BY_ROUTE entry
// into GUIDE_ROUTES at module load time. The explicit curated list above
// remains the operator-friendly view (with cycle comments for git-blame);
// the auto-merge below is the safety net that closes the defect class.
//
// Intentional opt-out (abort-in-place): if a /guides/* route ever needs to
// be a 200 but NOT in sitemap-guides.xml, add it to GUIDE_SITEMAP_EXCLUDE
// below. Currently empty (no active abort-in-place cases as of cycle 50).
export const GUIDE_SITEMAP_EXCLUDE = new Set([
  // Reserved for explicit operator opt-out. Format:
  //   '/guides/<slug>.html', // cycle <N> <reason>
  // Consumers: sitemap-writer.mjs + sitemap-html-builder.mjs all filter
  // through this set. Add a route here to keep it renderable (200) but
  // remove it from sitemap-guides.xml + /guides.html hub + l-menu + home
  // search. The abort-in-place pattern; rare.
]);
for (const route of Object.keys(JSP_BY_ROUTE)) {
  if (!route.startsWith('/guides/')) continue;
  if (route in ALIAS_ROUTES) continue;
  if (GUIDE_SITEMAP_EXCLUDE.has(route)) continue;
  GUIDE_ROUTES.add(route);
}

export function normalizeRoute(route) {
  if (!route) {
    return '/';
  }
  if (route === '/') {
    return route;
  }
  return route.startsWith('/') ? route : `/${route}`;
}

// URL-migration cluster path prefixes to strip from clustered tool URLs for
// CMS-fragment slug lookup. Built lazily on first call to avoid module-load
// cycles. Excludes the `guides` cluster (which preserves its joined-slug
// behavior since /guides/* CMS fragments are named guides<title>).
let _CLUSTER_TOOL_PATH_PREFIXES = null;
function getClusterToolPathPrefixes() {
  if (_CLUSTER_TOOL_PATH_PREFIXES !== null) return _CLUSTER_TOOL_PATH_PREFIXES;
  const prefixes = [];
  try {
    const groups = getSeoClusterGroups();
    for (const g of groups) {
      if (g.cluster === 'guides') continue;
      prefixes.push(g.hubRoute.replace(/\.html$/, '') + '/');
    }
  } catch {
    // seo-clusters.mjs not available; cluster-aware logic disabled.
  }
  _CLUSTER_TOOL_PATH_PREFIXES = prefixes;
  return prefixes;
}

export function routeToSlug(route) {
  const normalized = normalizeRoute(route);
  if (normalized === '/') {
    return '';
  }
  // plan-warm-pascal-v3 routing-layer-only EN-canonical fix (2026-05-31):
  // routes `/guides/en/<slug>.html` resolve to the same CMS-fragment slug
  // as `/guides/<slug>.html` (the EN canonical), so the existing
  // BODY*guides<slug>.* fragments serve both URLs. This makes hreflang
  // alternates that point at /guides/en/<slug>.html render with content
  // WITHOUT a per-URL CMS rename (full S1 migration is a Tier-A staged
  // rollout — this fix is the routing-only shim until that ships).
  // Forcing example: PT/ES/VI/ID/DE pages emit hreflang to
  // /guides/en/<slug>.html; before this fix those 166 EN URLs rendered as
  // empty <title> - Free Tool Online</title> shells.
  const enLocaleMatch = /^\/guides\/en\/([a-z0-9-]+)\.html$/.exec(normalized);
  if (enLocaleMatch) {
    return ('guides' + enLocaleMatch[1]).toLowerCase().replace(/-/g, '');
  }
  // URL-migration support (operator-override 2026-05-10): for clustered tool
  // URLs (e.g. /device-test-tools/microphone-test.html), strip the cluster
  // prefix and return the tool slug only (microphonetest) so the existing
  // BODYTITLE/BODYDESC/BODYHTML/etc. CMS fragments authored under the flat
  // slug still resolve. This makes URL migration a routing-layer change
  // without requiring 144 BODY*.html fragment file renames.
  for (const prefix of getClusterToolPathPrefixes()) {
    if (normalized.startsWith(prefix)) {
      const tail = normalized.slice(prefix.length);
      if (tail) return tail.replace(/\.html$/i, '').toLowerCase().replace(/[-/]/g, '');
      // Hub directory-index form (/cluster-name/) — fall through to default.
    }
  }
  // Default: remove leading slash, .html suffix, hyphens, AND interior slashes
  // so that subpath routes (e.g., /guides/heic-vs-jpg-vs-webp.html) map to a
  // single CMS fragment suffix (guidesheicvsjpgvswebp) - no filesystem conflict.
  return normalized.replace(/^\//, '').replace(/\.html$/i, '').toLowerCase().replace(/[-/]/g, '');
}

// --- Related-guides dedicated section rollout (plan-kahan) ------------------
// The renderer partitions the matched related links into a Related-tools
// section and a dedicated Related-guides section rendered directly below it
// (page-renderer.mjs::buildRelatedToolsSsr + renderToolSections). This allowlist
// gates WHICH routes emit the guides section, enabling a staged 5-pages-per-
// batch rollout that is verifiable and reversible. The allowlist is keyed by
// CMS-fragment slug (routeToSlug output) so a single entry covers a tool URL,
// its cluster-prefixed form, and the /guides/en/ alias. Seeded (batch 1) with
// the slugs that historically carried an inline "Related guides:" block. The
// migration runbook (prompts/related-guides-section-migration-runbook.md) adds
// up to 5 slugs per batch, including each route's localized guide variants
// (e.g. guidespt<slug>). Flip RELATED_GUIDES_GLOBAL to true to enable sitewide
// once the backlog is drained.
export const RELATED_GUIDES_GLOBAL = true; // 2026-06-28: all 19 legacy inline blocks removed; global enable.
// NOTE on rollout order (coverage safety): the dedicated Related-guides section
// is CAPPED (page-renderer.mjs RELATED_GUIDES_MAX), so it shows the most-relevant
// computed subset - it is NOT guaranteed to contain every link from a page's
// legacy inline "Related guides" block. Allowlisting a page that STILL has an
// inline block would therefore both DUPLICATE the section and (if the inline
// block is later removed) risk dropping curated internal links. So the seed
// below is limited to pages that have NO inline block (pure-additive, zero
// coverage risk). The migration runbook
// (prompts/related-guides-section-migration-runbook.md) handles the 19 legacy
// inline-block pages per batch: it removes the inline block ONLY after verifying
// every inline guide link is reachable in the rendered section, THEN allowlists
// the slug - so removal is coverage-preserving and never duplicated.
export const RELATED_GUIDES_SLUGS = new Set([
  // Phase 0 demo seed - tool pages with NO legacy inline "Related guides" block.
  'heictojpg',
  'jsonparser',
  'cameratest',
  'composepdf',
  'unzipfile',
  // Batch 1 (2026-06-28): legacy inline-block pages - inline block removal verified below.
  'zipfile',
  'md5converter',
  'lcdtest',
  'microphonetest',
  'developertools',
  // Batch 2 (2026-06-28): 5 more legacy inline-block pages.
  'devicetesttools',
  'imageconvertertools',
  'pdftools',
  'videotools',
  'guidescompressfolderonline',
  // Batch 3 (2026-06-28): 5 more legacy inline-block pages.
  'guidescreatezipfileonline',
  'guidescropandrotateimage',
  'guidesgiftoframe',
  'guidesgiftoframesconverter',
  'guidesilovezip',
  // Batch 4 (2026-06-28): final 4 legacy inline-block pages.
  'guideslcdchecker',
  'guidesonlinezipfile',
  'guideswhatwelearnedrunningfreeinbrowserimagetoolsfor100kmonthlyusers',
  'guideszipunlockeronline',
]);

export function isRelatedGuidesEnabled(route) {
  if (RELATED_GUIDES_GLOBAL) return true;
  try {
    return RELATED_GUIDES_SLUGS.has(routeToSlug(route));
  } catch {
    return false;
  }
}

// Per-slug curated guide URL lists (§1a of the related-guides migration runbook).
// When a page's legacy inline "Related guides" block contains specific hand-curated
// links that the computed tag/title-match algorithm may not surface (due to the
// RELATED_GUIDES_MAX cap or urlMaps ordering), list those canonical /guides/en/ URLs
// here. The renderer shows these FIRST in the dedicated section, then appends any
// additional tag-matched guides up to RELATED_GUIDES_MAX. Paths use /guides/en/ for
// EN-canonical guides; locale-specific guides use their own /guides/<lang>/ prefix.
// Coverage-preserving contract (runbook §1): every URL in a page's inline block must
// appear in urlMaps with a matching tag BEFORE the inline block is removed.
export const RELATED_GUIDES_CURATED = {
  'zipfile': [
    '/guides/en/file-compressor.html',
    '/guides/en/how-to-compress-a-zip-file.html',
    '/guides/en/how-to-compress-a-folder.html',
    '/guides/en/zip-folder-online-free.html',
    '/guides/en/compress-folder-online.html',
    '/guides/en/zip-file-size-compressor.html',
    '/guides/en/resize-zip-file.html',
    '/guides/es/compress-folder-to-zip-online-free.html',
    '/guides/es/reduce-zip-size-online.html',
    '/guides/pt/compress-zip-file.html',
    '/guides/en/kompres-file-zip.html',
  ],
  'md5converter': [
    '/guides/en/md5-vs-sha256-when-to-hash.html',
    '/guides/en/why-md5-cannot-be-decrypted.html',
    '/guides/en/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html',
    '/guides/en/md5-to-text-why-you-cannot-convert-back.html',
    '/guides/en/md5-hash-decrypt.html',
    '/guides/en/md5-password.html',
    '/guides/en/md5-decrypter.html',
  ],
  'lcdtest': [
    '/guides/en/dead-pixel-testing-guide.html',
    '/guides/en/how-to-test-for-dead-pixels-before-returning-a-monitor.html',
    '/guides/en/device-test-checklist-for-remote-work.html',
    '/guides/en/screen-display-test-synonyms.html',
    '/guides/en/what-an-lcd-test-does-and-when-to-run-one.html',
    '/guides/en/screen-test-online-vs-app-which-is-more-accurate.html',
    '/guides/en/test-lcd.html',
    '/guides/en/lcd-screen-test.html',
    '/guides/en/lcd-test-laptop.html',
  ],
  'microphonetest': [
    '/guides/en/how-to-check-webcam-and-microphone-before-an-interview.html',
    '/guides/en/device-test-checklist-for-remote-work.html',
    '/guides/en/microphone-test-no-sound-four-fixes.html',
    '/guides/en/microphone-test-online-what-it-actually-checks.html',
    '/guides/en/microphone-test-online-quiet-normal-peak-meter.html',
    '/guides/en/test-lcd.html',
  ],
  // Batch 1 (2026-06-28) - developertools curated override.
  'developertools': [
    '/guides/en/json-parser-validate-vs-format-vs-tree-view.html',
    '/guides/en/css-minifier-vs-compressor.html',
    '/guides/en/css-unminifier-vs-prettier-when-to-use-each.html',
    '/guides/en/unix-timestamps-explained.html',
    '/guides/en/milliseconds-to-date-utc-vs-local-time.html',
    '/guides/en/image-to-base64-embed-in-html-vs-link.html',
    '/guides/en/qr-code-error-correction-and-scan-failures.html',
  ],
  // Batch 2 (2026-06-28) curated overrides.
  'devicetesttools': [
    '/guides/en/what-an-lcd-test-does-and-when-to-run-one.html',
    '/guides/en/dead-pixel-testing-guide.html',
    '/guides/en/device-test-checklist-for-remote-work.html',
    '/guides/en/how-to-test-for-dead-pixels-before-returning-a-monitor.html',
  ],
  'imageconvertertools': [
    '/guides/en/heic-vs-jpg-vs-webp.html',
    '/guides/en/how-to-convert-heic-to-jpg-step-by-step.html',
    '/guides/en/png-vs-svg-when-to-use.html',
    '/guides/en/jpg-vs-png-for-web.html',
  ],
  'pdftools': [
    '/guides/en/pdf-password-types-owner-vs-user.html',
    '/guides/en/pdf-editing-ladder.html',
    '/guides/en/how-to-compress-a-file-online.html',
    '/guides/en/file-compressor-vs-zip-what-to-pick.html',
  ],
  'videotools': [
    '/guides/en/mp4-vs-webm-for-web.html',
    '/guides/en/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html',
    '/guides/en/what-is-a-file-compressor-and-which-to-use.html',
    '/guides/en/how-to-compress-a-file-online.html',
  ],
  'guidescompressfolderonline': [
    '/guides/en/how-to-compress-a-folder.html',
    '/guides/en/zip-folder-online-free.html',
    '/guides/en/folder-to-zip.html',
    '/guides/en/how-to-compress-a-folder-for-email.html',
  ],
  // Batch 3 (2026-06-28) curated overrides.
  'guidescreatezipfileonline': [
    '/guides/en/online-zip-file.html',
    '/guides/en/folder-to-zip.html',
    '/guides/en/zip-compressor-online.html',
    '/guides/en/compress-zip.html',
  ],
  'guidesgiftoframe': [
    '/guides/en/extract-gif-frames-png-vs-jpg-which-format.html',
    '/guides/en/gif-frames-extract-vs-frame-rate-fps-explained.html',
  ],
  'guidesgiftoframesconverter': [
    '/guides/en/gif-frames-extract-vs-frame-rate-fps-explained.html',
    '/guides/en/extract-gif-frames-png-vs-jpg-which-format.html',
  ],
  'guidesilovezip': [
    '/guides/en/create-zip-file-online.html',
    '/guides/en/online-zip-file.html',
    '/guides/en/zip-folder-online-free.html',
    '/guides/en/compress-zip.html',
  ],
  // Batch 4 (2026-06-28) curated overrides.
  'guideslcdchecker': [
    '/guides/en/test-lcd.html',
    '/guides/en/what-an-lcd-test-does-and-when-to-run-one.html',
    '/guides/en/led-test-vs-lcd-test-which-applies-to-your-screen.html',
    '/guides/en/lcd-test-vs-display-test-which-do-you-need.html',
    '/guides/en/screen-test-online-vs-app-which-is-more-accurate.html',
    '/guides/en/dead-pixel-testing-guide.html',
    '/guides/en/how-to-test-for-dead-pixels-before-returning-a-monitor.html',
  ],
  'guidesonlinezipfile': [
    '/guides/en/folder-to-zip.html',
    '/guides/en/compress-zip.html',
    '/guides/en/make-zip-file-online.html',
    '/guides/en/zip-compressor-online.html',
    '/guides/en/online-zip-vs-7z-vs-rar-which-to-pick.html',
  ],
  'guideswhatwelearnedrunningfreeinbrowserimagetoolsfor100kmonthlyusers': [
    '/guides/en/jpg-vs-png-for-web.html',
    '/guides/en/heic-vs-jpg-vs-webp.html',
    '/guides/en/mp4-vs-webm-for-web.html',
    '/guides/en/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html',
  ],
  'guideszipunlockeronline': [
    '/guides/en/pdf-password-types-owner-vs-user.html',
  ],
};

export function routeToPageName(route) {
  const normalized = normalizeRoute(route);
  if (normalized === '/') {
    return '';
  }
  // URL-migration support (operator-override 2026-05-10): for clustered tool
  // URLs (e.g. /device-test-tools/lcd-test.html), strip the cluster prefix and
  // return the leaf pageName ("lcd-test") — preserving hyphens, unlike
  // routeToSlug which strips them for CMS-fragment filename matching. Two
  // backward-compat reasons:
  //   (1) the rating API (service.freetool.online/ajax/get-rating)
  //       stores rating data keyed by the pre-migration pageName. Sending the
  //       new clustered pageName (with a slash) causes a lookup miss → empty
  //       response → rating.html's error handler removes the parent div →
  //       rating section disappears from the page. Forcing example: cycle193
  //       2026-05-11, /device-test-tools/lcd-test.html lost its star-rating
  //       widget on staging because pageName flipped from "lcd-test" to
  //       "device-test-tools/lcd-test".
  //   (2) the rendered HTML uses pageName in the body class (`page-${pageName}root`).
  //       A slash in the class name (e.g. "page-device-test-tools/lcd-testroot")
  //       breaks any CSS rule that targets `.page-lcd-testroot` directly.
  for (const prefix of getClusterToolPathPrefixes()) {
    if (normalized.startsWith(prefix)) {
      const tail = normalized.slice(prefix.length);
      if (tail) return tail.replace(/\.html$/i, '').toLowerCase();
      // Hub directory-index form (/cluster-name/) — fall through to default.
    }
  }
  return normalized.replace(/^\//, '').replace(/\.html$/i, '').toLowerCase();
}

export function routeToPageUrl(route) {
  const normalized = normalizeRoute(route);
  return normalized === '/' ? '' : normalized;
}

export function isInfoRoute(route) {
  return INFO_ROUTES.has(normalizeRoute(route));
}

export function isAliasRoute(route) {
  return Object.prototype.hasOwnProperty.call(ALIAS_ROUTES, normalizeRoute(route));
}

export function canonicalForRoute(siteOrigin, route) {
  const normalized = normalizeRoute(route);
  if (normalized === '/') {
    return stripTrailingSlash(siteOrigin);
  }
  return `${stripTrailingSlash(siteOrigin)}${normalized}`;
}

export function stripTrailingSlash(value) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function joinUrl(base, suffix) {
  return `${stripTrailingSlash(base)}${suffix.startsWith('/') ? suffix : `/${suffix}`}`;
}

export async function walkFiles(rootDir) {
  const result = [];
  async function visit(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await visit(absolutePath);
      } else {
        result.push(absolutePath);
      }
    }
  }

  await visit(rootDir);
  return result;
}

export async function buildJspIndex(jspRoot) {
  const files = await walkFiles(jspRoot);
  const byBaseName = new Map();
  const byRelativePath = new Map();

  for (const absolutePath of files) {
    if (!absolutePath.endsWith('.jsp')) {
      continue;
    }
    const relativePath = path.relative(jspRoot, absolutePath).replaceAll(path.sep, '/');
    if (relativePath.startsWith('admin/')) {
      continue;
    }
    byRelativePath.set(relativePath, absolutePath);
    byBaseName.set(path.basename(relativePath, '.jsp'), absolutePath);
  }

  return { rootDir: jspRoot, files, byBaseName, byRelativePath };
}

export function resolveJspPathForRoute(route, jspIndex) {
  const normalized = normalizeRoute(route);
  const override = JSP_BY_ROUTE[normalized];
  if (override) {
    return override;
  }
  const basename = normalized === '/' ? 'index' : path.basename(normalized, '.html');
  const absolutePath = jspIndex.byBaseName.get(basename);
  if (!absolutePath) {
    return null;
  }
  return path.relative(jspIndex.rootDir, absolutePath).replaceAll(path.sep, '/');
}

export async function loadTextIfExists(absolutePath) {
  try {
    return await readFile(absolutePath, 'utf8');
  } catch {
    return '';
  }
}

export async function loadFirstExistingText(baseDir, candidates) {
  for (const candidate of candidates) {
    const text = await loadTextIfExists(path.join(baseDir, candidate));
    if (text) {
      return text;
    }
  }
  return '';
}

export async function loadSharedFragments(viewRoot, runtimeViewRoot = viewRoot, themeCssPath) {
  return {
    topBodyContent: await loadTextIfExists(path.join(viewRoot, 'top-body-content.html')),
    pageSvgLogo: await loadTextIfExists(path.join(viewRoot, 'page-svg-logo.html')),
    rightBannerAd: await loadTextIfExists(path.join(viewRoot, 'right-banner-ad.html')),
    topPageBannerAd: await loadTextIfExists(path.join(runtimeViewRoot, 'top-page-banner-ad.html')),
    inContentBannerAd: await loadTextIfExists(path.join(viewRoot, 'in-content-banner-ad.html')),
    bottomPageBannerAd: await loadTextIfExists(path.join(viewRoot, 'bottom-page-banner-ad.html')),
    footer: await loadTextIfExists(path.join(viewRoot, 'footer.html')),
    lMenu: await loadTextIfExists(path.join(viewRoot, 'l-menu.html')),
    firstLoadJsThirdParty: await loadTextIfExists(path.join(viewRoot, 'first-load-js-third-party.html')),
    extendedJsThirdParty: await loadTextIfExists(path.join(viewRoot, 'extended-js-third-party.html')),
    extendedBodyContent: await loadTextIfExists(path.join(viewRoot, 'extended-body-content.html')),
    privacyContent: await loadTextIfExists(path.join(viewRoot, 'privacy-content.html')),
    cookieInfo: await loadTextIfExists(path.join(viewRoot, 'cookie-info.html')),
    clearAdConfirm: await loadTextIfExists(path.join(runtimeViewRoot, 'clear-ad-confirm.html')),
    editorialByline: await loadTextIfExists(path.join(viewRoot, 'editorial-byline.html')),
    editorialTrust: await loadTextIfExists(path.join(viewRoot, 'editorial-trust.html')),
    themeCss: themeCssPath ? await loadTextIfExists(themeCssPath) : '',
  };
}

function appendHubBacklink(content, backlink) {
  if (!content || !backlink || content.includes(backlink.href)) {
    return content;
  }

  return `${content}\n\n<p><a href="${backlink.href}">&larr; ${backlink.label}</a></p>`;
}

export async function loadCmsPageData(cmsRoot, route) {
  const slug = routeToSlug(route);
  const suffix = slug ? slug : '';
  const read = async (prefix, extension, fallback = '') => {
    const candidates = suffix
      ? [`${prefix}${suffix}.${extension}`]
      : [`${prefix}.${extension}`];
    for (const candidate of candidates) {
      const text = await loadTextIfExists(path.join(cmsRoot, candidate));
      if (text) {
        return text.trim();
      }
    }
    return fallback;
  };

  const bodyTitle = await read('BODYTITLE', 'txt');
  const bodyDesc = await read('BODYDESC', 'txt');
  const bodyKeyword = await read('BODYKW', 'txt');
  const bodyHtml = await read('BODYHTML', 'html');
  const bodyJs = await read('BODYJS', 'html');
  const bodyWelcome = await read('BODYWELCOME', 'html');
  const bodyFileType = await read('BODYFILETYPE', 'txt');
  const bodyFileType2 = await read('BODYFILETYPE2', 'txt');
  const faq = await read('FAQ', 'html');
  const pageStyle = await read('PAGESTYLE', 'css');
  const pageBrowserTitle = await read('PAGEBROWSERTITLE', 'txt', bodyTitle);
  const pageBrowserTitleMobile = (await loadFirstExistingText(
    cmsRoot,
    suffix ? [`PAGEBROWSERTITLE${suffix}-mobile.txt`] : ['PAGEBROWSERTITLE-mobile.txt'],
  )).trim();
  const pageHasSettings = await read('PAGEHASSETTINGS', 'txt');
  const canonicalUrl = await read('PAGECANO', 'txt');
  const hubBacklink = resolveHubBacklink(route);
  const resolvedBodyWelcome = hubBacklink ? appendHubBacklink(bodyWelcome, hubBacklink) : bodyWelcome;
  const resolvedBodyHtml = hubBacklink && !resolvedBodyWelcome ? appendHubBacklink(bodyHtml, hubBacklink) : bodyHtml;

  return {
    route: normalizeRoute(route),
    slug,
    pageName: routeToPageName(route),
    pageUrl: routeToPageUrl(route),
    bodyTitle,
    bodyDesc,
    bodyKeyword,
    bodyHtml: resolvedBodyHtml,
    bodyJs,
    bodyWelcome: resolvedBodyWelcome,
    bodyFileType,
    bodyFileType2,
    faq,
    pageStyle,
    pageBrowserTitle,
    pageBrowserTitleMobile,
    pageHasSettings: /^true$/i.test(pageHasSettings),
    canonicalUrl,
  };
}

export async function parseSitemapRoutes(sitemapPath) {
  let xml = '';
  try {
    xml = await readFile(sitemapPath, 'utf8');
  } catch (error) {
    const message = typeof error?.message === 'string' ? error.message : String(error);
    console.log(`[sitemap] Unable to read sitemap source at ${sitemapPath}: ${message}. Using empty route list.`);
    return [];
  }
  const routes = [];
  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/gims)) {
    try {
      const url = new URL(match[1].trim());
      routes.push(url.pathname || '/');
    } catch {
      // Ignore malformed entries.
    }
  }
  return routes;
}

