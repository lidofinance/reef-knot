import 'viem/window';
import {
  WalletAdapterType,
  isMobileOrTablet,
} from '@reef-knot/wallets-helpers';
import { injected } from 'wagmi/connectors';

export const id = 'dappBrowserInjected';
export const name = 'DAppBrowser';

const getDAppBrowserInjectedConnector = () =>
  injected({
    target: () => ({
      id,
      name,
      provider: () => globalThis.window?.ethereum,
    }),
  });

export const DAppBrowserInjected: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
  type: injected.type,
  autoConnectOnly: true,
  detector: () => !!globalThis.window?.ethereum && isMobileOrTablet,
  createConnectorFn: getDAppBrowserInjectedConnector(),
});
