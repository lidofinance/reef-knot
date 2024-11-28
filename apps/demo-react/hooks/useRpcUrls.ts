import { useMemo } from 'react';
import { CHAINS } from '@lido-sdk/constants';
import { useClientConfig } from 'providers/client-config';
import { getBackendRPCPath } from 'config';

export const useRpcUrls = (): Record<number, string> => {
  const { supportedChainIds } = useClientConfig();

  const backendRPC: Record<number, string> = useMemo(
    () =>
      supportedChainIds.reduce(
        (res, curr) => ({ ...res, [curr]: getBackendRPCPath(curr) }),
        {
          // Mainnet RPC is always required for some requests, e.g. ETH to USD price, ENS lookup
          [CHAINS.Mainnet]: getBackendRPCPath(CHAINS.Mainnet),
        },
      ),
    [supportedChainIds],
  );

  return backendRPC;
};
