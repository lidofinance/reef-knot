import type { WalletAdapterType } from '@reef-knot/types';
import { injected } from 'wagmi/connectors';
import {
  getTargetEIP6963,
  isProviderExistsEIP6963,
} from '@reef-knot/wallets-helpers';
import { WalletIcon } from './icons/index.js';

export const id = 'ctrl';
export const name = 'Ctrl';
export const rdns = 'io.xdefi';

export const Ctrl: WalletAdapterType = ({ providersStore }) => ({
  walletId: id,
  walletName: name,
  type: injected.type,
  icon: WalletIcon,
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  downloadURLs: {
    default: 'https://ctrl.xyz/',
  },
  createConnectorFn: injected({
    target: () => getTargetEIP6963(providersStore, rdns),
  }),
});
