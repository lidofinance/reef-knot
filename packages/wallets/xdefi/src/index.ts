import { WalletAdapterType } from '@reef-knot/types';
import { Chain, Ethereum as EthereumTypeWagmi } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletIcon } from './icons/index.js';

declare module '@wagmi/core' {
  interface Ethereum {
    isXDEFI?: true;
  }
}

declare global {
  interface Window {
    xfi?: {
      ethereum: EthereumTypeWagmi;
    };
  }
}

export class XdefiConnector extends InjectedConnector {
  readonly id = 'xdefi';
  readonly name = 'XDEFI';
  constructor(chains: Chain[]) {
    super({
      chains,
      options: {
        getProvider: () =>
          globalThis.window?.xfi?.ethereum || globalThis.window?.ethereum,
      },
    });
  }
}

export const Xdefi: WalletAdapterType = ({ chains }) => ({
  walletName: 'XDEFI',
  walletId: 'xdefi',
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.xfi?.ethereum ||
    !!globalThis.window?.ethereum?.isXDEFI,
  downloadURLs: {
    default: 'https://www.xdefi.io/',
  },
  connector: new XdefiConnector(chains),
});
