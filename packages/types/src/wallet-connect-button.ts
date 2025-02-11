import type { ButtonProps } from '@reef-knot/ui-react';
import type { Connector, CreateConnectorFn } from 'wagmi';
import type { WalletAdapterData } from './walletAdapter';

export type ConnectButtonBaseProps = ButtonProps & {
  icon?: WalletAdapterData['icon'];
  darkThemeEnabled?: boolean;
  isCompact?: boolean;
  isLoading?: boolean;
};

export type ConnectWalletButtonProps = ConnectButtonBaseProps & {
  walletId: WalletAdapterData['walletId'];
  walletName: WalletAdapterData['walletName'];
  detector?: WalletAdapterData['detector'];
  deeplink?: WalletAdapterData['deeplink'];
  downloadURLs?: WalletAdapterData['downloadURLs'];
  walletconnectExtras?: WalletAdapterData['walletconnectExtras'];
  connector: Connector | CreateConnectorFn;
  disabled: boolean;
  onConnectStart?: () => void;
  onConnectSuccess?: () => void;
};
