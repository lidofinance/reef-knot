import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import { hasInjected, isTallyProvider } from '../helpers';
import { useForceDisconnect } from './useDisconnect';
import { ConnectorHookArgs } from './types';

type ConnectorHookResult = {
  connect: () => Promise<void>;
  connector: InjectedConnector;
};

const WALLET_URL = 'https://tally.cash/download';

export const useConnectorTally = (
  args?: ConnectorHookArgs,
): ConnectorHookResult => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();
  const onConnect = args?.onConnect;

  const suggestApp = useCallback(() => {
    openWindow(WALLET_URL);
  }, []);

  const connect = useCallback(async () => {
    invariant(injected, 'Connector is required');

    if (hasInjected() && isTallyProvider()) {
      await disconnect();
      await activate(injected);
      onConnect?.();
    } else {
      suggestApp();
    }
  }, [injected, disconnect, activate, onConnect, suggestApp]);

  return {
    connect,
    connector: injected,
  };
};
