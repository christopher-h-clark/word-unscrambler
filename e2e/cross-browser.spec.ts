import { test, expect } from '@playwright/test';

test.describe('Word Lookup - Cross-Browser & Responsive', () => {
  test.describe.configure({ retries: 2 });

  // AC4.3.8.a/b: Works across browsers (all browsers configured in playwright.config.ts)
  test('word lookup works in this browser', async ({ page, browserName }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');
    await input.fill('abc');
    await button.click();
    console.log(`Testing on ${browserName}`);
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // AC4.3.8.c: Mobile simulation
  test('responsive layout works on mobile (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');
    await expect(input).toBeVisible();
    await expect(button).toBeVisible();
    await input.fill('abc');
    await button.click();
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // AC4.3.8.d: Tablet simulation
  test('responsive layout works on tablet (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');
    await input.fill('abc');
    await button.click();
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // Desktop viewport
  test('responsive layout works on desktop (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');
    await input.fill('abc');
    await button.click();
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // All user flows work consistently
  test('all user flows work consistently across browsers', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');

    // Happy path
    await input.fill('abc');
    await button.click();
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });

    // No results
    await input.click();
    await input.fill('xyz');
    await button.click();
    await expect(page.locator('text=/no words match/i')).toBeVisible({ timeout: 10000 });

    // Retry
    await input.click();
    await input.fill('cat');
    await button.click();
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // Keyboard navigation accessible across browsers
  test('keyboard navigation works across browsers', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    await input.fill('abc');
    await input.press('Enter');
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // Input auto-focus works across browsers
  test('input auto-focus works across browsers', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    await expect(input).toBeFocused();
  });
});
