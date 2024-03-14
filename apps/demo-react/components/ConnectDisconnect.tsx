import { useWeb3 } from 'reef-knot/web3-react';
import { useConnect, useForceDisconnect } from 'reef-knot/core-react';
import { Text, AddressBadge, Button } from '@lidofinance/lido-ui';
import { FlexContainer } from '../styles/global';

const ConnectDisconnect = () => {
  const { forceDisconnect } = useForceDisconnect();
  const { account } = useWeb3();
  const { connect } = useConnect();

  const handleDisconnect = () => {
    forceDisconnect?.();
  };

  return (
    <FlexContainer style={{ marginBottom: '40px' }}>
      {account ? (
        <>
          <Text color="success">Wallet connected</Text>
          <AddressBadge address={account} />
        </>
      ) : (
        <Button
          style={{ maxWidth: '300px', alignSelf: 'center' }}
          onClick={() => void connect()}
        >
          Connect Wallet
        </Button>
      )}
      {account && (
        <Button
          style={{ maxWidth: '200px', marginTop: '10px', alignSelf: 'center' }}
          variant="text"
          onClick={handleDisconnect}
          color="warning"
        >
          Disconnect
        </Button>
      )}
    </FlexContainer>
  );
};

export default ConnectDisconnect;
