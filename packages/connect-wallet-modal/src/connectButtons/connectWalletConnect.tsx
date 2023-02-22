import { FC, useCallback } from 'react';
import { WalletConnect } from '@reef-knot/wallets-icons/react';
import { useConnectorWalletConnect } from '@reef-knot/web3-react';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components/ConnectButton';

const ConnectWalletConnect: FC<ConnectWalletProps> = (props) => {
  const { onConnect, onBeforeConnect, metrics, ...rest } = props;
  const onConnectWC = metrics?.events?.connect?.handlers.onConnectWC;
  const onClickWC = metrics?.events?.click?.handlers.onClickWC;
  const { reconnect } = useConnectorWalletConnect({
    onConnect: () => {
      onConnect?.();
      onConnectWC?.();
    },
  });

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickWC?.();

    await reconnect();
  }, [reconnect, onBeforeConnect, onClickWC]);

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
