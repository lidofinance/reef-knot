import { safe } from 'wagmi/connectors';
import { withTimeout } from 'viem';
import type { WalletAdapterType } from '@reef-knot/types';

export const id = 'safe';
export const name = 'Safe';

type GetSafeConnectorArgs = {
  allowedDomains?: RegExp[];
};

const getSafeConnector = ({ allowedDomains = [] }: GetSafeConnectorArgs) =>
  safe({
    allowedDomains: [
      /app.safe.global$/,
      /app.safe.protofire.io$/,
      ...allowedDomains,
    ],
    debug: false,
  });

export const Safe: WalletAdapterType = ({ safeAllowedDomains }) => ({
  walletName: name,
  walletId: id,
  type: safe.type,
  autoConnectOnly: true,
  detector: async (): Promise<boolean> => {
    // We cannot longer use `safeConnector.getProvider()` directly
    // because in the current wagmi version it must be initialized
    // with `wagmi/createConfig/setup` otherewise the `getProvider` method is not accessible.
    // https://github.com/wevm/wagmi/blob/fa5864bfb3ebfb0dc147b35003152a17a785ade6/packages/core/src/createConfig.ts#L96-L111
    //
    // We also do not use wagmi config here because we prefer to create a connection on flight
    // when the connect button is clicked. This approach helps us to avoid connector collisions
    // that appear in wagmi sometimes when it has multiple injected connectors in the config list
    // which leading to some bugs detected during manual ui tests.
    //
    // So, with that being said, as we do not have an access to `safeConnector.getProvider`
    // we forced to copy an implementation from its original source  to implement a wallet detector:
    // https://github.com/wevm/wagmi/blob/fa5864bfb3ebfb0dc147b35003152a17a785ade6/packages/connectors/src/safe.ts#L85-L116

    const isIframe =
      globalThis.window && globalThis.window?.parent !== globalThis.window;

    if (!isIframe) return false;

    try {
      // It is a dependency of @wagmi/connectors
      // eslint-disable-next-line import/no-extraneous-dependencies
      const { default: SafeAppsSDK } = await import(
        '@safe-global/safe-apps-sdk'
      );

      let SDK: typeof SafeAppsSDK;
      if (
        typeof SafeAppsSDK !== 'function' &&
        typeof (SafeAppsSDK as any).default === 'function'
      ) {
        SDK = (SafeAppsSDK as any).default;
      } else {
        SDK = SafeAppsSDK;
      }
      const parameters: ConstructorParameters<typeof SafeAppsSDK>[0] = {
        allowedDomains: safeAllowedDomains,
      };
      const sdk = new SDK(parameters);

      // `getInfo` hangs when not used in Safe App iFrame
      // https://github.com/safe-global/safe-apps-sdk/issues/263#issuecomment-1029835840
      const safeSdk = await withTimeout(() => sdk.safe.getInfo(), {
        timeout: 200,
      });
      if (!safeSdk) return false;

      // It is a dependency of @wagmi/connectors
      // eslint-disable-next-line import/no-extraneous-dependencies
      const { SafeAppProvider } = await import(
        '@safe-global/safe-apps-provider'
      );
      const provider = new SafeAppProvider(safeSdk, sdk);
      return !!provider;
    } catch {
      return false;
    }
  },
  createConnectorFn: getSafeConnector({
    allowedDomains: safeAllowedDomains,
  }),
});
