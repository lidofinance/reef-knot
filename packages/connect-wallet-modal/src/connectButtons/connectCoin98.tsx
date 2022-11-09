import { FC, useCallback } from 'react';
import { useConnectorCoin98 } from '@reef-knot/web3-react';
import { Coin98Circle } from '@lidofinance/lido-ui';
import { CONFLICTS } from '../constants/conflictChecks';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';
import checkConflicts from './checkConflicts';

const ConnectCoin98: FC<ConnectWalletProps> = (props: ConnectWalletProps) => {
  const { onConnect, setRequirements, ...rest } = props;
  const { connect } = useConnectorCoin98();

  const handleConnect = useCallback(async () => {
    const { hasConflicts, conflictingApps, conflictingAppsArray } =
      checkConflicts([
        CONFLICTS.MathWallet,
        CONFLICTS.Tally,
        CONFLICTS.Exodus,
        CONFLICTS.Gamestop,
        CONFLICTS.Xdefi,
      ]);

    if (hasConflicts) {
      setRequirements(true, {
        icon: <Coin98Circle />,
        title: "Coin98 couldn't connect",
        text:
          conflictingAppsArray.length > 1 ? (
            <div>
              Your browser has these extensions turned-on: <br />
              {conflictingApps} <br />
              Please, turn them off and reload the page to enable Coin98.
            </div>
          ) : (
            `Your browser has a turned-on “${conflictingApps}” extension.` +
            ' Please, turn off this extension and reload the page to enable Coin98.'
          ),
      });
      return;
    }

    onConnect?.();
    await connect();
  }, [onConnect, connect, setRequirements]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<Coin98Circle />}
      onClick={handleConnect}
    >
      Coin98
    </ConnectButton>
  );
};

export default ConnectCoin98;
