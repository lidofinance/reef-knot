import { FC, useCallback, useEffect } from 'react';
import { ZenGo as WalletIcon } from '@reef-knot/wallets-icons/react';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import { useConnectorWalletConnect } from '@reef-knot/web3-react';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components/ConnectButton';
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
  const { onConnect, onBeforeConnect, metrics, ...rest } = props;
  const onConnectZenGo = metrics?.events?.connect?.handlers.onConnectZenGo;
  const onClickZenGo = metrics?.events?.click?.handlers.onClickZenGo;

  const onConnectHandler = () => {
    onConnect?.();
    onConnectZenGo?.();
  };

  const { reconnect } = useConnectorWalletConnect({
    onConnect: onConnectHandler,
    noWalletsLinks: true,
  });

  const { reconnect: reconnectWCUri, connector: connectorWCUri } =
    useConnectorWalletConnect({ onConnect: onConnectHandler, isUriOnly: true });

  useEffect(() => {
    const getUri = async () => {
      const provider =
        (await connectorWCUri.getProvider()) as WalletConnectProvider;
      const { uri } = provider.connector;
      return uri;
    };

    if (isMobileOrTablet) {
      connectorWCUri.once('message', async () => {
        const uri = await getUri();
        openDeeplink(uri);
      });
    }
  }, [connectorWCUri]);

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickZenGo?.();

    if (isMobileOrTablet) {
      // because of popup blockers, window.open must be called directly from onclick handler
      newWindow = window.open('', '_blank');
      newWindow?.document.write(newWindowHtml);

      await reconnectWCUri();

      // the code below is reached only in case of successful connection
      newWindow?.close();
    } else {
      await reconnect();
    }
  }, [onBeforeConnect, onClickZenGo, reconnect, reconnectWCUri]);

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
