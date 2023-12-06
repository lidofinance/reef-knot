import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi, Chain } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import WalletIcon from './icons/coin98.svg';

declare module '@wagmi/core' {
  interface Ethereum {
    isCoin98?: true;
  }
}

declare global {
  interface Window {
    coin98?: {
      provider: EthereumTypeWagmi;
    };
  }
}

export class Coin98Connector extends InjectedConnector {
  readonly id = 'coin98';
  readonly name = 'Coin98';
  constructor(chains: Chain[]) {
    super({
      chains,
      options: {
        getProvider: () =>
          globalThis.window?.coin98?.provider || globalThis.window?.ethereum,
      },
    });
  }
}

export const Coin98: WalletAdapterType = ({ chains }) => ({
  walletName: 'Coin98',
  walletId: 'coin98',
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.coin98?.provider ||
    !!globalThis.window?.ethereum?.isCoin98,
  downloadURLs: {
    default: 'https://coin98.com/wallet',
    ios: 'https://ios.coin98.com',
    android: 'https://android.coin98.com',
  },
  connector: new Coin98Connector(chains),
});
