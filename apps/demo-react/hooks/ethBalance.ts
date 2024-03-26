import useSWR from 'swr';
import { useAccount, useNetwork } from 'wagmi';

import { useLidoSDK } from 'providers/sdk';

export const useETHBalance = () => {
  const { core } = useLidoSDK();
  const { address: account, isConnected } = useAccount();
  const { chain } = useNetwork();

  return useSWR(
    ['swr:eth_balance', chain?.id],
    async () => {
      if (!isConnected) return null;

      const balance = await core.balanceETH(account);
      return balance;
    },
    {
      refreshInterval: 15000,
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
    },
  );
};
