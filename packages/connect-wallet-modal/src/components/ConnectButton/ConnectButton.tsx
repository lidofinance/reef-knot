import React, { ElementType, FC, isValidElement } from 'react';
import { WalletAdapterData, WalletAdapterIcons } from '@reef-knot/types';
import {
  ConnectButtonStyle,
  ConnectButtonContentStyle,
  ConnectButtonLoaderStyle,
  ConnectButtonIconStyle,
  ConnectButtonTitleStyle,
} from './styles';
import { ConnectButtonProps } from '../../connectButtons/types';

// Check that icon's type is WalletAdapterIcons by looking at its "light" and "dark" fields
function isWalletAdapterIcons(
  icon: WalletAdapterData['icon'],
): icon is WalletAdapterIcons {
  return Boolean(
    icon &&
      (icon as WalletAdapterIcons).light &&
      (icon as WalletAdapterIcons).dark,
  );
}

const ConnectButton: FC<ConnectButtonProps> = (props: ConnectButtonProps) => {
  const {
    icon,
    shouldInvertWalletIcon,
    children,
    isCompact,
    isLoading = false,
    ...rest
  } = props;

  let ButtonIcon: ElementType = React.Fragment;
  if (icon) {
    if (isWalletAdapterIcons(icon)) {
      ButtonIcon = shouldInvertWalletIcon ? icon.dark : icon.light;
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

export default ConnectButton;
