import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';

const envFile = process.env.ENV === 'qa' ? '.env.qa' : '.env';
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config();
}

const baseURL: string = process.env.BASE_URL || 'https://office.live.com/';

export default defineConfig({
  testDir: './src/tests',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }]
  ],
  use: {
    baseURL,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    permissions: ["clipboard-read"],
    actionTimeout: 10000,
    navigationTimeout: 300000
  },
  projects: [
    {
      name: 'Chromium Headless',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        headless: true
      }
    },
    {
      name: 'Chromium',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        headless: false
      }
    }
  ]
});