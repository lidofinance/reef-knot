import { injected } from 'wagmi/connectors';
import type { WalletAdapterType } from '@reef-knot/types';
import {
  getTargetEIP6963,
  isProviderExistsEIP6963,
} from '@reef-knot/wallets-helpers';
import { WalletIcon, WalletIconInverted } from './icons/index.js';

export const id = 'metaMask';
export const name = 'MetaMask';
export const rdns = 'io.metamask';
const currentHref = globalThis.window
  ? globalThis.window.location.hostname + globalThis.window.location.pathname // encoding not supported
  : '';

export const MetaMask: WalletAdapterType = ({ providersStore }) => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  icon: {
    light: WalletIcon,
    dark: WalletIconInverted,
  },
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  downloadURLs: {
    default: 'https://metamask.io/download/',
  },
  deeplink: `https://metamask.app.link/dapp/${currentHref}`,
  createConnectorFn: injected({
    target: getTargetEIP6963(providersStore, rdns),
    shimDisconnect: true,
  }),
});
