import { WalletAdapterType } from '@reef-knot/types';
import WalletIcon from './icons/exodus.svg';
import { Ethereum as EthereumTypeWagmi } from '@wagmi/core';
import { injected } from '@wagmi/connectors';

declare module '@wagmi/core' {
  interface Ethereum {
    isExodus?: true;
  }
}

declare global {
  interface Window {
    exodus?: { ethereum?: EthereumTypeWagmi };
  }
}

export const id = 'exodus';
export const name = 'Exodus';

export const getExodusConnector = () =>
  injected({
    target: () => ({
      id,
      name,
      provider: () =>
        globalThis.window?.exodus?.ethereum || globalThis.window?.ethereum,
    }),
  });

export const Exodus: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.exodus || !!globalThis.window?.ethereum?.isExodus,
  downloadURLs: {
    default: 'https://www.exodus.com/download/',
  },
  createConnectorFn: getExodusConnector(),
});
