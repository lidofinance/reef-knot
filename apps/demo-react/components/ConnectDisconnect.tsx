import { useDisconnect, useWeb3 } from 'reef-knot/web3-react';
import { Text, AddressBadge, Button } from '@lidofinance/lido-ui';
import { FlexContainer } from '../styles/global';

const ConnectDisconnect = (props: { handleOpen: () => void }) => {
  const { handleOpen } = props;
  const { disconnect } = useDisconnect();
  const { account } = useWeb3();
  const handleDisconnect = () => {
    disconnect?.();
  };

  return (
    <FlexContainer style={{ marginBottom: '40px' }}>
      {account ? (
        <>
          <Text color="success">Wallet connected</Text>
          <AddressBadge address={account} color="success" />
        </>
      ) : (
        <Button
          style={{ maxWidth: '300px', alignSelf: 'center' }}
          onClick={handleOpen}
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
