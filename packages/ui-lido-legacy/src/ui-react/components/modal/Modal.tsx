import React, { ForwardedRef, forwardRef } from 'react';

import {
  ModalStyle,
  ModalBaseStyle,
  ModalHeaderStyle,
  ModalTitleStyle,
  ModalTitleIconStyle,
  ModalTitleTextStyle,
  ModalCloseStyle,
  ModalContentStyle,
  ModalBackStyle,
  ModalSubtitleStyle,
} from './ModalStyles';
import { ModalProps } from './types';
import ModalOverlay from './ModalOverlay';

function Modal(props: ModalProps, ref?: ForwardedRef<HTMLDivElement>) {
  const {
    children,
    title,
    titleIcon,
    subtitle,
    center = false,
    extra,
    open,
    widthClamp,
    omitContentStyle,
    clampHeightByWindow,
    stretchHeightByWindow,
    ...rest
  } = props;
  const { onClose, onBack } = props;

  const withTitleIcon = !!titleIcon;
  const withSubtitle = !!subtitle;
  const withCloseButton = !!onClose;
  const withBackButton = !!onBack;

  const modalHeader = (
    <ModalHeaderStyle $short={!title}>
      {withBackButton && (
        <ModalBackStyle onClick={onBack} aria-label="Go back" />
      )}
      <ModalTitleStyle
        $center={center}
        $withTitleIcon={withTitleIcon}
        $withCloseButton={withCloseButton}
        $withBackButton={withBackButton}
      >
        {withTitleIcon && (
          <ModalTitleIconStyle $center={center}>
            {titleIcon}
          </ModalTitleIconStyle>
        )}
        <ModalTitleTextStyle>{title}</ModalTitleTextStyle>
      </ModalTitleStyle>
      {withCloseButton && (
        <ModalCloseStyle onClick={onClose} aria-label="Close" />
      )}
    </ModalHeaderStyle>
  );

  return (
    <ModalOverlay
      in={open}
      {...rest}
      ref={ref}
      clampHeightByWindow={clampHeightByWindow}
      stretchHeightByWindow={stretchHeightByWindow}
    >
      <ModalStyle
        $center={center}
        $width={widthClamp}
        $clampHeightByWindow={clampHeightByWindow}
        $stretchHeightByWindow={stretchHeightByWindow}
      >
        <ModalBaseStyle
          $clampHeightByWindow={clampHeightByWindow}
          $stretchHeightByWindow={stretchHeightByWindow}
        >
          {modalHeader}
          {withSubtitle && <ModalSubtitleStyle>{subtitle}</ModalSubtitleStyle>}
          {omitContentStyle ? (
            children
          ) : (
            <ModalContentStyle>{children}</ModalContentStyle>
          )}
        </ModalBaseStyle>
        {extra}
      </ModalStyle>
    </ModalOverlay>
  );
}

export default forwardRef(Modal);
