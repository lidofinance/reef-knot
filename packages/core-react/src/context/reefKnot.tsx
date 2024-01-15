import React, { createContext, FC, ReactNode, useMemo } from 'react';
import { WalletAdapterData } from '@reef-knot/types';
import { Chain } from 'wagmi/chains';
import { WCWarnBannerContextProvider } from '@reef-knot/ui-react';
import { getWalletDataList } from '../walletData/index';
import { AcceptTermsModalContextProvider } from './acceptTermsModal';

export interface ReefKnotContextProps {
  rpc: Record<number, string>;
  walletconnectProjectId?: string;
  chains: Chain[];
  defaultChain: Chain;
  children?: ReactNode;
}

export type ReefKnotContextValue = {
  rpc: Record<number, string>;
  walletDataList: WalletAdapterData[];
  chains: Chain[];
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
    () => ({
      rpc,
      walletDataList,
      chains,
    }),
    [rpc, walletDataList, chains],
  );

  return (
    <ReefKnotContext.Provider value={contextValue}>
      <AcceptTermsModalContextProvider>
        <WCWarnBannerContextProvider>{children}</WCWarnBannerContextProvider>
      </AcceptTermsModalContextProvider>
    </ReefKnotContext.Provider>
  );
};
