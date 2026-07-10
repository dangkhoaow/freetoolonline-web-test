const SEO_CLUSTER_GROUPS = [
  {
    cluster: 'zip',
    hubRoute: '/zip-tools.html',
    hubLabel: 'Back to ZIP Tools',
    routes: ['/zip-file.html', '/unzip-file.html', '/remove-zip-password.html'],
  },
  {
    cluster: 'image-editing',
    hubRoute: '/image-tools.html',
    hubLabel: 'Back to Image Tools',
    routes: [
      '/compress-image.html',
      '/resize-image.html',
      '/crop-image.html',
      '/photo-editor.html',
      '/gif-maker.html',
      '/insights-image-optimizer.html',
      '/get-jpeg-compression-level.html',
      '/imagemagick-online.html',
    '/image-tools/steganography.html', '/image-tools/background-remover.html'],
  },
  {
    cluster: 'image-conversion',
    hubRoute: '/image-converter-tools.html',
    hubLabel: 'Back to Image Converters',
    // Cycle 20260520-8 cleanup: /hd-video-converter.html moved to video cluster (it's a VIDEO
    // converter with ffmpeg audio-bitrate options, not an image converter). It was mis-clustered
    // here so the axis_F scanner flagged its template paragraph as a 1.0 jaccard duplicate of
    // /image-format-converter.html's same template paragraph. Re-tagged in related-tools.js
    // commit 765e1d8 + moved here.
    // Cycle 20260521-12 cleanup: /image-format-converter.html removed entirely (silent stub).
    routes: ['/heic-to-jpg.html', '/svg-to-png.html', '/png-to-svg.html', '/image-to-base64.html', '/base64-to-image.html', '/extract-gif-to-image-frames.html', '/image-converter-tools/audio-converter.html', '/image-converter-tools/png-to-webp.html', '/image-converter-tools/jpg-to-webp.html', '/image-converter-tools/webp-to-png.html', '/image-converter-tools/webp-to-jpg.html'],
  },
  {
    cluster: 'pdf',
    hubRoute: '/pdf-tools.html',
    hubLabel: 'Back to PDF Tools',
    routes: ['/compose-pdf.html', '/split-pdf-by-range.html', '/split-pdf-to-each-pages.html', '/join-pdf-from-multiple-files.html', '/protect-pdf-by-password.html', '/remove-pdf-password.html', '/preflight-pdf.html', '/flatten-pdf.html', '/pdf-to-text.html', '/pdf-to-images.html', '/pdf-to-html.html', '/images-to-pdf.html', '/pdf-tools/pdf-filler-form-editor.html'],
  },
  {
    cluster: 'developer',
    hubRoute: '/developer-tools.html',
    hubLabel: 'Back to Developer Tools',
    // Cycle 20260520-8 P.B cleanup: 5 dupe json-formatter variants + chatgpt-json-tree-viewer
    // removed. They were 301-aliased to /json-formatter.html in commit 8f159ad. Their orphan
    // presence here made cluster-narrative axis_F detect false-positive paragraph_jaccard 1.0.
    // Cycle 20260521-12 semantic-dedup cleanup: '/json-formatter.html' removed
    // (was semantic duplicate of /json-parser.html which is titled "JSON Parser
    // & Formatter (Tree View)" and already covers pretty-print + validate + tree).
    routes: ['/json-parser.html', '/css-minifier.html', '/css-unminifier.html', '/js-minifier.html', '/js-unminifier.html', '/text-diff.html', '/md5-converter.html', '/css-gradient-generator.html', '/text-html-editor.html', '/developer-tools/regex-tester.html', '/developer-tools/color-picker.html', '/developer-tools/data-visualizer.html', '/developer-tools/code-editor.html', '/developer-tools/code-formatter-beautifier.html', '/developer-tools/word-counter.html', '/developer-tools/sort-text-lines.html', '/developer-tools/remove-duplicate-lines.html', '/developer-tools/reverse-text.html', '/developer-tools/text-repeater.html', '/developer-tools/base64-encoder.html', '/developer-tools/url-decoder.html'],
  },
  {
    cluster: 'video',
    hubRoute: '/video-tools.html',
    hubLabel: 'Back to Video Tools',
    routes: ['/video-converter.html', '/video-maker.html', '/ffmpeg-online.html', '/hd-video-converter.html', '/video-tools/video-trimmer.html', '/video-tools/video-to-gif.html', '/video-tools/audio-trimmer.html'],
  },
  {
    cluster: 'device-test',
    hubRoute: '/device-test-tools.html',
    hubLabel: 'Back to Device Test Tools',
    routes: ['/microphone-test.html', '/camera-test.html', '/lcd-test.html', '/keyboard-test.html', '/device-test-tools/screen-recorder.html', '/device-test-tools/gpu-test.html'],
  },
  {
    cluster: 'utility',
    hubRoute: '/utility-tools.html',
    hubLabel: 'Back to Utility Tools',
    routes: ['/file-compressor.html', '/convert-time-in-millisecond-to-date.html', '/get-time-in-millisecond.html', '/qr-code-generator.html', '/do-nong-do-con-truc-tuyen.html', '/cong-cu-chuyen-doi-chu-quoc-ngu-tieng-viet-thanh-tieq-viet-kieu-moi.html', '/utility-tools/todo-list.html', '/utility-tools/unit-converter.html', '/utility-tools/font-generator.html', '/utility-tools/private-ai-chat.html', '/utility-tools/analog-clock.html', '/utility-tools/digital-clock.html', '/utility-tools/countdown-timer.html', '/utility-tools/stopwatch.html', '/utility-tools/online-alarm-clock.html', '/utility-tools/wheel-spinner.html', '/utility-tools/dice-roller.html', '/utility-tools/coin-flip.html', '/utility-tools/random-number-picker.html', '/utility-tools/name-shuffler.html', '/utility-tools/yes-or-no-wheel.html', '/utility-tools/password-generator.html', '/utility-tools/voice-recorder.html', '/utility-tools/text-to-speech.html', '/utility-tools/speech-to-text.html', '/utility-tools/habit-tracker.html', '/utility-tools/grocery-list.html', '/utility-tools/qr-code-scanner.html', '/utility-tools/percentage-calculator.html', '/utility-tools/linux-online.html'],
  },
  // Phase 16 P16.G3 - register the /guides/* cluster. Cycle B activates the
  // full route list now that P16.G1 ships /guides.html. resolveHubBacklink
  // returns { href: '/guides.html', label: 'Back to All Guides' } for every
  // route in this list, which causes (a) the renderer's breadcrumb chain to
  // become Home > All Guides > <guide title> and (b) site-data.mjs::
  // appendHubBacklink to auto-append "<- Back to All Guides" to each
  // guide's BODYHTML (or BODYWELCOME if present). Append-only at the
  // markup level - the existing guide BODYHTML/BODYWELCOME files are not
  // edited; the renderer adds the backlink at build time.
  // fire-23 (2026-07-04) - two NEW reader categories, both with non-'-tools'
  // hubs (the /guides.html precedent): browser GAMES and 3D SPACE visualizations.
  // Riding the June-2026 in-browser game trend. Routes are appended per build
  // by seo-tool-page-builder/scripts/lib/patch-seo-clusters.mjs, same as the
  // 8 tool clusters. Hub detection for these non-'-tools' hubs goes through
  // isHubRoute() below - do NOT add endsWith('-tools.html') checks elsewhere.
  {
    cluster: 'games',
    hubRoute: '/games.html',
    hubLabel: 'Back to Games',
    routes: ['/games/snake-classic.html', '/games/retro-tank-battle.html', '/games/garden-defense.html', '/games/voxel-world-builder.html', '/games/sky-gates-flight.html', '/games/city-time-machine.html', '/games/2048-game.html', '/games/city-drive-3d.html', '/games/retro-fps-online.html', '/games/retro-highway-racer.html', '/games/hover-racing.html', '/games/retro-arcade-shooter.html', '/games/marble-maze.html', '/games/asteroid-blaster.html', '/games/hex-puzzle-blocks.html', '/games/procedural-horde-game.html', '/games/chili-blast-shooter.html', '/games/pixel-pipeline-reflex.html', '/games/medieval-wall-defense.html', '/games/cyber-slide-puzzle.html', '/games/starlight-breaker.html', '/games/night-swarm-survivor.html', '/games/neon-tower-rush.html', '/games/cyber-neon-maze.html'],
  },
  {
    cluster: 'space-3d',
    hubRoute: '/space-3d.html',
    hubLabel: 'Back to Space 3D',
    routes: ['/space-3d/solar-system.html', '/space-3d/black-hole.html', '/space-3d/galaxy.html', '/space-3d/earth-3d-globe.html'],
  },
  // news-loop (2026-07-08) - dated, source-cited updates on the file formats,
  // browser capabilities, and standards the tool clusters serve. Articles are
  // shipped one per fire by prompts/news-discovery-loop-runbook.md; every
  // article bridges into the tool/guide pages its story affects (topical-map
  // support role, never a doorway). Non-'-tools' hubRoute like games/space-3d.
  {
    cluster: 'news',
    hubRoute: '/news.html',
    hubLabel: 'Back to News',
    routes: ['/news/jpeg-xl-returns-chrome-firefox.html', '/news/pt/jpeg-xl-returns-chrome-firefox.html', '/news/es/jpeg-xl-returns-chrome-firefox.html', '/news/vi/jpeg-xl-returns-chrome-firefox.html', '/news/id/jpeg-xl-returns-chrome-firefox.html', '/news/av2-codec-finalized-no-browser-support-yet.html', '/news/pt/av2-codec-finalized-no-browser-support-yet.html', '/news/winrar-rar5-recovery-flaw-patched.html', '/news/pt/winrar-rar5-recovery-flaw-patched.html'],
  },
  {
    cluster: 'guides',
    hubRoute: '/guides.html',
    hubLabel: 'Back to All Guides',
    routes: [
      // Phase 7-13 published guides (chronological).
      '/guides/heic-vs-jpg-vs-webp.html',
      '/guides/dead-pixel-testing-guide.html',
      '/guides/unix-timestamps-explained.html',
      '/guides/pdf-password-types-owner-vs-user.html',
      '/guides/png-vs-svg-when-to-use.html',
      '/guides/css-minifier-vs-compressor.html',
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
      '/guides/when-to-compress-vs-convert-an-image.html',
      '/guides/how-to-compress-a-folder-for-email.html',
      '/guides/device-test-checklist-for-remote-work.html',
      '/guides/pdf-editing-ladder.html',
      '/guides/file-compressor-vs-zip-what-to-pick.html',
      '/guides/heic-vs-jpg-converter-when-each-wins.html',
      // Phase 16 Cycle A.
      '/guides/what-is-a-file-compressor-and-which-to-use.html',
      '/guides/how-to-compress-a-file-online.html',
      '/guides/how-to-reduce-zip-file-size-online.html',
      // Phase 16 Cycle B.
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
      '/guides/qr-code-generator-best-practices.html'
    ],
  },
];

