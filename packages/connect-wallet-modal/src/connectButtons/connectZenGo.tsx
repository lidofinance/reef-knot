import { FC, useCallback, useEffect } from 'react';
import {
  useConnectorWalletConnectNoLinks,
  useConnectorWalletConnectUri,
} from '@reef-knot/web3-react';
import { Zengo as WalletIcon } from '@lidofinance/lido-ui';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';
import { isMobileOrTablet } from '../helpers';

let newWindow: Window | null = null;
// Storing html as a string here to not overcomplicate build config
const newWindowHtml =
  '<!DOCTYPE html><html lang="en"><head><title>Loading ZenGo wallet</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="display: flex;justify-content: center"><h1 style="font-family: sans-serif">Loading ZenGo wallet</h1></body></html>';

const openDeeplink = (uri: string | undefined) => {
  if (newWindow && uri) {
    const encodedWCUri = encodeURIComponent(uri);
    newWindow.location.href = `https://get.zengo.com/wc?uri=${encodedWCUri}`;
  }
};

const ConnectZenGo: FC<ConnectWalletProps> = (props) => {
  const { onConnect, metrics, ...rest } = props;
  const { connect } = useConnectorWalletConnectNoLinks();
  const { connect: connectWCUri, connector: connectorWCUri } =
    useConnectorWalletConnectUri();
  const onConnectZenGo = metrics?.events?.connect?.handlers.onConnectZenGo;

  useEffect(() => {
    if (isMobileOrTablet) {
      connectorWCUri.on('URI_AVAILABLE', openDeeplink);

      return () => {
        connectorWCUri.off('URI_AVAILABLE', openDeeplink);
      };
    }
    return undefined;
  }, [connectorWCUri]);

  const handleConnect = useCallback(async () => {
    if (isMobileOrTablet) {
      // because of popup blockers, window.open must be called directly from onclick handler
      newWindow = window.open('', '_blank');
      newWindow?.document.write(newWindowHtml);

      await connectWCUri();

      // the code below is reached only in case of successful connection
      newWindow?.close();
    } else {
      await connect();
    }
    onConnect?.();
    onConnectZenGo?.();
  }, [onConnect, onConnectZenGo, connectWCUri, connect]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      ZenGo
    </ConnectButton>
  );
};

export default ConnectZenGo;
