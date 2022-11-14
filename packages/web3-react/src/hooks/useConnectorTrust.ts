import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback } from 'react';
import { openWindow } from '@lido-sdk/helpers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import { hasInjected, isTrustProvider, isMobileOrTablet } from '../helpers';
import { useForceDisconnect } from './useDisconnect';

type ConnectorHookResult = {
  connect: () => Promise<void>;
  connector: InjectedConnector;
};

const WALLET_URL_MOBILE = 'https://link.trustwallet.com/open_url?url=';
const WALLET_URL_BROWSER = 'https://trustwallet.com/browser-extension';

export const useConnectorTrust = (): ConnectorHookResult => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();

  const openInWallet = useCallback(() => {
    try {
      if (isMobileOrTablet) {
        const pageUrl = encodeURIComponent(window.location.href);
        openWindow(`${WALLET_URL_MOBILE}${pageUrl}`);
      } else {
        openWindow(WALLET_URL_BROWSER);
      }
    } catch (error) {
      warning(false, 'Failed to open the link');
    }
  }, []);

  const connect = useCallback(async () => {
    invariant(injected, 'Connector is required');

    if (hasInjected() && isTrustProvider()) {
      await disconnect();
      activate(injected);
    } else {
      openInWallet();
    }
  }, [activate, disconnect, openInWallet, injected]);

  return {
    connect,
    connector: injected,
  };
};
