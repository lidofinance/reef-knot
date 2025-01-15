import { Locator, Page } from '@playwright/test';

export class Toast {
  page: Page;
  successToast: Locator;
  errorToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successToast = this.page.locator(
      '.Toastify__toast--success :has-text("Success")',
    );
    this.errorToast = this.page.locator(
      '.Toastify__toast--error :has-text("Error")',
    );
  }
}
