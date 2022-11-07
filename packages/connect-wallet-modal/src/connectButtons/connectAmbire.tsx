import { FC, useCallback, useEffect } from 'react';
import { useConnectorWalletConnectUri } from '@reef-knot/web3-react';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';
import { Ambire } from '@lidofinance/lido-ui';

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
  const { onConnect, shouldInvertWalletIcon, ...rest } = props;
  const { connect, connector } = useConnectorWalletConnectUri();

  useEffect(() => {
    connector.on('URI_AVAILABLE', openAmbireWindow);

    return () => {
      connector.off('URI_AVAILABLE', openAmbireWindow);
    };
  }, [connector]);

  const handleConnect = useCallback(async () => {
    onConnect?.();

    // because of popup blockers, window.open must be called directly from onclick handler
    newWindow = window.open('', '_blank');
    newWindow?.document.write(newWindowHtml);

    await connect();
  }, [onConnect, connect]);

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
