import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { ReactNode } from 'react';
import { mainnet, goerli } from 'wagmi/chains';

const { provider, webSocketProvider } = configureChains(
  [mainnet, goerli],
  [
    publicProvider(),
  ],
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
