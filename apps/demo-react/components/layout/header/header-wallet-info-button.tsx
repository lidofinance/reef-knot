import { ReactComponent as GearIcon } from 'assets/icons/system.svg';
import { useClientConfig } from 'providers/client-config';

import { HeaderControlButton } from './header-control-button';

export const HeaderWalletInfoButton = () => {
  const { setIsWalletInfoIsOpen } = useClientConfig();

  return (
    <HeaderControlButton onClick={() => setIsWalletInfoIsOpen(true)}>
      <GearIcon />
    </HeaderControlButton>
  );
};
