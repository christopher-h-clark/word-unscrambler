import { test, expect } from '@playwright/test';

test.describe('Word Lookup - Multiple Searches', () => {
  // AC4.3.6.a: First lookup works
  test('user can perform first lookup successfully', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');
    await input.fill('abc');
    await button.click();
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // AC4.3.6.b: Input auto-clears on click/focus
  test('input field auto-clears when user clicks to retry', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');

    // First lookup
    await input.fill('abc');
    await button.click();
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });

    // Click input field — should auto-clear
    await input.click();
    await expect(input).toHaveValue('');
  });

  // AC4.3.6.c: Second lookup works with different letters
  test('user can perform second lookup with different letters', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');

    // First lookup
    await input.fill('abc');
    await button.click();
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });

    // Clear and retry with different letters
    await input.click();
    await input.fill('eat');
    await button.click();
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // AC4.3.6.d: Both lookups return correct results
  test('both lookups return appropriate results for their inputs', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');

    // Lookup 1: Valid input with results
    await input.fill('abc');
    await button.click();
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });

    // Lookup 2: No results
    await input.click();
    await input.fill('xyz');
    await button.click();
    await expect(page.locator('text=/no words match/i')).toBeVisible({ timeout: 10000 });
  });

  // Rapid consecutive searches
  test('handles rapid consecutive searches', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');

    for (const letters of ['abc', 'eat', 'cat']) {
      await input.click();
      await input.fill(letters);
      await button.click();
      await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
    }

    // Final results should be visible
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // Results update between searches
  test('results update when performing a new search', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');

    // First search
    await input.fill('abc');
    await button.click();
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });

    // Second search - no results
    await input.click();
    await input.fill('xyz');
    await button.click();

    // Old results should be gone, replaced by no-match message
    await expect(page.locator('text=/no words match/i')).toBeVisible({ timeout: 10000 });
  });
});
