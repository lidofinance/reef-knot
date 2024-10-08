import { FC } from 'react';
import { CHAINS, getChainColor } from '@lido-sdk/constants';

import { useWeb3 } from 'reef-knot/web3-react';
import { ThemeToggler } from '@lidofinance/lido-ui';

import WalletButton from 'components/layout/header/walletButton';
import WalletConnect from 'components/layout/header/walletConnect';
import { HeaderWalletInfoButton } from 'components/layout/header/header-wallet-info-button';

import { HeaderWalletChainStyle } from './headerWalletStyles';

const tryGetChainColor = (chainId: CHAINS) => {
  // getChainColor can throw "Error: Invariant failed: Chain is not supported"
  try {
    return getChainColor(chainId);
  } catch (e) {
    return '#29b6af'; // fallback color
  }
};

const HeaderWallet: FC = () => {
  const { active, chainId } = useWeb3();
  const chainName = chainId && CHAINS[chainId];

  return (
    <>
      {chainId && (
        <HeaderWalletChainStyle $color={tryGetChainColor(chainId)}>
          {chainName}
        </HeaderWalletChainStyle>
      )}
      {active ? <WalletButton /> : <WalletConnect size="sm" />}
      <HeaderWalletInfoButton />
      <ThemeToggler />
    </>
  );
};

export default HeaderWallet;
