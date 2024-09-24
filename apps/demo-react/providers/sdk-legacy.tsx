import React, { useEffect, useMemo, useState } from 'react';
import { ProviderSDK } from '@lido-sdk/react';
import { getStaticRpcBatchProvider } from '@lido-sdk/providers';
import { Web3Provider } from '@ethersproject/providers';
import { useAccount, useClient, useConfig } from 'wagmi';
import { Chain, mainnet } from 'wagmi/chains';
import { useWeb3 } from 'reef-knot/web3-react';

const POLLING_INTERVAL = 12_000;

export const SDKLegacyProvider = (props: {
  children?: React.ReactNode;
  defaultChainId: number;
  supportedChains: Chain[];
  rpc: Record<number, string>;
  pollingInterval?: number;
}) => {
  const {
    children,
    defaultChainId,
    rpc,
    supportedChains,
    pollingInterval = POLLING_INTERVAL,
  } = props;
  const { chainId = defaultChainId, account } = useWeb3();
  const { connector, isConnected } = useAccount();
  const config = useConfig();
  const client = useClient();

  const [providerWeb3, setProviderWeb3] = useState<Web3Provider>();

  useEffect(() => {
    let isHookMounted = true;

    const getProviderTransport = async () => {
      const { state } = config;
      if (!state.current) return client?.transport;
      const connector = state.connections.get(state.current)?.connector;
      if (!connector) return client?.transport;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider: any = await connector.getProvider();
      return provider || client?.transport;
    };

    const getProviderValue = async () => {
      if (!client || !account || !isConnected) return undefined;
      const { chain } = client;
      const providerTransport = await getProviderTransport();

      // https://wagmi.sh/core/guides/ethers#reference-implementation-1
      const provider = new Web3Provider(providerTransport, {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
      });
      provider.pollingInterval = POLLING_INTERVAL;

      return provider;
    };

    const getProviderAndSet = async () => {
      const provider = await getProviderValue();
      if (isHookMounted) setProviderWeb3(provider);
    };

    void getProviderAndSet();

    return () => {
      isHookMounted = false;
    };
  }, [config.state, client, account, config, isConnected]);

  const supportedChainIds = useMemo(
    () => supportedChains.map((chain) => chain.id),
    [supportedChains],
  );

  const providerRpc = useMemo(
    () => getStaticRpcBatchProvider(chainId, rpc[chainId], 0, pollingInterval),
    [chainId, rpc, pollingInterval],
  );

  const providerMainnetRpc = useMemo(
    () =>
      getStaticRpcBatchProvider(
        mainnet.id,
        rpc[mainnet.id],
        0,
        POLLING_INTERVAL,
      ),
    [],
  );

  return (
    // @ts-expect-error Property children does not exist on type
    <ProviderSDK
      chainId={chainId}
      supportedChainIds={supportedChainIds}
      providerWeb3={providerWeb3}
      providerRpc={providerRpc}
      providerMainnetRpc={providerMainnetRpc}
      account={account ?? undefined}
    >
      {children}
    </ProviderSDK>
  );
};
