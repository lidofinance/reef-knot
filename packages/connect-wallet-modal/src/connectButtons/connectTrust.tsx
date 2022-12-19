import { FC, useCallback } from 'react';
import { useConnectorTrust } from '@reef-knot/web3-react';
import { Trust as WalletIcon } from '@reef-knot/wallets-icons/react';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';
import checkConflicts from './checkConflicts';
import { CONFLICTS } from '../constants/conflictChecks';

const ConnectTrust: FC<ConnectWalletProps> = (props) => {
  const { onConnect, onBeforeConnect, setRequirements, metrics, ...rest } =
    props;
  const onConnectTrust = metrics?.events?.connect?.handlers.onConnectTrust;
  const onClickTrust = metrics?.events?.click?.handlers.onClickTrust;
  const { connect } = useConnectorTrust({
    onConnect: () => {
      onConnect?.();
      onConnectTrust?.();
    },
  });

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickTrust?.();

    const { hasConflicts, conflictingApps, conflictingAppsArray } =
      checkConflicts([CONFLICTS.Tally, CONFLICTS.Exodus]);

    if (hasConflicts) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "Trust Wallet couldn't connect",
        text:
          conflictingAppsArray.length > 1 ? (
            <div>
              Your browser has these extensions turned-on: <br />
              {conflictingApps} <br />
              Please, turn them off and reload the page to enable Trust Wallet.
            </div>
          ) : (
            `Your browser has a turned-on “${conflictingApps}” extension.` +
            ' Please, turn off this extension and reload the page to enable Trust Wallet.'
          ),
      });
      return;
    }

    if (!connect) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "Trust Wallet couldn't connect",
      });
      return;
    }

    await connect();
  }, [connect, onBeforeConnect, onClickTrust, setRequirements]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      Trust Wallet
    </ConnectButton>
  );
};

export default ConnectTrust;
