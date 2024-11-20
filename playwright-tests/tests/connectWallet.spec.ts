import { test, toCut } from '@services';
import { Tags } from '@test-data';
import { ReefKnotPage } from '@pages';
import { expect } from '@playwright/test';
import { REEF_KNOT_CONFIG } from '@config';
import { formatEther } from 'viem';
import { qase } from 'playwright-qase-reporter';

test.describe.serial(
  'ReefKnot. Wallet connection',
  { tag: [Tags.connectedWallet] },
  async () => {
    let reefKnotPage: ReefKnotPage;

    test.beforeAll(async ({ reefKnotService }) => {
      reefKnotPage = new ReefKnotPage(reefKnotService.page);
      await reefKnotPage.goto();
      await reefKnotPage.allowUseCookies();
    });

    test.afterAll(async ({ reefKnotService }) => {
      await reefKnotService.disconnectWalletForce();
    });

    test(qase(434, 'Connect wallet'), async ({ reefKnotService }) => {
      await test.step('Check the stand appearance before wallet connection', async () => {
        await expect(
          reefKnotPage.statsBlock.mainComponent,
          'Expected the statistic block is not displayed before wallet connection',
        ).not.toBeVisible();
        await expect(
          reefKnotPage.header.accountButton,
          'Expected the account button is not displayed before wallet connection',
        ).not.toBeVisible();
      });
      await reefKnotService.connectWallet();
      await test.step('Check the stand appearance after wallet connection', async () => {
        await expect(
          reefKnotPage.statsBlock.mainComponent,
          'Expected the statistic block is displayed after wallet connection',
        ).toBeVisible();
        await expect(
          reefKnotPage.header.accountButton,
          'Expected the account button is displayed after wallet connection',
        ).toBeVisible();
      });
    });

    test.describe('Check statistic block', async () => {
      test(qase(435, 'Check provider name'), async ({ reefKnotService }) => {
        await expect(
          reefKnotPage.statsBlock.providerValue,
          'Expected the connected wallet name to be displayed correctly',
        ).toContainText(
          reefKnotService.walletPage.config.COMMON.CONNECTED_WALLET_NAME,
        );
      });

      test(qase(436, 'Check chainId'), async () => {
        await expect(
          reefKnotPage.statsBlock.chainIdValue,
          'Expected the connected network ID to be displayed correctly',
        ).toContainText(String(REEF_KNOT_CONFIG.STAND_CONFIG.chainId));
      });

      test(qase(437, 'Check ETH balance'), async ({ reefKnotService }) => {
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

      test(qase(438, 'Check stETH balance'), async ({ reefKnotService }) => {
        const walletStethBalance = toCut(
          formatEther(await reefKnotService.sdkService.steth.balance()),
          5,
        );
        await expect(
          reefKnotPage.statsBlock.stethBalance,
          'Expected the stETH balance comply with ReefKnot stats block',
        ).toContainText(walletStethBalance);
      });

      test(qase(439, 'Check wstETH balance'), async ({ reefKnotService }) => {
        const walletWstethBalance = toCut(
          formatEther(await reefKnotService.sdkService.wsteth.balance()),
          5,
        );
        await expect(
          reefKnotPage.statsBlock.wstethBalance,
          'Expected the wstETH balance comply with ReefKnot stats block',
        ).toContainText(walletWstethBalance);
      });
    });

    test(
      qase(440, 'Reload page and check that the wallet connection remains'),
      async () => {
        await reefKnotPage.page.reload();
        await expect(
          reefKnotPage.header.accountButton,
          'Expected the account button is displayed after page reload',
        ).toBeVisible();
        await expect(
          reefKnotPage.statsBlock.mainComponent,
          'Expected the statistic block is displayed after page reload',
        ).toBeVisible();
      },
    );

    test(qase(441, 'Disconnect wallet'), async () => {
      await reefKnotPage.disconnectWallet();
      await test.step('Check the stand appearance after wallet disconnection', async () => {
        await expect(
          reefKnotPage.statsBlock.mainComponent,
          'Expected the statistic block is not displayed after wallet disconnection',
        ).not.toBeVisible();
        await expect(
          reefKnotPage.header.accountButton,
          'Expected the account button is not displayed after wallet disconnection',
        ).not.toBeVisible();
      });
    });

    test(
      qase(442, 'Reload page and check that the wallet disconnection remains'),
      async () => {
        await reefKnotPage.page.reload();
        await expect(
          reefKnotPage.header.accountButton,
          'Expected the account button is not displayed after page reload',
        ).not.toBeVisible();
        await expect(
          reefKnotPage.statsBlock.mainComponent,
          'Expected the statistic block is not displayed after page reload',
        ).not.toBeVisible();
      },
    );
  },
);
