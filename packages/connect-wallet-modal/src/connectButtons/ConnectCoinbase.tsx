import React, { FC, useCallback } from 'react';
import { useConnect } from 'wagmi';
import { useDisconnect } from '@reef-knot/core-react';
import { ConnectButton } from '../components/ConnectButton';
import { ConnectInjectedProps } from './types';

export const ConnectCoinbase: FC<ConnectInjectedProps> = (
  props: ConnectInjectedProps,
) => {
  const {
    onConnect,
    onBeforeConnect,
    shouldInvertWalletIcon,
    metrics,
    walletId,
    walletName,
    icon: WalletIcon,
    downloadURLs,
    detector,
    connector,
    ...rest
  } = props;

  const metricsOnConnect = metrics?.events?.connect?.handlers.onConnectCoinbase;
  const metricsOnClick = metrics?.events?.click?.handlers.onClickCoinbase;

  const { connect } = useConnect({
    onSuccess() {
      onConnect?.();
      metricsOnConnect?.();
    },
  });
  const { disconnect } = useDisconnect();

  const handleConnect = useCallback(() => {
    onBeforeConnect?.();
    metricsOnClick?.();
    disconnect?.();
    connect({ connector });
  }, [connect, connector, disconnect, metricsOnClick, onBeforeConnect]);

  return (
    <ConnectButton
      {...rest}
      icon={WalletIcon}
      shouldInvertWalletIcon={shouldInvertWalletIcon}
      onClick={handleConnect}
    >
      {walletName}
    </ConnectButton>
  );
};
