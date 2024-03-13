import { useReefKnotContext } from './useReefKnotContext';

export const useAutoConnectCheck = () => {
  const { walletDataList } = useReefKnotContext();
  const autoConnectOnlyAdapters = walletDataList.filter(
    ({ autoConnectOnly }) => autoConnectOnly,
  );
  const isAutoConnectionSuitable = autoConnectOnlyAdapters.some((adapter) =>
    adapter.detector?.(),
  );

  return {
    isAutoConnectionSuitable,
  };
};
