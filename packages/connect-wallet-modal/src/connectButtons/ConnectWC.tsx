import React, { FC, useCallback, useEffect } from 'react';
import { useConnect } from 'wagmi';
import { useDisconnect } from '@reef-knot/web3-react';
import { ConnectButton } from '../components';
import { capitalize } from '../helpers';
import { ConnectWCProps } from './types';

let redirectionWindow: Window | null = null;

const getRedirectionLoadingHTML = (walletName: string) => {
  return `<!DOCTYPE html><html lang="en"><head><title>Loading ${walletName}</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="display: flex;justify-content: center"><h1 style="font-family: sans-serif">Loading ${walletName}</h1></body></html>`;
};

const setRedirectionWindowLocation = (redirectLink: string, WCURI: string) => {
  if (redirectionWindow && redirectLink && WCURI) {
    const encodedWCURI = encodeURIComponent(WCURI);
    redirectionWindow.location.href = `${redirectLink}${encodedWCURI}`;
  }
};

export const ConnectWC: FC<ConnectWCProps> = (props: ConnectWCProps) => {
  const {
    onConnect,
    onBeforeConnect,
    setRequirements,
    shouldInvertWalletIcon,
    metrics,
    walletId,
    walletName,
    icons,
    icon,
    downloadURLs,
    connector,
    walletconnectExtras,
    ...rest
  } = props;

  const walletIdCapitalized = capitalize(walletId);
  const metricsOnConnect =
    metrics?.events?.connect?.handlers[`onConnect${walletIdCapitalized}`];
  const metricsOnClick =
    metrics?.events?.click?.handlers[`onClick${walletIdCapitalized}`];

  const WCURIConnector = walletconnectExtras?.connectionViaURI?.connector;
  const WCURICondition = walletconnectExtras?.connectionViaURI?.condition;
  const WCURIRedirectLink = walletconnectExtras?.connectionViaURI?.redirectLink;
  const WCURICloseRedirectionWindow =
    walletconnectExtras?.connectionViaURI?.closeRedirectionWindow ?? true;

  useEffect(() => {
    const redirect = async () => {
      if (WCURIConnector && WCURICondition && WCURIRedirectLink) {
        const WCURI = (await WCURIConnector.getProvider()).connector.uri;
        setRedirectionWindowLocation(WCURIRedirectLink, WCURI);
      }
    };
    WCURIConnector?.on('message', redirect);
    return () => {
      WCURIConnector?.off('message', redirect);
    };
  }, [WCURICondition, WCURIConnector, WCURIRedirectLink]);

  const { connectAsync } = useConnect({
    onSuccess() {
      onConnect?.();
      metricsOnConnect?.();
    },
  });
  const { disconnect } = useDisconnect();

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    metricsOnClick?.();

    disconnect?.();

    if (WCURICondition) {
      // because of popup blockers, window.open must be called directly from onclick handler
      redirectionWindow = window.open('', '_blank');
      redirectionWindow?.document.write(getRedirectionLoadingHTML(walletName));
      await connectAsync({ connector: WCURIConnector });
      if (WCURICloseRedirectionWindow) {
        redirectionWindow?.close();
      }
    } else {
      await connectAsync({ connector });
    }
  }, [
    WCURICloseRedirectionWindow,
    WCURICondition,
    WCURIConnector,
    connectAsync,
    connector,
    disconnect,
    metricsOnClick,
    onBeforeConnect,
    walletName,
  ]);

  const WalletIcon = icon || icons;

  return (
    <ConnectButton
      {...rest}
      icon={WalletIcon}
      shouldInvertWalletIcon={shouldInvertWalletIcon}
      onClick={handleConnect}
    >
      {walletName}
    </ConnectButton>
  );
};
