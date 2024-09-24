import React, { FC, useCallback } from 'react';
import { useDisconnect, useReefKnotContext } from '@reef-knot/core-react';
import { ConnectButton } from '../components/ConnectButton';
import { ConnectInjectedProps } from './types';
import { isMobileOrTablet } from '@reef-knot/wallets-helpers';
import { openWindow } from '../helpers/index';
import { useConnectWithLoading } from '../hooks/useConnectWithLoading';

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

  const { loadingWalletId } = useReefKnotContext();
  const { connectWithLoading } = useConnectWithLoading();
  const { disconnect } = useDisconnect();

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
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
    onBeforeConnect,
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
    <ConnectButton
      {...rest}
      icon={WalletIcon}
      shouldInvertWalletIcon={shouldInvertWalletIcon}
      isLoading={loadingWalletId === walletId}
      onClick={() => {
        void handleConnect();
      }}
    >
      {walletName}
    </ConnectButton>
  );
};
