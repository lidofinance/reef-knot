import { expect, test } from '@playwright/test';
import { Tags, TIMEOUT } from '@test-data';
import {
  initBrowserWithWallet,
  ReefKnotService,
  toCutDecimalsDigit,
} from '@services';
import { ReefKnotPage } from '@pages';
import { qase } from 'playwright-qase-reporter';
import { REEF_KNOT_CONFIG } from '@config';
import { BrowserService } from '@lidofinance/browser-service';

REEF_KNOT_CONFIG.WALLETS.forEach((wallet) => {
  test.describe.only(
    `ReefKnot. Request withdraw transaction (${wallet.name})`,
    { tag: [Tags.connectedWallet, `@${wallet.name}`] },
    async () => {
      const txAmount = '0.0003';
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

      test.afterAll(async () => {
        await reefKnotService.disconnectWalletForce();
        await browserService.teardown();
      });

      test(qase(448, `Withdrawal ${txAmount} stETH`), async () => {
        await qase.groupParameters({
          wallet: wallet.name,
          txAmount: txAmount,
        });

        const newStEthBalance =
          await test.step('Calculate the stETH amount result', async () => {
            const stethResult =
              parseFloat(await reefKnotPage.statsBlock.getStEthBalance()) -
              parseFloat(txAmount);
            return toCutDecimalsDigit(stethResult, 4);
          });

        let txPage =
          await test.step('Fill the amount input and click to Submit button', async () => {
            await reefKnotPage.withdrawBlock.selectToken('stETH');
            await reefKnotPage.statsBlock.amountInput.fill(txAmount);
            return await reefKnotPage.clickWithdrawButton();
          });

        await test.step('Confirm permit signing', async () => {
          [txPage] = await Promise.all([
            reefKnotPage.waitForPage(TIMEOUT.RPC_WAIT),
            reefKnotService.walletPage.confirmTx(txPage),
          ]);
        });

        await test.step('Confirm withdraw request tx', async () => {
          await reefKnotService.walletPage.confirmTx(txPage, true);
        });

        await test.step('Waiting for transaction success', async () => {
          await expect(
            reefKnotPage.withdrawBlock.withdrawBtn,
            'The Permit Request button should be disabled',
          ).toBeDisabled();
          await reefKnotPage.toast.successToast.waitFor({
            state: 'visible',
            timeout: TIMEOUT.RPC_WAIT,
          });
          await expect(
            reefKnotPage.withdrawBlock.withdrawBtn,
            'The Permit Request button should be enabled after success tx',
          ).toBeEnabled();
        });

        await test.step('Check the new stETH balance', async () => {
          await expect(
            reefKnotPage.statsBlock.stethBalance,
            'The displayed stETH balance should be updated after transaction success',
          ).toContainText(newStEthBalance, { timeout: TIMEOUT.HIGH });
        });
      });

      test(qase(449, `Withdrawal ${txAmount} wstETH`), async () => {
        await qase.groupParameters({
          wallet: wallet.name,
          txAmount: txAmount,
        });

        const newWstEthBalance =
          await test.step('Calculate the wstETH amount result', async () => {
            const wstethResult =
              parseFloat(await reefKnotPage.statsBlock.getWstEthBalance()) -
              parseFloat(txAmount);
            return toCutDecimalsDigit(wstethResult, 4);
          });

        let txPage =
          await test.step('Fill the amount input and click to Submit button', async () => {
            await reefKnotPage.withdrawBlock.selectToken('wstETH');
            await reefKnotPage.statsBlock.amountInput.fill(txAmount);
            return await reefKnotPage.clickWithdrawButton();
          });

        await test.step('Confirm permit signing', async () => {
          [txPage] = await Promise.all([
            reefKnotPage.waitForPage(TIMEOUT.RPC_WAIT),
            reefKnotService.walletPage.confirmTx(txPage, true),
          ]);
        });

        await test.step('Confirm withdraw request tx', async () => {
          await reefKnotService.walletPage.confirmTx(txPage);
        });

        await test.step('Waiting for transaction success', async () => {
          await expect(
            reefKnotPage.withdrawBlock.withdrawBtn,
            'The Permit Request button should be disabled',
          ).toBeDisabled();
          await reefKnotPage.toast.successToast.waitFor({
            state: 'visible',
            timeout: TIMEOUT.RPC_WAIT,
          });
          await expect(
            reefKnotPage.withdrawBlock.withdrawBtn,
            'The Permit Request button should be enabled after success tx',
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
