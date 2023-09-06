import React from 'react';
import { WagmiConfig, createClient, configureChains, Chain } from 'wagmi';
import { goerli, mainnet } from 'wagmi/chains';
import { ProviderWeb3, useWeb3 } from 'reef-knot/web3-react';
import { getConnectors } from 'reef-knot/core-react';
import { ProviderSDK } from '@lido-sdk/react';
import { getStaticRpcBatchProvider } from '@lido-sdk/providers';
import { getRPCPath } from '../util/contractTestingUtils';
import { rpcUrlsString } from '../util/rpc';
import { WC_PROJECT_ID } from '../util/walletconnectProjectId';

const supportedChains = [goerli, mainnet];
const supportedChainsIds = supportedChains.map((chain) => chain.id);
const defaultChainId = goerli.id;

const jsonRcpBatchProvider = (chain: Chain) => ({
  provider: () =>
    getStaticRpcBatchProvider(chain.id, getRPCPath(chain.id), undefined, 12000),
  chain,
});

const { chains, provider, webSocketProvider } = configureChains(
  supportedChains,
  [jsonRcpBatchProvider],
);

const connectors = getConnectors({
  rpc: rpcUrlsString,
  walletconnectProjectId: WC_PROJECT_ID,
  chains,
  defaultChain: goerli,
});

const client = createClient({
  connectors,
  autoConnect: true,
  provider,
  webSocketProvider,
});

const SDKProvider: React.FC = ({ children }) => {
  const web3 = useWeb3();
  return (
    <ProviderSDK
      chainId={defaultChainId}
      supportedChainIds={supportedChainsIds}
      providerWeb3={web3.library}
      account={web3.account ?? undefined}
    >
      {children}
    </ProviderSDK>
  );
};

const ProviderWeb3WithProps: React.FC = ({ children }) => {
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
