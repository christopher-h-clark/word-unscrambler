import { defineConfig, devices } from '@playwright/test';

const isCI = process.env.CI === 'true';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';
const serverURL = process.env.PLAYWRIGHT_SERVER_URL || 'http://localhost:3000';
const testTimeout = parseInt(process.env.PLAYWRIGHT_TIMEOUT || '30000', 10);

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
  webServer: [
    {
      command: 'npm run dev:server',
      url: `${serverURL}/health`,
      reuseExistingServer: !isCI,
      timeout: 60000,
    },
    {
      command: 'npm run dev:client',
      url: baseURL,
      reuseExistingServer: !isCI,
      timeout: 60000,
    },
  ],
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
