import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import WalletIcon from './icons/bitget.svg';

declare global {
  interface Window {
    bitkeep?: {
      ethereum?: EthereumTypeWagmi;
    };
  }
}

export const Bitget: WalletAdapterType = ({ chains }) => ({
  walletName: 'Bitget',
  // The current metrics implementation is based on walletId,
  // using previous "bitkeep" name here not to break metrics
  walletId: 'bitkeep',
  icon: WalletIcon,
  detector: () => !!globalThis.window?.bitkeep?.ethereum,
  downloadURLs: {
    default: 'https://web3.bitget.com/',
  },
  connector: new InjectedConnector({
    chains,
    options: {
      name: 'Bitget',
      getProvider: () => globalThis.window?.bitkeep?.ethereum,
    },
  }),
});

// BitKeep is the previous name of the wallet.
// Exporting the wallet adapter with the old name for compatibility.
export const BitKeep = Bitget;
