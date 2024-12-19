import { expect, test, Page } from '@playwright/test';
import { ReefKnotPage } from '@pages';
import { WalletPage } from '@lidofinance/wallets-testing-wallets';
import { TIMEOUT } from '@test-data';
import { HDAccount, mnemonicToAccount } from 'viem/accounts';
import { SdkService } from './sdk.service';

export class ReefKnotService {
  page: Page;
  public walletPage: WalletPage;
  reefKnotPage: ReefKnotPage;
  seedPhrase: HDAccount;
  sdkService: SdkService;

  constructor(page: Page, walletPage: WalletPage, seedPhrase: string) {
    this.page = page;
    this.walletPage = walletPage;
    this.reefKnotPage = new ReefKnotPage(this.page);
    this.seedPhrase = mnemonicToAccount(seedPhrase);
    this.sdkService = new SdkService(this.seedPhrase);
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

  async connectWallet(expectConnectionState = true) {
    await test.step('Connect wallet', async () => {
      if (await this.isConnectedWallet()) return;
      await this.reefKnotPage.header.connectWalletButton.click();
      await this.reefKnotPage.walletListModal.confirmConditionWalletModal();
      const walletIcon = this.reefKnotPage.walletListModal.getWalletInModal(
        this.walletPage.config.COMMON.CONNECT_BUTTON_NAME,
      );
      if (
        (await walletIcon.isEnabled({ timeout: TIMEOUT.LOW })) &&
        this.walletPage.config.COMMON.SIMPLE_CONNECT
      ) {
        await walletIcon.click();
      } else {
        try {
          const [connectWalletPage] = await Promise.all([
            this.page
              .context()
              .waitForEvent('page', { timeout: TIMEOUT.RPC_WAIT }),
            await walletIcon.click(),
          ]);
          await this.walletPage.connectWallet(connectWalletPage);
        } catch {
          console.error('Wallet page didnt open');
        }
      }
      const assertionMessage = expectConnectionState
        ? 'Wallet should be connected'
        : 'Wallet should be disconnected';
      expect(await this.isConnectedWallet(), assertionMessage).toBe(
        expectConnectionState,
      );
    });
  }

  async disconnectWalletForce() {
    await test.step('Forcefully disconnect wallet', async () => {
      await this.page.evaluate(() => {
        const localStorageKeys = Object.keys(localStorage);

        // Remove all keys starting with 'wagmi'
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
