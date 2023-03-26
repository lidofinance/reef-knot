import { WalletAdapterType } from '@reef-knot/core-react';
import { Ethereum } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import WalletIcon from './icons/exodus.svg';

declare global {
  interface Window {
    // @ts-expect-error Subsequent property declarations must have the same type
    ethereum?: Ethereum & { isExodus?: boolean };
    exodus?: { ethereum?: Ethereum & { isExodus?: boolean } };
  }
}

export const Exodus: WalletAdapterType = () => ({
  walletName: 'Exodus',
  walletId: 'exodus',
  icons: {
    light: WalletIcon,
    dark: WalletIcon,
  },
  detector: () =>
    typeof window !== 'undefined'
      ? !!window.exodus?.ethereum?.isExodus || !!window.ethereum?.isExodus
      : false,
  downloadURLs: {
    default: 'https://www.exodus.com/download/',
  },
  connector: new InjectedConnector({
    options: {
      name: 'Exodus',
      getProvider: () =>
        typeof window !== 'undefined'
          ? window.exodus?.ethereum || window.ethereum
          : undefined,
    },
  }),
});
