import { FC, useCallback } from 'react';
import { useConnectorTrust } from '@reef-knot/web3-react';
import { TrustCircle } from '@lidofinance/lido-ui';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';
import { isAndroid, isIOS } from '../helpers';

const ConnectTrust: FC<ConnectWalletProps> = (props) => {
  const { onConnect, setRequirements, ...rest } = props;
  const { connect } = useConnectorTrust();

  const handleConnect = useCallback(async () => {
    if (!connect || !(isIOS || isAndroid)) {
      setRequirements(true, {
        icon: <TrustCircle />,
        title: "Trust Wallet couldn't connect",
        text: 'It is available only on iOS and Android devices.',
      });
      return;
    }
    onConnect?.();
    await connect();
  }, [connect, onConnect, setRequirements]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<TrustCircle />}
      onClick={handleConnect}
    >
      Trust
    </ConnectButton>
  );
};

export default ConnectTrust;
