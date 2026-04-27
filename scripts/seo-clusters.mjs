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
    ],
  },
  {
    cluster: 'image-conversion',
    hubRoute: '/image-converter-tools.html',
    hubLabel: 'Back to Image Converters',
    routes: ['/heic-to-jpg.html', '/svg-to-png.html', '/png-to-svg.html', '/image-to-base64.html', '/base64-to-image.html', '/extract-gif-to-image-frames.html'],
  },
  {
    cluster: 'pdf',
    hubRoute: '/pdf-tools.html',
    hubLabel: 'Back to PDF Tools',
    routes: ['/compose-pdf.html', '/split-pdf-by-range.html', '/split-pdf-to-each-pages.html', '/join-pdf-from-multiple-files.html', '/protect-pdf-by-password.html', '/remove-pdf-password.html', '/preflight-pdf.html', '/flatten-pdf.html', '/pdf-to-text.html', '/pdf-to-images.html', '/pdf-to-html.html', '/images-to-pdf.html'],
  },
  {
    cluster: 'developer',
    hubRoute: '/developer-tools.html',
    hubLabel: 'Back to Developer Tools',
    routes: ['/json-parser.html', '/css-minifier.html', '/css-unminifier.html', '/js-minifier.html', '/js-unminifier.html', '/text-diff.html', '/md5-converter.html', '/css-gradient-generator.html', '/text-html-editor.html'],
  },
  {
    cluster: 'video',
    hubRoute: '/video-tools.html',
    hubLabel: 'Back to Video Tools',
    routes: ['/video-converter.html', '/video-maker.html', '/ffmpeg-online.html'],
  },
  {
    cluster: 'device-test',
    hubRoute: '/device-test-tools.html',
    hubLabel: 'Back to Device Test Tools',
    routes: ['/microphone-test.html', '/camera-test.html', '/lcd-test.html', '/keyboard-test.html'],
  },
  {
    cluster: 'utility',
    hubRoute: '/utility-tools.html',
    hubLabel: 'Back to Utility Tools',
    routes: ['/convert-time-in-millisecond-to-date.html', '/get-time-in-millisecond.html', '/qr-code-generator.html', '/do-nong-do-con-truc-tuyen.html', '/cong-cu-chuyen-doi-chu-quoc-ngu-tieng-viet-thanh-tieq-viet-kieu-moi.html'],
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
