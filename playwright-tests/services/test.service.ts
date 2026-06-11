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
      nodeConfig: {
        rpcUrl: REEF_KNOT_CONFIG.STAND_CONFIG.networkConfig.rpcUrl,
        mockConfig: {
          rpcUrlToMock: ['.*//rpc.hoodi.ethpandaops.io/'],
          mockEnabled: true,
        },
      },
      browserOptions: {
        cookies: [],
      },
    });

    await browserService.initWalletSetup();

    const reefKnotService = new ReefKnotService(browserService);

    return { browserService, reefKnotService };
  });
}
