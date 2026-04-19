import { defineConfig, devices } from '@playwright/test';

const isCI = process.env.CI === 'true';

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
  // Test timeout: allow 45s (accounts for slow startup + test execution)
  timeout: 45000,
  use: {
    baseURL: 'http://localhost:5173',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
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
