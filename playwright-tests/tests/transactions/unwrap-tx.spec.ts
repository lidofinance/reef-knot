import { REEF_KNOT_CONFIG } from '@config';
import { expect, test } from '@playwright/test';
import { Tags, TIMEOUT } from '@test-data';
import { BrowserService, initBrowserWithWallet } from '@browser';
import { ReefKnotService, toCut } from '@services';
import { ReefKnotPage } from '@pages';
import { qase } from 'playwright-qase-reporter';

REEF_KNOT_CONFIG.WALLETS.forEach((wallet) => {
  test.describe(
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
        await reefKnotPage.allowUseCookies();
        await reefKnotService.connectWallet();
      });

      test.afterAll(async () => {
        await reefKnotService.disconnectWalletForce();
        await browserService.teardown();
      });

      test(qase(447, `Unwrap ${unwrapAmount} wstETH`), async () => {
        await qase.groupParameters({
          wallet: wallet.name,
          txAmount: unwrapAmount,
        });

        await reefKnotPage.wrapUnwrapBlock.selectUnwrapTxType();

        const newStEthBalance =
          await test.step('Calculate the stETH amount result', async () => {
            const stEthBalance = parseFloat(
              await reefKnotPage.waitForBalance(
                reefKnotPage.statsBlock.stethBalance,
              ),
            );
            return toCut(
              stEthBalance +
                (await reefKnotService.sdkService.exchangeWstEthToEth(
                  unwrapAmount,
                )),
              4,
            );
          });

        const txPage =
          await test.step('Fill the amount input and click to Submit button', async () => {
            await reefKnotPage.statsBlock.amountInput.fill(unwrapAmount);
            return await reefKnotPage.clickUnwrapButton();
          });

        await reefKnotService.walletPage.confirmTx(txPage, true);

        await test.step('Waiting for transaction success', async () => {
          await expect(
            reefKnotPage.wrapUnwrapBlock.unwrapBtn,
            'The Unwrap button should be disabled',
          ).toBeDisabled();

          await reefKnotPage.toast.successToast.waitFor({
            state: 'visible',
            timeout: TIMEOUT.RPC_WAIT,
          });

          await expect(
            reefKnotPage.wrapUnwrapBlock.unwrapBtn,
            'The Unwrap button should be enabled after success tx',
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
