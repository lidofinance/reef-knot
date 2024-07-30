import { mainnet, holesky, Chain } from 'wagmi/chains';
import dynamics from './dynamics';

export const getBackendRPCPath = (chainId: Chain['id']) => {
  return dynamics.rpcProviderUrls[chainId];
};

export const backendRPC = {
  [mainnet.id]: getBackendRPCPath(mainnet.id),
  [holesky.id]: getBackendRPCPath(holesky.id),
};
