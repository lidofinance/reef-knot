import { WalletAdapterType } from '@reef-knot/types';
import { injected } from 'wagmi/connectors';
import WalletIcon from './icons/bitget.svg';
import type { EIP1193Provider } from 'viem';

declare global {
  interface Window {
    bitkeep?: {
      ethereum?: EIP1193Provider;
    };
  }
}

// The current metrics implementation is based on walletId,
// using previous "bitkeep" name here not to break metrics
export const id = 'bitget';
export const name = 'Bitget';
const currentHref = globalThis.window
  ? encodeURIComponent(globalThis.window.location.href)
  : '';

const getBitgetConnector = () =>
  injected({
    target: () => ({
      id,
      name,
      provider: () => globalThis.window?.bitkeep?.ethereum,
    }),
  });

export const Bitget: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  icon: WalletIcon,
  detector: () => !!globalThis.window?.bitkeep?.ethereum,
  downloadURLs: {
    default: 'https://web3.bitget.com/',
  },
  deeplink: `https://bkcode.vip?action=dapp&url=${currentHref}`,
  createConnectorFn: getBitgetConnector(),
});

// BitKeep is the previous name of the wallet.
// Exporting the wallet adapter with the old name for compatibility.
export const BitKeep = Bitget;
