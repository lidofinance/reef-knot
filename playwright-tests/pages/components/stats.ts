import { Locator, Page } from '@playwright/test';

export class StatsBlock {
  page: Page;
  mainComponent: Locator;
  input: Locator;
  providerValue: Locator;
  chainIdValue: Locator;
  ethBalance: Locator;
  stethBalance: Locator;
  wstethBalance: Locator;
  amountInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainComponent = this.page.getByTestId('statsBlock');
    this.input = this.mainComponent.getByTestId('amountInput');
    this.providerValue = this.mainComponent.getByTestId('providerName');
    this.chainIdValue = this.mainComponent.getByTestId('chainId');
    this.ethBalance = this.mainComponent.getByTestId('ETH');
    this.stethBalance = this.mainComponent.getByTestId('stETH');
    this.wstethBalance = this.mainComponent.getByTestId('wstETH');
    this.amountInput = this.mainComponent.getByTestId('amountInput');
  }
}
