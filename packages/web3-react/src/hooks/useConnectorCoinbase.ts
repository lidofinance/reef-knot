import { useCallback } from 'react';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { useConnectors } from './useConnectors';
import { useForceDisconnect } from './useDisconnect';
import { useWeb3 } from './useWeb3';
import { ConnectorHookArgs } from './types';

type Connector = {
  connect: () => Promise<void>;
  connector: WalletLinkConnector;
};

export const useConnectorCoinbase = (args?: ConnectorHookArgs): Connector => {
  const { coinbase } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();
  const onConnect = args?.onConnect;

  const connect = useCallback(async () => {
    await disconnect();
    await activate(coinbase);
    onConnect?.();
  }, [disconnect, activate, coinbase, onConnect]);

  return { connect, connector: coinbase };
};
