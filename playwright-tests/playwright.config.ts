import { PlaywrightTestConfig } from 'playwright/test';
import { REEF_KNOT_CONFIG, REPORT_CONFIG } from '@config';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 5 * 60 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: REPORT_CONFIG(),
  use: {
    actionTimeout: 15000,
    screenshot: { fullPage: true, mode: 'only-on-failure' },
    baseURL: REEF_KNOT_CONFIG.STAND_URL,
    trace: 'retain-on-failure',
    permissions: ['clipboard-read'],
    contextOptions: {
      reducedMotion: 'reduce',
    },
    browserName: 'chromium',
  },
  projects: [
    {
      name: 'reef-knot',
      testDir: '../playwright-tests/tests',
    },
  ],
};

export default config;