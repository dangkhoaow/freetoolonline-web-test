import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { resolveHubBacklink } from './seo-clusters.mjs';

export const DEFAULT_SITE_ORIGIN = 'https://freetoolonline.com';
export const DEFAULT_API_ORIGIN = 'https://service.us-east-1a.freetool.online/';
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
  // Phase 16 Cycle A P16.N2 - "how to compress a file" + variants
  // (~10K impr / 0.02% CTR / pos 10.5). Greenfield how-to guide.
  '/guides/how-to-compress-a-file-online.html',
  // Phase 16 Cycle A P16.N4 - "how to reduce zip file size" cluster
  // (~2.2K impr / 10-16% CTR / pos 4). Greenfield how-to guide.
  '/guides/how-to-reduce-zip-file-size-online.html',
  // Phase 16 Cycle B P16.N11 - "convert heic to jpg" head query
  // (5,500+ impr / <2% CTR / pos 11-24). Pure step-by-step how-to;
  // pairs with existing heic-vs-jpg-vs-webp (which covers the WHEN).
  '/guides/how-to-convert-heic-to-jpg-step-by-step.html',
  // Phase 16 Cycle B P16.N16 - "lcd test" head query (28K aggregate
  // impr / 1.10% CTR / pos 6.1). Explainer + when-to-run + boundary.
  '/guides/what-an-lcd-test-does-and-when-to-run-one.html',
  // Phase 16 cycle 8 N-series - 25 new long-form guides. INFO_ROUTES
  // membership disables ads + rating widget (matching the rest of the
  // /guides/* cluster); see page-renderer.mjs showAds gate.
  '/guides/how-to-make-a-zip-file-smaller.html',
  '/guides/how-to-compress-zip-file-to-smaller-size.html',
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
  // Cycle 71 P71.F - "HEIC to JPG: what the converter actually does
  // (and what it does not)" trust-anchor guide. Sourced verbatim from
  // tool-heictojpg/SKILL.md ## Implemented features + ## NOT implemented
  // (anti-claims). Bridges /heic-to-jpg.html (top revenue page +
  // baseline G15_accretion_drift HIGH on prod) at a NEW URL without
  // touching the indexed copy of /heic-to-jpg.html. Lane-D PA-mode
  // mandatory; image-conversion cluster (non-ZIP); append-only.
  '/guides/heic-to-jpg-claims-what-actually-works.html',
]);

// Guide routes subset of INFO_ROUTES - used by page-renderer.mjs to emit Article
// JSON-LD and to inject editorial-byline/trust surface on guide pages.
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
  // Phase 16 Cycle B P16.N11 / P16.N16.
  '/guides/how-to-convert-heic-to-jpg-step-by-step.html',
  '/guides/what-an-lcd-test-does-and-when-to-run-one.html',
  '/guides/how-to-make-a-zip-file-smaller.html',
  '/guides/how-to-compress-zip-file-to-smaller-size.html',
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
  // Workstream B sample batch - 2026-04-30
  '/guides/how-to-compress-a-folder.html',
  '/guides/lcd-test-what-it-checks.html',
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
  // Cycle 71 P71.F - "HEIC to JPG: what the converter actually does
  // (and what it does not)" trust-anchor guide. Source-cited claims
  // from tool-heictojpg/SKILL.md (libheif, SlimJpg, EXIF toggle, quality
  // slider, multi-format output). Anti-claims also surfaced (NOT
  // browser-only, NOT account-gated, does NOT extract live-photo
  // motion). Lane-D PA-mode mandatory; image-conversion cluster.
  '/guides/heic-to-jpg-claims-what-actually-works.html',
]);

export function isGuideRoute(route) {
  return GUIDE_ROUTES.has(route && route.startsWith('/') ? route : `/${route ?? ''}`);
}

export const SPECIAL_ROUTES = new Set(['/alternatead.html']);

