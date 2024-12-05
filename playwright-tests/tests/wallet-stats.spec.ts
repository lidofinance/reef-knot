import { expect, test } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';
import { REEF_KNOT_CONFIG } from '@config';
import { ReefKnotService, toCut } from '@services';
import { formatEther } from 'viem';
import { Tags } from '@test-data';
import { BrowserService, initBrowserWithWallet } from '@browser';
import { ReefKnotPage } from '@pages';

const wallets = [{ name: 'metamask' }, { name: 'okx' }];

wallets.forEach((wallet) => {
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
          'Expected the connected wallet name to be displayed correctly',
        ).toContainText(
          reefKnotService.walletPage.config.COMMON.CONNECTED_WALLET_NAME,
        );
      });

      test(qase(436, 'Check chainId'), async () => {
        await qase.parameters({ wallet: wallet.name });

        await expect(
          reefKnotPage.statsBlock.chainIdValue,
          'Expected the connected network ID to be displayed correctly',
        ).toContainText(String(REEF_KNOT_CONFIG.STAND_CONFIG.chainId));
      });

      test(qase(437, 'Check ETH balance'), async () => {
        await qase.parameters({ wallet: wallet.name });

        const walletEthBalance = toCut(
          String(await reefKnotService.walletPage.getTokenBalance('ETH')),
          3,
        );
        await reefKnotService.walletPage.page.close();
        await expect(
          reefKnotPage.statsBlock.ethBalance,
          'Expected the wallet ETH balance comply with ReefKnot stats block',
        ).toContainText(walletEthBalance);
      });

      test(qase(438, 'Check stETH balance'), async () => {
        await qase.parameters({ wallet: wallet.name });

        const walletStethBalance = toCut(
          formatEther(await reefKnotService.sdkService.steth.balance()),
          5,
        );
        await expect(
          reefKnotPage.statsBlock.stethBalance,
          'Expected the stETH balance comply with ReefKnot stats block',
        ).toContainText(walletStethBalance);
      });

      test(qase(439, 'Check wstETH balance'), async () => {
        await qase.parameters({ wallet: wallet.name });

        const walletWstethBalance = toCut(
          formatEther(await reefKnotService.sdkService.wsteth.balance()),
          5,
        );
        await expect(
          reefKnotPage.statsBlock.wstethBalance,
          'Expected the wstETH balance comply with ReefKnot stats block',
        ).toContainText(walletWstethBalance);
      });
    },
  );
});
