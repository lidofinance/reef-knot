import { WalletAdapterType } from '@reef-knot/types';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { isMobileOrTablet } from '@reef-knot/wallets-helpers';

export const id = 'dappBrowserInjected';
export const name = 'DAppBrowser';

export const DAppBrowserInjected: WalletAdapterType = ({ chains }) => ({
  walletName: name,
  walletId: id,
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
