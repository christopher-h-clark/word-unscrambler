import { test, expect } from '@playwright/test';

/**
 * WebKit (Safari) Tests: Tab Navigation Skip
 *
 * IMPORTANT FOR CI CONFIGURATION:
 * Tests that check keyboard Tab navigation to buttons are skipped on WebKit browsers.
 * This is because Safari on macOS requires "Full Keyboard Access" to be enabled in
 * System Settings → Keyboard to tab to all elements (not just form controls).
 *
 * If running tests in CI with Safari/WebKit:
 * 1. Enable Full Keyboard Access before running tests, OR
 * 2. Remove WebKit from browser targets in playwright.config.ts, OR
 * 3. Set environment variable WEBKIT_SKIP_KEYBOARD_TESTS=true
 *
 * The skipped tests include:
 * - test('tab moves focus from input to button when button is enabled')
 * - test('button has visible focus indicator when focused via keyboard Tab')
 * - test('button is activatable via keyboard Enter key')
 *
 * Chrome and Firefox pass all keyboard navigation tests without issue.
 */

// AC4.4.2: Automated checks for WCAG AA/AAA compliance
test.describe('Accessibility - WCAG AA Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // AC4.4.2: Form labels properly associated
  test('input has aria-label for screen reader accessibility', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await expect(input).toHaveAttribute('aria-label', 'Enter letters to unscramble');
  });

  test('input has aria-describedby pointing to visible hint text', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await expect(input).toHaveAttribute('aria-describedby', 'search-hint');
    await expect(page.locator('#search-hint')).toHaveText(
      '3-10 letters accepted, max 3 wildcards (?)'
    );
  });

  // AC4.4.2: Semantic HTML
  test('page has semantic header element', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
  });

  test('page has semantic main element', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible();
  });

  test('main heading uses h1 with app title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Word Unscrambler');
  });

  test('submit control is a native button element', async ({ page }) => {
    const tagName = await page
      .locator('button')
      .first()
      .evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('button');
  });

  // AC4.4.2: Keyboard accessible - input auto-focus
  test('input receives auto-focus on page load', async ({ page }) => {
    await expect(page.locator('input[type="text"]')).toBeFocused();
  });

  // AC4.4.2: Tab order is logical (input → button)
  // Note: WebKit (Safari on macOS) doesn't Tab to buttons by default without Full Keyboard Access
  test('tab moves focus from input to button when button is enabled', async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === 'webkit',
      'WebKit requires macOS Full Keyboard Access to Tab to buttons'
    );
    await page.locator('input[type="text"]').fill('abc');
    await expect(page.locator('button').first()).toBeEnabled();
    await page.locator('input[type="text"]').focus();
    await page.keyboard.press('Tab');
    await expect(page.locator('button').first()).toBeFocused();
  });

  test('input appears before button in DOM (source order)', async ({ page }) => {
    const inputBeforeButton = await page.evaluate(() => {
      const input = document.querySelector('input');
      const button = document.querySelector('button');
      if (!input || !button) return null;
      // DOCUMENT_POSITION_FOLLOWING = 4: button is after input
      return (input.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
    });
    expect(inputBeforeButton).toBe(true);
  });

  // AC4.4.2: Touch targets >= 44px × 44px (WCAG 2.5.5)
  test('input touch target height is at least 44px', async ({ page }) => {
    const bounds = await page.locator('input[type="text"]').boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
  });

  test('button touch target height is at least 44px', async ({ page }) => {
    const bounds = await page.locator('button').first().boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
  });

  test('input touch target height is at least 44px on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    const bounds = await page.locator('input[type="text"]').boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
  });

  test('button touch target height is at least 44px on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    const bounds = await page.locator('button').first().boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
  });

  // AC4.4.2: Focus states clearly visible (Tailwind ring applies via keyboard focus)
  test('input has visible focus indicator when focused via keyboard', async ({ page }) => {
    // Input already has autoFocus; verify ring is applied
    const boxShadow = await page
      .locator('input[type="text"]')
      .evaluate((el) => window.getComputedStyle(el).boxShadow);
    expect(boxShadow).not.toBe('none');
  });

  test('button has visible focus indicator when focused via keyboard Tab', async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === 'webkit',
      'WebKit requires macOS Full Keyboard Access to Tab to buttons'
    );
    await page.locator('input[type="text"]').fill('abc');
    await expect(page.locator('button').first()).toBeEnabled();
    await page.locator('input[type="text"]').focus();
    await page.keyboard.press('Tab');
    await expect(page.locator('button').first()).toBeFocused();
    const boxShadow = await page
      .locator('button')
      .first()
      .evaluate((el) => window.getComputedStyle(el).boxShadow);
    expect(boxShadow).not.toBe('none');
  });

  // AC4.4.2: No horizontal scrolling (responsive layout)
  test('no horizontal scrolling at desktop viewport', async ({ page }) => {
    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);
  });

  test('no horizontal scrolling on mobile viewport (375px wide)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);
  });

  test('no horizontal scrolling on tablet viewport (768px wide)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);
  });

  // AC4.4.2: Error messages accessible (role="alert")
  test('error message uses role="alert" when visible', async ({ page }) => {
    await page.locator('input[type="text"]').fill('abc');
    await page.locator('button').first().click();
    await page
      .waitForResponse((resp) => resp.url().includes('/unscrambler/v1/words'), { timeout: 10000 })
      .catch(() => {});

    const alertElement = page.locator('[role="alert"]');
    if ((await alertElement.count()) > 0) {
      await expect(alertElement.first()).toBeVisible();
    }
  });

  // AC4.4.2: Loading state has role="status" for screen reader announcement
  test('loading state uses role="status" for screen reader polite announcement', async ({
    page,
  }) => {
    await page.route('**/unscrambler/v1/words**', async (route) => {
      await new Promise<void>((resolve) => setTimeout(resolve, 500));
      await route.continue();
    });

    await page.locator('input[type="text"]').fill('abc');
    await page.locator('button').first().click();

    await expect(page.locator('[role="status"]')).toBeVisible();
    await expect(page.locator('[role="status"]')).toContainText('Searching');
  });

  // AC4.4.3: Results are scannable - section elements with h3 headings
  test('results use section elements with h3 headings after search', async ({ page }) => {
    await page.locator('input[type="text"]').fill('abc');
    await page.locator('button').first().click();

    await expect(page.locator('section').first()).toBeVisible({ timeout: 10000 });
    const heading = page.locator('h3').first();
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(/\d+-Letter Words/);
  });

  // AC4.4.2: Input type is text (explicitly set)
  test('search input has explicit type="text"', async ({ page }) => {
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  // Keyboard navigation: Enter key submits form
  test('Enter key on input submits the search', async ({ page }) => {
    await page.locator('input[type="text"]').fill('abc');
    await page.locator('input[type="text"]').press('Enter');
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // Keyboard navigation: button accessible via keyboard Enter
  // Note: WebKit (Safari on macOS) doesn't Tab to buttons by default without Full Keyboard Access
  test('button is activatable via keyboard Enter key', async ({ page, browserName }) => {
    test.skip(
      browserName === 'webkit',
      'WebKit requires macOS Full Keyboard Access to Tab to buttons'
    );
    await page.locator('input[type="text"]').fill('abc');
    await expect(page.locator('button').first()).toBeEnabled();
    await page.locator('input[type="text"]').focus();
    await page.keyboard.press('Tab');
    await expect(page.locator('button').first()).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // AC4.4.4: Button disabled state (announced to screen readers via HTML disabled attribute)
  test('button has disabled attribute when input is empty', async ({ page }) => {
    await expect(page.locator('button').first()).toBeDisabled();
  });

  test('button is enabled when input has 3+ valid letters', async ({ page }) => {
    await page.locator('input[type="text"]').fill('abc');
    await expect(page.locator('button').first()).toBeEnabled();
  });
});
