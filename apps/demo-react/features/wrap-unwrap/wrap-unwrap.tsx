import { FC, useCallback, useState } from 'react';
import { Select, Option } from '@lidofinance/lido-ui';
import { useLidoSDK } from 'providers/sdk';
import { useWeb3 } from 'reef-knot/web3-react';
import { transactionToast } from 'utils/transaction-toast';

import { ActionItem } from 'components';
import { useInputValueSDK } from 'providers';

enum CallType {
  wrap = 'wrap',
  unwrap = 'unwrap',
}

export const WrapUnwrap: FC = () => {
  const { inputValue } = useInputValueSDK();
  const [type, setType] = useState<CallType>(CallType.wrap);

  const { account: web3account = '0x0' } = useWeb3();
  const account = web3account as `0x{string}`;

  const { wrap } = useLidoSDK();
  const isWrapTx = type === CallType.wrap;

  const handleCall = useCallback(async () => {
    const callValue = inputValue ?? BigInt(0);
    const callData = {
      value: callValue,
      account,
      callback: transactionToast,
    };

    if (isWrapTx) return await wrap.wrapEth(callData);
    else return await wrap.unwrap(callData);
  }, [inputValue, account, isWrapTx, wrap]);

  const handleTypeChange = (value: string | number) => {
    setType(value as CallType);
  };
  const title = isWrapTx ? 'Wrap' : 'Unwrap';

  return (
    <ActionItem title={title} action={handleCall}>
      <Select value={type} onChange={handleTypeChange} fullwidth>
        <Option value={CallType.wrap}>Wrap</Option>
        <Option value={CallType.unwrap}>Unwrap</Option>
      </Select>
    </ActionItem>
  );
};
