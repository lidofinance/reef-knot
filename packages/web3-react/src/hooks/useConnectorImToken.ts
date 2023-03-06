import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import { hasInjected, isImTokenProvider, openWindow } from '../helpers';
import { useForceDisconnect } from './useDisconnect';
import { ConnectorHookArgs } from './types';

type ConnectorHookResult = {
  connect: () => Promise<void>;
  connector: InjectedConnector;
};

const WALLET_URL = 'imtokenv2://navigate/DappView?url=';

export const useConnectorImToken = (
  args?: ConnectorHookArgs,
): ConnectorHookResult => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();
  const onConnect = args?.onConnect;

  const openInWallet = useCallback(() => {
    try {
      const pageUrl = encodeURIComponent(window.location.href);
      openWindow(`${WALLET_URL}${pageUrl}`);
    } catch (error) {
      warning(false, 'Failed to open the link');
    }
  }, []);

  const connect = useCallback(async () => {
    invariant(injected, 'Connector is required');

    if (hasInjected() && isImTokenProvider()) {
      await disconnect();
      await activate(injected);
      onConnect?.();
    } else {
      openInWallet();
    }
  }, [injected, disconnect, activate, onConnect, openInWallet]);

  return {
    connect,
    connector: injected,
  };
};
