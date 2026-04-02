import { EIP1193Provider } from 'viem';
import { injected } from 'wagmi/connectors';
import { WalletAdapterType } from '@reef-knot/types';
import { WalletIcon } from './icons/index.js';

declare global {
  interface Window {
    ethereum?: EIP1193Provider & {
      isImToken?: true;
    };
  }
}

export const id = 'imToken';
export const name = 'imToken';
const currentHref = globalThis.window
  ? encodeURIComponent(globalThis.window.location.href)
  : '';

const getImTokenConnector = () =>
  injected({
    target: () => ({
      id,
      name,
      provider: () => globalThis.window?.ethereum,
    }),
  });

export const ImToken: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  icon: WalletIcon,
  detector: () => !!globalThis.window?.ethereum?.isImToken,
  deeplink: `imtokenv2://navigate/DappView?url=${currentHref}`,
  downloadURLs: {
    default: 'https://token.im/download',
  },
  createConnectorFn: getImTokenConnector(),
});
