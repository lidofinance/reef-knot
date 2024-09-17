import { FC, useCallback, useState } from 'react';
import { Select, Option } from '@lidofinance/lido-ui';
import { WrapProps } from '@lidofinance/lido-ethereum-sdk';
import { useLidoSDK } from 'providers/sdk';
import { useWeb3 } from 'reef-knot/web3-react';
import { transactionToast } from 'utils/transaction-toast';

import { ActionItem } from 'components';
import { useInputValueSDK } from 'providers';

enum CallType {
  wrapEth = 'wrapEth',
  wrapSteth = 'wrapSteth',
  unwrap = 'unwrap',
}

export const WrapUnwrap: FC = () => {
  const { inputValue } = useInputValueSDK();
  const [type, setType] = useState<CallType>(CallType.wrapEth);

  const { account: web3account = '0x0' } = useWeb3();
  const account = web3account as `0x{string}`;

  const { wrap } = useLidoSDK();
  const isWrapTx = type === CallType.wrapEth || type === CallType.wrapSteth;

  const handleWrapSteth = useCallback(
    async (callData: WrapProps) => {
      await wrap.getStethForWrapAllowance(account); // get existing allowance
      await wrap.approveStethForWrap(callData); // if value is more than allowance perform approve
      return wrap.wrapSteth(callData);
    },
    [account, wrap],
  );

  const handleCall = useCallback(async () => {
    const callValue = inputValue ?? BigInt(0);
    const callData = {
      value: callValue,
      account,
      callback: transactionToast,
    };

    switch (type) {
      case CallType.wrapEth:
        return wrap.wrapEth(callData);
      case CallType.wrapSteth:
        return handleWrapSteth(callData);
      case CallType.unwrap:
        return wrap.unwrap(callData);
    }
  }, [inputValue, account, type, wrap, handleWrapSteth]);

  const handleTypeChange = (value: string | number) => {
    setType(value as CallType);
  };
  const title = isWrapTx ? 'Wrap' : 'Unwrap';

  return (
    <ActionItem title={title} action={handleCall}>
      <Select value={type} onChange={handleTypeChange} fullwidth>
        <Option value={CallType.wrapEth}>Wrap ETH</Option>
        <Option value={CallType.wrapSteth}>Wrap stETH</Option>
        <Option value={CallType.unwrap}>Unwrap</Option>
      </Select>
    </ActionItem>
  );
};
