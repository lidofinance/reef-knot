import type { WalletAdapterType } from '@reef-knot/types';
import { injected } from 'wagmi/connectors';
import WalletIcon from './icons/okx.svg';
import WalletIconInverted from './icons/okx-inverted.svg';
import {
  getTargetEIP6963,
  isProviderExistsEIP6963,
} from '@reef-knot/wallets-helpers';

export const id = 'okx';
export const name = 'OKX Wallet';
export const rdns = 'com.okex.wallet';

const deeplinkDAppUrl = globalThis.window
  ? globalThis.window.location.host + globalThis.window.location.pathname
  : '';
const deeplink = 'okx://wallet/dapp/url?dappUrl=' + deeplinkDAppUrl;
const urlWithDeeplink = 'https://www.okx.com/download?deeplink=' + deeplink;

export const Okx: WalletAdapterType = ({ providersStore }) => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  icon: {
    light: WalletIcon,
    dark: WalletIconInverted,
  },
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  downloadURLs: {
    default: 'https://www.okx.com/download',
  },
  deeplink: urlWithDeeplink,
  createConnectorFn: injected({
    target: () => getTargetEIP6963(providersStore, rdns),
  }),
});
