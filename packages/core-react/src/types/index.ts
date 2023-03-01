import { ReactElement } from 'react';

export type WalletAdapterData = {
  walletId: string;
  walletName: string;
  icon?: ReactElement;
  detector: () => boolean;
};

export type WalletAdapterType = () => WalletAdapterData;

export type WalletsListType = Record<string, WalletAdapterType>;
