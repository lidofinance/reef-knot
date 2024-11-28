import { Chain } from 'wagmi/chains';
import dynamics from './dynamics';

export const getBackendRPCPath = (chainId: Chain['id']) => {
  return dynamics.rpcProviderUrls[chainId];
};
