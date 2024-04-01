import { FC } from 'react';

import { useClientConfig } from 'providers/client-config';

import { WalletInfoContent } from './wallet-info-content';
import { WrapperStyle, ContainerStyle } from './styles';

export const WalletInfo: FC = () => {
  const { isWalletInfoIsOpen } = useClientConfig();

  return (
    <ContainerStyle>
      <WrapperStyle $show={isWalletInfoIsOpen}>
        <WalletInfoContent />
      </WrapperStyle>
    </ContainerStyle>
  );
};
