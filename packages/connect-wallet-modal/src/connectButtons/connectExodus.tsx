import { FC, useCallback } from 'react';
import { useConnectorExodus, helpers } from '@lido-sdk/web3-react';
import { Link, Exodus as WalletIcon } from '@lidofinance/lido-ui';
import { CONFLICTS } from '../constants/conflictChecks';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';
import checkConflicts from './checkConflicts';

const ConnectExodus: FC<ConnectWalletProps> = (props: ConnectWalletProps) => {
  const { onConnect, setRequirements, ...rest } = props;
  const { connect } = useConnectorExodus();

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
    const calledOnMobile = await handleMobile();
    if (calledOnMobile) return;

    const hasConflicts = await handleConflicts();
    if (hasConflicts) return;

    onConnect?.();
    await connect();
  }, [connect, handleConflicts, handleMobile, onConnect]);

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
