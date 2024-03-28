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

export const Trust: WalletAdapterType = ({ chains }) => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  detector: () => !!globalThis.window?.ethereum?.isTrust,
  downloadURLs: {
    default: 'https://trustwallet.com/browser-extension',
  },
  connector: new TrustConnector(chains),
});
