import { ReactElement } from 'react';
import { ButtonProps } from '@reef-knot/ui-react';
import { WalletAdapterData } from '@reef-knot/core-react';
import { ButtonsCommonProps } from '../components';

export type ConnectButtonProps = {
  iconSrcOrReactElement: string | ReactElement;
} & ButtonProps;

export type ConnectWalletProps = ButtonsCommonProps & ButtonProps;

export type ConnectInjectedProps = WalletAdapterData & ConnectWalletProps;
