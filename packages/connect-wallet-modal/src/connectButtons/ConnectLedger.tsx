import React, { FC, useCallback } from 'react';
import { ConnectLedgerProps } from './types';
import { ConnectButtonBase } from '../components/ConnectButtonBase';
import { useReefKnotModal } from '@reef-knot/core-react';

export const ConnectLedger: FC<ConnectLedgerProps> = (props) => {
  const {
    walletId,
    darkThemeEnabled,
    icon: WalletIcon,
    onConnectStart,
    onConnectSuccess,
    ...rest
  } = props;

  const { openModalAsync } = useReefKnotModal();

  const handleConnect = useCallback(async () => {
    onConnectStart?.();
    const result = await openModalAsync({ type: 'ledger' });
    if (result.success) onConnectSuccess?.();
  }, [openModalAsync, onConnectStart, onConnectSuccess]);

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
