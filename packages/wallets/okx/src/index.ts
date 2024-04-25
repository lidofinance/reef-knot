import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi } from '@wagmi/core';
import { Chain } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
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

export const id = 'okx';
export const name = 'OKX Wallet';

const deeplinkDAppUrl = globalThis.window
  ? globalThis.window.location.host + globalThis.window.location.pathname
  : '';
const deeplink = 'okx://wallet/dapp/url?dappUrl=' + deeplinkDAppUrl;
const urlWithDeeplink = 'https://www.okx.com/download?deeplink=' + deeplink;

const getOkxConnector = () =>
  injected({
    target: () => ({
      id,
      name,
      provider: () =>
        globalThis.window?.okxwallet || globalThis.window?.ethereum,
    }),
  });

export const Okx: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
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
  deeplink: urlWithDeeplink,
  createConnectorFn: getOkxConnector(),
});
