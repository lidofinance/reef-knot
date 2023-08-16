import { useWithdrawalsContract } from './useWithdrawalsContract';
import {
  useWithdrawalRequests,
  type RequestStatusClaimable,
} from './useWithdrawalsData';
import { BigNumber } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useClaimSelection } from './useClaimSelection';

export const useClaimData = () => {
  const withdrawRequests = useWithdrawalRequests();
  const claimSelection = useClaimSelection(
    withdrawRequests.data?.sortedClaimableRequests ?? null,
  );

  const ethToClaim = useMemo(() => {
    return claimSelection.sortedSelectedRequests.reduce(
      (eth, r) => eth.add(r.claimableEth),
      BigNumber.from(0),
    );
  }, [claimSelection.sortedSelectedRequests]);

  const requests = useMemo(() => {
    return [
      ...(withdrawRequests.data?.sortedClaimableRequests ?? []),
      ...(withdrawRequests.data?.pendingRequests ?? []),
    ];
  }, [withdrawRequests.data]);

  return useMemo(() => {
    return {
      withdrawalRequestsData: withdrawRequests.data,
      get loading() {
        return withdrawRequests.initialLoading;
      },
      get refetching() {
        return withdrawRequests.loading;
      },
      update: withdrawRequests.update,
      claimSelection,
      requests,
      ethToClaim,
    };
  }, [claimSelection, withdrawRequests, ethToClaim, requests]);
};

export const useClaim = () => {
  const { contractWeb3 } = useWithdrawalsContract();

  const { update } = useClaimData();

  return useCallback(
    async (sortedRequests: RequestStatusClaimable[]) => {
      try {
        const ethToClaim = sortedRequests.reduce(
          (s, r) => s.add(r.claimableEth),
          BigNumber.from(0),
        );

        const ids = sortedRequests.map((r) => r.id);
        const hints = sortedRequests.map((r) => r.hint);
        const callback = async () => {
          const feeData = await contractWeb3?.provider.getFeeData();
          const maxFeePerGas = feeData?.maxFeePerGas ?? undefined;
          const maxPriorityFeePerGas =
            feeData?.maxPriorityFeePerGas ?? undefined;
          const gasLimit = await contractWeb3?.estimateGas.claimWithdrawals(
            ids,
            hints,
            {
              maxFeePerGas,
              maxPriorityFeePerGas,
            },
          );
          return contractWeb3?.claimWithdrawals(ids, hints, {
            maxFeePerGas,
            maxPriorityFeePerGas,
            gasLimit,
          });
        };

        const transaction = await callback();

        const isTransaction = typeof transaction !== 'string';

        if (isTransaction) {
          await transaction?.wait();
        }
        await update();
      } catch (error) {
        console.log(error);
      }
    },
    [contractWeb3, update],
  );
};
