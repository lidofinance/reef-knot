import { LidoSDK, VIEM_CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { HDAccount } from 'viem/accounts';
import { createWalletClient, formatEther, http } from 'viem';
import { REEF_KNOT_CONFIG } from '@config';
import { toCut } from './helpers';

global.fetch = fetch;

export enum sdkToken {
  ETH = 'ETH',
  stETH = 'stETH',
  wstETH = 'wstETH',
}

export class SdkService extends LidoSDK {
  constructor(account: HDAccount) {
    super({
      chainId: REEF_KNOT_CONFIG.STAND_CONFIG.chainId,
      rpcUrls: [REEF_KNOT_CONFIG.STAND_CONFIG.rpcUrl],
      web3Provider: createWalletClient({
        account: account,
        chain: VIEM_CHAINS[REEF_KNOT_CONFIG.STAND_CONFIG.chainId],
        transport: http(),
      }),
      logMode: 'none',
    });
  }

  async getBalanceByToken(token: sdkToken, decimalPlaces: number) {
    let balance: string;
    switch (token) {
      case sdkToken.ETH:
        balance = formatEther(await this.core.balanceETH());
        break;
      case sdkToken.stETH:
        balance = formatEther(await this.steth.balance());
        break;
      case sdkToken.wstETH:
        balance = formatEther(await this.wsteth.balance());
        break;
    }
    return toCut(balance, decimalPlaces);
  }

  async exchangeEthToWstEth(amount: any) {
    const wstethRate = formatEther(
      await this.wrap.convertStethToWsteth(1000000000000000000n),
    );
    return parseFloat(wstethRate) * parseFloat(amount);
  }

  async exchangeWstEthToEth(amount: any) {
    const wstethRate = formatEther(
      await this.wrap.convertWstethToSteth(1000000000000000000n),
    );
    return parseFloat(wstethRate) * parseFloat(amount);
  }

  async getStEthAllowance() {
    return parseFloat(
      formatEther(
        await this.steth.allowance({
          to: `0x${REEF_KNOT_CONFIG.STAND_CONFIG.contracts.wrap.slice(2)}`,
        }),
      ),
    );
  }
}
