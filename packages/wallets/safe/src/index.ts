import { WalletAdapterType } from '@reef-knot/types';
import { SafeConnector } from 'wagmi/connectors/safe';

export const id = 'safe';
export const name = 'Safe';

export const Safe: WalletAdapterType = ({ chains }) => {
  const safeConnector = new SafeConnector({
    chains,
    options: {
      allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
      debug: false,
    },
  });

  return {
    walletName: name,
    walletId: id,
    autoConnectOnly: true,
    detector: async () => {
      if (globalThis.window && globalThis.window.parent !== globalThis.window) {
        // if opened in an iframe. It is important check for Safe.
        // The updated wagmi SafeConnector already has this check, but the currently used SafeConnector for wagmi 0.x hasn't.
        let provider;
        try {
          provider = await safeConnector.getProvider();
        } catch {
          return false;
        }
        return !!provider;
      }
      return false;
    },
    connector: safeConnector,
  };
};
