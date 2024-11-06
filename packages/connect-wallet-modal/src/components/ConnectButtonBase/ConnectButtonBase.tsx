import React, { ElementType, FC, isValidElement } from 'react';
import {
  ConnectButtonStyle,
  ConnectButtonContentStyle,
  ConnectButtonLoaderStyle,
  ConnectButtonIconStyle,
  ConnectButtonTitleStyle,
} from './styles';
import { ConnectButtonBaseProps } from '@reef-knot/types';
import { isWalletAdapterIcons } from '../../helpers/isWalletAdapterIcons';

export const ConnectButtonBase: FC<ConnectButtonBaseProps> = (props) => {
  const {
    icon,
    darkThemeEnabled,
    children,
    isCompact,
    isLoading = false,
    ...rest
  } = props;

  let ButtonIcon: ElementType = React.Fragment;
  if (icon) {
    if (isWalletAdapterIcons(icon)) {
      ButtonIcon = darkThemeEnabled ? icon.dark : icon.light;
    } else {
      ButtonIcon = icon;
    }
  }

  return (
    <ConnectButtonStyle {...rest} type="button">
      <ConnectButtonLoaderStyle $isLoading={isLoading}>
        <ConnectButtonContentStyle>
          <ConnectButtonIconStyle $isCompact={isCompact}>
            {isValidElement(<ButtonIcon />) && <ButtonIcon />}
          </ConnectButtonIconStyle>
          <ConnectButtonTitleStyle>{children}</ConnectButtonTitleStyle>
        </ConnectButtonContentStyle>
      </ConnectButtonLoaderStyle>
    </ConnectButtonStyle>
  );
};
