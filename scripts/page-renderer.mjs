import { canonicalForRoute, isInfoRoute, isGuideRoute } from './site-data.mjs';
import { getSeoClusterGroups, resolveHubBacklink } from './seo-clusters.mjs';
import { DEFAULT_PAGE_SVG_LOGO, escapeHtml, renderBaseScript, renderDownloadTag, renderLoadingTag, renderShareButtons, renderUploadSecondTag, renderUploadStartupSecondTag, renderUploadStartupTag, renderUploadTag, renderWelcomeTag, replaceExpressions, unwrapStyleBlock } from './page-fragments.mjs';
import { buildStagingBannerHtml, normalizeBasePath, resolveCanonicalUrl } from './staging-utils.mjs';

const SEO_CLUSTER_GROUPS = getSeoClusterGroups();
const RELATED_TOOLS_LIST_STYLE = 'margin-top: 0px;display: block;padding-inline-start: 40px;list-style-type: disc;';
const RELATED_TOOLS_STOP_WORDS = new Set(['free', 'tool', 'online', 'convert', 'converter', 'in', 'editor', 'maker', 'by', 'and']);
const RELATED_TOOLS_TAGS_PAGE_TITLES = new Set(['tags collection', 'tags cloud:']);
const APPLICATION_CATEGORY_BY_CLUSTER = {
  zip: 'UtilitiesApplication',
  'image-editing': 'GraphicsApplication',
  'image-conversion': 'GraphicsApplication',
  pdf: 'UtilitiesApplication',
  developer: 'DeveloperApplication',
  video: 'MultimediaApplication',
  'device-test': 'UtilitiesApplication',
  utility: 'UtilitiesApplication',
};

function resolveApplicationCategory(route) {
  for (const group of SEO_CLUSTER_GROUPS) {
    if (group.hubRoute === route || (group.routes && group.routes.includes(route))) {
      return APPLICATION_CATEGORY_BY_CLUSTER[group.cluster] || 'UtilitiesApplication';
    }
  }
  return 'UtilitiesApplication';
}

const HOWTO_ROUTES = new Set([
  '/heic-to-jpg.html',
  '/camera-test.html',
  '/microphone-test.html',
  '/keyboard-test.html',
  '/lcd-test.html',
  '/js-minifier.html',
  '/css-minifier.html',
  '/json-parser.html',
  '/md5-converter.html',
  '/pdf-to-text.html',
  '/images-to-pdf.html',
  '/compose-pdf.html',
  '/compress-image.html',
  '/video-converter.html',
  '/convert-time-in-millisecond-to-date.html',
  '/pdf-to-images.html',
  '/extract-gif-to-image-frames.html',
  '/remove-pdf-password.html',
  '/protect-pdf-by-password.html',
  '/video-maker.html',
  '/ffmpeg-online.html',
  '/pdf-to-html.html',
  // P10.2.5 Phase 10 Cycle 4 - HowTo +3. (html-to-pdf.html route does not
  // exist in JSP_BY_ROUTE; base64-to-image.html substituted as the
  // developer-cluster peer.) Each slug listed here has a w3-pale-green
  // answer panel with a 3-step <ol> that extractHowToSteps picks up.
  '/gif-maker.html',
  '/qr-code-generator.html',
  '/base64-to-image.html',
  // P11.2.2 Phase 11 Cycle 2 - PDF cluster HowTo backfill. Plan called for
  // /pdf-to-word.html but that route does not exist in JSP_BY_ROUTE; substituted
  // /join-pdf-from-multiple-files.html (PDF cluster peer with an existing
  // FAQ file and a clean merge-workflow intent). HowTo 25/51 → 26/51.
  '/join-pdf-from-multiple-files.html',
  // P11.2.5 Phase 11 Cycle 3 - HowTo wave 3 (+4 → 30/51). Plan originally
  // listed pdf-to-images + pdf-to-html which were already in HOWTO_ROUTES
  // (Phase 8/9 carryover); substituted /split-pdf-by-range.html (PDF peer)
  // and /svg-to-png.html (image-conversion peer) to keep the +4 count with
  // non-overlapping additions. Each new slug has a w3-pale-green answer
  // panel with a 3-step <ol> authored via seo-content-writer.
  '/image-to-base64.html',
  '/css-gradient-generator.html',
  '/split-pdf-by-range.html',
  '/svg-to-png.html',
]);

// P10.3.1 - Per-tool og:image differentiation (Phase 10 Cycle 4).
// The default og:image (CloudFront logo) is identical across 82 URLs which
// produces zero Discover / Twitter / LinkedIn preview differentiation. This
// map targets the top 5 non-ZIP URLs with per-tool 1200×630 PNGs once the
// assets are uploaded to the existing CloudFront bucket under
// `image/og/<slug>-1200x630.png`. Until the assets exist, the lookup is
// gated behind USE_TOOL_OG_IMAGES so stale references never reach prod.
//
// Owner action remaining: produce the 5 PNGs (heic-to-jpg, lcd-test,
// md5-converter, camera-test, css-minifier) + upload to CDN + flip
// USE_TOOL_OG_IMAGES=true in the build env. No site-level changes required.
const TOOL_OG_IMAGE_MAP = {
  '/heic-to-jpg.html': 'https://dkbg1jftzfsd2.cloudfront.net/image/og/heic-to-jpg-1200x630.png',
  '/lcd-test.html': 'https://dkbg1jftzfsd2.cloudfront.net/image/og/lcd-test-1200x630.png',
  '/md5-converter.html': 'https://dkbg1jftzfsd2.cloudfront.net/image/og/md5-converter-1200x630.png',
  '/camera-test.html': 'https://dkbg1jftzfsd2.cloudfront.net/image/og/camera-test-1200x630.png',
  '/css-minifier.html': 'https://dkbg1jftzfsd2.cloudfront.net/image/og/css-minifier-1200x630.png',
};
const DEFAULT_OG_IMAGE = 'https://dkbg1jftzfsd2.cloudfront.net/image/logo.200x200.png';

function resolveOgImage(route) {
  const useToolOgImages = process.env.USE_TOOL_OG_IMAGES === 'true';
  if (!useToolOgImages) {
    return DEFAULT_OG_IMAGE;
  }
  return TOOL_OG_IMAGE_MAP[route] ?? DEFAULT_OG_IMAGE;
}

