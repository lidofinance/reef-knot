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

  const handleCall = useCallback(async () => {
    const callValue = inputValue ?? BigInt(0);
    const method = type === CallType.wrap ? wrap.wrapEth : wrap.unwrap;

    return await method.call(wrap, {
      value: callValue,
      account,
      callback: transactionToast,
    });
  }, [inputValue, type, wrap, account]);

  const handleTypeChange = (value: string | number) => {
    setType(value as CallType);
  };
  const title = type === CallType.wrap ? 'Wrap' : 'Unwrap';

  return (
    <ActionItem title={title} action={handleCall}>
      <Select value={type} onChange={handleTypeChange}>
        <Option value={CallType.wrap}>Wrap</Option>
        <Option value={CallType.unwrap}>Unwrap</Option>
      </Select>
    </ActionItem>
  );
};
