import React from 'react';
import { useWeb3, useSupportedChains } from 'reef-knot/web3-react';
import { useConnectorInfo } from 'reef-knot/core-react';
import { useAccount } from 'wagmi';
import { H3 } from '@lidofinance/lido-ui';
import { Line, Heading } from './styles';
import { BlueWrapper } from './BlueWrapper';
import { Web3ProviderInfo } from './Web3ProviderInfo';

export const WalletInfo = ({ children }: { children?: React.ReactNode }) => {
  const connectorInfo = useConnectorInfo();
  const { supportedChains, isUnsupported } = useSupportedChains();
  const supportedChainIds = supportedChains.map((c) => c.chainId);

  // Get data via web3-react
  const web3Info = useWeb3();

  // Get data via wagmi
  const {
    chain,
    address: wagmiAddress,
    status: wagmiStatus,
    isConnected: wagmiIsConnected,
    connector,
  } = useAccount();

  return (
    <BlueWrapper>
      <H3>Web3-react data</H3>
      <div>
        <div>
          <code>
            <Web3ProviderInfo />
            <Line>providerName: {connectorInfo.connectorName}</Line>
            <Line>
              <b>shimmed useWeb3() data below</b>
            </Line>
            <Line>account: {web3Info.account}</Line>
            <Line>active: {String(web3Info.active)}</Line>
            <Line>error: {web3Info.error?.message}</Line>
            <Line>Chain ID: {web3Info.chainId}</Line>
            <Line>
              <b>Supported Chains</b>
            </Line>
            <Line>Chain is unsupported: {String(isUnsupported)}</Line>
            <Line>Supported chain IDs: {supportedChainIds?.join(',')}</Line>
          </code>
        </div>
        <Heading>wagmi data:</Heading>
        <div>
          <code>
            <Line>status: {wagmiStatus}</Line>
            <Line>isConnected: {String(wagmiIsConnected)}</Line>
            <Line>address: {wagmiAddress}</Line>
            <Line>Connector ID: {connector?.id}</Line>
            <Line>Connector name: {connector?.name}</Line>
            <Line>Chain ID: {chain?.id}</Line>
            <Line>Chain is unsupported: {String(isUnsupported)}</Line>
          </code>
        </div>
        {children}
      </div>
    </BlueWrapper>
  );
};
