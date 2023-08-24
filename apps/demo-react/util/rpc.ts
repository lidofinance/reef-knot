import getConfig from 'next/config';
import { mainnet, goerli } from 'wagmi/chains';

const { publicRuntimeConfig } = getConfig();
const { alchemyApiKey } = publicRuntimeConfig;

export const rpcUrlsArray: Record<number, [string, ...string[]]> = {
  [mainnet.id]: [`https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`],
  [goerli.id]: [`https://eth-goerli.alchemyapi.io/v2/${alchemyApiKey}`],
};

export const rpcUrlsString = Object.fromEntries(
  Object.entries(rpcUrlsArray).map(([chainId, urlsArray]) => [
    chainId,
    urlsArray[0],
  ]),
);
