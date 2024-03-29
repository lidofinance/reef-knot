import React, { ForwardedRef, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import modalRoot from './modalRoot';
import { useMergeRefs, useEscape, useLockScroll } from '../../hooks';
import { withTransition } from '../withTransition';
import { ModalOverlayInnerProps } from './types';
import {
  ModalPortalStyle,
  ModalOverflowStyle,
  ModalContentStyle,
} from './ModalOverlayStyles';
import { useModalFocus } from './useModalFocus';
import { useModalClose } from './useModalClose';

function ModalOverlay(
  props: ModalOverlayInnerProps,
  externalRef?: ForwardedRef<HTMLDivElement>,
) {
  const {
    onClose,
    onBack,
    duration,
    transitionStatus,
    clampHeightByWindow,
    stretchHeightByWindow,
    ...rest
  } = props;
  const closable = !!onClose;

  useEscape(onClose);
  useLockScroll();

  const controlRef = useModalFocus();
  const { ref: closeRef, handleClick } = useModalClose(onClose);

  const mergedRef = useMergeRefs([controlRef, closeRef, externalRef]);

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <ModalPortalStyle
      $closable={closable}
      $duration={duration}
      $transition={transitionStatus}
      onClick={handleClick}
    >
      <ModalOverflowStyle>
        <ModalContentStyle
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          ref={mergedRef}
          $transition={transitionStatus}
          $duration={duration}
          $clampHeightByWindow={clampHeightByWindow}
          $stretchHeightByWindow={stretchHeightByWindow}
          {...rest}
        />
      </ModalOverflowStyle>
    </ModalPortalStyle>,
    modalRoot,
  );
}

export default withTransition(forwardRef(ModalOverlay));
