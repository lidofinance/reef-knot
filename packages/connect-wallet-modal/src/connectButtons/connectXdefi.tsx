import React, { FC, useCallback } from 'react';
import { useConnectorXdefi } from '@reef-knot/web3-react';
import { XDEFI as WalletIcon } from '@reef-knot/wallets-icons/react';
import { CONFLICTS } from '../constants/conflictChecks';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components/ConnectButton';
import checkConflicts from '../helpers/checkConflicts';

const ConnectXdefi: FC<ConnectWalletProps> = (props: ConnectWalletProps) => {
  const { onConnect, onBeforeConnect, setRequirements, metrics, ...rest } =
    props;
  const onConnectXdefi = metrics?.events?.connect?.handlers.onConnectXdefi;
  const onClickXdefi = metrics?.events?.click?.handlers.onClickXdefi;
  const { connect } = useConnectorXdefi({
    onConnect: () => {
      onConnect?.();
      onConnectXdefi?.();
    },
  });

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickXdefi?.();

    const { hasConflicts, conflictingApps, conflictingAppsArray } =
      checkConflicts([CONFLICTS.Exodus, CONFLICTS.Tally, CONFLICTS.Trust]);

    if (hasConflicts) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "XDEFI couldn't connect",
        text:
          conflictingAppsArray.length > 1 ? (
            <div>
              Your browser has these extensions turned-on: <br />
              {conflictingApps} <br />
              Please, turn them off and reload the page to enable XDEFI.
            </div>
          ) : (
            `Your browser has a turned-on “${conflictingApps}” extension.` +
            ' Please, turn off this extension and reload the page to enable XDEFI.'
          ),
      });
      return;
    }

    await connect();
  }, [connect, onBeforeConnect, onClickXdefi, setRequirements]);

  return (
    <ConnectButton {...rest} icon={WalletIcon} onClick={handleConnect}>
      XDEFI
    </ConnectButton>
  );
};

export default ConnectXdefi;
