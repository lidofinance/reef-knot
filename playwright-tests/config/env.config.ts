export interface StandConfig {
  chainId: number;
  tokenSymbol: string;
  chainName: string;
  rpcUrl: string;
  scan: string;
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
      chainId: 17000,
      tokenSymbol: 'ETH',
      chainName: 'Holesky',
      scan: 'https://holesky.etherscan.io/',
      contracts: {
        stake: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034',
        wrap: '0x8d09a4502Cc8Cf1547aD300E066060D043f6982D',
        withdraw: '0xc7cc160b58F8Bb0baC94b80847E2CF2800565C50',
      },
      rpcUrl: `https://lb.drpc.org/ogrpc?network=holesky&dkey=${process.env.RPC_URL_KEY}`,
    },
  ],
  [
    STAND_ENV.mainnet,
    {
      chainId: 1,
      tokenSymbol: 'ETH',
      chainName: 'Ethereum Mainnet',
      scan: 'https://etherscan.io/',
      contracts: {
        stake: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
        wrap: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
        withdraw: '0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1',
      },
      rpcUrl: `https://lb.drpc.org/ogrpc?network=ethereum&dkey=${process.env.RPC_URL_KEY}`,
    },
  ],
]);
