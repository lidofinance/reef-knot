import { InjectedConnector } from 'wagmi/connectors/injected';
import { createConnectorsWalletConnect } from './WalletConnect';

export const createConnectors = ({ rpc }: { rpc: Record<number, string> }) => {
  const connectorsWC = createConnectorsWalletConnect({ rpc });
  const connectorInjected = new InjectedConnector();

  return [connectorInjected, ...connectorsWC];
};
