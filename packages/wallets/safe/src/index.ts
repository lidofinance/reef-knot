import { WalletAdapterType } from '@reef-knot/types';
import { SafeConnector } from 'wagmi/connectors/safe';

export const Safe: WalletAdapterType = ({ chains }) => ({
  walletName: 'Safe',
  walletId: 'safe',
  autoConnectOnly: true,
  detector: () => {
    // iframe check
    // A more precise check will occur during SafeConnector connection.
    return globalThis.window && globalThis.window.parent !== globalThis.window;
  },
  connector: new SafeConnector({
    chains,
    options: {
      allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
      debug: false,
    },
  }),
});
