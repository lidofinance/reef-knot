import { FC, useCallback } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { ConnectButton } from '../components';
import { capitalize } from '../helpers';
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
    ...rest
  } = props;

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
  const { disconnectAsync } = useDisconnect();

  const connector = connectors.find((c) => c.id === 'injected');

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    metricsOnClick?.();

    await disconnectAsync;
    await connectAsync({ connector });
  }, [
    connectAsync,
    connector,
    disconnectAsync,
    metricsOnClick,
    onBeforeConnect,
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