function renderMetaTags(ctx) {
  const canonicalUrl = ctx.canonicalUrl;
  const siteUrl = canonicalForRoute(ctx.siteOrigin, ctx.route);
  const isVietnamese = ctx.lang === 'vi';
  const selfHreflang = isVietnamese ? 'vi-vn' : 'en-us';
  const title = ctx.isHome ? 'Home Page - Free Tool Online' : `${ctx.browserTitle} - Free Tool Online`;
  const ogTitle = ctx.isHome ? 'Free Tool Online - Home Page' : `Free Tool Online - ${ctx.browserTitle}`;
  const mobileTitleBase = String(ctx.mobileBrowserTitle ?? '').trim();
  const mobileTitle = mobileTitleBase ? `${mobileTitleBase} - Free Tool Online` : '';
  const description = escapeHtml(ctx.description || '');
  const keywords = escapeHtml(ctx.keyword || '');
  const resolvedCanonical = canonicalUrl || siteUrl;
  const canonical = escapeHtml(resolvedCanonical);
  let canonicalOrigin = '';
  try {
    canonicalOrigin = new URL(resolvedCanonical).origin;
  } catch {
    canonicalOrigin = '';
  }
  // Emit x-default for every route. For EN routes, x-default points to the page's own
  // canonical (valid per hreflang spec when no translated variant exists). For VI routes
  // where the EN equivalent slug is unknown, fall back to the site origin.
  const xDefaultHref = isVietnamese ? canonicalOrigin : resolvedCanonical;
  console.log(`[seo:hreflang] route=${ctx.route} lang=${ctx.lang} canonical=${resolvedCanonical} self=${selfHreflang} x-default=${xDefaultHref || 'none'}.`);
  if (ctx.isStaging && !ctx.isHome && mobileTitleBase) {
    console.log(`[seo:mobile-title] route=${ctx.route} mobileTitle="${mobileTitleBase}".`);
  }
  const alternateLinks = [
    `<link rel='alternate' href='${canonical}' hreflang='${selfHreflang}' />`,
    xDefaultHref ? `<link rel='alternate' href='${escapeHtml(xDefaultHref)}' hreflang='x-default' />` : '',
  ].filter(Boolean);
  const mobileTitleScript = ctx.isStaging && !ctx.isHome && mobileTitle
    ? `<script>(function(){try{var t=${JSON.stringify(mobileTitle)};var m=(window.matchMedia?window.matchMedia('(max-width: 480px)').matches:((window.innerWidth||0)<=480));if(m&&t){document.title=t;}}catch(e){}})();</script>`
    : '';
  return [
    `<title>${escapeHtml(title)}</title>`,
    mobileTitleScript,
    `<meta http-equiv='cache-control' content='max-age=0, public'/>`,
    `<meta http-equiv='expires' content='0'/>`,
    `<meta http-equiv='pragma' content='no-cache'/>`,
    `<meta http-equiv='cleartype' content='on'>`,
    `<meta charset="utf-8"/>`,
    `<meta name='description' content='${description}' />`,
    `<meta name='keywords' content='${keywords}'/>`,
    `<meta name="author" content='freetoolonline.com' />`,
    `<link rel="author" href="https://www.linkedin.com/in/ktran1991/" />`,
    `<meta name="copyright" content="Copyright 2017 freetoolonline.com" />`,
    `<meta name='msvalidate.01' content='505D81A78DC4F7E37C1BD2E1092B4420' />`,
    `<meta name="baidu-site-verification" content="swIR2wbBvq" />`,
    `<meta name="yandex-verification" content="efeeb1a14a628297" />`,
    `<meta name="google-site-verification" content="G2vSQjrnGdjMgxsydPFQBuLffcKtZyo4f7VSzefzvQ4" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1">`,
    `<link rel="preconnect" href="https://dkbg1jftzfsd2.cloudfront.net" crossorigin>`,
    `<link rel="dns-prefetch" href="https://dkbg1jftzfsd2.cloudfront.net">`,
    `<meta name='apple-mobile-web-app-capable' content='yes'>`,
    `<meta name='mobile-web-app-capable' content='yes'>`,
    `<meta name='HandheldFriendly' content='True'>`,
    `<meta name='MobileOptimized' content='320'>`,
    `<meta name='apple-mobile-web-app-status-bar-style' content='black'>`,
    ctx.isStaging ? `<meta name="robots" content="noindex, nofollow">` : '',
    `<meta property='og:title' content='${escapeHtml(ogTitle)}'/>`,
    `<meta property='og:description' content='${description}'/>`,
    `<meta property='og:image' content='${resolveOgImage(ctx.route)}'/>`,
    `<meta property='og:type' content='${ctx.isGuide ? 'article' : 'website'}'/>`,
    ctx.isGuide ? `<meta property='article:author' content='freetoolonline editorial team'/>` : '',
    ctx.isGuide ? `<meta property='article:publisher' content='${escapeHtml(ctx.siteOrigin)}'/>` : '',
    ctx.isGuide && ctx.articlePublishedAt ? `<meta property='article:published_time' content='${escapeHtml(ctx.articlePublishedAt)}'/>` : '',
    ctx.isGuide && ctx.articleModifiedAt ? `<meta property='article:modified_time' content='${escapeHtml(ctx.articleModifiedAt)}'/>` : '',
    `<meta property='og:url' content='${canonical}'/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:site" content="@freetoolonline1"/>`,
    `<meta name="twitter:title" content='${escapeHtml(ctx.browserTitle)}'/>`,
    `<meta name="twitter:creator" content="@freetoolonline1"/>`,
    `<meta name="twitter:description" content='${description}'>`,
    `<meta name="twitter:image:src" content="https://dkbg1jftzfsd2.cloudfront.net/image/logo.200x200.png"/>`,
    `<meta name="twitter:url" content='${canonical}'/>`,
    ...alternateLinks,
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel='shortcut icon' type='image/png' href='https://dkbg1jftzfsd2.cloudfront.net/favicon.32x32.png'/>`,
    ctx.jsonLd,
    `<link rel="stylesheet" type="text/css" href="https://dkbg1jftzfsd2.cloudfront.net/style/common.css?v=${escapeHtml(ctx.appVersion)}" />`,
    `<style>${unwrapStyleBlock(ctx.themeCss)}${ctx.pageStyle ? `\n${ctx.pageStyle}` : ''}${ctx.customStyle ? `\n${ctx.customStyle}` : ''}</style>`,
  ].join('\n');
}

function renderHeader(ctx) {
  const pageTitleText = ctx.pageTitle || ctx.browserTitle;
  const logo = ctx.pageSvgLogo || DEFAULT_PAGE_SVG_LOGO;
  return `<header class="w3-top navBarContainer"><div class='w3-bar w3-card-2 new-style-nav-bar' id="mainNavBar"><label title="Toggle Dark Mode/Light Mode" class="dark-ctn toggle-switch"><input id="dark-tgl" class="w3-check" type="checkbox"><span class="slider"></span><span class="mode-icon"><i class="fas fa-sun sun-icon"></i><i class="fas fa-moon moon-icon"></i></span></label><button title="Show or hide the menu" class='w3-bar-item w3-button fa fa-bars menuToogle hide' href='javascript:void(0);' style='width: 40px' onclick='toggleMenu()'> <i class="fa fa-caret-down" style="display: inline;opacity: 0;"></i><i class="fa fa-caret-up" style="display: none;opacity: 0;"></i></button><div id='paypalDonateContainer'><form title="Donate via PayPal" class="w3-right paypalBtn" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank"><input type="hidden" name="cmd" value="_s-xclick" /><input type="hidden" name="hosted_button_id" value="W56TRR5BUFEGQ" /><input type="hidden" name="currency_code" value="USD" /><button id="donateBtnID" name="submit" alt="PayPal - The safer, easier way to pay online!" class="w3-button w3-orange donateBtn new-style-donateBtn"><i class="fa fa-paypal"></i> Donate </button></form></div><a id="buyMeACoffeeBtnID" target="_blank" href="https://www.buymeacoffee.com/freetoolonline.com" alt="Buy Me A Coffee" class="w3-button w3-orange donateBtn new-style-donateBtn buy-me-a-coffee" style="margin-top: 8.5px;float: right;margin-right: 10px;"><i class="fa fa-coffee"></i> Buy Me A Coffee</a><a class="w3-bar-item w3-button headerLogo color" href="${escapeHtml(ctx.siteOrigin)}" title="Go to Home page">${logo}</a><a title='Click to reload this page' href='${escapeHtml(ctx.siteOrigin)}${escapeHtml(ctx.pageUrl)}' class='w3-dropdown-hover pageNameContainer' ${ctx.hasSettings ? '' : "style='max-width: calc(100% - 100px)'"}>${pageTitleText ? `<div class='w3-padding-large w3-button navPageName'>${escapeHtml(pageTitleText)}</div>` : ''}</a>${ctx.showAds ? `<button style="display: none" id="disableAds" title='Click to disable ads' onclick="disableAds()" class="settingsBtn w3-right new-style-donateBtn"><i class="fa fa-file-image"></i>&nbsp;Disable Ads</button>` : ''}${ctx.hasSettings ? `<button title='Click to open the tool settings' onclick="document.getElementById('settings').style.display='block'" class="settingsBtn w3-right new-style-donateBtn"><i class="fa fa-cog"></i>&nbsp;Settings</button>` : ''}</div></header>`;
}

function renderToolSections(ctx) {
  if (!ctx.showAds) {
    return '';
  }
  const ratingBlock = ctx.showRating === false
    ? ''
    : `<div class="w3-row page-section"><div id="star-rating-container">Loading reviews...</div></div>`;
  const relatedToolsHtml = ctx.relatedToolsHtml ?? '';
  const relatedToolsTagsHtml = ctx.relatedToolsTagsHtml ?? '';
  // Cluster-hub callout - single anchor above the related-tools band. Cluster-aware
  // via seo-clusters.mjs::resolveHubBacklink. Renders only for tool pages that have
  // a resolvable cluster hub (§3.12).
  const clusterHubLink = ctx.clusterHubLink;
  const clusterHubBlock = clusterHubLink && clusterHubLink.href && clusterHubLink.label
    ? `<div class="w3-row page-section clusterHubCallout"><p style="margin: 0 0 8px;"><a href="${escapeHtml(clusterHubLink.href)}" style="color: #4caf50; font-weight: 600;">See all ${escapeHtml(clusterHubLink.label)} &rarr;</a></p></div>`
    : '';
  return `<!-- SEO_BLOCK:RELATED_TOOLS -->${clusterHubBlock}<div class="w3-row page-section relatedToolsSection"><p style="margin-bottom: 0px;">Related tools:</p><div class="relatedTools">${relatedToolsHtml}</div>${relatedToolsTagsHtml}<script>loadRelatedTools = function(){try{var relatedEl=document.querySelector('.relatedTools');if(relatedEl&&relatedEl.children&&relatedEl.children.length>0){window.__relatedToolsRequested=!0;return;}if(window.__relatedToolsRequested)return;if(document.querySelector('script[src*="related-tools.js"]')){window.__relatedToolsRequested=!0;return;}window.__relatedToolsRequested=!0;loadScript('${ctx.relatedToolsScriptPath}?v=' + APP_VERSION, function(){});}catch(e){}};document.addEventListener('DOMContentLoaded',function(){try{if(window.__relatedToolsBootstrapped)return;window.__relatedToolsBootstrapped=!0;loadRelatedTools();}catch(e){}});</script></div>${ratingBlock}${ctx.pageFaq ? ctx.pageFaq : ''}${ctx.bottomPageBannerAd || ''}<!-- END_SEO_BLOCK:RELATED_TOOLS -->`;
}

function buildJsonLdScript(payload) {
  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}

function buildWebApplicationJsonLd({ browserTitle, canonicalUrl, description, applicationCategory, aggregateRating }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `Free Tool Online - ${browserTitle}`,
    url: canonicalUrl,
    ...(description ? { description } : {}),
    operatingSystem: 'Any',
    applicationCategory: applicationCategory || 'UtilitiesApplication',
    // P8.2.4 schema-polish additions (Phase 8 Cycle 3): browserRequirements,
    // inLanguage, and a brand-logo screenshot so Google has a canonical visual
    // asset for SoftwareApp rich results. Per-tool screenshot upgrade deferred
    // to a dedicated CDN pipeline (P8.4.6 interim - default logo).
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    inLanguage: 'en-US',
    screenshot: 'https://dkbg1jftzfsd2.cloudfront.net/image/logo.200x200.png',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: '0',
    },
    ...(aggregateRating ? { aggregateRating } : {}),
  };
  return buildJsonLdScript(jsonLd);
}

