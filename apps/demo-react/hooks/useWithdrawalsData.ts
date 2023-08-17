import { useCallback } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import {
  useContractSWR,
  useLidoSWR,
  useSDK,
  useSTETHBalance,
  useWSTETHBalance,
} from '@lido-sdk/react';
import type { WstethAbi, StethAbi } from '@lido-sdk/contracts';
import { TOKENS } from '@lido-sdk/constants';
import type { SWRConfiguration } from 'swr';
import { useWithdrawalsContract } from './useWithdrawalsContract';
import { useClaimData } from './useClaim';
import { useWithdrawalsBaseData } from './useWithdrawalsBaseData';

export const MINUTE_MS = 1000 * 60;

export type StrategyConfig<DataT = unknown> = Pick<
  SWRConfiguration<DataT>,
  | 'revalidateIfStale'
  | 'revalidateOnFocus'
  | 'revalidateOnReconnect'
  | 'refreshInterval'
  | 'focusThrottleInterval'
  | 'dedupingInterval'
>;

export type RequestStatus = {
  amountOfStETH: BigNumber;
  amountOfShares: BigNumber;
  owner: string;
  timestamp: BigNumber;
  isFinalized: boolean;
  isClaimed: boolean;
  id: BigNumber;
  stringId: string;
};

export type RequestStatusClaimable = RequestStatus & {
  hint: BigNumber;
  claimableEth: BigNumber;
};

export type RequestStatusPending = RequestStatus & {
  expectedEth: BigNumber;
};

export type RequestStatusesUnion =
  | RequestStatus
  | RequestStatusClaimable
  | RequestStatusPending;

export const STRATEGY_CONSTANT: StrategyConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 10 * MINUTE_MS,
};

export const STRATEGY_LAZY: StrategyConfig = {
  revalidateOnFocus: false,
  revalidateIfStale: true,
  revalidateOnReconnect: true,
  refreshInterval: 5 * MINUTE_MS,
};
export const MAX_REQUESTS_COUNT = 256;
export const MAX_REQUESTS_COUNT_LEDGER_LIMIT = 2;
export const DEFAULT_CLAIM_REQUEST_SELECTED = 80;
export const MAX_SHOWN_REQUEST_PER_TYPE = 1024;

export const useUnfinalizedStETH = () => {
  const { contractRpc } = useWithdrawalsContract();

  return useContractSWR({
    contract: contractRpc,
    method: 'unfinalizedStETH',
  });
};

