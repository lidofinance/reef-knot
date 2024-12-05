import { ReefKnotService } from '@services';
import { connectedWalletStorageData, Tags } from '@test-data';
import { ReefKnotPage } from '@pages';
import { expect, test } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';
import { BrowserService, initBrowserWithWallet } from '@browser';

const wallets = [{ name: 'metamask' }, { name: 'okx' }];

wallets.forEach((wallet) => {
  test.describe.serial(
    `ReefKnot. Wallet connection (${wallet.name})`,
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
        await test.step('Check local storage with connected', async () => {
          expect(
            await reefKnotPage.getStorageData('wagmi.recentConnectorId'),
            'Expected the "wagmi.recentConnectorId" value to be equals the connected wallet',
          ).toBe(
            connectedWalletStorageData.get(
              browserService.commonWalletConfig.WALLET_NAME,
            ).recentConnectorId,
          );
          expect(
            await reefKnotPage.getStorageData(
              'wagmi.reef-knot_reconnect-wallet-id',
            ),
            'Expected the "wagmi.reef-knot_reconnect-wallet-id" value to be equals the connected wallet',
          ).toBe(
            connectedWalletStorageData.get(
              browserService.commonWalletConfig.WALLET_NAME,
            )['reef-knot_reconnect-wallet-id'],
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
            'Expected the account button is displayed after page reload',
          ).toBeVisible();
          await expect(
            reefKnotPage.statsBlock.mainComponent,
            'Expected the statistic block is displayed after page reload',
          ).toBeVisible();
        },
      );

      test(qase(441, 'Disconnect wallet'), async () => {
        await qase.parameters({ wallet: wallet.name });

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
        await test.step('Check local storage with connected', async () => {
          expect(
            await reefKnotPage.getStorageData('wagmi.recentConnectorId'),
            'Expected the "wagmi.recentConnectorId" value to be NaN',
          ).toBeNull();
          expect(
            await reefKnotPage.getStorageData(
              'wagmi.reef-knot_reconnect-wallet-id',
            ),
            'Expected the "wagmi.reef-knot_reconnect-wallet-id" value to be NaN',
          ).toBeNull();
          expect(
            await reefKnotPage.getStorageData(
              connectedWalletStorageData.get(
                browserService.commonWalletConfig.WALLET_NAME,
              ).disconnectWalletKey,
            ),
            'Expected the recent wallet disconnection status is "true"',
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
});
