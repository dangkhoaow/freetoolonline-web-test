<style>
/* ============================================================
 * DESIGN TOKEN LAYER - added 2026-04-30 per Workstream A.5/A.6
 * of SITE_ENHANCEMENT_PLAN.md (cohort-grounded palette).
 *
 * STATUS: scaffold + visual-parity values. Tokens are defined
 * here so the wider CSS can opt into var(--*) gradually. The
 * VALUES below match the existing rendered colors so this
 * commit is visually neutral. The palette FLIP (orange→blue
 * CTA, refreshed slate-blue body, etc., per cohort-grounded
 * recommendation in seo-reports/20260430/analyts/COHORT_AND_UX
 * _OPPORTUNITY_REPORT.md Part 4) happens in a SUBSEQUENT
 * cycle-18 commit that only changes the token VALUES - no
 * rule rewrites needed.
 *
 * Cohort grounding (cycle-16 GA4 + Bing pulls):
 *  - geo: India 38.87% / USA 11.49% / Indonesia 7.15%
 *  - device: desktop 82.15% / mobile 17.30%
 *  - OS: Windows 70.72% / Android 12.28% / Mac 8.97%
 *
 * Owner approvals: OA2 (cohort hypothesis) + OA3 (orange→blue
 * accent) confirmed 2026-04-30 against the cohort report Part 4.
 *
 * Dark-mode wiring: existing site uses html.main-html.dark
 * class toggle (see #dark-tgl checkbox in nav header). Tokens
 * are overridden under that selector AND under the OS-default
 * @media (prefers-color-scheme: dark) for first-paint dark
 * before the toggle JS runs.
 * ============================================================ */

/* PALETTE FLIP - cycle 16 of 2026-04-30. Values data-grounded by R2.5 cohort
 * research at seo-reports/20260430/research/audience-cohort-design-trends.md.
 * Each value carries source attribution + WCAG mode-parity verification.
 * Cohort: India 38.87% emerging-market desktop-Windows + USA 11.49% affluent-desktop. */
:root {
    /* SURFACES - off-white page on light per Muzli ("kinder on low-end IPS panels"),
     * GitHub-style #0d1117 on dark per Bound Dev ("never #000; halation effect"). */
    --bg-primary:    #fafafa;
    --bg-surface:    #ffffff;          /* cards on off-white = subtle elevation */
    --bg-tertiary:   #f4f5f7;

    /* TEXT - slate-900 body per Mavik Labs token-arch + WCAG-AAA (#0f172a on
     * #fafafa = 17.4:1 vs old #333 on #fff = 12.6:1; deeper contrast helps
     * India tier-3 low-end displays). */
    --text-primary:  #0f172a;
    --text-muted:    #64748b;          /* slate-500 */
    --text-heading:  #0f172a;          /* same as body; hierarchy via weight */

    /* BRAND-MARK LOGO - UNCHANGED per OA3 (orange brand mark stays as identity;
     * blue takes over the CTA semantic). */
    --logo-orange:   #ff4d00;
    --logo-navy:     #00436e;
    --logo-grey:     #3a3a3a;

    /* ACCENT / CTA - blue-600 mid-tone per Prospeo ("survives inversion; saturated
     * blue or green holds up better than pale pastel"). #2563eb on #fafafa = 6.7:1 (WCAG AA Large). */
    --accent:        #2563eb;
    --cta-bg:        var(--accent);
    --cta-text:      #ffffff;
    --link:          #2563eb;
    --link-hover:    #1d4ed8;          /* blue-700 */

    /* PANELS - semantic mapping unchanged (w3-pale-* compatibility) */
    --panel-success-bg:   #dff0d8;
    --panel-info-bg:      #e7f3fe;
    --panel-warn-bg:      #fff8d5;
    --panel-error-bg:     #ffdddd;
    --panel-success-text: #2c662d;
    --panel-info-text:    #1b4f8c;
    --panel-warn-text:    #6b5e1a;
    --panel-error-text:   #762020;

    /* BORDERS - slate scale per Mavik Labs */
    --border-subtle: #e2e8f0;          /* slate-200 */
    --border-input:  #cbd5e1;          /* slate-300 (refresh from #ccd0d5) */
    --shadow-card:   0 1px 3px rgba(15, 23, 42, 0.08);

    /* TYPOGRAPHY - Inter variable + system-stack fallback per Figma 2026 +
     * Ozrit (India low-bandwidth) - system-stack FIRST in fallback chain so
     * Windows 70% gets Segoe UI immediately, no webfont blocking on slow
     * connections; Inter loads as enhancement. */
    --font-body:     'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --font-mono:     'JetBrains Mono', ui-monospace, 'Cascadia Code', Menlo, Consolas, monospace;
    --line-height-body: 1.6;           /* generous; non-native-English readers benefit */

    /* SPACING - 8px base */
    --space-1: 4px; --space-2: 8px; --space-3: 16px;
    --space-4: 24px; --space-5: 32px; --space-6: 48px;

    /* RADIUS */
    --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;

    /* TAP-TARGET - mobile/India cohort needs 48px on /camera-test specifically */
    --tap-target-min: 44px;
}

/* DARK MODE - manual toggle via #dark-tgl checkbox (existing JS sets html.main-html.dark) */
html.main-html.dark {
    --bg-primary:    #0d1117;          /* GitHub dark; NOT #000 per Bound Dev */
    --bg-surface:    #1f2937;          /* slate-800; brighter elevation than #161b22 so cards read distinctly on bg-primary */
    --bg-tertiary:   #2a3441;          /* +1 step up for callout / panel-info chrome */

    --text-primary:  #e6edf3;          /* off-white per Bound Dev - pure white halates */
    --text-muted:    #8b949e;
    --text-heading:  #f0f6fc;          /* slight brightness boost over body */

    --accent:        #4f93d4;          /* lighter mid-tone blue; #4f93d4 on #0d1117 = 5.4:1 (WCAG AA) */
    --cta-bg:        var(--accent);
    --cta-text:      #0d1117;          /* dark text on light blue CTA in dark mode */
    --link:          #58a6ff;          /* GitHub-style; 7.2:1 (WCAG AAA) */
    --link-hover:    #79b8ff;

    --panel-success-bg:   hsl(140, 25%, 14%);
    --panel-info-bg:      hsl(210, 25%, 14%);
    --panel-warn-bg:      hsl(45, 25%, 14%);
    --panel-error-bg:     hsl(0, 25%, 14%);
    --panel-success-text: hsl(140, 50%, 80%);
    --panel-info-text:    hsl(210, 50%, 80%);
    --panel-warn-text:    hsl(45, 50%, 80%);
    --panel-error-text:   hsl(0, 50%, 80%);

    --border-subtle: #30363d;
    --border-input:  #30363d;
    --shadow-card:   0 1px 3px rgba(0, 0, 0, 0.4);
}

/* OS-default dark `@media (prefers-color-scheme: dark)` block REMOVED 2026-04-30
 * cycle-17 W/E follow-up #8 per ROOT-CAUSE-DISCIPLINE.
 *
 * SYMPTOM: user explicitly clicks the LIGHT toggle while OS prefers dark; the
 * page renders DARK regardless. Chips render with LIGHT tokens (white) inside
 * a DARK page (token-driven dark via @media) -> chips visually broken.
 *
 * HYPOTHESIS: existing toggle JS removes `html.main-html.dark` class on light
 * toggle but does NOT add a `.light` class. My @media selector was
 * `:root:not(.light)`, which still matches because `.light` was never set.
 * Result: explicit light toggle is silently overridden by OS preference.
 *
 * ISOLATION: removing the @media block leaves the toggle as the sole driver of
 * theme. OS-dark users see a brief flash of light at first paint until the
 * toggle JS sets `.dark`; that flash already exists in the legacy site (which
 * predates this @media addition) and is the lesser evil compared to ignoring
 * the user's explicit choice.
 *
 * ROOT-CAUSE FIX: delete the @media block. Theme is now controlled by exactly
 * ONE signal: the `html.main-html.dark` class set by the toggle JS. */
