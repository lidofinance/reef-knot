import React, { createContext, FC, useMemo } from 'react';
import { WalletAdapterData } from '@reef-knot/types';
import { Chain } from 'wagmi/chains';
import { WCWarnBannerContextProvider } from '@reef-knot/ui-react';
import { getWalletDataList } from '../walletData/index';

export interface ReefKnotContextProps {
  rpc: Record<number, string>;
  walletconnectProjectId?: string;
  chains: Chain[];
  defaultChain?: Chain;
}

export type ReefKnotContextValue = {
  rpc: Record<number, string>;
  walletDataList: WalletAdapterData[];
};

export const ReefKnotContext = createContext({} as ReefKnotContextValue);

export const ReefKnot: FC<ReefKnotContextProps> = ({
  rpc,
  walletconnectProjectId,
  chains,
  defaultChain,
  children,
}) => {
  const walletDataList = getWalletDataList({
    rpc,
    walletconnectProjectId,
    chains,
    defaultChain,
  });

  const contextValue = useMemo(
    () => ({ rpc, walletDataList }),
    [rpc, walletDataList],
  );

  return (
    <ReefKnotContext.Provider value={contextValue}>
      <WCWarnBannerContextProvider>{children}</WCWarnBannerContextProvider>
    </ReefKnotContext.Provider>
  );
};
