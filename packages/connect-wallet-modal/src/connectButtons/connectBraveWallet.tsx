import { FC, useCallback } from 'react';
import { useConnectorBraveWallet, helpers } from '@lido-sdk/web3-react';
import { Brave } from '@lidofinance/lido-ui';
import { CONFLICTS } from '../constants/conflictChecks';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';
import checkConflicts from './checkConflicts';
import { checkIfBraveBrowser } from '../helpers';

const ConnectBraveWallet: FC<ConnectWalletProps> = (
  props: ConnectWalletProps,
) => {
  const { onConnect, shouldInvertWalletIcon, setRequirements, ...rest } = props;
  const { isBraveWalletProvider, isMetamaskProvider } = helpers;
  const { connect } = useConnectorBraveWallet();
  const WalletIcon = Brave;

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
  }, [WalletIcon, isBraveWalletProvider, isMetamaskProvider, setRequirements]);

  const handleConnect = useCallback(async () => {
    const hasConflicts = await handleConflicts();
    if (hasConflicts) return;

    onConnect?.();
    await connect();
  }, [handleConflicts, onConnect, connect]);

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
