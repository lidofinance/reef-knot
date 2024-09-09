import type { ButtonProps } from '@reef-knot/ui-react';
import type { WalletAdapterData } from '@reef-knot/types';
import type { MetricsProp } from '../components';
import type { Connector, CreateConnectorFn } from 'wagmi';
import type { ConnectButtonBaseProps } from '../components/ConnectButtonBase/types';

export type ConnectWalletButtonProps = ButtonProps &
  ConnectButtonBaseProps & {
    disabled: boolean;
    walletName: string;
    onConnect?: () => void;
    metrics?: MetricsProp;
    connector: Connector | CreateConnectorFn;
  };

export type ConnectInjectedProps = WalletAdapterData & ConnectWalletButtonProps;
export type ConnectWCProps = WalletAdapterData & ConnectWalletButtonProps;
export type ConnectLedgerProps = WalletAdapterData & ConnectWalletButtonProps;
