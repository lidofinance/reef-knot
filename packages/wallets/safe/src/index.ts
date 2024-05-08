import { safe } from 'wagmi/connectors';
import type { WalletAdapterType } from '@reef-knot/types';

export const id = 'safe';
export const name = 'Safe';

const getSafeConnector = () =>
  safe({
    allowedDomains: [/app.safe.global$/, /holesky-safe.protofire.io$/],
    debug: false,
  });

export const Safe: WalletAdapterType = () => ({
  walletName: name,
  walletId: id,
  autoConnectOnly: true,
  detector: async (config): Promise<boolean> => {
    const safeConnector = config.connectors.find((c) => c.id === id);
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
            .then((provider: unknown) => resolve(!!provider))
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
