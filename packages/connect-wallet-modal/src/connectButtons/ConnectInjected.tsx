import React, { FC, useCallback } from 'react';
import { useConnect } from 'wagmi';
import { useDisconnect, isMobileOrTablet } from '@reef-knot/core-react';
import { ConnectButton } from '../components/ConnectButton';
import { capitalize, suggestApp, openWindow } from '../helpers';
import { ConnectInjectedProps } from './types';

export const ConnectInjected: FC<ConnectInjectedProps> = (
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
    deeplink,
    ...rest
  } = props;
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

    if (await detector?.()) {
      disconnect?.();
      await connectAsync({ connector });
    } else if (isMobileOrTablet && deeplink) {
      openWindow(deeplink);
    } else if (downloadURLs) {
      suggestApp(downloadURLs);
    }
  }, [
    connectAsync,
    connector,
    deeplink,
    detector,
    disconnect,
    downloadURLs,
    metricsOnClick,
    onBeforeConnect,
  ]);

  return (
    <ConnectButton
      {...rest}
      icon={WalletIcon}
      shouldInvertWalletIcon={shouldInvertWalletIcon}
      onClick={() => {
        void handleConnect();
      }}
    >
      {walletName}
    </ConnectButton>
  );
};
