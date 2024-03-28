import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi, Chain } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletIcon } from './icons/index.js';

declare global {
  interface Window {
    braveEthereum?: EthereumTypeWagmi;
  }
}

export const id = 'brave';
export const name = 'Brave';

export class BraveConnector extends InjectedConnector {
  readonly id = id;
  readonly name = name;
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
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.braveEthereum?.isBraveWallet ||
    !!globalThis.window?.ethereum?.isBraveWallet,
  downloadURLs: {
    default: 'https://brave.com/wallet/',
  },
  connector: new BraveConnector(chains),
});
