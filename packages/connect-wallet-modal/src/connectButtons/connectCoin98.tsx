import { FC, useCallback } from 'react';
import { useConnectorCoin98 } from '@reef-knot/web3-react';
import { Coin98 } from '@reef-knot/wallets-icons/react';
import { CONFLICTS } from '../constants/conflictChecks';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components/ConnectButton';
import checkConflicts from '../helpers/checkConflicts';

const ConnectCoin98: FC<ConnectWalletProps> = (props: ConnectWalletProps) => {
  const { onConnect, onBeforeConnect, setRequirements, metrics, ...rest } =
    props;
  const onConnectCoin98 = metrics?.events?.connect?.handlers.onConnectCoin98;
  const onClickCoin98 = metrics?.events?.click?.handlers.onClickCoin98;

  const { connect } = useConnectorCoin98({
    onConnect: () => {
      onConnect?.();
      onConnectCoin98?.();
    },
  });

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickCoin98?.();

    const { hasConflicts, conflictingApps, conflictingAppsArray } =
      checkConflicts([
        CONFLICTS.MathWallet,
        CONFLICTS.Tally,
        CONFLICTS.Exodus,
        CONFLICTS.Gamestop,
        CONFLICTS.Xdefi,
        CONFLICTS.Trust,
      ]);

    if (hasConflicts) {
      setRequirements(true, {
        icon: <Coin98 />,
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

    await connect();
  }, [connect, onBeforeConnect, onClickCoin98, setRequirements]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<Coin98 />}
      onClick={handleConnect}
    >
      Coin98
    </ConnectButton>
  );
};

export default ConnectCoin98;
