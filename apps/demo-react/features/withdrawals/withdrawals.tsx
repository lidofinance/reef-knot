import { FC, useCallback, useState } from 'react';
import { Select, Option } from '@lidofinance/lido-ui';
import { useWeb3 } from 'reef-knot/web3-react';
import { useLidoSDK } from 'providers/sdk';

import { transactionToast } from 'utils/transaction-toast';
import { ActionItem } from 'components';
import { useInputValueSDK } from 'providers';

enum TokenType {
  stETH = 'stETH',
  wstETH = 'wstETH',
}

export const Withdrawals: FC = () => {
  const { inputValue } = useInputValueSDK();

  const [token, setType] = useState<TokenType>(TokenType.stETH);
  const { account: web3account = '0x0' } = useWeb3();
  const account = web3account as `0x{string}`;

  const { withdraw } = useLidoSDK();

  const handleCall = useCallback(async () => {
    const requestValue = inputValue ?? BigInt(0);

    return await withdraw.request.requestWithdrawalWithPermit({
      account,
      amount: requestValue,
      token,
      callback: transactionToast,
    });
  }, [account, token, inputValue, withdraw]);

  const handleTokenChange = (value: string | number) => {
    setType(value as TokenType);
  };

  return (
    <ActionItem title="Permit request" action={handleCall}>
      <Select value={token} onChange={handleTokenChange}>
        <Option value={TokenType.stETH}>stETH</Option>
        <Option value={TokenType.wstETH}>wstETH</Option>
      </Select>
    </ActionItem>
  );
};
