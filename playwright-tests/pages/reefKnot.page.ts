import {
  Header,
  WalletListModal,
  StatsBlock,
  WalletModal,
  StakeBlock,
  Toast,
  WrapUnwrapBlock,
} from './components';
import { Page, test } from '@playwright/test';
import { TIMEOUT } from '@test-data';

export class ReefKnotPage {
  header: Header;
  walletModal: WalletModal;
  statsBlock: StatsBlock;
  stakeBlock: StakeBlock;
  wrapUnwrapBlock: WrapUnwrapBlock;
  walletListModal: WalletListModal;
  toast: Toast;

  constructor(public page: Page) {
    this.header = new Header(this.page);
    this.walletModal = new WalletModal(this.page);
    this.statsBlock = new StatsBlock(this.page);
    this.stakeBlock = new StakeBlock(this.page);
    this.wrapUnwrapBlock = new WrapUnwrapBlock(this.page);
    this.walletListModal = new WalletListModal(this.page);
    this.toast = new Toast(this.page);
  }

  async goto(param = '') {
    await test.step('Open ReefKnot stand', async () => {
      await this.page.goto(param);
    });
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

  async clickStakeButton() {
    const [txPage] = await Promise.all([
      this.waitForPage(TIMEOUT.RPC_WAIT),
      this.stakeBlock.stakeBtn.click(),
    ]);
    return txPage;
  }

  async clickWrapButton() {
    const [txPage] = await Promise.all([
      this.waitForPage(TIMEOUT.RPC_WAIT),
      this.wrapUnwrapBlock.wrapBtn.click(),
    ]);
    return txPage;
  }

  async clickUnwrapButton() {
    const [txPage] = await Promise.all([
      this.waitForPage(TIMEOUT.RPC_WAIT),
      this.wrapUnwrapBlock.unwrapBtn.click(),
    ]);
    return txPage;
  }
}
