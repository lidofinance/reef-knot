import { http, Chain, Transport } from 'viem';
import { createConfig } from 'wagmi';
import type { WalletAdapterType } from '@reef-knot/types';
import { getWalletsDataList } from './getWalletsDataList';
import type { ReefKnotProviderConfig } from '../context/reefKnotContext';

type RpcMap = Record<number, string>;
type Transports = Record<number, Transport>;
type Chains = readonly [Chain, ...Chain[]];

type DefaultConfigArgs = {
  rpc: Record<number, string>;
  chains: Chains;
  defaultChain: Chain;
  transports?: Transports;
  walletconnectProjectId: string;
  walletsList: Record<string, WalletAdapterType>;
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

export const getDefaultConfig = ({
  rpc,
  chains,
  defaultChain,
  transports: transportsArg,
  walletconnectProjectId,
  walletsList,
  autoConnect,
}: DefaultConfigArgs) => {
  const { walletsDataList } = getWalletsDataList({
    rpc,
    defaultChain,
    walletsList,
    walletconnectProjectId,
  });

  const reefKnotConfig: ReefKnotProviderConfig = {
    autoConnect,
    walletDataList: walletsDataList,
  };

  const wagmiConfig = createConfig({
    chains,
    ssr: true,
    multiInjectedProviderDiscovery: false,
    transports: transportsArg || getDefaultTransports(chains, rpc),
  });

  return {
    wagmiConfig,
    reefKnotConfig,
    walletsDataList,
  };
};
