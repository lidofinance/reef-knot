import React, { FC, useCallback } from 'react';
import { ConnectLedgerProps } from './types';
import { ConnectButton } from '../components/ConnectButton';

export const ConnectLedger: FC<ConnectLedgerProps> = (props) => {
  const {
    onConnect,
    onBeforeConnect,
    setRequirements,
    setLedgerScreenVisible,
    shouldInvertWalletIcon,
    icon: WalletIcon,
    metrics,
    ...rest
  } = props;
  const onClickLedger = metrics?.events?.click?.handlers.onClickLedger;

  const handleConnect = useCallback(() => {
    onBeforeConnect?.();
    onClickLedger?.();

    setLedgerScreenVisible(true);
  }, [onBeforeConnect, onClickLedger, setLedgerScreenVisible]);

  return (
    <ConnectButton
      {...rest}
      icon={WalletIcon}
      shouldInvertWalletIcon={shouldInvertWalletIcon}
      onClick={handleConnect}
    >
      Ledger
    </ConnectButton>
  );
};
