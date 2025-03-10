import { REEF_KNOT_CONFIG } from '@config';
import { expect, test } from '@playwright/test';
import { Tags, TIMEOUT } from '@test-data';
import { BrowserService } from '@browser';
import {
  initBrowserWithWallet,
  ReefKnotService,
  toCutDecimalsDigit,
} from '@services';
import { ReefKnotPage } from '@pages';
import { qase } from 'playwright-qase-reporter';

REEF_KNOT_CONFIG.WALLETS.forEach((wallet) => {
  test.describe(
    `ReefKnot. Wrap transaction (${wallet.name})`,
    { tag: [Tags.connectedWallet, `@${wallet.name}`] },
    async () => {
      const wrapAmount = '0.0003';
      let browserService: BrowserService;
      let reefKnotService: ReefKnotService;
      let reefKnotPage: ReefKnotPage;

      test.beforeAll(async () => {
        ({ browserService, reefKnotService } = await initBrowserWithWallet(
          wallet.name,
        ));
        reefKnotPage = reefKnotService.reefKnotPage;
        await reefKnotPage.goto();
        await reefKnotPage.allowUseCookies();
        await reefKnotService.connectWallet();
      });

      test.afterAll(async () => {
        await reefKnotService.disconnectWalletForce();
        await browserService.teardown();
      });

      test(qase(445, `Wrap ${wrapAmount} ETH`), async () => {
        await qase.groupParameters({
          wallet: wallet.name,
          txAmount: wrapAmount,
        });

        await reefKnotPage.wrapUnwrapBlock.selectWrapEthTxType();

        const newWstEthBalance =
          await test.step('Calculate the wstETH amount result', async () => {
            const wstethResult =
              parseFloat(await reefKnotPage.statsBlock.getWstEthBalance()) +
              (await reefKnotService.sdkService.exchangeStEthToWstEth(
                wrapAmount,
              ));
            return toCutDecimalsDigit(wstethResult, 4);
          });

        const txPage =
          await test.step('Fill the amount input and click to Submit button', async () => {
            await reefKnotPage.statsBlock.amountInput.fill(wrapAmount);
            return await reefKnotPage.clickWrapButton();
          });

        await reefKnotService.walletPage.confirmTx(txPage, true);

        await test.step('Waiting for transaction success', async () => {
          await expect(
            reefKnotPage.wrapUnwrapBlock.wrapBtn,
            'The Wrap button should be disabled',
          ).toBeDisabled();

          await reefKnotPage.toast.successToast.waitFor({
            state: 'visible',
            timeout: TIMEOUT.RPC_WAIT,
          });

          await expect(
            reefKnotPage.wrapUnwrapBlock.wrapBtn,
            'The Wrap button should be enabled after success tx',
          ).toBeEnabled();
        });

        await test.step('Check the new wstETH balance', async () => {
          await expect(
            reefKnotPage.statsBlock.wstethBalance,
            'The displayed wstETH balance should be updated after transaction success',
          ).toContainText(newWstEthBalance, { timeout: TIMEOUT.HIGH });
        });
      });

      test(qase(446, `Wrap ${wrapAmount} stETH`), async () => {
        await qase.groupParameters({
          wallet: wallet.name,
          txAmount: wrapAmount,
        });

        await test.step('Set up correct allowance before test', async () => {
          if (
            (await reefKnotService.sdkService.getStEthAllowance()) >=
            parseFloat(wrapAmount)
          ) {
            await reefKnotService.sdkService.wrap.approveStethForWrap({
              value: 0n,
            });
          }
        });

        await reefKnotPage.wrapUnwrapBlock.selectWrapStEthTxType();

        const newWstEthBalance =
          await test.step('Calculate the wstETH amount result', async () => {
            const wstethResult =
              parseFloat(await reefKnotPage.statsBlock.getWstEthBalance()) +
              (await reefKnotService.sdkService.exchangeStEthToWstEth(
                wrapAmount,
              ));
            return toCutDecimalsDigit(wstethResult, 4);
          });

        let txPage =
          await test.step('Fill the amount input and click to Submit button', async () => {
            await reefKnotPage.statsBlock.amountInput.fill(wrapAmount);
            return await reefKnotPage.clickWrapButton();
          });

        await test.step('Confirm tx of stETH approval', async () => {
          await reefKnotService.walletPage.approveTokenTx(txPage);
        });

        await test.step('Waiting for the approval success', async () => {
          await expect(
            reefKnotPage.wrapUnwrapBlock.wrapBtn,
            'The Wrap button should be disabled',
          ).toBeDisabled();

          [txPage] = await Promise.all([
            reefKnotPage.waitForPage(TIMEOUT.RPC_WAIT),
            reefKnotPage.toast.successToast.waitFor({
              state: 'visible',
              timeout: TIMEOUT.RPC_WAIT,
            }),
          ]);

          await test.step('Wait for the toast to be disappeared', async () => {
            await reefKnotPage.toast.successToast.waitFor({
              state: 'hidden',
              timeout: TIMEOUT.HIGH,
            });
          });
        });

        await test.step('Confirm tx of stETH wrapping', async () => {
          await reefKnotService.walletPage.confirmTx(txPage);
        });

        await test.step('Waiting for the wrapping success', async () => {
          await expect(
            reefKnotPage.wrapUnwrapBlock.wrapBtn,
            'The Wrap button should be disabled',
          ).toBeDisabled();

          await reefKnotPage.toast.successToast.waitFor({
            state: 'visible',
            timeout: TIMEOUT.RPC_WAIT,
          });

          await expect(
            reefKnotPage.wrapUnwrapBlock.wrapBtn,
            'The Wrap button should be enabled after success tx',
          ).toBeEnabled();
        });

        await test.step('Check the new wstETH balance', async () => {
          await expect(
            reefKnotPage.statsBlock.wstethBalance,
            'The displayed wstETH balance should be updated after transaction success',
          ).toContainText(newWstEthBalance, { timeout: TIMEOUT.HIGH });
        });
      });
    },
  );
});
