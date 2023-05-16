import React, { createContext, FC, useMemo } from 'react';
import { WalletsListEthereum } from '@reef-knot/wallets-list';
import { WalletAdapterData } from '@reef-knot/types';

export interface ReefKnotContextProps {
  rpc: Record<number, string>;
}

export type ReefKnotContextValue = {
  rpc: Record<number, string>;
  walletDataList: WalletAdapterData[];
};

export const ReefKnotContext = createContext({} as ReefKnotContextValue);

export const ReefKnot: FC<ReefKnotContextProps> = (props) => {
  const { rpc } = props;

  const walletAdapters = Object.values(WalletsListEthereum);
  const walletDataList = walletAdapters.map((walletAdapter) =>
    walletAdapter({ rpc }),
  );

  const contextValue = useMemo(
    () => ({ rpc, walletDataList }),
    [rpc, walletDataList],
  );

  return (
    <ReefKnotContext.Provider value={contextValue}>
      {props.children}
    </ReefKnotContext.Provider>
  );
};
