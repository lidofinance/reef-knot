import { FC, useCallback } from 'react';
import { useConnectorOperaWallet } from '@reef-knot/web3-react';
import { OperaWallet } from '@lidofinance/lido-ui';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';

const ConnectOperaWallet: FC<ConnectWalletProps> = (
  props: ConnectWalletProps,
) => {
  const { onConnect, shouldInvertWalletIcon, setRequirements, ...rest } = props;
  const { connect } = useConnectorOperaWallet();
  const WalletIcon = OperaWallet;

  // As of August 2022, Opera Crypto Browser has very few wallets in their extensions store.
  // It allows to install wallets from Chrome extensions store, but doesn't allow them to modify `window.ethereum`.
  // Looks like no need to handle wallets conflicts right now.
  const handleConnect = useCallback(async () => {
    onConnect?.();
    await connect();
  }, [onConnect, connect]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      Opera
    </ConnectButton>
  );
};

export default ConnectOperaWallet;
