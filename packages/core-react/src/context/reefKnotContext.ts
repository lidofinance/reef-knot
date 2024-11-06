import { createContext } from 'react';
import type { WalletAdapterData } from '@reef-knot/types';

/**
 * Context definition is in separated file to avoid circular dependencies
 */

export type ReefKnotProviderConfig = {
  autoConnect: boolean;
  walletDataList: WalletAdapterData[];
};

export type ReefKnotContextValue = ReefKnotProviderConfig & {
  loadingWalletId: string | null;
  setLoadingWalletId: React.Dispatch<React.SetStateAction<string | null>>;
};

export const ReefKnotContext = createContext({} as ReefKnotContextValue);
