import type { Store, Rdns } from 'mipd';

export const getTargetEIP6963 = (providersStore: Store, rdns: Rdns) => {
  const providerDetail = providersStore.findProvider({ rdns });
  if (!providerDetail) return undefined;
  return {
    id: providerDetail.info.rdns,
    name: providerDetail.info.name,
    provider: providerDetail.provider,
  };
};

export const isProviderExistsEIP6963 = (providersStore: Store, rdns: Rdns) =>
  Boolean(providersStore.findProvider({ rdns }));
