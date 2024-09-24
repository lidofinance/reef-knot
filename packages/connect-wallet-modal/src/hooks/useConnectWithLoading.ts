import { useConnect } from 'wagmi';
import { useReefKnotContext } from '@reef-knot/core-react';

type UseConnectParams = Parameters<typeof useConnect>[0];

export function useConnectWithLoading(params?: UseConnectParams) {
  const { setLoadingWalletId } = useReefKnotContext();

  const { connectAsync } = useConnect(params);

  const connectWithLoading = async (
    walletId: string,
    connectAsyncVariables: Parameters<typeof connectAsync>[0],
    connectAsyncOptions?: Parameters<typeof connectAsync>[1],
  ) => {
    try {
      setLoadingWalletId(walletId);
      await connectAsync(connectAsyncVariables, connectAsyncOptions);
    } finally {
      setLoadingWalletId(null);
    }
  };

  return { connectWithLoading };
}
