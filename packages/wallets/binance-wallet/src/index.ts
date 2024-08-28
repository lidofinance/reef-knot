import { WalletAdapterType } from '@reef-knot/types';
import { WalletIcon } from './icons/index.js';
import { getWagmiConnectorV2 } from '@binance/w3w-wagmi-connector-v2';
import { isInBinance, getDeepLink } from '@binance/w3w-utils';

export const id = 'binanceWallet';
export const name = 'Binance Web3 Wallet';

const deeplinkDAppUrl = globalThis.window
  ? globalThis.window.location.origin + globalThis.window.location.pathname
  : '';

export const BinanceWeb3Wallet: WalletAdapterType = ({ defaultChain }) => {
  const binanceWalletConnector = getWagmiConnectorV2();

  const deeplink =
    typeof window !== 'undefined'
      ? getDeepLink(deeplinkDAppUrl, defaultChain.id).http
      : undefined;

  return {
    walletId: id,
    walletName: name,
    type: binanceWalletConnector.type,
    icon: WalletIcon,
    createConnectorFn: binanceWalletConnector({ chainId: defaultChain.id }),
    detector: isInBinance,
    deeplink,
  };
};
