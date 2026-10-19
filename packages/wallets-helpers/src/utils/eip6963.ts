import type { Store, Rdns } from 'mipd';

export const getTargetEIP6963 = (providersStore: Store, rdns: Rdns) => {
  const findProviderDetail = () => providersStore.findProvider({ rdns });
  // Never return undefined: wagmi then falls back to `window.ethereum`,
  // which can belong to another wallet.
  return {
    id: rdns,
    name: findProviderDetail()?.info.name ?? rdns,
    // Look up again on each call. The wallet can announce after this target is created.
    provider: () => findProviderDetail()?.provider,
  };
};

export const isProviderExistsEIP6963 = (providersStore: Store, rdns: Rdns) =>
  Boolean(providersStore.findProvider({ rdns }));
