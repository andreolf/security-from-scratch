import { defineConfig, devices } from '@playwright/test';
// Device matrix. Run with --workers=1 (the box is shared). iPhone projects use WebKit.
export default defineConfig({
  testDir: './tests',
  testIgnore: process.env.SHOTS ? [] : ['**/screenshots.spec.js'],
  timeout: 90_000,
  expect: { timeout: 15_000 },
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: { baseURL: process.env.BASE_URL || 'http://localhost:4793/', trace: 'off' },
  webServer: process.env.BASE_URL ? undefined : { command: 'npx vite preview --port 4793 --strictPort', port: 4793, reuseExistingServer: true, timeout: 30_000 },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'iphone-13', use: { ...devices['iPhone 13'] } },
    { name: 'iphone-14', use: { ...devices['iPhone 14'] } },
    { name: 'pixel-7', use: { ...devices['Pixel 7'] } },
    { name: 'android-360', use: { ...devices['Galaxy S9+'], viewport: { width: 360, height: 740 } } },
    { name: 'landscape', use: { ...devices['iPhone 14 landscape'] } },
  ],
});
