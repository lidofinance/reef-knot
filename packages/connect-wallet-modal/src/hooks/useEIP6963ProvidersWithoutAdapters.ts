import { useMemo } from 'react';
import { useEIP6963Providers, useReefKnotContext } from '@reef-knot/core-react';

export const useEIP6963ProvidersWithoutAdapters = () => {
  const { walletDataList } = useReefKnotContext();
  const allProviders = useEIP6963Providers();

  const adapterRdnsSet = useMemo(
    () =>
      new Set(
        walletDataList
          .map((w) => w.rdns)
          .filter((rdns): rdns is string => rdns != null),
      ),
    [walletDataList],
  );

  return useMemo(
    () => allProviders.filter((p) => !adapterRdnsSet.has(p.info.rdns)),
    [allProviders, adapterRdnsSet],
  );
};
