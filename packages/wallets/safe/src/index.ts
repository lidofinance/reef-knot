import { WalletAdapterType } from '@reef-knot/types';
import { SafeConnector } from 'wagmi/connectors/safe';

export const id = 'safe';
export const name = 'Safe';

export const Safe: WalletAdapterType = ({ chains }) => ({
  walletName: name,
  walletId: id,
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
