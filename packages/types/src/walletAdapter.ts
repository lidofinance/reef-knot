import { ElementType } from 'react';
import { Connector } from 'wagmi';
import type { Chain } from 'wagmi/chains';

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

  // A function to check if the wallet is installed and injected.
  // For example: isMetaMaskProvider: () => !!window.ethereum?.isMetaMask
  detector?: () => boolean;

  // The wallet can be connected via automatic connection only.
  // The `detector` method will be called during auto connection, to decide if the wallet should be connected.
  // The wallet will have no button in the wallet connection modal UI.
  autoConnectOnly?: boolean;

  // URL to redirect a user if the Wallet Button was clicked,
  // but the wallet is not installed or active
  downloadURLs?: {
    default: string;
    android?: string;
    ios?: string;
  };

  connector: Connector;

  // Additional options for wallets based on WalletConnect
  walletconnectExtras?: {
    // Option for direct connection via WalletConnect (WC) URI (without QR code modal)
    connectionViaURI?: {
      // Should be WC connector with disabled QR code
      connector: Connector;
      // In which case this connection type must be used instead the default connector
      condition: boolean;
      // Where to redirect when WC URI is ready
      // WC URI will be added to then end of this link,
      // so it should look similar to "https://<wallet-website-address>/wc?uri="
      redirectLink: string;
      // Close the new window, used for redirection, after successful connect
      closeRedirectionWindow?: boolean;
    };
  };
};

export interface WalletAdapterArgs {
  rpc: Record<number, string>;
  chains: Chain[];
  defaultChain: Chain;
  walletconnectProjectId?: string;
}
export type WalletAdapterType = (args: WalletAdapterArgs) => WalletAdapterData;

export type WalletsListType = Record<string, WalletAdapterType>;
