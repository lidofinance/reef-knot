import { PlaywrightTestConfig } from 'playwright/test';
import { REEF_KNOT_CONFIG } from './config';

// Setting of Qase Reporter
process.env.QASE_MODE = process.env.CI ? 'testops' : 'off'; // value 'testops' enables Qase reporter

// Setting TestRun naming and QASE_ENVIRONMENT for reporter with CI test run
if (process.env.QASE_MODE === 'testops') {
  process.env.QASE_TESTOPS_RUN_TITLE = 'Auto Run [s:@All]';
  process.env.QASE_ENVIRONMENT = REEF_KNOT_CONFIG.STAND_TYPE;
}

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 180 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: process.env.CI
    ? [
        ['html', { open: 'never' }],
        ['list'],
        ['github'],
        [
          'playwright-qase-reporter',
          {
            debug: false,
            testops: {
              api: {
                token: process.env.QASE_API_TOKEN,
              },
              project: 'REEFKNOT',
              uploadAttachments: true,
              run: {
                complete: true,
                description:
                  `Stand url: ${REEF_KNOT_CONFIG.STAND_URL}\n` +
                  `Env: ${REEF_KNOT_CONFIG.STAND_TYPE}`,
              },
              batch: {
                size: 10,
              },
            },
          },
        ],
      ]
    : [['html', { open: 'never' }], ['list']],
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
