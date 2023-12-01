import { WalletAdapterType } from '@reef-knot/types';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletIcon } from './icons/index.js';

export const Coinbase: WalletAdapterType = ({ chains }) => ({
  walletName: 'Coinbase',
  walletId: 'coinbase',
  icon: WalletIcon,
  detector: () => !!globalThis.window?.ethereum?.isCoinbaseWallet,
  connector: new CoinbaseWalletConnector({
    chains,
    options: {
      appName: globalThis.window?.location?.hostname,
    },
  }),
});
