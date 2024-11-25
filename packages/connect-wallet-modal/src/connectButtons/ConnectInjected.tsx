import React, { FC, useCallback } from 'react';
import { useConnect } from 'wagmi';
import { useDisconnect } from '@reef-knot/core-react';
import { isMobileOrTablet } from '@reef-knot/wallets-helpers';
import { ConnectButtonBase } from '../components/ConnectButtonBase';
import { suggestApp } from '../helpers/suggestApp';
import { openWindow } from '../helpers/openWindow';
import { ConnectInjectedProps } from './types';

export const ConnectInjected: FC<ConnectInjectedProps> = (
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
    deeplink,
    onConnectStart,
    onConnectSuccess,
    ...rest
  } = props;

  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = useCallback(async () => {
    onConnectStart?.();

    if (await detector?.()) {
      disconnect?.();
      await connectAsync({ connector });
      onConnectSuccess?.();
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
    onConnectStart,
    onConnectSuccess,
  ]);

  return (
    <ConnectButtonBase
      {...rest}
      icon={WalletIcon}
      darkThemeEnabled={darkThemeEnabled}
      onClick={() => {
        void handleConnect();
      }}
    >
      {walletName}
    </ConnectButtonBase>
  );
};
