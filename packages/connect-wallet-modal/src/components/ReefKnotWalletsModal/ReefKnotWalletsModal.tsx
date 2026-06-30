import React from 'react';
import { Modal } from '@reef-knot/ui-react';
import { useReefKnotModal } from '@reef-knot/core-react';
import type { ReefKnotWalletsModalProps } from '@reef-knot/types';
import { LedgerModal } from '../Ledger';
import { EagerConnectModal } from '../EagerConnectModal';
import { ConnectWalletModal } from '../ConnectWalletModal';
import { EIP6963WalletsList } from '../EIP6963WalletsList';

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
          widthClamp={480}
          onClose={onCloseSuccess}
          onBack={onCloseReject}
          onExited={onExit}
        />
      );
    }

    case 'eip6963': {
      const { providers, onSelect } = currentModal.props;
      return (
        <Modal
          open
          title="Connect wallet"
          center={false}
          omitContentStyle
          widthClamp={660}
          onClose={onCloseSuccess}
          onBack={onCloseReject}
          onExited={onExit}
        >
          <EIP6963WalletsList
            config={config}
            providers={providers}
            onSelect={onSelect}
          />
        </Modal>
      );
    }

    default:
      return null;
  }
}
