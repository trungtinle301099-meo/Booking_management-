import { defineConfig } from '@playwright/test';
import { envConfig } from './src/config/env.config';

export default defineConfig({
  testDir: './tests',

  timeout: 30_000,

  expect: {
    timeout: 10_000,
  },

  fullyParallel: false,

  retries: process.env.CI ? 1 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
      },
    ],
  ],

  use: {
    baseURL: envConfig.baseUrl,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },
});
