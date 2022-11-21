import { FC, useCallback } from 'react';
import { useConnectorGamestop, helpers } from '@reef-knot/web3-react';
import { Gamestop as WalletIcon } from '@lidofinance/lido-ui';
import { CONFLICTS } from '../constants/conflictChecks';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';
import checkConflicts from './checkConflicts';

const ConnectGamestop: FC<ConnectWalletProps> = (props: ConnectWalletProps) => {
  const { onConnect, setRequirements, metrics, ...rest } = props;
  const { connect } = useConnectorGamestop();
  const onConnectGamestop =
    metrics?.events?.connect?.handlers.onConnectGamestop;

  const handleNonDefaultSetting = useCallback(() => {
    const { isGamestopInstalled, hasInjected } = helpers;
    const isNonDefault = isGamestopInstalled() && !hasInjected();
    if (isNonDefault) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "GameStop couldn't connect",
        text:
          'To connect GameStop Wallet you need to make GameStop your default wallet extension ' +
          "in the wallet's settings and reload the page.",
      });
      return true;
    }
    return false;
  }, [setRequirements]);

  const handleConflicts = useCallback(() => {
    const { hasConflicts, conflictingApps, conflictingAppsArray } =
      checkConflicts([
        CONFLICTS.Tally,
        CONFLICTS.Exodus,
        CONFLICTS.Coinbase,
        CONFLICTS.Xdefi,
        CONFLICTS.Trust,
      ]);

    if (hasConflicts) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "Gamestop couldn't connect",
        text:
          conflictingAppsArray.length > 1 ? (
            <div>
              Your browser has these extensions turned-on: <br />
              {conflictingApps} <br />
              Please, turn them off and reload the page to enable Gamestop.
            </div>
          ) : (
            `Your browser has a turned-on “${conflictingApps}” extension.` +
            ' Please, turn off this extension and reload the page to enable Gamestop.'
          ),
      });
      return true;
    }
    return false;
  }, [setRequirements]);

  const handleConnect = useCallback(async () => {
    const isNonDefault = handleNonDefaultSetting();
    if (isNonDefault) return;

    const hasConflicts = handleConflicts();
    if (hasConflicts) return;

    await connect();
    onConnect?.();
    onConnectGamestop?.();
  }, [
    connect,
    handleConflicts,
    handleNonDefaultSetting,
    onConnect,
    onConnectGamestop,
  ]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      GameStop
    </ConnectButton>
  );
};

export default ConnectGamestop;
