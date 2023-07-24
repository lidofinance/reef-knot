import { Button } from 'reef-knot/ui-react';
import { useDisconnect } from 'reef-knot/web3-react';
import { FlexContainer } from '../styles/global';

const ConnectDisconnect = (props: { handleOpen: () => void }) => {
  const { handleOpen } = props;
  const { disconnect } = useDisconnect();
  const handleDisconnect = () => {
    disconnect?.();
  };

  return (
    <FlexContainer>
      <Button
        style={{ maxWidth: '300px', alignSelf: 'center' }}
        onClick={handleOpen}
      >
        Connect wallet
      </Button>
      <Button
        style={{ maxWidth: '200px', marginTop: '10px', alignSelf: 'center' }}
        variant="text"
        onClick={handleDisconnect}
      >
        Disconnect
      </Button>
    </FlexContainer>
  );
};

export default ConnectDisconnect;
