import { Locator, Page } from '@playwright/test';

export class StakeBlock {
  mainComponent: Locator;
  referralAddressInput: Locator;
  stakeBtn: Locator;

  constructor(public page: Page) {
    this.mainComponent = this.page.getByTestId('StakeBlock');
    this.referralAddressInput = this.mainComponent.locator('input');
    this.stakeBtn = this.mainComponent.locator('button :has-text("Stake")');
  }
}
