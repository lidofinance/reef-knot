import { useConnectorInfo } from 'reef-knot';
import { useWeb3 } from '@reef-knot/web3-react';

const WalletInfo = () => {
  const connectorInfo = useConnectorInfo();
  const { account } = useWeb3();

  return (
    <div>
      <div
        style={{
          display: 'inline-block',
          minWidth: '300px',
          marginTop: '80px',
          padding: '10px',
          background: 'antiquewhite',
          borderRadius: '10px',
        }}
      >
        <h4>Info:</h4>
        <div>
          <code>
            <p>providerName: {connectorInfo.providerName}</p>
            <p>connectorName: {connectorInfo.connectorName}</p>
            <p>account: {account}</p>
          </code>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;
