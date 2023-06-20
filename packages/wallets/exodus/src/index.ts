import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import WalletIcon from './icons/exodus.svg';

declare global {
  interface Ethereum extends EthereumTypeWagmi {
    isExodus?: true;
  }
  interface Window {
    exodus?: { ethereum?: Ethereum };
  }
}

export const Exodus: WalletAdapterType = ({ chains }) => ({
  walletName: 'Exodus',
  walletId: 'exodus',
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.exodus || !!globalThis.window?.ethereum?.isExodus,
  downloadURLs: {
    default: 'https://www.exodus.com/download/',
  },
  connector: new InjectedConnector({
    chains,
    options: {
      name: 'Exodus',
      getProvider: () =>
        globalThis.window?.exodus?.ethereum || globalThis.window?.ethereum,
    },
  }),
});
