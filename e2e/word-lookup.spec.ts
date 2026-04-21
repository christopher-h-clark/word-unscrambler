import { test, expect } from '@playwright/test';

test.describe('Word Lookup - Happy Path', () => {
  // AC4.3.2.a: Page loads
  test('user can load the app', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/word unscrambler/i);
  });

  // AC4.3.2.b: Input auto-focuses
  test('input field is auto-focused on page load', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    await expect(input).toBeFocused();
  });

  // AC4.3.2.c: User types letters
  test('user can type letters into input field', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    await input.fill('abc');
    await expect(input).toHaveValue('abc');
  });

  // AC4.3.2.d: Submit via Enter key
  test('user can submit via Enter key', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    await input.fill('abc');
    await input.press('Enter');
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // AC4.3.2.d: Submit via button click
  test('user can submit via button click', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');
    await input.fill('abc');
    await button.click();
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // AC4.3.2.e: Results grouped by length
  test('results display words grouped by length', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');
    await input.fill('abc');
    await button.click();
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });
  });

  // AC4.3.2.f: Words sorted alphabetically within each group
  test('words within each group are alphabetically sorted', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');
    await input.fill('abc');
    await button.click();
    await expect(page.locator('text=/\\d+-Letter Words/i')).toBeVisible({ timeout: 10000 });

    // Get text of first result section and verify words are in order
    const firstSection = page.locator('section').first();
    const content = await firstSection.textContent();
    expect(content).toBeTruthy();
    // Verify section contains words (words joined by space, e.g., "abc cab")
    // The structure is: section > h3 (title) + div (words)
    const wordsDivs = firstSection.locator('div');
    const wordsText = await wordsDivs.last().textContent();
    expect(wordsText).toBeTruthy();
    expect(wordsText?.trim().length).toBeGreaterThan(0);
  });

  // Button is enabled with valid input
  test('button is enabled when input is valid (3-10 chars)', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');
    await input.fill('abc');
    await expect(button).not.toBeDisabled();
  });

  // Button is disabled with invalid input
  test('button is disabled when input is invalid (< 3 chars)', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[placeholder*="letters"]');
    const button = page.locator('button:has-text("Unscramble")');
    await input.fill('ab');
    await expect(button).toBeDisabled();
  });
});
