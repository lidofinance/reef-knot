import { FC, PropsWithChildren, useMemo } from 'react';
import {
  AutoConnect,
  ReefKnotProvider,
  getWalletsDataList,
} from 'reef-knot/core-react';
import { WalletsListEthereum } from 'reef-knot/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import { CHAINS } from '@lido-sdk/constants';

import { getBackendRPCPath } from 'config';
import { useClientConfig } from 'providers/client-config';
import { SDKLegacyProvider } from './sdk-legacy';

type ChainsList = [wagmiChains.Chain, ...wagmiChains.Chain[]];

const wagmiChainsArray = Object.values(wagmiChains) as any as ChainsList;

const queryClient = new QueryClient();

const Web3Provider: FC<PropsWithChildren> = ({ children }) => {
  const {
    defaultChain: defaultChainId,
    supportedChainIds,
    walletconnectProjectId,
    isWalletConnectionAllowed,
  } = useClientConfig();

  const { supportedChains, defaultChain } = useMemo(() => {
    const supportedChains = wagmiChainsArray.filter((chain) =>
      supportedChainIds.includes(chain.id),
    );

    const defaultChain =
      supportedChains.find((chain) => chain.id === defaultChainId) ||
      supportedChains[0]; // first supported chain as fallback

    return {
      supportedChains: supportedChains as ChainsList,
      defaultChain,
    };
  }, [defaultChainId, supportedChainIds]);

  const backendRPC: Record<number, string> = useMemo(
    () =>
      supportedChainIds.reduce(
        (res, curr) => ({ ...res, [curr]: getBackendRPCPath(curr) }),
        {
          // Mainnet RPC is always required for some requests, e.g. ETH to USD price, ENS lookup
          [CHAINS.Mainnet]: getBackendRPCPath(CHAINS.Mainnet),
        },
      ),
    [supportedChainIds],
  );

  const { walletsDataList } = useMemo(() => {
    return getWalletsDataList({
      walletsList: WalletsListEthereum,
      rpc: backendRPC,
      walletconnectProjectId: walletconnectProjectId,
      defaultChain: defaultChain,
    });
  }, [backendRPC, defaultChain, walletconnectProjectId]);

  const config = useMemo(() => {
    return createConfig({
      chains: supportedChains,
      ssr: true,
      multiInjectedProviderDiscovery: false,
      transports: supportedChains.reduce(
        (res, curr) => ({
          ...res,
          [curr.id]: http(backendRPC[curr.id], { batch: true }),
        }),
        {},
      ),
    });
  }, [supportedChains, backendRPC]);

  const reefKnotConfig = useMemo(
    () => ({ walletDataList: walletsDataList }),
    [walletsDataList],
  );

  return (
    // default wagmi autoConnect, MUST be false in our case, because we use custom autoConnect from Reef Knot
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <ReefKnotProvider config={reefKnotConfig}>
          {isWalletConnectionAllowed && <AutoConnect autoConnect />}
          <SDKLegacyProvider
            defaultChainId={defaultChain.id}
            supportedChains={supportedChains}
            rpc={backendRPC}
          >
            {children}
          </SDKLegacyProvider>
        </ReefKnotProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
