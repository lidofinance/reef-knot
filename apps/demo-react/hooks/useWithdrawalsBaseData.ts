import { useSDK, useLidoSWR, SWRResponse } from '@lido-sdk/react';
import { BigNumber } from 'ethers';

import { useWithdrawalsContract } from './useWithdrawalsContract';
import { STRATEGY_CONSTANT } from './useWithdrawalsData';


type useWithdrawalsBaseDataResult = {
  maxAmount: BigNumber | undefined;
  minAmount: BigNumber | undefined;
  isPaused: boolean;
  isBunker: boolean;
  isTurbo: boolean;
};

export const useWithdrawalsBaseData =
  (): SWRResponse<useWithdrawalsBaseDataResult> => {
    const { chainId } = useSDK();
    const { contractWeb3 } = useWithdrawalsContract();

    return useLidoSWR(
      ['swr:wqBaseData', contractWeb3?.address, chainId],
      async () => {
        const [minAmount, maxAmount, isPausedMode, isBunkerMode] =
          await Promise.all([
            contractWeb3?.MIN_STETH_WITHDRAWAL_AMOUNT(),
            contractWeb3?.MAX_STETH_WITHDRAWAL_AMOUNT(),
            contractWeb3?.isPaused(),
            contractWeb3?.isBunkerModeActive(),
          ]);

        const isPaused = !!isPausedMode;
        const isBunker = !!isBunkerMode;
        const isTurbo = !isPaused && !isBunkerMode;

        return { minAmount, maxAmount, isPaused, isBunker, isTurbo };
      },
      STRATEGY_CONSTANT,
    );
  };
