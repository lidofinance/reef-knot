import useSWR from 'swr';
import { useConnection } from 'wagmi';

import { useLidoSDK } from 'providers/sdk';

export const useETHBalance = () => {
  const { core } = useLidoSDK();
  const { address: account, isConnected, chain } = useConnection();

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
