import { useCallback, useMemo } from 'react';
import {
  useAccount,
  useConfig,
  useDisconnect as useDisconnectWagmi,
} from 'wagmi';
import { useReefKnotContext } from './useReefKnotContext';
import { useReefKnotModal } from './useReefKnotModal';
import { LS_KEY_RECONNECT_WALLET_ID } from '../constants';

const useDisconnectCleaningStorage = () => {
  const { storage } = useConfig();
  const { disconnect } = useDisconnectWagmi();

  return useCallback(
    (...args: Parameters<typeof disconnect>) => {
      disconnect(...args);
      void storage?.removeItem('recentConnectorId');
      void storage?.removeItem(LS_KEY_RECONNECT_WALLET_ID);
    },
    [disconnect, storage],
  );
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
  const { walletDataList } = useReefKnotContext();

  const isDisconnectMakesSense = useMemo(() => {
    // It doesn't make sense to offer a user the ability to disconnect if the user is not connected yet,
    // or if the user was connected automatically
    const connectorData = walletDataList.find(
      (c) => c.walletId === connector?.id,
    );
    return isConnected && !!connectorData?.autoConnectOnly;
  }, [isConnected, connector, walletDataList]);

  return {
    disconnect: isDisconnectMakesSense ? disconnect : undefined,
    isDisconnectMakesSense,
  };
};
