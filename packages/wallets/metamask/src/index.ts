import { injected, metaMask } from 'wagmi/connectors';
import type { WalletAdapterType } from '@reef-knot/types';
import { isProviderExistsEIP6963 } from '@reef-knot/wallets-helpers';
import { WalletIcon, WalletIconInverted } from './icons/index.js';

export const id = 'metaMask';
export const name = 'MetaMask';
export const rdns = 'io.metamask';

export const MetaMask: WalletAdapterType = ({ providersStore }) => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  icon: {
    light: WalletIcon,
    dark: WalletIconInverted,
  },
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  createConnectorFn: metaMask(),
});
