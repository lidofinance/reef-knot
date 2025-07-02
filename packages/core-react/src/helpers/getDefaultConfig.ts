import { http, Chain, Transport } from 'viem';
import { createConfig } from 'wagmi';
import type {
  ReefKnotWalletsModalConfig,
  ReefKnotProviderConfig,
  ReefKnotConfig,
} from '@reef-knot/types';
import {
  getWalletsDataList,
  GetWalletsDataListArgs,
} from './getWalletsDataList';

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

type DefaultConfigArgs<I extends string = string> = ReefKnotConfig &
  ReefKnotWalletsModalConfig<I> &
  GetWalletsDataListArgs &
  WagmiConfigArgs;

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
  onAutoConnect,
  onReconnect,

  // Wallets config args
  buttonComponentsByConnectorId,
  walletsShown,
  walletsPinned,
  walletsDisplayInitialCount,
  linkTerms,
  linkPrivacyNotice,
  linkDontHaveWallet,
  onClickTermsAccept,
  onClickWalletsLess,
  onClickWalletsMore,
  onConnectStart,
  onConnectSuccess,

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
    onAutoConnect,
    onReconnect,
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
    walletsShown,
    walletsPinned,
    walletsDisplayInitialCount,
    linkTerms,
    linkPrivacyNotice,
    linkDontHaveWallet,
    onClickTermsAccept,
    onClickWalletsLess,
    onClickWalletsMore,
    onConnectStart,
    onConnectSuccess,
  };

  return {
    wagmiConfig,
    reefKnotConfig,
    walletsDataList,
    walletsModalConfig,
  };
};
