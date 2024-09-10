import React from 'react';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { goerli, mainnet, holesky } from 'wagmi/chains';
import {
  AutoConnect,
  ReefKnotProvider,
  getWalletsDataList,
} from 'reef-knot/core-react';
import { WalletsListEthereum } from 'reef-knot/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProviderSDKWithProps } from './ProviderSDKWithProps';
import { rpcUrlsString } from '../util/rpc';
import { WC_PROJECT_ID } from '../util/walletconnectProjectId';

const SUPPORTED_CHAINS = [holesky, mainnet, goerli] as const;
const DEFAULT_CHAIN = SUPPORTED_CHAINS[0];

const { walletsDataList } = getWalletsDataList({
  walletsList: WalletsListEthereum,
  rpc: rpcUrlsString,
  walletconnectProjectId: WC_PROJECT_ID,
  defaultChain: DEFAULT_CHAIN,
});

const config = createConfig({
  chains: SUPPORTED_CHAINS,
  multiInjectedProviderDiscovery: false,
  transports: {
    [holesky.id]: http(),
    [mainnet.id]: http(),
    [goerli.id]: http(),
  },
});

const queryClient = new QueryClient();

const reefKnotConfig = {
  rpc: rpcUrlsString,
  chains: SUPPORTED_CHAINS,
  walletDataList: walletsDataList,
};

const ConfigContextProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <ReefKnotProvider config={reefKnotConfig}>
          <AutoConnect autoConnect />
          <ProviderSDKWithProps defaultChainId={DEFAULT_CHAIN.id}>
            {children}
          </ProviderSDKWithProps>
        </ReefKnotProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default ConfigContextProviders;
