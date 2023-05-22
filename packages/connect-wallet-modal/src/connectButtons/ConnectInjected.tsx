import React, { FC, useCallback } from 'react';
import { useConnect } from 'wagmi';
import { useDisconnect } from '@reef-knot/web3-react';
import { ConnectButton } from '../components/ConnectButton';
import { capitalize, suggestApp } from '../helpers';
import { ConnectInjectedProps } from './types';

export const ConnectInjected: FC<ConnectInjectedProps> = (
  props: ConnectInjectedProps,
) => {
  const {
    onConnect,
    onBeforeConnect,
    setRequirements,
    shouldInvertWalletIcon,
    metrics,
    walletId,
    walletName,
    icons,
    icon,
    downloadURLs,
    detector,
    connector,
    ...rest
  } = props;

  const walletIsDetected = !!detector?.();
  const walletIdCapitalized = capitalize(walletId);
  const metricsOnConnect =
    metrics?.events?.connect?.handlers[`onConnect${walletIdCapitalized}`];
  const metricsOnClick =
    metrics?.events?.click?.handlers[`onClick${walletIdCapitalized}`];

  const { connectAsync } = useConnect({
    onSuccess() {
      onConnect?.();
      metricsOnConnect?.();
    },
  });
  const { disconnect } = useDisconnect();

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    metricsOnClick?.();

    if (walletIsDetected) {
      disconnect?.();
      await connectAsync({ connector });
    } else if (downloadURLs) {
      suggestApp(downloadURLs);
    }
  }, [
    connectAsync,
    connector,
    disconnect,
    downloadURLs,
    metricsOnClick,
    onBeforeConnect,
    walletIsDetected,
  ]);

  const WalletIcon = icon || icons;

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
