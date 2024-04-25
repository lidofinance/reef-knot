import React from 'react';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { goerli, mainnet, holesky } from 'wagmi/chains';
import {
  AutoConnect,
  ReefKnot,
  getWalletAdaptersList,
  getWalletConnectorsList,
} from 'reef-knot/core-react';
import { ProviderSDKWithProps } from './ProviderSDKWithProps';
import { rpcUrlsString } from '../util/rpc';
import { WC_PROJECT_ID } from '../util/walletconnectProjectId';
import { WalletsListEthereum } from '@reef-knot/wallets-list';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const SUPPORTED_CHAINS = [holesky, mainnet, goerli] as const;
const DEFAULT_CHAIN = SUPPORTED_CHAINS[0];

const { walletAdaptersList, connectorCreatorFns } = getWalletAdaptersList({
  walletsList: WalletsListEthereum,
  rpc: rpcUrlsString,
  walletconnectProjectId: WC_PROJECT_ID,
  defaultChain: DEFAULT_CHAIN,
});

const config = createConfig({
  connectors: connectorCreatorFns,
  chains: SUPPORTED_CHAINS,
  multiInjectedProviderDiscovery: false,
  transports: {
    [holesky.id]: http(),
    [mainnet.id]: http(),
    [goerli.id]: http(),
  },
});

const walletConnectorsList = getWalletConnectorsList({
  connectors: config.connectors,
  walletAdaptersList,
});

const queryClient = new QueryClient();

const ConfigContextProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <ReefKnot
          rpc={rpcUrlsString}
          chains={SUPPORTED_CHAINS}
          walletConnectorsList={walletConnectorsList}
        >
          <AutoConnect autoConnect />
          <ProviderSDKWithProps defaultChainId={DEFAULT_CHAIN.id}>
            {children}
          </ProviderSDKWithProps>
        </ReefKnot>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default ConfigContextProviders;
