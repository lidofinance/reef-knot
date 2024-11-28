import React, { ElementType, FC, useCallback } from 'react';
import { useConnect } from 'wagmi';
import { useDisconnect, useReefKnotModal } from '@reef-knot/core-react';
import { WalletAdapterIcons } from '@reef-knot/types';
import { ConnectButtonBase } from '../components/ConnectButtonBase';
import { ConnectInjectedProps } from './types';
import 'viem/window'; // for window.ethereum?: EIP1193Provider

export const ConnectBrowser: FC<ConnectInjectedProps> = (
  props: ConnectInjectedProps,
) => {
  const {
    darkThemeEnabled,
    walletId,
    walletName,
    icon: WalletIcon,
    connector,
    onConnectStart,
    onConnectSuccess,
    ...rest
  } = props;
  const { openModalAsync } = useReefKnotModal();

  const web3ProviderIsDetected = !!globalThis.window?.ethereum;

  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();

  const ButtonIcon: ElementType =
    (WalletIcon as ElementType) || (WalletIcon as WalletAdapterIcons)?.light;

  const handleConnect = useCallback(async () => {
    onConnectStart?.();

    if (web3ProviderIsDetected) {
      disconnect?.();
      await connectAsync({ connector });
      onConnectSuccess?.();
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
    openModalAsync,
    web3ProviderIsDetected,
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
