import { isAddress } from "ethers/lib/utils.js";
import { getWithdrawalQueueAddress, CHAINS } from '@lido-sdk/constants';
import { getStaticRpcBatchProvider } from "@lido-sdk/providers";
import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from '@ethersproject/units';
import { Zero } from '@ethersproject/constants';

export const BASE_URL = 'https://eth-goerli.public.blastapi.io/';

export const getBackendRPCPath = (chainId: string | number): string => {

  return `${BASE_URL}/api/rpc?chainId=${chainId}`;
};

export const getAddress = async (
  input: string | undefined,
  chainId: CHAINS | undefined,
): Promise<string> => {
  if (!input || !chainId) return '';
  if (isAddress(input)) return input;

  try {
    const provider = getStaticRpcBatchProvider(
      chainId,
      getBackendRPCPath(chainId),
    );
    const address = await provider.resolveName(input);

    if (address) return address;
  } catch (error) {
    throw new Error('Failed to resolve referral address');
  }

  throw new Error('Invalid referral address');
};

export const ONE_GWEI = BigNumber.from(10 ** 9);


type FormatBalance = (balance?: BigNumber, maxDecimalDigits?: number) => string;

export const formatBalance: FormatBalance = (
  balance = Zero,
  maxDecimalDigits = 4,
) => {
  const balanceString = formatEther(balance);

  if (balanceString.includes('.')) {
    const parts = balanceString.split('.');
    if (maxDecimalDigits === 0) return parts[0];
    return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
  }

  return balanceString;
};

export const encodeURLQuery = (
  params: Record<string, string | number>,
): string => {
  const encoder = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== '') encoder.set(key, encodeURIComponent(value));
  }
  return encoder.toString();
};

const DEFAULT_PARAMS = {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
  },
};


type StandardFetcher = <T>(url: string, params?: RequestInit) => Promise<T>;

export const standardFetcher: StandardFetcher = async (url, params) => {
  const response = await fetch(url, {
    ...DEFAULT_PARAMS,
    ...params,
  });

  if (!response.ok) {
    console.log('error in fetcher')
  }

  return await response.json();
};


export const NFT_URL_PREFIX_BY_NETWORK: {
  [key in CHAINS]?: (nftId: string, contract: string) => string;
} = {
  [CHAINS.Mainnet]: (nftId, contract) =>
    `https://etherscan.io/nft/${contract}/${nftId}`,
  [CHAINS.Goerli]: (nftId, contract) =>
    `https://goerli.etherscan.io/nft/${contract}/${nftId}`,
};

export const getNFTUrl = (tokenId: string, chainId?: CHAINS) => {
  if (!chainId) return '';
  const contractAddress = getWithdrawalQueueAddress(chainId);

  return NFT_URL_PREFIX_BY_NETWORK[chainId]?.(tokenId, contractAddress) || '';
};