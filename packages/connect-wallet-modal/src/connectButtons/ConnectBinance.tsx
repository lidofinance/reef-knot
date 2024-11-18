import React, { FC, useCallback } from 'react';
import { useDisconnect, useReefKnotContext } from '@reef-knot/core-react';
import { isMobileOrTablet } from '@reef-knot/wallets-helpers';
import { useConnectWithLoading } from '../hooks/useConnectWithLoading';
import { ConnectButtonBase } from '../components/ConnectButtonBase';
import { openWindow } from '../helpers/openWindow';
import { ConnectInjectedProps } from './types';

export const ConnectBinance: FC<ConnectInjectedProps> = (
  props: ConnectInjectedProps,
) => {
  const {
    onConnect,
    darkThemeEnabled,
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

  const { loadingWalletId } = useReefKnotContext();
  const { connectWithLoading } = useConnectWithLoading();
  const { disconnect } = useDisconnect();

  const handleConnect = useCallback(async () => {
    metricsOnClick?.();
    disconnect?.();

    if (isMobileOrTablet && deeplink && !detector?.()) {
      openWindow(deeplink);
    } else {
      await connectWithLoading(walletId, { connector });
      onConnect?.();
      metricsOnConnect?.();
    }
  }, [
    metricsOnClick,
    disconnect,
    deeplink,
    detector,
    connectWithLoading,
    walletId,
    connector,
    onConnect,
    metricsOnConnect,
  ]);

  return (
    <ConnectButtonBase
      {...rest}
      icon={WalletIcon}
      darkThemeEnabled={darkThemeEnabled}
      isLoading={loadingWalletId === walletId}
      onClick={() => {
        void handleConnect();
      }}
    >
      {walletName}
    </ConnectButtonBase>
  );
};
