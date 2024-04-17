import { WalletAdapterType } from '@reef-knot/types';
import { WalletIcon } from './icons/index.js';
import { Chain } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';

declare module '@wagmi/core' {
  interface Ethereum {
    isTrust?: true;
  }
}

export const id = 'trust';
export const name = 'Trust';

export class TrustConnector extends InjectedConnector {
  readonly id = id;
  readonly name = name;
  constructor(chains: Chain[]) {
    super({
      chains,
      options: {
        getProvider: () => globalThis.window?.ethereum,
      },
    });
  }
}

const deeplinkDAppUrl = globalThis.window
  ? globalThis.window.location.host + globalThis.window.location.pathname
  : '';

export const Trust: WalletAdapterType = ({ chains }) => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  detector: () => !!globalThis.window?.ethereum?.isTrust,
  downloadURLs: {
    default: 'https://trustwallet.com/browser-extension',
  },
  deeplink: `https://link.trustwallet.com/open_url?coin_id=60&url=${deeplinkDAppUrl}`,
  connector: new TrustConnector(chains),
});
