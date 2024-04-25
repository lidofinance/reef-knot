import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi } from '@wagmi/core';
import { injected } from 'wagmi/connectors';
import WalletIcon from './icons/phantom.svg';

declare module '@wagmi/core' {
  interface Ethereum {
    isPhantom?: true;
  }
}

declare global {
  interface Window {
    phantom?: { ethereum?: EthereumTypeWagmi };
  }
}

export const id = 'phantom';
export const name = 'Phantom';

const getPhantomConnector = () =>
  injected({
    target: () => ({
      id,
      name,
      provider: () =>
        globalThis.window?.phantom?.ethereum || globalThis.window?.ethereum,
    }),
  });

export const Phantom: WalletAdapterType = () => ({
  walletName: 'Phantom',
  walletId: 'phantom',
  icon: {
    light: WalletIcon,
    dark: WalletIcon,
  },
  detector: () =>
    !!globalThis.window?.phantom?.ethereum?.isPhantom ||
    !!globalThis.window?.ethereum?.isPhantom,
  downloadURLs: {
    default: 'https://phantom.app/download',
  },
  createConnectorFn: getPhantomConnector(),
});
