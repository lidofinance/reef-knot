import { Logger } from '@nestjs/common';
import { BrowserContext, chromium, Page } from '@playwright/test';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { WalletConfig } from '@lidofinance/wallets-testing-wallets';

type OptionsBrowserContext = {
  // If contextDataDir is undefined - will be created temp dir for context data.
  // Else contextDataDir is not undefined - will be created user dir for context data in current folder.
  contextDataDir: string;
};

export class BrowserContextService {
  page: Page;
  browserContext: BrowserContext = null;
  browserContextPaths: string[] = [];
  walletConfig: WalletConfig;
  options: OptionsBrowserContext;
  extensionId: string;
  private readonly logger = new Logger(BrowserContextService.name);

  async setup(walletConfig: WalletConfig, options?: OptionsBrowserContext) {
    this.walletConfig = walletConfig;
    this.options = options;
    await this.getBrowserContextPage();
  }
  async getBrowserContextPage() {
    if (!this.browserContext) {
      await this.initBrowserContext();
    }
    return this.page;
  }

  async initBrowserContext() {
    this.logger.debug('Starting a new browser context');
    let browserContextPath;
    let isCreated;

    if (this.options.contextDataDir) {
      browserContextPath = path.join(
        process.cwd(),
        this.options.contextDataDir,
      );
      isCreated = await fs.mkdir(browserContextPath, {
        recursive: true,
      });
    } else {
      browserContextPath = await fs.mkdtemp(os.tmpdir() + path.sep);
      isCreated = true;
    }

    this.browserContext = await chromium.launchPersistentContext(
      browserContextPath,
      browserConfig(this.walletConfig.EXTENSION_PATH),
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

function browserConfig(extensionPath: string) {
  return {
    locale: 'en-us',
    headless: false,
    args: [
      '--lang=en-US',
      '--disable-dev-shm-usage',
      `--disable-extensions-except=${extensionPath}`,
      '--js-flags="--max-old-space-size=2048"',
    ],
  };
}
