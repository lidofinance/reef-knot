import { useCallback } from 'react';
import { useReefKnotContext } from './useReefKnotContext';

export const useAutoConnectCheck = () => {
  const { walletConnectorsList } = useReefKnotContext();

  const checkIfShouldAutoConnect = useCallback(async () => {
    for (const adapter of walletConnectorsList) {
      if (!adapter.autoConnectOnly) continue;
      // Try to detect at least one wallet, marked as for auto connection only
      if (await adapter.detector?.()) return true;
    }
    return false;
  }, [walletConnectorsList]);

  return {
    checkIfShouldAutoConnect,
  };
};
