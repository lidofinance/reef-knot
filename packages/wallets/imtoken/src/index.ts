import { WalletAdapterType } from '@reef-knot/types';
import { WalletIcon } from './icons/index.js';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Chain } from '@wagmi/core';

declare module '@wagmi/core' {
  interface Ethereum {
    isImToken?: true;
  }
}

export class ImTokenConnector extends InjectedConnector {
  readonly id = 'imToken';
  readonly name = 'imToken';
  constructor(chains: Chain[]) {
    super({
      chains,
      options: {
        getProvider: () => globalThis.window?.ethereum,
      },
    });
  }
}

export const ImToken: WalletAdapterType = ({ chains }) => ({
  walletName: 'imToken',
  walletId: 'imToken',
  icon: WalletIcon,
  detector: () => !!globalThis.window?.ethereum?.isImToken,
  downloadURLs: {
    default: 'https://token.im/download',
  },
  connector: new ImTokenConnector(chains),
});
