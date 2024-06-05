import { injected } from 'wagmi/connectors';
import type { WalletAdapterType } from '@reef-knot/types';
import {
  getTargetEIP6963,
  isProviderExistsEIP6963,
} from '@reef-knot/wallets-helpers';
import { WalletIcon } from './icons/index.js';

export const id = 'trust';
export const name = 'Trust';
export const rdns = 'com.trustwallet.app';

const deeplinkDAppUrl = globalThis.window
  ? globalThis.window.location.host + globalThis.window.location.pathname
  : '';

export const Trust: WalletAdapterType = ({ providersStore }) => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  icon: WalletIcon,
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  downloadURLs: {
    default: 'https://trustwallet.com/browser-extension',
  },
  deeplink: `https://link.trustwallet.com/open_url?coin_id=60&url=${deeplinkDAppUrl}`,
  createConnectorFn: injected({
    target: getTargetEIP6963(providersStore, rdns),
  }),
});
