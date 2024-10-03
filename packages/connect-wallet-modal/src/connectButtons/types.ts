import type {
  ConnectWalletButtonProps,
  WalletAdapterData,
} from '@reef-knot/types';

export type ConnectInjectedProps = WalletAdapterData & ConnectWalletButtonProps;
export type ConnectWCProps = WalletAdapterData & ConnectWalletButtonProps;
export type ConnectLedgerProps = WalletAdapterData & ConnectWalletButtonProps;
