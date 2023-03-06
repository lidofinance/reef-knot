import { mainnet, goerli } from 'wagmi/chains';

export const rpc = {
  [mainnet.id]: `/rpc-stub?chainId=${mainnet.id}`,
  [goerli.id]: `/rpc-stub?chainId=${goerli.id}`,
};
