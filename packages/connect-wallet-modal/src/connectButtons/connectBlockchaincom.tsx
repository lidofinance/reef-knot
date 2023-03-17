import React, { FC, useCallback } from 'react';
import {
  Blockchaincom,
  BlockchaincomInversion,
} from '@reef-knot/wallets-icons/react';
import { useConnect, useDisconnect } from 'wagmi';
import { RKConnectorWalletConnect } from '@reef-knot/core-react';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components';

const ConnectBlockchaincom: FC<ConnectWalletProps> = (props) => {
  const {
    onConnect,
    onBeforeConnect,
    shouldInvertWalletIcon,
    metrics,
    ...rest
  } = props;
  const WalletIcon = shouldInvertWalletIcon
    ? BlockchaincomInversion
    : Blockchaincom;
  const onConnectBlockchaincom =
    metrics?.events?.connect?.handlers.onConnectBlockchaincom;
  const onClickBlockchaincom =
    metrics?.events?.click?.handlers.onClickBlockchaincom;

  const { connectAsync, connectors } = useConnect({
    onSuccess() {
      onConnect?.();
      onConnectBlockchaincom?.();
    },
  });
  const { disconnectAsync } = useDisconnect();

  const connector = connectors.find(
    (c: RKConnectorWalletConnect) => c._reefknot_id === 'WalletConnectNoLinks',
  );

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickBlockchaincom?.();

    await disconnectAsync;
    await connectAsync({ connector });
  }, [
    onBeforeConnect,
    onClickBlockchaincom,
    disconnectAsync,
    connectAsync,
    connector,
  ]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      Blockchain.com
    </ConnectButton>
  );
};

export default ConnectBlockchaincom;
