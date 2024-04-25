import { useCallback, useMemo } from 'react';
import { useAccount, useDisconnect as useDisconnectWagmi } from 'wagmi';
import { useAutoConnectCheck } from './useAutoConnectCheck';
import { useReefKnotModal } from './useReefKnotModal';

export const useForceDisconnect = () => {
  const { disconnect } = useDisconnectWagmi();
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
  const { disconnect } = useDisconnectWagmi();

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
