import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletIcon } from './icons/index.js';

declare global {
  interface Window {
    braveEthereum?: EthereumTypeWagmi;
  }
}

export const Brave: WalletAdapterType = ({ chains }) => ({
  walletName: 'Brave',
  walletId: 'brave',
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.braveEthereum?.isBraveWallet ||
    !!globalThis.window?.ethereum?.isBraveWallet,
  downloadURLs: {
    default: 'https://brave.com/wallet/',
  },
  connector: new InjectedConnector({
    chains,
    options: {
      name: 'Brave',
      getProvider: () =>
        globalThis.window?.braveEthereum || globalThis.window?.ethereum,
    },
  }),
});
