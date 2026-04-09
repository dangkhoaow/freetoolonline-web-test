import { ALIAS_ROUTES, canonicalForRoute, normalizeRoute, stripTrailingSlash } from './site-data.mjs';

const STAGING_ROUTE_EXCLUSIONS = new Set(['/about-us.html', '/contact-us.html', '/privacy-policy.html']);

export function normalizeBasePath(value) {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return '';
  }

  const normalized = raw.startsWith('/') ? raw : `/${raw}`;
  return normalized === '/' ? '' : normalized.replace(/\/+$/, '');
}

export function stripBasePath(pathname, basePath) {
  const normalizedPath = normalizeRoute(pathname);
  const normalizedBasePath = normalizeBasePath(basePath);

  if (!normalizedBasePath || normalizedPath === '/') {
    return normalizedPath;
  }

  if (normalizedPath === normalizedBasePath) {
    return '/';
  }

  if (normalizedPath.startsWith(`${normalizedBasePath}/`)) {
    return normalizedPath.slice(normalizedBasePath.length) || '/';
  }

  return normalizedPath;
}

export function resolveCanonicalUrl({ canonicalOrigin, route, canonicalUrl, basePath = '' }) {
  const normalizedOrigin = stripTrailingSlash(canonicalOrigin);
  const fallback = canonicalForRoute(normalizedOrigin, route);
  const raw = String(canonicalUrl ?? '').trim();

  if (!raw) {
    return fallback;
  }

  try {
    const parsed = new URL(raw, normalizedOrigin.endsWith('/') ? normalizedOrigin : `${normalizedOrigin}/`);
    const cleanPath = stripBasePath(parsed.pathname || '/', basePath);
    const pathSuffix = cleanPath === '/' ? '' : cleanPath;
    return `${normalizedOrigin}${pathSuffix}${parsed.search}${parsed.hash}`;
  } catch {
    const cleanPath = stripBasePath(raw, basePath);
    return cleanPath === '/' ? normalizedOrigin : canonicalForRoute(normalizedOrigin, cleanPath);
  }
}

function escapeRegExp(value) {
  return String(value ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function createInternalContentRewriter({ siteOrigin, basePath = '', routeCandidates = [] }) {
  const normalizedOrigin = stripTrailingSlash(siteOrigin);
  const normalizedBasePath = normalizeBasePath(basePath);
  const replacements = [];
  const seen = new Set();

  const register = (source, target) => {
    if (!source || !target || seen.has(source)) {
      return;
    }

    seen.add(source);
    replacements.push({
      source,
      target,
      pattern: new RegExp(`(^|[^A-Za-z0-9_-])(${escapeRegExp(source)})(?=$|[^A-Za-z0-9_-])`, 'g'),
    });
  };

  register(
    '/script/related-tools.js',
    normalizedBasePath ? `${normalizedBasePath}/script/related-tools.js` : '/script/related-tools.js',
  );

  for (const candidate of routeCandidates) {
    const sourceRoute = normalizeRoute(candidate);
    if (!sourceRoute.endsWith('.html')) {
      continue;
    }

    if (STAGING_ROUTE_EXCLUSIONS.has(sourceRoute)) {
      continue;
    }

    const targetRoute = Object.prototype.hasOwnProperty.call(ALIAS_ROUTES, sourceRoute)
      ? normalizeRoute(ALIAS_ROUTES[sourceRoute])
      : sourceRoute;
    const targetUrl = canonicalForRoute(normalizedOrigin, targetRoute);

    register(`https://freetoolonline.com${sourceRoute}`, targetUrl);
    register(sourceRoute, targetUrl);
  }

  return (value) => {
    let text = String(value ?? '');
    if (!text) {
      return text;
    }

    for (const { pattern, target } of replacements) {
      text = text.replace(pattern, (_, prefix) => `${prefix}${target}`);
    }

    return text;
  };
}

export function buildStagingBannerHtml() {
  return `<!-- SEO_BLOCK:STAGING_BANNER -->\n<div class="staging-banner" style="margin: 0 0 12px; padding: 6px 12px; background: #b00020; color: #fff; font-size: 12px; font-weight: 700; letter-spacing: 0.02em; text-align: center;">STAGING ENVIRONMENT - Not for production use.</div>\n<!-- END_SEO_BLOCK:STAGING_BANNER -->`;
}