// Article JSON-LD for /guides/* routes. Attributes the article to the
// freetoolonline editorial team (Person schema added to Organization) and
// records the publication/modified date for freshness signals.
function buildArticleJsonLd({ canonicalUrl, canonicalOrigin, headline, description, datePublished, dateModified }) {
  const siteUrl = canonicalForRoute(canonicalOrigin, '/');
  const orgId = `${siteUrl}#organization`;
  const editorialTeamId = `${siteUrl}#editorial-team`;
  return buildJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    ...(description ? { description } : {}),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    author: { '@id': editorialTeamId },
    publisher: { '@id': orgId },
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    image: 'https://dkbg1jftzfsd2.cloudfront.net/image/logo.200x200.png',
    speakable: {
      // P10.3.7 - `.answer` selector was a dead match on guides (0/19 guide
      // pages emit that class; it's a tool-page idiom). Drop it and keep the
      // two selectors that resolve reliably on every guide: the H1 and the
      // pale-green answer/definition panel.
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.w3-pale-green'],
    },
  });
}

function buildWebSiteJsonLd({ canonicalUrl, name, includeSearchAction = false }) {
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: canonicalUrl,
    inLanguage: 'en-US',
  };
  // SearchAction is only meaningful on the home route - enables the SERP
  // sitelinks-searchbox rich feature. The target uses the /tags.html route
  // because freetoolonline.com does not operate a dedicated /search endpoint;
  // the tag index is the closest canonical match for a query-driven browse.
  if (includeSearchAction) {
    payload.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${canonicalUrl.replace(/\/$/, '')}/tags.html?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    };
  }
  return buildJsonLdScript(payload);
}

