import { WalletsListEthereum } from '@reef-knot/wallets-list';
// import { createConnectorsWalletConnect } from './connectorsWalletConnect';

export const getConnectors = ({ rpc }: { rpc: Record<number, string> }) => {
  const walletAdapters = Object.values(WalletsListEthereum);
  const walletDataList = walletAdapters.map((walletAdapter) =>
    walletAdapter({ rpc }),
  );

  const connectors = [...walletDataList].map(
    (walletData) => walletData.connector,
  );

  // const connectorsWC = createConnectorsWalletConnect({ rpc });
  // return [...connectorsWC, ...connectors];
  return connectors;
};
