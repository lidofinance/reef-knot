import React, { FC, useCallback } from 'react';
import { Ledger, LedgerInversion } from '@reef-knot/wallets-icons/react';
import { ConnectWalletProps } from './types';
import { ConnectButton } from '../components/ConnectButton';

const ConnectLedger: FC<ConnectWalletProps> = (props) => {
  const {
    onConnect,
    onBeforeConnect,
    setRequirements,
    setLedgerScreenVisible,
    shouldInvertWalletIcon,
    metrics,
    ...rest
  } = props;
  const onClickLedger = metrics?.events?.click?.handlers.onClickLedger;
  const WalletIcon = shouldInvertWalletIcon ? LedgerInversion : Ledger;

  const handleConnect = useCallback(() => {
    onBeforeConnect?.();
    onClickLedger?.();

    setLedgerScreenVisible(true);
  }, [onBeforeConnect, onClickLedger, setLedgerScreenVisible]);

  return (
    <ConnectButton {...rest} icon={WalletIcon} onClick={handleConnect}>
      Ledger
    </ConnectButton>
  );
};

export default ConnectLedger;
