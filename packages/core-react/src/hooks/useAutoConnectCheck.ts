import { useCallback } from 'react';
import { useConfig } from 'wagmi';
import { useReefKnotContext } from './useReefKnotContext';

export const useAutoConnectCheck = () => {
  const config = useConfig();
  const { walletConnectorsList } = useReefKnotContext();

  const checkIfShouldAutoConnect = useCallback(async () => {
    const autoConnectOnlyAdapters = walletConnectorsList.filter(
      ({ autoConnectOnly }) => autoConnectOnly,
    );
    for (const adapter of autoConnectOnlyAdapters) {
      // Try to detect at least one wallet, marked as for auto connection only
      if (await adapter.detector?.(config)) return true;
    }
    return false;
  }, [walletConnectorsList, config]);

  const getAutoConnectOnlyConnectors = useCallback(() => {
    const autoConnectOnlyAdapters = walletConnectorsList.filter(
      ({ autoConnectOnly }) => autoConnectOnly,
    );
    return autoConnectOnlyAdapters.map((adapter) => adapter.connector);
  }, [walletConnectorsList]);

  return {
    checkIfShouldAutoConnect,
    getAutoConnectOnlyConnectors,
  };
};
