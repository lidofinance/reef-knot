import React, { FC, useCallback } from 'react';
import { useConnect } from 'wagmi';
import { useDisconnect } from '@reef-knot/web3-react';
import { ConnectButton } from '../components';
import { capitalize, suggestApp } from '../helpers';
import { ConnectInjectedProps } from './types';

export const ConnectInjected: FC<ConnectInjectedProps> = (
  props: ConnectInjectedProps,
) => {
  const {
    onConnect,
    onBeforeConnect,
    setRequirements,
    shouldInvertWalletIcon,
    metrics,
    walletId,
    walletName,
    icons,
    downloadURLs,
    detector,
    ...rest
  } = props;

  const walletIsDetected = detector();
  const walletIdCapitalized = capitalize(walletId);
  const metricsOnConnect =
    metrics?.events?.connect?.handlers[`onConnect${walletIdCapitalized}`];
  const metricsOnClick =
    metrics?.events?.click?.handlers[`onClick${walletIdCapitalized}`];

  const { connectAsync, connectors } = useConnect({
    onSuccess() {
      onConnect?.();
      metricsOnConnect?.();
    },
  });
  const { disconnect } = useDisconnect();

  const connector = connectors.find((c) => c.id === 'injected');

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    metricsOnClick?.();

    if (walletIsDetected) {
      await disconnect?.();
      await connectAsync({ connector });
    } else {
      suggestApp(downloadURLs);
    }
  }, [
    connectAsync,
    connector,
    disconnect,
    downloadURLs,
    metricsOnClick,
    onBeforeConnect,
    walletIsDetected,
  ]);

  const WalletIcon = shouldInvertWalletIcon ? icons.dark : icons.light;
  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      {walletName}
    </ConnectButton>
  );
};
