import { FC, useCallback } from 'react';
import { useConnectorWalletConnectNoLinks } from '@reef-knot/web3-react';
import { Blochainwallet, BlochainwalletInversion } from '@lidofinance/lido-ui';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';

const ConnectBlockchaincom: FC<ConnectWalletProps> = (props) => {
  const { onConnect, shouldInvertWalletIcon, metrics, ...rest } = props;
  const { connect } = useConnectorWalletConnectNoLinks();
  const onConnectBlockchaincom =
    metrics?.events?.connect?.handlers.onConnectBlockchaincom;
  const WalletIcon = shouldInvertWalletIcon
    ? BlochainwalletInversion
    : Blochainwallet;

  const handleConnect = useCallback(async () => {
    await connect();
    onConnect?.();
    onConnectBlockchaincom?.();
  }, [connect, onConnect, onConnectBlockchaincom]);

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
