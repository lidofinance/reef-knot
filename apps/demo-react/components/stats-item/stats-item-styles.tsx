import styled from 'styled-components';
import { InlineLoader } from '@lidofinance/lido-ui';

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
  margin-left: 8px;
`;
