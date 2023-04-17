import { ElementType } from 'react';
import { Connector } from 'wagmi';

export type WalletAdapterIcons = {
  light: ElementType;
  dark: ElementType;
};

export type WalletAdapterData = {
  walletId: string;
  walletName: string;

  // Icons for the light and dark color themes.
  // You can use different icons or the same icon for both cases.
  icon?: ElementType | WalletAdapterIcons;
  // Deprecated, use "icon" instead, TODO: remove
  icons?: WalletAdapterIcons;

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

  connector: Connector;
};

export type WalletAdapterType = () => WalletAdapterData;

export type WalletsListType = Record<string, WalletAdapterType>;
