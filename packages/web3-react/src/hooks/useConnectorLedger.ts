import { useCallback } from 'react';
import { LedgerHQConnector } from '@reef-knot/ledger-connector';
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
    disconnect();

    // Workaround for an issue when connection does not happen because of
    // Warning: Suppressed stale connector activation [object Object]
    // Reproducible on a stake widget, but not in the reef-knot demo app.
    // This is web3-react related issue, see https://github.com/Uniswap/web3-react/issues/78
    // In our case may happen because `disconnect()` on the upper line is not awaited.
    // Leaving it like this, because web3-react will be removed soon and the code will be rewritten.
    await new Promise((resolve) => setTimeout(resolve, 500));

    await activate(ledger, () => {}, true);
    onConnect?.();
  }, [activate, disconnect, ledger, onConnect]);

  return {
    connect,
    connector: ledger,
  };
};
