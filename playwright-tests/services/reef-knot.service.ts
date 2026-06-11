import { expect, Page, test } from '@playwright/test';
import { ReefKnotPage } from '@pages';
import { WalletPage } from '@lidofinance/wallets-testing-wallets';
import { HDAccount, mnemonicToAccount } from 'viem/accounts';
import { SdkService } from './sdk.service';
import { ConsoleLogger } from '@nestjs/common';
import { BrowserService } from '@lidofinance/browser-service';
import { ENV_CONFIG } from '@config';

export class ReefKnotService {
  logger = new ConsoleLogger('ReefKnotService');
  walletPage: WalletPage;
  page: Page;
  reefKnotPage: ReefKnotPage;
  seedPhrase: HDAccount;
  sdkService: SdkService;

  constructor(public browserService: BrowserService) {
    this.page = browserService.getBrowserContextPage();
    this.walletPage = browserService.getWalletPage();
    this.reefKnotPage = new ReefKnotPage(this.page);
    this.seedPhrase = mnemonicToAccount(ENV_CONFIG.WALLET_SECRET_PHRASE);
    this.sdkService = new SdkService();
  }

  async isConnectedWallet() {
    return test.step('Check wallet connection', async () => {
      const recentConnectorId = await this.reefKnotPage.getStorageData(
        'wagmi.recentConnectorId',
      );
      return recentConnectorId !== ''
        ? this.reefKnotPage.header.isAccountSectionVisible()
        : false;
    });
  }

  async connectWallet(
    walletButton = this.walletPage.options.walletConfig.CONNECT_BUTTON_NAME,
  ) {
    await test.step('Connect wallet', async () => {
      if (await this.isConnectedWallet()) return;
      await this.reefKnotPage.header.connectWalletButton.click();
      await this.reefKnotPage.walletListModal.confirmConditionWalletModal();
      const walletIcon =
        this.reefKnotPage.walletListModal.getWalletInModal(walletButton);

      await walletIcon.click();
      if (await this.isConnectedWallet()) return;

      await this.walletPage.connectWallet();
      await test.step('Check the wallet connect state', async () => {
        expect(
          await this.isConnectedWallet(),
          'Wallet should be connected',
        ).toBe(true);
      });
    });
  }

  async disconnectWalletForce() {
    await test.step('Forcefully disconnect wallet', async () => {
      await this.page.evaluate(() => {
        const localStorageKeys = Object.keys(localStorage);
        localStorageKeys.forEach((key) => {
          if (key.startsWith('wagmi')) {
            localStorage.removeItem(key);
          }
        });
      });
      await this.page.reload();
    });
  }
}
