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

  const { loadingWalletId } = useReefKnotContext();
  const { connectWithLoading } = useConnectWithLoading();
  const { disconnect } = useDisconnect();

  const handleConnect = useCallback(async () => {
    onConnectStart?.();
    disconnect?.();

    if (isMobileOrTablet && deeplink && !detector?.()) {
      openWindow(deeplink);
    } else {
      await connectWithLoading(walletId, { connector });
      onConnectSuccess?.();
    }
  }, [
    disconnect,
    deeplink,
    detector,
    connectWithLoading,
    walletId,
    connector,
    onConnectStart,
    onConnectSuccess,
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
