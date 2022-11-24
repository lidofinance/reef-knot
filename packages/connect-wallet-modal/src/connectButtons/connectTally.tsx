import { FC, useCallback } from 'react';
import { useConnectorTally } from '@reef-knot/web3-react';
import { TallyCircle } from '@lidofinance/lido-ui';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';
import { isMobileOrTablet } from '../helpers';

const ConnectTally: FC<ConnectWalletProps> = (props: ConnectWalletProps) => {
  const {
    onConnect,
    shouldInvertWalletIcon,
    setRequirements,
    metrics,
    ...rest
  } = props;
  const onConnectTally = metrics?.events?.connect?.handlers.onConnectTally;
  const { connect } = useConnectorTally({
    onConnect: () => {
      onConnect?.();
      onConnectTally?.();
    },
  });

  const handleConnect = useCallback(async () => {
    if (!connect || isMobileOrTablet) {
      setRequirements(true, {
        icon: <TallyCircle />,
        title: "Tally Ho wallet couldn't connect",
        text: 'At the current moment, it is only available as extension for Chrome, Brave, and Firefox.',
      });
      return;
    }

    await connect();
  }, [connect, setRequirements]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<TallyCircle />}
      onClick={handleConnect}
    >
      Tally
    </ConnectButton>
  );
};

export default ConnectTally;