export const useWithdrawalRequestMethods = () => {
  const { providerWeb3 } = useSDK();
  const { update: withdrawalRequestsDataUpdate } = useClaimData();
  const stethBalance = useSTETHBalance();
  const wstethBalance = useWSTETHBalance();
  const unfinalizedStETH = useUnfinalizedStETH();

  const updateData = useCallback(() => {
    void stethBalance.update();
    void wstethBalance.update();
    void withdrawalRequestsDataUpdate();
    void unfinalizedStETH.update();
  }, [
    stethBalance,
    unfinalizedStETH,
    withdrawalRequestsDataUpdate,
    wstethBalance,
  ]);

  const { account, chainId, contractWeb3 } = useWithdrawalsContract();

  const permitSteth = useCallback(
    async ({
      signature,
      requests,
    }: {
      signature?: any;
      requests: BigNumberish[];
    }) => {
      const params = [
        requests,
        signature.owner,
        {
          value: signature.value,
          deadline: signature.deadline,
          v: signature.v,
          r: signature.r,
          s: signature.s,
        },
      ] as const;

      const feeData = await contractWeb3?.provider.getFeeData();
      const maxFeePerGas = feeData?.maxFeePerGas ?? undefined;
      const maxPriorityFeePerGas = feeData?.maxPriorityFeePerGas ?? undefined;
      const gasLimit =
        await contractWeb3?.estimateGas.requestWithdrawalsWithPermit(
          ...params,
          {
            maxFeePerGas,
            maxPriorityFeePerGas,
          },
        );

      const txOptions = {
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit,
      };

      const callback = () =>
        contractWeb3?.requestWithdrawalsWithPermit(...params, txOptions);

      const transaction = await callback();

      await transaction?.wait();
      updateData();
    },
    [account, chainId, contractWeb3, updateData],
  );

  const permitWsteth = useCallback(
    async ({
      signature,
      requests,
    }: {
      signature?: any;
      requests: BigNumber[];
    }) => {
      const params = [
        requests,
        signature.owner,
        {
          value: signature.value,
          deadline: signature.deadline,
          v: signature.v,
          r: signature.r,
          s: signature.s,
        },
      ] as const;

      const feeData = await contractWeb3?.provider.getFeeData();
      const maxFeePerGas = feeData?.maxFeePerGas ?? undefined;
      const maxPriorityFeePerGas = feeData?.maxPriorityFeePerGas ?? undefined;
      const gasLimit =
        await contractWeb3?.estimateGas.requestWithdrawalsWstETHWithPermit(
          ...params,
          {
            maxFeePerGas,
            maxPriorityFeePerGas,
          },
        );

      const txOptions = {
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit,
      };

      const callback = () =>
        contractWeb3?.requestWithdrawalsWstETHWithPermit(...params, txOptions);

      const transaction = await callback();

      await transaction?.wait();
      updateData();
    },
    [account, chainId, contractWeb3, updateData],
  );

  const steth = useCallback(
    async ({ requests }) => {
      const params = [requests, account || ''] as const;

      const callback = async () => {
        const feeData = await contractWeb3?.provider.getFeeData();
        const maxFeePerGas = feeData?.maxFeePerGas ?? undefined;
        const maxPriorityFeePerGas = feeData?.maxPriorityFeePerGas ?? undefined;
        const gasLimit = await contractWeb3?.estimateGas.requestWithdrawals(
          ...params,
          {
            maxFeePerGas,
            maxPriorityFeePerGas,
          },
        );
        return contractWeb3?.requestWithdrawals(...params, {
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
      updateData();
    },
    [account, chainId, contractWeb3, providerWeb3, updateData],
  );

  const wstETH = useCallback(
    async ({ requests }: { requests: BigNumberish[] }) => {
      const params = [requests, account || ''] as const;
      const callback = async () => {
        const feeData = await contractWeb3?.provider.getFeeData();
        const maxFeePerGas = feeData?.maxFeePerGas ?? undefined;
        const maxPriorityFeePerGas = feeData?.maxPriorityFeePerGas ?? undefined;
        const gasLimit =
          await contractWeb3?.estimateGas.requestWithdrawalsWstETH(...params, {
            maxFeePerGas,
            maxPriorityFeePerGas,
          });
        return contractWeb3?.requestWithdrawalsWstETH(...params, {
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
      updateData();
    },
    [account, chainId, contractWeb3, providerWeb3, updateData],
  );

  return useCallback(
    (isAllowance: boolean, token: keyof typeof TOKENS) => {
      return token === TOKENS.STETH
        ? isAllowance
          ? steth
          : permitSteth
        : isAllowance
        ? wstETH
        : permitWsteth;
    },
    [permitSteth, permitWsteth, steth, wstETH],
  );
};

export const useWithdrawalRequests = () => {
  const { contractWeb3, account, chainId } = useWithdrawalsContract();

  return useLidoSWR(
    ['swr:withdrawals-requests', account, chainId],
    async (...args: unknown[]) => {
      const acc = args[1] as string;
      if (contractWeb3) {
        const [requestIds = [], lastCheckpointIndex] = await Promise.all([
          contractWeb3.getWithdrawalRequests(acc),
          contractWeb3.getLastCheckpointIndex(),
        ]);
        const requestStatuses = await contractWeb3?.getWithdrawalStatus(
          requestIds,
        );

        const claimableRequests: RequestStatus[] = [];
        const pendingRequests: RequestStatusPending[] = [];

        let pendingAmountOfStETH = BigNumber.from(0);
        let claimableAmountOfStETH = BigNumber.from(0);

        requestStatuses?.forEach((request, index) => {
          const id = requestIds[index];
          const req: RequestStatus = {
            ...request,
            id,
            stringId: id.toString(),
          };

          if (request.isFinalized && !request.isClaimed) {
            claimableRequests.push(req);
            claimableAmountOfStETH = claimableAmountOfStETH.add(
              request.amountOfStETH,
            );
          } else if (!request.isFinalized) {
            pendingRequests.push({
              ...req,
              expectedEth: req.amountOfStETH, // TODO: replace with calcExpectedRequestEth(req, currentShareRate),
            });
            pendingAmountOfStETH = pendingAmountOfStETH.add(
              request.amountOfStETH,
            );
          }

          return req;
        });

        let isClamped =
          claimableRequests.splice(MAX_SHOWN_REQUEST_PER_TYPE).length > 0;
        isClamped ||=
          pendingRequests.splice(MAX_SHOWN_REQUEST_PER_TYPE).length > 0;

        const _sortedClaimableRequests = claimableRequests.sort((aReq, bReq) =>
          aReq.id.gt(bReq.id) ? 1 : -1,
        );

        const hints = await contractWeb3?.findCheckpointHints(
          _sortedClaimableRequests.map(({ id }) => id),
          1,
          lastCheckpointIndex,
        );

        const claimableEth = await contractWeb3?.getClaimableEther(
          _sortedClaimableRequests.map(({ id }) => id),
          hints,
        );

        let claimableAmountOfETH = BigNumber.from(0);
        const sortedClaimableRequests: RequestStatusClaimable[] =
          _sortedClaimableRequests.map((request, index) => {
            claimableAmountOfETH = claimableAmountOfETH.add(
              claimableEth[index],
            );
            return {
              ...request,
              hint: hints[index],
              claimableEth: claimableEth[index],
            };
          });

        return {
          pendingRequests,
          sortedClaimableRequests,
          pendingCount: pendingRequests.length,
          readyCount: sortedClaimableRequests.length,
          claimedCount: claimableRequests.length,
          pendingAmountOfStETH,
          claimableAmountOfStETH,
          claimableAmountOfETH,
          isClamped,
        };
      }
    },
    STRATEGY_LAZY,
  );
};

export type useWithdrawalRequestOptions = {
  value: string;
  tokenContract: StethAbi | WstethAbi | null;
  token: keyof typeof TOKENS;
};

export const useWithdrawals = () => {
  const { data, initialLoading: isWithdrawalsStatusLoading } =
    useWithdrawalsBaseData();
  const { isBunker, isPaused, isTurbo } = data ?? {};

  const withdrawalsStatus = isPaused
    ? 'error'
    : isBunker
    ? 'warning'
    : isTurbo
    ? 'success'
    : 'error';
  return {
    isClaimTab: true,
    withdrawalsStatus,
    isWithdrawalsStatusLoading,
    isPaused,
    isTurbo,
    isBunker,
  };
};
