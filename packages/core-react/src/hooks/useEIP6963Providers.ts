import { useState, useEffect } from 'react';
import type { EIP6963ProviderDetail } from 'mipd';
import { providersStore } from '../eip6963';

export const useEIP6963Providers = (): readonly EIP6963ProviderDetail[] => {
  const [providers, setProviders] = useState<readonly EIP6963ProviderDetail[]>(
    () => providersStore.getProviders(),
  );

  useEffect(() => {
    return providersStore.subscribe(
      (providerDetails) => setProviders(providerDetails),
      { emitImmediately: true },
    );
  }, []);

  return providers;
};
