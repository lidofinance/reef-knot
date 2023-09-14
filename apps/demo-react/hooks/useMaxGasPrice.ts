import { getStaticRpcBatchProvider } from '@lido-sdk/providers';
import { useLidoSWR, useSDK } from '@lido-sdk/react';

import { BigNumber } from 'ethers';
import { ONE_GWEI, getRPCPath } from '../util/contractTestingUtils';

export const useMaxGasPrice = (): BigNumber | undefined => {
  const { chainId } = useSDK();
  const { data: maxFeePerGasPrice } = useLidoSWR(
    ['swr:max-gas-price', chainId],
    async () => {
      try {
        const provider = getStaticRpcBatchProvider(
          chainId,
          getRPCPath(chainId),
        );
        const feeData = await provider.getFeeData();
        const maxGasPrice = feeData.maxFeePerGas;
        if (maxGasPrice) return maxGasPrice;
        return await provider.getGasPrice();
      } catch (e) {
        console.error(e);
      }
      return ONE_GWEI;
    },
    { isPaused: () => !chainId },
  );

  return maxFeePerGasPrice;
};
