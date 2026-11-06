import styled, { css } from '../../utils/styledWrapper.js';
import { TransitionInnerProps } from '../withTransition';

type TransitionProps = {
  $duration: number;
  $transition: TransitionInnerProps['transitionStatus'];
  $clampHeightByWindow?: boolean;
  $stretchHeightByWindow?: boolean;
};

const getOpacity = ({ $transition }: TransitionProps) => {
  return ['exiting', 'exited'].includes($transition) ? 0 : 1;
};

export const ModalPortalStyle = styled.div<
  { $closable: boolean } & TransitionProps
>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 300;
  background: ${({ theme }) => theme.colors.overlay};
  cursor: ${({ $closable }) => ($closable ? 'pointer' : 'default')};
  transition: opacity ${({ $duration }) => $duration}ms ease;
  opacity: ${getOpacity};
`;

export const ModalOverflowStyle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  overflow: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const getTransform = ({ $transition }: TransitionProps) => {
  return ['exiting', 'exited'].includes($transition)
    ? 'translateY(6px)'
    : 'translateY(0)';
};

export const ModalContentStyle = styled.div<TransitionProps>`
  ${({ $clampHeightByWindow }) =>
    $clampHeightByWindow &&
    css`
      display: flex;
      flex-direction: column;
      flex: 0 1 auto;
      max-height: 100%;
    `}

  ${({ $stretchHeightByWindow }) =>
    $stretchHeightByWindow &&
    css`
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      height: 100%;
    `}

  box-sizing: border-box;
  max-width: 100%;
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  outline: none;
  margin: auto;
  cursor: default;
  transition: transform ${({ $duration }) => $duration}ms ease-out;
  transform: ${getTransform};
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;
