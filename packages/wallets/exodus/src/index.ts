import { injected } from 'wagmi/connectors';
import type { WalletAdapterType } from '@reef-knot/types';
import {
  getTargetEIP6963,
  isProviderExistsEIP6963,
} from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/exodus.svg';

export const id = 'exodus';
export const name = 'Exodus';
export const rdns = 'com.exodus.web3-wallet';

export const Exodus: WalletAdapterType = ({ providersStore }) => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  icon: WalletIcon,
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  downloadURLs: {
    default: 'https://www.exodus.com/download/',
  },
  createConnectorFn: injected({
    target: getTargetEIP6963(providersStore, rdns),
  }),
});
