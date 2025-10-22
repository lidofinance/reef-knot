import { PlaywrightTestConfig } from 'playwright/test';
import { REEF_KNOT_CONFIG, getReportConfig } from '@config';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 5 * 60 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  // forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: getReportConfig(),
  use: {
    actionTimeout: 15000,
    screenshot: { fullPage: true, mode: 'only-on-failure' },
    baseURL: REEF_KNOT_CONFIG.STAND_URL,
    trace: 'retain-on-first-failure',
    permissions: ['clipboard-read'],
    contextOptions: {
      reducedMotion: 'reduce',
    },
    browserName: 'chromium',
  },
  projects: [
    {
      name: 'reef-knot',
    },
  ],
};

export default config;
