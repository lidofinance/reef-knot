import React, { createContext, FC, useMemo } from 'react';
import { WalletAdapterData } from '@reef-knot/types';
import { getWalletDataList } from '../walletData/index';

export interface ReefKnotContextProps {
  rpc: Record<number, string>;
  walletconnectProjectId?: string;
}

export type ReefKnotContextValue = {
  rpc: Record<number, string>;
  walletDataList: WalletAdapterData[];
};

export const ReefKnotContext = createContext({} as ReefKnotContextValue);

export const ReefKnot: FC<ReefKnotContextProps> = ({
  rpc,
  walletconnectProjectId,
  children,
}) => {
  const walletDataList = getWalletDataList({ rpc, walletconnectProjectId });

  const contextValue = useMemo(
    () => ({ rpc, walletDataList }),
    [rpc, walletDataList],
  );

  return (
    <ReefKnotContext.Provider value={contextValue}>
      {children}
    </ReefKnotContext.Provider>
  );
};
