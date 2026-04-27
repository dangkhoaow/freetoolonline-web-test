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
  // Phase 16 P16.G3 - register the /guides/* cluster taxonomy. Cycle A
  // intentionally leaves `routes: []` empty so resolveHubBacklink does NOT
  // activate the breadcrumb hub-link on any existing /guides/* page until
  // P16.G1 ships /guides.html in Cycle B (the hub URL would 404 if the
  // breadcrumb pointed there before the hub exists). Cycle B updates this
  // entry with the full 28 guide routes (25 existing + 3 new from Cycle A).
  // Read by getSeoClusterGroups() consumers (sitemap segmenter, hub auto-
  // cards, future cluster-aware features). Empty `routes[]` is honored
  // safely by every existing consumer.
  {
    cluster: 'guides',
    hubRoute: '/guides.html',
    hubLabel: 'Back to All Guides',
    routes: [],
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
