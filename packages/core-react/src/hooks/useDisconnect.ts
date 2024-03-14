import { useCallback } from 'react';
import { useAccount, useDisconnect as useDisconnectWagmi } from 'wagmi';
import { useAutoConnectCheck } from './useAutoConnectCheck';

import { useReefKnotModal } from '../context';

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
} => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnectWagmi();

  const { isAutoConnectionSuitable } = useAutoConnectCheck();
  const available = isConnected && !isAutoConnectionSuitable;

  return {
    disconnect: available ? disconnect : undefined,
  };
};