function buildOrganizationJsonLd({ canonicalOrigin }) {
  const siteUrl = canonicalForRoute(canonicalOrigin, '/');
  const orgId = `${siteUrl}#organization`;
  const editorialTeamId = `${siteUrl}#editorial-team`;
  return buildJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    name: 'Free Tool Online',
    alternateName: 'freetoolonline',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: 'https://dkbg1jftzfsd2.cloudfront.net/image/logo.200x200.png',
      caption: 'Free Tool Online',
      width: 200,
      height: 200,
    },
    foundingDate: '2015',
    description: 'A collection of 100+ free, in-browser online tools (ZIP, PDF, image conversion, device tests, developer utilities, video) curated by the freetoolonline editorial team since 2015.',
    slogan: 'In-browser tools, no upload, no install.',
    sameAs: [
      'https://twitter.com/freetoolonline1',
      'https://www.buymeacoffee.com/freetoolonline.com',
      'https://www.trustpilot.com/review/freetoolonline.com',
      'https://github.com/dangkhoaow/freetoolonline-web',
    ],
    knowsAbout: [
      'file compression',
      'image conversion',
      'PDF tools',
      'HEIC to JPG conversion',
      'browser-based hardware diagnostics',
      'JavaScript and CSS minification',
      'video format conversion',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: canonicalForRoute(canonicalOrigin, '/contact-us.html'),
        availableLanguage: ['en', 'vi'],
      },
    ],
    // Editorial team surfaced as a named Person for E-E-A-T reinforcement.
    // Matches the editorial-byline.html fragment shipped in Phase 7 HIGH PRIORITY.
    employee: [
      {
        '@type': 'Person',
        '@id': editorialTeamId,
        name: 'freetoolonline editorial team',
        jobTitle: 'Editorial team',
        worksFor: { '@id': orgId },
        description: 'The Free Tool Online editorial team has shipped browser-based tools since 2015. Every tool is tested in the current versions of Chrome, Firefox, Safari, and Edge before publishing, processes your file inside your browser without uploading it, and is retired from the site if it breaks.',
        knowsAbout: [
          'in-browser file processing',
          'image and video conversion',
          'PDF manipulation',
          'browser hardware diagnostics',
          'JavaScript and CSS minification',
          'cross-browser testing',
        ],
      },
    ],
  });
}

function normalizeBreadcrumbLabel(label) {
  const raw = String(label ?? '').trim();
  if (!raw) {
    return '';
  }
  const normalized = raw.replace(/^back to\s+/i, '').trim();
  return normalized || raw;
}

function buildCollectionPageJsonLd({ canonicalOrigin, canonicalUrl, name, itemRoutes }) {
  const itemListElement = (itemRoutes ?? []).map((route, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: canonicalForRoute(canonicalOrigin, route),
  }));
  return buildJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: canonicalUrl,
    inLanguage: 'en-US',
    lastReviewed: '2026-04-25',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement,
    },
  });
}

function buildBreadcrumbJsonLd({ canonicalOrigin, items }) {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: canonicalForRoute(canonicalOrigin, item.route),
  }));
  return buildJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  });
}

function buildRelatedToolsSsr({ route, navTitle, urlMaps }) {
  const currentTitle = String(navTitle ?? '').trim();
  const currentTitleLower = currentTitle.toLowerCase();
  const currentRoute = String(route ?? '').trim();
  const currentRouteKey = (() => {
    if (!currentRoute || currentRoute === '/') return '/';
    const clean = currentRoute.split('?')[0].split('#')[0];
    const parts = clean.split('/').filter(Boolean);
    const leaf = parts[parts.length - 1] || '';
    if (!leaf || leaf === 'index.html') return '/';
    return leaf.startsWith('/') ? leaf : `/${leaf}`;
  })();

  if (!currentTitle || RELATED_TOOLS_TAGS_PAGE_TITLES.has(currentTitleLower)) {
    return { listHtml: '', tagsHtml: '', linkCount: 0, tagsCount: 0 };
  }

  const items = (urlMaps ?? []).map((item) => {
    const url = String(item?.url ?? '');
    let routeKey = '';
    try {
      const parsed = new URL(url);
      const pathname = String(parsed.pathname ?? '');
      const parts = pathname.split('/').filter(Boolean);
      const leaf = parts[parts.length - 1] || '';
      routeKey = !leaf || leaf === 'index.html' ? '/' : `/${leaf.replace(/^\//, '')}`;
    } catch {
      routeKey = '';
    }
    return {
      title: String(item?.title ?? ''),
      url,
      tags: String(item?.tags ?? ''),
      include: false,
      routeKey,
    };
  });
  let allCurrentTags = '';
  let isAddedAll = false;

  const getTagsFromCurrentPage = () => {
    const currentItem =
      items.find((item) => item.routeKey && item.routeKey === currentRouteKey) ||
      items.find((item) => item.title.toLowerCase() === currentTitleLower) ||
      null;

    if (!currentItem) {
      console.log(`[related-tools:ssr] Unable to match current page (route=${currentRoute}, title=${currentTitle}).`);
      return [];
    }

    const tagList = currentItem.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    if (!isAddedAll) {
      for (const tag of tagList) {
        const lower = tag.toLowerCase();
        allCurrentTags =
          (allCurrentTags !== '' ? `${allCurrentTags}, ` : allCurrentTags) +
          `<a target="_blank" style="color: #4caf50" href="https://freetoolonline.com/tags.html?tag=${lower}">#${lower}</a>`;
      }
    }
    isAddedAll = true;
    return tagList;
  };

  const addPagesHasTheSameTag = (candidateTags, currentTags) => {
    if (!candidateTags || !currentTags || !currentTags.length) {
      return '';
    }
    let matchedTags = '';
    for (const candidateTag of candidateTags) {
      for (const currentTag of currentTags) {
        if (
          candidateTag.toLowerCase() !== '' &&
          candidateTag.toLowerCase() !== 'null' &&
          candidateTag.toLowerCase() === currentTag.toLowerCase()
        ) {
          matchedTags = `${matchedTags} #${candidateTag.toLowerCase()}`;
        }
      }
    }
    return matchedTags;
  };

  const currentTags = getTagsFromCurrentPage();
  const listItems = [];

  for (const item of items) {
    if (!item.include && item.routeKey !== currentRouteKey) {
      const matchedTags = addPagesHasTheSameTag(item.tags.split(','), currentTags);
      if (matchedTags !== '') {
        item.include = true;
        listItems.push(
          `<li class="d-inline"><a title="This tool has the same tag(s): ${matchedTags}" style="color: #4caf50;" href="${item.url}">${item.title}</a></li>`,
        );
      }
    }
  }

  const currentTitleWords = currentTitle.toLowerCase().replace(/,/g, '').split(' ');
  for (const item of items) {
    let firstMatchedWord = false;
    const titleLower = item.title.toLowerCase();
    for (const word of currentTitleWords) {
      if (
        !item.include &&
        item.routeKey !== currentRouteKey &&
        !RELATED_TOOLS_STOP_WORDS.has(word) &&
        titleLower.indexOf(word) > -1
      ) {
        if (firstMatchedWord) {
          item.include = true;
          listItems.push(
            `<li class="d-inline"><a title="Go to ${item.title}" style="color: #3b73af;" href="${item.url}">${item.title}</a></li>`,
          );
        } else {
          firstMatchedWord = true;
        }
      }
    }
  }

  const hasList = listItems.length > 0;
  const listHtml = hasList ? `<ul style="${RELATED_TOOLS_LIST_STYLE}">${listItems.join('')}</ul>` : '';
  const tagsHtml = hasList && allCurrentTags !== '' ? `<p>Tags: ${allCurrentTags}</p>` : '';
  return { listHtml, tagsHtml, linkCount: listItems.length, tagsCount: tagsHtml ? currentTags.length : 0 };
}

