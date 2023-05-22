import React, { FC, useCallback, useEffect } from 'react';
import { useConnect } from 'wagmi';
import { useDisconnect } from '@reef-knot/web3-react';
import { ConnectButton } from '../components/ConnectButton';
import { capitalize } from '../helpers';
import { ConnectWCProps } from './types';

let redirectionWindow: Window | null = null;

const getRedirectionLoadingHTML = () => {
  return `<!DOCTYPE html><html lang="en"><head><title>Wallet loading</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="display: flex;justify-content: center"><h1 style="font-family: sans-serif">Wallet loading</h1></body></html>`;
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
    // BEGIN Handle WalletConnect v2 redirection (connection without QR modal)
    (async () => {
      const provider = await WCURIConnector?.getProvider();
      provider?.once('display_uri', (uri: string) => {
        if (WCURIRedirectLink)
          setRedirectionWindowLocation(WCURIRedirectLink, uri);
      });
    })();
    // END Handle WalletConnect v2 redirection (connection without QR modal)

    // BEGIN Handle legacy WalletConnect v1 redirection (connection without QR modal)
    // TODO: remove after migration to v2
    const redirect = async () => {
      if (WCURIConnector && WCURICondition && WCURIRedirectLink) {
        const WCURI = (await WCURIConnector.getProvider())?.connector?.uri;
        if (WCURI) setRedirectionWindowLocation(WCURIRedirectLink, WCURI);
      }
    };
    WCURIConnector?.on('message', redirect);
    // END Handle legacy WalletConnect v1 redirection (connection without QR modal)

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
      redirectionWindow?.document.write(getRedirectionLoadingHTML());
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
