import React, { ReactNode, useMemo, useState } from 'react';
import { ReefKnotModalContextProvider } from './reefKnotModalContext';
import { ReefKnotContext, ReefKnotProviderConfig } from './reefKnotContext';
import { AutoConnect } from '../components/AutoConnect';

export interface ReefKnotProviderProps {
  config: ReefKnotProviderConfig;
  children?: ReactNode;
}

export const ReefKnotProvider = ({
  config,
  children,
}: ReefKnotProviderProps) => {
  const [loadingWalletId, setLoadingWalletId] = useState<string | null>(null);
  const { autoConnect } = config;

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
      <ReefKnotModalContextProvider>
        {autoConnect && <AutoConnect autoConnect />}
        {children}
      </ReefKnotModalContextProvider>
    </ReefKnotContext.Provider>
  );
};
