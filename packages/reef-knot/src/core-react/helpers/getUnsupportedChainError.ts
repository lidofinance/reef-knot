import { Chain } from 'wagmi/chains';

export const getUnsupportedChainError = (
  supportedChains: readonly [Chain, ...Chain[]],
) => {
  // Get names of supported chains to suggest them in case of "unsupported network" error
  const supportedChainsNames = (() => {
    const chains = supportedChains
      // On Lido widgets the Polygon Mumbai network was added as a temporary workaround for the wagmi and walletconnect bug,
      // when some wallets are failing to connect if there are only one supported network, so we need at least 2 of them.
      // But we don't want to mention it in the error as a suggested supported network, because it is not really true, so temporary filtering it out.
      // TODO: the issue is fixed in wagmi v1+, remove the filter after updating wagmi to v1+
      .filter((chain) => chain.id !== 80001)
      .map(({ name }) => name)
      .filter((chainName) => chainName !== 'unknown');
    const lastChain = chains.pop();
    return [chains.join(', '), lastChain].filter((chain) => chain).join(' or ');
  })();

  return new Error(
    `Unsupported chain. Please switch to ${supportedChainsNames} in your wallet.`,
  );
};
