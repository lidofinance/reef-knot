import React, { useCallback } from 'react';
import { Modal, ModalProps } from '@reef-knot/ui-react';
import { LedgerConnectionScreen } from './LedgerConnectionScreen';
import { LedgerContextProvider } from './LedgerContext';
import { LedgerErrorScreen } from './LedgerErrorScreen';
import { useLedgerContext } from './hooks';
import { LedgerAccountScreen } from './LedgerAccountScreen';
import { LedgerModalInnerContainer } from './styles';

export type LedgerModalProps = ModalProps & {
  onCloseSuccess?: () => void;
  onCloseReject?: () => void;
};

export const LedgerModal = ({
  onCloseSuccess,
  onCloseReject,
  ...props
}: LedgerModalProps) => {
  const handleClose = useCallback(
    (event?: any) => {
      // hack needed to prevent the Modal closing on Select
      if (!event) return;
      onCloseReject?.();
    },
    [onCloseReject],
  );

  return (
    <Modal title="Ledger connect" {...props} onClose={handleClose}>
      <LedgerContextProvider isActive={!!props.open}>
        <LedgerScreen
          onCloseSuccess={onCloseSuccess}
          onCloseReject={onCloseReject}
          {...props}
        />
      </LedgerContextProvider>
    </Modal>
  );
};

export const LedgerScreen = ({ onCloseSuccess }: LedgerModalProps) => {
  const {
    error,
    reconnectTransport,
    isTransportConnected,
    isUserActivationRequired,
  } = useLedgerContext();

  const handleClickRetry = useCallback(() => {
    void reconnectTransport();
  }, [reconnectTransport]);

  return (
    <LedgerModalInnerContainer>
      {error && (
        <LedgerErrorScreen
          message={error.message}
          onClickRetry={handleClickRetry}
        />
      )}
      {!error && isTransportConnected && (
        <LedgerAccountScreen onConnectSuccess={onCloseSuccess} />
      )}
      {!error && !isTransportConnected && (
        <LedgerConnectionScreen
          showConnectButton={isUserActivationRequired}
          onClickConnect={handleClickRetry}
        />
      )}
    </LedgerModalInnerContainer>
  );
};
