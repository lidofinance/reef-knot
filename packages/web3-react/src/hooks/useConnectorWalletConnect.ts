import { useConnect, useDisconnect } from 'wagmi';
import { useConnectors } from './useConnectors';
import { ConnectorHookArgs } from './types';

export const useConnectorWalletConnect = (
  args: ConnectorHookArgs & {
    noWalletsLinks?: boolean;
    isUriOnly?: boolean;
  } = {},
) => {
  const { walletconnect, WalletConnectUri, WalletConnectNoLinks } =
    useConnectors();

  let connector = walletconnect;
  connector = args.isUriOnly ? WalletConnectUri : connector;
  connector = args.noWalletsLinks ? WalletConnectNoLinks : connector;

  const { connect, connectAsync } = useConnect({
    connector,
    onSuccess() {
      args.onConnect?.();
    },
  });

  const { disconnect, disconnectAsync } = useDisconnect();

  const reconnect = async () => {
    await disconnectAsync();
    await connectAsync();
  };

  return {
    reconnect,
    connect,
    connectAsync,
    disconnect,
    disconnectAsync,
    connector,
  };
};
