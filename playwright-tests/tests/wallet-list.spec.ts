import { expect, test } from '@playwright/test';
import { ReefKnotPage } from '@pages';
import { qase } from 'playwright-qase-reporter';

test.describe(`ReefKnot. Wallet list`, async () => {
  let reefKnotPage: ReefKnotPage;
  const expectedWalletCount = 16;

  test.beforeAll(async ({ browser }) => {
    reefKnotPage = new ReefKnotPage(await browser.newPage());
    await reefKnotPage.goto();
  });

  test.afterAll(async () => {
    await reefKnotPage.page.close();
  });

  test(
    qase(0, 'Check the count of the available options to connect wallet'),
    async () => {
      await test.step('Open the wallet list', async () => {
        await reefKnotPage.header.connectWalletButton.click();
        await reefKnotPage.walletListModal.moreWalletsButton.click();
      });

      await test.step('Check the count of the available options to connect wallet', async () => {
        const walletCount = await reefKnotPage.walletListModal.walletList
          .getByRole('button')
          .count();

        expect(walletCount).toBe(expectedWalletCount);
      });
    },
  );
});
