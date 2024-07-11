import React, { useEffect, useMemo, useState } from 'react';
import { useSupportedChains, useWeb3 } from 'reef-knot/web3-react';
import { useClient, useConfig } from 'wagmi';

import { Web3Provider } from '@ethersproject/providers';
import { ProviderSDK } from '@lido-sdk/react';

import { mainnet } from 'wagmi/chains';
import { getStaticRpcBatchProvider } from '@lido-sdk/providers';
import { useReefKnotContext } from 'reef-knot/core-react';

const POLLING_INTERVAL = 12_000;

export const ProviderSDKWithProps = (props: {
  children?: React.ReactNode;
  defaultChainId: number;
}) => {
  const { children, defaultChainId } = props;
  const { chainId = defaultChainId, account, active } = useWeb3();
  const { supportedChains } = useSupportedChains();
  const config = useConfig();
  const client = useClient();
  const { rpc } = useReefKnotContext();

  const [providerWeb3, setProviderWeb3] = useState<Web3Provider | undefined>();

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
      if (!client || !account || !active) return undefined;
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
  }, [config.state, client, account, active, config]);

  const supportedChainIds = useMemo(
    () => supportedChains.map((chain) => chain.chainId),
    [supportedChains],
  );

  const providerRpc = useMemo(
    () => getStaticRpcBatchProvider(chainId, rpc[chainId], 0, POLLING_INTERVAL),
    [rpc, chainId],
  );

  const providerMainnetRpc = useMemo(
    () =>
      getStaticRpcBatchProvider(
        mainnet.id,
        rpc[mainnet.id],
        0,
        POLLING_INTERVAL,
      ),
    [rpc],
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
