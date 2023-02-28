import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { ReactNode, useMemo } from 'react';
import { mainnet, goerli } from 'wagmi/chains';
import { createConnectors } from 'reef-knot/core-react';

const { provider, webSocketProvider } = configureChains(
  [mainnet, goerli],
  [publicProvider()],
);

const Wagmi = (props: { children: ReactNode; rpc: Record<number, string> }) => {
  const { children, rpc } = props;
  const connectors = useMemo(() => createConnectors({ rpc }), [rpc]);

  const client = useMemo(
    () =>
      createClient({
        connectors,
        autoConnect: true,
        provider,
        webSocketProvider,
      }),
    [connectors],
  );

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

export default Wagmi;
