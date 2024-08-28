import React, { FC, useCallback, useState } from 'react';
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

  const [binanceModalLoading, setBinanceModalLoading] = useState(false);

  const handleConnect = useCallback(async () => {
    if (binanceModalLoading) return;

    onBeforeConnect?.();
    metricsOnClick?.();
    disconnect?.();

    if (isMobileOrTablet && deeplink && !detector?.()) {
      openWindow(deeplink);
    } else {
      setBinanceModalLoading(true);
      await connectAsync(
        { connector },
        {
          onSettled: () => {
            setBinanceModalLoading(false);
          },
          onSuccess: () => {
            onConnect?.();
            metricsOnConnect?.();
          },
        },
      );
    }
  }, [
    binanceModalLoading,
    onBeforeConnect,
    metricsOnClick,
    disconnect,
    deeplink,
    detector,
    connectAsync,
    connector,
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
