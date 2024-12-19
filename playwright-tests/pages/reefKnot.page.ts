import { Header, WalletListModal, StatsBlock, WalletModal } from './components';
import { Page, test } from '@playwright/test';
import { TIMEOUT } from '@test-data';

export class ReefKnotPage {
  readonly page: Page;
  header: Header;
  walletModal: WalletModal;
  statsBlock: StatsBlock;
  walletListModal: WalletListModal;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(this.page);
    this.walletModal = new WalletModal(this.page);
    this.statsBlock = new StatsBlock(this.page);
    this.walletListModal = new WalletListModal(this.page);
  }

  async goto(param = '') {
    await this.page.goto(param);
  }

  async allowUseCookies() {
    await test.step('Allow use cookies (if available)', async () => {
      if (
        await this.page
          .getByRole('button')
          .getByText('Allow')
          .isVisible({ timeout: 3000 })
      ) {
        await this.page.getByRole('button').getByText('Allow').click();
      }
    });
  }

  async waitForPage(timeout = TIMEOUT.RPC_WAIT) {
    const page = await this.page
      .context()
      .waitForEvent('page', { timeout: timeout });
    await page.waitForLoadState('load');
    return page;
  }

  async disconnectWallet() {
    await test.step('Disconnect wallet', async () => {
      await this.header.accountButton.click();
      await this.walletModal.mainComponent.waitFor({ state: 'visible' });
      await this.walletModal.disconnectButton.click();
    });
  }

  async getStorageData(name: string) {
    return await this.page.evaluate((names) => {
      return localStorage.getItem(names);
    }, name);
  }
}
