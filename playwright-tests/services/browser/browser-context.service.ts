import { Logger } from '@nestjs/common';
import { BrowserContext, chromium, Page } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import { WalletConfig } from '@lidofinance/wallets-testing-wallets';

export class BrowserContextService {
  page: Page;
  browserContext: BrowserContext = null;
  browserContextPaths: string[] = [];
  extensionId: string;
  browserConfig: any;
  private readonly logger = new Logger(BrowserContextService.name);

  constructor(
    public walletConfig: WalletConfig,
    public contextDataDir: string,
  ) {
    this.browserConfig = {
      locale: 'en-us',
      headless: false,
      args: [
        '--lang=en-US',
        '--disable-dev-shm-usage',
        `--disable-extensions-except=${this.walletConfig.EXTENSION_PATH}`,
        '--js-flags="--max-old-space-size=2048"',
      ],
    };
  }

  async getBrowserContextPage() {
    if (!this.browserContext) {
      await this.initBrowserContext();
    }
    return this.page;
  }

  async initBrowserContext() {
    this.logger.debug('Starting a new browser context');

    const browserContextPath = path.join(process.cwd(), this.contextDataDir);
    const isCreated = await fs.mkdir(browserContextPath, {
      recursive: true,
    });

    this.browserContext = await chromium.launchPersistentContext(
      browserContextPath,
      this.browserConfig,
    );
    if (isCreated) {
      await this.browserContext.waitForEvent('page');
    }

    const pages = this.browserContext.pages();
    this.page = pages.at(-1);

    this.browserContext.on('page', async (page) => {
      page.once('crash', () => this.logger.error(`Page ${page.url()} crashed`));
    });
    this.browserContext.once('close', async () => {
      this.browserContext = null;
      this.browserContextPaths.push(browserContextPath);
      this.logger.debug('Browser context closed');
    });
    await this.setExtensionVars();
  }

  async setExtensionVars() {
    let [background] = this.browserContext.serviceWorkers();
    if (!background)
      background = await this.browserContext.waitForEvent('serviceworker');
    this.extensionId = background.url().split('/')[2];
  }

  async closePages() {
    if (!this.browserContext) {
      return;
    }
    this.page = await this.browserContext.newPage();
    await Promise.all(
      this.browserContext
        .pages()
        .slice(0, -1)
        .map((page) => page.close()),
    );
  }
}
