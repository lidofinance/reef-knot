import { useEffect } from 'react';
import { useAccount, useReconnect } from 'wagmi';
import { useEagerConnect } from './useEagerConnect';
import { checkTermsAccepted } from '../helpers/checkTermsAccepted';

export const useAutoConnect = (autoConnectEnabled: boolean) => {
  const { reconnectAsync } = useReconnect();
  const { isConnected } = useAccount();
  const { eagerConnect } = useEagerConnect();

  useEffect(() => {
    const tryReconnect = async () => {
      // Don't auto-connect if already connected or if the auto-connect feature is disabled
      if (isConnected || !autoConnectEnabled) return;

      // Try to eagerly connect wallets that are meant to be used only with auto-connection.
      // For example, wallets with dApp browsers, or using iframes to open dApps.
      const connectResult = await eagerConnect();

      // If still not connected and there were no errors and the terms of service are accepted,
      // call the default wagmi autoConnect method, which attempts to connect to the last used connector.
      if (!connectResult && checkTermsAccepted()) {
        await reconnectAsync();
      }
    };

    void tryReconnect();

    // No hook deps: do not retry the auto-connect attemption.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
