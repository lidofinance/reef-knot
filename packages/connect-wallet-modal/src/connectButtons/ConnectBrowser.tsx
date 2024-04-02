import React, { ElementType, FC, useCallback } from 'react';
import { useConnect } from 'wagmi';
import { useDisconnect, useReefKnotModal } from '@reef-knot/core-react';
import { WalletAdapterIcons } from '@reef-knot/types';
import { ConnectButton } from '../components/ConnectButton';
import { capitalize } from '../helpers';
import { ConnectInjectedProps } from './types';

export const ConnectBrowser: FC<ConnectInjectedProps> = (
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
    connector,
    ...rest
  } = props;
  const { openModalAsync } = useReefKnotModal();

  const web3ProviderIsDetected = !!globalThis.window?.ethereum;
  const walletIdCapitalized = capitalize(walletId);
  const metricsOnConnect =
    metrics?.events?.connect?.handlers[`onConnect${walletIdCapitalized}`];
  const metricsOnClick =
    metrics?.events?.click?.handlers[`onClick${walletIdCapitalized}`];

  const { connectAsync } = useConnect({
    onSuccess() {
      onConnect?.();
      metricsOnConnect?.();
    },
  });
  const { disconnect } = useDisconnect();

  const ButtonIcon: ElementType =
    (WalletIcon as ElementType) || (WalletIcon as WalletAdapterIcons)?.light;

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    metricsOnClick?.();

    if (web3ProviderIsDetected) {
      disconnect?.();
      await connectAsync({ connector });
    } else {
      await openModalAsync({
        type: 'requirements',
        props: {
          icon: <ButtonIcon />,
          title: 'No wallets have been detected',
          text:
            'This button is intended for generic connection of browser extension wallets,' +
            ' but no default injected web3 provider has been detected.' +
            ' Please install a suitable browser extension wallet or ensure that it is enabled, and reload the page.',
        },
      });
    }
  }, [
    ButtonIcon,
    connectAsync,
    connector,
    disconnect,
    metricsOnClick,
    onBeforeConnect,
    openModalAsync,
    web3ProviderIsDetected,
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
