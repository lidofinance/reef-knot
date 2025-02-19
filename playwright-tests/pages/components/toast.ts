import { Locator, Page } from '@playwright/test';

export class Toast {
  successToast: Locator;
  errorToast: Locator;

  constructor(public page: Page) {
    this.successToast = this.page.locator(
      '.Toastify__toast--success :has-text("Success")',
    );
    this.errorToast = this.page.locator(
      '.Toastify__toast--error :has-text("Error")',
    );
  }
}
