import { useMemo } from 'react';
import { parseEther } from '@ethersproject/units';
import { BigNumber } from 'ethers';


import { useContractSWR, useWSTETHContractRPC } from '@lido-sdk/react';
import { TOKENS } from '@lido-sdk/constants';

import { MAX_REQUESTS_COUNT, MAX_REQUESTS_COUNT_LEDGER_LIMIT, STRATEGY_LAZY } from './useWithdrawalsData';
import { useIsLedgerLive } from './useIsLedgerLive';
import { useToken } from './useToken';
import { useWithdrawalsBaseData } from './useWithdrawalsBaseData';

export const useSplitRequest = (inputValue: string, selectedToken: TOKENS) => {
  const isLedgerLive = useIsLedgerLive();
  const maxRequestCount = isLedgerLive
    ? MAX_REQUESTS_COUNT_LEDGER_LIMIT
    : MAX_REQUESTS_COUNT;
  const { token } = useToken(selectedToken);

  const wstethContract = useWSTETHContractRPC();

  const isWSteth = token === TOKENS.WSTETH;
  const maxAmountSteth = useWithdrawalsBaseData().data?.maxAmount;
  const maxAmountWsteth = useContractSWR({
    contract: wstethContract,
    method: 'getWstETHByStETH',
    params: [maxAmountSteth],
    shouldFetch: !!(isWSteth && maxAmountSteth),
    config: STRATEGY_LAZY,
  }).data;

  const maxAmount = isWSteth ? maxAmountWsteth : maxAmountSteth;

  return useMemo(() => {
    if (
      !maxAmount ||
      !inputValue ||
      isNaN(Number(inputValue))
    )
      return { requests: [], requestCount: 0, areRequestsValid: false };

    const parsedInputValue = parseEther(inputValue);
    const max = maxAmount.mul(maxRequestCount);
    const isMoreThanMax = parsedInputValue.gt(max);

    const requestCount = parsedInputValue.div(maxAmount).toNumber();
    const lastRequestAmountEther = parsedInputValue.mod(maxAmount);
    const hasRest = lastRequestAmountEther.gt(0);
    const requests: BigNumber[] = [];

    if (isMoreThanMax) {
      return {
        requests,
        requestCount: requestCount + (hasRest ? 1 : 0),
        areRequestsValid: false,
      };
    }

    for (let i = 0; i < requestCount; i++) {
      requests.push(maxAmount);
    }
    if (hasRest) requests.push(lastRequestAmountEther);

    return {
      requests,
      requestCount: requestCount + (hasRest ? 1 : 0),
      areRequestsValid: requests.length > 0,
    };

  }, [inputValue, maxAmount, maxRequestCount, selectedToken]);
};
