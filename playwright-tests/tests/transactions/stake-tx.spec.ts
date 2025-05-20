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
import { REEF_KNOT_CONFIG } from '@config';

REEF_KNOT_CONFIG.WALLETS.forEach((wallet) => {
  test.describe(
    `ReefKnot. Stake ETH transaction (${wallet.name})`,
    { tag: [Tags.connectedWallet, `@${wallet.name}`] },
    async () => {
      const stakeAmount = '0.0003';
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

      test(qase(444, `Stake ${stakeAmount} ETH`), async () => {
        await qase.groupParameters({
          wallet: wallet.name,
          txAmount: stakeAmount,
        });

        const newStEthBalance =
          await test.step('Calculate the stETH amount result', async () => {
            const stethResult =
              parseFloat(await reefKnotPage.statsBlock.getStEthBalance()) +
              parseFloat(stakeAmount);
            return toCutDecimalsDigit(stethResult, 4);
          });

        const txPage =
          await test.step('Fill the amount input and click to Submit button', async () => {
            await reefKnotPage.statsBlock.amountInput.fill(stakeAmount);
            return await reefKnotPage.clickStakeButton();
          });

        await reefKnotService.walletPage.confirmTx(txPage, true);

        await test.step('Waiting for transaction success', async () => {
          await expect(
            reefKnotPage.stakeBlock.stakeBtn,
            'The Stake button should be disabled',
          ).toBeDisabled();
          await reefKnotPage.toast.successToast.waitFor({
            state: 'visible',
            timeout: TIMEOUT.RPC_WAIT,
          });
          await expect(
            reefKnotPage.stakeBlock.stakeBtn,
            'The Stake button should be enabled after success tx',
          ).toBeEnabled();
        });

        await test.step('Check the new stETH balance', async () => {
          await expect(
            reefKnotPage.statsBlock.stethBalance,
            'The displayed stETH balance should be updated after transaction success',
          ).toContainText(newStEthBalance, { timeout: TIMEOUT.HIGH });
        });
      });
    },
  );
});
