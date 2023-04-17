import { ButtonProps } from '@reef-knot/ui-react';
import { WalletAdapterData } from '@reef-knot/types';
import { ButtonsCommonProps } from '../components';

export type ConnectButtonProps = {
  icon: WalletAdapterData['icon'];
  shouldInvertWalletIcon?: boolean;
} & ButtonProps;

export type ConnectWalletProps = ButtonsCommonProps & ButtonProps;

export type ConnectInjectedProps = WalletAdapterData & ConnectWalletProps;
