import { WalletAdapterType } from '@reef-knot/types';
import { injected } from 'wagmi/connectors';
import { WalletIcon } from './icons/index.js';

export const id = 'browserExtension';
export const name = 'Browser';

const getBrowserExtensionConnector = () =>
  injected({
    target: () => ({
      id,
      name,
      provider: () => globalThis.window.ethereum,
    }),
  });

export const BrowserExtension: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
  icon: WalletIcon,
  createConnectorFn: getBrowserExtensionConnector(),
});
