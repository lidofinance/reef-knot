import { useMemo } from 'react';
import { getNetwork, Network } from '@ethersproject/providers';
import { useAccount, useConfig } from 'wagmi';

export const useSupportedChains = (): {
  isUnsupported: boolean;
  supportedChains: Network[];
} => {
  const { chainId } = useAccount();
  const { chains } = useConfig();

  const isUnsupported = useMemo(() => {
    return !chainId || !chains?.find((c) => c.id === chainId);
  }, [chainId, chains]);

  const supportedChains = useMemo(() => {
    return chains.map((c) => getNetwork(c.id));
  }, [chains]);

  return {
    isUnsupported,
    supportedChains,
  };
};
