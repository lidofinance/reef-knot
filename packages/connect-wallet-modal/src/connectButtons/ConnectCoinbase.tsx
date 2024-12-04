import React, { FC, useCallback } from 'react';
import { useConnect } from 'wagmi';
import { useDisconnect } from '@reef-knot/core-react';
import { ConnectButtonBase } from '../components/ConnectButtonBase';
import { ConnectInjectedProps } from './types';

export const ConnectCoinbase: FC<ConnectInjectedProps> = (
  props: ConnectInjectedProps,
) => {
  const {
    darkThemeEnabled,
    walletId,
    walletName,
    icon: WalletIcon,
    downloadURLs,
    detector,
    connector,
    onConnectStart,
    onConnectSuccess,
    ...rest
  } = props;

  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = useCallback(() => {
    onConnectStart?.();
    disconnect?.();
    connect(
      { connector },
      {
        onSuccess: () => {
          onConnectSuccess?.();
        },
      },
    );
  }, [connect, connector, disconnect, onConnectStart, onConnectSuccess]);

  return (
    <ConnectButtonBase
      {...rest}
      icon={WalletIcon}
      darkThemeEnabled={darkThemeEnabled}
      onClick={handleConnect}
    >
      {walletName}
    </ConnectButtonBase>
  );
};
