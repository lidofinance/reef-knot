import React, { FC, useCallback } from 'react';
import { ConnectLedgerProps } from './types';
import { ConnectButton } from '../components/ConnectButton';
import { useReefKnotModal } from '@reef-knot/core-react';

export const ConnectLedger: FC<ConnectLedgerProps> = (props) => {
  const {
    onConnect,
    onBeforeConnect,
    shouldInvertWalletIcon,
    icon: WalletIcon,
    metrics,
    ...rest
  } = props;

  const { openModalAsync } = useReefKnotModal();
  const onClickLedger = metrics?.events?.click?.handlers.onClickLedger;

  const handleConnect = useCallback(() => {
    onBeforeConnect?.();
    onClickLedger?.();

    return openModalAsync({ type: 'ledger' });
  }, [onBeforeConnect, onClickLedger, openModalAsync]);

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
