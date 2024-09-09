import React, { FC, useCallback } from 'react';
import { useConnect } from 'wagmi';
import { useDisconnect } from '@reef-knot/core-react';
import { ConnectButtonBase } from '../components/ConnectButtonBase';
import { ConnectInjectedProps } from './types';

export const ConnectCoinbase: FC<ConnectInjectedProps> = (
  props: ConnectInjectedProps,
) => {
  const {
    onConnect,
    onBeforeConnect,
    darkThemeEnabled,
    metrics,
    walletId,
    walletName,
    icon: WalletIcon,
    downloadURLs,
    detector,
    connector,
    ...rest
  } = props;

  const metricsOnConnect = metrics?.events?.connect?.handlers[walletId];
  const metricsOnClick = metrics?.events?.click?.handlers[walletId];

  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = useCallback(() => {
    onBeforeConnect?.();
    metricsOnClick?.();
    disconnect?.();
    connect(
      { connector },
      {
        onSuccess: () => {
          onConnect?.();
          metricsOnConnect?.();
        },
      },
    );
  }, [
    connect,
    connector,
    disconnect,
    metricsOnClick,
    onBeforeConnect,
    onConnect,
    metricsOnConnect,
  ]);

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
