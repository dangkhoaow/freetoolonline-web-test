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

test('left menu highlights current route (zip-file)', async ({ browser }, testInfo) => {
  const context = await browser.newContext();

  try {
    await prepareParityContext(context);

    const route = '/zip-file.html';
    const oldPage = await context.newPage();
    const newPage = await context.newPage();

    await Promise.all([
      oldPage.goto(buildRouteUrl(OLD_ORIGIN, route), { waitUntil: 'load' }),
      newPage.goto(buildRouteUrl(NEW_ORIGIN, route), { waitUntil: 'load' }),
    ]);

    await Promise.all([
      oldPage.waitForFunction(() => typeof window.$ === 'function', null, { timeout: 15000 }).catch(() => {}),
      newPage.waitForFunction(() => typeof window.$ === 'function', null, { timeout: 15000 }).catch(() => {}),
    ]);

    await Promise.all([
      oldPage.click('.menuToogle').catch(() => {}),
      newPage.click('.menuToogle').catch(() => {}),
    ]);

    await Promise.all([
      oldPage.waitForSelector('#nav_menu', { state: 'visible', timeout: 8000 }).catch(() => {}),
      newPage.waitForSelector('#nav_menu', { state: 'visible', timeout: 8000 }).catch(() => {}),
    ]);

    const readState = async (page) => {
      return await page.evaluate(() => {
        const activeHrefs = Array.from(document.querySelectorAll('#nav_menu a.active')).map((a) => a.getAttribute('href') ?? '');
        const expandedGroups = Array.from(document.querySelectorAll('#nav_menu .menuGroup.w3-show')).map((el) => el.id ?? '');
        return { activeHrefs, expandedGroups };
      });
    };

    const [oldState, newState] = await Promise.all([readState(oldPage), readState(newPage)]);
    const oldHasZipActive = oldState.activeHrefs.some((href) => href.includes('/zip-file.html'));
    const newHasZipActive = newState.activeHrefs.some((href) => href.includes('/zip-file.html'));
    const oldHasZipExpanded = oldState.expandedGroups.includes('zipMenu');
    const newHasZipExpanded = newState.expandedGroups.includes('zipMenu');

    if (oldHasZipActive !== newHasZipActive || oldHasZipExpanded !== newHasZipExpanded) {
      await testInfo.attach('leftmenu-old-screenshot.png', {
        body: await oldPage.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
      await testInfo.attach('leftmenu-new-screenshot.png', {
        body: await newPage.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
      await testInfo.attach('leftmenu-state.json', {
        body: JSON.stringify({ oldState, newState }, null, 2),
        contentType: 'application/json',
      });
    }

    expect(oldHasZipActive, 'Old site should mark zip-file active.').toBeTruthy();
    expect(oldHasZipExpanded, 'Old site should expand zipMenu group.').toBeTruthy();
    expect(newHasZipActive, 'New site should mark zip-file active.').toBeTruthy();
    expect(newHasZipExpanded, 'New site should expand zipMenu group.').toBeTruthy();
  } finally {
    await context.close();
  }
});

test('hr margin + color matches old site (zip-file)', async ({ browser }, testInfo) => {
  const context = await browser.newContext();

  try {
    await prepareParityContext(context);

    const route = '/zip-file.html';
    const oldPage = await context.newPage();
    const newPage = await context.newPage();

    await Promise.all([
      oldPage.goto(buildRouteUrl(OLD_ORIGIN, route), { waitUntil: 'load' }),
      newPage.goto(buildRouteUrl(NEW_ORIGIN, route), { waitUntil: 'load' }),
    ]);

    await Promise.all([
      oldPage.waitForSelector('.page-main-content time + hr, #content time + hr, time + hr', { timeout: 15000 }).catch(() => {}),
      newPage.waitForSelector('.page-main-content time + hr, #content time + hr, time + hr', { timeout: 15000 }).catch(() => {}),
    ]);

    const readHr = async (page) => {
      return await page.evaluate(() => {
        const hr = document.querySelector('.page-main-content time + hr') || document.querySelector('#content time + hr') || document.querySelector('time + hr');
        if (!hr) {
          return null;
        }
        const s = getComputedStyle(hr);
        return {
          marginTop: s.marginTop,
          marginBottom: s.marginBottom,
          borderTopWidth: s.borderTopWidth,
          borderTopStyle: s.borderTopStyle,
          borderTopColor: s.borderTopColor,
        };
      });
    };

    const [oldHr, newHr] = await Promise.all([readHr(oldPage), readHr(newPage)]);

    if (JSON.stringify(oldHr) !== JSON.stringify(newHr)) {
      await testInfo.attach('hr-old-screenshot.png', {
        body: await oldPage.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
      await testInfo.attach('hr-new-screenshot.png', {
        body: await newPage.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
      await testInfo.attach('hr-style.json', {
        body: JSON.stringify({ oldHr, newHr }, null, 2),
        contentType: 'application/json',
      });
    }

    expect(oldHr, 'Old site should have an <hr> after Last updated.').toBeTruthy();
    expect(newHr, 'New site should have an <hr> after Last updated.').toBeTruthy();
    expect(newHr, 'New site <hr> style should match old site.').toEqual(oldHr);
  } finally {
    await context.close();
  }
});

test('tags position matches old site (heic-to-jpg)', async ({ browser }, testInfo) => {
  const context = await browser.newContext();

  try {
    await prepareParityContext(context);

    const route = '/heic-to-jpg.html';
    const oldPage = await context.newPage();
    const newPage = await context.newPage();

    await Promise.all([
      oldPage.goto(buildRouteUrl(OLD_ORIGIN, route), { waitUntil: 'load' }),
      newPage.goto(buildRouteUrl(NEW_ORIGIN, route), { waitUntil: 'load' }),
    ]);

    const ensureTagsRendered = async (page) => {
      await page.waitForFunction(() => typeof window.loadRelatedTools === 'function', null, { timeout: 15000 }).catch(() => {});
      await page.evaluate(() => {
        try {
          window.loadRelatedTools?.();
        } catch {}
      });
      await page.waitForTimeout(4000);
      await page.waitForFunction(() => document.body.textContent?.includes('Tags:'), null, { timeout: 15000 }).catch(() => {});
    };

    await Promise.all([ensureTagsRendered(oldPage), ensureTagsRendered(newPage)]);

    const readTagsMetrics = async (page) => {
      return await page.evaluate(() => {
        const section = document.querySelector('.relatedToolsSection');
        const relatedTools = section?.querySelector('.relatedTools') ?? null;
        const ul = relatedTools?.querySelector('ul') ?? null;

        const tagsNode = (() => {
          const root = section || document.body;
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
          let node;
          while ((node = walker.nextNode())) {
            if (node.nodeValue && node.nodeValue.includes('Tags:')) {
              return node;
            }
          }
          return null;
        })();
        const tagsEl = tagsNode?.parentElement ?? null;

        const relatedToolsStyle = relatedTools ? getComputedStyle(relatedTools) : null;
        const gapUlToTags = (() => {
          if (!ul || !tagsEl) {
            return null;
          }
          const u = ul.getBoundingClientRect();
          const t = tagsEl.getBoundingClientRect();
          return Math.round(t.y - (u.y + u.height));
        })();

        return {
          gapUlToTags,
          relatedToolsMinHeight: relatedToolsStyle?.minHeight ?? '',
          relatedToolsMaxHeight: relatedToolsStyle?.maxHeight ?? '',
          relatedToolsOverflow: relatedToolsStyle?.overflow ?? '',
          relatedToolsOverflowY: relatedToolsStyle?.overflowY ?? '',
        };
      });
    };

    const [oldMetrics, newMetrics] = await Promise.all([readTagsMetrics(oldPage), readTagsMetrics(newPage)]);

    if (JSON.stringify(oldMetrics) !== JSON.stringify(newMetrics)) {
      await testInfo.attach('tags-old-screenshot.png', {
        body: await oldPage.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
      await testInfo.attach('tags-new-screenshot.png', {
        body: await newPage.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
      await testInfo.attach('tags-metrics.json', {
        body: JSON.stringify({ oldMetrics, newMetrics }, null, 2),
        contentType: 'application/json',
      });
    }

    expect(oldMetrics.gapUlToTags, 'Old site should compute a Tags gap.').not.toBeNull();
    expect(newMetrics.gapUlToTags, 'New site should compute a Tags gap.').not.toBeNull();

    // This catches the regression: static build was forcing a fixed relatedTools height,
    // pushing Tags down even though it's immediately after the list.
    expect(newMetrics.gapUlToTags, 'New site gap between related tools list and Tags should match old site.').toBe(oldMetrics.gapUlToTags);
    expect(newMetrics.relatedToolsMinHeight, 'New site relatedTools min-height should match old site.').toBe(oldMetrics.relatedToolsMinHeight);
    expect(newMetrics.relatedToolsMaxHeight, 'New site relatedTools max-height should match old site.').toBe(oldMetrics.relatedToolsMaxHeight);
    expect(newMetrics.relatedToolsOverflow, 'New site relatedTools overflow should match old site.').toBe(oldMetrics.relatedToolsOverflow);
    expect(newMetrics.relatedToolsOverflowY, 'New site relatedTools overflow-y should match old site.').toBe(oldMetrics.relatedToolsOverflowY);
  } finally {
    await context.close();
  }
});

test('related tools SSR matches client output (zip-file)', async ({ browser }, testInfo) => {
  const context = await browser.newContext();

  try {
    await prepareParityContext(context);

    const route = '/zip-file.html';
    const page = await context.newPage();
    await page.goto(buildRouteUrl(NEW_ORIGIN, route), { waitUntil: 'load' });
    await page.waitForFunction(() => typeof window.$ === 'function', null, { timeout: 15000 }).catch(() => {});
    await page.waitForFunction(() => typeof window.loadRelatedTools === 'function', null, { timeout: 15000 }).catch(() => {});

    const readRelatedToolsState = async () => {
      return await page.evaluate(() => {
        const relatedTools = document.querySelector('.relatedTools');
        const listHtml = relatedTools?.innerHTML ?? '';
        const tagsNode = (() => {
          const root = document.querySelector('.relatedToolsSection') || document.body;
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
          let node;
          while ((node = walker.nextNode())) {
            if (node.nodeValue && node.nodeValue.includes('Tags:')) {
              return node;
            }
          }
          return null;
        })();
        const tagsEl = tagsNode?.parentElement ?? null;
        return { listHtml, tagsHtml: tagsEl?.outerHTML ?? '' };
      });
    };

    const ssrState = await readRelatedToolsState();

    await page.evaluate(() => {
      const relatedTools = document.querySelector('.relatedTools');
      if (relatedTools) {
        relatedTools.innerHTML = '';
      }
      const tagsNode = (() => {
        const root = document.querySelector('.relatedToolsSection') || document.body;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (node.nodeValue && node.nodeValue.includes('Tags:')) {
            return node;
          }
        }
        return null;
      })();
      const tagsEl = tagsNode?.parentElement ?? null;
      if (tagsEl) {
        tagsEl.remove();
      }
      window.__relatedToolsRequested = false;
      const script = document.querySelector('script[src*="related-tools.js"]');
      if (script) {
        script.remove();
      }
    });

    await page.evaluate(() => {
      try {
        window.loadRelatedTools?.();
      } catch {}
    });

    await page.waitForTimeout(4000);
    await page.waitForFunction(() => document.body.textContent?.includes('Tags:'), null, { timeout: 15000 }).catch(() => {});

    const clientState = await readRelatedToolsState();

    if (JSON.stringify(ssrState) !== JSON.stringify(clientState)) {
      await testInfo.attach('relatedtools-ssr.html', {
        body: ssrState.listHtml + ssrState.tagsHtml,
        contentType: 'text/html',
      });
      await testInfo.attach('relatedtools-client.html', {
        body: clientState.listHtml + clientState.tagsHtml,
        contentType: 'text/html',
      });
      await testInfo.attach('relatedtools-screenshot.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    }

    expect(clientState.listHtml, 'Client list should match SSR list.').toBe(ssrState.listHtml);
    expect(clientState.tagsHtml, 'Client tags should match SSR tags.').toBe(ssrState.tagsHtml);
  } finally {
    await context.close();
  }
});

// Targets built CSS (PARITY_INDEX_ORIGIN, e.g. local `serve dist`) until GitHub Pages picks up the export.
test('home popular tools section has no page-section card shadow (index)', async ({ browser }, testInfo) => {
  const context = await browser.newContext();

  try {
    await prepareParityContext(context);

    const route = '/';
    const newBase = process.env.PARITY_INDEX_ORIGIN?.trim() || NEW_ORIGIN;
    const page = await context.newPage();

    await page.goto(buildRouteUrl(newBase, route), { waitUntil: 'load' });
    await page.waitForSelector('#home .page-section.relatedToolsSection', { timeout: 15000 });

    const newStyle = await page.evaluate(() => {
      const el = document.querySelector('#home .page-section.relatedToolsSection');
      if (!el) {
        return null;
      }
      const s = getComputedStyle(el);
      return {
        boxShadow: s.boxShadow,
        backgroundColor: s.backgroundColor,
        maxWidth: s.maxWidth,
      };
    });

    if (
      !newStyle ||
      newStyle.boxShadow !== 'none' ||
      newStyle.maxWidth !== 'none' ||
      !/rgba\(0, 0, 0, 0\)|transparent/i.test(newStyle.backgroundColor)
    ) {
      await testInfo.attach('home-popular-screenshot.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
      await testInfo.attach('home-popular-styles.json', {
        body: JSON.stringify({ newBase, newStyle }, null, 2),
        contentType: 'application/json',
      });
    }

    expect(newStyle, 'Index should expose #home .page-section.relatedToolsSection.').toBeTruthy();
    expect(newStyle.boxShadow, 'Home popular tools must not inherit .page-section card shadow.').toBe('none');
    expect(newStyle.maxWidth, 'Home popular tools must not use article max-width.').toBe('none');
    expect(newStyle.backgroundColor, 'Home popular tools background should stay transparent.').toMatch(
      /rgba\(0, 0, 0, 0\)|transparent/i,
    );
  } finally {
    await context.close();
  }
});
