import React from 'react';
import { Modal } from '@reef-knot/ui-react';
import { useReefKnotModal } from '@reef-knot/core-react';
import type { ReefKnotWalletsModalProps } from '@reef-knot/types';
import { LedgerModal } from '../Ledger';
import { EagerConnectModal } from '../EagerConnectModal';
import { ConnectWalletModal } from '../ConnectWalletModal';

export function ReefKnotWalletsModal<I extends string = string>(
  props: ReefKnotWalletsModalProps<I>,
) {
  const { config } = props;
  const { currentModal, closeModal, forceCloseAllModals } = useReefKnotModal();
  const onCloseSuccess = () => closeModal({ success: true });
  const onCloseReject = () => closeModal({ success: false });
  const onExit = () => forceCloseAllModals();

  switch (currentModal?.type) {
    case 'wallet': {
      return (
        <ConnectWalletModal
          {...props}
          onCloseSuccess={onCloseSuccess}
          onCloseReject={onCloseReject}
        />
      );
    }

    case 'ledger':
      return (
        <LedgerModal
          {...props} // the props are overridden here on purpose
          open
          onCloseSuccess={onCloseSuccess}
          onCloseReject={onCloseReject}
          onBack={onCloseReject}
          onExited={onExit}
        />
      );

    case 'eager': {
      const { tryConnection, initialError } = currentModal.props;
      return (
        <EagerConnectModal
          config={config}
          tryConnection={tryConnection}
          initialError={initialError}
        />
      );
    }

    case 'requirements': {
      const { icon: titleIcon, title, text: subtitle } = currentModal.props;
      return (
        <Modal
          {...props} // the props are overridden here on purpose
          open
          center
          title={title}
          subtitle={subtitle}
          titleIcon={titleIcon}
          onClose={onCloseSuccess}
          onBack={onCloseReject}
          onExited={onExit}
        />
      );
    }
    default:
      return null;
  }
}
