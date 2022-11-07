import { FC, useCallback } from 'react';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';
import {
  MathWalletCircle,
  MathWalletCircleInversion,
} from '@lidofinance/lido-ui';
import { useConnectorMathWallet } from '@reef-knot/web3-react';
import { CONFLICTS } from '../constants/conflictChecks';
import checkConflicts from './checkConflicts';

const ConnectMathWallet: FC<ConnectWalletProps> = (
  props: ConnectWalletProps,
) => {
  const { onConnect, shouldInvertWalletIcon, setRequirements, ...rest } = props;
  const { connect } = useConnectorMathWallet();
  const WalletIcon = shouldInvertWalletIcon
    ? MathWalletCircleInversion
    : MathWalletCircle;

  const handleConnect = useCallback(async () => {
    const { hasConflicts, conflictingApps, conflictingAppsArray } =
      checkConflicts([
        CONFLICTS.Xdefi,
        CONFLICTS.Gamestop,
        CONFLICTS.Tally,
        CONFLICTS.Exodus,
      ]);

    if (hasConflicts) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "MathWallet couldn't connect",
        text:
          conflictingAppsArray.length > 1 ? (
            <div>
              Your browser has these extensions turned-on: <br />
              {conflictingApps} <br />
              Please, turn them off and reload the page to enable MathWallet.
            </div>
          ) : (
            `Your browser has a turned-on “${conflictingApps}” extension.` +
            ' Please, turn off this extension and reload the page to enable MathWallet.'
          ),
      });
      return;
    }

    onConnect?.();
    await connect();
  }, [onConnect, connect, setRequirements, WalletIcon]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      MathWallet
    </ConnectButton>
  );
};

export default ConnectMathWallet;
