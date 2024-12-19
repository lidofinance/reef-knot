import { ReefKnotPage } from '@pages';
import { CONFIG_MATOMO_CLICK_TO_WALLET_EVENTS } from '@test-data';
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

test.describe('ReefKnot. Matomo events', async () => {
  let reefKnotPage: ReefKnotPage;

  test.beforeAll(async ({ browser }) => {
    reefKnotPage = new ReefKnotPage(await browser.newPage());
    await reefKnotPage.goto();
    await reefKnotPage.allowUseCookies();
  });

  test.beforeEach(async () => {
    await reefKnotPage.goto();
  });

  test.afterEach(async () => {
    // close unnecessary pages, after link clicking
    if (reefKnotPage.page.context().pages().length > 1) {
      await reefKnotPage.page.context().pages()[1].close();
    }
  });

  CONFIG_MATOMO_CLICK_TO_WALLET_EVENTS.forEach((event) => {
    test(qase(430, `Click to "${event.walletName}" wallet`), async () => {
      await qase.groupParameters({
        wallet: event.walletName,
        event: event.eventMessage,
      });

      await test.step('Open the the modal with wallet list', async () => {
        await reefKnotPage.header.connectWalletButton.click();
        await reefKnotPage.walletListModal.confirmConditionWalletModal();
        await reefKnotPage.walletListModal.moreWalletsButton.click();
      });

      await test.step(`Click to wallet ${event.walletName} and check console log`, async () => {
        const [consoleMessage] = await Promise.all([
          reefKnotPage.page.waitForEvent('console', (msg) =>
            msg.text().includes('metrics'),
          ),
          reefKnotPage.walletListModal
            .getWalletInModal(event.walletName)
            .click(),
        ]);
        expect(
          consoleMessage.text(),
          `The request parameter "${consoleMessage.text()}" should match the value "${event.eventMessage}"`,
        ).toContain(event.eventMessage);
      });
    });
  });

  test(
    qase(431, 'Click to buttons "More wallets" and "Less wallets"'),
    async () => {
      const expectedMoreWalletsNameParam = 'more wallets clicked';
      const expectedLessWalletsNameParam = 'less wallets clicked';

      await qase.groupParameters({
        eventMoreWallet: expectedMoreWalletsNameParam,
        eventLessWallet: expectedLessWalletsNameParam,
      });

      await test.step('Open the wallet popup', async () => {
        await reefKnotPage.header.connectWalletButton.click();
        await reefKnotPage.walletListModal.confirmConditionWalletModal();
      });

      await test.step('Click to "More wallets"', async () => {
        const [consoleMessage] = await Promise.all([
          reefKnotPage.page.waitForEvent('console', (msg) =>
            msg.text().includes('metrics'),
          ),
          reefKnotPage.walletListModal.moreWalletsButton.click(),
        ]);
        expect(
          consoleMessage.text(),
          `The request parameter "${consoleMessage.text()}" should match the value "${expectedMoreWalletsNameParam}"`,
        ).toContain(expectedMoreWalletsNameParam);
      });

      await test.step('Click to "Less wallets"', async () => {
        const [consoleMessage] = await Promise.all([
          reefKnotPage.page.waitForEvent('console', (msg) =>
            msg.text().includes('metrics'),
          ),
          reefKnotPage.walletListModal.lessWalletsButton.click(),
        ]);
        expect(
          consoleMessage.text(),
          `The request parameter "${consoleMessage.text()}" should match the value "${expectedLessWalletsNameParam}"`,
        ).toContain(expectedLessWalletsNameParam);
      });
    },
  );
});
