import React, { FC, useCallback, useEffect, useState } from 'react';
import { useConnect } from 'wagmi';
import { useDisconnect } from '@reef-knot/web3-react';
import { WCWarnBannerRequest } from '@reef-knot/ui-react';
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
    const redirect = (uri: string) => {
      if (WCURIRedirectLink)
        setRedirectionWindowLocation(WCURIRedirectLink, uri);
    };
    let provider: any;
    (async () => {
      provider = await WCURIConnector?.getProvider();
      provider?.on('display_uri', redirect);
    })();
    // END Handle WalletConnect v2 redirection (connection without QR modal)

    return () => {
      provider?.off('display_uri', redirect);
    };
  }, [WCURICondition, WCURIConnector, WCURIRedirectLink]);

  const { connectAsync } = useConnect({
    onSuccess() {
      onConnect?.();
      metricsOnConnect?.();
    },
  });
  const { disconnect } = useDisconnect();

  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    try {
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
    } finally {
      setIsConnecting(false);
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
    <>
      {isConnecting ? <WCWarnBannerRequest /> : null}
      <ConnectButton
        {...rest}
        icon={WalletIcon}
        shouldInvertWalletIcon={shouldInvertWalletIcon}
        onClick={handleConnect}
      >
        {walletName}
      </ConnectButton>
    </>
  );
};
