import { WalletAdapterType } from '@reef-knot/types';
import { injected } from 'wagmi/connectors';
import { WalletIcon } from './icons/index.js';
import type { EIP1193Provider } from 'viem';

declare global {
  interface Window {
    xfi?: {
      ethereum: EIP1193Provider & { isXDEFI?: true };
    };
  }
}

export const id = 'xdefi';
export const name = 'XDEFI';

export const getXdefiConnector = () =>
  injected({
    target: () => ({
      id,
      name,
      provider: () =>
        globalThis.window?.xfi?.ethereum || globalThis.window?.ethereum,
    }),
  });

export const Xdefi: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.xfi?.ethereum ||
    !!globalThis.window?.ethereum?.isXDEFI,
  downloadURLs: {
    default: 'https://www.xdefi.io/',
  },
  createConnectorFn: getXdefiConnector(),
});
