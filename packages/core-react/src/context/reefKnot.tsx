import React, { createContext, ReactNode, useMemo, useState } from 'react';
import { ReefKnotModalContextProvider } from './reefKnotModalContext';
import type { Chain } from 'wagmi/chains';
import type { WalletAdapterData } from '@reef-knot/types';

export interface ReefKnotContextProps {
  walletDataList: WalletAdapterData[];
  rpc: Record<number, string>;
  chains: readonly [Chain, ...Chain[]];
  children?: ReactNode;
}

export type ReefKnotContextValue = {
  rpc: Record<number, string>;
  walletDataList: WalletAdapterData[];
  loadingWalletId: string | null;
  setLoadingWalletId: React.Dispatch<React.SetStateAction<string | null>>;
  chains: readonly [Chain, ...Chain[]];
};

export const ReefKnotContext = createContext({} as ReefKnotContextValue);

export const ReefKnot = ({
  rpc,
  chains,
  walletDataList,
  children,
}: ReefKnotContextProps) => {
  const [loadingWalletId, setLoadingWalletId] = useState<string | null>(null);

  const contextValue = useMemo(
    () => ({
      rpc,
      walletDataList,
      chains,
      loadingWalletId,
      setLoadingWalletId,
    }),
    [rpc, walletDataList, chains, loadingWalletId],
  );

  return (
    <ReefKnotContext.Provider value={contextValue}>
      <ReefKnotModalContextProvider>{children}</ReefKnotModalContextProvider>
    </ReefKnotContext.Provider>
  );
};
