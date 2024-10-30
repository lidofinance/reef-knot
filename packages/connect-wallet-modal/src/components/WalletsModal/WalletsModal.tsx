import React from 'react';
import { Modal } from '@reef-knot/ui-react';
import { WalletsModalProps } from './types';
import { Terms, WalletModalConnectTermsProps } from '../Terms';
import { LedgerModal } from '../Ledger';
import { EagerConnectModal } from './components/EagerConnectModal';
import { ConnectWalletModal } from './components/ConnectWalletModal';
import { useReefKnotModal } from '@reef-knot/core-react';

export function WalletsModal({
  children,
  ...props
}: React.PropsWithChildren<WalletsModalProps>) {
  const { metrics, termsLink, privacyNoticeLink } = props;
  const { onClickWalletsLess, onClickWalletsMore, ...passedDownProps } = props;

  const { currentModal, closeModal, forceCloseAllModals } = useReefKnotModal();

  const termsProps: WalletModalConnectTermsProps = {
    termsLink: termsLink || 'https://lido.fi/terms-of-use',
    privacyNoticeLink: privacyNoticeLink || 'https://lido.fi/privacy-notice',
    metrics,
  };

  const onCloseSuccess = () => closeModal({ success: true });
  const onCloseReject = () => closeModal({ success: false });
  const onExit = () => forceCloseAllModals();

  switch (currentModal?.type) {
    case 'wallet': {
      return (
        <ConnectWalletModal
          {...passedDownProps}
          termsProps={termsProps}
          onCloseSuccess={onCloseSuccess}
          onCloseReject={onCloseReject}
          onClickWalletsLess={onClickWalletsLess}
          onClickWalletsMore={onClickWalletsMore}
        />
      );
    }

    case 'ledger':
      return (
        <LedgerModal
          {...passedDownProps} // the props are overridden here on purpose
          open
          onClose={onCloseSuccess}
          onBack={onCloseReject}
          onExited={onExit}
          metrics={metrics}
        />
      );

    case 'eager': {
      const { tryConnection, initialError } = currentModal.props;
      return (
        <EagerConnectModal
          tryConnection={tryConnection}
          initialError={initialError}
        >
          <Terms {...termsProps} />
        </EagerConnectModal>
      );
    }

    case 'requirements': {
      const { icon: titleIcon, title, text: subtitle } = currentModal.props;
      return (
        <Modal
          {...passedDownProps} // the props are overridden here on purpose
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
