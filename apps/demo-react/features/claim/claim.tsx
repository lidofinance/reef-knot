import { FC, useCallback } from 'react';
import { useLidoSDK } from 'providers/sdk';
import { useConnection } from 'wagmi';
import { transactionToast } from 'utils/transaction-toast';

import { ActionItem } from 'components';

export const Claim: FC = () => {
  const { address = '0x0' } = useConnection();
  const account = address as `0x{string}`;

  const { withdraw } = useLidoSDK();

  const handleStake = useCallback(async () => {
    const result = await withdraw.requestsInfo.getClaimableRequestsETHByAccount(
      { account },
    );
    const selectedIds = result.requests.map((request) => request.id);

    return await withdraw.claim.claimRequests({
      account,
      requestsIds: selectedIds ?? [],
      callback: transactionToast,
    });
  }, [withdraw.requestsInfo, withdraw.claim, account]);

  return <ActionItem title="Claim all" action={handleStake} />;
};
