import { WalletAdapterType } from '@reef-knot/types';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { isMobileOrTablet } from '@reef-knot/wallets-helpers';

export const DAppBrowserInjected: WalletAdapterType = ({ chains }) => ({
  walletName: 'DAppBrowser',
  walletId: 'dappBrowserInjected',
  autoConnectOnly: true,
  detector: () => !!globalThis.window?.ethereum && isMobileOrTablet,
  connector: new InjectedConnector({
    chains,
    options: {
      name: 'DAppBrowser',
      getProvider: () => globalThis.window?.ethereum,
    },
  }),
});
