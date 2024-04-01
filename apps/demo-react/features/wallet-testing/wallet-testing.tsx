import { Stake, WrapUnwrap, Withdrawals, Permit, Claim } from 'features';

import { WrapperStyle, ActionsBlockStyle } from './wallet-testing-styles';

export const WalletTesting = () => {
  return (
    <WrapperStyle>
      <ActionsBlockStyle>
        <Stake />
        <Withdrawals />
        <WrapUnwrap />
        <Permit />
        <Claim />
      </ActionsBlockStyle>
    </WrapperStyle>
  );
};