/* ===== END DESIGN TOKEN LAYER ===== */

.fa {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale
}

.fa-heart:before {
    content: '\f004'
}

.fa-circle:before {
    content: '\f111';
    font-size: 10px;
    vertical-align: middle
}

.fa-file-pdf:before {
    content: '\f1c1'
}

.fa-file-archive:before {
    content: '\f1c6'
}

.fa-file-image:before {
    content: '\f1c5'
}

.fa-tools:before {
    content: '\f0ad'
}

.fa-sync:before {
    content: '\f021'
}

.fa-tag:before {
    content: '\f02b'
}

.fa-lock:before {
    content: '\f023';
    font-size: 22px
}

.fa-mail:before {
    content: '\f0e0'
}

.fa-arrows:before {
    content: '\f047'
}

.fa-crop:before {
    content: '\f125'
}

.fa-rotate-left:before {
    content: '\f0e2'
}

.fa-rotate-right:before {
    content: '\f01e'
}

.fa-search-plus:before {
    content: '\f00e'
}

.fa-search-minus:before {
    content: '\f010'
}

.fa-paypal:before {
    content: '\f1ed'
}

.fa-user:before {
    content: '\f007'
}

.fa-map-marker:before {
    content: '\f041'
}

.fa-paper-plane:before {
    content: '\f1d8'
}

.fa-reddit:before {
    content: '\f1a1'
}

.fa-linkedin:before {
    content: '\f0e1'
}

.fa-google:before {
    content: '\f1a0'
}

.fa-twitter:before {
    content: '\f099'
}

.fa-facebook:before {
    content: '\f09a'
}

.fa-question-circle:before {
    content: '\f059'
}

.fa-bars:before {
    content: '\f0c9';
    font-size: 16px
}

.fa-check-circle:before {
    content: '\f058'
}

.fa-photo:before {
    content: '\f03e'
}

.fa-close:before {
    content: '\f00d';
    font-size: 16px
}

.fa-cog:before {
    content: '\f013'
}

.fa-arrow-up:before {
	content: '\f106'
}

.fa-spin {
    -webkit-animation: fa-spin 5s linear infinite;
    animation: fa-spin 5s linear infinite
}

@-webkit-keyframes fa-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg)
    }

    to {
        -webkit-transform: rotate(1turn);
        transform: rotate(1turn)
    }
}

@keyframes fa-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg)
    }

    to {
        -webkit-transform: rotate(1turn);
        transform: rotate(1turn)
    }
}

@font-face {
    font-family:'FontAwesome';src:local('FontAwesome'),url(https://dkbg1jftzfsd2.cloudfront.net/fonts/fontawesome-webfont.eot?v=4.7.0);src:local('FontAwesome'),url(https://dkbg1jftzfsd2.cloudfront.net/fonts/fontawesome-webfont.eot?#iefix&amp;v=4.7.0) format('embedded-opentype'),url(https://dkbg1jftzfsd2.cloudfront.net/fonts/fontawesome-webfont.woff2?v=4.7.0) format('woff2'),url(https://dkbg1jftzfsd2.cloudfront.net/fonts/fontawesome-webfont.woff?v=4.7.0) format('woff'),url(https://dkbg1jftzfsd2.cloudfront.net/fonts/Font-awesome/fontawesome-webfont.ttf?v=4.7.0) format('truetype'),url(https://dkbg1jftzfsd2.cloudfront.net/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular) format('svg');font-display:swap
}
		
/* W3PRO.CSS 4.13 June 2019 by Jan Egil and Borge Refsnes */
html {
    box-sizing: border-box
}

*,*:before,*:after {
    box-sizing: inherit
}
/* Extract from normalize.css by Nicolas Gallagher and Jonathan Neal git.io/normalize */
html {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%
}

body {
    margin: 0
}

article,aside,details,figcaption,figure,footer,header,main,menu,nav,section {
    display: block
}

summary {
    display: list-item
}

audio,canvas,progress,video {
    display: inline-block
}

progress {
    vertical-align: baseline
}

audio:not([controls]) {
    display: none;
    height: 0
}

[hidden],template {
    display: none
}

a {
    background-color: transparent
}



abbr[title] {
    border-bottom: none;
    text-decoration: underline;
    text-decoration: underline dotted
}

b,strong {
    font-weight: bolder
}

dfn {
    font-style: italic
}

mark {
    background: #ff0;
    color: #000
}

small {
    font-size: 80%
}

sub,sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline
}

sub {
    bottom: -0.25em
}

sup {
    top: -0.5em
}

figure {
    margin: 1em 40px
}

img {
    border-style: none
}

code,kbd,pre,samp {
    font-family: monospace,monospace;
    font-size: 1em
}

hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible
}

button,input,select,textarea,optgroup {
    font: inherit;
    margin: 0
}

optgroup {
    font-weight: bold
}

button,input {
    overflow: visible
}

button,select {
    text-transform: none
}

button,[type=button],[type=reset],[type=submit] {
    -webkit-appearance: button
}

button::-moz-focus-inner,[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner {
    border-style: none;
    padding: 0
}

button:-moz-focusring,[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring {
    outline: 1px dotted ButtonText
}

fieldset {
    border: 1px solid #c0c0c0;
    margin: 0 2px;
    padding: .35em .625em .75em
}

legend {
    color: inherit;
    display: table;
    max-width: 100%;
    padding: 0;
    white-space: normal
}

textarea {
    overflow: auto
}

[type=checkbox],[type=radio] {
    padding: 0
}

[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button {
    height: auto
}

[type=search] {
    -webkit-appearance: textfield;
    outline-offset: -2px
}

[type=search]::-webkit-search-decoration {
    -webkit-appearance: none
}

::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit
}
/* End extract */
html,body {
    font-family: Verdana,sans-serif;
    font-size: 15px;
    line-height: 1.5
}

html {
    overflow-x: hidden
}

h1 {
    font-size: 22px
}

h2 {
    font-size: 19px
}

h3 {
    font-size: 18px
}

h4 {
    font-size: 17px
}

h5 {
    font-size: 16px
}

h6 {
    font-size: 15px
}

.w3-serif {
    font-family: serif
}

h1,h2,h3,h4,h5,h6 {
    font-family: "Segoe UI",Arial,sans-serif;
    font-weight: 400;
    margin: 10px 0
}

.w3-wide {
    letter-spacing: 4px
}

hr {
    border: 0;
    border-top: 1px solid #ccc;
    margin: 10px 0
}

.w3-image {
    max-width: 100%;
    height: auto
}

img {
    vertical-align: middle
}

a {
    color: inherit
}

.w3-table,.w3-table-all {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    display: table
}

.w3-table-all {
    border: 1px solid #ccc
}

.w3-bordered tr,.w3-table-all tr {
    border-bottom: 1px solid #ddd
}

.w3-striped tbody tr:nth-child(even) {
    background-color: #f1f1f1
}

.w3-table-all tr:nth-child(odd) {
    background-color: #fff
}

.w3-table-all tr:nth-child(even) {
    background-color: #f1f1f1
}



.w3-centered tr th,.w3-centered tr td {
    text-align: center
}

.w3-table td,.w3-table th,.w3-table-all td,.w3-table-all th {
    padding: 8px 8px;
    display: table-cell;
    text-align: left;
    vertical-align: top
}

.w3-table th:first-child,.w3-table td:first-child,.w3-table-all th:first-child,.w3-table-all td:first-child {
    padding-left: 16px
}

.w3-btn,.w3-button {
    border: none;
    display: inline-block;
    padding: 8px 16px;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    background-color: inherit;
    text-align: center;
    cursor: pointer;
    white-space: nowrap
}



.w3-btn,.w3-button {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
}

.w3-disabled,.w3-btn:disabled,.w3-button:disabled {
    cursor: not-allowed;
    opacity: 0.3
}

.w3-disabled *,:disabled * {
    pointer-events: none
}



.w3-badge,.w3-tag {
    background-color: #000;
    color: #fff;
    display: inline-block;
    padding-left: 8px;
    padding-right: 8px;
    text-align: center
}

.w3-badge {
    border-radius: 50%
}

.w3-ul {
    list-style-type: none;
    padding: 0;
    margin: 0
}

.w3-ul li {
    padding: 8px 16px;
    border-bottom: 1px solid #ddd
}

.w3-ul li:last-child {
    border-bottom: none
}

.w3-tooltip,.w3-display-container {
    position: relative
}

.w3-tooltip .w3-text {
    display: none
}



.w3-ripple:active {
    opacity: 0.5
}

.w3-ripple {
    transition: opacity 0s
}

.w3-input {
    padding: 8px;
    display: block;
    border: none;
    border-bottom: 1px solid #ccc;
    width: 100%
}

.w3-select {
    padding: 9px 0;
    width: 100%;
    border: none;
    border-bottom: 1px solid #ccc
}

.w3-dropdown-click,.w3-dropdown-hover {
    position: relative;
    display: inline-block;
    cursor: pointer
}



.w3-dropdown-hover:first-child,.w3-dropdown-click:hover {
    background-color: #ccc;
    color: #000
}

.w3-dropdown-hover:hover > .w3-button:first-child,.w3-dropdown-click:hover > .w3-button:first-child {
    background-color: #ccc;
    color: #000
}

.w3-dropdown-content {
    cursor: auto;
    color: #000;
    background-color: #fff;
    display: none;
    position: absolute;
    min-width: 160px;
    margin: 0;
    padding: 0;
    z-index: 1
}

.w3-check,.w3-radio {
    width: 24px;
    height: 24px;
    position: relative;
    top: 6px
}

.w3-sidebar {
    height: 100%;
    width: 200px;
    background-color: #fff;
    position: fixed!important;
    z-index: 1;
    overflow: auto
}

.w3-bar-block .w3-dropdown-hover,.w3-bar-block .w3-dropdown-click {
    width: 100%
}

.w3-bar-block .w3-dropdown-hover .w3-dropdown-content,.w3-bar-block .w3-dropdown-click .w3-dropdown-content {
    min-width: 100%
}

.w3-bar-block .w3-dropdown-hover .w3-button,.w3-bar-block .w3-dropdown-click .w3-button {
    width: 100%;
    text-align: left;
    padding: 8px 16px
}

.w3-main,#main {
    transition: margin-left .4s
}

.w3-modal {
    z-index: 3;
    display: none;
    padding-top: 100px;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4)
}

