import { useCallback, useMemo } from 'react';
import {
  useConnection,
  useConfig,
  useDisconnect as useDisconnectWagmi,
} from 'wagmi';
import { useReefKnotContext } from './useReefKnotContext';
import { useReefKnotModal } from './useReefKnotModal';
import { LS_KEY_RECONNECT_WALLET_ID } from '../constants';

const useDisconnectCleaningStorage = () => {
  const config = useConfig();
  const { mutateAsync } = useDisconnectWagmi();

  const disconnectAsync = useCallback(async () => {
    // Wagmi keeps the old connection when another wallet connects.
    // If we disconnect only the current one, wagmi makes the old one current again.
    const connectors = [...config.state.connections.values()].map(
      (connection) => connection.connector,
    );
    const errors: unknown[] = [];
    // One at a time: each wagmi disconnect changes the shared connections map.
    for (const connector of connectors) {
      // Keep going, so one failing wallet does not keep the others connected.
      await mutateAsync({ connector }).catch((e: unknown) => errors.push(e));
    }
    // Wagmi writes recentConnectorId while it finishes a disconnect.
    // Clear the keys after that, and before a new connection saves its own keys.
    // Clear them even if a wallet failed: the user asked to disconnect,
    // so a page reload must not connect that wallet again.
    await Promise.all([
      config.storage?.removeItem('recentConnectorId'),
      config.storage?.removeItem(LS_KEY_RECONNECT_WALLET_ID),
    ]);
    if (errors.length) throw errors[0];
  }, [config, mutateAsync]);

  // For callers that don't wait. Like wagmi's mutate, it does not throw.
  const disconnect = useCallback(() => {
    disconnectAsync().catch(() => {});
  }, [disconnectAsync]);

  return { disconnect, disconnectAsync };
};

export const useForceDisconnect = () => {
  const { disconnect } = useDisconnectCleaningStorage();
  const { forceCloseAllModals } = useReefKnotModal();

  const forceDisconnect = useCallback(() => {
    forceCloseAllModals();
    disconnect();
  }, [disconnect, forceCloseAllModals]);

  return { forceDisconnect };
};

export const useDisconnect = (): {
  disconnect?: () => void;
  disconnectAsync?: () => Promise<void>;
  isDisconnectMakesSense: boolean;
} => {
  const { isConnected, connector } = useConnection();
  const { disconnect, disconnectAsync } = useDisconnectCleaningStorage();
  const { walletDataList } = useReefKnotContext();

  const isDisconnectMakesSense = useMemo(() => {
    // It doesn't make sense to offer a user the ability to disconnect if the user is not connected yet,
    // or if the user was connected automatically
    const connectorData = walletDataList.find(
      (c) => c.walletId === connector?.id,
    );
    return isConnected && !connectorData?.autoConnectOnly;
  }, [isConnected, connector, walletDataList]);

  return {
    disconnect: isDisconnectMakesSense ? disconnect : undefined,
    disconnectAsync: isDisconnectMakesSense ? disconnectAsync : undefined,
    isDisconnectMakesSense,
  };
};
