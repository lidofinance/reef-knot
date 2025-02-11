import { Locator, Page } from '@playwright/test';

export class StakeBlock {
  page: Page;
  mainComponent: Locator;
  referralAddressInput: Locator;
  stakeBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainComponent = this.page.getByTestId('StakeBlock');
    this.referralAddressInput = this.mainComponent.locator('input');
    this.stakeBtn = this.mainComponent.locator('button :has-text("Stake")');
  }
}
