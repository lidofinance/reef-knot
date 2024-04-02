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

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    onClickLedger?.();
    const result = await openModalAsync({ type: 'ledger' });
    if (result.success) onConnect?.();
  }, [onBeforeConnect, onClickLedger, openModalAsync, onConnect]);

  return (
    <ConnectButton
      {...rest}
      icon={WalletIcon}
      shouldInvertWalletIcon={shouldInvertWalletIcon}
      onClick={() => {
        void handleConnect();
      }}
    >
      Ledger
    </ConnectButton>
  );
};
