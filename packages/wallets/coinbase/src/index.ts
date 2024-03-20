import { WalletAdapterType } from '@reef-knot/types';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletIcon } from './icons/index.js';

export const id = 'coinbase';
export const name = 'Coinbase';

export const Coinbase: WalletAdapterType = ({ chains }) => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  detector: () => !!globalThis.window?.ethereum?.isCoinbaseWallet,
  connector: new CoinbaseWalletConnector({
    chains,
    options: {
      appName: globalThis.window?.location?.hostname,
    },
  }),
});
