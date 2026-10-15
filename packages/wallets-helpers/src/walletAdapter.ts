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

  // EIP-6963 Reverse Domain Name System identifier.
  // Set this for adapters that use EIP-6963 provider discovery so that
  // the generic Browser Wallet picker can exclude them from its list.
  rdns?: string;

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
};

export interface WalletAdapterArgs {
  rpc: Record<number, string>;
  defaultChain: Chain;
  walletconnectProjectId?: string;
  safeAllowedDomains?: RegExp[];
  ledgerForceClearSign?: boolean;
  providersStore: ProvidersStore;
}
export type WalletAdapterType = (args: WalletAdapterArgs) => WalletAdapterData;
