import { useCallback, useMemo } from 'react';
import {
  useConfig,
  useAccount,
  useDisconnect as useDisconnectWagmi,
} from 'wagmi';
import { useReefKnotContext } from './useReefKnotContext';
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
  const { walletConnectorsList } = useReefKnotContext();

  const isDisconnectMakesSense = useMemo(() => {
    // It doesn't make sense to offer a user the ability to disconnect if the user is not connected yet,
    // or if the user was connected automatically
    const connectorData = walletConnectorsList.find(
      (c) => c.walletId === connector?.id,
    );
    return isConnected && !!connectorData?.autoConnectOnly;
  }, [isConnected, connector, walletConnectorsList]);

  return {
    disconnect: isDisconnectMakesSense ? disconnect : undefined,
    isDisconnectMakesSense,
  };
};
