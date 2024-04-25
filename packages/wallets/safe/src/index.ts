import { safe } from 'wagmi/connectors';
import type { WalletAdapterType } from '@reef-knot/types';

export const id = 'safe';
export const name = 'Safe';

const getSafeConnector = () =>
  safe({
    allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
    debug: false,
  });

export const Safe: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
  autoConnectOnly: true,
  detector: async (config): Promise<boolean> => {
    const safeConnector = config.connectors.find((c) => c.id === id);

    // If opened in an iframe. This is an important check for Safe.
    // The updated wagmi SafeConnector already has this check, but the currently used SafeConnector for wagmi 0.x hasn't.
    if (
      safeConnector &&
      globalThis.window &&
      globalThis.window.parent !== globalThis.window
    ) {
      // The Promise.race is needed to handle regular iframes, not related to Safe,
      // because in such iframes Safe SDK Promises can get stuck without resolving,
      // so we are using a small timeout for them.
      return Promise.race([
        new Promise<boolean>((resolve) => {
          safeConnector
            .getProvider()
            .then(() => resolve(true))
            .catch(() => resolve(false));
        }),
        new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(false), 200);
        }),
      ]);
    }
    return false;
  },
  createConnectorFn: getSafeConnector(),
});
