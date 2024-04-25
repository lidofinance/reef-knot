import { WalletAdapterType } from '@reef-knot/types';
import { WalletIcon } from './icons/index.js';
import { injected } from 'wagmi/connectors';

declare module '@wagmi/core' {
  interface Ethereum {
    isImToken?: true;
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
  icon: WalletIcon,
  detector: () => !!globalThis.window?.ethereum?.isImToken,
  deeplink: `imtokenv2://navigate/DappView?url=${currentHref}`,
  downloadURLs: {
    default: 'https://token.im/download',
  },
  createConnectorFn: getImTokenConnector(),
});
