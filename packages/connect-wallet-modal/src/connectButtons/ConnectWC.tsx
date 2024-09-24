import React, { FC, useCallback } from 'react';
import { Connector, useConfig, useConnect } from 'wagmi';
import { useDisconnect, useReefKnotContext } from '@reef-knot/core-react';
import { isMobileOrTablet } from '@reef-knot/wallets-helpers';
import { getWalletConnectUri } from '@reef-knot/wallets-helpers';
import { ConnectButtonBase } from '../components/ConnectButtonBase';
import { openWindow } from '../helpers/openWindow';
import { ConnectWCProps } from './types';
import { useConnectWithLoading } from '../hooks/useConnectWithLoading';

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
    darkThemeEnabled,
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

  const metricsOnConnect = metrics?.events?.connect?.handlers[walletId];
  const metricsOnClick = metrics?.events?.click?.handlers[walletId];

  const config = useConfig();
  const { loadingWalletId } = useReefKnotContext();
  const { connectAsync } = useConnect();
  const { connectWithLoading } = useConnectWithLoading();
  const { disconnect } = useDisconnect();

  // WCURI – WalletConnect Pairing URI: https://docs.walletconnect.com/2.0/specs/clients/core/pairing/pairing-uri
  // Used for connection without WalletConnect QR modal via redirect
  const WCURIConnectorFn =
    walletconnectExtras?.connectionViaURI?.createConnectorFn;
  const WCURICondition = walletconnectExtras?.connectionViaURI?.condition;
  const WCURIRedirectLink = walletconnectExtras?.connectionViaURI?.redirectLink;
  const WCURICloseRedirectionWindow =
    walletconnectExtras?.connectionViaURI?.closeRedirectionWindow ?? true;

  const handleConnect = useCallback(async () => {
    // Handle deeplink on mobiles before connecting to WC
    if (isMobileOrTablet && deeplink) {
      openWindow(deeplink);
      return; // A user was redirected to a wallet mobile app, no need to continue
    }

    metricsOnClick?.();
    disconnect?.();

    const onSuccess = () => {
      onConnect?.();
      metricsOnConnect?.();
    };

    if (WCURICondition && WCURIConnectorFn && WCURIRedirectLink) {
      // BEGIN Handle connection via redirect using WC Pairing URI (without WalletConnect QR modal)
      // Because of popup blockers, window.open must be called directly from onclick handler
      redirectionWindow = window.open('', '_blank');
      redirectionWindow?.document.write(getRedirectionLoadingHTML());

      await Promise.all([
        connectAsync({ connector: WCURIConnectorFn }),
        (async () => {
          // One-time disposable connector to access `.getProvider()` before wagmi will initialize it
          // Do not save it nor use it later
          const connectorDisposable = WCURIConnectorFn({
            chains: config.chains,
            emitter: {} as any,
          }) as Connector;
          // Wait for WalletConnect Pairing URI to arrive
          const wcUri = await getWalletConnectUri(connectorDisposable);
          setRedirectionWindowLocation(WCURIRedirectLink, wcUri);
          // END Handle connection via redirect using WC Pairing URI (without WalletConnect QR modal)
        })(),
      ]);

      onSuccess();
      // We got a connection result
      if (WCURICloseRedirectionWindow) {
        // Close the previously opened window if necessary
        redirectionWindow?.close();
      }
    } else {
      await connectWithLoading(walletId, { connector });
      onSuccess();
    }
  }, [
    deeplink,
    disconnect,
    metricsOnClick,
    WCURICloseRedirectionWindow,
    metricsOnClick,
    disconnect,
    WCURICondition,
    WCURIConnectorFn,
    WCURIRedirectLink,
    onConnect,
    metricsOnConnect,
    connectAsync,
    WCURICloseRedirectionWindow,
    config.chains,
    connectWithLoading,
    walletId,
    connector,
  ]);

  return (
    <ConnectButtonBase
      {...rest}
      icon={WalletIcon}
      darkThemeEnabled={darkThemeEnabled}
      isLoading={loadingWalletId === walletId}
      onClick={() => {
        void handleConnect();
      }}
    >
      {walletName}
    </ConnectButtonBase>
  );
};
