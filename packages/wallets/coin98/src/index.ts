import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import WalletIcon from './icons/coin98.svg';

declare module '@wagmi/core' {
  interface Ethereum {
    isCoin98?: true;
  }
}

declare global {
  interface Window {
    coin98?: {
      provider: EthereumTypeWagmi;
    };
  }
}

export const Coin98: WalletAdapterType = ({ chains }) => ({
  walletName: 'Coin98',
  walletId: 'coin98',
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.coin98?.provider ||
    !!globalThis.window?.ethereum?.isCoin98,
  downloadURLs: {
    default: 'https://coin98.com',
  },
  connector: new InjectedConnector({
    chains,
    options: {
      name: 'Coin98',
      getProvider: () =>
        globalThis.window?.coin98?.provider || globalThis.window?.ethereum,
    },
  }),
});
