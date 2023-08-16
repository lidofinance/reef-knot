import { getStaticRpcBatchProvider } from '@lido-sdk/providers';
import { useLidoSWR, useSTETHContractRPC } from '@lido-sdk/react';
import { useWeb3 } from 'reef-knot/web3-react';
import { parseEther } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';
import { AddressZero } from '@ethersproject/constants';
import { CHAINS } from '../config/chains';
import { getBackendRPCPath } from '../util/contractTestingUtils';

type UseStethSubmitGasLimit = () => number | undefined;
// account for gas estimation
// will always have >=0.001 ether, >=0.001 stETH, >=0.001 wstETH
// on Mainnet, Rinkeby, Goerli
export const ESTIMATE_ACCOUNT = '0x87c0e047F4e4D3e289A56a36570D4CB957A37Ef1';
// fallback gas limits per 1 withdraw request
export const WITHDRAWAL_QUEUE_REQUEST_STETH_PERMIT_GAS_LIMIT_DEFAULT = 255350;
export const WITHDRAWAL_QUEUE_REQUEST_WSTETH_PERMIT_GAS_LIMIT_DEFAULT = 312626;

export const WITHDRAWAL_QUEUE_REQUEST_STETH_APPROVED_GAS_LIMIT_DEFAULT = 228163;
export const WITHDRAWAL_QUEUE_REQUEST_WSTETH_APPROVED_GAS_LIMIT_DEFAULT = 280096;

export const WITHDRAWAL_QUEUE_CLAIM_GAS_LIMIT_DEFAULT = 89818;
export const STETH_SUBMIT_GAS_LIMIT_DEFAULT = 90000;

export const useStethSubmitGasLimit: UseStethSubmitGasLimit = () => {
  const stethContractRPC = useSTETHContractRPC();

  const { chainId } = useWeb3();
  const { data } = useLidoSWR(
    ['swr:submit-gas-limit', chainId],
    async (_key, chainIdParam) => {
      if (!chainIdParam) {
        return;
      }

      const provider = getStaticRpcBatchProvider(
        chainId as CHAINS,
        // TODO: add a way to type useWeb3 hook
        getBackendRPCPath(chainId as CHAINS),
      );

      const feeData = await provider.getFeeData();
      const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? undefined;
      const maxFeePerGas = feeData.maxFeePerGas ?? undefined;

      const gasLimit = await stethContractRPC.estimateGas
        .submit(AddressZero, {
          from: ESTIMATE_ACCOUNT,
          value: parseEther('0.001'),
          maxPriorityFeePerGas,
          maxFeePerGas,
        })
        .catch((error) => {
          console.warn(error);
          return BigNumber.from(STETH_SUBMIT_GAS_LIMIT_DEFAULT);
        });

      return +gasLimit;
    },
  );

  return data ?? STETH_SUBMIT_GAS_LIMIT_DEFAULT;
};
