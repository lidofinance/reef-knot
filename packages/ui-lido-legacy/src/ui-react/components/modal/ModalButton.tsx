import React, { ForwardedRef, forwardRef } from 'react';

import { ModalButtonStyle, ModalButtonContentStyle } from './ModalButtonStyles';
import { ModalButtonIconProps } from './types';

const iconSize = {
  xxs: {
    width: '16px',
    height: '16px',
  },
  xs: {
    width: '24px',
    height: '24px',
  },
  sm: {
    width: '32px',
    height: '32px',
  },
  md: {
    width: '48px',
    height: '48px',
  },
  lg: {
    width: '64px',
    height: '64px',
  },
};

function ModalButton(
  props: ModalButtonIconProps,
  ref?: ForwardedRef<HTMLButtonElement>,
) {
  const { size = 'md', loading = false, children, icon } = props;

  const iconProps = icon.props as React.SVGProps<SVGSVGElement>;
  const AdaptiveIconProps =
    iconProps.width || iconProps.height ? iconProps : { ...iconSize[size] };
  const AdaptiveIcon = React.cloneElement(icon, AdaptiveIconProps);

  return (
    <ModalButtonStyle
      type="button"
      size={size}
      loading={loading}
      ref={ref}
      {...props}
    >
      <ModalButtonContentStyle>
        {children} {AdaptiveIcon}
      </ModalButtonContentStyle>
    </ModalButtonStyle>
  );
}

export default forwardRef(ModalButton);
