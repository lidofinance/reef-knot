import { injected } from 'wagmi/connectors';
import type { WalletAdapterType } from '@reef-knot/types';
import {
  getTargetEIP6963,
  isProviderExistsEIP6963,
} from '@reef-knot/wallets-helpers';
import WalletIcon from './icons/coin98.svg';

export const id = 'coin98';
export const name = 'Coin98';
export const rdns = 'coin98.com';

// At the moment of writing, Coin98 only supports passing host as dApp link
const deeplinkDAppUrl = globalThis.window
  ? globalThis.window.location.host
  : '';

export const Coin98: WalletAdapterType = ({
  defaultChain,
  providersStore,
}) => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  icon: WalletIcon,
  detector: () => isProviderExistsEIP6963(providersStore, rdns),
  deeplink: `https://coin98.com/dapp/${deeplinkDAppUrl}/${defaultChain.id}`,
  downloadURLs: {
    default: 'https://coin98.com/wallet',
    ios: 'https://ios.coin98.com',
    android: 'https://android.coin98.com',
  },
  createConnectorFn: injected({
    target: getTargetEIP6963(providersStore, rdns),
  }),
});
