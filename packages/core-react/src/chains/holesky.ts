import { Chain } from 'wagmi';

// wagmi v1.x already provides this chain (it takes it from viem and re-exports)
// But, because we use wagmi v0.x, we have to define the chain like this.
// Can be removed after updating wagmi to v1.x

export const holesky = {
  id: 17000,
  network: 'holesky',
  name: 'Holesky',
  nativeCurrency: { name: 'Holesky Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.holesky.ethpandaops.io'],
    },
    public: {
      http: ['https://rpc.holesky.ethpandaops.io'],
    },
  },
  contracts: {},
  testnet: true,
} as const satisfies Chain;
