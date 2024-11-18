import { FC } from 'react';

import {
  StatsWrapperStyle,
  StatsTokenStyle,
  StatsValueStyle,
  InlineLoaderStyle,
  ContentWrapperStyle,
} from './stats-item-styles';

type StatsItemProps = {
  token: 'ETH' | 'stETH' | 'wstETH';
  value: string;
  loading?: boolean;
};

export const StatsItem: FC<StatsItemProps> = ({ value, token, loading }) => {
  let shortValue = value.slice(0, 8);

  if (value.length > 8) {
    shortValue += '...';
  }

  return (
    <StatsWrapperStyle>
      <ContentWrapperStyle>
        <StatsValueStyle>
          {loading ? <InlineLoaderStyle /> : shortValue}
        </StatsValueStyle>
        <StatsTokenStyle>{token}</StatsTokenStyle>
      </ContentWrapperStyle>
    </StatsWrapperStyle>
  );
};
