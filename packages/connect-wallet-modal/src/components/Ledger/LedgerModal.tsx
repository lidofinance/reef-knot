import React, { useCallback } from 'react';
import { Modal, ModalProps } from '@reef-knot/ui-react';
import { LedgerConnectionScreen } from './LedgerConnectionScreen';
import { LedgerContextProvider } from './LedgerContext';
import { LedgerErrorScreen } from './LedgerErrorScreen';
import { useLedgerContext } from './hooks';
import { LedgerAccountScreen } from './LedgerAccountScreen';
import type { MetricsProp } from '../WalletsModal';
import { LedgerModalInnerContainer } from './styles';

export type LedgerModalProps = ModalProps & {
  metrics?: MetricsProp;
};

export const LedgerModal = (props: LedgerModalProps) => {
  const { onClose } = props;
  const handleClose = useCallback(
    (event?: any) => {
      // hack needed to prevent the Modal closing on Select
      if (!event) return;
      onClose?.();
    },
    [onClose],
  );

  return (
    <Modal title="Ledger connect" {...props} onClose={handleClose}>
      <LedgerContextProvider isActive={!!props.open}>
        <LedgerScreen {...props} />
      </LedgerContextProvider>
    </Modal>
  );
};

export const LedgerScreen = ({ metrics, onClose }: LedgerModalProps) => {
  const { error, reconnectTransport, isTransportConnected } =
    useLedgerContext();

  return (
    <LedgerModalInnerContainer>
      {error && (
        <LedgerErrorScreen
          message={error.message}
          retry={() => void reconnectTransport()}
        />
      )}
      {!error && isTransportConnected && (
        <LedgerAccountScreen metrics={metrics} closeScreen={onClose} />
      )}
      {!error && !isTransportConnected && <LedgerConnectionScreen />}
    </LedgerModalInnerContainer>
  );
};
