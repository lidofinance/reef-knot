import { WalletAdapterData } from './walletAdapter';

export type ReefKnotProviderConfig = {
  autoConnect: boolean;
  walletDataList: WalletAdapterData[];
  onAutoConnect?: () => void;
  onReconnect?: () => void;
};

export type ReefKnotContextValue = ReefKnotProviderConfig & {
  loadingWalletId: string | null;
  setLoadingWalletId: React.Dispatch<React.SetStateAction<string | null>>;
};

export type ReefKnotConfig = Omit<ReefKnotProviderConfig, 'walletDataList'>;
