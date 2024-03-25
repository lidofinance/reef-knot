import { Stake, WrapUnwrap, Withdrawals, Permit } from 'features';

import {
  WrapperStyle,
  ActionsBlockStyle,
  ColumnStyle,
} from './wallet-testing-styles';

export const WalletTesting = () => {
  return (
    <WrapperStyle>
      <ActionsBlockStyle>
        <ColumnStyle>
          <Stake />
          <WrapUnwrap />
        </ColumnStyle>
        <ColumnStyle>
          <Withdrawals />
          <Permit />
        </ColumnStyle>
      </ActionsBlockStyle>
    </WrapperStyle>
  );
};
