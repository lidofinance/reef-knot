import { NetworkConfig } from '@lidofinance/wallets-testing-wallets';
import { NETWORKS_CONFIG } from '@lidofinance/wallets-testing-wallets';
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
  holeskyTestnet: 'holesky-testnet',
  hoodiTestnet: 'hoodi-testnet',
  mainnet: 'mainnet',
};

export const STAND_LINK = {
  stand: 'https://lidofinance.github.io/reef-knot/',
  localhost: 'http://localhost:3000/',
};

export const STAND_CONFIGS = new Map<string, StandConfig>([
  [
    STAND_ENV.holeskyTestnet,
    {
      networkConfig: {
        ...NETWORKS_CONFIG.testnet.ETHEREUM_HOLESKY,
        rpcUrl: formatDrpc('holesky'),
        chainName: 'Holesky',
      },
      contracts: {
        stake: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034',
        wrap: '0x8d09a4502Cc8Cf1547aD300E066060D043f6982D',
        withdraw: '0xc7cc160b58F8Bb0baC94b80847E2CF2800565C50',
      },
    },
  ],
  [
    STAND_ENV.hoodiTestnet,
    {
      networkConfig: {
        ...NETWORKS_CONFIG.testnet.ETHEREUM_HOODI,
        rpcUrl: formatDrpc('hoodi'),
        chainName: 'Hoodi',
      },
      contracts: {
        stake: '0x3508A952176b3c15387C97BE809eaffB1982176a',
        wrap: '0x7E99eE3C66636DE415D2d7C880938F2f40f94De4',
        withdraw: '0xfe56573178f1bcdf53F01A6E9977670dcBBD9186',
      },
    },
  ],
  [
    STAND_ENV.mainnet,
    {
      networkConfig: NETWORKS_CONFIG.mainnet.ETHEREUM,
      contracts: {
        stake: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
        wrap: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
        withdraw: '0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1',
      },
    },
  ],
]);

function formatDrpc(chainName: string): string {
  return `https://lb.drpc.org/ogrpc?network=${chainName}&dkey=${ENV_CONFIG.RPC_URL_KEY}`;
}
