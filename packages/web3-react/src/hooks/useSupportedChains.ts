import { useMemo } from 'react';
import { useConnection, useConfig } from 'wagmi';

// Kept shape-compatible with the ethers `Network` type this hook used to return
export type Network = {
  chainId: number;
  name: string;
};

export const useSupportedChains = (): {
  isUnsupported: boolean;
  supportedChains: Network[];
} => {
  const { chainId } = useConnection();
  const { chains } = useConfig();

  const isUnsupported = useMemo(() => {
    return !chainId || !chains?.find((c) => c.id === chainId);
  }, [chainId, chains]);

  const supportedChains = useMemo(() => {
    return chains.map((c) => ({ chainId: c.id, name: c.name }));
  }, [chains]);

  return {
    isUnsupported,
    supportedChains,
  };
};
