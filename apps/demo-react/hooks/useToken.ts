import { useMemo } from 'react';
import { TOKENS } from '@lido-sdk/constants';
import {
  useWSTETHContractWeb3,
  useSTETHBalance,
  useWSTETHBalance,
  useSTETHContractWeb3,
} from '@lido-sdk/react';

export const useToken = (selectedToken: TOKENS) => {
  const wstethContractWeb3 = useWSTETHContractWeb3();
  const stethContractWeb3 = useSTETHContractWeb3();
  const stethBalance = useSTETHBalance();
  const wstethBalance = useWSTETHBalance();
  const isSteth = selectedToken === TOKENS.STETH;
  const tokenContract = isSteth ? stethContractWeb3 : wstethContractWeb3;
  const tokenBalance = isSteth ? stethBalance.data : wstethBalance.data;

  return useMemo(() => {
    return {
      token: selectedToken,
      tokenContract,
      tokenBalance,
    } as const;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken, tokenContract, tokenBalance]);
};
