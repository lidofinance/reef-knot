import { WalletAdapterType } from '@reef-knot/types';
import { WalletIcon } from './icons/index.js';
import { injected } from 'wagmi/connectors';

declare module '@wagmi/core' {
  interface Ethereum {
    isTrust?: true;
  }
}

export const id = 'trust';
export const name = 'Trust';

export const getTrustConnector = () =>
  injected({
    target: () => ({
      id,
      name,
      provider: () => globalThis.window?.ethereum,
    }),
  });

const deeplinkDAppUrl = globalThis.window
  ? globalThis.window.location.host + globalThis.window.location.pathname
  : '';

export const Trust: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  detector: () => !!globalThis.window?.ethereum?.isTrust,
  downloadURLs: {
    default: 'https://trustwallet.com/browser-extension',
  },
  deeplink: `https://link.trustwallet.com/open_url?coin_id=60&url=${deeplinkDAppUrl}`,
  createConnectorFn: getTrustConnector(),
});
