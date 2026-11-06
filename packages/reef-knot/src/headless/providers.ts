import { useMemo } from 'react';
import { useEIP6963Providers, useReefKnotContext } from '../core-react';

export function useEIP6963ProvidersWithoutAdapters() {
  const { walletDataList } = useReefKnotContext();
  const providers = useEIP6963Providers();
  return useMemo(() => {
    const known = new Set(walletDataList.map((wallet) => wallet.rdns));
    return providers.filter((provider) => !known.has(provider.info.rdns));
  }, [walletDataList, providers]);
}
