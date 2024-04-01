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

export const id = 'xdefi';
export const name = 'XDEFI';

export class XdefiConnector extends InjectedConnector {
  readonly id = id;
  readonly name = name;
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
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.xfi?.ethereum ||
    !!globalThis.window?.ethereum?.isXDEFI,
  downloadURLs: {
    default: 'https://www.xdefi.io/',
  },
  connector: new XdefiConnector(chains),
});
