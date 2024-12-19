import { Page, Locator } from '@playwright/test';

export class WalletModal {
  page: Page;
  mainComponent: Locator;
  disconnectButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainComponent = this.page.getByTestId('walletModal');
    this.disconnectButton = this.mainComponent.getByTestId('disconnectBtn');
  }
}
