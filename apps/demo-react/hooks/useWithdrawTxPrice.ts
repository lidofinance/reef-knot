import { useMemo } from 'react';
import { useLidoSWR, useSDK } from '@lido-sdk/react';

import { useWeb3 } from 'reef-knot/web3-react';
import { TOKENS } from '@lido-sdk/constants';

import { BigNumber } from 'ethers';

import { MAX_REQUESTS_COUNT, STRATEGY_LAZY } from './useWithdrawalsData';
import { useWithdrawalsContract } from './useWithdrawalsContract';
import { useTxCostInUsd } from './txCost';
import { useClaimData } from './useClaim';
import { useDebouncedValue } from './useDebounceValue';
import {
  ESTIMATE_ACCOUNT,
  WITHDRAWAL_QUEUE_CLAIM_GAS_LIMIT_DEFAULT,
  WITHDRAWAL_QUEUE_REQUEST_STETH_APPROVED_GAS_LIMIT_DEFAULT,
  WITHDRAWAL_QUEUE_REQUEST_STETH_PERMIT_GAS_LIMIT_DEFAULT,
  WITHDRAWAL_QUEUE_REQUEST_WSTETH_APPROVED_GAS_LIMIT_DEFAULT,
  WITHDRAWAL_QUEUE_REQUEST_WSTETH_PERMIT_GAS_LIMIT_DEFAULT,
} from './useStethSubmitGasLimit';
import { encodeURLQuery, standardFetcher } from '../util/contractTestingUtils';

type UseRequestTxPriceOptions = {
  requestCount?: number;
  token: TOKENS;
  isApprovalFlow: boolean;
};

export const useRequestTxPrice = ({
  token,
  isApprovalFlow,
  requestCount,
}: UseRequestTxPriceOptions) => {
  const { chainId } = useSDK();
  const { contractRpc } = useWithdrawalsContract();
  // TODO add fallback for approval flow
  const fallback =
    token === 'STETH'
      ? isApprovalFlow
        ? WITHDRAWAL_QUEUE_REQUEST_STETH_APPROVED_GAS_LIMIT_DEFAULT
        : WITHDRAWAL_QUEUE_REQUEST_STETH_PERMIT_GAS_LIMIT_DEFAULT
      : isApprovalFlow
        ? WITHDRAWAL_QUEUE_REQUEST_WSTETH_APPROVED_GAS_LIMIT_DEFAULT
        : WITHDRAWAL_QUEUE_REQUEST_WSTETH_PERMIT_GAS_LIMIT_DEFAULT;

  const cappedRequestCount = Math.min(requestCount || 1, MAX_REQUESTS_COUNT);
  const debouncedRequestCount = useDebouncedValue(cappedRequestCount, 2000);

  const url = useMemo(() => {
    const basePath = 'https://wq-api.testnet.fi';
    const params = encodeURLQuery({
      token,
      requestCount: debouncedRequestCount,
    });
    return `${basePath}/v1/estimate-gas?${params}`;
  }, [debouncedRequestCount, token]);

  const { data: permitEstimateData, initialLoading: permitLoading } =
    useLidoSWR<{ gasLimit: number }>(url, standardFetcher, {
      ...STRATEGY_LAZY,
      isPaused: () => !chainId || isApprovalFlow,
    });

  const { data: approvalFlowGasLimit, initialLoading: approvalLoading } =
    useLidoSWR(
      ['swr:request-gas-limit', debouncedRequestCount, chainId],
      async () => {
        try {
          const arr = [] as Array<BigNumber>;
          arr.length = debouncedRequestCount;
          const gasLimit = (
            await contractRpc.estimateGas.requestWithdrawals(
              arr.fill(BigNumber.from(100)),
              ESTIMATE_ACCOUNT,
              { from: ESTIMATE_ACCOUNT },
            )
          ).toNumber();
          return gasLimit;
        } catch (error) {
          console.warn('Could not estimate gas for request', {
            error,
          });
          return undefined;
        }
      },
      {
        ...STRATEGY_LAZY,
        isPaused: () => !chainId || !isApprovalFlow,
      },
    );

  const gasLimit =
    (isApprovalFlow ? approvalFlowGasLimit : permitEstimateData?.gasLimit) ??
    fallback * debouncedRequestCount;

  const txPriceUsd = useTxCostInUsd({ gasLimit });

  const loading =
    cappedRequestCount !== debouncedRequestCount ||
    (isApprovalFlow ? approvalLoading : permitLoading);

  return {
    loading,
    txPriceUsd,
    gasLimit,
  };
};

export const useClaimTxPrice = () => {
  const { contractRpc } = useWithdrawalsContract();
  const { claimSelection } = useClaimData();
  const { account, chainId } = useWeb3();

  const requestCount = claimSelection.selectedCount || 1;
  const debouncedSortedSelectedRequests = useDebouncedValue(
    claimSelection.sortedSelectedRequests,
    2000,
  );
  const { data: gasLimitResult, initialLoading: isEstimateLoading } =
    useLidoSWR(
      [
        'swr:claim-request-gas-limit',
        debouncedSortedSelectedRequests,
        account,
        chainId,
      ],
      async () => {
        if (
          !chainId ||
          !account ||
          !contractRpc ||
          debouncedSortedSelectedRequests.length === 0
        )
          return undefined;
        const sortedRequests = debouncedSortedSelectedRequests;

        const gasLimit = await contractRpc?.estimateGas
          .claimWithdrawals(
            sortedRequests.map((r) => r.id),
            sortedRequests.map((r) => r.hint),
            { from: account },
          )
          .catch((error) => {
            console.warn('Could not estimate gas for claim', {
              ids: sortedRequests.map((r) => r.id),
              account,
              error,
            });
            return undefined;
          });

        return gasLimit;
      },
      STRATEGY_LAZY,
    );

  const gasLimit = isEstimateLoading
    ? undefined
    : gasLimitResult?.toNumber() ??
      WITHDRAWAL_QUEUE_CLAIM_GAS_LIMIT_DEFAULT * requestCount;

  const price = useTxCostInUsd({ gasLimit });

  return {
    loading:
      isEstimateLoading ||
      !price ||
      debouncedSortedSelectedRequests !== claimSelection.sortedSelectedRequests,
    claimGasLimit: gasLimit,
    claimTxPriceInUsd: price,
  };
};
