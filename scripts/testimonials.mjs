// testimonials.mjs - curated, PII-scrubbed real user testimonials for the
// E-E-A-T / trust section (operator request 2026-07-10).
//
// SOURCE OF TRUTH + CONTRACT:
//   - Every entry is a REAL public review copied from the site's own
//     BuyMeACoffee (buymeacoffee.com/freetoolonline.com) or Trustpilot
//     (trustpilot.com/review/freetoolonline.com) profile. `sourceUrl` is the
//     public profile so any quote is verifiable. NEVER invent a testimonial,
//     a name, a rating, or a count.
//   - Reader-first + house rules: quotes are shown as VISIBLE, attributed
//     content only; the site emits NO first-party Review / AggregateRating
//     JSON-LD (self-serving review markup is a Google manual-action risk and
//     is gated off by P10.1.1 - the sanctioned Trustpilot TrustBox widget
//     carries Trustpilot's own schema instead).
//   - Curation (applied here, not at render): keep genuine, specific,
//     positive, on-topic quotes; DROP empty / confused / negative / bare
//     "thanks". PII scrub: drop email-address "names"; full names -> first
//     name + last initial; strip emoji; R9 ASCII only (fold diacritics,
//     umlauts -> ue/oe/ae/ss). Light edits for ASCII/length only, never
//     changing meaning.
//   - Because these are attributed third-party quotes (not tool-behaviour
//     claims), qa-truthful-content-claim excludes the .user-testimonials
//     container from its per-tool claim diff (extraction-rules.md carve-out).
//
// MAINTENANCE: operator-fed. When the operator pastes a fresh batch, curate
// per the rules above, append/replace entries here, run
// `node scripts/testimonials.mjs --validate`, rebuild, ship. No scraper.

export const PROFILE_URLS = {
  trustpilot: 'https://www.trustpilot.com/review/freetoolonline.com',
  buymeacoffee: 'https://buymeacoffee.com/freetoolonline.com',
};

// tools[] entries are tool slugs OR cluster tags; a testimonial renders on a
// tool page when one of these matches the page slug or its related-tools tags.
export const TESTIMONIALS = [
  // --- Tool-specific (render on the matching tool page) ---
  {
    id: 'tp-jonatan-lcd',
    quote: 'A super fast tool to verify dead pixels on any monitor or screen, including tablets and mobile devices. I use it often without errors.',
    author: 'Jonatan Y.',
    location: 'MX',
    source: 'trustpilot',
    sourceUrl: 'https://www.trustpilot.com/review/freetoolonline.com',
    date: '2025-02-12',
    lang: 'en',
    tools: ['lcd-test'],
    featured: false,
  },
  {
    id: 'bmac-valerie-heic',
    quote: 'My go-to converter when I see those horrible letters .heic',
    author: 'Valerie',
    source: 'buymeacoffee',
    sourceUrl: 'https://buymeacoffee.com/freetoolonline.com',
    lang: 'en',
    tools: ['heic-to-jpg'],
    featured: false,
  },

  // --- Featured (homepage cross-tool trust) ---
  {
    id: 'tp-jennifer-reliable',
    quote: 'Very reliable. I have been using this for years without issue.',
    author: 'Jennifer A.',
    location: 'US',
    source: 'trustpilot',
    sourceUrl: 'https://www.trustpilot.com/review/freetoolonline.com',
    date: '2025-10-12',
    lang: 'en',
    tools: [],
    featured: true,
  },
  {
    id: 'tp-hermel-free',
    quote: 'Easy to use and totally free.',
    author: 'Hermel Q.',
    location: 'BJ',
    source: 'trustpilot',
    sourceUrl: 'https://www.trustpilot.com/review/freetoolonline.com',
    date: '2025-07-11',
    lang: 'en',
    tools: [],
    featured: true,
  },
  {
    id: 'bmac-rhea-bestfree',
    quote: 'This is the best free tool. Thank you so much!',
    author: 'Rhea',
    source: 'buymeacoffee',
    sourceUrl: 'https://buymeacoffee.com/freetoolonline.com',
    lang: 'en',
    tools: [],
    featured: true,
  },
  {
    id: 'bmac-clare-lifesaver',
    quote: 'Your tool is a lifesaver, thank you.',
    author: 'Clare',
    source: 'buymeacoffee',
    sourceUrl: 'https://buymeacoffee.com/freetoolonline.com',
    lang: 'en',
    tools: [],
    featured: true,
  },
  {
    id: 'bmac-gjk-alive',
    quote: 'Great utility - thanks for keeping it alive!',
    author: 'GJK',
    source: 'buymeacoffee',
    sourceUrl: 'https://buymeacoffee.com/freetoolonline.com',
    lang: 'en',
    tools: [],
    featured: true,
  },
  {
    id: 'bmac-avanti-slideshow',
    quote: 'Your tool helped me edit a family reunion slideshow. Thank you so much!',
    author: 'Avanti',
    source: 'buymeacoffee',
    sourceUrl: 'https://buymeacoffee.com/freetoolonline.com',
    lang: 'en',
    tools: [],
    featured: true,
  },
  {
    id: 'bmac-ralf-de',
    quote: 'Einfaches, schnelles Tool mit gute Ergebnisse. Bestens!',
    author: 'Ralf S.',
    source: 'buymeacoffee',
    sourceUrl: 'https://buymeacoffee.com/freetoolonline.com',
    lang: 'de',
    tools: [],
    featured: true,
  },
];

