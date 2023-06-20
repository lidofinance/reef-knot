import { WalletsListEthereum } from '@reef-knot/wallets-list';
import { WalletAdapterData } from '@reef-knot/types';
import type { Chain } from 'wagmi/chains';

let walletDataList: undefined | WalletAdapterData[];

export interface GetConnectorsArgs {
  rpc?: Record<number, string>;
  walletconnectProjectId?: string;
  chains: Chain[];
  defaultChain?: Chain;
}

export const getWalletDataList = ({
  rpc,
  walletconnectProjectId,
  chains,
  defaultChain,
}: GetConnectorsArgs) => {
  const walletAdapters = Object.values(WalletsListEthereum);
  if (!walletDataList) {
    // Sorting supported chains, so the default chain is always first in the array
    // Have to do this because WalletConnect v2 via wagmi always tries to connect
    // to the first chain in the chains array
    const sortedChains = defaultChain
      ? chains.sort((chain) => (chain.id === defaultChain.id ? -1 : 1))
      : chains;

    walletDataList = walletAdapters.map((walletAdapter) =>
      walletAdapter({ rpc, walletconnectProjectId, chains: sortedChains }),
    );
  }
  return walletDataList;
};

export const getConnectors = (args: GetConnectorsArgs) => {
  return getWalletDataList(args).map(({ connector }) => connector);
};
