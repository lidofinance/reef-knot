import { FC } from 'react';
import { ButtonProps } from '@lidofinance/lido-ui';

import { useModal } from 'hooks/useModal';
import { MODAL } from 'providers';
import { useConnection } from 'wagmi';
import AddressBadge from 'components/layout/header/walletButton/addressBadge';

import {
  WalletButtonStyle,
  WalletButtonWrapperStyle,
} from './walletButtonStyles';

const WalletButton: FC<ButtonProps> = (props) => {
  const { onClick, ...rest } = props;
  const { openModal } = useModal(MODAL.wallet);
  const { address } = useConnection();

  return (
    <WalletButtonStyle
      size="sm"
      variant="text"
      color="secondary"
      onClick={openModal}
      data-testid="walletBtn"
      {...rest}
    >
      <WalletButtonWrapperStyle>
        <AddressBadge address={address} />
      </WalletButtonWrapperStyle>
    </WalletButtonStyle>
  );
};

export default WalletButton;
