import React from 'react';
import {
  useWeb3,
  useConnectorInfo,
  useSupportedChains,
} from 'reef-knot/web3-react';
import { useAccount, useNetwork } from 'wagmi';

import { HeadingStyle, DataTableRowStyle } from './styles';
import { Web3ProviderInfo } from './provider-info';

export const WalletInfoContent = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
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
    <div>
      <div>
        <code>
          <Web3ProviderInfo />
          <DataTableRowStyle title="providerName" highlight>
            {connectorInfo.providerName}
          </DataTableRowStyle>
          <HeadingStyle>Shimmed useWeb3() data below</HeadingStyle>

          <DataTableRowStyle title="account">
            {web3Info.account}
          </DataTableRowStyle>
          <DataTableRowStyle title="active">
            {String(web3Info.active)}
          </DataTableRowStyle>
          <DataTableRowStyle title="error">
            {web3Info.error?.message}
          </DataTableRowStyle>

          <HeadingStyle>Chain</HeadingStyle>
          <DataTableRowStyle title="chain" highlight>
            {web3Info.chainId}
          </DataTableRowStyle>
          <DataTableRowStyle title="chain is unsupported">
            {String(supportedChainsData.isUnsupported)}
          </DataTableRowStyle>
          <DataTableRowStyle title="supported chain IDs">
            {supportedChainIds?.join(',')}
          </DataTableRowStyle>
        </code>
      </div>
      <HeadingStyle>Wagmi data:</HeadingStyle>
      <div>
        <code>
          <DataTableRowStyle title="status">{wagmiStatus}</DataTableRowStyle>
          <DataTableRowStyle title="is connected">
            {String(wagmiIsConnected)}
          </DataTableRowStyle>
          <DataTableRowStyle title="address">{wagmiAddress}</DataTableRowStyle>
          <DataTableRowStyle title="connector ID">
            {connector?.id}
          </DataTableRowStyle>
          <DataTableRowStyle title="connector name">
            {connector?.name}
          </DataTableRowStyle>
          <DataTableRowStyle title="chain ID">
            Chain ID: {chain?.id}
          </DataTableRowStyle>
          <DataTableRowStyle title="chain is unsupported">
            {String(chain?.unsupported)}
          </DataTableRowStyle>
        </code>
      </div>
      {children}
    </div>
  );
};