function stripHtml(value) {
  return String(value ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFaqItems(faqHtml, pageName = '') {
  const raw = String(faqHtml ?? '').trim();
  if (!raw) {
    return [];
  }

  const logPrefix = pageName ? `[faq:${pageName}]` : '[faq]';
  // Primary: canonical "Frequently Asked Questions" header.
  // Extended: also accept FAQ-variant headers ("FAQ:", "FAQs", or "FAQ <topic>")
  // so fragments whose H2 uses a non-canonical phrasing still emit FAQPage JSON-LD.
  const headerRegex = /<h2[^>]*>[\s\S]*?(?:frequently asked questions|\bfaqs?\b[:\s][\s\S]*?)[\s\S]*?<\/h2>/i;
  let headerIndex = -1;
  let headerHtml = '';
  const headerMatch = raw.match(headerRegex);

  if (headerMatch && typeof headerMatch.index === 'number') {
    headerIndex = headerMatch.index;
    headerHtml = headerMatch[0];
    console.log(`${logPrefix} FAQ header matched with <h2> tag.`);
  } else {
    const lower = raw.toLowerCase();
    const probes = ['frequently asked questions', 'faq:', 'faqs:', 'faqs '];
    let textIndex = -1;
    for (const needle of probes) {
      const idx = lower.indexOf(needle);
      if (idx >= 0 && (textIndex < 0 || idx < textIndex)) textIndex = idx;
    }
    if (textIndex >= 0) {
      const startIndex = raw.lastIndexOf('<h2', textIndex);
      const endIndex = raw.indexOf('</h2>', textIndex);
      if (startIndex >= 0 && endIndex >= 0) {
        headerIndex = startIndex;
        headerHtml = raw.slice(startIndex, endIndex + 5);
        console.log(`${logPrefix} FAQ header matched via fallback slice.`);
      }
    }
  }

  if (headerIndex < 0) {
    console.log(`${logPrefix} FAQ header not found; skipping JSON-LD.`);
    return [];
  }

  const afterHeader = raw.slice(headerIndex + headerHtml.length);
  const nextHeaderIndex = afterHeader.search(/<h2[^>]*>/i);
  const faqSection = nextHeaderIndex >= 0 ? afterHeader.slice(0, nextHeaderIndex) : afterHeader;
  const qaRegex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  const items = [];
  let match = null;

  while ((match = qaRegex.exec(faqSection)) !== null) {
    const question = stripHtml(match[1]);
    const answer = stripHtml(match[2]);
    if (question && answer) {
      items.push({ question, answer });
    }
  }

  if (items.length === 0) {
    console.log(`${logPrefix} FAQ header found but no Q/A pairs extracted.`);
  }

  return items;
}

function buildFaqJsonLd(faqItems) {
  return buildJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  });
}

function deriveHowToStepName(text) {
  const cleaned = String(text ?? '').trim();
  if (!cleaned) {
    return '';
  }
  const firstSentence = cleaned.split(/[.!?]/)[0].trim();
  const base = firstSentence || cleaned;
  return base.length > 80 ? `${base.slice(0, 77)}…` : base;
}

function extractHowToSteps(bodyHtml, pageName = '', route = '') {
  const raw = String(bodyHtml ?? '').trim();
  if (!raw) {
    return [];
  }

  const logPrefix = pageName ? `[howto:${pageName}]` : '[howto]';
  const headSlice = raw.slice(0, 8000);
  const panelMatch = headSlice.match(/<div[^>]*class=['"][^'"]*w3-pale-green[^'"]*['"][^>]*>[\s\S]*?<\/div>/i);
  const scopeHtml = panelMatch ? panelMatch[0] : headSlice;
  const olMatch = scopeHtml.match(/<ol[^>]*>([\s\S]*?)<\/ol>/i);

  if (!olMatch) {
    console.log(`${logPrefix} No <ol> steps found for ${route || '(unknown route)'}.`);
    return [];
  }

  const steps = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match = null;
  while ((match = liRegex.exec(olMatch[1])) !== null) {
    const stepText = stripHtml(match[1]);
    if (stepText) {
      steps.push(stepText);
    }
  }

  if (steps.length === 0) {
    console.log(`${logPrefix} <ol> found but no <li> steps extracted for ${route || '(unknown route)'}.`);
  } else {
    console.log(`${logPrefix} Extracted ${steps.length} steps for ${route || '(unknown route)'}.`);
  }

  return steps;
}

function buildHowToJsonLd({ canonicalUrl, name, description, steps }) {
  const safeSteps = (steps ?? [])
    .map((text) => {
      const cleaned = String(text ?? '').trim();
      if (!cleaned) {
        return null;
      }
      const stepName = deriveHowToStepName(cleaned);
      return {
        '@type': 'HowToStep',
        ...(stepName ? { name: stepName } : {}),
        text: cleaned,
      };
    })
    .filter(Boolean);

  if (safeSteps.length === 0) {
    return '';
  }

  return buildJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    url: canonicalUrl,
    ...(description ? { description } : {}),
    step: safeSteps,
  });
}

