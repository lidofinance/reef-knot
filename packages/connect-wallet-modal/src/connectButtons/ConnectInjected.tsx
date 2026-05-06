import { FC, useCallback } from 'react';
import { useDisconnect, useReefKnotContext } from '@reef-knot/core-react';
import { isMobileOrTablet } from '@reef-knot/wallets-helpers';
import { ConnectButtonBase } from '../components/ConnectButtonBase';
import { suggestApp } from '../helpers/suggestApp';
import { openWindow } from '../helpers/openWindow';
import { ConnectInjectedProps } from './types';
import { useConnectWithLoading } from '../hooks/useConnectWithLoading';

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

  const { disconnect } = useDisconnect();
  const { loadingWalletId } = useReefKnotContext();
  const { connectWithLoading } = useConnectWithLoading();

  const handleConnect = useCallback(async () => {
    onConnectStart?.();

    if (await detector?.()) {
      disconnect?.();
      await connectWithLoading(walletId, { connector });
      onConnectSuccess?.();
    } else if (isMobileOrTablet && deeplink) {
      openWindow(deeplink);
    } else if (downloadURLs) {
      suggestApp(downloadURLs);
    }
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
