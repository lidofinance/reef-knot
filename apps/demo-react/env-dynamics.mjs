/** @type Record<number,string> */
export const rpcProviderUrls = {
  1: process.env[`RPC_PROVIDER_URL_1`],
  17000: process.env[`RPC_PROVIDER_URL_17000`],
};
/** @type number */
export const defaultChain = parseInt(process.env.DEFAULT_CHAIN, 10) || 17000;
/** @type number[] */
export const supportedChains = process.env?.SUPPORTED_CHAINS?.split(',').map(
  (chainId) => parseInt(chainId, 10),
) ?? [1, 17000];
/** @type string */
export const walletconnectProjectId = process.env.WALLETCONNECT_PROJECT_ID;
