import { useMemo } from 'react';
import { getNetwork, Network } from '@ethersproject/providers';
import { useNetwork } from 'wagmi';

export const useSupportedChains = (): {
  isUnsupported: boolean;
  supportedChains: Network[];
} => {
  const { chain, chains } = useNetwork();

  const isUnsupported = !!chain?.unsupported;

  const supportedChains = useMemo(() => {
    return chains.map((c) => getNetwork(c.id));
  }, [chains]);

  return {
    isUnsupported,
    supportedChains,
  };
};
