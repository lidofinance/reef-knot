import { Locator, Page } from '@playwright/test';
import { TIMEOUT } from '@test-data';
import { waitForCallback } from '@services';

export class StatsBlock {
  mainComponent: Locator;
  input: Locator;
  providerValue: Locator;
  chainIdValue: Locator;
  ethBalance: Locator;
  stethBalance: Locator;
  wstethBalance: Locator;
  amountInput: Locator;

  constructor(public page: Page) {
    this.mainComponent = this.page.getByTestId('statsBlock');
    this.input = this.mainComponent.getByTestId('amountInput');
    this.providerValue = this.mainComponent.getByTestId('providerName');
    this.chainIdValue = this.mainComponent.getByTestId('chainId');
    this.ethBalance = this.mainComponent.getByTestId('ETH');
    this.stethBalance = this.mainComponent.getByTestId('stETH');
    this.wstethBalance = this.mainComponent.getByTestId('wstETH');
    this.amountInput = this.mainComponent.getByTestId('amountInput');
  }

  async getEthBalance() {
    return await waitForCallback(
      async (locator: Locator) => {
        return await locator.evaluate((element) => {
          const balance = parseFloat(element.textContent);
          return balance || balance == 0 ? String(balance) : null;
        });
      },
      this.ethBalance,
      TIMEOUT.RPC_WAIT,
    );
  }

  async getStEthBalance() {
    return await waitForCallback(
      async (locator: Locator) => {
        return await locator.evaluate((element) => {
          const balance = parseFloat(element.textContent);
          return balance || balance == 0 ? String(balance) : null;
        });
      },
      this.stethBalance,
      TIMEOUT.RPC_WAIT,
    );
  }

  async getWstEthBalance() {
    return await waitForCallback(
      async (locator: Locator) => {
        return await locator.evaluate((element) => {
          const balance = parseFloat(element.textContent);
          return balance || balance == 0 ? String(balance) : null;
        });
      },
      this.wstethBalance,
      TIMEOUT.RPC_WAIT,
    );
  }
}
