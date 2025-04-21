import { ExtensionService } from '@lidofinance/wallets-testing-extensions';
import { BrowserService } from '@browser';
import { ETHEREUM_WIDGET_CONFIG } from '@lidofinance/wallets-testing-widgets';
import { ReefKnotService } from './index';
import { test } from '@playwright/test';
import { getRpcByWallet, REEF_KNOT_CONFIG, WALLETS } from '@config';

export async function initBrowserWithWallet(walletName: string) {
  return test.step(`Init browser with the ${walletName} extension`, async () => {
    const wallet = WALLETS.get(walletName);
    REEF_KNOT_CONFIG.STAND_CONFIG.networkConfig.rpcUrl = getRpcByWallet(wallet);

    process.env.EXTENSION_PATH =
      await new ExtensionService().getExtensionDirFromId(
        wallet.config.STORE_EXTENSION_ID,
        wallet.config.LATEST_STABLE_DOWNLOAD_LINK,
      );

    const browserService = new BrowserService(
      wallet.config,
      ETHEREUM_WIDGET_CONFIG,
    );
    await browserService.initWalletSetup();

    const reefKnotService = new ReefKnotService(
      await browserService.browserContextService.getBrowserContextPage(),
      browserService.walletPage,
      browserService.walletConfig.SECRET_PHRASE,
    );

    return { browserService, reefKnotService };
  });
}
