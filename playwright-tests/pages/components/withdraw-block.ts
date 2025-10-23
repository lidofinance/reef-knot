import { Locator, Page, test } from '@playwright/test';

export class WithdrawBlock {
  mainComponent: Locator;
  withdrawBtn: Locator;
  tokenSelector: Locator;

  constructor(public page: Page) {
    this.mainComponent = this.page.getByTestId('Permit requestBlock');
    this.withdrawBtn = this.mainComponent.locator(
      'button :has-text("Permit request")',
    );
    this.tokenSelector = this.mainComponent.locator('label');
  }

  async selectToken(token: 'stETH' | 'wstETH') {
    await test.step(`Select the token ${token} for withdraw request`, async () => {
      await this.tokenSelector.click();
      await this.page
        .locator('id=lido-ui-modal-root')
        .getByRole('option', { name: token, exact: true })
        .click();
    });
  }
}
