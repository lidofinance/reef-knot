import React, { ReactElement } from 'react';
import { ButtonProps } from '@reef-knot/ui-react';
import { ButtonsCommonProps } from '../components';

export type ConnectButtonProps = {
  iconSrcOrReactElement: string | React.ReactElement;
} & ButtonProps;

export type ConnectWalletProps = ButtonsCommonProps & ButtonProps;

export type ConnectInjectedProps = {
  walletId: string;
  walletName: string;
  icon: ReactElement;
  detector: () => boolean;
} & ConnectWalletProps;
