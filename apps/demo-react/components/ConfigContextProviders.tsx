import React from 'react';
import { WagmiConfig, createClient, configureChains, Chain } from 'wagmi';
import { goerli, mainnet } from 'wagmi/chains';
import { ReefKnot, getConnectors, holesky } from 'reef-knot/core-react';
import { getStaticRpcBatchProvider } from '@lido-sdk/providers';
import { ProviderSDKWithProps } from './ProviderSDKWithProps';
import { getRPCPath } from '../util/contractTestingUtils';
import { rpcUrlsString } from '../util/rpc';
import { WC_PROJECT_ID } from '../util/walletconnectProjectId';

const supportedChains = [holesky, mainnet, goerli];
const defaultChainId = holesky.id;

const jsonRpcBatchProvider = (chain: Chain) => ({
  provider: () =>
    getStaticRpcBatchProvider(chain.id, getRPCPath(chain.id), undefined, 12000),
  chain,
});

const { chains, provider, webSocketProvider } = configureChains(
  supportedChains,
  [jsonRpcBatchProvider],
);

const connectors = getConnectors({
  rpc: rpcUrlsString,
  walletconnectProjectId: WC_PROJECT_ID,
  chains,
  defaultChain:
    supportedChains.find((chain) => chain.id === defaultChainId) ||
    supportedChains[0],
});

const client = createClient({
  connectors,
  autoConnect: false, // default wagmi autoConnect should be false
  provider,
  webSocketProvider,
});

const ConfigContextProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const defaultChain =
    supportedChains.find((chain) => chain.id === defaultChainId) ||
    supportedChains[0];

  return (
    <WagmiConfig client={client}>
      <ReefKnot
        rpc={rpcUrlsString}
        chains={supportedChains}
        defaultChain={defaultChain}
        walletconnectProjectId={WC_PROJECT_ID}
        autoConnect
      >
        <ProviderSDKWithProps
          defaultChainId={defaultChain.id}
          supportedChains={supportedChains}
          rpc={rpcUrlsString}
        >
          {children}
        </ProviderSDKWithProps>
      </ReefKnot>
    </WagmiConfig>
  );
};
export default ConfigContextProviders;
