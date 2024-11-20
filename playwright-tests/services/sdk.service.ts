import { LidoSDK, VIEM_CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { HDAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { REEF_KNOT_CONFIG } from '@config';

global.fetch = fetch;

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
}
