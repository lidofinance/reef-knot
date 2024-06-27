import React, { createContext, ReactNode, useMemo } from 'react';
import { WCWarnBannerContextProvider } from '@reef-knot/ui-react';
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
  chains: readonly [Chain, ...Chain[]];
};

export const ReefKnotContext = createContext({} as ReefKnotContextValue);

export const ReefKnot = ({
  rpc,
  chains,
  walletDataList,
  children,
}: ReefKnotContextProps) => {
  const contextValue = useMemo(
    () => ({
      rpc,
      walletDataList,
      chains,
    }),
    [rpc, walletDataList, chains],
  );

  return (
    <ReefKnotContext.Provider value={contextValue}>
      <ReefKnotModalContextProvider>
        <WCWarnBannerContextProvider>{children}</WCWarnBannerContextProvider>
      </ReefKnotModalContextProvider>
    </ReefKnotContext.Provider>
  );
};
