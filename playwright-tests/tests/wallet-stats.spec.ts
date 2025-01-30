import { expect, test } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';
import { REEF_KNOT_CONFIG } from '@config';
import { ReefKnotService, sdkToken } from '@services';
import { Tags } from '@test-data';
import { BrowserService, initBrowserWithWallet } from '@browser';
import { ReefKnotPage } from '@pages';

REEF_KNOT_CONFIG.WALLETS.forEach((wallet) => {
  test.describe(
    `ReefKnot. Check statistic (${wallet.name})`,
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
        await reefKnotService.connectWallet();
      });

      test.afterAll(async () => {
        await reefKnotService.disconnectWalletForce();
        await browserService.teardown();
      });

      test(qase(435, 'Check provider name'), async () => {
        await qase.parameters({ wallet: wallet.name });

        await expect(
          reefKnotPage.statsBlock.providerValue,
          'The connected wallet name should be displayed correctly',
        ).toContainText(
          reefKnotService.walletPage.config.COMMON.CONNECTED_WALLET_NAME,
        );
      });

      test(qase(436, 'Check chainId'), async () => {
        await qase.parameters({ wallet: wallet.name });

        await expect(
          reefKnotPage.statsBlock.chainIdValue,
          'The connected network ID should be displayed correctly',
        ).toContainText(String(REEF_KNOT_CONFIG.STAND_CONFIG.chainId));
      });

      test(qase(437, 'Check ETH balance'), async () => {
        await qase.parameters({ wallet: wallet.name });
        expect(
          await reefKnotPage.statsBlock.getEthBalance(),
          'The address ETH balance should match the value displayed in the ReefKnot stats block',
        ).toContain(
          await reefKnotService.sdkService.getBalanceByToken(sdkToken.ETH, 5),
        );
      });

      test(qase(438, 'Check stETH balance'), async () => {
        await qase.parameters({ wallet: wallet.name });
        expect(
          await reefKnotPage.statsBlock.getStEthBalance(),
          'The address stETH balance should match the value displayed in the ReefKnot stats block',
        ).toContain(
          await reefKnotService.sdkService.getBalanceByToken(sdkToken.stETH, 5),
        );
      });

      test(qase(439, 'Check wstETH balance'), async () => {
        await qase.parameters({ wallet: wallet.name });
        expect(
          await reefKnotPage.statsBlock.getWstEthBalance(),
          'The address wstETH balance should match the value displayed in the ReefKnot stats block',
        ).toContain(
          await reefKnotService.sdkService.getBalanceByToken(
            sdkToken.wstETH,
            5,
          ),
        );
      });
    },
  );
});
