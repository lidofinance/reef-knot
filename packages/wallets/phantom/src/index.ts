import { injected } from 'wagmi/connectors';
import type { WalletAdapterType } from '@reef-knot/types';
import {
  getTargetEIP6963,
  isProviderExistsEIP6963,
} from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/phantom.svg';

export const id = 'phantom';
export const name = 'Phantom';
export const rdns = 'app.phantom';

export const Phantom: WalletAdapterType = ({ providersStore }) => ({
  walletName: 'Phantom',
  walletId: 'phantom',
  type: injected.type,
  icon: {
    light: WalletIcon,
    dark: WalletIcon,
  },
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  downloadURLs: {
    default: 'https://phantom.app/download',
  },
  createConnectorFn: injected({
    target: getTargetEIP6963(providersStore, rdns),
  }),
});
