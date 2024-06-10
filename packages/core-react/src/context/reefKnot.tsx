import React, { createContext, ReactNode, useMemo } from 'react';
import { ReefKnotModalContextProvider } from './reefKnotModalContext';
import type { Chain } from 'wagmi/chains';
import type { WalletAdapterData } from '@reef-knot/types';

export interface ReefKnotContextProps {
  walletConnectorsList: WalletAdapterData[];
  rpc: Record<number, string>;
  chains: readonly [Chain, ...Chain[]];
  children?: ReactNode;
}

export type ReefKnotContextValue = {
  rpc: Record<number, string>;
  walletConnectorsList: WalletAdapterData[];
  chains: readonly [Chain, ...Chain[]];
};

export const ReefKnotContext = createContext({} as ReefKnotContextValue);

export const ReefKnot = ({
  rpc,
  chains,
  walletConnectorsList,
  children,
}: ReefKnotContextProps) => {
  const contextValue = useMemo(
    () => ({
      rpc,
      walletConnectorsList,
      chains,
    }),
    [rpc, walletConnectorsList, chains],
  );

  return (
    <ReefKnotContext.Provider value={contextValue}>
      <ReefKnotModalContextProvider>{children}</ReefKnotModalContextProvider>
    </ReefKnotContext.Provider>
  );
};
