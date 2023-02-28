import { FC, useCallback } from 'react';
import { useConnectorOperaWallet } from '@reef-knot/web3-react';
import { OperaWallet as WalletIcon } from '@reef-knot/wallets-icons/react';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components';

const ConnectOperaWallet: FC<ConnectWalletProps> = (
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
  const onConnectOperaWallet =
    metrics?.events?.connect?.handlers.onConnectOperaWallet;
  const onClickOperaWallet =
    metrics?.events?.click?.handlers.onClickOperaWallet;
  const { connect } = useConnectorOperaWallet({
    onConnect: () => {
      onConnect?.();
      onConnectOperaWallet?.();
    },
  });

  // As of August 2022, Opera Crypto Browser has very few wallets in their extensions store.
  // It allows to install wallets from Chrome extensions store, but doesn't allow them to modify `window.ethereum`.
  // Looks like no need to handle wallets conflicts right now.
  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickOperaWallet?.();

    await connect();
  }, [onBeforeConnect, onClickOperaWallet, connect]);

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
