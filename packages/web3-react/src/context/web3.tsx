import React, { memo, FC, useEffect, useState } from 'react';
import invariant from 'tiny-invariant';
import {
  Web3Provider,
  ExternalProvider,
  JsonRpcFetchFunc,
} from '@ethersproject/providers';
import { CHAINS } from '@lido-sdk/constants';
import { getStaticRpcBatchProvider } from '@lido-sdk/providers';
import { ProviderSDK as ProviderSDKBase } from '@lido-sdk/react';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { ReefKnot } from '@reef-knot/core-react';
import { useAccount } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import { SWRConfiguration } from 'swr';
import { useWeb3 } from '../hooks/index';
import { POLLING_INTERVAL } from '../constants';
import ProviderConnectors, { ConnectorsContextProps } from './connectors';

export interface ProviderWeb3Props extends ConnectorsContextProps {
  defaultChainId: CHAINS;
  supportedChainIds: CHAINS[];
  swrConfig?: SWRConfiguration;
  pollingInterval?: number;
  walletconnectProjectId?: string;
  onError?: (error: unknown) => void;
}

function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
}

const ProviderSDK: FC<ProviderWeb3Props> = (props) => {
  const {
    rpc,
    defaultChainId,
    supportedChainIds,
    children,
    pollingInterval = POLLING_INTERVAL,
    ...rest
  } = props;
  const { active: isConnectedViaWeb3React, library } = useWeb3React();
  const { chainId = defaultChainId, account, active } = useWeb3();
  const { connector: connectorWagmi, isConnected: isConnectedViaWagmi } =
    useAccount();

  const [providerWeb3, setProviderWeb3] = useState<Web3Provider>();

  // Reset web3 provider if the provider was set previously,
  // and currently no wallet is connected via wagmi or web3-react.
  // Gets triggered on a wallet disconnection, for example.
  if (!active && providerWeb3) {
    setProviderWeb3(undefined);
  }

  // Switching providers between wagmi and web3-react.
  // This code is neither clean nor efficient, but it will be deprecated after transition to wagmi is complete.
  // useEffect is needed here because we are calling getProvider async method from wagmi,
  // which can be taken as an external API
  useEffect(() => {
    void (async () => {
      if (!providerWeb3 && connectorWagmi && isConnectedViaWagmi) {
        // Set wagmi provider
        const p = await connectorWagmi.getProvider();
        setProviderWeb3(getLibrary(p));
      } else if (!providerWeb3 && library && isConnectedViaWeb3React) {
        // Set web3-react provider
        // Passing `library` as init value for useState does not work, but works like this:
        setProviderWeb3(library);
      }
    })();
  }, [
    connectorWagmi,
    isConnectedViaWagmi,
    isConnectedViaWeb3React,
    library,
    providerWeb3,
  ]);

  invariant(rpc[chainId], `RPC url for chain ${chainId} is not provided`);
  invariant(rpc[CHAINS.Mainnet], 'RPC url for mainnet is not provided');

  const providerRpc = getStaticRpcBatchProvider(
    chainId,
    rpc[chainId],
    0,
    pollingInterval,
  );

  const providerMainnetRpc = getStaticRpcBatchProvider(
    CHAINS.Mainnet,
    rpc[CHAINS.Mainnet],
    0,
    pollingInterval,
  );

  return (
    <ProviderSDKBase
      chainId={chainId}
      supportedChainIds={supportedChainIds}
      providerWeb3={providerWeb3}
      providerRpc={providerRpc}
      providerMainnetRpc={providerMainnetRpc}
      account={account ?? undefined}
      {...rest}
    >
      {children}
    </ProviderSDKBase>
  );
};

const ProviderWeb3: FC<ProviderWeb3Props> = (props) => {
  const {
    children,
    rpc,
    walletconnectProjectId,
    appName,
    appLogoUrl,
    ...sdkProps
  } = props;
  const { defaultChainId, supportedChainIds } = props;
  const connectorsProps = { rpc, appName, appLogoUrl, defaultChainId };
  const wagmiChainsArray = Object.values(wagmiChains);
  const supportedWagmiChains = wagmiChainsArray.filter((chain) =>
    supportedChainIds.includes(chain.id),
  );
  const defaultWagmiChain = wagmiChainsArray.find(
    (chain) => chain.id === defaultChainId,
  );

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ProviderSDK rpc={rpc} {...sdkProps}>
        <ReefKnot
          rpc={rpc}
          walletconnectProjectId={walletconnectProjectId}
          chains={supportedWagmiChains}
          defaultChain={defaultWagmiChain}
        >
          <ProviderConnectors {...connectorsProps}>
            {children}
          </ProviderConnectors>
        </ReefKnot>
      </ProviderSDK>
    </Web3ReactProvider>
  );
};

export default memo<FC<ProviderWeb3Props>>(ProviderWeb3);
