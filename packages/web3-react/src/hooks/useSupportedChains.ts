import { useMemo } from 'react';
import { getNetwork, Network } from '@ethersproject/providers';
import { useNetwork } from 'wagmi';
import { useWeb3, UnsupportedChainIdError } from './useWeb3';

const STABLE_ARRAY: never[] = [];

export const useSupportedChains = (): {
  isUnsupported: boolean;
  supportedChains: Network[];
} => {
  let supportedIds: number[] = STABLE_ARRAY;
  let isUnsupported: boolean;

  // legacy web3-react data
  const { error, connector } = useWeb3();
  // wagmi data
  const { chain, chains } = useNetwork();
  const wagmiSupportedChainIds = useMemo(
    () => chains.map((c) => c.id),
    [chains],
  );

  // add chain ids from legacy web3-react connector
  if (connector?.supportedChainIds) {
    supportedIds = connector.supportedChainIds;
  }
  // add wagmi chain ids too
  if (wagmiSupportedChainIds.length > 0) {
    supportedIds = [...supportedIds, ...wagmiSupportedChainIds];
    supportedIds = [...new Set(supportedIds)]; // deduplicate ids
  }

  const supportedChains = useMemo(() => {
    return supportedIds.map((chainId) => getNetwork(chainId));
  }, [supportedIds]);

  // legacy web3-react check
  isUnsupported = error instanceof UnsupportedChainIdError;

  // wagmi check
  isUnsupported = isUnsupported || !!chain?.unsupported;

  return {
    isUnsupported,
    supportedChains,
  };
};
