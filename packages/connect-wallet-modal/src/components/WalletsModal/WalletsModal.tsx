import React, { useCallback, useContext, useState, ReactElement } from 'react';
import { Button, Modal } from '@reef-knot/ui-react';
import {
  AcceptTermsModalContext,
  LS_KEY_TERMS_ACCEPTANCE,
} from '@reef-knot/core-react';
import {
  WalletsModalProps,
  ButtonsCommonProps,
  RequirementsData,
} from './types';
import { Terms } from '../Terms';
import { WalletsButtonsContainer, CommonButtonsContainer } from './styles';
import { NOOP, useLocalStorage } from '../../helpers';
import { LedgerModal } from '../Ledger';

export function WalletsModal(props: WalletsModalProps): ReactElement {
  const {
    onClose,
    shouldInvertWalletIcon = false,
    buttonsFullWidth = false,
    metrics,
    termsLink,
    privacyNoticeLink,
  } = props;

  const [termsChecked, setTermsChecked] = useLocalStorage(
    LS_KEY_TERMS_ACCEPTANCE,
    false,
  );

  const handleTermsToggle = useCallback(() => {
    setTermsChecked((currentValue: boolean) => !currentValue);
  }, [setTermsChecked]);

  const termsProps = {
    onChange: handleTermsToggle,
    checked: termsChecked,
    termsLink: termsLink || 'https://lido.fi/terms-of-use',
    privacyNoticeLink: privacyNoticeLink || 'https://lido.fi/privacy-notice',
    metrics,
  };

  const [requirementsVisible, setRequirementsVisible] = useState(false);
  const [requirementsData, setRequirementsData] = useState<RequirementsData>(
    {},
  );

  const setRequirements = useCallback(
    (isVisible: boolean, reqData: RequirementsData = {}) => {
      setRequirementsVisible(isVisible);
      setRequirementsData(reqData);
    },
    [],
  );

  // pass-into function is cheap, so we're losing performance on useCallback here
  const hideRequirements = () => {
    setRequirements(false);
  };

  const [ledgerScreenVisible, setLedgerScreenVisible] = useState(false);
  const hideLedgerScreen = () => {
    setLedgerScreenVisible(false);
  }

  const buttonsCommonProps: ButtonsCommonProps = {
    disabled: !termsChecked,
    onConnect: onClose,
    shouldInvertWalletIcon,
    setRequirements,
    setLedgerScreenVisible,
    metrics,
  };

  const handleClose = onClose || NOOP;

  const { icon: reqIcon, title: reqTitle, text: reqText } = requirementsData;

  const { acceptTermsModal } = useContext(AcceptTermsModalContext);

  // do not try to render the modal in case of SSR
  if (typeof window !== 'undefined') {
    // A conflict is detected or some other requirement must be fulfilled to connect
    if (requirementsVisible) {
      return (
        <Modal
          {...props} // the props are overridden here on purpose
          onClose={handleClose}
          onBack={hideRequirements}
          onExited={hideRequirements}
          center
          title={reqTitle}
          subtitle={reqText}
          titleIcon={reqIcon}
        />
      );
    }

    if (ledgerScreenVisible) {
      return <LedgerModal
        {...props} // the props are overridden here on purpose
        onClose={handleClose}
        onBack={hideLedgerScreen}
        onExited={hideLedgerScreen}
        metrics={buttonsCommonProps.metrics}
      />
    }

    if (acceptTermsModal?.isVisible) {
      return (
        <Modal
          {...props} // the props are overridden here on purpose
          open
          onClose={undefined} // the modal should not be closable
          title="Confirm connection"
        >
          <Terms {...termsProps} />
          <CommonButtonsContainer>
            <Button
              fullwidth
              disabled={!termsChecked}
              onClick={() => {
                acceptTermsModal?.onContinue?.();
              }}
            >
              Connect
            </Button>
          </CommonButtonsContainer>
        </Modal>
      );
    }

    // this check prevents modal blinking
    if (props.open) {
      return (
        <Modal
          title="Connect wallet"
          {...props} // the props can be overridden by a library user
          center={false}
          onClose={handleClose}
        >
          <Terms {...termsProps} />
          <WalletsButtonsContainer $buttonsFullWidth={buttonsFullWidth}>
            {props.children(buttonsCommonProps)}
          </WalletsButtonsContainer>
        </Modal>
      );
    }
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}
