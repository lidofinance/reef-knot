import { FC, useCallback } from 'react';
import { useLidoSDK } from 'providers/sdk';
import { useWeb3 } from 'reef-knot/web3-react';
import { transactionToast } from 'utils/transaction-toast';

import { ActionItem } from 'components';

export const Claim: FC = () => {
  const { account: web3account = '0x0' } = useWeb3();
  const account = web3account as `0x{string}`;

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
