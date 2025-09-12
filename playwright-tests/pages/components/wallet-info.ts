import { Locator, Page } from '@playwright/test';

export class WalletInfo {
  walletInfoCloseBtn: Locator;

  constructor(public page: Page) {
    this.walletInfoCloseBtn = this.page.getByTestId('closeWalletInfoBtn');
  }

  async selectNetworkByDefault(chainId: number) {
    await this.page.getByTestId(`chain-${chainId}`).getByRole('button').click();
  }
}
