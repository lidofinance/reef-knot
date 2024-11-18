import { http, Chain, Transport } from 'viem';
import { createConfig } from 'wagmi';
import type { ReefKnotWalletsModalConfig } from '@reef-knot/types';
import {
  getWalletsDataList,
  GetWalletsDataListArgs,
} from './getWalletsDataList';
import type { ReefKnotProviderConfig } from '../context/reefKnotContext';

type RpcMap = Record<number, string>;
type Transports = Record<number, Transport>;
type Chains = readonly [Chain, ...Chain[]];

type WagmiConfigArgs = Omit<
  Parameters<typeof createConfig>[0],
  // Args `connectors` and `client` are disabled because reef-knot uses
  // opinionated way to handle connectors and it is designed to utilize
  // `transports` argument.
  // It could be changed in future, if there will be such request.
  'connectors' | 'client'
>;

type DefaultConfigArgs<I extends string = string> =
  ReefKnotWalletsModalConfig<I> &
    GetWalletsDataListArgs &
    WagmiConfigArgs & {
      autoConnect: boolean;
    };

const getDefaultTransports = (chains: Chains, rpc: RpcMap) =>
  chains.reduce<Transports>(
    (result, chain) => ({
      ...result,
      [chain.id]: http(rpc[chain.id], { batch: true }),
    }),
    {},
  );

export const getDefaultConfig = <I extends string = string>({
  // Reef-Knot config args
  rpc,
  defaultChain,
  walletconnectProjectId,
  walletsList,
  safeAllowedDomains,
  chains,
  transports,
  autoConnect,

  // Wallets config args
  buttonComponentsByConnectorId,
  metrics,
  walletsShown,
  walletsPinned,
  walletsDisplayInitialCount,
  linkTerms,
  linkPrivacyNotice,
  linkDontHaveWallet,

  // Wagmi config args
  ...wagmiArgs
}: DefaultConfigArgs<I>) => {
  const { walletsDataList } = getWalletsDataList({
    rpc,
    defaultChain,
    walletsList,
    walletconnectProjectId,
    safeAllowedDomains,
  });

  const reefKnotConfig: ReefKnotProviderConfig = {
    autoConnect,
    walletDataList: walletsDataList,
  };

  const wagmiConfig = createConfig({
    chains,
    transports: transports || getDefaultTransports(chains, rpc),
    multiInjectedProviderDiscovery: false,
    ...wagmiArgs,
  });

  // TODO: We could use `getDefaultWalletsModalConfig` here, but it cause package dependency cycle rn
  const walletsModalConfig: ReefKnotWalletsModalConfig = {
    buttonComponentsByConnectorId,
    metrics,
    walletsShown,
    walletsPinned,
    walletsDisplayInitialCount,
    linkTerms,
    linkPrivacyNotice,
    linkDontHaveWallet,
  };

  return {
    wagmiConfig,
    reefKnotConfig,
    walletsDataList,
    walletsModalConfig,
  };
};
