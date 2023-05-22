import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { ReactNode } from 'react';
import { mainnet, goerli } from 'wagmi/chains';
import { getConnectors } from 'reef-knot/core-react';
import { rpc } from '../util/rpc';
import { WC_PROJECT_ID } from '../util/walletconnectProjectId';

const { provider, webSocketProvider } = configureChains(
  [mainnet, goerli],
  [publicProvider()],
);

const connectors = getConnectors({
  rpc,
  walletconnectProjectId: WC_PROJECT_ID,
});

const client = createClient({
  connectors,
  autoConnect: true,
  provider,
  webSocketProvider,
});

const Wagmi = (props: { children: ReactNode }) => {
  const { children } = props;

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

export default Wagmi;
