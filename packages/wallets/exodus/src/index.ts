import { WalletAdapterType } from '@reef-knot/types';
import { injected } from 'wagmi/connectors';
import WalletIcon from './icons/exodus.svg';
import type { EIP1193Provider } from 'viem';

declare global {
  interface Window {
    exodus?: EIP1193Provider & {
      ethereum?: {
        isExodus?: true;
      };
    };
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
  type: injected.type,
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.exodus || !!globalThis.window?.ethereum?.isExodus,
  downloadURLs: {
    default: 'https://www.exodus.com/download/',
  },
  createConnectorFn: getExodusConnector(),
});