.w3-modal-content {
    margin: auto;
    background-color: #fff;
    position: relative;
    padding: 0;
    outline: 0;
    width: 600px
}

.w3-bar {
    width: 100%;
    overflow: hidden
}

.w3-center .w3-bar {
    display: inline-block;
    width: auto
}

.w3-bar .w3-bar-item {
    padding: 8px 16px;
    float: left;
    width: auto;
    border: none;
    display: block;
    outline: 0
}

.w3-bar .w3-dropdown-hover,.w3-bar .w3-dropdown-click {
    position: static;
    float: left
}

.w3-bar .w3-button {
    white-space: normal
}

.w3-bar-block .w3-bar-item {
    width: 100%;
    display: block;
    padding: 8px 16px;
    text-align: left;
    border: none;
    white-space: normal;
    float: none;
    outline: 0
}

.w3-bar-block.w3-center .w3-bar-item {
    text-align: center
}

.w3-block {
    display: block;
    width: 100%
}

.w3-responsive {
    display: block;
    overflow-x: auto
}

.w3-container:after,.w3-container:before,.w3-panel:after,.w3-panel:before,.w3-row:after,.w3-row:before,.w3-row-padding:after,.w3-row-padding:before,
.w3-cell-row:before,.w3-cell-row:after,.w3-clear:after,.w3-clear:before,.w3-bar:before,.w3-bar:after {
    content: "";
    display: table;
    clear: both
}

.w3-col,.w3-half,.w3-third,.w3-twothird,.w3-threequarter,.w3-quarter {
    float: left;
    width: 100%
}

.w3-col.s1 {
    width: 8.33333%
}

.w3-col.s2 {
    width: 16.66666%
}

.w3-col.s3 {
    width: 24.99999%
}

.w3-col.s4 {
    width: 33.33333%
}

.w3-col.s5 {
    width: 41.66666%
}

.w3-col.s6 {
    width: 49.99999%
}

.w3-col.s7 {
    width: 58.33333%
}

.w3-col.s8 {
    width: 66.66666%
}

.w3-col.s9 {
    width: 74.99999%
}

.w3-col.s10 {
    width: 83.33333%
}

.w3-col.s11 {
    width: 91.66666%
}

.w3-col.s12 {
    width: 99.99999%
}

@media (min-width:601px) {
    .w3-col.m1 {
        width: 8.33333%
    }

    .w3-col.m2 {
        width: 16.66666%
    }

    .w3-col.m3,.w3-quarter {
        width: 24.99999%
    }

    .w3-col.m4,.w3-third {
        width: 33.33333%
    }

    .w3-col.m5 {
        width: 41.66666%
    }

    .w3-col.m6,.w3-half {
        width: 49.99999%
    }

    .w3-col.m7 {
        width: 58.33333%
    }

    .w3-col.m8,.w3-twothird {
        width: 66.66666%
    }

    .w3-col.m9,.w3-threequarter {
        width: 74.99999%
    }

    .w3-col.m10 {
        width: 83.33333%
    }

    .w3-col.m11 {
        width: 91.66666%
    }

    .w3-col.m12 {
        width: 99.99999%
    }
}

@media (min-width:993px) {
    .w3-col.l1 {
        width: 8.33333%
    }

    .w3-col.l2 {
        width: 16.66666%
    }

    .w3-col.l3 {
        width: 24.99999%
    }

    .w3-col.l4 {
        width: 33.33333%
    }

    .w3-col.l5 {
        width: 41.66666%
    }

    .w3-col.l6 {
        width: 49.99999%
    }

    .w3-col.l7 {
        width: 58.33333%
    }

    .w3-col.l8 {
        width: 66.66666%
    }

    .w3-col.l9 {
        width: 74.99999%
    }

    .w3-col.l10 {
        width: 83.33333%
    }

    .w3-col.l11 {
        width: 91.66666%
    }

    .w3-col.l12 {
        width: 99.99999%
    }
}

.w3-rest {
    overflow: hidden
}

.w3-stretch {
    margin-left: -16px;
    margin-right: -16px
}

.w3-content,.w3-auto {
    margin-left: auto;
    margin-right: auto
}

.w3-content {
    max-width: 980px
}

.w3-auto {
    max-width: 1140px
}

.w3-cell-row {
    display: table;
    width: 100%
}

.w3-cell {
    display: table-cell
}

.w3-cell-top {
    vertical-align: top
}

.w3-cell-middle {
    vertical-align: middle
}

.w3-cell-bottom {
    vertical-align: bottom
}

.w3-hide {
    display: none!important
}

.w3-show-block,.w3-show {
    display: block!important
}

.w3-show-inline-block {
    display: inline-block!important
}

@media (max-width:1205px) {
    .w3-auto {
        max-width: 95%
    }
}

@media (max-width:600px) {
    .w3-modal-content {
        margin: 0 10px;
        width: auto!important
    }

    .w3-modal {
        padding-top: 30px
    }

    .w3-dropdown-hover.w3-mobile .w3-dropdown-content,.w3-dropdown-click.w3-mobile .w3-dropdown-content {
        position: relative
    }

    .w3-hide-small {
        display: none!important
    }

    .w3-mobile {
        display: block;
        width: 100%!important
    }

    .w3-bar-item.w3-mobile,.w3-dropdown-hover.w3-mobile,.w3-dropdown-click.w3-mobile {
        text-align: center
    }

    .w3-dropdown-hover.w3-mobile,.w3-dropdown-hover.w3-mobile .w3-btn,.w3-dropdown-hover.w3-mobile .w3-button,.w3-dropdown-click.w3-mobile,.w3-dropdown-click.w3-mobile .w3-btn,.w3-dropdown-click.w3-mobile .w3-button {
        width: 100%
    }
}

