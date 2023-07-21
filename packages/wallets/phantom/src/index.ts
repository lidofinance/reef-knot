import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
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

export const Phantom: WalletAdapterType = ({ chains }) => ({
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
  connector: new InjectedConnector({
    chains,
    options: {
      name: 'Phantom',
      getProvider: () =>
        globalThis.window?.phantom?.ethereum || globalThis.window?.ethereum,
    },
  }),
});
