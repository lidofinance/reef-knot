import React, { FC, useCallback } from 'react';
import { useConfig, useConnect } from 'wagmi';
import { useDisconnect } from '@reef-knot/core-react';
import { isMobileOrTablet } from '@reef-knot/wallets-helpers';
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

  const config = useConfig();
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    metricsOnClick?.();

    if (await detector?.(config)) {
      disconnect?.();
      await connectAsync(
        { connector },
        {
          onSuccess: () => {
            onConnect?.();
            metricsOnConnect?.();
          },
        },
      );
    } else if (isMobileOrTablet && deeplink) {
      openWindow(deeplink);
    } else if (downloadURLs) {
      suggestApp(downloadURLs);
    }
  }, [
    config,
    connectAsync,
    connector,
    deeplink,
    detector,
    disconnect,
    downloadURLs,
    metricsOnClick,
    onBeforeConnect,
    onConnect,
    metricsOnConnect,
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
