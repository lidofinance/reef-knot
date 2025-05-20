import { FC, PropsWithChildren, useMemo } from 'react';
import { useThemeToggle } from '@lidofinance/lido-ui';
import { ReefKnotProvider, getDefaultConfig } from 'reef-knot/core-react';
import { WalletsListEthereum } from 'reef-knot/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import type { Transport } from 'viem';
import {
  ReefKnotWalletsModal,
  getDefaultWalletsModalConfig,
} from 'reef-knot/connect-wallet-modal';

import { metricProps } from 'utils/metrics';
import { useClientConfig } from 'providers/client-config';
import { useRpcUrls } from 'hooks/useRpcUrls';

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
  const { themeName } = useThemeToggle();

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

  const backendRPC = useRpcUrls();

  const transports = useMemo(() => {
    return supportedChains.reduce<Record<number, Transport>>(
      (res, curr) => ({
        ...res,
        [curr.id]: http(backendRPC[curr.id], { batch: true }),
      }),
      {},
    );
  }, [supportedChains, backendRPC]);

  const { wagmiConfig, reefKnotConfig, walletsModalConfig } = useMemo(() => {
    return getDefaultConfig({
      // Reef-Knot config args
      rpc: backendRPC,
      defaultChain: defaultChain,
      walletconnectProjectId,
      walletsList: WalletsListEthereum,

      // Wagmi config args
      transports,
      chains: supportedChains,
      autoConnect: isWalletConnectionAllowed,
      ssr: true,

      // Wallets config args
      // TODO: We could call `getDefaultWalletsModalConfig` inside `getDefaultConfig`, but it cause package dependency cycle rn
      ...getDefaultWalletsModalConfig(),
      ...metricProps,
    });
  }, [
    backendRPC,
    supportedChains,
    defaultChain,
    walletconnectProjectId,
    isWalletConnectionAllowed,
    transports,
  ]);

  return (
    // default wagmi autoConnect, MUST be false in our case, because we use custom autoConnect from Reef Knot
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <ReefKnotProvider config={reefKnotConfig}>
          <ReefKnotWalletsModal
            config={walletsModalConfig}
            darkThemeEnabled={themeName === 'dark'}
          />
          {children}
        </ReefKnotProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