export function parseJspPageSource(jspSource) {
  const match = String(jspSource ?? '').match(/<freetoolonline:page\b([^>]*)>([\s\S]*)<\/freetoolonline:page>/i);
  if (!match) {
    return { attrs: {}, innerHtml: String(jspSource ?? '') };
  }
  const attrs = {};
  for (const attrMatch of match[1].matchAll(/([\w-]+)=('([^']*)'|"([^"]*)")/g)) {
    attrs[attrMatch[1]] = attrMatch[3] ?? attrMatch[4] ?? '';
  }
  return { attrs, innerHtml: match[2] };
}

export function renderJspBody(innerHtml, ctx) {
  let html = replaceExpressions(innerHtml, ctx);
  html = html.replace(/<freetoolonline:loading\s*\/>/gi, renderLoadingTag());
  html = html.replace(/<freetoolonline:download\s*\/>/gi, renderDownloadTag());
  html = html.replace(/<freetoolonline:upload-second\s*\/>/gi, renderUploadSecondTag());
  html = html.replace(/<freetoolonline:upload(?:\s*\/>|>\s*<\/freetoolonline:upload>)/gi, renderUploadTag(ctx, ctx.appVersion));
  html = html.replace(/<freetoolonline:upload-startup\s+multiple='([^']*)'\s+fileType='([^']*)'\s*\/>/gi, (_, multiple, fileType) => renderUploadStartupTag(multiple, fileType, ctx));
  html = html.replace(/<freetoolonline:upload-startup-second\s+multiple='([^']*)'\s+fileType='([^']*)'\s*\/>/gi, (_, multiple, fileType) => renderUploadStartupSecondTag(multiple, fileType));
  html = html.replace(/<freetoolonline:welcome\s+welcomeTest='([^']*)'\s*\/>/gi, (_, welcomeTest) => renderWelcomeTag(replaceExpressions(welcomeTest, ctx)));
  html = html.replace(/<freetoolonline:share-btns>\s*<\/freetoolonline:share-btns>/gi, renderShareButtons(ctx));
  return html;
}

