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

export const id = 'okx';
export const name = 'OKX Wallet';

const dappUrl = globalThis.window
  ? encodeURIComponent(globalThis.window.location.href)
  : '';
const encodedDappUrl = encodeURIComponent(dappUrl);
const deeplink = 'okx://wallet/dapp/url?dappUrl=' + encodedDappUrl;
const urlWithDeeplinkEncoded =
  'https://www.okx.com/download?deeplink=' + encodeURIComponent(deeplink);

export class OkxConnector extends InjectedConnector {
  readonly id = id;
  readonly name = name;
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
  deeplink: urlWithDeeplinkEncoded,
  connector: new OkxConnector(chains),
});
