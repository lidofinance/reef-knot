import React, { FC, useCallback } from 'react';
import { ConnectLedgerProps } from './types';
import { ConnectButtonBase } from '../components/ConnectButtonBase';
import { useReefKnotModal } from '@reef-knot/core-react';

export const ConnectLedger: FC<ConnectLedgerProps> = (props) => {
  const {
    walletId,
    onConnect,
    onBeforeConnect,
    darkThemeEnabled,
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
