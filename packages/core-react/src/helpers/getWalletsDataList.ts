import type { Chain } from 'wagmi/chains';
import type { WalletAdapterType } from '@reef-knot/types';
import { providersStore } from '../eip6963';

export interface GetWalletsDataListArgs {
  walletsList: Record<string, WalletAdapterType>;
  rpc: Record<number, string>;
  defaultChain: Chain;
  walletconnectProjectId?: string;
  safeAllowedDomains?: RegExp[];
  ledgerForceClearSign?: boolean;
}

export const getWalletsDataList = ({
  walletsList,
  rpc,
  defaultChain,
  walletconnectProjectId,
  safeAllowedDomains,
  ledgerForceClearSign,
}: GetWalletsDataListArgs) => {
  const walletAdapters = Object.values(walletsList);

  if (!rpc[defaultChain.id]) {
    throw 'RPC for default chain must be provided';
  }

  const walletsDataList = walletAdapters.map((walletAdapter) =>
    walletAdapter({
      rpc,
      defaultChain,
      walletconnectProjectId,
      safeAllowedDomains,
      ledgerForceClearSign,
      providersStore,
    }),
  );

  return {
    walletsDataList,
  };
};
