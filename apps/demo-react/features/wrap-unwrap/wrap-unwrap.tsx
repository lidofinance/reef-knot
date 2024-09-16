import { FC, useCallback, useState } from 'react';
import { Select, Option } from '@lidofinance/lido-ui';
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

  const handleCall = useCallback(async () => {
    const callValue = inputValue ?? BigInt(0);
    const callData = {
      value: callValue,
      account,
      callback: transactionToast,
    };

    switch (type) {
      case CallType.wrapEth:
        return await wrap.wrapEth(callData);
      case CallType.wrapSteth:
        return await wrap.wrapSteth(callData);
      case CallType.unwrap:
        return await wrap.unwrap(callData);
    }
  }, [inputValue, account, type, wrap]);

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
