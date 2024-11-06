import { FC, PropsWithChildren, useMemo } from 'react';
import { useThemeToggle } from '@lidofinance/lido-ui';
import { ReefKnotProvider, getDefaultConfig } from 'reef-knot/core-react';
import { WalletsListEthereum } from 'reef-knot/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import { CHAINS } from '@lido-sdk/constants';
import type { Transport } from 'viem';
import {
  ReefKnotWalletsModal,
  getDefaultWalletsModalConfig,
} from 'reef-knot/connect-wallet-modal';

import metrics from 'utils/metrics';
import { getBackendRPCPath } from 'config';
import { useClientConfig } from 'providers/client-config';
import { SDKLegacyProvider } from './sdk-legacy';

const LINK_DONT_HAVE_WALLET =
  'https://support.metamask.io/hc/en-us/articles/360015489531-Getting-started-with-MetaMask';

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
      metrics,
      linkDontHaveWallet: LINK_DONT_HAVE_WALLET,
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
