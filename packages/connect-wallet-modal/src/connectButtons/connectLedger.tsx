import { FC, useCallback } from 'react';
import { useConnectorLedger } from '@reef-knot/web3-react';
import { LedgerCircle, LedgerCircleInversion } from '@lidofinance/lido-ui';
import { ConnectWalletProps } from './types';
import ConnectButton from './connectButton';

const ConnectLedger: FC<ConnectWalletProps> = (props) => {
  const {
    onConnect,
    setRequirements,
    shouldInvertWalletIcon,
    metrics,
    ...rest
  } = props;
  const { connect, connector } = useConnectorLedger();
  const WalletIcon = shouldInvertWalletIcon
    ? LedgerCircleInversion
    : LedgerCircle;
  const onConnectLedger = metrics?.events?.connect?.handlers.onConnectLedger;

  const handleConnect = useCallback(async () => {
    if (!connect || !connector?.isSupported()) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "Ledger couldn't connect",
        text: "Your browser doesn't support direct connection with Ledger. Please, try another browser.",
      });
      return;
    }
    await connect();
    onConnect?.();
    onConnectLedger?.();
  }, [
    connect,
    connector,
    onConnect,
    onConnectLedger,
    setRequirements,
    WalletIcon,
  ]);

  return (
    <ConnectButton
      {...rest}
      iconSrcOrReactElement={<WalletIcon />}
      onClick={handleConnect}
    >
      Ledger
    </ConnectButton>
  );
};

export default ConnectLedger;
