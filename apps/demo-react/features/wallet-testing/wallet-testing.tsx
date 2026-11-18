import {
  Stake,
  WrapUnwrap,
  Withdrawals,
  Permit,
  Claim,
  EIP712Test,
} from 'features';

import { WrapperStyle, ActionsBlockStyle } from './wallet-testing-styles';

export const WalletTesting = () => {
  return (
    <WrapperStyle>
      <ActionsBlockStyle>
        <Stake />
        <WrapUnwrap />
        <Withdrawals />
        <Permit />
        <Claim />
      </ActionsBlockStyle>
      <EIP712Test />
    </WrapperStyle>
  );
};
