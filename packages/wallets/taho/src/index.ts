import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import WalletIcon from './icons/taho.svg';

declare module '@wagmi/core' {
  interface Ethereum {
    isTally?: true;
  }
}

declare global {
  interface Window {
    tally?: EthereumTypeWagmi;
  }
}

// The wallet was named "Tally Ho" previously, renamed to "Taho"
export const Taho: WalletAdapterType = ({ chains }) => ({
  walletName: 'Taho',
  // The current metrics implementation is based on walletId,
  // using previous "tally" name here not to break metrics
  walletId: 'tally',
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.tally || !!globalThis.window?.ethereum?.isTally,
  downloadURLs: {
    default: 'https://taho.xyz/download/',
  },
  connector: new InjectedConnector({
    chains,
    options: {
      name: 'Taho',
      getProvider: () =>
        globalThis.window?.tally || globalThis.window?.ethereum,
    },
  }),
});
