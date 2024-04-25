import { WalletAdapterType } from '@reef-knot/types';
import { Ethereum as EthereumTypeWagmi } from '@wagmi/core';
import { injected } from 'wagmi/connectors';
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

export const id = 'coin98';
export const name = 'Coin98';

const getCoin98 = () =>
  injected({
    target: () => ({
      id,
      name,
      provider: () =>
        globalThis.window?.coin98?.provider || globalThis.window?.ethereum,
    }),
  });

// At the moment of writing, Coin98 only supports passing host as dApp link
const deeplinkDAppUrl = globalThis.window
  ? globalThis.window.location.host
  : '';

export const Coin98: WalletAdapterType = ({ defaultChain }) => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  detector: () =>
    !!globalThis.window?.coin98?.provider ||
    !!globalThis.window?.ethereum?.isCoin98,
  deeplink: `https://coin98.com/dapp/${deeplinkDAppUrl}/${defaultChain.id}`,
  downloadURLs: {
    default: 'https://coin98.com/wallet',
    ios: 'https://ios.coin98.com',
    android: 'https://android.coin98.com',
  },
  createConnectorFn: getCoin98(),
});
