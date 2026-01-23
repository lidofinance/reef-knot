import { FC } from 'react';
import { useConnection } from 'wagmi';
import { ThemeToggler } from '@lidofinance/lido-ui';

import WalletButton from 'components/layout/header/walletButton';
import WalletConnect from 'components/layout/header/walletConnect';
import { HeaderWalletInfoButton } from 'components/layout/header/header-wallet-info-button';

import { getChainColor } from 'utils/getChainColor';

import { HeaderWalletChainStyle } from './headerWalletStyles';

const HeaderWallet: FC = () => {
  const { chain, chainId, isConnected } = useConnection();

  return (
    <>
      {chainId && (
        <HeaderWalletChainStyle $color={getChainColor(chainId)}>
          {chain?.name}
        </HeaderWalletChainStyle>
      )}
      {isConnected ? <WalletButton /> : <WalletConnect size="sm" />}
      <HeaderWalletInfoButton />
      <ThemeToggler />
    </>
  );
};

export default HeaderWallet;
