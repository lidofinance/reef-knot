import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi } from '@wagmi/core';
import { injected } from 'wagmi/connectors';
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

// The current metrics implementation is based on walletId,
// using previous "tally" name here not to break metrics
export const id = 'tally';
export const name = 'Taho';

export const getTahoConnector = () =>
  injected({
    target: () => ({
      id,
      name,
      provider: () => globalThis.window?.tally || globalThis.window?.ethereum,
    }),
  });

// The wallet was named "Tally Ho" previously, renamed to "Taho"
export const Taho: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.tally || !!globalThis.window?.ethereum?.isTally,
  downloadURLs: {
    default: 'https://taho.xyz/download/',
  },
  createConnectorFn: getTahoConnector(),
});
