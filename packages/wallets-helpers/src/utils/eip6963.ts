import type { Store, Rdns } from 'mipd';

export const getTargetEIP6963 = (providersStore: Store, rdns: Rdns) => {
  const providerDetail = providersStore.findProvider({ rdns });
  // Never return undefined: wagmi then falls back to `window.ethereum`,
  // which can belong to another wallet.
  return {
    id: rdns,
    name: providerDetail?.info.name ?? rdns,
    provider: () => providerDetail?.provider,
  };
};

export const isProviderExistsEIP6963 = (providersStore: Store, rdns: Rdns) =>
  Boolean(providersStore.findProvider({ rdns }));
