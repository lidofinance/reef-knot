import { useCallback, useMemo, useState } from 'react';
import { useWeb3 } from 'reef-knot/web3-react';
import { useAccount } from 'wagmi';
import { parseEther } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';
import { useApprove } from '@lido-sdk/react';
import { MaxUint256 } from '@ethersproject/constants';
import { useWithdrawalsContract } from './useWithdrawalsContract';
import { useERC20PermitSignature } from './useERC20permitSignature';
import {
  useWithdrawals,
  type useWithdrawalRequestOptions,
  useWithdrawalRequestMethods,
} from './useWithdrawalsData';

export const useWithdrawalRequest = ({
  value,
  tokenContract,
  token,
}: useWithdrawalRequestOptions) => {
  const [isTxPending, setIsTxPending] = useState(false);
  const { connector } = useAccount();
  const { account } = useWeb3();
  const { isBunker } = useWithdrawals();
  const { contractWeb3: withdrawalContractWeb3 } = useWithdrawalsContract();

  const getRequestMethod = useWithdrawalRequestMethods();

  const valueBN = useMemo(() => {
    try {
      return parseEther(value || '0');
    } catch {
      return BigNumber.from(0);
    }
  }, [value]);

  // TODO  split into async callback and pauseable SWR
  const {
    approve,
    needsApprove,
    allowance,
    loading: loadingUseApprove,
  } = useApprove(
    valueBN,
    tokenContract?.address ?? '',
    withdrawalContractWeb3?.address ?? '',
    account ?? undefined,
  );

  const isInfiniteAllowance = useMemo(() => {
    return allowance.eq(MaxUint256);
  }, [allowance]);

  // TODO streamline from hook to async callback
  const { gatherPermitSignature } = useERC20PermitSignature({
    value,
    tokenProvider: tokenContract,
    spender: withdrawalContractWeb3?.address ?? '',
  });

  const isApprovalFlow =
    connector?.id === 'walletConnect' ||
    (allowance.gt(BigNumber.from(0)) && !needsApprove);

  const isApprovalFlowLoading = isApprovalFlow && loadingUseApprove;

  const isTokenLocked = isApprovalFlow && needsApprove;

  const request = useCallback(
    (requests: BigNumber[], resetForm: () => void) => {
      // define and set retry point
      const startCallback = async () => {
        try {
          // we can't know if tx was successful or even wait for it  with multisig
          // so we exit flow gracefully and reset UI
          const shouldSkipSuccess = false;
          setIsTxPending(true);
          const requestAmount = requests.reduce(
            (s, r) => s.add(r),
            BigNumber.from(0),
          );
          // get right method
          const method = getRequestMethod(isApprovalFlow, token);
          // start flow

          // each flow switches needed signing stages
          if (isApprovalFlow) {
            if (needsApprove) {
              await approve();
              // multisig does not move to next tx
              await method({ requests });
            }
          } else {
            const signature = await gatherPermitSignature();
            await method({ signature, requests });
          }
          // end flow
          resetForm();
        } catch (error) {
          console.log(error);
        } finally {
          setIsTxPending(false);
        }
      };
      void startCallback();
    },
    [
      approve,
      gatherPermitSignature,
      getRequestMethod,
      isApprovalFlow,
      needsApprove,
      setIsTxPending,
      token,
    ],
  );

  return {
    isTokenLocked,
    isApprovalFlow,
    isInfiniteAllowance,
    allowance,
    isApprovalFlowLoading,
    request,
    isTxPending,
  };
};
