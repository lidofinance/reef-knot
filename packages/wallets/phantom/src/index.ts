import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import WalletIcon from './icons/phantom.svg';

declare global {
  interface Window {
    // @ts-expect-error Subsequent property declarations must have the same type
    ethereum?: Ethereum & { isPhantom?: boolean };
    phantom?: { ethereum?: Ethereum & { isPhantom?: boolean } };
  }
}

export const Phantom: WalletAdapterType = () => ({
  walletName: 'Phantom',
  walletId: 'phantom',
  icons: {
    light: WalletIcon,
    dark: WalletIcon,
  },
  detector: () =>
    typeof window !== 'undefined'
      ? !!window.phantom?.ethereum?.isPhantom || !!window.ethereum?.isPhantom
      : false,
  downloadURLs: {
    default: 'https://phantom.app/download',
  },
  connector: new InjectedConnector({
    options: {
      name: 'Phantom',
      getProvider: () =>
        typeof window !== 'undefined'
          ? window.phantom?.ethereum || window.ethereum
          : undefined,
    },
  }),
});
