import React from 'react';
import {
  useWeb3,
  useConnectorInfo,
  useSupportedChains,
} from 'reef-knot/web3-react';
import { useAccount, useNetwork } from 'wagmi';
import { H3 } from '@lidofinance/lido-ui';
import { Line, Heading } from './styles';
import { BlueWrapper } from './BlueWrapper';
import { Web3ProviderInfo } from './Web3ProviderInfo';

export const WalletInfo = ({ children }: { children?: React.ReactNode }) => {
  const connectorInfo = useConnectorInfo();
  const supportedChainsData = useSupportedChains();
  const supportedChainIds = supportedChainsData.supportedChains.map(
    (c) => c.chainId,
  );

  // Get data via web3-react
  const web3Info = useWeb3();

  // Get data via wagmi
  const {
    address: wagmiAddress,
    status: wagmiStatus,
    isConnected: wagmiIsConnected,
    connector,
  } = useAccount();

  const { chain } = useNetwork();

  return (
    <BlueWrapper>
      <H3>Web3-react data</H3>
      <div>
        <div>
          <code>
            <Web3ProviderInfo />
            <Line>providerName: {connectorInfo.providerName}</Line>
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
            <Line>
              Chain is unsupported: {String(supportedChainsData.isUnsupported)}
            </Line>
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
            <Line>Chain is unsupported: {String(chain?.unsupported)}</Line>
          </code>
        </div>
        {children}
      </div>
    </BlueWrapper>
  );
};