@media (max-width:768px) {
    .w3-modal-content {
        width: 500px
    }

    .w3-modal {
        padding-top: 50px
    }
}

@media (min-width:993px) {
    .w3-modal-content {
        width: 900px
    }

    .w3-hide-large {
        display: none!important
    }

    .w3-sidebar.w3-collapse {
        display: block!important
    }
}

@media (max-width:992px) and (min-width:601px) {
    .w3-hide-medium {
        display: none!important
    }
}

@media (max-width:992px) {
    .w3-sidebar.w3-collapse {
        display: none
    }

    .w3-main {
        margin-left: 0!important;
        margin-right: 0!important
    }

    .w3-auto {
        max-width: 100%
    }
}

.w3-top,.w3-bottom {
    position: fixed;
    width: 100%;
    z-index: 1
}

.w3-top {
    top: 0
}

.w3-bottom {
    bottom: 0
}

.w3-overlay {
    position: fixed;
    display: none;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #7558e9;
    z-index: 2
}

.w3-display-topleft {
    position: absolute;
    left: 0;
    top: 0
}

.w3-display-topright {
    position: absolute;
    right: 0;
    top: 0
}

.w3-display-bottomleft {
    position: absolute;
    left: 0;
    bottom: 0
}

.w3-display-bottomright {
    position: absolute;
    right: 0;
    bottom: 0
}

.w3-display-middle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%)
}

.w3-display-left {
    position: absolute;
    top: 50%;
    left: 0%;
    transform: translate(0%,-50%);
    -ms-transform: translate(-0%,-50%)
}

.w3-display-right {
    position: absolute;
    top: 50%;
    right: 0%;
    transform: translate(0%,-50%);
    -ms-transform: translate(0%,-50%)
}

.w3-display-topmiddle {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%,0%);
    -ms-transform: translate(-50%,0%)
}

.w3-display-bottommiddle {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%,0%);
    -ms-transform: translate(-50%,0%)
}





.w3-display-hover {
    display: none
}

.w3-display-position {
    position: absolute
}

.w3-circle {
    border-radius: 50%
}

.w3-round-small {
    border-radius: 2px
}

.w3-round,.w3-round-medium {
    border-radius: 4px
}

.w3-round-large {
    border-radius: 8px
}

.w3-round-xlarge {
    border-radius: 16px
}

.w3-round-xxlarge {
    border-radius: 32px
}

.w3-row-padding,.w3-row-padding>.w3-half,.w3-row-padding>.w3-third,.w3-row-padding>.w3-twothird,.w3-row-padding>.w3-threequarter,.w3-row-padding>.w3-quarter,.w3-row-padding>.w3-col {
    padding: 0 8px
}

.w3-container,.w3-panel {
    padding: 0.01em 16px
}

.w3-panel {
    margin-top: 16px;
    margin-bottom: 16px
}

.w3-code,.w3-codespan {
    font-family: Consolas,"courier new";
    font-size: 16px
}

.w3-code {
    width: auto;
    background-color: #fff;
    padding: 8px 12px;
    border-left: 4px solid #4CAF50;
    word-wrap: break-word
}

.w3-codespan {
    color: crimson;
    background-color: #f1f1f1;
    padding-left: 4px;
    padding-right: 4px;
    font-size: 110%
}

.w3-card,.w3-card-2 {
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)
}



.w3-spin {
    animation: w3-spin 2s infinite linear
}

@keyframes w3-spin {
    0% {
        transform: rotate(0deg)
    }

    100% {
        transform: rotate(359deg)
    }
}

.w3-animate-fading {
    animation: fading 10s infinite
}

@keyframes fading {
    0% {
        opacity: 0
    }

    50% {
        opacity: 1
    }

    100% {
        opacity: 0
    }
}

.w3-animate-opacity {
    animation: opac 0.8s
}

@keyframes opac {
    from {
        opacity: 0
    }

    to {
        opacity: 1
    }
}

.w3-animate-top {
    position: relative;
    animation: animatetop 0.4s
}

@keyframes animatetop {
    from {
        top: -300px;
        opacity: 0
    }

    to {
        top: 0;
        opacity: 1
    }
}

.w3-animate-left {
    position: relative;
    animation: animateleft 0.4s
}

@keyframes animateleft {
    from {
        left: -300px;
        opacity: 0
    }

    to {
        left: 0;
        opacity: 1
    }
}

.w3-animate-right {
    position: relative;
    animation: animateright 0.4s
}

@keyframes animateright {
    from {
        right: -300px;
        opacity: 0
    }

    to {
        right: 0;
        opacity: 1
    }
}

.w3-animate-bottom {
    position: relative;
    animation: animatebottom 0.4s
}

@keyframes animatebottom {
    from {
        bottom: -300px;
        opacity: 0
    }

    to {
        bottom: 0;
        opacity: 1
    }
}

.w3-animate-zoom {
    animation: animatezoom 0.6s
}

@keyframes animatezoom {
    from {
        transform: scale(0)
    }

    to {
        transform: scale(1)
    }
}

.w3-animate-input {
    transition: width 0.4s ease-in-out
}

.w3-animate-input:focus {
    width: 100%!important
}





.w3-opacity-max {
    opacity: 0.25
}

.w3-opacity-min {
    opacity: 0.75
}



.w3-greyscale,.w3-grayscale {
    filter: grayscale(75%)
}

.w3-greyscale-min,.w3-grayscale-min {
    filter: grayscale(50%)
}

.w3-sepia {
    filter: sepia(75%)
}



.w3-sepia-min {
    filter: sepia(50%)
}

.w3-tiny {
    font-size: 10px!important
}

.w3-small {
    font-size: 12px!important
}

.w3-medium {
    font-size: 15px!important
}

.w3-large {
    font-size: 18px!important
}

.w3-xlarge {
    font-size: 24px!important
}

.w3-xxlarge {
    font-size: 36px!important
}

.w3-xxxlarge {
    font-size: 48px!important
}

.w3-jumbo {
    font-size: 64px!important
}

.w3-left-align {
    text-align: left!important
}

.w3-right-align {
    text-align: right!important
}

.w3-justify {
    text-align: justify!important
}

.w3-center {
    text-align: center!important
}

.w3-border-0 {
    border: 0!important
}

.w3-border {
    border: 1px solid #ccc!important
}

.w3-border-top {
    border-top: 1px solid #ccc!important
}

.w3-border-bottom {
    border-bottom: 1px solid #ccc!important
}

.w3-border-left {
    border-left: 1px solid #ccc!important
}

.w3-border-right {
    border-right: 1px solid #ccc!important
}

.w3-topbar {
    border-top: 6px solid #ccc!important
}

.w3-bottombar {
    border-bottom: 6px solid #ccc!important
}

.w3-leftbar {
    border-left: 6px solid #ccc!important
}

.w3-rightbar {
    border-right: 6px solid #ccc!important
}

.w3-section,.w3-code {
    margin-top: 16px!important;
    margin-bottom: 16px!important
}

.w3-margin {
    margin: 16px!important
}

.w3-margin-top {
    margin-top: 16px!important
}

.w3-margin-bottom {
    margin-bottom: 16px!important
}

.w3-margin-left {
    margin-left: 16px!important
}

.w3-margin-right {
    margin-right: 16px!important
}

.w3-padding-small {
    padding: 4px 8px!important
}

.w3-padding {
    padding: 8px 16px!important
}

.w3-padding-large {
    padding: 12px 24px!important
}

.w3-padding-16 {
    padding-top: 16px!important;
    padding-bottom: 16px!important
}

.w3-padding-24 {
    padding-top: 24px!important;
    padding-bottom: 24px!important
}

.w3-padding-32 {
    padding-top: 32px!important;
    padding-bottom: 32px!important
}

.w3-padding-48 {
    padding-top: 48px!important;
    padding-bottom: 48px!important
}

.w3-padding-64 {
    padding-top: 64px!important;
    padding-bottom: 64px!important
}

