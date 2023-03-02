import { useWeb3, useConnectorInfo } from 'reef-knot/web3-react';
import { useAccount } from 'wagmi';

const WalletInfo = () => {
  const connectorInfo = useConnectorInfo();
  const web3Info = useWeb3();
  const {
    address: wagmiAddress,
    status: wagmiStatus,
    connector,
  } = useAccount();

  return (
    <div>
      <h4>web3-react data:</h4>
      <div>
        <code>
          <p>providerName: {connectorInfo.providerName}</p>
          <p>connectorName: {connectorInfo.connectorName}</p>
          <p>account(useWeb3): {web3Info.account}</p>
        </code>
      </div>
      <h4>wagmi data:</h4>
      <div>
        <code>
          <p>status: {wagmiStatus}</p>
          <p>address: {wagmiAddress}</p>
          <p>Connector ID: {connector?.id}</p>
          <p>Connector name: {connector?.name}</p>
        </code>
      </div>
    </div>
  );
};

export default WalletInfo;
