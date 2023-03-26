import { createConnectorsWalletConnect } from './WalletConnect';

export const createConnectors = ({ rpc }: { rpc: Record<number, string> }) => {
  const connectorsWC = createConnectorsWalletConnect({ rpc });
  return [...connectorsWC];
};
