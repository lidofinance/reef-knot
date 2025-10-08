import { REEF_KNOT_CONFIG } from '@config';
import { expect, test } from '@playwright/test';
import { Tags, TIMEOUT } from '@test-data';
import {
  initBrowserWithWallet,
  ReefKnotService,
  toCutDecimalsDigit,
} from '@services';
import { ReefKnotPage } from '@pages';
import { qase } from 'playwright-qase-reporter';
import { BrowserService } from '@lidofinance/browser-service';

REEF_KNOT_CONFIG.WALLETS.forEach((wallet) => {
  test.describe.only(
    `ReefKnot. Unwrap transaction (${wallet.name})`,
    { tag: [Tags.connectedWallet, `@${wallet.name}`] },
    async () => {
      const unwrapAmount = '0.0003';
      let browserService: BrowserService;
      let reefKnotService: ReefKnotService;
      let reefKnotPage: ReefKnotPage;

      test.beforeAll(async () => {
        ({ browserService, reefKnotService } = await initBrowserWithWallet(
          wallet.name,
        ));
        reefKnotPage = reefKnotService.reefKnotPage;
        await reefKnotPage.goto();
        await reefKnotService.connectWallet();
      });

      test.only(qase(447, `Unwrap ${unwrapAmount} wstETH`), async () => {
        // Check connection after connect wallet on before.all
        try {
          await expect(
            reefKnotPage.header.accountButton,
            'The account button should remain visible after the page is reloaded',
          ).toBeVisible();
        } catch (error) {
          console.log(
            `[ERROR] catch drop connection- wagmi.store: ${await reefKnotPage.getStorageData(
              'wagmi.store',
            )}`,
          );
          await reefKnotService.page.reload();
          await expect(
            reefKnotPage.header.accountButton,
            'The account button should remain visible after the page is reloaded',
          ).toBeVisible();
          console.log(
            `[ERROR] catch drop connection && reload - wagmi.store: ${await reefKnotPage.getStorageData(
              'wagmi.store',
            )}`,
          );
        }
        await test.step('Go to the page',async()=>{
          await reefKnotPage.goto();
          })

        await test.step('Go to the page',async()=>{
          await reefKnotPage.goto();
        })
        // check connection after connectWallet -> goto
        try {
          await expect(
            reefKnotPage.header.accountButton,
            'The account button should remain visible after the page is reloaded',
          ).toBeVisible();
        } catch (error) {
          console.log(
            `[ERROR] catch drop connection- wagmi.store: ${await reefKnotPage.getStorageData(
              'wagmi.store',
            )}`,
          );
          await test.step('Reload to the page',async()=>{
            await reefKnotService.page.reload();
          })


          await expect(
            reefKnotPage.header.accountButton,
            'The account button should remain visible after the page is reloaded',
          ).toBeVisible();
          console.log(
            `[ERROR] catch drop connection && reload - wagmi.store: ${await reefKnotPage.getStorageData(
              'wagmi.store',
            )}`,
          );
        }
      });
    },
  );
});
