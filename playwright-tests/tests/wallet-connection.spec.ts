import { ReefKnotService, initBrowserWithWallet } from '@services';
import { connectedWalletStorageData, Tags } from '@test-data';
import { ReefKnotPage } from '@pages';
import { expect, test } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';
import { REEF_KNOT_CONFIG } from '@config';
import { BrowserService } from '@lidofinance/browser-service';

REEF_KNOT_CONFIG.WALLETS.forEach((wallet) => {
  test.describe(
    `ReefKnot. Wallet connection (${wallet.name})`,
    { tag: [Tags.connectedWallet, `@${wallet.name}`] },
    async () => {
      test.describe.configure({ mode: 'serial' }); // Serial mode is used because the tests in this test.describe are related to each other.
      let browserService: BrowserService;
      let reefKnotService: ReefKnotService;
      let reefKnotPage: ReefKnotPage;

      test.beforeAll(async () => {
        ({ browserService, reefKnotService } = await initBrowserWithWallet(
          wallet.name,
        ));
        reefKnotPage = reefKnotService.reefKnotPage;
        await reefKnotPage.goto();
      });

      test.afterAll(async () => {
        await reefKnotService.disconnectWalletForce();
        await browserService.teardown();
      });

      test(qase(434, 'Connect wallet'), async () => {
        await qase.parameters({ wallet: wallet.name });

        await test.step('Check the stand appearance before wallet connection', async () => {
          await expect(
            reefKnotPage.statsBlock.mainComponent,
            'The statistic block should not be visible before the wallet is connected',
          ).not.toBeVisible();
          await expect(
            reefKnotPage.header.accountButton,
            'The account button should not be visible before the wallet is connected',
          ).not.toBeVisible();
        });
        await reefKnotService.connectWallet();
        await test.step('Check the stand appearance after wallet connection', async () => {
          await expect(
            reefKnotPage.statsBlock.mainComponent,
            'The statistic block should be visible after the wallet is connected',
          ).toBeVisible();
          await expect(
            reefKnotPage.header.accountButton,
            'The account button should be visible after the wallet is connected',
          ).toBeVisible();
        });
        await test.step('Check local storage with connected', async () => {
          expect(
            await reefKnotPage.getStorageData('wagmi.recentConnectorId'),
            'The value of "wagmi.recentConnectorId" should match the connected wallet',
          ).toBe(connectedWalletStorageData.get(wallet.name).recentConnectorId);
          expect(
            await reefKnotPage.getStorageData(
              'wagmi.reef-knot_reconnect-wallet-id',
            ),
            'The value of "wagmi.reef-knot_reconnect-wallet-id" should match the connected wallet',
          ).toBe(
            connectedWalletStorageData.get(wallet.name)[
              'reef-knot_reconnect-wallet-id'
            ],
          );
        });
      });

      test(
        qase(440, 'Reload page and check that the wallet connection remains'),
        async () => {
          await qase.parameters({ wallet: wallet.name });

          await reefKnotPage.page.reload();
          await expect(
            reefKnotPage.header.accountButton,
            'The account button should remain visible after the page is reloaded',
          ).toBeVisible();
          await expect(
            reefKnotPage.statsBlock.mainComponent,
            'The statistic block should remain visible after the page is reloaded',
          ).toBeVisible();
        },
      );

      test(qase(441, 'Disconnect wallet'), async () => {
        await qase.parameters({ wallet: wallet.name });

        await reefKnotPage.disconnectWallet();
        await test.step('Check the stand appearance after wallet disconnection', async () => {
          await expect(
            reefKnotPage.statsBlock.mainComponent,
            'The statistic block should not be visible after the wallet is disconnected',
          ).not.toBeVisible();
          await expect(
            reefKnotPage.header.accountButton,
            'The account button should not be visible after the wallet is disconnected',
          ).not.toBeVisible();
        });
        await test.step('Check local storage with connected', async () => {
          expect(
            await reefKnotPage.getStorageData('wagmi.recentConnectorId'),
            'The value of "wagmi.recentConnectorId" should be NaN',
          ).toBeNull();
          expect(
            await reefKnotPage.getStorageData(
              'wagmi.reef-knot_reconnect-wallet-id',
            ),
            'The value of "wagmi.reef-knot_reconnect-wallet-id" should be NaN',
          ).toBeNull();
          expect(
            await reefKnotPage.getStorageData(
              connectedWalletStorageData.get(wallet.name).disconnectWalletKey,
            ),
            'The recent wallet disconnection status should be "true"',
          ).toBe('true');
        });
      });

      test(
        qase(
          442,
          'Reload page and check that the wallet disconnection remains',
        ),
        async () => {
          await qase.parameters({ wallet: wallet.name });

          await reefKnotPage.page.reload();
          await expect(
            reefKnotPage.header.accountButton,
            'The account button should not be visible after the page is reloaded',
          ).not.toBeVisible();
          await expect(
            reefKnotPage.statsBlock.mainComponent,
            'The statistic block should not be visible after the page is reloaded',
          ).not.toBeVisible();
        },
      );
    },
  );
});
