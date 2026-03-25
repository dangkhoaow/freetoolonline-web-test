import { expect, test } from '@playwright/test';
import {
  NEW_ORIGIN,
  OLD_ORIGIN,
  buildRouteUrl,
  captureSnapshot,
  compareSnapshots,
  formatDiff,
  loadParityRoutes,
  navigateAndStabilize,
  prepareParityContext,
} from '../helpers/parity.mjs';

const routes = await loadParityRoutes();

test.describe.configure({ mode: 'parallel' });

for (const route of routes) {
  test(`parity ${route}`, async ({ browser }, testInfo) => {
    const context = await browser.newContext();

    try {
      await prepareParityContext(context);

      const oldPage = await context.newPage();
      const newPage = await context.newPage();

      await Promise.all([
        navigateAndStabilize(oldPage, buildRouteUrl(OLD_ORIGIN, route), route),
        navigateAndStabilize(newPage, buildRouteUrl(NEW_ORIGIN, route), route),
      ]);

      const oldSnapshot = await captureSnapshot(oldPage);
      const newSnapshot = await captureSnapshot(newPage);
      const diffs = compareSnapshots(oldSnapshot, newSnapshot);

      if (diffs.length > 0) {
        await testInfo.attach('old-screenshot.png', {
          body: await oldPage.screenshot({ fullPage: true }),
          contentType: 'image/png',
        });
        await testInfo.attach('new-screenshot.png', {
          body: await newPage.screenshot({ fullPage: true }),
          contentType: 'image/png',
        });
        await testInfo.attach('old-content.html', {
          body: oldSnapshot.contentHtml,
          contentType: 'text/html',
        });
        await testInfo.attach('new-content.html', {
          body: newSnapshot.contentHtml,
          contentType: 'text/html',
        });
        await testInfo.attach('old-snapshot.json', {
          body: JSON.stringify(oldSnapshot, null, 2),
          contentType: 'application/json',
        });
        await testInfo.attach('new-snapshot.json', {
          body: JSON.stringify(newSnapshot, null, 2),
          contentType: 'application/json',
        });
      }

      expect(diffs, formatDiff(route, diffs)).toHaveLength(0);
    } finally {
      await context.close();
    }
  });
}
