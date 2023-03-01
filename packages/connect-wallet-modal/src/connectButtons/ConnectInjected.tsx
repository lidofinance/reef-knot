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
    metrics,
    walletId,
    walletName,
    icon,
    ...rest
  } = props;

  const walletIdCapitilized = capitalize(walletId);
  const metricsOnConnect =
    metrics?.events?.connect?.handlers[`onConnect${walletIdCapitilized}`];
  const metricsOnClick =
    metrics?.events?.click?.handlers[`onClick${walletIdCapitilized}`];

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

  const IconReactNode = icon;
  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<IconReactNode />}
      onClick={handleConnect}
    >
      {walletName}
    </ConnectButton>
  );
};
