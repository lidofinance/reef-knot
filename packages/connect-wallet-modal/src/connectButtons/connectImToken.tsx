import { FC, useCallback } from 'react';
import { useConnectorImToken } from '@lido-sdk/web3-react';
import { ImtokenCircle } from '@lidofinance/lido-ui';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';
import { isIOS, isAndroid } from '../helpers';

const ConnectImToken: FC<ConnectWalletProps> = (props) => {
  const { onConnect, setRequirements, ...rest } = props;
  const { connect } = useConnectorImToken();

  const handleConnect = useCallback(async () => {
    if (!connect || !(isIOS || isAndroid)) {
      setRequirements(true, {
        icon: <ImtokenCircle />,
        title: "imToken couldn't connect",
        text: 'It is available only on iOS and Android devices.',
      });
      return;
    }
    onConnect?.();
    await connect();
  }, [onConnect, connect, setRequirements]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<ImtokenCircle />}
      onClick={handleConnect}
    >
      imToken
    </ConnectButton>
  );
};

export default ConnectImToken;
