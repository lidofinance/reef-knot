import React from 'react';
import { WagmiConfig, createClient, configureChains, Chain } from 'wagmi';
import { goerli, mainnet } from 'wagmi/chains';
import { ProviderWeb3 } from 'reef-knot/web3-react';
import { getConnectors, holesky } from 'reef-knot/core-react';
import { getStaticRpcBatchProvider } from '@lido-sdk/providers';
import { getRPCPath } from '../util/contractTestingUtils';
import { rpcUrlsString } from '../util/rpc';
import { WC_PROJECT_ID } from '../util/walletconnectProjectId';

const supportedChains = [holesky, mainnet, goerli];
const supportedChainsIds = supportedChains.map((chain) => chain.id);
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
  autoConnect: true,
  provider,
  webSocketProvider,
});

const ProviderWeb3WithProps = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig client={client}>
      <ProviderWeb3
        defaultChainId={defaultChainId}
        supportedChainIds={supportedChainsIds}
        rpc={rpcUrlsString}
        walletconnectProjectId={WC_PROJECT_ID}
      >
        {children}
      </ProviderWeb3>
    </WagmiConfig>
  );
};
export default ProviderWeb3WithProps;
