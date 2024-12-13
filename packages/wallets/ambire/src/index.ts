import { injected } from 'wagmi/connectors';
import type { WalletAdapterType } from '@reef-knot/types';
import {
  getTargetEIP6963,
  isProviderExistsEIP6963,
} from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/ambire.svg';

export const id = 'ambire';
export const name = 'Ambire';
export const rdns = 'com.ambire.wallet';

export const Ambire: WalletAdapterType = ({ providersStore }) => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  icon: WalletIcon,
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  downloadURLs: {
    default: 'https://www.ambire.com/',
  },
  createConnectorFn: injected({
    target: () => getTargetEIP6963(providersStore, rdns),
  }),
});
