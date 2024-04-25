import { ButtonProps } from '@reef-knot/ui-react';
import { WalletConnectorData } from '@reef-knot/types';
import { ButtonsCommonProps } from '../components';

export type ConnectButtonProps = {
  icon: WalletConnectorData['icon'];
  shouldInvertWalletIcon?: boolean;
  isCompact?: boolean;
} & ButtonProps;

export type ConnectWalletProps = ButtonsCommonProps & ButtonProps;

export type ConnectInjectedProps = WalletConnectorData & ConnectWalletProps;
export type ConnectWCProps = WalletConnectorData & ConnectWalletProps;
export type ConnectLedgerProps = WalletConnectorData & ConnectWalletProps;
