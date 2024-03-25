import { useClient, useAccount } from 'wagmi';
import { useCallback, useEffect, useRef } from 'react';
import { checkTermsAccepted } from '../helpers/checkTermsAccepted';
import { useEagerConnect } from './useEagerConnect';

export const useAutoConnect = (autoConnectEnabled: boolean) => {
  const isAutoConnectCalled = useRef(false);
  const client = useClient();
  const { isConnected } = useAccount();
  const { eagerConnect } = useEagerConnect();

  const autoConnect = useCallback(async () => {
    // Don't auto-connect if already connected or if the auto-connect feature is disabled or if already tried to auto-connect.
    if (isConnected || !autoConnectEnabled || isAutoConnectCalled.current)
      return;

    // The current logic is to try auto-connect only once, even if an error happened and connection was not successful.
    isAutoConnectCalled.current = true;

    // Try to eagerly connect wallets that are meant to be used only with auto-connection.
    // For example, wallets with dApp browsers, or using iframes to open dApps.
    const connectResult = await eagerConnect();

    // If still not connected and there were no errors and the terms of service are accepted,
    // call the default wagmi autoConnect method, which attempts to connect to the last used connector.
    if (!connectResult && checkTermsAccepted()) {
      await client.autoConnect();
    }
  }, [autoConnectEnabled, client, eagerConnect, isConnected]);

  useEffect(() => {
    void autoConnect();
  }, [autoConnect]);
};
