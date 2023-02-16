import { FC, useCallback, useMemo } from 'react';
import { WalletConnect } from '@reef-knot/wallets-icons/react';
import { useConnect } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components/ConnectButton';

const ConnectWalletConnect: FC<ConnectWalletProps> = (props) => {
  const {
    onConnect,
    onBeforeConnect,
    metrics,
    walletConnectProjectId,
    wagmiChains,
    ...rest
  } = props;
  const onConnectWC = metrics?.events?.connect?.handlers.onConnectWC;
  const onClickWC = metrics?.events?.click?.handlers.onClickWC;

  const connector = useMemo(
    () =>
      new WalletConnectConnector({
        chains: wagmiChains,
        options: {
          qrcode: true,
          version: '2',
          projectId: walletConnectProjectId,
        },
      }),
    [wagmiChains, walletConnectProjectId],
  );

  const { connect } = useConnect({
    connector,
    onMutate() {
      onConnect?.();
    },
    onSuccess() {
      onConnectWC?.();
    },
  });

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickWC?.();

    await connect();
  }, [connect, onBeforeConnect, onClickWC]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletConnect />}
      onClick={handleConnect}
    >
      WalletConnect
    </ConnectButton>
  );
};

export default ConnectWalletConnect;
