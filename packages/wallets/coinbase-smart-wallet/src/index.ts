import { WalletAdapterType } from '@reef-knot/types';
import { coinbaseWallet } from 'wagmi/connectors';
import { isProviderExistsEIP6963 } from '@reef-knot/wallets-helpers';
import { WalletIcon } from './icons/index.js';

export const id = 'coinbaseSmartWallet';
export const name = 'Coinbase Smart Wallet';
export const rdns = 'com.coinbase.wallet';

type ConfigType = Parameters<ReturnType<typeof coinbaseWallet>>[0];

export const getCoinbaseSmartWalletConnector = (config: ConfigType) => {
  const coinbaseCreateConnectorFn = coinbaseWallet({
    preference: 'smartWalletOnly',
    appName: globalThis.window?.location?.hostname,
  });

  const coinbaseConnector = coinbaseCreateConnectorFn(config);

  return {
    ...coinbaseConnector,
    name,
  };
};

export const CoinbaseSmartWallet: WalletAdapterType = ({ providersStore }) => ({
  walletName: name,
  walletId: id,
  type: coinbaseWallet.type,
  icon: WalletIcon,
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  createConnectorFn: getCoinbaseSmartWalletConnector,
});
