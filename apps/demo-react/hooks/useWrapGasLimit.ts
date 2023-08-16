import { parseEther } from '@ethersproject/units';
import { CHAINS } from '@lido-sdk/constants';
import { getStaticRpcBatchProvider } from '@lido-sdk/providers';
import { useLidoSWR, useWSTETHContractRPC } from '@lido-sdk/react';
import { useWeb3 } from 'reef-knot/web3-react';
import {
  WRAP_FROM_ETH_GAS_LIMIT,
  WRAP_GAS_LIMIT,
  WRAP_GAS_LIMIT_GOERLI,
} from '../config/constants';

import { BigNumber } from 'ethers';
import { getBackendRPCPath } from '../util/contractTestingUtils';
import { ESTIMATE_ACCOUNT } from './useStethSubmitGasLimit';

export const useWrapGasLimit = (fromEther: boolean) => {
  const wsteth = useWSTETHContractRPC();
  const { chainId } = useWeb3();

  const { data } = useLidoSWR(
    ['swr:wrap-gas-limit', chainId, fromEther],
    async (_key, chainId, fromEther) => {
      if (!chainId) {
        return;
      }

      const provider = getStaticRpcBatchProvider(
        chainId as CHAINS,
        getBackendRPCPath(chainId as CHAINS),
      );

      const feeData = await provider.getFeeData();
      const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? undefined;
      const maxFeePerGas = feeData.maxFeePerGas ?? undefined;

      if (fromEther) {
        const gasLimit = await provider
          .estimateGas({
            from: ESTIMATE_ACCOUNT,
            to: wsteth.address,
            value: parseEther('0.001'),
            maxPriorityFeePerGas,
            maxFeePerGas,
          })
          .catch((error) => {
            console.warn(error);
            return BigNumber.from(WRAP_FROM_ETH_GAS_LIMIT);
          });

        return +gasLimit;
      } else {
        const gasLimit = await wsteth.estimateGas
          .wrap(parseEther('0.0001'), {
            from: ESTIMATE_ACCOUNT,
            maxPriorityFeePerGas,
            maxFeePerGas,
          })
          .catch((error) => {
            console.warn(error);
            return BigNumber.from(
              chainId === CHAINS.Goerli
                ? WRAP_GAS_LIMIT_GOERLI
                : WRAP_GAS_LIMIT,
            );
          });

        return +gasLimit;
      }
    },
  );

  if (!data) {
    if (fromEther) {
      return WRAP_FROM_ETH_GAS_LIMIT;
    } else {
      if (chainId === CHAINS.Goerli) {
        return WRAP_GAS_LIMIT_GOERLI;
      } else {
        return WRAP_GAS_LIMIT;
      }
    }
  }

  return data;
};
