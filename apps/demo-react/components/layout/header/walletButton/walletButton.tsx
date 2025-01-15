import { FC } from 'react';
import { ButtonProps } from '@lidofinance/lido-ui';

import { useModal } from 'hooks/useModal';
import { MODAL } from 'providers';
import { useWeb3 } from 'reef-knot/web3-react';
import AddressBadge from 'components/layout/header/walletButton/addressBadge';

import {
  WalletButtonStyle,
  WalletButtonWrapperStyle,
} from './walletButtonStyles';

const WalletButton: FC<ButtonProps> = (props) => {
  const { onClick, ...rest } = props;
  const { openModal } = useModal(MODAL.wallet);
  const { account } = useWeb3();

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
        <AddressBadge address={account} />
      </WalletButtonWrapperStyle>
    </WalletButtonStyle>
  );
};

export default WalletButton;
