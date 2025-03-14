import { NetworkConfig } from '@lidofinance/wallets-testing-wallets';
import { NETWORKS_CONFIG } from '@lidofinance/wallets-testing-wallets';
import { WALLETS } from './wallet.config';
import { REEF_KNOT_CONFIG } from './config';
import { ENV_CONFIG } from './env.validation';

export interface StandConfig {
  networkConfig: NetworkConfig;
  contracts: {
    stake: string;
    wrap: string;
    withdraw: string;
  };
}

export const STAND_ENV = {
  testnet: 'testnet',
  mainnet: 'mainnet',
};

export const STAND_LINK = {
  stand: 'https://lidofinance.github.io/reef-knot/',
  localhost: 'http://localhost:3000/',
};

export const STAND_CONFIGS = new Map<string, StandConfig>([
  [
    STAND_ENV.testnet,
    {
      networkConfig: NETWORKS_CONFIG.Testnet.ETHEREUM_HOLESKY,
      contracts: {
        stake: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034',
        wrap: '0x8d09a4502Cc8Cf1547aD300E066060D043f6982D',
        withdraw: '0xc7cc160b58F8Bb0baC94b80847E2CF2800565C50',
      },
    },
  ],
  [
    STAND_ENV.mainnet,
    {
      networkConfig: NETWORKS_CONFIG.Mainnet.ETHEREUM,
      contracts: {
        stake: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
        wrap: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
        withdraw: '0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1',
      },
    },
  ],
]);

/** Some wallets fail validation of the default drpc link because it has params.
 * So, we use free links for these wallets.
 * - function used only for testnet because the Ethereum mainnet network installed in the wallet permanently*/
export function getRpcByWallet(walletName: string) {
  if (REEF_KNOT_CONFIG.STAND_CONFIG.networkConfig.chainId === 1)
    return NETWORKS_CONFIG.Mainnet.ETHEREUM.rpcUrl;
  if (!WALLETS.get(walletName).canUseAnyRpc) return 'https://1rpc.io/holesky';
  return `https://lb.drpc.org/ogrpc?network=holesky&dkey=${ENV_CONFIG.RPC_URL_KEY}`;
}
