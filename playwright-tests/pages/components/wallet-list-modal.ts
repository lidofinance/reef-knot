import { Page, Locator, test } from '@playwright/test';

export class WalletListModal {
  page: Page;
  modal: Locator;
  termAndPrivacyCheckbox: Locator;
  moreWalletsButton: Locator;
  lessWalletsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = this.page.locator('div[role="dialog"]', {
      hasText: 'Connect wallet',
    });
    this.termAndPrivacyCheckbox = this.modal
      .locator('input[type=checkbox]')
      .locator('..');
    this.moreWalletsButton = this.modal.getByText('More wallets');
    this.lessWalletsButton = this.modal.getByText('Less wallets');
  }

  async confirmConditionWalletModal() {
    await test.step('Confirm the Term and privacy checkbox', async () => {
      await this.termAndPrivacyCheckbox.check();
    });
  }

  getWalletInModal(walletName: string) {
    return this.modal
      .getByRole('button')
      .getByText(walletName, { exact: true });
  }

  async closePopUp() {
    await this.modal.locator('button').nth(0).click();
  }
}
