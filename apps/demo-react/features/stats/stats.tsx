import { memo } from 'react';
import { formatEther } from 'viem';
import { ThemeProvider, themeLight } from '@lidofinance/lido-ui';
import { useWeb3 } from 'reef-knot/web3-react';
import { useConnectorInfo } from 'reef-knot/core-react';

import { StatsItem, TokenInput } from 'components';
import { useETHBalance } from 'hooks/ethBalance';
import { useStETHBalance } from 'hooks/stethBalance';
import { useWstETHBalance } from 'hooks/wstethBalance';
import { WalletFallback } from 'components/wallet-fallback';

import { useInputValueSDK } from 'providers';
import {
  StatsWrapperStyle,
  BalancesWrapperStyle,
  InfoWrapperStyle,
  LeftColumnStyle,
  RightColumnStyle,
  TokenInputWrapperStyle,
  WalletInfoTitleStyle,
  WalletInfoValueStyle,
} from './stats-styles';

const StatsComponent = () => {
  const { setInputValue, inputValue } = useInputValueSDK();
  const ethBalance = useETHBalance();
  const stethBalance = useStETHBalance();
  const wstethBalance = useWstETHBalance();

  const { connectorName } = useConnectorInfo();
  const web3Info = useWeb3();

  const ethAmount = ethBalance.error
    ? 'N/A'
    : formatEther(ethBalance.data || BigInt(0));
  const stethAmount = stethBalance.error
    ? 'N/A'
    : formatEther(stethBalance.data || BigInt(0));
  const wstethAmount = wstethBalance.error
    ? 'N/A'
    : formatEther(wstethBalance.data || BigInt(0));

  return (
    <StatsWrapperStyle>
      <LeftColumnStyle>
        <TokenInputWrapperStyle>
          <ThemeProvider theme={themeLight}>
            <TokenInput
              label="Value"
              fullwidth
              onChange={setInputValue}
              value={inputValue}
            />
          </ThemeProvider>
        </TokenInputWrapperStyle>
      </LeftColumnStyle>
      <RightColumnStyle>
        <InfoWrapperStyle>
          <div>
            <WalletInfoTitleStyle>Provider:</WalletInfoTitleStyle>
            <WalletInfoValueStyle>{connectorName}</WalletInfoValueStyle>
          </div>
          <div>
            <WalletInfoTitleStyle>Network:</WalletInfoTitleStyle>
            <WalletInfoValueStyle>{web3Info.chainId}</WalletInfoValueStyle>
          </div>
        </InfoWrapperStyle>
        <BalancesWrapperStyle>
          <StatsItem
            token="ETH"
            value={ethAmount}
            loading={ethBalance.isLoading}
          />
          <StatsItem
            token="stETH"
            value={stethAmount}
            loading={stethBalance.isLoading}
          />
          <StatsItem
            token="wstETH"
            value={wstethAmount}
            loading={wstethBalance.isLoading}
          />
        </BalancesWrapperStyle>
      </RightColumnStyle>
    </StatsWrapperStyle>
  );
};

export const Stats = memo((props) => {
  const { active } = useWeb3();

  return active ? <StatsComponent {...props} /> : <WalletFallback {...props} />;
});
