import type { ElementType } from 'react';
import type { Chain } from 'wagmi/chains';
import type { CreateConnectorFn } from 'wagmi';
import type { Store as ProvidersStore } from 'mipd';

export type WalletAdapterIcons = {
  light: ElementType;
  dark: ElementType;
};

export type WalletAdapterData = {
  walletId: string;
  walletName: string;

  // The `type` field is intended to match a wagmi connector's `type` field.
  // Example values are: 'injected', 'walletConnect'
  type: string;

  // Icons for the light and dark color themes.
  // You can use different icons or the same icon for both cases.
  icon?: ElementType | WalletAdapterIcons;

  // A function to check if the wallet is installed and injected.
  detector?: () => boolean | Promise<boolean>;

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

  deeplink?: string;

  createConnectorFn: CreateConnectorFn;

  // Additional options for wallets based on WalletConnect
  walletconnectExtras?: {
    // Option for direct connection via WalletConnect (WC) URI (without QR code modal)
    connectionViaURI?: {
      // Should be WC connector with disabled QR code
      createConnectorFn: CreateConnectorFn;
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
  defaultChain: Chain;
  walletconnectProjectId?: string;
  safeAllowedDomains?: RegExp[];
  providersStore: ProvidersStore;
}
export type WalletAdapterType = (args: WalletAdapterArgs) => WalletAdapterData;