export const ALIAS_ROUTES = {
  '/svg-to-image.html': '/svg-to-png.html',
  '/split-pdf-to-single-pages.html': '/split-pdf-by-range.html',
  '/pdf-merge-from-multiple-files.html': '/join-pdf-from-multiple-files.html',
  '/mov-to-mp4.html': '/video-converter.html',
  '/mov-to-mp3.html': '/video-converter.html',
  '/zip-file-with-password.html': '/zip-file.html',
  '/unzip-file-with-password.html': '/unzip-file.html',
  '/heic-to-pdf.html': '/heic-to-jpg.html',
  '/insights-optimize-image.html': '/insights-image-optimizer.html',
  '/cong-cu-chuyen-doi-chu-quoc-ngu-tieng-viet-thanh-tiew-viet-kieu-moi-phan-2.html': '/cong-cu-chuyen-doi-chu-quoc-ngu-tieng-viet-thanh-tieq-viet-kieu-moi.html',
};

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
  '/guides/how-to-compress-a-file-online.html': 'guide/how-to-compress-a-file-online.jsp',
  '/guides/how-to-reduce-zip-file-size-online.html': 'guide/how-to-reduce-zip-file-size-online.jsp',
  // Phase 16 Cycle B P16.G1 hub + P16.N11 + P16.N16.
  '/guides.html': 'utility/guides.jsp',
  '/guides/how-to-convert-heic-to-jpg-step-by-step.html': 'guide/how-to-convert-heic-to-jpg-step-by-step.jsp',
  '/guides/what-an-lcd-test-does-and-when-to-run-one.html': 'guide/what-an-lcd-test-does-and-when-to-run-one.jsp',
  // Phase 16 cycle 8 N-series guides (25 new).

  // Phase 16 cycle 8 N-series guides (25 new).
  '/guides/how-to-make-a-zip-file-smaller.html': 'guide/how-to-make-a-zip-file-smaller.jsp',
  '/guides/how-to-compress-zip-file-to-smaller-size.html': 'guide/how-to-compress-zip-file-to-smaller-size.jsp',
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
  // Cycle 19 P19.4 - screen/display/monitor synonym disambiguation guide.
  '/guides/screen-display-test-synonyms.html': 'guide/screen-display-test-synonyms.jsp',
  // Cycle 70 P70.A - "Zip file converter - what it actually does" disambiguation guide.
  '/guides/zip-file-converter-what-it-actually-does.html': 'guide/zip-file-converter-what-it-actually-does.jsp',
  // Cycle 71 P71.F - "HEIC to JPG: what the converter actually does (and what it does not)" trust-anchor guide.
  '/guides/heic-to-jpg-claims-what-actually-works.html': 'guide/heic-to-jpg-claims-what-actually-works.jsp',

  '/compose-pdf.html': 'pdf/compose-pdf.jsp',
  '/split-pdf-by-range.html': 'pdf/split-by-range.jsp',
  '/split-pdf-to-each-pages.html': 'pdf/split-to-single-pages.jsp',
  '/join-pdf-from-multiple-files.html': 'pdf/merge-from-multiple-files.jsp',
  '/protect-pdf-by-password.html': 'pdf/encrypt-by-password.jsp',
  '/remove-pdf-password.html': 'pdf/remove-password.jsp',
  '/preflight-pdf.html': 'pdf/preflight.jsp',
  '/flatten-pdf.html': 'pdf/flatten-pdf.jsp',
  '/get-time-in-millisecond.html': 'datetime/get-current-time-in-millisecond.jsp',
  '/convert-time-in-millisecond-to-date.html': 'convert/convert-time-in-millisecond-to-date.jsp',
  '/zip-file.html': 'file/zip-file.jsp',
  '/unzip-file.html': 'file/unzip-file.jsp',
  '/remove-zip-password.html': 'file/remove-zip-password.jsp',
  '/zip-tools.html': 'utility/zip-tools.jsp',
  '/image-converter-tools.html': 'utility/image-converter-tools.jsp',
  '/image-tools.html': 'utility/image-tools.jsp',
  '/pdf-tools.html': 'utility/pdf-tools.jsp',
  '/developer-tools.html': 'utility/developer-tools.jsp',
  '/video-tools.html': 'utility/video-tools.jsp',
  '/device-test-tools.html': 'utility/device-test-tools.jsp',
  '/utility-tools.html': 'utility/utility-tools.jsp',
  '/resize-image.html': 'image/resize-image.jsp',
  '/crop-image.html': 'image/crop-image.jsp',
  '/compress-image.html': 'image/compress-image.jsp',
  '/insights-image-optimizer.html': 'image/insights-image-optimizer.jsp',
  '/gif-maker.html': 'image/gif-maker.jsp',
  '/ffmpeg-online.html': 'image/ffmpeg-online.jsp',
  '/imagemagick-online.html': 'image/imagemagick-online.jsp',
  '/photo-editor.html': 'image/photo-editor.jsp',
  '/get-jpeg-compression-level.html': 'image/get-jpeg-compression-level.jsp',
  '/json-parser.html': 'utility/json-parser.jsp',
  '/text-diff.html': 'utility/text-diff.jsp',
  '/css-minifier.html': 'utility/css-minifier.jsp',
  '/css-unminifier.html': 'utility/css-unminifier.jsp',
  '/js-minifier.html': 'utility/js-minifier.jsp',
  '/js-unminifier.html': 'utility/js-unminifier.jsp',
  '/video-maker.html': 'utility/video-maker.jsp',
  '/microphone-test.html': 'utility/microphone-test.jsp',
  '/camera-test.html': 'utility/camera-test.jsp',
  '/lcd-test.html': 'utility/lcd-test.jsp',
  '/keyboard-test.html': 'utility/keyboard-test.jsp',
  '/css-gradient-generator.html': 'utility/css-gradient-generator.jsp',
  '/do-nong-do-con-truc-tuyen.html': 'utility/do-nong-do-con-truc-tuyen.jsp',
  '/pdf-to-text.html': 'convert/pdf-to-text.jsp',
  '/images-to-pdf.html': 'convert/images-to-pdf.jsp',
  '/pdf-to-images.html': 'convert/pdf-to-images.jsp',
  '/pdf-to-html.html': 'convert/pdf-to-html.jsp',
  '/md5-converter.html': 'convert/md5-converter.jsp',
  '/text-html-editor.html': 'convert/text-html-editor.jsp',
  '/svg-to-png.html': 'convert/svg-to-png.jsp',
  '/png-to-svg.html': 'convert/png-to-svg.jsp',
  '/heic-to-jpg.html': 'convert/heic-to-jpg.jsp',
  '/image-to-base64.html': 'convert/image-to-base64.jsp',
  '/base64-to-image.html': 'convert/base64-to-image.jsp',
  '/qr-code-generator.html': 'convert/qr-code-generator.jsp',
  '/video-converter.html': 'convert/video-converter.jsp',
  '/extract-gif-to-image-frames.html': 'convert/extract-gif-to-image-frames.jsp',
  '/cong-cu-chuyen-doi-chu-quoc-ngu-tieng-viet-thanh-tieq-viet-kieu-moi.html': 'convert/new-vietnamese-converter.jsp',
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

export function routeToSlug(route) {
  const normalized = normalizeRoute(route);
  if (normalized === '/') {
    return '';
  }
  // Remove leading slash, .html suffix, hyphens, AND interior slashes so that
  // subpath routes (e.g., /guides/heic-vs-jpg-vs-webp.html) map to a single CMS
  // fragment suffix (guidesheicvsjpgvswebp) - no filesystem conflict.
  return normalized.replace(/^\//, '').replace(/\.html$/i, '').toLowerCase().replace(/[-/]/g, '');
}

export function routeToPageName(route) {
  const normalized = normalizeRoute(route);
  if (normalized === '/') {
    return '';
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

