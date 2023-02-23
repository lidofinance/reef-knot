import { FC, useCallback } from 'react';
import { useConnectorBraveWallet, helpers } from '@reef-knot/web3-react';
import { Brave as WalletIcon } from '@reef-knot/wallets-icons/react';
import { CONFLICTS } from '../constants/conflictChecks';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components';
import checkConflicts from '../helpers/checkConflicts';
import { checkIfBraveBrowser } from '../helpers';

const ConnectBraveWallet: FC<ConnectWalletProps> = (
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
  const { isBraveWalletProvider, isMetamaskProvider } = helpers;
  const onConnectBrave = metrics?.events?.connect?.handlers.onConnectBrave;
  const onClickBrave = metrics?.events?.click?.handlers.onClickBrave;
  const { connect } = useConnectorBraveWallet({
    onConnect: () => {
      onConnect?.();
      onConnectBrave?.();
    },
  });

  const handleConflicts = useCallback(async () => {
    // Since the Brave Wallet is built into the Brave Browser and available only there,
    // there is no sense to check conflicts if user's browser is not Brave.
    if (await checkIfBraveBrowser()) {
      let conflictsCheckResult = checkConflicts([
        CONFLICTS.Coin98,
        CONFLICTS.MathWallet,
        CONFLICTS.Tally,
        CONFLICTS.Exodus,
        CONFLICTS.Gamestop,
        CONFLICTS.Xdefi,
        CONFLICTS.Trust,
        CONFLICTS.Frontier,
      ]);

      // If no other conflicts were found, then also check for a conflict with MetaMask
      if (!conflictsCheckResult.hasConflicts) {
        conflictsCheckResult = checkConflicts([
          [() => !isBraveWalletProvider() && isMetamaskProvider(), 'MetaMask'],
        ]);
      }

      const { hasConflicts, conflictingApps, conflictingAppsArray } =
        conflictsCheckResult;

      if (hasConflicts) {
        setRequirements(true, {
          icon: <WalletIcon />,
          title: "Brave Wallet couldn't connect",
          text:
            conflictingAppsArray.length > 1 ? (
              <div>
                Your browser has these extensions turned-on: <br />
                {conflictingApps} <br />
                Please, turn them off and reload the page to enable Brave
                Wallet.
              </div>
            ) : (
              `Your browser has a turned-on “${conflictingApps}” extension.` +
              ' Please, turn off this extension and reload the page to enable Brave Wallet.'
            ),
        });
        return true;
      }
    }
    return false;
  }, [isBraveWalletProvider, isMetamaskProvider, setRequirements]);

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickBrave?.();

    const hasConflicts = await handleConflicts();
    if (hasConflicts) return;

    await connect();
  }, [onBeforeConnect, onClickBrave, handleConflicts, connect]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      Brave
    </ConnectButton>
  );
};

export default ConnectBraveWallet;
