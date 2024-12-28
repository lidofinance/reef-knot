import { expect, test } from '@playwright/test';
import { Tags } from '@test-data';
import { ReefKnotService } from '@services';
import { ReefKnotPage } from '@pages';
import { BrowserService, initBrowserWithWallet } from '@browser';
import { qase } from 'playwright-qase-reporter';
import { REEF_KNOT_CONFIG } from '@config';

REEF_KNOT_CONFIG.WALLETS.forEach((wallet) => {
  test.describe(
    `ReefKnot. Matomo events (${wallet.name})`,
    { tag: [Tags.connectedWallet, `@${wallet.name}`] },
    async () => {
      let browserService: BrowserService;
      let reefKnotService: ReefKnotService;
      let reefKnotPage: ReefKnotPage;

      test.beforeAll(async () => {
        ({ browserService, reefKnotService } = await initBrowserWithWallet(
          wallet.name,
        ));
        reefKnotPage = reefKnotService.reefKnotPage;
        await reefKnotPage.goto();
        await reefKnotPage.allowUseCookies();
        await reefKnotService.disconnectWalletForce();
      });

      test.afterAll(async () => {
        await reefKnotService.disconnectWalletForce();
        await browserService.teardown();
      });

      test(qase(432, `Connect ${wallet.name} wallet`), async () => {
        await qase.groupParameters({
          wallet: wallet.name,
          eventName: wallet.connectWalletEvent,
        });

        await test.step('Connect wallet and check console.log', async () => {
          const [consoleMessage] = await Promise.all([
            reefKnotPage.page.waitForEvent('console', (msg) =>
              msg.text().includes(wallet.connectWalletEvent),
            ),
            reefKnotService.connectWallet(),
          ]);
          expect(
            consoleMessage.text(),
            `The request parameter "${consoleMessage.text()}" should match the value "${wallet.connectWalletEvent}"`,
          ).toContain(wallet.connectWalletEvent);
        });
      });
    },
  );
});

test.describe(
  `ReefKnot. Matomo events (Browser)`,
  { tag: [Tags.connectedWallet, '@browser+metamask'] },
  async () => {
    let browserService: BrowserService;
    let reefKnotService: ReefKnotService;
    let reefKnotPage: ReefKnotPage;

    test.beforeAll(async () => {
      ({ browserService, reefKnotService } =
        await initBrowserWithWallet('metamask'));
      reefKnotPage = reefKnotService.reefKnotPage;
      await reefKnotPage.goto();
      await reefKnotPage.allowUseCookies();
      await reefKnotService.disconnectWalletForce();
    });

    test.afterAll(async () => {
      await reefKnotService.disconnectWalletForce();
      await browserService.teardown();
    });

    test(qase(432, 'Connect Browser wallet'), async () => {
      const expectedNameParam = 'browserExtension connected';
      await qase.groupParameters({
        wallet: 'browser+metamask',
        eventName: expectedNameParam,
      });

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
          `The request parameter "${consoleMessage.text()}" should match the value "${expectedNameParam}"`,
        ).toContain(expectedNameParam);
      });
    });
  },
);
