import { FC, useCallback } from 'react';
import { useConnectorWalletConnectNoLinks } from '@reef-knot/web3-react';
import { Blochainwallet, BlochainwalletInversion } from '@lidofinance/lido-ui';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';

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
  const { connect } = useConnectorWalletConnectNoLinks({
    onConnect: () => {
      onConnect?.();
      onConnectBlockchaincom?.();
    },
  });
  const WalletIcon = shouldInvertWalletIcon
    ? BlochainwalletInversion
    : Blochainwallet;

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickBlockchaincom?.();

    await connect();
  }, [connect, onBeforeConnect, onClickBlockchaincom]);

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
