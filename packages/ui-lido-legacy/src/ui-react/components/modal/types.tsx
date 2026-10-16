import React from 'react';
import {
  TransitionWrapperProps,
  TransitionInnerProps,
} from '../withTransition';
import { ButtonProps } from '../button';
import { CommonComponentProps } from '../../utils';

export type ModalOverlayOwnProps = CommonComponentProps<
  'div',
  {
    onClose?: () => void;
    onBack?: () => void;
  }
>;

export type ModalOverlayProps = ModalOverlayOwnProps & TransitionWrapperProps;
export type ModalOverlayInnerProps = ModalOverlayOwnProps &
  TransitionInnerProps & {
    clampHeightByWindow?: boolean;
    stretchHeightByWindow?: boolean;
  };

export type ModalProps = {
  title?: React.ReactNode;
  titleIcon?: React.ReactNode;
  subtitle?: React.ReactNode;
  extra?: React.ReactNode;
  center?: boolean;
  open?: boolean;
  omitContentStyle?: boolean;
  widthClamp?: number;
  clampHeightByWindow?: boolean;
  stretchHeightByWindow?: boolean;
} & Omit<ModalOverlayProps, 'title' | 'in'>;

export type ModalExtraProps = CommonComponentProps<'div'>;

export type ModalButtonIconProps = {
  icon: React.ReactElement;
} & ButtonProps;