const ROUTE_TO_HUB_LINK = new Map(
  SEO_CLUSTER_GROUPS.flatMap(({ hubRoute, hubLabel, routes }) => routes.map((route) => [route, { href: hubRoute, label: hubLabel }]))
);

function normalizeRoute(route) {
  if (!route) {
    return '';
  }
  return route.startsWith('/') ? route : `/${route}`;
}

export function resolveHubBacklink(route) {
  return ROUTE_TO_HUB_LINK.get(normalizeRoute(route)) ?? null;
}

export function getSeoClusterGroups() {
  return SEO_CLUSTER_GROUPS.map((group) => ({
    ...group,
    routes: [...group.routes],
  }));
}

/**
 * True when the route is a category hub page. Two ways to be a hub:
 *   1. The '/<x>-tools.html' naming convention (the 8 legacy tool clusters).
 *   2. Explicit hubRoute registration in SEO_CLUSTER_GROUPS - the pattern
 *      page-renderer.mjs introduced for /guides.html and that the fire-23
 *      /games.html + /space-3d.html hubs rely on.
 * Shared by export-site.mjs (showRating gate), sitemap-writer.mjs (hub vs
 * tool sitemap split + llms.txt kind), and sitemap-html-builder.mjs (home
 * search datalist exclusion) so hub detection cannot drift per call site
 * again. NOTE: this also matches /guides.html - call sites that need to
 * exclude the guides hub must do so explicitly (they already exclude
 * /guides/* by prefix).
 */
export function isHubRoute(route) {
  const normalized = normalizeRoute(route);
  if (normalized.endsWith('-tools.html')) {
    return true;
  }
  return SEO_CLUSTER_GROUPS.some((group) => group.hubRoute === normalized);
}
