import { FC, useCallback } from 'react';
import { useConnectorExodus, helpers } from '@reef-knot/web3-react';
import { Link } from '@reef-knot/ui-react';
import { Exodus as WalletIcon } from '@reef-knot/wallets-icons/react';
import { CONFLICTS } from '../constants/conflictChecks';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components/ConnectButton';
import checkConflicts from '../helpers/checkConflicts';

const ConnectExodus: FC<ConnectWalletProps> = (props: ConnectWalletProps) => {
  const { onConnect, onBeforeConnect, setRequirements, metrics, ...rest } =
    props;
  const onConnectExodus = metrics?.events?.connect?.handlers.onConnectExodus;
  const onClickExodus = metrics?.events?.click?.handlers.onClickExodus;
  const { connect } = useConnectorExodus({
    onConnect: () => {
      onConnect?.();
      onConnectExodus?.();
    },
  });

  const handleMobile = useCallback(async () => {
    const { isMobileOrTablet } = helpers;
    if (isMobileOrTablet) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "Exodus couldn't connect on mobile",
        text: (
          <div>
            Follow the{' '}
            <Link
              href="https://support.exodus.com/article/1777-walletconnect#connect"
              target="_blank"
              rel="noreferrer"
            >
              guide
            </Link>{' '}
            to connect your Exodus wallet via mobile app.
          </div>
        ),
      });
      return true;
    }
    return false;
  }, [setRequirements]);

  const handleConflicts = useCallback(async () => {
    const { hasConflicts, conflictingApps, conflictingAppsArray } =
      checkConflicts([CONFLICTS.Tally]);

    if (hasConflicts) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "Exodus couldn't connect",
        text:
          conflictingAppsArray.length > 1 ? (
            <div>
              Your browser has these extensions turned-on: <br />
              {conflictingApps} <br />
              Please, turn them off and reload the page to enable Exodus.
            </div>
          ) : (
            `Your browser has a turned-on “${conflictingApps}” extension.` +
            ' Please, turn off this extension and reload the page to enable Exodus.'
          ),
      });
      return true;
    }
    return false;
  }, [setRequirements]);

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickExodus?.();

    const calledOnMobile = await handleMobile();
    if (calledOnMobile) return;

    const hasConflicts = await handleConflicts();
    if (hasConflicts) return;

    await connect();
  }, [connect, handleConflicts, handleMobile, onBeforeConnect, onClickExodus]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      Exodus
    </ConnectButton>
  );
};

export default ConnectExodus;
