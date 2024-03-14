import React from 'react';
import { Modal } from '@reef-knot/ui-react';
import { WalletsModalProps, ButtonsCommonProps } from './types';
import { Terms, WalletModalConnectTermsProps } from '../Terms';
import { WalletsButtonsContainer } from './styles';
import { LedgerModal } from '../Ledger';
import { EagerConnectModal } from './components';
import { getWalletsButtons } from './getWalletsButtons';
import { useReefKnotModal } from '@reef-knot/core-react';

export function WalletsModal({
  children,
  ...passedDownProps
}: React.PropsWithChildren<WalletsModalProps>) {
  const {
    shouldInvertWalletIcon = false,
    buttonsFullWidth = false,
    metrics,
    termsLink,
    privacyNoticeLink,
    buttonComponentsByConnectorId,
    walletDataList,
    hiddenWallets,
  } = passedDownProps;

  const { currentModal, closeModal, forceCloseAllModals, termsChecked } =
    useReefKnotModal();

  const termsProps: WalletModalConnectTermsProps = {
    termsLink: termsLink || 'https://lido.fi/terms-of-use',
    privacyNoticeLink: privacyNoticeLink || 'https://lido.fi/privacy-notice',
    metrics,
  };

  const handleCloseSuccess = () => closeModal({ success: true });
  const handleCloseReject = () => closeModal({ success: false });
  const handleExit = () => forceCloseAllModals();

  switch (currentModal?.type) {
    case 'wallet': {
      const buttonsCommonProps: ButtonsCommonProps = {
        disabled: !termsChecked,
        onConnect: handleCloseSuccess,
        shouldInvertWalletIcon,
        metrics,
      };
      return (
        <Modal
          {...passedDownProps} // the props can be overridden by a library user
          open
          title="Connect wallet"
          center={false}
          onClose={handleCloseReject}
        >
          <Terms {...termsProps} />
          <WalletsButtonsContainer $buttonsFullWidth={buttonsFullWidth}>
            {getWalletsButtons({
              commonProps: buttonsCommonProps,
              buttonComponentsByConnectorId,
              hiddenWallets,
              walletDataList,
            })}
          </WalletsButtonsContainer>
        </Modal>
      );
    }

    case 'ledger':
      return (
        <LedgerModal
          {...passedDownProps} // the props are overridden here on purpose
          open
          onClose={handleCloseSuccess}
          onBack={handleCloseReject}
          onExited={handleExit}
          metrics={metrics}
        />
      );

    case 'eager':
      return (
        <EagerConnectModal
          tryConnecting={currentModal.props.tryConnection}
          initialError={currentModal.props.initialError}
        >
          <Terms {...termsProps} />
        </EagerConnectModal>
      );

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
          onClose={handleCloseSuccess}
          onBack={handleCloseReject}
          onExited={handleExit}
        />
      );
    }
    default:
      return null;
  }
}
