import { useCallback, useMemo } from 'react';
import {
  useConfig,
  useAccount,
  useDisconnect as useDisconnectWagmi,
} from 'wagmi';
import { useAutoConnectCheck } from './useAutoConnectCheck';
import { useReefKnotModal } from './useReefKnotModal';

const useDisconnectCleaningStorage = () => {
  const { storage } = useConfig();
  const { disconnect } = useDisconnectWagmi();

  const handleDisconnect = useCallback(
    (...args: Parameters<typeof disconnect>) => {
      disconnect(...args);
      void storage?.removeItem('recentConnectorId');
    },
    [disconnect, storage],
  );

  return handleDisconnect;
};

export const useForceDisconnect = () => {
  const disconnect = useDisconnectCleaningStorage();
  const { forceCloseAllModals } = useReefKnotModal();

  const forceDisconnect = useCallback(() => {
    forceCloseAllModals();
    disconnect();
  }, [disconnect, forceCloseAllModals]);

  return { forceDisconnect };
};

export const useDisconnect = (): {
  disconnect?: () => void;
  isDisconnectMakesSense: boolean;
} => {
  const { isConnected, connector } = useAccount();
  const disconnect = useDisconnectCleaningStorage();

  const { getAutoConnectOnlyConnectors } = useAutoConnectCheck();

  const isDisconnectMakesSense = useMemo(() => {
    // It doesn't make sense to offer a user the ability to disconnect if the user is not connected yet,
    // or if the user was connected automatically
    const autoConnectOnlyConnectors = getAutoConnectOnlyConnectors();
    const isConnectorNotAutoConnectOnly = autoConnectOnlyConnectors.every(
      (c) => c.id !== connector?.id,
    );
    return isConnected && isConnectorNotAutoConnectOnly;
  }, [isConnected, connector, getAutoConnectOnlyConnectors]);

  return {
    disconnect: isDisconnectMakesSense ? disconnect : undefined,
    isDisconnectMakesSense,
  };
};
