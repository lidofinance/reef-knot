import type { WalletAdapterType } from '@reef-knot/wallets-helpers';
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

// Encode both levels, so the page URL can't add query params to the link.
const currentHref = globalThis.window
  ? encodeURIComponent(globalThis.window.location.href)
  : '';
const deeplink = `okx://wallet/dapp/url?dappUrl=${currentHref}`;
const urlWithDeeplink = `https://www.okx.com/download?deeplink=${encodeURIComponent(deeplink)}`;

export const Okx: WalletAdapterType = ({ providersStore }) => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  rdns,
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
