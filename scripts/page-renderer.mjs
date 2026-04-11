import { canonicalForRoute, isInfoRoute } from './site-data.mjs';
import { DEFAULT_PAGE_SVG_LOGO, escapeHtml, renderBaseScript, renderDownloadTag, renderLoadingTag, renderShareButtons, renderUploadSecondTag, renderUploadStartupSecondTag, renderUploadStartupTag, renderUploadTag, renderWelcomeTag, replaceExpressions, unwrapStyleBlock } from './page-fragments.mjs';
import { buildStagingBannerHtml, normalizeBasePath, resolveCanonicalUrl } from './staging-utils.mjs';

function renderMetaTags(ctx) {
  const canonicalUrl = ctx.canonicalUrl;
  const siteUrl = canonicalForRoute(ctx.siteOrigin, ctx.route);
  const hreflang = ctx.lang === 'vi' ? 'vi-vn' : 'en-us';
  const title = ctx.isHome ? 'Home Page - Free Tool Online' : `${ctx.browserTitle} - Free Tool Online`;
  const ogTitle = ctx.isHome ? 'Free Tool Online - Home Page' : `Free Tool Online - ${ctx.browserTitle}`;
  const description = escapeHtml(ctx.description || '');
  const keywords = escapeHtml(ctx.keyword || '');
  const canonical = escapeHtml(canonicalUrl || siteUrl);
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta http-equiv='cache-control' content='max-age=0, public'/>`,
    `<meta http-equiv='expires' content='0'/>`,
    `<meta http-equiv='pragma' content='no-cache'/>`,
    `<meta http-equiv='cleartype' content='on'>`,
    `<meta charset="utf-8"/>`,
    `<meta name='description' content='${description}' />`,
    `<meta name='keywords' content='${keywords}'/>`,
    `<meta name="author" content='freetoolonline.com' />`,
    `<meta rel="author" href="https://www.linkedin.com/in/ktran1991/" />`,
    `<meta name="copyright" content="Copyright 2017 freetoolonline.com" />`,
    `<meta name='msvalidate.01' content='505D81A78DC4F7E37C1BD2E1092B4420' />`,
    `<meta name="baidu-site-verification" content="swIR2wbBvq" />`,
    `<meta name="yandex-verification" content="efeeb1a14a628297" />`,
    `<meta name="google-site-verification" content="G2vSQjrnGdjMgxsydPFQBuLffcKtZyo4f7VSzefzvQ4" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">`,
    `<meta name='apple-mobile-web-app-capable' content='yes'>`,
    `<meta name='mobile-web-app-capable' content='yes'>`,
    `<meta name='HandheldFriendly' content='True'>`,
    `<meta name='MobileOptimized' content='320'>`,
    `<meta name='apple-mobile-web-app-status-bar-style' content='black'>`,
    ctx.isStaging ? `<meta name="robots" content="noindex, nofollow">` : '',
    `<meta property='og:title' content='${escapeHtml(ogTitle)}'/>`,
    `<meta property='og:description' content='${description}'/>`,
    `<meta property='og:image' content='https://dkbg1jftzfsd2.cloudfront.net/image/logo.200x200.png'/>`,
    `<meta property='og:type' content='website'/>`,
    `<meta property='og:url' content='${canonical}'/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:site" content="@freetoolonline1"/>`,
    `<meta name="twitter:title" content='${escapeHtml(ctx.browserTitle)}'/>`,
    `<meta name="twitter:creator" content="@freetoolonline1"/>`,
    `<meta name="twitter:description" content='${description}'>`,
    `<meta name="twitter:image:src" content="https://dkbg1jftzfsd2.cloudfront.net/image/logo.200x200.png"/>`,
    `<meta name="twitter:url" content='${canonical}'/>`,
    `<link rel='alternate' href='${canonical}' hreflang='${hreflang}' />`,
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
  return `<header class="w3-top navBarContainer"><div class='w3-bar w3-card-2 new-style-nav-bar' id="mainNavBar"><label title="Toggle Dark Mode/Light Mode" class="dark-ctn toggle-switch"><input id="dark-tgl" class="w3-check" type="checkbox"><span class="slider"></span><span class="mode-icon"><i class="fas fa-sun sun-icon"></i><i class="fas fa-moon moon-icon"></i></span></label><button title="Show or hide the menu" class='w3-bar-item w3-button fa fa-bars menuToogle hide' href='javascript:void(0);' style='width: 40px' onclick='toggleMenu()'> <i class="fa fa-caret-down" style="display: inline;opacity: 0;"></i><i class="fa fa-caret-up" style="display: none;opacity: 0;"></i></button><div id='paypalDonateContainer'><form title="Donate via PayPal" class="w3-right paypalBtn" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank"><input type="hidden" name="cmd" value="_s-xclick" /><input type="hidden" name="hosted_button_id" value="W56TRR5BUFEGQ" /><input type="hidden" name="currency_code" value="USD" /><button id="donateBtnID" name="submit" alt="PayPal - The safer, easier way to pay online!" class="w3-button w3-orange donateBtn new-style-donateBtn"><i class="fa fa-paypal"></i> Donate </button></form></div><a id="buyMeACoffeeBtnID" target="_blank" href="https://www.buymeacoffee.com/freetoolonline.com" alt="Buy Me A Coffee" class="w3-button w3-orange donateBtn new-style-donateBtn buy-me-a-coffee" style="margin-top: 8.5px;float: right;margin-right: 10px;"><i class="fa fa-coffee"></i> Buy Me A Coffee</a><a class="w3-bar-item w3-button headerLogo color" href="${escapeHtml(ctx.siteOrigin)}?utm_source=internal&utm_medium=page&utm_content=header" title="Go to Home page">${logo}</a><a title='Click to reload this page' href='${escapeHtml(ctx.siteOrigin)}${escapeHtml(ctx.pageUrl)}' class='w3-dropdown-hover pageNameContainer' ${ctx.hasSettings ? '' : "style='max-width: calc(100% - 100px)'"}>${pageTitleText ? `<h1 class='w3-padding-large w3-button navPageName'>${escapeHtml(pageTitleText)}</h1>` : ''}</a>${ctx.showAds ? `<button style="display: none" id="disableAds" title='Click to disable ads' onclick="disableAds()" class="settingsBtn w3-right new-style-donateBtn"><i class="fa fa-file-image"></i>&nbsp;Disable Ads</button>` : ''}${ctx.hasSettings ? `<button title='Click to open the tool settings' onclick="document.getElementById('settings').style.display='block'" class="settingsBtn w3-right new-style-donateBtn"><i class="fa fa-cog"></i>&nbsp;Settings</button>` : ''}</div></header>`;
}

