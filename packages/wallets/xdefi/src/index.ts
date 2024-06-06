import { injected } from '@wagmi/connectors';
import { WalletAdapterType } from '@reef-knot/types';
import {
  getTargetEIP6963,
  isProviderExistsEIP6963,
} from '@reef-knot/wallets-helpers';
import { WalletIcon } from './icons/index.js';

export const rdns = 'io.xdefi';
export const id = 'xdefi';
export const name = 'XDEFI';

export const Xdefi: WalletAdapterType = ({ providersStore }) => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  icon: WalletIcon,
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  downloadURLs: {
    default: 'https://www.xdefi.io/',
  },
  createConnectorFn: injected({
    target: getTargetEIP6963(providersStore, rdns),
  }),
});
