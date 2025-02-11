import { ExtensionService } from '@lidofinance/wallets-testing-extensions';
import { BrowserService } from './browser.service';
import { ETHEREUM_WIDGET_CONFIG } from '@lidofinance/wallets-testing-widgets';
import { ReefKnotService } from '@services';
import { walletConfig } from './browser.constants';
import { test } from '@playwright/test';

export async function initBrowserWithWallet(walletName: string) {
  return test.step(`Init browser with the ${walletName} extension`, async () => {
    const extensionConfig = walletConfig.get(walletName);

    process.env.EXTENSION_PATH =
      await new ExtensionService().getExtensionDirFromId(
        extensionConfig.STORE_EXTENSION_ID,
      );

    const browserService = new BrowserService(
      extensionConfig,
      ETHEREUM_WIDGET_CONFIG,
    );
    await browserService.initWalletSetup();

    const reefKnotService = new ReefKnotService(
      await browserService.getBrowserContextPage(),
      browserService.getWalletPage(),
      browserService.walletConfig.SECRET_PHRASE,
    );

    return { browserService, reefKnotService };
  });
}
