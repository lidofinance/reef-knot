import React, { createContext, ReactNode, useMemo } from 'react';
import { ReefKnotModalContextProvider } from './reefKnotModalContext';
import type { Chain } from 'wagmi/chains';
import type { WalletAdapterData } from '@reef-knot/types';

export type ReefKnotProviderConfig = {
  rpc: Record<number, string>;
  walletDataList: WalletAdapterData[];
  chains: readonly [Chain, ...Chain[]];
};

export interface ReefKnotContextProps {
  config: ReefKnotProviderConfig;
  children?: ReactNode;
}

export type ReefKnotContextValue = ReefKnotProviderConfig;

export const ReefKnotContext = createContext({} as ReefKnotContextValue);

export const ReefKnotProvider = ({
  config,
  children,
}: ReefKnotContextProps) => {
  return (
    <ReefKnotContext.Provider value={config}>
      <ReefKnotModalContextProvider>{children}</ReefKnotModalContextProvider>
    </ReefKnotContext.Provider>
  );
};