function escLite(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

const SOURCE_LABEL = { trustpilot: 'Trustpilot', buymeacoffee: 'Buy Me a Coffee' };

// Self-contained styles (the section renders on the homepage AND tool pages;
// PAGESTYLE.css is homepage-only, so the section carries its own scoped CSS to
// render consistently sitewide without a CloudFront/theme-file edit). One
// section per page -> one style block per page.
// NOTE: no box rule on the bare `.user-testimonials` selector on purpose.
// Home renders inside .bento-cell-testimonials (PAGESTYLE neutralizes the box);
// tool renders as a .w3-row.page-section and inherits the site card chrome
// (white bg, border, 10px padding, card shadow, 10px bottom margin) so it
// matches the FAQ / User Rating cards. Only INNER elements are styled here.
const TESTIMONIALS_CSS =
  '.user-testimonials>h2{margin:0 0 12px}' +
  '.user-testimonials .testimonial-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}' +
  '.user-testimonials figure.testimonial{margin:0;padding:12px 16px;border:1px solid #e2e8f0;border-radius:4px;background:#fff}' +
  '.user-testimonials blockquote{margin:0 0 8px;font-size:14px;line-height:1.5;color:#0f172a}' +
  '.user-testimonials figcaption{font-size:12px;color:#64748b}' +
  '.user-testimonials .t-author{font-weight:600;color:#334155}' +
  '.user-testimonials .t-src{margin-left:4px;color:#2563eb}' +
  '.user-testimonials .testimonials-more{font-size:12px;margin:10px 0 0;color:#64748b}' +
  '.user-testimonials .testimonials-tp{margin-top:10px}' +
  'html.main-html.dark .user-testimonials figure.testimonial{background:#1f2937;border-color:#30363d}' +
  'html.main-html.dark .user-testimonials blockquote{color:#e6edf3}' +
  'html.main-html.dark .user-testimonials .t-author{color:#c9d1d9}' +
  '@media(max-width:599px){.user-testimonials .testimonial-grid{grid-template-columns:1fr}}';

// Reuse the site's PROVEN Trustpilot TrustBox config (from rating.html): same
// businessunit + template + CloudFront-hosted bootstrap loader, so no new
// external dependency and it is known to render for this business. The widget
// carries Trustpilot's OWN schema; the site emits no first-party review markup.
const TP_WIDGET =
  '<div class="trustpilot-widget" data-locale="en-US" data-template-id="56278e9abfbbba0bdcd568bc" ' +
  'data-businessunit-id="67559ca69ddbaeac9eae1322" data-style-height="52px" data-style-width="100%">' +
  '<a href="https://www.trustpilot.com/review/freetoolonline.com" target="_blank" rel="noopener">Trustpilot</a></div>' +
  '<script>(function(){function b(){if(window.__tpLoaded)return;window.__tpLoaded=1;' +
  'var u="https://dkbg1jftzfsd2.cloudfront.net/script/lib/tp.widget.bootstrap.min.js";' +
  'if(typeof loadScript==="function"){loadScript(u,function(){});}else{var s=document.createElement("script");s.async=1;s.src=u;document.body.appendChild(s);}}' +
  'if("requestIdleCallback" in window){requestIdleCallback(b,{timeout:3000});}else{setTimeout(b,1200);}})();</script>';

/**
 * Pure HTML for the testimonials trust section. `opts`:
 *   { variant: "home" | "tool", heading?, widget?: bool }
 * Declarative (no Q&A shape); the .user-testimonials container is excluded
 * from the truthful-claim diff (attributed third-party quotes, not tool
 * claims - see qa-truthful-content-claim/references/extraction-rules.md).
 * Returns '' for an empty list so callers can inline unconditionally.
 */
export function renderTestimonialsSection(testimonials, opts = {}) {
  const list = Array.isArray(testimonials) ? testimonials.filter(Boolean) : [];
  if (!list.length) return '';
  const isTool = opts.variant === 'tool';
  const heading = opts.heading || (isTool ? 'What users say about this tool' : 'What people say');
  const figures = list.map((t) => {
    const label = SOURCE_LABEL[t.source] || 'a supporter';
    const loc = t.location ? ` (${escLite(t.location)})` : '';
    return (
      `<figure class="testimonial">` +
      `<blockquote>${escLite(t.quote)}</blockquote>` +
      `<figcaption><span class="t-author">${escLite(t.author)}${loc}</span> ` +
      `<a class="t-src" href="${escLite(t.sourceUrl)}" target="_blank" rel="noopener">via ${escLite(label)}</a>` +
      `</figcaption></figure>`
    );
  }).join('');
  const more =
    `<p class="testimonials-more">` +
    `<a href="${escLite(PROFILE_URLS.trustpilot)}" target="_blank" rel="noopener">Read more reviews on Trustpilot</a>` +
    ` or <a href="${escLite(PROFILE_URLS.buymeacoffee)}" target="_blank" rel="noopener">Buy Me a Coffee</a>.</p>`;
  const widget = opts.widget ? `<div class="testimonials-tp">${TP_WIDGET}</div>` : '';
  const body = `<div class="testimonial-grid">${figures}</div>${more}${widget}`;
  if (isTool) {
    // Tool pages: a normal .page-section card (same margin/padding/border/
    // shadow as the adjacent User Rating + FAQ cards) with the standard tool-
    // page section heading. No inline chrome-strip, no homepage box rule.
    return (
      `<!-- SEO_BLOCK:TESTIMONIALS -->` +
      `<style>${TESTIMONIALS_CSS}</style>` +
      `<div class="w3-row page-section user-testimonials testimonialsSection" aria-labelledby="testimonials-h">` +
      `<h2 id="testimonials-h" class="text-uppercase">${escLite(heading)}</h2>` +
      `${body}` +
      `</div>` +
      `<!-- END_SEO_BLOCK:TESTIMONIALS -->`
    );
  }
  // Homepage: bento-cell context (PAGESTYLE handles the box); card chrome is
  // intentionally stripped so it reads as a bento tile, per the operator's
  // homepage styling.
  return (
    `<!-- SEO_BLOCK:TESTIMONIALS -->` +
    `<style>${TESTIMONIALS_CSS}</style>` +
    `<section class="user-testimonials page-section" aria-labelledby="testimonials-h" style="border: none !important;box-shadow: none !important;margin-left: 0 !important;">` +
    `<h2 id="testimonials-h" class="bento-h2 text-uppercase">${escLite(heading)}</h2>` +
    `<div class="testimonial-grid">${figures}</div>` +
    `${more}${widget}` +
    `</section>` +
    `<!-- END_SEO_BLOCK:TESTIMONIALS -->`
  );
}

/** Featured testimonials for the homepage trust section. */
export function getFeaturedTestimonials(limit = 6) {
  return TESTIMONIALS.filter((t) => t.featured).slice(0, limit);
}

/**
 * Tool-specific testimonials for a tool page. Matches the page slug or any of
 * its related-tools tags against each testimonial's `tools[]`. Returns [] when
 * nothing genuinely relevant exists - tool pages never show generic filler.
 */
export function getTestimonialsForTool(slug, tags = [], limit = 3) {
  const wanted = new Set([slug, ...(tags || [])].filter(Boolean));
  return TESTIMONIALS.filter((t) => (t.tools || []).some((x) => wanted.has(x))).slice(0, limit);
}

// --- Self-validation (node scripts/testimonials.mjs --validate) ------------
// Enforces the curation contract mechanically: ASCII-only, no emoji, no
// email-address authors, required fields present, valid source.
export function validateTestimonials(list = TESTIMONIALS) {
  const errors = [];
  const EMAIL_RE = /@|\.(com|net|org|gmx|gmail)/i;
  // Non-ASCII (covers emoji + accented chars that must be folded).
  const NON_ASCII_RE = /[^\x00-\x7F]/;
  const seen = new Set();
  for (const t of list) {
    const at = `[${t.id || '(no id)'}]`;
    if (!t.id) errors.push(`${at} missing id`);
    if (seen.has(t.id)) errors.push(`${at} duplicate id`);
    seen.add(t.id);
    for (const f of ['quote', 'author', 'source', 'sourceUrl', 'lang']) {
      if (!t[f]) errors.push(`${at} missing ${f}`);
    }
    if (!['trustpilot', 'buymeacoffee'].includes(t.source)) errors.push(`${at} bad source ${t.source}`);
    if (t.author && EMAIL_RE.test(t.author)) errors.push(`${at} author looks like an email/PII: ${t.author}`);
    if (t.quote && NON_ASCII_RE.test(t.quote)) errors.push(`${at} quote has non-ASCII (emoji/diacritic): ${t.quote}`);
    if (t.author && NON_ASCII_RE.test(t.author)) errors.push(`${at} author has non-ASCII: ${t.author}`);
    if (t.sourceUrl && !/^https:\/\/(www\.)?(trustpilot\.com|buymeacoffee\.com)\//.test(t.sourceUrl)) {
      errors.push(`${at} sourceUrl not a trustpilot/buymeacoffee profile: ${t.sourceUrl}`);
    }
  }
  return errors;
}

const isDirectRun = process.argv[1] && process.argv[1].endsWith('testimonials.mjs');
if (isDirectRun && process.argv.includes('--validate')) {
  const errs = validateTestimonials();
  if (errs.length) {
    console.error(`testimonials: ${errs.length} validation error(s):`);
    for (const e of errs) console.error('  ' + e);
    process.exit(1);
  }
  console.log(`testimonials: OK (${TESTIMONIALS.length} entries, ${getFeaturedTestimonials(99).length} featured, ${TESTIMONIALS.length - getFeaturedTestimonials(99).length} tool-specific).`);
}
