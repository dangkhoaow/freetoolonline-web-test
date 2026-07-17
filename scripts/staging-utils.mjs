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

  // Non-route static path prefixes keep the original per-pattern pass (constant
  // count, ~5 patterns - cost is negligible and prefix-shaped sources like
  // /img/illustrations don't fit the route-token scan below).
  const staticReplacements = [];
  const seenStatic = new Set();

  const registerStatic = (source, target) => {
    if (!source || !target || seenStatic.has(source)) {
      return;
    }

    seenStatic.add(source);
    staticReplacements.push({
      source,
      target,
      pattern: new RegExp(`(^|[^A-Za-z0-9_-])(${escapeRegExp(source)})(?=$|[^A-Za-z0-9_-])`, 'g'),
    });
  };

  registerStatic(
    '/script/related-tools.js',
    normalizedBasePath ? `${normalizedBasePath}/script/related-tools.js` : '/script/related-tools.js',
  );
  registerStatic('/view/donate.html', normalizedBasePath ? `${normalizedBasePath}/view/donate.html` : '/view/donate.html');
  registerStatic('/view/rating.html', normalizedBasePath ? `${normalizedBasePath}/view/rating.html` : '/view/rating.html');
  registerStatic('/view/top-page-banner-ad.html', normalizedBasePath ? `${normalizedBasePath}/view/top-page-banner-ad.html` : '/view/top-page-banner-ad.html');

  // Cycle 20260524-10: register the /img/illustrations subtree so SVG illustrations
  // shipped by the svg_illustration_author strategy resolve under the staging
  // base-path. cycle 9 shipped /img/illustrations/feature-badge/free__ae04979c.svg
  // with absolute /img/... <img src> which 404s on the staging GH Pages URL
  // (https://dangkhoaow.github.io/freetoolonline-web-test/...). The page-load-probe
  // regression on cycle 10 caught the asset 404. Append-only registration; prod
  // builds (basePath="") get no-op replacement.
  if (normalizedBasePath) {
    registerStatic('/img/illustrations', `${normalizedBasePath}/img/illustrations`);
  }

  // Perf note (2026-07-17): route rewrites used to compile one RegExp per
  // registered form (absolute + relative = 2 per route) and run EVERY pattern
  // as its own .replace() pass over each page's full HTML. At 5.2k routes that
  // is ~10.5k sequential regex passes per page - O(routes x page bytes) per
  // page, O(routes^2) per build. The Pages build grew 6min -> 70min as the
  // route map grew 823 -> 4.7k routes (route count x per-page cost both scale
  // with routes). Replaced with ONE URL-token scan + Map lookup below:
  // per-page cost is O(page bytes) and no longer scales with route count.
  // Boundary semantics ((^|[^A-Za-z0-9_-]) prefix, (?=$|[^A-Za-z0-9_-])
  // lookahead) are preserved exactly; the token charset [A-Za-z0-9/_-] plus a
  // literal .html tail matches the normalized route shapes and fails through
  // to a Map miss (leave text untouched) for any non-registered token, which
  // is byte-identical to the old per-pattern boundary behavior.
  const routeTargets = new Map();

  const registerRoute = (source, target) => {
    if (!source || !target || routeTargets.has(source)) {
      return;
    }
    routeTargets.set(source, target);
  };

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

    registerRoute(`https://freetoolonline.com${sourceRoute}`, targetUrl);
    registerRoute(sourceRoute, targetUrl);
  }

  const ROUTE_TOKEN_PATTERN = /(^|[^A-Za-z0-9_-])((?:https:\/\/freetoolonline\.com)?\/[A-Za-z0-9/_-]+\.html)(?=$|[^A-Za-z0-9_-])/g;

  return (value) => {
    let text = String(value ?? '');
    if (!text) {
      return text;
    }

    for (const { pattern, target } of staticReplacements) {
      text = text.replace(pattern, (_, prefix) => `${prefix}${target}`);
    }

    text = text.replace(ROUTE_TOKEN_PATTERN, (match, prefix, token) => {
      const target = routeTargets.get(token);
      return target === undefined ? match : `${prefix}${target}`;
    });

    return text;
  };
}

export function buildStagingBannerHtml() {
  return `<!-- SEO_BLOCK:STAGING_BANNER -->\n<div class="staging-banner" style="margin: 0 0 12px;padding: 6px 12px;background: #b00020;color: #fff;font-size: 12px;font-weight: 700;letter-spacing: 0.02em;text-align: center;position: fixed;top: 0;left: 0;width: 100vw;z-index: 999999;opacity: 0.2;height: 42px;">STAGING ENVIRONMENT - Not for production use.</div>\n<!-- END_SEO_BLOCK:STAGING_BANNER -->`;
}
