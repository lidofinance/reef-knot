import { FC, useCallback } from 'react';
import { useConnectorWalletConnect } from '@reef-knot/web3-react';
import { WalletConnectCircle } from '@lidofinance/lido-ui';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';

const ConnectWalletConnect: FC<ConnectWalletProps> = (props) => {
  const { onConnect, metrics, ...rest } = props;
  const { connect } = useConnectorWalletConnect();
  const onConnectWC = metrics?.events?.connect?.handlers.onConnectWC;

  const handleConnect = useCallback(async () => {
    await connect();
    onConnect?.();
    onConnectWC?.();
  }, [connect, onConnect, onConnectWC]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletConnectCircle />}
      onClick={handleConnect}
    >
      WalletConnect
    </ConnectButton>
  );
};

export default ConnectWalletConnect;
