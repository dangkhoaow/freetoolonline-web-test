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
  '/guides/heic-vs-jpg-vs-webp.html',
  '/guides/dead-pixel-testing-guide.html',
  '/guides/unix-timestamps-explained.html',
  '/guides/pdf-password-types-owner-vs-user.html',
  // §3.5 comparison guides (Cycle 4).
  '/guides/png-vs-svg-when-to-use.html',
  '/guides/css-minifier-vs-compressor.html',
  // Cycle 74 P74.B - "JSON parser online: validate vs format vs tree view - which feature do you need?" Lane-D disambiguation guide for the
  // /json-parser.html sub-feature triad. Cluster: developer. Non-cannibalizing - no existing guide on this disambiguation; complements the cycle-74
  // jsonparser BODYHTML thin-content fix.
  '/guides/json-parser-validate-vs-format-vs-tree-view.html',
  // Cycle 75 P75.B - "Milliseconds to date - UTC vs local time, and why your conversion might look off by hours" Lane-D timezone-interpretation guide
  // for /convert-time-in-millisecond-to-date.html. Cluster: developer. Non-cannibalizing - existing long-number-millisecond-or-second covers ms-vs-s
  // disambiguation, unix-timestamps-explained covers epoch fundamentals; this guide covers the timezone-display angle (UTC vs local).
  '/guides/milliseconds-to-date-utc-vs-local-time.html',
  // Cycle 76 P76.A - "Screen test online vs app: which is more accurate, and when each one wins" Lane-D guide for the device-test cluster.
  // Companion to lcd-test-vs-display-test-which-do-you-need (cycle 42) and lcd-test-what-it-checks. Non-cannibalizing - covers the
  // browser-vs-app diagnostic surface comparison, not panel-vs-display-vs-monitor scope. Sourced from sibling tool-guideslcdtestvsdisplaytestwhichdoyouneed
  // framing-menu lines extended with browser/native abstraction-layer claims (W3C CSSOM color-model, browser fullscreen API).
  '/guides/screen-test-online-vs-app-which-is-more-accurate.html',
  // Cycle 77 P77.A - "How to compress a ZIP file to a specific size (2 MB / 25 MB / 100 KB)" Lane-D append-only guide for the file-compressor / ZIP intent gap.
  // GSC evidence (28d): "compress zip file to 25mb" 2,932 imp pos 4.9; "compress zip file to 2mb" 1,365 imp pos 4.3; "compress zip file to 100kb" 787 imp pos 4.7.
  // Forward-links to /zip-file.html, /compress-image.html. Does NOT modify any indexed ZIP-cluster page (ZIP-CRITICAL-CARE not gated).
  // Non-cannibalizing vs how-to-make-a-zip-file-smaller (cycle ?) and how-to-compress-zip-file-to-smaller-size; covers the "specific target cap (2/25/100)" sub-intent.
  '/guides/how-to-compress-a-zip-file-to-a-specific-size.html',
  // Cycle 20260519-10 create_new_guide_page - "how to compress a zip file" bare-query step-by-step guide.
  // GSC evidence (28d): "how to compress a zip file" 557 imp / 8 clicks / pos 8.8 / CTR 1.43% / opportunity_score 62.38.
  // Distinct intent from the "to a specific size" / "to smaller size" / "to 100kb" siblings: this captures the bare-query
  // reader who just wants the 3-step recipe. Implementing tool: /zip-file.html. Append-only (new URL).
  '/guides/how-to-compress-a-zip-file.html',
  // Cycle 20260519-11 create_new_guide_page - "zip folder online free" bare-query step-by-step guide.
  // GSC evidence (28d): "zip folder online free" 488 imp / 16 clicks / pos 7.81 / CTR 3.28% / opportunity_score 60.41.
  // Implementing tool: /zip-file.html. Cluster: zip. Append-only (new URL).
  '/guides/zip-folder-online-free.html',
  // Cycle 78 P78.A - "QR code error correction and scan failures: why your QR will not scan" Lane-D append-only guide.
  // Companion to /qr-code-generator.html (one of the 4 R7_thin_content fixes in P78.B). Reader-task gap: no QR-related guide existed
  // pre-cycle-78. Diagnoses the four common scan-failure causes (payload size, error-correction level, contrast, print scale) so a
  // reader who generated a QR with our tool and got a non-scannable result can self-diagnose without leaving the site. Append-only
  // (new URL); non-cannibalizing (no other QR guide on /guides/).
  '/guides/qr-code-error-correction-and-scan-failures.html',
  // Cycle 79 P79.B - "Image to Base64: embed in HTML/CSS vs link the image file" Lane-D append-only guide.
  // Companion to /image-to-base64.html and /base64-to-image.html (both client-only). Reader-task gap: existing
  // /guides/base64-when-to-use-and-when-not-to.html covers the broader theory; this guide is the practical
  // decision rule (concrete byte thresholds, HTTP/2 break-even, 30-second sanity check) for the developer who
  // already knows what base64 is. Append-only (new URL); non-cannibalizing.
  '/guides/image-to-base64-embed-in-html-vs-link.html',
  // Cycle 80 P80.G - "How to test a touchscreen for bad spots" Lane-D append-only guide (device-test cluster).
  // Reader-task gap: existing /lcd-test.html and 8+ lcd-test cluster guides cover the visual / pixel half of a
  // screen check (color cycle, dead-pixel-vs-stuck taxonomy, warranty threshold, return-monitor evidence,
  // online-vs-app accuracy, screen-vs-camera routing); none cover the *touch* half (digitizer dead spots,
  // edge-only failures, vertical-stripe digitizer faults, ghost touches). Bing-only "test my screen" 3,170 imp +
  // "screen tester" 2,849 imp + "screen checker" 2,592 imp cohort lands on /lcd-test.html and bounces because
  // that tool only runs the color cycle. Append-only (new URL); non-cannibalizing.
  '/guides/how-to-test-a-touchscreen-for-bad-spots.html',
  // Cycle 81 P81.A - "Webcam mirror vs flip explained" Lane-D append-only guide (camera-test sub-cluster).
  // Reader-task gap: 99 existing guide files contain zero matches for "mirror" / "flip" / "scaleX". Bing
  // "camera test" 100,484 imp / 0.20% CTR / pos 8.4 cohort lands on /camera-test.html, sees a horizontally-
  // mirrored preview (live <video> with transform: scaleX(-1)), and bounces interpreting the mirror as a
  // broken tool. The guide explains preview-mirror is by design vs saved-file usually un-mirrored, gives a
  // 30-second proof procedure, and provides exact disable-mirror steps for OBS / Zoom / Meet / Teams.
  // Append-only (new URL); non-cannibalizing (distinct intent from camera-test-shows-black-screen,
  // camera-test-vs-webcam-test, before-a-video-call, how-to-check-camera-quality-on-your-phone).
  '/guides/camera-mirror-vs-flip-explained.html',
  // Cycle 82 P82.A - "CSS Unminifier vs Prettier: when to use each" Lane-D append-only guide
  // (developer / CSS sub-cluster, companion to /css-unminifier.html). Reader-task gap: 99 existing
  // guides cover the forward direction (minifier vs compressor / vs uglifier vs tree-shaking, Cloud
  // Run cold-start) but no guide explains when /css-unminifier.html is the right tool vs Prettier.
  // Append-only (new URL); non-cannibalizing.
  '/guides/css-unminifier-vs-prettier-when-to-use-each.html',
  // Cycle 83 P83.A - "LED test vs LCD test: which applies to your screen?" Lane-D append-only
  // guide (device-test / lcd-test sub-cluster, companion to /lcd-test.html). Reader-task gap:
  // GSC `gsc_keyword_opportunities_28d` "led test" 669 imp pos 8.9 + "led tester online" 154
  // imp pos 5.0 + "lcd checker" 356 imp pos 6.8 + "lcd check" 865 imp pos 6.7 land on
  // /lcd-test.html with no on-page explanation that LED-vs-LCD is the same hardware. Existing
  // sibling guides cover panel-vs-display scope (lcd-test-vs-display-test-which-do-you-need),
  // generic synonyms (screen-display-test-synonyms), and laptop checklist (screen-test-for-
  // laptop-5-minute-checklist) but none explain the backlight-vs-panel distinction that
  // generates the LED-test query stream. Append-only (new URL); non-cannibalizing.
  '/guides/led-test-vs-lcd-test-which-applies-to-your-screen.html',
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
  '/guides/oled-test-vs-lcd-test-what-changes-on-oled.html',
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
  '/guides/how-to-compress-a-jpg-for-email-attachment-limits.html',
  // Cycle 85 P85.A - "Microphone test levels: what quiet, normal, and peak mean" Lane-D append-only
  // guide (device-test / microphone-test sub-cluster, companion to /microphone-test.html).
  // Reader-task gap: existing sibling guides cover what the test verifies (microphone-test-online-
  // what-it-actually-checks) and the flat-meter troubleshooting case (microphone-test-no-sound-
  // four-fixes). NONE explain how to interpret the meter when it IS moving (call-ready level vs
  // too quiet vs clipping). Phase-1 datasource: bing_query_stats + gsc_low_ctr_high_imp_28d.
  // Append-only (new URL); non-cannibalizing per seo-agency-check anti-cannibalization gate.
  '/guides/microphone-test-online-quiet-normal-peak-meter.html',
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
  '/guides/camera-test-permission-blocked-how-to-allow-it.html',
  // Cycle 87 P87.A - "Microphone test permission blocked: how to allow mic access in your browser" Lane-D guide
  // (device-test / microphone-test sub-cluster, companion to /microphone-test.html, symmetric peer to cycle-86's
  // /guides/camera-test-permission-blocked-how-to-allow-it.html). Reader-task gap: existing microphone-test guides
  // cover the four-cause walkthrough (microphone-test-no-sound-four-fixes), the level-meter semantics
  // (microphone-test-online-quiet-normal-peak-meter cycle-85), and the test-coverage explainer
  // (microphone-test-online-what-it-actually-checks), but NONE drill into "the browser blocked me - per-browser
  // allow path". GSC long-tail "microphone permission denied" / "allow microphone in browser" / "mic blocked safari"
  // demand carries impression float without a single-intent landing page; Bing query_stats reinforces.
  // Append-only (new URL); non-cannibalising per seo-agency-check anti-cannibalization gate.
  '/guides/microphone-test-permission-blocked-how-to-allow-it.html',
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
  '/guides/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html',
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
  '/guides/image-compression-and-exif-metadata-what-gets-stripped.html',
  // Phase 8 Cycle 3 §3.4 greenfield guides - 4 pillar + 2 comparison + 6 how-to + 1 case-study.
  '/guides/mp4-vs-webm-for-web.html',
  '/guides/jpg-vs-png-for-web.html',
  '/guides/md5-vs-sha256-when-to-hash.html',
  '/guides/csv-vs-json-data-formats.html',
  '/guides/pdf-vs-heic-for-document-archival.html',
  '/guides/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html',
  '/guides/how-to-convert-100-heic-photos-to-jpg.html',
  '/guides/how-to-test-for-dead-pixels-before-returning-a-monitor.html',
  '/guides/how-to-sign-pdf-after-removing-a-password.html',
  '/guides/how-to-extract-frames-from-a-gif-for-a-social-post.html',
  '/guides/how-to-check-webcam-and-microphone-before-an-interview.html',
  '/guides/how-to-minify-css-js-for-cloud-run-cold-start.html',
  '/guides/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html',
  // Phase 10 Cycle 4 P10.3.4 - cluster-disambiguation guide (compress vs convert
  // intent router; upper-funnel capture for "file compressor" / "image compressor" queries).
  '/guides/when-to-compress-vs-convert-an-image.html',
  // Phase 11 Cycle 4 P11.3.3 - how-to guide targeting the 9,737-impression
  // `how to compress a folder` keyword opportunity (0.14% CTR / pos 6.10).
  // Upper-funnel routing to the frozen ZIP cluster without modifying any
  // zip satellite.
  '/guides/how-to-compress-a-folder-for-email.html',
  // Phase 11 Cycle 5 P11.2.1 - device-test-checklist guide (Phase 10 P10.3.5
  // carryover; upper-funnel routing for device-test cluster).
  '/guides/device-test-checklist-for-remote-work.html',
  // Phase 11 Cycle 5 P11.3.5 - PDF cluster disambiguation ladder (routes
  // users across 12 PDF tools by intent).
  '/guides/pdf-editing-ladder.html',
  // Phase 13 Cycle 2.1 P13.2.1 - file-compressor head-query recovery
  // (252,050 monthly impressions @ 0.04% CTR, pos 9.94 - leak target).
  // Routes upper-funnel "file compressor" intent into the right tool by file
  // type without modifying any ZIP satellite.
  '/guides/file-compressor-vs-zip-what-to-pick.html',
  // Phase 13 Cycle 2.2 P13.2.2 - HEIC vs JPG converter decision guide.
  // Pairs with /heic-to-jpg.html (Cycle 1 verb-first recovery) to absorb
  // top-of-funnel "convert HEIC?" intent into a destination-quality page.
  '/guides/heic-vs-jpg-converter-when-each-wins.html',
  // Phase 16 Cycle A P16.N1 - "file compressor" head-query (259,581 impr /
  // 0.04% CTR / pos 9.9). Greenfield explainer + routing guide. Touches
  // no existing tool / hub / guide URL; ZIP-CRITICAL-CARE compliant.
  '/guides/what-is-a-file-compressor-and-which-to-use.html',
  // Cycle 121 P121.G - "file compressor" HEAD-query aggregator landing
  // (248,591 impr / 0.04% CTR / pos 9.94 / 12,332 missed clicks per 28d).
  // Operator override carry from cycle120 P120.G. Distinct from the
  // four long-tail /guides/file-compressor-* pages: this URL targets
  // the exact-match HEAD query as canonical landing; the long-tail
  // pages keep their existing intents. Append-only.
  '/guides/file-compressor.html',
  // Cycle 122 P122.A - "test lcd" + "lcd tester" + "lcd test online"
  // HEAD-query disambiguation aggregator (combined ~7,773 impr / 28d
  // at pos 5-8). Routes the "which tool to pick" intent to /lcd-test.html
  // action tool while the existing 8 /guides/lcd-* / /guides/dead-pixel-*
  // / /guides/screen-* pages keep their long-tail intents. Append-only.
  '/guides/test-lcd.html',
  // Cycle 20260518-30 P30.E - "lcd checker" / "lcd check" / "monitor checker" /
  // "screen checker" Lane-D create_new_guide_page. Sibling to /guides/test-lcd.html
  // and /guides/led-test.html. Covers the "checker" / "check" wording family
  // (verification framing) vs the "tester" / "test" wording family (active
  // verb framing). Both routes point at the same in-browser tool /lcd-test.html.
  // Append-only, kebab-case, does not shadow /lcd-test.html (smashed form
  // "lcdchecker" differs from existing slugs).
  '/guides/lcd-checker.html',
  // Phase 16 Cycle A P16.N2 - "how to compress a file" + variants
  // (~10K impr / 0.02% CTR / pos 10.5). Greenfield how-to guide.
  '/guides/how-to-compress-a-file-online.html',
  // Phase 16 Cycle A P16.N4 - "how to reduce zip file size" cluster
  // (~2.2K impr / 10-16% CTR / pos 4). Greenfield how-to guide.
  '/guides/how-to-reduce-zip-file-size-online.html',
  // Cycle 20260515-14 - kebab-form sibling for the same query (the
  // existing -online suffix variant covers users who type "online";
  // this bare-form covers users who omit it). 723 imp / 5.39 pos /
  // 7.5% CTR per GSC 28d.
  '/guides/how-to-reduce-zip-file-size.html',
  // Cycle 20260520-9 create_new_guide_page - exact-match "reduce zip
  // file size online" landing (GSC 397 imp / 54 clicks / pos 5.01 /
  // CTR 13.6% / opportunity_score 68.46). Implementing tool /zip-file.html.
  // Append-only; non-cannibalizing vs how-to-reduce-zip-file-size-online
  // (this guide is the bare-noun phrase, the existing one is the how-to
  // framing for the same intent family).
  '/guides/reduce-zip-file-size-online.html',
  // Phase 16 Cycle B P16.N11 - "convert heic to jpg" head query
  // (5,500+ impr / <2% CTR / pos 11-24). Pure step-by-step how-to;
  // pairs with existing heic-vs-jpg-vs-webp (which covers the WHEN).
  '/guides/how-to-convert-heic-to-jpg-step-by-step.html',
  // Phase 16 Cycle B P16.N16 - "lcd test" head query (28K aggregate
  // impr / 1.10% CTR / pos 6.1). Explainer + when-to-run + boundary.
  '/guides/what-an-lcd-test-does-and-when-to-run-one.html',
  // Cycle 20260517-6 create_new_guide_page - "ms to date" synonym-coverage guide.
  // Implementing tool: /convert-time-in-millisecond-to-date.html.
  '/guides/ms-to-date.html',
  // Phase 16 cycle 8 N-series - 25 new long-form guides. INFO_ROUTES
  // membership disables ads + rating widget (matching the rest of the
  // /guides/* cluster); see page-renderer.mjs showAds gate.
  '/guides/how-to-make-a-zip-file-smaller.html',
  '/guides/how-to-compress-zip-file-to-smaller-size.html',
  // Cycle 20260517-9 create_new_guide_page - exact-match "compress zip file to smaller size" landing.
  '/guides/compress-zip-file-to-smaller-size.html',
  '/guides/compress-zip-file-to-100kb.html',
  // Cycle 20260521-12 P29.A create_new_guide_page - "compress zip file to 2mb" enterprise-SMTP-cap-specific landing. Operator-approved via card cycle29-create_new_guide_page-compresszipfileto2mb-cannibalisation-1779338089590 (option a). 2 MB is the historical Exchange / SMTP-relay / legacy-webmail attachment cap; distinct angle from the 100kb sibling. Implementing tool /zip-file.html.
  '/guides/compress-zip-file-to-2mb.html',
  // Cycle 20260517-10 create_new_guide_page - exact-match "zip size reducer" landing (GSC 605 imp / 56 clicks / pos 5.67 / CTR 9.26%; opportunity_score 96.84).
  '/guides/zip-size-reducer.html',
  // Cycle 20260519-12 create_new_guide_page - exact-match "zip file size compressor" landing (GSC 354 imp / 44 clicks / pos 5.43 / CTR 12.43%; opportunity_score 57.07). Implementing tool /zip-file.html. Append-only; non-cannibalizing vs /guides/how-to-make-a-zip-file-smaller.html, /guides/zip-size-reducer.html, /guides/compress-zip-file-to-smaller-size.html (each targets a distinct head-tail intent).
  '/guides/zip-file-size-compressor.html',
  // Cycle 20260519-15 create_new_guide_page — "resize zip file" routing/disambiguation Lane-D guide (GSC 406 imp / 19 clicks / pos 6.83 / CTR 4.68%; opportunity_score 56.6). Distinguishing role: addresses the three-way wording ambiguity (shrink vs split vs shrink-photo-inputs-first), routes to the existing shrink / split / image-resize guides — not a 10th compress-zip duplicate.
  '/guides/resize-zip-file.html',
  // Cycle 20260520-16 create_new_guide_page — Indonesian-language guide "kompres file zip" (GSC 338 imp / 13 clicks / pos 6.36 / CTR 3.85%; opportunity_score 51.12). Implementing tool /zip-file.html. Companion sibling to /guides/comprimir-zip-online.html (Spanish) and /guides/compactar-pasta.html (Portuguese).
  '/guides/kompres-file-zip.html',
  '/guides/online-zip-vs-7z-vs-rar-which-to-pick.html',
  '/guides/how-to-zip-multiple-files-into-one.html',
  '/guides/how-to-zip-folder-online-step-by-step.html',
  '/guides/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html',
  '/guides/recover-corrupt-zip-file-options.html',
  '/guides/iphone-photo-format-explained-heic-jpg-png-raw.html',
  '/guides/how-to-convert-iphone-photo-to-jpg.html',
  '/guides/jpg-vs-jpeg-are-they-the-same.html',
  '/guides/svg-to-png-when-to-rasterize-an-svg.html',
  '/guides/how-to-check-camera-quality-on-your-phone.html',
  '/guides/microphone-test-online-what-it-actually-checks.html',
  '/guides/keyboard-tester-online-rollover-vs-anti-ghosting.html',
  '/guides/why-md5-cannot-be-decrypted.html',
  // Cycle 20260518-24 P24.E — "md5 decode" reader-vocabulary routing guide (distinguishing role).
  '/guides/md5-decode.html',
  // Cycle 20260518-28 — "md5 decrypt online" wording routing guide. Same one-way truth as md5-decode but framed
  // around the "decrypt" search wording (more specific; carries the password-recovery sub-intent). Distinct from
  // /guides/why-md5-cannot-be-decrypted.html (cryptographic walkthrough) and /guides/md5-decode.html (broader
  // wording routing). Outbound link to /md5-converter.html.
  '/guides/md5-decrypt-online.html',
  // Cycle 20260520-17 — "md5 hash decrypt" dictionary-attack-feasibility guide.
  '/guides/md5-hash-decrypt.html',
  '/guides/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html',
  '/guides/json-vs-yaml-vs-toml-config-formats-explained.html',
  '/guides/css-minifier-vs-uglifier-vs-tree-shaking.html',
  '/guides/base64-when-to-use-and-when-not-to.html',
  '/guides/how-to-split-a-gif-into-frames-for-editing.html',
  '/guides/how-to-crop-and-rotate-an-image.html',
  '/guides/photo-editor-vs-graphics-app-vs-batch-processor.html',
  '/guides/mp4-vs-mov-vs-mkv-which-container-when.html',
  '/guides/free-online-tools-that-work-without-uploading-files.html',
  '/guides/qr-code-generator-best-practices.html',
  // Workstream B sample batch - added 2026-04-30 per SITE_ENHANCEMENT_PLAN.md.
  // Two proof-of-pattern guides for cycle-18 batch-1 ship-loop.
  '/guides/how-to-compress-a-folder.html',
  '/guides/lcd-test-what-it-checks.html',
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
  '/guides/screen-display-test-synonyms.html',
  // Cycle 27 P27.C - Lane-D mandatory guide page for the Bing keyboard-test
  // cohort (`keyboard test online` 7.7k + `online keyboard test` 6.2k +
  // `test keyboard` 3.4k Bing-only impressions). Routes mid-funnel
  // step-by-step intent to /keyboard-test.html without overlapping the
  // existing /guides/keyboard-tester-online-rollover-vs-anti-ghosting.html
  // (which is the WHAT-IS guide; this is the HOW-TO guide).
  '/guides/how-to-test-a-keyboard-online-step-by-step.html',
  // Cycle 28 P28.A - Lane-D mandatory guide page for the GA4 sustained
  // decay on /extract-gif-to-image-frames.html (cycle-21 P21.1 → cycle-27
  // P27.E research carry, executed cycle 28). PNG-vs-JPG format-decision
  // angle — narrowly distinct from the existing how-to-split-a-gif and
  // social-post guides (which both already cover step-by-step intent).
  // Captures pre-decision searchers comparing output formats; helps the
  // tool's GA4 decay by routing format-shopping queries to a dedicated
  // landing page that links INTO the tool's settings panel. Append-only
  // on every existing surface. Cluster: image-editing.
  '/guides/extract-gif-frames-png-vs-jpg-which-format.html',
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
  '/guides/gif-frames-extract-vs-frame-rate-fps-explained.html',
  // Cycle 30 P30.A - Lane-D mandatory guide page on the orthogonal
  // "what to use INSTEAD of MD5" decision. Distinct from the existing
  // /guides/why-md5-cannot-be-decrypted.html (which answers the why)
  // and /guides/md5-vs-sha256-when-to-hash.html (narrow MD5-vs-SHA256
  // only). Captures the residual cohort searching "md5 alternatives",
  // "what to use instead of md5", "bcrypt vs argon2id", "argon2id
  // vs bcrypt" - all currently landing on /md5-converter.html at
  // GSC pos 9-11 with sub-2.5% CTR. Append-only on every existing
  // surface. Cluster: guide,developer.
  '/guides/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html',
  // Cycle 31 P31.A - "camera test shows black screen" diagnostic-flow
  // guide. Targets Bing "camera test" head query (100k+ impressions @
  // pos 8.4 / 198 clicks) by addressing the failure-mode reader task
  // ("preview is a black rectangle") no existing guide covers.
  // Lane-D PA-mode mandatory; device-test cluster.
  '/guides/camera-test-shows-black-screen-four-fixes.html',
  // Cycle 34 P34.A - microphone-test "no sound / flat waveform"
  // diagnostic-flow guide. Targets Bing "microphone test" /
  // "test microphone" / "microphone test online free" cluster
  // (~1500 impressions @ pos 9 / 0.13% CTR) by addressing the
  // failure-mode reader task ("test runs but the meter is flat")
  // no existing guide covers. Closes the last device-test cluster
  // gap (camera/screen/keyboard already have troubleshooting guides).
  // Lane-D PA-mode mandatory; device-test cluster.
  '/guides/microphone-test-no-sound-four-fixes.html',
  // Cycle 35 P35.A - keyboard-test "keys not detected / some keys
  // don't highlight" diagnostic-flow guide. Targets Bing
  // "keyboard test" / "online keyboard test" / "keyboard tester" /
  // "test keyboard" cluster (~20,238 impressions @ pos 8-9 / 0.08%
  // CTR per bing_query_stats.json 99 query rows) by addressing the
  // failure-mode reader task ("I pressed keys but nothing highlights")
  // no existing guide covers. Closes the LAST remaining device-test
  // cluster gap (camera + microphone already shipped 31/34; LCD has
  // dead-pixel-testing-guide). Lane-D PA-mode mandatory.
  '/guides/keyboard-test-keys-not-detected-four-fixes.html',
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
  '/guides/compress-jpeg-without-losing-quality-quality-vs-size.html',
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
  '/guides/long-number-millisecond-or-second.html',
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
  '/guides/compressed-jpg-looks-blurry-three-causes.html',
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
  '/guides/ffmpeg-online-conversion-stalled-three-fixes.html',
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
  '/guides/gif-frame-extractor-output-looks-wrong-three-causes.html',
  // Cycle 20260514-9 create_new_guide_page - "gif frame extractor" head-term
  // Lane-D guide (1,022 imp / 28d, pos 7.77, CTR 1.08%; opportunity score 130).
  // Implementing tool: /extract-gif-to-image-frames.html. Single-cycle complete
  // ship per cycle 20260514-5 contract.
  '/guides/gif-frame-extractor.html',
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
  '/guides/lcd-test-vs-display-test-which-do-you-need.html',
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
  '/guides/camera-test-vs-webcam-test-which-do-you-need.html',
  // Cycle 73 P73.B - "Screen test vs camera test - which one do you actually need?" cross-cluster
  // disambiguation guide for the ambiguous "test my device" head query. Distinct from cycle-42
  // (within-screen-cluster: lcd vs display vs monitor) and cycle-43 (within-camera-cluster:
  // camera vs webcam) - this one disambiguates ACROSS the two action tools. Sourced from
  // DEC.20260505-18.001/003/004 + opportunity-scout OPP.20260505-18.02/04. Lane-D PA-mode
  // (DASHBOARD-PA contract); cluster: device-test; non-ZIP, non-destructive.
  '/guides/screen-test-vs-camera-test-pick-the-right-tool.html',
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
  '/guides/md5-to-text-why-you-cannot-convert-back.html',
  // Cycle 46 P46.B - pre-call checklist guide. Reader question: "I have 5 minutes
  // before a video call - which checks do I run on the screen, the webcam, and
  // the microphone?" Bridges the cycle-42 lcd-test-vs-display-test guide and the
  // cycle-43 camera-test-vs-webcam-test guide as a procedural HOW-DO-I-RUN-THESE
  // sequence (different reader job: which-tools-to-run, not which-tool-is-which).
  // Outbound links: /lcd-test.html, /camera-test.html, /microphone-test.html,
  // /keyboard-test.html, plus three companion device-test guides. Cluster:
  // guide,device-test. Lane-D PA-mode mandatory; non-ZIP, non-destructive.
  '/guides/before-a-video-call-which-tools-to-run.html',
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
  '/guides/screen-test-for-laptop-5-minute-checklist.html',
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
  '/guides/ffmpeg-online-vs-video-converter-which-to-pick.html',
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
  '/guides/imagemagick-online-vs-task-specific-tools-which-to-pick.html',
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
  '/guides/file-compressor-online-when-to-zip-vs-when-to-compress-image.html',
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
  '/guides/how-to-extract-a-file-online-zip-rar-7z.html',
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
  '/guides/how-to-choose-a-compression-level.html',
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
  '/guides/zip-password-types-strong-vs-weak-explained.html',
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
  '/guides/pdf-preflight-online-what-it-actually-checks.html',
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
  '/guides/read-and-compare-md5-hashes-correctly.html',
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
  '/guides/how-to-tell-if-a-jpg-was-compressed-too-much.html',
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
  '/guides/how-to-flatten-a-pdf-and-when-to-do-it.html',
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
  '/guides/png-to-svg-when-to-vectorize-a-raster-image.html',
  // Cycle 62 P62.E - "Download link not appearing after conversion -
  // 5 fixes" diagnostic guide. Bridges multiple converter tools
  // (heictojpg, compressimage, zipfile, composepdf, etc) for the
  // generic post-conversion no-download-link reader pain point.
  // Distinct from 86 existing guides (only ffmpeg-online-conversion-
  // stalled-three-fixes covers a stall pattern, and that one is for
  // the upload-side bottleneck, not the result-link visibility).
  // Lane-D PA-mode mandatory; troubleshooting cluster (non-ZIP);
  // append-only on every existing surface.
  '/guides/download-link-not-appearing-after-conversion-five-fixes.html',
  // Cycle 64 P64.A - "Why HEIC won't open on Windows - three quick
  // fixes" troubleshooting guide. Bridges /heic-to-jpg.html (top
  // revenue page) for the Windows-side codec gap that turns iPhone
  // HEIC photos into "Windows can't open this file" errors. Lane-D
  // PA-mode mandatory; image-conversion cluster (non-ZIP); append-only.
  '/guides/why-heic-wont-open-on-windows-three-fixes.html',
  // Cycle 70 P70.A - "Zip file converter - what it actually does"
  // disambiguation guide. Targets ~5K imp/28d at 0.5-1.8% CTR / pos 8-9.
  // Lane-D PA-mode mandatory; non-ZIP-cluster identity; append-only.
  '/guides/zip-file-converter-what-it-actually-does.html',
  // Cycle 20260519-1 create_new_guide_page - bare-query "zip file
  // converter" guide. Distinct intent angle from the "what it actually
  // does" sibling above: this is a quick how-to / step-by-step rather
  // than a disambiguation.  Cluster: zip entry-point.  GSC 661 imp/0.9%
  // CTR/pos 10 (28d).
  '/guides/zip-file-converter.html',
  // Cycle 71 P71.F - "HEIC to JPG: what the converter actually does
  // (and what it does not)" trust-anchor guide. Sourced verbatim from
  // tool-heictojpg/SKILL.md ## Implemented features + ## NOT implemented
  // (anti-claims). Bridges /heic-to-jpg.html (top revenue page +
  // baseline G15_accretion_drift HIGH on prod) at a NEW URL without
  // touching the indexed copy of /heic-to-jpg.html. Lane-D PA-mode
  // mandatory; image-conversion cluster (non-ZIP); append-only.
  '/guides/heic-to-jpg-claims-what-actually-works.html',
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
  '/guides/zip-compressor.html',
  // Cycle6 of 20260513-6 — "Compress ZIP" Lane-D append-only guide
  // (zip cluster, companion to /zip-tools/zip-file.html and
  // /guides/zip-compressor.html). Phase A skeleton only — JSP wrapper +
  // INFO_ROUTES/GUIDE_ROUTES/JSP_BY_ROUTE entries. Synth fan-out emitted
  // the non-kebab form /guides/compresszip.html and a plural guides/
  // JSP subdir; this cycle applies the kebab + singular guide/ subdir
  // convention established by the prior granted cards (six cards now in
  // chain: filecompressor, lcdtest, zipfilecompressor, compresszipfile,
  // howtocompressafolder, zipcompressor; this is the seventh).
  '/guides/compress-zip.html',
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
  '/guides/zip-password-recovery-online.html',
  // Cycle 20260518-22 create_new_guide_page - "Zip compressor online" Lane-D
  // guide (zip cluster head-query sibling, GSC "zip compressor online"
  // 611 imp / 57 clicks / pos 6.99 / CTR 9.33% / opportunity_score 79.22).
  // Companion to /zip-tools/zip-file.html (the in-browser archive creator)
  // and /guides/zip-compressor.html (the bare-query sibling). Singular
  // kebab URL passes the URL convention regex; smashed form
  // "zipcompressoronline" does not shadow any existing primary route.
  '/guides/zip-compressor-online.html',
  // Cycle 20260518-23 create_new_guide_page - "Folder to zip" Lane-D guide
  // (zip cluster, GSC "folder to zip" 773 imp / 13 clicks / pos 9.73 /
  // CTR 1.68% / opportunity_score 78.12). Companion to /zip-tools/zip-file.html
  // (the in-browser archive creator). Kebab URL passes URL convention regex;
  // smashed form "foldertozip" does not shadow any existing primary route.
  '/guides/folder-to-zip.html',
  // Cycle 20260518-25 create_new_guide_page - "Online Zip File" Lane-D guide
  // (zip cluster, GSC "online zip file" 573 imp / 12 clicks / pos 7.39 /
  // CTR 2.09% / opportunity_score 75.94). Companion to /zip-tools/zip-file.html.
  // Kebab URL passes URL convention regex; smashed form "onlinezipfile" does
  // not shadow any existing primary route.
  '/guides/online-zip-file.html',
  // Cycle 20260518-31 create_new_guide_page - "Create Zip File Online" Lane-D
  // guide (zip cluster, GSC "create zip file online" 702 imp / 8 clicks /
  // pos 10.08 / CTR 1.14% / opportunity_score 68.87). Companion to
  // /zip-tools/zip-file.html (the in-browser archive creator). Kebab URL
  // passes URL convention regex; smashed form "createzipfileonline" does not
  // shadow any existing primary route.
  '/guides/create-zip-file-online.html',
  // Cycle 20260518-32 create_new_guide_page - "compactar pasta" Lane-D
  // guide (zip cluster, GSC "compactar pasta" 522 imp / 21 clicks /
  // pos 7.59 / CTR 4.02% / opportunity_score 66.02). Portuguese folder
  // compression intent. Companion to /zip-tools/zip-file.html. Kebab URL
  // passes URL convention regex; smashed form "compactarpasta" does not
  // shadow any existing primary route.
  '/guides/compactar-pasta.html',
  // Cycle 20260520-11 new_guide_page_proposal (developer cluster):
  // implementing tool /js-unminifier.html. GSC 545 imp / 3 clicks /
  // pos 10.12 / CTR 0.55% / opportunity_score 53.55.
  '/guides/unminify-js.html',
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
  '/guides/heic-vs-jpg-vs-webp.html',
  '/guides/dead-pixel-testing-guide.html',
  '/guides/unix-timestamps-explained.html',
  '/guides/pdf-password-types-owner-vs-user.html',
  '/guides/png-vs-svg-when-to-use.html',
  '/guides/css-minifier-vs-compressor.html',
  // Cycle 74 P74.B - JSON parser sub-feature disambiguation Lane-D guide.
  '/guides/json-parser-validate-vs-format-vs-tree-view.html',
  // Cycle 75 P75.B - milliseconds-to-date UTC-vs-local-time Lane-D guide.
  '/guides/milliseconds-to-date-utc-vs-local-time.html',
  // Cycle 76 P76.A - screen-test-online-vs-app accuracy Lane-D guide (device-test cluster).
  '/guides/screen-test-online-vs-app-which-is-more-accurate.html',
  // Cycle 77 P77.A - "compress ZIP to a specific size" Lane-D append-only guide.
  '/guides/how-to-compress-a-zip-file-to-a-specific-size.html',
  // Cycle 20260519-10 create_new_guide_page - "how to compress a zip file" bare-query step-by-step guide.
  '/guides/how-to-compress-a-zip-file.html',
  // Cycle 20260519-11 create_new_guide_page - "zip folder online free" bare-query step-by-step guide (companion to /zip-file.html).
  '/guides/zip-folder-online-free.html',
  // Cycle 78 P78.A - "QR code error correction and scan failures" Lane-D guide (companion to /qr-code-generator.html).
  '/guides/qr-code-error-correction-and-scan-failures.html',
  // Cycle 79 P79.B - "Image to Base64: embed in HTML/CSS vs link the image file" Lane-D guide.
  '/guides/image-to-base64-embed-in-html-vs-link.html',
  // Cycle 80 P80.G - "How to test a touchscreen for bad spots" Lane-D guide (device-test cluster).
  '/guides/how-to-test-a-touchscreen-for-bad-spots.html',
  // Cycle 81 P81.A - "Webcam mirror vs flip explained" Lane-D guide (camera-test sub-cluster).
  '/guides/camera-mirror-vs-flip-explained.html',
  // Cycle 82 P82.A - "CSS Unminifier vs Prettier: when to use each" Lane-D guide (developer / CSS sub-cluster).
  '/guides/css-unminifier-vs-prettier-when-to-use-each.html',
  // Cycle 83 P83.A - "LED test vs LCD test: which applies to your screen?" Lane-D guide (device-test / lcd-test sub-cluster).
  '/guides/led-test-vs-lcd-test-which-applies-to-your-screen.html',
  // Cycle 233 P233.E - "OLED test vs LCD test: what changes on an OLED panel" Lane-D guide (device-test / lcd-test sub-cluster, companion to /lcd-test.html). Multi-cycle skeleton phase 1.
  '/guides/oled-test-vs-lcd-test-what-changes-on-oled.html',
  // Cycle 20260517-7 P7.A - "LED test" Lane-D create_new_guide_page (device-test / lcd-test sub-cluster, companion to /lcd-test.html). GSC 28d "led test" 888 imp at pos 8.5 CTR 2% with no dedicated short-tail guide; existing /guides/led-test-vs-lcd-test-which-applies-to-your-screen.html answers the disambiguation question but the bare "led test" query lands on /lcd-test.html with no on-page framing. New URL routes the short query to the implementing tool with one paragraph of context. Append-only.
  '/guides/led-test.html',
  // Cycle 84 P84.A - "How to compress a JPG for email attachment size limits" Lane-D guide (image-conversion / compression sub-cluster, companion to /compress-image.html).
  '/guides/how-to-compress-a-jpg-for-email-attachment-limits.html',
  // Cycle 85 P85.A - "Microphone test levels: what quiet, normal, and peak mean" Lane-D guide (device-test / microphone-test sub-cluster, companion to /microphone-test.html).
  '/guides/microphone-test-online-quiet-normal-peak-meter.html',
  // Cycle 86 P86.A - "Camera test permission blocked: how to allow camera access in your browser" Lane-D guide (device-test / camera-test sub-cluster, companion to /camera-test.html).
  '/guides/camera-test-permission-blocked-how-to-allow-it.html',
  // Cycle 87 P87.A - "Microphone test permission blocked: how to allow mic access in your browser" Lane-D guide (device-test / microphone-test sub-cluster, companion to /microphone-test.html, symmetric peer to cycle-86 P86.A).
  '/guides/microphone-test-permission-blocked-how-to-allow-it.html',
  // Phase 8 Cycle 3 §3.4 greenfield guides.
  '/guides/mp4-vs-webm-for-web.html',
  '/guides/jpg-vs-png-for-web.html',
  '/guides/md5-vs-sha256-when-to-hash.html',
  '/guides/csv-vs-json-data-formats.html',
  '/guides/pdf-vs-heic-for-document-archival.html',
  '/guides/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html',
  '/guides/how-to-convert-100-heic-photos-to-jpg.html',
  '/guides/how-to-test-for-dead-pixels-before-returning-a-monitor.html',
  '/guides/how-to-sign-pdf-after-removing-a-password.html',
  '/guides/how-to-extract-frames-from-a-gif-for-a-social-post.html',
  '/guides/how-to-check-webcam-and-microphone-before-an-interview.html',
  '/guides/how-to-minify-css-js-for-cloud-run-cold-start.html',
  '/guides/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html',
  // Phase 10 Cycle 4 P10.3.4.
  '/guides/when-to-compress-vs-convert-an-image.html',
  // Phase 11 Cycle 4 P11.3.3.
  '/guides/how-to-compress-a-folder-for-email.html',
  // Phase 11 Cycle 5 P11.2.1 + P11.3.5.
  '/guides/device-test-checklist-for-remote-work.html',
  '/guides/pdf-editing-ladder.html',
  // Phase 13 Cycle 2.1 P13.2.1.
  '/guides/file-compressor-vs-zip-what-to-pick.html',
  // Phase 13 Cycle 2.2 P13.2.2.
  '/guides/heic-vs-jpg-converter-when-each-wins.html',
  // Phase 16 Cycle A P16.N1 / P16.N2 / P16.N4.
  '/guides/what-is-a-file-compressor-and-which-to-use.html',
  '/guides/how-to-compress-a-file-online.html',
  '/guides/how-to-reduce-zip-file-size-online.html',
  '/guides/how-to-reduce-zip-file-size.html',
  // Cycle 121 P121.G - "file compressor" HEAD-query aggregator landing.
  '/guides/file-compressor.html',
  // Cycle 122 P122.A - "test lcd" / "lcd tester" / "lcd test online" HEAD-query
  // disambiguation aggregator (combined ~7.7K impr/28d at pos 5-8); routes
  // intent to /lcd-test.html action tool.
  '/guides/test-lcd.html',
  // Cycle 20260518-30 P30.E - "lcd checker" / "lcd check" / "monitor checker"
  // / "screen checker" Lane-D guide. Sibling to /guides/test-lcd.html for
  // the verification-framing query family. Same destination tool.
  '/guides/lcd-checker.html',
  // Phase 16 Cycle B P16.N11 / P16.N16.
  '/guides/how-to-convert-heic-to-jpg-step-by-step.html',
  '/guides/what-an-lcd-test-does-and-when-to-run-one.html',
  // Cycle 20260517-6 create_new_guide_page - "ms to date" synonym-coverage guide.
  '/guides/ms-to-date.html',
  // Cycle 20260517-21 create_new_guide_page - "convert milliseconds to date" exact-match landing (GSC 482 imp / 3 clicks / pos 6.02 / CTR 0.62% / opp 79.59). Implementing tool: /convert-time-in-millisecond-to-date.html. Non-cannibalizing - existing ms-to-date covers the short synonym; this guide covers the full natural-language query.
  '/guides/convert-milliseconds-to-date.html',
  // Cycle 20260520-12 create_new_guide_page - "millisecond to date" singular-noun landing (GSC 368 imp / 2 clicks / pos 6.86 / CTR 0.54% / opp 53.38). Implementing tool: /convert-time-in-millisecond-to-date.html. Non-cannibalizing - existing /guides/ms-to-date.html covers the abbreviated synonym; /guides/convert-milliseconds-to-date.html covers the verb-led natural-language plural; this guide covers the bare singular-noun query.
  '/guides/millisecond-to-date.html',
  '/guides/how-to-make-a-zip-file-smaller.html',
  '/guides/how-to-compress-zip-file-to-smaller-size.html',
  // Cycle 20260517-9 create_new_guide_page - exact-match "compress zip file to smaller size" landing.
  '/guides/compress-zip-file-to-smaller-size.html',
  '/guides/compress-zip-file-to-100kb.html',
  // Cycle 20260521-12 P29.A create_new_guide_page - "compress zip file to 2mb" enterprise-SMTP-cap-specific landing. Operator-approved via card cycle29-create_new_guide_page-compresszipfileto2mb-cannibalisation-1779338089590 (option a). 2 MB is the historical Exchange / SMTP-relay / legacy-webmail attachment cap; distinct angle from the 100kb sibling. Implementing tool /zip-file.html.
  '/guides/compress-zip-file-to-2mb.html',
  // Cycle 20260517-10 create_new_guide_page - exact-match "zip size reducer" landing (GSC 605 imp / 56 clicks / pos 5.67 / CTR 9.26%; opportunity_score 96.84).
  '/guides/zip-size-reducer.html',
  // Cycle 20260519-12 create_new_guide_page - exact-match "zip file size compressor" landing (GSC 354 imp / 44 clicks / pos 5.43 / CTR 12.43%; opportunity_score 57.07). Implementing tool /zip-file.html. Append-only; non-cannibalizing vs /guides/how-to-make-a-zip-file-smaller.html, /guides/zip-size-reducer.html, /guides/compress-zip-file-to-smaller-size.html (each targets a distinct head-tail intent).
  '/guides/zip-file-size-compressor.html',
  // Cycle 20260519-15 create_new_guide_page — "resize zip file" routing/disambiguation Lane-D guide (GSC 406 imp / 19 clicks / pos 6.83 / CTR 4.68%; opportunity_score 56.6). Distinguishing role: addresses the three-way wording ambiguity (shrink vs split vs shrink-photo-inputs-first), routes to the existing shrink / split / image-resize guides — not a 10th compress-zip duplicate.
  '/guides/resize-zip-file.html',
  // Cycle 20260520-16 create_new_guide_page — Indonesian-language guide "kompres file zip" (GSC 338 imp / 13 clicks / pos 6.36 / CTR 3.85%; opportunity_score 51.12). Implementing tool /zip-file.html. Companion sibling to /guides/comprimir-zip-online.html (Spanish) and /guides/compactar-pasta.html (Portuguese).
  '/guides/kompres-file-zip.html',
  '/guides/online-zip-vs-7z-vs-rar-which-to-pick.html',
  '/guides/how-to-zip-multiple-files-into-one.html',
  '/guides/how-to-zip-folder-online-step-by-step.html',
  '/guides/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html',
  '/guides/recover-corrupt-zip-file-options.html',
  '/guides/iphone-photo-format-explained-heic-jpg-png-raw.html',
  '/guides/how-to-convert-iphone-photo-to-jpg.html',
  '/guides/jpg-vs-jpeg-are-they-the-same.html',
  '/guides/svg-to-png-when-to-rasterize-an-svg.html',
  '/guides/how-to-check-camera-quality-on-your-phone.html',
  '/guides/microphone-test-online-what-it-actually-checks.html',
  '/guides/keyboard-tester-online-rollover-vs-anti-ghosting.html',
  '/guides/why-md5-cannot-be-decrypted.html',
  // Cycle 20260518-24 P24.E — "md5 decode" reader-vocabulary routing guide (distinguishing role).
  '/guides/md5-decode.html',
  // Cycle 20260518-28 — "md5 decrypt online" wording routing guide. Same one-way truth as md5-decode but framed
  // around the "decrypt" search wording (more specific; carries the password-recovery sub-intent). Distinct from
  // /guides/why-md5-cannot-be-decrypted.html (cryptographic walkthrough) and /guides/md5-decode.html (broader
  // wording routing). Outbound link to /md5-converter.html.
  '/guides/md5-decrypt-online.html',
  // Cycle 20260520-17 — "md5 hash decrypt" dictionary-attack-feasibility guide.
  '/guides/md5-hash-decrypt.html',
  '/guides/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html',
  '/guides/json-vs-yaml-vs-toml-config-formats-explained.html',
  '/guides/css-minifier-vs-uglifier-vs-tree-shaking.html',
  '/guides/base64-when-to-use-and-when-not-to.html',
  '/guides/how-to-split-a-gif-into-frames-for-editing.html',
  '/guides/how-to-crop-and-rotate-an-image.html',
  '/guides/photo-editor-vs-graphics-app-vs-batch-processor.html',
  '/guides/mp4-vs-mov-vs-mkv-which-container-when.html',
  '/guides/free-online-tools-that-work-without-uploading-files.html',
  '/guides/qr-code-generator-best-practices.html',
  // Cycle 20260520-10 - "gif into frames" head-query guide; companion to /extract-gif-to-image-frames.html
  '/guides/gif-into-frames.html',
  // Workstream B sample batch - 2026-04-30
  '/guides/how-to-compress-a-folder.html',
  '/guides/lcd-test-what-it-checks.html',
  // /guides/lcdtest.html ALIAS → /guides/lcd-test-online.html (cycle 20260514-6-followup)
  // — see ALIAS_ROUTES. The kebab URL below is the canonical one in sitemap-guides.xml.
  '/guides/lcd-test-online.html',
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
  '/guides/screen-display-test-synonyms.html',
  // Cycle 27 P27.C - keyboard-test how-to guide (Lane-D PA-mode mandatory).
  '/guides/how-to-test-a-keyboard-online-step-by-step.html',
  // Cycle 28 P28.A - PNG vs JPG output-format comparison guide for the
  // /extract-gif-to-image-frames.html tool (Lane-D PA-mode mandatory;
  // image-editing cluster).
  '/guides/extract-gif-frames-png-vs-jpg-which-format.html',
  // Cycle 29 P29.B - GIF frames vs GIF frame rate (FPS) explainer; same
  // tool, orthogonal question to cycle-28 P28.A. Lane-D PA-mode mandatory;
  // image-editing cluster.
  '/guides/gif-frames-extract-vs-frame-rate-fps-explained.html',
  // Cycle 30 P30.A - MD5 alternatives (bcrypt vs Argon2id vs SHA-256)
  // decision guide. Lane-D PA-mode mandatory; guide,developer cluster.
  '/guides/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html',
  // Cycle 31 P31.A - camera-test black-screen diagnostic-flow guide.
  '/guides/camera-test-shows-black-screen-four-fixes.html',
  // Cycle 34 P34.A - microphone-test no-sound diagnostic-flow guide.
  '/guides/microphone-test-no-sound-four-fixes.html',
  // Cycle 35 P35.A - keyboard-test keys-not-detected diagnostic-flow guide.
  '/guides/keyboard-test-keys-not-detected-four-fixes.html',
  // Cycle 37 P37.A - JPEG quality-vs-size decision-table guide for /compress-image.html.
  '/guides/compress-jpeg-without-losing-quality-quality-vs-size.html',
  // Cycle 38 P38.A - "is this long number a timestamp?" diagnostic-flow guide.
  '/guides/long-number-millisecond-or-second.html',
  // Cycle 39 P39.A - "compressed JPG looks blurry, why?" reactive diagnostic-flow guide.
  '/guides/compressed-jpg-looks-blurry-three-causes.html',
  // Cycle 40 P40.A - "online ffmpeg conversion stalled, why?" reactive diagnostic-flow guide.
  '/guides/ffmpeg-online-conversion-stalled-three-fixes.html',
  // Cycle 41 P41.A - "GIF frame extractor output looks wrong, why?" reactive diagnostic-flow guide.
  '/guides/gif-frame-extractor-output-looks-wrong-three-causes.html',
  // Cycle 20260514-9 create_new_guide_page - "gif frame extractor" head-term
  // Lane-D guide. Implementing tool: /extract-gif-to-image-frames.html.
  '/guides/gif-frame-extractor.html',
  // Cycle 42 P42.A - "LCD test vs display test vs monitor test - which one do you actually need?" reactive disambiguation-flow guide.
  '/guides/lcd-test-vs-display-test-which-do-you-need.html',
  // Cycle 43 P43.B - "Camera test vs webcam test vs camera quality - which one do you actually need?" reactive disambiguation-flow guide.
  '/guides/camera-test-vs-webcam-test-which-do-you-need.html',
  // Cycle 73 P73.B - "Screen test vs camera test - which one do you actually need?" cross-cluster disambiguation Lane-D guide.
  '/guides/screen-test-vs-camera-test-pick-the-right-tool.html',
  // Cycle 44 P44.A - "MD5 to text - why you cannot convert it back, and what to do instead" disambiguation/decision guide.
  '/guides/md5-to-text-why-you-cannot-convert-back.html',
  // Cycle 46 P46.B - "Before a video call - which tools to run (screen / camera / microphone)" pre-call checklist guide.
  '/guides/before-a-video-call-which-tools-to-run.html',
  // Cycle 48 P48.A - laptop-specific screen-test 5-minute checklist guide (Bing under-served laptop reader-task gap).
  '/guides/screen-test-for-laptop-5-minute-checklist.html',
  // Cycle 49 P49.A - "FFmpeg Online vs Video Converter - which tool to open" routing guide (GSC "ffmpeg online" op_score 270.97 row).
  '/guides/ffmpeg-online-vs-video-converter-which-to-pick.html',
  // Cycle 50 P50.A - "ImageMagick Online vs Task-Specific Tools - which to pick" routing guide (image-editing-cluster parallel to cycle 49 P49.A; GA4 /imagemagick-online.html 114 sess / 0.51 engagement cohort).
  '/guides/imagemagick-online-vs-task-specific-tools-which-to-pick.html',
  // Cycle 51 P51.A - "File Compressor Online: ZIP a Folder vs Compress an Image" routing guide (GSC "file compressor" 258,156 imp / 0.04% CTR / pos 9.9 / 12,797 missed clicks 28d - cross-cluster routing surface for the head term that neither /zip-file.html nor /compress-image.html owns alone).
  '/guides/file-compressor-online-when-to-zip-vs-when-to-compress-image.html',
  // Cycle 53 P53.A - "How to Extract a File Online - ZIP, RAR, 7z" routing guide (GSC "extract file online" -9.3 pos in 7d, "file zipper" -8.9 pos; neither owned by an existing guide. .zip -> /unzip-file.html; .rar / .7z -> local OS tool; forgotten-password .zip -> /remove-zip-password.html).
  '/guides/how-to-extract-a-file-online-zip-rar-7z.html',
  // Cycle 54 P54.A - "How to choose a compression level - quality vs file size, with examples" guide. Captures the long-tail "compress image to 100kb / 200kb / 500kb" + "what compression level should I use" decision intent on /compress-image.html. Routes to /resize-image.html when pixel dimensions matter and to format-choice guides when the format is wrong. Append-only Lane-D guide.
  '/guides/how-to-choose-a-compression-level.html',
  // Cycle 55 P55.A - "ZIP password types - strong vs weak, explained" guide.
  // Trust-gate education on /remove-zip-password.html (top-2 traffic ZIP-cluster URL).
  // Explains legacy ZIP 2.0 vs WinZip AES-256, password strength interaction, and the
  // 30-second decision flow before a reader uploads. Append-only Lane-D guide; non-ZIP-cluster URL.
  '/guides/zip-password-types-strong-vs-weak-explained.html',
  // Cycle 56 P56.A - "PDF preflight online: what it actually checks" guide.
  // Lane-D fresh-capture on the search-vocabulary gap upstream of /preflight-pdf.html
  // (Bing pos 3-20 across the preflight/validator/check vocabulary). PDF cluster
  // had only 4 existing guides vs 13+ PDF tools - clearest cluster gap on the site.
  // Explains preflight as a check step (not a fix step), what /preflight-pdf.html
  // validates (PDF/A archival conformance), and what is out-of-scope (PDF/X print,
  // signature legal-validity, corrupt-PDF repair, PDF/UA). Append-only Lane-D guide.
  '/guides/pdf-preflight-online-what-it-actually-checks.html',
  // Cycle 58 P58.A - "Read and compare MD5 hashes correctly" guide.
  // Post-conversion verification flow downstream of /md5-converter.html.
  // Distinct from 4 existing MD5 guides; covers cosmetic vs real
  // differences (case, whitespace, BOM, hex format) plus the 5-step
  // compare flow. Append-only Lane-D guide; non-ZIP cluster.
  '/guides/read-and-compare-md5-hashes-correctly.html',
  // Cycle 59 P59.A - "How to tell if a JPG was compressed too much"
  // guide. Bridges /get-jpeg-compression-level.html (assess-after the
  // upload). Distinct from /guides/how-to-choose-a-compression-level
  // (choose-before). Image-conversion / image-editing cluster;
  // non-ZIP; append-only Lane-D guide.
  '/guides/how-to-tell-if-a-jpg-was-compressed-too-much.html',
  // Cycle 60 P60.A - "How to flatten a PDF - and when to do it" guide.
  // Bridges /flatten-pdf.html (server-side flatten via FlattenPdfService).
  // Distinct from 6 existing PDF guides. PDF cluster; non-ZIP;
  // append-only Lane-D guide.
  '/guides/how-to-flatten-a-pdf-and-when-to-do-it.html',
  // Cycle 61 P61.A - "PNG to SVG - when to vectorize a raster image"
  // guide. Bridges /png-to-svg.html (server-side raster-to-vector
  // via the freetoolonline AWS service). Image-conversion cluster;
  // non-ZIP; append-only Lane-D guide.
  '/guides/png-to-svg-when-to-vectorize-a-raster-image.html',
  // Cycle 62 P62.E - "Download link not appearing after conversion -
  // 5 fixes" diagnostic guide. Bridges multiple converter tools.
  // Troubleshooting cluster; non-ZIP; append-only Lane-D guide.
  '/guides/download-link-not-appearing-after-conversion-five-fixes.html',
  // Cycle 64 P64.A - "Why HEIC won't open on Windows - three quick
  // fixes" troubleshooting guide. Bridges /heic-to-jpg.html top revenue
  // page; image-conversion cluster; non-ZIP; append-only Lane-D guide.
  '/guides/why-heic-wont-open-on-windows-three-fixes.html',
  // Cycle 70 P70.A - "Zip file converter - what it actually does"
  // disambiguation guide. Targets the GSC `zip file converter` /
  // `zip files online` / `make zip file online` / `folder to zip
  // converter` cluster (~5K imp / 28d at 0.5-1.8% CTR / pos 8-9).
  // Reader confusion: ZIP is a container, not a format. Outbound link
  // only to /zip-file.html, /unzip-file.html, /compress-image.html,
  // /heic-to-jpg.html, /compose-pdf.html. NO satellite backlink on
  // /zip-file.html (ZIP-CRITICAL-CARE 24h cooldown). Cluster: zip
  // entry-point. Lane-D PA-mode mandatory; non-ZIP-cluster identity.
  '/guides/zip-file-converter-what-it-actually-does.html',
  // Cycle 20260519-1 - bare-query "zip file converter" guide.
  '/guides/zip-file-converter.html',
  // Cycle 71 P71.F - "HEIC to JPG: what the converter actually does
  // (and what it does not)" trust-anchor guide. Source-cited claims
  // from tool-heictojpg/SKILL.md (libheif, SlimJpg, EXIF toggle, quality
  // slider, multi-format output). Anti-claims also surfaced (NOT
  // browser-only, NOT account-gated, does NOT extract live-photo
  // motion). Lane-D PA-mode mandatory; image-conversion cluster.
  '/guides/heic-to-jpg-claims-what-actually-works.html',
  // Backfill: cycle 88 + cycle 90 guides were added to INFO_ROUTES but
  // omitted from GUIDE_ROUTES. Without GUIDE_ROUTES membership they
  // lose Article JSON-LD, Organization JSON-LD, editorial-byline, AND
  // (post-2026-05-11 showAdSlots split) AdSense loading. Append-only.
  '/guides/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html',
  '/guides/image-compression-and-exif-metadata-what-gets-stripped.html',
  // Cycle1 of 20260513-5 P5.A - "Zip compressor" Lane-D guide. Phase A
  // skeleton (route + JSP wrapper) only. Kebab URL per granted cards.
  '/guides/zip-compressor.html',
  // Cycle6 of 20260513-6 — "Compress ZIP" Lane-D guide. Phase A skeleton
  // (route + JSP wrapper) only. Kebab + singular guide/ JSP subdir.
  '/guides/compress-zip.html',
  // Cycle 20260515-16 — "Compress ZIP Size" Lane-D guide. Complete single-cycle
  // ship: compressibility table + DEFLATE level explainer + routing to
  // /zip-tools/zip-file.html. Cluster=zip.
  '/guides/compress-zip-size.html',
  // Cycle 20260515-12 — "Make Zip File Online" Lane-D guide (zip cluster,
  // companion to /zip-tools/zip-file.html). Complete single-cycle ship.
  '/guides/make-zip-file-online.html',
  // Cycle 20260515-13 — "Comprimir Zip Online" Lane-D guide (zip cluster,
  // Spanish-keyword sibling of /guides/make-zip-file-online.html;
  // companion to /zip-tools/zip-file.html). Complete single-cycle ship.
  '/guides/comprimir-zip-online.html',
  // Cycle 20260519-14 — "Comprimir Carpeta Zip Online Gratis" Lane-D guide
  // (zip cluster, Spanish folder-compression intent; 348 imp / 36 clicks /
  // pos 5.49 / CTR 10.34% per 28d GSC; opportunity_score 56.79). Companion
  // to /zip-file.html. Native Spanish prose authored against tool-zipfile
  // SKILL features. Phase A complete single-cycle ship.
  '/guides/comprimir-carpeta-zip-online-gratis.html',
  // Cycle 20260515-15 — "Zip File Compressor Online" Lane-D guide (zip
  // cluster head-query; 799 imp / 73 clicks / pos 6.2 / CTR 9.1% per 28d
  // GSC; opportunity_score 117.19). Companion to /zip-tools/zip-file.html.
  // Phase A complete single-cycle ship.
  '/guides/zip-file-compressor-online.html',
  // Cycle 20260517-8 — "Online Zip File Compressor" Lane-D create_new_guide_page
  // (zip cluster head-query sibling; 634 imp / 27 clicks / pos 5.93 / CTR 4.3%
  // per 28d GSC; opportunity_score 102.3). Companion to /zip-tools/zip-file.html.
  // Complete single-cycle ship per cycle 20260514-5 contract.
  '/guides/online-zip-file-compressor.html',
  // Cycle 20260518-20 create_new_guide_page - "Zip Compress" Lane-D guide (zip
  // cluster head-query sibling; 744 imp / 26 clicks / pos 7.71 / CTR 3.49%
  // per 28d GSC; opportunity_score 93.06). Companion to /zip-tools/zip-file.html.
  // Complete single-cycle ship per cycle 20260514-5 contract.
  '/guides/zip-compress.html',
  // Cycle 20260518-21 create_new_guide_page - "Zip password recovery online"
  // Lane-D truthful-framing guide. Cluster: zip. GSC 690 imp / 147 clicks /
  // pos 6.17 / CTR 21.3% / opportunity_score 87.95. Sourced from
  // tool-removezippassword/SKILL.md F1-F7 + N2 + N6 (the tool unlocks when
  // password is KNOWN; explicitly does NOT crack unknown passwords).
  '/guides/zip-password-recovery-online.html',
  // Cycle 20260518-22 create_new_guide_page - "Zip compressor online" Lane-D
  // guide. Cluster: zip. GSC 611 imp / 57 clicks / pos 6.99 / CTR 9.33% /
  // opportunity_score 79.22. Sourced from tool-zipfile/SKILL.md M1-M7 +
  // tool-guidescompresszip/SKILL.md C1-C6 (size question vs archive question;
  // browser-creator routing; sibling-guide vocabulary disambiguation).
  '/guides/zip-compressor-online.html',
  // Cycle 20260518-23 create_new_guide_page - "Folder to zip" Lane-D guide
  // (zip cluster, companion to /zip-tools/zip-file.html). GSC 773 imp / 13
  // clicks / pos 9.73 / CTR 1.68% / opportunity_score 78.12 — folder-to-archive
  // intent. Paraphrases tool-ziptools/SKILL.md M1 (one-click routing) and
  // tool-guidescompresszip/SKILL.md C1-C5 (size question vs archive question
  // for folder inputs).
  '/guides/folder-to-zip.html',
  // Cycle 20260518-25 create_new_guide_page - "Online Zip File" Lane-D guide
  // (zip cluster, companion to /zip-tools/zip-file.html). GSC 573 imp / 12
  // clicks / pos 7.39 / CTR 2.09% / opportunity_score 75.94 — "online zip file"
  // intent (zip-file as a noun, not as a verb). Paraphrases tool-zipfile/SKILL.md
  // M1-M7 (in-browser creator) and tool-ziptools/SKILL.md M1 (one-click routing).
  '/guides/online-zip-file.html',
  // Cycle 20260518-31 create_new_guide_page - "Create Zip File Online" Lane-D
  // guide (zip cluster, companion to /zip-tools/zip-file.html). GSC 702 imp /
  // 8 clicks / pos 10.08 / CTR 1.14% / opportunity_score 68.87 - "create zip
  // file online" intent (the verb-led companion to "online zip file"). Paraphrases
  // tool-zipfile/SKILL.md implemented features (upload + server-side build +
  // optional password + cross-platform output) and the existing in-browser
  // creator copy in BODYHTMLzipfile / BODYWELCOMEzipfile.
  '/guides/create-zip-file-online.html',
  // Cycle 20260518-33 create_new_guide_page - "Tes LCD" Lane-D guide (device-test
  // cluster, companion to /lcd-test.html). GSC 503 imp / 17 clicks / pos 7.38 /
  // CTR 3.38% / opportunity_score 65.84 - Indonesian-language "tes lcd" intent
  // (Indonesian for "lcd test"). Authored in Indonesian to serve the actual
  // search audience (GA4 ID share ~6% of sessions). Paraphrases
  // tool-lcdtest/SKILL.md F1-F5 (six-color full-viewport fill + full-screen
  // toggle + reset + display metrics + no-upload disclosure). Kebab slug
  // /guides/tes-lcd.html does not shadow any existing primary tool route
  // (urlToSlug() smashes to "teslcd" which is not in JSP_BY_ROUTE).
  '/guides/tes-lcd.html',
  // Cycle 20260518-29 create_new_guide_page - "zip password unlocker" Lane-D
  // guide (zip cluster, companion to /remove-zip-password.html). GSC 432 imp /
  // 44 clicks / pos 5.29 / CTR 10.18% / opportunity_score 73.32. Honest framing:
  // splits the search intent into "remove a known password" (real, points at
  // /remove-zip-password.html) vs "crack an unknown password" (not solvable
  // online; cites tool-removezippassword/SKILL.md N2 + N6 anti-claims).
  '/guides/zip-password-unlocker.html',
  // Cycle 20260518-32 create_new_guide_page - "compactar pasta" Lane-D guide
  // (zip cluster, companion to /zip-tools/zip-file.html). GSC 522 imp /
  // 21 clicks / pos 7.59 / CTR 4.02% / opportunity_score 66.02 - Portuguese
  // "compactar pasta" intent (compress folder). Paraphrases tool-zipfile/SKILL.md
  // BODYHTML (folder + multi-file zip, optional password Standard/AES-128/AES-256,
  // browser-side UI) and the existing /zip-file.html action description.
  '/guides/compactar-pasta.html',
  // Cycle 20260520-11 new_guide_page_proposal (developer cluster):
  // implementing tool /js-unminifier.html.
  '/guides/unminify-js.html',
  // Cycle 20260520-13 new_guide_page_proposal (device-test cluster, companion
  // to /lcd-test.html). "lcd screen test" head-tail query. Paraphrases
  // tool-lcdtest/SKILL.md F1-F5. Kebab slug /guides/lcd-screen-test.html
  // does not shadow /lcd-test.html (smashed form "lcdscreentest" is unique).
  '/guides/lcd-screen-test.html',
  // Cycle 20260520-15 new_guide_page_proposal (zip cluster, disambiguation
  // guide for "unlock zip file online" query — routes between
  // /remove-zip-password.html (password-protected ZIPs) and
  // /unzip-file.html (plain ZIPs). GSC: 421 impressions / 40 clicks / pos 7.4.
  // Kebab slug /guides/unlock-zip-file-online.html does not shadow any
  // existing route (smashed form "unlockzipfileonline" is unique).
  '/guides/unlock-zip-file-online.html',
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
  '/how-to-compress-a-folder.html': '/guides/how-to-compress-a-folder.html',
  // Cycle142 P142.A — capture bare URL traffic to canonical LCD test page (4843 imp / 28d, pos 7.8, CTR 1.28% per GSC; per granted P141.LaneD-residual-saturated-guides option-a).
  '/test-lcd.html': '/device-test-tools/lcd-test.html',
  // Cycle143 P143.A — capture bare URL traffic for "how to compress a file" head-query (5384 imp / 28d, pos 10.65, CTR 0.02% per GSC). Bare URL currently 200-serves the homepage (canonical=/), so Google sees a homepage routing for a file-compression intent. Aliasing into the existing canonical guide page captures the traffic without authoring a parallel page that would cannibalize.
  '/how-to-compress-a-file.html': '/guides/how-to-compress-a-file-online.html',
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
  '/how-to-make-a-zip-file-smaller.html': '/guides/how-to-make-a-zip-file-smaller.html',
  // Cycle 20260519-18 P18.E (create_new_guide_page re-route per cannibalization grant cycle 17). Capture bare-query traffic for "make zip file smaller" (369 imp / 24 clicks / pos 6.17 / CTR 6.5% per GSC) without splitting rank with the existing canonical guide. Bare URL /guides/make-zip-file-smaller.html aliases to /guides/how-to-make-a-zip-file-smaller.html (the canonical long-form guide). Per cycle 17 grant `new-guide-make-zip-file-smaller-cannibalization-cycle17` option (b) — "re-route the synth to /guides/how-to-make-a-zip-file-smaller.html". Route-table-only edit; no indexed-copy change.
  '/guides/make-zip-file-smaller.html': '/guides/how-to-make-a-zip-file-smaller.html',
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
  '/guides/lcdtest.html': '/guides/lcd-test-online.html',         // smashed "lcd test"; canonical = lcd-test-online (new guide created cycle 20260514-5)
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
  '/guides/lcd-tes.html': '/guides/lcd-test-online.html',         // typo of "lcd test"; canonical = lcd-test-online (cluster anti-cannibalization)
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
  '/guides/heic-vs-jpg-vs-webp.html': 'guide/heic-vs-jpg-vs-webp.jsp',
  '/guides/dead-pixel-testing-guide.html': 'guide/dead-pixel-testing-guide.jsp',
  '/guides/unix-timestamps-explained.html': 'guide/unix-timestamps-explained.jsp',
  '/guides/pdf-password-types-owner-vs-user.html': 'guide/pdf-password-types-owner-vs-user.jsp',
  // §3.5 comparison guides (Cycle 4).
  '/guides/png-vs-svg-when-to-use.html': 'guide/png-vs-svg-when-to-use.jsp',
  '/guides/css-minifier-vs-compressor.html': 'guide/css-minifier-vs-compressor.jsp',
  // Cycle 74 P74.B - JSON parser sub-feature disambiguation Lane-D guide.
  '/guides/json-parser-validate-vs-format-vs-tree-view.html': 'guide/json-parser-validate-vs-format-vs-tree-view.jsp',
  // Cycle 75 P75.B - milliseconds-to-date UTC-vs-local-time Lane-D guide.
  '/guides/milliseconds-to-date-utc-vs-local-time.html': 'guide/milliseconds-to-date-utc-vs-local-time.jsp',
  // Cycle 76 P76.A - screen-test-online-vs-app accuracy Lane-D guide (device-test cluster).
  '/guides/screen-test-online-vs-app-which-is-more-accurate.html': 'guide/screen-test-online-vs-app-which-is-more-accurate.jsp',
  // Cycle 77 P77.A - "compress ZIP to a specific size" Lane-D append-only guide.
  '/guides/how-to-compress-a-zip-file-to-a-specific-size.html': 'guide/how-to-compress-a-zip-file-to-a-specific-size.jsp',
  // Cycle 20260519-10 create_new_guide_page - "how to compress a zip file" bare-query step-by-step guide (companion to /zip-file.html).
  '/guides/how-to-compress-a-zip-file.html': 'guide/how-to-compress-a-zip-file.jsp',
  // Cycle 20260519-11 create_new_guide_page - "zip folder online free" bare-query step-by-step guide (companion to /zip-file.html).
  '/guides/zip-folder-online-free.html': 'guide/zip-folder-online-free.jsp',
  // Cycle 78 P78.A - "QR code error correction and scan failures" Lane-D guide (companion to /qr-code-generator.html).
  '/guides/qr-code-error-correction-and-scan-failures.html': 'guide/qr-code-error-correction-and-scan-failures.jsp',
  // Cycle 79 P79.B - "Image to Base64: embed in HTML/CSS vs link the image file" Lane-D guide (companion to /image-to-base64.html + /base64-to-image.html).
  '/guides/image-to-base64-embed-in-html-vs-link.html': 'guide/image-to-base64-embed-in-html-vs-link.jsp',
  // Cycle 80 P80.G - "How to test a touchscreen for bad spots" Lane-D guide (device-test cluster, companion to /lcd-test.html).
  '/guides/how-to-test-a-touchscreen-for-bad-spots.html': 'guide/how-to-test-a-touchscreen-for-bad-spots.jsp',
  // Cycle 81 P81.A - "Webcam mirror vs flip explained" Lane-D guide (camera-test sub-cluster, companion to /camera-test.html).
  '/guides/camera-mirror-vs-flip-explained.html': 'guide/camera-mirror-vs-flip-explained.jsp',
  // Cycle 82 P82.A - "CSS Unminifier vs Prettier: when to use each" Lane-D guide (developer / CSS sub-cluster, companion to /css-unminifier.html).
  '/guides/css-unminifier-vs-prettier-when-to-use-each.html': 'guide/css-unminifier-vs-prettier-when-to-use-each.jsp',
  // Cycle 83 P83.A - "LED test vs LCD test: which applies to your screen?" Lane-D guide (device-test / lcd-test sub-cluster, companion to /lcd-test.html).
  '/guides/led-test-vs-lcd-test-which-applies-to-your-screen.html': 'guide/led-test-vs-lcd-test-which-applies-to-your-screen.jsp',
  // Cycle 233 P233.E - "OLED test vs LCD test: what changes on an OLED panel" Lane-D guide (device-test / lcd-test sub-cluster, companion to /lcd-test.html). Multi-cycle skeleton phase 1.
  '/guides/oled-test-vs-lcd-test-what-changes-on-oled.html': 'guide/oled-test-vs-lcd-test-what-changes-on-oled.jsp',
  // Cycle 20260517-7 P7.A - "LED test" Lane-D create_new_guide_page guide (device-test / lcd-test sub-cluster, companion to /lcd-test.html).
  '/guides/led-test.html': 'guide/led-test.jsp',
  // Cycle1/20260514-5 P1.A - "LCD test online" Lane-D guide (device-test / lcd-test sub-cluster, companion to /lcd-test.html). Multi-cycle Phase A skeleton (route scaffolding only).
  '/guides/lcd-test-online.html': 'guide/lcd-test-online.jsp',
  // Cycle1/20260514-5 create_new_guide_page - "Split GIF into frames" Lane-D guide (image-editing / gif-maker sub-cluster, companion to /gif-maker.html). Multi-cycle Phase A skeleton (route scaffolding only).
  '/guides/split-gif-into-frames.html': 'guide/split-gif-into-frames.jsp',
  // Cycle 20260515-12 create_new_guide_page - "Make Zip File Online" Lane-D guide (zip cluster, companion to /zip-tools/zip-file.html). Complete single-cycle ship per cycle 20260514-5 contract (no skeleton wait).
  '/guides/make-zip-file-online.html': 'guide/make-zip-file-online.jsp',
  // Cycle 20260515-13 create_new_guide_page - "Comprimir Zip Online" Lane-D guide (zip cluster, Spanish-keyword sibling of /guides/make-zip-file-online.html; companion to /zip-tools/zip-file.html). Complete single-cycle ship per cycle 20260514-5 contract.
  '/guides/comprimir-zip-online.html': 'guide/comprimir-zip-online.jsp',
  // Cycle 20260519-14 create_new_guide_page - "Comprimir Carpeta Zip Online Gratis" Lane-D guide (zip cluster, Spanish folder-compression intent; companion to /zip-file.html). Native-Spanish prose authored against tool-zipfile SKILL features. Complete single-cycle ship per cycle 20260514-5 contract.
  '/guides/comprimir-carpeta-zip-online-gratis.html': 'guide/comprimir-carpeta-zip-online-gratis.jsp',
  // Cycle 20260517-8 create_new_guide_page - "Online Zip File Compressor" Lane-D guide (zip cluster head-query sibling, companion to /zip-tools/zip-file.html). Complete single-cycle ship per cycle 20260514-5 contract.
  '/guides/online-zip-file-compressor.html': 'guide/online-zip-file-compressor.jsp',
  // Cycle 20260518-20 create_new_guide_page - "Zip Compress" Lane-D guide (zip cluster head-query sibling, companion to /zip-tools/zip-file.html). Complete single-cycle ship per cycle 20260514-5 contract.
  '/guides/zip-compress.html': 'guide/zip-compress.jsp',
  // Cycle 20260518-21 create_new_guide_page - "Zip password recovery online" Lane-D truthful-framing guide. Companion to /zip-tools/remove-zip-password.html. Source: tool-removezippassword/SKILL.md F1-F7 + N2 + N6.
  '/guides/zip-password-recovery-online.html': 'guide/zip-password-recovery-online.jsp',
  // Cycle 20260518-22 create_new_guide_page - "Zip compressor online" Lane-D guide (zip cluster head-query sibling, companion to /zip-tools/zip-file.html and /guides/zip-compressor.html). Complete single-cycle ship per cycle 20260514-5 contract.
  '/guides/zip-compressor-online.html': 'guide/zip-compressor-online.jsp',
  // Cycle 20260518-23 create_new_guide_page - "Folder to zip" Lane-D guide. Companion to /zip-tools/zip-file.html. Sourced from tool-ziptools/SKILL.md M1 + tool-guidescompresszip/SKILL.md C1-C5.
  '/guides/folder-to-zip.html': 'guide/folder-to-zip.jsp',
  // Cycle 20260518-33 create_new_guide_page - "Tes LCD" Lane-D guide (device-test
  // cluster, companion to /lcd-test.html). Indonesian-language guide for the
  // "tes lcd" search intent. Paraphrases tool-lcdtest/SKILL.md F1-F5.
  '/guides/tes-lcd.html': 'guide/tes-lcd.jsp',
  // Cycle 20260520-16 create_new_guide_page - "Kompres File Zip" Lane-D guide
  // (zip cluster, Indonesian-language sibling to /guides/comprimir-zip-online.html).
  // Companion to /zip-file.html. GSC 28d "kompres file zip" 338 imp / 13 clicks /
  // pos 6.36 / CTR 3.85% / opportunity_score 51.12. Paraphrases tool-zipfile
  // implemented features (server-side bundling, optional AES password, S3-backed
  // download with short retention) into Indonesian reader-task prose.
  '/guides/kompres-file-zip.html': 'guide/kompres-file-zip.jsp',
  // Cycle 20260518-25 create_new_guide_page - "Online Zip File" Lane-D guide. Companion to /zip-tools/zip-file.html. Sourced from tool-zipfile/SKILL.md M1-M7 + tool-ziptools/SKILL.md M1.
  '/guides/online-zip-file.html': 'guide/online-zip-file.jsp',
  // Cycle 20260518-31 create_new_guide_page - "Create Zip File Online" Lane-D guide. Companion to /zip-tools/zip-file.html. Sourced from tool-zipfile/SKILL.md implemented features + BODYHTMLzipfile reader-task copy.
  '/guides/create-zip-file-online.html': 'guide/create-zip-file-online.jsp',
  // Cycle 20260518-32 create_new_guide_page - "compactar pasta" Lane-D guide (zip cluster, Portuguese folder compression intent). Companion to /zip-tools/zip-file.html. Sourced from tool-zipfile BODYHTML/BODYDESC + cluster-sibling Portuguese guide /guides/comprimir-zip-online.html.
  '/guides/compactar-pasta.html': 'guide/compactar-pasta.jsp',
  // Cycle 20260520-11 new_guide_page_proposal (developer cluster):
  // companion to /js-unminifier.html.
  '/guides/unminify-js.html': 'guide/unminify-js.jsp',
  // Cycle 20260520-13 new_guide_page_proposal (device-test cluster, companion
  // to /lcd-test.html). "lcd screen test" query - GSC 382 imp / 6 clicks /
  // pos 7.11 / CTR 1.57% / opportunity_score 52.9. Paraphrases
  // tool-lcdtest/SKILL.md F1-F5 (six-color full-viewport fill + reset hook +
  // viewport metrics + no-upload disclosure). Kebab slug
  // /guides/lcd-screen-test.html does not shadow any existing primary tool
  // route (urlToSlug() smashes to "lcdscreentest" which is not in JSP_BY_ROUTE).
  '/guides/lcd-screen-test.html': 'guide/lcd-screen-test.jsp',
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
  '/guides/unlock-zip-file-online.html': 'guide/unlock-zip-file-online.jsp',
  // Cycle 20260520-10 create_new_guide_page - "GIF into frames" Lane-D guide (image-editing cluster, companion to /extract-gif-to-image-frames.html). Sourced from tool-extractgiftoimageframes BODYTITLE/BODYDESC + Implemented features. Single-cycle ship per cycle 20260514-5 contract. Cannibalization chain from -6 expired (4-cycle window closed).
  '/guides/gif-into-frames.html': 'guide/gif-into-frames.jsp',
  // Cycle 84 P84.A - "How to compress a JPG for email attachment size limits" Lane-D guide (image-conversion / compression sub-cluster, companion to /compress-image.html).
  '/guides/how-to-compress-a-jpg-for-email-attachment-limits.html': 'guide/how-to-compress-a-jpg-for-email-attachment-limits.jsp',
  // Cycle 85 P85.A - "Microphone test levels: what quiet, normal, and peak mean" Lane-D guide (device-test / microphone-test sub-cluster, companion to /microphone-test.html).
  '/guides/microphone-test-online-quiet-normal-peak-meter.html': 'guide/microphone-test-online-quiet-normal-peak-meter.jsp',
  // Cycle 86 P86.A - "Camera test permission blocked: how to allow camera access in your browser" Lane-D guide (device-test / camera-test sub-cluster, companion to /camera-test.html).
  '/guides/camera-test-permission-blocked-how-to-allow-it.html': 'guide/camera-test-permission-blocked-how-to-allow-it.jsp',
  // Cycle 87 P87.A - "Microphone test permission blocked: how to allow mic access in your browser" Lane-D guide (device-test / microphone-test sub-cluster, companion to /microphone-test.html, symmetric peer to cycle-86 P86.A).
  '/guides/microphone-test-permission-blocked-how-to-allow-it.html': 'guide/microphone-test-permission-blocked-how-to-allow-it.jsp',
  // Cycle 88 P88.A - "QR Code Content Types: URL vs vCard vs Wi-Fi vs Text - Which to Pick" Lane-D guide (utility / qr-code-generator sub-cluster, companion to /qr-code-generator.html).
  '/guides/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html': 'guide/qr-code-content-types-url-vcard-wifi-text-which-to-pick.jsp',
  // Cycle 90 P90.A - "EXIF Metadata and Image Compression: What Gets Stripped" Lane-D guide (image-conversion / compress-image sub-cluster, companion to /compress-image.html).
  '/guides/image-compression-and-exif-metadata-what-gets-stripped.html': 'guide/image-compression-and-exif-metadata-what-gets-stripped.jsp',
  // Phase 8 Cycle 3 §3.4 greenfield guides.
  '/guides/mp4-vs-webm-for-web.html': 'guide/mp4-vs-webm-for-web.jsp',
  '/guides/jpg-vs-png-for-web.html': 'guide/jpg-vs-png-for-web.jsp',
  '/guides/md5-vs-sha256-when-to-hash.html': 'guide/md5-vs-sha256-when-to-hash.jsp',
  '/guides/csv-vs-json-data-formats.html': 'guide/csv-vs-json-data-formats.jsp',
  '/guides/pdf-vs-heic-for-document-archival.html': 'guide/pdf-vs-heic-for-document-archival.jsp',
  '/guides/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html': 'guide/ffmpeg-online-vs-local-ffmpeg-when-each-wins.jsp',
  '/guides/how-to-convert-100-heic-photos-to-jpg.html': 'guide/how-to-convert-100-heic-photos-to-jpg.jsp',
  '/guides/how-to-test-for-dead-pixels-before-returning-a-monitor.html': 'guide/how-to-test-for-dead-pixels-before-returning-a-monitor.jsp',
  '/guides/how-to-sign-pdf-after-removing-a-password.html': 'guide/how-to-sign-pdf-after-removing-a-password.jsp',
  '/guides/how-to-extract-frames-from-a-gif-for-a-social-post.html': 'guide/how-to-extract-frames-from-a-gif-for-a-social-post.jsp',
  '/guides/how-to-check-webcam-and-microphone-before-an-interview.html': 'guide/how-to-check-webcam-and-microphone-before-an-interview.jsp',
  '/guides/how-to-minify-css-js-for-cloud-run-cold-start.html': 'guide/how-to-minify-css-js-for-cloud-run-cold-start.jsp',
  '/guides/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html': 'guide/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.jsp',
  // Phase 10 Cycle 4 P10.3.4.
  '/guides/when-to-compress-vs-convert-an-image.html': 'guide/when-to-compress-vs-convert-an-image.jsp',
  // Phase 11 Cycle 4 P11.3.3.
  '/guides/how-to-compress-a-folder-for-email.html': 'guide/how-to-compress-a-folder-for-email.jsp',
  // Phase 11 Cycle 5 P11.2.1 + P11.3.5.
  '/guides/device-test-checklist-for-remote-work.html': 'guide/device-test-checklist-for-remote-work.jsp',
  '/guides/pdf-editing-ladder.html': 'guide/pdf-editing-ladder.jsp',
  '/guides/file-compressor-vs-zip-what-to-pick.html': 'guide/file-compressor-vs-zip-what-to-pick.jsp',
  '/guides/heic-vs-jpg-converter-when-each-wins.html': 'guide/heic-vs-jpg-converter-when-each-wins.jsp',
  // Phase 16 Cycle A P16.N1 / P16.N2 / P16.N4.
  '/guides/what-is-a-file-compressor-and-which-to-use.html': 'guide/what-is-a-file-compressor-and-which-to-use.jsp',
  // Cycle 121 P121.G - "file compressor" HEAD-query aggregator landing.
  '/guides/file-compressor.html': 'guide/file-compressor.jsp',
  // Cycle 122 P122.A - HEAD-query disambiguation aggregator for "test lcd" / "lcd tester" / "lcd test online".
  '/guides/test-lcd.html': 'guide/test-lcd.jsp',
  // Cycle 20260518-30 P30.E - "lcd checker" / "lcd check" / "monitor checker" verification-framing sibling guide.
  '/guides/lcd-checker.html': 'guide/lcd-checker.jsp',
  '/guides/how-to-compress-a-file-online.html': 'guide/how-to-compress-a-file-online.jsp',
  '/guides/how-to-reduce-zip-file-size-online.html': 'guide/how-to-reduce-zip-file-size-online.jsp',
  '/guides/how-to-reduce-zip-file-size.html': 'guide/how-to-reduce-zip-file-size.jsp',
  // Cycle 20260520-9 create_new_guide_page - bare-noun landing for "reduce zip file size online" (implementing tool /zip-file.html).
  '/guides/reduce-zip-file-size-online.html': 'guide/reduce-zip-file-size-online.jsp',
  // Cycle 20260515-15 — "Zip File Compressor Online" Lane-D guide.
  '/guides/zip-file-compressor-online.html': 'guide/zip-file-compressor-online.jsp',
  // Phase 16 Cycle B P16.G1 hub + P16.N11 + P16.N16.
  '/guides.html': 'utility/guides.jsp',
  '/guides/how-to-convert-heic-to-jpg-step-by-step.html': 'guide/how-to-convert-heic-to-jpg-step-by-step.jsp',
  '/guides/what-an-lcd-test-does-and-when-to-run-one.html': 'guide/what-an-lcd-test-does-and-when-to-run-one.jsp',
  // Cycle 20260517-6 create_new_guide_page - "ms to date" synonym-coverage guide.
  '/guides/ms-to-date.html': 'guide/ms-to-date.jsp',
  // Cycle 20260517-21 create_new_guide_page - "convert milliseconds to date" exact-match landing.
  '/guides/convert-milliseconds-to-date.html': 'guide/convert-milliseconds-to-date.jsp',
  // Cycle 20260520-12 create_new_guide_page - "millisecond to date" singular-noun landing. Implementing tool /convert-time-in-millisecond-to-date.html.
  '/guides/millisecond-to-date.html': 'guide/millisecond-to-date.jsp',
  // Phase 16 cycle 8 N-series guides (25 new).

  // Phase 16 cycle 8 N-series guides (25 new).
  '/guides/how-to-make-a-zip-file-smaller.html': 'guide/how-to-make-a-zip-file-smaller.jsp',
  '/guides/how-to-compress-zip-file-to-smaller-size.html': 'guide/how-to-compress-zip-file-to-smaller-size.jsp',
  // Cycle 20260517-9 create_new_guide_page - exact-match "compress zip file to smaller size" landing.
  '/guides/compress-zip-file-to-smaller-size.html': 'guide/compress-zip-file-to-smaller-size.jsp',
  '/guides/compress-zip-file-to-100kb.html': 'guide/compress-zip-file-to-100kb.jsp',
  // Cycle 20260521-12 P29.A create_new_guide_page - operator-approved "compress zip file to 2mb" enterprise-SMTP-cap-specific landing.
  '/guides/compress-zip-file-to-2mb.html': 'guide/compress-zip-file-to-2mb.jsp',
  // Cycle 20260517-10 create_new_guide_page - exact-match "zip size reducer" landing.
  '/guides/zip-size-reducer.html': 'guide/zip-size-reducer.jsp',
  // Cycle 20260519-12 create_new_guide_page — /guides/zip-file-size-compressor.html (implementing tool /zip-file.html).
  '/guides/zip-file-size-compressor.html': 'guide/zip-file-size-compressor.jsp',
  '/guides/online-zip-vs-7z-vs-rar-which-to-pick.html': 'guide/online-zip-vs-7z-vs-rar-which-to-pick.jsp',
  '/guides/how-to-zip-multiple-files-into-one.html': 'guide/how-to-zip-multiple-files-into-one.jsp',
  '/guides/how-to-zip-folder-online-step-by-step.html': 'guide/how-to-zip-folder-online-step-by-step.jsp',
  '/guides/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html': 'guide/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.jsp',
  '/guides/recover-corrupt-zip-file-options.html': 'guide/recover-corrupt-zip-file-options.jsp',
  '/guides/iphone-photo-format-explained-heic-jpg-png-raw.html': 'guide/iphone-photo-format-explained-heic-jpg-png-raw.jsp',
  '/guides/how-to-convert-iphone-photo-to-jpg.html': 'guide/how-to-convert-iphone-photo-to-jpg.jsp',
  '/guides/jpg-vs-jpeg-are-they-the-same.html': 'guide/jpg-vs-jpeg-are-they-the-same.jsp',
  '/guides/svg-to-png-when-to-rasterize-an-svg.html': 'guide/svg-to-png-when-to-rasterize-an-svg.jsp',
  '/guides/how-to-check-camera-quality-on-your-phone.html': 'guide/how-to-check-camera-quality-on-your-phone.jsp',
  '/guides/microphone-test-online-what-it-actually-checks.html': 'guide/microphone-test-online-what-it-actually-checks.jsp',
  '/guides/keyboard-tester-online-rollover-vs-anti-ghosting.html': 'guide/keyboard-tester-online-rollover-vs-anti-ghosting.jsp',
  '/guides/how-to-test-a-keyboard-online-step-by-step.html': 'guide/how-to-test-a-keyboard-online-step-by-step.jsp',
  '/guides/extract-gif-frames-png-vs-jpg-which-format.html': 'guide/extract-gif-frames-png-vs-jpg-which-format.jsp',
  '/guides/gif-frames-extract-vs-frame-rate-fps-explained.html': 'guide/gif-frames-extract-vs-frame-rate-fps-explained.jsp',
  '/guides/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html': 'guide/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.jsp',
  '/guides/camera-test-shows-black-screen-four-fixes.html': 'guide/camera-test-shows-black-screen-four-fixes.jsp',
  '/guides/microphone-test-no-sound-four-fixes.html': 'guide/microphone-test-no-sound-four-fixes.jsp',
  '/guides/keyboard-test-keys-not-detected-four-fixes.html': 'guide/keyboard-test-keys-not-detected-four-fixes.jsp',
  '/guides/compress-jpeg-without-losing-quality-quality-vs-size.html': 'guide/compress-jpeg-without-losing-quality-quality-vs-size.jsp',
  '/guides/long-number-millisecond-or-second.html': 'guide/long-number-millisecond-or-second.jsp',
  '/guides/compressed-jpg-looks-blurry-three-causes.html': 'guide/compressed-jpg-looks-blurry-three-causes.jsp',
  '/guides/ffmpeg-online-conversion-stalled-three-fixes.html': 'guide/ffmpeg-online-conversion-stalled-three-fixes.jsp',
  '/guides/gif-frame-extractor-output-looks-wrong-three-causes.html': 'guide/gif-frame-extractor-output-looks-wrong-three-causes.jsp',
  '/guides/gif-frame-extractor.html': 'guide/gif-frame-extractor.jsp',
  '/guides/lcd-test-vs-display-test-which-do-you-need.html': 'guide/lcd-test-vs-display-test-which-do-you-need.jsp',
  '/guides/camera-test-vs-webcam-test-which-do-you-need.html': 'guide/camera-test-vs-webcam-test-which-do-you-need.jsp',
  '/guides/screen-test-vs-camera-test-pick-the-right-tool.html': 'guide/screen-test-vs-camera-test-pick-the-right-tool.jsp',
  '/guides/md5-to-text-why-you-cannot-convert-back.html': 'guide/md5-to-text-why-you-cannot-convert-back.jsp',
  '/guides/before-a-video-call-which-tools-to-run.html': 'guide/before-a-video-call-which-tools-to-run.jsp',
  '/guides/screen-test-for-laptop-5-minute-checklist.html': 'guide/screen-test-for-laptop-5-minute-checklist.jsp',
  '/guides/ffmpeg-online-vs-video-converter-which-to-pick.html': 'guide/ffmpeg-online-vs-video-converter-which-to-pick.jsp',
  '/guides/imagemagick-online-vs-task-specific-tools-which-to-pick.html': 'guide/imagemagick-online-vs-task-specific-tools-which-to-pick.jsp',
  '/guides/file-compressor-online-when-to-zip-vs-when-to-compress-image.html': 'guide/file-compressor-online-when-to-zip-vs-when-to-compress-image.jsp',
  '/guides/how-to-extract-a-file-online-zip-rar-7z.html': 'guide/how-to-extract-a-file-online-zip-rar-7z.jsp',
  '/guides/how-to-choose-a-compression-level.html': 'guide/how-to-choose-a-compression-level.jsp',
  '/guides/zip-password-types-strong-vs-weak-explained.html': 'guide/zip-password-types-strong-vs-weak-explained.jsp',
  '/guides/pdf-preflight-online-what-it-actually-checks.html': 'guide/pdf-preflight-online-what-it-actually-checks.jsp',
  '/guides/read-and-compare-md5-hashes-correctly.html': 'guide/read-and-compare-md5-hashes-correctly.jsp',
  '/guides/how-to-tell-if-a-jpg-was-compressed-too-much.html': 'guide/how-to-tell-if-a-jpg-was-compressed-too-much.jsp',
  '/guides/how-to-flatten-a-pdf-and-when-to-do-it.html': 'guide/how-to-flatten-a-pdf-and-when-to-do-it.jsp',
  '/guides/png-to-svg-when-to-vectorize-a-raster-image.html': 'guide/png-to-svg-when-to-vectorize-a-raster-image.jsp',
  '/guides/download-link-not-appearing-after-conversion-five-fixes.html': 'guide/download-link-not-appearing-after-conversion-five-fixes.jsp',
  '/guides/why-heic-wont-open-on-windows-three-fixes.html': 'guide/why-heic-wont-open-on-windows-three-fixes.jsp',
  '/guides/why-md5-cannot-be-decrypted.html': 'guide/why-md5-cannot-be-decrypted.jsp',
  '/guides/md5-decode.html': 'guide/md5-decode.jsp',
  '/guides/md5-decrypt-online.html': 'guide/md5-decrypt-online.jsp',
  // Cycle 20260520-17 create_new_guide_page — "md5 hash decrypt" narrow-frame guide on dictionary-attack vs rainbow-table feasibility. Distinct angle from the existing 7 MD5 guides (md5-decrypt-online = wording routing, why-md5-cannot-be-decrypted = cryptographic math, md5-decode = vocabulary distinguish, md5-alternatives = recommendation, md5-to-text = why-cannot-convert-back, md5-vs-sha256 = algorithm comparison, read-and-compare = verification). New angle: the practical feasibility question - "for the hash I have right now, will a dictionary attack actually find the input?" Append-only on every existing surface.
  '/guides/md5-hash-decrypt.html': 'guide/md5-hash-decrypt.jsp',
  '/guides/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html': 'guide/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.jsp',
  '/guides/json-vs-yaml-vs-toml-config-formats-explained.html': 'guide/json-vs-yaml-vs-toml-config-formats-explained.jsp',
  '/guides/css-minifier-vs-uglifier-vs-tree-shaking.html': 'guide/css-minifier-vs-uglifier-vs-tree-shaking.jsp',
  '/guides/base64-when-to-use-and-when-not-to.html': 'guide/base64-when-to-use-and-when-not-to.jsp',
  '/guides/how-to-split-a-gif-into-frames-for-editing.html': 'guide/how-to-split-a-gif-into-frames-for-editing.jsp',
  '/guides/how-to-crop-and-rotate-an-image.html': 'guide/how-to-crop-and-rotate-an-image.jsp',
  '/guides/photo-editor-vs-graphics-app-vs-batch-processor.html': 'guide/photo-editor-vs-graphics-app-vs-batch-processor.jsp',
  '/guides/mp4-vs-mov-vs-mkv-which-container-when.html': 'guide/mp4-vs-mov-vs-mkv-which-container-when.jsp',
  '/guides/free-online-tools-that-work-without-uploading-files.html': 'guide/free-online-tools-that-work-without-uploading-files.jsp',
  '/guides/qr-code-generator-best-practices.html': 'guide/qr-code-generator-best-practices.jsp',
  // Workstream B sample batch - 2026-04-30
  '/guides/how-to-compress-a-folder.html': 'guide/how-to-compress-a-folder.jsp',
  '/guides/lcd-test-what-it-checks.html': 'guide/lcd-test-what-it-checks.jsp',
  // Cycle 20260513-19+ multi-cycle - "lcd test" long-tail guide.
  // Cycle 20260514-2 cycle 1 - Phase A scaffold for "folder to zip converter".
  // Cycle 19 P19.4 - screen/display/monitor synonym disambiguation guide.
  '/guides/screen-display-test-synonyms.html': 'guide/screen-display-test-synonyms.jsp',
  // Cycle 70 P70.A - "Zip file converter - what it actually does" disambiguation guide.
  '/guides/zip-file-converter-what-it-actually-does.html': 'guide/zip-file-converter-what-it-actually-does.jsp',
  // Cycle 20260519-1 - bare-query "zip file converter" how-to guide.
  '/guides/zip-file-converter.html': 'guide/zip-file-converter.jsp',
  // Cycle 71 P71.F - "HEIC to JPG: what the converter actually does (and what it does not)" trust-anchor guide.
  '/guides/heic-to-jpg-claims-what-actually-works.html': 'guide/heic-to-jpg-claims-what-actually-works.jsp',
  // Cycle1 of 20260513-5 P5.A - "Zip compressor" Lane-D guide. Phase A
  // skeleton (route + JSP wrapper) only. Kebab URL + guide/ singular
  // subdir per granted-card convention.
  '/guides/zip-compressor.html': 'guide/zip-compressor.jsp',
  // Cycle6 of 20260513-6 — "Compress ZIP" Lane-D guide. Phase A skeleton.
  // Kebab URL + guide/ singular subdir per granted-card convention.
  '/guides/compress-zip.html': 'guide/compress-zip.jsp',
  // Cycle 20260515-16 — "Compress ZIP Size" Lane-D guide.
  '/guides/compress-zip-size.html': 'guide/compress-zip-size.jsp',
  // Cycle 20260519-15 create_new_guide_page — "resize zip file" wording-disambiguation Lane-D guide (GSC 406 imp / 19 clicks / pos 6.83 / CTR 4.68%; opportunity_score 56.6). Implementing tool /zip-tools/zip-file.html. Append-only routing/disambiguation guide (NOT a 10th compress-zip duplicate); distinguishes from /guides/how-to-make-a-zip-file-smaller.html, /guides/zip-size-reducer.html, /guides/compress-zip-size.html (which all assume "shrink"), by addressing the three-way reader intent ambiguity (shrink vs split vs shrink-inputs-first).
  '/guides/resize-zip-file.html': 'guide/resize-zip-file.jsp',

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
  '/guides/zip-password-unlocker.html': 'guide/zip-password-unlocker.jsp',
  // Cycle 20260520-followup: canonical moved from /hd-video-converter.html (root)
  // to /video-tools/hd-video-converter.html per the site cluster-URL convention.
  // Existing canonical pattern: /<cluster>-tools/<slug>.html (canonical) +
  // /<slug>.html (alias). Root URL now lives in ALIAS_ROUTES (see top of file).
  // Pre-cycle-20260520 builder bug: ctx.url hardcoded as /{slug}.html ignoring
  // cluster; fixed in build-tool-page.mjs::deriveUrlsForCluster().
  '/video-tools/hd-video-converter.html': 'convert/hd-video-converter.jsp',
  '/guides/hd-video-converter-when.html': 'guide/hd-video-converter-when.jsp',
  '/guides/hd-video-converter-step-by-step.html': 'guide/hd-video-converter-step-by-step.jsp',
  '/guides/hd-video-converter-vs-alternatives.html': 'guide/hd-video-converter-vs-alternatives.jsp',
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
  '/guides/json-formatter-when.html': 'guide/json-formatter-when.jsp',
  '/guides/json-formatter-step-by-step.html': 'guide/json-formatter-step-by-step.jsp',
  '/guides/json-formatter-vs-alternatives.html': 'guide/json-formatter-vs-alternatives.jsp',
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
};

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