.w3-left {
    float: left!important
}

.w3-right {
    float: right!important
}

.w3-button:hover {
    color: #000!important;
    background-color: #ccc!important
}





/*****************/
/* End W3PRO.CSS */
/*****************/



html {
    position: relative;
    min-height: 100vh
}

body {
    line-height: 1.5;
    font-family: 'Segoe UI','Helvetica Neue',Helvetica,Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans',sans-serif !important;
    font-size: 15px;
    color: #000;
}

b,strong {
    font-weight: 600 !important
}

@media (min-width: 600px) {
	.w3-row.align-bottom {
	    display: flex;
	    align-items: flex-end;
	}
	.w3-row.align-bottom button {
	    margin: unset;
	}
}
@media (max-width: 599px) {
	.w3-row.align-bottom button.w3-button, 
	.w3-row.align-bottom a.w3-button {
	    margin: 10px 0;
	}
}
.w3-select {
    height: 42px;
    border: 1px solid #ccc;
}
			
.slider {
    height: 14px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: 0;
    opacity: .9
}

.step {
    display: none;
    margin: 0!important;
    padding-top: 0!important;
}

.step1 {
  display: inline;
  padding: 0!important;
}

.custom-combobox {
  position: relative!important;
  display: inline-block!important;
  width: 100%!important;
}

.w3-padding-0, .w3-container{
	padding: 0 !important;
}

.w3-content {
    min-height: calc(100vh - 61px);
    max-width: unset;
}

@media (max-width: 420px){
	.w3-content
	{
	    min-height: calc(100vh - 62px);
	}	
}

.navPageName {
    font-size: 15px!important;
    padding: 12px 2px!important;
    margin: 0!important;
}

@media (min-width: 1000px) {
    html.has-upload .pageNameContainer > .navPageName {
        font-size: 18px !important;
        padding: 11px 6px !important;
    }
}

.w3-bar .w3-button {
    background-color: transparent
}

.headerLogo {
    padding: 14px 25px 18px 16px!important;
    height: 40px!important;
    width: 40px!important;
    margin-top: 0;
    background-size: 40px;
    margin-right: 5px;
    margin-left: 5px;
    background-repeat: no-repeat;
    position: relative
}

.headerLogo>svg {
    width: 40px;
    height: 40px;
    top: 0;
    left: 0;
    position: absolute
}

.menuToogle {
    height: 100%;
    margin: 0;
    padding: 0 !important;
    display: flex!important;
    align-items: center;
    justify-content: center;
    width: 41px !important;
    color: #1affff !important;
}

.menuToogle.hide {
    color: #fff !important;
}

.paypalBtn {
    margin-right: 10px;
    margin-top: 0!important
}

.donateBtn {
    font-size: 12px;
    padding: 2px 8px 2px 8px;
    border: 1px solid transparent
}

.new-style-nav-bar {
    background: rgba(69,90,100,1);
    color: #fff;
    height: 41px;
    line-height: 41px
}

.new-style-donateBtn {
    border: 1px solid #fff!important;
    background-color: transparent!important;
    color: #fff!important;
    line-height: 18px
}

@media(min-width: 768px) {
    .margin-content-menu-open {
        margin-left: 250px!important
    }

    .margin-footer-menu-open {
        padding-left: 240px!important
    }
}

.new-style-footer {
    position: relative!important;
    background: #303c42;
    color: #fff;
    height: 20px
}

.new-style-footer a {
    text-decoration: none
}

.new-style-donateBtn {
    border: 1px solid #fff!important;
    background-color: transparent!important;
    color: #fff!important;
    line-height: 18px
}

.new-style-nav-bar .w3-button.new-style-donateBtn:hover,
.new-style-nav-bar .w3-button.new-style-donateBtn.active {
    border: 1px solid #ff9800!important;
    background-color: #ff9800!important;
    color: #202124!important
}

.new-style-nav-bar .w3-button:hover {
    background-color: transparent!important;
    color: #1affff !important
}

@media(min-width: 768px) {
    .margin-content-menu-open {
        margin-left:250px!important
    }

    .margin-footer-menu-open {
        padding-left: 240px!important
    }
}

p {
    margin-top: 0;
    margin-block-end: 0
}

header .new-style-nav-bar {
    box-shadow: none
}

a {
    text-decoration: none!important
}

.extrnl {
    color: var(--link, #2563eb)
}

/* PALETTE FLIP cycle 16 - sitewide layout fix + token wiring for non-homepage pages.
 * Per cycle-16 audit: PAGESTYLE.css (slug-less) is only loaded on '/'; tool/guide
 * pages need their token-wired rules HERE in style-all-default.tag so the palette
 * flip + the centering fix reach every URL.
 *
 * Layout fix - .page-main-content was rendered with computed maxW=660px (1180/1240
 * vp) or 1000px (1366+) and asymmetric margins (mL ~170px less than mR), shifting
 * the column ~85px LEFT of viewport center across all viewports. Root: W3.CSS
 * .w3-rest creates a BFC (overflow:hidden) that shrink-fits when adjacent floats
 * leave residual width. Force-center with auto margins + width:calc(100% - 20px)
 * mirroring .page-section. */
main.page-main-content,
.w3-rest.page-main-content {
    width: calc(100% - 20px) !important;
    margin-left: auto !important;
    margin-right: auto !important;
    box-sizing: border-box !important;
    overflow: visible !important;
}

#contactForm #btnSend {
    margin: 0!important
}

.outputImgs{
	margin: 0;
}

.outputImgs .imageDownloadBtn {
    width: 100%;
    white-space: normal;
    display: inline-grid;
    height: 100%
}

.outputImgs .imageDownloadBtn>span {
    margin-top: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    margin-bottom: auto;
    vertical-align: middle
}

.tooltip {
    position: relative;
    display: inline-block
}

.tooltip .tooltiptext {
    visibility: hidden;
    position: absolute
}

.w3-show-small {
    display: none!important
}

.w3-show-small-inline {
    display: none!important
}

@media(max-width: 599px) {
    .w3-show-small {
        display: block!important
    }

    .w3-show-small-inline {
        display: inline!important
    }
}

@media(max-width:768px) {
    html.main-html.menu-open .w3-content {
        display: none
    }

    html.main-html.menu-open #nav_menu .menu-content {
        overflow-y: auto
    }

    html.main-html.menu-open {
        overflow: hidden
    }
}

.relatedTools > ul {
    margin-bottom: 0;
}

.settingsBtn {
    margin-top: 10px;
    margin-right: 10px;
    height: 24px;
    display: block;
    font-size: 12px
}

.settingsBtn:hover {
    cursor: pointer;
    background-color: #f2f2f2 !important;
    color: #000 !important;
}

.pageNameContainer {
    max-width: calc(100% - 215px);
    overflow: hidden;
    line-height: 19px;
}

.pageNameContainer > .navPageName {
    text-transform: uppercase;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
    text-overflow: ellipsis;
}

.close-modal-btn {
    font-size: 22px;
    padding: 15px 10px;
    line-height: 0;
}

.w3-check, .w3-radio {
    width: 16px;
    height: 20px;
    position: relative;
    top: 6px;
}

#slidecontainer,.slider {
    width: 100%
}

.slider {
    -webkit-appearance: none;
    height: 14px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: 0;
    opacity: .9;
    -webkit-transition: .2s;
    transition: opacity .2s;
    width: 100%
}



.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #232f3e;
    cursor: pointer
}

.slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #232f3e;
    cursor: pointer
}

#nav_menu {
    width: 240px;
}

#nav_menu .menu-content::-webkit-scrollbar {
    height: 8px;
    overflow: visible;
    width: 8px;
}

#nav_menu .menu-content::-webkit-scrollbar-thumb {
    background-color: rgba(69,90,100,0.4);
    background-clip: padding-box;
    border: solid transparent;
    min-height: 28px;
    padding: 100px 0 0;
    box-shadow: inset 1px 1px 0 rgba(0,0,0,0.1),inset 0 -1px 0 rgba(0,0,0,0.07);
    border-width: 1px;
    border-radius: 5px;
}

