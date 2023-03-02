import { ElementType } from 'react';

export type WalletAdapterData = {
  walletId: string;
  walletName: string;

  // Icons for the light and dark color themes.
  // You can use different icons or the same for both cases.
  icons: {
    light: ElementType;
    dark: ElementType;
  };

  // A function to check if the wallet is installed and injected.
  // For example: isMetaMaskProvider: () => !!window.ethereum?.isMetaMask
  detector: () => boolean;

  // URL to redirect a user if the Wallet Button was clicked,
  // but the wallet is not installed or active
  downloadURLs: {
    default: string;
    android?: string;
    ios?: string;
  };
};

export type WalletAdapterType = () => WalletAdapterData;

export type WalletsListType = Record<string, WalletAdapterType>;
