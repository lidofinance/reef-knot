import {
  CommonWalletConfig,
  WalletConfig,
  WalletPage,
  WalletTypes,
} from '@lidofinance/wallets-testing-wallets';
import { Extension } from '@lidofinance/wallets-testing-extensions';
import { WidgetConfig } from '@lidofinance/wallets-testing-widgets';
import { BrowserContextService } from './browser-context.service';
import { REEF_KNOT_CONFIG, ENV_CONFIG, WALLETS } from '@config';

export class BrowserService {
  walletPage: WalletPage<WalletTypes.EOA>;
  browserContextService: BrowserContextService;
  walletConfig: WalletConfig;
  browserContextFolderName = '.browser_context';

  constructor(
    readonly commonWalletConfig: CommonWalletConfig,
    private standConfig: WidgetConfig,
  ) {
    this.walletConfig = {
      SECRET_PHRASE: ENV_CONFIG.WALLET_SECRET_PHRASE,
      PASSWORD: ENV_CONFIG.WALLET_PASSWORD,
      COMMON: this.commonWalletConfig,
      EXTENSION_PATH: process.env.EXTENSION_PATH,
    };
    this.browserContextService = new BrowserContextService(
      this.walletConfig,
      `${this.browserContextFolderName}_${this.commonWalletConfig.WALLET_NAME}`,
    );
  }

  async initWalletSetup() {
    await this.setup();
    await this.walletPage.setupNetwork(
      REEF_KNOT_CONFIG.STAND_CONFIG.networkConfig,
    );
    await this.walletPage.changeNetwork(
      REEF_KNOT_CONFIG.STAND_CONFIG.networkConfig.chainName,
    );
    await this.browserContextService.closePages();
  }

  async setup() {
    await this.browserContextService.getBrowserContextPage();
    const extension = new Extension(this.browserContextService.extensionId);
    const wallet = WALLETS.get(this.commonWalletConfig.WALLET_NAME);

    this.walletPage = new wallet.app(
      this.browserContextService.browserContext,
      extension.url,
      this.walletConfig,
    );
    await this.walletPage.setup(this.standConfig.networkName);
  }

  async teardown() {
    if (this.browserContextService.browserContext !== null)
      await this.browserContextService.browserContext.close();
  }
}
