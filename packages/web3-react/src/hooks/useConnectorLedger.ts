import { useCallback } from 'react';
import { LedgerHQConnector } from 'web3-ledgerhq-connector';
import { useConnectors } from './useConnectors';
import { useForceDisconnect } from './useDisconnect';
import { useWeb3 } from './useWeb3';
import { ConnectorHookArgs } from './types';

type ConnectorHookResult = {
  connect: () => Promise<void>;
  connector: LedgerHQConnector;
};

export const useConnectorLedger = (
  args?: ConnectorHookArgs,
): ConnectorHookResult => {
  const { ledger } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();
  const onConnect = args?.onConnect;

  const connect = useCallback(async () => {
    await disconnect();
    await activate(ledger);
    onConnect?.();
  }, [activate, disconnect, ledger, onConnect]);

  return {
    connect,
    connector: ledger,
  };
};
