import { Chain } from 'wagmi/chains';

export const getUnsupportedChainError = (supportedChains: Chain[]) => {
  // Get names of supported chains to suggest them in case of "unsupported network" error
  const supportedChainsNames = (() => {
    const chains = supportedChains
      .map(({ name }) => name)
      .filter((chainName) => chainName !== 'unknown');
    const lastChain = chains.pop();
    return [chains.join(', '), lastChain].filter((chain) => chain).join(' or ');
  })();

  return new Error(
    `Unsupported chain. Please switch to ${supportedChainsNames} in your wallet.`,
  );
};
