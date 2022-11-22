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

export const useConnectorWalletConnectUri = (
  args?: ConnectorHookArgs,
): ConnectorHookResult => {
  const { WalletConnectUri: connector } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();
  const onConnect = args?.onConnect;

  const connect = useCallback(async () => {
    await disconnect();
    await activate(connector);
    onConnect?.();
  }, [disconnect, activate, connector, onConnect]);

  return { connect, connector };
};
