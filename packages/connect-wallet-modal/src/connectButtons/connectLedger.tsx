import { FC, useCallback } from 'react';
import { useConnectorLedger } from '@reef-knot/web3-react';
import { Ledger, LedgerInversion } from '@reef-knot/wallets-icons/react';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components';

const ConnectLedger: FC<ConnectWalletProps> = (props) => {
  const {
    onConnect,
    onBeforeConnect,
    setRequirements,
    shouldInvertWalletIcon,
    metrics,
    ...rest
  } = props;
  const onConnectLedger = metrics?.events?.connect?.handlers.onConnectLedger;
  const onClickLedger = metrics?.events?.click?.handlers.onClickLedger;
  const { connect, connector } = useConnectorLedger({
    onConnect: () => {
      onConnect?.();
      onConnectLedger?.();
    },
  });
  const WalletIcon = shouldInvertWalletIcon ? LedgerInversion : Ledger;

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickLedger?.();

    if (!connect || !connector?.isSupported()) {
      setRequirements(true, {
        icon: <WalletIcon />,
        title: "Ledger couldn't connect",
        text: "Your browser doesn't support direct connection with Ledger. Please, try another browser.",
      });
      return;
    }
    await connect();
  }, [
    onBeforeConnect,
    onClickLedger,
    connect,
    connector,
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
