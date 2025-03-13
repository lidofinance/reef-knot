import { REEF_KNOT_CONFIG } from '@config';
import { ReporterDescription } from '@playwright/test';

const htmlReporter: ReporterDescription = ['html', { open: 'never' }];
const consoleReporter: ReporterDescription = [
  'list',
  { printSteps: !process.env.CI },
];
const githubReporter: ReporterDescription = ['github'];
const qaseReporter: ReporterDescription = [
  'playwright-qase-reporter',
  {
    debug: false,
    environment: REEF_KNOT_CONFIG.STAND_ENV,
    mode: 'testops', // value 'testops' enables Qase reporter, 'off' disables
    testops: {
      api: {
        token: process.env.QASE_API_TOKEN,
      },
      project: 'REEFKNOT',
      uploadAttachments: true,
      run: {
        complete: true,
        title: `Auto Run [w:${process.env.WALLETS}][s:@${process.env.TEST_SUITE || '-'}]`,
        description:
          `Stand url: ${REEF_KNOT_CONFIG.STAND_URL}\n` +
          `Env: ${REEF_KNOT_CONFIG.STAND_ENV}`,
      },
      batch: {
        size: 10,
      },
    },
  },
];

export const getReportConfig: () => ReporterDescription[] = function () {
  const reporterConfig: ReporterDescription[] = [htmlReporter, consoleReporter];
  if (process.env.CI) {
    reporterConfig.push(githubReporter, qaseReporter);
  }
  return reporterConfig;
};
