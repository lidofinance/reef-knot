import React, { FC, useCallback } from 'react';
import { useDisconnect, useReefKnotContext } from '@reef-knot/core-react';
import { useConnectWithLoading } from '../hooks/useConnectWithLoading';
import { ConnectButtonBase } from '../components/ConnectButtonBase';
import { ConnectInjectedProps } from './types';

export const ConnectMetaMask: FC<ConnectInjectedProps> = (
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
    await connectWithLoading(walletId, { connector });
    onConnectSuccess?.();
  }, [
    connectWithLoading,
    connector,
    deeplink,
    detector,
    disconnect,
    downloadURLs,
    onConnectStart,
    onConnectSuccess,
    walletId,
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
