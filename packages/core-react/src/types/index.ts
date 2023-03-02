import { ElementType } from 'react';

export type WalletAdapterData = {
  walletId: string;
  walletName: string;
  icon: ElementType;
  detector: () => boolean;
};

export type WalletAdapterType = () => WalletAdapterData;

export type WalletsListType = Record<string, WalletAdapterType>;
