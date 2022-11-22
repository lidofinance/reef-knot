import { useCallback } from 'react';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { useConnectors } from './useConnectors';
import { useForceDisconnect } from './useDisconnect';
import { useWeb3 } from './useWeb3';
import { ConnectorHookArgs } from './types';

type ConnectorHookResult = {
  connect: () => Promise<void>;
  connector: WalletConnectConnector;
};

export const useConnectorWalletConnect = (
  args?: ConnectorHookArgs,
): ConnectorHookResult => {
  const { walletconnect } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();
  const onConnect = args?.onConnect;

  const connect = useCallback(async () => {
    await disconnect();
    await activate(walletconnect);
    onConnect?.();
  }, [activate, disconnect, onConnect, walletconnect]);

  return { connect, connector: walletconnect };
};
