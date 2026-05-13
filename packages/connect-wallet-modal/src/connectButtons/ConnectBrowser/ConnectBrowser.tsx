import 'viem/window'; // for window.ethereum?: EIP1193Provider
import { ElementType, FC, useCallback } from 'react';
import { injected } from 'wagmi/connectors';
import {
  useDisconnect,
  useReefKnotContext,
  useReefKnotModal,
  useEIP6963Providers,
} from '@reef-knot/core-react';
import type { EIP6963ProviderDetail } from '@reef-knot/core-react';
import { WalletAdapterIcons } from '@reef-knot/types';
import { ConnectButtonBase } from '../../components/ConnectButtonBase';
import { ConnectInjectedProps } from '../types';
import { useConnectWithLoading } from '../../hooks/useConnectWithLoading';
import { BrowserWalletIconsGrid } from '../../components/BrowserWalletIconsGrid';

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
  const { openModal, openModalAsync } = useReefKnotModal();

  const web3ProviderIsDetected =
    typeof globalThis.window?.ethereum?.request === 'function';

  const { loadingWalletId } = useReefKnotContext();
  const { connectWithLoading } = useConnectWithLoading();
  const { disconnect } = useDisconnect();
  const detectedProviders = useEIP6963Providers();

  const ButtonIcon: ElementType =
    (WalletIcon as ElementType) || (WalletIcon as WalletAdapterIcons)?.light;

  const connectToEIP6963Provider = useCallback(
    async (provider: EIP6963ProviderDetail) => {
      const connectorFn = injected({
        target: {
          id: provider.info.rdns,
          name: provider.info.name,
          provider: () => provider.provider,
        },
      });
      disconnect?.();
      await connectWithLoading(provider.info.rdns, { connector: connectorFn });
      onConnectSuccess?.();
    },
    [connectWithLoading, disconnect, onConnectSuccess],
  );

  const handleConnect = useCallback(async () => {
    onConnectStart?.();

    if (detectedProviders.length === 1) {
      await connectToEIP6963Provider(detectedProviders[0]);
      return;
    }

    if (detectedProviders.length >= 2) {
      openModal({
        type: 'eip6963',
        props: {
          providers: detectedProviders,
          onSelect: connectToEIP6963Provider,
        },
      });
      return;
    }

    // No EIP-6963 wallets detected — fall back to legacy window.ethereum
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
    detectedProviders,
    connectToEIP6963Provider,
    openModal,
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
      icon={BrowserWalletIconsGrid}
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
