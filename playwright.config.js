const { defineConfig, devices } = require('@playwright/test');
const { testData } = require('./support/test-data');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 15 * 1000
  },
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: testData.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      }
    },
    {
      name: 'bundled-chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
