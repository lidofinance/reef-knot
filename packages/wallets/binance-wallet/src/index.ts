import { WalletAdapterType } from '@reef-knot/types';
import { WalletIcon } from './icons/index.js';
import { getWagmiConnectorV2 } from '@binance/w3w-wagmi-connector-v2';

export const id = 'binanceWallet';
export const name = 'Binance Web3 Wallet';

export const BinanceWeb3Wallet: WalletAdapterType = () => {
  const binanceWalletConnector = getWagmiConnectorV2();

  return {
    walletId: id,
    walletName: name,
    type: binanceWalletConnector.type,
    icon: WalletIcon,
    createConnectorFn: binanceWalletConnector(),
  };
};
