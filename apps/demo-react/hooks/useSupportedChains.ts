import { useMemo } from 'react';
import { useConnection, useConfig } from 'wagmi';

export const useSupportedChains = () => {
  const { chainId } = useConnection();
  const { chains } = useConfig();

  const isUnsupported = useMemo(
    () => !chainId || !chains.some((chain) => chain.id === chainId),
    [chainId, chains],
  );

  const supportedChains = useMemo(
    () => chains.map((chain) => ({ chainId: chain.id, name: chain.name })),
    [chains],
  );

  return { isUnsupported, supportedChains };
};
