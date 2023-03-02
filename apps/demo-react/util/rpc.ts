import { CHAINS } from '@lido-sdk/constants';

export const rpc = {
  [CHAINS.Mainnet]: `/rpc-stub?chainId=${CHAINS.Mainnet}`,
  [CHAINS.Goerli]: `/rpc-stub?chainId=${CHAINS.Goerli}`,
};
