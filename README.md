# freetoolonline-web

Static GitHub Pages site for FreeToolOnline.

## What this repo does

- Reads JSPs and shared fragments from the committed `source/` snapshot and exports rendered HTML into `dist/`.
- Keeps the site origin as `https://freetoolonline.com` while routing AJAX calls to the API origin.
- Deploys the static output to GitHub Pages through GitHub Actions.

## Environment

- `SOURCE_REPO_ROOT`: optional override for the `source/` snapshot root, default `./source` when present
- `SITE_URL`: public site origin, default `https://freetoolonline.com`
- `API_ORIGIN`: API root injected into `getRootPath()`, default `https://service.us-east-1a.freetool.online/`
- `SHORTEN_DOMAIN`: share-link origin used by the page shell, default `https://freetool.online`
- `APP_VERSION`: cache-busting version for CDN assets
- `IO_VERSION`: uploader version stamp
- `UNSPLASH_KEY`: background image key used by the page shell
- `RANDOM_STRING`: seed string used by the page shell
- `BGS_COLLECTION`: JSON-encoded background list used by the page shell
- `IO_INFOS`: JSON-encoded uploader list used by the page shell
- `GET_ALTER_UPLOADER_DELAY_MS`: delay used by the uploader bootstrap
- `DIST_DIR`: output directory, default `dist`

## Local build

```bash
npm install
npm run export
```

The exporter reads `source/web/src/main/webapp/static/sitemap.xml`, JSPs from `source/web/src/main/webapp/WEB-INF/jsp/`, and shared fragments from `source/static/src/main/webapp/resources/view/`. If you want to build from a different snapshot path, set `SOURCE_REPO_ROOT` before running the build.

## Deploy

GitHub Actions publishes the generated `dist/` directory to GitHub Pages.
It uses the committed `source/` snapshot in this repository, so no cross-repo checkout or `SOURCE_REPO_TOKEN` secret is required.

## Updating content

- Edit page content under `source/static/src/main/webapp/resources/view/**`, especially `source/static/src/main/webapp/resources/view/CMS/**`.
- If a page route, JSP shell, or sitemap entry changes, update `source/web/src/main/webapp/WEB-INF/jsp/**` or `source/web/src/main/webapp/static/sitemap.xml` as needed.
- Push the change and let GitHub Actions rebuild Pages; this replaces the old S3 upload plus `/admin/update-configs` refresh flow.

## Cutover notes

- Set the GitHub Pages custom domain to `freetoolonline.com`.
- Point DNS for `freetoolonline.com` at GitHub Pages before disabling the old `web` Elastic Beanstalk environment.
- After cutover, verify `/ajax/*` traffic is landing on `webservice` and the old EB public IPv4 billing line disappears.
- See [`CUTOVER.md`](./CUTOVER.md) for the final handoff checklist.
