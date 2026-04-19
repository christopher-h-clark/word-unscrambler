import { defineConfig, devices } from '@playwright/test';

const isCI = process.env.CI === 'true';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';
const testTimeout = parseInt(process.env.PLAYWRIGHT_TIMEOUT || '45000', 10);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // In CI, forbid .only() to prevent accidental test skipping in commits
  forbidOnly: isCI,
  // Retry failed tests twice in CI (flakiness buffer); none locally
  retries: isCI ? 2 : 0,
  // Run tests serially in CI (stable results); parallel locally (faster feedback)
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  // Test timeout: configurable via PLAYWRIGHT_TIMEOUT env var (default 45s)
  timeout: testTimeout,
  use: {
    baseURL,
  },
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !isCI,
    // Server startup timeout: 120s (npm install + build can be slow)
    timeout: 120000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
