import { FC, useCallback, useState } from 'react';
import { Select, Option } from '@lidofinance/lido-ui';
import { useLidoSDK } from 'providers/sdk';
import { useWeb3 } from 'reef-knot/web3-react';
import { LIDO_CONTRACT_NAMES } from '@lidofinance/lido-ethereum-sdk/common';

import { ActionItem } from 'components';
import { useInputValueSDK } from 'providers';

enum TokenType {
  stETH = 'stETH',
  wstETH = 'wstETH',
}

export const Permit: FC = () => {
  const { inputValue } = useInputValueSDK();

  const [token, setType] = useState<TokenType>(TokenType.stETH);
  const { account: web3account = '0x0' } = useWeb3();
  const account = web3account as `0x{string}`;

  const { core } = useLidoSDK();

  const handlePermit = useCallback(async () => {
    const permitValue = inputValue ?? BigInt(0);

    const contract = token === TokenType.stETH ? 'lido' : 'wsteth';

    const spender = await core.getContractAddress(
      contract as LIDO_CONTRACT_NAMES,
    );

    return core.signPermit({
      token,
      account,
      spender,
      amount: permitValue,
    });
  }, [account, core, inputValue, token]);

  const handleTokenChange = (value: string | number) => {
    setType(value as TokenType);
  };

  return (
    <ActionItem action={handlePermit} title="Permit">
      <Select value={token} onChange={handleTokenChange} fullwidth>
        <Option value={TokenType.stETH}>stETH</Option>
        <Option value={TokenType.wstETH}>wstETH</Option>
      </Select>
    </ActionItem>
  );
};
