import { WalletAdapterType } from '@reef-knot/types';
import { coinbaseWallet } from 'wagmi/connectors';
import { WalletIcon } from './icons/index.js';

export const id = 'coinbaseSmartWallet';
export const name = 'Coinbase Smart Wallet';

export const getCoinbaseSmartWalletConnector = () =>
  coinbaseWallet({
    preference: 'smartWalletOnly',
    appName: globalThis.window?.location?.hostname,
  });

export const CoinbaseSmartWallet: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
  type: coinbaseWallet.type,
  icon: WalletIcon,
  detector: () => !!globalThis.window?.ethereum?.isCoinbaseWallet,
  createConnectorFn: getCoinbaseSmartWalletConnector(),
});
