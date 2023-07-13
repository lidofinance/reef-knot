import React, { useCallback, useState } from 'react';
import { Button, Modal } from '@reef-knot/ui-react';
import { useReefKnotContext } from '@reef-knot/core-react';
import {
  WalletsModalProps,
  ButtonsCommonProps,
  RequirementsData,
} from './types';
import { Terms } from '../Terms';
import { WalletsButtonsContainer, CommonButtonsContainer } from './styles';
import { NOOP, useLocalStorage } from '../../helpers';

export function WalletsModal(props: WalletsModalProps): JSX.Element {
  const {
    onClose,
    shouldInvertWalletIcon = false,
    buttonsFullWidth = false,
    metrics,
  } = props;

  // This key can be changed to enforce all users to accept the Terms again,
  // for example if the Terms were significantly updated
  const TERMS_ACCEPTANCE_LS_KEY = 'reef-knot_accept-terms_n2';

  const [termsChecked, setTermsChecked] = useLocalStorage(
    TERMS_ACCEPTANCE_LS_KEY,
    false,
  );

  const handleTermsToggle = useCallback(() => {
    setTermsChecked((currentValue: boolean) => !currentValue);
  }, [setTermsChecked]);

  const termsProps = {
    onChange: handleTermsToggle,
    checked: termsChecked,
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

  const buttonsCommonProps: ButtonsCommonProps = {
    disabled: !termsChecked,
    onConnect: onClose,
    shouldInvertWalletIcon,
    setRequirements,
    metrics,
  };

  // pass-into function is cheap, so we're losing performance on useCallback here
  const hideRequirements = () => {
    setRequirements(false);
  };

  const handleClose = onClose || NOOP;

  const { icon: reqIcon, title: reqTitle, text: reqText } = requirementsData;

  const { ui } = useReefKnotContext();

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

    if (ui?.acceptTermsModal?.isVisible) {
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
                ui?.acceptTermsModal?.onContinue?.();
                ui?.acceptTermsModal?.setVisible(false);
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
