import { injected } from 'wagmi/connectors';
import type { WalletAdapterType } from '@reef-knot/types';
import {
  getTargetEIP6963,
  isProviderExistsEIP6963,
} from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/bitget.svg';

export const id = 'bitget';
export const name = 'Bitget';
export const rdns = 'com.bitget.web3';
const currentHref = globalThis.window
  ? encodeURIComponent(globalThis.window.location.href)
  : '';

export const Bitget: WalletAdapterType = ({ providersStore }) => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  icon: WalletIcon,
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  downloadURLs: {
    default: 'https://web3.bitget.com/',
  },
  deeplink: `https://bkcode.vip?action=dapp&url=${currentHref}`,
  createConnectorFn: injected({
    target: getTargetEIP6963(providersStore, rdns),
  }),
});

// BitKeep is the previous name of the wallet.
// Exporting the wallet adapter with the old name for compatibility.
export const BitKeep = Bitget;
