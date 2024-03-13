import useSWR from 'swr';
import { useAccount, useNetwork } from 'wagmi';

import { useLidoSDK } from 'providers/sdk';

export const useStETHBalance = () => {
  const { steth } = useLidoSDK();
  const { address: account, isConnected } = useAccount();
  const { chain } = useNetwork();

  return useSWR(
    ['swr:steth_balance', chain?.id],
    async () => {
      if (!isConnected) return null;

      const balance = await steth.balance(account);
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
