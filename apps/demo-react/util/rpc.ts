import getConfig from 'next/config';
import { mainnet, goerli, holesky } from 'wagmi/chains';

const { publicRuntimeConfig } = getConfig();
const { alchemyApiKey } = publicRuntimeConfig;

export const rpcUrlsArray: Record<number, [string, ...string[]]> = {
  [mainnet.id]: [`https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`],
  [goerli.id]: [`https://eth-goerli.g.alchemy.com/v2/${alchemyApiKey}`],
  [holesky.id]: [`https://ethereum-holesky.publicnode.com`],
};

export const rpcUrlsString = Object.fromEntries(
  Object.entries(rpcUrlsArray).map(([chainId, urlsArray]) => [
    chainId,
    urlsArray[0],
  ]),
);