#nav_menu .menu-content::-webkit-scrollbar-button {
    height: 0;
    width: 0
}

#nav_menu .menu-content::-webkit-scrollbar-track {
    background-clip: padding-box;
    border: solid transparent;
    border-width: 0 0 0 4px
}

#nav_menu .menu-content::-webkit-scrollbar-corner {
    background: transparent
}

/* Drawer sub-links: theme .w3-bar-block .w3-bar-item uses 16px L padding; production common.css uses 37px so bullets align under section titles */
#nav_menu .menuGroup .w3-bar-item {
    padding: 8px 10px 8px 37px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
}

header .new-style-nav-bar {
    box-shadow: none !important;
}

.tagsString {
    font-size: 15px;
    margin-bottom: 1px!important
}


.w3-bottom,.w3-top {
    z-index: 2
}

.imageOut {
    position: relative;
    margin: 0;
    opacity: 1;
    width: 100%
}



.imgOutDownBtn {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    justify-content: center;
    display: flex;
    visibility: hidden;
    opacity: 0
}

.imageOut:hover .imgOutDownBtn {
    visibility: visible;
    opacity: .8
}

.imageOut.retouch .imgOutDownBtn {
    top: 0;
    bottom: 40px;
    left: 0;
    right: 0;
    position: absolute;
    justify-content: center;
    display: flex;
    visibility: hidden
}

.imageOut.retouch .imgOutDownBtn+a {
    width: 100%;
    display: inline-block;
    text-align: center;
    line-height: 40px;
    background-color: #f2f2f2f2;
    position: absolute;
    bottom: 0;
    left: 0;
    display: none
}



.imageOut.retouch:hover .imgOutDownBtn {
    visibility: visible;
    opacity: .8
}



.imageOut img {
    width: 100%;
}

.form-error {
    color: red
}

#downloadLink,.download {
    padding: 8px 16px;
    text-decoration: none!important;
    color: #fff!important;
    display: inline-block!important;
    background-color: #202124!important
}

#downloadLink:HOVER,.download:HOVER {
    color: #000!important;
    background-color: #ccc!important
}

.w3-modal{
	z-index: 99999
}

.welcomeTag{
    max-width: 100%;
    overflow: hidden;
    white-space: normal;
}

/** Ads **/
.adsbygoogle {
    display: block;
    margin: auto
}

/** Color **/
.w3-red {
    color: #fff!important;
    background-color: #202124!important
}

.w3-dark-color {
    background-color: #343a40!important;
}

/** New UI **/
.navBarContainer.w3-top {
    box-shadow: 0 0 8px 3px rgba(0,0,0,0.3) !important;
    z-index: 99999
}

.new-style-body {
    background: #343a40;
}

.w3-content {
    margin-top: 0px;
    min-height: calc(100vh - 116px);
    max-width: 1150px;
    overflow: hidden;
}

.page-section{
	background: #fff;
	border-top-color: #cbcdd0;
    border-right-color: #c3c6c9;
    border-bottom-color: #b5b9bd;
    border-left-color: #c3c6c9;
    padding: 20px;
}

.ad-section,.page-section,header.navBarContainer{
    margin:0;
    margin-bottom: 10px;
}

header.navBarContainer .new-style-nav-bar, header {
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
}

header.navBarContainer .new-style-nav-bar {
    background: #cd5c5c;
}

@media(max-width: 599px) {
	.ad-section.w3-hide-small{
		width: 320px
	}
}

@media (min-width: 768px) {
	.main-html.menu-open .w3-rest .ad-section, .main-html.menu-open .w3-rest .page-section {
	    margin-left: 250px!important;
	}
}

.settingsBtn {
    margin-top: 8.5px;
    height: 24px;
}

.paypalBtn {
    height: 41px;
    display: flex;
    align-items: center;
}

textarea#consoleOut {
	width: 100%
}

.shareBtns .shareBtn {
    width: max-content
}

/* Windows theme */
body {
	line-height: 1.6;
    letter-spacing: 0.4px;
}

.new-style-body {
    background: linear-gradient(90deg, rgb(3, 165, 234) 42%, rgb(4, 56, 157) 100%);
}



header.navBarContainer.w3-top {
    -moz-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.149019607843137) !important;
    -webkit-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.149019607843137) !important;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.149019607843137) !important;
}

header.navBarContainer:not(.w3-top) {
    background: rgba(0, 0, 0, 0.63)
}

header.navBarContainer .new-style-nav-bar {
    background: none;
}

.main-html.menu-open header.navBarContainer{
	box-shadow: none !important;
	border-bottom: 1px solid #d7d7d7
}

header.navBarContainer.w3-top .new-style-nav-bar,
.main-html.menu-open header.navBarContainer .new-style-nav-bar{
    background: rgba(255, 255, 255, 0.98);
}

header.navBarContainer.w3-top .new-style-nav-bar,
header.navBarContainer.w3-top .new-style-nav-bar *,
.main-html.menu-open header.navBarContainer .new-style-nav-bar,
.main-html.menu-open header.navBarContainer .new-style-nav-bar *{
	color: #000 !important
}

header.navBarContainer.w3-top .headerLogo path:first-child,
.main-html.menu-open header.navBarContainer .headerLogo path:first-child {
    fill: #ff4d00
}

header.navBarContainer.w3-top .headerLogo path:last-child,
.main-html.menu-open header.navBarContainer .headerLogo path:last-child{
    fill: #3a3a3a
}

header.navBarContainer.w3-top .headerLogo path:nth-child(2),
.main-html.menu-open header.navBarContainer .headerLogo path:nth-child(2) {
    fill: #00436e
}

header.navBarContainer.w3-top .donateBtn,
header.navBarContainer.w3-top .settingsBtn,
.main-html.menu-open header.navBarContainer .donateBtn,
.main-html.menu-open header.navBarContainer .settingsBtn{
	border-color: #000 !important
}

.page-section {
    /* Token-driven; same rationale as the .page-section block below. */
    background-color: var(--bg-surface, rgba(255, 255, 255, 0.98));
    color: var(--text-primary, #000);
}

footer.page-footer .footer-inner *{
    color: #fefefe;
}

#nav_menu {
    top: 42px !important;
    background-color: rgba(255, 255, 255, 0.98) !important;
}

/* Color theme */
.new-style-body {
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9Im5vbmUiPjxnIG9wYWNpdHk9Ii4yIiBjbGlwLXBhdGg9InVybCgjRSkiPjxwYXRoIGQ9Ik0xNDY2LjQgMTc5NS4yYzk1MC4zNyAwIDE3MjAuOC02MjcuNTIgMTcyMC44LTE0MDEuNlMyNDE2Ljc3LTEwMDggMTQ2Ni40LTEwMDgtMjU0LjQtMzgwLjQ4Mi0yNTQuNCAzOTMuNnM3NzAuNDI4IDE0MDEuNiAxNzIwLjggMTQwMS42eiIgZmlsbD0idXJsKCNBKSIvPjxwYXRoIGQ9Ik0zOTQuMiAxODE1LjZjNzQ2LjU4IDAgMTM1MS44LTQ5My4yIDEzNTEuOC0xMTAxLjZTMTE0MC43OC0zODcuNiAzOTQuMi0zODcuNi05NTcuNiAxMDUuNjAzLTk1Ny42IDcxNC0zNTIuMzggMTgxNS42IDM5NC4yIDE4MTUuNnoiIGZpbGw9InVybCgjQikiLz48cGF0aCBkPSJNMTU0OC42IDE4ODUuMmM2MzEuOTIgMCAxMTQ0LjItNDE3LjQ1IDExNDQuMi05MzIuNFMyMTgwLjUyIDIwLjQgMTU0OC42IDIwLjQgNDA0LjQgNDM3Ljg1IDQwNC40IDk1Mi44czUxMi4yNzYgOTMyLjQgMTE0NC4yIDkzMi40eiIgZmlsbD0idXJsKCNDKSIvPjxwYXRoIGQ9Ik0yNjUuOCAxMjE1LjZjNjkwLjI0NiAwIDEyNDkuOC00NTUuNTk1IDEyNDkuOC0xMDE3LjZTOTU2LjA0Ni04MTkuNiAyNjUuOC04MTkuNi05ODQtMzY0LjAwNS05ODQgMTk4LTQyNC40NDUgMTIxNS42IDI2NS44IDEyMTUuNnoiIGZpbGw9InVybCgjRCkiLz48L2c+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJBIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDE0NjYuNCAzOTMuNikgcm90YXRlKDkwKSBzY2FsZSgxNDAxLjYgMTcyMC44KSI+PHN0b3Agc3RvcC1jb2xvcj0iIzEwN2MxMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2M0YzRjNCIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9IkIiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzk0LjIgNzE0KSByb3RhdGUoOTApIHNjYWxlKDExMDEuNiAxMzUxLjgpIj48c3RvcCBzdG9wLWNvbG9yPSIjMDA3OGQ0Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYzRjNGM0IiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iQyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxNTQ4LjYgOTUyLjgpIHJvdGF0ZSg5MCkgc2NhbGUoOTMyLjQgMTE0NC4yKSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmYjkwMCIgc3RvcC1vcGFjaXR5PSIuNzUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNjNGM0YzQiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJEIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDI2NS44IDE5OCkgcm90YXRlKDkwKSBzY2FsZSgxMDE3LjYgMTI0OS44KSI+PHN0b3Agc3RvcC1jb2xvcj0iI2Q4M2IwMSIgc3RvcC1vcGFjaXR5PSIuNzUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNjNGM0YzQiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PGNsaXBQYXRoIGlkPSJFIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDE5MjB2MTA4MEgweiIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==") center no-repeat;
    background-size: cover;
}

