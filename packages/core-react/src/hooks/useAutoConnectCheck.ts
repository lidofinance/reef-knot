import { useReefKnotContext } from './useReefKnotContext';

export const useAutoConnectCheck = () => {
  const { walletDataList } = useReefKnotContext();

  const checkIfShouldAutoConnect = async () => {
    const autoConnectOnlyAdapters = walletDataList.filter(
      ({ autoConnectOnly }) => autoConnectOnly,
    );
    for (const adapter of autoConnectOnlyAdapters) {
      // Try to detect at least one wallet, marked as for auto connection only
      if (await adapter.detector?.()) return true;
    }
    return false;
  };

  const getAutoConnectOnlyConnectors = () => {
    const autoConnectOnlyAdapters = walletDataList.filter(
      ({ autoConnectOnly }) => autoConnectOnly,
    );
    return autoConnectOnlyAdapters.map((adapter) => adapter.connector);
  };

  return {
    checkIfShouldAutoConnect,
    getAutoConnectOnlyConnectors,
  };
};
