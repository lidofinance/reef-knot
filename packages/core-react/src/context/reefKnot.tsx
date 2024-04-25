import React, { createContext, ReactNode, useMemo } from 'react';
import { WCWarnBannerContextProvider } from '@reef-knot/ui-react';
import { ReefKnotModalContextProvider } from './reefKnotModalContext';
import type { Chain } from 'wagmi/chains';
import type { WalletConnectorData } from '@reef-knot/types';

export interface ReefKnotContextProps {
  walletConnectorsList: WalletConnectorData[];
  rpc: Record<number, string>;
  chains: readonly [Chain, ...Chain[]];
  children?: ReactNode;
}

export type ReefKnotContextValue = {
  rpc: Record<number, string>;
  walletConnectorsList: WalletConnectorData[];
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
      <ReefKnotModalContextProvider>
        <WCWarnBannerContextProvider>{children}</WCWarnBannerContextProvider>
      </ReefKnotModalContextProvider>
    </ReefKnotContext.Provider>
  );
};
