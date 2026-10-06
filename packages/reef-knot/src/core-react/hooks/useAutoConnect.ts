import { useEffect } from 'react';
import { useConfig, useConnection, useReconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useEagerConnect } from './useEagerConnect';
import { checkTermsAccepted } from '../helpers/checkTermsAccepted';
import { useReefKnotContext } from './useReefKnotContext';
import { LS_KEY_RECONNECT_WALLET_ID } from '../constants';
import { withCallback } from '../helpers/withCallback';
import { providersStore } from '../eip6963';

export const useAutoConnect = (autoConnectEnabled: boolean) => {
  const { storage } = useConfig();
  const { mutateAsync: reconnectAsync } = useReconnect();
  const { isConnected } = useConnection();
  const { eagerConnect } = useEagerConnect();
  const { walletDataList, onReconnect } = useReefKnotContext();

  useEffect(() => {
    const tryReconnect = async () => {
      // Don't auto-connect if already connected or if the auto-connect feature is disabled
      if (isConnected || !autoConnectEnabled) return;

      // Try to eagerly connect wallets that are meant to be used only with auto-connection.
      // For example, wallets with dApp browsers, or using iframes to open dApps.
      const connectResult = await eagerConnect();

      // If still not connected and there were no errors and the terms of service are accepted,
      // call the default wagmi autoConnect method, which attempts to connect to the last used connector.
      if (
        !connectResult &&
        checkTermsAccepted() &&
        // We do not want to reconnect if the `recentConnectorId` item was deleted during disconnect
        (await storage?.getItem('recentConnectorId'))
      ) {
        const savedReconnectWalletId = await storage?.getItem(
          LS_KEY_RECONNECT_WALLET_ID,
        );
        const walletData = walletDataList.find(
          (data) => data.walletId === savedReconnectWalletId,
        );
        // Wait for all EIP-6963 wallets to load their code and fire "eip6963:announceProvider" event
        // Without the delay, this code can be called from a browser's cache faster than wallet extension code
        await new Promise((resolve) => setTimeout(resolve, 100));

        const reconnectWithCallback = withCallback(reconnectAsync, onReconnect);

        if (walletData) {
          let createConnectorFn = walletData.createConnectorFn;
          if (walletData?.walletconnectExtras?.connectionViaURI?.condition) {
            createConnectorFn =
              walletData.walletconnectExtras.connectionViaURI.createConnectorFn;
          }

          await reconnectWithCallback({ connectors: [createConnectorFn] });
        } else {
          const eip6963Provider = providersStore
            .getProviders()
            .find((p) => p.info.rdns === savedReconnectWalletId);

          if (eip6963Provider) {
            const createConnectorFn = injected({
              target: {
                id: eip6963Provider.info.rdns,
                name: eip6963Provider.info.name,
                provider: () => eip6963Provider.provider,
              },
            });
            await reconnectWithCallback({ connectors: [createConnectorFn] });
          }
        }
      }
    };

    void tryReconnect();

    // No hook deps: do not retry the auto-connect attemption.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
