import { test as base } from '@playwright/test';
import { METAMASK_COMMON_CONFIG } from '@lidofinance/wallets-testing-wallets';
import { ETHEREUM_WIDGET_CONFIG } from '@lidofinance/wallets-testing-widgets';
import { ExtensionService } from '@lidofinance/wallets-testing-extensions';
import { BrowserService } from '@browser';
import { ReefKnotService } from './reef-knot.service';

type Fixtures = object;

export const test = base.extend<
  Fixtures,
  {
    browserWithWallet: BrowserService;
    reefKnotService: ReefKnotService;
  }
>({
  page: async ({ page }, use) => {
    await use(page);
  },
  browserWithWallet: [
    // eslint-disable-next-line
    async ({}, use) => {
      process.env.EXTENSION_PATH =
        await new ExtensionService().getExtensionDirFromId(
          METAMASK_COMMON_CONFIG.STORE_EXTENSION_ID,
        );

      const browserService = new BrowserService(
        METAMASK_COMMON_CONFIG,
        ETHEREUM_WIDGET_CONFIG,
      );
      await browserService.initWalletSetup();
      await use(browserService);
      // Teardown will be call only when all tests done or when test failed.
      await browserService.teardown();
    },
    { scope: 'worker' },
  ],
  reefKnotService: [
    async ({ browserWithWallet }, use) => {
      await use(
        new ReefKnotService(
          await browserWithWallet.getBrowserContextPage(),
          browserWithWallet.getWalletPage(),
          browserWithWallet.walletConfig.SECRET_PHRASE,
        ),
      );
    },
    { scope: 'worker' },
  ],
});
