import { useEffect, useMemo, useState } from 'react';
import { useWSTETHContractRPC } from '@lido-sdk/react';
import { BigNumber } from 'ethers';
import debounce from 'lodash/debounce';

export const useWstethBySteth = (
  stEth: BigNumber | undefined,
): BigNumber | undefined => {
  const [wstethBalance, setWstethBalance] = useState<BigNumber>(BigNumber.from(0));

  const wstethContractRPC = useWSTETHContractRPC();

  const getWstethBalance = useMemo(
    () =>
      debounce(async (steth: BigNumber | undefined) => {
        if (!steth) {
          return;
        }
        if (!wstethBalance) {
          const wsteth = await wstethContractRPC.getWstETHByStETH(steth);
          setWstethBalance(wsteth);
        }
      }, 500),
    [wstethContractRPC],
  );

  useEffect(() => {
    void getWstethBalance(stEth);
  }, [getWstethBalance, stEth]);

  return wstethBalance;
};
