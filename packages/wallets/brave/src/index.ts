import { WalletAdapterType } from '@reef-knot/types';
import { injected } from 'wagmi/connectors';
import { WalletIcon } from './icons/index.js';
import type { EIP1193Provider } from 'viem';

declare global {
  interface Window {
    braveEthereum?: EIP1193Provider & {
      isBraveWallet: boolean;
    };
  }
}

export const id = 'brave';
export const name = 'Brave';

const getBraveConnector = () =>
  injected({
    target: () => ({
      id,
      name,
      provider: () =>
        globalThis.window?.braveEthereum || globalThis.window?.ethereum,
    }),
  });

export const Brave: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.braveEthereum?.isBraveWallet ||
    !!globalThis.window?.ethereum?.isBraveWallet,
  downloadURLs: {
    default: 'https://brave.com/wallet/',
  },
  createConnectorFn: getBraveConnector(),
});
