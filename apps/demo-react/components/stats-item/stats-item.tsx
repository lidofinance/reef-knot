import { FC } from 'react';
// import { ReactComponent as ETHIcon } from 'assets/icons/ETH.svg';
// import { ReactComponent as stETHIcon } from 'assets/icons/stETH.svg';
// import { ReactComponent as wstETHIcon } from 'assets/icons/wstETH.svg';

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

// const ICONS = {
//   ETH: ETHIcon,
//   stETH: stETHIcon,
//   wstETH: wstETHIcon,
// };

export const StatsItem: FC<StatsItemProps> = ({ value, token, loading }) => {
  let shortValue = value.slice(0, 8);

  if (value.length > 8) {
    shortValue += '...';
  }

  // const Icon = ICONS[token];

  return (
    <StatsWrapperStyle>
      {/*<Icon />*/}
      <ContentWrapperStyle>
        <StatsValueStyle>
          {loading ? <InlineLoaderStyle /> : shortValue}
        </StatsValueStyle>
        <StatsTokenStyle>{token}</StatsTokenStyle>
      </ContentWrapperStyle>
    </StatsWrapperStyle>
  );
};
