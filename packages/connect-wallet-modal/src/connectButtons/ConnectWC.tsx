import React, { FC, useCallback, useState } from 'react';
import { useConnect } from 'wagmi';
import { useDisconnect, isMobileOrTablet } from '@reef-knot/core-react';
import { WCWarnBannerRequest } from '@reef-knot/ui-react';
import { getWalletConnectUri } from '@reef-knot/wallets-helpers';
import { ConnectButton } from '../components/ConnectButton';
import { capitalize, openWindow } from '../helpers';
import { ConnectWCProps } from './types';

let redirectionWindow: Window | null = null;

const getRedirectionLoadingHTML = () => {
  return `<!DOCTYPE html><html lang='en'><head><title>Wallet loading</title><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head><body style='display: flex;justify-content: center'><h1 style='font-family: sans-serif'>Wallet loading</h1></body></html>`;
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
    shouldInvertWalletIcon,
    metrics,
    walletId,
    walletName,
    icon: WalletIcon,
    downloadURLs,
    connector,
    walletconnectExtras,
    deeplink,
    ...rest
  } = props;

  const walletIdCapitalized = capitalize(walletId);
  const metricsOnConnect =
    metrics?.events?.connect?.handlers[`onConnect${walletIdCapitalized}`];
  const metricsOnClick =
    metrics?.events?.click?.handlers[`onClick${walletIdCapitalized}`];

  const { connectAsync } = useConnect({
    onSuccess() {
      onConnect?.();
      metricsOnConnect?.();
    },
  });
  const { disconnect } = useDisconnect();

  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = useCallback(async () => {
    // Handle deeplink on mobiles before connecting to WC
    if (isMobileOrTablet && deeplink) {
      openWindow(deeplink);
      return; // A user was redirected to a wallet mobile app, no need to continue
    }

    // WCURI – WalletConnect Pairing URI: https://docs.walletconnect.com/2.0/specs/clients/core/pairing/pairing-uri
    // Used for connection without WalletConnect QR modal via redirect
    const WCURIConnector = walletconnectExtras?.connectionViaURI?.connector;
    const WCURICondition = walletconnectExtras?.connectionViaURI?.condition;
    const WCURIRedirectLink =
      walletconnectExtras?.connectionViaURI?.redirectLink;
    const WCURICloseRedirectionWindow =
      walletconnectExtras?.connectionViaURI?.closeRedirectionWindow ?? true;

    setIsConnecting(true);

    try {
      onBeforeConnect?.();
      metricsOnClick?.();

      disconnect?.();

      if (WCURICondition && WCURIConnector && WCURIRedirectLink) {
        // BEGIN Handle connection via redirect using WC Pairing URI (without WalletConnect QR modal)
        // Because of popup blockers, window.open must be called directly from onclick handler
        redirectionWindow = window.open('', '_blank');
        redirectionWindow?.document.write(getRedirectionLoadingHTML());

        // Initiate a connection, but do not block the further execution
        connectAsync({ connector: WCURIConnector }).finally(() => {
          // We got a connection result
          if (WCURICloseRedirectionWindow) {
            // Close the previously opened window if necessary
            redirectionWindow?.close();
          }
        });

        // Wait for WalletConnect Pairing URI to arrive
        const wcUri = await getWalletConnectUri(WCURIConnector);
        setRedirectionWindowLocation(WCURIRedirectLink, wcUri);
        // END Handle connection via redirect using WC Pairing URI (without WalletConnect QR modal)
      } else {
        await connectAsync({ connector });
      }
    } finally {
      setIsConnecting(false);
    }
  }, [
    connectAsync,
    connector,
    disconnect,
    metricsOnClick,
    onBeforeConnect,
    walletconnectExtras?.connectionViaURI?.closeRedirectionWindow,
    walletconnectExtras?.connectionViaURI?.condition,
    walletconnectExtras?.connectionViaURI?.connector,
    walletconnectExtras?.connectionViaURI?.redirectLink,
  ]);

  return (
    <>
      {isConnecting ? <WCWarnBannerRequest /> : null}
      <ConnectButton
        {...rest}
        icon={WalletIcon}
        shouldInvertWalletIcon={shouldInvertWalletIcon}
        onClick={() => {
          void handleConnect();
        }}
      >
        {walletName}
      </ConnectButton>
    </>
  );
};
