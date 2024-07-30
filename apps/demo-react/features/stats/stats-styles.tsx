import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';

export const StatsWrapperStyle = styled(Block)`
  display: flex;
  background: linear-gradient(129deg, #667289 12.62%, #2a2539 72.47%);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  margin-bottom: -16px;
  gap: 70px;
  padding: 24px 32px;
  padding-bottom: 40px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: column;
    gap: 24px;
  }
`;

export const LeftColumnStyle = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

export const TokenInputWrapperStyle = styled.div`
  flex-grow: 1;
`;

export const RightColumnStyle = styled.div`
  flex: 2;
  flex-direction: column;
  display: flex;
`;

export const BalancesWrapperStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 24px;
`;

export const InfoWrapperStyle = styled.div`
  display: flex;

  & div {
    margin-right: 34px;
  }

  & div:last-child {
    margin-right: 0;
  }
`;

export const WalletInfoTitleStyle = styled.span`
  font-size: 14px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.6);
  margin-right: 8px;
`;

export const WalletInfoValueStyle = styled.span`
  font-size: 14px;
  line-height: 24px;
  color: #fff;
`;
