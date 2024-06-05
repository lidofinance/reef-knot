import { coinbaseWallet } from 'wagmi/connectors';
import type { WalletAdapterType } from '@reef-knot/types';
import { isProviderExistsEIP6963 } from '@reef-knot/wallets-helpers';
import { WalletIcon } from './icons/index.js';

export const id = 'coinbase';
export const name = 'Coinbase';
export const rdns = 'com.coinbase.wallet';

export const Coinbase: WalletAdapterType = ({ providersStore }) => ({
  walletName: name,
  walletId: id,
  type: coinbaseWallet.type,
  icon: WalletIcon,
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  createConnectorFn: coinbaseWallet({
    appName: globalThis.window?.location?.hostname,
  }),
});