.w3-content {
    max-width: 1600px;
}

.page-section {
    overflow: hidden;
    position: relative;
    margin: auto;
    margin-bottom: 10px;
    -webkit-box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    -moz-box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    max-width: 1240px;
	width: calc(100% - 20px);
    /* Token-driven so .page-section adapts to BOTH the .dark class AND the
     * OS-default `prefers-color-scheme: dark` media query, the same way
     * .bento-cell does. Previously hardcoded `rgba(255,255,255,0.93)`, which
     * caused an inconsistency: bento went dark under OS-dark while trust /
     * byline panels stayed white because their dark rule (line ~2545)
     * required `html.main-html.dark` class which only fires after the
     * toggle JS runs. Falling back to the old rgba so any older surface
     * without --bg-surface still renders. */
    background-color: var(--bg-surface, rgba(255,255,255,0.93));
    color: var(--text-primary, #000);
}

/* Ad slots only: match common.css - do not use the page-section card fill (breaks dark mode + mobile top-ad title band). */
.ad-section:not(.ad-panel) {
    overflow: hidden;
    position: relative;
    margin: auto auto 10px;
    margin-bottom: 0;
    max-width: 1240px;
    width: calc(100% - 20px);
    background: none;
    background-color: transparent;
    box-shadow: none;
}

footer.page-footer .footer-inner {
    /* Aligned with .page-section / .bento outer-edge (effective 1220px wide):
     * page-section + bento live inside `.page-main-content` (max-width 1240,
     * centered in body). They use `width: calc(100% - 20px)` of that 1240 ->
     * effective 1220. Footer is OUTSIDE that wrapper so direct calc on body
     * 1290 yielded 1240 - wider than the content above. Cap at 1220 to align. */
    max-width: 1220px !important;
    width: calc(100% - 20px) !important;
    margin-left: auto !important;
    margin-right: auto !important;
    box-sizing: border-box;
}

/* Large desktop: align footer with the main content container on key static pages. */
@media (min-width: 1000px) {
    html.page-contact-usroot footer.page-footer .footer-inner,
    html.page-privacy-policyroot footer.page-footer .footer-inner,
    html.page-about-usroot footer.page-footer .footer-inner {
        width: calc(100% - 20px) !important;
        margin-left: auto !important;
        margin-right: auto !important;
        box-sizing: border-box;
    }
}

@media (max-width: 599px){
	footer.page-footer .footer-inner {
	    padding: 0 10px 20px!important;
	    box-sizing: border-box;
	}
}

.page-section.relatedToolsSection {
    height: auto;
}

/* Index hero: BODYHTML reuses .page-section on Popular tools for shared hooks; strip article "card" chrome
   (box-shadow + opaque panel) that applies to real content sections via .page-section, .ad-section. */
header#home.bgimg-1 .page-section.relatedToolsSection,
#home.bgimg-1 .page-section.relatedToolsSection {
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
    background-color: transparent !important;
    background: transparent !important;
    max-width: none;
    width: auto;
    margin: 0;
    margin-bottom: 0;
    overflow: visible;
}

.page-section.relatedToolsSection .relatedTools{
    max-height: none;
    min-height: 0;
    overflow: visible;
}

.page-section.relatedToolsSection .relatedTools::-webkit-scrollbar {
    height: 0;
    overflow: hidden;
    width: 0;
}

footer.page-footer .footer-inner * {
    color: #000;
}

header.navBarContainer:not(.w3-top) {
    background: #151d28;
}

@media(min-width: 768px) {
	.main-html.menu-open .w3-rest .ad-section,.main-html.menu-open .w3-rest .page-section {
	    margin-left: auto !important;
	}
}

.main-html.menu-open footer.page-footer .footer-inner .second,.main-html.menu-open footer.page-footer .footer-inner .first {
	padding-left: unset !important;
}

html.menu-open {
	overflow: hidden;
}

html.menu-open>body:after {
    position: absolute;
    content: '';
    display: block;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #000;
    opacity: .4;
    z-index: 1;
}

html.menu-open header.navBarContainer {
	height: 41px;
}

html.menu-open header.navBarContainer > .new-style-nav-bar{
	z-index: 9999;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
}

header.navBarContainer.w3-top .new-style-nav-bar {
    background: none;
    background-image: linear-gradient(0deg,rgba(0,0,0,0) 0,rgba(0, 0, 0, 0.06) 100%);
}

header.navBarContainer.w3-top {
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
}

header.navBarContainer .new-style-nav-bar.w3-white {
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12) !important;
    background: rgba(255, 255, 255, 0.98);
}

.main-html.menu-open header.navBarContainer .new-style-nav-bar {
    box-shadow: none !important;
}

/* Dark mode: mirror key rules from CloudFront dark.css so tool pages match before/without late-loaded dark.css (preload). */
@media (max-width: 999px) {
    html.main-html.dark:not([style*="background-color"]) .ad-section:not(.ad-panel) > ins:after {
        background-color: #2F3437 !important;
        color: #FFFFFF !important;
    }
}

/* SPECIFICITY BUMP: external CloudFront `dark.css` ships an identical-specificity
 * rule for `.page-main-content .page-section { #2f3437 !important }`. Inline
 * `<style>` runs first, then dark.css activates as a stylesheet, so cascade
 * order makes dark.css win when specificity ties. To beat it WITHOUT touching
 * the CDN-served file, bump our specificity by chaining an extra `:not()`
 * (specificity 0,0,6,1 vs CloudFront's 0,0,5,1). Then we win regardless of
 * cascade order. Token values keep parity with .bento-cell (--bg-surface). */
