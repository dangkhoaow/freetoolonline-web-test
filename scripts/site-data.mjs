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
  // Phase 11 Cycle 5 P11.4.1 — author bio / editorial team (E-E-A-T surface).
  '/editorial-team.html',
  // Guides - plan §3.3. Treated as informational (no related-tools, no rating,
  // no HowTo; Article JSON-LD emitted separately by page-renderer.mjs).
  '/guides/heic-vs-jpg-vs-webp.html',
  '/guides/dead-pixel-testing-guide.html',
  '/guides/unix-timestamps-explained.html',
  '/guides/pdf-password-types-owner-vs-user.html',
  // §3.5 comparison guides (Cycle 4).
  '/guides/png-vs-svg-when-to-use.html',
  '/guides/css-minifier-vs-compressor.html',
  // Phase 8 Cycle 3 §3.4 greenfield guides — 4 pillar + 2 comparison + 6 how-to + 1 case-study.
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
  // Phase 10 Cycle 4 P10.3.4 — cluster-disambiguation guide (compress vs convert
  // intent router; upper-funnel capture for "file compressor" / "image compressor" queries).
  '/guides/when-to-compress-vs-convert-an-image.html',
  // Phase 11 Cycle 4 P11.3.3 — how-to guide targeting the 9,737-impression
  // `how to compress a folder` keyword opportunity (0.14% CTR / pos 6.10).
  // Upper-funnel routing to the frozen ZIP cluster without modifying any
  // zip satellite.
  '/guides/how-to-compress-a-folder-for-email.html',
  // Phase 11 Cycle 5 P11.2.1 — device-test-checklist guide (Phase 10 P10.3.5
  // carryover; upper-funnel routing for device-test cluster).
  '/guides/device-test-checklist-for-remote-work.html',
  // Phase 11 Cycle 5 P11.3.5 — PDF cluster disambiguation ladder (routes
  // users across 12 PDF tools by intent).
  '/guides/pdf-editing-ladder.html',
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
  '/alternatead.html': 'alternatead.jsp',
  // Guides - plan §3.3 greenfield /guides/ subpath for long-form content.
  '/guides/heic-vs-jpg-vs-webp.html': 'guide/heic-vs-jpg-vs-webp.jsp',
  '/guides/dead-pixel-testing-guide.html': 'guide/dead-pixel-testing-guide.jsp',
  '/guides/unix-timestamps-explained.html': 'guide/unix-timestamps-explained.jsp',
  '/guides/pdf-password-types-owner-vs-user.html': 'guide/pdf-password-types-owner-vs-user.jsp',
  // §3.5 comparison guides (Cycle 4).
  '/guides/png-vs-svg-when-to-use.html': 'guide/png-vs-svg-when-to-use.jsp',
  '/guides/css-minifier-vs-compressor.html': 'guide/css-minifier-vs-compressor.jsp',
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
    clearAdConfirm: await loadTextIfExists(path.join(viewRoot, 'clear-ad-confirm.html')),
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

