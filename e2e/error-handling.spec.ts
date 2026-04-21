import { test, expect } from '@playwright/test';

test.describe('Word Lookup - Error Handling', () => {
  // AC4.3.4.a: No words match scenario
  test('displays supportive message when no words match', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');
    await input.fill('xyz');
    await button.click();
    await expect(page.locator('text=/no words match/i')).toBeVisible({ timeout: 10000 });
  });

  // AC4.3.4.b: Message tone is supportive
  test('message suggests trying different letters', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');
    await input.fill('xyz');
    await button.click();
    await expect(page.locator('text=/try different/i')).toBeVisible({ timeout: 10000 });
  });

  // AC4.3.4.c: User can immediately retry
  test('user can retry immediately after no results', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');

    // First lookup - no results
    await input.fill('xyz');
    await button.click();
    await expect(page.locator('text=/no words match/i')).toBeVisible({ timeout: 10000 });

    // Click to clear and retry with valid letters
    await input.click();
    await input.fill('abc');
    await button.click();

    // Should see results
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // Rejects input that is too long
  test('rejects input that is too long (> 10 chars)', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');
    await input.fill('abcdefghijk'); // 11 chars
    await expect(button).toBeDisabled();
  });

  // Silently rejects special characters
  test('silently rejects special characters in input', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    await input.fill('abc@#$');
    const value = await input.inputValue();
    expect(value).not.toContain('@');
  });
});
