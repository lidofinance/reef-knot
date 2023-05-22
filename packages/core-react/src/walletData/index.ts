import { WalletsListEthereum } from '@reef-knot/wallets-list';
import { WalletAdapterData } from '@reef-knot/types';

let walletDataList: undefined | WalletAdapterData[];

export interface GetConnectorsArgs {
  rpc: Record<number, string>;
  walletconnectProjectId?: string;
}

export const getWalletDataList = ({
  rpc,
  walletconnectProjectId,
}: GetConnectorsArgs) => {
  const walletAdapters = Object.values(WalletsListEthereum);
  if (!walletDataList) {
    walletDataList = walletAdapters.map((walletAdapter) =>
      walletAdapter({ rpc, walletconnectProjectId }),
    );
  }
  return walletDataList;
};

export const getConnectors = (args: GetConnectorsArgs) => {
  return getWalletDataList(args).map(({ connector }) => connector);
};
