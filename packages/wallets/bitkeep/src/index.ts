import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import WalletIcon from './icons/bitkeep.svg';

declare global {
  interface Window {
    bitkeep?: {
      ethereum?: EthereumTypeWagmi;
    };
  }
}

export const BitKeep: WalletAdapterType = ({ chains }) => ({
  walletName: 'BitKeep',
  walletId: 'bitkeep',
  icon: WalletIcon,
  detector: () => !!globalThis.window?.bitkeep?.ethereum,
  downloadURLs: {
    default: 'https://bitkeep.com/en/download/',
  },
  connector: new InjectedConnector({
    chains,
    options: {
      name: 'BitKeep',
      getProvider: () => globalThis.window?.bitkeep?.ethereum,
    },
  }),
});
