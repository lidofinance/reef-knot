import { FC, useCallback } from 'react';
import { useConnectorImToken } from '@reef-knot/web3-react';
import { ImToken as WalletIcon } from '@reef-knot/wallets-icons/react';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';
import { isIOS, isAndroid } from '../helpers';

const ConnectImToken: FC<ConnectWalletProps> = (props) => {
  const { onConnect, onBeforeConnect, setRequirements, metrics, ...rest } =
    props;
  const onConnectImToken = metrics?.events?.connect?.handlers.onConnectImToken;
  const onClickImToken = metrics?.events?.click?.handlers.onClickImToken;
  const { connect } = useConnectorImToken({
    onConnect: () => {
      onConnect?.();
      onConnectImToken?.();
    },
  });

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickImToken?.();

    if (!connect || !(isIOS || isAndroid)) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "imToken couldn't connect",
        text: 'It is available only on iOS and Android devices.',
      });
      return;
    }
    await connect();
  }, [onBeforeConnect, onClickImToken, connect, setRequirements]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      imToken
    </ConnectButton>
  );
};

export default ConnectImToken;
