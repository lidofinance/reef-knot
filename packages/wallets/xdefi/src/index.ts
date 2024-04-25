import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi } from '@wagmi/core';
import { injected } from '@wagmi/connectors';
import { WalletIcon } from './icons/index.js';
declare module '@wagmi/core' {
  interface Ethereum {
    isXDEFI?: true;
  }
}

declare global {
  interface Window {
    xfi?: {
      ethereum: EthereumTypeWagmi;
    };
  }
}

export const id = 'xdefi';
export const name = 'XDEFI';

export const getXdefiConnector = () =>
  injected({
    target: () => ({
      id,
      name,
      provider: () =>
        globalThis.window?.xfi?.ethereum || globalThis.window?.ethereum,
    }),
  });

export const Xdefi: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.xfi?.ethereum ||
    !!globalThis.window?.ethereum?.isXDEFI,
  downloadURLs: {
    default: 'https://www.xdefi.io/',
  },
  createConnectorFn: getXdefiConnector(),
});
