import { FC, useCallback } from 'react';
import { useConnectorWalletConnect } from '@reef-knot/web3-react';
import {
  Blockchaincom,
  BlockchaincomInversion,
} from '@reef-knot/wallets-icons/react';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components/ConnectButton';

const ConnectBlockchaincom: FC<ConnectWalletProps> = (props) => {
  const {
    onConnect,
    onBeforeConnect,
    shouldInvertWalletIcon,
    metrics,
    ...rest
  } = props;
  const onConnectBlockchaincom =
    metrics?.events?.connect?.handlers.onConnectBlockchaincom;
  const onClickBlockchaincom =
    metrics?.events?.click?.handlers.onClickBlockchaincom;

  const { reconnect } = useConnectorWalletConnect({
    onConnect: () => {
      onConnect?.();
      onConnectBlockchaincom?.();
    },
    noWalletsLinks: true,
  });

  const WalletIcon = shouldInvertWalletIcon
    ? BlockchaincomInversion
    : Blockchaincom;

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickBlockchaincom?.();

    await reconnect();
  }, [reconnect, onBeforeConnect, onClickBlockchaincom]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      Blockchain.com
    </ConnectButton>
  );
};

export default ConnectBlockchaincom;