html.main-html.dark:not([style*="background-color"]):not(.__never__) .page-main-content .page-section {
    background-color: var(--bg-surface, #2F3437) !important;
    border: 1px solid var(--border-subtle, #37352F) !important;
    color: var(--text-primary, #FFFFFF) !important;
}

/* Mirror the minimum dark-mode body + section wrappers inline so pages do not
   flash light-mode content before the external dark.css finishes loading.
   Full dark palette still comes from the CloudFront dark.css; these are the
   critical rules that control the container backgrounds. */
html.main-html.dark:not(.html-fill-img):not([style*="background-color"]) .new-style-body {
    background: #191919 !important;
}
html.main-html.dark:not([style*="background-color"]) .welcomeTag,
html.main-html.dark:not([style*="background-color"]) .relatedToolsSection,
html.main-html.dark:not([style*="background-color"]) .tagsTag {
    background-color: #2F3437 !important;
    color: #FFFFFF !important;
}
html.main-html.dark:not([style*="background-color"]) body,
html.main-html.dark:not([style*="background-color"]) .welcomeTag,
html.main-html.dark:not([style*="background-color"]) .welcomeTag p,
html.main-html.dark:not([style*="background-color"]) .welcomeTag li,
html.main-html.dark:not([style*="background-color"]) .welcomeTag h1,
html.main-html.dark:not([style*="background-color"]) .welcomeTag h2,
html.main-html.dark:not([style*="background-color"]) .welcomeTag h3,
html.main-html.dark:not([style*="background-color"]) .relatedToolsSection p,
html.main-html.dark:not([style*="background-color"]) .relatedToolsSection a {
    color: #FFFFFF !important;
}

/* Dark-mode tables: the w3.css defaults (#fff / #f1f1f1 row backgrounds, black cell color)
   override cleanly via the .page-section dark rule for text, but row backgrounds and cell
   borders keep their light values because .w3-table-all has its own selectors. Force the
   dark palette here so comparison tables inside BODYWELCOME/BODYHTML read correctly. */
html.main-html.dark:not([style*="background-color"]) .w3-table,
html.main-html.dark:not([style*="background-color"]) .w3-table-all {
    color: #FFFFFF !important;
}
html.main-html.dark:not([style*="background-color"]) .w3-table-all tr:nth-child(odd) {
    background-color: #2F3437 !important;
}
html.main-html.dark:not([style*="background-color"]) .w3-table-all tr:nth-child(even) {
    background-color: #262A2D !important;
}
html.main-html.dark:not([style*="background-color"]) .w3-table td,
html.main-html.dark:not([style*="background-color"]) .w3-table th,
html.main-html.dark:not([style*="background-color"]) .w3-table-all td,
html.main-html.dark:not([style*="background-color"]) .w3-table-all th {
    color: #FFFFFF !important;
    border-color: #37352F !important;
}
html.main-html.dark:not([style*="background-color"]) .w3-bordered tr,
html.main-html.dark:not([style*="background-color"]) .w3-table-all tr {
    border-color: #37352F !important;
}

/* Mobile polish (menu + header + dialogs) */

/* Drawer menu: fix corrupted hover/focus/active states (especially iOS "stuck" focus). */
#nav_menu .menu-btn,
#nav_menu .menuGroup .w3-bar-item.w3-button {
    border-radius: 0 !important;
    box-shadow: none !important;
    background: transparent !important;
}

#nav_menu .menu-btn:hover,
#nav_menu .menu-btn:focus,
#nav_menu .menu-btn:active,
#nav_menu .menuGroup .w3-bar-item.w3-button:hover,
#nav_menu .menuGroup .w3-bar-item.w3-button:focus,
#nav_menu .menuGroup .w3-bar-item.w3-button:active {
    background-color: rgba(0,0,0,0.06) !important;
    color: #000 !important;
    outline: 0 !important;
}

#nav_menu .menuGroup .w3-bar-item.w3-button.active {
    background-color: rgba(0,0,0,0.12) !important;
    color: #000 !important;
    font-weight: 600;
}

/* Mobile header actions: keep the real Settings button visible without un-hiding #disableAds. */
@media (max-width: 599px) {
    header.navBarContainer .pageNameContainer {
        display: none !important;
    }

    header.navBarContainer #disableAds {
        margin-top: 8.5px !important;
        margin-bottom: 0 !important;
        height: 24px !important;
        min-height: 24px;
        padding: 2px 7px !important;
        box-sizing: border-box;
        line-height: 1 !important;
        vertical-align: middle;
    }

    header.navBarContainer .settingsBtn[title*="tool settings"]:not(#disableAds),
    #buyMeACoffeeBtnID {
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        margin-top: 8.5px !important;
        margin-bottom: 0 !important;
        height: 24px !important;
        min-height: 24px;
        margin-right: 6px !important;
        padding: 2px 7px !important;
        box-sizing: border-box;
        font-size: 0 !important;
        line-height: 1 !important;
        overflow: hidden;
        white-space: nowrap;
        vertical-align: middle;
    }

    header.navBarContainer .settingsBtn[title*="tool settings"]:not(#disableAds) i,
    #buyMeACoffeeBtnID i {
        font-size: 14px;
        margin: 0 !important;
        line-height: 1;
    }
}

/* Dialogs: keep radius consistent with button style. */
.w3-modal-content {
    border-radius: 8px !important;
    overflow: hidden;
}

.ad-section.top-ad, .bg-credit, .bg-credit-des{
	display: none
}

/* ============================================================
 * Cycle-17 W/E follow-up #9 - light-mode chrome visibility + shadow polish.
 *
 * THREE ROOT-CAUSE FIXES (per CLAUDE.md root-cause discipline):
 *
 * 1. NAVBAR text invisible in light mode at top scroll:
 *    SYMPTOM: navPageName "FREE TOOL ONLINE - 122 BROWSER..." renders as
 *      white text on a transparent navbar over a #fafafa body -> invisible.
 *    HYPOTHESIS: legacy w3-top rule sets navbar bg rgba(255,255,255,0.98)
 *      AND text color #000 at scroll, but at first paint the JS-driven
 *      class toggling races with first paint. Plus dark.css mirrors push
 *      text to #fff for the dark-mode variant, leaving light-mode users
 *      without a robust rule.
 *    FIX: explicit `html:not(.dark)` rule with !important that token-drives
 *      navbar text color regardless of w3-top / scrolled / menu-open state.
 *
 * 2. FOOTER text invisible in light mode:
 *    SYMPTOM: `footer.page-footer .footer-inner * { color: #fefefe }`
 *      hardcodes near-white text. On #fafafa light body -> invisible.
 *    FIX: token-drive the footer text color.
 *
 * 3. WRAPPER box-shadow heavy on .page-section (0.2 alpha) vs .bento-cell
 *    (0.08 alpha) -> user perceives a heavy "border" on the editorial
 *    panels that the bento doesn't have.
 *    FIX: align .page-section shadow with the lighter .bento-cell shadow.
 * ============================================================ */

/* FIX 1 - navbar text in light mode (sole signal: html.dark class) */
html.main-html:not(.dark) header.navBarContainer .new-style-nav-bar,
html.main-html:not(.dark) header.navBarContainer .new-style-nav-bar *,
html.main-html:not(.dark) header.navBarContainer .navPageName {
    color: var(--text-primary, #0f172a) !important;
}

/* Navbar bg in light mode - token-driven, slightly translucent for the at-top
 * sticky look without needing the legacy w3-top class race. */
html.main-html:not(.dark) header.navBarContainer .new-style-nav-bar {
    background: var(--bg-surface, rgba(255, 255, 255, 0.95)) !important;
}

/* FIX 2 - footer text token-driven, BUT only on pages without `.html-fill-img`
 * (which carries a dark hero bg image that requires the legacy near-white
 * footer text for contrast). Tool pages like /zip-file.html still use that
 * dark hero so they keep their original behavior. */
html.main-html:not(.html-fill-img) footer.page-footer .footer-inner,
html.main-html:not(.html-fill-img) footer.page-footer .footer-inner *,
html.main-html:not(.html-fill-img) footer.page-footer .footer-inner a {
    color: var(--text-primary, #0f172a);
}
html.main-html.dark:not(.html-fill-img) footer.page-footer .footer-inner,
html.main-html.dark:not(.html-fill-img) footer.page-footer .footer-inner *,
html.main-html.dark:not(.html-fill-img) footer.page-footer .footer-inner a {
    color: var(--text-primary, #e6edf3);
}

/* FIX 3 - lighter, consistent shadow on .page-section to match .bento-cell */
.page-section {
    box-shadow: var(--shadow-card, 0 1px 3px rgba(15, 23, 42, 0.08)) !important;
}
html.main-html.dark .page-section {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4) !important;
}
</style>