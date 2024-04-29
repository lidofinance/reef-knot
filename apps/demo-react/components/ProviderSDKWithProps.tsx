import React, { useMemo } from 'react';
import { useSupportedChains, useWeb3 } from 'reef-knot/web3-react';
import { useAccount, useConnectorClient } from 'wagmi';

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
  const { chainId = defaultChainId, account } = useWeb3();
  const { supportedChains } = useSupportedChains();
  const { isConnected } = useAccount();
  const { data: client } = useConnectorClient();
  const { rpc } = useReefKnotContext();

  const providerWeb3 = useMemo(() => {
    if (!client || !client.account || !isConnected) return;
    const { chain, transport } = client;

    // https://wagmi.sh/core/guides/ethers#reference-implementation-1
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new Web3Provider(transport, network);
    provider.pollingInterval = POLLING_INTERVAL;

    return provider;
  }, [isConnected, client]);

  const supportedChainIds = useMemo(
    () => supportedChains.map((chain) => chain.chainId),
    [supportedChains],
  );

  const providerRpc = getStaticRpcBatchProvider(
    chainId,
    rpc[chainId],
    0,
    POLLING_INTERVAL,
  );

  const providerMainnetRpc = getStaticRpcBatchProvider(
    mainnet.id,
    rpc[mainnet.id],
    0,
    POLLING_INTERVAL,
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
