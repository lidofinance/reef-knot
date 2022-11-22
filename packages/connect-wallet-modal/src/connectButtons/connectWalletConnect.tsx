import { FC, useCallback } from 'react';
import { useConnectorWalletConnect } from '@reef-knot/web3-react';
import { WalletConnectCircle } from '@lidofinance/lido-ui';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';

const ConnectWalletConnect: FC<ConnectWalletProps> = (props) => {
  const { onConnect, metrics, ...rest } = props;
  const onConnectWC = metrics?.events?.connect?.handlers.onConnectWC;
  const { connect } = useConnectorWalletConnect({
    onConnect: () => {
      onConnect?.();
      onConnectWC?.();
    },
  });

  const handleConnect = useCallback(async () => {
    await connect();
  }, [connect]);

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
