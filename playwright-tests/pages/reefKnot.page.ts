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
import { NetworkConfig } from '@lidofinance/wallets-testing-wallets';
import { WalletInfo } from './components/wallet-info';
import { REEF_KNOT_CONFIG } from '@config';

export class ReefKnotPage {
  header: Header;
  walletModal: WalletModal;
  statsBlock: StatsBlock;
  stakeBlock: StakeBlock;
  wrapUnwrapBlock: WrapUnwrapBlock;
  walletListModal: WalletListModal;
  walletInfo: WalletInfo;
  toast: Toast;

  constructor(public page: Page) {
    this.header = new Header(this.page);
    this.walletModal = new WalletModal(this.page);
    this.statsBlock = new StatsBlock(this.page);
    this.stakeBlock = new StakeBlock(this.page);
    this.wrapUnwrapBlock = new WrapUnwrapBlock(this.page);
    this.walletListModal = new WalletListModal(this.page);
    this.walletInfo = new WalletInfo(this.page);
    this.toast = new Toast(this.page);
  }

  async goto(param = '') {
    await test.step('Open ReefKnot stand', async () => {
      await this.page.goto(param);
      await this.allowUseCookies();
      await this.selectDefaultNetwork(
        REEF_KNOT_CONFIG.STAND_CONFIG.networkConfig,
      );
    });
  }

  async allowUseCookies() {
    await test.step('Allow use cookies (if available)', async () => {
      if (await this.getCookieData('cookie-allowed')) {
        return;
      }
      try {
        await this.page
          .getByRole('button')
          .getByText('Allow')
          .waitFor({ state: 'visible', timeout: 3000 });
        await this.page.getByRole('button').getByText('Allow').click();
      } catch {
        // Cookies banner is not visible
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

  async getCookieData(name: string) {
    return (await this.page.context().cookies()).find(
      (cookie) => cookie.name === name,
    );
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

  async selectDefaultNetwork(network: NetworkConfig) {
    await test.step(`Select the ${network.chainName} network by default`, async () => {
      await this.header.walletInfoButton.click();
      await this.walletInfo.selectNetworkByDefault(network.chainId);
      await this.walletInfo.walletInfoCloseBtn.click();
    });
  }
}
