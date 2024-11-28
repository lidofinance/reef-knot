import React, { FC, useCallback } from 'react';
import { ConnectLedgerProps } from './types';
import { ConnectButtonBase } from '../components/ConnectButtonBase';
import { useReefKnotModal } from '@reef-knot/core-react';

export const ConnectLedger: FC<ConnectLedgerProps> = (props) => {
  const {
    walletId,
    onConnect,
    darkThemeEnabled,
    icon: WalletIcon,
    metrics,
    ...rest
  } = props;

  const { openModalAsync } = useReefKnotModal();
  const metricsOnClick = metrics?.events?.click?.handlers[walletId];
  const metricsOnConnect = metrics?.events?.connect?.handlers[walletId];

  const handleConnect = useCallback(async () => {
    metricsOnClick?.();
    const result = await openModalAsync({ type: 'ledger' });
    if (result.success) {
      onConnect?.();
      metricsOnConnect?.();
    }
  }, [openModalAsync, onConnect, metricsOnClick, metricsOnConnect]);

  return (
    <ConnectButtonBase
      {...rest}
      icon={WalletIcon}
      darkThemeEnabled={darkThemeEnabled}
      onClick={() => {
        void handleConnect();
      }}
    >
      Ledger
    </ConnectButtonBase>
  );
};
