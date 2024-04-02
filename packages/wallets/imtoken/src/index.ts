import { WalletAdapterType } from '@reef-knot/types';
import { WalletIcon } from './icons/index.js';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Chain } from '@wagmi/core';

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

export class ImTokenConnector extends InjectedConnector {
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

export const ImToken: WalletAdapterType = ({ chains }) => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  detector: () => !!globalThis.window?.ethereum?.isImToken,
  deeplink: `imtokenv2://navigate/DappView?url=${currentHref}`,
  downloadURLs: {
    default: 'https://token.im/download',
  },
  connector: new ImTokenConnector(chains),
});
