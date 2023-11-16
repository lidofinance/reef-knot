import React, { FC, useCallback } from 'react';
import { useConnectorMetamask } from '@reef-knot/web3-react';
import {
  MetaMaskCircle,
  MetaMaskCircleInversion,
} from '@reef-knot/wallets-icons/react';
import { CONFLICTS } from '../constants/conflictChecks';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components/ConnectButton';
import checkConflicts from '../helpers/checkConflicts';

const ConnectMetamask: FC<ConnectWalletProps> = (props: ConnectWalletProps) => {
  const {
    onConnect,
    onBeforeConnect,
    shouldInvertWalletIcon,
    setRequirements,
    metrics,
    ...rest
  } = props;
  const onConnectMetamask =
    metrics?.events?.connect?.handlers.onConnectMetamask;
  const onClickMetamask = metrics?.events?.click?.handlers.onClickMetamask;
  const { connect } = useConnectorMetamask({
    onConnect: () => {
      onConnect?.();
      onConnectMetamask?.();
    },
  });
  const WalletIcon = shouldInvertWalletIcon
    ? MetaMaskCircleInversion
    : MetaMaskCircle;

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickMetamask?.();

    const { hasConflicts, conflictingApps, conflictingAppsArray } =
      checkConflicts([
        CONFLICTS.Xdefi,
        CONFLICTS.Exodus,
        CONFLICTS.Coin98,
        CONFLICTS.MathWallet,
        CONFLICTS.Tally,
        CONFLICTS.Trust,
      ]);

    if (hasConflicts) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "MetaMask couldn't connect",
        text:
          conflictingAppsArray.length > 1 ? (
            <div>
              Your browser has these extensions turned-on: <br />
              {conflictingApps} <br />
              Please, turn them off and reload the page to enable MetaMask.
            </div>
          ) : (
            `Your browser has a turned-on “${conflictingApps}” extension.` +
            ' Please, turn off this extension and reload the page to enable MetaMask.'
          ),
      });
      return;
    }

    await connect();
  }, [connect, onBeforeConnect, onClickMetamask, setRequirements, WalletIcon]);

  return (
    <ConnectButton {...rest} icon={WalletIcon} onClick={handleConnect}>
      MetaMask
    </ConnectButton>
  );
};

export default ConnectMetamask;
