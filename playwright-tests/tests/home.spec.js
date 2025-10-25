const { test, expect } = require('@playwright/test');

const FRONT = process.env.BASE_FRONT || 'http://127.0.0.1:3002';

test.describe('Frontend smoke (Playwright)', () => {
  test('homepage loads and body is visible', async ({ page }) => {
    await page.goto(FRONT, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
  });

  test('has a title element (if present)', async ({ page }) => {
    await page.goto(FRONT, { waitUntil: 'domcontentloaded' });
    const h1 = page.locator('h1');
    if (await h1.count() > 0) {
      await expect(h1.first()).toBeVisible();
    } else {
      test.skip(true, 'No h1 on the page');
    }
  });
});
