import { FC, useCallback } from 'react';
import { useConnectorFrontier } from '@reef-knot/web3-react';
import { Frontier as WalletIcon } from '@reef-knot/wallets-icons/react';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components';
import checkConflicts from '../helpers/checkConflicts';
import { CONFLICTS } from '../constants/conflictChecks';

const connectFrontier: FC<ConnectWalletProps> = (props) => {
  const { onConnect, onBeforeConnect, setRequirements, metrics, ...rest } =
    props;
  const onConnectFrontier = metrics?.events?.connect?.handlers.onConnectFrontier;
  const onClickFrontier = metrics?.events?.click?.handlers.onClickFrontier;
  const { connect } = useConnectorFrontier({
    onConnect: () => {
      onConnect?.();
      onConnectFrontier?.();
    },
  });

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickFrontier?.();

    const { hasConflicts, conflictingApps, conflictingAppsArray } =
      checkConflicts([CONFLICTS.Tally, CONFLICTS.Exodus, CONFLICTS.Trust]);

    if (hasConflicts) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "Frontier Wallet couldn't connect",
        text:
          conflictingAppsArray.length > 1 ? (
            <div>
              Your browser has these extensions turned-on: <br />
              {conflictingApps} <br />
              Please, turn them off and reload the page to enable Frontier Wallet.
            </div>
          ) : (
            `Your browser has a turned-on “${conflictingApps}” extension.` +
            'Please, turn off this extension and reload the page to enable Frontier Wallet.'
          ),
      });
      return;
    }

    if (!connect) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "Frontier Wallet couldn't connect",
      });
      return;
    }

    await connect();
  }, [connect, onBeforeConnect, onClickFrontier, setRequirements]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      Frontier Wallet
    </ConnectButton>
  );
};

export default connectFrontier;
