import { Connector } from 'wagmi';
import { WalletsListEthereum } from '@reef-knot/wallets-list';
import { createConnectorsWalletConnect } from './connectorsWalletConnect';

export * from './connectorsWalletConnect';

export const walletAdapters = Object.values(WalletsListEthereum);
export const walletDataList = walletAdapters.map((walletAdapter) =>
  walletAdapter(),
);

export const getConnectors = ({ rpc }: { rpc: Record<number, string> }) => {
  const connectors: Connector[] = [];
  walletDataList.forEach((walletData) => {
    connectors.push(walletData.connector);
  });

  const connectorsWC = createConnectorsWalletConnect({ rpc });
  return [...connectorsWC, ...connectors];
};
