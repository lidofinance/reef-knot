import React from 'react';
import { Close } from '@lidofinance/lido-ui';
import { useWeb3, useSupportedChains } from 'reef-knot/web3-react';
import { useConnectorInfo } from 'reef-knot/core-react';
import { useAccount } from 'wagmi';

import {
  HeadingStyle,
  DataTableRowStyle,
  WalletInfoHeaderStyles,
  CloseButtonStyle,
} from './styles';
import { Web3ProviderInfo } from './provider-info';
import { useClientConfig } from 'providers/client-config';

export const WalletInfoContent = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { setIsWalletInfoIsOpen } = useClientConfig();
  const connectorInfo = useConnectorInfo();
  const supportedChainsData = useSupportedChains();
  const { isUnsupported } = supportedChainsData;
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
    chain,
  } = useAccount();

  return (
    <div>
      <WalletInfoHeaderStyles>
        <CloseButtonStyle
          icon={<Close />}
          size="xs"
          variant="outlined"
          color="secondary"
          onClick={() => setIsWalletInfoIsOpen(false)}
        />
      </WalletInfoHeaderStyles>
      <div>
        <code>
          <Web3ProviderInfo />
          <DataTableRowStyle title="providerName" highlight>
            {connectorInfo.connectorName}
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
          <DataTableRowStyle title="chain">{chain?.id}</DataTableRowStyle>
          <DataTableRowStyle title="chain is unsupported">
            {String(isUnsupported)}
          </DataTableRowStyle>
          <DataTableRowStyle title="supported chain IDs">
            {supportedChainIds?.join(',')}
          </DataTableRowStyle>
        </code>
      </div>

      <HeadingStyle>useWeb3 legacy data</HeadingStyle>
      <div>
        <code>
          <DataTableRowStyle title="active">
            {String(web3Info.active)}
          </DataTableRowStyle>
          <DataTableRowStyle title="chain" highlight>
            {web3Info.chainId}
          </DataTableRowStyle>
          <DataTableRowStyle title="error">
            {web3Info.error?.message}
          </DataTableRowStyle>
        </code>
      </div>

      {children}
    </div>
  );
};