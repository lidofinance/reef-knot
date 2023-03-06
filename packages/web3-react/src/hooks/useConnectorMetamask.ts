import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useCallback } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useConnectors } from './useConnectors';
import { useWeb3 } from './useWeb3';
import {
  hasInjected,
  isBraveWalletProvider,
  checkIfBraveBrowser,
  openWindow,
} from '../helpers';
import { useForceDisconnect } from './useDisconnect';
import { ConnectorHookArgs } from './types';

type ConnectorHookResult = {
  connect: () => Promise<void>;
  connector: InjectedConnector;
};

const WALLET_URL = 'https://metamask.app.link/dapp/';

export const useConnectorMetamask = (
  args?: ConnectorHookArgs,
): ConnectorHookResult => {
  const { injected } = useConnectors();
  const { activate } = useWeb3();
  const { disconnect } = useForceDisconnect();
  const onConnect = args?.onConnect;

  const openInWallet = useCallback(() => {
    try {
      const { host, pathname, search } = window.location;
      const pageUrlWithoutProtocol = encodeURI(host + pathname + search);
      openWindow(`${WALLET_URL}${pageUrlWithoutProtocol}`);
    } catch (error) {
      warning(false, 'Failed to open the link');
    }
  }, []);

  const connect = useCallback(async () => {
    invariant(injected, 'Connector is required');

    // Brave Wallet mimics MetaMask.
    // If a user has the Brave Browser without the MetaMask extension we want
    // to redirect the user to the MetaMask website.
    // If MetaMask is installed, the isBraveWallet property will be false.
    if ((await checkIfBraveBrowser()) && isBraveWalletProvider()) {
      openInWallet();
      return;
    }

    // Do not check for isMetamaskProvider here,
    // it will break an ability to connect with other EIP-1193 wallets,
    // which do not have their branded connection button
    // and recommend to click on MetaMask button in such case.
    if (hasInjected()) {
      await disconnect();
      await activate(injected);
      onConnect?.();
    } else {
      openInWallet();
    }
  }, [injected, openInWallet, disconnect, activate, onConnect]);

  return { connect, connector: injected };
};
