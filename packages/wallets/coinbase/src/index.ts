import { WalletAdapterType } from '@reef-knot/types';
import { coinbaseWallet } from 'wagmi/connectors';
import { WalletIcon } from './icons/index.js';

export const id = 'coinbase';
export const name = 'Coinbase';

export const getCoinbaseConnector = () =>
  coinbaseWallet({
    appName: globalThis.window?.location?.hostname,
  });

export const Coinbase: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  detector: () => !!globalThis.window?.ethereum?.isCoinbaseWallet,
  createConnectorFn: getCoinbaseConnector(),
});
