import type { ButtonProps } from '@reef-knot/ui-react';
import type { Connector, CreateConnectorFn } from 'wagmi';
import type { WalletAdapterData } from './walletAdapter';
import type { MetricsProp } from './reef-knot-wallets-modal';

export type ConnectButtonBaseProps = ButtonProps & {
  icon?: WalletAdapterData['icon'];
  darkThemeEnabled?: boolean;
  isCompact?: boolean;
  isLoading?: boolean;
};

export type ConnectWalletButtonProps = ButtonProps &
  ConnectButtonBaseProps & {
    disabled: boolean;
    walletName: string;
    onConnect?: () => void;
    metrics?: MetricsProp;
    connector: Connector | CreateConnectorFn;
    detector?: WalletAdapterData['detector'];
  };
