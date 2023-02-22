import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { ReactNode } from 'react';
import { mainnet, goerli } from 'wagmi/chains';

const { provider, webSocketProvider } = configureChains(
  [mainnet, goerli],
  [
    infuraProvider({ apiKey: '8922a14a760246d7b9b415961f8cd01c', priority: 0 }),
    alchemyProvider({
      apiKey: 'B95IjGnL5JWpLSoQuoIj61P0c0Hi2aPR',
      priority: 1,
    }),
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
