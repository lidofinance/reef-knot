import React, { FC, useCallback } from 'react';
import { useConnect } from 'wagmi';
import { useDisconnect } from '@reef-knot/core-react';
import { ConnectButton } from '../components/ConnectButton';
import { ConnectInjectedProps } from './types';
import { isMobileOrTablet } from '@reef-knot/wallets-helpers';
import { openWindow } from '../helpers/index';

export const ConnectBinance: FC<ConnectInjectedProps> = (
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

  const metricsOnConnect = metrics?.events?.connect?.handlers[walletId];
  const metricsOnClick = metrics?.events?.click?.handlers[walletId];

  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    metricsOnClick?.();
    disconnect?.();

    if (isMobileOrTablet && deeplink && !detector?.()) {
      openWindow(deeplink);
    } else {
      await connectAsync(
        { connector },
        {
          onSuccess: () => {
            onConnect?.();
            metricsOnConnect?.();
          },
        },
      );
    }
  }, [
    metricsOnClick,
    metricsOnConnect,
    disconnect,
    deeplink,
    connectAsync,
    connector,
    onBeforeConnect,
    onConnect,
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
