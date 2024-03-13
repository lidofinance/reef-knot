import styled from 'styled-components';
import { InlineLoader } from '@lidofinance/lido-ui';

import ETH from 'assets/icons/ETH.svg';
import stETH from 'assets/icons/stETH.svg';
import wstETH from 'assets/icons/wstETH.svg';

export const ETHIcon = styled.img.attrs({
  src: ETH,
  alt: 'ETH',
})`
  display: block;
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

export const stETHIcon = styled.img.attrs({
  src: stETH,
  alt: 'stETH',
})`
  display: block;
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

export const wstETHIcon = styled.img.attrs({
  src: wstETH,
  alt: 'wstETH',
})`
  display: block;
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

export const StatsWrapperStyle = styled.div`
  margin-right: 18px;
  flex-grow: 1;
  flex-basis: 0;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 1.6em;
  display: flex;
  align-items: center;

  :last-child {
    margin-right: 0;
  }
`;

export const StatsTokenStyle = styled.div`
  line-height: 24px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
`;

export const StatsValueStyle = styled.div`
  margin-top: 2px;
  font-size: ${({ theme }) => theme.fontSizesMap.md}px;
  font-weight: 800;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  margin-right: 8px;
`;

export const InlineLoaderStyle = styled(InlineLoader)`
  min-width: 60px;
`;

export const ContentWrapperStyle = styled.div`
  display: flex;
  align-items: baseline;
`;
