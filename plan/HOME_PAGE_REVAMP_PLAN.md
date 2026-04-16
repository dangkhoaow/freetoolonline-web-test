# HOME PAGE REVAMP (staging-first)

## Scope + constraints
- **Package**: staging only (`freetoolonline-web-test/`).
- **Page**: Home route `/`.
- **Keep**: current hero-background approach (`header#home.bgimg-1`) and existing dynamic search/popular-tools behavior.
- **UI framework**: **W3.CSS classes only** in markup (no new CSS frameworks; avoid adding new custom class names).
- **Performance**: minimize CLS (reserve space for dynamic content; avoid late DOM insertions that shift layout).
- **Validation**: must be verified in a **rendered browser** (Playwright) and screenshots saved under `freetoolonline-web-test/test/homepage/screenshoot/[TIMESTAMP]/`.
- **Tracking**: every PLAN item must be reflected in `HOME_PAGE_REVAMP_PROGRESS.md` (update-in-place if it already exists).

## Current implementation anchors (must remain compatible)
- **Hero container**: `header#home.bgimg-1` is used by JS/CSS for background + layout.
- **Search mount point**: `.searchAutoCmp` is populated at runtime (`$('.searchAutoCmp').html(...)`).
- **Popular tools mount point**: `#popularToolsList` is populated at runtime.

Files (current):
- Home CMS HTML: [freetoolonline-web-test/source/static/src/main/webapp/resources/view/CMS/BODYHTML.html](freetoolonline-web-test/source/static/src/main/webapp/resources/view/CMS/BODYHTML.html)
- Home page CSS: [freetoolonline-web-test/source/static/src/main/webapp/resources/view/CMS/PAGESTYLE.css](freetoolonline-web-test/source/static/src/main/webapp/resources/view/CMS/PAGESTYLE.css)
- Home wrapper: [freetoolonline-web-test/source/web/src/main/webapp/WEB-INF/jsp/index.jsp](freetoolonline-web-test/source/web/src/main/webapp/WEB-INF/jsp/index.jsp)
- Playwright config: [freetoolonline-web-test/playwright.config.mjs](freetoolonline-web-test/playwright.config.mjs)

## Goals
- Modernize the home page UX/UI (2026 feel) while staying consistent with site-wide components.
- Improve readability of long-tail content (scannable, user-friendly).
- Ensure flawless mobile scrolling and responsive layout.
- Keep W3.CSS-based styling and reduce CLS.

## Out of scope
- Editing other routes’ CMS content.
- Changing global shared CSS for non-home pages.

## PLAN tasks (IDs used by the PROGRESS file)
- **1 — Unify header/footer with site while preserving hero**
  - **Change**: remove the custom in-body top bar from `BODYHTML.html` and stop hiding the standard `navBarContainer` in `PAGESTYLE.css`.
  - **Accept**: site header matches other pages; hero still renders with background; no duplicated nav.

- **2 — Hero layout redesign (W3.CSS-only markup)**
  - **Change**: restructure hero content to a clean hierarchy (H1 → short subheadline → search → quick links), using W3 grid utilities.
  - **Keep**: `.searchAutoCmp` element present and visible.
  - **Accept**: content is readable on desktop + mobile; no horizontal scroll.

- **3 — Add “Browse by category” quick access (hub links)**
  - **Change**: add a compact W3 card/grid section linking to existing hub routes (ZIP/PDF/Image/Conversion/Developer/Video/Device Test/Utilities).
  - **Accept**: links work; layout stacks correctly on mobile; uses W3 classes.

- **4 — Modernize “Popular tools” section + CLS guardrails**
  - **Change**: style `#popularToolsList` for a modern look and reserve space (min-height / layout constraints) so late population doesn’t cause large CLS.
  - **Keep**: backend-driven population via existing AJAX call.
  - **Accept**: section looks good empty/loading and after population; minimal visual shift.

- **5 — Rewrite extended home copy for readability (remove outdated content)**
  - **Change**: replace/remove outdated statements (e.g., legacy browser references) and rewrite as scannable blocks (short paragraphs + bullets, optional H2/H3).
  - **Accept**: copy is easy to read; still clearly explains tool categories + privacy.

- **6 — Mobile scrolling + responsive polish**
  - **Change**: ensure no scroll-lock patterns remain; ensure `overflow-y` allows full-page scroll; ensure hero + footer don’t trap scrolling.
  - **Accept**: on iOS/Android viewports the page scrolls to the bottom reliably.

- **7 — Playwright-rendered validation + screenshot automation**
  - **Change**: add a dedicated Playwright test (new) that renders the built site and captures **desktop + mobile full-page** screenshots into `freetoolonline-web-test/test/homepage/screenshoot/[TIMESTAMP]/`.
  - **Accept**: test runs locally; screenshots are produced; basic assertions pass (H1 present, search visible, scrolling works).

- **8 — Progress file creation + ongoing updates**
  - **Change**: create `HOME_PAGE_REVAMP_PROGRESS.md` if missing (using the provided template) or update in-place if it exists; keep statuses/notes updated after each task.
  - **Accept**: every PLAN item has a row with status + notes + timestamp; testing evidence logged.

## Execution checklist
- Implement tasks **1 → 8** in order, in `freetoolonline-web-test/` only.
- After each task: update progress row + overall completion.
- Build + verify:
  - `npm test`
  - `npm run export`
  - Run the new Playwright homepage test (desktop + mobile screenshots).
