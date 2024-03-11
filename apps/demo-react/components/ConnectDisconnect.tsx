import { useWeb3 } from 'reef-knot/web3-react';
import {
  useConnectorInfo,
  useEagerConnect,
  useForceDisconnect,
} from 'reef-knot/core-react';
import { Text, AddressBadge, Button } from '@lidofinance/lido-ui';
import { FlexContainer } from '../styles/global';

const ConnectDisconnect = (props: { handleOpen: () => void }) => {
  const { handleOpen } = props;
  const { forceDisconnect } = useForceDisconnect();
  const { account } = useWeb3();
  const { isAutoConnectionSuitable } = useConnectorInfo();
  const { eagerConnect } = useEagerConnect();

  const handleDisconnect = () => {
    forceDisconnect?.();
  };

  const handleConnectStart = () => {
    if (isAutoConnectionSuitable) {
      void eagerConnect();
    } else {
      handleOpen();
    }
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
          onClick={handleConnectStart}
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
