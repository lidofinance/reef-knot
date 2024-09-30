import React, { useMemo } from 'react';
import { Modal } from '@reef-knot/ui-react';
import { useReefKnotModal } from '@reef-knot/core-react';
import { ReefKnotWalletsModalProps } from './types';
import { Terms, WalletModalConnectTermsProps } from '../Terms';
import { LedgerModal } from '../Ledger';
import { EagerConnectModal } from '../EagerConnectModal';
import { ConnectWalletModal } from '../ConnectWalletModal';

const TERMS_LINK_DEFAULT = 'https://lido.fi/terms-of-use';
const PRIVACY_NOTICE_LINK_DEFAULT = 'https://lido.fi/privacy-notice';

export function ReefKnotWalletsModal<I extends string = string>(
  props: ReefKnotWalletsModalProps<I>,
) {
  const {
    metrics,
    termsLink = TERMS_LINK_DEFAULT,
    privacyNoticeLink = PRIVACY_NOTICE_LINK_DEFAULT,
    ...passedDownProps
  } = props;

  const { currentModal, closeModal, forceCloseAllModals } = useReefKnotModal();

  const termsProps: WalletModalConnectTermsProps = useMemo(
    () => ({
      termsLink,
      privacyNoticeLink,
      metrics,
    }),
    [termsLink, privacyNoticeLink, metrics],
  );

  const onCloseSuccess = () => closeModal({ success: true });
  const onCloseReject = () => closeModal({ success: false });
  const onExit = () => forceCloseAllModals();

  switch (currentModal?.type) {
    case 'wallet': {
      return (
        <ConnectWalletModal
          {...props}
          termsProps={termsProps}
          onCloseSuccess={onCloseSuccess}
          onCloseReject={onCloseReject}
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