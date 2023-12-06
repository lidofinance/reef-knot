import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi, Chain } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import WalletIcon from './icons/okx.svg';
import WalletIconInverted from './icons/okx-inverted.svg';

declare module '@wagmi/core' {
  interface Ethereum {
    isOkxWallet?: true;
  }
}

declare global {
  interface Window {
    okxwallet?: EthereumTypeWagmi;
  }
}

export class OkxConnector extends InjectedConnector {
  readonly id = 'okx';
  readonly name = 'OKX Wallet';
  constructor(chains: Chain[]) {
    super({
      chains,
      options: {
        getProvider: () =>
          globalThis.window?.okxwallet || globalThis.window?.ethereum,
      },
    });
  }
}

export const Okx: WalletAdapterType = ({ chains }) => ({
  walletName: 'OKX Wallet',
  walletId: 'okx',
  icon: {
    light: WalletIcon,
    dark: WalletIconInverted,
  },
  detector: () =>
    !!globalThis.window?.okxwallet?.isOkxWallet ||
    !!globalThis.window?.ethereum?.isOkxWallet,
  downloadURLs: {
    default: 'https://www.okx.com/download',
  },
  connector: new OkxConnector(chains),
});
