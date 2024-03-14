import React, { createContext, FC, ReactNode, useMemo } from 'react';
import { WalletAdapterData } from '@reef-knot/types';
import { Chain } from 'wagmi/chains';
import { WCWarnBannerContextProvider } from '@reef-knot/ui-react';
import { getWalletDataList } from '../walletData/index';
import { AutoConnect } from '../components/AutoConnect';
import { ReefKnotModalContextProvider } from './reefKnotModalContext';

export interface ReefKnotContextProps {
  rpc: Record<number, string>;
  walletconnectProjectId?: string;
  chains: Chain[];
  defaultChain: Chain;
  autoConnect?: boolean;
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
  autoConnect = true,
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
      <ReefKnotModalContextProvider>
        <WCWarnBannerContextProvider>
          <AutoConnect
            autoConnect={autoConnect}
            walletDataList={walletDataList}
            chains={chains}
          />
          {children}
        </WCWarnBannerContextProvider>
      </ReefKnotModalContextProvider>
    </ReefKnotContext.Provider>
  );
};
