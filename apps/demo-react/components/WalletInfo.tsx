import { useConnectorInfo } from 'reef-knot';
import { useWeb3 } from '@reef-knot/web3-react';

const WalletInfo = () => {
  const connectorInfo = useConnectorInfo();
  const { account } = useWeb3();

  return (
    <div>
      <h4>Info:</h4>
      <div>
        <code>
          <p>providerName: {connectorInfo.providerName}</p>
          <p>connectorName: {connectorInfo.connectorName}</p>
          <p>account: {account}</p>
        </code>
      </div>
    </div>
  );
};

export default WalletInfo;
