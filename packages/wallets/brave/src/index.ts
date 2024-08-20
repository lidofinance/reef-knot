import { injected } from 'wagmi/connectors';
import { WalletAdapterType } from '@reef-knot/types';
import {
  getTargetEIP6963,
  isProviderExistsEIP6963,
} from '@reef-knot/wallets-helpers';
import { WalletIcon } from './icons/index.js';

export const id = 'brave';
export const name = 'Brave';
export const rdns = 'com.brave.wallet';

export const Brave: WalletAdapterType = ({ providersStore }) => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  icon: WalletIcon,
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  downloadURLs: {
    default: 'https://brave.com/wallet/',
  },
  createConnectorFn: injected({
    target: () => getTargetEIP6963(providersStore, rdns),
  }),
});
