import { Page, Locator } from '@playwright/test';

export class WalletModal {
  mainComponent: Locator;
  disconnectButton: Locator;

  constructor(public page: Page) {
    this.mainComponent = this.page.getByTestId('walletModal');
    this.disconnectButton = this.mainComponent.getByTestId('disconnectBtn');
  }
}
