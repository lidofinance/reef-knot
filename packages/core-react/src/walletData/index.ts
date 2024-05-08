import type { Connector, CreateConnectorFn } from 'wagmi';
import type { Chain } from 'wagmi/chains';
import type {
  WalletAdapterData,
  WalletAdapterType,
  WalletConnectorData,
} from '@reef-knot/types';

export interface GetWalletsDataListArgs {
  walletsList: Record<string, WalletAdapterType>;
  rpc: Record<number, string>;
  defaultChain: Chain;
  walletconnectProjectId?: string;
}

export const getWalletsDataList = ({
  walletsList,
  rpc,
  defaultChain,
  walletconnectProjectId,
}: GetWalletsDataListArgs) => {
  const walletAdapters = Object.values(walletsList);

  if (!rpc[defaultChain.id]) {
    throw 'RPC for default chain must be provided';
  }

  const walletsDataList = walletAdapters.map((walletAdapter) =>
    walletAdapter({
      rpc,
      defaultChain,
      walletconnectProjectId,
    }),
  );

  const connectorCreatorFns = walletsDataList.reduce<CreateConnectorFn[]>(
    (list, adapterData) => {
      const { createConnectorFn, walletconnectExtras } = adapterData;
      list.push(createConnectorFn);

      // Sort `walletconnectExtras.connectionViaURI` to be next on the list
      // because `wagmi.createConfig` requires flat list of connecor creators.
      // It will be picked up later by `getWalletConnectorsList`
      if (walletconnectExtras && walletconnectExtras.connectionViaURI) {
        list.push(walletconnectExtras.connectionViaURI.createConnectorFn);
      }
      return list;
    },
    [],
  );

  return {
    walletsDataList,
    connectorCreatorFns,
  };
};

/**
 * Connectors and wallet data should be sorted in the same way to match one to one.
 * That could be easily achieved if you follow next order:
 * `getWalletsDataList` —> `wagmi/createConfig` —> `getWalletConnectorsList`
 * (example in the reef-knot repository; `apps/demo-react/components/ConfigContextProviders.tsx`)
 *
 * We do not have another way to match them properly here because
 * the connectors are created by wagmi `createConfig` and
 * it does not provide enough info in some cases,
 * especially when using walletConnect connector
 */
export const getWalletConnectorsList = ({
  connectors,
  walletsDataList,
}: {
  connectors: readonly Connector[];
  walletsDataList: WalletAdapterData[];
}): WalletConnectorData[] => {
  const walletConnectorsList: WalletConnectorData[] = [];
  let connectorIdx = 0;

  for (const adapterData of walletsDataList) {
    const connectorData: WalletConnectorData = {
      ...adapterData,
      connector: connectors[connectorIdx],
    };

    connectorIdx++;

    // If there is `walletconnectExtras.connectionViaURI` in adapter data
    // then it's connector was sorted by `getWalletAdaptersList` to be next on the list
    if (
      connectorData.walletconnectExtras &&
      connectorData.walletconnectExtras.connectionViaURI
    ) {
      connectorData.walletconnectExtras.connectionViaURI.connector =
        connectors[connectorIdx];
      connectorIdx++;
    }

    walletConnectorsList.push(connectorData);
  }

  return walletConnectorsList;
};
