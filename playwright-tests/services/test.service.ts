import { ReefKnotService } from './index';
import { test } from '@playwright/test';
import { ENV_CONFIG, REEF_KNOT_CONFIG, WALLETS } from '@config';
import { BrowserService } from '@lidofinance/browser-service';

export async function initBrowserWithWallet(walletName: string) {
  return test.step(`Init browser with the ${walletName} extension`, async () => {
    const wallet = WALLETS.get(walletName);

    const browserService = new BrowserService({
      networkConfig: REEF_KNOT_CONFIG.STAND_CONFIG.networkConfig,
      accountConfig: {
        SECRET_PHRASE: ENV_CONFIG.WALLET_SECRET_PHRASE,
        PASSWORD: ENV_CONFIG.WALLET_PASSWORD,
      },
      walletConfig: wallet.config,
      nodeConfig: null,
      standUrl: null,
    });

    await browserService.initWalletSetup();

    // mock the default reef-knot rpc url to avoid flaky tests
    const context = browserService.getBrowserContextPage().context();
    await context.route(
      /.*\/\/rpc\.hoodi\.ethpandaops\.io\//,
      async (route) => {
        try {
          const response = await context.request.fetch(
            REEF_KNOT_CONFIG.STAND_CONFIG.networkConfig.rpcUrl,
            {
              method: route.request().method(),
              headers: route.request().headers(),
              data: route.request().postData(),
            },
          );

          await route.fulfill({
            response: response,
          });
        } catch (err) {
          console.error('Error proxying request:', err);
          await route.abort();
        }
      },
    );

    const reefKnotService = new ReefKnotService(browserService);

    return { browserService, reefKnotService };
  });
}
