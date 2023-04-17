import React, { FC, useCallback } from 'react';
import { WalletConnect } from '@reef-knot/wallets-icons/react';
import { useConnect, useDisconnect } from 'wagmi';
import { RKConnectorWalletConnect } from '@reef-knot/core-react';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components';

const ConnectWalletConnect: FC<ConnectWalletProps> = (props) => {
  const { onConnect, onBeforeConnect, metrics, ...rest } = props;
  const onConnectWC = metrics?.events?.connect?.handlers.onConnectWC;
  const onClickWC = metrics?.events?.click?.handlers.onClickWC;

  const { connectAsync, connectors } = useConnect({
    onSuccess() {
      onConnect?.();
      onConnectWC?.();
    },
  });
  const { disconnectAsync } = useDisconnect();

  const connector = connectors.find(
    (c: RKConnectorWalletConnect) => c._reefknot_id === 'WalletConnect',
  );

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickWC?.();

    await disconnectAsync;
    await connectAsync({ connector });
  }, [onBeforeConnect, onClickWC, disconnectAsync, connectAsync, connector]);

  return (
    <ConnectButton {...rest} icon={WalletConnect} onClick={handleConnect}>
      WalletConnect
    </ConnectButton>
  );
};

export default ConnectWalletConnect;
