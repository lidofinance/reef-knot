import { WalletAdapterType } from '@reef-knot/types';
import WalletIcon from './icons/exodus.svg';
import { Ethereum as EthereumTypeWagmi, Chain } from '@wagmi/core';
import { InjectedConnector } from '@wagmi/connectors/injected';

declare global {
  interface Ethereum extends EthereumTypeWagmi {
    isExodus?: true;
  }
  interface Window {
    exodus?: { ethereum?: Ethereum };
  }
}

export class ExodusConnector extends InjectedConnector {
  readonly id = 'exodus';
  readonly name = 'Exodus';
  constructor(chains: Chain[]) {
    super({
      chains,
      options: {
        getProvider: () =>
          globalThis.window?.exodus?.ethereum || globalThis.window?.ethereum,
      },
    });
  }
}

export const Exodus: WalletAdapterType = ({ chains }) => ({
  walletName: 'Exodus',
  walletId: 'exodus',
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.exodus || !!globalThis.window?.ethereum?.isExodus,
  downloadURLs: {
    default: 'https://www.exodus.com/download/',
  },
  connector: new ExodusConnector(chains),
});
