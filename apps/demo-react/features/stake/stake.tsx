import { FC, useCallback, useState } from 'react';
import { Input } from '@lidofinance/lido-ui';
import { useLidoSDK } from 'providers/sdk';
import { useWeb3 } from 'reef-knot/web3-react';
import { transactionToast } from 'utils/transaction-toast';

import { ActionItem } from 'components';
import { useInputValueSDK } from 'providers';

export const Stake: FC = () => {
  const { inputValue } = useInputValueSDK();

  const [referralAddressState, setReferralAddress] = useState('');
  const referralAddress = referralAddressState
    ? (referralAddressState as `0x{string}`)
    : undefined;
  const { account: web3account = '0x0' } = useWeb3();
  const account = web3account as `0x{string}`;

  const { stake } = useLidoSDK();

  const handleStake = useCallback(async () => {
    const stakingValue = inputValue ?? BigInt(0);

    return await stake.stakeEth({
      value: stakingValue,
      account,
      referralAddress,
      callback: transactionToast,
    });
  }, [account, stake, inputValue, referralAddress]);

  return (
    <ActionItem title="Stake" action={handleStake}>
      <Input
        label="referral address"
        placeholder="0x0000000"
        value={referralAddressState}
        onChange={(e) => setReferralAddress(e.currentTarget.value)}
      />
    </ActionItem>
  );
};
