import { WalletAdapterType } from '@reef-knot/types';
import { SafeConnector } from 'wagmi/connectors/safe';

export const id = 'safe';
export const name = 'Safe';

export const Safe: WalletAdapterType = ({ chains }) => {
  const safeConnector = new SafeConnector({
    chains,
    options: {
      allowedDomains: [/app.safe.global$/, /holesky-safe.protofire.io$/],
      debug: false,
    },
  });

  return {
    walletName: name,
    walletId: id,
    autoConnectOnly: true,
    detector: async (): Promise<boolean> => {
      // If opened in an iframe. This is an important check for Safe.
      // The updated wagmi SafeConnector already has this check, but the currently used SafeConnector for wagmi 0.x hasn't.
      if (globalThis.window && globalThis.window.parent !== globalThis.window) {
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
    connector: safeConnector,
  };
};
