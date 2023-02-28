import { FC, useCallback, useEffect } from 'react';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import { Ambire } from '@reef-knot/wallets-icons/react';
import { useConnect, useDisconnect } from 'wagmi';
import { RKConnectorWalletConnect } from '@reef-knot/core-react';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components';

let newWindow: Window | undefined | null;
// Storing html as a string here to not overcomplicate build config
const newWindowHtml =
  '<!DOCTYPE html><html lang="en"><head><title>Loading Ambire wallet</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="display: flex;justify-content: center"><h1 style="font-family: sans-serif">Loading Ambire wallet</h1></body></html>';

const openAmbireWindow = (uri: string | undefined) => {
  if (newWindow && uri) {
    const encodedWCUri = encodeURIComponent(uri);
    newWindow.location.href = `https://wallet.ambire.com/?uri=${encodedWCUri}`;
  }
};

const ConnectAmbire: FC<ConnectWalletProps> = (props) => {
  const {
    onConnect,
    onBeforeConnect,
    shouldInvertWalletIcon,
    metrics,
    ...rest
  } = props;
  const onConnectAmbire = metrics?.events?.connect?.handlers.onConnectAmbire;
  const onClickAmbire = metrics?.events?.click?.handlers.onClickAmbire;

  const { connectAsync, connectors } = useConnect({
    onSuccess() {
      onConnect?.();
      onConnectAmbire?.();
    },
  });
  const { disconnectAsync } = useDisconnect();

  const connector = connectors.find(
    (c: RKConnectorWalletConnect) => c._reefknot_id === 'WalletConnectURI',
  );

  useEffect(() => {
    if (connector) {
      const getUri = async () => {
        const provider =
          (await connector.getProvider()) as WalletConnectProvider;
        const { uri } = provider.connector;
        return uri;
      };

      connector.once('message', async () => {
        const uri = await getUri();
        openAmbireWindow(uri);
      });
    }
  }, [connector]);

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickAmbire?.();

    // because of popup blockers, window.open must be called directly from onclick handler
    newWindow = window.open('', '_blank');
    newWindow?.document.write(newWindowHtml);

    await disconnectAsync;
    await connectAsync({ connector });
  }, [
    onBeforeConnect,
    onClickAmbire,
    disconnectAsync,
    connectAsync,
    connector,
  ]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<Ambire />}
      onClick={handleConnect}
    >
      Ambire
    </ConnectButton>
  );
};

export default ConnectAmbire;