export function renderPageDocument({ route, siteOrigin, canonicalOrigin, basePath, isStaging, rewriteInternalContent, apiOrigin, shortenDomain, appVersion, ioVersion, getAlterUploaderDelayMs, bgsCollection, ioInfos, unsplashKey, randomString, sharedFragments, pageData, pageAttrs, bodyHtml, themeCss, aggregateRating, relatedToolsData }) {
  const normalizedRoute = route;
  const normalizedBasePath = normalizeBasePath(basePath);
  const pageName = pageData.pageName;
  const pageUrl = pageData.pageUrl;
  const isHome = normalizedRoute === '/';
  const expressionCtx = {
    pageBodyTitle: pageData.bodyTitle,
    pageBodyDesc: pageData.bodyDesc,
    pageBodyKeyword: pageData.bodyKeyword,
    pageBodyHTML: pageData.bodyHtml,
    pageBodyJS: pageData.bodyJs,
    pageBodyWelcome: pageData.bodyWelcome,
    pageBodyFileType: pageData.bodyFileType,
    pageBodyFileType2: pageData.bodyFileType2,
    pageFaq: pageData.faq,
    pageStyle: pageData.pageStyle,
    pageBrowserTitle: pageData.pageBrowserTitle,
    pageHasSettings: pageData.pageHasSettings,
    privacyContent: sharedFragments.privacyContent,
    shortenDomain,
    pageUrl,
    pageName,
  };
  const resolveAttr = (value) => replaceExpressions(value ?? '', expressionCtx).trim();

  const browserTitle = resolveAttr(pageAttrs.browserTitle) || pageData.pageBrowserTitle || pageData.bodyTitle;
  const pageTitle = resolveAttr(pageAttrs.pageTitle) || '';
  const description = resolveAttr(pageAttrs.description) || pageData.bodyDesc || '';
  const keyword = resolveAttr(pageAttrs.keyword) || pageData.bodyKeyword || '';
  const customStyle = resolveAttr(pageAttrs.customStyle) || '';
  const pageStyle = pageData.pageStyle || '';
  const lang = resolveAttr(pageAttrs.lang) || 'en';
  const hasSettingsAttr = resolveAttr(pageAttrs.hasSettings);
  const hasSettings = hasSettingsAttr === 'true' || hasSettingsAttr === 'TRUE' || pageData.pageHasSettings;
  const hasUpload = /<freetoolonline:upload(?:-startup(?:-second)?|-second)?\b/i.test(bodyHtml)
    || /id=['"]hasUploadFunc['"]/.test(bodyHtml)
    || /uploadContainerSecond/.test(bodyHtml)
    || /uploadContainer/.test(bodyHtml);
  const showAds = !isHome && !isInfoRoute(normalizedRoute) && normalizedRoute !== '/alternatead.html';
  const isHubPage = normalizedRoute.endsWith('-tools.html');
  const showRating = showAds && !isHubPage;
  const faqItems = extractFaqItems(pageData.faq, pageName);
  if (pageData.faq) {
    console.log(`[faq] Parsed ${faqItems.length} FAQ entries for ${pageName}.`);
  }
  const canonicalUrl = resolveCanonicalUrl({
    canonicalOrigin,
    route: normalizedRoute,
    canonicalUrl: pageData.canonicalUrl,
    basePath: normalizedBasePath,
  });
  const relatedToolsScriptPath = `${normalizedBasePath}/script/related-tools.js`;
  const navTitle = pageTitle || browserTitle;
  const hubBacklink = resolveHubBacklink(normalizedRoute);
  const hubGroup = SEO_CLUSTER_GROUPS.find((group) => group.hubRoute === normalizedRoute) ?? null;
  const hubLabelFromGroup = hubGroup ? normalizeBreadcrumbLabel(hubGroup.hubLabel) : '';
  const hubLabelFromBacklink = hubBacklink ? normalizeBreadcrumbLabel(hubBacklink.label) : '';
  const hubLabel = hubLabelFromBacklink || hubLabelFromGroup || (isHubPage ? browserTitle : '');
  const hubRoute = hubBacklink?.href || (isHubPage ? normalizedRoute : '');
  const hubItemRoutes = hubGroup ? hubGroup.routes : [];
  if (isHubPage) {
    console.log(`[schema] Hub ${normalizedRoute} item routes=${hubItemRoutes.length}.`);
  }
  const breadcrumbItems = [];
  if (!isHome) {
    breadcrumbItems.push({ name: 'Home', route: '/' });
    if (hubLabel && hubRoute) {
      breadcrumbItems.push({ name: hubLabel, route: hubRoute });
    }
    if (!isHubPage) {
      breadcrumbItems.push({ name: browserTitle, route: normalizedRoute });
    }
  }
  if (breadcrumbItems.length > 0) {
    console.log(`[schema] Breadcrumbs for ${normalizedRoute}: ${breadcrumbItems.length} items.`);
  }
  const aggregateRatingPayload = showRating && aggregateRating
    ? {
      '@type': 'AggregateRating',
      worstRating: 1,
      bestRating: 5,
      ratingValue: aggregateRating.ratingValue,
      ratingCount: aggregateRating.ratingCount,
    }
    : null;
  const jsonLd = showAds
    ? isHubPage
      ? buildCollectionPageJsonLd({ canonicalOrigin, canonicalUrl, name: browserTitle, itemRoutes: hubItemRoutes })
      : buildWebApplicationJsonLd({
        browserTitle,
        canonicalUrl,
        description,
        applicationCategory: resolveApplicationCategory(normalizedRoute),
        aggregateRating: aggregateRatingPayload,
      })
    : isHome
      ? buildWebSiteJsonLd({ canonicalUrl, name: 'Home Page - Free Tool Online', includeSearchAction: true })
      : buildWebSiteJsonLd({ canonicalUrl, name: `Free Tool Online - ${browserTitle}` });
  const faqJsonLd = faqItems.length > 0 ? buildFaqJsonLd(faqItems) : '';
  const breadcrumbJsonLd = breadcrumbItems.length > 0
    ? buildBreadcrumbJsonLd({ canonicalOrigin, items: breadcrumbItems })
    : '';
  const isGuide = isGuideRoute(normalizedRoute);
  // Organization JSON-LD: emit on home, hub pages, AND guide pages (guide Article
  // schema references the Organization and its editorial-team Person by @id).
  const organizationJsonLd = (isHome || isHubPage || isGuide) ? buildOrganizationJsonLd({ canonicalOrigin }) : '';
  if (organizationJsonLd) {
    console.log(`[schema:org] Injected Organization JSON-LD on ${normalizedRoute}.`);
  }
  // Article JSON-LD for /guides/* routes. Uses the page's browserTitle as headline,
  // meta description as abstract, and the hardcoded 2026-04-19 publish date (matches
  // the <time> element in each guide BODYHTML).
  const articleJsonLd = isGuide
    ? buildArticleJsonLd({
        canonicalUrl,
        canonicalOrigin,
        headline: browserTitle,
        description,
        datePublished: '2026-04-19T08:00:00Z',
        dateModified: '2026-04-25T08:00:00Z',
      })
    : '';
  if (articleJsonLd) {
    console.log(`[schema:article] ${normalizedRoute} headline="${browserTitle}".`);
  }
  const shouldIncludeHowTo = showAds && !isHubPage && HOWTO_ROUTES.has(normalizedRoute);
  const howToSteps = shouldIncludeHowTo ? extractHowToSteps(pageData.bodyHtml, pageName, normalizedRoute) : [];
  const howToJsonLd = shouldIncludeHowTo
    ? buildHowToJsonLd({ canonicalUrl, name: browserTitle, description, steps: howToSteps })
    : '';
  if (shouldIncludeHowTo) {
    console.log(`[schema:howto] ${normalizedRoute} steps=${howToSteps.length}.`);
  }
  const jsonLdBlock = [jsonLd, organizationJsonLd, articleJsonLd, breadcrumbJsonLd, howToJsonLd, faqJsonLd].filter(Boolean).join('\n');
  const head = renderMetaTags({
    siteOrigin,
    route: normalizedRoute,
    pageName,
    pageUrl,
    isHome,
    isStaging,
    isGuide,
    articlePublishedAt: isGuide ? '2026-04-19T08:00:00Z' : '',
    articleModifiedAt: isGuide ? '2026-04-23T08:00:00Z' : '',
    browserTitle,
    mobileBrowserTitle: pageData.pageBrowserTitleMobile,
    description,
    keyword,
    canonicalUrl,
    lang,
    pageTitle,
    themeCss,
    customStyle,
    pageStyle,
    jsonLd: jsonLdBlock,
    appVersion,
  });
  const titleText = navTitle;
  const body = renderJspBody(bodyHtml, {
    siteOrigin,
    apiOrigin,
    shortenDomain,
    pageName,
    pageUrl,
    bodyTitle: pageData.bodyTitle,
    bodyDesc: pageData.bodyDesc,
    bodyKeyword: pageData.bodyKeyword,
    pageBodyTitle: pageData.bodyTitle,
    pageBodyDesc: pageData.bodyDesc,
    pageBodyKeyword: pageData.bodyKeyword,
    pageBodyHTML: pageData.bodyHtml,
    pageBodyJS: pageData.bodyJs,
    pageBodyWelcome: pageData.bodyWelcome,
    pageBodyFileType: pageData.bodyFileType,
    pageBodyFileType2: pageData.bodyFileType2,
    pageFaq: pageData.faq,
    pageStyle: pageData.pageStyle,
    pageBrowserTitle: pageData.pageBrowserTitle,
    pageHasSettings: pageData.pageHasSettings,
    privacyContent: sharedFragments.privacyContent,
    appVersion,
    ioVersion,
    getAlterUploaderDelayMs,
    bgsCollection,
    ioInfos,
  });
  const relatedToolsState = showAds && relatedToolsData?.urlMaps
    ? buildRelatedToolsSsr({ route: normalizedRoute, navTitle, urlMaps: relatedToolsData.urlMaps })
    : { listHtml: '', tagsHtml: '', linkCount: 0, tagsCount: 0 };
  if (showAds && relatedToolsData?.urlMaps) {
    console.log(`[related-tools:ssr] ${normalizedRoute} links=${relatedToolsState.linkCount} tags=${relatedToolsState.tagsCount}.`);
  }
  // Cluster-hub link above related-tools on tool pages (not hubs/home/info).
  // resolveHubBacklink returns { href, label } for tool pages in a cluster; null otherwise.
  const clusterHubLink = !isHubPage && !isHome && !isInfoRoute(normalizedRoute)
    ? resolveHubBacklink(normalizedRoute)
    : null;
  if (clusterHubLink) {
    console.log(`[seo:cluster-hub] ${normalizedRoute} → ${clusterHubLink.href} (${clusterHubLink.label}).`);
  }
  const toolSections = renderToolSections({
    showAds,
    showRating,
    pageFaq: pageData.faq,
    bottomPageBannerAd: sharedFragments.bottomPageBannerAd,
    relatedToolsScriptPath,
    relatedToolsHtml: relatedToolsState.listHtml,
    relatedToolsTagsHtml: relatedToolsState.tagsHtml,
    clusterHubLink,
  });
  const relatedStyles = !hasUpload ? `<style>#content.w3-content { margin-top: 50px; }</style>` : '';
  const showDisableAdsScript = showAds ? `<script>isLoadAds = true;</script>` : '';
  const toolContent = showAds ? toolSections : '';
  const showEditorialSurface = isHome || isHubPage || isGuide;
  const editorialByline = showEditorialSurface ? (sharedFragments.editorialByline || '') : '';
  const editorialTrust = showEditorialSurface ? (sharedFragments.editorialTrust || '') : '';
  if (showEditorialSurface && (editorialByline || editorialTrust)) {
    console.log(`[seo:editorial] Injected byline/trust on ${normalizedRoute}.`);
  }
  const stagingBanner = isStaging ? buildStagingBannerHtml() : '';
  // P10.1.2 - Staging GA4 isolation. Staging must not emit the prod GA4/GTM
  // property; `noindex` does not suppress GA event transmission. Default ON for
  // production builds (isStaging=false). Flip GA4_DISABLED=1 for any build to
  // suppress all GTM + GA injection (used by staging CI to prevent prod GA4
  // property pollution from `/freetoolonline-web-test/*` pageviews).
  const ga4Disabled = isStaging || process.env.GA4_DISABLED === '1';
  const gtmHead = ga4Disabled ? '' : (sharedFragments.firstLoadJsThirdParty || '');
  const gtmNoscript = ga4Disabled ? '' : (sharedFragments.topBodyContent || '');
  const gaExtendedScript = ga4Disabled ? '' : (sharedFragments.extendedJsThirdParty || '');
  if (ga4Disabled) {
    console.log(`[seo:ga4] disabled route=${normalizedRoute} reason=${isStaging ? 'staging' : 'env-flag'}.`);
  }
  const bodyMarkup = rewriteInternalContent(`
<body class="new-style-body">
${gtmNoscript}
${renderBaseScript({ siteOrigin, apiOrigin, pageUrl, pageName, appVersion, ioVersion, getAlterUploaderDelayMs, bgsCollection, ioInfos, unsplashKey, randomString, basePath: normalizedBasePath })}
${showDisableAdsScript}
${renderHeader({ siteOrigin, pageUrl, pageName, browserTitle, pageTitle, hasSettings, showAds, pageSvgLogo: sharedFragments.pageSvgLogo, })}
${stagingBanner}
<div class='w3-content' id='content'>
<div class='w3-row'>
${sharedFragments.rightBannerAd || ''}
<main class="w3-rest w3-container page-main-content" role="main">
${sharedFragments.topPageBannerAd || ''}
<style>@media(max-width: 999px) {.ad-section.top-ad>ins:after { content: '${escapeHtml(titleText)}'; }}</style>
<div class='w3-row page-section'>
<div class='w3-container w3-padding-0'>
${body}
${relatedStyles}
</div>
</div>
${editorialByline}
${editorialTrust}
${sharedFragments.inContentBannerAd || ''}
${toolContent}
</main>
<div id="cookieConsent"></div>
</div>
</div>
${sharedFragments.footer || ''}
<div id='nav_menu' class='w3-sidebar w3-bar-block new-style-nav_menu w3-hide-small' style="display: none">
${sharedFragments.lMenu || ''}
</div>
<script>${gaExtendedScript}</script>
<style type="text/css">
${sharedFragments.extendedBodyContent ? '' : ''}
</style>
${sharedFragments.extendedBodyContent || ''}
</body>`);
  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}" class="main-html ads-init ads-disabled page-${escapeHtml(pageName)}root${hasUpload ? ' has-upload' : ''}">
<head>
${gtmHead}
${head}
</head>
${bodyMarkup}
</html>`;
}

export function renderRedirectPage({ siteOrigin, canonicalOrigin, sourceRoute, targetRoute }) {
  const targetUrl = canonicalForRoute(siteOrigin, targetRoute);
  const canonicalUrl = canonicalForRoute(canonicalOrigin, targetRoute);
  // noindex,follow consolidates canonical authority from alias URLs onto the target
  // page (plan §3.8). `follow` lets crawlers pass link equity through to the target,
  // which is what we want for alias→canonical redirects.
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8"/>\n<meta name="robots" content="noindex, follow"/>\n<meta http-equiv="refresh" content="0; url=${escapeHtml(targetUrl)}"/>\n<link rel="canonical" href="${escapeHtml(canonicalUrl)}"/>\n<title>Redirecting...</title>\n<script>\n(function(){\n  var target = ${JSON.stringify(targetUrl)};\n  var suffix = (window.location.search || '') + (window.location.hash || '');\n  window.location.replace(target + suffix);\n})();\n</script>\n</head>\n<body>\n<p>Redirecting from ${escapeHtml(sourceRoute)} to <a href="${escapeHtml(targetUrl)}">${escapeHtml(targetUrl)}</a>.</p>\n</body>\n</html>`;
}

export function renderAlternateAdPage({ canonicalOrigin }) {
  const canonicalUrl = canonicalForRoute(canonicalOrigin, '/alternatead.html');
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8"/>\n<meta name="robots" content="noindex, nofollow"/>\n<link rel="canonical" href="${escapeHtml(canonicalUrl)}"/>\n<title>Alternate Ad</title>\n<script>\n(function(){\n  var params = new URLSearchParams(window.location.search);\n  var url = params.get('url') || '';\n  var img = params.get('img') || '';\n  document.addEventListener('DOMContentLoaded', function(){\n    document.body.innerHTML = '<a href="' + url.replaceAll('"', '&quot;') + '" target="_top"><img src="https://dkbg1jftzfsd2.cloudfront.net/image/ad/' + img.replaceAll('"', '&quot;') + '.jpg"/></a>';\n  });\n})();\n</script>\n</head>\n<body></body>\n</html>`;
}

