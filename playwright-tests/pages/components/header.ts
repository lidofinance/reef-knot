import { Locator, Page } from '@playwright/test';

export class Header {
  page: Page;
  header: Locator;
  connectWalletButton: Locator;
  accountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = this.page.locator('header');
    this.connectWalletButton = this.header.getByTestId('connectBtn');
    this.accountButton = this.header.getByTestId('walletBtn');
  }

  async isAccountSectionVisible() {
    await this.accountButton
      .waitFor({
        state: 'visible',
        timeout: 3000,
      })
      .catch(() => {
        console.log('Account section is not visible');
      });
    return this.accountButton.isVisible();
  }
}
