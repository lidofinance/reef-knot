import { WalletAdapterType } from '@reef-knot/types';
import { WalletIcon } from './icons/index.js';
import { Chain } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';

declare module '@wagmi/core' {
  interface Ethereum {
    isTrust?: true;
  }
}

export class TrustConnector extends InjectedConnector {
  readonly id = 'trust';
  readonly name = 'Trust';
  constructor(chains: Chain[]) {
    super({
      chains,
      options: {
        getProvider: () => globalThis.window?.ethereum,
      },
    });
  }
}

export const Trust: WalletAdapterType = ({ chains }) => ({
  walletName: 'Trust',
  walletId: 'trust',
  icon: WalletIcon,
  detector: () => !!globalThis.window?.ethereum?.isTrust,
  downloadURLs: {
    default: 'https://trustwallet.com/browser-extension',
  },
  connector: new TrustConnector(chains),
});
