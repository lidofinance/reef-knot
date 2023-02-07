import { FC, useCallback } from 'react';
import {
  MathWallet,
  MathWalletInversion,
} from '@reef-knot/wallets-icons/react';
import { useConnectorMathWallet } from '@reef-knot/web3-react';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components/ConnectButton';
import { CONFLICTS } from '../constants/conflictChecks';
import checkConflicts from '../helpers/checkConflicts';

const ConnectMathWallet: FC<ConnectWalletProps> = (
  props: ConnectWalletProps,
) => {
  const {
    onConnect,
    onBeforeConnect,
    shouldInvertWalletIcon,
    setRequirements,
    metrics,
    ...rest
  } = props;
  const onConnectMathWallet =
    metrics?.events?.connect?.handlers.onConnectMathWallet;
  const onClickMathWallet = metrics?.events?.click?.handlers.onClickMathWallet;
  const { connect } = useConnectorMathWallet({
    onConnect: () => {
      onConnect?.();
      onConnectMathWallet?.();
    },
  });
  const WalletIcon = shouldInvertWalletIcon ? MathWalletInversion : MathWallet;

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickMathWallet?.();

    const { hasConflicts, conflictingApps, conflictingAppsArray } =
      checkConflicts([
        CONFLICTS.Xdefi,
        CONFLICTS.Gamestop,
        CONFLICTS.Tally,
        CONFLICTS.Exodus,
        CONFLICTS.Trust,
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

    await connect();
  }, [
    onBeforeConnect,
    onClickMathWallet,
    connect,
    setRequirements,
    WalletIcon,
  ]);

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
