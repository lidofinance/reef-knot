import { http, Chain, Transport } from 'viem';
import { createConfig, Storage } from 'wagmi';
import type { ReefKnotWalletsModalConfig } from '@reef-knot/types';
import {
  getWalletsDataList,
  GetWalletsDataListArgs,
} from './getWalletsDataList';
import type { ReefKnotProviderConfig } from '../context/reefKnotContext';

type RpcMap = Record<number, string>;
type Transports = Record<number, Transport>;
type Chains = readonly [Chain, ...Chain[]];

type WagmiAllowedArgs = {
  chains: Chains;
  ssr?: boolean;
  transports?: Transports;
  storage?: Storage | null;
};

type DefaultConfigArgs<I extends string = string> =
  ReefKnotWalletsModalConfig<I> &
    GetWalletsDataListArgs &
    WagmiAllowedArgs & {
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

  // Wagmi config args
  chains,
  ssr,
  transports,
  storage,
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
    ssr,
    transports: transports || getDefaultTransports(chains, rpc),
    storage,
    multiInjectedProviderDiscovery: false,
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
