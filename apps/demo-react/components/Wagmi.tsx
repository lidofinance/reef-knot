import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { ReactNode } from 'react';

const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()],
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

const Wagmi = (props: { children: ReactNode }) => (
  <WagmiConfig client={client}>{props.children}</WagmiConfig>
);

export default Wagmi;
