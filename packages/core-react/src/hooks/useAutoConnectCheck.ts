import { useCallback } from 'react';
import { useReefKnotContext } from './useReefKnotContext';

export const useAutoConnectCheck = () => {
  const { walletDataList } = useReefKnotContext();

  const checkIfShouldAutoConnect = useCallback(async () => {
    for (const adapter of walletDataList) {
      if (!adapter.autoConnectOnly) continue;
      // Try to detect at least one wallet, marked as for auto connection only
      if (await adapter.detector?.()) return true;
    }
    return false;
  }, [walletDataList]);

  return {
    checkIfShouldAutoConnect,
  };
};
