import useSWR from 'swr';
import { useAccount } from 'wagmi';

import { useLidoSDK } from 'providers/sdk';

export const useWstETHBalance = () => {
  const { wsteth } = useLidoSDK();
  const { address: account, isConnected, chain } = useAccount();

  return useSWR(
    ['swr:wsteth_balance', chain?.id],
    async () => {
      if (!isConnected) return null;

      const balance = await wsteth.balance(account);
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
