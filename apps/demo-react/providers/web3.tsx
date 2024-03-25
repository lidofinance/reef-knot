import { FC, PropsWithChildren } from 'react';
import { ReefKnot, getConnectors, holesky } from 'reef-knot/core-react';
import { WagmiConfig, createClient, configureChains, Chain } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';

import { backendRPC, getBackendRPCPath, dynamics } from 'config';
import { getStaticRpcBatchProvider } from '@lido-sdk/providers';

import { ProviderSDKWithProps } from './ProviderSDKWithProps';

const wagmiChainsArray = Object.values({ ...wagmiChains, holesky });
const supportedChains = wagmiChainsArray.filter((chain) =>
  dynamics.supportedChains.includes(chain.id),
);
const defaultChain =
  wagmiChainsArray.find((chain) => chain.id === dynamics.defaultChain) ||
  supportedChains[0];

const jsonRcpBatchProvider = (chain: Chain) => ({
  provider: () =>
    getStaticRpcBatchProvider(
      chain.id,
      getBackendRPCPath(chain.id),
      undefined,
      12000,
    ),
  chain,
});

const { chains, provider, webSocketProvider } = configureChains(
  supportedChains,
  [jsonRcpBatchProvider],
);

const connectors = getConnectors({
  chains,
  defaultChain,
  rpc: backendRPC,
  walletconnectProjectId: dynamics.walletconnectProjectId,
});

const client = createClient({
  connectors,
  autoConnect: false, // default wagmi autoConnect should be false
  provider,
  webSocketProvider,
});

const ConfigContextProviders: FC<PropsWithChildren> = ({ children }) => (
  <WagmiConfig client={client}>
    <ReefKnot
      rpc={backendRPC}
      chains={supportedChains}
      defaultChain={defaultChain}
      walletconnectProjectId={dynamics.walletconnectProjectId}
      autoConnect
    >
      <ProviderSDKWithProps
        defaultChainId={defaultChain.id}
        supportedChains={supportedChains}
        rpc={backendRPC}
      >
        {children}
      </ProviderSDKWithProps>
    </ReefKnot>
  </WagmiConfig>
);

export default ConfigContextProviders;
