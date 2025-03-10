import { Locator, Page, test } from '@playwright/test';

export class WrapUnwrapBlock {
  mainComponent: Locator;
  wrapBtn: Locator;
  unwrapBtn: Locator;
  txTypeSelector: Locator;

  constructor(public page: Page) {
    this.mainComponent = this.page
      .getByTestId('WrapBlock')
      .or(this.page.getByTestId('UnwrapBlock'));
    this.wrapBtn = this.mainComponent.locator('button :has-text("Wrap")');
    this.unwrapBtn = this.mainComponent.locator('button :has-text("Unwrap")');
    this.txTypeSelector = this.mainComponent.locator('label');
  }

  async selectWrapEthTxType() {
    await test.step('Select the Wrap ETH tx type', async () => {
      await this.txTypeSelector.click();
      await this.page
        .locator('id=lido-ui-modal-root')
        .locator('button', { hasText: 'Wrap ETH' })
        .click();
    });
  }

  async selectWrapStEthTxType() {
    await test.step('Select the Wrap stETH tx type', async () => {
      await this.txTypeSelector.click();
      await this.page
        .locator('id=lido-ui-modal-root')
        .locator('button', { hasText: 'Wrap stETH' })
        .click();
    });
  }

  async selectUnwrapTxType() {
    await test.step('Select the Unwrap tx type', async () => {
      await this.txTypeSelector.click();
      await this.page
        .locator('id=lido-ui-modal-root')
        .locator('button', { hasText: 'Unwrap' })
        .click();
    });
  }
}
