import React from 'react';
import { ButtonProps } from '@reef-knot/ui-react';
import { ButtonsCommonProps } from '../WalletsModal';

export type ConnectButtonProps = {
  iconSrcOrReactElement: string | React.ReactElement;
} & ButtonProps;

export type ConnectWalletProps = ButtonsCommonProps & ButtonProps;
