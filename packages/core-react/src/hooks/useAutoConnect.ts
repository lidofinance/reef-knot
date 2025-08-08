import { useEffect } from 'react';
import { useConfig, useAccount, useReconnect } from 'wagmi';
import { useEagerConnect } from './useEagerConnect';
import { checkTermsAccepted } from '../helpers/checkTermsAccepted';
import { useReefKnotContext } from './useReefKnotContext';
import { LS_KEY_RECONNECT_WALLET_ID } from '../constants';
import { withCallback } from '../helpers/withCallback';

export const useAutoConnect = (autoConnectEnabled: boolean) => {
  const { storage } = useConfig();
  const { reconnectAsync } = useReconnect();
  const { isConnected } = useAccount();
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
        if (walletData) {
          let createConnectorFn = walletData.createConnectorFn;
          if (walletData?.walletconnectExtras?.connectionViaURI?.condition) {
            createConnectorFn =
              walletData.walletconnectExtras.connectionViaURI.createConnectorFn;
          }

          // Wait for all EIP-6963 wallets to load their code and fire "eip6963:announceProvider" event
          // Without the delay, this code can be called from a browser's cache faster than wallet extension code
          await new Promise((resolve) => setTimeout(resolve, 200));

          const reconnectWithCallback = withCallback(
            reconnectAsync,
            onReconnect,
          );

          await reconnectWithCallback({ connectors: [createConnectorFn] });
        }
      }
    };

    void tryReconnect();

    // No hook deps: do not retry the auto-connect attemption.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
