import 'viem/window'; // for window.ethereum?: EIP1193Provider
import { ElementType, FC, useCallback } from 'react';
import {
  useDisconnect,
  useReefKnotContext,
  useReefKnotModal,
} from '@reef-knot/core-react';
import { WalletAdapterIcons } from '@reef-knot/types';
import { ConnectButtonBase } from '../components/ConnectButtonBase';
import { ConnectInjectedProps } from './types';
import { useConnectWithLoading } from '../hooks/useConnectWithLoading';

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

  const web3ProviderIsDetected =
    typeof globalThis.window?.ethereum?.request === 'function';

  const { loadingWalletId } = useReefKnotContext();
  const { connectWithLoading } = useConnectWithLoading();
  const { disconnect } = useDisconnect();

  const ButtonIcon: ElementType =
    (WalletIcon as ElementType) || (WalletIcon as WalletAdapterIcons)?.light;

  const handleConnect = useCallback(async () => {
    onConnectStart?.();

    if (web3ProviderIsDetected) {
      disconnect?.();
      await connectWithLoading(walletId, { connector });
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
    onConnectStart,
    web3ProviderIsDetected,
    disconnect,
    connectWithLoading,
    walletId,
    connector,
    onConnectSuccess,
    openModalAsync,
    ButtonIcon,
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
