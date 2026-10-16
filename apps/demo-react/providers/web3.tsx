import { FC, PropsWithChildren, useMemo } from 'react';
import { useThemeToggle, ThemeName } from '@lidofinance/lido-ui';
import {
  ReefKnotProvider,
  WalletsListEthereum,
  getDefaultConfig,
  getDefaultWalletsModalConfig,
} from 'reef-knot';
import { WalletUIProvider } from '../features/wallet-ui/wallet-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import type { Transport } from 'viem';

import { metricProps } from 'utils/metrics';
import { useClientConfig } from 'providers/client-config';
import { useRpcUrls } from 'hooks/useRpcUrls';

type ChainsList = [wagmiChains.Chain, ...wagmiChains.Chain[]];

const wagmiChainsArray = Object.values(wagmiChains) as unknown as ChainsList;

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
      // Wagmi initializes its active chain from chains[0] when no state is saved.
      supportedChains: [
        defaultChain,
        ...supportedChains.filter((chain) => chain.id !== defaultChain.id),
      ] as ChainsList,
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
          <WalletUIProvider
            config={walletsModalConfig}
            theme={themeName === ThemeName.dark ? 'dark' : 'light'}
          >
            {children}
          </WalletUIProvider>
        </ReefKnotProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
