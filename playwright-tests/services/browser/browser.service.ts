import {
  CommonWalletConfig,
  WalletConfig,
  WalletPage,
} from '@lidofinance/wallets-testing-wallets';
import { Extension } from '@lidofinance/wallets-testing-extensions';
import { WidgetConfig } from '@lidofinance/wallets-testing-widgets';
import {
  DEFAULT_BROWSER_CONTEXT_DIR_NAME,
  WALLET_PAGES,
} from './browser.constants';
import { BrowserContextService } from './browser-context.service';
import { REEF_KNOT_CONFIG } from '@config';

export class BrowserService {
  private walletPage: WalletPage;
  private browserContextService: BrowserContextService;
  private standConfig: WidgetConfig;
  readonly commonWalletConfig: CommonWalletConfig;
  public walletConfig: WalletConfig;

  constructor(
    commonWalletConfig: CommonWalletConfig,
    widgetConfig: WidgetConfig,
  ) {
    this.browserContextService = new BrowserContextService();
    this.commonWalletConfig = commonWalletConfig;
    this.standConfig = widgetConfig;
  }

  getWalletPage() {
    return this.walletPage;
  }

  async getBrowserContextPage() {
    return await this.browserContextService.getBrowserContextPage();
  }

  async initWalletSetup() {
    await this.setup(this.commonWalletConfig, this.standConfig);
    await this.walletPage.setupNetwork(REEF_KNOT_CONFIG.STAND_CONFIG);
    await this.walletPage.switchNetwork(
      REEF_KNOT_CONFIG.STAND_CONFIG.chainName,
    );
    await this.browserContextService.closePages();
  }

  async setup(
    commonWalletConfig: CommonWalletConfig,
    widgetConfig: WidgetConfig,
  ) {
    this.standConfig = widgetConfig;
    this.walletConfig = {
      SECRET_PHRASE: process.env.WALLET_SECRET_PHRASE,
      PASSWORD: process.env.WALLET_PASSWORD,
      COMMON: commonWalletConfig,
      EXTENSION_PATH: process.env.EXTENSION_PATH,
    };
    await this.browserContextService.setup(this.walletConfig, {
      // If fork was started we send to browserContextService set up separately context
      // but, if fork wasn't started we send custom directory for create share context.
      contextDataDir: DEFAULT_BROWSER_CONTEXT_DIR_NAME,
    });
    const extension = new Extension(this.browserContextService.extensionId);
    this.walletPage = new WALLET_PAGES[commonWalletConfig.WALLET_NAME](
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
