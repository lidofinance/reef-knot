import { FC, useCallback, useEffect } from 'react';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import { Ambire } from '@reef-knot/wallets-icons/react';
import { useConnectorWalletConnect } from '@reef-knot/web3-react';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components/ConnectButton';

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

  const { reconnect, connector } = useConnectorWalletConnect({
    onConnect: () => {
      onConnect?.();
      onConnectAmbire?.();
    },
  });

  useEffect(() => {
    const getUri = async () => {
      const provider = (await connector.getProvider()) as WalletConnectProvider;
      const { uri } = provider.connector;
      return uri;
    };

    connector.once('message', async () => {
      const uri = await getUri();
      openAmbireWindow(uri);
    });
  }, [connector]);

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickAmbire?.();

    // because of popup blockers, window.open must be called directly from onclick handler
    newWindow = window.open('', '_blank');
    newWindow?.document.write(newWindowHtml);

    reconnect();
  }, [reconnect, onBeforeConnect, onClickAmbire]);

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
