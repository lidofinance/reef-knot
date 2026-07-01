import type { Connector } from 'wagmi';
import type { WalletAdapterData } from '@reef-knot/types';
import { providersStore } from '../eip6963';

type GetConnectedProviderNameArgs = {
  connector?: Connector | null;
  walletDataList: WalletAdapterData[];
};

export const getConnectedProviderName = ({
  connector,
  walletDataList,
}: GetConnectedProviderNameArgs): string | undefined => {
  if (!connector) return undefined;

  const provider =
    providersStore.getProviders().find((p) => p.info.rdns === connector.id) ??
    providersStore
      .getProviders()
      .find(
        (p) =>
          p.info.rdns ===
          walletDataList.find((wallet) => wallet.walletId === connector.id)
            ?.rdns,
      );

  return provider?.info.name ?? connector.name;
};
