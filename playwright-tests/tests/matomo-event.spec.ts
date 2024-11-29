import { ReefKnotPage } from '@pages';
import { CONFIG_MATOMO_CLICK_TO_WALLET_EVENTS } from '@test-data';
import { test, expect } from '@playwright/test';
import { Tags } from '@test-data';
import { qase } from 'playwright-qase-reporter';
import { initBrowserWithWallet } from '@browser';
import { ReefKnotService } from '@services';

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
      qase.groupParameters({
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
          `Expected request param "${consoleMessage.text()}" to equal value "${event.eventMessage}"`,
        ).toContain(event.eventMessage);
      });
    });
  });

  test(
    qase(431, 'Click to buttons "More wallets" and "Less wallets"'),
    async () => {
      const expectedMoreWalletsNameParam = 'more wallets clicked';
      const expectedLessWalletsNameParam = 'less wallets clicked';

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
          `Expected request param "${consoleMessage.text()}" to equal value "${expectedMoreWalletsNameParam}"`,
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
          `Expected request param "${consoleMessage.text()}" to equal value "${expectedLessWalletsNameParam}"`,
        ).toContain(expectedLessWalletsNameParam);
      });
    },
  );
});

test.describe(
  'ReefKnot. Matomo events [connected wallet]',
  { tag: [Tags.connectedWallet] },
  async () => {
    let reefKnotService: ReefKnotService;
    let reefKnotPage: ReefKnotPage;

    test.beforeAll(async () => {
      const browser = await initBrowserWithWallet('metamask');
      reefKnotService = browser.reefKnotService;
      reefKnotPage = reefKnotService.reefKnotPage;
      await reefKnotPage.goto();
      await reefKnotPage.allowUseCookies();
    });

    test.beforeEach(async () => {
      await reefKnotPage.goto();
      await reefKnotService.disconnectWalletForce();
    });

    test.afterAll(async () => {
      await reefKnotService.disconnectWalletForce();
    });

    test(qase(432, 'Connect Metamask wallet'), async () => {
      const expectedNameParam = 'metaMask connected';

      await test.step('Connect wallet and check console.log', async () => {
        const [consoleMessage] = await Promise.all([
          reefKnotPage.page.waitForEvent('console', (msg) =>
            msg.text().includes(expectedNameParam),
          ),
          reefKnotService.connectWallet(),
        ]);
        expect(
          consoleMessage.text(),
          `Expected request param "${consoleMessage.text()}" to equal value "${expectedNameParam}"`,
        ).toContain(expectedNameParam);
      });
    });

    test(qase(433, 'Connect wallet with Browser button'), async () => {
      const expectedNameParam = 'browserExtension connected';

      await test.step('Connect wallet and check console.log', async () => {
        const [connectWalletPage] =
          await test.step('Connect wallet with Browser button', async () => {
            await reefKnotService.reefKnotPage.header.connectWalletButton.click();
            await reefKnotService.reefKnotPage.walletListModal.confirmConditionWalletModal();

            return await Promise.all([
              reefKnotService.reefKnotPage.waitForPage(),
              reefKnotService.reefKnotPage.walletListModal
                .getWalletInModal('Browser')
                .click(),
            ]);
          });

        const [consoleMessage] = await Promise.all([
          reefKnotPage.page.waitForEvent('console', (msg) =>
            msg.text().includes(expectedNameParam),
          ),
          reefKnotService.walletPage.connectWallet(connectWalletPage),
        ]);
        expect(
          consoleMessage.text(),
          `Expected request param "${consoleMessage.text()}" to equal value "${expectedNameParam}"`,
        ).toContain(expectedNameParam);
      });
    });
  },
);
