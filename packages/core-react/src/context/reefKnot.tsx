import React, { createContext, ReactNode, useMemo, useState } from 'react';
import { ReefKnotModalContextProvider } from './reefKnotModalContext';
import type { WalletAdapterData } from '@reef-knot/types';

export type ReefKnotProviderConfig = {
  walletDataList: WalletAdapterData[];
};

export interface ReefKnotContextProps {
  config: ReefKnotProviderConfig;
  children?: ReactNode;
}

export type ReefKnotContextValue = ReefKnotProviderConfig & {
  loadingWalletId: string | null;
  setLoadingWalletId: React.Dispatch<React.SetStateAction<string | null>>;
};

export const ReefKnotContext = createContext({} as ReefKnotContextValue);

export const ReefKnotProvider = ({
  config,
  children,
}: ReefKnotContextProps) => {
  const [loadingWalletId, setLoadingWalletId] = useState<string | null>(null);

  const contextValue = useMemo(
    () => ({
      ...config,
      loadingWalletId,
      setLoadingWalletId,
    }),
    [config, loadingWalletId],
  );

  return (
    <ReefKnotContext.Provider value={contextValue}>
      <ReefKnotModalContextProvider>{children}</ReefKnotModalContextProvider>
    </ReefKnotContext.Provider>
  );
};
