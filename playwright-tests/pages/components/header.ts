import { Locator, Page } from '@playwright/test';
import { ConsoleLogger } from '@nestjs/common';

export class Header {
  logger = new ConsoleLogger('Header');
  header: Locator;
  connectWalletButton: Locator;
  accountButton: Locator;

  constructor(public page: Page) {
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
        this.logger.log('Account section is not visible');
      });
    return this.accountButton.isVisible();
  }
}
