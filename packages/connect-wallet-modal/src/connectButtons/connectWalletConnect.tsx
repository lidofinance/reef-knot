import { FC, useCallback } from 'react';
import { useConnectorWalletConnect } from '@reef-knot/web3-react';
import { WalletConnect } from '@reef-knot/wallets-icons/react';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components/ConnectButton';

const ConnectWalletConnect: FC<ConnectWalletProps> = (props) => {
  const { onConnect, onBeforeConnect, metrics, ...rest } = props;
  const onConnectWC = metrics?.events?.connect?.handlers.onConnectWC;
  const onClickWC = metrics?.events?.click?.handlers.onClickWC;
  const { connect } = useConnectorWalletConnect({
    onConnect: () => {
      onConnect?.();
      onConnectWC?.();
    },
  });

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickWC?.();

    await connect();
  }, [connect, onBeforeConnect, onClickWC]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletConnect />}
      onClick={handleConnect}
    >
      WalletConnect
    </ConnectButton>
  );
};

export default ConnectWalletConnect;
