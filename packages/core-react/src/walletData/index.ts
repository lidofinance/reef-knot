import { WalletsListEthereum } from '@reef-knot/wallets-list';
import { WalletAdapterData } from '@reef-knot/types';
import type { Chain } from 'wagmi/chains';

let walletDataList: undefined | WalletAdapterData[];

export interface GetConnectorsArgs {
  rpc: Record<number, string>;
  chains: Chain[];
  defaultChain: Chain;
  walletconnectProjectId?: string;
}

export const getWalletDataList = ({
  rpc,
  chains,
  defaultChain,
  walletconnectProjectId,
}: GetConnectorsArgs) => {
  const walletAdapters = Object.values(WalletsListEthereum);
  if (!walletDataList) {
    // Sorting supported chains, so the default chain is always first in the array
    // Have to do this because WalletConnect v2 via wagmi always tries to connect
    // to the first chain in the chains array
    const sortedChains = defaultChain
      ? chains.sort((chain) => (chain.id === defaultChain.id ? -1 : 1))
      : chains;

    if (!rpc[defaultChain.id]) {
      throw 'RPC for default chain must be provided';
    }

    walletDataList = walletAdapters.map((walletAdapter) =>
      walletAdapter({
        rpc,
        chains: sortedChains,
        defaultChain,
        walletconnectProjectId,
      }),
    );
  }
  return walletDataList;
};

export const getConnectors = (args: GetConnectorsArgs) => {
  return getWalletDataList(args).map(({ connector }) => connector);
};
