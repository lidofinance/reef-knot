import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi, Chain } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletIcon } from './icons/index.js';

declare global {
  interface Window {
    braveEthereum?: EthereumTypeWagmi;
  }
}

export class BraveConnector extends InjectedConnector {
  readonly id = 'brave';
  readonly name = 'Brave';
  constructor(chains: Chain[]) {
    super({
      chains,
      options: {
        getProvider: () =>
          globalThis.window?.braveEthereum || globalThis.window?.ethereum,
      },
    });
  }
}

export const Brave: WalletAdapterType = ({ chains }) => ({
  walletName: 'Brave',
  walletId: 'brave',
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.braveEthereum?.isBraveWallet ||
    !!globalThis.window?.ethereum?.isBraveWallet,
  downloadURLs: {
    default: 'https://brave.com/wallet/',
  },
  connector: new BraveConnector(chains),
});
