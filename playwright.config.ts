import { defineConfig, devices } from '@playwright/test';
import process from 'node:process';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({

  testDir: './tests',
  testIgnore: ['tests/auth/**'],
  timeout: 240 * 1000, // 4 minutes – HAWB/HBL + Sea HBL forms can take 3+ min each

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry for stability during large runs */
  retries: 0,
  /* Limit workers to 2 to avoid system lag during heavy sequential field filling */
  workers: 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    video: 'on',
    screenshot: 'on',
    headless: true,
    actionTimeout: 30000,
    navigationTimeout: 60000,
    launchOptions: {
      slowMo: 0, 
    },
  },

  /* Configure projects for major browsers */
  projects: [

    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // 2. MODIFY THIS: Your existing Chromium project
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use the saved session here
        storageState: 'auth/user.json',
      },
      // 3. ADD THIS: Wait for setup to finish before running tests!
      dependencies: ['setup'],
    },
  ],


  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] },
  //   },

  //   {
  //     name: 'firefox',
  //     use: { ...devices['Desktop Firefox'] },
  //   },

  //   {
  //     name: 'webkit',
  //     use: { ...devices['Desktop Safari'] },
  //   },

  /* Test against mobile viewports. */
  // {
  //   name: 'Mobile Chrome',
  //   use: { ...devices['Pixel 5'] },
  // },
  // {
  //   name: 'Mobile Safari',
  //   use: { ...devices['iPhone 12'] },
  // },

  /* Test against branded browsers. */
  // {
  //   name: 'Microsoft Edge',
  //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
  // },
  // {
  //   name: 'Google Chrome',
  //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  // },


  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
