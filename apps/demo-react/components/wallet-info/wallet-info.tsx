import { useState, FC } from 'react';

import {
  WrapperStyle,
  ContainerStyle,
  ArrowLeftStyle,
  ButtonIconStyle,
} from './styles';
import { WalletInfoContent } from './wallet-info-content';

export const WalletInfo: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ContainerStyle>
      <WrapperStyle $show={isOpen}>
        <ButtonIconStyle
          onClick={() => setIsOpen(!isOpen)}
          icon={<ArrowLeftStyle $open={isOpen} />}
          size="xs"
          variant="ghost"
        />
        <WalletInfoContent />
      </WrapperStyle>
    </ContainerStyle>
  );
};
