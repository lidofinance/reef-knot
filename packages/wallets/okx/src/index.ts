import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi } from '@wagmi/core';
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

export const Okx: WalletAdapterType = ({ chains }) => ({
  walletName: 'OKX Wallet',
  walletId: 'okx',
  icons: {
    light: WalletIcon,
    dark: WalletIconInverted,
  },
  detector: () =>
    !!globalThis.window?.okxwallet?.isOkxWallet ||
    !!globalThis.window?.ethereum?.isOkxWallet,
  downloadURLs: {
    default: 'https://www.okx.com/download',
  },
  connector: new InjectedConnector({
    chains,
    options: {
      name: 'OKX Wallet',
      getProvider: () =>
        globalThis.window?.okxwallet || globalThis.window?.ethereum,
    },
  }),
});