function renderToolSections(ctx) {
  if (!ctx.showAds) {
    return '';
  }
  const ratingBlock = ctx.showRating === false
    ? ''
    : `<div class="w3-row page-section"><div id="star-rating-container">Loading reviews...</div></div>`;
  return `<!-- SEO_BLOCK:RELATED_TOOLS --><div class="w3-row page-section relatedToolsSection"><p style="margin-bottom: 0px;">Related tools:</p><div class="relatedTools"></div><script>loadRelatedTools = function(){try{if(window.__relatedToolsRequested)return;if(document.querySelector('script[src*="related-tools.js"]')){window.__relatedToolsRequested=!0;return;}window.__relatedToolsRequested=!0;loadScript('${ctx.relatedToolsScriptPath}?v=' + APP_VERSION, function(){});}catch(e){}};document.addEventListener('DOMContentLoaded',function(){try{if(window.__relatedToolsBootstrapped)return;window.__relatedToolsBootstrapped=!0;loadRelatedTools();}catch(e){}});</script></div>${ratingBlock}${ctx.pageFaq ? ctx.pageFaq : ''}${ctx.bottomPageBannerAd || ''}<!-- END_SEO_BLOCK:RELATED_TOOLS -->`;
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

export function renderPageDocument({ route, siteOrigin, canonicalOrigin, basePath, isStaging, rewriteInternalContent, apiOrigin, shortenDomain, appVersion, ioVersion, getAlterUploaderDelayMs, bgsCollection, ioInfos, unsplashKey, randomString, sharedFragments, pageData, pageAttrs, bodyHtml, themeCss }) {
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
  if (isHubPage) {
    console.log(`[render] hub page detected; suppressing rating block: ${normalizedRoute}`);
  }
  const canonicalUrl = resolveCanonicalUrl({
    canonicalOrigin,
    route: normalizedRoute,
    canonicalUrl: pageData.canonicalUrl,
    basePath: normalizedBasePath,
  });
  const relatedToolsScriptPath = `${normalizedBasePath}/script/related-tools.js`;
  const jsonLd = showAds
    ? `<script type="application/ld+json">{"@context":"http://schema.org/","@type":"WebApplication","name":"Free Tool Online - ${escapeHtml(browserTitle)}","url":"${escapeHtml(canonicalUrl)}","operatingSystem":"All","applicationSuite":"Online","applicationCategory":"Online","offers":{"@type":"Offer","priceCurrency":"USD","price":"0.0"},"aggregateRating":{"@context":"http://schema.org","@type":"AggregateRating","worstRating":"1","bestRating":"5","ratingValue":"5","ratingCount":"1"}}</script>`
    : isHome
      ? `<script type="application/ld+json">{"@context":"http://schema.org/","@type":"WebSite","name":"Home Page - Free Tool Online","url":"${escapeHtml(canonicalUrl)}"}</script>`
      : `<script type="application/ld+json">{"@context":"http://schema.org/","@type":"WebSite","name":"Free Tool Online - ${escapeHtml(browserTitle)}","url":"${escapeHtml(canonicalUrl)}"}</script>`;
  const head = renderMetaTags({
    siteOrigin,
    route: normalizedRoute,
    pageName,
    pageUrl,
    isHome,
    isStaging,
    browserTitle,
    description,
    keyword,
    canonicalUrl,
    lang,
    pageTitle,
    themeCss,
    customStyle,
    pageStyle,
    jsonLd,
    appVersion,
  });
  const titleText = pageTitle || browserTitle;
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
  const toolSections = renderToolSections({
    showAds,
    showRating: !isHubPage,
    pageFaq: pageData.faq,
    bottomPageBannerAd: sharedFragments.bottomPageBannerAd,
    relatedToolsScriptPath,
  });
  const relatedStyles = !hasUpload ? `<style>#content.w3-content { margin-top: 50px; }</style>` : '';
  const showDisableAdsScript = showAds ? `<script>isLoadAds = true;</script>` : '';
  const toolContent = showAds ? toolSections : '';
  const stagingBanner = isStaging ? buildStagingBannerHtml() : '';
  const bodyMarkup = rewriteInternalContent(`
<body class="new-style-body">
${sharedFragments.topBodyContent || ''}
${renderBaseScript({ siteOrigin, apiOrigin, pageUrl, pageName, appVersion, ioVersion, getAlterUploaderDelayMs, bgsCollection, ioInfos, unsplashKey, randomString })}
${showDisableAdsScript}
${renderHeader({ siteOrigin, pageUrl, pageName, browserTitle, pageTitle, hasSettings, showAds, pageSvgLogo: sharedFragments.pageSvgLogo, })}
${stagingBanner}
<div class='w3-content' id='content'>
<div class='w3-row'>
${sharedFragments.rightBannerAd || ''}
<div class="w3-rest w3-container page-main-content">
${sharedFragments.topPageBannerAd || ''}
<style>@media(max-width: 999px) {.ad-section.top-ad>ins:after { content: '${escapeHtml(titleText)}'; }}</style>
<div class='w3-row page-section'>
<div class='w3-container w3-padding-0'>
${body}
${relatedStyles}
</div>
</div>
${sharedFragments.inContentBannerAd || ''}
${toolContent}
</div>
<div id="cookieConsent"></div>
</div>
</div>
${sharedFragments.footer || ''}
<div id='nav_menu' class='w3-sidebar w3-bar-block new-style-nav_menu w3-hide-small' style="display: none">
${sharedFragments.lMenu || ''}
</div>
<script>${sharedFragments.extendedJsThirdParty || ''}</script>
<style type="text/css">
${sharedFragments.extendedBodyContent ? '' : ''}
</style>
${sharedFragments.extendedBodyContent || ''}
</body>`);
  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}" class="main-html ads-init ads-disabled page-${escapeHtml(pageName)}root">
<head>
${sharedFragments.firstLoadJsThirdParty || ''}
${head}
</head>
${bodyMarkup}
</html>`;
}

export function renderRedirectPage({ siteOrigin, canonicalOrigin, sourceRoute, targetRoute }) {
  const targetUrl = canonicalForRoute(siteOrigin, targetRoute);
  const canonicalUrl = canonicalForRoute(canonicalOrigin, targetRoute);
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8"/>\n<meta name="robots" content="noindex, nofollow"/>\n<meta http-equiv="refresh" content="0; url=${escapeHtml(targetUrl)}"/>\n<link rel="canonical" href="${escapeHtml(canonicalUrl)}"/>\n<title>Redirecting...</title>\n<script>window.location.replace(${JSON.stringify(targetUrl)});</script>\n</head>\n<body>\n<p>Redirecting from ${escapeHtml(sourceRoute)} to <a href="${escapeHtml(targetUrl)}">${escapeHtml(targetUrl)}</a>.</p>\n</body>\n</html>`;
}

export function renderAlternateAdPage({ canonicalOrigin }) {
  const canonicalUrl = canonicalForRoute(canonicalOrigin, '/alternatead.html');
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8"/>\n<meta name="robots" content="noindex, nofollow"/>\n<link rel="canonical" href="${escapeHtml(canonicalUrl)}"/>\n<title>Alternate Ad</title>\n<script>\n(function(){\n  var params = new URLSearchParams(window.location.search);\n  var url = params.get('url') || '';\n  var img = params.get('img') || '';\n  document.addEventListener('DOMContentLoaded', function(){\n    document.body.innerHTML = '<a href="' + url.replaceAll('"', '&quot;') + '" target="_top"><img src="https://dkbg1jftzfsd2.cloudfront.net/image/ad/' + img.replaceAll('"', '&quot;') + '.jpg"/></a>';\n  });\n})();\n</script>\n</head>\n<body></body>\n</html>`;
}

