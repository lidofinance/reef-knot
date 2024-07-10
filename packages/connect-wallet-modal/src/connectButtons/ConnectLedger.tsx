import React, { FC, useCallback } from 'react';
import { ConnectLedgerProps } from './types';
import { ConnectButton } from '../components/ConnectButton';
import { useReefKnotModal } from '@reef-knot/core-react';

export const ConnectLedger: FC<ConnectLedgerProps> = (props) => {
  const {
    walletId,
    onConnect,
    onBeforeConnect,
    shouldInvertWalletIcon,
    icon: WalletIcon,
    metrics,
    ...rest
  } = props;

  const { openModalAsync } = useReefKnotModal();
  const metricsOnClick = metrics?.events?.click?.handlers[walletId];

  const handleConnect = useCallback(async () => {
    onBeforeConnect?.();
    metricsOnClick?.();
    const result = await openModalAsync({ type: 'ledger' });
    if (result.success) onConnect?.();
  }, [onBeforeConnect, openModalAsync, onConnect, metricsOnClick]);

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
